import { useEffect, useRef } from "react";
import { createShaderBackground } from "./renderer";
import type { ShaderBackgroundOptions } from "./types";

export interface ShaderBackgroundProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  shader: ShaderBackgroundOptions["shader"];
  dpr?: number;
  canvasClassName?: string;
  "aria-label"?: string;
}

export function ShaderBackground({
  shader,
  dpr,
  className,
  canvasClassName,
  style,
  "aria-label": ariaLabel,
  ...props
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    const instance = createShaderBackground(canvasRef.current, { shader, dpr });
    return () => instance.destroy();
  }, [shader, dpr]);

  return (
    <div
      {...props}
      className={className}
      data-shader-background-root
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        className={canvasClassName}
        aria-label={ariaLabel}
        role={ariaLabel ? "img" : undefined}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
