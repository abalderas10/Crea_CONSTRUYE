import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El linter se corre aparte (npm run lint); no bloquea el build mientras
  // afinamos la config de ESLint flat para Next 15.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
