# 快速入门: Flutter | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-flutter/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

第一步：在 MemFire Cloud 仪表板中

# 快速入门: Flutter

## 第一步：在 MemFire Cloud 仪表板中[创建](https://cloud.memfiredb.com/project)一个新应用。 [*link*](#%e7%ac%ac%e4%b8%80%e6%ad%a5%e5%9c%a8-memfire-cloud-%e4%bb%aa%e8%a1%a8%e6%9d%bf%e4%b8%ad%e5%88%9b%e5%bb%bahttpscloudmemfiredbcomproject%e4%b8%80%e4%b8%aa%e6%96%b0%e5%ba%94%e7%94%a8)

应用准备就绪后，进入应用，在左侧菜单->表编辑器选择 SQL 编辑器在 MemFire Cloud 数据库中创建一个表。使用以下 SQL 并自行运行。

info

在本地工作时，可以运行以下命令创建新的迁移文件：

```
supabase migration new user_management_starter
```

```
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/app/development_guide/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/app/development_guide/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/app/development_guide/storage/security/access-control#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using (auth.uid() = owner) with check (bucket_id = 'avatars');
```

## 第二步：获取 API 密钥 [*link*](#%e7%ac%ac%e4%ba%8c%e6%ad%a5%e8%8e%b7%e5%8f%96-api-%e5%af%86%e9%92%a5)

现在您已经创建了一些数据库表，可以使用自动生成的 API 插入数据了。

我们只需从 API 设置中获取项目 URL 和匿名密钥。

1、转到控制面板中的 API 设置页面。
2、在此页面上找到项目 URL、anon 和 service\_role 密钥。

## 第三步：创建 Flutter 应用 [*link*](#%e7%ac%ac%e4%b8%89%e6%ad%a5%e5%88%9b%e5%bb%ba-flutter-%e5%ba%94%e7%94%a8)

我们可以使用 flutter create 来初始化
一个名为 supabase\_quickstart 的应用程序

```
flutter create supabase_quickstart
```

## 第四步：安装 Supabase 客户端库 [*link*](#%e7%ac%ac%e5%9b%9b%e6%ad%a5%e5%ae%89%e8%a3%85-supabase-%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%93)

最快的入门方法是使用 supabase\_flutter 客户端库，它提供了一些简便的API，用于在 Flutter 应用程序中使用 Supabase。
在Flutter应用程序中打开pubspec.yaml文件，并将supabase\_flutter添加为依赖项。

```
supabase_flutter: ^2.0.0
```

运行 flutter pub get 安装依赖项。

## 第五步：设置深层链接 [*link*](#%e7%ac%ac%e4%ba%94%e6%ad%a5%e8%ae%be%e7%bd%ae%e6%b7%b1%e5%b1%82%e9%93%be%e6%8e%a5)

既然我们已经安装了依赖项，那就来设置深层链接吧。
当用户点击魔法链接登录时，需要设置深层链接才能将用户带回应用程序。
我们只需对 Flutter 应用程序稍作调整，就能设置深度链接。

我们必须使用 io.supabase.flutterquickstart 作为方案。在本例中，我们将使用 login-callback 作为深度链接的主机，但您也可以根据自己的喜好进行更改。

首先，在控制面板中添加 io.supabase.flutterquickstart://login-callback/ 作为新的重定向 URL。

以上就是 MemFire Cloud 的设置，其余的都是特定平台的设置：

编辑 ios/Runner/Info.plist 文件。

添加 CFBundleURLTypes 以启用深度链接：

```
<!-- ... other tags -->
<plist>
<dict>
<!-- ... other tags -->

<!-- Add this array for Deep Links -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>io.supabase.flutterquickstart</string>
    </array>
  </dict>
</array>
<!-- ... other tags -->
</dict>
</plist>
```

编辑 android/app/src/main/AndroidManifest.xml 文件。

添加意图过滤器以启用深度链接：

```
<manifest ...>
<!-- ... other tags -->
<application ...>
  <activity ...>
    <!-- ... other tags -->

    <!-- Add this intent-filter for Deep Links -->
    <intent-filter>
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <!-- Accepts URIs that begin with YOUR_SCHEME://YOUR_HOST -->
      <data
        android:scheme="io.supabase.flutterquickstart"
        android:host="login-callback" />
    </intent-filter>

  </activity>
</application>
</manifest>
```

主函数
既然我们已经准备好了深层链接，那就用之前复制的 API 凭据在主函数中初始化 Supabase 客户端吧。
这些变量将暴露在应用程序中，这完全没有问题，因为我们已经在数据库中启用了
我们的数据库启用了行级安全。

