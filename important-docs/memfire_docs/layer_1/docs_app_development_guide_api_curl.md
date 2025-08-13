# 使用cURL工具访问数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/api/curl/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

Table of Contents

# 使用cURL工具访问数据

除了API方式外，MemFire Cloud在线文档提供cURL命令来访问云数据库中的数据~

备注说明：cURL是一个命令行工具（客户端（Client）URL工具），通过指定的URL来上传或下载数据，并将数据展示出来。cURL功能非常强大，熟练的话可以取代Postman 这一类的图形界面工具。

## 前置条件 [*link*](#%e5%89%8d%e7%bd%ae%e6%9d%a1%e4%bb%b6)

① 注册MemFire Cloud账号；

② 存在已创建好的应用；

③ 完成建表操作，且有写入数据；

## 操作步骤 [*link*](#%e6%93%8d%e4%bd%9c%e6%ad%a5%e9%aa%a4)

### 1.使用API文档 [*link*](#1%e4%bd%bf%e7%94%a8api%e6%96%87%e6%a1%a3)

在**我的应用**管理页面，点击具体应用，进入应用详情页面，点击左侧菜单栏“API文档”。选中所有数据表中的“employees”，右侧点击"Bash"栏，应用API key选择“公开(anno)”, 则会出现上图所示的该数据表的专属文档。

![](../../../img/curl-1.png)

### 2.访问数据 [*link*](#2%e8%ae%bf%e9%97%ae%e6%95%b0%e6%8d%ae)

打开Bash编译器，复制上图中的读取所有行数据命令，粘贴到编译器里，回车即可查询employees数据表的所有数据。

![](../../../img/curl-2.png)

---

[*navigate\_before* 使用Postman访问数据](/docs/app/development_guide/api/postman/)

[开始使用 *navigate\_next*](/docs/app/development_guide/api/securing-your-api/)