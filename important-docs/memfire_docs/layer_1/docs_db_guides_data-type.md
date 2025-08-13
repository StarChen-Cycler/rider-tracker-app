# 数据类型 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/guides/data-type/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

数据类型汇总

# 数据类型

## 数据类型汇总 [*link*](#%e6%95%b0%e6%8d%ae%e7%b1%bb%e5%9e%8b%e6%b1%87%e6%80%bb)

下表列出了MemFireDB支持的原始和复合数据类型。显示了所有内建的普通数据类型。大部分在“别名”列里列出的可选名字都是因历史原因在内部使用的名字。

**表 数据类型**

| 数据类型 | 别名 | 描述 |
| --- | --- | --- |
| bigint | int8 | 有符号8字节整数 |
| bigserial | serial8 | 自动增长的8字节整数 |
| `bit [ (n) ]` |  | 定长位串 |
| `bit varying [ (n) ]` | varbit [ (n) ] | 变长位串 |
| boolean | bool | 逻辑布尔值（真/假） |
| `box` |  | 平面上的普通方框 |
| bytea |  | 二进制数据（“字节数组”） |
| character [ (n) ] | char [ (n) ] | 定长字符串 |
| character varying [ (n) ] | varchar [ (n) ] | 变长字符串 |
| `cidr` |  | IPv4或IPv6网络地址 |
| `circle` |  | 平面上的圆 |
| date |  | 日历日期（年、月、日） |
| double precision | float8 | 双精度浮点数（8字节） |
| `inet` |  | IPv4或IPv6主机地址 |
| integer | int， int4 | 有符号4字节整数 |
| interval [ fields ] [ (p) ] |  | 时间段 |
| `json` |  | 文本JSON数据 |
| `jsonb` |  | 二进制JSON数据，已分解 |
| `line` |  | 平面上的无限长的线 |
| `lseg` |  | 平面上的线段 |
| `macaddr` |  | MAC（Media Access Control）地址 |
| `macaddr8` |  | MAC（Media Access Control）地址（EUI-64格式） |
| money |  | 货币数量 |
| numeric [ (p, s) ] | decimal [ (p, s) ] | 可选择精度的精确数字 |
| `path` |  | 平面上的几何路径 |
| `pg_lsn` |  | 日志序号 |
| `point` |  | 平面上的几何点 |
| `polygon` |  | 平面上的封闭几何路径 |
| real | float4 | 单精度浮点数（4字节） |
| smallint | int2 | 有符号2字节整数 |
| smallserial | serial2 | 自动增长的2字节整数 |
| serial | serial4 | 自动增长的4字节整数 |
| text |  | 变长字符串 |
| time [ (p) ] [ without time zone ] |  | 一天中的时间（无时区） |
| time [ (p) ] with time zone | timetz | 一天中的时间，包括时区 |
| timestamp [ (p) ] [ without time zone ] |  | 日期和时间（无时区） |
| timestamp [ (p) ] with time zone | timestampz | 日期和时间，包括时区 |
| `tsquery` |  | 文本搜索查询 |
| `tsvector` |  | 文本搜索文档 |
| `txid_snapshot` |  | 用户级别事务ID快照 |
| uuid |  | 通用唯一标识码 |

除了`XML`的数据类型，MemFireDB尚不支持外，兼容PostgreSQL的其他所有数据类型；  
`颜色`此类型的表列不能是的一部分INDEX KEY。  
用户可以使用CREATE TYPE命令为 MemFireDB增加新的数据类型；

## 数字类型 [*link*](#%e6%95%b0%e5%ad%97%e7%b1%bb%e5%9e%8b)

MemFireDB支持具有不同值范围和精度的整数、浮点数和定点数。

数字类型由2、4或8字节的整数以及4或8字节的浮点数和可选精度小数组成。下表列出了所有可用类型。

**表** **数字类型**

| 名字 | 存储尺寸 | 描述 | 范围 |
| --- | --- | --- | --- |
| smallint | 2字节 | 小范围整数 | -32768 to +32767 |
| integer | 4字节 | 整数 | -2147483648 to +2147483647 |
| bigint | 8字节 | 大范围整数 | -9223372036854775808 to +9223372036854775807 |
| decimal | 可变 | 用户指定精度，精确 | 最高小数点前131072位，以及小数点后16383位 |
| numeric | 可变 | 用户指定精度，精确 | 最高小数点前131072位，以及小数点后16383位 |
| real | 4字节 | 可变精度，不精确的浮点数 | 6位十进制精度 |
| double precision | 8字节 | 可变精度，不精确浮点数 | 15位十进制精度 |
| smallserial | 2字节 | 自动增加的小整数 | 1到32767 |
| serial | 4字节 | 自动增加的整数 | 1到2147483647 |
| bigserial | 8字节 | 自动增长的大整数 | 1到9223372036854775807 |
| float | 8字节 | 可变精度，不精确的浮点数 |  |
| numeric |  | 精确的定点数字 | 最高小数点前131072位，以及小数点后16383位 |

### 整数类型 [*link*](#%e6%95%b4%e6%95%b0%e7%b1%bb%e5%9e%8b)

类型smallint、integer和bigint存储各种范围的全部是数字的数，也就是没有小数部分的数字。试图存储超出范围以外的值将导致一个错误。

常用的类型是integer，因为它提供了在范围、存储空间和性能之间的最佳平衡。一般只有在磁盘空间紧张的时候才使用 smallint类型。而只有在integer的范围不够的时候才使用bigint。

SQL只声明了整数类型integer（或int）、smallint和bigint。类型int2、int4和int8都是扩展，也在许多其它SQL数据库系统中使用。

```
type_specification ::= SMALLINT | INT |  INTEGER | BIGINT  integer_literal ::= [ + | - ] digit [ { digit  | , } ... ]
```

· 类型的列`integer`、`int`、`smallint`和`bigint`可以是部分PRIMARY KEY。

· 不同整数数据类型的值是可比较的并且可以相互转换。

· 整数数据类型的值是可转换的，但不能与浮点数相比。

· 当前，浮点数据类型的值不能转换为整数。此限制将在不久的将来取消。

### 浮点数类型 [*link*](#%e6%b5%ae%e7%82%b9%e6%95%b0%e7%b1%bb%e5%9e%8b)

数据类型real、double precision是不准确的、变精度的数字类型。

```
type_specification ::= { FLOAT | DOUBLE PRECISION  | REAL }  floating_point_literal ::=  non_integer_fixed_point_literal | "NaN" | "Infinity" |  "-Infinity"
```

· 类型为`real`、`double precision`和float可以是的一部分PRIMARY KEY。

· 不同的浮点和精确数据类型的值是可比较的并且可以相互转换。

· 浮点类型转换到DECIMAL会引发错误的特殊值NaN，Infinity和-Infinity。

· 浮点类型还有几个特殊值：Infinity、-Infinity、NaN，这些值分别表示 IEEE 754 特殊值“正无穷大”、“负无穷大”以及“不是一个数字”

· 非整数数值数据类型的值既不可比较也不可转换为整数，尽管整数可转换为整数。此限制将被删除。

MemFireDB还支持 SQL 标准表示法float和float(p)用于声明非精确的数字类型。在这里，p指定以二进制位表示的最低可接受精度。 在选取real类型的时候，MemFireDB接受float(1)到float(24)，在选取double precision的时候，接受float(25)到float(53)。在允许范围之外的p值将导致一个错误。没有指定精度的float将被当作是double precision。

### 高精度数值类型 [*link*](#%e9%ab%98%e7%b2%be%e5%ba%a6%e6%95%b0%e5%80%bc%e7%b1%bb%e5%9e%8b)

类型numeric可以存储非常多位的数字。我们特别建议将它用于货币金额和其它要求计算准确的数量。numeric值的计算在可能的情况下会得到准确的结果，例如加法、减法、乘法。不过，numeric类型上的算术运算比整数类型或者浮点数类型要慢很多。

术语：一个numeric的precision（精度）是整个数中有效位的总数，也就是小数点两边的位数。numeric的scale（刻度）是小数部分的数字位数，也就是小数点右边的部分。因此数字 23.5141 的精度为6而刻度为4。

numeric列的最大精度和最大比例都是可以配置的。要声明一个类型为numeric的列，你可以用下面的语法：

```
NUMERIC(precision, scale)
```

以下关键字用于为不同的约束（包括其值范围）指定一列由用户指定的精确精度类型。

```
type_specification ::= { DEC | DECIMAL |  NUMERIC }  fixed_point_literal ::= [ + | - ] { digit [  digit ...] '.' [ digit ...] | '.' digit [ digit ...] }
```

· 类型为DEC，DECIMAL和的列NUMERIC可以是的一部分PRIMARY KEY。

· 不同的浮点和定点数据类型的值是可比较的并且可以相互转换。

· 非整数数值数据类型的值既不可比较也不可转换为整数，尽管整数可转换为整数。此限制将被删除。

类型decimal和numeric是等效的。两种类型都是SQL标准的一部分。

### 序数类型 [*link*](#%e5%ba%8f%e6%95%b0%e7%b1%bb%e5%9e%8b)

smallserial、serial和bigserial类型不是真正的类型，它们只是为了创建唯一标识符列而存在的方便符号（类似其它一些数据库中支持的AUTO\_INCREMENT属性）。

```
type_specification ::= SMALLSERIAL |  SERIAL | BIGSERIAL
```

· 序列类型的列会自动增加。

· SERIAL 并不意味着在该列上创建了索引。

在目前的实现中，下面一个语句：

```
CREATE TABLE tablename (
    colname SERIAL
);
```

等价于以下语句：

```
CREATE SEQUENCE tablename_colname_seq;
CREATE TABLE tablename (
    colname integer NOT NULL DEFAULT nextval('tablename_colname_seq')
);
ALTER SEQUENCE tablename_colname_seq OWNED BY tablename.colname;
```

因此，我们就创建了一个整数列并且把它的缺省值安排为从一个序列发生器取值。应用了一个NOT NULL约束以确保空值不会被插入（在大多数情况下你可能还希望附加一个UNIQUE或者PRIMARY KEY约束避免意外地插入重复的值，但这个不是自动发生的）。最后，该序列被标记为“属于”该列，这样当列或表被删除时该序列也会被删除。

类型名serial和serial4是等效的： 两个都创建integer列。类型名bigserial和serial8也一样，只不过它们创建一个 bigint列。如果你预计在表的生存期中使用的标识符数目超过 231 个，那么你应该使用bigserial。类型名smallserial和serial2也以相同方式工作，只不过它们创建一个smallint列。

为一个serial列创建的序列在所属的列被删除的时候自动删除。你可以在不删除列的情况下删除序列，但是这会强制删除该列的默认值表达式。

## 字符类型 [*link*](#%e5%ad%97%e7%ac%a6%e7%b1%bb%e5%9e%8b)

基于字符的数据类型用于指定Unicode字符字符串的数据。

| **数据类型** | **描述** |
| --- | --- |
| char | 1字节的字符串 |
| char(n)，character(n) | 定长，空格填充的字符串 |
| character varying(n)、varchar(n) | 长度最大为（n）的变长字符串 |
| varchar | 可变长度的字符串 |
| text | 可变长度的字符串 |

