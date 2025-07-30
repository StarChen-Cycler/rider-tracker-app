# MemFire Cloud 数据库架构和实体配置指南

## MemFire Cloud Schema 详解

MemFire Cloud 基于 PostgreSQL 数据库，提供了多个预定义的 schema（架构），每个 schema 都有特定的用途和功能。

### 预定义 Schema 说明

#### 1. `auth` - 用户认证系统

- **用途**: 存储用户账户、会话、角色等认证相关数据
- **包含的表**: users, sessions, refresh_tokens, identities 等
- **何时使用**: 当你的应用需要用户注册、登录、权限管理时
- **注意**: 通常不需要手动修改，由 MemFire 自动管理

#### 2. `public` - 业务数据 ⭐ (最常用)

- **用途**: 存储应用的核心业务数据
- **包含的表**: 你创建的所有业务表（如：用户资料、订单、产品等）
- **何时使用**: 存储应用的主要数据时
- **特点**: 这是你主要工作的 schema

#### 3. `storage` - 文件存储

- **用途**: 管理文件上传、下载、权限
- **包含的表**: buckets, objects, migrations
- **何时使用**: 当应用需要处理图片、文档、视频等文件时

#### 4. `realtime` - 实时功能

- **用途**: 支持实时数据订阅和推送
- **包含的表**: messages, channels, subscriptions
- **何时使用**: 需要实时聊天、协作、数据同步功能时

#### 5. `extensions` - 数据库扩展

- **用途**: 管理 PostgreSQL 扩展功能
- **何时使用**: 需要启用特殊数据库功能时（如 PostGIS、uuid-ossp）

#### 6. `graphql` / `graphqlpublic` - GraphQL API

- **用途**: 自动生成的 GraphQL API 相关表
- **何时使用**: 使用 GraphQL 查询接口时

#### 7. `net` - 网络功能

- **用途**: 支持数据库级别的 HTTP 请求
- **何时使用**: 需要在数据库中调用外部 API 时

#### 8. `pgbouncer` - 连接池

- **用途**: 管理数据库连接池
- **何时使用**: 高并发应用的连接优化

#### 9. `pgsodium` / `pgsodium_masks` - 加密

- **用途**: 数据加密和脱敏功能
- **何时使用**: 需要加密敏感数据时

#### 10. `supabase_functions` - 边缘函数

- **用途**: 存储和管理 Edge Functions
- **何时使用**: 部署服务端函数时

#### 11. 其他系统 Schema

- `pgtle`, `preference`, `sqlj`, `tiger`, `topology`, `vault`: 特殊功能模块
- **何时使用**: 特定高级功能需求时

## 何时需要配置数据库表？

### 1. 应用数据存储需求 🎯

当你的应用需要持久化存储数据时：

```javascript
// 例如：骑行追踪应用需要存储
- 用户骑行记录 (rides 表)
- 路线轨迹点 (route_points 表)
- 用户偏好设置 (user_preferences 表)
```

### 2. 超越基础认证的用户数据 👤

虽然 `auth.users` 存储基本用户信息，但业务扩展数据需要自定义表：

```sql
-- 创建用户资料扩展表
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nickname VARCHAR(50),
  avatar_url TEXT,
  bike_type VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. 业务逻辑复杂性增加 🔄

当应用从简单展示转向复杂业务逻辑：

- **简单应用**: 只展示静态内容 → 不需要数据库
- **复杂应用**: 用户互动、数据分析、关系管理 → 需要数据库

### 4. 多用户数据隔离需求 🔒

需要确保用户只能访问自己的数据：

```sql
-- 启用 RLS (Row Level Security)
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能看到自己的骑行记录
CREATE POLICY "Users can view own rides" 
ON rides FOR SELECT 
USING (auth.uid() = user_id);
```

### 5. 实时功能需求 ⚡

需要实时数据更新时：

```javascript
// 订阅实时数据变化
const { data, error } = await supabase
  .from('rides')
  .select('*')
  .on('INSERT', payload => {
    console.log('新的骑行记录:', payload.new)
  })
  .subscribe()
```

## 数据库配置最佳实践

### 1. Schema 选择建议

```
✅ 推荐：主要使用 public schema
- 99% 的业务表都应该在 public 中创建
- 保持简单，避免过度复杂化

❌ 避免：随意创建自定义 schema
- 除非有明确的数据隔离需求
- 自定义 schema 会增加权限管理复杂性
```

### 2. 表设计原则

#### 基础表结构模板

```sql
CREATE TABLE public.your_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- 你的业务字段
);

-- 启用 RLS
ALTER TABLE public.your_table ENABLE ROW LEVEL SECURITY;

-- 创建基础策略
CREATE POLICY "Users manage own data" 
ON public.your_table 
USING (auth.uid() = user_id);
```

#### RLS (行级安全) 配置

**何时启用 RLS？**

- ✅ 存储用户个人数据的表
- ✅ 需要数据隔离的表
- ❌ 公共只读数据表（如：城市列表、分类表）

**策略示例**:

```sql
-- 查看策略
CREATE POLICY "select_own_data" ON table_name 
FOR SELECT USING (auth.uid() = user_id);

-- 插入策略  
CREATE POLICY "insert_own_data" ON table_name 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 更新策略
CREATE POLICY "update_own_data" ON table_name 
FOR UPDATE USING (auth.uid() = user_id);

