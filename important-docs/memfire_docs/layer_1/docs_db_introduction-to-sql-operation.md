# SQL操作入门 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/introduction-to-sql-operation/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

分类

# SQL操作入门

MemFireDB兼容PostgreSQL 11.2版本，具体可以参考[兼容性说明](/docs/db/guides/compatibility/)。  
新建数据库后，您可以使用在线编辑器、兼容的客户端工具连接数据库并执行SQL语句建表存储数据。  
SQL 是一门声明性语言，它是数据库用户与数据库交互的方式。它更像是一种自然语言，好像在用英语与数据库进行对话。本文档介绍基本的SQL操作。

## 分类 [*link*](#%e5%88%86%e7%b1%bb)

SQL主要组件包括数据定义语言（DDL）、数据操作语言（DML）、数据控制语言（DCL）。

* DDL (Data Definition Language)：数据定义语言，用来定义数据库对象，包括库、表、视图和索引等。DDL语句通过CREATE、ALTER和DROP命令来定义数据库中的结构、更改定义以及删除定义。
* DML (Data Manipulation Language)：数据操作语言，用来操作和业务相关的记录。 DML语句主要包括增、删、查、改操作。
* DCL (Data Control Language)：数据控制语言，用来定义访问权限和安全级别。
* TCL（Transaction control language ）：TCL语句管理数据库上的操作事务。

## 创建、查看、删除表 [*link*](#%e5%88%9b%e5%bb%ba%e6%9f%a5%e7%9c%8b%e5%88%a0%e9%99%a4%e8%a1%a8)

### 创建表 [*link*](#%e5%88%9b%e5%bb%ba%e8%a1%a8)

要创建一个表，我们要用到`CREATE TABLE`命令。在这个命令中 我们需要为新表至少指定一个名字、列的名字及数据类型。例如：  
让我们创建一个简单的表，如下所示。

```
CREATE TABLE employees (
    employee_no integer,
    name text,
    department text
);
```

### 查询表结构 [*link*](#%e6%9f%a5%e8%af%a2%e8%a1%a8%e7%bb%93%e6%9e%84)

要描述我们刚刚创建的表，请执行以下操作。

```
\d employees
```

输出：

```
Table "public.employees"

   Column    |  Type   | Collation | Nullable | Default
-------------+---------+-----------+----------+---------
 employee_no | integer |           |          |
 name        | text    |           |          |
 department  | text    |           |          |
```

### 删除表 [*link*](#%e5%88%a0%e9%99%a4%e8%a1%a8)

一个表能够拥有的列的数据是有限的，根据列的类型，这个限制介于250和1600之间。但是，极少会定义一个接近这个限制的表，即便有也是一个值的商榷的设计。   
如果我们不再需要一个表，我们可以通过使用`DROP TABLE`命令来移除它。例如：

```
DROP TABLE employees;
```

尝试移除一个不存在的表会引起错误。然而，在SQL脚本中在创建每个表之前无条件地尝试移除它的做法是很常见的，即使发生错误也会忽略之，因此这样的脚本可以在表存在和不存在时都工作得很好（如果你喜欢，可以使用`DROP TABLE IF EXISTS`变体来防止出现错误消息，但这并非标准SQL）。

## 创建、查看、删除索引 [*link*](#%e5%88%9b%e5%bb%ba%e6%9f%a5%e7%9c%8b%e5%88%a0%e9%99%a4%e7%b4%a2%e5%bc%95)

索引可以提高数据的访问速度，但同时也增加了插入、更新和删除操作的处理时间。所以是否要为表增加索引，索引建立在哪些字段上，是创建索引前必须要考虑的问题。需要分析应用程序的业务处理、数据使用、经常被用作查询的条件、或者被要求排序的字段来确定是否建立索引。

常见操作包括:

### 创建索引 [*link*](#%e5%88%9b%e5%bb%ba%e7%b4%a2%e5%bc%95)

```
CREATE INDEX employees_name ON employees(name ASC);
```

### 删除索引 [*link*](#%e5%88%a0%e9%99%a4%e7%b4%a2%e5%bc%95)

```
DROP INDEX employees_name;
```

## 记录的增删改查 [*link*](#%e8%ae%b0%e5%bd%95%e7%9a%84%e5%a2%9e%e5%88%a0%e6%94%b9%e6%9f%a5)

### 插入数据 [*link*](#%e6%8f%92%e5%85%a5%e6%95%b0%e6%8d%ae)

在创建一个表后，表中并没有数据，在使用这个表之前，需要向表中插入数据。用户可以一次插入一行或多行数据，也可以从指定表插入数据。

