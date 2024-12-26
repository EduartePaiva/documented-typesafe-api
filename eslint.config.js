import antfu from "@antfu/eslint-config";

export default antfu({
    formatters: true,
    type: "app",
    typescript: true,
    stylistic: {
        indent: 4,
        semi: true,
        quotes: "double",
    },
}, {
    rules: {
        "no-console": ["warn"],
        "antfu/no-top-level-await": ["off"],
        "node/prefer-global/process": ["off"],
        "node/no-process-env": ["error"],
        "perfectionist/sort-imports": ["error", {
            internalPattern: ["^@/.*"],
            type: "natural",
        }],
        "unicorn/filename-case": ["error", {
            case: "kebabCase",
            ignore: ["README.md"],
        }],
    },
});