```
Future<void> main() async {
await Supabase.initialize(
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
);
runApp(MyApp());
}
```

## 第六步：设置闪屏 [*link*](#%e7%ac%ac%e5%85%ad%e6%ad%a5%e8%ae%be%e7%bd%ae%e9%97%aa%e5%b1%8f)

让我们创建一个闪屏，在用户打开应用程序后立即显示。
该屏幕会检索当前会话并相应地重定向用户。
lib/pages/splash\_page.dart

```
import 'package:flutter/material.dart';
import 'package:supabase_quickstart/main.dart';

class SplashPage extends StatefulWidget {
const SplashPage({super.key});

@override
_SplashPageState createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
@override
void initState() {
  super.initState();
  _redirect();
}

Future<void> _redirect() async {
  await Future.delayed(Duration.zero);
  if (!mounted) {
    return;
  }

  final session = supabase.auth.currentSession;
  if (session != null) {
    Navigator.of(context).pushReplacementNamed('/account');
  } else {
    Navigator.of(context).pushReplacementNamed('/login');
  }
}

@override
Widget build(BuildContext context) {
  return const Scaffold(
    body: Center(child: CircularProgressIndicator()),
  );
}
}
```

## 第七步：设置登录页面 [*link*](#%e7%ac%ac%e4%b8%83%e6%ad%a5%e8%ae%be%e7%bd%ae%e7%99%bb%e5%bd%95%e9%a1%b5%e9%9d%a2)

让我们创建一个 Flutter 部件来管理登录和注册。
我们将使用 Magic Links，这样用户就可以使用电子邮件登录，而无需使用密码。
请注意，该页面使用 onAuthStateChange 设置了用户认证状态的监听器。
当用户点击魔法链接回到应用程序时，将触发一个新事件，该页面可以捕捉到该事件并相应地重定向用户。
lib/pages/login\_page.dart

```
import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:supabase_quickstart/main.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _isLoading = false;
  bool _redirecting = false;
  late final TextEditingController _emailController = TextEditingController();
  late final StreamSubscription<AuthState> _authStateSubscription;

  Future<void> _signIn() async {
    try {
      setState(() {
        _isLoading = true;
      });
      await supabase.auth.signInWithOtp(
        email: _emailController.text.trim(),
        emailRedirectTo:
            kIsWeb ? null : 'io.supabase.flutterquickstart://login-callback/',
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Check your email for a login link!')),
        );
        _emailController.clear();
      }
    } on AuthException catch (error) {
      SnackBar(
        content: Text(error.message),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } catch (error) {
      SnackBar(
        content: const Text('Unexpected error occurred'),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void initState() {
    _authStateSubscription = supabase.auth.onAuthStateChange.listen((data) {
      if (_redirecting) return;
      final session = data.session;
      if (session != null) {
        _redirecting = true;
        Navigator.of(context).pushReplacementNamed('/account');
      }
    });
    super.initState();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _authStateSubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign In')),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 12),
        children: [
          const Text('Sign in via the magic link with your email below'),
          const SizedBox(height: 18),
          TextFormField(
            controller: _emailController,
            decoration: const InputDecoration(labelText: 'Email'),
          ),
          const SizedBox(height: 18),
          ElevatedButton(
            onPressed: _isLoading ? null : _signIn,
            child: Text(_isLoading ? 'Loading' : 'Send Magic Link'),
          ),
        ],
      ),
    );
  }
}
```

## 第八步：设置账户页面 [*link*](#%e7%ac%ac%e5%85%ab%e6%ad%a5%e8%ae%be%e7%bd%ae%e8%b4%a6%e6%88%b7%e9%a1%b5%e9%9d%a2)

用户登录后，我们可以让他们编辑个人资料详情并管理自己的账户。
让我们为此创建一个名为 account\_page.dart 的新部件。
lib/pages/account\_page.dart

