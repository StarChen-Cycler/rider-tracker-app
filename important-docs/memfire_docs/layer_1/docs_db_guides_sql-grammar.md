# SQL语法 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/guides/sql-grammar/
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

# SQL语法

MemFireDB 结构化查询语言（MSQL）是符合ANSI标准的结构化查询语言。兼容PostgreSQL 11.2版本。MemFireDB复用了PostgresSQL的原生查询层。MemFire支持所有的传统关系模型功能，例如引用完整性（例如外键）、JOIN、分布式事务、部分索引、触发器和存储过程。

MSQL的主要组件包括数据定义语言（DDL）、数据操作语言（DML）和数据控制语言（DCL）。这些组件由多个元素构成，包括数据类型、数据库对象、名称和限定符、表达式和注释。此外MSQL还提供了其他用途的组件，例如系统控制、事务控制和性能调试。

| 声明 | 描述 |
| --- | --- |
| ABORT | 回滚事务 |
| ALTER DATABASE | 更改数据库定义 |
| ALTER DEFAULT PRIVILEGES | 定义默认访问权限 |
| ALTER DOMAIN | 变更网域 |
| ALTER GROUP | 变更群组 |
| ALTER POLICY | 更改行级安全策略 |
| ALTER ROLE | 改变角色 |
| ALTER SEQUENCE | 更改序列定义 |
| ALTER TABLE | 变更表定义 |
| ALTER USER | 更改用户（角色） |
| BEGIN | 开始交易 |
| COMMENT | 在数据库对象上添加注释 |
| COMMIT | 提交交易 |
| COPY | 在表和文件之间复制数据 |
| CREATE AGGREGATE | 创建一个新的聚合 |
| CREATE CAST | 建立新的类型转换 |
| CREATE DATABASE | 创建一个新的数据库 |
| CREATE DOMAIN | 创建一个新域 |
| CREATE EXTENSION | 加载扩展 |
| CREATE FUNCTION | 创建一个新功能 |
| CREATE INDEX | 创建一个新索引 |
| CREATE GROUP | 创建一个新组（角色） |
| CREATE OPERATOR | 创建一个新的运算符 |
| CREATE OPERATOR CLASS | 创建一个新的运算符类 |
| CREATE POLICY | 创建一个新的行级安全策略 |
| CREATE PROCEDURE | 创建一个新程序 |
| CREATE ROLE | 创建一个新角色（用户或组） |
| CREATE RULE | 创建一个新规则 |
| CREATE USER | 创建一个新用户（角色） |
| CREATE SCHEMA | 创建一个新的架构（命名空间） |
| CREATE SEQUENCE | 创建一个新的序列生成器 |
| CREATE TABLE | 创建一个新表 |
| CREATE TABLE AS | 创建一个新表 |
| CREATE TRIGGER | 创建一个新触发器 |
| CREATE TYPE | 建立新类型 |
| CREATE VIEW | 创建一个新的视图 |
| DEALLOCATE | 取消分配准备好的语句 |
| DELETE | 从表中删除行 |
| DO | 执行一个匿名代码块 |
| DROP AGGREGATE | 删除汇总 |
| DROP CAST | 删除类型转换 |
| DROP DATABASE | 从系统中删除数据库 |
| DROP DOMAIN | 删除网域 |
| DROP EXTENSION | 删除扩展 |
| DROP FUNCTION | 删除功能 |
| DROP GROUP | 删除组（角色） |
| DROP OPERATOR | 删除运算符 |
| DROP OPERATOR CLASS | 删除操作员类别 |
| DROP OWNED | 删除角色拥有的对象 |
| DROP POLICY | 删除行级安全策略 |
| DROP PROCEDURE | 删除程序 |
| DROP ROLE | 删除角色（用户或组） |
| DROP RULE | 删除规则 |
| DROP SEQUENCE | 删除序列发生器 |
| DROP TABLE | 从数据库中删除表 |
| DROP TRIGGER | 删除触发器 |
| DROP TYPE | 删除用户定义的类型 |
| DROP USER | 删除用户（角色） |
| END | 提交事务 |
| EXECUTE | 执行准备好的语句 |
| EXPLAIN | 显示语句的执行计划 |
| INSERT | 在表格中插入行 |
| LOCK | 锁定 |
| PREPARE | 准备一份声明 |
| REASSIGN OWNED | 重新分配拥有的对象 |
| RESET | 将参数重置为出厂设置 |
| REVOKE | 删除访问权限 |
| ROLLBACK | 回滚事务 |
| SELECT | 从表中选择行 |
| SET | 设置系统，会话或事务参数 |
| SET CONSTRAINTS | 设置当前交易的约束 |
| SET ROLE | 设定角色 |
| SET SESSION AUTHORIZATION | 设置会话授权 |
| SET TRANSACTION | 设置事务行为 |
| SHOW | 显示系统，会话或事务参数的值 |
| SHOW TRANSACTION | 显示交易的属性 |
| TRUNCATE | 清除表格中的所有行 |
| UPDATE | 更新表中的行 |

## 数据定义语言（DDL） [*link*](#%e6%95%b0%e6%8d%ae%e5%ae%9a%e4%b9%89%e8%af%ad%e8%a8%80ddl)

DDL语句通过CREATE、ALTER和DROP命令来定义数据库中的结构、更改定义以及删除定义。

| 声明 | 描述 |
| --- | --- |
| ALTER DATABASE | 更改数据库定义 |
| ALTER SEQUENCE | 更改序列发生器的定义 |
| ALTER TABLE | 更改表定义 |
| CREATE AGGREGATE | 创建一个新的聚集函数 |
| CREATE CAST | 创建新的类型转换 |
| CREATE DATABASE | 创建一个新的数据库 |
| CREATE EXTENSION | 加载扩展 |
| CREATE FUNCTION | 创建一个新功能 |
| CREATE INDEX | 创建一个新索引 |
| CREATE OPERATOR | 创建一个新的运算符 |
| CREATE OPERATOR CLASS | 创建一个新的运算符类 |
| CREATE PROCEDURE | 创建一个新程序 |
| CREATE RULE | 创建一条新规则 |
| CREATE SCHEMA | 创建一个新的架构（命名空间） |
| CREATE SEQUENCE | 创建一个新的序列生成器 |
| CREATE TABLE | 创建一个新表 |
| CREATE TABLE AS | 创建一个新表 |
| CREATE TRIGGER | 创建一个新触发器 |
| CREATE TYPE | 创建一种新的类型 |
| CREATE VIEW | 创建一个新的视图 |
| DROP AGGREGATE | 删除汇总 |
| DROP CAST | 删除类型转换 |
| DROP DATABASE | 从系统中删除数据库 |
| DROP EXTENSION | 删除扩展 |
| DROP FUNCTION | 删除功能 |
| DROP OPERATOR | 删除运算符 |
| DROP OPERATOR CLASS | 删除运算符类 |
| DROP PROCEDURE | 删除一个过程 |
| DROP RULE | 删除程序 |
| DROP SEQUENCE | 删除序列发​​生器 |
| DROP TABLE | 从数据库中删除表 |
| DROP TYPE | 删除用户定义的类型 |
| DROP TRIGGER | 删除触发器 |
| TRUNCATE | 清空一个表或者一组表 |

## 数据操作语言（DML） [*link*](#%e6%95%b0%e6%8d%ae%e6%93%8d%e4%bd%9c%e8%af%ad%e8%a8%80dml)

DML语句修改数据库的内容。

| 声明 | 描述 |
| --- | --- |
| DELETE | 从表中删除行 |
| INSERT | 向表插入行 |
| SELECT | 从表中选择行 |
| UPDATE | 更新表中的行 |

## 数据控制语言（DCL） [*link*](#%e6%95%b0%e6%8d%ae%e6%8e%a7%e5%88%b6%e8%af%ad%e8%a8%80dcl)

DCL语句可以保护并防止数据库损坏。

| 声明 | 描述 |
| --- | --- |
| ALTER DEFAULT PRIVILEGES | 定义默认访问权限 |
| ALTER GROUP | 变更群组 |
| ALTER POLICY | 更改行级安全策略 |
| ALTER ROLE | 更改角色（用户或组） |
| ALTER USER | 更改用户 |
| CREATE GROUP | 创建一个新组（角色） |
| CREATE POLICY | 创建一个新的行级安全策略 |
| CREATE ROLE | 创建一个新角色（用户或组） |
| CREATE USER | 创建一个新用户（角色） |
| DROP GROUP | 移除群组 |
| DROP POLICY | 删除行级安全策略 |
| DROP ROLE | 删除角色（用户或组） |
| DROP OWNED | 删除拥有的对象 |
| DROP USER | 删除用户 |
| GRANT | 授予权限 |
| REASSIGN OWNED | 重新分配拥有对象 |
| REVOKE | 撤销权限 |
| SET ROLE | 设定角色 |
| SET SESSION AUTHORIZATION | 设置会话授权 |

## 事务控制语言（TCL） [*link*](#%e4%ba%8b%e5%8a%a1%e6%8e%a7%e5%88%b6%e8%af%ad%e8%a8%80tcl)

TCL语句管理数据库上的事务。

| 声明 | 描述 |
| --- | --- |
| ABORT | 回滚事务 |
| BEGIN | 开始事务 |
| COMMIT | 提交事务 |
| END | 提交事务 |
| ROLLBACK | 回滚事务 |
| SET CONSTRAINTS | 设置当前事务的约束 |
| SET TRANSACTION | 设置事务行为 |
| SHOW TRANSACTION | 显示事务的属性 |

## 会话和系统控制 [*link*](#%e4%bc%9a%e8%af%9d%e5%92%8c%e7%b3%bb%e7%bb%9f%e6%8e%a7%e5%88%b6)

| 声明 | 描述 |
| --- | --- |
| RESET | 将参数重置为出厂设置 |
| SET | 设置系统，会话或事务参数 |
| SHOW | 显示系统，会话或事务参数的值 |

## 性能控制 [*link*](#%e6%80%a7%e8%83%bd%e6%8e%a7%e5%88%b6)

| 声明 | 描述 |
| --- | --- |
| DEALLOCATE | 取消分配准备好的语句 |
| EXECUTE | 执行准备好的语句 |
| EXPLAIN | 解释陈述的执行计划 |
| PREPARE | 准备一份声明 |

## 其他声明 [*link*](#%e5%85%b6%e4%bb%96%e5%a3%b0%e6%98%8e)

| 声明 | 描述 |
| --- | --- |
| COPY | 在表和文件之间复制数据 |
| DO | 执行一个匿名代码块 |

## ABORT [*link*](#abort)

**概要**

使用ABORT语句回滚当前事务，并丢弃该事务的所有更新。

**语法**

```
abort ::= ABORT [ TRANSACTION |  WORK ]
```

**语义**

ABORT [ TRANSACTION | WORK ] WORK 可选。

TRANSACTION 可选，目前 SERIALIZABLE隔离级别暂不支持。

**例子**

创建一个名为sample的表。

```
CREATE TABLE sample(k1 int,  k2 int, v1 int, v2 text, PRIMARY KEY (k1, k2));
```

在一个终端上创建一个事务并插入一些记录。

```
BEGIN TRANSACTION;
SET TRANSACTION ISOLATION LEVEL  REPEATABLE READ;
INSERT INTO sample(k1, k2, v1, v2) VALUES (1, 2.0, 3,  'a'), (1, 3.0, 4, 'b');
```

在第二个终端上创建一个事务并插入一些记录。

```
BEGIN TRANSACTION;
SET TRANSACTION ISOLATION LEVEL  REPEATABLE READ;
INSERT INTO sample(k1, k2, v1, v2) VALUES (2, 2.0, 3,  'a'), (2, 3.0, 4, 'b');
```

在第一个终端上查看结果。

```
SELECT * FROM sample; -- run in first shell

k1 | k2 | v1 |  v2

----+----+----+----

1 | 2 |   3 | a

1 | 3 |   4 | b

(2 rows)
```

第二个终端上查看结果。

```
SELECT * FROM sample; -- run in second shell

k1 | k2 | v1 |  v2

----+----+----+----

2 | 2 |   3 | a

2 | 3 |   4 | b

(2 rows)
```

在第二个终端上提交事务。

```
COMMIT TRANSACTION; -- run in first shell.
```

在第二个终端上终止事务。

```
ABORT TRANSACTION; -- run second shell.
```

查看表中的记录。

```
SELECT * FROM sample; -- run in first shell.

k1 | k2 | v1 |  v2

----+----+----+----

1 | 2 |   3 | a

1 | 3 |   4 | b

(2 rows)
```

```
SELECT * FROM sample; -- run in second shell.

k1 | k2 | v1 |  v2

----+----+----+----

1 | 2 |   3 | a

1 | 3 |   4 | b

(2 rows)
```

## ALTER DATABASE [*link*](#alter-database)

**概要**

使用该ALTER DATABASE语句重新定义数据库的属性。

**语法**

```
alter_database ::= ALTER DATABASE name
                     [ [ WITH ] alter_database_option [ ... ]
                       | RENAME TO name
                       | OWNER TO { new_owner
 	                              |  CURRENT_USER
 	                              |  SESSION_USER }
                        SET TABLESPACE new_tablespace
                       | SET configuration_parameter { TO | = }
                          { value | DEFAULT }
                       | SET configuration_parameter FROM CURRENT
                       | RESET configuration_parameter
                       | RESET ALL ]

alter_database_option ::= ALLOW_CONNECTIONS allowconn
                             | CONNECTION LIMIT  connlimit
                             | IS_TEMPLATE  istemplate
```

**语义**

name待修改的数据库名

tablespace\_name 指定与食宿句酷关联的新表空间

ALLOW\_CONNECTIONS 指定false以禁止与此数据库的连接。默认值为true，允许任何具有CREATEDB权限的用户克隆此数据库。

CONNECTION\_LIMIT 指定可以与此数据库建立多少个并发连接。默认值-1允许无限的并发连接。

IS\_TEMPLATE 设置为true代表任何具有CREATEDB权限的用户都可以克隆此数据库。指定false时仅超级用户或数据库所有者可以克隆它。

## ALTER DEFAULT PRIVILEGES [*link*](#alter-default-privileges)

**概要**

使用该ALTER DEFAULT PRIVILEGES语句定义默认访问权限。

**语法**

```
alter_default_priv ::= ALTER DEFAULT PRIVILEGES
                           [ FOR { ROLE | USER } role_name [ , ... ] ]
                           [ IN SCHEMA schema_name [ , ... ] ]
                           abbr_grant_or_revoke

abbr_grant_or_revoke ::= a_grant_table
                              | a_grant_seq
                              | a_grant_func
                              | a_grant_type
                              | a_grant_schema
                              | a_revoke_table
                              | a_revoke_seq
                              | a_revoke_func
                              | a_revoke_type
                              | a_revoke_schema

a_grant_table ::= GRANT { grant_table_priv [ , ... ]
                            | ALL [ PRIVILEGES  ] } ON TABLES TO
                    grant_role_spec [ , ... ] [ WITH GRANT  OPTION ]

a_grant_seq ::= GRANT { grant_seq_priv [ , ... ]
                          | ALL [ PRIVILEGES ] } ON SEQUENCES TO
                  grant_role_spec [ , ... ] [ WITH GRANT OPTION ]

a_grant_func ::= GRANT { EXECUTE | ALL [ PRIVILEGES ] }  ON
                   { FUNCTIONS | ROUTINES } TO grant_role_spec [ , ... ]
                   [ WITH GRANT OPTION ]

a_grant_type ::= GRANT { USAGE | ALL [ PRIVILEGES ] }  ON TYPES TO
                   grant_role_spec [ , ... ] [ WITH GRANT OPTION ]

a_grant_schema ::= GRANT { USAGE | CREATE | ALL [  PRIVILEGES ] } ON
                     SCHEMAS TO grant_role_spec [ , ... ]
                     [ WITH GRANT OPTION ]

a_revoke_table ::= REVOKE [ GRANT OPTION FOR ]
                      { grant_table_priv [ , ... ] | ALL [ PRIVILEGES ] }
                      ON TABLES FROM grant_role_spec [ , ... ]
                      [ CASCADE | RESTRICT ]

a_revoke_seq ::= REVOKE [ GRANT OPTION FOR ]
                    { grant_seq_priv [ , ... ] | ALL  [ PRIVILEGES ] } ON
                    SEQUENCES FROM grant_role_spec [ , ... ]
                    [ CASCADE | RESTRICT ]

a_revoke_func ::= REVOKE [ GRANT OPTION FOR ]
                    { EXECUTE | ALL [ PRIVILEGES ] } ON
                    { FUNCTIONS | ROUTINES } FROM grant_role_spec
                    [ , ... ] [ CASCADE | RESTRICT ]

a_revoke_type ::= REVOKE [ GRANT OPTION FOR ]
                    { USAGE | ALL [ PRIVILEGES ] } ON TYPES FROM
                    grant_role_spec [ , ... ] [ CASCADE |  RESTRICT ]

a_revoke_schema ::= REVOKE [ GRANT OPTION FOR ]
                    { USAGE | CREATE | ALL [ PRIVILEGES ] } ON SCHEMAS
                    FROM grant_role_spec [ , ... ]
                    [ CASCADE | RESTRICT ]

grant_table_priv ::= SELECT
                       | INSERT
                       | UPDATE
                       | DELETE
                       | TRUNCATE
                       | REFERENCES
                       | TRIGGER

grant_seq_priv ::= USAGE | SELECT | UPDATE

grant_role_spec ::= [ GROUP ] role_name
                       | PUBLIC
                       | CURRENT_USER
                       | SESSION_USER
```

