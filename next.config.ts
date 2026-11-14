import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Embedded Postgres for local dev ships its own WASM; load it from node_modules as-is.
  serverExternalPackages: ["@electric-sql/pglite"],
  async redirects() {
    // Sign-up and sign-in are one page now.
    return [{ source: "/signup", destination: "/login", permanent: true }];
  },
};

export default nextConfig;