SQL定义了两种基本的字符类型： character varying(n)和character(n)， 其中n是一个正整数。两种类型都可以存储最多n个字符长的串。试图存储更长的串到这些类型的列里会产生一个错误， 除非超出长度的字符都是空白，这种情况下该串将被截断为最大长度（这个看上去有点怪异的例外是SQL标准要求的）。 如果要存储的串比声明的长度短，类型为character的值将会用空白填满；而类型为character varying的值将只是存储短些的串。

varchar(n)和char(n)的概念分别是character varying(n)和character(n)的别名。没有长度声明词的character等效于character(1)。如果不带长度说明词使用character varying，那么该类型接受任何长度的串。

另外，MemFireDB提供text类型，它可以存储任何长度的串。尽管类型text不是SQL标准，但是许多其它 SQL 数据库系统也有它。

类型character的值物理上都用空白填充到指定的长度n， 并且以这种方式存储和显示。不过，拖尾的空白被当作是没有意义的，并且在比较两个 character类型值时不会考虑它们。在空白有意义的排序规则中，这种行为可能会 产生意料之外的结果，例如`SELECT 'a '::CHAR(2) collate "C" < E'a\n'::CHAR(2)`会返回真（即便C区域会认为一个空格比新行更大）。当把一个character值转换成其他 字符串类型之一时，拖尾的空白会被移除。请注意，在character varying和text值里， 结尾的空白语意上是有含义的，并且在使用模式匹配（如LIKE和正则表达式）时也会被考虑。

使用字符串类型

```
CREATE TABLE test1 (a character(4));
INSERT INTO test1 VALUES ('ok');
SELECT a, char_length(a) FROM test1; -- (1)

  a   | char_length
------+-------------
 ok   |           2

CREATE TABLE test2 (b varchar(5));
INSERT INTO test2 VALUES ('ok');
INSERT INTO test2 VALUES ('good      ');
INSERT INTO test2 VALUES ('too long');
ERROR:  value too long for type character varying(5)
INSERT INTO test2 VALUES ('too long'::varchar(5)); -- explicit truncation
SELECT b, char_length(b) FROM test2;

   b   | char_length
-------+-------------
 ok    |           2
 good  |           5
 too l |           5
```

**描述**

```
text_literal ::= "'" [ '' | letter ...] "'"
```

· 单引号必须转义为（’’）。

· letter是除单引号（[^’]）以外的任何字符。

· 基于字符的数据类型可以是的一部分PRIMARY KEY。

· 字符数据类型的值是可转换的，并且可以与非文本数据类型进行比较。

## JSON数据类型 [*link*](#json%e6%95%b0%e6%8d%ae%e7%b1%bb%e5%9e%8b)

JavaScript Object Notation（JSON）是用于结构化数据序列化的文本格式，其语法和语义在RFC 7159中定义。JSON用Unicode字符表示，这种表示通常称为document。字符串值和对象键之外的空格是无关紧要的。

MemFireDB支持两种数据类型来表示JSON文档：json和jsonb。两种数据类型都拒绝任何不符合RFC 7159的jsonJSON文档。它们 几乎接受完全相同的值集合作为输入。主要的实际区别之一是 效率。json数据类型存储输入文本的精准拷贝，处理函数必须在每次执行时必须重新解析该数据。而jsonb数据被存储在一种分解好的二进制格式中，它在输入时要稍慢一些，因为需要做附加的转换。但是 jsonb在处理时要快很多，因为不需要解析。jsonb也支持索引，这也是一个令人瞩目的优势。

由于json类型存储的是输入文本的准确拷贝，其中可能会保留在语法 上不明显的、存在于记号之间的空格，还有 JSON 对象内部的键的顺序。还有， 如果一个值中的 JSON 对象包含同一个键超过一次，所有的键/值对都会被保留（ 处理函数会把最后的值当作有效值）。相反，jsonb不保留空格、不 保留对象键的顺序并且不保留重复的对象键。如果在输入中指定了重复的键，只有 最后一个值会被保留。

通常，除非有特别特殊的需要（例如遗留的对象键顺序假设），大多数应用应该更愿意把 JSON 数据存储为jsonb。

JSON可以表示四种原始数据类型和两种复合数据类型的值。基本数据类型为`string，number，boolean和null`，无法声明JSON值的数据类型。而是从表示形式的语法中出现的。

**JSON基本类型**

| JSON 基本类型 | PostgreSQL类型 | 注释 |
| --- | --- | --- |
| string | text | 不允许\u0000，如果数据库编码不是 UTF8，非 ASCII Unicode 转义也是这样 |
| number | numeric | 不允许NaN 和 infinity值 |
| boolean | boolean | 只接受小写true和false拼写 |
| null | (无) | SQL NULL是一个不同的概念 |

请注意，除了作为常规格式的字符串值以外，JSON不能表示日期时间值。

两种复合数据类型是`object`和`array`。

JSON文字在SQL语句或PL / pgSQL程序中由符合RFC 7159的值的加引号::json或::jsonb类型转换text表示。

**JSON字串**

JSON字符串值是由字符括起来的零个，一个或多个Unicode字符的序列"。以下是一些示例，显示为SQL文字：

```
'"Dog"'::jsonb
```

空字符串是合法的，并且不同于JSON null。

```
'""'::jsonb
```

大小写和空格很重要。字符串值中的特殊字符需要转义，因此：

· 退格键： *\ b*  
· 换页： *\ f*  
· 换行符： *\ n*  
· 回车票： *\ r*  
· 制表符： *\ t*  
· 双引号： *“*  
· 反斜杠： *\*

例如：

```
'"\"First line\"\n\"second line\""'::jsonb
```

此JSON*字符串*值很好地说明了->和-»运算符之间的区别。

**JSON编号**

以下是一些示例，显示为SQL文字：

```
'17'::jsonb
```

和：

```
'4.2'::jsonb
```

和：

```
'2.99792E8'::jsonb
```

请注意，JSON在整数和实数之间没有区别。

**JSON布尔值**

这是两个允许的值，显示为SQL文字：

```
'true'::jsonb
```

和：

```
'false'::jsonb
```

**JSON空**

如上所述，null在JSON中是特殊的，因为它是它自己的数据类型，仅允许一个“值”，因此：

```
'null'::jsonb
```

**JSON对象**

一个对象是一组由分离键-值对逗号和包围大括号。顺序微不足道。对象中的值不必具有相同的数据类型。例如：

```
'{
  "a 1" : "Abc",
  "a 2" : 42,
  "a 3" : true,
  "a 4" : null,
  "a 5" : {"x" : 1, "y": "Pqr"}
}'::jsonb
```

密钥区分大小写，并且此类密钥内的空格很重要。它们甚至可以包含必须转义的字符。但是，如果键确实包含空格和特殊字符，则读取其值所需的语法可能会变得非常复杂。因此，有必要避免利用这种自由。

一个对象可以包含多个具有相同键的键/值对。不建议这样做，但是结果是明确定义的：最后提到的键值对，按从左到右的顺序，在具有相同键“获胜”的一组键值对中。您可以使用类似的运算符通过读取指定键的值来进行测试->。

**JSON数组**

一个阵列是未命名JSON的有序列表中的值，换句话说，顺序被定义并且是显著。数组中的值不必具有相同的数据类型。例如：

```
'[1, 2, "Abc", true, false, null, {"x": 17, "y": 42}]'::jsonb
```

数组中的值从开始0。请参阅->操作员的帐户。

**复合JSON值示例**

```
{
  "given_name"         : "Fred",
  "family_name"        : "Smith",
  "email_address"      : "fred@yb.com",
  "hire_date"          : "17-Jan-2015",
  "job"                : "sales",
  "base_annual_salary" : 50000,
  "commisission_rate"  : 0.05,
  "phones"             : ["+11234567890", "+13216540987"]
}
```

这是一个具有八个字段的JSON对象。前七个是原始字符串或数字值（其中一个常规表示日期），第八个是两个原始字符串值的数组。电话号码的文字表示遵循约定，以+和（可能是）国家/地区代码开头。JSON没有定义此类约定和实施一致性的机制。

值得注意的是，与XML相反，JSON不是自描述的。而且，JSON不支持注释。但是，这样做的目的是使该语法在直观上应显而易见且易于阅读。

大多数编程语言都具有与JSON的原始数据类型及其复合对象和数组数据类型直接对应的数据类型。

### Json的输入输出语法 [*link*](#json%e7%9a%84%e8%be%93%e5%85%a5%e8%be%93%e5%87%ba%e8%af%ad%e6%b3%95)

RFC 7159 中定义了 JSON 数据类型的输入/输出语法。

下列都是合法的json（或者jsonb）表达式：

```
-- 简单标量/基本值
-- 基本值可以是数字、带引号的字符串、true、false或者null
SELECT '5'::json;

-- 有零个或者更多元素的数组（元素不需要为同一类型）
SELECT '[1, 2, "foo", null]'::json;

-- 包含键值对的对象
-- 注意对象键必须总是带引号的字符串
SELECT '{"bar": "baz", "balance": 7.77, "active": false}'::json;

-- 数组和对象可以被任意嵌套
SELECT '{"foo": [true, "bar"], "tags": {"a": 1, "b": null}}'::json;
```

如前所述，当一个 JSON 值被输入并且接着不做任何附加处理就输出时， json会输出和输入完全相同的文本，而jsonb 则不会保留语义上没有意义的细节（例如空格）。例如，注意下面的不同：

```
SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::json;
                      json
-------------------------------------------------
 {"bar": "baz", "balance": 7.77, "active":false}
(1 row)

SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::jsonb;
                      jsonb
--------------------------------------------------
 {"bar": "baz", "active": false, "balance": 7.77}
(1 row)
```

值得一提的一种语义上无意义的细节是，在jsonb中数据会被按照底层 numeric类型的行为来打印。实际上，这意味着用E记号 输入的数字被打印出来时就不会有该记号，例如：

```
SELECT '{"reading": 1.230e-5}'::json, '{"reading": 1.230e-5}'::jsonb;
         json          |          jsonb
-----------------------+-------------------------
 {"reading": 1.230e-5} | {"reading": 0.00001230}
(1 row)
```

不过，如这个例子所示，jsonb将会保留拖尾的小数点后的零，即便这 对于等值检查等目的来说是语义上无意义的。

### jsonb包含和存在 [*link*](#jsonb%e5%8c%85%e5%90%ab%e5%92%8c%e5%ad%98%e5%9c%a8)

测试包含是jsonb的一种重要能力。对 json类型没有平行的功能集。包含测试会测试一个 jsonb文档是否被包含在另一个文档中。除了特别注解 之外，这些例子都会返回真：

