# 常见问题解答（FAQ） | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/frequently-asked-questions/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

产品FAQ

# 常见问题解答（FAQ）

## 产品FAQ [*link*](#%e4%ba%a7%e5%93%81faq)

**1、什么是MemFireDB Cloud？**

MemFire Cloud是基于MemFireDB打造的数据库云服务，依托于MemFireDB的云原生和线性扩展能力，为互联网用户提供一站式数据库自助服务，实现按需使用，随用随取，最大化的节约成本、提高效率、减少维护。

**2、MemFireDB Cloud支持哪些客户端？**

MemFire Cloud支持所有MemFireDB兼容的客户端:

| 运行环境 | 客户端名称 | 下载地址 |
| --- | --- | --- |
| linux客户端 | psql | 命令：yum -y install postgresql11 |
| windows客户端 | dbeaver 、pgadmin | 地址：https://dbeaver.io/files/7.1.0/dbeaver-ce-7.1.0-win32.win32.x86\_64.zip |
| mac客户端 | dbeaver | 地址：https://dbeaver.io/files/7.1.0/dbeaver-ce-7.1.0-macosx.cocoa.x86\_64.tar.gz |

**3、MemFire Cloud是基于分布式数据库打造的吗？**

是的，MemFire Cloud是基于分布式数据库MemFireDB打造的；

MemFireDB是基于 Raft一致性协议的分布式存储集群，可在线动态扩容存储和计算资源，扩容时不会影响业务的正常运行。

**4、MemFire Cloud兼容哪个PostgreSQL版本?**

**MemFire Cloud**支持符合ANSI标准的结构化查询语言。兼容PostgreSQL 11.2版本。

MemFireDB复用了PostgreSQL的原生查询层。MemFireDB支持所有的传统关系模型功能，例如引用完整性（例如外键）、JOIN、分布式事务、部分索引、触发器和存储过程。

**5、MemFire Cloud支持哪些编程语言？**

MemFire Cloud 支持python、Java、go等编程语言，具体编程样例可以参考：https://gitee.com/memfiredb

**6、MemFireDB与MemFire Cloud有什么区别？**

**MemFireDB**是敏博科技推出的一款高性能、分布式关系型数据库，支持分布式事务，在线平滑弹性伸缩，服务能力线性扩展，跨数据中心部署等能力，可以较好地兼容PostgreSQL的SQL访问形式。

**MemFire Cloud**是面向公有云的数据库即服务产品，提供自助服务，便捷的管理服务，满足中小企业开发人员对数据库的使用需求；

| **名称** | **MemFireDB** | **MemFire Cloud** |
| --- | --- | --- |
| 定义 | 分布式关系数据库 | 面向公有云的数据库即服务产品 DBaaS |
| 部署方式 | 私有云（X86服务器、虚拟机） | 公有云（阿里云） |
| 关系 | 基础组件，数据库内核 | MemFireDB作为内核 |
| 维护成本 | 硬件、DBA | 无 |
| 售卖方式 | “软件+售后服务” | 租赁，”资源的使用权+SLA“ |
| 迭代方式 | 主动升级 | 自动升级 |
| 面向客户 | 政府、企业等客户 | 互联网+中小企业客户 |
| 应用场景 | 高性能业务、金融业务 | 小程序、简单应用 |

**7、MemFire Cloud 提供哪些机制来保障安全性？**

MemFire Cloud提供的安全机制包括：

**(1)访问身份验证**

细粒度身份验证管理对本地主机，远程主机和客户端的访问控制

**(2)动态数据加密**

使用TLS加密群集内以及客户端到服务器网络通信，确保通过网络传输的数据的私密性和完整性,确保服务器之间网络通信安全。

**(3)静态数据加密**

确保存储在磁盘上的静态数据受到保护；

**8、MemFire Cloud与PostgreSQL有什么区别?**

MemFire Cloud是一个数据库即服务平台，可以按需扩展。PostgreSQL是广泛使用的开源RDBMS，但是本身不支持扩展性；
由于MemFireDB Cloud兼容PostgreSQL协议，可以讲MemFire Cloud当作一个分布式的PostgreSQL数据库；

**9、如何在springboot中使用MemFire Cloud**

MemFire Cloud兼容PostgreSQL11，在springboot中使用MemFire方式与使用PostgreSQL基本相同，但由于MemFire Cloud支持传输加密与身份验证，所以配置略有不同，具体可以参考代码示例：[代码示例](https://gitee.com/memfiredb/mefiredb-example-spring)

**10、MemFireDB Cloud不适合哪些场景？**

不太适合需要完整的即席分析的在线分析处理（OLAP）场景，例如使用OLAP存储或数据仓库。

## 高可用FAQ [*link*](#%e9%ab%98%e5%8f%af%e7%94%a8faq)

**1、MemFire Cloud数据是强一致性吗?**

是的，MemFire Cloud内核采用MemFireDB, 它采用raft算法来实现集群内部节点之间同步复制，保证多副本数据之间的强一致性；

**2、MemFire Cloud采用哪些机制，保证服务的高可用？**

MemFire Cloud采用多种机制保证服务的高可用，包括：

（1）分布式数据库集群内部无单节点故障

（2）故障自动修复，计算与存储分离，故障节点可漂移

（3）单个服务故障，Pod秒级自动拉起；

（4）采用VIP进行访问负载均衡；

## 高可靠FAQ [*link*](#%e9%ab%98%e5%8f%af%e9%9d%a0faq)

**1、MemFire Cloud采用哪些机制来保证数据的可靠性?**

集群内部采用多副本机制，可以按需灵活设置数据副本数；

支持灵活的数据备份计划，可以手动备份、设置规划进行自动备份；

支持平台外的存储备份方式，包括NFS、S3

## SQL FAQ [*link*](#sql-faq)

**1、用户删除MemFire Cloud中数据后会立即释放空间吗？**

用户删除MemFire Cloud中数据后，会立即释放空间；

---

[*navigate\_before* 联系我们](/docs/contactus/)

[*navigate\_next*](/docs/db/example/development-example/)