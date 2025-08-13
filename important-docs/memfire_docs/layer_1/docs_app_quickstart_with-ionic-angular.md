# 快速入门: Ionic Angular | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-ionic-angular/
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

# 快速入门: Ionic Angular

![](../../img/ionic-demos/ionic-angular-account.png)

### GitHub [*link*](#github)

如果你在阅读指南时遇到困难，请参考[此版本](https://github.com/mhartington/supabase-ionic-angular)

## 构建应用程序 [*link*](#%e6%9e%84%e5%bb%ba%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

让我们开始从头开始构建Angular应用程序。

### 初始化一个Ionic Angular应用程序 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e4%b8%80%e4%b8%aaionic-angular%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

我们可以使用[Ionic CLI](https://ionicframework.com/docs/cli)来初始化
一个名为`supabase-ionic-angular`的应用程序。

```
npm install -g @ionic/cli
ionic start supabase-ionic-angular blank --type angular
cd supabase-ionic-angular
```

然后让我们安装唯一的额外依赖：[supabase-js](https://github.com/supabase/supabase-js)

```
npm install @supabase/supabase-js
```

最后我们要在`environment.ts`文件中保存环境变量。
我们所需要的是API URL和你[早些时候]复制的`anon`密钥(#get-theapi-keys)。
这些变量将暴露在浏览器上，这完全没有问题，因为我们在数据库上启用了[行级安全](/docs/app/development_guide/auth/auth/#row-level-security)。

```
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_KEY',
}
```

现在我们有了API凭证，让我们用`ionic g s supabase`创建一个**SupabaseService**，以初始化Supabase客户端，并实现与Supabase API通信的功能。

```
import { Injectable } from '@angular/core'
import { LoadingController, ToastController } from '@ionic/angular'
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../environments/environment'

export interface Profile {
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get user() {
    return this.supabase.auth.user()
  }

  get session() {
    return this.supabase.auth.session()
  }

  get profile() {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', this.user?.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signIn({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      id: this.user?.id,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update, {
      returning: 'minimal', // Don't return the value after inserting
    })
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }

  async createNotice(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 5000 })
    await toast.present()
  }

  createLoader() {
    return this.loadingCtrl.create()
  }
}
```

### 设置一个登录路由 [*link*](#%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e7%99%bb%e5%bd%95%e8%b7%af%e7%94%b1)

让我们建立一个路由来管理登录和注册。我们将使用Magic Links，所以用户可以用他们的电子邮件登录，而不需要使用密码。
用`ionic g page login` Ionic CLI命令创建一个**LoginPage**。

> 本指南将显示模板的内联，但示例应用程序将有templateUrls

```
import { Component, OnInit } from '@angular/core'
import { SupabaseService } from '../supabase.service'

@Component({
  selector: 'app-login',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <h1>Supabase + Ionic Angular</h1>
        <p>Sign in via magic link with your email below</p>
      </div>
      <ion-list inset="true">
        <form (ngSubmit)="handleLogin($event)">
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input [(ngModel)]="email" name="email" autocomplete type="email"></ion-input>
          </ion-item>
          <div class="ion-text-center">
            <ion-button type="submit" fill="clear">Login</ion-button>
          </div>
        </form>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = ''
  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {}
  async handleLogin(event: any) {
    event.preventDefault()
    const loader = await this.supabase.createLoader()
    await loader.present()
    try {
      await this.supabase.signIn(this.email)
      await loader.dismiss()
      await this.supabase.createNotice('Check your email for the login link!')
    } catch (error) {
      await loader.dismiss()
      await this.supabase.createNotice(error.error_description || error.message)
    }
  }
}
```

### 账号页面 [*link*](#%e8%b4%a6%e5%8f%b7%e9%a1%b5%e9%9d%a2)

在用户登录后，我们可以让他们编辑他们的个人资料细节和管理他们的账户。
用`ionic g page account` Ionic CLI命令创建一个**AccountComponent**。

```
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Profile, SupabaseService } from '../supabase.service'

@Component({
  selector: 'app-account',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form>
        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input type="email" [value]="session?.user?.email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Name</ion-label>
          <ion-input type="text" name="username" [(ngModel)]="profile.username"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Website</ion-label>
          <ion-input type="url" name="website" [(ngModel)]="profile.website"></ion-input>
        </ion-item>
        <div class="ion-text-center">
          <ion-button fill="clear" (click)="updateProfile()">Update Profile</ion-button>
        </div>
      </form>

      <div class="ion-text-center">
        <ion-button fill="clear" (click)="signOut()">Log Out</ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  profile: Profile = {
    username: '',
    avatar_url: '',
    website: '',
  }

  session = this.supabase.session

  constructor(private readonly supabase: SupabaseService, private router: Router) {}
  ngOnInit() {
    this.getProfile()
  }

  async getProfile() {
    try {
      let { data: profile, error, status } = await this.supabase.profile
      if (error && status !== 406) {
        throw error
      }
      if (profile) {
        this.profile = profile
      }
    } catch (error) {
      alert(error.message)
    }
  }

  async updateProfile(avatar_url: string = '') {
    const loader = await this.supabase.createLoader()
    await loader.present()
    try {
      await this.supabase.updateProfile({ ...this.profile, avatar_url })
      await loader.dismiss()
      await this.supabase.createNotice('Profile updated!')
    } catch (error) {
      await this.supabase.createNotice(error.message)
    }
  }

  async signOut() {
    console.log('testing?')
    await this.supabase.signOut()
    this.router.navigate(['/'], { replaceUrl: true })
  }
}
```

### 启动 [*link*](#%e5%90%af%e5%8a%a8)

现在我们已经有了所有的组件，让我们来更新**AppComponent**。

```
import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { SupabaseService } from './supabase.service'

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private supabase: SupabaseService, private router: Router) {
    this.supabase.authChanges((_, session) => {
      console.log(session)
      if (session?.user) {
        this.router.navigate(['/account'])
      }
    })
  }
}
```

然后更新**AppRoutingModule**

```
import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: '/',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then((m) => m.AccountPageModule),
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

一旦完成，在终端窗口运行这个程序。

```
ionic serve
```

浏览器将自动打开，显示该应用程序。

![](../../img/ionic-demos/ionic-angular.png)

## 个人资料照片 [*link*](#%e4%b8%aa%e4%ba%ba%e8%b5%84%e6%96%99%e7%85%a7%e7%89%87)

每个Supabase项目都配置了[存储](/docs/app/development_guide/storage/storage/)，用于管理照片和视频等大文件。

### 创建一个上传小部件 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e4%b8%8a%e4%bc%a0%e5%b0%8f%e9%83%a8%e4%bb%b6)

让我们为用户创建一个头像，以便他们可以上传个人资料照片。

首先安装两个包，以便与用户的相机互动。

```
npm install @ionic/pwa-elements @capacitor/camera
```

[CapacitorJS](https://capacitorjs.com)是Ionic的一个跨平台原生运行时间，它使网络应用通过应用商店部署，并提供对原生deavice API的访问。

Ionic PWA元素是一个配套的软件包，它将对某些不提供用户界面的浏览器API进行聚填，并提供自定义的Ionic UI。

安装了这些包后，我们可以更新我们的`main.ts`，以包括对Ionic PWA元素的额外引导调用。

```
import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

import { defineCustomElements } from '@ionic/pwa-elements/loader'
defineCustomElements(window)

if (environment.production) {
  enableProdMode()
}
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err))
```

然后用这个Ionic CLI命令创建一个**AvatarComponent**。

```
ionic g component avatar --module=/src/app/account/account.module.ts --create-module
```

```
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { SupabaseService } from '../supabase.service'
import { Camera, CameraResultType } from '@capacitor/camera'
@Component({
  selector: 'app-avatar',
  template: `
    <div class="avatar_wrapper" (click)="uploadAvatar()">
      <img *ngIf="_avatarUrl; else noAvatar" [src]="_avatarUrl" />
      <ng-template #noAvatar>
        <ion-icon name="person" class="no-avatar"></ion-icon>
      </ng-template>
    </div>
  `,
  style: [
    `
    :host {
       display: block;
       margin: auto;
       min-height: 150px;
    }
     :host .avatar_wrapper {
       margin: 16px auto 16px;
       border-radius: 50%;
       overflow: hidden;
       height: 150px;
       aspect-ratio: 1;
       background: var(--ion-color-step-50);
       border: thick solid var(--ion-color-step-200);
    }
     :host .avatar_wrapper:hover {
       cursor: pointer;
    }
     :host .avatar_wrapper ion-icon.no-avatar {
       width: 100%;
       height: 115%;
    }
     :host img {
       display: block;
       object-fit: cover;
       width: 100%;
       height: 100%;
    }
  `,
  ],
})
export class AvatarComponent implements OnInit {
  _avatarUrl: SafeResourceUrl | undefined
  uploading = false

  @Input()
  set avatarUrl(url: string | undefined) {
    if (url) {
      this.downloadImage(url)
    }
  }

  @Output() upload = new EventEmitter<string>()

  constructor(private readonly supabase: SupabaseService, private readonly dom: DomSanitizer) {}

  ngOnInit() {}

  async downloadImage(path: string) {
    try {
      const { data } = await this.supabase.downLoadImage(path)
      this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
    } catch (error) {
      console.error('Error downloading image: ', error.message)
    }
  }

  async uploadAvatar() {
    const loader = await this.supabase.createLoader()
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
      })

      const file = await fetch(photo.dataUrl)
        .then((res) => res.blob())
        .then((blob) => new File([blob], 'my-file', { type: `image/${photo.format}` }))

      const fileName = `${Math.random()}-${new Date().getTime()}.${photo.format}`

      await loader.present()
      await this.supabase.uploadAvatar(fileName, file)

      this.upload.emit(fileName)
    } catch (error) {
      this.supabase.createNotice(error.message)
    } finally {
      loader.dismiss()
    }
  }
}
```

### 添加新的小组件 [*link*](#%e6%b7%bb%e5%8a%a0%e6%96%b0%e7%9a%84%e5%b0%8f%e7%bb%84%e4%bb%b6)

然后我们可以在**账户组件**的html模板上面添加小部件。

```
template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Account</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <app-avatar
    [avatarUrl]="this.profile?.avatar_url"
    (upload)="updateProfile($event)"
  ></app-avatar>

<!-- input fields -->
`
```

## 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

在这个阶段，你已经有了一个功能完备的应用程序!

* 有问题吗？[在此提问](https://community.memfiredb.com/).
* 请登录[MemFire Cloud](https://cloud.memfiredb.com/)

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* [在Ionic Angular中使用Supabase进行认证](https://supabase.com/blog/authentication-in-ionic-angular)

---

[*navigate\_before* 快速入门: Expo](/docs/app/quickstart/with-expo/)

[快速入门: Ionic React *navigate\_next*](/docs/app/quickstart/with-ionic-react/)