**语义**

ALTER DEFAULT PRIVILEGES定义将来创建的对象的特权。它不会影响已经创建的对象。 用户只能更改由其或其成员所创建的对象的默认特权。

**例子**

授权所有用户使用SELECT访问marketing schema中所有表的权限

```
ALTER DEFAULT PRIVILEGES IN  SCHEMA marketing GRANT SELECT ON TABLES TO PUBLIC;
```

取消用户john使用任意表时，使用INSERT语句的权限

```
ALTER DEFAULT PRIVILEGES  REVOKE INSERT ON TABLES FROM john;
```

## ALTER DOMAIN [*link*](#alter-domain)

**概要**

使用该ALTER DOMAIN语句更改现有域的定义。

**语法**

```
alter_domain_default ::= ALTER DOMAIN name
                          { SET DEFAULT expression | DROP DEFAULT }

alter_domain_rename ::= ALTER DOMAIN name RENAME TO  name
```

**语义**

SET DEFAULT | DROP DEFAULT 设置或删除域的默认值。

RENAME 更改域名。

name 指定域的名称。如果DOMAIN name不存在或DOMAIN new\_name已经存在，则会提示错误。

**例子**

```
CREATE DOMAIN idx DEFAULT 5 CHECK (VALUE > 0);

ALTER DOMAIN idx DROP DEFAULT;

ALTER DOMAIN idx RENAME TO idx_new;

DROP DOMAIN idx_new;
```

## ALTER GROUP [*link*](#alter-group)

**概要**

使用该ALTER GROUP语句更改组（角色）的属性。添加它是为了与Postgres兼容。不鼓励使用。ALTER ROLE是更改角色属性的首选方法。

**语法**

```
alter_group ::= ALTER GROUP role_specification { ADD |  DROP } USER
                  role_name [ , ... ]

role_specification ::= role_name | CURRENT_USER |  SESSION_USER

alter_group_rename ::= ALTER GROUP role_name RENAME TO  new_role_name
```

**语义**

ALTER GROUP可用于在组中添加或删除角色。请使用GRANT或REVOKE代替。也可以用来重命名角色。

## ALTER POLICY [*link*](#alter-policy)

**概要**

使用该ALTER POLICY语句可以更改现有行级安全策略的定义。它可用于更改策略适用的角色以及策略的USING和CHECK表达式。

**语法**

```
alter_policy ::= ALTER POLICY name ON table_name
                    [ TO { role_name
                            | PUBLIC
                            | CURRENT_USER
                            | SESSION_USER } [ , ... ] ]
                    [ USING ( using_expression ) ]
                    [ WITH CHECK ( check_expression ) ]

alter_policy_rename ::= ALTER POLICY name ON table_name  RENAME TO
                          new_name
```

**语义**

name 是要更新的策略的名称。

table\_name 是应用策略的表的名称。

new\_name 测略的新名称

role\_name 该策略使用的橘色，如使用PUBLIC则策略适用于所有角色

using\_expression 是SQL条件表达式，满足条件的行将在SELECT中可见，在UPDATE和DELETE修改操作中有效。

check\_expression 是SQL条件表达式，仅被用在INSERT和UPDATE查询中。条件为true的内容允许INSERT和UPDATE。与using\_expression不同，它使用来检查新内容的。

**例子**

重命名策略。

```
ALTER POLICY p1 ON table_foo RENAME TO p2;
```

将策略应用于所有角色。

```
ALTER POLICY p1 ON table_foo TO PUBLIC;
```

## ALTER ROLE [*link*](#alter-role)

**概要**

使用ALTER ROLE语句更改角色（用户或组）的属性。 超级用户可以更改任何角色的属性。具有CREATEROLE权限的角色可以更改任何非超级用户角色的属性。其他角色只能更改自己的密码。

**语法**

```
alter_role ::= ALTER ROLE role_specification
                  [ [ WITH ] alter_role_option [  , ... ] ]

alter_role_option ::= SUPERUSER
                         | NOSUPERUSER
                         | CREATEDB
                         | NOCREATEDB
                         | CREATEROLE
                         | NOCREATEROLE
                         | INHERIT
                         | NOINHERIT
                         | LOGIN
                         | NOLOGIN
                         | CONNECTION LIMIT connlimit
                         | [ ENCRYPTED ]  PASSWORD ' password '
                         | PASSWORD NULL
                         | VALID UNTIL ' timestamp '

role_specification ::= role_name | CURRENT_USER |  SESSION_USER

alter_role_rename ::= ALTER ROLE role_name RENAME TO  new_role_name

alter_role_config ::= ALTER ROLE { role_specification |  ALL }
                         [ IN DATABASE database_name ] config_setting

config_setting ::= SET config_param { TO | = }
                         { config_value | DEFAULT }
                         | SET config_param FROM CURRENT
                         | RESET config_param
                         | RESET ALL
```

**语义**

role\_specification 指定要更改其属性的角色的名称或当前用户或当前会话用户。

SUPERUSER，NOSUPERUSER 确定角色是否是“超级用户”。超级用户可以覆盖所有访问限制，应谨慎使用。只有具有SUPERUSER权限的角色才能创建其他SUPERUSER角色。

CREATEDB，NOCREATEDB 确定角色是否可以创建数据库。

CREATEROLE，NOCREATEROLE 确定角色是否可以创建其他角色。

INHERIT，NOINHERIT 确定角色是否继承其所属角色的特权。如果没有INHERIT，则另一个角色的成员资格仅授予SET ROLE权限给该另一个角色。其他角色的权限只有在这样做之后才可用。

LOGIN，NOLOGIN 确定是否允许新角色登录。客户端连接期间只能使用具有登录权限的角色。

CONNECTION LIMIT 指定角色可以建立的并发连接数。这仅适用于可以登录的角色。

[ENCRYPTED] PASSWORD 设置角色的密码。这仅适用于可以登录的角色。如果未指定密码，则密码将设置为null，并且该用户的密码身份验证将始终失败。请注意，密码始终以加密方式存储在系统目录中，并且仅出于与Postgres兼容而提供可选关键字ENCRYPTED。

VALID UNTIL 设置一个日期和时间，之后该角色的密码将不再有效。

config\_param, config\_value 是名称和配置参数被设置值

ALTER ROLE role\_name RENAME TO 可用于更改角色名称。请注意，当前会话角色无法重命名。因为MD5加密的密码使用角色名称作为加密盐，所以如果密码是MD5加密的，重命名角色将清除其密码。

ALTER ROLE SET | RESET config\_param 用于更改所有数据库的配置变量的角色会话默认值，或者用于更改指定数据库中的会话的IN DATABASE子句时的默认值。如果指定了ALL而不是角色名称，则将更改所有角色的设置。

**例子**

更改角色密码。

```
ALTER ROLE John WITH  PASSWORD 'new_password';
```

重命名角色。

```
ALTER ROLE John RENAME TO  Jane;
```

更改角色的default\_transaction\_isolation会话参数。

```
ALTER ROLE Jane SET  default_transaction_isolation='serializable';
```

## ALTER SEQUENCE [*link*](#alter-sequence)

**概要**

使用该ALTER SEQUENCE语句可以更改当前模式中现有序列的定义。

**语法**

```
alter_sequence ::= ALTER SEQUENCE [ IF EXISTS ] name
                      alter_sequence_options

name ::= '<Text Literal>'

alter_sequence_options ::= [ AS seq_data_type ]
                                 [ INCREMENT [ BY ]  increment ]
                                 [ MINVALUE  minvalue | NO MINVALUE ]
                                 [ MAXVALUE  maxvalue | NO MAXVALUE ]
                                 [ START [ WITH ]  start ]
                                 [ RESTART [ [ WITH  ] restart ] ]
                                 [ CACHE cache ]
                                 [ OWNED BY  table_name.table_column | NONE ]
```

**语义**

ALTER SEQUENCE sequence\_name [ IF EXISTS ] 指定序列的名称（sequence\_name）。如果当前架构中不存在具有该名称的序列，并且IF EXISTS未指定该序列，则会引发错误。

AS datatype 更改序列的数据类型。如果先前的值超出了新类型所允许的范围，则会自动更改序列的最小值和最大值。有效类型smallint，integer和bigint。

INCREMENT BY increment 指定序列中连续值之间的差。默认值为1。

MINVALUE minvalue | NO MINVALUE 指定序列中允许的最小值。如果达到此值（以负增量递增的顺序），nextval()将返回错误。如果NO MINVALUE指定，则使用默认值。默认值为1。 MAXVALUE maxvalue | NO MAXVALUE 指定序列中允许的最大值。如果达到此值，nextval()将返回错误。如果NO MAXVALUE指定，则使用默认值。默认值为263 - 1。

START WITH start 指定序列中的第一个值。start不能少于minvalue。默认值为1。

RESTART [ [ WITH ] restart ] ] 更改序列的当前值。如果未指定任何值，则当前值将设置START [ WITH ]为创建或更改序列时指定的最后一个值。

CACHE cache 指定序列中要在客户端中缓存的数字。默认值为1。 OWNED BY table\_name.table\_column | NONE 它将序列的所有权授予指定的列（如果有）。这意味着如果删除了列（或它所属的表），则序列将被自动删除。如果NONE指定，则将删除以前的所有所有权。

## ALTER TABLE [*link*](#alter-table)

**概要**

使用ALTER TABLE语句更改现有表的定义。

**语法**

```
alter_table ::= ALTER TABLE [ ONLY ] name [ * ]  alter_table_action
                   [  , ... ]

alter_table_action ::= ADD [ COLUMN ] column_name  data_type
                           [ alter_column_constraint [ ... ] ]
                           | RENAME TO table_name
                           | DROP [ COLUMN ] column_name
                             [ RESTRICT | CASCADE ]
                           | ADD  alter_table_constraint
                           | DROP CONSTRAINT constraint_name
                             [ RESTRICT | CASCADE ]
                           | RENAME [ COLUMN ] column_name TO column_name
                           | DISABLE ROW LEVEL SECURITY
                           | ENABLE ROW LEVEL SECURITY
                           | FORCE ROW LEVEL SECURITY
                           | NO FORCE ROW LEVEL SECURITY

alter_table_constraint ::= [ CONSTRAINT constraint_name  ]
                                 { CHECK (  expression )
                                   | UNIQUE (  column_names )
                                     index_parameters
                                   | FOREIGN KEY (  column_names )
                                     references_clause  }
                                 [ DEFERRABLE | NOT  DEFERRABLE ]
                                 [ INITIALLY  DEFERRED
                                   | INITIALLY  IMMEDIATE ]

alter_column_constraint ::= [ CONSTRAINT  constraint_name ]
                                 { NOT NULL
                                   | NULL
                                   | CHECK (  expression )
                                   | DEFAULT  expression
                                   | UNIQUE  index_parameters
                                   |  references_clause }
                                [ DEFERRABLE |  NOT DEFERRABLE ]
                                [ INITIALLY  DEFERRED
                                   | INITIALLY  IMMEDIATE ]
```

**语义**

ALTER TABLE [ ONLY ] name [ \* ] alter\_table\_action [ , … ] 更改指定的表和依赖项。

* ONLY 将更改限制为指定的表

ADD [ COLUMN ] column\_name data\_type constraint 添加具有指定数据类型和约束的指定列。

RENAME TO table\_name 将表重命名为指定的表名。

DROP [ COLUMN ] column\_name [ RESTRICT | CASCADE ] 从表中删除命名列。

* RESTRICT 仅删除指定的

ADD alter\_table\_constraint 添加具有指定数据类型和约束的指定列。

DROP CONSTRAINT constraint\_name [ RESTRICT | CASCADE ] 从表中删除命名列。

* RESTRICT —仅删除指定的约束。
* CASCADE —删除指定的约束和所有依赖关系。

\*\*RENAME [ COLUMN ] column\_name TO column\_name \*\* 将列重命名为指定名称。

ENABLE / DISABLE ROW LEVEL SECURITY 这将启用或禁用表的行级安全性。如果启用并且该表不存在任何策略，则将应用默认拒绝策略。如果禁用，则将不应用该表的现有策略，并将其忽略。有关如何创建行级安全策略的详细信息，请参见创建策略。

FORCE / NO FORCE ROW LEVEL SECURITY 当用户是表所有者时，这将控制表的行安全策略的应用。如果启用，则当用户是表所有者时，将应用行级安全策略。如果禁用（默认设置），则当用户是表所有者时，将不应用行级安全性。有关如何创建行级安全策略的详细信息，请参见创建策略。

CONSTRAINT constraint\_name 指定约束的名称。

Foreign key FOREIGN KEY和REFERENCES指定外键。它用于强制数据的参照完整性。 Unique 这将强制UNIQUE约束在表中指定的列集在表中是唯一的，也就是说，对于约束中指定的列集，没有两行可以具有相同的值 Check 这用于强制指定表中的数据满足该CHECK子句中指定的要求。 Default 用于指定列的默认值。如果INSERT语句未为该列指定值，则使用默认值。如果没有为列指定默认值，则默认值为NULL。

Deferrable constraints 可以使用该DEFERRABLE子句推迟约束。当前，在MemFire中只能推迟外键约束。在语句中的每一行之后，将检查不可延迟的约束。在可延迟约束的情况下，约束的检查可以推迟到事务结束。 标记为 INITIALLY IMMEDIATE 的约束将在语句中的每一行之后进行检查。 标记为 INITIALLY DEFERRED 的约束将在事务结束时检查。

## ALTER USER [*link*](#alter-user)

**概要**

使用该ALTER USER语句来更改角色。ALTER USER是 ALTER ROLE的 别名，用于更改角色。

**语法**

```
alter_user ::= ALTER USER role_specification
                  [  [ WITH ] alter_role_option [ , ... ] ]

alter_role_option ::= SUPERUSER
                         | NOSUPERUSER
                         | CREATEDB
                         | NOCREATEDB
                         | CREATEROLE
                         | NOCREATEROLE
                         | INHERIT
                         | NOINHERIT
                         | LOGIN
                         | NOLOGIN
                         | CONNECTION LIMIT connlimit
                         | [ ENCRYPTED ] PASSWORD '  password '
                         | PASSWORD NULL
                         | VALID UNTIL ' timestamp '

role_specification ::= role_name | CURRENT_USER |  SESSION_USER

alter_user_rename ::= ALTER USER role_name RENAME TO  new_role_name

alter_user_config ::= ALTER USER { role_specification |  ALL }
                         [ IN DATABASE database_name ] config_setting

config_setting ::= SET config_param { TO | = }
                       { config_value | DEFAULT }
                       | SET config_param FROM CURRENT
                       | RESET config_param
                       | RESET ALL
```

**语义**

参阅ALTER\_ROLE

## BEGIN [*link*](#begin)

**概要**

使用该BEGIN语句以默认（或给定）隔离级别启动新事务。

**语法**

```
BEGIN [ TRANSACTION | WORK ]
```

**语义**

ABORT [ TRANSACTION | WORK ] WORK 可选

**例子**

创建名为sample的表。

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text,  PRIMARY KEY (k1, k2));
```

启动一个事务并插入一些数据。

```
BEGIN TRANSACTION; SET TRANSACTION ISOLATION LEVEL  REPEATABLE READ;   INSERT INTO sample(k1, k2, v1, v2) VALUES (1, 2.0, 3,  'a'), (1, 3.0, 4, 'b');
```

启动第二个事务并插入一些记录。

```
BEGIN TRANSACTION; SET TRANSACTION ISOLATION LEVEL  REPEATABLE READ;   INSERT INTO sample(k1, k2, v1, v2) VALUES (2, 2.0, 3,  'a'), (2, 3.0, 4, 'b');
```

在每个事务中查看刚插入的内容。

```
SELECT * FROM sample; -- run in first shell
k1 | k2 | v1 |  v2
----+----+----+----
1 | 2 |   3 | a
1 | 3 |   4 | b
(2 rows)

SELECT * FROM sample; -- run in second shell
k1 | k2 | v1 |  v2
----+----+----+----
2 | 2 |   3 | a
2 | 3 |   4 | b
(2 rows)
```

提交第一个事务

```
COMMIT TRANSACTION; -- run  in first shell.
```

终止第二个事务

```
ABORT TRANSACTION; -- run  second shell.
```

查看最终结果

```
SELECT * FROM sample; -- run in first shell.
k1 | k2 | v1 |  v2
----+----+----+----
1 | 2 |   3 | a
1 | 3 |   4 | b
(2 rows)
```

## COMMENT [*link*](#comment)

**概要**

使用COMMENT语句设置，更新或删除数据库对象的注释。

**语法**

```
comment_on ::= COMMENT ON
              {  ACCESS METHOD object_name
                 | AGGREGATE aggregate_name ( aggregate_signature )
                 | CAST ( source_type AS target_type )
                 | COLLATION object_name
                 | COLUMN relation_name . column_name
                 | CONSTRAINT constraint_name ON table_name
                 | CONSTRAINT constraint_name ON DOMAIN domain_name
                 | CONVERSION object_name
                 | DATABASE object_name
                 | DOMAIN object_name
                 | EXTENSION object_name
                 | EVENT TRIGGER object_name
                 | FOREIGN DATA WRAPPER object_name
                 | FOREIGN TABLE object_name
                 | FUNCTION function_name [ ( function_signature ) ]
                 | INDEX object_name
                 | LARGE OBJECT large_object_oid
                 | OPERATOR operator_name ( operator_signature )
                 | OPERATOR CLASS object_name USING index_method
                 | OPERATOR FAMILY object_name USING index_method
                 | POLICY policy_name ON table_name
                 | [ PROCEDURAL ] LANGUAGE object_name
                 | PROCEDURE procedure_name
                   [ ( [ [ argmode ] [ argname ] argtype [ , ... ] ] ) ]
                 | PUBLICATION object_name
                 | ROLE object_name
                 | ROUTINE routine_name
                   [ ( [ [ argmode ] [ argname ] argtype [ , ... ] ] ) ]
                 | RULE rule_name ON table_name
                 | SCHEMA object_name
                 | SEQUENCE object_name
                 | SERVER object_name
                 | STATISTICS object_name
                 | SUBSCRIPTION object_name
                 | TABLE object_name
                 | TABLESPACE object_name
                 | TEXT SEARCH CONFIGURATION object_name
                 | TEXT SEARCH DICTIONARY object_name
                 | TEXT SEARCH PARSER object_name
                 | TEXT SEARCH TEMPLATE object_name
                 | TRANSFORM FOR type_name  LANGUAGE lang_name
                 | TRIGGER trigger_name ON table_name
                 | TYPE object_name
                 | VIEW object_name } IS { '<Text Literal>' | NULL }