-- 删除策略
CREATE POLICY "delete_own_data" ON table_name 
FOR DELETE USING (auth.uid() = user_id);
```

### 3. 实时功能配置

启用 Realtime 的时机：

```sql
-- 为表启用实时功能
ALTER PUBLICATION supabase_realtime ADD TABLE your_table;
```

**何时启用？**

- ✅ 聊天消息表
- ✅ 协作文档表
- ✅ 实时状态更新表
- ❌ 历史数据表
- ❌ 配置数据表

## 骑行追踪应用示例

### 核心表设计

```sql
-- 1. 用户资料扩展
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nickname VARCHAR(50),
  avatar_url TEXT,
  preferred_vehicle VARCHAR(20) DEFAULT 'bicycle',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 骑行记录
CREATE TABLE public.rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  vehicle_type VARCHAR(20) DEFAULT 'bicycle',
  status VARCHAR(20) DEFAULT 'recording', -- recording, completed, paused
  start_location JSONB, -- {lat, lng, address}
  end_location JSONB,
  distance NUMERIC(10,2), -- 公里
  duration INTEGER, -- 秒
  created_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

-- 3. 路线轨迹点
CREATE TABLE public.route_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
  lat NUMERIC(10,8) NOT NULL,
  lng NUMERIC(11,8) NOT NULL,
  altitude NUMERIC(8,2),
  speed NUMERIC(6,2), -- km/h
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_points ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Users manage own profile" ON public.user_profiles 
USING (auth.uid() = id);

CREATE POLICY "Users manage own rides" ON public.rides 
USING (auth.uid() = user_id);

CREATE POLICY "Users manage own route points" ON public.route_points 
USING (auth.uid() = (SELECT user_id FROM public.rides WHERE id = ride_id));

-- 为实时追踪启用 Realtime（可选）
ALTER PUBLICATION supabase_realtime ADD TABLE public.rides;
```

## 总结

**何时需要配置数据库表？**

1. **立即需要**: 应用有数据存储需求
2. **认证之后**: 基础认证完成，开始构建业务功能
3. **数据隔离**: 需要用户私有数据时
4. **实时功能**: 需要数据实时同步时
5. **复杂查询**: 需要关联查询、数据分析时

**配置顺序建议**:

```
1. 完成认证系统设置
2. 设计核心业务表结构
3. 在 public schema 中创建表
4. 配置 RLS 策略保护数据
5. 根据需要启用 Realtime
6. 测试数据访问权限
```

记住：数据库设计是迭代过程，先满足核心需求，再逐步优化扩展！


# KIMI 回答：

这些 schema 是 Supabase 自动为你创建的系统级或功能级命名空间，每个 schema 都有特定用途。你**不需要全部理解或手动配置它们**，但你需要知道：

> **什么时候该在哪个 schema 下建表？**

---

### ✅ **你只需要关心的 schema：**

| Schema                                                                  | 用途                                                      | 你是否该在这儿建表？                              |
| ----------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| **public**                                                        | 默认的、你自己业务数据的 schema（如用户、订单、文章等）   | ✅**是的，绝大部分业务表都在这儿建**        |
| **auth**                                                          | Supabase Auth 系统自动管理用户、session、refresh token 等 | ❌**不要碰**，除非你要做自定义 auth         |
| **storage**                                                       | 管理文件上传（如头像、图片）                              | ❌**不要建表**，但你可以用它的 API 上传文件 |
| **realtime**                                                      | Supabase Realtime 用来监听数据库变动的系统表              | ❌**不要碰**                                |
| **supabase_functions**                                            | 存放你用 Supabase Edge Functions 写的函数                 | ❌**不要建表**                              |
| **extensions**                                                    | 安装 PostgreSQL 扩展（如 pg_stat_statements）             | ❌**系统用，不建表**                        |
| **graphql / graphqlpublic**                                       | 如果你用 Supabase 的 GraphQL 功能，它会把 API 映射到这里  | ❌**自动生成，不手动建表**                  |
| **vault, pgsodium, pgtle, sqlj, tiger, topology, net, pgbouncer** | 安全、加密、网络、GIS 等高级功能                          | ❌**非必要不动**                            |

---

### ✅ **你该怎么做？**

| 你在做什么？                                      | 该在哪个 schema 建表？           | 需要配置什么？       |
| ------------------------------------------------- | -------------------------------- | -------------------- |
| **做一个博客系统**（用户、文章、评论）      | ✅`public`                     | 建表 + 配置 RLS 策略 |
| **上传用户头像**                            | ❌ 用 Supabase Storage API       | 不需要建表           |
| **监听某张表的实时更新**                    | ❌ 用 Realtime 功能              | 不需要建表           |
| **写一个登录系统**                          | ❌ 用 Supabase Auth              | 不需要建表           |
| **写 Edge Functions**                       | ❌ 用 `supabase_functions`     | 不需要建表           |
| **你确实需要隔离业务模块**（如 admin 模块） | ✅ 自己新建 schema：如 `admin` | 建表 + 配置 RLS      |

---

### ✅ **总结一句话：**

> **除非你非常清楚某个 schema 是干嘛的，否则你所有的业务表都建在 `public` 里。**

---

### 🔒 **RLS 是什么？什么时候需要配置？**

RLS（Row Level Security）是 PostgreSQL 的一层权限控制，**默认关闭**。你需要在以下场景配置：

| 场景                                      | 是否开启 RLS？            | 说明                        |
| ----------------------------------------- | ------------------------- | --------------------------- |
| 前端直接调用 Supabase API（如 JS client） | ✅**必须开启**      | 否则用户能看到别人的数据    |
| 只用后端访问数据库（如 Next.js API 路由） | ❌**可以不开启**    | 后端自己控制权限            |
| 你想限制用户只能看自己的订单              | ✅**开启 + 写策略** | 用 `auth.uid() = user_id` |

---

### ✅ **一句话总结：**

> **你在 `public` 建业务表，是否需要 RLS 取决于你是否让前端直接访问数据库。**
>




