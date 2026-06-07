import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist/', 'node_modules/', 'client/', 'coverage/'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-namespace': 'off',
            // eslint v8 から本プロジェクトが採用していなかった新規ルール群は無効化する
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'no-useless-assignment': 'off',
            'preserve-caught-error': 'off',
            'no-constant-condition': 'off',
            'no-useless-escape': 'off',
            'no-async-promise-executor': 'off',
            'max-len': [
                'error',
                {
                    code: 180,
                    tabWidth: 4,
                    ignoreComments: true,
                    ignoreTrailingComments: true,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreRegExpLiterals: true,
                },
            ],
        },
    },
    prettier,
);
