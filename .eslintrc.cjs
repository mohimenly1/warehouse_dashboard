/* eslint-env node */
/* eslint-disable */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: false,
    env: {
        node: false
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier'],
    parserOptions: {
        ecmaVersion: 'latest'
    }
};
