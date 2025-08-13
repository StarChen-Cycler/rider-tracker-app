# RLS使用教程 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/mandates/row-level-security2/
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

# RLS使用教程

## 前言 [*link*](#%e5%89%8d%e8%a8%80)

在使用MemFire Cloud的BaaS服务进行应用开发时，比较困扰开发者的是RLS的使用。本篇先从基本概念入手对RLS进行简要介绍，帮助大家理解RLS的工作机制和基本使用方法。

## 什么是RLS ？ [*link*](#%e4%bb%80%e4%b9%88%e6%98%afrls-)

全称：Row level security，行级安全，允许系统管理员为数据库表创建访问策略（policy），以**约束数据的可见性**。当为一个表创建了policy后，相当于为该表增加了一个高优先级的过滤器。当用户访问该表时，如果policy生效，则会根据policy中定义的过滤条件来决定用户可操作的数据集合。

## 如何添加RLS [*link*](#%e5%a6%82%e4%bd%95%e6%b7%bb%e5%8a%a0rls)

我们使用MemFire Cloud开发应用时，需要关注的对象包括数据表、对象存储的bucket，可以使用RLS来设置用户的访问权限，保证用户数据安全性。

### 数据表 [*link*](#%e6%95%b0%e6%8d%ae%e8%a1%a8)

数据表里的RLS默认是不开启的，此时注册应用的用户是可以增删改查数据表中任何数据。

当用户开启了RLS，但没有设置任何访问策略时，会拒绝用户访问该表中的任何数据。

**补充说明**：如果启用RLS，至少要创建一条最简单的策略（如：允许任何人访问数据），否接口调试时会查询不到数据。

以下是给指定表启用RLS的方法：

① 使用SQL命令启用RLS

RLS默认是不开启的，可针对每个表执行如下语句来对该表开启RLS功能：

```
ALTER TABLE <name> ENABLE ROW LEVEL SECURITY
```

② 新建表时默认启用行级安全策略

③ 用户认证->策略->给指定表启用RLS

### 对象存储bucket [*link*](#%e5%af%b9%e8%b1%a1%e5%ad%98%e5%82%a8bucket)

对象存储bucket的RLS默认就是开启的，无需手动开启。新建bucket时，如果选择公开bucket，则任何人可以访问bucket中的对象文件；否则无权访问。

## 如何给数据表设置访问权限 [*link*](#%e5%a6%82%e4%bd%95%e7%bb%99%e6%95%b0%e6%8d%ae%e8%a1%a8%e8%ae%be%e7%bd%ae%e8%ae%bf%e9%97%ae%e6%9d%83%e9%99%90)

创建一个应用后，MemFire Cloud后台会默认创建一个auth.users系统表，主要用来记录用户的注册信息，其中有三个字段：id(用户唯一标识UID)、email(用户注册邮箱)、role(用户角色信息)。

应用开发者在创建数据表时，可使用一个字段来标记是哪个用户的数据，通常采用id(用户唯一标识UID)、email(用户注册邮箱)来标记。

### 常用函数介绍 [*link*](#%e5%b8%b8%e7%94%a8%e5%87%bd%e6%95%b0%e4%bb%8b%e7%bb%8d)

MemFire Cloud封装了三个函数，用于获取向数据库发出请求的不同唯一标识，其中包括：

① **`auth.role()`** :用于获取向数据库发出请求的用户的当前角色。它可以被用于策略中，根据用户的角色限制或允许访问某些表或行。该函数返回一个代表用户角色的字符串，它可以是下列之一：已认证的（authenticated），匿名的（anon），或你定义的自定义角色。

② **`auth.email()`** \*\*:\*\*用于获取向数据库发出请求的用户的电子邮件。这个函数可以在策略中使用，根据用户的电子邮件限制或允许访问某些表或行。

③ **`auth.uid()`** **:** 用于获取向数据库提出请求的用户的唯一标识符（UID）。这个函数可以在策略中使用，根据用户的UID限制或允许访问某些表或行。

### 策略实例 [*link*](#%e7%ad%96%e7%95%a5%e5%ae%9e%e4%be%8b)

* 为所有用户启用访问权限
  + 为所有用户提供对数据表的访问权限
  + **当**\*\*`USING`****设置为****`true`\*\***时，表示访问数据表时不需要做任何校验**

```
Create POLICY "策略名称"
ON public."表名"
AS PERMISSIVE
FOR SELECT
USING( true ) ;
```

* 仅允许身份验证用户启用访问权限

为所有经过身份验证的用户提供对数据表的访问权限

```
Create POLICY "策略名称"
ON public."表名"
AS PERMISSIVE
FOR SELECT
USING( auth.role() = 'authenticated')
```

* 根据电子邮件为用户启用权限

假定您的表有一个“email“列，并允许用户操作”email“列与其电子邮件匹配的行

```
Create POLICY "策略名称"
ON public."表名"
AS PERMISSIVE
FOR SELECT
USING( auth.email() = "email" ) ;
```

* 根据用户ID为用户启用访问权限

假定您的表有一个“user\_id“列，并允许用户操作“user\_id“列与其ID 匹配的行

