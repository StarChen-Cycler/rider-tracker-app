# pg_cron: 作业调度 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/extensions/pgcron/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

使用方法

# pg\_cron: 作业调度

`pg_cron`扩展是PostgreSQL的一个简单的基于cron的工作调度器，在数据库内运行。

## 使用方法 [*link*](#%e4%bd%bf%e7%94%a8%e6%96%b9%e6%b3%95)

### 启用扩展 [*link*](#%e5%90%af%e7%94%a8%e6%89%a9%e5%b1%95)

1. 进入仪表板中的**数据库**页面。
2. 点击侧边栏中的*扩展*。
3. 搜索 “pg\_cron “并启用该扩展。

```
-- Example: enable the "pg_cron" extension
create extension pg_cron with schema extensions;

-- If you're planning to use a non-superuser role to schedule jobs,
-- ensure that they are granted access to the cron schema and its underlying objects beforehand.
-- Failure to do so would result in jobs by these roles to not run at all.

grant usage on schema cron to {{DB user}};
grant all privileges on all tables in schema cron to {{DB user}};

-- Example: disable the "pg_cron" extension
drop extension if exists pg_cron;
```

### 语法 [*link*](#%e8%af%ad%e6%b3%95)

该计划使用标准cron语法，其中\* 表示“每个时间段运行”，而特定数字表示“但仅在此时”：

```
┌───────────── min (0 - 59)
│ ┌────────────── hour (0 - 23)
│ │ ┌─────────────── day of month (1 - 31)
│ │ │ ┌──────────────── month (1 - 12)
│ │ │ │ ┌───────────────── day of week (0 - 6) (0 to 6 are Sunday to
│ │ │ │ │                  Saturday, or use names; 7 is also Sunday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

### 每周删除数据 [*link*](#%e6%af%8f%e5%91%a8%e5%88%a0%e9%99%a4%e6%95%b0%e6%8d%ae)

在星期六凌晨3:30(GMT)删除旧数据:

```
select cron.schedule (
    'webhook-every-minute', -- name of the cron job
    '* * * * *', -- every minute
    $$ delete from events where event_time < now() - interval '1 week' $$
);
```

### 每天运行一次VACUUM [*link*](#%e6%af%8f%e5%a4%a9%e8%bf%90%e8%a1%8c%e4%b8%80%e6%ac%a1vacuum)

每天凌晨3:00（GMT）运行VACUUM

```
SELECT cron.schedule('nightly-vacuum', '0 3 * * *', 'VACUUM');
```

### 取消作业计划 [*link*](#%e5%8f%96%e6%b6%88%e4%bd%9c%e4%b8%9a%e8%ae%a1%e5%88%92)

取消了一项名为`'nightly-vacuum'`的工作计划：

```
SELECT cron.unschedule('nightly-vacuum');
```

## 资源 [*link*](#%e8%b5%84%e6%ba%90)

* [pg\_cron GitHub库](https://github.com/citusdata/pg_cron)

---

[*navigate\_before* http: RESTful客户端](/docs/app/development_guide/database/extensions/http/)

[index-advisor: 查询优化 *navigate\_next*](/docs/app/development_guide/database/extensions/index_advisor/)