# 快速入门: Angular | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-angular/
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

# 快速入门: Angular

![](../../img/user-management-demo.png)

### GitHub [*link*](#github)

如果你在阅读指南时遇到困难，请参考[此版本](https://github.com/supabase/supabase/tree/master/examples/user-management/angular-user-management)

## 构建应用程序 [*link*](#%e6%9e%84%e5%bb%ba%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

让我们开始从头开始构建Angular应用程序。

### 初始化一个Angular应用程序 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e4%b8%80%e4%b8%aaangular%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

我们可以使用[Angular CLI]（https://angular.io/cli）来初始化
一个名为`supabase-angular’的应用程序：

```
npx ng new supabase-angular --routing false --style css
cd supabase-angular
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

现在我们已经有了API凭证，让我们用`ng g s supabase`创建一个**SupabaseService**，以初始化Supabase客户端并实现与Supabase API通信的功能。

```
import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { Database } from 'src/schema'

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }
}
```

可以选择更新[src/styles.css](https://raw.githubusercontent.com/supabase/supabase/master/examples/user-management/angular-user-management/src/styles.css)，为应用程序设置样式。

### 设置一个登录组件 [*link*](#%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e7%99%bb%e5%bd%95%e7%bb%84%e4%bb%b6)

让我们建立一个Angular组件来管理登录和注册。我们将使用Magic Links，所以用户可以用他们的电子邮件登录，而不需要使用密码。
用`ng g c auth` Angular CLI命令创建一个**AuthComponent**。

```
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { SupabaseService } from '../supabase.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loading = false

  signInForm = this.formBuilder.group({
    email: '',
  })

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.signInForm.value.email as string
      const { error } = await this.supabase.signIn(email)
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.signInForm.reset()
      this.loading = false
    }
  }
}
```

```
<div class="row flex-center flex">
  <div class="col-6 form-widget" aria-live="polite">
    <h1 class="header">Supabase + Angular</h1>
    <p class="description">Sign in via magic link with your email below</p>
    <form [formGroup]="signInForm" (ngSubmit)="onSubmit()" class="form-widget">
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          formControlName="email"
          class="inputField"
          type="email"
          placeholder="Your email"
        />
      </div>
      <div>
        <button
          type="submit"
          class="button block"
          [disabled]="loading"
        >
          {{ loading ? 'Loading' : 'Send magic link' }}
        </button>
      </div>
    </form>
  </div>
</div
```

### 账号页面 [*link*](#%e8%b4%a6%e5%8f%b7%e9%a1%b5%e9%9d%a2)

用户还需要一种方法来编辑他们的个人资料细节，并在登录后管理他们的账户。
用`ng g c account`Angular CLI命令创建一个**AccountComponent**。

```
import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { AuthSession } from '@supabase/supabase-js'
import { Profile, SupabaseService } from '../supabase.service'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  loading = false
  profile!: Profile

  @Input()
  session!: AuthSession

  updateProfileForm = this.formBuilder.group({
    username: '',
    website: '',
    avatar_url: '',
  })

  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder) {}

  async ngOnInit(): Promise<void> {
    await this.getProfile()

    const { username, website, avatar_url } = this.profile
    this.updateProfileForm.patchValue({
      username,
      website,
      avatar_url,
    })
  }

  async getProfile() {
    try {
      this.loading = true
      const { user } = this.session
      let { data: profile, error, status } = await this.supabase.profile(user)

      if (error && status !== 406) {
        throw error
      }

      if (profile) {
        this.profile = profile
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true
      const { user } = this.session

      const username = this.updateProfileForm.value.username as string
      const website = this.updateProfileForm.value.website as string
      const avatar_url = this.updateProfileForm.value.avatar_url as string

      const { error } = await this.supabase.updateProfile({
        id: user.id,
        username,
        website,
        avatar_url,
      })
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  async signOut() {
    await this.supabase.signOut()
  }
}
```

```
<form [formGroup]="updateProfileForm" (ngSubmit)="updateProfile()" class="form-widget">
  <div>
    <label for="email">Email</label>
    <input id="email" type="text" [value]="session.user.email" disabled />
  </div>
  <div>
    <label for="username">Name</label>
    <input formControlName="username" id="username" type="text" />
  </div>
  <div>
    <label for="website">Website</label>
    <input formControlName="website" id="website" type="url" />
  </div>

  <div>
    <button type="submit" class="button primary block" [disabled]="loading">
      {{ loading ? 'Loading ...' : 'Update' }}
    </button>
  </div>

  <div>
    <button class="button block" (click)="signOut()">Sign Out</button>
  </div>
</form>
```

### 启动 [*link*](#%e5%90%af%e5%8a%a8)

现在我们已经有了所有的组件，让我们来更新**AppComponent**。

```
import { Component, OnInit } from '@angular/core'
import { SupabaseService } from './supabase.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-user-management'

  session = this.supabase.session

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session))
  }
}
```

```
<div class="container" style="padding: 50px 0 100px 0">
  <app-account *ngIf="session; else auth" [session]="session"></app-account>
  <ng-template #auth>
    <app-auth></app-auth>
  </ng-template>
</div>
```

`app.module.ts` also needs to be modified to include the `ReactiveFormsModule` from the `@angular/forms` package.

```
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { AuthComponent } from './auth/auth.component'
import { AccountComponent } from './account/account.component'
import { ReactiveFormsModule } from '@angular/forms'
import { AvatarComponent } from './avatar/avatar.component'

@NgModule({
  declarations: [AppComponent, AuthComponent, AccountComponent, AvatarComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

一旦完成，在终端窗口运行这个程序。

```
npm run start
```

然后打开浏览器到[localhost:4200](http://localhost:4200)，你应该看到完成的应用程序。

![](../../img/supabase-angular-demo.png)

## 简介照片 [*link*](#%e7%ae%80%e4%bb%8b%e7%85%a7%e7%89%87)

每个Supabase项目都配置了[存储](/docs/app/development_guide/storage/storage/)，用于管理照片和视频等大文件。

### 创建一个上传小部件 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e4%b8%8a%e4%bc%a0%e5%b0%8f%e9%83%a8%e4%bb%b6)

让我们为用户创建一个头像，以便他们可以上传个人资料照片。
用`ng g c avatar`Angular CLI命令创建一个**AvatarComponent**。

```
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser'
import { SupabaseService } from '../supabase.service'

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnInit {
  _avatarUrl: SafeResourceUrl | undefined
  uploading = false

  @Input()
  set avatarUrl(url: string | null) {
    if (url) {
      this.downloadImage(url)
    }
  }

  @Output() upload = new EventEmitter<string>()

  constructor(private readonly supabase: SupabaseService, private readonly dom: DomSanitizer) {}

  ngOnInit(): void {}

  async downloadImage(path: string) {
    try {
      const { data } = await this.supabase.downLoadImage(path)
      if (data instanceof Blob) {
        this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error downloading image: ', error.message)
      }
    }
  }

  async uploadAvatar(event: any) {
    try {
      this.uploading = true
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      await this.supabase.uploadAvatar(filePath, file)
      this.upload.emit(filePath)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.uploading = false
    }
  }
}
```

```
<div>
  <img
    *ngIf="_avatarUrl"
    [src]="_avatarUrl"
    alt="Avatar"
    class="avatar image"
    style="height: 150px; width: 150px"
  />
</div>
<div *ngIf="!_avatarUrl" class="avatar no-image" style="height: 150px; width: 150px"></div>
<div style="width: 150px">
  <label class="button primary block" for="single">
    {{ uploading ? 'Uploading ...' : 'Upload' }}
  </label>
  <input
    style="visibility: hidden;position: absolute"
    type="file"
    id="single"
    accept="image/*"
    (change)="uploadAvatar($event)"
    [disabled]="uploading"
  />
</div>
```

### 添加新的小组件 [*link*](#%e6%b7%bb%e5%8a%a0%e6%96%b0%e7%9a%84%e5%b0%8f%e7%bb%84%e4%bb%b6)

然后我们可以在**账户组件**的html模板上面添加小部件。

```
<form [formGroup]="updateProfileForm" (ngSubmit)="updateProfile()" class="form-widget">
  <app-avatar [avatarUrl]="this.avatarUrl" (upload)="updateAvatar($event)"> </app-avatar>
  <!-- input fields -->
</form>
```

并在**AccountComponent** typescript文件中加入`updateAvatar`函数和`avatarUrl`获取器。

```
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  // ...
  get avatarUrl() {
    return this.updateProfileForm.value.avatar_url as string
  }

  async updateAvatar(event: string): Promise<void> {
    this.updateProfileForm.patchValue({
      avatar_url: event,
    })
    await this.updateProfile()
  }
  // ...
}
```

## 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

在这个阶段，你已经有了一个功能完备的应用程序!

* 有问题吗？[在此提问](https://community.memfiredb.com/).
* 请登录[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 快速入门: Next.js](/docs/app/quickstart/with-nextjs/)

[快速入门: Android Kotlin *navigate\_next*](/docs/app/quickstart/with-kotlin/)