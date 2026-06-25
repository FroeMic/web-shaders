import type { ShaderDefinition } from "./types";
import { ORANGE_EXPO_SHADER_ID, orangeExpoShader } from "./shaders/orange-expo";
import { GRAINIENT_SHADER_ID, grainientShader } from "./shaders/grainient";

export { ORANGE_EXPO_SHADER_ID, GRAINIENT_SHADER_ID };

export const shaderCatalog = {
  [ORANGE_EXPO_SHADER_ID]: orangeExpoShader,
  [GRAINIENT_SHADER_ID]: grainientShader,
} as const satisfies Record<string, ShaderDefinition>;

export type ShaderCatalogId = keyof typeof shaderCatalog;

export function listShaders(): ShaderDefinition[] {
  return Object.values(shaderCatalog);
}

export function getShader(id: string): ShaderDefinition {
  const shader = shaderCatalog[id as ShaderCatalogId];

  if (!shader) {
    throw new Error(`Unknown shader: ${id}`);
  }

  return shader;
}
