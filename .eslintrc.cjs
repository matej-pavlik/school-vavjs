module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        strict: ['off'],
        'import/extensions': ['off'],
        'max-classes-per-file': ['off'],
        'no-inner-declarations': ['off'],
        'no-return-assign': ['error', 'except-parens'],
        'no-return-await': ['off'],
        'no-underscore-dangle': ['off'],
        'prefer-rest-params': ['off'],
    },
};
