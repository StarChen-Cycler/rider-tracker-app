# 自定义域名 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/hosting/static-domain/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

添加自定义域名

# 自定义域名

MemFire Cloud 静态网站托管提供了可供开发、测试使用的默认域名，在开发期间，您可以通过默认域名访问静态网站。此外，用户还可以根据业务需要，自定义网站访问域名。

## 添加自定义域名 [*link*](#%e6%b7%bb%e5%8a%a0%e8%87%aa%e5%ae%9a%e4%b9%89%e5%9f%9f%e5%90%8d)

1.登录MemFire Cloud平台，进入我的应用->某应用->静态托管页面。点击配置域名，输入新的域名，如下图所示。

![](../../../img/domin1.png)

2.单击下一步，可查看TXT域名解析记录和CNAME域名解析记录。
TXT和CNAME 域名不能直接访问，您需要在域名服务提供商处完成TXT和CNAME 配置，配置生效后，您的托管服务方可对自定义域名生效。

![](../../../img/domin2.png)

3.配置TXT和CNAME。登录域名解析服务商平台，并手动添加到您的域名解析记录中。
如果您的DNS服务商为阿里云，则可以通过以下步骤添加CNAM记录、TXT记录。

（1）单击添加记录，添加TXT域名解析记录。
![](../../../img/domin3.jpg)
（2）单击添加记录，添加CNAME域名解析记录。
![](../../../img/domin4.jpg)
4.配置完成后，再点击验证，来验证域名是否配置成功。如果验证提示成功，则可以通过自定义域名来访问静态托管网站。

---

[*navigate\_before* 快速开始](/docs/app/development_guide/hosting/static-start/)

[实名认证 *navigate\_next*](/docs/app/development_guide/hosting/real-name-authentication/)