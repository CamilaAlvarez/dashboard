import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import reactRefresh from "eslint-plugin-react-refresh";
import _import from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/.eslintrc.cjs", "**/*.config.*js", "src/components/ui/*", ".storybook/**", "dist/*"],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
    "plugin:prettier/recommended",
)), {
    plugins: {
        "react-refresh": reactRefresh,
        import: fixupPluginRules(_import),
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },

            requireConfigFile: false,
            project: ["./tsconfig.app.json", "./tsconfig.node.json"],
            tsconfigRootDir: __dirname,
        }
    },

    settings: {
        react: {
            version: "detect",
        },

        "import/extensions": [".js", ".jsx", ".ts", ".tsx"],

        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },

        "import/resolver": {
            webpack: {
                config: {
                    resolve: {
                        alias: {
                            "@": path.join(__dirname, 'src/'),
                        },

                        extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs"],
                    },
                },
            },
        },
    },

    rules: {
        eqeqeq: "error",
        "@typescript-eslint/consistent-type-imports": "error",

        "no-console": ["error", {
            allow: ["error"],
        }],

        "import/no-duplicates": ["error"],

        "no-magic-numbers": ["error", {
            detectObjects: false,
            ignore: [-1, 0, 1, 2],
            ignoreArrayIndexes: true,
            ignoreDefaultValues: true,
        }],

        "no-shadow": "off",

        "no-underscore-dangle": ["error", {
            allow: ["__typename"],
        }],

        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-inferrable-types": "warn",

        "@typescript-eslint/no-shadow": ["warn", {
            ignoreTypeValueShadow: true,
        }],

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
        }],

        "import/extensions": ["error", "ignorePackages", {
            js: "never",
            jsx: "never",
            ts: "never",
            tsx: "never",
        }],

        "import/no-extraneous-dependencies": ["error", {
            devDependencies: [
                "**/*{.,_}{test,spec}.{ts,tsx}",
                ".storybook/**",
                "src/stories/**",
                "**/*.stories*",
            ],
        }],

        "import/order": ["error", {
            groups: [["builtin", "external"], "internal", "parent", ["index", "sibling"]],
            "newlines-between": "always-and-inside-groups",
        }],

        "import/prefer-default-export": "off",
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react/destructuring-assignment": "off",

        "react/jsx-filename-extension": ["error", {
            extensions: [".tsx"],
        }],

        "react/jsx-key": ["error", {
            checkFragmentShorthand: true,
        }],

        "react/jsx-props-no-spreading": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/require-default-props": "off",
        curly: "error",
    },
}];