```

**语义**

COMMENT ON 添加或更改有关数据库对象的注释。要删除评论，请将值设置为NULL。

**例子**

添加注释。

```
COMMENT ON DATABASE postgres IS 'Default database';

COMMENT ON INDEX index_name IS 'Special index';
```

删除注释。

```
COMMENT ON TABLE some_table IS NULL;
```

## COMMIT [*link*](#commit)

**概要**

使用COMMIT语句提交当前事务。事务所做的所有更改对其他人都可见，并且如果发生崩溃，则保证是持久的。

**语法**

```
commit ::= COMMIT [ TRANSACTION  | WORK ]
```

**语义**

```
COMMIT [ TRANSACTION | WORK  ]
```

WORK 可选

TRANSACTION 可选 SERIALIZABLE隔离级别暂不支持

**例子**

创建一个名为sample的表。

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text, PRIMARY KEY (k1, k2));
```

在一个终端上创建一个事务并插入一些记录。

```
BEGIN TRANSACTION; SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
INSERT INTO sample(k1, k2, v1, v2) VALUES (1, 2.0, 3,  'a'), (1, 3.0, 4, 'b');
```

在第二个终端上创建一个事务并插入一些记录。

```
BEGIN TRANSACTION; SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
INSERT INTO sample(k1, k2, v1, v2) VALUES (2, 2.0, 3,  'a'), (2, 3.0, 4, 'b');
```

在第一个终端上查看结果。

```
SELECT * FROM sample; -- run in first shell
k1 | k2 | v1 |  v2
----+----+----+----
1 | 2 | 3 | a
1 | 3 | 4 | b
(2 rows)
```

第二个终端上查看结果。

```
SELECT * FROM sample; -- run in second shell
k1 | k2 | v1 |  v2
----+----+----+----
2 | 2 | 3 | a
2 | 3 | 4 | b
(2 rows)
```

在第二个终端上提交事务。

```
COMMIT TRANSACTION; -- run in first shell.
```

在第二个终端上终止事务。

```
ABORT TRANSACTION; -- run second shell.
```

查看表中的记录。

```
SELECT * FROM sample; -- run in first shell.
k1 | k2 | v1 |  v2
----+----+----+----
1 | 2 | 3 | a
1 | 3 | 4 | b
(2 rows)
```

```
SELECT * FROM sample; -- run in second shell.
k1 | k2 | v1 |  v2
----+----+----+----
1 | 2 | 3 | a
1 | 3 | 4 | b
(2 rows)
```

## COPY [*link*](#copy)

**概要**

使用COPY语句在表和文件之间传输数据。COPY TO将数据从表复制到文件。COPY FROM将数据从文件复制到表。COPY输出已复制的行数。

**语法**

```
copy_from ::= COPY table_name [ ( column_name [ , ... ]  ) ] FROM
                {  'filename' | PROGRAM 'command' | STDIN }
                [ [  WITH ] ( option [ , ... ] ) ]

copy_to ::= COPY { table_name [ ( column_names ) ] | (  query ) } TO
                {  'filename' | PROGRAM 'command' | STDOUT }
                [ [  WITH ] ( option [ , ... ] ) ]

copy_option ::= FORMAT format_name
                  |  OIDS [ boolean ]
                  |  FREEZE [ boolean ]
                  |  DELIMITER 'delimiter_character'
                  |  NULL 'null_string'
                  |  HEADER [ boolean ]
                  |  QUOTE 'quote_character'
                  |  ESCAPE 'escape_character'
                  |  FORCE_QUOTE { ( column_names ) | * }
                  |  FORCE_NOT_NULL ( column_names )
                  |  FORCE_NULL ( column_names )
                  |  ENCODING 'encoding_name'
```

**语义**

table\_name 指定要复制的表（可以选择模式限定的表）。

column\_name 指定要复制的列的列表。如果未指定，则将复制表的所有列。

query 指定SELECT，VALUES，INSERT，UPDATE，或DELETE语句，它的结果将被复制。对于INSERT，UPDATE和DELETE语句，必须提供RETURNING子句。

filename 指定要复制的文件的路径。输入文件名可以是绝对路径或相对路径，但输出文件名必须是绝对路径。

**例子**

* 如果表不存在，则会引发错误。
* COPY TO 只能与常规表一起使用。
* COPY FROM 可以与表，外部表或视图一起使用。

## CREATE AGGREGATE [*link*](#create-aggregate)

**概要**

使用CREATE AGGREGATE语句创建一个新的聚合函数。有三种创建聚合的方法。

**语法**

```
create_aggregate ::= create_aggregate_normal
                        | create_aggregate_order_by
                        | create_aggregate_old

create_aggregate_normal ::= CREATE AGGREGATE  aggregate_name (
                                { aggregate_arg [  , ... ] | * } ) ( SFUNC
                                = sfunc , STYPE =  state_data_type
                                [ ,  aggregate_normal_option [ ... ] ] )

create_aggregate_order_by ::= CREATE AGGREGATE  aggregate_name (
                                [ aggregate_arg  [ , ... ] ] ORDER BY
                                aggregate_arg [  , ... ] ) ( SFUNC =
                                sfunc , STYPE =  state_data_type
                                [ ,  aggregate_order_by_option [ ... ] ]
                                )

create_aggregate_old ::= CREATE AGGREGATE  aggregate_name ( BASETYPE =
                            base_type , SFUNC = sfunc , STYPE =
                            state_data_type
                            [ , aggregate_old_option [ ... ] ] )

aggregate_arg ::= [ aggregate_argmode ] [ argname ]  argtype

aggregate_normal_option ::= SSPACE = state_data_size
                               | FINALFUNC =  ffunc
                               | FINALFUNC_EXTRA
                               |  FINALFUNC_MODIFY =
                                  { READ_ONLY |  SHAREABLE | READ_WRITE }
                               | COMBINEFUNC =  combinefunc
                               | SERIALFUNC =  serialfunc
                               | DESERIALFUNC =  deserialfunc
                               | INITCOND =  initial_condition
                               | MSFUNC = msfunc
                               | MINVFUNC = minvfunc
                               | MSTYPE =  mstate_data_type
                               | MSSPACE =  mstate_data_size
                               | MFINALFUNC =  mffunc
                               |  MFINALFUNC_EXTRA
                               | MFINALFUNC_MODIFY =
                                  { READ_ONLY |  SHAREABLE | READ_WRITE }
                               | MINITCOND =  minitial_condition
                               | SORTOP =  sort_operator
                               | PARALLEL =
                                  { SAFE |  RESTRICTED | UNSAFE }

aggregate_order_by_option ::= SSPACE = state_data_size
                                 | FINALFUNC =  ffunc
                                 |  FINALFUNC_EXTRA
                                 |  FINALFUNC_MODIFY =
                                    { READ_ONLY |  SHAREABLE | READ_WRITE }
                                 | INITCOND =  initial_condition
                                 | PARALLEL =
                                    { SAFE | RESTRICTED | UNSAFE }
                                 | HYPOTHETICAL

aggregate_old_option ::= SSPACE = state_data_size
                           | FINALFUNC = ffunc
                           | FINALFUNC_EXTRA
                           | FINALFUNC_MODIFY =
                              { READ_ONLY |  SHAREABLE | READ_WRITE }
                           | COMBINEFUNC = combinefunc
                           | SERIALFUNC = serialfunc
                           | DESERIALFUNC = deserialfunc
                           | INITCOND =  initial_condition
                           | MSFUNC = msfunc
                           | MINVFUNC = minvfunc
                           | MSTYPE = mstate_data_type
                           | MSSPACE = mstate_data_size
                           | MFINALFUNC = mffunc
                           | MFINALFUNC_EXTRA
                           | MFINALFUNC_MODIFY =
                              { READ_ONLY |  SHAREABLE | READ_WRITE }
                           | MINITCOND = minitial_condition
                           | SORTOP = sort_operator
```

**语义**

选项的顺序无关紧要。甚至强制性选项BASETYPE，SFUNC和STYPE 可能以任何顺序出现。

请参见[PostgreSQL docs] [postgresql-docs-create-aggregate]中每个选项的语义。

**例子**

普通语法示例。

```
CREATE AGGREGATE sumdouble (float8) (
           STYPE = float8,
           SFUNC = float8pl,
           MSTYPE = float8,
           MSFUNC = float8pl,
           MINVFUNC = float8mi
           );

CREATE TABLE normal_table(
          f  float8,
          i  int
        );

INSERT INTO normal_table(f, i) VALUES
          (0.1, 9),
          (0.9, 1);

SELECT sumdouble(f), sumdouble(i) FROM normal_table;
```

带排序的语法示例。

```
CREATE AGGREGATE my_percentile_disc(float8 ORDER BY  anyelement) (
           STYPE = internal,
           SFUNC = ordered_set_transition,
           FINALFUNC = percentile_disc_final,
           FINALFUNC_EXTRA = true,
           FINALFUNC_MODIFY = read_write
        );

SELECT my_percentile_disc(0.1), my_percentile_disc(0.9)
           WITHIN GROUP (ORDER BY typlen)
           FROM  pg_type;
```

旧的语法示例。

```
CREATE AGGREGATE oldcnt(
          SFUNC = int8inc,
          BASETYPE = 'ANY',
          STYPE = int8,
          INITCOND = '0'
       );

SELECT oldcnt(*) FROM pg_aggregate;
```

零参数聚合示例。

```
CREATE AGGREGATE newcnt(*) (
          SFUNC = int8inc,
          STYPE = int8,
          INITCOND = '0',
          PARALLEL = SAFE
       );

SELECT newcnt(*) FROM pg_aggregate;
```

## CREATE CAST [*link*](#create-cast)

**概要**

使用CREATE CAST语句创建新的数据转换。

**语法**

```
create_cast ::= create_cast_with_function
                    |  create_cast_without_function
                    |  create_cast_with_inout

create_cast_with_function ::= CREATE CAST (  cast_signature ) WITH
                                  FUNCTION function_name
                                  [ (  function_signature ) ]
                                  [ AS ASSIGNMENT  | AS IMPLICIT ]

create_cast_without_function ::= CREATE CAST (  cast_signature ) WITHOUT  FUNCTION
                                   [ AS  ASSIGNMENT | AS IMPLICIT ]

create_cast_with_inout ::= CREATE CAST ( cast_signature  ) WITH INOUT
                              [ AS ASSIGNMENT |  AS IMPLICIT ]

cast_signature ::= source_type AS target_type
```

**语义**

请参见[PostgreSQL docs] [postgresql-docs-create-cast]中每个选项的语义。

**例子**

WITH FUNCTION例子。

```
CREATE FUNCTION sql_to_date(integer) RETURNS date AS $$
          SELECT $1::text::date
          $$  LANGUAGE SQL IMMUTABLE STRICT;

CREATE CAST (integer AS date) WITH FUNCTION  sql_to_date(integer) AS ASSIGNMENT;  SELECT CAST (3 AS date);
```

WITHOUT FUNCTION例子。

```
CREATE TYPE myfloat4;

CREATE FUNCTION myfloat4_in(cstring) RETURNS myfloat4
           LANGUAGE internal IMMUTABLE STRICT  PARALLEL SAFE AS 'float4in';

CREATE FUNCTION myfloat4_out(myfloat4) RETURNS cstring
           LANGUAGE internal IMMUTABLE STRICT PARALLEL SAFE AS 'float4out';

CREATE TYPE myfloat4 (
           INPUT = myfloat4_in,
           OUTPUT = myfloat4_out,
           LIKE  = float4
        );

SELECT CAST('3.14'::myfloat4 AS float4);

CREATE CAST (myfloat4 AS float4) WITHOUT FUNCTION;

SELECT CAST('3.14'::myfloat4 AS float4);
```

WITH INOUT例子。

```
CREATE TYPE myint4;

CREATE FUNCTION myint4_in(cstring) RETURNS myint4
           LANGUAGE internal IMMUTABLE STRICT PARALLEL SAFE AS 'int4in';

CREATE FUNCTION myint4_out(myint4) RETURNS cstring
           LANGUAGE internal IMMUTABLE STRICT PARALLEL SAFE AS 'int4out';

CREATE TYPE myint4 (
           INPUT = myint4_in,
           OUTPUT = myint4_out,
           LIKE  = int4
        );

SELECT CAST('2'::myint4 AS int4);

CREATE CAST (myint4 AS int4) WITH INOUT;

SELECT CAST('2'::myint4 AS int4);
```

## CREATE DATABASE [*link*](#create-database)

**概要**

使用CREATE DATABASE语句创建一个数据库。

**语法**

```
create_database ::= CREATE DATABASE name [  create_database_options ]

create_database_options ::= [ WITH ] [ OWNER [ = ]  user_name ]
                                [ TEMPLATE [ = ]  template ]
                                [ ENCODING [ = ]  encoding ]
                                [ LC_COLLATE [ =  ] lc_collate ]
                                [ LC_CTYPE [ = ]  lc_ctype ]
                                [ TABLESPACE [ = ]  tablespace_name ]
                                [  ALLOW_CONNECTIONS [ = ] allowconn ]
                                [ COLOCATED [ = ]  { 'true' | 'false' } ]
```

**语义**

CREATE DATABASE name 指定要创建的数据库的名称。如果要创建的数据库name已经存在，则会返回错误。

[ WITH ] OWNER user\_name 指定将拥有新数据库的用户的角色名称。如果未指定，则数据库创建者为所有者。

TEMPLATE template 指定用于创建新数据库的模板的名称。

ENCODING encoding 指定在新数据库中使用的字符集编码。

LC\_COLLATE lc\_collate 指定排序顺序 (LC\_COLLATE),目前只支持C。

LC\_CTYPE lc\_ctype 指定字符分类（LC\_CTYPE），目前只支持utf-8。

TABLESPACE tablespace\_name 指定与数据库关联的新表空间。

ALLOW\_CONNECTIONS allowconn 指定false时禁止连接数据库。默认值为true，允许连接数据库。

COLOCATED 指定true此数据库的所有表是否应位于同一tablet上。查看并置表架构 有关何时使用共置表的详细信息。默认值为false，数据库中的每个表都有自己的一组tablet。

**例子**

创建一个并置数据库。

```
CREATE DATABASE company WITH  COLOCATED = true;
```

在此示例中，数据库company中的所有表都放置在同一个tablet上

## CREATE DOMAIN [*link*](#create-domain)

**概要**

使用CREATE DOMAIN语句来创建新的域。

**语法**

```
create_domain ::= CREATE DOMAIN name [ AS ] data_type
                    [ DEFAULT expression ]
                    [ [ domain_constraint [ ... ] ] ]

domain_constraint ::= [ CONSTRAINT constraint_name ]
                          { NOT NULL | NULL | CHECK ( expression ) }
```

**语义**

CREATE DOMAIN name 指定域的名称。如果name中已存在，则会引发错误。

AS data\_type 指定基础数据类型。

DEFAULT expression 为域设置默认值。

CONSTRAINT constraint\_name 指定约束的名称。

NOT NULL 不允许为空值。 NULL 允许为空值（默认）。 CHECK ( expression ) 域值必须满足的约束，返回布尔值。表达式为 为TRUE或UNKNOWN时代表成功。

**例子**

```
CREATE DOMAIN phone_number AS TEXT CHECK(VALUE ~ '^\d{3}-\d{3}-\d{4}$');
```

```
CREATE TABLE person(first_name TEXT, last_name TEXT, phone_number phone_number);
```

## CREATE EXTENSION [*link*](#create-extension)

**概要**

使用CREATE EXTENSION语句将扩展加载到数据库中。

**语法**

```
create_extension ::= CREATE EXTENSION [ IF NOT EXISTS ]  extension_name
                     [ WITH ] [ SCHEMA schema_name ]
                     [ VERSION version ] [ CASCADE ]
```

**语义**

SCHEMA, VERSION和CASCADE可以乱序。

**例子**

```
CREATE SCHEMA myschema;
```

```
CREATE EXTENSION pgcrypto WITH SCHEMA myschema VERSION  '1.3';
```

```
CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;
```

## CREATE FUNCTION [*link*](#create-function)

**概要**

使用CREATE FUNCTION语句在数据库中定义新功能。

**语法**

