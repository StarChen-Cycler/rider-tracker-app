# 快速入门: React | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-react
**Layer/Depth:** 2

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

第一步：在 MemFire Cloud 仪表板中

# 快速入门: React

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

## 第二步：创建 React 应用 [*link*](#%e7%ac%ac%e4%ba%8c%e6%ad%a5%e5%88%9b%e5%bb%ba-react-%e5%ba%94%e7%94%a8)

使用 Vite 模板创建 React 应用。

```
npm create vite@latest my-app -- --template react
```

## 第三步：安装 Supabase 客户端库 [*link*](#%e7%ac%ac%e4%b8%89%e6%ad%a5%e5%ae%89%e8%a3%85-supabase-%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%93)

最快的入门方法是使用 supabase-js 客户端库，它提供了一些简便的API，用于在 React 应用程序中使用 Supabase。
导航到 React 应用程序并安装 supabase-js 。

```
cd my-app && npm install @supabase/supabase-js
```

## 第四步：在应用程序中查询数据 [*link*](#%e7%ac%ac%e5%9b%9b%e6%ad%a5%e5%9c%a8%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f%e4%b8%ad%e6%9f%a5%e8%af%a2%e6%95%b0%e6%8d%ae)

在 App.jsx 中，使用您的项目 URL 和公共 API（匿名）密钥创建 Supabase 客户端。
添加 getCountries 函数以获取数据并将查询结果显示到页面。

```
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://<project>.supabase.co", "<your-anon-key>");

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    setCountries(data);
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
}

export default App;
```

## 第五步：启动应用程序 [*link*](#%e7%ac%ac%e4%ba%94%e6%ad%a5%e5%90%af%e5%8a%a8%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

启动应用程序，在浏览器中访问 http://localhost:5173，然后打开浏览器控制台，您应该会看到国家/地区列表。

```
npm run dev
```

---

[*navigate\_before* 快速入门: Vue](/docs/app/quickstart/with-vue-3/)

[快速入门: Flutter *navigate\_next*](/docs/app/quickstart/with-flutter/)