```
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:supabase_quickstart/main.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({super.key});

  @override
  _AccountPageState createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  final _usernameController = TextEditingController();
  final _websiteController = TextEditingController();

  var _loading = true;

  /// Called once a user id is received within `onAuthenticated()`
  Future<void> _getProfile() async {
    setState(() {
      _loading = true;
    });

    try {
      final userId = supabase.auth.currentUser!.id;
      final data =
          await supabase.from('profiles').select().eq('id', userId).single();
      _usernameController.text = (data['username'] ?? '') as String;
      _websiteController.text = (data['website'] ?? '') as String;
    } on PostgrestException catch (error) {
      SnackBar(
        content: Text(error.message),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } catch (error) {
      SnackBar(
        content: const Text('Unexpected error occurred'),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  /// Called when user taps `Update` button
  Future<void> _updateProfile() async {
    setState(() {
      _loading = true;
    });
    final userName = _usernameController.text.trim();
    final website = _websiteController.text.trim();
    final user = supabase.auth.currentUser;
    final updates = {
      'id': user!.id,
      'username': userName,
      'website': website,
      'updated_at': DateTime.now().toIso8601String(),
    };
    try {
      await supabase.from('profiles').upsert(updates);
      if (mounted) {
        const SnackBar(
          content: Text('Successfully updated profile!'),
        );
      }
    } on PostgrestException catch (error) {
      SnackBar(
        content: Text(error.message),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } catch (error) {
      SnackBar(
        content: const Text('Unexpected error occurred'),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  Future<void> _signOut() async {
    try {
      await supabase.auth.signOut();
    } on AuthException catch (error) {
      SnackBar(
        content: Text(error.message),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } catch (error) {
      SnackBar(
        content: const Text('Unexpected error occurred'),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } finally {
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/login');
      }
    }
  }

  @override
  void initState() {
    super.initState();
    _getProfile();
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _websiteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 12),
              children: [
                TextFormField(
                  controller: _usernameController,
                  decoration: const InputDecoration(labelText: 'User Name'),
                ),
                const SizedBox(height: 18),
                TextFormField(
                  controller: _websiteController,
                  decoration: const InputDecoration(labelText: 'Website'),
                ),
                const SizedBox(height: 18),
                ElevatedButton(
                  onPressed: _loading ? null : _updateProfile,
                  child: Text(_loading ? 'Saving...' : 'Update'),
                ),
                const SizedBox(height: 18),
                TextButton(onPressed: _signOut, child: const Text('Sign Out')),
              ],
            ),
    );
  }
}
```

## 第九步：启动 [*link*](#%e7%ac%ac%e4%b9%9d%e6%ad%a5%e5%90%af%e5%8a%a8)

现在所有组件都已就位，让我们更新 lib/main.dart：

```
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:supabase_quickstart/pages/account_page.dart';
import 'package:supabase_quickstart/pages/login_page.dart';
import 'package:supabase_quickstart/pages/splash_page.dart';

Future<void> main() async {
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  );
  runApp(MyApp());
}

final supabase = Supabase.instance.client;

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
        '/account': (_) => const AccountPage(),
      },
    );
  }
}
```

完成后，在终端窗口中运行，即可在 Android 或 iOS 上启动：

```
flutter run
```

如果是web版，运行以下命令在 localhost:3000 上启动它

```
flutter run -d web-server --web-hostname localhost --web-port 3000
```

然后打开浏览器，登录 localhost:3000，就能看到已完成的应用程序了。

## 第十步：简介照片 [*link*](#%e7%ac%ac%e5%8d%81%e6%ad%a5%e7%ae%80%e4%bb%8b%e7%85%a7%e7%89%87)

每个 MemFire Cloud 项目都配置了用于管理大文件（如
照片和视频。

### 确保我们有一个公共存储桶 [*link*](#%e7%a1%ae%e4%bf%9d%e6%88%91%e4%bb%ac%e6%9c%89%e4%b8%80%e4%b8%aa%e5%85%ac%e5%85%b1%e5%ad%98%e5%82%a8%e6%a1%b6)

我们将把图片存储为可公开共享的图片。
确保你的头像邮筒设置为公开，如果不是，请点击悬停在存储桶名称上时出现的点菜单更改公开。
如果您的存储桶已设置为公开，您应该会在邮筒名称旁边看到一个橙色的 “公开 “徽章

## 第十一步：在账户页面添加图片上传功能 [*link*](#%e7%ac%ac%e5%8d%81%e4%b8%80%e6%ad%a5%e5%9c%a8%e8%b4%a6%e6%88%b7%e9%a1%b5%e9%9d%a2%e6%b7%bb%e5%8a%a0%e5%9b%be%e7%89%87%e4%b8%8a%e4%bc%a0%e5%8a%9f%e8%83%bd)

我们将使用 image\_picker 插件从设备中选择图片。

在 pubspec.yaml 文件中添加以下一行以安装 image\_picker：

```
image_picker: ^1.0.5
```

根据平台的不同，使用 image\_picker 还需要一些额外的准备工作。
请按照 image\_picker 的 README.md 中的说明，了解如何针对您使用的平台进行设置。

完成上述所有步骤后，就可以开始编码了。

## 第十二步：创建上传小部件 [*link*](#%e7%ac%ac%e5%8d%81%e4%ba%8c%e6%ad%a5%e5%88%9b%e5%bb%ba%e4%b8%8a%e4%bc%a0%e5%b0%8f%e9%83%a8%e4%bb%b6)