```
-- 简单的标量/基本值只包含相同的值：
SELECT '"foo"'::jsonb @> '"foo"'::jsonb;

-- 右边的数字被包含在左边的数组中：
SELECT '[1, 2, 3]'::jsonb @> '[1, 3]'::jsonb;

-- 数组元素的顺序没有意义，因此这个例子也返回真：
SELECT '[1, 2, 3]'::jsonb @> '[3, 1]'::jsonb;

-- 重复的数组元素也没有关系：
SELECT '[1, 2, 3]'::jsonb @> '[1, 2, 2]'::jsonb;

-- 右边具有一个单一键值对的对象被包含在左边的对象中：
SELECT '{"product": "PostgreSQL", "version": 9.4, "jsonb": true}'::jsonb @> '{"version": 9.4}'::jsonb;

-- 右边的数组不会被认为包含在左边的数组中，
-- 即使其中嵌入了一个相似的数组：
SELECT '[1, 2, [1, 3]]'::jsonb @> '[1, 3]'::jsonb;  -- 得到假

-- 但是如果同样也有嵌套，包含就成立：
SELECT '[1, 2, [1, 3]]'::jsonb @> '[[1, 3]]'::jsonb;

-- 类似的，这个例子也不会被认为是包含：
SELECT '{"foo": {"bar": "baz"}}'::jsonb @> '{"bar": "baz"}'::jsonb;  -- 得到假

-- 包含一个顶层键和一个空对象：
SELECT '{"foo": {"bar": "baz"}}'::jsonb @> '{"foo": {}}'::jsonb;
```

一般原则是被包含的对象必须在结构和数据内容上匹配包含对象，这种匹配 可以是从包含对象中丢弃了不匹配的数组元素或者对象键值对之后成立。但 是记住做包含匹配时数组元素的顺序是没有意义的，并且重复的数组元素实 际也只会考虑一次。

结构必须匹配的一般原则有一种特殊情况，一个数组可以包含一个基本值：

```
-- 这个数组包含基本字符串值：
SELECT '["foo", "bar"]'::jsonb @> '"bar"'::jsonb;

-- 反之不然，下面的例子会报告“不包含”：
SELECT '"bar"'::jsonb @> '["bar"]'::jsonb;  -- 得到假
```

jsonb还有一个存在操作符，它是包含的一种 变体：它测试一个字符串（以一个text值的形式给出）是否出 现在jsonb值顶层的一个对象键或者数组元素中。除非特别注解， 下面这些例子返回真：

```
-- 字符串作为一个数组元素存在：
SELECT '["foo", "bar", "baz"]'::jsonb ? 'bar';

-- 字符串作为一个对象键存在：
SELECT '{"foo": "bar"}'::jsonb ? 'foo';

-- 不考虑对象值：
SELECT '{"foo": "bar"}'::jsonb ? 'bar';  -- 得到假

-- 和包含一样，存在必须在顶层匹配：
SELECT '{"foo": {"bar": "baz"}}'::jsonb ? 'bar'; -- 得到假

-- 如果一个字符串匹配一个基本 JSON 字符串，它就被认为存在：
SELECT '"foo"'::jsonb ? 'foo';
```

当涉及很多键或元素时，JSON 对象比数组更适合于做包含或存在测试， 因为它们不像数组，进行搜索时会进行内部优化，并且不需要被线性搜索。

**提示**: 由于 JSON 的包含是嵌套的，因此一个恰当的查询可以跳过对子对象的显式选择。 例如，假设我们在顶层有一个doc列包含着对象，大部分对象 包含着tags域，其中有子对象的数组。这个查询会找到其中出现了 同时包含"term":“paris"和"term”:“food"的子对象 的项，而忽略任何位于tags数组之外的这类键：

```
SELECT doc->'site_name' FROM websites
WHERE doc @> '{"tags":[{"term":"paris"}, {"term":"food"}]}';
```

可以用下面的查询完成同样的事情：

```
SELECT doc->'site_name' FROM websites
WHERE doc->'tags' @> '[{"term":"paris"}, {"term":"food"}]';
```

但是后一种方法灵活性较差，并且常常也效率更低。

在另一方面，JSON 的存在操作符不是嵌套的：它将只在 JSON 值的顶层 查找指定的键或数组元素。

### 创建索引 [*link*](#%e5%88%9b%e5%bb%ba%e7%b4%a2%e5%bc%95)

当将JSON文档插入表中时，该表将只有一个自填充的代理主键列和一个doc数据类型的value列，例如jsonb。与选择相比，选择jsonb允许使用范围更广的运算符和功能，并允许它们更有效地执行json。

```
create table books(k int primary key, doc jsonb not null);

insert into books(k, doc) values

 (1,

 '{ "ISBN"  : 4582546494267,

   "title"  : "Macbeth",

   "author" : {"given_name": "William", "family_name": "Shakespeare"},

   "year"  : 1623}'),

 (2,

 '{ "ISBN"  : 8760835734528,

   "title"  : "Hamlet",

   "author" : {"given_name": "William", "family_name": "Shakespeare"},

   "year"  : 1603,

   "editors" : ["Lysa", "Elizabeth"] }'),

 (3,

 '{ "ISBN"  : 7658956876542,

   "title"  : "Oliver Twist",

   "author" : {"given_name": "Charles", "family_name": "Dickens"},

   "year"  : 1838,

   "genre"  : "novel",

   "editors" : ["Mark", "Tony", "Britney"] }'),

 (4,

 '{ "ISBN"  : 9874563896457,

   "title"  : "Great Expectations",

   "author" : {"family_name": "Dickens"},

   "year"  : 1950,

   "genre"  : "novel",

   "editors" : ["Robert", "John", "Melisa", "Elizabeth"] }'),

 (5,

 '{ "ISBN"  : 8647295405123,

   "title"  : "A Brief History of Time",

   "author" : {"given_name": "Stephen", "family_name": "Hawking"},

   "year"  : 1988,

   "genre"  : "science",

   "editors" : ["Melisa", "Mark", "John", "Fred", "Jane"] }'),

 (6,

 '{

  "ISBN"   : 6563973589123,

  "year"   : 1989,

  "genre"  : "novel",

  "title"  : "Joy Luck Club",

  "author"  : {"given_name": "Amy", "family_name": "Tan"},

  "editors" : ["Ruilin", "Aiping"]}');
```

一些行缺少一些键。但是具有“ k = 6”的行具有每个键。

例如，您可能想查看出版年份晚于1850年的书籍的标题和作者。

当然，那么，您将希望索引支持这些查询。另一种方法是，在巨大的语料库上进行表格扫描，对每个文档进行动态分析以评估选择谓词，这可能会导致执行效果太差。

**检查jsonb列的约束**

坚持每个JSON文档都是一个对象的方法如下：

```
alter table books

add constraint books_doc_is_object

check (jsonb_typeof(doc) = 'object');

坚持ISBN始终是定义的，并且是一个13位正数的方法如下：

alter table books

add constraint books_isbn_is_positive_13_digit_number

check (

 (doc->'ISBN') is not null

  and

 jsonb_typeof(doc->'ISBN') = 'number'

   and

 (doc->>'ISBN')::bigint > 0

  and

 length(((doc->>'ISBN')::bigint)::text) = 13

);
```

请注意，如果键“ ISBN”完全丢失，则该表达式`doc->'ISBN'`将产生一个真正的SQL NULL。但是文档的制作者可能已经决定用键“ ISBN”的特殊JSON值null表示“没有关于本书ISBN的信息”。（请记住，此特殊值具有其自己的数据类型。）这就是为什么仅测试键“ ISBN”的产生数字（因此不能为null）是不够的，以及为什么还要进行单独的测试。jsonb\_typeof()IS NOT NULL

高层次的观点是，MemFireDB允许您使用可以通过引用单行中的值进行评估的任何表达式来表达约束。该表达式可以包含PL / pgSQL函数。这允许实施约束以坚持JSON对象中的键来自已知列表：

```
create function top_level_keys_ok(json_obj in jsonb)

 returns boolean

 language plpgsql

as

$body$

declare

 key text;

 legal_keys constant varchar(10)[] := array[

  'ISBN', 'title', 'year', 'genre', 'author', 'editors'];

begin

 for key in (

  select

  jsonb_object_keys(json_obj)

  )

 loop

  if not (key = any (legal_keys)) then

   return false;

  end if;

 end loop;

 return true;

end;

$body$;

alter table books

add constraint books_doc_keys_OK

check (top_level_keys_ok(doc));
```

**jsonb列上的索引**

正确的实践要求，当一个表具有代理主键时，它还必须具有唯一的NOT NULL业务键。该books表的明显候选者是“ ISBN”键的值。“ books\_isbn\_is\_positive\_13\_digit\_number”约束NOT NULL已强制执行该规则。唯一性以明显的方式实施：

```
create unique index books_isbn_unq

on books((doc->>'ISBN') hash);
```

您可能需要支持引用“ year”键值的范围查询，如下所示：

```
select

 (doc->>'ISBN')::bigint as year,

 doc->>'title'     as title,

 (doc->>'year')::int  as year

from books

where (doc->>'year')::int > 1850

order by 3;
```

您可能需要使用索引来支持它。而且，如果您意识到相当一部分图书的出版年份是未知的，则您可能希望利用部分索引，因此：

```
create index books_year on books ((doc->>'year') asc)

where doc->>'year' is not null;
```

## 日期类型 [*link*](#%e6%97%a5%e6%9c%9f%e7%b1%bb%e5%9e%8b)

MemFireDB支持`date`、`time`、`timestamp`、`interval`数据类型。

| **数据类型** | **存储尺寸** | **描述** | **最小值** | **最大值** | **解析度** |
| --- | --- | --- | --- | --- | --- |
| `timestamp [ (p) ] [ without time zone ]` | 8字节 | 包括日期和时间（无时区） | 4713 BC | 294276 AD | 1微秒 |
| `timestamp [ (*p*) ] with time zone` | 8字节 | 包括日期和时间，有时区 | 4713 BC | 294276 AD | 1微秒 |
| `date` | 4字节 | 日期（没有一天中的时间） | 4713 BC | 5874897 AD | 1日 |
| `time [ (*p*) ] [ without time zone ]` | 8字节 | 一天中的时间（无日期） | `00:00:00` | `24:00:00` | 1微秒 |
| `time [ (*p*) ] with time zone` | 12字节 | 仅仅是一天中的时间（没有日期），带有时区 | `00:00:00 + 1459` | `24:00:00-1459` | 1微秒 |
| `interval [ *fields* ] [ (*p*) ]` | 16字节 | 时间间隔 | -178000000年 | 178000000年 | 1微秒 |

time、timestamp和interval接受一个可选的精度值 p，这个精度值声明在秒域中小数点之后保留位数。缺省情况下，在精度上没有明确的边界。p允许的范围是从 0 到 6。

interval类型有一个附加选项，它可以通过写下面之一的短语来限制存储的fields的集合：

```
YEAR

MONTH

DAY

HOUR

MINUTE

SECOND
```

```
YEAR TO MONTH
DAY TO HOUR
DAY TO MINUTE
DAY TO SECOND
HOUR TO MINUTE
HOUR TO SECOND
MINUTE TO SECOND
```

注意如果fields和p被指定，fields必须包括SECOND，因为精度只应用于秒。

类型`time with time zone`是 SQL 标准定义的，但是该定义显示出了一些会影响可用性的性质。在大多数情况下， date、time、timestamp without time zone和timestamp with time zone的组合就应该能提供任何应用所需的全范围的日期/时间功能。

## 布尔类型 [*link*](#%e5%b8%83%e5%b0%94%e7%b1%bb%e5%9e%8b)

