# ts-monorepo

> **pnpm-workspace + nx + changeset**
> 
> - pnpm-workspace管理多包之间的workspace，保证包之间的引用在本地而非远程
> - changeset 管理版本变更，包和包之间的版本管理
> - nx 发布构建和编排

<br>


## 基础配置

1. 根目录 `pnpm-workspace.yml` ，**让pnpm识别所有子包为工作区包，支持`workspace:*` 依赖**

```yaml
packages:
  - 'packages/*'
```

2. 依赖包的`package.json` 声明本地包依赖，**让pnpm解析为本地包（非远程npm包），保证运行时能找到**

```json
  "dependencies": {
    "@ts-monorepo/utils": "workspace:*"  
  }
```

3. ts路径映射，根目录的`tsconfig.json` 配置baseUrl和paths，**让 TS 把 `@xxx/yyy` 映射到实际源码路径，解决 “找不到模块” 编译错误**

```json
{
  "compilerOptions": {
    ...
    "baseUrl": ".",
    "paths": {
      "@ts-monorepo/*": ["packages/*/src"]
    }
  },
  ...
  "references": [{ "path": "./packages/utils" }, { "path": "./packages/core" }]
}
```

4. 根目录`tsconfig.json` 配置模块解析，**匹配 ESM 模块规则，正确解析包名导入（和子包 `type: module` 对应）**

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
		...
  },
	...
}
```

5. 声明项目组合模式，被依赖包声明`composite: true` ，**标记为 “可被引用的 TS 项目”，生成类型缓存，让 TS 识别其类型**

```json
{
  "compilerOptions": {
		...
    "composite": true  // 支持 TS 项目引用
  },
}
```

6. 项目引用，依赖包的`tsconfig.json`配置references，**强制 TS 先解析被依赖包的类型，保证类型依赖顺序，避免类型缺失**

```json
{
	...
  "references": [{ "path": "../utils" }],  // 声明依赖 utils
}
```
