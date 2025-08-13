# 启用Captcha保护 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/auth-captcha/
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

# 启用Captcha保护

Supabase为您提供了在登录、注册和密码重置表单中添加captcha的选项。这使您的网站免受机器人和恶意脚本的攻击。Supabase身份验证支持[hCaptcha](https://www.hcaptcha.com/)。

## 注册hCaptcha [*link*](#%e6%b3%a8%e5%86%8chcaptcha)

跳转到hCaptcha网站并注册帐户。在欢迎页面上，复制**站点密钥**和**密钥**。

如果您已经注册，并且没有从欢迎页面复制此信息，则可以从设置页面获取**密钥**。

**站点密钥**可以在您创建的活动站点的**设置**中找到。

在`设置`页面中，查找**Sitekey**部分并复制密钥。

## 为Suabase项目启用hCaptcha保护 [*link*](#%e4%b8%basuabase%e9%a1%b9%e7%9b%ae%e5%90%af%e7%94%a8hcaptcha%e4%bf%9d%e6%8a%a4)

导航到**身份验证**页面，并在**安全和保护**部分下找到**启用hCaptcha保护**切换。

输入您的hCaptcha**密钥**，然后单击**保存**。

## 添加hCaptcha前端组件 [*link*](#%e6%b7%bb%e5%8a%a0hcaptcha%e5%89%8d%e7%ab%af%e7%bb%84%e4%bb%b6)

前端需要一些更改才能为用户提供屏幕上的captcha。本示例使用React和hCaptcha React组件，但hCaptch可以与任何JavaScript框架一起使用。

Install `@hcaptcha/react-hcaptcha` in your project as a dependency.

```
npm install @hcaptcha/react-hcaptcha
```

现在从`@HCaptcha/react HCaptcha`库导入`HCaptcha`组件。

```
import HCaptcha from '@hcaptcha/react-hcaptcha'
```

让我们创建一个空状态来存储`captchaToken`

```
const [captchaToken, setCaptchaToken] = useState()
```

现在让我们将HCaptcha组件添加到代码的JSX部分

```
<HCaptcha />
```

我们将把从hCaptcha网站复制的sitekey作为一个属性以及一个onVerify属性传递给它，该属性接受回调函数。此回调函数将有一个标记作为其属性之一。让我们使用`setCaptchaToken`将令牌设置为状态

```
<HCaptcha
  sitekey="your-sitekey"
  onVerify={(token) => { setCaptchaToken(token) }
/>
```

现在让我们使用我们在Supabase signUp函数中接收的captcha令牌。

```
await supabase.auth.signUp({
  email,
  password,
  options: { captchaToken },
})
```

调用上述函数后，我们还需要重置captcha挑战。

创建一个用于HCaptcha组件的引用。

```
const captcha = useRef()
```

让我们在`HCaptcha`组件上添加一个ref属性，并为其分配`captcha`常量。

```
<HCaptcha
  ref={captcha}
  sitekey="your-sitekey"
  onVerify={(token) => {
    setCaptchaToken(token)
  }}
/>
```

使用以下代码调用signUp函数后重置`captcha`：

```
captcha.current.resetCaptcha()
```

为了测试这在本地是否有效，我们需要使用类似[ngrok](https://ngrok.com/)的工具或向主机文件添加条目。您可以在[hCaptcha docs](https://docs.hcaptcha.com/#local-%E5%BC%80%E5%8F%91)中了解更多信息。

运行应用程序，现在应该会向您提供一个captcha挑战。

---

[*navigate\_before* 原生移动深度链接](/docs/app/development_guide/auth/native-mobile-deep-linking/)

[速率限制 *navigate\_next*](/docs/app/development_guide/auth/rate-limiting/)