MemFireDB提供标准的SQL类型boolean。boolean可以有多个状态：“true（真）”、“false（假）”和第三种状态“unknown（未知）”，未知状态由SQL空值表示。

| **名字** | **存储字节** | **描述** |
| --- | --- | --- |
| boolean | 1字节 | 状态为真或假 |

“真”状态的有效文字值是：

| TRUE |
| --- |
| ’t' |
| ’true' |
| ‘y’ |
| ‘yes’ |
| ‘on’ |
| ‘1’ |

而对于“假”状态，你可以使用下面这些值：

| FALSE |
| --- |
| ‘f’ |
| ‘false’ |
| ’n' |
| ’no' |
| ‘off’ |
| ‘0’ |

使用字母t和f输出boolean值的例子

```
CREATE TABLE test1 (a boolean, b text);
INSERT INTO test1 VALUES (TRUE, 'sic est');
INSERT INTO test1 VALUES (FALSE, 'non est');
SELECT * FROM test1;
 a |    b
---+---------
 t | sic est
 f | non est

SELECT * FROM test1 WHERE a;
 a |    b
---+---------
 t | sic est

select * from test5 where a=false;
```

## 二进制类型 [*link*](#%e4%ba%8c%e8%bf%9b%e5%88%b6%e7%b1%bb%e5%9e%8b)

使用bytea数据类型表示字节的二进制字符串（八位字节）。二进制字符串允许零（0）和不可打印的字节。bytea数据类型允许存储二进制串。

**表 .二进制数据类型**

| **名字** | **存储尺寸** | **描述** |
| --- | --- | --- |
| `bytea` | 1或4字节外加真正的二进制串 | 变长二进制串 |

二进制串是一个八位位组（或字节）的序列。 二进制串和字符串的区别有两个： 首先，二进制串明确允许存储零值的字节以及其它“不可打印的”字节（通常是位于十进制范围32到126之外的节）。 字符串不允许零字节，并且也不允许那些对于数据库的选定字符集编码是非法的任何其它字节值或者字节值序列。 第二，对二进制串的操作会处理实际上的字节，而字符串的处理和取决于区域设置。 简单说，二进制字串适用于存储那些程序员认为是“裸字节”的数据，而字符串适合存储文本。

bytea类型支持两种用于输入和输出的格式：“十六进制”格式和PostgreSQL的历史的“转义”格式。在输入时这两种格式总是会被接受。输出格式则取决于配置参数bytea\_output，其默认值为十六进制。  
SQL标准定义了一种不同的二进制串类型， 叫做BLOB或者BINARY LARGE OBJECT。其输入格式和bytea不同，但是提供的函数和操作符大多一样。

**bytea的十六进制格式**

“十六进制”格式将二进制数据编码为每个字节2个十六进制位，最高有效位在前。整个串以序列\x开头（用以和转义格式区分）。在某些情景中，开头的反斜线可能需要通过双写来转义。 作为输入，十六进制位可以是大写也可以是小写，在位对之间可以有空白（但是在位对内部以及开头的\x序列中不能有空白）。十六进制格式和很多外部应用及协议相兼容，并且其转换速度要比转义格式更快，因此人们更愿意用它。

例子：

```
SELECT '\xDEADBEEF';
```

**bytea的转义格式**

“转义”格式是bytea类型的传统格式。它采用将二进制串表示成ASCII字符序列的方法，而将那些无法用ASCII字符表示的字节转换成特殊的转义语句。从应用的角度来看，如果将字节表示为字符有意义，那么这种表示将很方便。但是在实际中，这常常是令人困扰的，因为它使二进制串和字符串之间的区别变得模糊，并且这种特别的转义机制也有点难于处理。因此这种格式可能会在大部分新应用中避免使用。

在转义模式下输入bytea值时，某些值的字节必须被转义，而所有的字节值都可以被转义。通常，要转义一个字节，需要把它转换成与它的三位八进制值， 并且前导一个反斜线。反斜线本身（十进制字节值92）也可以用双写的反斜线表示。表显示了必须被转义的字符，并给出了可以使用的替代转义序列。

**表bytea文字转义字节**

| **十进制字节值** | **描述** | **转义输入表示** | **例子** | **十六进制表示** |
| --- | --- | --- | --- | --- |
| 0 | 0字节 | `'\000'` | `SELECT '\000'::bytea;` | `\x00` |
| 39 | 单引号 | `''''`或`'\047'` | `SELECT ''''::bytea;` | `\x27` |
| 92 | 反斜线 | `'\\'`或`'\134'` | `SELECT '\\'::bytea;` | `\x5c` |
| 0到31和127到255 | “不可打印的”字节 | `'\*xxx'*`（八进制值） | `SELECT '\001'::bytea;` | `\x01` |

转义“不可打印的”字节的要求取决于区域设置。在某些实例中，你可以不理睬它们，让它们保持未转义的状态。

如表中所示，要求单引号必须写两次的原因对任何SQL命令中的字符串常量都是一样的。 文字解析器消耗最外层的单引号，并缩减成对的单引号为一个普通数据字符。 bytea输入函数看到的只是一个单引号，它将其视为普通数据字符。

在某些情况下，反斜杠必须加倍，如上所示，因为通用的字符串文字解析器也会 将一对反斜杠减少为一个数据字符。

Bytea字节默认被输出为hex格式。如果你把bytea\_output改为escape，“不可打印的”字节会被转换成与之等效的三位八进制值并且前置一个反斜线。大部分“可打印的”字节被输出为它们在客户端字符集中的标准表示形式，例如：

```
SET bytea_output = 'escape';

SELECT 'abc \153\154\155 \052\251\124'::bytea;
     bytea
----------------
 abc klm *\251T
```

十进制值为92（反斜线）的字节在输出时被双写。

**表 bytea输出转义字节**

| **十进制字节值** | **描述** | **转义的输出表示** | **例子** | **输出结果** |
| --- | --- | --- | --- | --- |
| 92 | 反斜线 | `\\` | `SELECT '\134'::bytea;` | `\\` |
| 0到31和127到255 | “不可打印的”字节 | `\*xxx*`（八进制值） | `SELECT '\001'::bytea;` | `\001` |
| 32到126 | “可打印的”字节 | 客户端字符集表示 | `SELECT '\176'::bytea;` | `~` |

根据你使用的MemFireDB前端，你在转义和未转义bytea串方面可能需要做额外的工作。例如，如果你的接口自动翻译换行和回车，你可能也不得不转义它们。

## UUID数据类型 [*link*](#uuid%e6%95%b0%e6%8d%ae%e7%b1%bb%e5%9e%8b)

UUID数据类型表示通用唯一标识符（UUID）。数据类型uuid存储由RFC 4122、ISO/IEC 9834-8:2005以及相关标准定义的通用唯一标识符（UUID）（某些系统将这种数据类型引用为全局唯一标识符GUID）。这种标识符是一个128位的量，它由一个精心选择的算法产生，该算法能保证在已知空间中任何其他使用相同算法的人能够产生同一个标识符的可能性非常非常小。因此，对于分布式系统，这些标识符相比序列生成器而言提供了一种很好的唯一性保障，序列生成器只能在一个数据库中保证唯一。

UUID是由32个十六进制数字组成的序列，由128个连字符分隔（8位-4位-4位-4位-12位）。一个标准形式的UUID类似于：

```
ffffffff-ffff-ffff-ffff-ffffffffffff
{aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa}
12341234-1234-1234-1234-123412341234
```

同时支持使用大写位、标准格式被花括号包围、忽略某些或者全部连字符、在任意4位组后面增加一个连字符。

## 货币类型 [*link*](#%e8%b4%a7%e5%b8%81%e7%b1%bb%e5%9e%8b)

money类型存储固定小数精度的货币数字，可接受的输入格式很多，包括整数和浮点数文字，以及常用的货币格式，如’$1,000.00’。 输出通常是最后一种形式，但和区域相关。

**货币类型**

| 名字 | 存储尺寸 | 描述 | 范围 |
| --- | --- | --- | --- |
| money | 8 bytes | 货币额 | -92233720368547758.08到+92233720368547758.07 |

由于这种数据类型的输出是区域敏感的，因此将money数据装入到一个具有不同lc\_monetary设置的数据库是不起作用的。为了避免这种问题，在恢复一个转储到一个新数据库中之前，应确保新数据库的lc\_monetary设置和被转储数据库的相同或者具有等效值。

数据类型numeric、int和bigint的值可以被造型成money。从数据类型real和double precision的转换可以通过先造型成numeric来实现，例如：

```
SELECT '12.34'::float8::numeric::money;
```

但是，我们不推荐这样做。浮点数不应该被用来处理货币，因为浮点数可能会有圆整错误。

一个money值可以在不损失精度的情况下被造型成numeric。转换到其他类型可能会丢失精度，并且必须采用两个阶段完成：

```
SELECT '52093.89'::money::numeric::float8;
```

一个money值被一个整数值除的除法结果会被截去分数部分。要得到圆整的结果，可以除以一个浮点值，或者在除法之前把money转换成numeric然后在除法之后转回money（如果要避免精度丢失的风险则后者更好）。当一个money值被另一个money值除时，结果是double precision（即一个纯数字，而不是金额），在除法中货币单位被约掉了。

## 数组 [*link*](#%e6%95%b0%e7%bb%84)

MemFireDB允许一个表中的列定义为变长多维数组。可以创建任何内建或用户定义的基类、枚举类型、组合类型或者域的数组。

### 数组类型的定义 [*link*](#%e6%95%b0%e7%bb%84%e7%b1%bb%e5%9e%8b%e7%9a%84%e5%ae%9a%e4%b9%89)

为了展示数组类型的使用，我们创建这样一个表：

```
CREATE TABLE sal_emp (
    name            text,
    pay_by_quarter  integer[],
    schedule        text[][]
);
```

如上所示，一个数组数据类型可以通过在数组元素的数据类型名称后面加上方括号（[]）来命名。上述命令将创建一个名为sal\_emp的表，它有一个类型为text的列（name），一个表示雇员的季度工资的一维integer类型数组（pay\_by\_quarter），以及一个表示雇员每周日程表的二维text类型数组（schedule）。

CREATE TABLE的语法允许指定数组的确切大小，例如：

```
CREATE TABLE tictactoe (
    squares   integer[3][3]
);
```

然而，当前的实现忽略任何提供的数组尺寸限制，即其行为与未指定长度的数组相同。

当前的实现也不会强制所声明的维度数。一个特定元素类型的数组全部被当作是相同的类型，而不论其尺寸或维度数。因此，在CREATE TABLE中声明数组的尺寸或维度数仅仅只是文档而已，它并不影响运行时的行为。

另一种符合SQL标准的语法是使用关键词ARRAY，可以用来定义一维数组。pay\_by\_quarter可以这样定义：

```
pay_by_quarter  integer ARRAY[4],
```

或者，不指定数组尺寸：

```
pay_by_quarter  integer ARRAY,
```

但是和前面一样，在任何情况下都不会强制尺寸限制。

### 数组值输入 [*link*](#%e6%95%b0%e7%bb%84%e5%80%bc%e8%be%93%e5%85%a5)

