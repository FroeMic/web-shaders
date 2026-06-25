# Web Shaders

A small TypeScript repo for saving reusable WebGL shader backgrounds and using them in landing pages.

The first preset is `orange-expo`, a pixelated orange gradient inspired by the reference image you shared.

## Run It

```bash
npm install
npm run dev
```

## Use In React

```tsx
import { ShaderBackground } from "./src/react";

export function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100vh" }}>
      <ShaderBackground shader="orange-expo" />
      <h1>Your landing page</h1>
    </section>
  );
}
```

## Use Without React

```ts
import { createShaderBackground } from "./src";

const canvas = document.querySelector("canvas")!;
const shader = createShaderBackground(canvas, { shader: "orange-expo" });

// Later:
shader.destroy();
```

## Add A Shader

1. Add a file in `src/shaders/`.
2. Export a `ShaderDefinition`.
3. Register it in `src/catalog.ts`.
4. Add a focused test in `test/shader-catalog.test.ts`.

Useful search vocabulary: `GLSL pixelated dithered orange gradient WebGL background`.
