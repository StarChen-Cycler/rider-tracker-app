# C++示例 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/example/c++-example/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

编译安装libpq

# C++示例

MemFire Cloud 提供Python、Java、spring、golang、nodejs、小程序开发示例，讲述如何编译执行程序，帮助用户如何采用多种语言来使用连接MemFire Cloud的云数据库。

MemFireDB兼容PostgreSQL11.2，在PostgreSQL发行版中只包含两个客户端接口: libpq 和 ECPG。接下来我们会介绍如何编写C++程序，通过libpq客户端来连接访问MemFire Cloud云数据库。

## 编译安装libpq [*link*](#%e7%bc%96%e8%af%91%e5%ae%89%e8%a3%85libpq)

libpq是主要的C语言接口，而且许多其他客户端接口都是在它之上构建的。

文档地址： [https ://libpqxx.readthedocs.io](https://gitee.com/link?target=https%3A%2F%2Flibpqxx.readthedocs.io)

Github 上地址： [https ://github.com/jtv/libpqxx](https://gitee.com/link?target=https%3A%2F%2Fgithub.com%2Fjtv%2Flibpqxx)

gitee上地址： <https://gitee.com/mirrors/libpqxx/tree/master>

注意，使用libpqxx 7.x版本的需要C++ 17，本次样例使用旧版本的libpqxx(4.0.1)。

老版本libpqxx-4.0.1下载地址:http://pqxx.org/download/software/libpqxx/libpqxx-4.0.1.tar.gz

下载源码编译安装：

```
wget http://pqxx.org/download/software/libpqxx/libpqxx-4.0.1.tar.gz
tar -xzf libpqxx-4.0.1.tar.gz
cd libpqxx-4.0.1
./configure
make && make install
```

## 创建MemFire Cloud云数据库 [*link*](#%e5%88%9b%e5%bb%bamemfire-cloud%e4%ba%91%e6%95%b0%e6%8d%ae%e5%ba%93)

登录[MemFire Cloud](https://cloud.memfiredb.com/)平台，新建数据库，在数据库管理栏中，点击该数据库的“连接信息”，如下图所示，可以获得该数据库的连接配置信息。

![](../../_media/样例-db-c++-1.png)

## 编写程序 [*link*](#%e7%bc%96%e5%86%99%e7%a8%8b%e5%ba%8f)

下面是一段C++语言连接MemFire Cloud云数据库，创建数据表，插入数据的一段代码。

```
#include <iostream>
#include <pqxx/pqxx>

using namespace std;
using namespace pqxx;

int main(int argc, char* argv[])
{
   const char* sql;
   try{

     /* Establish database connection */
      connection conn("dbname=db338ea9abb2ed4fadb2cc228002f58899yingyong_db user=aaaa123  password=XXXXX hostaddr=139.196.89.94 port=5433");

      if (conn.is_open()) {
         cout << "Opened database successfully: " << conn.dbname() << endl;
      } else {
         cout << "Can't open database" << endl;
         return 1;
      }

      /* Create SQL statement */
      sql = "CREATE TABLE COMPANY("  \
      "ID INT PRIMARY KEY     NOT NULL," \
      "NAME           TEXT    NOT NULL," \
      "AGE            INT     NOT NULL," \
      "ADDRESS        CHAR(50)," \
      "SALARY         REAL );";

      /* Create a transactional object. */
      work W(conn);

      /* Execute SQL query */
      W.exec( sql );
      W.commit();
      cout << "Table created successfully" << endl;

      /* Create SQL statement */
      sql = "INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY) "  \
      "VALUES (1, 'lining', 27, 'shanghai', 2100.00 ); " \
      "INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY) "  \
      "VALUES (2, 'kaungwei', 34, 'beijing', 3600.00 ); "     \
      "INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)" \
      "VALUES (3, 'xiaosan', 44, 'wuhan', 2400.00 );" \
      "INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)" \
      "VALUES (4, 'wangsi', 35, 'xinzhou ', 5500.00 );";

      /* Create a transactional object. */
      work M(conn);

      /* Execute SQL query */
      M.exec( sql );
      M.commit();
      cout << "Records created successfully" << endl;

      conn.disconnect ();
   }catch (const std::exception &e){
      cerr << e.what() << std::endl;
      return 1;
   }

   return 0;
}
```

## 执行查看结果 [*link*](#%e6%89%a7%e8%a1%8c%e6%9f%a5%e7%9c%8b%e7%bb%93%e6%9e%9c)

编译执行代码，查看结果

```
[root@localhost ~]# g++ test.cpp -lpqxx -lpq
[root@localhost ~]# ./a.out
Opened database successfully: db338ea9abb2ed4fadb2cc228002f58899yingyong_db
Table created successfully
Records created successfully
[root@localhost ~]#
```

在MemFire Cloud页面查看执行结果

![](../../_media/样例-db-c++-2.png)

查看插入数据表中的数据

![](../../_media/样例-db-c++-3.png)

## 可能遇到的问题 [*link*](#%e5%8f%af%e8%83%bd%e9%81%87%e5%88%b0%e7%9a%84%e9%97%ae%e9%a2%98)

如果不安装libpqxx，编译会报出以下错误：

```
[root@localhost ~]# g++ test.cpp -lpqxx -lpq
test.cpp:2:22: fatal error: pqxx/pqxx: No such file or directory
 #include <pqxx/pqxx>
                      ^
compilation terminated.
```

 如果提示找不到libpq库，那就安装一下 postgresql-devel 再次编译执行成功。

```
[root@localhost ~]# g++ test.cpp -lpqxx -lpq
/usr/bin/ld: cannot find -lpq
collect2: error: ld returned 1 exit status
```

安装命令：

```
yum install postgresql-devel
```

---

[*navigate\_before* Node示例](/docs/db/example/node-example/)

[C#示例 *navigate\_next*](/docs/db/example/c-example/)