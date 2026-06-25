import { describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { ShaderBackground } from "../src/react";

describe("ShaderBackground", () => {
  it("renders a labelled canvas wrapper with the requested preset", () => {
    const host = document.createElement("div");
    const root = createRoot(host);
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);

    act(() => {
      root.render(
        <ShaderBackground shader="orange-expo" aria-label="Orange shader" />,
      );
    });

    expect(host.querySelector("[data-shader-background-root]")).toBeTruthy();
    expect(host.querySelector("canvas")?.getAttribute("aria-label")).toBe(
      "Orange shader",
    );

    act(() => {
      root.unmount();
    });
  });
});
