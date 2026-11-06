import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const staticJsonRoute = /^\/(?:employees(?:\/\d+(?:\/(?:projects|tasks))?)?|departments(?:\/\d+)?|projects(?:\/\d+)?|tasks(?:\/\d+)?|locations(?:\/\d+)?|roles(?:\/\d+)?|scott\/(?:employees|departments))\/?$/u;

function staticJsonRoutes() {
  const middleware = async (request, response, next) => {
    const requestUrl = new URL(request.url ?? '/', 'http://localhost');
    const pathname = requestUrl.pathname;

    if (!staticJsonRoute.test(pathname)) {
      next();
      return;
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (request.method === 'OPTIONS') {
      response.statusCode = 204;
      response.end();
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.setHeader('Allow', 'GET, HEAD, OPTIONS');
      response.statusCode = 405;
      response.end();
      return;
    }

    const routePath = pathname.replace(/^\/+|\/+$/gu, '');
    const filePath = resolve(projectRoot, 'public', routePath, 'index.html');

    try {
      const body = await readFile(filePath);
      response.statusCode = 200;
      response.setHeader('Cache-Control', 'public, max-age=300');
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      if (error.code === 'ENOENT') {
        response.statusCode = 404;
        response.end(JSON.stringify({ error: 'JSON resource not found.' }));
        return;
      }

      next(error);
    }
  };

  return {
    name: 'static-json-routes',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repositoryName && !repositoryName.endsWith('.github.io')
  ? `/${repositoryName}/`
  : '/';

export default defineConfig({
  base,
  plugins: [staticJsonRoutes(), react()],
});