```
Create POLICY "策略名称"
ON public."表名"
AS PERMISSIVE
FOR SELECT
USING( auth.uid() = "id" ) ;
```

## 如何给bucket存储桶设置访问权限 [*link*](#%e5%a6%82%e4%bd%95%e7%bb%99bucket%e5%ad%98%e5%82%a8%e6%a1%b6%e8%ae%be%e7%bd%ae%e8%ae%bf%e9%97%ae%e6%9d%83%e9%99%90)

### 判断条件 [*link*](#%e5%88%a4%e6%96%ad%e6%9d%a1%e4%bb%b6)

① 指定路径的文件

```
name='admin/assets/example.png'
```

② 获取文件的指定层级文件夹名称

```
(storage.foldername(name))[1]='admin'
```

③ 发起请求用户的角色,这里的角色可以是已认证的（authenticated），匿名的（anon），或你定义的自定义角色。

```
auth.role()='authenticated'
```

④ 发起请求的用户uid等于文件夹名称

```
auth.uid()::text=(storage.foldername(name))[1]
```

⑤获取文件的扩展名

```
storage."extension"(name)='jpg'
```

⑥ 发起请求的用户uid等于指定值

```
auth.uid()::text='abcd'
```

### 策略实例 [*link*](#%e7%ad%96%e7%95%a5%e5%ae%9e%e4%be%8b-1)

* 允许匿名用户访问public文件夹的JPG图片

```
CREATE POLICY "策略名称"
ON storage.objects
--- 指定操作类型
FOR SELECT
---使用USING 或 WITH CHECK 来检查
{USING | WITH CHECK} (
  bucket_id = '存储桶名称'
  -- 只允许访问JPG文件
  AND storage."extension"(name) = 'jpg'
  -- 在public文件夹下
  AND LOWER((storage.foldername(name))[1]) = 'public'
  -- 对匿名用户
  AND auth.role() = 'anon'
);
```

* 允许用户访问以个人uid命名的文件夹

```
CREATE POLICY "策略名称"
ON storage.objects
--- 指定操作类型
FOR SELECT
---使用USING 或 WITH CHECK 来检查
{USING | WITH CHECK} (
    bucket_id = '存储桶名称'
    ---发起请求的用户uid等于文件夹名称
    AND auth.uid()::text = (storage.foldername(name))[1]
);
```

* 仅允许经过身份验证的用户访问文件夹

```
CREATE POLICY "策略名称"
ON storage.objects
--- 指定操作类型
FOR SELECT
---使用USING 或 WITH CHECK 来检查
{USING | WITH CHECK} (
    AND (storage.foldername(name))[1] = 'private'
    -- 仅允许身份验证访问
    AND auth.role() = 'authenticated'
);
```

* 仅允许特定用户访问名为admin/assets文件夹

```
CREATE POLICY "策略名称"
ON storage.objects
--- 指定操作类型
OR SELECT
---使用USING 或 WITH CHECK 来检查
{USING | WITH CHECK} (
    bucket_id = '存储桶名称'
    ---获取文件的指定层级文件夹名称
    AND (storage.foldername(name))[1] = 'admin' AND (storage.foldername(name))[2] = 'assets'
    ---指定特定用户才能访问
    AND auth.uid()::text = 'd7bed83c-44a0-4a4f-925f-efc384ea1e50'
);
```

* 仅允许特定用户访问一个文件

```
CREATE POLICY "策略名称"
ON storage.objects
--- 指定操作类型
FOR SELECT
---使用USING 或 WITH CHECK 来检查
{USING | WITH CHECK} (
    bucket_id = '存储桶名称'
    ---指定路径的文件
    AND name = 'admin/assets/Costa Rican Frog.jpg'
    ---指定特定用户才能访问
    AND auth.uid()::text = 'd7bed83c-44a0-4a4f-925f-efc384ea1e50'
);
```

## 语法说明 [*link*](#%e8%af%ad%e6%b3%95%e8%af%b4%e6%98%8e)

```
CREATE POLICY name ON table_name
  [ AS { PERMISSIVE | RESTRICTIVE } ]
  [ FOR { ALL | SELECT | INSERT | UPDATE | DELETE } ]
  [ TO { role_name | PUBLIC | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...] ]
  [ USING ( using_expression ) ]
  [ WITH CHECK ( check_expression ) ]
```

* name：同一个表上的policy不能重复，不同表的policy可以重复。
* table\_name：为哪个表创建policy。
* AS，policy的生效模式，PERMISSIVE ，宽松模式，多个policy采用 or 进行组合判断，只要有一个policy过了就能访问数据；RESTRICTIVE，排他模式，必须满足的条件，当与其他policy组合使用时，使用 and 进行组合，只改条件不满足则其他条件再宽松也无用。默认PERMISSIVE 。
* For，对哪个操作生效，默认ALL，还可选择SELECT | INSERT | UPDATE | DELETE。
* TO，对哪个role生效，默认public。
* USING：对表中的已有数据进行检查的语句。
* WITH CHECK：对新数据进行检查的语句。

---

[*navigate\_before* 行级别安全性](/docs/app/development_guide/auth/mandates/row-level-security/)

[管理用户数据 *navigate\_next*](/docs/app/development_guide/auth/mandates/managing-user-data/)