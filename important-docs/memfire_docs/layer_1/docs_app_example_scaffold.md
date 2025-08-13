# 前端框架的脚手架 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/example/scaffold/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

以下是不同前端框架的项目代码(按需下载)

# 前端框架的脚手架

MemFire Cloud提供了全面的前端框架的脚手架，包括`vue`/`react`/uni-app微信小程序/taro微信小程序/微信原生小程序。脚手架的功能和页面包括登录注册、个人中心、备忘录、聊天室、文件管理中心，也分别代表了MemFire Cloud不同的特性，其中包括用户认证、自动生成API、实时数据库、对象存储。

脚手架提供一套基础的MemFire Cloud项目结构和配置，旨在以加快和简化项目的开发过程，不仅可以帮助用户快速启动项目、规范开发流程，集成常用工具和底层框架，并具有一定的定制性和扩展性，提高开发效率和代码质量，为用户提供全面的服务。

## 以下是不同前端框架的项目代码(按需下载) [*link*](#%e4%bb%a5%e4%b8%8b%e6%98%af%e4%b8%8d%e5%90%8c%e5%89%8d%e7%ab%af%e6%a1%86%e6%9e%b6%e7%9a%84%e9%a1%b9%e7%9b%ae%e4%bb%a3%e7%a0%81%e6%8c%89%e9%9c%80%e4%b8%8b%e8%bd%bd)

## **React** [*link*](#react)

```
npx create-react-app --template memfire-react-template <your_project_name>
```

## **Vue** [*link*](#vue)

```
vue create --preset memfire-cloud/memfire-vue-tempalte <your_project_name>
```

## **原生微信小程序模版** [*link*](#%e5%8e%9f%e7%94%9f%e5%be%ae%e4%bf%a1%e5%b0%8f%e7%a8%8b%e5%ba%8f%e6%a8%a1%e7%89%88)

```
npx degit MemFire-Cloud/wechat-template <my-project>
```

info

若微信小程序采用微信用户认证登录的登录方式，需要在MemFire Cloud配置微信小程序登录认证，[配置方法](/docs/app/development_guide/auth/authentication/wechatauth/)

## **uni-app微信小程序模版** [*link*](#uni-app%e5%be%ae%e4%bf%a1%e5%b0%8f%e7%a8%8b%e5%ba%8f%e6%a8%a1%e7%89%88)

```
npx degit MemFire-Cloud/uni-app-template <my-project>
```

info

若微信小程序采用微信用户认证登录的登录方式，需要在MemFire Cloud配置微信小程序登录认证，[配置方法](/docs/app/development_guide/auth/authentication/wechatauth/)

## **taro微信小程序模版** [*link*](#taro%e5%be%ae%e4%bf%a1%e5%b0%8f%e7%a8%8b%e5%ba%8f%e6%a8%a1%e7%89%88)

```
npx degit MemFire-Cloud/memfire-taro-template <my-project>
```

info

若微信小程序采用微信用户认证登录的登录方式，需要在MemFire Cloud配置微信小程序登录认证，[配置方法](/docs/app/development_guide/auth/authentication/wechatauth/)

根据项目的readme文件里的提示，在[MemFire Cloud](https://memfiredb.com/)创建应用后，将提供的sql脚本在该应用的SQL执行器里执行。

再将应用的`anon_key`和`URL`添加到对应项目的`supabaseClient.js`文件里，最后查看项目是否有`node_modules`包管理器文件夹，如果没有就执行`npm install`，最后就可以运行项目了。

---

[*navigate\_before* from.getPublicUrl()](/docs/app/sdkdocs/wechatsdk/storage/storage-from-getpublicurl/)

[Super课表小程序 *navigate\_next*](/docs/app/example/wechat/timetable/)