要把一个数组值写成一个文字常数，将元素值用花括号包围并用逗号分隔（如果你懂C，这和初始化结构的C语法没什么两样）。在任意元素值周围可以使用双引号，并且在元素值包含逗号或花括号时必须这样做（更多细节如下所示）。因此，一个数组常量的一般格式如下：

```
'{ val1 delim val2 delim ... }'
```

这里delim是类型的定界符，记录在类型的pg\_type项中。每个val可以是数组元素类型的一个常量，也可以是一个子数组。一个数组常量的例子是：

```
'{{1,2,3},{4,5,6},{7,8,9}}'
```

该常量是一个二维的，3乘3数组，它由3个整数子数组构成。

要设置一个数组常量的一个元素为NULL，在该元素值处写NULL（任何NULL的大写或小写变体都有效）。如果你需要一个真正的字符串值“NULL”，你必须在它两边放上双引号。

现在我们可以展示一些INSERT语句：

```
INSERT INTO sal_emp
    VALUES ('Bill',
    '{10000, 10000, 10000, 10000}',
    '{{"meeting", "lunch"}, {"training", "presentation"}}');

INSERT INTO sal_emp
    VALUES ('Carol',
    '{20000, 25000, 25000, 25000}',
    '{{"breakfast", "consulting"}, {"meeting", "lunch"}}');
```

前两个插入的结果看起来像这样：

```
SELECT * FROM sal_emp;
 name  |      pay_by_quarter       |                 schedule
-------+---------------------------+-------------------------------------------
 Bill  | {10000,10000,10000,10000} | {{meeting,lunch},{training,presentation}}
 Carol | {20000,25000,25000,25000} | {{breakfast,consulting},{meeting,lunch}}
(2 rows)
```

多维数组的每一维都必须有相匹配的长度。不匹配会造成错误，例如：

```
INSERT INTO sal_emp
    VALUES ('Bill',
    '{10000, 10000, 10000, 10000}',
    '{{"meeting", "lunch"}, {"meeting"}}');
ERROR:  multidimensional arrays must have array expressions with matching dimensions
```

ARRAY构造器语法也可以被用于：

```
INSERT INTO sal_emp
    VALUES ('Bill',
    ARRAY[10000, 10000, 10000, 10000],
    ARRAY[['meeting', 'lunch'], ['training', 'presentation']]);

INSERT INTO sal_emp
    VALUES ('Carol',
    ARRAY[20000, 25000, 25000, 25000],
    ARRAY[['breakfast', 'consulting'], ['meeting', 'lunch']]);
```

注意数组元素是普通SQL常数或表达式，例如，字符串文字使用单引号而不是双引号包围，因为双引号可以出现在一个数组文字中。

### 访问数组 [*link*](#%e8%ae%bf%e9%97%ae%e6%95%b0%e7%bb%84)

现在，我们可以在该表上运行一些查询。首先，我们展示如何访问一个数组中的一个元素。下面的查询检索在第二季度工资发生变化的雇员的名字：

```
SELECT name FROM sal_emp WHERE pay_by_quarter[1] <> pay_by_quarter[2];

 name
-------
 Carol
(1 row)
```

数组下标写在方括号内。默认情况下，MemFiresDB为数组使用了一种从1开始的编号习惯，即一个具有n个元素的数组从array[1]开始，结束于array[n]。

下面的查询检索所有员工第三季度的工资：

```
SELECT pay_by_quarter[3] FROM sal_emp;

 pay_by_quarter
----------------
          10000
          25000
(2 rows)
```

我们也可以访问一个数组的任意矩形切片或者子数组。一个数组切片可以通过在一个或多个数组维度上指定下界:上界来定义例如，下面的查询检索Bill在本周头两天日程中的第一项：

```
SELECT schedule[1:2][1:1] FROM sal_emp WHERE name = 'Bill';

        schedule
------------------------
 {{meeting},{training}}
(1 row)
```

如果任何维度被写成一个切片，即包含一个冒号，那么所有的维度都被看成是切片对待。其中任何只有一个数字（无冒号）的维度被视作是从1到指定的数字。例如，下面例子中的[2]被认为是[1:2]：

```
SELECT schedule[1:2][2] FROM sal_emp WHERE name = 'Bill';

                 schedule
-------------------------------------------
 {{meeting,lunch},{training,presentation}}
(1 row)
```

为了避免和非切片情况搞混，最好在所有的维度上都使用切片语法，例如[1:2][1:1]而不是[2][1:1]。

可以省略一个切片说明符的lower-bound或者 upper-bound（亦可两者都省略），缺失的 边界会被数组下标的上下限所替代。例如：

```
SELECT schedule[:2][2:] FROM sal_emp WHERE name = 'Bill';

        schedule
------------------------
 {{lunch},{presentation}}
(1 row)

SELECT schedule[:][1:1] FROM sal_emp WHERE name = 'Bill';

        schedule
------------------------
 {{meeting},{training}}
(1 row)
```

如果数组本身为空或者任何一个下标表达式为空，访问数组下标表达式将会返回空值。如果下标超过了数组边界，下标表达式也会返回空值（这种情况不会抛出错误）。例如，如果schedule目前具有的维度是[1:3][1:2]，那么引用schedule[3][3]将得到NULL。相似地，使用错误的下标号引用一个数组会得到空值而不是错误。

如果数组本身或者任何一个下标表达式为空，则一个数组切片表达式也会得到空值。但是，在其他情况例如选择一个完全位于当前数组边界之外的切片时，一个切片表达式会得到一个空（零维）数组而不是空值（由于历史原因，这并不符合非切片行为）。 如果所请求的切片和数组边界重叠，那么它会被缩减为重叠的区域而不是返回空。

任何数组值的当前维度可以使用array\_dims函数获得：

```
SELECT array_dims(schedule) FROM sal_emp WHERE name = 'Carol';

 array_dims
------------
 [1:2][1:2]
(1 row)
```

array\_dims产生一个text结果，它便于人类阅读但是不便于程序读取。 Dimensions can also be retrieved with 也可以通过array\_upper和array\_lower来获得维度，它们将分别返回一个指定数组的上界和下界：

```
SELECT array_upper(schedule, 1) FROM sal_emp WHERE name = 'Carol';

 array_upper
-------------
           2
(1 row)
```

array\_length将返回一个指定数组维度的长度：

```
SELECT array_length(schedule, 1) FROM sal_emp WHERE name = 'Carol';

 array_length
--------------
            2
(1 row)
```

cardinality返回一个数组中在所有维度上的元素总数。 这实际上是调用unnest将会得到的行数：

```
SELECT cardinality(schedule) FROM sal_emp WHERE name = 'Carol';

 cardinality
-------------
           4
(1 row)
```

### 修改数组 [*link*](#%e4%bf%ae%e6%94%b9%e6%95%b0%e7%bb%84)

一个数组值可以被整个替换：

```
UPDATE sal_emp SET pay_by_quarter = '{25000,25000,27000,27000}'
  WHERE name = 'Carol';
```

或者使用ARRAY表达式语法：

```
UPDATE sal_emp SET pay_by_quarter = ARRAY[25000,25000,27000,27000]
  WHERE name = 'Carol';
```

一个数组也可以在一个元素上被更新：

```
UPDATE sal_emp SET pay_by_quarter[4] = 15000
  WHERE name = 'Bill';
```

或者在一个切片上被更新：

```
UPDATE sal_emp SET pay_by_quarter[1:2] = '{27000,27000}'
  WHERE name = 'Carol';
```

也可以使用省略lower-bound或者 upper-bound的切片语法，但是只能用于 更新一个不是 NULL 或者零维的数组值（否则无法替换现有的下标界线）。

一个已存储的数组值可以被通过为其还不存在的元素赋值来扩大之。任何位于之前已存在的元素和新元素之间的位置都将被空值填充。例如，如果数组myarray目前有4个元素，在用一个更新对myarray[6]赋值后它将有6个元素，其中myarray[5]为空值。目前，采用这种方式扩大数组只允许使用在一维数组上。

带下标的赋值方式允许创建下标不是从1开始的数组。例如，我们可以为myarray[-2:7]赋值来创建一个下标值从-2到7的数组。

新的数组值也可以通过串接操作符||构建：

```
SELECT ARRAY[1,2] || ARRAY[3,4];
 ?column?
-----------
 {1,2,3,4}
(1 row)

SELECT ARRAY[5,6] || ARRAY[[1,2],[3,4]];
      ?column?
---------------------
 {{5,6},{1,2},{3,4}}
(1 row)
```

串接操作符允许把一个单独的元素加入到一个一维数组的开头或末尾。它也能接受两个N维数组，或者一个N维数组和一个N+1维数组。

当一个单独的元素被加入到一个一维数组的开头或末尾时，其结果是一个和数组操作数具有相同下界下标的新数组。例如：

```
SELECT array_dims(1 || '[0:1]={2,3}'::int[]);
 array_dims
------------
 [0:2]
(1 row)

SELECT array_dims(ARRAY[1,2] || 3);
 array_dims
------------
 [1:3]
(1 row)
```

当两个具有相同维度数的数组被串接时，其结果保留左操作数的外维度的下界下标。结果将是一个数组，它由左操作数的每一个元素以及紧接着的右操作数的每一个元素。例如：

```
SELECT array_dims(ARRAY[1,2] || ARRAY[3,4,5]);
 array_dims
------------
 [1:5]
(1 row)

SELECT array_dims(ARRAY[[1,2],[3,4]] || ARRAY[[5,6],[7,8],[9,0]]);
 array_dims
------------
 [1:5][1:2]
(1 row)
```

当一个N维数组被放在另一个N+1维数组的前面或者后面时，结果和上面的例子相似。每一个N维子数组实际上是N+1维数组外维度的一个元素。例如：

```
SELECT array_dims(ARRAY[1,2] || ARRAY[[3,4],[5,6]]);
 array_dims
------------
 [1:3][1:2]
(1 row)
```

一个数组也可以通过使用函数array\_prepend、array\_append或array\_cat构建。前两个函数仅支持一维数组，但array\_cat支持多维数组。 一些例子：

```
SELECT array_prepend(1, ARRAY[2,3]);
 array_prepend
---------------
 {1,2,3}
(1 row)

SELECT array_append(ARRAY[1,2], 3);
 array_append
--------------
 {1,2,3}
(1 row)

SELECT array_cat(ARRAY[1,2], ARRAY[3,4]);
 array_cat
-----------
 {1,2,3,4}
(1 row)

SELECT array_cat(ARRAY[[1,2],[3,4]], ARRAY[5,6]);
      array_cat
---------------------
 {{1,2},{3,4},{5,6}}
(1 row)

SELECT array_cat(ARRAY[5,6], ARRAY[[1,2],[3,4]]);
      array_cat
---------------------
 {{5,6},{1,2},{3,4}}
```

在简单的情况中，上面讨论的串接操作符比直接使用这些函数更好。不过，由于 串接操作符需要服务于所有三种情况，所以它的负担比较重，在有些情况下使用 这些函数之一有助于避免混淆。例如：

