import { describe, expect, it } from "vitest";
import {
  ORANGE_EXPO_SHADER_ID,
  getShader,
  listShaders,
  shaderCatalog,
} from "../src";

describe("shader catalog", () => {
  it("exposes the YC-inspired orange expo shader as a reusable preset", () => {
    const shader = getShader(ORANGE_EXPO_SHADER_ID);

    expect(shader).toMatchObject({
      id: "orange-expo",
      name: "Orange Expo",
      frameworkAgnostic: true,
    });
    expect(shader.fragment).toContain("u_time");
    expect(shader.fragment).toContain("u_resolution");
    expect(shader.fragment).toContain("pixelGrid");
  });

  it("returns catalog entries without allowing callers to mutate the registry", () => {
    const shaders = listShaders();

    expect(shaders).toHaveLength(Object.keys(shaderCatalog).length);
    expect(shaders.map((shader) => shader.id)).toContain(ORANGE_EXPO_SHADER_ID);
    expect(() => shaders.push(getShader(ORANGE_EXPO_SHADER_ID))).not.toThrow();
    expect(listShaders()).toHaveLength(Object.keys(shaderCatalog).length);
  });

  it("throws a useful error for unknown shader ids", () => {
    expect(() => getShader("missing")).toThrow("Unknown shader: missing");
  });
});
