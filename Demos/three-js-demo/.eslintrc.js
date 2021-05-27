// see https://zhuanlan.zhihu.com/p/62401626
module.exports = {
    parser: '@typescript-eslint/parser', // 解析器
    extends: ['plugin:@typescript-eslint/recommended', 'react-app'], // 继承的规则 [扩展]
    plugins: ['@typescript-eslint', 'react'], // 插件
    rules: {
        'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
        'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-var-requires': 1,
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-unused-vars': 0,
    }, // 规则
};
