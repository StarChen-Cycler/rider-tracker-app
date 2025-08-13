# 管理函数 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/functions/function-management/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

**云函数支持的函数运行环境列表**

# 管理函数

本文介绍函数的属性和运行环境，以及如何通过MemFire Cloud控制台创建函数、更新函数、删除函数等操作。

## **云函数支持的函数运行环境列表** [*link*](#%e4%ba%91%e5%87%bd%e6%95%b0%e6%94%af%e6%8c%81%e7%9a%84%e5%87%bd%e6%95%b0%e8%bf%90%e8%a1%8c%e7%8e%af%e5%a2%83%e5%88%97%e8%a1%a8)

| **运行环境** | **说明** | **操作系统** | **架构** |
| --- | --- | --- | --- |
| Node.js 20 | Node.js 20版本 | Linux | x86\_64 |
| Node.js 18 | Node.js 18版本 | Linux | x86\_64 |
| Node.js 16 | Node.js 16版本 | Linux | x86\_64 |
| Node.js 14 (废弃) | Node.js 14版本 (废弃) | Linux | x86\_64 |
| Node.js 12 (废弃) | Node.js 12版本 (废弃) | Linux | x86\_64 |

## **云函数的默认配置** [*link*](#%e4%ba%91%e5%87%bd%e6%95%b0%e7%9a%84%e9%bb%98%e8%ae%a4%e9%85%8d%e7%bd%ae)

免费版的云函数默认配置：

| 运行环境 | CPU | 内存 | 磁盘 | 并发运行数 |
| --- | --- | --- | --- | --- |
| Node.js 20 | 0.2 核 | 256 MB | 512MB | 10 |

## **创建函数** [*link*](#%e5%88%9b%e5%bb%ba%e5%87%bd%e6%95%b0)

### **操作前提** [*link*](#%e6%93%8d%e4%bd%9c%e5%89%8d%e6%8f%90)

* 已创建应用

### **操作说明** [*link*](#%e6%93%8d%e4%bd%9c%e8%af%b4%e6%98%8e)

1.登录MemFire Cloud平台，进入我的应用->某应用->云函数页；

2.在云函数页面，单击**新建函数**；

3.在创建云函数弹框中，点配置以下配置项，然后单击**保存**；

* **基础信息** ：设置函数的基本信息，包括函数名称、请求处理程序。

  | **配置项** | **说明** |
  | --- | --- |
  | 函数名 | 函数名称，必填项；只能包含字母、数字、下划线；不能以数字开头，长度在 1-64 之间；同一应用下的云函数不能重名； |
  | 请求处理程序 | 即函数入口，默认为`index.handler`；在“运行环境”为 Node.js 时，当前值的格式为 [文件名].[函数名]； |
* **函数配置** ：配置函数的代码和运行环境。

  | **配置项** | **说明** |
  | --- | --- |
  | 上传代码包 | 支持ZIP包上传代码；ZIP文件大小不能超过20Mb, 且index.js必须在ZIP文件的根目录下，采用handler函数为入口函数； |
  | 运行环境 | 目前MemFire Cloud云函数仅支持JavaScript语言，支持的运行环境包括：Node.js 20 , Node.js 18 , Node.js 16 , Node.js 14(废弃) , Node.js 12(废弃) |
  | 执行超时时间 | 设置超时时间。执行超时时间默认为60秒，最长为86400秒。建议您将此值设置为 600 秒。如果函数在这个时间内未能成功执行，函数计算会返回超时错误，请设置大小合适的超时时间，避免函数执行超时。 |
  | 访问方法 | 访问方法包括：`GET、POST、PUT、DELETE、OPTIONS、HEAD、PATCH` |
  | 函数描述 | 函数描述信息； |
* **打包方式**：先进入您的函数代码目录，在全选所有文件以后（包括 node\_modules 文件夹），单击鼠标右键，选择压缩为 ZIP 包，生成代码包。或者您也可以在代码包的根目录下执行`zip -rq -y code.zip ./`命令进行打包。Linux，Unix的系统环境下，使用zip命令打包，不要使用tar命令；
* **环境变量** ：配置函数运行环境中的环境变量。可以配置多个环境变量，详见：[环境变量](/docs//guides/functions/variable)
* **函数生命周期回调** ：配置函数实例的生命周期回调，**初始化（Initializer）函数**；

  + 在函数实例启动成功之后，运行请求处理程序（Handler）之前执行；
  + 云函数保证在一个实例生命周期内，成功且只成功执行一次Initializer回调；

    | **配置项** | **说明** |
    | --- | --- |
    | Initializer程序入口 | 在“运行环境”为 Node.js 时，当前值的格式为 [文件名].[函数名]；Initializer函数执行入口，默认为`index.Initializer`； |
    | Initializer超时时间 | 执行 Initializer 回调程序的超时时间，开启Initializer回调时为必填项，默认为3，单位秒。最小1秒，最长5分钟，即300秒；初始化函数超过这个时间后会被终止执行； |

### **上传压缩包步骤** [*link*](#%e4%b8%8a%e4%bc%a0%e5%8e%8b%e7%bc%a9%e5%8c%85%e6%ad%a5%e9%aa%a4)

1.在您的项目目录下执行`npm install '依赖包名'`安装依赖库到当前目录。

2.打包您的项目目录下所有文件。

* Linux或macOS系统
  + 进入您的项目目录,执行`zip code.zip -r./*`。
  + 说明请确保您具有该目录的读写权限。
  + Windows系统

进入您的项目目录,选中所有文件,单击鼠标右键,选择打包为ZIP包。

说明请确保您创建的`index.js`文件位于包的根目录。

备注说明：免费版应用，最多支持创建5个云函数；

## **更新函数** [*link*](#%e6%9b%b4%e6%96%b0%e5%87%bd%e6%95%b0)

### **操作前提** [*link*](#%e6%93%8d%e4%bd%9c%e5%89%8d%e6%8f%90-1)

* 已创建云函数

### **操作说明** [*link*](#%e6%93%8d%e4%bd%9c%e8%af%b4%e6%98%8e-1)

1.登录MemFire Cloud平台，进入我的应用->某应用->云函数页。

2.在云函数页面，单击目标云函数操作列的**编辑**。

3.在编辑云函数的配置页面，按需修改相应的配置项，单击**保存**。

* **函数配置** ：配置函数的代码和运行环境。
* **环境变量** ：配置函数运行环境中的环境变量，详见：[环境变量](/docs//guides/functions/variable)
* **函数生命周期回调** ：配置函数实例的生命周期回调，**初始化（Initializer）函数**；

## **删除函数** [*link*](#%e5%88%a0%e9%99%a4%e5%87%bd%e6%95%b0)

### **操作前提** [*link*](#%e6%93%8d%e4%bd%9c%e5%89%8d%e6%8f%90-2)

* 已创建云函数

### **操作说明** [*link*](#%e6%93%8d%e4%bd%9c%e8%af%b4%e6%98%8e-2)

1.登录MemFire Cloud平台，进入我的应用->某应用->云函数页；

2.在云函数页面，单击目标云函数操作列的删除；

3.在删除云函数弹框中，点击确认，则删除云函数成功，释放相关资源；

---

[*navigate\_before* 概述](/docs/app/development_guide/functions/overview/)

[代码开发 *navigate\_next*](/docs/app/development_guide/functions/code-development/)