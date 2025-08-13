# Super课表小程序 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/example/wechat/timetable/
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

# Super课表小程序

此示例提供了使用 MemFire Cloud 构建一个课表的小程序的步骤。小程序用到的MemFire Cloud的功能包括：

* 云数据库：存储小程序数据表的信息。
* 用户验证：小程序使用MemFire Cloud提供的用户认证的API接口，快速完成用户注册登录操作。
* 对象存储：存储小程序的注册用户上传的头像。
* 行级安全策略：采用RLS策略来限制用户访问行为，用户可以修改个人信息，上传个人头像。
* 即时API：创建数据表时会自动生成 API。

![](../../../img/super-1.png)

## 创建应用 [*link*](#%e5%88%9b%e5%bb%ba%e5%ba%94%e7%94%a8)

目的：通过创建的一个MemFire Cloud应用来获得数据库、对象存储等一系列资源，并将获得该应用专属的API访问链接和访问密钥，用户可以轻松的调用API接口与以上资源进行交互。

登录https://cloud.MemFiredb.com/auth/login, 在“我的应用”页面创建一个新应用

![](../../../img/样例-discuss-1.png)

## 创建数据表 [*link*](#%e5%88%9b%e5%bb%ba%e6%95%b0%e6%8d%ae%e8%a1%a8)

点击进入应用详情页面，在“数据表”页面可视化建表。

### 1.创建school表 [*link*](#1%e5%88%9b%e5%bb%baschool%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建school表。school表主要记录学校信息，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| schoolName | text | 学校名称（唯一） |
| updated\_at | timeatamptz | 修改时间 |

建表页面配置：![](../../../img/super-3.png)

数据表创建完后可在school表中手动插入几条学校信息数据 ，如下图。

![](../../../img/super-4.png)

sql操作如下:

```
CREATE TABLE "public"."school" (
  "id" BIGINT NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "schoolName" TEXT NOT NULL,
  CONSTRAINT "school_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "school_schoolName_key" UNIQUE ("schoolName")
);
INSERT INTO "public"."school" ("id", "updated_at", "schoolName") VALUES ('1', '2022-08-12 18:43:53.166+08', '武汉大学');
INSERT INTO "public"."school" ("id", "updated_at", "schoolName") VALUES ('2', '2022-08-22 11:01:19.088+08', '武汉科技大学');
INSERT INTO "public"."school" ("id", "updated_at", "schoolName") VALUES ('3', '2022-08-22 11:01:36.909+08', '华中师范大学');
INSERT INTO "public"."school" ("id", "updated_at", "schoolName") VALUES ('4', '2022-08-22 11:01:56.022+08', '武汉理工大学');
```

### 2.创建department表 [*link*](#2%e5%88%9b%e5%bb%badepartment%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建department表。department表主要记录学院信息，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| departmentName | text | 学院名称，唯一 |
| updated\_at | timeatamptz | 修改时间 |

建表页面配置：![](../../../img/super-5.png)

数据表创建完后可在department表中手动插入几条学院信息数据，如下图。

![](../../../img/super-6.png)

sql操作如下

```
CREATE TABLE "public"."department" (
  "id" BIGINT NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "departmentName" TEXT NOT NULL,
  CONSTRAINT "department_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "department_departmentName_key" UNIQUE ("departmentName")
);

INSERT INTO "public"."department" ("id", "updated_at", "departmentName") VALUES ('1', '2022-08-12 18:44:14.7+08', '计算机学院');
INSERT INTO "public"."department" ("id", "updated_at", "departmentName") VALUES ('2', '2022-08-18 10:09:02.871+08', '体育学院');
INSERT INTO "public"."department" ("id", "updated_at", "departmentName") VALUES ('3', '2022-08-18 10:09:28.667+08', '商贸学院');
INSERT INTO "public"."department" ("id", "updated_at", "departmentName") VALUES ('4', '2022-08-18 10:09:47.602+08', '土木工程学院');
```

### 3.创建subject表 [*link*](#3%e5%88%9b%e5%bb%basubject%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建subject表。subject表主要记录课程信息，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| teacherName | text | 老师 |
| adress | text | 上课地点 |
| subjectName | text | 科目 |
| updated\_at | timeatamptz | 修改时间 |

