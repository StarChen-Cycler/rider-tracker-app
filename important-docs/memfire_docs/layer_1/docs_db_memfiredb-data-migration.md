# 数据迁移 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/memfiredb-data-migration/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

前言

# 数据迁移

# 前言 [*link*](#%e5%89%8d%e8%a8%80)

MemFireDB支持数据表的导入导出操作。为了提升系统易用性，本文档主要针对客户端Navicat和DBeaver对MemFireDB的导入导出功能进行说明。重点关注csv文件的导入导出功能。

---

## Navicat导入数据表 [*link*](#navicat%e5%af%bc%e5%85%a5%e6%95%b0%e6%8d%ae%e8%a1%a8)

1. 选择数据类型  
   打开Navicat客户端，根据MemFire Cloud给出的连接信息连接好数据库。  
   点击Navicat客户端的Table下的Import Wizard，选择导入数据的类型，可以看到Navicat支持txt、csv、xls、xml、json等多种文件类型导入，本文档主要针对csv类型进行说明：

![图片名称](../_media/1.png)

2. 选择待导入文件  
   点击“continue”，进入选择文件页面，如下所示。  
   点击“add file”按钮，选择上要导入的数据文件源，Navicat支持一次性导入多个文件。

![图片名称](../_media/2.png)

3. 格式选项修改  
   可对源文件定义一些附加选项，例如字段之间分隔符，若无特殊要求，可直接跳过。

![图片名称](../_media/3.png)

![图片名称](../_media/4.png)

4. 选择目标表  
   选择源文件数据待导入的目标数据库表，可以选择已创建的数据表或者输入新的数据表名称。

![图片名称](../_media/5.png)

5. 设置字段映射  
   用户可以自定义源文件与目标数据表的字段映射关系。   
   (1) 目标表为已创建数据表时，可修改对应关系，例如：修改对应主键(Primary Key);

![图片名称](../_media/6.png)

(2) 目标表是待创建新表时，还可以修改对应列名。

![图片名称](../_media/7.png)

6. 选择导入模式  
   如果是新数据表的话，选择第一项。根据具体导入情况，选择不同的选项。

![图片名称](../_media/8.png)

7. 导入数据  
   开始导入源数据，导入结果受源文件内容影响。Navicat会展示数据导入的进度，包括数据表数目、错误数量、消耗时间等以及日志信息。

![图片名称](../_media/9.png)

---

## DBeaver导入数据表 [*link*](#dbeaver%e5%af%bc%e5%85%a5%e6%95%b0%e6%8d%ae%e8%a1%a8)

1. 选择数据类型  
   打开DBeaver客户端，根据MemFire Cloud给出的连接信息连接好数据库。  
   点击DBeaver客户端的Tables下的Import Data，选择导入数据的类型，目前DBeaver支持csv格式文件导入：

![图片名称](../_media/10.png)

2. 选择待导入文件  
   点击“next”，进入选择文件页面，配置待导入文件或目录，如下所示。  
   选择要导入的文件源，DBeaver支持一次性导入多个文件。

![图片名称](../_media/11.png)

3. 格式选项修改  
   可对源文件定义一些附加选项，若无特殊要求，可直接跳过。

![图片名称](../_media/12.png)

4. 导入数据  
   开始导入，导入结果受源文件内容影响。

![图片名称](../_media/13.png)

---

## Navicat导出数据表 [*link*](#navicat%e5%af%bc%e5%87%ba%e6%95%b0%e6%8d%ae%e8%a1%a8)

1. 选择导出数据类型   
   打开Navicat客户端，根据MemFire Cloud给出的连接信息连接好数据库。   
   (1) 点击选中待导出的数据表;  
   (2) 点击Export Wizard，选择待导出的文件类型，可以看到Navicat支持txt、csv、xls、xml、json等多种文件格式导出。本文档主要针对csv格式进行说明。

![图片名称](../_media/14.png)

2. 选择保存地址  
   用户可以点击“change”按钮， 选择导出文件的保存地址。

![图片名称](../_media/15.png)

3. 选择导出表项  
   用户可根据实际需求，灵活勾选要导出数据表中的那些字段列信息。

![图片名称](../_media/16.png)

4. 选择导出格式  
   可以自定义某些选中，包括出错是否继续、字段之间分隔符等。

![图片名称](../_media/17.png)

5. 导出数据   
   完成以上所有选择配置后，点击“start”按钮，开始进行数据表导出操作。

![图片名称](../_media/18.png)

---

## DBeaver导出数据表 [*link*](#dbeaver%e5%af%bc%e5%87%ba%e6%95%b0%e6%8d%ae%e8%a1%a8)

1. 选择导出数据类型   
   打开DBeaver客户端，根据MemFire Cloud给出的连接信息连接好数据库。   
   (1) 点击选中待导出的数据表;   
   (2) 右击选择“import data”，选择待导出的文件类型，DBeaver导出操作与导入操作不同，支持txt、csv、SQL、html、xml、json等多种文件格式导出。

![图片名称](../_media/19.png)

2. 选择导出格式  
   用户可自定义数据转换的设置，包括导出分隔符等。

![图片名称](../_media/20.png)

3. 配置导出参数   
   配置导出参数，包括存放目录，文件名等。

![图片名称](../_media/21.png)

4. 数据导出   
   完成以上所有选择配置后，点击“start”按钮，开始进行数据表导出操作。

![图片名称](../_media/22.png)

---

[*navigate\_before* C示例](/docs/db/example/c2-example/)

[兼容性说明 *navigate\_next*](/docs/db/guides/compatibility/)