```
create_function ::= CREATE [ OR REPLACE ] FUNCTION name  (
                      [ arg_decl [ , ... ] ] )
                      [ RETURNS type_name
                         | RETURNS TABLE ( { column_name type_name }
                            [ , ... ] ) ]
                      { LANGUAGE lang_name
                         | TRANSFORM { FOR TYPE type_name } [ , ... ]
                         | WINDOW
                         | IMMUTABLE
                         | STABLE
                         | VOLATILE
                         | [ NOT ] LEAKPROOF
                         | CALLED ON NULL INPUT
                         | RETURNS NULL ON NULL INPUT
                         | STRICT
                         | [ EXTERNAL ] SECURITY INVOKER
                         | [ EXTERNAL ] SECURITY DEFINER
                         | PARALLEL { UNSAFE |  RESTRICTED | SAFE }
                         | COST int_literal
                         | ROWS int_literal
                         | SET configuration_parameter
                            { TO value | = value | FROM CURRENT }
                         | AS 'definition'
                         | AS 'obj_file' 'link_symbol' } [ ... ]

arg_decl ::= [ argmode ] [ argname ] argtype
                [ {  DEFAULT | = } expression ]
```

**语义**

* 如果给定name和参数类型的函数已经存在，那么CREATE FUNCTION除非使用CREATE OR REPLACE FUNCTION版本，否则将引发错误。在这种情况下，它将替换任何现有定义。
* 默认支持的语言包括sql，plpgsql和C
* VOLATILE，STABLE并IMMUTABLE告知查询优化器该函数的行为。
* + VOLATILE是默认值，表示每个调用的函数结果可能不同。例如random()或now()。
  + STABLE 表示该函数不会修改数据库，因此在一次扫描中，如果给定相同的参数，它将返回相同的结果。
  + IMMUTABLE表示该函数不会修改数据库，并且在给定相同参数的情况下始终返回相同结果。
* CALLED ON NULL INPUT，RETURNS NULL ON NULL INPUT和STRICT定义函数对于“ null”的行为。
* + CALLED ON NULL INPUT指示输入参数可能是null。
  + RETURNS NULL ON NULL INPUT或STRICT表示函数在输入任何null参数时总是返回null。

**例子**

使用SQL语言定义函数。

```
CREATE FUNCTION mul(integer, integer) RETURNS integer
    AS 'SELECT $1  * $2;'
    LANGUAGE SQL
    IMMUTABLE
    RETURNS NULL ON NULL INPUT;

SELECT mul(2,3), mul(10, 12);
```

```
mul | mul
-----+-----
    6 | 120
(1 row)
```

使用PL/pgSQL定义一个函数

```
CREATE OR REPLACE FUNCTION inc(i integer) RETURNS  integer AS $$
        BEGIN
               RAISE NOTICE 'Incrementing %', i ;
               RETURN i + 1;
        END;

$$ LANGUAGE plpgsql;

SELECT inc(2), inc(5), inc(10);
```

```
NOTICE:   Incrementing 2
NOTICE:   Incrementing 5
NOTICE:   Incrementing 10
inc | inc | inc
-----+-----+-----
3 |  6 |   11
(1 row)
```

## CREATE GROUP [*link*](#create-group)

**概要**

使用CREATE GROUP语句创建组角色。CREATE GROUP是 CREATE ROLE的 别名。

**语法**

```
create_group  ::= CREATE GROUP role_name
                    [ [ WITH ] role_option [ ,  ... ] ]

role_option  ::= SUPERUSER
                   | NOSUPERUSER
                   | CREATEDB
                   | NOCREATEDB
                   | CREATEROLE
                   | NOCREATEROLE
                   | INHERIT
                   | NOINHERIT
                   | LOGIN
                   | NOLOGIN
                   | CONNECTION LIMIT connlimit
                   | [ ENCRYPTED ] PASSWORD ' password '
                   | PASSWORD NULL
                   | VALID UNTIL ' timestamp '
                   | IN ROLE role_name [ , ... ]
                   | IN GROUP role_name [ , ...  ]
                   | ROLE role_name [ , ... ]
                   | ADMIN role_name [ , ... ]
                   | USER role_name [ , ... ]
                   | SYSID uid
```

**例子**

创建一个名为sample的组，可以管理数据库和角色。

```
CREATE GROUP SysAdmin WITH  CREATEDB CREATEROLE;
```

## CREATE INDEX [*link*](#create-index)

**概要**

使用CREATE INDEX语句在指定表的指定列上创建索引。索引主要用于提高查询性能。

**语法**

```
create_index ::= CREATE [ UNIQUE ] INDEX [ [ IF NOT  EXISTS ] name ]
                   ON [ ONLY ] table_name ( index_elem [ , ... ] )
                   [ INCLUDE ( column_name [ , ... ] ) ]
                   [ WHERE predicate ]

index_elem ::= { column_name | ( expression ) }
                  [  operator_class_name ] [ HASH | ASC | DESC ]
                  [  NULLS { FIRST | LAST } ]
```

**语义**

UNIQUE 强制要求不允许表中出现重复值

INCLUDE指定将作为非关键列包含在索引中的列集合。

WHERE部分索引是建立在只包括满足所where规定的条件的行组成的表的子集的索引。它可用于从索引中排除NULL或公共值，或仅包含感兴趣的行。这将加快对表的写入速度，因为不需要索引包含公共列值的行。它还将减小索引的大小，从而提高使用该索引的读取查询的速度。

name 指定要创建的索引的名称。

table\_name 指定要建立索引的表的名称。

column\_name 指定表的列名。

expression 指定表的一列或多列，并且必须用括号括起来。

* HASH-使用列的哈希值。这是第一列的默认选项，用于对索引表进行哈希分区。
* ASC—升序排列。这是索引的第二列和后续列的默认选项。
* DESC —降序排列。
* NULLS FIRST-指定null排在非null之前。当指定DESC时，这是默认设置。
* NULLS LAST-指定null排在非null之后。如果未指定DESC，则为默认设置。

SPLIT INTO 对于散列索引，可以使用该SPLIT INTO子句指定要为索引创建的tablet的数量。使用 SPLIT INTO 预先分割索引可索引将工作负载分配到生产集群上。例如，如果您有3台服务器，则将索引分为30个tablet可以提供更高的索引写吞吐量。

**例子**

创建具有哈利排序列的唯一索引。

```
CREATE TABLE products(id int PRIMARY KEY,
                               name text,
                               code text);

CREATE UNIQUE INDEX ON products(code);
```

```
\d products
             Table "public.products"
Column | Type   | Collation | Nullable | Default
--------+---------+-----------+----------+---------
id   | integer |      | not null |
name  | text    |      |     |
code  | text    |      |     |

Indexes:
    "products_pkey" PRIMARY KEY, lsm (id HASH)
    "products_code_idx" UNIQUE, lsm (code HASH)
```

用升序键创建索引。

```
CREATE INDEX products_name ON products(name ASC);
\d products_name
    Index "public.products_name"
Column | Type |  Key? | Definition
--------+------+------+------------
name  | text | yes | name
lsm, for table "public.products
```

创建具有升序排序键的索引，并包括其他列作为非键列。

```
CREATE INDEX products_name_code ON products(name)  INCLUDE (code);
\d products_name_code;
 Index  "public.products_name_code"
 Column | Type |  Key? | Definition
--------+------+------+------------
name  | text | yes | name
code  | text | no  | code
lsm, for table "public.products"
```

指定索引的tablet数量。

```
CREATE TABLE employees (id int PRIMARY KEY, first_name  TEXT, last_name TEXT) SPLIT INTO 10 TABLETS;

CREATE INDEX ON employees(first_name, last_name) SPLIT  INTO 10 TABLETS;
```

一个维护货运信息的应用程序。它有一个shipments表，该表的列为delivery\_status。如果应用程序需要频繁访问 shipments表 ，则可以使用部分索引排除货件状态为 delivered 的行。

```
create table shipments(id int, delivery_status text,  address text, delivery_date date);

create index shipment_delivery on  shipments(delivery_status, address, delivery_date) where delivery_status !=  'delivered';
```

## CREATE OPERATOR [*link*](#create-operator)

**概要**

使用CREATE OPERATOR语句创建一个新的运算符。

**语法**

```
create_operator ::= CREATE OPERATOR operator_name (
                       { FUNCTION = function_name
                          | PROCEDURE = procedure_name }
                       [ , operator_option [ ... ] ] )

operator_option ::= LEFTARG = left_type
                       | RIGHTARG = right_type
                       | COMMUTATOR = com_op
                       | NEGATOR = neg_op
                       | RESTRICT = res_proc
                       | JOIN = join_proc
                       | HASHES
                       | MERGES
```

**语义**

请参见[PostgreSQL docs] [postgresql-docs-create-operator]中每个选项的语义。

**例子**

```
CREATE OPERATOR @#@ (
           rightarg = int8,
           procedure = numeric_fac
        );

SELECT @#@ 5;
```

## CREATE OPERATOR CLASS [*link*](#create-operator-class)

**概要**

使用CREATE OPERATOR CLASS语句创建一个新的运算符类。

**语法**

```
reate_operator_class ::= CREATE OPERATOR CLASS  operator_class_name
                             [ DEFAULT ] FOR  TYPE data_type USING
                             index_method AS  operator_class_as [ , ... ]

operator_class_as ::= OPERATOR strategy_number  operator_name
                         [ ( operator_signature ) ] [ FOR SEARCH ]
                         | FUNCTION support_number
                            [ ( op_type [ , ... ] ) ] function_name (
                            function_signature )
                         | STORAGE storage_type
```

**语义**

请参见[PostgreSQL docs] [postgresql-docs-create-op-class]中每个选项的语义。

**例子**

```
CREATE OPERATOR CLASS my_op_class
       FOR  TYPE int4
       USING  btree AS
       OPERATOR 1 <,
       OPERATOR 2 <=;
```

## CREATE POLICY [*link*](#create-policy)

**概要**

使用CREATE POLICY语句为表创建新的行级安全策略。策略授予SELECT，INSERT，UPDATE或DELETE访问匹配表达式的行的权限。必须使用ALTER TABLE在表上启用行级安全性，策略才能生效。

**语法**

```
create_policy ::= CREATE POLICY name ON table_name
                   [ AS { PERMISSIVE | RESTRICTIVE } ]
                   [ FOR { ALL | SELECT | INSERT | UPDATE | DELETE } ]
                   [ TO { role_name
                           | PUBLIC
                           | CURRENT_USER
                           | SESSION_USER } [ , ... ] ]
                   [ USING ( using_expression ) ]
                   [ WITH CHECK ( check_expression ) ]
```

**语义**

* name是新政策的名称。该名称必须不同于该表的任何其他策略名称。
* table\_name 是策略适用的表的名称。
* PERMISSIVE/ RESTRICTIVE指定该策略是允许的还是限制性的。在将策略应用于表时，使用逻辑OR运算符将宽松的策略组合在一起，而使用逻辑AND运算符将限制性策略组合在一起。限制性策略用于减少可访问的记录数。默认值是允许的。
* role\_name是应用策略的角色。默认值是PUBLIC将策略应用于所有角色。
* using\_expression是SQL条件表达式。条件变为true的行仅在中可见，SELECT而在UPDATE或中可用于修改DELETE。
* check\_expression是仅用于INSERT和UPDATE 查询的SQL条件表达式。只有行该表达式评估为真将以被允许INSERT或 UPDATE。请注意，与不同using\_expression，它是针对该行的建议新内容进行评估的。

**例子**

创建一个宽松的策略。

```
CREATE POLICY p1 ON document
USING (dlevel  <= (SELECT level FROM user_account WHERE user = current_user));
```

创建限制性策略。

```
CREATE POLICY p_restrictive ON document AS RESTRICTIVE  TO user_bob    USING (cid  <> 44);
```

创建一个带有CHECK插入条件的策略。

```
CREATE POLICY p2 ON document FOR INSERT WITH CHECK  (dauthor = current_user);
```

## CREATE PROCEDURE [*link*](#create-procedure)

**概要**

使用CREATE PROCEDURE语句在数据库中定义新存储过程。

**语法**

```
create_procedure ::= CREATE [ OR REPLACE ] PROCEDURE  name (
                       [ arg_decl [ , ... ] ] )
                       { LANGUAGE lang_name
                          | TRANSFORM { FOR TYPE type_name } [ , ... ]
                          | [ EXTERNAL ] SECURITY INVOKER
                          | [ EXTERNAL ] SECURITY DEFINER
                          | SET configuration_parameter
                             { TO value | = value | FROM  CURRENT }
                          | AS 'definition'
                          | AS 'obj_file' 'link_symbol' } [ ... ]

arg_decl ::= [ argmode ] [ argname ] argtype
                 [ {  DEFAULT | = } expression ]
```

**语义**

* 如果name已经存在具有给定和参数类型的过程，则CREATE PROCEDURE除非使用该CREATE OR REPLACE PROCEDURE版本，否则将引发错误。在这种情况下，它将替换任何现有定义。
* 默认支持的语言包括sql，plpgsql和C。

**例子**

设置一个账户表。

```
CREATE TABLE accounts (
   id integer  PRIMARY KEY,
   name text NOT  NULL,
   balance  decimal(15,2) NOT NULL
);

INSERT INTO accounts VALUES (1, 'Jane', 100.00);
INSERT INTO accounts VALUES (2, 'John', 50.00);

SELECT * from accounts;
```

定义transfer将资金从一个账户转移到另一个账户的存储过程。

```
CREATE OR REPLACE PROCEDURE transfer(integer, integer,  decimal)
LANGUAGE plpgsql
AS $$
BEGIN
   IF $3 <=  0.00 then RAISE EXCEPTION 'Can only transfer positive amounts'; END IF;
   IF $1 = $2 then  RAISE EXCEPTION 'Sender and receiver cannot be the same'; END IF;
   UPDATE accounts  SET balance = balance - $3 WHERE id = $1;
   UPDATE accounts  SET balance = balance + $3 WHERE id = $2;
   COMMIT;
END;
$$;
```

执行转账操作。

```
CALL transfer(1, 2, 20.00);
SELECT * from accounts;
```

## CREATE ROLE [*link*](#create-role)

**概要**

使用CREATE ROLE语句向MemFire数据库集群添加新角色。角色是可以拥有数据库对象并具有数据库特权的实体。角色可以是用户或组，具体取决于使用方式。具有 LOGIN 属性的role可以视为user。具有CREATEROLE特权或成为数据库超级用户才能使用此命令。 可以使用GRANT/ REVOKE命令设置/删除角色的权限。

**语法**

```
create_role ::= CREATE ROLE role_name
                  [ [ WITH ] role_option [ , ... ] ]

role_option ::= SUPERUSER
                  | NOSUPERUSER
                  | CREATEDB
                  | NOCREATEDB
                  | CREATEROLE
                  | NOCREATEROLE
                  | INHERIT
                  | NOINHERIT
                  | LOGIN
                  | NOLOGIN
                  | CONNECTION LIMIT connlimit
                  | [ ENCRYPTED ] PASSWORD ' password '
                  | PASSWORD NULL
                  | VALID UNTIL ' timestamp '
                  | IN ROLE role_name [ , ... ]
                  | IN GROUP role_name [ , ... ]
                  | ROLE role_name [ , ... ]
                  | ADMIN role_name [ , ... ]
                  | USER role_name [ , ... ]
                  | SYSID uid
```

**语义**

* role\_name 是新角色的名称。
* SUPERUSER，NOSUPERUSER确定新角色是否是“超级用户”。超级用户可以覆盖所有访问限制，应谨慎使用。只有具有SUPERUSER特权的角色才能创建其他SUPERUSER角色。如果未指定，则默认为NOSUPERUSER。
* CREATEDB，NOCREATEDB确定新角色是否可以创建数据库。默认值为NOCREATEDB。
* CREATEROLE，NOCREATEROLE确定新角色是否可以创建其他角色。默认值为NOCREATEROLE。
* INHERIT，NOINHERIT确定新角色是否继承其所属角色的特权。如果没有INHERIT，则另一个角色的成员资格仅授予SET ROLE权限给该另一个角色。其他角色的特权只有在这样做后才可用。如果未指定，则默认为INHERIT。
* LOGIN，NOLOGIN确定是否允许新角色登录。客户端连接期间只能使用具有登录特权的角色。可以将具有LOGIN的角色视为用户。如果未指定，则默认为NOLOGIN。请注意，如果使用CREATE USER而不是CREATE ROLE，则默认值为LOGIN。
* CONNECTION LIMIT指定角色可以建立的并发连接数。默认值为-1，表示无限制。这仅适用于可以登录的角色。
* [ENCRYPTED] PASSWORD设置新角色的密码。这仅适用于可以登录的角色。如果未指定密码，则密码将设置为null，并且该用户的密码身份验证将始终失败。请注意，密码始终以加密方式存储在系统目录中，并且仅提供可选关键字ENCRYPTED是为了与Postgres兼容。
* VALID UNTIL设置一个日期和时间，之后该角色的密码将不再有效。如果省略此子句，则密码将一直有效。
* IN ROLE role\_name，IN GROUP role\_name列出一个或多个现有角色，新角色将立即作为新成员添加到其中。（请注意，没有选项可以将新角色添加为管理员；请使用单独的GRANT命令来执行此操作。）
* ROLE role\_name，USER role\_name列出一个或多个现有角色，这些角色将自动添加为新角色的成员。（这实际上使新角色成为“组”。）
* ADMIN role\_name与相似ROLE role\_name，但是将命名角色添加到使用ADMIN OPTION的新角色中，从而赋予他们将这个角色的成员资格授予其他人的权利。
* SYSID uid 被忽略，并且与Postgres兼容。

**例子**

创建一个可以登录的角色。

```
CREATE ROLE John LOGIN;
```

创建一个可以登录并具有密码的juese。