建表页面配置：![](../../../img/super-7.jpg)

数据表创建完后可在subject表中手动插入几条课程信息数据，如下图。
![](../../../img/super-8.jpg)

sql操作如下

```
CREATE TABLE "public"."subject" (
  "id" BIGINT NOT NULL,
  "teacherName" TEXT NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "adress" TEXT NOT NULL,
  "subjectName" TEXT NOT NULL,
  CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);
INSERT INTO "public"."subject" ("id", "teacherName", "updated_at", "adress", "subjectName") VALUES ('1', '张珊', '2022-08-12 18:28:30.725+08', '计科楼2-1003', '数据库原理');
INSERT INTO "public"."subject" ("id", "teacherName", "updated_at", "adress", "subjectName") VALUES ('2', '李四', '2022-08-17 16:13:54.527+08', '重楼2-3112', '计算机基础');
INSERT INTO "public"."subject" ("id", "teacherName", "updated_at", "adress", "subjectName") VALUES ('3', '王五', '2022-08-17 17:28:49.603+08', '4教-101', '分布式数据库');
INSERT INTO "public"."subject" ("id", "teacherName", "updated_at", "adress", "subjectName") VALUES ('4', '王博', '2022-08-18 17:28:59.265+08', '综合楼4-401', '高等数学');
INSERT INTO "public"."subject" ("id", "teacherName", "updated_at", "adress", "subjectName") VALUES ('5', '肖战', '2022-08-18 17:29:41.462+08', '教4-401', '线性代数');
```

### 4.创建student表 [*link*](#4%e5%88%9b%e5%bb%bastudent%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建student表，student表主要记录学生信息，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | uuid | 主键，自增，唯一标识ID，与auth.users表中的uuid外键关联 |
| update\_at | timestampt | 创建时间 |
| studentId | int8 | 学号，唯一 |

建表页面配置：![](../../../img/super-9.jpg)

**说明：其中student表字段id和auth.users表中的uuid外键关联。**

### 5.创建subject\_student表 [*link*](#5%e5%88%9b%e5%bb%basubject_student%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建subject\_student表。subject\_student表主要记录学生的课表信息，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| studentId | int8 | 学号 |
| subjectId | int8 | 与课程表的id关联 |
| schoolId | int8 | 与学校表的id关联 |
| departmentId | int8 | 与学院表的id关联 |
| updated\_at | timestampt | 修改时间 |

建表页面配置：![](../../../img/super-10.jpg)

**说明：其中subjectId与subject表中的id外键关联,schoolId与school表中的id外键关联,departmentId与****department****表中的id外键关联。**

数据表创建后可在subject\_student表中手动插入几条信息数据，如下图。

其中**subjectId、schoolId、departmentId**需要对应数据表里的id。

![](../../../img/super-11.png)
sql操作

```
CREATE TABLE "public"."subject_student" (
  "id" BIGINT NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "studentId" BIGINT NOT NULL,
  "subjectId" BIGINT NOT NULL,
  "schoolId" BIGINT NULL,
  "departmentId" BIGINT NULL,
  CONSTRAINT "subject_student_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."subject_student" ADD CONSTRAINT "subject_student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."department" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."subject_student" ADD CONSTRAINT "subject_student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."school" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."subject_student" ADD CONSTRAINT "subject_student_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."subject" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

INSERT INTO "public"."subject_student" ("id", "updated_at", "studentId", "subjectId", "schoolId", "departmentId") VALUES ('1', '2022-08-17 09:51:14.733+08', '20222202', '1', '1', '1');
INSERT INTO "public"."subject_student" ("id", "updated_at", "studentId", "subjectId", "schoolId", "departmentId") VALUES ('2', '2022-08-17 16:14:51.236+08', '20222202', '2', '1', '1');
INSERT INTO "public"."subject_student" ("id", "updated_at", "studentId", "subjectId", "schoolId", "departmentId") VALUES ('3', '2022-08-17 17:29:33.938+08', '20222202', '3', '1', '1');
INSERT INTO "public"."subject_student" ("id", "updated_at", "studentId", "subjectId", "schoolId", "departmentId") VALUES ('4', '2022-08-18 17:30:09.934+08', '20222202', '4', '1', '1');
INSERT INTO "public"."subject_student" ("id", "updated_at", "studentId", "subjectId", "schoolId", "departmentId") VALUES ('5', '2022-08-18 17:31:45.261+08', '20222202', '5', '1', '1');
```