让我们为用户创建一个头像，这样他们就可以上传个人照片了。
我们可以先创建一个新的组件：

lib/components/avatar.dart

```
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:supabase_quickstart/main.dart';

class Avatar extends StatefulWidget {
  const Avatar({
    super.key,
    required this.imageUrl,
    required this.onUpload,
  });

  final String? imageUrl;
  final void Function(String) onUpload;

  @override
  _AvatarState createState() => _AvatarState();
}

class _AvatarState extends State<Avatar> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (widget.imageUrl == null || widget.imageUrl!.isEmpty)
          Container(
            width: 150,
            height: 150,
            color: Colors.grey,
            child: const Center(
              child: Text('No Image'),
            ),
          )
        else
          Image.network(
            widget.imageUrl!,
            width: 150,
            height: 150,
            fit: BoxFit.cover,
          ),
        ElevatedButton(
          onPressed: _isLoading ? null : _upload,
          child: const Text('Upload'),
        ),
      ],
    );
  }

  Future<void> _upload() async {
    final picker = ImagePicker();
    final imageFile = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 300,
      maxHeight: 300,
    );
    if (imageFile == null) {
      return;
    }
    setState(() => _isLoading = true);

    try {
      final bytes = await imageFile.readAsBytes();
      final fileExt = imageFile.path.split('.').last;
      final fileName = '${DateTime.now().toIso8601String()}.$fileExt';
      final filePath = fileName;
      await supabase.storage.from('avatars').uploadBinary(
            filePath,
            bytes,
            fileOptions: FileOptions(contentType: imageFile.mimeType),
          );
      final imageUrlResponse = await supabase.storage
          .from('avatars')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10);
      widget.onUpload(imageUrlResponse);
    } on StorageException catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error.message),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Unexpected error occurred'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    }

    setState(() => _isLoading = false);
  }
}
```

## 第十三步：添加新的 widget [*link*](#%e7%ac%ac%e5%8d%81%e4%b8%89%e6%ad%a5%e6%b7%bb%e5%8a%a0%e6%96%b0%e7%9a%84-widget)

然后我们就可以在账户页面中添加该 widget，并添加一些逻辑，以便在用户上传新头像时更新 avatar\_url。
lib/pages/account\_page.dart

```
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:supabase_quickstart/components/avatar.dart';
import 'package:supabase_quickstart/main.dart';

class AccountPage extends StatefulWidget {
  const AccountPage({super.key});

  @override
  _AccountPageState createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  final _usernameController = TextEditingController();
  final _websiteController = TextEditingController();

  String? _avatarUrl;
  var _loading = true;

  /// Called once a user id is received within `onAuthenticated()`
  Future<void> _getProfile() async {
    setState(() {
      _loading = true;
    });

    try {
      final userId = supabase.auth.currentSession!.user.id;
      final data = await supabase
          .from('profiles')
          .select()
          .eq('id', userId)
          .single();
      _usernameController.text = (data['username'] ?? '') as String;
      _websiteController.text = (data['website'] ?? '') as String;
      _avatarUrl = (data['avatar_url'] ?? '') as String;
    } on PostgrestException catch (error) {
      SnackBar(
        content: Text(error.message),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } catch (error) {
      SnackBar(
        content: const Text('Unexpected error occurred'),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  /// Called when user taps `Update` button
  Future<void> _updateProfile() async {
    setState(() {
      _loading = true;
    });
    final userName = _usernameController.text.trim();
    final website = _websiteController.text.trim();
    final user = supabase.auth.currentUser;
    final updates = {
      'id': user!.id,
      'username': userName,
      'website': website,
      'updated_at': DateTime.now().toIso8601String(),
    };
    try {
      await supabase.from('profiles').upsert(updates);
      if (mounted) {
        const SnackBar(
          content: Text('Successfully updated profile!'),
        );
      }
    } on PostgrestException catch (error) {
      SnackBar(
        content: Text(error.message),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } catch (error) {
      SnackBar(
        content: const Text('Unexpected error occurred'),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  Future<void> _signOut() async {
    try {
      await supabase.auth.signOut();
    } on AuthException catch (error) {
      SnackBar(
        content: Text(error.message),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } catch (error) {
      SnackBar(
        content: const Text('Unexpected error occurred'),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } finally {
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/login');
      }
    }
  }

  /// Called when image has been uploaded to Supabase storage from within Avatar widget
  Future<void> _onUpload(String imageUrl) async {
    try {
      final userId = supabase.auth.currentUser!.id;
      await supabase.from('profiles').upsert({
        'id': userId,
        'avatar_url': imageUrl,
      });
      if (mounted) {
        const SnackBar(
          content: Text('Updated your profile image!'),
        );
      }
    } on PostgrestException catch (error) {
      SnackBar(
        content: Text(error.message),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    } catch (error) {
      SnackBar(
        content: const Text('Unexpected error occurred'),
        backgroundColor: Theme.of(context).colorScheme.error,
      );
    }
    if (!mounted) {
      return;
    }

    setState(() {
      _avatarUrl = imageUrl;
    });
  }

  @override
  void initState() {
    super.initState();
    _getProfile();
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _websiteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 12),
              children: [
                Avatar(
                  imageUrl: _avatarUrl,
                  onUpload: _onUpload,
                ),
                const SizedBox(height: 18),
                TextFormField(
                  controller: _usernameController,
                  decoration: const InputDecoration(labelText: 'User Name'),
                ),
                const SizedBox(height: 18),
                TextFormField(
                  controller: _websiteController,
                  decoration: const InputDecoration(labelText: 'Website'),
                ),
                const SizedBox(height: 18),
                ElevatedButton(
                  onPressed: _loading ? null : _updateProfile,
                  child: Text(_loading ? 'Saving...' : 'Update'),
                ),
                const SizedBox(height: 18),
                TextButton(onPressed: _signOut, child: const Text('Sign Out')),
              ],
            ),
    );
  }
}
```