```
CREATE ROLE Jane LOGIN  PASSWORD 'password';
```

创建一个可以管理数据库和角色的角色。

```
CREATE ROLE SysAdmin  CREATEDB CREATEROLE;
```

## CREATE RULE [*link*](#create-rule)

**概要**

使用CREATE RULE语句创建新规则。

**语法**

```
create_rule  ::= CREATE [ OR REPLACE ] RULE rule_name AS ON rule_event TO table_name [ WHERE  condition ] DO [ ALSO | INSTEAD ] { NOTHING | command | ( command [ ; ... ] )  }

rule_event  ::= SELECT | INSERT | UPDATE | DELETE

command  ::= SELECT | INSERT | UPDATE | DELETE | NOTIFY
```

**语义**

请参见[PostgreSQL docs] [postgresql-docs-create-rule]中每个选项的语义。

**例子**

```
CREATE TABLE t1(a int4, b int4);
CREATE TABLE t2(a int4, b int4);
CREATE RULE t1_to_t2 AS ON INSERT TO t1 DO INSTEAD
INSERT INTO t2 VALUES (new.a, new.b);
INSERT INTO t1 VALUES (3, 4);
SELECT * FROM t1;
```

## CREATE SCHEMA [*link*](#create-schema)

**概要**

使用CREATE SCHEMA语句在当前数据库中创建一个新模式。模式本质上是一个命名空间：它包含命名对象（表，数据类型，函数和运算符），其名称可以与其他模式中存在的其他对象的名称重复。可以通过使用模式名称作为前缀或通过在搜索路径中设置模式名称来访问模式中的命名对象。

**语法**

```
create_schema_name ::= CREATE SCHEMA [ IF NOT EXISTS ]  schema_name
                         [ AUTHORIZATION role_specification ]

create_schema_role ::= CREATE SCHEMA [ IF NOT EXISTS ]  AUTHORIZATION                                                role_specification [ schema_element [ ... ] ]

role_specification ::= role_name | CURRENT_USER | SESSION_USER
```

**语义**

* schema\_name是要创建的模式的名称。如果未指定schema\_name，role\_name则使用。
* role\_name是拥有新模式的角色。如果省略，则默认为用户执行命令。要创建另一个角色拥有的模式，必须是该角色的直接或间接成员，或者是超级用户才能执行。

**例子**

创建一个新的模式。

```
CREATE SCHEMA IF NOT EXIST branch;
```

为用户创建模式。

```
CREATE ROLE John;
CREATE SCHEMA AUTHORIZATION john;
```

创建一个模式和改模式中的对象。

```
CREATE SCHEMA branch
          CREATE TABLE dept(
             dept_id INT NOT NULL,
             dept_name TEXT NOT NULL,
             PRIMARY KEY (dept_id)
          );
```

## CREATE SEQUENCE [*link*](#create-sequence)

**概要**

使用CREATE SEQUENCE语句在当前模式中创建一个新序列。

**语法**

```
create_sequence ::= CREATE SEQUENCE [ IF NOT EXISTS ]  sequence_name
                       sequence_options

sequence_name ::= '<Text Literal>'

sequence_options ::= [ INCREMENT [ BY ] increment ]
                         [ MINVALUE minvalue | NO MINVALUE ]
                         [ MAXVALUE maxvalue | NO MAXVALUE ]
                         [ START [ WITH ] start ] [ CACHE cache ]
                         [ [ NO ] CYCLE ]
```

**语义**

CREATE SEQUENCE sequence\_name [ IF NOT EXISTS ] 指定序列的名称（sequence\_name）。如果在当前模式中已经存在具有该名称的序列，并且IF NOT EXISTS未指定该序列，则会引发错误。

INCREMENT BY increment 指定序列中连续值之间的差。默认值为1。

MINVALUE minvalue | NO MINVALUE 指定序列中允许的最小值。如果达到该值（以负增量递增的顺序），nextval()将返回错误。如果NO MINVALUE指定，则使用默认值。默认值为1。

MAXVALUE maxvalue | NO MAXVALUE 指定序列中允许的最大值。如果达到此值，nextval()将返回错误。如果NO MAXVALUE指定，则使用默认值。默认值为263 - 1。

START WITH start 指定序列中的第一个值。start不能少于minvalue。默认值为1。

CACHE cache 指定序列中要在客户端中缓存的数字。默认值为1。

[ NO ] CYCLE 如果CYCLE已指定，则序列到达minvalue或时将环绕maxvalue。如果maxvalue达到，minvalue将是序列中的下一个数字。如果minvalue达到（对于降序序列），maxvalue将是序列中的下一个数字。NO CYCLE是默认值。

Cache 在PostgreSQL中，在MSQL中，序列的数据存储在持久性系统表中。在MSQL中，此表每个序列有一行，并且它以两个值存储序列数据： last\_val 存储上次使用的值或下一个要使用的值。 is\_called 存储是否last\_val已使用。如果为false，last\_val则为序列中的下一个值。否则，last\_val+ INCREMENT是下一个。

默认情况下（INCREMENT为1时），每次调用都会nextval()更新last\_val该序列。在MSQL中，复制包含序列数据的表，而不是将其复制到本地文件系统中。对该表的每次更新都需要两个RPC（并且将来将优化为一个RPC），无论如何，nextval()在MSQL中调用所经历的延迟将大大高于Postgres中的相同操作。为了避免这种性能下降，MemFire建议使用具有足够大值的缓存值。缓存的值存储在本地节点的内存中，检索这些值可以避免任何RPC，因此可以在为缓存分配的所有编号上摊销一次缓存分配的延迟。

SERIAL类型创建的序列具有默认值为1的缓存。因此，应避免使用 SERIAL 类型，而应使用其等效语句。而不是创建具有以下SERIAL类型的表：

```
CREATE TABLE t(k SERIAL)
```

您应该创建一个足够大的缓存序列，然后设置列，你想有一个串行类型DEFAULT以nextval()序列。

```
CREATE SEQUENCE t_k_seq CACHE 10000;
CREATE TABLE t(k integer NOT NULL DEFAULT  nextval('t_k_seq'));
```

**例子**

创建一个简单的序列，每个nextval()调用时递增1。

```
CREATE SEQUENCE s;
```

调用nextval()。

```
SELECT nextval('s');
```

创建一个具有10,000个 缓存 值的序列。

```
CREATE SEQUENCE s2 CACHE  10000;
```

在第一个会话中调用nextval()。

```
SELECT nextval('s2');
 nextval
---------
          1
(1 row)
```

在第二个会话中调用 nextval()。

```
SELECT nextval('s2');
nextval
---------
      10001
(1 row)
```

创建一个从0开始的序列。将MINVALUE从其默认值1更改为小于或等于0的值。

```
CREATE SEQUENCE s3 START 0 MINVALUE 0;
CREATE SEQUENCE
SELECT nextval('s3');
nextval
---------
          0
(1 row)
```

## CREATE TABLE [*link*](#create-table)

**概要**

使用CREATE TABLE语句在数据库中创建新表。它定义了表名，列名和类型，主键和表属性。

**语法**

```
create_table ::= CREATE [ TEMPORARY | TEMP ] TABLE [ IF  NOT EXISTS ]
                    table_name ( [ table_elem [ , ... ] ] )
                    [ WITH ( { COLOCATED = { 'true' | 'false' }
                                 | storage_parameters } )
                       | WITHOUT OIDS ]
                    [ SPLIT { INTO integer TABLETS
                               | AT VALUES ( split_row [ , ... ] ) } ]

table_elem ::= column_name data_type [  column_constraint [ ... ] ]
                 | table_constraint

column_constraint ::= [ CONSTRAINT constraint_name ]
                          { NOT NULL
                             | NULL
                             | CHECK ( expression )
                             | DEFAULT expression
                             | UNIQUE index_parameters
                             | PRIMARY KEY
                             | references_clause }
                          [ DEFERRABLE | NOT DEFERRABLE ]
                          [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

table_constraint ::= [ CONSTRAINT constraint_name ]
                          { CHECK ( expression )
                             | UNIQUE ( column_names ) index_parameters
                             | PRIMARY KEY ( key_columns )
                             | FOREIGN KEY ( column_names )
                                references_clause }
                          [ DEFERRABLE | NOT DEFERRABLE ]
                          [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]

key_columns ::= hash_columns [ , range_columns ] |  range_columns

hash_columns ::= column_name [ HASH ] | ( column_name [  , ... ] ) HASH

range_columns ::= { column_name { ASC | DESC } } [ ,  ... ]

storage_parameters ::= storage_parameter [ , ... ]

storage_parameter ::= param_name [ = param_value ]

index_parameters ::= [ INCLUDE ( column_names ) ]
                         [ WITH ( storage_parameters ) ]

references_clause ::= REFERENCES table_name [  column_name [ , ... ] ]
                         [ MATCH FULL | MATCH PARTIAL | MATCH  SIMPLE ]
                         [ ON DELETE key_action ]
                         [ ON UPDATE key_action ]

split_row ::= ( column_value [ , ... ] )
```

**语义**

Primary key 可以在column\_constraint或table\_constraint 中定义主键 ，但不能在两个地方同时定义。有两种类型的主键列：

* Hash primary key columns：主键可能具有零个或多个前导哈希分区列。默认情况下，仅第一列被视为哈希分区列。但是可以通过显式使用HASH注释来修改此行为。
* Range primary key columns：一个表可以具有零个或多个范围主键列，并且它控制表中行的顶级排序（如果没有哈希分区列）或共享一组公共哈希分区列的行之间的行顺序价值观。默认情况下，范围主键列以升序存储。但是，可以通过显式使用ASC或来控制此行为DESC。

Foreign key 这将强制UNIQUE约束中指定的列集在表中是唯一的，也就是说，约束中指定的列集的任何两行都不能具有相同的值。

Check 这用于强制指定表中的数据满足该CHECK子句中指定的要求。

Default 此子句用于指定列的默认值。如果INSERT语句未为该列指定值，则使用默认值。如果没有为列指定默认值，则默认值为NULL。

Deferrable constraints 可以使用该DEFERRABLE子句推迟约束。当前，在MemFire中只能推迟外键约束。在语句中的每一行之后，将检查不可延迟的约束。在推迟约束的情况下，约束的检查可以推迟到事务结束。

标记为的约束INITIALLY IMMEDIATE将在语句中的每一行之后进行检查。 标记为的约束INITIALLY DEFERRED将在事务结束时检查。

Temporary or Temp 使用此限定符将创建一个临时表。临时表仅在创建它们的当前客户端会话或事务中可见，并在会话或事务结束时自动删除。在临时表上创建的所有索引也是临时的。 SPLIT INTO 对于哈希表，您可以使用该SPLIT INTO子句来指定要为该表创建的tablet。然后，将哈希范围平均分配给这些tablet。

**例子**

带主键的表。

```
CREATE TABLE sample(k1 int,
                            k2 int,
                            v1 int,
                            v2 text,
                            PRIMARY KEY  (k1, k2));
```

带范围主键的表。

```
CREATE TABLE range(k1 int,
                            k2 int,
                            v1 int,
                            v2 text,
                            PRIMARY KEY (k1  ASC, k2 DESC));
```

带有检查约束的表。

```
CREATE TABLE student_grade(student_id int,
                                        class_id int,
                                        term_id  int,
                                        grade  int CHECK (grade >= 0 AND grade <= 10),
                                        PRIMARY  KEY (student_id, class_id, term_id));
```

具有默认值的表。

```
CREATE TABLE cars(id int PRIMARY KEY,
                           brand text CHECK  (brand in ('X', 'Y', 'Z')),
                           model text NOT  NULL,
                           color text NOT  NULL DEFAULT 'WHITE' CHECK (color in ('RED', 'WHITE', 'BLUE')));
```

带有外键约束的表。

```
CREATE TABLE products(id int PRIMARY KEY,
                                 descr text);

CREATE TABLE orders(id int PRIMARY KEY,
                                 pid int REFERENCES  products(id) ON DELETE CASCADE,
                                 amount int);
```

具有唯一约束的表。

```
CREATE TABLE translations(message_id int UNIQUE,
                                     message_txt text);
```

创建一个指定分片数量的表。

```
CREATE TABLE tracking (id  int PRIMARY KEY) SPLIT INTO 10 TABLETS;
```

使用并置表。

```
CREATE DATABASE company WITH colocated = true;

CREATE TABLE employee(id INT PRIMARY KEY, name TEXT)  WITH (colocated = false);
```

## CREATE TABLE AS [*link*](#create-table-as)

**概要**

使用该CREATE TABLE AS语句使用子查询的输出来创建新表。

**语法**

```
create_table_as ::= CREATE TABLE [ IF NOT EXISTS ] table_name
                    [ ( column_name [ , ... ] ) ]   AS query
                    [ WITH [ NO ] DATA ]
```

**语义**

CREATE TABLE [ IF NOT EXISTS ] table\_name 创建一个表。

table\_name 指定表的名称。

( column\_name [ , … ] ) 指定新表中的列名。未指定时，列名称取自查询的输出列名称。

**例子**

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text,  PRIMARY KEY (k1, k2));
```

```
INSERT INTO sample VALUES (1, 2.0, 3, 'a'), (2, 3.0, 4,  'b'), (3, 4.0, 5, 'c');
```

```
CREATE TABLE selective_sample SELECT * FROM sample  WHERE k1 > 1;
```

```
SELECT * FROM selective_sample ORDER BY k1;
```

## CREATE TRIGGER [*link*](#create-trigger)

**概要**

使用CREATE TRIGGER语句定义新的触发器。

**语法**

```
create_trigger ::= CREATE TRIGGER name { BEFORE | AFTER  | INSTEAD OF }
                      { event [ OR ... ] } ON table_name
                      [ FROM table_name ] [ NOT  DEFERRABLE ]
                      [ FOR [ EACH ] { ROW | STATEMENT } ]
                      [ WHEN ( condition ) ] EXECUTE
                      { FUNCTION | PROCEDURE } function_name (
                      function_arguments )

event ::= INSERT
            | UPDATE [ OF column_name [ , ... ] ]
            | DELETE
            | TRUNCATE
```

**语义**

* WHEN条件可用于指定是否应触发触发器。对于低级触发器，它可以引用该行的列的旧值和/或新值。
* 可以为同一事件定义多个触发器。在这种情况下，将按名称的字母顺序将其触发。

**例子**

设置带有触发器的表，以跟踪修改时间和用户（角色）。使用预安装的扩展insert\_username和moddatetime。

```
CREATE EXTENSION insert_username;

CREATE EXTENSION moddatetime;