```
SELECT ARRAY[1, 2] || '{3, 4}';  -- 没有指定类型的文字被当做一个数组
 ?column?
-----------
 {1,2,3,4}

SELECT ARRAY[1, 2] || '7';                 -- 这个也是
ERROR:  malformed array literal: "7"

SELECT ARRAY[1, 2] || NULL;                -- 未修饰的 NULL 也是如此
 ?column?
----------
 {1,2}
(1 row)

SELECT array_append(ARRAY[1, 2], NULL);    -- 这可能才是想要的意思
 array_append
--------------
 {1,2,NULL}
```

在上面的例子中，解析器看到在串接操作符的一遍看到了一个整数数组，并且在 另一边看到了一个未确定类型的常量。它用来决定该常量类型的启发式规则是假 定它和该操作符的另一个输入具有相同的类型 — 在这种情况中是整数数 组。因此串接操作符表示array\_cat而不是 array\_append。如果这样做是错误的选择，它可以通过将该常 量造型成数组的元素类型来修复。但是显式地使用array\_append 可能是一种最好的方案。

### 在数组中搜索 [*link*](#%e5%9c%a8%e6%95%b0%e7%bb%84%e4%b8%ad%e6%90%9c%e7%b4%a2)

要在一个数组中搜索一个值，每一个值都必须被检查。这可以手动完成，但是我们必须知道数组的尺寸。例如：

```
SELECT * FROM sal_emp WHERE pay_by_quarter[1] = 10000 OR
                          pay_by_quarter[2] = 10000 OR
                          pay_by_quarter[3] = 10000 OR
                          pay_by_quarter[4] = 10000;
```

但是这对于大型数组来说太过冗长，且在数组尺寸未知时无法使用。上面的查询可以被替换为：

```
SELECT * FROM sal_emp WHERE 10000 = ANY (pay_by_quarter);
```

此外，我们还可以查找所有元素值都为10000的数组所在的行：

```
SELECT * FROM sal_emp WHERE 10000 = ALL (pay_by_quarter);
```

另外，generate\_subscripts函数也可以用来完成类似的查找。例如：

```
SELECT * FROM
  (SELECT pay_by_quarter,
          generate_subscripts(pay_by_quarter, 1) AS s
     FROM sal_emp) AS foo
WHERE pay_by_quarter[s] = 10000;
```

我们也可以使用&&操作符来搜索一个数组，它会检查左操作数是否与右操作数重叠。例如：

```
SELECT * FROM sal_emp WHERE pay_by_quarter && ARRAY[10000];
```

你也可以使用array\_position和array\_positions在一个 数组中搜索特定值。前者返回值在数组中第一次出现的位置的下标。后者返回一个数组， 其中有该值在数组中的所有出现位置的下标。例如：

```
SELECT array_position(ARRAY['sun','mon','tue','wed','thu','fri','sat'], 'mon');
 array_positions
-----------------
 2

SELECT array_positions(ARRAY[1, 4, 3, 1, 3, 4, 2, 1], 1);
 array_positions
-----------------
 {1,4,8}
```

### 数组输入和输出语法 [*link*](#%e6%95%b0%e7%bb%84%e8%be%93%e5%85%a5%e5%92%8c%e8%be%93%e5%87%ba%e8%af%ad%e6%b3%95)

一个数组值的外部文本表现由根据数组元素类型的I/O转换规则解释的项构成，并在其上加上修饰用于指示数组结构。修饰包括数组值周围的花括号（{和}）以及相邻项之间的定界字符。定界字符通常是一个逗号（,），但是也可能是别的：它由数组元素类型的typdelim设置决定。除了box类型使用分号（;）之外，其他都是用逗号。在一个多维数组中，每一个维度（行、平面、方体等）都有其自己的花括号层次，且同层的被花括号限定的相邻实体之间也必须有定界符。

如果元素值是空字符串、包含花括号、包含定界字符、包含双引号、包含反斜线、包含空白或者匹配词NULL，数组输出例程将在元素值周围放上双引号。嵌在元素值中的双引号以及反斜线将被反斜线转义。对于数字数据类型可以安全地假设双引号绝不会出现，但是对于文本数据类型我们必须准备好处理可能出现亦可能不出现的引号。

默认情况下，一个数组的一个维度的下界索引值被设置为1。要表示具有其他下界的数组，数组下标的范围应在填充数组内容之前被显式地指定好。这种修饰包括在每个数组维度上下界周围的方括号（[]），以及上下界之间的一个冒号（:）定界符。数组维度修饰后面要跟一个等号（=）。例如：

```
SELECT f1[1][-2][3] AS e1, f1[1][-1][5] AS e2
 FROM (SELECT '[1:1][-2:-1][3:5]={{{1,2,3},{4,5,6}}}'::int[] AS f1) AS ss;

 e1 | e2
----+----
  1 |  6
(1 row)
```

只有当数组的维度中有一个或多个的下界不为1时，数组输出例程才会在结果中包括维度。

如果为一个元素给定的值是NULL（或者是任何变体），该元素将被设置为NULL。任何引号或反斜线的存在将阻止这种行为，而允许为元素值输入“NULL”的字面意思。

如前所示，在写一个数组值时我们可以在任何单独数组元素周围使用引号。如果元素值可能混淆数组值分析器时，我们必须 这样做。例如，包含花括号、逗号（或者数据类型的定界符）、双引号、反斜线或首尾有空白的元素必须使用双引号。空字符串和匹配单词NULL的字符串也必须使用双引号。要把一个双引号或反斜线放在一个使用了双引号的数组元素值中，需要在它前面放一个反斜线。作为一种选择，我们可以免去使用引号而使用反斜线转义的方式来保护可能被认为是数组语法的所有数据字符。

我们可以在左括号前面或右括号后面增加空白。我们也可以在任何单独的项之前或之后加上空白。在所有这些情况中空白将被忽略。但是，在被使用了双引号的元素中的空白以及周围有其他非空白字符的空白不会被忽略。

## 几何类型 [*link*](#%e5%87%a0%e4%bd%95%e7%b1%bb%e5%9e%8b)

几何数据类型表示二维的空间物体。下表展示了MemFireDB中可以用的几何类型。

**表几何类型**

| 名字 | 存储尺寸 | 表示 | 描述 |
| --- | --- | --- | --- |
| point | 16字节 | 平面上的点 | (x,y) |
| line | 32字节 | 无限长的线 | {A,B,C} |
| lseg | 32字节 | 有限线段 | ((x1,y1),(x2,y2)) |
| box | 32字节 | 矩形框 | ((x1,y1),(x2,y2)) |
| path | 16+16n字节 | 封闭路径（类似于多边形） | ((x1,y1),…) |
| path | 16+16n字节 | 开放路径 | [(x1,y1),…] |
| polygon | 40+16n字节 | 多边形（类似于封闭路径） | ((x1,y1),…) |
| circle | 24字节 | 圆 | <(x,y),r>（中心点和半径） |

我们有一系列丰富的函数和操作符可用来进行各种几何操作， 如缩放、平移、旋转和计算相交等。

### 点 [*link*](#%e7%82%b9)

点是几何类型的基本二维构造块。用下面的语法描述point类型的值：

```
( x , y )
x , y
```

其中x和y分别是坐标，都是浮点数。

点使用第一种语法输出。

### 线 [*link*](#%e7%ba%bf)

线由线性方程Ax + By + C = 0 表示，其中A和B都不为零。类型line 的值采用以下形式输入和输出：

```
{ A, B, C }
```

另外，还可以用下列任一形式输入：

```
[ ( x1 , y1 ) , ( x2 , y2 ) ]
( ( x1 , y1 ) , ( x2 , y2 ) )
  ( x1 , y1 ) , ( x2 , y2 )
    x1 , y1   ,   x2 , y2
```

其中 (x1,y1) 和 (x2,y2) 是线上不同的两点。

### 线段 [*link*](#%e7%ba%bf%e6%ae%b5)

线段用一对线段的端点来表示。lseg类型的值用下面的语法声明：

```
[ ( x1 , y1 ) , ( x2 , y2 ) ]
( ( x1 , y1 ) , ( x2 , y2 ) )
  ( x1 , y1 ) , ( x2 , y2 )
    x1 , y1   ,   x2 , y2
```

其中(x1,y1) 和 (x2,y2) 是线段的端点。

线段使用第一种语法输出。

### 方框 [*link*](#%e6%96%b9%e6%a1%86)

方框用其对角的点对表示。box类型的值使用下面的语法指定：

```
( ( x1 , y1 ) , ( x2 , y2 ) )
( x1 , y1 ) , ( x2 , y2 )
  x1 , y1   ,   x2 , y2
```

其中(x1,y1) 和 (x2,y2) 是方框的对角点。

方框使用第二种语法输出。

在输入时可以提供任意两个对角，但是值将根据需要被按顺序记录为右上角和左下角。

### 路径 [*link*](#%e8%b7%af%e5%be%84)

路径由一系列连接的点组成。路径可能是开放的，也就是认为列表中第一个点和最后一个点没有被连接起来；也可能是封闭的，这时认为第一个和最后一个点被连接起来。

path类型的值用下面的语法声明：

```
[ ( x1 , y1 ) , ... , ( xn , yn ) ]
( ( x1 , y1 ) , ... , ( xn , yn ) )
  ( x1 , y1 ) , ... , ( xn , yn )
  ( x1 , y1   , ... ,   xn , yn )
    x1 , y1   , ... ,   xn , yn
```

其中的点是组成路径的线段的端点。方括弧（[]）表示一个开放的路径，圆括弧（()）表示一个封闭的路径。如第三种到第五种语法所示，当最外面的圆括号被忽略时，路径将被假定为封闭。

路径的输出使用第一种或第二种语法。

### 多边形 [*link*](#%e5%a4%9a%e8%be%b9%e5%bd%a2)

多边形由一系列点代表（多边形的顶点）。多边形和封闭路径很像，但是存储方式不一样而且有自己的一套支持例程。

polygon类型的值用下列语法声明：

```
( ( x1 , y1 ) , ... , ( xn , yn ) )
( x1 , y1 ) , ... , ( xn , yn )
( x1 , y1   , ... ,   xn , yn )
  x1 , y1   , ... ,   xn , yn
```

其中的点是组成多边形边界的线段的端点。

多边形的输出使用第一种语法。

### 圆 [*link*](#%e5%9c%86)

圆由一个圆心和一个半径代表。circle类型的值用下面的语法指定：

```
< ( x , y ) , r >
( ( x , y ) , r )
  ( x , y ) , r
    x , y   , r
```

其中(x,y)是圆心，而r是圆的半径。

圆的输出用第一种语法。

## 网络地址类型 [*link*](#%e7%bd%91%e7%bb%9c%e5%9c%b0%e5%9d%80%e7%b1%bb%e5%9e%8b)

MemFireDB提供用于存储 IPv4、IPv6 和 MAC 地址的数据类型。 用这些数据类型存储网络地址比用纯文本类型好，因为这些类型提供输入错误检查以及特殊的操作符和函数（见第 9.12 节）

**表 网络地址类型**

| 名字 | 存储尺寸 | 描述 |
| --- | --- | --- |
| cidr | 7或19字节 | IPv4和IPv6网络 |
| inet | 7或19字节 | IPv4和IPv6主机以及网络 |
| macaddr | 6字节 | MAC地址 |
| macaddr8 | 8 bytes | MAC地址（EUI-64格式） |