## 第十四步：存储管理 [*link*](#%e7%ac%ac%e5%8d%81%e5%9b%9b%e6%ad%a5%e5%ad%98%e5%82%a8%e7%ae%a1%e7%90%86)

如果上传额外的个人资料照片，它们会累积到
在头像桶中，因为它们的名称是随机的，只有最新的才会被从 public.profiles
public.profiles。

要自动删除过时的存储对象，可扩展数据库触发器。请注意，仅从
对象表中删除对象是不够的，因为这样做会使实际存储对象成为orphaned并泄漏到
S3 后端中的实际存储对象。相反，应通过 http 扩展调用 Postgres 中的存储 API。

在仪表板中为扩展模式启用 http 扩展。
然后，在 SQL 编辑器中定义以下 SQL 函数，以便通过 API 删除
存储对象：

```
create or replace function delete_storage_object(bucket text, object text, out status int, out content text)
returns record
language 'plpgsql'
security definer
as $$
declare
  project_url text := '<YOURPROJECTURL>';
  service_role_key text := '<YOURSERVICEROLEKEY>'; --  full access needed
  url text := project_url||'/storage/v1/object/'||bucket||'/'||object;
begin
  select
      into status, content
           result.status::int, result.content::text
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)],
    NULL,
    NULL)::extensions.http_request) as result;
end;
$$;

create or replace function delete_avatar(avatar_url text, out status int, out content text)
returns record
language 'plpgsql'
security definer
as $$
begin
  select
      into status, content
           result.status, result.content
      from public.delete_storage_object('avatars', avatar_url) as result;
end;
$$;
```

接下来，添加一个触发器，在更新或删除个人资料时删除任何过时的头像：

```
create or replace function delete_old_avatar()
returns trigger
language 'plpgsql'
security definer
as $$
declare
  status int;
  content text;
  avatar_name text;
begin
  if coalesce(old.avatar_url, '') <> ''
      and (tg_op = 'DELETE' or (old.avatar_url <> coalesce(new.avatar_url, ''))) then
    -- extract avatar name
    avatar_name := old.avatar_url;
    select
      into status, content
      result.status, result.content
      from public.delete_avatar(avatar_name) as result;
    if status <> 200 then
      raise warning 'Could not delete avatar: % %', status, content;
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger before_profile_changes
  before update of avatar_url or delete on public.profiles
  for each row execute function public.delete_old_avatar();
```

最后，在删除用户之前删除 public.profile 行。
如果省略了这一步，那么在删除用户时就不能删除用户。

```
create or replace function delete_old_profile()
returns trigger
language 'plpgsql'
security definer
as $$
begin
  delete from public.profiles where id = old.id;
  return old;
end;
$$;

create trigger before_delete_user
  before delete on auth.users
  for each row execute function public.delete_old_profile();
```

恭喜您，您已经使用 Flutter 和 MemFire Cloud 构建了一个功能齐全的用户管理应用程序！

---

[*navigate\_before* 快速入门: React](/docs/app/quickstart/with-react/)

[快速入门: Next.js *navigate\_next*](/docs/app/quickstart/with-nextjs/)