CREATE TABLE posts (
   id int primary key,
   content text,
   username text not null,
   moddate timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER insert_usernames
   BEFORE INSERT OR UPDATE ON posts
   FOR EACH ROW
   EXECUTE  PROCEDURE insert_username (username);

CREATE TRIGGER update_moddatetime
   BEFORE UPDATE  ON posts
   FOR EACH ROW
   EXECUTE  PROCEDURE moddatetime (moddate);
```

插入一些行。对于每次插入，触发器应将当前角色设置为username，将当前时间戳设置为moddate。

```
SET ROLE memfire;
INSERT INTO posts VALUES(1, 'desc1');

SET ROLE postgres;
INSERT INTO posts VALUES(2, 'desc2');
INSERT INTO posts VALUES(3, 'desc3');

SET ROLE memfire;
INSERT INTO posts VALUES(4, 'desc4');

SELECT * FROM posts ORDER BY id;
```

更新一些行。对于每一个更新的触发器既设置username和moddate相应。

```
UPDATE posts SET content = 'desc1_updated' WHERE id = 1;
UPDATE posts SET content = 'desc3_updated' WHERE id = 3;

SELECT * FROM posts ORDER BY id;
```

## CREATE TYPE [*link*](#create-type)

**概要**

使用CREATE TYPE语句在数据库中创建新的用户定义类型。有五种类型：复合，枚举，范围，基数和shell。每个都有自己的CREATE TYPE语法。

**语法**

```
create_composite_type ::= CREATE TYPE type_name AS (
                            [ composite_type_elem [ , ... ] ] )

create_enum_type ::= CREATE TYPE type_name AS ENUM (
                        [ label [ , ... ] ] )

create_range_type ::= CREATE TYPE type_name AS RANGE (  SUBTYPE =
                         subtype [ , range_type_option [ ... ] ] )

create_base_type ::= CREATE TYPE type_name ( INPUT =  input_function ,
                            OUTPUT = output_function
                            [ , base_type_option [ ... ] ] )

create_shell_type ::= CREATE TYPE type_name

composite_type_elem ::= attribute_name data_type [  COLLATE collation ]

range_type_option ::= SUBTYPE_OPCLASS =  subtype_operator_class
                         | COLLATION = collation
                         | CANONICAL = canonical_function
                         | SUBTYPE_DIFF = subtype_diff_function

base_type_option ::= RECEIVE = receive_function
                        | SEND = send_function
                        | TYPMOD_IN = type_modifier_input_function
                        | TYPMOD_OUT = type_modifier_output_function
                        | INTERNALLENGTH = { internallength | VARIABLE }
                        | PASSEDBYVALUE
                        | ALIGNMENT = alignment
                        | STORAGE = storage
                        | LIKE = like_type
                        | CATEGORY = category
                        | PREFERRED = preferred
                        | DEFAULT = default
                        | ELEMENT = element
                        | DELIMITER = delimiter
                        | COLLATABLE = collatable
```

**语义**

base\_type\_option

* type\_name 指定此用户定义类型的名称。
* attribute\_name 指定此复合类型的属性的名称。
* data\_type 指定此复合类型的属性的类型。
* collation指定用于此类型的排序规则。如果这是复合类型，则属性数据类型必须可合并。如果这是范围类型，则子类型必须可排序。
* label 指定带引号的标签为此枚举类型的值。
* subtype 指定用于此范围类型的类型。
* subtype\_operator\_class 指定用于此范围类型的子类型的运算符类。
* canonical\_function 指定在将此范围类型的范围值转换为规范形式时使用的规范函数。
* subtype\_diff\_function 指定用于获取此范围类型的两个范围值之间的差的子类型差函数。
* input\_function 指定将此类型的外部文本表示转换为内部表示的函数。
* output\_function 指定将此类型的内部表示形式转换为外部文本表示形式的函数。
* receive\_function 指定将此类型的外部二进制表示形式转换为内部表示形式的函数。
* send\_function 指定将此类型的内部表示形式转换为外部二进制表示形式的函数。
* type\_modifier\_input\_function 指定将此类型修饰符的外部文本表示形式转换为内部整数typmod值或引发错误的函数。
* type\_modifier\_output\_function 指定将此类型修饰符的内部整数typmod值转换为外部表示形式的函数。
* internallength 指定此类型的大小（以字节为单位）。
* alignment 指定此类型的存储对齐方式。
* storage指定此类型的存储策略。此类型必须是可变长度。
* like\_type指定到拷贝过来的类型INTERNALLENGTH，PASSEDBYVALUE，ALIGNMENT，和STORAGE的值从。
* category 指定此类型的类别代码。
* preferred 指定对于同一类别中的隐式强制转换是否首选此类型。
* default 指定此类型的默认值。
* element 指定此类型的元素，也使该类型成为数组。
* delimiter 指定用于在此类型的值的外部文本表示形式中分隔数组元素的字符。
* collatable 指定是否可以将排序规则信息传递给使用此类型的操作。

**例子**

复合型。

```
CREATE TYPE feature_struct AS (id INTEGER, name TEXT);
CREATE TABLE feature_tab_struct (feature_col feature_struct);
```

枚举类型。

```
CREATE TYPE feature_enum AS ENUM ('one', 'two', 'three');
CREATE TABLE feature_tab_enum (feature_col  feature_enum);
```

范围类型。

```
CREATE TYPE feature_range AS RANGE (subtype=INTEGER);
CREATE TABLE feature_tab_range (feature_col feature_range);
```

基本类型。

```
CREATE TYPE int4_type;
CREATE FUNCTION int4_type_in(cstring) RETURNS int4_type
            LANGUAGE internal IMMUTABLE STRICT PARALLEL SAFE AS 'int4in';
CREATE FUNCTION int4_type_out(int4_type) RETURNS  cstring
            LANGUAGE internal IMMUTABLE STRICT PARALLEL SAFE AS 'int4out';
CREATE TYPE int4_type (
            INPUT = int4_type_in,
            OUTPUT = int4_type_out,
            LIKE = int4
         );
CREATE TABLE int4_table (t int4_type);
```

外壳类型。

```
CREATE TYPE shell_type;
```

## CREATE USER [*link*](#create-user)

**概要**

使用CREATE USER语句创建用户。该CREATE USER语句是 CREATE ROLE 的别名，但默认情况下会创建一个具有LOGIN特权的角色。

**语法**

```
create_user ::= CREATE USER role_name
                  [ [ WITH ] role_option [ , ... ] ]

role_option ::= SUPERUSER
                  | NOSUPERUSER
                  | CREATEDB
                  | NOCREATEDB
                  | CREATEROLE
                  | NOCREATEROLE
                  | INHERIT
                  | NOINHERIT
                  | LOGIN
                  | NOLOGIN
                  | CONNECTION LIMIT connlimit
                  | [ ENCRYPTED ] PASSWORD ' password '
                  | PASSWORD NULL
                  | VALID UNTIL ' timestamp '
                  | IN ROLE role_name [ , ... ]
                  | IN GROUP role_name [ , ... ]
                  | ROLE role_name [ , ... ]
                  | ADMIN role_name [ , ... ]
                  | USER role_name [ , ... ]          |  SYSID uid
```

**语义**

参阅CREATE ROLE

**例子**

使用密码创建一个示例用户。

```
CREATE USER John WITH PASSWORD 'password';
```

向John授予对MemFire数据库的所有权限。

```
GRANT ALL ON DATABASE MemFire TO John;
```

从MemFire数据库中删除John的权限。

```
REVOKE ALL ON DATABASE MemFire FROM John;
```

## CREATE VIEW [*link*](#create-view)

**概要**

使用CREATE VIEW语句在数据库中创建新视图。它定义了视图名称和定义它的（选择）语句。

**语法**

```
create_view ::= CREATE VIEW qualified_name
                 [ ( column_list ) ] AS select
```

**语义**

CREATE VIEW qualified\_name [ (column\_list ) ] AS select 创建一个视图。

qualified\_name 指定视图的名称。如果指定数据库中已经存在具有该名称的视图，则会引发错误（除非使用了该OR REPLACE选项）。

column\_list 指定以逗号分隔的列列表。如果未指定，则从查询中推导出列名。 select 指定SELECT或VALUES语句，以提供视图的列和行。

**例子**

创建一个sample表。

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text,  PRIMARY KEY (k1, k2));
```

插入一些行。

```
INSERT INTO sample(k1, k2, v1, v2) VALUES (1, 2.0, 3,  'a'), (2, 3.0, 4, 'b'), (3, 4.0, 5, 'c');
```

在sample表上创建一个视图。

```
CREATE VIEW sample_view AS SELECT * FROM sample WHERE  v2 != 'b' ORDER BY k1 DESC;
```

从视图中选择。

```
SELECT * FROM sample_view;
```

## DELLOCATE [*link*](#dellocate)

**概要**

使用DEALLOCATE语句取消分配先前准备的SQL语句。

**语法**

```
deallocate ::= DEALLOCATE [ PREPARE ] { name | ALL }
```

**语义**

name 指定要释放的准备好的语句的名称。

ALL 取消分配所有准备好的语句。

**例子**

准备并取消插入语句。

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text,  PRIMARY KEY (k1, k2));
PREPARE ins (bigint, double precision, int, text) AS
               INSERT INTO sample(k1, k2, v1, v2) VALUES ($1, $2, $3, $4);
DEALLOCATE ins;
```

## DELETE [*link*](#delete)

**概要**

使用DELETE语句删除满足某些条件的行，并且当WHERE子句中未提供条件时，将删除所有行。DELETE输出要删除的行数。

**语法**

```
delete ::= [ WITH [ RECURSIVE ] with_query [ , ... ]  ] DELETE FROM
              [ ONLY  ] table_name [ * ] [ [ AS ] alias ]
              [  WHERE condition | WHERE CURRENT OF cursor_name ]
              [ returning_clause ]

returning_clause ::= RETURNING { * | {  output_expression
                                         [ [ AS ]  output_name ] }
                                         [ , ...  ] }
```

**语义**

* USING 子句尚不支持。
* 尽管该WHERE子句允许使用多种运算符，但该WHERE子句中使用的确切条件具有重要的性能考虑因素（特别是对于大型数据集）。为了获得最佳性能，请使用WHERE为PRIMARY KEY或中的所有列提供值的子句INDEX KEY。

with\_query 指定在DELETE语句中按名称引用的子查询。

table\_name 指定要删除的表的名称。

alias 在DELETE语句中指定目标表的标识符。指定别名后，必须使用别名代替语句中的实际表。

**例子**

创建一个示例表，插入几行，然后删除插入的行之一。

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text,  PRIMARY KEY (k1, k2));
INSERT INTO sample VALUES (1, 2.0, 3, 'a'), (2, 3.0, 4,  'b'), (3, 4.0, 5, 'c');
```

```
SELECT * FROM sample ORDER BY k1;
k1 | k2 | v1 | v2
----+----+----+----
   1 | 2 |   3 | a
   2 | 3 |   4 | b
   3 | 4 |   5 | c
(3 rows)
```

```
DELETE FROM sample WHERE k1 = 2 AND k2 = 3;
SELECT * FROM sample ORDER BY k1;
```

## DO [*link*](#do)

**概要**

使用该DO语句执行匿名代码块，或换句话说，以过程语言执行匿名函数。将代码块视为没有参数的函数的主体，并返回void。它被解析并执行一次。可选LANGUAGE子句可以在代码块之前或之后编写。

**语法**

```
do ::= DO [ LANGUAGE lang_name  ] code
```

**语义**

code 要执行的过程语言代码。就像在中一样，必须将其指定为字符串文字CREATE FUNCTION。建议使用美元报价文字。

lang\_name 编写代码所用的过程语言的名称。如果省略，则默认值为plpgsql。要使用的过程语言必须已经安装在当前数据库中。plpgsql默认情况下已安装，但未安装其他语言。

**例子**

```
DO $$DECLARE r record;
BEGIN
   FOR r IN  SELECT table_schema, table_name FROM information_schema.tables
              WHERE table_type = 'VIEW' AND table_schema = 'public'
   LOOP
      EXECUTE  'GRANT ALL ON ' || quote_ident(r.table_schema) || '.' ||
quote_ident(r.table_name) || ' TO webuser';
      END LOOP;
END$$;
```

## DROP AGGREGATE [*link*](#drop-aggregate)

**概要**

使用DROP AGGREGATE语句删除聚合。

**语法**

```
drop_aggregate ::= DROP AGGREGATE [ IF EXISTS ]
                     { aggregate_name ( aggregate_signature ) }
                     [ , ... ] [ CASCADE | RESTRICT ]

aggregate_signature ::= * | aggregate_arg [ , ... ]
                              | [ aggregate_arg [ , ... ] ] ORDER  BY
                                  aggregate_arg [ ,  ... ]
```

**语义**

请参见[PostgreSQL docs] [postgresql-docs-drop-aggregate]中每个选项的语义。

**例子**

基本示例。

```
CREATE AGGREGATE newcnt(*) (
          sfunc = int8inc,
          stype = int8,
          initcond = '0',
          parallel = safe
       );
DROP AGGREGATE newcnt(*);
```

IF EXISTS 例。

```
DROP AGGREGATE IF EXISTS newcnt(*);
CREATE AGGREGATE newcnt(*) (
           sfunc = int8inc,
           stype = int8,
           initcond = '0',
           parallel = safe
        );
DROP AGGREGATE IF EXISTS newcnt(*);
```

CASCADE和RESTRICT例子。

```
CREATE AGGREGATE newcnt(*) (
           sfunc = int8inc,
           stype = int8,
           initcond = '0',
           parallel = safe
        );
CREATE VIEW cascade_view AS
           SELECT newcnt(*) FROM pg_aggregate;
-- The following should error:
DROP AGGREGATE newcnt(*) RESTRICT;
-- The following should error:
DROP AGGREGATE newcnt(*);
DROP AGGREGATE newcnt(*) CASCADE;
```

## DROP CAST [*link*](#drop-cast)

**概要**

使用该DROP CAST语句删除转换。

**语法**

```
drop_cast ::= DROP CAST [ IF EXISTS ] ( cast_signature  )
             [ CASCADE | RESTRICT ]
```

**语义**

请参见[PostgreSQL docs] [postgresql-docs-drop-cast]中每个选项的语义。

**例子**

基本示例。

```
CREATE FUNCTION sql_to_date(integer) RETURNS date AS $$
           SELECT $1::text::date
           $$  LANGUAGE SQL IMMUTABLE STRICT;
CREATE CAST (integer AS date) WITH FUNCTION  sql_to_date(integer) AS ASSIGNMENT;
DROP CAST (integer AS date);
```

## DROP DATABASE [*link*](#drop-database)

**概要**

使用该DROP DATABASE语句从系统中删除数据库及其所有关联对象。这是不可逆转的操作。使用该连接执行语句后，当前打开的数据库连接将失效，然后关闭。

**语法**

```
drop_database ::= DROP DATABASE [ IF EXISTS ]  database_name
```

**语义**

DROP DATABASE [ IF EXISTS ] database\_name 删除数据库和所有关联的对象。database\_name在drop语句完成之后，所有与之相关的对象（例如表）将失效。与删除的数据库的所有连接都将失效，并最终断开连接。 database\_name 指定数据库的名称。

## DROP DOMAIN [*link*](#drop-domain)

**概要**

使用DROP DOMAIN语句从数据库中删除域。

**语法**

```
drop_domain ::= DROP DOMAIN [ IF EXISTS ] name [ , ...  ]
                [ CASCADE | RESTRICT ]
```

**语义**

name 指定现有域的名称。如果指定的域不存在（除非IF EXISTS设置），则会引发错误。如果任何对象都依赖此域（除非CASCADE设置了），则会引发错误。

IF EXISTS 如果域不存在，请不要抛出错误。

CASCADE 使用域数据类型自动删除依赖于域的对象（例如表列），然后自动除去依赖于那些对象的所有其他对象。

RESTRICT 如果对象依赖域，则拒绝删除域（默认）。

**例子**

```
CREATE DOMAIN idx DEFAULT 5 CHECK (VALUE > 0);
DROP DOMAIN idx;
```

```
CREATE DOMAIN idx DEFAULT 5 CHECK (VALUE > 0);
CREATE TABLE t (k idx primary key);
DROP DOMAIN idx CASCADE;
```

## DROP EXTENSION [*link*](#drop-extension)

**概要**

使用DROP EXTENSION语句从数据库中删除扩展名。

**语法**

```
drop_extension ::= DROP EXTENSION [ IF EXISTS ]  extension_name
                   [ , ... ] [ CASCADE | RESTRICT ]
```

**语义**

* 如果扩展名不存在，除非IF EXISTS使用扩展名，否则将引发错误。然后，发出通知。
* RESTRICT 是默认值，如果有任何对象依赖扩展名，它将不会删除该扩展名。
* CASCADE 将删除所有依赖于扩展名的可传递对象。

**例子**

```
DROP EXTENSION IF EXISTS cube;
```

```
CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;
DROP EXTENSION IF EXISTS cube RESTRICT;
```

```
DROP EXTENSION IF EXISTS cube CASCADE;
```

## DROP FUNCTION [*link*](#drop-function)

**概要**

使用DROP FUNCTION语句从数据库中删除函数。

**语法**

```
drop_function ::= DROP { FUNCTION | PROCEDURE } [ IF  EXISTS ]
                    { name [ ( [ argtype_decl [ , ... ] ] ) ] }
                    [ , ... ] [ CASCADE | RESTRICT ]

argtype_decl ::= [ argmode ] [ argname ] argtype
```

**语义**

* 如果该函数不存在，除非IF EXISTS使用该函数，否则将引发错误。然后发出通知。
* RESTRICT 是默认值，如果有任何对象依赖该函数，它将不会删除该函数。
* CASCADE 将会删除所有依赖该功能的对象。

**例子**

```
DROP FUNCTION IF EXISTS inc(i integer), mul(integer,  integer) CASCADE;
```

## DROP GROUP [*link*](#drop-group)

**概要**

使用DROP GROUP语句删除角色。DROP GROUP是DROP ROLE的别名

**语法**

```
drop_group ::= DROP GROUP [ IF EXISTS ] role_name [ ,  ... ]
```

**语义**

参阅DROP\_ROLE.

**例子**

删除一组。

```
DROP GROUP SysAdmin;
```

## DROP OPERATOR [*link*](#drop-operator)

**概要**

使用DROP OPERATOR语句删除运算符。

**语法**

```
drop_operator ::= DROP OPERATOR [ IF EXISTS ]
                    { operator_name ( operator_signature ) } [ , ... ]
                    [ CASCADE | RESTRICT ]

operator_signature ::= { left_type | NONE } , {  right_type | NONE }
```

**语义**

请参见[PostgreSQL docs] [postgresql-docs-drop-operator]中每个选项的语义。

**例子**

基本示例

```
CREATE OPERATOR @#@ (
          rightarg = int8,
          procedure = numeric_fac
       );
DROP OPERATOR @#@ (NONE, int8);
```

## DROP OPERATOR CLASS [*link*](#drop-operator-class)

**概要**

使用该DROP OPERATOR CLASS语句删除运算符类。

**语法**

```
drop_operator_class ::= DROP OPERATOR CLASS [ IF EXISTS  ]
                          operator_class_name USING index_method
                          [ CASCADE | RESTRICT ]
```

**语义**

请参见[PostgreSQL docs] [postgresql-docs-drop-operator-class]中每个选项的语义。

## DROP OWNED [*link*](#drop-owned)

**概要**

使用DROP OWNED语句可删除当前数据库中由指定角色之一拥有的所有数据库对象。在当前数据库或共享对象上授予给定角色的任何特权也将被撤销。

**语法**

```
drop_owned ::= DROP OWNED BY role_specification [ , ...  ]
                  [ CASCADE | RESTRICT ]

role_specification ::= role_name | CURRENT_USER |  SESSION_USER
```

**语义**

CASCADE 自动删除依赖于受影响对象的对象。

RESTRICT 这是默认模式，如果还有其他依赖于删除对象的数据库对象，则会引发错误。

**例子**

```
drop owned by john;
```

## DROP POLICY [*link*](#drop-policy)

**概要**

使用该DROP POLICY语句从表中删除指定的行级安全策略。请注意，如果删除了表的所有策略，并且该表仍然具有ENABLE ROW LEVEL SECURITY，则默认的拒绝所有策略将应用于该表。

**语法**

```
drop_policy ::= DROP POLICY [ IF EXISTS ] name ON  table_name
                [ CASCADE | RESTRICT ]
```

