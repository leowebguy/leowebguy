import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                window: "readonly",
                document: "readonly",
                grecaptcha: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                URLSearchParams: "readonly",
                process: "readonly",
                __dirname: "readonly"
            }
        },
        rules: {
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "no-console": "off"
        }
    }
];
