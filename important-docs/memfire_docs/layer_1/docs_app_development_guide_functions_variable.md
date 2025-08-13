# 环境变量 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/functions/variable/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

**安全性**

# 环境变量

## **安全性** [*link*](#%e5%ae%89%e5%85%a8%e6%80%a7)

创建或者更新环境变量时，函数计算会对您的环境变量使用AES256（Advanced Encryption Standard 256）标准加密存储，在初始化函数实例时，会将环境变量解密后注入到函数实例环境中。

## **使用限制** [*link*](#%e4%bd%bf%e7%94%a8%e9%99%90%e5%88%b6)

* 字符集规则
  + Key的字符集：必须以大小写字母开头，只能包含大小写字母、数字和下划线。
  + Value的字符集：必须是可显示的ASCII字符，不能包含中文等其他字符。
* 大小限制
* 所有环境变量的大小总和不能超过4 KB。
* 应用环境变量，包括：
  + **API\_URL**：应用访问URL地址；
  + **ANON\_KEY**: Anon（公开）密钥是客户端API密钥；
  + **SERVICE\_ROLE\_KEY**: 服务端访问密钥，可以绕过任何安全策略完全访问您的数据；

## **通过控制台配置环境变量** [*link*](#%e9%80%9a%e8%bf%87%e6%8e%a7%e5%88%b6%e5%8f%b0%e9%85%8d%e7%bd%ae%e7%8e%af%e5%a2%83%e5%8f%98%e9%87%8f)

### 前提条件 [*link*](#%e5%89%8d%e6%8f%90%e6%9d%a1%e4%bb%b6)

1、存在已创建的云函数

### 操作步骤 [*link*](#%e6%93%8d%e4%bd%9c%e6%ad%a5%e9%aa%a4)

1. 登录MemFire Cloud平台，进入我的应用->某应用->云函数页。
2. 在**函数管理**页面，单击目标函数**操作**列的**编辑**。
3. 在编辑函数配置页面的**环境变量**区域，按需选择配置环境变量的方式，然后单击**保存**。

（1）单击**添加变量**。

（2）配置环境变量的键值对：

* **变量名**：自定义。
* **值**：自定义。

（3）示例如下。

![](../../../img/variable.png)

4. 验证环境变量是否创建成功。

**在代码中使用环境变量**,假设配置的环境变量为`{"key":"val"}`，以下为Node.js运行环境读取并打印此环境变量值的方法。

```
var value = process.env.keyconsole.log(value)
```

---

[*navigate\_before* 云函数本地调试](/docs/app/development_guide/functions/fn-local-test/)

[helloworld *navigate\_next*](/docs/app/development_guide/functions/functionexample/helloworld/)