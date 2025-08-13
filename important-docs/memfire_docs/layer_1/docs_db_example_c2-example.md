# C示例 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/example/c2-example/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

安装libpq C驱动程序

# C示例

MemFire Cloud 提供Python、Java、spring、golang、node.js、C++、C#、小程序开发示例，讲述如何编译执行程序，帮助用户如何采用多种语言来使用连接MemFire Cloud的云数据库。

MemFireDB兼容PostgreSQL11.2，采用C语言连接 MemFire Cloud云数据库构建应用程序，则需使用 libpq C 驱动程序。接下来我们会介绍如何编写C程序，通过 libpq C驱动来连接访问MemFire Cloud云数据库。

## 安装libpq C驱动程序 [*link*](#%e5%ae%89%e8%a3%85libpq-c%e9%a9%b1%e5%8a%a8%e7%a8%8b%e5%ba%8f)

libpq C是用于连接到 PostgreSQL 数据库并与之交互的 C 客户端库。有关该库的详细介绍文档，可以参考：https://www.postgresql.org/docs/11/libpq.html

① 不同环境下，可根据官方文档下载PostgreSQL库和源代码地址：https://www.postgresql.org/download/。

② linux环境下，可以使用如下命令安装连接postgresql 相关的库libpq C库。

```
yum install postgresql-devel
```

更多示例可以查看：https://www.postgresql.org/docs/11/libpq-example.html

## 创建MemFire Cloud云数据库 [*link*](#%e5%88%9b%e5%bb%bamemfire-cloud%e4%ba%91%e6%95%b0%e6%8d%ae%e5%ba%93)

登录[MemFire Cloud](https://cloud.memfiredb.com/)平台，新建数据库，在数据库管理栏中，点击该数据库的“连接信息”，如下图所示，可以获得该数据库的连接配置信息。
![](../../_media/样例-db-c2-1.png)

## 编写程序 [*link*](#%e7%bc%96%e5%86%99%e7%a8%8b%e5%ba%8f)

依赖条件：gcc 4.1.2 或更高版本；

1、新建文件test.c，并编写test.c文件，代码如下：

备注说明：使用新创建的数据库连接信息替换以下代码中的数据库配置信息，包括数据库连接IP、端口、用户名、密码、数据库名称；

使用libpq的客户端程序必须包含头文件`libpq-fe.h`，并且必须与libpq库链接。

```
#include <stdio.h>
#include <stdlib.h>
#include "libpq-fe.h"

int
main(int argc, char **argv)
{
  const char *conninfo;
  PGconn     *conn;
  PGresult   *res;
  int         nFields;
  int         i, j;

  /* connection string */
  conninfo = "host=xx.xx.xx.xx port=5433 dbname=db338ea9abb2ed4fadb2cc228002f58899test0905  user=xxxx password=xxx@";

  /* Make a connection to the database */
  conn = PQconnectdb(conninfo);

  /* Check to see that the backend connection was successfully made */
  if (PQstatus(conn) != CONNECTION_OK)
  {
      fprintf(stderr, "Connection to database failed: %s",
        PQerrorMessage(conn));
      PQfinish(conn);
      exit(1);
  }

  /* Drop table if exists */
    res = PQexec(conn, "DROP TABLE IF EXISTS public.employee");
   if (PQresultStatus(res) != PGRES_COMMAND_OK)
   {
       fprintf(stderr, "DROP TABLE failed: %s", PQerrorMessage(conn));
       PQclear(res);
       PQfinish(conn);
       exit(1);
   }
   PQclear(res);
   printf("Drop table employee\n");

  /* Create table */
  res = PQexec(conn, "CREATE TABLE public.employee (id int PRIMARY KEY, \
                                             name varchar, age int, \
                                             department text NOT NULL)");

  if (PQresultStatus(res) != PGRES_COMMAND_OK)
  {
      fprintf(stderr, "CREATE TABLE failed: %s", PQerrorMessage(conn));
      PQclear(res);
      PQfinish(conn);
      exit(1);
  }
  PQclear(res);
  printf("Created table employee\n");

  /* Insert a row */
  res = PQexec(conn, "INSERT INTO public.employee (id, name, age, department) \
                      VALUES (1, 'liming', 26, 'Sales')");

  if (PQresultStatus(res) != PGRES_COMMAND_OK)
  {
      fprintf(stderr, "INSERT failed: %s", PQerrorMessage(conn));
      PQclear(res);
      PQfinish(conn);
      exit(1);
  }
  PQclear(res);
  printf("Inserted data (1, 'liming', 26, 'Sales')\n");

  /* Query the row */
  res = PQexec(conn, "SELECT name, age, department FROM public.employee WHERE id = 1");
  if (PQresultStatus(res) != PGRES_TUPLES_OK)
  {
      fprintf(stderr, "SELECT failed: %s", PQerrorMessage(conn));
      PQclear(res);
      PQfinish(conn);
      exit(1);
  }

  /* print out the rows */
  nFields = PQnfields(res);
  for (i = 0; i < PQntuples(res); i++)
  {
      printf("Query returned: ");
      for (j = 0; j < nFields; j++)
        printf("%s ", PQgetvalue(res, i, j));
      printf("\n");
  }
  PQclear(res);

  /* close the connection to the database and cleanup */
  PQfinish(conn);

  return 0;
}
```

## 执行查看结果 [*link*](#%e6%89%a7%e8%a1%8c%e6%9f%a5%e7%9c%8b%e7%bb%93%e6%9e%9c)

执行如下命令进行编译

```
[root@localhost test]# gcc -g test.c -o test -I /usr/include -L /usr/lib64 -lpq
```

* -I 是 libpq-fe.h 头文件所在目录
* -L 是 libpq-fe 对应 .so 文件所在目录
* -l 是 libpq-fe 对应的 .so 文件, libpq-fe对应的文件为 libpq.so, 则写为 -lpq
* -g 是 编译的时候会包含调试信息, 使用gdb可以调试源代码

查询执行结果

```
[root@localhost test]# ./test
Created table employee
Inserted data (1, 'John', 35, 'Sales')
Query returned: John 35 Sales
```

---

[*navigate\_before* C#示例](/docs/db/example/c-example/)

[数据迁移 *navigate\_next*](/docs/db/memfiredb-data-migration/)