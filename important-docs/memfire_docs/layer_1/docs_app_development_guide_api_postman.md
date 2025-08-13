# 使用Postman访问数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/api/postman/
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

# 使用Postman访问数据

MemFire Cloud为所有的数据表提供自动即时的API，我们可以通过Postman工具调用API来访问云数据库中数据表的数据。

### 前置条件 [*link*](#%e5%89%8d%e7%bd%ae%e6%9d%a1%e4%bb%b6)

① 注册MemFire Cloud账号；

② 存在已创建好的应用；

### 操作步骤 [*link*](#%e6%93%8d%e4%bd%9c%e6%ad%a5%e9%aa%a4)

### 1.创建数据表，插入数据 [*link*](#1%e5%88%9b%e5%bb%ba%e6%95%b0%e6%8d%ae%e8%a1%a8%e6%8f%92%e5%85%a5%e6%95%b0%e6%8d%ae)

在**我的应用**管理页面，点击具体应用，进入应用详情页面，点击左侧菜单栏“SQL执行器”，创建新查询，执行如下SQL命令。

SQL语法如下：

```
CREATE TABLE employees (
    employee_no integer PRIMARY KEY,
    name text UNIQUE,
    department text NOT NULL
);
INSERT INTO employees
VALUES
(1, 'lining', 'Marketing'),
(2, 'lisan', 'Sales'),
(3, 'zhangqi', 'Operations');
```

### 2.使用API文档 [*link*](#2%e4%bd%bf%e7%94%a8api%e6%96%87%e6%a1%a3)

点击左侧菜单栏“API文档”，在“表和视图”里，选中所有数据表中的“employees”，右侧点击"Bash"栏，应用API key选择“anon(public)”, 则可以查看该数据表的专属API接口文档。

![](../../../img/postman-1.png)

### 3.访问数据 [*link*](#3%e8%ae%bf%e9%97%ae%e6%95%b0%e6%8d%ae)

接下来读取该数据表“employees"中所有的行。

1.首先，我们在拖动文档滚动条，找到该操作的命令，如下图所示。我们可以直接获取到命令的URL信息、apikey和Authorization。

![](../../../img/postman-2.png)

2.打开Postman工具，新建一个请求窗口，复制url并将其粘贴到请求里，请求方式选择GET，查询参数是“\*”（查询全部）。配置请求Headers,将apikey和Authorization配置到请求头里面。完成配置后，点击“Send”按钮，即可获得返回结果。

![](../../../img/postman-3.png)

### 4.插入数据 [*link*](#4%e6%8f%92%e5%85%a5%e6%95%b0%e6%8d%ae)

接下来插入数据到数据表“employees"中。

1.首先，拖动文档滚动条，找到插入数据的API命令，如下图所示。可以获取到命令的URL信息、apikey和Authorization。

![](../../../img/postman-4.png)

2. 在Postman工具，新建一个请求窗口，请求方式选择POST，复制url并将其粘贴到请求里，配置Headers。同时在Body里面配置需要插入的数据。

![](../../../img/postman-5.png)

3.点击“Send”按钮，返回状态码201，插入数据操作成功。

4.执行第3小节访问数据操作，即可看到新插入的数据。

![](../../../img/postman-6.png)

### 5.设置RLS, 访问数据 [*link*](#5%e8%ae%be%e7%bd%aerls-%e8%ae%bf%e9%97%ae%e6%95%b0%e6%8d%ae)

数据表里的RLS默认是不开启的，此时注册应用的用户是可以增删改查数据表中任何数据。接下来展示如何采用RLS来设置表的访问权限，允许经过身份验证的用户来访问数据表。

1.在用户认证->策略页面，选中数据表“employees"，点击“启用RLS”按钮后，即可开启该数据库的RLS规则。允许经过身份验证的用户进行数据插入访问数据表。

![](../../../img/postman-7.png)

2.接下来，给表设置访问规则，只允许经过身份验证的用户才能去插入数据。这只是其中一种规则，具体规则还得根据大家的业务需求规定。

（1）只允许经过身份验证的用户才能去插入数据。

![](../../../img/postman-8.png)

（2）允许所有用户访问数据表。

![](../../../img/postman-9.png)

SQL语法：

```
CREATE POLICY "Enable insert for authenticated users only" ON "public"."employees"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true)

CREATE POLICY "Enable read access for all users" ON "public"."employees"
AS PERMISSIVE FOR SELECT
TO public
USING (true)
```

创建规则成功后，显示结果如下：

![](../../../img/postman-10.png)

3.设置完成权限后，此时第4小节中插入数据将无法成功，提示如下。

![](../../../img/postman-11.png)

4.创建一个用户，在认证管理->用户页面，点击“邀请”按钮，输入你的邮箱地址，点击“邀请”按钮。则该邀请邮箱中会收到一份注册邀请邮件.

![](../../../img/postman-12.png)

5.登录邮箱接受注册邀请，可以拿到用户token，这说明该用户已经认证通过。

![](../../../img/postman-13.png)

点击邮件中的邀请链接，在浏览器新页面中打开，可以从邀请链接中获取该用户的token。

![](../../../img/postman-14.png)

6.打开Postman，执行打开上一步的插入数据请求窗口，将Authorization 的内容换成该用户的token。

![](../../../img/postman-15.png)

7.配置apikey、Perfer、Content-type参数。

![](../../../img/postman-16.png)

8.配置Body，准备一条即将插入的数据，点击“Send”按钮，返回状态码201，插入数据操作成功。

![](../../../img/postman-17.png)

---

[*navigate\_before* GraphQL 介绍](/docs/app/development_guide/api/graphiql/)

[使用cURL工具访问数据 *navigate\_next*](/docs/app/development_guide/api/curl/)