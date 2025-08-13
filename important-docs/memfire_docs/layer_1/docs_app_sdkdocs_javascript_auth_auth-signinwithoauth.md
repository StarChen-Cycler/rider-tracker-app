# signInWithOAuth() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth/auth-signinwithoauth/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

案例教程

# signInWithOAuth()

通过第三方服务商登录现有的用户。

* 该方法用于使用第三方服务商进行登录。
* MemFire Cloud支持许多不同的[第三方服务商](/docs/app/development_guide/auth/auth/)。

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （借助第三方服务商登陆） [*link*](#%e6%a1%88%e4%be%8b1-%e5%80%9f%e5%8a%a9%e7%ac%ac%e4%b8%89%e6%96%b9%e6%9c%8d%e5%8a%a1%e5%95%86%e7%99%bb%e9%99%86)

```
const { data, error } = await supabase.auth.signInWithOAuth({
provider: 'github'
})
```

### 案例2 （使用带有重定向的第三方服务商登录） [*link*](#%e6%a1%88%e4%be%8b2-%e4%bd%bf%e7%94%a8%e5%b8%a6%e6%9c%89%e9%87%8d%e5%ae%9a%e5%90%91%e7%9a%84%e7%ac%ac%e4%b8%89%e6%96%b9%e6%9c%8d%e5%8a%a1%e5%95%86%e7%99%bb%e5%bd%95)

```
const { data, error } = await supabase.auth.signInWithOAuth({
provider: 'github',
options: {
  redirectTo: 'https://example.com/welcome'
}
})
```

当第三方服务商成功验证用户后，服务商将用户重定向到`redirectTo`参数指定的URL。默认情况下，该参数为`SITE_URL`。调用此方法后不会立即重定向用户。

请查看[重定向URL和通配符](/docs/app/development_guide/auth/auth/)以向您的项目添加其他重定向URL。

### 案例3 （带有作用域(scopes)的登录） [*link*](#%e6%a1%88%e4%be%8b3-%e5%b8%a6%e6%9c%89%e4%bd%9c%e7%94%a8%e5%9f%9fscopes%e7%9a%84%e7%99%bb%e5%bd%95)

```
const { data, error } = await supabase.auth.signInWithOAuth({
provider: 'github',
options: {
  scopes: 'repo gist notifications'
}
})
const oAuthToken = data.session.provider_token // use to access provider API
```

如果你需要从OAuth服务商获取附加数据，你可以在请求中包含一个以空格分隔的作用域（scopes）列表，以获得OAuth服务商令牌。

根据服务商的不同，你可能还需要在服务商的OAuth应用程序设置中指定这些作用域。作用域的列表将由你正在使用的第三方服务商记录，并且指定作用域将使你能够使用OAuth服务商令牌调用第三方服务商支持的其他API，以获取更多信息。

## 参数说明 [*link*](#%e5%8f%82%e6%95%b0%e8%af%b4%e6%98%8e)

* #### credentials [必要参数] `SignInWithOAuthCredentials`

  ##### 特性

  + #### 提供者（provider） [必要参数] `Provider类型`

    GoTrue支持的供应商之一。
  + #### 选项（option） [可选参数] `object类型`

    ##### 特性

    - #### queryParams [可选参数] `object类型`

      一个查询参数的对象
    - #### redirectTo [可选参数] `string类型`

      一个在用户被确认后发送给他们的URL。
    - #### scopes [可选参数] `string类型`

      以空格分隔的授予OAuth应用程序的作用域列表。
    - #### skipBrowserRedirect [可选参数] `boolean类型`

      如果设置为true，不会立即重定向当前浏览器上下文以访问提供商的OAuth授权页面。

---

[*navigate\_before* signInWithOtp()](/docs/app/sdkdocs/javascript/auth/auth-signinwithotp/)

[signOut() *navigate\_next*](/docs/app/sdkdocs/javascript/auth/auth-signout/)