**语义**

* name 是要删除的策略的名称。
* table\_name 是该策略所在的表的名称。
* CASCADE/ RESTRICT没有任何作用，因为表策略没有任何依赖关系。

**例子**

```
DROP POLICY p1 ON table_foo;
```

## DROP PROCEDURE [*link*](#drop-procedure)

**概要**

使用DROP PROCEDURE语句从数据库中删除存储过程。

**语法**

```
drop_procedure ::= DROP PROCEDURE [ IF EXISTS ]
                     { name [ ( [ argtype_decl [ , ... ] ] ) ] }
                     [ , ... ] [ CASCADE | RESTRICT ]

argtype_decl ::= [ argmode ] [ argname ] argtype
```

**语义**

* 如果该过程不存在，除非IF EXISTS使用该过程，否则将引发错误。然后发出通知。
* RESTRICT 是默认值，如果有任何对象依赖该过程，它将不会删除该过程。
* CASCADE 会删除所有依赖该过程的可传递对象。

**例子**

```
DROP PROCEDURE IF EXISTS transfer(integer, integer, dec) CASCADE;
```

## DROP ROLE [*link*](#drop-role)

**概要**

使用该DROP ROLE语句删除指定的角色。

**语法**

```
drop_role ::= DROP ROLE [ IF EXISTS ] role_name [ , ... ]
```

**语义**

role\_name 是要删除的角色的名称。 要放弃超级用户角色，您必须自己是超级用户。要删除非超级用户角色，您必须具有CREATEROLE特权。

删除角色之前，必须删除其拥有的所有对象（或重新分配其所有权），并撤消已授予该角色在其他对象上的所有特权。REASSIGN OWNED和DROP OWNED命令可被用于此目的。

但是，没有必要删除涉及该角色的角色成员资格。DROP ROLE自动撤销其他角色中目标角色的所有成员身份，以及目标角色中其他角色的成员资格。其他角色不会丢失或受影响。

**例子**

```
DROP ROLE John;
```

## DROP RULE [*link*](#drop-rule)

**概要**

使用该DROP RULE语句删除规则。

**语法**

```
drop_rule ::= DROP RULE [ IF EXISTS ] rule_name ON  table_name
              [ CASCADE | RESTRICT ]
```

**语义**

请参见[PostgreSQL docs] [postgresql-docs-drop-rule]中每个选项的语义。

**例子**

```
CREATE TABLE t1(a int4, b int4);
CREATE TABLE t2(a int4, b int4);
CREATE RULE t1_to_t2 AS ON INSERT TO t1 DO INSTEAD
             INSERT INTO t2 VALUES (new.a, new.b);
DROP RULE t1_to_t2 ON t1;
```

## DROP SEQUENCE [*link*](#drop-sequence)

**概要**

使用该DROP SEQUENCE语句删除当前模式中的序列。

**语法**

```
drop_sequence ::= DROP SEQUENCE [ IF EXISTS ]  sequence_name
                  [ CASCADE | RESTRICT ]
```

**语义**

sequence\_name 指定序列的名称。

* 如果除非IF EXISTS指定，否则在当前模式中不存在具有该名称的序列，则会引发错误。
* 如果任何对象都依赖于此序列，则将引发错误，除非CASCADE指定了该选项。 CASCADE 还删除所有依赖于此顺序的对象（例如DEFAULT，表列中的值）。 RESTRICT 如果有任何对象依赖此序列，请不要删除它。即使未指定，这也是默认行为。

**例子**

```
CREATE TABLE t(k SERIAL, v INT);
DROP SEQUENCE t_k_seq;
DROP SEQUENCE t_k_seq CASCADE;
```

## DROP TABLE [*link*](#drop-table)

**概要**

使用该DROP TABLE语句从数据库中删除一个或多个表（及其所有数据）。

**语法**

```
drop_table  ::= DROP TABLE [ IF EXISTS ] table_name [ , ... ]
```

**语义**

if\_exists在正常操作下，如果表不存在，则会引发错误。添加IF EXISTS将静默忽略指定的任何不存在的表。

table\_name指定要删除的表的名称。与该表关联的对象（例如，准备好的语句）在该DROP TABLE语句完成之后最终将失效。

## DROP TRIGGER [*link*](#drop-trigger)

**概要**

使用该DROP TRIGGER语句从数据库中删除触发器。

**语法**

```
drop_trigger  ::= DROP TRIGGER [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]
```

**语义**

RESTRICT 是默认值，如果有任何对象依赖触发器，它将引发错误。

CASCADE 将删除所有（暂时地）取决于触发器的对象。

**例子**

```
DROP  TRIGGER update_moddatetime ON posts;
```

## DROP TYPE [*link*](#drop-type)

**概要**

使用该DROP TYPE语句从数据库中删除用户定义的类型。

**语法**

```
drop_type  ::= DROP TYPE [ IF EXISTS ] type_name [ , ... ] [ CASCADE | RESTRICT ]
```

**语义**

type\_name 指定要删除的用户定义类型的名称。

**例子**

```
CREATE  TYPE feature_struct AS (id INTEGER, name TEXT);

DROP  TYPE feature_struct;
```

IF EXISTS 示例。

```
DROP  TYPE IF EXISTS feature_shell;
```

CASCADE 示例。

```
CREATE  TYPE feature_enum AS ENUM ('one', 'two', 'three');
CREATE TABLE feature_tab_enum (feature_col feature_enum);
DROP TYPE feature_tab_enum  CASCADE;
```

RESTRICT 示例。

```
CREATE  TYPE feature_range AS RANGE (subtype=INTEGER);
CREATE TABLE feature_tab_range  (feature_col feature_range); -- The following should error: DROP TYPE  feature_range RESTRICT; DROP TABLE feature_tab_range;
DROP TYPE feature_range  RESTRICT;
```

## DROP USER [*link*](#drop-user)

**概要**

使用该DROP USER语句删除用户或角色。DROP USER是 DROP ROLE 的别名。

**语法**

```
drop_user  ::= DROP USER [ IF EXISTS ] role_name [ , ... ]
```

**语义**

参看DROP\_ROLE

**例子**

```
DROP USER John;
```

## END [*link*](#end)

**概要**

使用该END语句提交当前事务。事务所做的所有更改对其他人都可见，并且如果崩溃发生，保证可以持久。

**语法**

```
end  ::= END [ TRANSACTION | WORK ]
```

## EXECUTE [*link*](#execute)

**概要**

使用该EXECUTE语句执行先前准备的语句。这种分离是一种性能优化，因为准备好的语句将使用不同的值执行多次，而语法和语义分析以及重写在PREPARE处理期间仅执行一次。

**语法**

```
execute_statement  ::= EXECUTE name [ ( expression [ , ... ] ) ]
```

**语义**

name指定要执行的准备好的语句的名称。

expression指定表达式。中的每个表达式EXECUTE必须与中的对应数据类型匹配PREPARE。

**例子**

创建一个sample表。

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text, PRIMARY KEY (k1, k2));
```

执行一次简单插入。

```
PREPARE  ins (bigint, double precision, int, text) AS INSERT INTO sample(k1, k2, v1,  v2) VALUES ($1, $2, $3, $4);
```

执行两次插入。

```
EXECUTE  ins(1, 2.0, 3, 'a'); EXECUTE ins(2, 3.0, 4, 'b');
```

检查结果。

```
SELECT * FROM sample ORDER BY k1;
```

## EXPLAIN [*link*](#explain)

**概要**

使用该EXPLAIN语句显示一条语句的执行计划。如果使用该ANALYZE选项，则将执行该语句，而不仅仅是计划的语句。在这种情况下，执行信息（而不仅仅是计划者的估计）将添加到EXPLAIN结果中。

**语法**

```
explain  ::= EXPLAIN [ [ ANALYZE ] [ VERBOSE ] | ( option [ , ... ] ) ] statement

option  ::= ANALYZE [ boolean ] | VERBOSE [ boolean ] | COSTS [ boolean ] | BUFFERS [  boolean ] | TIMING [ boolean ] | SUMMARY [ boolean ] | FORMAT { TEXT | XML |  JSON | YAML }
```

**语义**

ANALYZE执行该语句并显示实际运行时间和其他统计信息。

**例子**

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text, PRIMARY KEY (k1,  k2));
INSERT INTO sample(k1, k2, v1, v2) VALUES (1, 2.0, 3, 'a'), (2, 3.0, 4,  'b'), (3, 4.0, 5, 'c'); EXPLAIN SELECT * FROM sample WHERE k1 = 1; QUERY PLAN

Foreign  Scan on sample (cost=0.00..112.50 rows=1000 width=44) (1 row)
```

## GRANT [*link*](#grant)

**概要**

使用该GRANT语句授予对数据库对象的访问特权，并分配角色成员身份。

**语法**

```
grant_table  ::= GRANT { { SELECT | INSERT | UPDATE | DELETE | TRUNCATE | REFERENCES |  TRIGGER } [ , ... ] | ALL [ PRIVILEGES ] } ON { [ TABLE ] table_name [ , ...  ] | ALL TABLES IN SCHEMA schema_name [ , ... ] } TO grant_role_spec [ , ... ]  [ WITH GRANT OPTION ]

grant_table_col  ::= GRANT { { SELECT | INSERT | UPDATE | REFERENCES } ( column_names ) [  ,(column_names ... ] | ALL [ PRIVILEGES ] ( column_names ) } ON { [ TABLE ]  table_name [ , ... ] } TO grant_role_spec [ , ... ] [ WITH GRANT OPTION ]

grant_seq  ::= GRANT { { USAGE | SELECT | UPDATE } [ , ... ] | ALL [ PRIVILEGES ] } ON {  SEQUENCE sequence_name [ , ... ] | ALL SEQUENCES IN SCHEMA schema_name [ ,  sequence_name [ ... ] ] } TO grant_role_spec [ , ... ] [ WITH GRANT OPTION ]

grant_db  ::= GRANT { { CREATE | CONNECT | TEMPORARY | TEMP } [ , ... ] | ALL [  PRIVILEGES ] } ON DATABASE database_name [ , ... ] TO grant_role_spec [ , ...  ] [ WITH GRANT OPTION ]

grant_domain  ::= GRANT { USAGE | ALL [ PRIVILEGES ] } ON DOMAIN domain_name [ , ... ] TO  grant_role_spec [ , ... ] [ WITH GRANT OPTION ]

grant_schema  ::= GRANT { { CREATE | USAGE } [ , ... ] | ALL [ PRIVILEGES ] } ON SCHEMA  schema_name [ , ... ] TO grant_role_spec [ , ... ] [ WITH GRANT OPTION ]

grant_type  ::= GRANT { USAGE | ALL [ PRIVILEGES ] } ON TYPE type_name [ , ... ] TO  grant_role_spec [ , ... ] [ WITH GRANT OPTION ]

grant_role  ::= GRANT role_name [ , ... ] TO role_name [ , ... ] [ WITH ADMIN OPTION ]

grant_role_spec  ::= [ GROUP ] role_name | PUBLIC | CURRENT_USER | SESSION_USER
```

**语义**

GRANT 可用于分配数据库对象以及角色成员的特权。

GRANT 在数据库对象上

此GRANT命令的变体用于将数据库对象的特权分配给一个或多个角色。如果使用关键字PUBLIC代替role\_name，则表示将特权授予所有角色，包括以后可能创建的角色。

如果WITH GRANT OPTION指定，则特权的接收者可以依次将其授予其他人。没有授予选项，接收者将无法做到这一点。授予选项不能授予PUBLIC。

无需授予对象所有者（通常是创建对象的用户）特权，因为默认情况下所有者具有所有特权。（不过，所有者可以出于安全考虑选择撤销自己的某些特权。）

· + SELECT

这允许从指定表，视图或序列的任何或指定列中进行SELECT。它还允许使用COPY TO。在UPDATE或DELETE中引用现有列值时，也需要此特权。

· + INSERT

这允许将新行插入到指定表中。如果列出了特定的列，则只能在INSERT命令中将这些列分配给其他列（因此其他列将接收默认值）。还允许COPY FROM。

· + UPDATE

这允许更新指定表的任何列或列出的特定列。

· + DELETE

这允许从指定表中删除一行。

· + TRUNCATE

这允许在指定的表上执行TRUNCATE。

· + REFERENCES

这允许创建引用指定表或表的指定列的外键约束。

· + TRIGGER

这允许在指定的表上创建触发器。

· + CREATE

对于数据库，这允许在数据库中创建新的架构。

对于模式，这允许在模式内创建新对象。要重命名现有对象，您必须拥有该对象，并对包含的架构具有此特权。

· + CONNECT

这使用户可以连接到指定的数据库。连接启动时检查此特权。

· + TEMPORARY/TEMP

这允许在使用指定的数据库时创建临时表。

· + EXECUTE

允许使用指定的功能或过程，以及使用在该功能之上实现的任何运算符。

· + USAGE

对于模式，这允许访问指定模式中包含的对象（假设还满足对象自己的特权要求）。从本质上讲，这允许被授予者“查询”架构中的对象。

对于序列，此特权允许使用currval()和nextval()函数。

对于类型和域，此特权允许在创建表，函数和其他架构对象时使用类型或域。

· + ALL PRIVILEGES

一次授予所有特权。

GRANT 在角色上的这一变体GRANT用于将一个角色的成员资格授予一个或多个其他角色。如果WITH ADMIN OPTION指定，则成员可以依次将角色的成员身份授予其他人，也可以撤消该角色的成员身份。

**例子**

向表“ stores”上的所有用户授予SELECT特权。

```
GRANT  SELECT ON stores TO PUBLIC;
```

将用户John添加到SysAdmins组。

```
GRANT SysAdmins TO John;
```

## INSERT [*link*](#insert)

**概要**

使用该INSERT语句将一或多个行添加到指定的表。

**语法**

```
insert  ::= [ WITH [ RECURSIVE ] with_query [ , ... ] ] INSERT INTO table_name [ AS  alias ] [ ( column_names ) ]
{ DEFAULT VALUES | VALUES ( column_values ) [ ,(column_values ... ] |  subquery }
[ ON CONFLICT [ conflict_target ] conflict_action ]
[ returning_clause ]

returning_clause  ::= RETURNING { * | { output_expression [ [ AS ] output_name ] } [ , ... ] }

column_values  ::= { expression | DEFAULT } [ , ... ]

conflict_target  ::= ( { column_name | expression } [ , ... ] ) [ WHERE condition ] | ON  CONSTRAINT constraint_name

conflict_action  ::= DO NOTHING | DO UPDATE SET update_item [ , ... ] [ WHERE condition ]
```

**语义**

table\_name指定表的名称。如果指定的表不存在，则会引发错误。

column\_names指定以逗号分隔的列名称列表。如果指定的列不存在，则会引发错误。每个主键列都必须具有非null值。

VALUES clause

· 每个值列表必须与列列表具有相同的长度。

· 每个值必须可转换为其相应的（按位置）列类型。

· 每个值文字可以是一个表达式。

ON CONFLICT clause

· 目标表必须至少具有一个具有唯一索引或唯一约束的列（列表）。我们将其称为唯一密钥。VALUES的参数是一种关系，必须至少包含目标表的唯一键之一。此唯一键的某些值可能是新值，而其他值可能已存在于目标表中。

· INSERT ON CONFLICT的基本目的是简单地插入具有唯一键的新值的行，并使用唯一键的现有值更新行，以将其余指定列的值设置为VALUES关系中的值。这样，最终效果是插入或更新。因此，“ INSERT ON CONFLICT”变体通常被通俗地称为“ upsert”。

**例子**

基本示例

```
CREATE  TABLE sample(k1 int, k2 int, v1 int, v2 text, PRIMARY KEY (k1, k2));

INSERT  INTO sample VALUES (1, 2.0, 3, 'a'), (2, 3.0, 4, 'b'), (3, 4.0, 5, 'c');

SELECT  * FROM sample ORDER BY k1;
```

“ upsert”示例。重新创建并重新填充示例表。

```
DROP  TABLE IF EXISTS sample CASCADE;

CREATE  TABLE sample( id int CONSTRAINT sample_id_pk PRIMARY KEY, c1 text CONSTRAINT  sample_c1_NN NOT NULL, c2 text CONSTRAINT sample_c2_NN NOT NULL);

INSERT  INTO sample(id, c1, c2) VALUES (1, 'cat' , 'sparrow'), (2, 'dog' ,  'blackbird'), (3, 'monkey' , 'thrush');

SELECT  id, c1, c2 FROM sample ORDER BY id;

INSERT INTO sample(id, c1, c2) VALUES (3,  'horse' , 'pigeon'), (4, 'cow' , 'robin') ON CONFLICT DO NOTHING;
```

## LOCK [*link*](#lock)

**概要**

使用该LOCK语句锁定表。

**语法**

```
lock_table  ::= LOCK [ TABLE ] { { [ ONLY ] name [ * ] } [ , ... ] } [ IN lockmode MODE ]  [ NOWAIT ]  lockmode  ::= ACCESS SHARE| ROW SHARE | ROW EXCLUSIVE | SHARE UPDATE EXCLUSIVE | SHARE  | SHARE ROW EXCLUSIVE | EXCLUSIVE | ACCESS EXCLUSIVE
```

**语义**

name指定要锁定的现有表。

lockmode目前仅支持 ACCESS SHARE 锁模式。

下面列出的所有其他模式正在开发中。

ACCESS SHARE | ROW SHARE | ROW EXCLUSIVE | SHARE UPDATE EXCLUSIVE | SHARE | SHARE ROW EXCLUSIVE | EXCLUSIVE | ACCESS EXCLUSIVE

