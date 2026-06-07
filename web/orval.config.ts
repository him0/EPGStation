import { defineConfig } from 'orval'

// EPGStation サーバーの /api/docs から取得した OpenAPI 定義を入力に、
// fetch ベースの TanStack Query hooks を生成する。
// 仕様の更新: サーバー起動中に
//   curl http://localhost:8890/api/docs -o openapi.json
// で openapi.json を更新してから `pnpm gen:api` を実行する。
export default defineConfig({
  epg: {
    input: {
      target: './openapi.json',
    },
    output: {
      mode: 'single',
      target: './src/api/generated/endpoints.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: '/api',
      clean: true,
      prettier: false,
      override: {
        query: {
          useQuery: true,
        },
      },
    },
  },
})