新建数据库表未填充数据,可以通过一次插入一行来添加包含完整或部分数据的一行或多行。

例如，您使用的数据库包括下表：

```
CREATE TABLE employees (
    employee_no integer,
    name text,
    department text
);
```

**插入一行数据**

假设您知道表中的列顺序，则可以通过执行以下命令来插入行：

```
INSERT INTO employees VALUES (1, 'John Smith', 'Marketing');
```

如果您不知道列的顺序，则可以选择INSERT在添加新行时在语句中列出它们，如下所示：

```
INSERT INTO employees (employee_no, name, department)
VALUES (1, 'John Smith', 'Marketing');
```

您可以通过执行以下命令来查看更改：

```
SELECT * FROM employees;
```

您始终可以通过执行以下命令来查看表架构：

```
memfire=# \d employees
```

**插入多行数据**

您可以使用通过执行一条`INSERT`语句来插入多行，如以下示例所示：

```
INSERT INTO employees
VALUES
(1, 'John Smith', 'Marketing'),
(2, 'Bette Davis', 'Sales'),
(3, 'Lucille Ball', 'Operations');
```

### 更新数据 [*link*](#%e6%9b%b4%e6%96%b0%e6%95%b0%e6%8d%ae)

修改已经存储在数据库中数据的行为叫做更新。用户可以更新单独一行，所有行或者指定的部分行。还可以独立更新每个字段，而其他字段则不受影响。

MemFireDB允许您更新表中的单个行，所有行或一组行。您可以分别更新每列。

下面的示例创建一个表，并用数据填充该表：

```
CREATE TABLE employees (
    employee_no integer PRIMARY KEY,
    name text UNIQUE,
    department text NOT NULL
);
INSERT INTO employees
VALUES
(1, 'John Smith', 'Marketing'),
(2, 'Bette Davis', 'Sales'),
(3, 'Lucille Ball', 'Operations');
```

如果员工Lucille Ball的部门从“操作工人”更改为“销售”，则该`employees`表可使用该UPDATE语句进行了修改。

```
UPDATE employees SET department ='Sales' WHERE name = 'Lucille Ball';
```

`Upsert`是在行插入过程中的合并：当您插入新表行时，会检查该行是否已存在，如果存在，则更新该行。否则，将插入新行。

如果员工John Smith的部门从“市场营销”更改为“销售”，则该employees表可能已使用该UPDATE语句进行了修改。MemFireDB提供了
`INSERT ON CONFLICT`可用于执行upsert的语句：如果已指派John Smith在这两个部门中工作，则可以将其UPDATE用作该INSERT语句的操作，如以下示例所示：

```
INSERT INTO employees (employee_no, name, department)
VALUES (1, 'John Smith', 'Sales')
ON CONFLICT (name)
DO
UPDATE SET department = EXCLUDED.department || ';' || employees.department;
```

以下是前面的示例产生的输出：

```
employee_no | name          | department
-------------+---------------+-----------------
 1           | John Smith    | Sales;Marketing
 2           | Bette Davis   | Sales
 3           | Lucille Ball  | Sales
```

在某些情况下，`DO NOTHING`如果表中已存在特定记录，则无需采取任何操作()。例如，执行以下操作不会更改Bette Davis的部门：

```
INSERT INTO employees (employee_no, name, department)
VALUES (2, 'Bette Davis', 'Operations');
ON CONFLICT
DO NOTHING;
```

### 删除数据 [*link*](#%e5%88%a0%e9%99%a4%e6%95%b0%e6%8d%ae)

可以通过执行该`DELETE`语句从表中删除行。与更新行一样，您可以根据语句中定义的一个或多个条件删除特定行。如果不提供条件，则删除所有行。

下面的示例删除具有销售部门的所有行：

```
DELETE FROM employees WHERE department = 'Sales';
```

您可以按如下所示从表中删除所有行：

```
DELETE FROM employees;
```

### 查询数据 [*link*](#%e6%9f%a5%e8%af%a2%e6%95%b0%e6%8d%ae)

使用`SELECT`语句检索表内数据。例如：

```
SELECT * FROM employees;
```

在`SELECT`后面加上要查询的列名。例如：

```
SELECT name FROM employees;
    name
------------
 John Smith
(1 row)
```

使用`WHERE`子句，对所有记录进行是否符合条件的筛选后再返回。例如：

```
select * from employees where name = 'John Smith';
```

---

[*navigate\_before* 客户端工具](/docs/db/client-connection/)

[Python2示例 *navigate\_next*](/docs/db/example/python-example/)