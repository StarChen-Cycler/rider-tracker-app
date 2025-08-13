# 微信移动应用授权登录 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/authentication/wechatappauth/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

前言

# 微信移动应用授权登录

### 前言 [*link*](#%e5%89%8d%e8%a8%80)

为了顺应国内用户的使用习惯，MemFire Cloud认证服务已集成微信移动应用授权登录功能。微信，作为国内广受欢迎的社交平台，其微信移动应用授权登录功能以其便捷性和快速性赢得了广大用户的青睐。现在，通过MemFire Cloud，开发者可以轻松地为app应用添加微信移动应用授权登录功能，为用户提供更加流畅、安全的登录体验。

### 前提条件 [*link*](#%e5%89%8d%e6%8f%90%e6%9d%a1%e4%bb%b6)

1. 您已成功注册MemFire Cloud平台的账号，并创建了一个应用。
2. 您已成功注册微信开放平台账号。

### 配置步骤 [*link*](#%e9%85%8d%e7%bd%ae%e6%ad%a5%e9%aa%a4)

#### 1、在微信开放平台上“创建移动应用” [*link*](#1%e5%9c%a8%e5%be%ae%e4%bf%a1%e5%bc%80%e6%94%be%e5%b9%b3%e5%8f%b0%e4%b8%8a%e5%88%9b%e5%bb%ba%e7%a7%bb%e5%8a%a8%e5%ba%94%e7%94%a8)

info

首先，需要您在微信开放平台创建一个“移动应用”，待审核通过后即可获得该“移动应用”对应的AppID、AppSecret。

![](../../../../img/wechatapp1.png)

#### 2、在MemFire Cloud应用界面启用微信（移动应用）并填入相应appid信息 [*link*](#2%e5%9c%a8memfire-cloud%e5%ba%94%e7%94%a8%e7%95%8c%e9%9d%a2%e5%90%af%e7%94%a8%e5%be%ae%e4%bf%a1%e7%a7%bb%e5%8a%a8%e5%ba%94%e7%94%a8%e5%b9%b6%e5%a1%ab%e5%85%a5%e7%9b%b8%e5%ba%94appid%e4%bf%a1%e6%81%af)

![](../../../../img/wechatapp2.png)

### 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95)

#### 引入包 [*link*](#%e5%bc%95%e5%85%a5%e5%8c%85)

```
fluwx: ^3.4.2
gotrue_wechatlogin: ^2.7.2
```

fluwx是基于Flutter的微信SDK框架，并支持以下功能：

* 分享图片，文本，音乐，视频等。支持分享到会话，朋友圈以及收藏
* 微信支付
* 在微信登录时，获取Auth Code
* 拉起小程序
* 订阅消息
* 打开微信
* 从微信标签打开应用
  gotrue\_wechatlogin是MemFire Cloud基于gotrue开发用于微信认证。

### Flutter 使用教程 [*link*](#flutter-%e4%bd%bf%e7%94%a8%e6%95%99%e7%a8%8b)

#### 初始化fluwx [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96fluwx)

```
//微信登录初始化
initWXLogin() async {
  fluwx.registerWxApi(
      appId: 'wxxxxxx', //查看微信开放平台
      doOnAndroid: true,
      doOnIOS: true,
      universalLink: 'xxxxx' //查看微信开放平台
      );
}
```

#### 调用fluwx的 sendWeChatAuth 方法， 请求code [*link*](#%e8%b0%83%e7%94%a8fluwx%e7%9a%84-sendwechatauth-%e6%96%b9%e6%b3%95-%e8%af%b7%e6%b1%82code)

![](../../../../img/wechatapp3.png)

```
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text("登录")),
    body: Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(_userId ?? "还没登录"),
          FutureBuilder<bool>(
            future: fluwx.isWeChatInstalled,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return CircularProgressIndicator();  // 等待异步任务完成
              } else if (snapshot.hasError) {
                return Text("错误提示Error: ${snapshot.error}");
              } else if (snapshot.hasData && snapshot.data!) {
                // 如果安装了微信，显示微信登录按钮
                return ElevatedButton(
                  onPressed: () async {
                    bool exist = await fluwx.isWeChatInstalled;
                    if (exist) {
                      fluwx.sendWeChatAuth(
                        scope: "snsapi_userinfo",
                        state: "wechat_sdk_demo_test",
                      );
                    }
                  },
                  child: const Text("微信登录"),
                );
              } else {
                // 如果没有安装微信
                return const Text("没有安装微信，系统不显示按钮");
              }
            },
          ),
        ],
      ),
    ),
  );
}
```

#### 微信登录结果监听获取到code 后，请求signInWithWechat登录 [*link*](#%e5%be%ae%e4%bf%a1%e7%99%bb%e5%bd%95%e7%bb%93%e6%9e%9c%e7%9b%91%e5%90%ac%e8%8e%b7%e5%8f%96%e5%88%b0code-%e5%90%8e%e8%af%b7%e6%b1%82signinwithwechat%e7%99%bb%e5%bd%95)

