module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
    overrides: [
        {
            files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
            extends: ['plugin:testing-library/react'],
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        'import/extensions': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'import/no-unresolved': ['off'],
        'import/prefer-default-export': ['off'],
        'no-return-assign': ['error', 'except-parens'],
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'max-classes-per-file': 'off',
    },
};
