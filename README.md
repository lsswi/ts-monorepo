# ts-monorepo

> **pnpm-workspace + nx + changeset**
> 
> - pnpm-workspace管理多包之间的workspace，保证包之间的引用在本地而非远程
> - changeset 管理版本变更，包和包之间的版本管理
> - nx 发布构建和编排

<br>

## 目录结构
```
tree -L 4 -I "node_modules"
.
├── package.json
├── packages
│   ├── core
│   │   ├── dist
│   │   │   ├── index.d.ts
│   │   │   └── index.js
│   │   ├── package.json
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── tsconfig.tsbuildinfo
│   └── utils
│       ├── dist
│       │   ├── index.d.ts
│       │   └── index.js
│       ├── package.json
│       ├── src
│       │   └── index.ts
│       └── tsconfig.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── tsconfig.json
```

<br>


## 基础配置

1. 根目录 `pnpm-workspace.yml` ，**让pnpm识别所有子包为工作区包，支持`workspace:*` 依赖**

```yaml
packages:
  - 'packages/*'
```
<br>

2. 依赖包的`package.json` 声明本地包依赖，**让pnpm解析为本地包（非远程npm包），保证运行时能找到**

```json
  "dependencies": {
    "@ts-monorepo/utils": "workspace:*"  
  }
```
<br>

3. ts路径映射，根目录的`tsconfig.json` 配置baseUrl和paths，**让 TS 把 `@xxx/yyy` 映射到实际源码路径，解决 “找不到模块” 编译错误**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@ts-monorepo/*": ["packages/*/src"]
    }
  },
  "references": [{ "path": "./packages/utils" }, { "path": "./packages/core" }]
}
```
<br>

4. 根目录`tsconfig.json` 配置模块解析，**匹配 ESM 模块规则，正确解析包名导入（和子包 `type: module` 对应）**

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
  },
}
```
<br>

5. 声明项目组合模式，被依赖包声明`composite: true` ，**标记为 “可被引用的 TS 项目”，生成类型缓存，让 TS 识别其类型**

```json
{
  "compilerOptions": {
    "composite": true  // 支持 TS 项目引用
  },
}
```
<br>

6. 项目引用，依赖包的`tsconfig.json`配置references，**强制 TS 先解析被依赖包的类型，保证类型依赖顺序，避免类型缺失**

```json
{
  "references": [{ "path": "../utils" }],  // 声明依赖 utils
}
```

<br>


## changeset 使用流程

1. 改完代码后，执行`pnpm changeset`进入命令行交互，选择对应的子包修改并创建提交内容；如果A包依赖B包，仅需更新B包即可，A包后面会自动更新依赖B的版本号。
```shell
pnpm changeset

🦋  Which packages would you like to include? · @ts-monorepo/utils
🦋  Which packages should have a major bump? · No items were selected
🦋  Which packages should have a minor bump? · @ts-monorepo/utils
🦋  Please enter a summary for this change (this will be in the changelogs).
🦋    (submit empty line to open external editor)
🦋  Summary · feat: add ddd feature
🦋  
🦋  === Summary of changesets ===
🦋  minor:  @ts-monorepo/utils
🦋  
🦋  Note: All dependents of these packages that will be incompatible with the new version will be patch bumped when this changeset is applied.
🦋  
🦋  Is this your desired changeset? (Y/n) · true
🦋  Changeset added! - you can now commit it
🦋  
🦋  If you want to modify or expand on the changeset summary, you can find it here
🦋  info /Users/joyyieli/Codes/personal/ts-monorepo/.changeset/grumpy-dogs-battle.md

```
执行完后会在.changeset 下会生成对应的.md文件。
```
---
'@ts-monorepo/utils': minor
---

feat: add ccc
```
<br>

2. 提交代码和`.changeset`下面生成的.md文件并提交CR完成合入`master`分支。
<br>

3. 发布的时候切出发布分支，如`realease/v0.17`，执行`pnpm changeset version`自动完成版本更新和.md文件的删除，然后合回`master`分支。
<br>

4. 对release分支针对不同的包打tag，即多个包用同一个commit打对应的tag
```shell
# -a 标签名，-m 备注信息
git tag -a utils@1.0.1 -m "utils v1.0.1"
git tag -a core@2.0.1 -m "core v2.0.1"

git tag

git push origin --tags
```