```
// 微信登录结果监听方法
void loginWxHandler() async {
  fluwx.weChatResponseEventHandler.listen((response) async {
    if (response is fluwx.WeChatAuthResponse) {
      if (response.code != null) {
        print('wxLogin--code:${response.code}');
        final String nonNullableCode = response.code ?? ""; // 如果response.code为空，则使用空字符串代替
        setState(() {
          _code = response.code ?? "";
        });
          final auth = GoTrueClient(
            url: "xxx",
            headers: {
              'Authorization': 'Bearer xxx',
              'apikey': 'xxxx',
            },
          );
        final res = await auth.signInWithWechat(code: nonNullableCode);
        setState(() {
          _userId__ = res.user?.id;
        });

        final session = res.session;
        final user = res.user;
      } else {
        print('wx------------e$response');
        // print('wxLogin--code:${event.code}');
      }
    }else{
      print('未安装微信');
    }
  });
}
```

全部代码
main.dart

```
import 'package:flutter/material.dart';
import 'package:flutter_application_dmo1/pages/account_page.dart';
import 'package:flutter_application_dmo1/pages/login_page.dart';
import 'package:flutter_application_dmo1/pages/splash_page.dart';
import 'package:fluwx/fluwx.dart' as fluwx;

Future<void> main() {

    fluwx.registerWxApi(
        appId: 'xxx', //查看微信开放平台
        doOnAndroid: true,
        doOnIOS: true
        );

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Supabase Flutter',
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.green,
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: Colors.green,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: Colors.green,
          ),
        ),
      ),
      initialRoute: '/',
      routes: <String, WidgetBuilder>{
        '/': (_) => const SplashPage(),
        '/login': (_) => const LoginPage(),
      },
    );
  }
}
```

login\_page.dart

```
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:gotrue_wechatlogin/gotrue.dart';
import 'package:flutter_application_dmo1/main.dart';
import 'package:fluwx/fluwx.dart' as fluwx;

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _LoginPageState createState() => _LoginPageState();

}

class _LoginPageState extends State<LoginPage> {
  String? _userId;
  String? _code;
  String? _userId__;
  @override
  void initState() {
    super.initState();
    loginWxHandler(); // 在 initState 中调用微信登录结果监听方法
  }

  late final StreamSubscription _authStateSubscription;

  // 微信登录结果监听方法
  void loginWxHandler() async {
    fluwx.weChatResponseEventHandler.listen((response) async {
      if (response is fluwx.WeChatAuthResponse) {
        if (response.code != null) {
          print('wxLogin--code:${response.code}');
          final String nonNullableCode = response.code ?? ""; // 如果response.code为空，则使用空字符串代替
          setState(() {
            _code = response.code ?? "";
          });
            final auth = GoTrueClient(
              url: "https://cpeov0k8c94v6pnsqqg0.baseapi.test1.nimbleyun.com",
              headers: {
                'Authorization': 'Bearer xxx',
                'apikey': 'xxx',
              },
            );
          final res = await auth.signInWithWechat(code: nonNullableCode);
          setState(() {
            _userId__ = res.user?.id;
          });

          final session = res.session;
          final user = res.user;
        } else {
          print('wx------------e$response');
          // print('wxLogin--code:${event.code}');
        }
      }else{
        print('未安装微信');
      }
    });
  }

  @override
  void dispose() {
    _authStateSubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("登录")),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_code != null ? "code为:${_code} ;用户id为:${_userId__}": "还没登录"),
            FutureBuilder<bool>(
              future: fluwx.isWeChatInstalled,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return CircularProgressIndicator();  // 等待异步任务完成
                } else if (snapshot.hasError) {
                  return Text("错误提示Error: ${snapshot.error}");
                } else if (snapshot.hasData && snapshot.data!) {
                  // 如果安装了微信，显示微信登录按钮
                  return ElevatedButton(
                    onPressed: () async {
                      bool exist = await fluwx.isWeChatInstalled;
                      if (exist) {
                        fluwx.sendWeChatAuth(
                          scope: "snsapi_userinfo",
                          state: "wechat_sdk_demo_test",
                        );
                      }
                    },
                    child: const Text("微信登录"),
                  );
                } else {
                  // 如果没有安装微信
                  return const Text("没有安装微信，系统不显示按钮");
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
```

移动端app微信登录示例：
<https://github.com/LucaRao/wechat_app_demo>

---

[*navigate\_before* 微信小程序登录认证](/docs/app/development_guide/auth/authentication/wechatauth/)

[微信网站应用扫码登录 *navigate\_next*](/docs/app/development_guide/auth/authentication/wechatqrauth/)