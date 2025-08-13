# 管理用户数据 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/auth/mandates/managing-user-data/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

创建用户表

# 管理用户数据

出于安全目的，`auth`模式不会在自动生成的API上公开。

尽管MemFireCloud提供了一个`auth.users`表，用于存储用户身份验证信息，但是当你希望通过API访问用户数据时，创建在`public`模式中的其他表也是有帮助的。
这意味着你可以在公共模式中创建自定义的表格，用于存储其他与用户相关的数据，以便通过API进行访问和操作。这样可以灵活地组织和管理你的用户数据，并与auth.users表中的用户身份验证信息结合使用。

## 创建用户表 [*link*](#%e5%88%9b%e5%bb%ba%e7%94%a8%e6%88%b7%e8%a1%a8)

当你创建用于存储用户数据的表时，参考`auth.users`表的主键可以确保数据完整性。
在引用`auth.users`时，还要指定`on delete cascade`子句。省略此子句可能会在删除用户时导致问题。

例如，一个`public.profiles`表可能如下所示：

```
create table public.profiles (
  id uuid references auth.users not null,
  first_name text,
  last_name text,

  primary key (id)
);

alter table public.profiles enable row level security;
```

info

如果设置了用户令牌使用服务密钥初始化客户端，不会覆盖行级安全（RLS）。如果用户使用客户端登录，MemFireCloud将遵循该用户的行级安全策略。

## 公共通道 [*link*](#%e5%85%ac%e5%85%b1%e9%80%9a%e9%81%93)

由于启用了行级别安全性，因此可以通过API访问此表，但除非我们设置了一些策略，否则不会返回任何数据。
如果我们希望每个人都可以读取数据，但只允许登录用户更新自己的数据，则策略如下：

```
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
```

## 私人访问 [*link*](#%e7%a7%81%e4%ba%ba%e8%ae%bf%e9%97%ae)

如果数据只能由拥有数据的用户读取，我们只需要更改上面的`for select`查询。

```
create policy "Profiles are viewable by users who created them."
on profiles for select
using ( auth.uid() = id );
```

这种模式的好处是什么？我们现在可以通过API查询此表，我们不需要在API查询中包含数据过滤器-策略将为我们处理：

```
// This will return nothing while the user is logged out
const { data } = await supabase.from('profiles').select('id, username, avatar_url, website')

// After the user is logged in, this will only return
// the logged-in user's data - in this case a single row
const { error } = await supabase.auth.signIn({ email })
const { data: profile } = await supabase
  .from('profiles')
  .select('id, username, avatar_url, website')
```

## 绕过行级安全性 [*link*](#%e7%bb%95%e8%bf%87%e8%a1%8c%e7%ba%a7%e5%ae%89%e5%85%a8%e6%80%a7)

如果您需要获取完整的用户配置文件列表，我们将提供一个`service_key`，您可以使用它与API和客户端库一起绕过行级别安全性。

确保你从未公开披露过。但它可以在服务器端用于获取所有配置文件。

## 先进的技术 [*link*](#%e5%85%88%e8%bf%9b%e7%9a%84%e6%8a%80%e6%9c%af)

### 使用触发器 [*link*](#%e4%bd%bf%e7%94%a8%e8%a7%a6%e5%8f%91%e5%99%a8)

如果要将行添加到`public`。每次用户注册时，您都可以使用触发器。
然而，如果触发器失败，它可能会阻止用户注册，因此请确保代码经过良好测试。

例如：

```
-- inserts a row into public.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

[*navigate\_before* RLS使用教程](/docs/app/development_guide/auth/mandates/row-level-security2/)

[服务器端渲染 *navigate\_next*](/docs/app/development_guide/auth/mandates/server-side-rendering/)