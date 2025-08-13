# 计算附加组件 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/compute-add-ons/
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

# 计算附加组件

Supabase平台上的每个项目都有自己的专用Postgres实例，在一个虚拟机（VM）内运行。下表描述了基本实例，如果你在扩大Supabase规模时需要额外的性能，可以使用额外的计算附加组件。

| Plan | Pricing | CPU | Memory | Disk IO Bandwidth | Connections: Direct | Connections: Pooler |
| --- | --- | --- | --- | --- | --- | --- |
| Free (Included) | $0 | 2-core ARM (shared) | 1 GB | Up to 2,085 Mbps | 10 (recommended) | 50 (recommended) |
| Small | $5 | 2-core ARM (shared) | 2 GB | Up to 2,085 Mbps | 30 (recommended) | 75 (recommended) |
| Medium | $50 | 2-core ARM (shared) | 4 GB | Up to 2,085 Mbps | 50 (recommended) | 150 (recommended) |
| Large | $100 | 2-core ARM (dedicated) | 8 GB | Up to 4,750 Mbps | 100 (recommended) | 300 (recommended) |
| XL | $200 | 4-core ARM (dedicated) | 16 GB | Up to 4,750 Mbps | 200 (recommended) | 600 (recommended) |
| 2XL | $400 | 8-core ARM (dedicated) | 32 GB | Up to 4,750 Mbps | 350 (recommended) | 1200 (recommended) |
| 4XL | $950 | 16-core ARM (dedicated) | 64 GB | Up to 4,750 Mbps | 420 (recommended) | 2800 (recommended) |
| 8XL | $1,860 | 32-core ARM (dedicated) | 128 GB | Up to 9,000 Mbps | 450 (recommended) | 5600 (recommended) |
| 12XL | $2,790 | 48-core ARM (dedicated) | 192 GB | Up to 13,500 Mbps | 480 (recommended) | 8600 (recommended) |
| 16XL | $3,720 | 64-core ARM (dedicated) | 256 GB | Up to 19,000 Mbps | 500 (recommended) | 11,600 (recommended) |

[联系我们](/docs/contactus/)如果你需要一个定制计划。

## 专属与共享CPU [*link*](#%e4%b8%93%e5%b1%9e%e4%b8%8e%e5%85%b1%e4%ba%abcpu)

Supabase上的所有Postgres实例都是在专用虚拟机内运行的专用应用程序。然而，底层的硬件资源，例如物理CPU，可以在多个虚拟机之间共享，但在操作系统看来，就像它是一个专用的硬件CPU。这通常被称为vCPU（虚拟CPU）。云供应商使用这些共享的硬件资源来节约成本–你可以升级到一个更大的计算附加组件，以保证你的实例有一个专用的物理CPU。

##计算升级 {#upgrades}计算升级

在考虑计算升级时，评估你的瓶颈是硬件制约还是软件制约。例如，你可能想研究一下优化连接数或检查查询性能。当你对你的Postgres实例的性能感到满意时，你就可以关注额外的计算资源了。例如，你可以在staging中对你的应用程序进行负载测试，以了解你的计算需求。

## 磁盘IO带宽 [*link*](#%e7%a3%81%e7%9b%98io%e5%b8%a6%e5%ae%bd)

磁盘IO带宽可以用IOPS来衡量，IOPS是代表每秒输入/输出操作数的计量单位。这些操作是以兆比特/秒计算的。根据你的应用程序的读/写负载，你可能需要升级到一个更大的实例，能够有更高的IOPS数量。如果你不确定你的应用程序需要多少IOPS，你可以加载测试你的项目并检查这些仪表板中的指标。或者，你可以从一个较小的实例规模开始，以后根据需要升级。

---

[*navigate\_before* 数据库 Webhooks](/docs/app/development_guide/database/webhooks/)

[总览 *navigate\_next*](/docs/app/development_guide/database/extensions/extensions/)