# C#示例 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/example/c-example/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

安装Npgsql

# C#示例

MemFire Cloud 提供Python、Java、spring、golang、node.js、C++、C#、小程序开发示例，讲述如何编译执行程序，帮助用户如何采用多种语言来使用连接MemFire Cloud的云数据库。

MemFireDB兼容PostgreSQL11.2，采用C# 连接 MemFire Cloud云数据库需使用Npgsql驱动。Npgsql 完全由C# 实现，是免费且开源的。接下来我们会介绍如何编写C#程序，通过Npgsql驱动来连接访问MemFire Cloud云数据库。

## 安装Npgsql [*link*](#%e5%ae%89%e8%a3%85npgsql)

Npgsql是 PostgreSQL 数据库的 ADO.NET 规范的实现,采用 C# 语言编写的驱动程序，适用于所有 .NET 语言。

**1、通过VSCode的管理NuGet安装。**

（1）在VSCode的扩展插件中，搜索并且安装NuGet Package Manager扩展插件；

（2）使用CTRL + SHIFT + P，输入> NuGet ，在下拉框中选择>NuGet Package Manager:Add Package

（3）选择浏览，搜索Npgsql，选择合适的版本进行安装。

![](../../_media/样例-db-c-1.png)

**2、采用命令行的方式进行安装**：
在 Windows、Linux 和 macOS 上安装 .NET Core、.NET 5 及更高版本，参考地址：https://docs.microsoft.com/zh-cn/dotnet/core/install/   
安装完成后，可以通过 .NET CLI 的通用驱动程序dotnet来安装Npgsql。

```
dotnet add package Npgsql
```

## 创建MemFire Cloud云数据库 [*link*](#%e5%88%9b%e5%bb%bamemfire-cloud%e4%ba%91%e6%95%b0%e6%8d%ae%e5%ba%93)

登录[MemFire Cloud](https://cloud.memfiredb.com/)平台，新建数据库，在数据库管理栏中，点击该数据库的“连接信息”，如下图所示，可以获得该数据库的连接配置信息。
![](../../_media/样例-db-c-2.png)

## 编写程序 [*link*](#%e7%bc%96%e5%86%99%e7%a8%8b%e5%ba%8f)

1、新建文件夹HelloWord，启动 Visual Studio Code，从主菜单中选择“文件”->“打开文件夹”打开HelloWord文件夹；

2、在“终端”中输入以下命令：

```
dotnet new console --framework net6.0
```

3、将 Program.cs 的内容替换为以下代码：

下面是一段C#语言连接MemFire Cloud云数据库，创建数据表，插入数据的一段代码。  
备注说明：使用新创建的数据库连接信息替换以下代码中的数据库配置信息，包括数据库连接IP、端口、用户名、密码、数据库名称。

```
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using Npgsql;
namespace PostgreSQL
{
    class TestConnect
    {
        static void Main()
        {
            // 建立连接
            string connString = "Host=xxxxx;Port=5433;Username=aaaa123;Password=xxxxx;Database=xxxxxx";
            var conn = new NpgsqlConnection(connString);
            // 打开一个数据库连接
            conn.Open();

            var cmd = new NpgsqlCommand();
            cmd.Connection = conn;
            cmd.CommandText = "DROP TABLE IF EXISTS public.employees";
            cmd.ExecuteNonQuery();

            // 创建数据表
            cmd.CommandText = "CREATE TABLE public.employees (employee_no integer PRIMARY KEY, name text UNIQUE,department text NOT NULL)";
            cmd.ExecuteNonQuery();
            Console.WriteLine("建表成功");

            // 插入数据
            string SQL = "insert into public.employees(employee_no, name,department) values(1, 'lining', 'Marketing'),(2, 'lisan', 'Sales'),(3, 'zhangqi', 'Operations')";
            Console.WriteLine("变更行数:" + ExecNonQuery(SQL, conn));

            // 查询结果，获得结果集
            var cmd2 = new NpgsqlCommand("select * from public.employees", conn);
            var reader = cmd2.ExecuteReader();
            while (reader.Read())
                Console.WriteLine("{0} {1} {2}", reader.GetInt32(0), reader.GetString(1), reader.GetString(2));
            // 释放资源
            cmd2.Dispose();

            // 关闭数据库连接
            conn.Close();
            Console.ReadKey();
        }
        static int ExecNonQuery(string _SQLCommand, NpgsqlConnection _conn)
        {
            int result = 0;
            NpgsqlCommand cmd = new NpgsqlCommand(_SQLCommand, _conn);
            cmd.CommandType = CommandType.Text;
            //执行SQL语句；Insert,Update,Delete方式都可以
            result = cmd.ExecuteNonQuery();
            //释放资源
            cmd.Dispose();
            return result;
        }
    }
}
```

## 执行查看结果 [*link*](#%e6%89%a7%e8%a1%8c%e6%9f%a5%e7%9c%8b%e7%bb%93%e6%9e%9c)

```
PS C:\Users\nimblex\Desktop\ConsoleApplication3> dotnet run
建表成功
变更行数:3
1 lining Marketing
2 lisan Sales
3 zhangqi Operations
```

在MemFire Cloud后页面查看结果

![](../../_media/样例-db-c-3.png)

查看插入数据表中的数据

![](../../_media/样例-db-c-4.png)

## 可能遇到的问题 [*link*](#%e5%8f%af%e8%83%bd%e9%81%87%e5%88%b0%e7%9a%84%e9%97%ae%e9%a2%98)

安装Npgsql过程中，如果遇到如下报错：

```
Cannot find any .csproj or .fsproj file for your project! Please fix this error and try again.
```

可执行命令，再次尝试安装Npgsql。

```
dotnet new console
```

---

[*navigate\_before* C++示例](/docs/db/example/c++-example/)

[C示例 *navigate\_next*](/docs/db/example/c2-example/)