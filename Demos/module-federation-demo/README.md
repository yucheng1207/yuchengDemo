# [Module Federation](https://webpack.js.org/concepts/module-federation/)

项目基于[官网示例](https://github.com/module-federation/module-federation-examples/tree/master/basic-host-remote)搭建


# Basic One-Way Example
This example demos a basic host application loading remote component.

app1 is the host application.
app2 standalone application which exposes Button component.

# Running Demo
Run yarn start. This will build and serve both app1 and app2 on ports 3001 and 3002 respectively.

- localhost:3001 (HOST)
- localhost:3002 (STANDALONE REMOTE)


## 参考资料

[Module Federation](https://webpack.js.org/concepts/module-federation/)
[ModuleFederationPlugin](https://webpack.docschina.org/plugins/module-federation-plugin/)
[官网示例](https://github.com/module-federation/module-federation-examples/tree/master/basic-host-remote)
[Module Federation 调研](https://github.com/cjh804263197/test-module-federation/wiki/Module-Federation-%E8%B0%83%E7%A0%94)