## PREPARE [*link*](#prepare)

**概要**

使用该PREPARE语句创建目标语句句柄。用来分析和重写（但不执行）。

**语法**

```
prepare_statement ::= PREPARE name [ ( data_type [ ,  ... ] ) ] AS statement
```

**语义**

PREPARE可能（应该）包含$1将由中的表达式列表提供的参数（例如）EXECUTE。

数据类型列表PREPARE表示语句中使用的参数的类型。

**例子**

```
CREATE  TABLE sample(k1 int, k2 int, v1 int, v2 text, PRIMARY KEY (k1, k2));

PREPARE  ins (bigint, double precision, int, text) AS INSERT INTO sample(k1, k2, v1,  v2) VALUES ($1, $2, $3, $4);

EXECUTE  ins(1, 2.0, 3, 'a');

EXECUTE  ins(2, 3.0, 4, 'b');

SELECT  * FROM sample ORDER BY k1;
```

## REASSIGN OWNED [*link*](#reassign-owned)

**概要**

使用该REASSIGN OWNED语句可以将数据库对象的所有权由 old\_roles改为 new\_role。

**语法**

```
reassign_owned  ::= REASSIGN OWNED BY role_specification [ , ... ] TO role_specification

role_specification  ::= role_name | CURRENT_USER | SESSION_USER
```

**语义**

REASSIGN OWNED通常用于准备删除角色。它要求源角色和目标角色都具有成员身份。

**例子**

```
reassign  owned by john to memfire;
```

## RESET [*link*](#reset)

**概要**

使用该RESET语句将运行时参数的值恢复为默认值。RESET映射到SET configuration\_parameter TO DEFAULT。

**语法**

```
reset_stmt  ::= RESET { name | ALL }
```

**语义**

**configuration\_parameter**指定可变的运行时参数的名称。

## REVOKE [*link*](#revoke)

**概要**

使用该REVOKE语句删除一个或多个角色的访问权限。

**语法**

```
revoke_table  ::= REVOKE [ GRANT OPTION FOR ] { { SELECT | INSERT | UPDATE | DELETE |  TRUNCATE | REFERENCES | TRIGGER } [ , ... ] | ALL [ PRIVILEGES ] } ON { [  TABLE ] table_name [ , ... ] | ALL TABLES IN SCHEMA schema_name [ , ... ] }  FROM { [ GROUP ] role_name | PUBLIC } [ , ... ] [ CASCADE | RESTRICT ]

revoke_table_col  ::= REVOKE [ GRANT OPTION FOR ] { { SELECT | INSERT | UPDATE | REFERENCES } (  column_names ) [ ,(column_names ... ] | ALL [ PRIVILEGES ] ( column_names ) }  ON [ TABLE ] table_name [ , ... ] FROM { [ GROUP ] role_name | PUBLIC } [ ,  ... ] [ CASCADE | RESTRICT ]

revoke_seq  ::= REVOKE [ GRANT OPTION FOR ] { { USAGE | SELECT | UPDATE } [ , ... ] | ALL  [ PRIVILEGES ] } ON { SEQUENCE sequence_name [ , ... ] | ALL SEQUENCES IN  SCHEMA schema_name [ , ... ] } FROM { [ GROUP ] role_name | PUBLIC } [ , ...  ] [ CASCADE | RESTRICT ]

revoke_db  ::= REVOKE [ GRANT OPTION FOR ] { { CREATE | CONNECT | TEMPORARY | TEMP } [ ,  ... ] | ALL [ PRIVILEGES ] } ON DATABASE database_name [ , ... ] FROM { [  GROUP ] role_name | PUBLIC } [ , ... ] [ CASCADE | RESTRICT ]

revoke_domain  ::= REVOKE [ GRANT OPTION FOR ] { USAGE | ALL [ PRIVILEGES ] } ON DOMAIN  domain_name [ , ... ] FROM { [ GROUP ] role_name | PUBLIC } [ , ... ] [  CASCADE | RESTRICT ]

revoke_schema  ::= REVOKE [ GRANT OPTION FOR ] { { CREATE | USAGE } [ , ... ] | ALL [  PRIVILEGES ] } ON SCHEMA schema_name [ , ... ] FROM { [ GROUP ] role_name |  PUBLIC } [ , ... ] [ CASCADE | RESTRICT ]

revoke_type  ::= REVOKE [ GRANT OPTION FOR ] { USAGE | ALL [ PRIVILEGES ] } ON TYPE  type_name [ , ... ] FROM { [ GROUP ] role_name | PUBLIC } [ , ... ] [ CASCADE  | RESTRICT ]

revoke_role  ::= REVOKE [ ADMIN OPTION FOR ] role_name [ , ... ] FROM role_name [ , ... ]  [ CASCADE | RESTRICT ]
```

**语义**

任何角色都有分配给它的所有特权的总和。所以，如果REVOKE是用于撤消SELECT从PUBLIC，那么它并不意味着所有角色都失去SELECT特权。如果角色已SELECT直接授予或通过组继承，则它可以继续保留SELECT特权。

如果GRANT OPTION FOR指定，则仅撤销特权的授予选项，而不撤销特权本身。否则，特权和授予选项都将被吊销。

同样，在撤消角色时（如果ADMIN OPTION FOR已指定），则仅撤消特权的admin选项。

如果一个用户拥有带有授予选项的特权，并且已经将其授予其他用户，则如果CASCADE指定了特权，则从第一个用户撤消该特权也会从相关用户撤消它。否则，REVOKE将失败。

撤消表的特权时，表的每一列也会自动撤消相应的列特权（如果有）。另一方面，如果已向角色授予表特权，则从各个列中撤消相同特权将无效。

**例子**

```
REVOKE  SELECT ON stores FROM PUBLIC; REVOKE SysAdmins FROM John;
```

## ROLLBACK [*link*](#rollback)

**概要**

使用该ROLLBACK语句回滚当前事务。此事务中包含的所有更改将被丢弃。

**语法**

```
rollback  ::= ROLLBACK [ TRANSACTION | WORK ]
```

**语义**

WORK可选

TRANSACTION可选

## SELECT [*link*](#select)

**概要**

使用该SELECT语句从表中检索满足给定条件的指定列的行。它指定要检索的列，表的名称以及每个选定行必须满足的条件。

无论您在何处使用子查询，都可以使用相同的语法规则（例如在INSERTstatement中）。某些语法点（例如，WHERE子句谓词或诸如的函数的实际参数）sqrt()仅允许标量子查询。

**语法**

```
select  ::= [ WITH [ RECURSIVE ] { with_query [ , ... ] } ] SELECT [ ALL | DISTINCT [  ON { ( expression [ , ... ] ) } ] ] [ * | { { expression | fn_over_window } [  [ AS ] name ] } [ , ... ] ] [ FROM { from_item [ , ... ] } ]
[ WHERE condition ]
[ GROUP BY { grouping_element [ , ... ] } ]
[ HAVING { condition [ , ... ] } ]
[ WINDOW { { name AS window_definition } [ , ... ] } ]
[ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] select ] [ ORDER BY {  order_expr [ , ... ] } ]
[ LIMIT [ integer | ALL ] ]
[ OFFSET integer [ ROW | ROWS ] ]

fn_over_window  ::= fn_invocation [ FILTER ( WHERE { boolean_expression [ , ... ] } ) ] OVER  { window_definition | name }

order_expr  ::= expression [ ASC | DESC | USING operator_name ] [ NULLS { FIRST | LAST }  ]
```

**语义**

如果指定的table\_name不存在，则会引发错误。

\*代表所有列。

尽管where子句允许使用多种运算符，但是where子句中使用的确切条件具有重要的性能考虑因素（尤其是对于大型数据集）。

condition指定一个计算结果为布尔值的表达式。

有关详细信息from\_item，grouping\_element以及with\_query看到SELECT 在PostgreSQL文档中。

**例子**

```
CREATE  TABLE sample1(k1 bigint, k2 float, v text, PRIMARY KEY (k1, k2));

CREATE  TABLE sample2(k1 bigint, k2 float, v text, PRIMARY KEY (k1, k2));

INSERT  INTO sampleINSERT INTO sample2(k1, k2, v) VALUES (1, 2.5, 'foo'), (1, 4.5,  'bar');

INSERT INTO sample2(k1, k2, v) VALUES (1,  2.5, 'foo'), (1, 4.5, 'bar');

SELECT  a.k1, a.k2, a.v as av, b.v as bv FROM sample1 a LEFT JOIN sample2 b ON (a.k1  = b.k1 and a.k2 = b.k2) WHERE a.k1 = 1 AND a.k2 IN (2.5, 3.5) ORDER BY a.k2  DESC;
```

## SET [*link*](#set)

**概要**

使用该SET语句更新运行时控制参数。

**语法**

```
set  ::= SET [ SESSION | LOCAL ] { configuration_parameter { TO | = } { value |  DEFAULT } | TIME ZONE { timezone | LOCAL | DEFAULT } }
```

**语义**

尽管可以设置，显示和重置参数的值，但MemFire尚不支持这些参数的效果。目前将使用默认设置和行为。

SESSION指定该命令仅影响当前会话。

LOCAL指定该命令仅影响当前事务。COMMIT或之后ROLLBACK，会话级设置再次生效。

configuration\_parameter指定可变的运行时参数的名称。

value指定参数的新值。

## SET CONSTRAINTS [*link*](#set-constraints)

**概要**

使用该SET CONSTRAINTS语句设置当前事务中约束检查的时间。

**语法**

```
set_constraints  ::= SET CONSTRAINTS { ALL | name [ , ... ] } { DEFERRED | IMMEDIATE }
```

**语义**

SET CONSTRAINTS语句中的属性符合SQL标准中定义的行为，但不适用于NOT NULL和CHECK约束。

SET CONSTRAINTS { ALL | \*name [ , … ] } { DEFERRED | IMMEDIATE }

ALL更改所有可延迟约束的模式。

name指定约束名称之一或列表。

DEFERRED将约束设置为在事务提交之前不检查约束。

除非标记，否则立即检查唯一性和排除约束DEFERRABLE。

IMMEDIATE设置约束以追溯生效。

## SET ROLE [*link*](#set-role)

**概要**

使用该SET ROLE语句将当前会话的当前用户设置为指定用户。

**语法**

```
set_role  ::= SET [ SESSION | LOCAL ] ROLE { role_name | NONE } reset_role ::= RESET  ROLE
```

**语义**

指定role\_name的角色必须是当前会话用户所属的角色。超级用户可以设置为任何角色。一旦将角色设置为role\_name，任何其他SQL命令将使用该角色可用的特权。

将角色重置回当前用户，RESET ROLE或SET ROLE NONE可以使用。

**例子**

换上新角色约翰

```
select  session_user, current_user;

set  role john;

select  session_user, current_user;
```

## SET SESSION AUTHORIZATION [*link*](#set-session-authorization)

**概要**

使用该SET SESSION AUTHORIZATION语句将当前会话的当前用户和会话用户设置为指定用户。

**语法**

```
set_session_authorization  ::= SET [ SESSION | LOCAL ] SESSION AUTHORIZATION { role_name | DEFAULT }

reset_session_authorization  ::= RESET SESSION AUTHORIZATION
```

**语义**

会话用户只能由超级用户更改。一旦role\_name将会话用户设置为，任何其他SQL命令将使用该角色可用的特权。

可以将会话用户重置为当前经过身份验证的用户，RESET SESSION AUTHORIZATION或者SET SESSION AUTHORIZATION DEFAULT可以使用。

**例子**

将会话用户设置为John。

```
Set session user to John.

select  session_user, current_user;

SET  select session_user, current_user;
```

## SET TRANSACTION [*link*](#set-transaction)

**概要**

使用该SET TRANSACTION语句设置当前事务隔离级别。

**语法**

```
set  ::= SET [ SESSION | LOCAL ] { configuration_parameter { TO | = } { value |  DEFAULT } | TIME ZONE { timezone | LOCAL | DEFAULT } }
```

**语义**

***\*transaction\_mode\****

将事务处理模式设置为以下之一。

· ISOLATION LEVEL 条款

· 存取方式

· DEFERRABLE 模式

**ISOLATION LEVEL clause**

+ SERIALIZABLE

+ REPEATABLE READ

+ READ COMMITTED

+ READ UNCOMMITTED

**READ WRITE** **模式**

默认该模式

**READ ONLY** **模式**

该READ ONLY模式不会阻止所有写入磁盘。

当事务为时READ ONLY，以下SQL语句：

+ 如果他们要写入的表不是临时表，则不允许使用。

+ INSERT

+ UPDATE

+ DELETE

+ COPY FROM

+ 一律禁止

+ COMMENT

+ GRANT

+ REVOKE

+ TRUNCATE

+ 当将要执行的语句是上述之一时，不允许使用

+ EXECUTE

+ EXPLAIN ANALYZE

***\*DEFERRABLE mode\****

仅当同时选择SERIALIZABLE和READ ONLY模式时，才用于延迟事务。如果使用该事务，则该事务在首次获取其快照时可能会阻塞，此后它可以在没有SERIALIZABLE事务的正常开销的情况下运行，并且没有任何导致序列化失败或被序列化失败取消的风险。

该DEFERRABLE模式对于长时间运行的报告或备份可能很有用。

**例子**

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text,  PRIMARY KEY (k1, k2));
BEGIN TRANSACTION;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
INSERT INTO sample(k1, k2, v1, v2) VALUES (1, 2.0, 3,  'a'), (1, 3.0, 4, 'b');
COMMIT TRANSACTION; -- run in first shell.
```

## SHOW [*link*](#show)

**概要**

使用该SHOW语句显示运行时参数的值。

**语法**

```
show_stmt  ::= SHOW { name | ALL }
```

**语义**

configuration\_parameter指定要显示的参数的名称。

ALL显示所有配置参数的值以及说明。

## SHOW TRANSACTION [*link*](#show-transaction)

**概要**

使用该SHOW TRANSACTION语句显示当前的事务隔离级别。

**语法**

```
show_transaction  ::= SHOW TRANSACTION ISOLATION LEVEL
```

**语义**

在TRANSACTION ISOLATION LEVEL返回的要么是SERIALIZABLE或REPEATABLE READS。在MemFire中，PostgreSQL 的READ COMMITTED和READ UNCOMMITTED映射到REPEATABLE READS。

## TRUNCATE [*link*](#truncate)

**概要**

使用该TRUNCATE语句清除表中的所有行。

**语法**

```
truncate  ::= TRUNCATE [ TABLE ] { { [ ONLY ] name [ * ] } [ , ... ] }
```

**语义**

name指定要截断的表的名称。

TRUNCATE获取ACCESS EXCLUSIVE锁。在ACCESS EXCLUSIVE 锁 还没有完全支持。

TRUNCATE 外部表不支持。

**例子**

```
CREATE TABLE sample(k1 int, k2 int, v1 int, v2 text,  PRIMARY KEY (k1, k2));
INSERT INTO sample VALUES (1, 2.0, 3, 'a'), (2, 3.0, 4,  'b'), (3, 4.0, 5, 'c');
SELECT * FROM sample ORDER BY k1;
TRUNCATE sample; SELECT * FROM sample;
```

## UPDATE [*link*](#update)

**概要**

使用UPDATE语句修改满足某些条件的所有行中指定列的值，并且当WHERE子句中未提供条件时，将更新所有行。UPDATE输出要更新的行数。

**语法**

```
update  ::= [ WITH [ RECURSIVE ] with_query [ , ... ] ] UPDATE [ ONLY ] table_name [  * ] [ [ AS ] alias ] SET update_item [ , ... ] [ WHERE condition | WHERE  CURRENT OF cursor_name ] [ returning_clause ]

returning_clause  ::= RETURNING { * | { output_expression [ [ AS ] output_name ] } [ , ... ] }

update_item  ::= column_name = column_value | ( column_names ) = [ ROW ] ( column_values )  | ( column_names ) = ( query )

column_values  ::= { expression | DEFAULT } [ , ... ]

column_names  ::= column_name [ , ... ]
```

**语义**

尚不支持更新包含PRIMARY KEY的索引键一部分的列。

尽管该WHERE子句允许使用多种运算符，但是where子句中使用的确切条件具有重要的性能考虑因素（尤其是对于大型数据集）。为了获得最佳性能，请使用WHERE为PRIMARY KEY或中的所有列提供值的子句INDEX KEY。

with\_query指定在UPDATE语句中按名称引用的子查询。

table\_name指定要更新的表的名称

alias在UPDATE语句中指定目标表的标识符。指定别名后，必须使用别名代替语句中的实际表。

column\_name在表中指定要更新的列。

expression指定要分配给列的值。当表达式引用一列时，该列的旧值用于评估。

output\_expression指定要返回的值。当output\_expression引用一列时，该列的新值（更新值）用于评估。

subquery指定SELECT子查询语句。其选择的值将分配给指定的列。

**例子**

```
CREATE  TABLE sample(k1 int, k2 int, v1 int, v2 text, PRIMARY KEY (k1, k2));

INSERT  INTO sample VALUES (1, 2.0, 3, 'a'), (2, 3.0, 4, 'b'), (3, 4.0, 5, 'c');

SELECT  * FROM sample ORDER BY k1; UPDATE sample SET v1 = v1 + 3, v2 = '7' WHERE k1 =  2 AND k2 = 3;

SELECT  * FROM sample ORDER BY k1;
```

---

[*navigate\_before* 数据类型](/docs/db/guides/data-type/)

[函数与操作 *navigate\_next*](/docs/db/guides/functions-and-operations/)