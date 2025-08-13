# 快速入门: Ionic React | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-ionic-react/
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

# 快速入门: Ionic React

![](../../img/ionic-demos/ionic-angular-account.png)

### GitHub [*link*](#github)

如果你在阅读指南时遇到困难，请参考[此版本](https://github.com/mhartington/supabase-ionic-react)。

## 构建应用程序 [*link*](#%e6%9e%84%e5%bb%ba%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

让我们开始从头开始构建React应用程序。

### 初始化一个Ionic React应用程序 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e4%b8%80%e4%b8%aaionic-react%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

我们可以使用[Ionic CLI](https://ionicframework.com/docs/cli)来初始化
一个名为 `supabase-ionic-react`的应用程序。

```
npm install -g @ionic/cli
ionic start supabase-ionic-react blank --type react
cd supabase-ionic-react
```

然后让我们安装唯一的额外依赖：[supabase-js](https://github.com/supabase/supabase-js)

```
npm install @supabase/supabase-js
```

最后，我们要把环境变量保存在`.env`中。
我们所需要的是API URL和你[早些时候]复制的`anon`密钥(#get-theapi-keys)。

```
REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

现在我们已经有了API凭证，让我们创建一个辅助文件来初始化Supabase客户端。这些变量将被暴露在
在浏览器上，这完全没有问题，因为我们的数据库已经启用了[行级安全](/docs/app/development_guide/auth/auth/#row-level-security)。

```
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 设置一个登录路线 [*link*](#%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e7%99%bb%e5%bd%95%e8%b7%af%e7%ba%bf)

让我们设置一个React组件来管理登录和注册。我们将使用Magic Links，所以用户可以用他们的电子邮件登录，而不使用密码。

```
import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { supabase } from '../supabaseClient';

export function LoginPage() {
  const [email, setEmail] = useState('');

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast ] = useIonToast();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log()
    e.preventDefault();
    await showLoading();
    try {
      await supabase.auth.signIn({ email });
      await showToast({ message: 'Check your email for the login link!' });
    } catch (e: any) {
      await showToast({ message: e.error_description || e.message , duration: 5000});
    } finally {
      await hideLoading();
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          <h1>Supabase + Ionic React</h1>
          <p>Sign in via magic link with your email below</p>
        </div>
        <IonList inset={true}>
          <form onSubmit={handleLogin}>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={email}
                name="email"
                onIonChange={(e) => setEmail(e.detail.value ?? '')}
                type="email"
              ></IonInput>
            </IonItem>
            <div className="ion-text-center">
              <IonButton type="submit" fill="clear">
                Login
              </IonButton>
            </div>
          </form>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
```

### 账号页面 [*link*](#%e8%b4%a6%e5%8f%b7%e9%a1%b5%e9%9d%a2)

在用户登录后，我们可以让他们编辑他们的个人资料细节和管理他们的账户。

让我们为它创建一个新的组件，叫做`Account.tsx`。

```
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
  useIonRouter
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function AccountPage() {
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const [session] = useState(() => supabase.auth.session());
  const router = useIonRouter();
  const [profile, setProfile] = useState({
    username: '',
    website: '',
    avatar_url: '',
  });
  useEffect(() => {
    getProfile();
  }, [session]);
  const getProfile = async () => {
    console.log('get');
    await showLoading();
    try {
      const user = supabase.auth.user();
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user!.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile({
          username: data.username,
          website: data.website,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error: any) {
      showToast({ message: error.message, duration: 5000 });
    } finally {
      await hideLoading();
    }
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/', 'forward', 'replace');
  }
  const updateProfile = async (e?: any, avatar_url: string = '') => {
    e?.preventDefault();

    console.log('update ');
    await showLoading();

    try {
      const user = supabase.auth.user();

      const updates = {
        id: user!.id,
        ...profile,
        avatar_url: avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      showToast({ message: error.message, duration: 5000 });
    } finally {
      await hideLoading();
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form onSubmit={updateProfile}>
          <IonItem>
            <IonLabel>
              <p>Email</p>
              <p>{session?.user?.email}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              type="text"
              name="username"
              value={profile.username}
              onIonChange={(e) =>
                setProfile({ ...profile, username: e.detail.value ?? '' })
              }
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Website</IonLabel>
            <IonInput
              type="url"
              name="website"
              value={profile.website}
              onIonChange={(e) =>
                setProfile({ ...profile, website: e.detail.value ?? '' })
              }
            ></IonInput>
          </IonItem>
          <div className="ion-text-center">
            <IonButton fill="clear" type="submit">
              Update Profile
            </IonButton>
          </div>
        </form>

        <div className="ion-text-center">
          <IonButton fill="clear" onClick={signOut}>
            Log Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
```

### 启动 [*link*](#%e5%90%af%e5%8a%a8)

现在我们有了所有的组件，让我们更新`App.tsx`。

```
import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { supabase } from './supabaseClient'

import '@ionic/react/css/ionic.bundle.css'

/* Theme variables */
import './theme/variables.css'
import { LoginPage } from './pages/Login'
import { AccountPage } from './pages/Account'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'

setupIonicReact()

const App: React.FC = () => {
  const [session, setSession] = useState < Session > null
  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path="/"
            render={() => {
              return session ? <Redirect to="/account" /> : <LoginPage />
            }}
          />
          <Route exact path="/account">
            <AccountPage />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
```

一旦完成，在终端窗口运行这个程序。

```
ionic serve
```

然后打开浏览器到[localhost:3000](http://localhost:3000)，你应该看到完成的应用程序。

![](../../img/ionic-demos/ionic-react.png)

## 个人照片 [*link*](#%e4%b8%aa%e4%ba%ba%e7%85%a7%e7%89%87)

每个Supabase项目都配置了[存储](/docs/app/development_guide/storage/storage/)，用于管理照片和视频等大文件。

### 创建一个上传小组件 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e4%b8%8a%e4%bc%a0%e5%b0%8f%e7%bb%84%e4%bb%b6)

首先安装两个软件包，以便与用户的相机互动。

```
npm install @ionic/pwa-elements @capacitor/camera
```

[CapacitorJS](https://capacitorjs.com)是Ionic的一个跨平台原生运行时间，它使网络应用通过应用商店部署，并提供对原生deavice API的访问。

Ionic PWA元素是一个配套的软件包，它将把某些不提供用户界面的浏览器API用自定义的Ionic UI进行聚填。

安装了这些包后，我们可以更新我们的`index.tsx`，以包括对Ionic PWA元素的额外引导调用。

```
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'

import { defineCustomElements } from '@ionic/pwa-elements/loader'
defineCustomElements(window)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorkerRegistration.unregister()
reportWebVitals()
```

Then create an **AvatarComponent**.

```
import { IonIcon } from '@ionic/react';
import { person } from 'ionicons/icons';
import { Camera, CameraResultType } from '@capacitor/camera';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Avatar.css'
export function Avatar({
  url,
  onUpload,
}: {
  url: string;
  onUpload: (e: any, file: string) => Promise<void>;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    if (url) {
      downloadImage(url);
    }
  }, [url]);
  const uploadAvatar = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
      });

      const file = await fetch(photo.dataUrl!)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new File([blob], 'my-file', { type: `image/${photo.format}` })
        );

      const fileName = `${Math.random()}-${new Date().getTime()}.${
        photo.format
      }`;
      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
      if (uploadError) {
        throw uploadError;
      }
      onUpload(null, fileName);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data!);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  };

  return (
    <div className="avatar">
    <div className="avatar_wrapper" onClick={uploadAvatar}>
      {avatarUrl ? (
        <img src={avatarUrl} />
      ) : (
        <IonIcon icon={person} className="no-avatar" />
      )}
    </div>

    </div>
  );
}
```

### 添加新的小组件 [*link*](#%e6%b7%bb%e5%8a%a0%e6%96%b0%e7%9a%84%e5%b0%8f%e7%bb%84%e4%bb%b6)

然后我们就可以把这个小部件添加到账号页面:

```
// Import the new component

import { Avatar } from '../components/Avatar';

// ...
return (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Account</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <Avatar url={profile.avatar_url} onUpload={updateProfile}></Avatar>
```

## 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

在这个阶段，你已经有了一个功能完备的应用程序!

* 有问题吗？[在此提问](https://community.memfiredb.com/).
* 请登录[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 快速入门: Ionic Angular](/docs/app/quickstart/with-ionic-angular/)

[快速入门: RedwoodJS *navigate\_next*](/docs/app/quickstart/with-redwoodjs/)