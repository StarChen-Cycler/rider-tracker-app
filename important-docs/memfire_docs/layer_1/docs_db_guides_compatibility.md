# 兼容性说明 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/guides/compatibility/
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

# 兼容性说明

MemFireDB 支持符合ANSI标准的结构化查询语言。兼容PostgreSQL 11.2版本。MemFireDB复用了PostgresSQL的原生查询层。MemFire支持所有的传统关系模型功能，例如引用完整性（例如外键）、JOIN、分布式事务、部分索引、触发器和存储过程。

PostgreSQL总共有182条SQL语句，MemFireDB 支持79条，有49条语句的语法（参数）是完全相同的，有29条语句的部分语法（参数）MemFireDB 不支持，只有一条（ SHOW TRANSACTION 显示事务等级）是MemFireDB自创的，CREATE DATABASE 和 DROP FUNCTION 语句 MemFireDB 在 PG 的基础上多设了一个参数。详细对比见下表（左侧为 PG 全部SQL语句，中间为MemFireDB支持的语句，右侧表示该语句的语法是否完全相同）：

| PostgreSQL | MemFireDB | same |
| --- | --- | --- |
| 182 | 79 | 49 |
| ABORT — 中止当前事务 | ABORT |  |
| ALTER AGGREGATE — 更改一个聚集函数的定义 |  |  |
| ALTER COLLATION — 更改一个排序规则的定义 |  |  |
| ALTER CONVERSION — 改变一个转换的定义 |  |  |
| ALTER DATABASE — 更改一个数据库 | ALTER DATABASE |  |
| ALTER DEFAULT PRIVILEGES — 定义默认访问特权 | ALTER DEFAULT PRIVILEGES |  |
| ALTER DOMAIN — 更改一个域的定义 | ALTER DOMAIN | no |
| ALTER EVENT TRIGGER — 更改一个事件触发器的定义 |  |  |
| ALTER EXTENSION — 更改一个扩展的定义 |  |  |
| ALTER FOREIGN DATA WRAPPER — 更改一个外部数据包装器的定义 |  |  |
| ALTER FOREIGN TABLE — 更改一个外部表的定义 |  |  |
| ALTER FUNCTION — 更改一个函数的定义 |  |  |
| ALTER GROUP — 更改角色名称或者成员关系 | ALTER GROUP |  |
| ALTER INDEX — 更改一个索引的定义 |  |  |
| ALTER LANGUAGE — 更改一种过程语言的定义 |  |  |
| ALTER LARGE OBJECT — 更改一个大对象的定义 |  |  |
| ALTER MATERIALIZED VIEW — 更改一个物化视图的定义 |  |  |
| ALTER OPERATOR — 更改一个操作符的定义 |  |  |
| ALTER OPERATOR CLASS — 更改一个操作符类的定义 |  |  |
| ALTER OPERATOR FAMILY — 更改一个操作符族的定义 |  |  |
| ALTER POLICY — 更改一条行级安全性策略的定义 | ALTER POLICY |  |
| ALTER PROCEDURE — change the definition of a procedure |  |  |
| ALTER PUBLICATION — 修改发布的定义 |  |  |
| ALTER ROLE — 更改一个数据库角色 | ALTER ROLE | no |
| ALTER ROUTINE — 更改一个例程的定义 |  |  |
| ALTER RULE — 更改一个规则定义 |  |  |
| ALTER SCHEMA — 更改一个模式的定义 |  |  |
| ALTER SEQUENCE — 更改一个序列发生器的定义 | ALTER SEQUENCE | no |
| ALTER SERVER — 更改一个外部服务器的定义 |  |  |
| ALTER STATISTICS — 更改扩展统计对象的定义 |  |  |
| ALTER SUBSCRIPTION — 修改订阅的定义 |  |  |
| ALTER SYSTEM — 更改一个服务器配置参数 |  |  |
| ALTER TABLE — 更改一个表的定义 | ALTER TABLE | no |
| ALTER TABLESPACE — 更改一个表空间的定义 |  |  |
| ALTER TEXT SEARCH CONFIGURATION — 更改一个文本搜索配置的定义 |  |  |
| ALTER TEXT SEARCH DICTIONARY — 更改一个文本搜索字典的定义 |  |  |
| ALTER TEXT SEARCH PARSER — 更改一个文本搜索解析器的定义 |  |  |
| ALTER TEXT SEARCH TEMPLATE — 更改一个文本搜索模板的定义 |  |  |
| ALTER TRIGGER — 更改一个触发器的定义 |  |  |
| ALTER TYPE — 更改一个类型的定义 |  |  |
| ALTER USER — 更改一个数据库角色 | ALTER USER |  |
| ALTER USER MAPPING — 更改一个用户映射的定义 |  |  |
| ALTER VIEW — 更改一个视图的定义 |  |  |
| ANALYZE — 收集有关一个数据库的统计信息 |  |  |
| BEGIN — 开始一个事务块 | BEGIN | no |
| CALL — 调用一个过程 |  |  |
| CHECKPOINT — 强制一个事务日志检查点 |  |  |
| CLOSE — 关闭一个游标 |  |  |
| CLUSTER — 根据一个索引聚簇一个表 |  |  |
| COMMENT — 定义或者更改一个对象的注释 | COMMENT |  |
| COMMIT — 提交当前事务 | COMMIT |  |
| COMMIT PREPARED — 提交一个早前为两阶段提交预备的事务 |  |  |
| COPY — 在一个文件和一个表之间复制数据 | COPY |  |
| CREATE ACCESS METHOD — 定义一种新的访问方法 |  |  |
| CREATE AGGREGATE — 定义一个新的聚集函数 | CREATE AGGREGATE |  |
| CREATE CAST — 定义一种新的造型 | CREATE CAST |  |
| CREATE COLLATION — 定义一种新排序规则 |  |  |
| CREATE CONVERSION — 定义一种新的编码转换 |  |  |
| CREATE DATABASE — 创建一个新数据库 | CREATE DATABASE | no |
| CREATE DOMAIN — 定义一个新的域 | CREATE DOMAIN | no |
| CREATE EVENT TRIGGER — 定义一个新的事件触发器 |  |  |
| CREATE EXTENSION — 安装一个扩展 | CREATE EXTENSION | no |
| CREATE FOREIGN DATA WRAPPER — 定义一个新的外部数据包装器 |  |  |
| CREATE FOREIGN TABLE — 定义一个新的外部表 |  |  |
| CREATE FUNCTION — 定义一个新函数 | CREATE FUNCTION |  |
| CREATE GROUP — 定义一个新的数据库角色 | CREATE GROUP | no |
| CREATE INDEX — 定义一个新索引 | CREATE INDEX | no |
| CREATE LANGUAGE — 定义一种新的过程语言 |  |  |
| CREATE MATERIALIZED VIEW — 定义一个新的物化视图 |  |  |
| CREATE OPERATOR — 定义一个新的操作符 | CREATE OPERATOR |  |
| CREATE OPERATOR CLASS — 定义一个新的操作符类 | CREATE OPERATOR CLASS | no |
| CREATE OPERATOR FAMILY — 定义一个新的操作符族 |  |  |
| CREATE POLICY — 为一个表定义一条新的行级安全性策略 | CREATE POLICY |  |
| CREATE PROCEDURE — 定义一个新的过程 | CREATE PROCEDURE |  |
| CREATE PUBLICATION — 定义一个新的发布 |  |  |
| CREATE ROLE — 定义一个新的数据库角色 | CREATE ROLE | no |
| CREATE RULE — 定义一条新的重写规则 | CREATE RULE |  |
| CREATE SCHEMA — 定义一个新模式 | CREATE SCHEMA |  |
| CREATE SEQUENCE — 定义一个新的序列发生器 | CREATE SEQUENCE | no |
| CREATE SERVER — 定义一个新的外部服务器 |  |  |
| CREATE STATISTICS — 定义扩展统计 |  |  |
| CREATE SUBSCRIPTION — 定义一个新的订阅 |  |  |
| CREATE TABLE — 定义一个新表 | CREATE TABLE | no |
| CREATE TABLE AS — 从一个查询的结果创建一个新表 | CREATE TABLE AS | no |
| CREATE TABLESPACE — 定义一个新的表空间 |  |  |
| CREATE TEXT SEARCH CONFIGURATION — 定义一个新的文本搜索配置 |  |  |
| CREATE TEXT SEARCH DICTIONARY — 定义一个新的文本搜索字典 |  |  |
| CREATE TEXT SEARCH PARSER — 定义一个新的文本搜索解析器 |  |  |
| CREATE TEXT SEARCH TEMPLATE — 定义一种新的文本搜索模板 |  |  |
| CREATE TRANSFORM — 定义一个新的转换 |  |  |
| CREATE TRIGGER — 定义一个新触发器 | CREATE TRIGGER | no |
| CREATE TYPE — 定义一种新的数据类型 | CREATE TYPE | no |
| CREATE USER — 定义一个新的数据库角色 | CREATE USER | no |
| CREATE USER MAPPING — 定义一个用户到一个外部服务器的新映射 |  |  |
| CREATE VIEW — 定义一个新视图 | CREATE VIEW | no |
| DEALLOCATE — 释放一个预备语句 | DEALLOCATE |  |
| DECLARE — 定义一个游标 |  |  |
| DELETE — 删除一个表的行 | DELETE | no |
| DISCARD — 抛弃会话状态 |  |  |
| DO — 执行一个匿名代码块 | DO |  |
| DROP ACCESS METHOD — 移除一种访问方法 |  |  |
| DROP AGGREGATE — 移除一个聚集函数 | DROP AGGREGATE |  |
| DROP CAST — 移除一个造型 | DROP CAST |  |
| DROP COLLATION — 移除一个排序规则 |  |  |
| DROP CONVERSION — 移除一个转换 |  |  |
| DROP DATABASE — 移除一个数据库 | DROP DATABASE |  |
| DROP DOMAIN — 移除一个域 | DROP DOMAIN |  |
| DROP EVENT TRIGGER — 移除一个事件触发器 |  |  |
| DROP EXTENSION — 移除一个扩展 | DROP EXTENSION |  |
| DROP FOREIGN DATA WRAPPER — 移除一个外部数据包装器 |  |  |
| DROP FOREIGN TABLE — 移除一个外部表 |  |  |
| DROP FUNCTION — 移除一个函数 | DROP FUNCTION | no |
| DROP GROUP — 移除一个数据库角色 | DROP GROUP |  |
| DROP INDEX — 移除一个索引 |  |  |
| DROP LANGUAGE — 移除一个过程语言 |  |  |
| DROP MATERIALIZED VIEW — 移除一个物化视图 |  |  |
| DROP OPERATOR — 移除一个操作符 | DROP OPERATOR |  |
| DROP OPERATOR CLASS — 移除一个操作符类 | DROP OPERATOR CLASS |  |
| DROP OPERATOR FAMILY — 移除一个操作符族 |  |  |
| DROP OWNED — 移除一个数据库角色拥有的数据库对象 | DROP OWNED |  |
| DROP POLICY — 从一个表移除一条行级安全性策略 | DROP POLICY |  |
| DROP PROCEDURE — 移除一个过程 | DROP PROCEDURE |  |
| DROP PUBLICATION — 删除一个发布 |  |  |
| DROP ROLE — 移除一个数据库角色 | DROP ROLE |  |
| DROP ROUTINE — 删除一个例程 |  |  |
| DROP RULE — 移除一个重写规则 | DROP RULE |  |
| DROP SCHEMA — 移除一个模式 |  |  |
| DROP SEQUENCE — 移除一个序列 | DROP SEQUENCE |  |
| DROP SERVER — 移除一个外部服务器描述符 |  |  |
| DROP STATISTICS — 删除扩展统计 |  |  |
| DROP SUBSCRIPTION — 删除一个订阅 |  |  |
| DROP TABLE — 移除一个表 | DROP TABLE | no |
| DROP TABLESPACE — 移除一个表空间 |  |  |
| DROP TEXT SEARCH CONFIGURATION — 移除一个文本搜索配置 |  |  |
| DROP TEXT SEARCH DICTIONARY — 移除一个文本搜索字典 |  |  |
| DROP TEXT SEARCH PARSER — 移除一个文本搜索解析器 |  |  |
| DROP TEXT SEARCH TEMPLATE — 移除一个文本搜索模板 |  |  |
| DROP TRANSFORM — 移除转换 |  |  |
| DROP TRIGGER — 移除一个触发器 | DROP TRIGGER |  |
| DROP TYPE — 移除一个数据类型 | DROP TYPE |  |
| DROP USER — 移除一个数据库角色 | DROP USER |  |
| DROP USER MAPPING — 移除一个用于外部服务器的用户映射 |  |  |
| DROP VIEW — 移除一个视图 |  |  |
| END — 提交当前事务 | END |  |
| EXECUTE — 执行一个预备语句 | EXECUTE |  |
| EXPLAIN — 显示一个语句的执行计划 | EXPLAIN |  |
| FETCH — 使用游标从查询中检索行 |  |  |
| GRANT — 定义访问特权 | GRANT | no |
| IMPORT FOREIGN SCHEMA — 从一个外部服务器导入表定义 |  |  |
| INSERT — 在一个表中创建新行 | INSERT | no |
| LISTEN — 监听一个通知 |  |  |
| LOAD — 载入一个共享库文件 |  |  |
| LOCK — 锁定一个表 | LOCK |  |
| MOVE — 定位一个游标 |  |  |
| NOTIFY — 生成一个通知 |  |  |
| PREPARE — 为执行准备一个语句 | PREPARE |  |
| PREPARE TRANSACTION — 为两阶段提交准备当前事务 |  |  |
| REASSIGN OWNED — 更改一个数据库角色拥有的数据库对象的拥有关系 | REASSIGN OWNED |  |
| REFRESH MATERIALIZED VIEW — 替换一个物化视图的内容 |  |  |
| REINDEX — 重建索引 |  |  |
| RELEASE SAVEPOINT — 销毁一个之前定义的保存点 |  |  |
| RESET — 把一个运行时参数的值恢复到默认值 | RESET |  |
| REVOKE — 移除访问特权 | REVOKE | no |
| ROLLBACK — 中止当前事务 | ROLLBACK |  |
| ROLLBACK PREPARED — 取消一个之前为两阶段提交准备好的事务 |  |  |
| ROLLBACK TO SAVEPOINT — 回滚到一个保存点 |  |  |
| SAVEPOINT — 在当前事务中定义一个新的保存点 |  |  |
| SECURITY LABEL — 定义或更改应用到一个对象的安全标签 |  |  |
| SELECT — 从一个表或视图检索行 | SELECT | no |
| SELECT INTO — 从一个查询的结果定义一个新表 |  |  |
| SET — 更改一个运行时参数 | SET |  |
| SET CONSTRAINTS — 为当前事务设置约束检查时机 | SET CONSTRAINTS | no |
| SET ROLE — 设置当前会话的当前用户标识符 | SET ROLE |  |
| SET SESSION AUTHORIZATION — 设置当前会话的会话用户标识符和当前用户标识符 | SET SESSION AUTHORIZATION |  |
| SET TRANSACTION — 设置当前事务的特性 | SET TRANSACTION |  |
| SHOW — 显示一个运行时参数的值 | SHOW |  |
|  | SHOW TRANSACTION | - |
| START TRANSACTION — 开始一个事务块 |  |  |
| TRUNCATE — 清空一个表或者一组表 | TRUNCATE | no |
| UNLISTEN — 停止监听一个通知 |  |  |
| UPDATE — 更新一个表的行 | UPDATE | no |
| VACUUM — 垃圾收集并根据需要分析一个数据库 |  |  |
| VALUES — 计算一个行集合 |  |  |

---

[*navigate\_before* 数据迁移](/docs/db/memfiredb-data-migration/)

[关键字 *navigate\_next*](/docs/db/guides/keyword/)