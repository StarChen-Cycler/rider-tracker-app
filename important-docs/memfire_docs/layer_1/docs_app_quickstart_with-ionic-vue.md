# 快速入门: Ionic Vue | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-ionic-vue/
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

# 快速入门: Ionic Vue

![](../../img/ionic-demos/ionic-angular-account.png)

### GitHub [*link*](#github)

如果你在阅读指南时遇到困难，请参考[此版本](https://github.com/mhartington/supabase-ionic-vue)。

## 构建应用程序 [*link*](#%e6%9e%84%e5%bb%ba%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

让我们开始从头开始构建Vue应用程序。

### 初始化一个Ionic Vue应用程序 [*link*](#%e5%88%9d%e5%a7%8b%e5%8c%96%e4%b8%80%e4%b8%aaionic-vue%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

我们可以使用[Ionic CLI](https://ionicframework.com/docs/cli)来初始化
一个名为`supabase-ionic-vue`的应用程序。

```
npm install -g @ionic/cli
ionic start supabase-ionic-vue blank --type vue
cd supabase-ionic-vue
```

然后让我们安装唯一的额外依赖：[supabase-js](https://github.com/supabase/supabase-js)

```
npm install @supabase/supabase-js
```

最后，我们要把环境变量保存在`.env`中。
我们所需要的是API URL和你[早些时候]复制的`anon`密钥(#get-theapi-keys)。

```
VUE_APP_SUPABASE_URL=YOUR_SUPABASE_URL
VUE_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

现在我们已经有了API凭证，让我们创建一个辅助文件来初始化Supabase客户端。这些变量将被暴露在
在浏览器上，这完全没有问题，因为我们的数据库已经启用了[行级安全](/docs/app/development_guide/auth/auth/#row-level-security)。

```
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 设置一个登录路由 [*link*](#%e8%ae%be%e7%bd%ae%e4%b8%80%e4%b8%aa%e7%99%bb%e5%bd%95%e8%b7%af%e7%94%b1)

让我们建立一个Vue组件来管理登录和注册。我们将使用Magic Links，所以用户可以用他们的电子邮件登录，而不需要使用密码。

```
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <h1>Supabase + Ionic Vue</h1>
        <p>Sign in via magic link with your email below</p>
      </div>
      <ion-list inset="true">
        <form @submit.prevent="handleLogin">
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input v-model="email" name="email" autocomplete type="email"></ion-input>
          </ion-item>
          <div class="ion-text-center">
            <ion-button type="submit" fill="clear">Login</ion-button>
          </div>
        </form>
      </ion-list>
      <p>{{email}}</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { supabase } from '../supabase'
  import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    toastController,
    loadingController,
  } from '@ionic/vue'
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'LoginPage',
    components: {
      IonContent,
      IonHeader,
      IonPage,
      IonTitle,
      IonToolbar,
      IonList,
      IonItem,
      IonLabel,
      IonInput,
      IonButton,
    },
    setup() {
      const email = ref('')
      const handleLogin = async () => {
        const loader = await loadingController.create({})
        const toast = await toastController.create({ duration: 5000 })

        try {
          await loader.present()
          const { error } = await supabase.auth.signIn({ email: email.value })

          if (error) throw error

          toast.message = 'Check your email for the login link!'
          await toast.present()
        } catch (error: any) {
          toast.message = error.error_description || error.message
          await toast.present()
        } finally {
          await loader.dismiss()
        }
      }
      return { handleLogin, email }
    },
  })
</script>
```

### 账号页面 [*link*](#%e8%b4%a6%e5%8f%b7%e9%a1%b5%e9%9d%a2)

在用户登录后，我们可以让他们编辑他们的个人资料细节和管理他们的账户。

让我们为其创建一个新的组件，名为`Account.vue`。

```
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form @submit.prevent="updateProfile">
        <ion-item>
          <ion-label>
            <p>Email</p>
            <p>{{ session?.user?.email }}</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Name</ion-label>
          <ion-input type="text" name="username" v-model="profile.username"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Website</ion-label>
          <ion-input type="url" name="website" v-model="profile.website"></ion-input>
        </ion-item>
        <div class="ion-text-center">
          <ion-button fill="clear" type="submit">Update Profile</ion-button>
        </div>
      </form>

      <div class="ion-text-center">
        <ion-button fill="clear" @click="signOut">Log Out</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { store } from '@/store'
  import { supabase } from '@/supabase'
  import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    toastController,
    loadingController,
    IonInput,
    IonItem,
    IonButton,
    IonLabel,
  } from '@ionic/vue'
  import { User } from '@supabase/supabase-js'
  import { defineComponent, onMounted, ref } from 'vue'
  export default defineComponent({
    name: 'AccountPage',
    components: {
      IonContent,
      IonHeader,
      IonPage,
      IonTitle,
      IonToolbar,
      IonInput,
      IonItem,
      IonButton,
      IonLabel,
    },
    setup() {
      const session = ref(supabase.auth.session())
      const profile = ref({
        username: '',
        website: '',
        avatar_url: '',
      })
      const user = store.user as User
      async function getProfile() {
        const loader = await loadingController.create({})
        const toast = await toastController.create({ duration: 5000 })
        await loader.present()
        try {
          let { data, error, status } = await supabase
            .from('profiles')
            .select(`username, website, avatar_url`)
            .eq('id', user.id)
            .single()

          if (error && status !== 406) throw error

          if (data) {
            console.log(data)
            profile.value = {
              username: data.username,
              website: data.website,
              avatar_url: data.avatar_url,
            }
          }
        } catch (error: any) {
          toast.message = error.message
          await toast.present()
        } finally {
          await loader.dismiss()
        }
      }

      const updateProfile = async () => {
        const loader = await loadingController.create({})
        const toast = await toastController.create({ duration: 5000 })
        try {
          await loader.present()
          const updates = {
            id: user.id,
            ...profile.value,
            updated_at: new Date(),
          }
          //
          let { error } = await supabase.from('profiles').upsert(updates, {
            returning: 'minimal', // Don't return the value after inserting
          })
          //
          if (error) throw error
        } catch (error: any) {
          toast.message = error.message
          await toast.present()
        } finally {
          await loader.dismiss()
        }
      }

      async function signOut() {
        const loader = await loadingController.create({})
        const toast = await toastController.create({ duration: 5000 })
        await loader.present()
        try {
          let { error } = await supabase.auth.signOut()
          if (error) throw error
        } catch (error: any) {
          toast.message = error.message
          await toast.present()
        } finally {
          await loader.dismiss()
        }
      }

      onMounted(() => {
        getProfile()
      })
      return { signOut, profile, session, updateProfile }
    },
  })
</script>
```

### 启动 [*link*](#%e5%90%af%e5%8a%a8)

现在我们已经有了所有的组件，让我们来更新`App.vue`和我们的路由：

```
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import LoginPage from '../views/Login.vue'
import AccountPage from '../views/Account.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
```

```
<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
  import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue'
  import { defineComponent } from 'vue'

  import { store } from './store'
  import { supabase } from './supabase'

  export default defineComponent({
    name: 'App',
    components: {
      IonApp,
      IonRouterOutlet,
    },
    setup() {
      const router = useIonRouter()
      store.user = supabase.auth.user() ?? {}
      supabase.auth.onAuthStateChange((_, session) => {
        store.user = session?.user ?? {}
        if (session?.user) {
          router.replace('/account')
        }
      })
    },
  })
</script>
```

一旦完成，在终端窗口运行这个程序。

```
ionic serve
```

然后打开浏览器到[localhost:3000](http://localhost:3000)，你应该看到完成的应用程序。

![](../../img/ionic-demos/ionic-vue.png)

## 个人照片 [*link*](#%e4%b8%aa%e4%ba%ba%e7%85%a7%e7%89%87)

每个Supabase项目都配置了[存储](/docs/app/development_guide/storage/storage/)，用于管理照片和视频等大文件。

### 创建一个上传小组件 [*link*](#%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e4%b8%8a%e4%bc%a0%e5%b0%8f%e7%bb%84%e4%bb%b6)

首先安装两个软件包，以便与用户的相机互动。

```
npm install @ionic/pwa-elements @capacitor/camera
```

[CapacitorJS](https://capacitorjs.com)是Ionic的一个跨平台原生运行时间，它使网络应用通过应用商店部署，并提供对原生deavice API的访问。

Ionic PWA元素是一个配套的软件包，它将对某些不提供用户界面的浏览器API进行聚填，并提供自定义的Ionic UI。

安装了这些包后，我们可以更新我们的`main.ts`，以包括对Ionic PWA元素的额外引导调用。

```
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/ionic.bundle.css'

/* Theme variables */
import './theme/variables.css'

import { defineCustomElements } from '@ionic/pwa-elements/loader'
defineCustomElements(window)
const app = createApp(App).use(IonicVue).use(router)

router.isReady().then(() => {
  app.mount('#app')
})
```

然后创建一个**AvatarComponent**。

```
<template>
  <div class="avatar">
    <div class="avatar_wrapper" @click="uploadAvatar">
      <img v-if="avatarUrl" :src="avatarUrl" />
      <ion-icon v-else name="person" class="no-avatar"></ion-icon>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, toRefs, watch, defineComponent } from 'vue'
  import { supabase } from '../supabase'
  import { Camera, CameraResultType } from '@capacitor/camera'
  import { IonIcon } from '@ionic/vue'
  import { person } from 'ionicons/icons'
  export default defineComponent({
    name: 'AppAvatar',
    props: { path: String },
    emits: ['upload', 'update:path'],
    components: { IonIcon },
    setup(prop, { emit }) {
      const { path } = toRefs(prop)
      const avatarUrl = ref('')

      const downloadImage = async () => {
        try {
          const { data, error } = await supabase.storage.from('avatars').download(path.value)
          if (error) throw error
          avatarUrl.value = URL.createObjectURL(data!)
        } catch (error: any) {
          console.error('Error downloading image: ', error.message)
        }
      }

      const uploadAvatar = async () => {
        try {
          const photo = await Camera.getPhoto({
            resultType: CameraResultType.DataUrl,
          })
          if (photo.dataUrl) {
            const file = await fetch(photo.dataUrl)
              .then((res) => res.blob())
              .then((blob) => new File([blob], 'my-file', { type: `image/${photo.format}` }))

            const fileName = `${Math.random()}-${new Date().getTime()}.${photo.format}`
            let { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(fileName, file)
            if (uploadError) {
              throw uploadError
            }
            emit('update:path', fileName)
            emit('upload')
          }
        } catch (error) {
          console.log(error)
        }
      }

      watch(path, () => {
        if (path.value) downloadImage()
      })

      return { avatarUrl, uploadAvatar, person }
    },
  })
</script>
<style>
  .avatar {
    display: block;
    margin: auto;
    min-height: 150px;
  }
  .avatar .avatar_wrapper {
    margin: 16px auto 16px;
    border-radius: 50%;
    overflow: hidden;
    height: 150px;
    aspect-ratio: 1;
    background: var(--ion-color-step-50);
    border: thick solid var(--ion-color-step-200);
  }
  .avatar .avatar_wrapper:hover {
    cursor: pointer;
  }
  .avatar .avatar_wrapper ion-icon.no-avatar {
    width: 100%;
    height: 115%;
  }
  .avatar img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>
```

### 添加新的小组件 [*link*](#%e6%b7%bb%e5%8a%a0%e6%96%b0%e7%9a%84%e5%b0%8f%e7%bb%84%e4%bb%b6)

然后我们就可以把这个小部件添加到账号页面:

```
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <avatar v-model:path="profile.avatar_url" @upload="updateProfile"></avatar>
...
</template>
<script lang="ts">
import Avatar from '../components/Avatar.vue';
export default defineComponent({
  name: 'AccountPage',
  components: {
    Avatar,
    ....
  }

</script>
```

## 下一步 [*link*](#%e4%b8%8b%e4%b8%80%e6%ad%a5)

在这个阶段，你已经有了一个功能完备的应用程序!

* 有问题吗？[在此提问](https://community.memfiredb.com/).
* 请登录[MemFire Cloud](https://cloud.memfiredb.com/)

---

[*navigate\_before* 快速入门: Svelte](/docs/app/quickstart/with-svelte/)

[快速入门: Expo *navigate\_next*](/docs/app/quickstart/with-expo/)