### 環境準備

1. Search node.js in google, and choose LTS version, then install
2. Use "node --version" to check installed version
3. Install extention module "Code Runner" in VS Code

### 網站概念

1. Static Website:HTML, CSS, JavaScript
2. Dynamic Website: User > Server >ServerSide Script > Database
   > PHP : only for web programming
   > Node.js + Express + MongoDB : java script compatiable
   > Java : other platform, ex: phone app
   > Ruby on Rails
   > Python (Diango) : other platform, ex: ML, DL
   > .NET
3. IP / DNS / Port:
   > IP: IPV4(2^32(42 億):210.59.230.150), IPV6(2^128)
   > DNS
   > Port:80(http),20(ftp),53(dns),443(https)

### Node.JS 名詞

1. module wrapper: every js will become a function

### Node.JS 設計概念

1. if there are too many modules, you can use folder

### Node.JS 指令

```
__filename: console.log(__filename);
__dirname:  console.log(__dirname);
exports: module.exports.hello_fun = hello_fun;
require: let try_fun = require("./try_fun");

```
