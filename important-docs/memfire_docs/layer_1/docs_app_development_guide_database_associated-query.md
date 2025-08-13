# 关联查询 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/associated-query/
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

# 关联查询

多表关联是指在关系型数据库中，通过多个数据表之间的字段关联，实现数据的联合查询和统计分析。使用场景包括：复杂的数据统计分析、跨部门的数据共享和协作、多维度的数据查询和分析等。一般情况下，需要设计合适的数据模型和关联规则来确保查询效率和数据准确性。其中包括：

1. [过滤查询：eq](/docs/app/development_guide/database/associated-query/#1条件过滤查询eq)
2. [自定义字段查询](/docs/app/development_guide/database/associated-query/#2自定义字段查询)
3. [查询所有关联数据](/docs/app/development_guide/database/associated-query/#3查询所有关联数据)
4. [条件过滤查询：filter](/docs/app/development_guide/database/associated-query/#4条件过滤查询filter)
5. [通过内关联/左关联查询](/docs/app/development_guide/database/associated-query/#5通过内关联左关联查询)
6. [连接运算符：or](/docs/app/development_guide/database/associated-query/#6连接运算符or)
7. [连接运算符：or & and](/docs/app/development_guide/database/associated-query/#7连接运算符or--and)
8. [数据排序：order](/docs/app/development_guide/database/associated-query/#8数据排序order)
9. [过滤数据的条数： count](/docs/app/development_guide/database/associated-query/#9过滤数据的条数count)
10. [限制返回的行数： limit](/docs/app/development_guide/database/associated-query/#10限制返回的行数limit)

本教程是通过数据表：学生课表信息表、课程信息表、学校信息表，三者之间存在的关联关系的示例来讲解如何通过JavaScript SDK的API进行多表关联查询数据的教程。

## 准备工作，创建数据表 [*link*](#%e5%87%86%e5%a4%87%e5%b7%a5%e4%bd%9c%e5%88%9b%e5%bb%ba%e6%95%b0%e6%8d%ae%e8%a1%a8)

### 创建subject表 [*link*](#%e5%88%9b%e5%bb%basubject%e8%a1%a8)

subject表主要记录课程信息，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| teacherName | text | 老师 |
| adress | text | 上课地点 |
| subjectName | text | 科目 |
| updated\_at | timeatamptz | 修改时间 |

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
```

### 创建school表 [*link*](#%e5%88%9b%e5%bb%baschool%e8%a1%a8)

school表主要记录学校信息，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| schoolName | text | 学校名称（唯一） |
| updated\_at | timeatamptz | 修改时间 |

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

### 创建subject\_student表 [*link*](#%e5%88%9b%e5%bb%basubject_student%e8%a1%a8)

subject\_student表主要记录学生的课表和学校信息，表结构字段如下：

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| id | int8 | 主键，自增，唯一标识ID |
| studentId | int8 | 学号 |
| subjectId | int8 | 外键，与subject表的id关联 |
| schoolId | int8 | 外键，与school表的id关联 |
| updated\_at | timestampt | 修改时间 |

关键点：

1.创建subject\_student表时，必须要设置字段subjectId与subject表的id关联和字段schoolId与school表的id关联，否则将不能执行关联查询。

2.需要创建"studentId"、“subjectId”、“schoolId"联合唯一索引。

```
CREATE TABLE "public"."subject_student" (
  "id" BIGINT NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "studentId" BIGINT NOT NULL,
  "schoolId" BIGINT NULL,
  "subjectId" BIGINT NOT NULL,
  CONSTRAINT "subject_student_pkey" PRIMARY KEY ("id")
);
--设置subjectId与课程表的id关联和schoolId与学校表的id关联
ALTER TABLE "public"."subject_student" ADD CONSTRAINT "subject_student_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."subject" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."subject_student" ADD CONSTRAINT "subject_student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."school" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- 创建联合唯一索引
CREATE UNIQUE INDEX subject_student_schoolId_ukey ON "public"."subject_student"("studentId","schoolId","subjectId");

INSERT INTO "public"."subject_student" ("id", "updated_at", "studentId", "subjectId","schoolId") VALUES ('1', '2022-08-17 09:51:14.733+08', '20222201', '1','1');
INSERT INTO "public"."subject_student" ("id", "updated_at", "studentId", "subjectId","schoolId") VALUES ('2', '2022-08-17 16:14:51.236+08', '20222202', '2','2');
INSERT INTO "public"."subject_student" ("id", "updated_at", "studentId", "subjectId","schoolId") VALUES ('3', '2022-08-17 17:29:33.938+08', '20222201', '3','3');
INSERT INTO "public"."subject_student" ("id", "updated_at", "studentId", "subjectId","schoolId") VALUES ('4', '2022-08-18 17:30:09.934+08', '20222202', '4','4');
```

## 1.条件过滤查询：`eq` [*link*](#1%e6%9d%a1%e4%bb%b6%e8%bf%87%e6%bb%a4%e6%9f%a5%e8%af%a2eq)

查询学生的studentId为20222201的课表信息

```
const { data, error } = await supabase
  .from('subject_student')
  .select(`
  subject (id,subjectName,teacherName,adress)
`).eq("studentId","20222201")
```

使用方法注意：

1.在这个查询中，`from`后面的`subject_student`是主表，`subject`是关联表，`id`,`subjectName`,`teacherName`,`adress`是查询`subject`中的指定字段，用逗号隔开，用括号包住。

2.`eq`通常是指`"="`，也就是等于运算符。它只能过滤主表的字段，不能过滤外联表的字段。

结果：

```
[
  {
    subject: {
      id: 1,
      subjectName: '数据库原理',
      teacherName: '张珊',
      adress: '计科楼2-1003'
    }
  },
  {
    subject: {
      id: 3,
      subjectName: '分布式数据库',
      teacherName: '王五',
      adress: '4教-101'
    }
  }
]
```

## 2.自定义字段查询 [*link*](#2%e8%87%aa%e5%ae%9a%e4%b9%89%e5%ad%97%e6%ae%b5%e6%9f%a5%e8%af%a2)

查询学生的studentId为20222201的课表信息和学校信息。

当您想要自定义查询主表与关联表的一些字段时，您可以在`select`里面用逗号把主表的字段隔开，后面加上想要查询的关联表，关联表紧挨着用括号包裹它的字段，也需要用逗号隔开。

```
const { data, error } = await supabaseJs
  .from('subject_student')
  .select(`
  id,
  studentId,
  subject (id,subjectName,teacherName,adress),
  school (id,schoolName)
`).eq("studentId","20222201")
```

结果：

```
[
  {
    id: 1,
    studentId: 20222201,
    subject: {
      id: 1,
      subjectName: '数据库原理',
      teacherName: '张珊',
      adress: '计科楼2-1003'
    },
    school: { id: 1, schoolName: '武汉大学' }
  },
  {
    id: 3,
    studentId: 20222201,
    subject: {
      id: 3,
      subjectName: '分布式数据库',
      teacherName: '王五',
      adress: '4教-101'
    },
    school: { id: 3, schoolName: '华中师范大学' }
  }
]
```

## 3.查询所有关联数据 [*link*](#3%e6%9f%a5%e8%af%a2%e6%89%80%e6%9c%89%e5%85%b3%e8%81%94%e6%95%b0%e6%8d%ae)

查询所有学生的课表信息

`*`代表查询所在表的所有字段信息。

查询所有关联数据时，`select` 后面不需要任何条件过滤。

```
const { data, error } = await supabase
  .from('subject_student')
  .select(`*,
  subject (*)
`)
```

结果：

```
[
    {
        "id": 3,
        "updated_at": "2022-08-17T09:29:33.938+00:00",
        "studentId": 20222201,
        "schoolId": 3,
        "subjectId": 3,
        "subject": {
            "id": 3,
            "teacherName": "王五",
            "updated_at": "2022-08-17T09:28:49.603+00:00",
            "adress": "4教-101",
            "subjectName": "分布式数据库"
        }
    },
    {
        "id": 1,
        "updated_at": "2022-08-17T01:51:14+00:00",
        "studentId": 20222201,
        "schoolId": 1,
        "subjectId": 2,
        "subject": {
            "id": 2,
            "teacherName": "李四",
            "updated_at": "2022-08-17T08:13:54.527+00:00",
            "adress": "重楼2-3112",
            "subjectName": "计算机基础"
        }
    },
    {
        "id": 2,
        "updated_at": "2022-08-17T08:14:51+00:00",
        "studentId": 20222202,
        "schoolId": 2,
        "subjectId": 4,
        "subject": {
            "id": 4,
            "teacherName": "王博",
            "updated_at": "2022-08-18T09:28:59.265+00:00",
            "adress": "综合楼4-401",
            "subjectName": "高等数学"
        }
    },
    {
        "id": 4,
        "updated_at": "2022-08-18T09:30:09+00:00",
        "studentId": 20222202,
        "schoolId": 4,
        "subjectId": 1,
        "subject": {
            "id": 1,
            "teacherName": "张珊",
            "updated_at": "2022-08-12T10:28:30.725+00:00",
            "adress": "计科楼2-1003",
            "subjectName": "武汉大学"
        }
    }
]
```

## 4.条件过滤查询：`filter` [*link*](#4%e6%9d%a1%e4%bb%b6%e8%bf%87%e6%bb%a4%e6%9f%a5%e8%af%a2filter)

小知识：`filter` 、`eq`、`and`和`or`的区别。

* `filter`通常指的是 `SELECT` 语句中的 `WHERE` 子句。`WHERE` 子句用于筛选符合指定条件的数据行，它指定了一个或多个条件，以便只返回满足条件的数据。
* `OR` 是用于连接两个或多个条件，表示只要满足其中任意一个条件即可。
* `AND` 是用于连接两个或多个条件，表示同时满足所有条件才能返回结果。
* `filter`是用于筛选满足指定条件的记录，它可以使用一系列操作符（如`=`，`<>`，`<`,`>`等）来定义多种筛选条件，而`eq`则是SQL中的一个方法，用于创建`filter`条件中的`=`操作符。

查询学生的studentId为20222201的课程名称为“数据库原理”的课表信息和某个学生的学校为“武汉大学”的学校信息。

```
const { data, error } = await supabaseJs
  .from('subject_student')
  .select(`
  school (schoolName),
  subject (id,subjectName,teacherName,adress)
`).filter('school.schoolName', 'eq', '武汉大学').filter('subject.subjectName', 'eq', '数据库原理').filter('studentId','eq','20222201')
```

使用方法注意：

1.在这个查询中，`from`后面的`subject_student`是主表，`subject`是关联表，`id`,`subjectName`,`teacherName`,`adress`是查询`subject`中的指定字段，用逗号隔开，用括号包住。

2.`filter`是用于筛选满足指定条件的记录，它可以使用一系列操作符（如`=`，`<>`，`<`,`>`等）来定义多种筛选条件,比如在这个查询中就使用了`eq`来定义了筛选条件。

3.`filter`第一个参数是数据表的指定查询字段，如果要查询外联表的字段，则需要带上外联表的名称,例如：`subject.subjectName`，就是通过`subject`外联表的`subjectName`字段来筛选，如果不带则表示通过主表的字段筛选。

结果：

```
[
  {
    school: { schoolName: '武汉大学' },
    subject: {
      id: 1,
      subjectName: '数据库原理',
      teacherName: '张珊',
      adress: '计科楼2-1003'
    }
  },
  { school: null, subject: null }
]
```

“null"出现的原因：如果不满足对外部表列的过滤器（在这个例子中外部表是subject和school），则外部表返回`[]`或`null`，但不会过滤掉主表。如果要过滤掉主表行，使用`!inner`。

## 5.通过内关联/左关联查询 [*link*](#5%e9%80%9a%e8%bf%87%e5%86%85%e5%85%b3%e8%81%94%e5%b7%a6%e5%85%b3%e8%81%94%e6%9f%a5%e8%af%a2)

查询学生的studentId为20222201，课程名称为“高等数学”或者老师是王五的课表信息。

目前暂时只提供`!inner`和`!left`两种关联查询。

如果要过滤掉主表行，则可使用`!inner`。

```
const { data, error } = await supabaseJs
  .from('subject_student')
  .select(`
  subject!inner (id,subjectName,teacherName,adress)
`).or('subjectName.eq.高等数学,teacherName.eq.王五', { foreignTable: 'subject' }).eq('studentId','20222201')
```

结果：

```
[
  {
    subject: {
      id: 3,
      subjectName: '分布式数据库',
      teacherName: '王五',
      adress: '4教-101'
    }
  }
]
```

## 6.连接运算符：`or` [*link*](#6%e8%bf%9e%e6%8e%a5%e8%bf%90%e7%ae%97%e7%ac%a6or)

and 和 or 也叫连接运算符，在查询数据时用于缩小查询范围，我们可以用 and 或者 or 指定一个或多个查询条件。

* and 表示一个或者多个条件必须同时成立。
* or 表示多个条件中只需满足其中任意一个即可。

查询学生的studentId为20222202，课程名称为“高等数学”或者老师是王五的课表信息。

用`foreignTable`指定过滤的外联表，不设置则会判断为过滤主表。

```
const { data, error } = await supabaseJs
  .from('subject_student')
  .select(`
  subject!inner(id,subjectName,teacherName,adress)
`).or('subjectName.eq.高等数学,teacherName.eq.王五', { foreignTable: 'subject' }).eq('studentId','20222202')
```

结果：

```
[
    {
        "subject": {
            "id": 4,
            "subjectName": "高等数学",
            "teacherName": "王博",
            "adress": "综合楼4-401"
        }
    }
]
```

## 7.连接运算符：`or` & `and` [*link*](#7%e8%bf%9e%e6%8e%a5%e8%bf%90%e7%ae%97%e7%ac%a6or--and)

用`foreignTable`指定过滤的外联表，不设置则会判断为过滤主表。

查询学生的studentId为20222202，课程名称为“高等数学”或者老师是王五、教室在4教-101的课表信息。

```
const { data, error } = await supabaseJs
  .from('subject_student')
  .select(`
  subject!inner(id,subjectName,teacherName,adress)
`).or('subjectName.eq.高等数学,and(teacherName.eq.王五,adress.eq.4教-101)', { foreignTable: 'subject' }).eq('studentId','20222202')
```

结果：

```
[
    {
        "subject": {
            "id": 4,
            "subjectName": "高等数学",
            "teacherName": "王博",
            "adress": "综合楼4-401"
        }
    }
]
```

## 8.数据排序：`order` [*link*](#8%e6%95%b0%e6%8d%ae%e6%8e%92%e5%ba%8forder)

用`foreignTable`指定过滤的外联表，不设置则会判断为过滤主表。

查按课程名称降序的课程信息。

```
const { data, error } = await supabaseJs
  .from('subject_student')
  .select(`
  subject (id,subjectName,teacherName,adress)
`).order('subjectName', { foreignTable: 'subject', ascending: false })
```

结果：

```
[
  {
    subject: {
      id: 1,
      subjectName: '数据库原理',
      teacherName: '张珊',
      adress: '计科楼2-1003'
    }
  },
  {
    subject: {
      id: 2,
      subjectName: '计算机基础',
      teacherName: '李四',
      adress: '重楼2-3112'
    }
  },
  {
    subject: {
      id: 3,
      subjectName: '分布式数据库',
      teacherName: '王五',
      adress: '4教-101'
    }
  },
  {
    subject: {
      id: 4,
      subjectName: '高等数学',
      teacherName: '王博',
      adress: '综合楼4-401'
    }
  }
]
```

## 9.过滤数据的条数：`count` [*link*](#9%e8%bf%87%e6%bb%a4%e6%95%b0%e6%8d%ae%e7%9a%84%e6%9d%a1%e6%95%b0count)

查询每个学生的课表有多少个。

注意：为了避免外联表也有跟`count`相同的名字的字段，建议采取其他的字段命名。

```
const { data, error } = await supabaseJs
  .from('subject_student')
  .select(`*,
  subject (count)
`)
```

结果：

```
{
    id: 1,
    updated_at: '2022-08-17T01:51:14.733+00:00',
    studentId: 20222201,
    schoolId: 1,
    subjectId: 1,
    subject: { count: 1 }
  },
  {
    id: 2,
    updated_at: '2022-08-17T08:14:51.236+00:00',
    studentId: 20222202,
    schoolId: 2,
    subjectId: 2,
    subject: { count: 1 }
  },
  {
    id: 3,
    updated_at: '2022-08-17T09:29:33.938+00:00',
    studentId: 20222201,
    schoolId: 3,
    subjectId: 3,
    subject: { count: 1 }
  },
  {
    id: 4,
    updated_at: '2022-08-18T09:30:09.934+00:00',
    studentId: 20222202,
    schoolId: 4,
    subjectId: 4,
    subject: { count: 1 }
  }
]
```

## 10.限制返回的行数：`limit` [*link*](#10%e9%99%90%e5%88%b6%e8%bf%94%e5%9b%9e%e7%9a%84%e8%a1%8c%e6%95%b0limit)

查询每个学生的课表信息，并且只返回一条课表信息。

用`foreignTable`指定过滤的外联表，不设置则会判断为过滤主表。

```
const { data, error } = await supabaseJs
.from('subject_student')
.select(`*,subject (*)`)
.limit(1, { foreignTable: 'subject' })
```

结果：

```
[
    {
        "id": 3,
        "updated_at": "2022-08-17T09:29:33.938+00:00",
        "studentId": 20222201,
        "schoolId": 3,
        "subjectId": 3,
        "subject": {
            "id": 3,
            "teacherName": "王五",
            "updated_at": "2022-08-17T09:28:49.603+00:00",
            "adress": "4教-101",
            "subjectName": "分布式数据库"
        }
    },
    {
        "id": 1,
        "updated_at": "2022-08-17T01:51:14+00:00",
        "studentId": 20222201,
        "schoolId": 1,
        "subjectId": 2,
        "subject": {
            "id": 2,
            "teacherName": "李四",
            "updated_at": "2022-08-17T08:13:54.527+00:00",
            "adress": "重楼2-3112",
            "subjectName": "计算机基础"
        }
    },
    {
        "id": 2,
        "updated_at": "2022-08-17T08:14:51+00:00",
        "studentId": 20222202,
        "schoolId": 2,
        "subjectId": 4,
        "subject": {
            "id": 4,
            "teacherName": "王博",
            "updated_at": "2022-08-18T09:28:59.265+00:00",
            "adress": "综合楼4-401",
            "subjectName": "高等数学"
        }
    },
    {
        "id": 4,
        "updated_at": "2022-08-18T09:30:09+00:00",
        "studentId": 20222202,
        "schoolId": 4,
        "subjectId": 1,
        "subject": {
            "id": 1,
            "teacherName": "张珊",
            "updated_at": "2022-08-12T10:28:30.725+00:00",
            "adress": "计科楼2-1003",
            "subjectName": "武汉大学"
        }
    }
]
```

---

[*navigate\_before* 数据库连接](/docs/app/development_guide/database/connecting-to-postgres/)

[外部数据包装器(FDW) *navigate\_next*](/docs/app/development_guide/database/wrappers/overview/)