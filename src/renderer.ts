import { getShader } from "./catalog";
import type {
  ShaderBackgroundInstance,
  ShaderBackgroundOptions,
  ShaderDefinition,
} from "./types";

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export function createShaderBackground(
  canvas: HTMLCanvasElement,
  options: ShaderBackgroundOptions,
): ShaderBackgroundInstance {
  const shader =
    typeof options.shader === "string" ? getShader(options.shader) : options.shader;
  const dpr = options.dpr ?? window.devicePixelRatio ?? 1;
  const pointer = { x: 0, y: 0 };
  let frameId = 0;
  let destroyed = false;
  let glResources: WebGlResources | null = null;

  canvas.dataset.shaderBackground = shader.id;
  sizeCanvas(canvas, dpr);

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
  });

  if (gl) {
    glResources = createWebGlResources(gl, shader);
  }

  const resize = () => {
    sizeCanvas(canvas, dpr);
  };

  const updatePointer = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) * dpr;
    pointer.y = (rect.height - (event.clientY - rect.top)) * dpr;
  };

  const clearPointer = () => {
    pointer.x = canvas.width * 0.5;
    pointer.y = canvas.height * 0.5;
  };

  const render = (time: number) => {
    if (destroyed) {
      return;
    }

    if (gl && glResources) {
      drawFrame(gl, glResources, canvas, pointer, time);
    }

    frameId = window.requestAnimationFrame(render);
  };

  clearPointer();
  canvas.addEventListener("pointermove", updatePointer);
  canvas.addEventListener("pointerleave", clearPointer);
  window.addEventListener("resize", resize);
  frameId = window.requestAnimationFrame(render);

  return {
    canvas,
    shader,
    destroy: () => {
      if (destroyed) {
        return;
      }

      destroyed = true;
      window.cancelAnimationFrame(frameId);
      canvas.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("resize", resize);
      delete canvas.dataset.shaderBackground;

      if (gl && glResources) {
        gl.deleteBuffer(glResources.buffer);
        gl.deleteProgram(glResources.program);
      }
    },
  };
}

function sizeCanvas(canvas: HTMLCanvasElement, dpr: number) {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || canvas.clientWidth || window.innerWidth || 1;
  const height = rect.height || canvas.clientHeight || window.innerHeight || 1;

  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
}

interface WebGlResources {
  program: WebGLProgram;
  buffer: WebGLBuffer;
  time: WebGLUniformLocation | null;
  resolution: WebGLUniformLocation | null;
  pointer: WebGLUniformLocation | null;
}

function createWebGlResources(
  gl: WebGLRenderingContext,
  shader: ShaderDefinition,
): WebGlResources {
  const vertexShader = compileShader(
    gl,
    gl.VERTEX_SHADER,
    shader.vertex ?? vertexShaderSource,
  );
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, shader.fragment);
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Unable to create WebGL program");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown WebGL link error";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  const buffer = gl.createBuffer();

  if (!buffer) {
    throw new Error("Unable to create WebGL buffer");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );

  const position = gl.getAttribLocation(program, "a_position");
  gl.useProgram(program);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  return {
    program,
    buffer,
    time: gl.getUniformLocation(program, "u_time"),
    resolution: gl.getUniformLocation(program, "u_resolution"),
    pointer: gl.getUniformLocation(program, "u_pointer"),
  };
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Unable to create WebGL shader");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Unknown WebGL compile error";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function drawFrame(
  gl: WebGLRenderingContext,
  resources: WebGlResources,
  canvas: HTMLCanvasElement,
  pointer: { x: number; y: number },
  time: number,
) {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.useProgram(resources.program);
  gl.uniform1f(resources.time, time * 0.001);
  gl.uniform2f(resources.resolution, canvas.width, canvas.height);
  gl.uniform2f(resources.pointer, pointer.x, pointer.y);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
