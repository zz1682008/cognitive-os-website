import vinext from "vinext";
import { defineConfig } from "vite";
import { GET as robots } from "./app/robots.txt/route";
import { GET as sitemap } from "./app/sitemap.xml/route";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

export default defineConfig(() => {
  // This release is approved only for these public test destinations. Require
  // explicit public inputs before Vinext prerenders pages.
  const publicConfig = {
    NEXT_PUBLIC_SITE_URL: "https://twww.linzhaozhao.com",
    PLATFORM_ACCOUNT_CENTER_ISSUER: "https://tqy.linzhaozhao.com",
    WEBSITE_CANONICAL_ORIGIN: "https://twww.linzhaozhao.com",
  };
  for (const [key, expected] of Object.entries(publicConfig)) {
    const value = process.env[key];
    if (value !== expected && value !== `${expected}/`) {
      // Do not echo rejected input; it could contain credentials.
      throw new Error(`Static Website requires explicit ${key}=${expected}`);
    }
  }

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    // Pin page/RSC config to the validated inputs at compile time as well.
    define: Object.fromEntries(Object.entries(publicConfig).map(([key, value]) =>
      [`process.env.${key}`, JSON.stringify(value)])),
    // nginx serves only Vinext's exported dist/client files.
    plugins: [
      vinext(),
      {
        name: "website-static-metadata",
        apply: "build",
        applyToEnvironment: (environment) => environment.name === "client",
        async generateBundle() {
          // Vinext exports pages; these two GET responses are ordinary assets.
          for (const [fileName, handler] of [["robots.txt", robots], ["sitemap.xml", sitemap]] as const) {
            const response = handler(new Request(new URL(fileName, `${publicConfig.NEXT_PUBLIC_SITE_URL}/`)));
            this.emitFile({ type: "asset", fileName, source: await response.text() });
          }
        },
      },
    ],
  };
});
