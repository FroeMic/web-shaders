import { afterEach, describe, expect, it, vi } from "vitest";
import { createShaderBackground } from "../src";

const originalGetContext = HTMLCanvasElement.prototype.getContext;

afterEach(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  vi.restoreAllMocks();
});

describe("createShaderBackground", () => {
  it("configures a canvas for a shader preset and cleans up animation state", () => {
    const canvas = document.createElement("canvas");
    const cancelAnimationFrame = vi
      .spyOn(window, "cancelAnimationFrame")
      .mockImplementation(() => undefined);
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(42);
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
      toJSON: () => ({}),
    });

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);

    const instance = createShaderBackground(canvas, {
      shader: "orange-expo",
      dpr: 1.5,
    });

    expect(canvas.width).toBe(1200);
    expect(canvas.height).toBe(900);
    expect(canvas.dataset.shaderBackground).toBe("orange-expo");

    instance.destroy();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
    expect(canvas.dataset.shaderBackground).toBeUndefined();
  });
});