在对inet或者cidr数据类型进行排序的时候， IPv4 地址将总是排在 IPv6 地址前面，包括那些封装或者是映射在 IPv6 地址里 的 IPv4 地址，例如 `::10.2.3.4` 或者 `::ffff::10.4.3.2`。

### inet [*link*](#inet)

inet在一个数据域里保存一个 IPv4 或 IPv6 主机地址，以及一个可选的它的子网。 子网由主机地址中表示的网络地址位数表示（“网络掩码”）。 如果网络掩码为 32 并且地址是 IPv4 ，那么该值不表示任何子网，只是一台主机。在 IPv6 中地址长度是 128 位，因此 128 位指定一个唯一的主机地址。 请注意如果你想只接受网络地址，你应该使用cidr类型而不是inet。

该类型的输入格式是地址/y，其中地址是一个 IPv4 或者 IPv6 地址，y是网络掩码的位数。如果/y部分缺失， 则网络掩码对 IPv4 而言是 32，对 IPv6 而言是 128，所以该值表示只有一台主机。在显示时，如果/y部分指定一个单台主机，它将不会被显示出来。

### cidr [*link*](#cidr)

cidr类型保存一个 IPv4 或 IPv6 网络地址声明。其输入和输出遵循无类的互联网域路由（Classless Internet Domain Routing）习惯。声明一个网络的格式是地址/y，其中address是 IPv4 或 IPv6 网络地址而y是网络掩码的位数。如果省略y， 那么掩码部分用旧的有类的网络编号系统进行计算，否则它将至少大到足以包括写在输入中的所有字节。声明一个在其指定的掩码右边置了位的网络地址会导致错误。

**表 cidr类型输入例子**

| cidr输入 | cidr输出 | abbrev(cidr) |
| --- | --- | --- |
| 192.168.100.128/25 | 192.168.100.128/25 | 192.168.100.128/25 |
| 192.168/24 | 192.168.0.0/24 | 192.168.0/24 |
| 192.168/25 | 192.168.0.0/25 | 192.168.0.0/25 |
| 192.168.1 | 192.168.1.0/24 | 192.168.1/24 |
| 192.168 | 192.168.0.0/24 | 192.168.0/24 |
| 128.1 | 128.1.0.0/16 | 128.1/16 |
| 128 | 128.0.0.0/16 | 128.0/16 |
| 128.1.2 | 128.1.2.0/24 | 128.1.2/24 |
| 10.1.2 | 10.1.2.0/24 | 10.1.2/24 |
| 10.1 | 10.1.0.0/16 | 10.1/16 |
| 10 | 10.0.0.0/8 | 10/8 |
| 10.1.2.3/32 | 10.1.2.3/32 | 10.1.2.3/32 |
| `2001:4f8:3:ba::/64` | `2001:4f8:3:ba::/64` | `2001:4f8:3:ba::/64` |
| `2001:4f8:3:ba:2e0:81ff:fe22:d1f1/128` | `2001:4f8:3:ba:2e0:81ff:fe22:d1f1/128` | `2001:4f8:3:ba:2e0:81ff:fe22:d1f1` |
| `::ffff:1.2.3.0/120` | `::ffff:1.2.3.0/120` | `::ffff:1.2.3/120` |
| `::ffff:1.2.3.0/128` | `::ffff:1.2.3.0/128` | `::ffff:1.2.3.0/128` |

### inet vs. cidr [*link*](#inet-vs-cidr)

inet和cidr类型之间的本质区别是inet接受右边有非零位的网络掩码， 而cidr不接受。例如，192.168.0.1/24对inet是有效的，但对cidr是无效的。

### macaddr [*link*](#macaddr)

macaddr类型存储 MAC 地址，也就是以太网卡硬件地址 （尽管 MAC 地址还用于其它用途）。可以接受下列格式的输入：

| `'08:00:2b:01:02:03'` |
| --- |
| ‘08-00-2b-01-02-03’ |
| ‘08002b:010203’ |
| ‘08002b-010203’ |
| ‘0800.2b01.0203’ |
| ‘0800-2b01-0203’ |
| ‘08002b010203’ |

这些例子指定的都是同一个地址。对于位a到f，大小写都可以接受。输出总是使用展示的第一种形式。

IEEE Std 802-2001 指定第二种展示的形式（带有连字符）作为MAC地址的标准形式，并且指定第一种形式（带有分号）作为位翻转的记号，因此 `08-00-2b-01-02-03 = 01:00:4D:08:04:0C`。这种习惯目前已经被广泛地忽略，并且它只与废弃的网络协议（如令牌环）相关。

剩下的五种输入格式不属于任何标准。

### macaddr8 [*link*](#macaddr8)

macaddr8类型以EUI-64格式存储MAC地址，例如以太网卡的硬件地址（尽管MAC地址也被用于其他目的）。这种类型可以接受6字节和8字节长度的MAC地址，并且将它们存储为8字节长度的格式。以6字节格式给出的MAC地址被存储为8字节长度格式的方式是吧第4和第5字节分别设置为FF和FE。 注意IPv6使用一种修改过的EUI-64格式，其中从EUI-48转换过来后的第7位应该被设置为一。函数macaddr8\_set7bit被用来做这种修改。 一般而言，任何由16进制数（字节边界上）对构成的输入（可以由’:’、’-‘或者’.‘统一地分隔）都会被接受。16进制数的数量必须是16（8字节）或者12（6字节）。前导和拖尾的空格会被忽略。 下面是可以被接受的输入格式的例子：

| `'08:00:2b:01:02:03:04:05'` |
| --- |
| ‘08-00-2b-01-02-03-04-05’ |
| ‘08002b:0102030405’ |
| ‘08002b-0102030405’ |
| ‘0800.2b01.0203.0405’ |
| ‘0800-2b01-0203-0405’ |
| ‘08002b01:02030405’ |
| ‘08002b0102030405’ |

这些例子都指定相同的地址。数字a到f的大小写形式都被接受。输出总是以上面显示的第一种形式。 上述的后六种输入格式不属于任何标准。 要把EUI-48格式的传统48位MAC地址转换成修改版EUI-64格式（包括在IPv6地址中作为主机部分），可以使用下面的macaddr8\_set7bit：

```
SELECT macaddr8_set7bit('08:00:2b:01:02:03');

    macaddr8_set7bit
-------------------------
 0a:00:2b:ff:fe:01:02:03
(1 row)
```

## 文本检索类型 [*link*](#%e6%96%87%e6%9c%ac%e6%a3%80%e7%b4%a2%e7%b1%bb%e5%9e%8b)

MemFireDB提供两种数据类型，它们被设计用来支持全文搜索，全文搜索是一种在自然语言的文档集合中搜索以定位那些最匹配一个查询的文档的活动。tsvector类型表示一个为文本搜索优化的形式下的文档，tsquery类型表示一个文本查询。

### tsvector [*link*](#tsvector)

一个tsvector值是一个排序的可区分词位的列表，词位是被正规化合并了同一个词的不同变种的词。排序和去重是在输入期间自动完成的，如下例所示：

```
SELECT 'a fat cat sat on a mat and ate a fat rat'::tsvector;
                      tsvector
----------------------------------------------------
 'a' 'and' 'ate' 'cat' 'fat' 'mat' 'on' 'rat' 'sat'
```

要表示包含空白或标点的词位，将它们用引号包围：

```
SELECT $$the lexeme '    ' contains spaces$$::tsvector;
                 tsvector
-------------------------------------------
 '    ' 'contains' 'lexeme' 'spaces' 'the'
```

（我们在这个例子中使用美元符号包围的串文字并且下一个用来避免在文字中包含双引号记号产生的混淆）。嵌入的引号和反斜线必须被双写：

```
SELECT $$the lexeme 'Joe''s' contains a quote$$::tsvector;
                    tsvector
------------------------------------------------
 'Joe''s' 'a' 'contains' 'lexeme' 'quote' 'the'
```

可选的，整数位置可以被附加给词位：

```
SELECT 'a:1 fat:2 cat:3 sat:4 on:5 a:6 mat:7 and:8 ate:9 a:10 fat:11 rat:12'::tsvector;
                                  tsvector
-------------------------------------------------------------------------------
 'a':1,6,10 'and':8 'ate':9 'cat':3 'fat':2,11 'mat':7 'on':5 'rat':12 'sat':4
```

一个位置通常表示源词在文档中的定位。位置信息可以被用于邻近排名。位置值可以从 1 到 16383，更大的数字会被 16383。对于相同的词位出现的重复位置将被丢弃。

具有位置的词位可以进一步地被标注一个权重，它可以是A、 B、C或D。 D是默认值并且因此在输出中不会显示：

```
SELECT 'a:1A fat:2B,4C cat:5D'::tsvector;
          tsvector
----------------------------
 'a':1A 'cat':5 'fat':2B,4C
```

权重通常被用来反映文档结构，例如将主题词标记成与正文词不同。文本搜索排名函数可以为不同的权重标记器分配不同的优先级。

了解tsvector类型本身并不执行任何词正规化这一点很重要，它假定给它的词已经被恰当地为应用正规化过。例如，

```
SELECT 'The Fat Rats'::tsvector;
      tsvector
--------------------
 'Fat' 'Rats' 'The'
```

对于大部分英语文本搜索应用，上面的词将会被认为是非正规化的，但是tsvector并不在乎这一点。原始文档文本通常应该经过to\_tsvector以恰当地为搜索正规化其中的词：

```
SELECT to_tsvector('english', 'The Fat Rats');
   to_tsvector
-----------------
 'fat':2 'rat':3
```

再次地，详情请参阅第 12 章。

### tsquery [*link*](#tsquery)

一个tsquery值存储要用于搜索的词位，并且使用布尔操作符&（AND）、|（OR）和!（NOT）来组合它们，还有短语搜索操作符<->（FOLLOWED BY）。也有一种 FOLLOWED BY 操作符的变体，其中N是一个整数常量，它指定要搜索的两个词位之间的距离。<->等效于<1>。

圆括号可以被用来强制对操作符分组。如果没有圆括号，!（NOT）的优先级最高，其次是<->（FOLLOWED BY），然后是&（AND），最后是|（OR）。

这里有一些例子：

```
SELECT 'fat & rat'::tsquery;
    tsquery
---------------
 'fat' & 'rat'

SELECT 'fat & (rat | cat)'::tsquery;
          tsquery
---------------------------
 'fat' & ( 'rat' | 'cat' )

SELECT 'fat & rat & ! cat'::tsquery;
        tsquery
------------------------
 'fat' & 'rat' & !'cat'
```

可选地，一个tsquery中的词位可以被标注一个或多个权重字母，这将限制它们只能和具有那些权重之一的tsvector词位相匹配：

```
SELECT 'fat:ab & cat'::tsquery;
    tsquery
------------------
 'fat':AB & 'cat'
```

此外，一个tsquery中的词位可以被标注为\*来指定前缀匹配：

```
SELECT 'super:*'::tsquery;
  tsquery
-----------
 'super':*
```

这个查询将匹配一个tsvector中以“super”开头的任意词。

