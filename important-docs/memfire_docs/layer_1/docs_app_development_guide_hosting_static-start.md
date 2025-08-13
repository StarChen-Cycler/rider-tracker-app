# 快速开始 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/hosting/static-start/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

使用说明

# 快速开始

## 使用说明 [*link*](#%e4%bd%bf%e7%94%a8%e8%af%b4%e6%98%8e)

配置静态网站托管时，您需要指定网站的默认首页index.html。

```
├── index.html
├── error.html
├── example.txt
└── subdir/
     └── index.html
```

## 准备工作 [*link*](#%e5%87%86%e5%a4%87%e5%b7%a5%e4%bd%9c)

* 拥有MemFire Cloud账号;
* 已完成MemFire Cloud平台实名认证;
* 创建MemFire Cloud应用开发。

## 步骤1：写一个简单的HTML [*link*](#%e6%ad%a5%e9%aa%a41%e5%86%99%e4%b8%80%e4%b8%aa%e7%ae%80%e5%8d%95%e7%9a%84html)

下面我们创建一个简单的HTML文件，命名为index.html：

```
<html><head><meta charset="utf-8" /></head><body>
  Hello MemFire Cloud!
</body></html>
```

## 步骤2：打包压缩 [*link*](#%e6%ad%a5%e9%aa%a42%e6%89%93%e5%8c%85%e5%8e%8b%e7%bc%a9)

打包压缩index.html文件，其中压缩包必须为ZIP格式。  
打包方式：先进入您的代码目录，在全选所有文件以后，单击鼠标右键，选择压缩为 ZIP 包，生成代码包。或者您也可以在代码包的根目录下执行`zip -rq -y code.zip ./`命令进行打包。  
Linux，Unix的系统环境下，使用zip命令打包，不要使用tar命令；   
备注说明：公测环境下，压缩包大小不超过20MB。

## 步骤3：上传压缩包，完成部署 [*link*](#%e6%ad%a5%e9%aa%a43%e4%b8%8a%e4%bc%a0%e5%8e%8b%e7%bc%a9%e5%8c%85%e5%ae%8c%e6%88%90%e9%83%a8%e7%bd%b2)

1.登录MemFire Cloud平台，进入我的应用->某应用->静态托管页面。

![](../../../img/static1.png)

2.点击上传文件，选中网站压缩包进行上传。

![](../../../img/static2.png)

完成上传操作后，用户即可通过MemFire Cloud平台提供的**访问地址**进行访问托管的静态网站。

---

[*navigate\_before* 静态托管](/docs/app/development_guide/hosting/static-hosting/)

[自定义域名 *navigate\_next*](/docs/app/development_guide/hosting/static-domain/)