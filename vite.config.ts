import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; 
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const supertoneApiKey = env.VITE_TTS_API_KEY?.trim();

  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        "/api/supertone/tts": {
          target: "https://supertoneapi.com",
          changeOrigin: true,
          rewrite: (requestPath) =>
            requestPath.replace(/^\/api\/supertone\/tts/, "/v1/text-to-speech"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (supertoneApiKey) {
                proxyReq.setHeader("x-sup-api-key", supertoneApiKey);
              }
            });
          },
        },
      },
    },
  };
});
