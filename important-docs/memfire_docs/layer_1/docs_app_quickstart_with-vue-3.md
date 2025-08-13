# 快速入门: Vue | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-vue-3/
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

# 快速入门: Vue

## 第一步：在 MemFire Cloud 仪表板中[创建](https://cloud.memfiredb.com/project)一个新应用。 [*link*](#%e7%ac%ac%e4%b8%80%e6%ad%a5%e5%9c%a8-memfire-cloud-%e4%bb%aa%e8%a1%a8%e6%9d%bf%e4%b8%ad%e5%88%9b%e5%bb%bahttpscloudmemfiredbcomproject%e4%b8%80%e4%b8%aa%e6%96%b0%e5%ba%94%e7%94%a8)

应用准备就绪后，进入应用，在左侧菜单->表编辑器选择 SQL 编辑器在 MemFire Cloud 数据库中创建一个表。使用以下 SQL 语句创建包含一些示例数据的国家/地区表。

```
-- Create the table
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
-- Insert some sample data into the table
INSERT INTO countries (name) VALUES ('United States');
INSERT INTO countries (name) VALUES ('Canada');
INSERT INTO countries (name) VALUES ('Mexico');
```

## 第二步：创建 Vue 应用 [*link*](#%e7%ac%ac%e4%ba%8c%e6%ad%a5%e5%88%9b%e5%bb%ba-vue-%e5%ba%94%e7%94%a8)

使用 npm init 命令创建 Vue 应用。

```
npm init vue@latest my-app
```

## 第三步：安装 Supabase 客户端库 [*link*](#%e7%ac%ac%e4%b8%89%e6%ad%a5%e5%ae%89%e8%a3%85-supabase-%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%93)

最快的入门方法是使用 supabase-js 客户端库，它提供了一些简便的API，用于在 Vue 应用程序中使用 Supabase。
导航到 Vue 应用程序并安装 supabase-js 。

```
cd my-app && npm install @supabase/supabase-js
```

## 第四步：创建 Supabase 客户端 [*link*](#%e7%ac%ac%e5%9b%9b%e6%ad%a5%e5%88%9b%e5%bb%ba-supabase-%e5%ae%a2%e6%88%b7%e7%ab%af)

在您的 Vue 应用程序中创建一个 /src/lib 目录，创建一个名为 supabaseClient.js 的文件，并添加以下代码以使用您的项目 URL 和公共 API（匿名）密钥初始化 Supabase 客户端。

```
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://<project>.supabase.co', '<your-anon-key>')
```

## 第五步：在应用程序中查询数据 [*link*](#%e7%ac%ac%e4%ba%94%e6%ad%a5%e5%9c%a8%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f%e4%b8%ad%e6%9f%a5%e8%af%a2%e6%95%b0%e6%8d%ae)

将 App.vue 文件中的现有内容替换为以下代码。

```
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const countries = ref([])

async function getCountries() {
  const { data } = await supabase.from('countries').select()
  countries.value = data
}

onMounted(() => {
  getCountries()
})
</script>

<template>
  <ul>
    <li v-for="country in countries" :key="country.id">{{ country.name }}</li>
  </ul>
</template>
```

## 第六步：启动应用程序 [*link*](#%e7%ac%ac%e5%85%ad%e6%ad%a5%e5%90%af%e5%8a%a8%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

启动应用程序并在浏览器中访问 http://localhost:5173，您应该会看到国家/地区列表。

```
npm run dev
```

---

[*navigate\_before* 计费相关问题](/docs/app/purchase/qa/)

[快速入门: React *navigate\_next*](/docs/app/quickstart/with-react/)