### 6.创建subject\_time表 [*link*](#6%e5%88%9b%e5%bb%basubject_time%e8%a1%a8)

在数据表页面，点击“新建数据表”，创建subject\_time表。subject\_time表主要记录学生的排课信息，表结构字段如下：

描述：通过关联的课程id去查询课程并合并数据

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| subjectId | int8 | 与课程表的id关联 |
| weekNum | text | 周数(例如："[25,26,27,28]") |
| time | text | 第几节课（例如：1到6中的任意一个数字） |
| weekDay | text | 周几上课(例如："[1,2]“或”[1,3,5]") |
| updated\_at | timestampt | 修改时间 |

建表页面配置：![](../../../img/super-12.jpg)

数据表创建完成后可在subject\_time表中手动插入几条信息数据，如下图。

![](../../../img/super-13.png)

**说明：其中subjectId与subject表中的id外键关联。**

sql语法操作

```
CREATE TABLE "public"."subject_time" (
  "id" BIGINT NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "subjectId" BIGINT NOT NULL,
  "weekNum" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "weekDay" TEXT NOT NULL,
  CONSTRAINT "subject_time_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "subject_time_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."subject" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

INSERT INTO "public"."subject_time" ("id", "updated_at", "subjectId", "weekNum", "time", "weekDay") VALUES ('1', '2022-08-12 18:29:01.828+08', '1', '[34,35,36,37,38]', '1', '[1,4,6]');
INSERT INTO "public"."subject_time" ("id", "updated_at", "subjectId", "weekNum", "time", "weekDay") VALUES ('2', '2022-08-17 16:25:48.757+08', '2', '[34,35,36,37,38]', '2', '[2,3,5]');
INSERT INTO "public"."subject_time" ("id", "updated_at", "subjectId", "weekNum", "time", "weekDay") VALUES ('3', '2022-08-17 17:29:54.301+08', '3', '[34,35,36,37,38]', '3', '[3,4,5,6,7]');
INSERT INTO "public"."subject_time" ("id", "updated_at", "subjectId", "weekNum", "time", "weekDay") VALUES ('4', '2022-08-18 17:30:59.789+08', '4', '[34,35,36,37,38,39,40]', '4', '[1,3,4,5]');
INSERT INTO "public"."subject_time" ("id", "updated_at", "subjectId", "weekNum", "time", "weekDay") VALUES ('5', '2022-08-18 17:32:20.801+08', '5', '[34,35,36,37,38,39,40]', '5', '[2,4,5]');
```

## 创建avatars存储桶 [*link*](#%e5%88%9b%e5%bb%baavatars%e5%ad%98%e5%82%a8%e6%a1%b6)

创建对象存储的存储桶，用来存储用户的头像图片，涉及操作包括：

1.创建一个存储桶avatars

在该应用的对象存储导航栏，点击“新建Bucket”按钮，创建存储桶avatars。

![](../../../img/super-14.png)

2.允许每个用户可以查看存储桶avatars

选中存储桶avatars，切换到**权限设置**栏，点击“新规则”按钮，弹出策略编辑弹框，选择“自定义”，如下图所示：

![](../../../img/super-15.png)

选择SELECT操作，输入策略名称，点击“生成策略”按钮，如下图所示。

![](../../../img/super-16.png)

3.允许用户上传存储桶avatars；

选中存储桶avatars，切换到**权限设置**栏，点击“新规则”按钮，弹出策略编辑弹框，选择“自定义”，如下图所示：

![](../../../img/super-17.png)

选择INSERT操作，输入策略名称，点击“生成策略”按钮，如下图所示。

![](../../../img/super-18.png)

查看结果：

![](../../../img/super-19.png)

## 注册小程序 [*link*](#%e6%b3%a8%e5%86%8c%e5%b0%8f%e7%a8%8b%e5%ba%8f)

以上是我们在MemFire Cloud上配置的全部步骤，接下来是在微信开发者工具上操作了。

