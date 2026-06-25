export type ShaderUniformValue = number | [number, number] | [number, number, number];

export interface ShaderDefinition {
  id: string;
  name: string;
  description: string;
  fragment: string;
  vertex?: string;
  frameworkAgnostic: true;
  defaultUniforms?: Record<string, ShaderUniformValue>;
}

export interface ShaderBackgroundOptions {
  shader: string | ShaderDefinition;
  dpr?: number;
}

export interface ShaderBackgroundInstance {
  canvas: HTMLCanvasElement;
  shader: ShaderDefinition;
  destroy: () => void;
}
