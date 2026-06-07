# CLAUDE.md

このファイルは、このリポジトリで作業する際の Claude Code 向けガイドです。

## プロジェクト概要

EPGStation は Mirakurun をバックエンドに利用する DTV 録画・管理システム。

- **サーバー**: TypeScript (`src/`)。`tsc` で `dist/` にビルドして `node dist/index.js` で起動。
- **クライアント**: Vue + TypeScript (`client/`)。vue-cli でビルド。

## ツールチェーン

- **Node.js**: 24 系(`mise.toml` で `24.16.0` に固定)。`mise install` で導入。
- **パッケージマネージャー**: **pnpm**(npm ではなく pnpm を使うこと)。

このプロジェクトは元々 npm 用に作られているため、pnpm は `pnpm-workspace.yaml` で
npm 互換の挙動になるよう設定してある:

- `nodeLinker: hoisted` … `node_modules` をフラット配置にする。これがないと
  `src/@types/types.d.ts` が参照する `eventemitter3` や transitive な `@types/cors`
  などの型が解決できずビルドが壊れる。
- `allowBuilds` … `sqlite3` / `mirakurun` のネイティブビルドを許可。
- `overrides['@types/serve-static']: 1.15.7` … `@types/express`(v4)が transitive で
  express5 用の `@types/serve-static@2.x` を引き込むと `express.static.mime` の型が
  消えるため、v4 互換版に固定している。

## セットアップ

```sh
mise install            # Node 24 を導入
pnpm install            # サーバー依存をインストール
cd client && pnpm install   # クライアント依存をインストール
```

## よく使うコマンド

サーバー(リポジトリルート):

```sh
pnpm run typecheck   # 型チェックのみ (tsc --noEmit) ← 変更後は必ず実行する
pnpm run lint        # eslint --fix
pnpm run format      # prettier --check --write
pnpm run compile     # tsc で dist/ に出力
pnpm run build       # build-server (lint + format + compile) → build-client
pnpm start           # node dist/index.js
```

クライアント(`client/`):

```sh
pnpm run build       # 本番ビルド(型チェック込み)
pnpm run lint
```

## 重要: 変更後の確認

TypeScript のコードを編集したら、**コミット前に必ず型チェックを通すこと**。

```sh
pnpm run typecheck
```

`pnpm run build-server` は `lint` → `format` → `compile` の順に走るため、まとめて
確認したい場合はこちらでもよい。型エラーが 1 件でもあればビルドは失敗する。

## アーキテクチャ

```
src/
  index.ts            エントリーポイント
  model/              ビジネスロジック(operator: 録画系 / service: API・配信系 など)
  db/                 TypeORM のエンティティ・マイグレーション
  lib/ util/          共通処理
  @types/types.d.ts   aribts 等の手書き型定義
client/
  src/                Vue アプリ(components / views / model / util)
```

DB マイグレーションは `pnpm run orm-gen` / `pnpm run orm-run`(`ormconfig.js` 参照)。
```