## 范围类型 [*link*](#%e8%8c%83%e5%9b%b4%e7%b1%bb%e5%9e%8b)

范围类型是表达某种元素类型（称为范围的subtype）的一个值的范围的数据类型。例如，timestamp的范围可以被用来表达一个会议室被保留的时间范围。在这种情况下，数据类型是tsrange（“timestamp range”的简写）而timestamp是 subtype。subtype 必须具有一种总体的顺序，这样对于元素值是在一个范围值之内、之前或之后就是界线清楚的。

范围类型非常有用，因为它们可以表达一种单一范围值中的多个元素值，并且可以很清晰地表达诸如范围重叠等概念。用于时间安排的时间和日期范围是最清晰的例子；但是价格范围、一种仪器的量程等等也都有用。

### 内建范围类型 [*link*](#%e5%86%85%e5%bb%ba%e8%8c%83%e5%9b%b4%e7%b1%bb%e5%9e%8b)

MemFireDB 带有下列内建范围类型：

· int4range — integer的范围  
· int8range — bigint的范围  
· numrange — numeric的范围  
· tsrange — 不带时区的 timestamp的范围  
· tstzrange — 带时区的 timestamp的范围  
· daterange — date的范围

此外，你可以定义自己的范围类型，详见CREATE TYPE。

### 例子 [*link*](#%e4%be%8b%e5%ad%90)

```
CREATE TABLE reservation (room int, during tsrange);
INSERT INTO reservation VALUES
    (1108, '[2010-01-01 14:30, 2010-01-01 15:30)');

-- 包含
SELECT int4range(10, 20) @> 3;

-- 重叠
SELECT numrange(11.1, 22.2) && numrange(20.0, 30.0);

-- 抽取上界
SELECT upper(int8range(15, 25));

-- 计算交集
SELECT int4range(10, 20) * int4range(15, 25);

-- 范围为空吗？
SELECT isempty(numrange(1, 5));
```

### 包含和排除边界 [*link*](#%e5%8c%85%e5%90%ab%e5%92%8c%e6%8e%92%e9%99%a4%e8%be%b9%e7%95%8c)

每一个非空范围都有两个界限，下界和上界。这些值之间的所有点都被包括在范围内。一个包含界限意味着边界点本身也被包括在范围内，而一个排除边界意味着边界点不被包括在范围内。

在一个范围的文本形式中，一个包含下界被表达为“[”而一个排除下界被表达为“(”。同样，一个包含上界被表达为“]”而一个排除上界被表达为“)”。

函数lower\_inc和upper\_inc分别测试一个范围值的上下界。

### 无限（无界）范围 [*link*](#%e6%97%a0%e9%99%90%e6%97%a0%e7%95%8c%e8%8c%83%e5%9b%b4)

一个范围的下界可以被忽略，意味着所有小于上界的点都被包括在范围中。同样，如果范围的上界被忽略，那么所有比上界大的的都被包括在范围中。如果上下界都被忽略，该元素类型的所有值都被认为在该范围中。

这等效于把下界当作“负无穷”，或者把上界当作“正无穷”。但是注意这些无穷值绝不是范围的元素类型的值，并且绝不是范围的一部分（因此没有所谓的包含无限界限 — 如果你尝试写一个，它将被自动转换成一个排除界限）。

还有，有一些元素类型具有一种“无限”概念，但是那只是范围类型机制所关心的之外的另一种值。例如，在时间戳范围中，[today,]意味着与[today,)相同的东西。但是[today,infinity]意味着与[today,infinity)不同的某种东西 — 后者排除了特殊的timestamp值infinity。

函数lower\_inf和upper\_inf分别测试一个范围的无限上下界。

### 范围输入/输出 [*link*](#%e8%8c%83%e5%9b%b4%e8%be%93%e5%85%a5%e8%be%93%e5%87%ba)

一个范围值的输入必须遵循下列模式之一：

```
(lower-bound,upper-bound)
(lower-bound,upper-bound]
[lower-bound,upper-bound)
[lower-bound,upper-bound]
empty
```

圆括号或方括号指示上下界是否为排除的或者包含的。注意最后一个模式是empty，它表示一个空范围（一个不包含点的范围）。

lower-bound可以是作为 subtype 的合法输入的一个字符串，或者是空表示没有下界。同样，upper-bound可以是作为 subtype 的合法输入的一个字符串，或者是空表示没有上界。

每个界限值可以使用”（双引号）字符引用。如果界限值包含圆括号、方括号、逗号、双引号或反斜线时，这样做是必须的，因为否则那些字符会被认作范围语法的一部分。要把一个双引号或反斜线放在一个被引用的界限值中，就在它前面放一个反斜线（还有，在一个双引号引用的界限值中的一对双引号表示一个双引号字符，这与 SQL 字符串中的单引号规则类似）。此外，你可以避免引用并且使用反斜线转义来保护所有数据字符，否则它们会被当做返回语法的一部分。还有，要写一个是空字符串的界限值，则可以写成""，因为什么都不写表示一个无限界限。

范围值前后允许有空格，但是圆括号或方括号之间的任何空格会被当做上下界值的一部分（取决于元素类型，它可能是也可能不是有意义的）。

例子：

```
-- 包括 3，不包括 7，并且包括 3 和 7 之间的所有点
SELECT '[3,7)'::int4range;

-- 既不包括 3 也不包括 7，但是包括之间的所有点
SELECT '(3,7)'::int4range;

-- 只包括单独一个点 4
SELECT '[4,4]'::int4range;

-- 不包括点（并且将被标准化为 '空'）
SELECT '[4,4)'::int4range;
```

### 构造范围 [*link*](#%e6%9e%84%e9%80%a0%e8%8c%83%e5%9b%b4)

每一种范围类型都有一个与其同名的构造器函数。使用构造器函数常常比写一个范围文字常数更方便，因为它避免了对界限值的额外引用。构造器函数接受两个或三个参数。两个参数的形式以标准的形式构造一个范围（下界是包含的，上界是排除的），而三个参数的形式按照第三个参数指定的界限形式构造一个范围。第三个参数必须是下列字符串之一： “()”、 “(]”、 “[)”或者 “[]”。 例如：

```
-- 完整形式是：下界、上界以及指示界限包含性/排除性的文本参数。
SELECT numrange(1.0, 14.0, '(]');

-- 如果第三个参数被忽略，则假定为 '[)'。
SELECT numrange(1.0, 14.0);

-- 尽管这里指定了 '(]'，显示时该值将被转换成标准形式，因为 int8range 是一种离散范围类型（见下文）。
SELECT int8range(1, 14, '(]');

-- 为一个界限使用 NULL 导致范围在那一边是无界的。
SELECT numrange(NULL, 2.2);
```

### 离散范围类型 [*link*](#%e7%a6%bb%e6%95%a3%e8%8c%83%e5%9b%b4%e7%b1%bb%e5%9e%8b)

一种范围的元素类型具有一个良定义的“步长”，例如integer或date。在这些类型中，如果两个元素之间没有合法值，它们可以被说成是相邻。这与连续范围相反，连续范围中总是（或者几乎总是）可以在两个给定值之间标识其他元素值。例如，numeric类型之上的一个范围就是连续的，timestamp上的范围也是（尽管timestamp具有有限的精度，并且在理论上可以被当做离散的，最好认为它是连续的，因为通常并不关心它的步长）。

另一种考虑离散范围类型的方法是对每一个元素值都有一种清晰的“下一个”或“上一个”值。了解了这种思想之后，通过选择原来给定的下一个或上一个元素值来取代它，就可以在一个范围界限的包含和排除表达之间转换。例如，在一个整数范围类型中，[4,8]和(3,9)表示相同的值集合，但是对于 numeric 上的范围就不是这样。

一个离散范围类型应该具有一个正规化函数，它知道元素类型期望的步长。正规化函数负责把范围类型的相等值转换成具有相同的表达，特别是与包含或者排除界限一致。如果没有指定一个正规化函数，那么具有不同格式的范围将总是会被当作不等，即使它们实际上是表达相同的一组值。

内建的范围类型int4range、int8range和daterange都使用一种正规的形式，该形式包括下界并且排除上界，也就是[)。不过，用户定义的范围类型可以使用其他习惯。

### 定义新的范围类型 [*link*](#%e5%ae%9a%e4%b9%89%e6%96%b0%e7%9a%84%e8%8c%83%e5%9b%b4%e7%b1%bb%e5%9e%8b)

用户可以定义他们自己的范围类型。这样做最常见的原因是为了使用内建范围类型中没有提供的 subtype 上的范围。例如，要创建一个 subtype float8的范围类型：

```
CREATE TYPE floatrange AS RANGE (
    subtype = float8,
    subtype_diff = float8mi
);

SELECT '[1.234, 5.678]'::floatrange;
```

因为float8没有有意义的“步长”，我们在这个例子中没有定义一个正规化函数。

定义自己的范围类型也允许你指定使用一个不同的子类型 B-树操作符类或者集合， 以便更改排序顺序来决定哪些值会落入到给定的范围中。

如果 subtype 被认为是具有离散值而不是连续值，CREATE TYPE命令应当指定一个canonical函数。正规化函数接收一个输入的范围值，并且必须返回一个可能具有不同界限和格式的等价的范围值。对于两个表示相同值集合的范围（例如[1, 7]和[1, 8)），正规的输出必须一样。选择哪一种表达作为正规的没有关系，只要两个具有不同格式的等价值总是能被映射到具有相同格式的相同值就行。除了调整包含/排除界限格式外，假使期望的补偿比 subtype 能够存储的要大，一个正规化函数可能会舍入边界值。例如，一个timestamp之上的范围类型可能被定义为具有一个一小时的步长，这样正规化函数可能需要对不是一小时的倍数的界限进行舍入，或者可能直接抛出一个错误。

另外，任何打算要和 GiST 或 SP-GiST 索引一起使用的范围类型应当定一个 subtype 差异或subtype\_diff函数（没有subtype\_diff时索引仍然能工作，但是可能效率不如提供了差异函数时高）。subtype 差异函数采用两个 subtype 输入值，并且返回表示为一个float8值的差（即X减Y）。在我们上面的例子中，可以使用常规float8减法操作符之下的函数。但是对于任何其他 subtype，可能需要某种类型转换。还可能需要一些关于如何把差异表达为数字的创新型想法。为了最大的可扩展性，subtype\_diff函数应该同意选中的操作符类和排序规则所蕴含的排序顺序，也就是说，只要它的第一个参数根据排序顺序大于第二个参数，它的结果就应该是正值。

subtype\_diff函数的一个不那么过度简化的例子：

```
CREATE FUNCTION time_subtype_diff(x time, y time) RETURNS float8 AS
'SELECT EXTRACT(EPOCH FROM (x - y))' LANGUAGE sql STRICT IMMUTABLE;

CREATE TYPE timerange AS RANGE (
    subtype = time,
    subtype_diff = time_subtype_diff
);

SELECT '[11:10, 23:00]'::timerange;
```

更多关于创建范围类型的信息请参考CREATE TYPE。

---

[*navigate\_before* 关键字](/docs/db/guides/keyword/)

[SQL语法 *navigate\_next*](/docs/db/guides/sql-grammar/)