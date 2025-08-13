# 产品动态 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/announcement/history/
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

# 产品动态

本文列出了所有已发布的应用版本，按发布时间倒序呈现。

| 版本 | 发布日期 |
| --- | --- |
| [2.4.110](/docs/announcement/history/#24110) | 2024-03-15 |
| [2.4.70](/docs/announcement/history/#2470) | 2023-12-22 |
| [2.4.40](/docs/announcement/history/#2440) | 2023-08-08 |
| [2.3.23](/docs/announcement/history/#2323) | 2023-05-04 |
| [2.3.22](/docs/announcement/history/#2322) | 2023-03-18 |
| [2.2.X](/docs/announcement/history/#22x) | 2023-02-28 |
| [2.0.X](/docs/announcement/history/#20x) | 2023-01-14 |
| [1.2.X](/docs/announcement/history/#12x) | 2022-03-04 |
| [1.0.X](/docs/announcement/history/#10x) | 2021-11-09 |

## **2.4.110** [*link*](#24110)

2024年03月15日，MemFire Cloud产品的全新升级发布，此次升级带来了强大的新功能特性，包括聚合函数、物化视图、支持pgvector 0.60版本，外部数据包装器（FDW）等，同时修复了若干遗留问题。

## 物化视图 [*link*](#%e7%89%a9%e5%8c%96%e8%a7%86%e5%9b%be)

支持物化视图功能。现在可以通过PostgREST API直接、动态地使用聚合函数，对数据进行处理。

## 聚合函数 [*link*](#%e8%81%9a%e5%90%88%e5%87%bd%e6%95%b0)

支持PostgREST v12 版本，聚合函数。

## pgvector 0.6.0版本 [*link*](#pgvector-060%e7%89%88%e6%9c%ac)

兼容pgvector 0.6.0，并行索引构建速度提高10倍以上。

## **2.4.70** [*link*](#2470)

2023年12月22日，MemFire Cloud应用开发正式推出计费套餐。

### 计费套餐 [*link*](#%e8%ae%a1%e8%b4%b9%e5%a5%97%e9%a4%90)

MemFire Cloud应用开发正式推出计费套餐。采用基础套餐+按量付费的模式，开发者可先购买带有一定配额的基础套餐，超出套餐配额部分按使用量付费。

### 资源统计报表 [*link*](#%e8%b5%84%e6%ba%90%e7%bb%9f%e8%ae%a1%e6%8a%a5%e8%a1%a8)

新增资源统计报表，展示每个应用的资源消耗情况

---

## **2.4.40** [*link*](#2440)

2023年8月8日，云服务平台MemFire Cloud应用开发推出了数据库直连、数据白名单功能。

### 数据库直连 [*link*](#%e6%95%b0%e6%8d%ae%e5%ba%93%e7%9b%b4%e8%bf%9e)

全新的数据库直连功能！你可以使用任何支持 Postgres 的工具（包括但不限于Navicat）直接连接到MemFire Cloud数据库，轻松管理和查询你的数据。

## **2.3.23** [*link*](#2323)

2023年5月4日，云服务平台MemFire Cloud推出了2.3.23版本应用。

### 云函数 [*link*](#%e4%ba%91%e5%87%bd%e6%95%b0)

支持JavaScript高级编程语言，一键上传，快速体验;

平台提供多个代码模板，其中包括微信支付代码模板，实现了微信native支付和小程序支付;

统一管理云函数，可创建、更新、删除云函数；

### 定制版应用 [*link*](#%e5%ae%9a%e5%88%b6%e7%89%88%e5%ba%94%e7%94%a8)

MemFire Cloud推出了灵活、个性化的定制版应用，实现应用个性化配置，满足不同开发项目的应用场景需求;

---

## **2.3.22** [*link*](#2322)

2023年3月18日，云服务平台MemFire Cloud推出了2.3.22版本应用。

### 微信小程序登录 [*link*](#%e5%be%ae%e4%bf%a1%e5%b0%8f%e7%a8%8b%e5%ba%8f%e7%99%bb%e5%bd%95)

兼容微信小程序登录，利用微信强大的传播能力，实现快速获客，降低推广成本。

### 兼容阿里云SMS服务商 [*link*](#%e5%85%bc%e5%ae%b9%e9%98%bf%e9%87%8c%e4%ba%91sms%e6%9c%8d%e5%8a%a1%e5%95%86)

兼容阿里云的SMS服务，实现手机号+短信验证码进行身份验证。

使用MemFire Cloud作为后台，应用（APP/Web/小程序）部署上线后，用户即可采用手机号+短信的形式进行身份验证，完成注册/登录等操作。

### SQL编辑器优化 [*link*](#sql%e7%bc%96%e8%be%91%e5%99%a8%e4%bc%98%e5%8c%96)

支持新建SQL查询、删除SQL查询、重命名SQL查询操作，进一步提升用户使用体验。

---

## **2.2.X** [*link*](#22x)

2023年2月28日，云服务平台MemFire Cloud推出了2.2.X版本应用。

### 静态网站托管 [*link*](#%e9%9d%99%e6%80%81%e7%bd%91%e7%ab%99%e6%89%98%e7%ae%a1)

* 新增自定义域名绑定功能
* 一键上传，提升易用性

### 应用版本管理 [*link*](#%e5%ba%94%e7%94%a8%e7%89%88%e6%9c%ac%e7%ae%a1%e7%90%86)

新增应用升级功能，用户可手动升级应用，以便于随时体验新版本中的各种功能特性。

---

## **2.0.X** [*link*](#20x)

2023年1月14日，云服务平台MemFire Cloud推出了2.0.X版本应用。

### 实时数据库 [*link*](#%e5%ae%9e%e6%97%b6%e6%95%b0%e6%8d%ae%e5%ba%93)

MemFire Cloud推出的realtime服务可以通过侦听、广播、共享来自其他客户端/数据库的更改来创建多人互动应用, 主要特性包括：

* 侦听数据库变更： 侦听数据库插入、更新、删除以及其他变更操作；
* 保存：在各客户之间一致地存储和同步在线用户状态；
* 广播：以低延时将任务消息数据发送到订阅同一频道的任何客户端；

### 新版studio [*link*](#%e6%96%b0%e7%89%88studio)

新版本的仪表盘,用户可以通过WEB页面对数据表、对象存储、触发器、函数、扩展、realtime等功能进行管理操作，从而降低用户的使用门槛。

---

## **1.2.X** [*link*](#12x)

2022年3月4日，云服务平台MemFire Cloud推出了1.2.X版本应用。

### 静态网站托管 [*link*](#%e9%9d%99%e6%80%81%e7%bd%91%e7%ab%99%e6%89%98%e7%ae%a1-1)

* 支持一键将静态网站资源部署在云端
* 提供默认域名便于用户访问网站

---

## **1.0.X** [*link*](#10x)

2021年11月09日，云服务平台MemFire Cloud推出了1.0.X版本应用。 该版本提供“开箱即用”的后端服务，为应用开发人员全面“减负”。

### 云数据库 [*link*](#%e4%ba%91%e6%95%b0%e6%8d%ae%e5%ba%93)

* 新增表编辑器功能
* 支持自动生成数据表访问API
* 支持设置表访问权限
* 新增数据表索引管理功能，提升SQL查询效率

### 身份验证与授权 [*link*](#%e8%ba%ab%e4%bb%bd%e9%aa%8c%e8%af%81%e4%b8%8e%e6%8e%88%e6%9d%83)

* 新增注册用户管理功能
* 支持配置邮件模板
* 提供SDK与API调用

### 对象存储 [*link*](#%e5%af%b9%e8%b1%a1%e5%ad%98%e5%82%a8)

* 提供SDK与API，轻松实现文件上传，下载、访问操作
* 支持设置对象的访问权限，

---

[*navigate\_before* 【2024年01月03日】MemFire Cloud应用开发正式推出计费套餐](/docs/announcement/bulletin/bulletins/)

[介绍 *navigate\_next*](/docs/app/overview/overview/)