如果您还未注册过小程序，请参考[官方步骤](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html#%E7%94%B3%E8%AF%B7%E5%B8%90%E5%8F%B7)注册小程序(只需要通过您的邮箱注册一个小程序获得一个appid,然后下载一个微信开发工具即可)

## 下载代码 [*link*](#%e4%b8%8b%e8%bd%bd%e4%bb%a3%e7%a0%81)

<https://github.com/LucaRao/subjectWechat.git>

Node.js (>=14.x <=16.x) 。

## 用微信开发者工具点击导入项目 [*link*](#%e7%94%a8%e5%be%ae%e4%bf%a1%e5%bc%80%e5%8f%91%e8%80%85%e5%b7%a5%e5%85%b7%e7%82%b9%e5%87%bb%e5%af%bc%e5%85%a5%e9%a1%b9%e7%9b%ae)

选择目录是下载好的小程序项目的目录，AppID为您在微信公众平台注册小程序获得的专属appid

![](../../../img/super-20.png)

## 构建npm [*link*](#%e6%9e%84%e5%bb%banpm)

在右侧详情里面的本地设置把“使用npm模块”和“不校验合法域名”勾上

![](../../../img/super-21.png)

打开终端，在项目目录miniprogram下执行如下命令 。

```
npm init
npm install
```

![](../../../img/super-22.png)

接下来，下载小程序需要的Supabase 小程序客户端和ui组件包。

```
npm install supabase-wechat-stable-v2
npm install @vant/weapp
```

点击开发者工具中的菜单栏：工具 /构建 npm

![](../../../img/sdk版本.png)

这一步npm就构建完成了，我们需要的依赖也已经下载好了,目录miniprogram下会多出两个文件，如下图。

![](../../../img/super-24.png)

## 获取 API密钥 [*link*](#%e8%8e%b7%e5%8f%96-api%e5%af%86%e9%92%a5)

我们需要创建一个可以访问应用程序数据的客户端，我们使用了Supabase 微信客户端，使用他生态里提供的功能（登录、注册、增删改查等）去进行交互。创建一个可以访问我们应用程序数据的客户端需要接口的地址（URL）和一个数据权限的令牌（ANON\_KEY）,我们需要去应用的概览里面去获取这两个参数然后配置到lib/supabase.ts里面去。

lib/supabase.ts

```
import { createClient } from 'supabase-wechat-stable'
const url = ""
const key = ""

export const supabase = createClient(url, key)
```

回到MemFire Cloud首页，在应用/概括页面，获取服务地址以及token信息，只需要从总览中获取URL接口地址和anon的密钥。

![](../../../img/样例-discuss-3.png)

Anon（公开）密钥是客户端API密钥。它允许“匿名访问”您的数据库，直到用户登录。登录后，密钥将切换到用户自己的登录令牌。这将为数据启用行级安全性。

注意：service\_role密钥可以绕过任何安全策略完全访问您的数据。这些密钥必须保密，并且要在服务器环境中使用，绝不能在客户端或浏览器上使用。 在后续示例代码中，需要提供supabaseUrl和supabaseKey。

## 编译小程序 [*link*](#%e7%bc%96%e8%af%91%e5%b0%8f%e7%a8%8b%e5%ba%8f)

![](../../../img/super-26.png)

功能1：在没有登录绑定学号时，主页不会出现当日的课程情况，请先点击“绑定学号”去注册登录后才会有该学生今日的课表情况。

![](../../../img/super-27.png)

功能2：点击班级课表，输入学校、学院及学号可以查看该学生本周的课程情况

![](../../../img/super-28.png)

功能3：更换头像

![](../../../img/super-29.png)

上传头像需要注意： 使用[wx.chooseMedia](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html)来上传文件

推荐使用方法：

```
wx.chooseMedia({
  count: 1,
  sizeType: ["original", "compressed"],
  sourceType: ["album", "camera"],
  async success(res) {
    const file = res.tempFiles[0]
    const fileExt = res.tempFiles[0].tempFilePath.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`
    let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)
    if (uploadError) {
      throw uploadError
    }
  },
});
```

功能4：清除缓存（会清除当前学生的所有账号及课表信息）

![](../../../img/super-30.png)

---

[*navigate\_before* 前端框架的脚手架](/docs/app/example/scaffold/)

[BBS论坛小程序 *navigate\_next*](/docs/app/example/wechat/hellobbs/)