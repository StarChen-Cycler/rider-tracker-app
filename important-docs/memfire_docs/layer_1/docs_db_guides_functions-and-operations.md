# 函数与操作 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/db/guides/functions-and-operations/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

逻辑操作符

# 函数与操作

# 逻辑操作符 [*link*](#%e9%80%bb%e8%be%91%e6%93%8d%e4%bd%9c%e7%ac%a6)

常用的逻辑操作符有：

| AND |
| --- |
| OR |
| NOT |

SQL使用三值的逻辑系统，包括真、假和null，null表示“未知”。观察下面的真值表：

| a | b | a AND b | a OR b |
| --- | --- | --- | --- |
| TRUE | TRUE | TRUE | TRUE |
| TRUE | FALSE | FALSE | TRUE |
| TRUE | NULL | NULL | TRUE |
| FALSE | FALSE | FALSE | FALSE |
| FALSE | NULL | FALSE | NULL |
| NULL | NULL | NULL | NULL |

| a | NOT a |
| --- | --- |
| TRUE | FALSE |
| FALSE | TRUE |
| NULL | NULL |

操作符AND和OR是可交换的，也就是说，你可以交换左右操作数而不影响结果。

## 比较函数与操作符 [*link*](#%e6%af%94%e8%be%83%e5%87%bd%e6%95%b0%e4%b8%8e%e6%93%8d%e4%bd%9c%e7%ac%a6)

比较操作符可以用于所有可以比较的数据类型。所有比较操作符都是双目操作符，它们返回boolean类型；类似于1 < 2 < 3的表达式是非法的（因为没有<操作符可以比较一个布尔值和3）。

常见的比较操作符都可用，如表所示。

**表.比较操作符**

| 操作符 | 描述 |
| --- | --- |
| < | 小于 |
| > | 大于 |
| <= | 小于等于 |
| >= | 大于等于 |
| = | 等于 |
| <> or != | 不等于 |

注意

!=操作符在分析器阶段被转换成<>。不能把!=和<>操作符实现为做不同的事。

如表所示，也有一些比较谓词。它们的行为和操作符很像，但是具有 SQL 标准所要求的特殊语法。

**表.比较谓词**

| 谓词 | 描述 |
| --- | --- |
| a BETWEEN x AND y | 在x和y之间 |
| a NOT BETWEEN x AND y | 不在x和y之间 |
| a BETWEEN SYMMETRIC x AND y | 在对比较值排序后位于x和y之间 |
| a NOT BETWEEN SYMMETRIC x AND y | 在对比较值排序后不位于x和y之间 |
| a IS DISTINCT FROM b | 不等于，空值被当做一个普通值 |
| a IS NOT DISTINCT FROM b | 等于，空值被当做一个普通值 |
| expression IS NULL | 是空值 |
| expression IS NOT NULL | 不是空值 |
| expression ISNULL | 是空值（非标准语法） |
| expression NOTNULL | 不是空值（非标准语法） |
| boolean\_expression IS TRUE | 为真 |
| boolean\_expression IS NOT TRUE | 为假或未知 |
| boolean\_expression IS FALSE | 为假 |
| boolean\_expression IS NOT FALSE | 为真或者未知 |
| boolean\_expression IS UNKNOWN | 值为未知 |
| boolean\_expression IS NOT UNKNOWN | 为真或者为假 |

BETWEEN谓词可以简化范围测试：

```
a BETWEEN x AND y
```

等效于

```
a >= x AND a <= y
```

注意BETWEEN认为终点值是包含在范围内的。 NOT BETWEEN可以做相反比较：

```
a NOT BETWEEN x AND y
```

等效于

```
a < x OR a > y
```

BETWEEN SYMMETRIC和BETWEEN相似，不过BETWEEN SYMMETRIC不要求AND左边的参数小于或等于右边的参数。如果左参数不是小于等于右参数，这两个参数会自动被交换，这样总是会应用一个非空范围。

当有一个输入为空时，普通的比较操作符会得到空（表示“未知”），而不是真或假。例如，7 = NULL得到空，7 <> NULL也一样。如果这种行为不合适，可以使用IS [ NOT ] DISTINCT FROM谓词：

```
a IS DISTINCT FROM b
a IS NOT DISTINCT FROM b
```

对于非空输入，IS DISTINCT FROM和<>操作符一样。不过，如果两个输入都为空，它会返回假。而如果只有一个输入为空，它会返回真。类似地，IS NOT DISTINCT FROM对于非空输入的行为与=相同，但是当两个输入都为空时它返回真，并且当只有一个输入为空时返回假。因此，这些谓词实际上把空值当作一种普通数据值而不是“unknown”。

要检查一个值是否为空，使用下面的谓词：

```
expression IS NULL
expression IS NOT NULL
```

或者等效，但并不标准的谓词：

```
expression ISNULL
expression NOTNULL
```

不要写expression = NULL，因为NULL是不“等于”NULL的（控制代表一个未知的值，因此我们无法知道两个未知的数值是否相等）。

如果expression是行值，那么当行表达式本身为非空值或者行的所有域为非空时IS NULL为真。由于这种行为，IS NULL和IS NOT NULL并不总是为行值表达式返回反转的结果，特别是，一个同时包含 NULL 和非空值的域将会对两种测试都返回假。在某些情况下，写成row IS DISTINCT FROM NULL或者row IS NOT DISTINCT FROM NULL会更好，它们只会检查整个行值是否为空而不需要在行的域上做额外的测试。

布尔值也可以使用下列谓词进行测试：

```
boolean_expression IS TRUE
boolean_expression IS NOT TRUE
boolean_expression IS FALSE
boolean_expression IS NOT FALSE
boolean_expression IS UNKNOWN
boolean_expression IS NOT UNKNOWN
```

这些谓词将总是返回真或假，从来不返回空值，即使操作数是空也如此。空值输入被当做逻辑值“未知”。 请注意实际上IS UNKNOWN和IS NOT UNKNOWN分别与IS NULL和IS NOT NULL相同， 只是输入表达式必须是布尔类型。

如表中所示，也有一些比较相关的函数可用。

**表.比较函数**

| 函数 | 描述 | 例子 | 例子结果 |
| --- | --- | --- | --- |
| num\_nonnulls(VARIADIC “any”) | 返回非空参数的数量 | num\_nonnulls(1, NULL, 2) | 2 |
| num\_nulls(VARIADIC “any”) | 返回空参数的数量 | num\_nulls(1, NULL, 2) | 1 |

## 数学函数和操作符 [*link*](#%e6%95%b0%e5%ad%a6%e5%87%bd%e6%95%b0%e5%92%8c%e6%93%8d%e4%bd%9c%e7%ac%a6)

MemFireDB为很多类型提供了数学操作符。对于那些没有标准数学表达的类型（如日期/时间类型），我们将在后续小节中描述实际的行为。

### 数学操作符 [*link*](#%e6%95%b0%e5%ad%a6%e6%93%8d%e4%bd%9c%e7%ac%a6)

下表展示了所有可用的数学操作符。

**表.数学操作符**

| **操作符** | **描述** | **例子** | **结果** |
| --- | --- | --- | --- |
| + | 加 | 2 + 3 | 5 |
| - | 减 | 2 - 3 | -1 |
| \* | 乘 | 2 \* 3 | 6 |
| / | 除（整数除法截断结果） | 4 / 2 | 2 |
| % | 模（取余） | 5 % 4 | 1 |
| ^ | 指数（从左至右结合） | 2.0 ^ 3.0 | 8 |
| |/ | 平方根 | |/ 25.0 | 5 |
| ||/ | 立方根 | ||/ 27.0 | 3 |
| ! | 阶乘 | 5 ! | 120 |
| !! | 阶乘（前缀操作符） | !! 5 | 120 |
| @ | 绝对值 | @ -5.0 | 5 |
| & | 按位与 | 91 & 15 | 11 |
| | | 按位或 | 32 | 3 | 35 |
| # | 按位异或 | 17 # 5 | 20 |
| ~ | 按位求反 | ~1 | -2 |
| « | 按位左移 | 1 « 4 | 16 |
| » | 按位右移 | 8 » 2 | 2 |

按位操作操作符只能用于整数数据类型，而其它的操作符可以用于全部数字数据类型。按位操作的操作符还可以用于位串类型bit和bit varying。

上表显示了可用的数学函数。在该表中，dp表示double precision。这些函数中有许多都有多种不同的形式，区别是参数不同。除非特别指明，任何特定形式的函数都返回和它的参数相同的数据类型。 处理double precision数据的函数大多数是在宿主系统的 C 库基础上实现的；因此，边界情况下的准确度和行为是根据宿主系统而变化的。

### 数学函数 [*link*](#%e6%95%b0%e5%ad%a6%e5%87%bd%e6%95%b0)

**表.数学函数**

| 函数 | 返回类型 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- | --- |
| abs(x) | （和输入相同） | 绝对值 | abs(-17.4) | 17.4 |
| cbrt(dp) | dp | 立方根 | cbrt(27.0) | 3 |
| ceil(dp or numeric) | （和输入相同） | 不小于参数的最近的整数 | ceil(-42.8) | -42 |
| ceiling(dp or numeric) | （和输入相同） | 不小于参数的最近的整数（ceil的别名） | ceiling(-95.3) | -95 |
| degrees(dp) | dp | 把弧度转为角度 | degrees(0.5) | 28.6478897565412 |
| div(y numeric, x numeric) | numeric | y/x的整数商 | div(9,4) | 2 |
| exp(dp or numeric) | （和输入相同） | 指数 | exp(1.0) | 2.71828182845905 |
| floor(dp or numeric) | （和输入相同） | 不大于参数的最近的整数 | floor(-42.8) | -43 |
| ln(dp or numeric) | （和输入相同） | 自然对数 | ln(2.0) | 0.693147180559945 |
| log(dp or numeric) | （和输入相同） | 以10为底的对数 | log(100.0) | 2 |
| log(b numeric, x numeric) | numeric | 以b为底的对数 | log(2.0, 64.0) | 6.0000000000 |
| mod(y, x) | （和参数类型相同） | y/x的余数 | mod(9,4) | 1 |
| pi() | dp | “π”常数 | pi() | 3.14159265358979 |
| power(a dp, b dp) | dp | 求a的b次幂 | power(9.0, 3.0) | 729 |
| power(a numeric, b numeric) | numeric | 求a的b次幂 | power(9.0, 3.0) | 729 |
| radians(dp) | dp | 把角度转为弧度 | radians(45.0) | 0.785398163397448 |
| round(dp or numeric) | （和输入相同） | 圆整为最接近的整数 | round(42.4) | 42 |
| round(v numeric, s int) | numeric | 圆整为s位小数数字 | round(42.4382, 2) | 42.44 |
| scale(numeric) | integer | 参数的精度（小数点后的位数） | scale(8.41) | 2 |
| sign(dp or numeric) | （和输入相同） | 参数的符号（-1, 0, +1） | sign(-8.4) | -1 |
| sqrt(dp or numeric) | （和输入相同） | 平方根 | sqrt(2.0) | 1.4142135623731 |
| trunc(dp or numeric) | （和输入相同） | 截断（向零靠近） | trunc(42.8) | 42 |
| trunc(v numeric, s int) | numeric | 截断为s位小数位置的数字 | trunc(42.4382, 2) | 42.43 |
| width\_bucket(op dp, b1 dp, b2 dp, count int) | int | 返回一个桶号，这个桶是在一个柱状图中operand将被分配的那个桶，该柱状图有count个散布在范围b1到b2上的等宽桶。对于超过该范围的输入，将返回0或者count+1 | width\_bucket(5.35, 0.024, 10.06, 5) | 3 |
| width\_bucket(op numeric, b1 numeric, b2 numeric, count int) | int | 返回一个桶号，这个桶是在一个柱状图中operand将被分配的那个桶，该柱状图有count个散布在范围b1到b2上的等宽桶。对于超过该范围的输入，将返回0或者count+1 | width\_bucket(5.35, 0.024, 10.06, 5) | 3 |
| width\_bucket(operand anyelement, thresholds anyarray) | int | 返回一个桶号，这个桶是在给定数组中operand 将被分配的桶，该数组列出了桶的下界。对于一个低于第一个下界的输入返回 0。thresholds数组*必须被排好序*， 最小的排在最前面，否则将会得到意想不到的结果 | width\_bucket(now(), array[‘yesterday’, ’today’, ’tomorrow’]::timestamptz[]) | 2 |

### 随机函数 [*link*](#%e9%9a%8f%e6%9c%ba%e5%87%bd%e6%95%b0)

下表展示了用于产生随机数的函数。

**表.随机函数**

| 函数 | 返回类型 | 描述 |
| --- | --- | --- |
| random() | dp | 范围 0.0 <= x < 1.0 中的随机值 |
| setseed(dp) | void | 为后续的random()调用设置种子（值为于 -1.0 和 1.0 之间，包括边界值） |

random()返回的值的特征取决于系统实现。 它不适合用于加密应用，如果需要用于加密应用请参考pgcrypto模块。

最后，表显示了可用的三角函数。所有三角函数都有类型为double precision的参数和返回类型。每一种三角函数都有两个变体，一个以弧度度量角，另一个以角度度量角。

### 三角函数 [*link*](#%e4%b8%89%e8%a7%92%e5%87%bd%e6%95%b0)

**表.三角函数**

| 函数（弧度） | 函数（角度） | 描述 |
| --- | --- | --- |
| acos(x) | acosd(x) | 反余弦 |
| asin(x) | asind(x) | 反正弦 |
| atan(x) | atand(x) | 反正切 |
| atan2(y, x) | atan2d(y, x) | y/x的反正切 |
| cos(x) | cosd(x) | 余弦 |
| cot(x) | cotd(x) | 余切 |
| sin(x) | sind(x) | 正弦 |
| tan(x) | tand(x) | 正切 |

## 字符串函数和操作符 [*link*](#%e5%ad%97%e7%ac%a6%e4%b8%b2%e5%87%bd%e6%95%b0%e5%92%8c%e6%93%8d%e4%bd%9c%e7%ac%a6)

本节描述了用于检查和操作字符串值的函数和操作符。在这个环境中的串包括所有类型character、character varying和text的值。除非另外说明，所有下面列出的函数都可以处理这些类型，不过要小心的是，在使用character类型的时候， 它有自动填充空白的潜在影响。有些函数还可以处理位串类型。

SQL定义了一些字符串函数，它们使用关键字，而不是逗号来分隔参数。MemFireDB也提供了这些函数使用正常函数调用语法的版本。

**表.SQL字符串函数和操作符**

| 函数 | 返回类型 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- | --- |
| string || string | text | 串接 | ‘Post’ || ‘greSQL’ | PostgreSQL |
| string || non-string or non-string || string | text | 使用一个非字符串输入的串接 | ‘Value: ’ || 42 | Value: 42 |
| bit\_length(string) | int | 串中的位数 | bit\_length(‘jose’) | 32 |
| char\_length(string) or character\_length(string) | int | 串中字符数 | char\_length(‘jose’) | 4 |
| lower(string) | text | 将字符串转换为小写形式 | lower(‘TOM’) | tom |
| octet\_length(string) | int | 串中的字节数 | octet\_length(‘jose’) | 4 |
| overlay(string placing string from int [for int]) | text | 替换子串 | overlay(‘Txxxxas’ placing ‘hom’ from 2 for 4) | Thomas |
| position(substring in string) | int | 定位指定子串 | position(‘om’ in ‘Thomas’) | 3 |
| substring(string [from int] [for int]) | text | 提取子串 | substring(‘Thomas’ from 2 for 3) | hom |
| substring(string from pattern) | text | 提取匹配POSIX正则表达式的子串。模式匹配。 | substring(‘Thomas’ from ‘…$’) | mas |
| substring(string from pattern for escape) | text | 提取匹配SQL正则表达式的子串。 | substring(‘Thomas’ from ‘%#“o\_a#”\_’ for ‘#’) | oma |
| trim([leading | trailing | both] [characters] from string) | text | 从string的开头、结尾或者两端（both是默认值）移除只包含characters（默认是一个空格）中字符的最长字符串 | trim(both ‘xyz’ from ‘yxTomxx’) | Tom |
| trim([leading | trailing | both] [from] string [, characters] ) | text | trim()的非标准版本 | trim(both from ‘xTomxx’, ‘x’) | Tom |
| upper(string) | text | 将字符串转换成大写形式 | upper(’tom’) | TOM |

还有额外的串操作函数可以用，它们在下表中列出。它们有些在内部用于实现表 列出的SQL标准字符串函数。

**表.其他字符串函数**

| 函数 | 返回类型 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- | --- |
| ascii(string) | int | 参数第一个字符的ASCII代码。对于UTF8返回该字符的Unicode代码点。对于其他多字节编码，该参数必须是一个ASCII字符。 | ascii(‘x’) | 120 |
| btrim(string text [, characters text]) | text | 从string的开头或结尾删除最长的只包含characters（默认是一个空格）的串 | btrim(‘xyxtrimyyx’, ‘xyz’) | trim |
| chr(int) | text | 给定代码的字符。对于UTF8该参数被视作一个Unicode代码点。对于其他多字节编码该参数必须指定一个ASCII字符。NULL (0) 字符不被允许，因为文本数据类型不能存储这种字节。 | chr(65) | A |
| concat(str “any” [, str “any” [, …] ]) | text | 串接所有参数的文本表示。NULL 参数被忽略。 | concat(‘abcde’, 2, NULL, 22) | abcde222 |
| concat\_ws(sep text, str “any” [, str “any” [, …] ]) | text | 将除了第一个参数外的其他参数用分隔符串接在一起。第一个参数被用作分隔符字符串。NULL 参数被忽略。 | concat\_ws(’,’, ‘abcde’, 2, NULL, 22) | abcde,2,22 |
| decode(string text, format text) | bytea | 从string中的文本表达解码二进制数据。format的选项和encode中的一样。 | decode(‘MTIzAAE=’, ‘base64’) | \x3132330001 |
| encode(data bytea, format text) | text | 将二进制数据编码成一个文本表达。支持的格式有：base64、hex、escape。escape将零字节和高位组字节转换为八进制序列（\nnn）和双写的反斜线。 | encode(‘123\000\001’, ‘base64’) | MTIzAAE= |
| format(formatstr text [, formatarg “any” [, …] ]) | text | 根据一个格式字符串格式化参数。该函数和C函数sprintf相似。 | format(‘Hello %s, %1$s’, ‘World’) | Hello World, World |
| initcap(string) | text | 将每一个词的第一个字母转换为大写形式并把剩下的字母转换为小写形式。词是由非字母数字字符分隔的字母数字字符的序列。 | initcap(‘hi THOMAS’) | Hi Thomas |
| left(str text, n int) | text | 返回字符串中的前n个字符。当n为负时，将返回除了最后|n|个字符之外的所有字符。 | left(‘abcde’, 2) | ab |
| length(string) | int | string中的字符数 | length(‘jose’) | 4 |
| length(string bytea, encoding name ) | int | string在给定编码中的字符数。string必须在这个编码中有效。 | length(‘jose’, ‘UTF8’) | 4 |
| lpad(string text, length int [, fill text]) | text | 将string通过前置字符fill（默认是一个空格）填充到长度length。如果string已经长于length，则它被（从右边）截断。 | lpad(‘hi’, 5, ‘xy’) | xyxhi |
| ltrim(string text [, characters text]) | text | 从string的开头删除最长的只包含characters（默认是一个空格）的串 | ltrim(‘zzzytest’, ‘xyz’) | test |
| md5(string) | text | 计算string的 MD5 哈希，返回十六进制的结果 | md5(‘abc’) | 900150983cd24fb0 d6963f7d28e17f72 |
| parse\_ident(qualified\_identifier text [, strictmode boolean DEFAULT true ] ) | text[] | 把qualified\_identifier分成一个标识符数组，移除单个标识符上的任何引号。默认情况下，最后一个标识符后面的多余字符会被当做错误。但是如果第二个参数为false，那么这一类多余的字符会被忽略（这种行为对于解析函数之类的对象名称有用）。注意这个函数不会截断超长标识符。如果想要进行截断，可以把结果转换成name[]。 | parse\_ident(’“SomeSchema”.someTable’) | {SomeSchema,sometable} |
| pg\_client\_encoding() | name | 当前的客户端编码名字 | pg\_client\_encoding() | SQL\_ASCII |
| quote\_ident(string text) | text | 将给定字符串返回成合适的引用形式，使它可以在一个SQL语句字符串中被用作一个标识符。只有需要时才会加上引号（即，如果字符串包含非标识符字符或可能是大小写折叠的）。嵌入的引号会被正确地双写。 | quote\_ident(‘Foo bar’) | “Foo bar” |
| quote\_literal(string text) | text | 将给定字符串返回成合适的引用形式，使它可以在一个SQL语句字符串中被用作一个字符串文字。嵌入的引号会被正确地双写。注意quote\_literal对空输入返回空；如果参数可能为空，quote\_nullable通常更合适。 | quote\_literal(E’O'Reilly’) | ‘O’‘Reilly’ |
| quote\_literal(value anyelement) | text | 强迫给定值为文本并且接着将它用引号包围作为一个文本。嵌入的单引号和反斜线被正确的双写。 | quote\_literal(42.5) | ‘42.5’ |
| quote\_nullable(string text) | text | 将给定字符串返回成合适的引用形式，使它可以在一个SQL语句字符串中被用作一个字符串文字；或者，如果参数为空，返回NULL。嵌入的引号会被正确地双写。 | quote\_nullable(NULL) | NULL |
| quote\_nullable(value anyelement) | text | 强迫给定值为文本并且接着将它用引号包围作为一个文本；或者，如果参数为空，返回NULL。嵌入的单引号和反斜线被正确的双写。 | quote\_nullable(42.5) | ‘42.5’ |
| regexp\_match(string text, pattern text [, flags text]) | text[] | 返回一个POSIX正则表达式与string的第一个匹配得到的子串。 | regexp\_match(‘foobarbequebaz’, ‘(bar)(beque)’) | {bar,beque} |
| regexp\_matches(string text, pattern text [, flags text]) | setof text[] | 返回一个POSIX正则表达式与string匹配得到的子串。 | regexp\_matches(‘foobarbequebaz’, ‘ba.’, ‘g’) | {bar} {baz} (2 rows) |
| regexp\_replace(string text, pattern text, replacement text [, flags text]) | text | 替换匹配一个POSIX正则表达式的子串。 | regexp\_replace(‘Thomas’, ‘.[mN]a.’, ‘M’) | ThM |
| regexp\_split\_to\_array(string text, pattern text [, flags text ]) | text[] | 使用一个POSIX正则表达式作为分隔符划分string。 | regexp\_split\_to\_array(‘hello world’, ‘\s+’) | {hello,world} |
| regexp\_split\_to\_table(string text, pattern text [, flags text]) | setof text | 使用一个POSIX正则表达式作为分隔符划分string。 | regexp\_split\_to\_table(‘hello world’, ‘\s+’) | hello world (2 rows) |
| repeat(string text, number int) | text | 重复string指定的number次 | repeat(‘Pg’, 4) | PgPgPgPg |
| replace(string text, from text, to text) | text | 将string中出现的所有子串from替换为子串to | replace(‘abcdefabcdef’, ‘cd’, ‘XX’) | abXXefabXXef |
| reverse(str) | text | 返回反转的字符串。 | reverse(‘abcde’) | edcba |
| right(str text, n int) | text | 返回字符串中的最后n个字符。如果n为负，返回除最前面的|n|个字符外的所有字符。 | right(‘abcde’, 2) | de |
| rpad(string text, length int [, fill text]) | text | 将string通过增加字符fill（默认为一个空格）填充到长度length。如果string已经长于length则它会被截断。 | rpad(‘hi’, 5, ‘xy’) | hixyx |
| rtrim(string text [, characters text]) | text | 从string的结尾删除最长的只包含characters（默认是一个空格）的串 | rtrim(’testxxzx’, ‘xyz’) | test |
| split\_part(string text, delimiter text, field int) | text | 按delimiter划分string并返回给定域（从1开始计算） | split\_part(‘abc~@~def~@~ghi’, ‘~@~’, 2) | def |
| strpos(string, substring) | int | 指定子串的位置（和position(substring in string)相同，但是注意相反的参数顺序） | strpos(‘high’, ‘ig’) | 2 |
| substr(string, from [, count]) | text | 提取子串（与substring(string from from for count)相同） | substr(‘alphabet’, 3, 2) | ph |
| starts\_with(string, prefix) | bool | 如果string以prefix开始则返回真。 | starts\_with(‘alphabet’, ‘alph’) | t |
| to\_hex(number int or bigint) | text | 将number转换到它等效的十六进制表示 | to\_hex(2147483647) | 7fffffff |
| translate(string text, from text, to text) | text | string中任何匹配from集合中一个字符的字符会被替换成to集合中的相应字符。如果from比to长，from中的额外字符会被删除。 | translate(‘12345’, ‘143’, ‘ax’) | a2x5 |

concat、concat\_ws和format函数是可变的，因此可以把要串接或格式化的值作为一个标记了VARIADIC关键字的数组进行传递。数组的元素被当作函数的独立普通参数一样处理。如果可变数组参数为 NULL，concat和concat\_ws返回 NULL，但format把 NULL 当作一个零元素数组。

**format**

函数format根据一个格式字符串产生格式化的输出，其形式类似于 C 函数sprintf。

```
format(formatstr text [, formatarg "any" [, ...] ])
```

formatstr是一个格式字符串，它指定了结果应该如何被格式化。格式字符串中的文本被直接复制到结果中，除了使用格式说明符的地方。格式说明符在字符串中扮演着占位符的角色，它定义后续的函数参数如何被格式化及插入到结果中。每一个formatarg参数会被根据其数据类型的常规输出规则转换为文本，并接着根据格式说明符被格式化和插入到结果字符串中。

格式说明符由一个%字符开始并且有这样的形式

```
%[position][flags][width]type
```

其中的各组件域是：

**position**（可选）

一个形式为n$的字符串，其中n是要打印的参数的索引。索引 1 表示formatstr之后的第一个参数。如果position被忽略，默认会使用序列中的下一个参数。

flags（可选）

控制格式说明符的输出如何被格式化的附加选项。当前唯一支持的标志是一个负号（-），它将导致格式说明符的输出会被左对齐（left-justified）。除非width域也被指定，否者这个域不会产生任何效果。

width（可选）

指定用于显示格式说明符输出的最小字符数。输出将被在左部或右部（取决于-标志）用空格填充以保证充满该宽度。太小的宽度设置不会导致输出被截断，但是会被简单地忽略。宽度可以使用下列形式之一指定：一个正整数；一个星号（*）表示使用下一个函数参数作为宽度；或者一个形式为*n$的字符串表示使用第n个函数参数作为宽度。

如果宽度来自于一个函数参数，则参数在被格式说明符的值使用之前就被消耗掉了。如果宽度参数是负值，结果会在长度为abs(width)的域中被左对齐（如果-标志被指定）。

type（必需）

格式转换的类型，用于产生格式说明符的输出。支持下面的类型：

· s将参数值格式化为一个简单字符串。一个控制被视为一个空字符串。

· I将参数值视作 SQL 标识符，并在必要时用双写引号包围它。如果参数为空，将会是一个错误（等效于quote\_ident）。

· L将参数值引用为 SQL 文字。一个空值将被显示为不带引号的字符串NULL（等效于quote\_nullable）。

除了以上所述的格式说明符之外，要输出一个文字形式的%字符，可以使用特殊序列%%。

下面有一些基本的格式转换的例子：

```
SELECT format('Hello %s', 'World');
结果：Hello World

SELECT format('Testing %s, %s, %s, %%', 'one', 'two', 'three');
结果：Testing one, two, three, %

SELECT format('INSERT INTO %I VALUES(%L)', 'Foo bar', E'O\'Reilly');
结果：INSERT INTO "Foo bar" VALUES('O''Reilly')

SELECT format('INSERT INTO %I VALUES(%L)', 'locations', 'C:\Program Files');
结果：INSERT INTO locations VALUES(E'C:\\Program Files')
```

下面是使用width域和-标志的例子：

```
SELECT format('|%10s|', 'foo');
结果：|       foo|

SELECT format('|%-10s|', 'foo');
结果：|foo       |

SELECT format('|%*s|', 10, 'foo');
结果：|       foo|

SELECT format('|%*s|', -10, 'foo');
结果：|foo       |

SELECT format('|%-*s|', 10, 'foo');
结果：|foo       |

SELECT format('|%-*s|', -10, 'foo');
结果：|foo       |
```

这些例子展示了position域的例子：

```
SELECT format('Testing %3$s, %2$s, %1$s', 'one', 'two', 'three');
结果：Testing three, two, one

SELECT format('|%*2$s|', 'foo', 10, 'bar');
结果：|       bar|

SELECT format('|%1$*2$s|', 'foo', 10, 'bar');
结果：|       foo|
```

不同于标准的 C 函数sprintf，PostgreSQL的format函数允许将带有或者不带有position域的格式说明符被混在同一个格式字符串中。一个不带有position域的格式说明符总是使用最后一个被消耗的参数的下一个参数。另外，format函数不要求所有函数参数都被用在格式字符串中。例如：

```
SELECT format('Testing %3$s, %2$s, %s', 'one', 'two', 'three');
结果：Testing three, two, three
```

对于安全地构造动态 SQL 语句，%I和%L格式说明符特别有用。

## 二进制串函数与操作符 [*link*](#%e4%ba%8c%e8%bf%9b%e5%88%b6%e4%b8%b2%e5%87%bd%e6%95%b0%e4%b8%8e%e6%93%8d%e4%bd%9c%e7%ac%a6)

本节描述那些检查和操作类型为bytea的值的函数和操作符。

SQL定义了一些使用关键字而不是逗号来分割参数的串函数。

**表.SQL二进制串函数和操作符**

| 函数 | 返回类型 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- | --- |
| string || string | bytea | 串连接 | ‘\Post’::bytea || ‘\047gres\000’::bytea | \Post’gres\000 |
| octet\_length(string) | int | 二进制串中的字节数 | octet\_length(‘jo\000se’::bytea) | 5 |
| overlay(string placing string from int [for int]) | bytea | 替换子串 | overlay(‘Th\000omas’::bytea placing ‘\002\003’::bytea from 2 for 3) | T\002\003mas |
| position(substring in string) | int | 指定子串的位置 | position(’\000om’::bytea in ‘Th\000omas’::bytea) | 3 |
| substring(string [from int] [for int]) | bytea | 提取子串 | substring(‘Th\000omas’::bytea from 2 for 3) | h\000o |
| trim([both] bytes from string) | bytea | 从string的开头或结尾删除只包含出现在bytes中字节的最长串 | trim(’\000\001’::bytea from ‘\000Tom\001’::bytea) | Tom |

还有一些二进制串处理函数可以使用，在下表列出。

**表 . 其他二进制串函数**

| **函数** | **返回类型** | **描述** | **例子** | **结果** |
| --- | --- | --- | --- | --- |
| btrim(string bytea, bytes bytea) | bytea | 从string的开头或结尾删除只由出现在bytes中字节组成的最长串 | btrim(’\000trim\001’::bytea, ‘\000\001’::bytea) | trim |
| decode(string text, format text) | bytea | 从string中的文本表示解码二进制数据。format的参数和在encode中一样。 | decode(‘123\000456’, ’escape’) | 123\000456 |
| encode(data bytea, format text) | text | 将二进制数据编码为一个文本表示。支持的格式有：base64、hex、escape。escape将零字节和高位组字节转换为八进制序列（\nnn）和双反斜线。 | encode(‘123\000456’::bytea, ’escape’) | 123\000456 |
| get\_bit(string, offset) | int | 从串中抽取位 | get\_bit(‘Th\000omas’::bytea, 45) | 1 |
| get\_byte(string, offset) | int | 从串中抽取字节 | get\_byte(‘Th\000omas’::bytea, 4) | 109 |
| length(string) | int | 二进制串的长度 | length(‘jo\000se’::bytea) | 5 |
| md5(string) | text | 计算string的MD5哈希码，以十六进制形式返回结果 | md5(‘Th\000omas’::bytea) | 8ab2d3c9689aaf18b4958c334c82d8b1 |
| set\_bit(string, offset, newvalue) | bytea | 设置串中的位 | set\_bit(‘Th\000omas’::bytea, 45, 0) | Th\000omAs |
| set\_byte(string, offset, newvalue) | bytea | 设置串中的字节 | set\_byte(‘Th\000omas’::bytea, 4, 64) | Th\000o@as |
| sha224(bytea) | bytea | SHA-224哈希 | sha224(‘abc’) | \x23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7 |
| sha256(bytea) | bytea | SHA-256哈希 | sha256(‘abc’) | \xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad |
| sha384(bytea) | bytea | SHA-384哈希 | sha384(‘abc’) | \xcb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7 |
| sha512(bytea) | bytea | SHA-512哈希 | sha512(‘abc’) | \xddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f |

get\_byte和set\_byte把一个二进制串中的一个字节计数为字节 0。get\_bit和set\_bit在每一个字节中从右边起计数位；例如位 0 是第一个字节的最低有效位，而位 15 是第二个字节的最高有效位。

注意由于历史原因，函数md5返回的是一个十六进制编码的text值，而SHA-2函数返回类型bytea。可以使用函数encode和decode在两者之间转换，例如encode(sha256(‘abc’), ‘hex’)可以得到一个十六进制编码的文本表示。

## 位串函数和操作符 [*link*](#%e4%bd%8d%e4%b8%b2%e5%87%bd%e6%95%b0%e5%92%8c%e6%93%8d%e4%bd%9c%e7%ac%a6)

本节描述用于检查和操作位串的函数和操作符，也就是操作类型为bit和bit varying的值的函数和操作符。除了常用的比较操作符之外，还可以使用表里显示的操作符。&、|和#的位串操作数必须等长。在移位的时候，保留原始的位串的的长度，如例子所示。

**表** **位串操作符**

| 操作符 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- |
| || | 连接 | B'10001’ || B'011' | 10001011 |
| & | 按位与 | B'10001’ & B'01101' | 00001 |
| | | 按位或 | B'10001’ | B'01101' | 11101 |
| # | 按位异或 | B'10001’ # B'01101' | 11100 |
| ~ | 按位求反 | ~ B'10001' | 01110 |
| « | 按位左移 | B'10001’ « 3 | 01000 |
| » | 按位右移 | B'10001’ » 2 | 00100 |

下面的SQL标准函数除了可以用于字符串之外，也可以用于位串： length、 bit\_length、 octet\_length、 position、 substring、 overlay。

下面的函数除了可以用于二进制串之外，也可以用于位串： get\_bit、 set\_bit。 当使用于一个位串时，这些函数将串的第一（最左）位计数为位 0。

另外，我们可以在整数和bit之间来回转换。一些例子：

```
44::bit(10)                    0000101100
44::bit(3)                     100
cast(-44 as bit(12))           111111010100
'1110'::bit(4)::integer        14
```

请注意，如果只是转换为“bit”，意思是转换成bit(1)，因此只会转换整数的最低有效位。

## 模式匹配 [*link*](#%e6%a8%a1%e5%bc%8f%e5%8c%b9%e9%85%8d)

MemFireDB提供了三种独立的实现模式匹配的方法：SQL LIKE操作符、更近一些的SIMILAR TO操作符（SQL:1999 里添加进来的）和POSIX-风格的正则表达式。除了这些基本的“这个串匹配这个模式吗？”操作符外，还有一些函数可用于提取或替换匹配子串并在匹配位置分离一个串。

### LIKE [*link*](#like)

```
string LIKE pattern [ESCAPE escape-character]
string NOT LIKE pattern [ESCAPE escape-character]
```

如果该string匹配了提供的pattern，那么LIKE表达式返回真（和预期的一样，如果LIKE返回真，那么NOT LIKE表达式返回假， 反之亦然。一个等效的表达式是NOT (string LIKE pattern)）。

如果pattern不包含百分号或者下划线，那么该模式只代表它本身的串；这时候LIKE的行为就象等号操作符。在pattern里的下划线 （\_）代表（匹配）任何单个字符； 而一个百分号（%）匹配任何零或更多个字符的序列。

一些例子：

```
'abc' LIKE 'abc'    true
'abc' LIKE 'a%'     true
'abc' LIKE '_b_'    true
'abc' LIKE 'c'      false
```

LIKE模式匹配总是覆盖整个串。因此，要匹配在串内任何位置的序列，该模式必须以百分号开头和结尾。

要匹配文本的下划线或者百分号，而不是匹配其它字符， 在pattern里相应的字符必须 前导逃逸字符。缺省的逃逸字符是反斜线，但是你可以用ESCAPE子句指定一个不同的逃逸字符。 要匹配逃逸字符本身，写两个逃逸字符。

请注意反斜线在串文本里已经有特殊含义了，所以如果你写一个 包含反斜线的模式常量，那你就要在 SQL 语句里写两个反斜线。 因此，写一个匹配单个反斜线的模式实际上要在语句里写四个反斜线。 你可以通过用 ESCAPE 选择一个不同的逃逸字符 来避免这样；这样反斜线就不再是 LIKE 的特殊字符了。 但仍然是字符文本分析器的特殊字符，所以你还是需要两个反斜线。) 我们也可以通过写ESCAPE ‘‘的方式不选择逃逸字符，这样可以有效地禁用逃逸机制，但是没有办法关闭下划线和百分号在模式中的特殊含义。

关键字ILIKE可以用于替换LIKE， 它令该匹配根据活动区域成为大小写无关。这个不属于SQL标准而是一个PostgreSQL扩展。

操作符~~等效于LIKE， 而~~\*对应ILIKE。 还有 !~~和!~~\*操作符分别代表NOT LIKE和NOT ILIKE。所有这些操作符都是PostgreSQL特有的。

在仅需要从字符串的开始部分搜索的情况，还有前缀操作符^@和相应的starts\_with函数可以使用。

### SIMILAR TO正则表达式 [*link*](#similar-to%e6%ad%a3%e5%88%99%e8%a1%a8%e8%be%be%e5%bc%8f)

```
string SIMILAR TO pattern [ESCAPE escape-character]
string NOT SIMILAR TO pattern [ESCAPE escape-character]
```

SIMILAR TO操作符根据自己的模式是否匹配给定串而返回真或者假。 它和LIKE非常类似，只不过它使用 SQL 标准定义的正则表达式理解模式。 SQL 正则表达式是在LIKE标记和普通的正则表达式标记的奇怪的杂交。

类似LIKE，SIMILAR TO操作符只有在它的模式匹配整个串的时候才能成功；这一点和普通的 正则表达式的行为不同，在普通的正则表达式里，模式匹配串的任意部分。 和LIKE类似的地方还有，SIMILAR TO使用\_和%作为分别代表任意单个字符和任意串的通配符（这些可以比得上 POSIX 正则表达式里的.和.\*）。

除了这些从LIKE借用的功能之外，SIMILAR TO支持下面这些从 POSIX 正则表达式借用的 模式匹配元字符：

· |表示选择（两个候选之一）。

· \*表示重复前面的项零次或更多次。

· +表示重复前面的项一次或更多次。

· ?表示重复前面的项零次或一次。

· {m}表示重复前面的项刚好m次。

· {m,}表示重复前面的项m次或更多次。

· {m,n}表示重复前面的项至少m次并且不超过n次。

· 可以使用圆括号()把多个项组合成一个逻辑项。

· 一个方括号表达式[…]声明一个字符类，就像 POSIX 正则表达式一样。

注意点号（.）不是SIMILAR TO的一个元字符。

和LIKE一样，反斜线禁用所有这些元字符的特殊含义；当然我们也可以用ESCAPE指定一个不同的逃逸字符。

一些例子：

```
'abc' SIMILAR TO 'abc'      true
'abc' SIMILAR TO 'a'        false
'abc' SIMILAR TO '%(b|d)%'  true
'abc' SIMILAR TO '(b|c)%'   false
```

带三个参数的substring，即substring(string from pattern for escape-character)，提供了抽取一个匹配 SQL 正则表达式的子串的方法。和SIMILAR TO一样，声明的模式必须匹配整个数据串，否则函数失败并返回空值。为了标识在成功的时候应该返回的模式部分，模式 必须包含逃逸字符的两次出现，并且后面要跟上双引号（"）。匹配这两个标记之间的模式的文本将被返回。

一些例子，使用#“定界返回串：

```
substring('foobar' from '%#"o_b#"%' for '#')   oob
substring('foobar' from '#"o_b#"%' for '#')    NULL
```

### POSIX正则表达式 [*link*](#posix%e6%ad%a3%e5%88%99%e8%a1%a8%e8%be%be%e5%bc%8f)

下表列出了所有可用于 POSIX 正则表达式模式匹配的操作符。

**表 正则表达式匹配操作符**

| **操作符** | **描述** | **例子** |
| --- | --- | --- |
| ~ | 匹配正则表达式，大小写敏感 | ’thomas’ ~ ‘.*thomas.*’ |
| ~\* | 匹配正则表达式，大小写不敏感 | ’thomas’ ~\* ‘.*Thomas.*’ |
| !~ | 不匹配正则表达式，大小写敏感 | ’thomas’ !~ ‘.*Thomas.*’ |
| !~\* | 不匹配正则表达式，大小写不敏感 | ’thomas’ !~\* ‘.*vadim.*’ |

POSIX正则表达式提供了比LIKE和SIMILAR TO操作符更强大的含义。许多 Unix 工具，例如egrep、sed或awk使用一种与我们这里描述的类似的模式匹配语言。

正则表达式是一个字符序列，它是定义一个串集合 （一个正则集）的缩写。 如果一个串是正则表达式描述的正则集中的一员时， 我们就说这个串匹配该正则表达式。 和LIKE一样，模式字符准确地匹配串字符， 除非在正则表达式语言里有特殊字符 — 不过正则表达式用的 特殊字符和LIKE用的不同。 和LIKE模式不一样的是，正则表达式允许匹配串里的任何位置，除非该正则表达式显式地挂接在串的开头或者结尾。

一些例子：

```
'abc' ~ 'abc'    true
'abc' ~ '^a'     true
'abc' ~ '(b|d)'  true
'abc' ~ '^(b|c)' false
```

POSIX模式语言的详细描述见下文。

带两个参数的substring函数，即**substring(string from pattern)**，提供了抽取一个匹配 POSIX 正则表达式模式的子串的方法。如果没有匹配它返回空值，否则就是文本中匹配模式的那部分。 但是如果该模式包含任何圆括号，那么将返回匹配第一对子表达式（对应第一个左圆括号的） 的文本。如果你想在表达式里使用圆括号而又不想导致这个例外，那么你可以在整个表达式外边放上一对圆括号。 如果你需要在想抽取的子表达式前有圆括号，参阅后文描述的非捕获性圆括号。

一些例子：

```
substring('foobar' from 'o.b')     oob
substring('foobar' from 'o(.)b')   o
```

**regexp\_replace**函数提供了将匹配 POSIX 正则表达式模式的子串替换为新文本的功能。 它的语法是 **regexp\_replace(source, pattern, replacement [, flags ])**。 如果没有匹配pattern，那么返回不加修改的source串。 如果有匹配，则返回的source串里面的匹配子串将被replacement串替换掉。replacement串可以包含\n， 其中\n是 1 到 9， 表明源串里匹配模式里第n个圆括号子表达式的子串应该被插入， 并且它可以包含&表示应该插入匹配整个模式的子串。如果你需要放一个文字形式的反斜线在替换文本里，那么写\。flags参数是一个可选的文本串，它包含另个或更多单字母标志，这些标志可以改变函数的行为。标志i指定大小写无关的匹配，而标志g指定替换每一个匹配的子串而不仅仅是第一个。

一些例子：

```
regexp_replace('foobarbaz', 'b..', 'X')
                                   fooXbaz
regexp_replace('foobarbaz', 'b..', 'X', 'g')
                                   fooXX
regexp_replace('foobarbaz', 'b(..)', 'X\1Y', 'g')
                                   fooXarYXazY
```

regexp\_match返回一个文本数组，它包含一个POSIX正则表达式模式与一个字符串第一个匹配所得到的子串。其语法是**regexp\_match(string, pattern [, flags ])**。如果没有匹配，则结果为NULL。如果找到一个匹配并且pattern不包含带括号的子表达式，那么结果是一个单一元素的文本数组，其中包含匹配整个模式的子串。如果找到一个匹配并且pattern含有带括号的子表达式，那么结果是一个文本数组，其中第n个元素是与pattern的第n个圆括号子表达式匹配的子串（“非捕获”圆括号不计入在内，详见下文）。flags参数是一个可选的文本字符串，它包含零个或者更多个可以改变该函数行为的单字母标志。所支持的标志在表 中介绍。

**一些例子**：

```
SELECT regexp_match('foobarbequebaz', 'bar.*que');
 regexp_match
--------------
 {barbeque}
(1 row)

SELECT regexp_match('foobarbequebaz', '(bar)(beque)');
 regexp_match
--------------
 {bar,beque}
(1 row)
```

在通常情况下，人们只是想要的大整个匹配的子串或者NULL（没有匹配），可以写成这样

```
SELECT (regexp_match('foobarbequebaz', 'bar.*que'))[1];
 regexp_match
--------------
 barbeque
(1 row)
```

regexp\_matches函数返回一个文本数组的集合，其中包含着一个POSIX正则表达式模式与一个字符串匹配得到的子串。它和regexp\_match具有相同的语法。如果没有匹配，这个函数不会返回行。如果有一个匹配并且给定了g标志，则返回一行。如果有N个匹配并且给定了g标志，则返回N行。每一个返回的行都是一个文本数组，其中含有整个匹配的子串或者匹配pattern的圆括号子表达式的子串，这和上面对regexp\_match的介绍一样。regexp\_matches接受展示的所有标志，外加令它返回所有匹配而不仅仅是第一个匹配的g标志。

一些例子：

```
SELECT regexp_matches('foo', 'not there');
 regexp_matches
----------------
(0 rows)

SELECT regexp_matches('foobarbequebazilbarfbonk', '(b[^b]+)(b[^b]+)', 'g');
 regexp_matches
----------------
 {bar,beque}
 {bazil,barf}
(2 rows)
```

提示：在大部分情况下，regexp\_matches()应该与g标志一起使用，因为如果只是想要第一个匹配，使用regexp\_match()会更加简单高效。

regexp\_split\_to\_table把一个 POSIX 正则表达式模式当作一个定界符来分离一个串。它的语法形式是regexp\_split\_to\_table(string, pattern [, flags ])。如果没有与pattern的匹配，该函数返回string。如果有至少有一个匹配，对每一个匹配它都返回从上一个匹配的末尾（或者串的开头）到这次匹配开头之间的文本。当没有更多匹配时，它返回从上一次匹配的末尾到串末尾之间的文本。flags参数是一个可选的文本串，它包含零个或更多单字母标志，这些标识可以改变该函数的行为。regexp\_split\_to\_table能支持的标志在表 9.22中描述。

regexp\_split\_to\_array函数的行为和regexp\_split\_to\_table相同，不过regexp\_split\_to\_array会把它的结果以一个text数组的形式返回。它的语法是regexp\_split\_to\_array(string, pattern [, flags ])。这些参数和regexp\_split\_to\_table的相同。

一些例子：

```
SELECT foo FROM regexp_split_to_table('the quick brown fox jumps over the lazy dog', '\s+') AS foo;
  foo
-------
 the
 quick
 brown
 fox
 jumps
 over
 the
 lazy
 dog
(9 rows)

SELECT regexp_split_to_array('the quick brown fox jumps over the lazy dog', '\s+');
              regexp_split_to_array
-----------------------------------------------
 {the,quick,brown,fox,jumps,over,the,lazy,dog}
(1 row)

SELECT foo FROM regexp_split_to_table('the quick brown fox', '\s*') AS foo;
 foo
-----
 t
 h
 e
 q
 u
 i
 c
 k
 b
 r
 o
 w
 n
 f
 o
 x
(16 rows)
```

正如上一个例子所示，正则表达式分离函数会忽略零长度的匹配，这种匹配发生在串的开头或结尾或者正好发生在前一个匹配之后。这和正则表达式匹配的严格定义是相悖的，后者由regexp\_match和regexp\_matches实现，但是通常前者是实际中最常用的行为。其他软件系统如Perl也使用相似的定义。

#### **正则表达式细节** [*link*](#%e6%ad%a3%e5%88%99%e8%a1%a8%e8%be%be%e5%bc%8f%e7%bb%86%e8%8a%82)

正则表达式（RE），在POSIX 1003.2 中定义， 它有两种形式：扩展的RE或者是ERE（大概地说就是那些在egrep里的）， 基本的RE或者是BRE（大概地说就是那些在ed里的）。MemFireDB支持两种形式，并且还实现了一些POSIX标准中没有但是在类似 Perl 或者 Tcl 这样的语言中得到广泛应用的一些扩展。使用了那些非POSIX扩展的RE叫高级RE， 或者本文档里说的ARE。ARE 几乎完全是 ERE 的超集，但是 BRE 有几个符号上的不兼容（以及更多的限制）。我们首先描述 ARE 和 ERE 形式， 描述那些只适用于 ARE 的特性，然后描述 BRE 的区别是什么。

**注意**:

一个正则表达式被定义为一个或更多分支，它们之间被|分隔。只要能匹配其中一个分支的东西都能匹配正则表达式。

一个分支是一个或多个量化原子或者约束连接而成。一个原子匹配第一个，然后后面的原子匹配第二个， 以此类推；一个空分支匹配空串。

一个量化原子是一个原子， 后面可能跟着一个量词。没有量词的时候，它匹配一个原子， 有量词的时候，它可以匹配若干个原子。

一个约束匹配一个空串，但只是在满足特定条件下才匹配。 约束可以在能够使用原子的地方使用，只是它不能跟着量词。简单的约束在表里显示； 更多的约束稍后描述。

**表.正则表达式原子**

| 原子 | 描述 |
| --- | --- |
| (re) | （其中re是任何正则表达式） 匹配一个对re的匹配，匹配将为可能的报告被记下 |
| (?:re) | 同上，但是匹配不会为了报告而被记下 （一个“非捕获”圆括号集） （只对 ARE） |
| . | 匹配任意单个字符 |
| [chars] | 一个方括号表达式， 匹配chars中的任意一个（详见第 9.7.3.2 节） |
| \k | （其中k是一个非字母数字字符） 匹配一个被当作普通字符看待的特定字符， 例如，\匹配一个反斜线字符 |
| \c | 其中c是一个字母数字 （可能跟着其它字符），它是一个逃逸， 参阅第 9.7.3.3 节（仅对 ARE； 在 ERE 和 BRE 中，它匹配c） |
| { | 如果后面跟着一个字符，而不是数字， 那么就匹配左花括弧{；如果跟着一个数字， 那么它是range的开始（见下文） |
| x | 其中x是一个没有其它意义的单个字符，则匹配该字符 |

RE 不能以反斜线（\）结尾。

注意:如果你关掉了standard\_conforming\_strings，任何你写在文字串常量中的反斜线都需要被双写。

表 . 正则表达式量词

| 量词 | 匹配 |
| --- | --- |
| \* | 一个由原子的 0 次或更多次匹配组成的序列 |
| + | 一个由原子的 1 次或更多次匹配组成的序列 |
| ? | 一个由原子的 0 次或 1 次匹配组成的序列 |
| {m} | 一个由原子的正好m次匹配组成的序列 |
| {m,} | 一个由原子的m次或更多次匹配组成的序列 |
| {m,n} | 一个由原子的从m次到n次（包括）匹配组成的序列；m不能超过n |
| \*? | \*的非贪婪版本 |
| +? | +的非贪婪版本 |
| ?? | ?的非贪婪版本 |
| {m}? | {m}的非贪婪版本 |
| {m,}? | {m,}的非贪婪版本 |
| {m,n}? | {m,n}的非贪婪版本 |

使用{…}的形式被称作范围。 一个范围内的数字m和n都是无符号十进制整数， 允许的数值从 0 到 255（包含）。

非贪婪的量词（只在 ARE 中可用）匹配对应的正常 （贪婪）模式，区别是它寻找最少的匹配，而不是最多的匹配。

注意:一个量词不能紧跟在另外一个量词后面，例如\*\*是非法的。量词不能作为表达式或者子表达式的开头，也不能跟在^或者|后面。

表 正则表达式约束

| 约束 | 描述 |
| --- | --- |
| ^ | 串开头的匹配 |
| $ | 串末尾的匹配 |
| (?=re) | 在匹配re的子串开始的任何点的positive lookahead匹配（只对 ARE） |
| (?!re) | 在匹配re的子串开始的任何点的negative lookahead匹配（只对 ARE） |
| (?<=re) | 只要有一个点上有一个子串匹配re端， positive lookbehind就在这个点上匹配（只对 ARE） |
| (?<!re) | 只要有一个点上没有子串匹配re端， negative lookbehind就在这个点上匹配（只对 ARE） |

#### **方括号表达式** [*link*](#%e6%96%b9%e6%8b%ac%e5%8f%b7%e8%a1%a8%e8%be%be%e5%bc%8f)

方括号表达式是一个包围在[]中的字符列表。它通常匹配列表中的任意单个字符（但见下文）。 如果列表以^开头，它匹配任意单个不在该列表参与部分中的字符。如果该列表中两个字符用-隔开， 那它就是那两个字符（包括在内）之间的所有字符范围的缩写，例如，在ASCII中[0-9]匹配任何十进制数字。两个范围共享一个端点是非法的，例如，a-c-e。范围与字符集关系密切， 可移植的程序应该避免依靠它们。

想在列表中包含文本]，可以让它做列表的首字符（如果使用了^，需要放在其后）。 想在列表中包含文本-，可以让它做列表的首字符或者尾字符，或者一个范围的第二个端点。 想在列表中把文本-当做范围的起点， 把它用[.和.]包围起来，这样它就成为一个排序元素（见下文）。 除了这些字符本身、一些用[的组合（见下段）以及逃逸（只在 ARE 中有效）以外，所有其它特殊字符 在方括号表达式里都失去它们的特殊含义。特别是，在 ERE 和 BRE 规则下\不是特殊的， 但在 ARE 里，它是特殊的（引入一个逃逸）。

在一个方括号表达式里，一个排序元素（一个字符、一个被当做一个单一字符排序的多字符序列或者一个表示上面两种情况的排序序列名称） 包含在[.和.]里面的时候表示该排序元素的字符序列。该序列被当做该方括号列表 的一个单一元素。这允许一个包含多字符排序元素的方括号表达式去匹配多于一个字符，例如，如果排序序列包含一个ch排序元素， 那么 RE [[.ch.]]\*c匹配chchcc的头五个字符。

在方括号表达式里，包围在[=和=]里的排序元素是一个等价类， 代表等效于那一个的所有排序元素的字符序列，包括它本身（如果没有其它等效排序元素，那么就好象封装定界符是[.和 .]）。例如，如果o和^是一个等价类的成员，那么[[=o=]]、[[=^=]]和[o^]都是同义的。一个等价类不能是一个范围的端点。

在方括号表达式里，在[:和:]里面封装的字符类的名字代表属于该类的所有字符的列表。 标准的字符类名字是：alnum、 alpha、blank、 cntrl、digit、 graph、lower、 print、punct、 space、upper、 xdigit。 它们代表在ctype中定义的字符类。 一个区域可以会提供其他的类。字符类不能用做一个范围的端点。

方括号表达式里有两个特例：方括号表达式[[:<:]]和[[:>:]]是约束，分别匹配一个单词开头和结束的空串。 单词定义为一个单词字符序列，前面和后面都没有其它单词字符。单词字符是一个alnum字符（和ctype中定义的一样） 或者一个下划线。这是一个扩展，兼容POSIX 1003.2， 但那里面并没有说明， 而且在准备移植到其他系统里去的软件里一定要小心使用。通常下文描述的约束逃逸更好些（它们并非更标准，但是更容易键入）。

#### **正则表达式逃逸** [*link*](#%e6%ad%a3%e5%88%99%e8%a1%a8%e8%be%be%e5%bc%8f%e9%80%83%e9%80%b8)

逃逸是以\开头，后面跟着一个字母数字字符得特殊序列。 逃逸有好几种变体：字符项、类缩写、约束逃逸以及后引用。在 ARE 里， 如果一个\后面跟着一个字母数字，但是并未组成一个合法的逃逸， 那么它是非法的。在 ERE 中没有逃逸：在方括号表达式之外，一个后面跟着字母数字字符的\只是表示该字符是一个普通的字符，而且在一个方括号表达式里，\是一个普通的字符（后者实际上在 ERE 和 ARE 不兼容）。

字符项逃逸用于便于我们在 RE 中声明那些不可打印的或其他习惯的字符。

类缩写逃逸用来提供一些常用的字符类缩写。。

约束逃逸是一个约束，如果满足特定的条件，它匹配该空串。

后引用（\n）匹配数字\n指定的被前面的圆括号子表达式匹配的同一个串。例如， ([bc])\1匹配bb或者cc， 但是不匹配bc或者cb。RE 中子表达式必须完全在后引用前面。子表达式以它们的先导圆括号的顺序编号。非捕获圆括号并不定义子表达式。

**表 正则表达式字符项逃逸**

| 逃逸 | 描述 |
| --- | --- |
| \a | 警告（响铃）字符，和 C 中一样 |
| \b | 退格，和 C 中一样 |
| \B | 反斜线（\）的同义词，用来减少双写反斜线 |
| \cX | （其中X是任意字符）低序5位和X相同的字符，它的其他位都是零 |
| \e | 排序序列名为ESC的字符，如果无法做到该字符为八进制值 033 |
| \f | 换页，和 C 中一样 |
| \n | 新行，和 C 中一样 |
| \r | 回车，和 C 中一样 |
| \t | 水平制表符，和 C 中一样 |
| \uwxyz | （其中wxyz正好是四个十六进制位）十六进制值为0xwxyz的字符 |
| \Ustuvwxyz | （其中stuvwxyz正好是八个十六进制位）十六进制值为0xstuvwxyz的字符 |
| \v | 垂直制表符，和 C 中一样 |
| \xhhh | （其中hhh是十六进制位的任意序列）十六进制值为0xhhh的字符（一个单一字符，不管用了多少个十六进制位） |
| \0 | 值为0（空字节）的字符 |
| \xy | （其中xy正好是两个八进制位，并且不是一个后引用）八进制值为0xy的字符 |
| \xyz | （其中xyz正好是三个八进制位，并且不是一个后引用）八进制值为0xyz的字符 |

十六进制位是0-9、a-f和A-F。八进制位是0-7。

指定 ASCII 范围（0-127）之外的值的数字字符项转义的含义取决于数据库编码。 当编码是 UTF-8 时，转义值等价于 Unicode 代码点，例如 \u1234表示字符U+1234。对于其他多字节编码， 字符项转义通常只是指定该字符的字节值的串接。如果该转义值不对应数据库编码 中的任何合法字符，将不会发生错误，但是它不会匹配任何数据。

字符项逃逸总是被当作普通字符。例如，\135是 ASCII 中的]， 但\135并不终止一个方括号表达式。

**表 正则表达式类缩写逃逸**

| 逃逸 | 描述 |
| --- | --- |
| \d | `[[:digit:]]` |
| \s | `[[:space:]]` |
| \w | `[[:alnum:]_]`（注意下划线是被包括的） |
| \D | `[^[:digit:]]` |
| \S | `[^[:space:]]` |
| \W | `[^[:alnum:]_]` （注意下划线是被包括的） |

在方括号表达式里，\d、\s和\w会失去它们的外层方括号，而\D、\S和 \W是非法的（也就是说，例如[a-c\d]等效于[a-c[:digit:]]。同样[a-c\D]等效于 `[a-c^[:digit:]]`的，也是非法的）。

**表.正则表达式约束逃逸**

| 逃逸 | 描述 |
| --- | --- |
| \A | 只在串开头匹配 |
| \m | 只在一个词的开头匹配 |
| \M | 只在一个词的末尾匹配 |
| \y | 只在一个词的开头或末尾匹配 |
| \Y | 只在一个词的不是开头或末尾的点上匹配 |
| \Z | 只在串的末尾匹配 |

一个词被定义成在上面[[:<:]]和[[:>:]]中的声明。在方括号表达式里，约束逃逸是非法的。

**表 正则表达式后引用**

| 逃逸 | 描述 |
| --- | --- |
| \m | （其中m是一个非零位）一个到第m个子表达式的后引用 |
| \mnn | （其中m是一个非零位，并且nn是一些更多的位，并且十六进制值mnn不超过目前能看到的封闭捕获圆括号的数目）一个到第mnn个子表达式的后引用 |

注意

在八进制字符项逃逸和后引用之间有一个历史继承的歧义存在，这个歧义是 通过下面的启发式规则解决的，像上面描述地那样。前导零总是表示这是一个八进制逃逸。 而单个非零数字，如果没有跟着任何其它位，那么总是被认为后引用。 一个多位的非零开头的序列也被认为是后引用，只要它出现在合适的子表达式后面 （也就是说，在后引用的合法范围中的数），否则就被认为是一个八进制。

#### **正则表达式元语法** [*link*](#%e6%ad%a3%e5%88%99%e8%a1%a8%e8%be%be%e5%bc%8f%e5%85%83%e8%af%ad%e6%b3%95)

除了上面描述的主要语法之外，还有几种特殊形式和杂项语法。

如果一个 RE 以\*\*\*:开头，那么剩下的 RE 都被当作 ARE。如果一个 RE 以\*\*\*=开头， 那么剩下的 RE 被当作一个文本串，所有的字符都被认为是一个普通字符。

一个 ARE 可以以嵌入选项开头：一个序列(?xyz)（这里的xyz是一个或多个字母字符）声明影响剩余 RE 的选项。 这些选项覆盖任何前面判断的选项 — 特别地，它们可以覆盖一个正则表达式操作符隐含的大小写敏感的行为，或者覆盖flags参数中的正则表达式函数。可用的选项字母在表中显示。注意这些同样的选项字母也被用在正则表达式函数的flags参数中。

**表 ARE嵌入选项字母**

| 选项 | 描述 |
| --- | --- |
| b | RE的剩余部分是一个BRE |
| c | 大小写敏感的匹配（覆盖操作符类型） |
| e | RE的剩余部分是一个ERE |
| i | 大小写不敏感的匹配（覆盖操作符类型） |
| m | n的历史原因的同义词 |
| n | 新行敏感的匹配 |
| p | 部分新行敏感的匹配 |
| q | RE的剩余部分是一个文字（“quoted”）串，全部是普通字符 |
| s | 非新行敏感的匹配（默认） |
| t | 紧语法（默认，见下文） |
| w | 逆部分新行敏感（“怪异”）的匹配 |
| x | 扩展语法（见下文） |

嵌入选项在)终止序列时发生作用。它们只在 ARE 的开始处起作用 （在任何可能存在的\*\*\*:控制器后面）。

除了通常的（紧）RE 语法（这种情况下所有字符都有效）， 还有一种扩展语法，可以通过声明嵌入的x选项获得。在扩展语法里，RE 中的空白字符被忽略，就像那些在#和其后的新行（或 RE 的末尾）之间的字符一样。这样就允许我们给一个复杂的 RE 分段和注释。不过这个基本规则有三种例外：

· 空白字符或前置了\的#将被保留

· 方括号表达式里的空白或者#将被保留

· 在多字符符号里面不能出现空白和注释，例如(?:

为了这个目的，空白是空格、制表符、新行和任何属于空白字符类的字符。

最后，在 ARE 里，方括号表达式外面，序列(?#ttt)（其中ttt是任意不包含一个))的文本）是一个注释， 它被完全忽略。同样，这样的东西是不允许出现在多字符符号的字符中间的，例如 (?:。这种注释更像是一种历史产物而不是一种有用的设施，并且它们的使用已经被废弃；请使用扩展语法来替代。

如果声明了一个初始的\*\*\*=控制器，那么所有这些元语法扩展都不能使用，因为这样表示把用户输入当作一个文字串而不是 RE 对待。

#### **正则表达式匹配规则** [*link*](#%e6%ad%a3%e5%88%99%e8%a1%a8%e8%be%be%e5%bc%8f%e5%8c%b9%e9%85%8d%e8%a7%84%e5%88%99)

在 RE 可以在给定串中匹配多于一个子串的情况下， RE 匹配串中最靠前的那个子串。如果 RE 可以匹配在那个位置开始 的多个子串，要么是取最长的子串，要么是最短的，具体哪种， 取决于 RE 是贪婪的还是非贪婪的。

一个 RE 是否贪婪取决于下面规则：

· 大多数原子以及所有约束，都没有贪婪属性（因为它们毕竟无法匹配个数变化的文本）。

· 在一个 RE 周围加上圆括号并不会改变其贪婪性。

· 带一个固定重复次数量词 （{m}或者{m}?） 的量化原子和原子自身具有同样的贪婪性（可能是没有）。

· 一个带其他普通的量词（包括{m,n}中m等于n的情况）的量化原子是贪婪的（首选最长匹配）。

· 一个带非贪婪量词（包括{m,n}?中m等于 n的情况）的量化原子是非贪婪的（首选最短匹配）。

· 一个分支 — 也就是说，一个没有顶级|操作符的 RE — 和它里面的第一个有贪婪属性的量化原子有着同样的贪婪性。

· 一个由|操作符连接起来的两个或者更多分支组成的 RE 总是贪婪的。

上面的规则所描述的贪婪属性不仅仅适用于独立的量化原子， 而且也适用于包含量化原子的分支和整个 RE。这里的意思是， 匹配是按照分支或者整个 RE 作为一个整体匹配最长或者最短的可能子串。 一旦整个匹配的长度确定，那么匹配任意特定子表达式的部分就基于该子表达式的贪婪属性进行判断，在 RE 里面靠前的子表达式的优先级高于靠后的子表达式。

一个相应的例子：

```
SELECT SUBSTRING('XY1234Z', 'Y*([0-9]{1,3})');
结果：123
SELECT SUBSTRING('XY1234Z', 'Y*?([0-9]{1,3})');
结果：1
```

在第一个例子里，RE 作为整体是贪婪的，因为Y*是贪婪的。它可以匹配从Y开始的东西，并且它匹配从这个位置开始的最长的串， 也就是，Y123。输出是这里的圆括号包围的部分，或者说是123。在第二个例子里， RE 总体上是一个非贪婪的 RE，因为Y*?是非贪婪的。它可以匹配从Y开始的最短的子串，也就是说Y1。子表达式[0-9]{1,3}是贪婪的，但是它不能修改总体匹配长度的决定； 因此它被迫只匹配1。

简而言之，如果一个 RE 同时包含贪婪和非贪婪的子表达式，那么总的匹配长度要么是尽可能长，要么是尽可能短，这取决于给整个 RE 赋予的属性。给子表达式赋予的属性只影响在这个匹配里，各个子表达式之间相互允许“吃掉”的多少。

量词{1,1}和{1,1}?可以分别用于在一个子表达式 或者整个 RE 上强制贪婪或者非贪婪。当需要整个 RE 具有不同于从其元素中 推导出的贪婪属性时，这很有用。例如，假设我们尝试将一个包含一些数字的 字符串分隔成数字以及在它们之前和之后的部分，我们可能会尝试这样做：

```
SELECT regexp_matches('abc01234xyz', '(.*)(\d+)(.*)');
Result: {abc0123,4,xyz}
```

这不会有用：第一个.\*是贪婪的，因此它会“吃掉” 尽可能多的字符而留下\d+去匹配在最后一个可能位置上的最 后一个数字。我们可能会通过让它变成非贪婪来修复：

```
SELECT regexp_matches('abc01234xyz', '(.*?)(\d+)(.*)');
Result: {abc,0,""}
```

这也不会有用：因为现在 RE 作为整体来说是非贪婪的，因此它会尽快结束 全部的匹配。我们可以通过强制 RE 整体是贪婪的来得到我们想要的：

```
SELECT regexp_matches('abc01234xyz', '(?:(.*?)(\d+)(.*)){1,1}');
Result: {abc,01234,xyz}
```

独立于 RE 的组件的贪婪性之外控制 RE 的整体贪婪性为处理变长模式提供了 很大的灵活性。

在决定更长或者更短的匹配时，匹配长度是以字符衡量的，而不是排序元素。一个空串会被认为比什么都不匹配长。例如：bb*匹配abbbc的中间三个字符；(week|wee)(night|knights)匹配weeknights的所有十个字符； 而(.*).*匹配 abc的时候，圆括号包围的子表达式匹配所有三个字符；当(a*)\*被拿来匹配bc时，整个 RE 和圆括号 子表达式都匹配一个空串。

如果声明了大小写无关的匹配，那么效果就好像所有大小写区别在字母表中消失了。如果在多个情况中一个字母以一个普通字符的形式出现在方括号表达式外面，那么它实际上被转换成 一个包含大小写的方括号表达式，也就是说，x 变成 [xX]。 如果它出现在一个方括号表达式里面，那么它的所有大小写的同族都被加入 方括号表达式中，也就是说，x变成[xX]。当它出现在一个方括号表达式内时，它的所有大小写副本都被加入到方括号表达式中，例如， [x]会变成[xX]，而[^x]会变成[^xX]。

如果指定了新行敏感的匹配，.和使用^的方括号表达式 将永远不会匹配新行字符（这样，匹配就绝对不会跨越新行，除非 RE 显式地安排了这样的情况）并且^和$除了分别匹配串开头和结尾之外，还将分别匹配新行后面和前面的空串。但是 ARE 逃逸\A和\Z仍然只匹配串的开头和结尾。

如果指定了部分新行敏感的匹配，那么它影响.和方括号表达式， 这个时候和新行敏感的匹配一样，但是不影响^和$。

如果指定了逆新行敏感匹配，那么它影响^和$，其作用和在新行敏感的匹配里一样，但是不影响.和方括号表达式。这个并不是很有用，只是为了满足对称性而提供的。

#### **限制和兼容性** [*link*](#%e9%99%90%e5%88%b6%e5%92%8c%e5%85%bc%e5%ae%b9%e6%80%a7)

在这个实现里，对 RE 的长度没有特别的限制。但是，那些希望高移植性的程序应该避免使用长度超过 256 字节的 RE，因为 POSIX 兼容 的实现可以拒绝接受这样的 RE。

ARE 实际上和 POSIX ERE 不兼容的唯一的特性是在方括号表达式里\并不失去它特殊的含义。所有其它 ARE 特性都使用在 POSIX ERE 里面是非法或者是未定义、未声明效果的语法；指示器的\*\*\*就是在 POSIX 的 BRE 和 ERE 之外的语法。

许多 ARE 扩展都是从 Perl 那里借来的（但是有些被做了修改来清理它们），以及一些 Perl 里没有出现的扩展。要注意的不兼容性包括\b、\B、对结尾的新行缺乏特别的处理、对那些被新行敏感匹配的东西附加的补齐方括号表达式、在 lookahead/lookbehind 约束里对圆括号和后引用的限制以及最长/最短 匹配（而不是第一匹配）的语义。

在 ARE 中，后面跟着一个字母数字字符的\要么是一个逃逸要么是一个错误， 但是在以前的版本里，它只是写该字母数字字符的另外一种方法。这个应该不是什么问题， 因为在以前的版本里没有什么理由会让我们写这样的序列。

在 ARE 里，\在[]里还是一个特殊字符， 因此在方括号表达式里的一个文本\必须被写成\。

#### **基本正则表达式** [*link*](#%e5%9f%ba%e6%9c%ac%e6%ad%a3%e5%88%99%e8%a1%a8%e8%be%be%e5%bc%8f)

BRE 在几个方面和 ERE 不太一样。在 BRE 中，|、+和?都是普通字符并且没有与它们功能等价的东西。范围的定界符是{和}， 因为 {和}本身是普通字符。嵌套的子表达式的圆括号是(和)，因为(和)自身是普通字符。除非在 RE 开头或者是圆括号子表达式开头，^都是一个普通字符。 除非在 RE 结尾或者是圆括号子表达式的结尾，$是一个普通字符。如果\*出现在 RE 开头或者是圆括号封装的子表达式开头 （前面可能有^），那么它是个普通字符。最后，可以用单数字的后引用，<和>分别是[[:<:]]和[[:>:]]的同义词；在 BRE 中没有其它可用的逃逸。

## 数据类型格式化函数 [*link*](#%e6%95%b0%e6%8d%ae%e7%b1%bb%e5%9e%8b%e6%a0%bc%e5%bc%8f%e5%8c%96%e5%87%bd%e6%95%b0)

格式化函数提供一套强大的工具用于把各种数据类型 （日期/时间、整数、浮点、数字） 转换成格式化的字符串以及反过来从格式化的字符串转换成 指定的数据类型。。这些函数都遵循一个公共的调用规范： 第一个参数是待格式化的值，而第二个是一个定义输出或输入格式的模板。

**表 格式化函数**

| 函数 | 返回类型 | 描述 | 例子 |
| --- | --- | --- | --- |
| to\_char(timestamp, text) | text | 把时间戳转成字符串 | to\_char(current\_timestamp, `'HH12:MI:SS'`) |
| to\_char(interval, text) | text | 把间隔转成字符串 | to\_char(interval ‘15h 2m 12s’, `'HH24:MI:SS'`) |
| to\_char(int, text) | text | 把整数转成字符串 | to\_char(125, ‘999’) |
| to\_char(double precision, text) | text | 把实数或双精度转成字符串 | to\_char(125.8::real, ‘999D9’) |
| to\_char(numeric, text) | text | 把数字转成字符串 | to\_char(-125.8, ‘999D99S’) |
| to\_date(text, text) | date | 把字符串转成日期 | to\_date(‘05 Dec 2000’, ‘DD Mon YYYY’) |
| to\_number(text, text) | numeric | 把字符串转成数字 | to\_number(‘12,454.8-’, ‘99G999D9S’) |
| to\_timestamp(text, text) | timestamp with time zone | 把字符串转成时间戳 | to\_timestamp(‘05 Dec 2000’, ‘DD Mon YYYY’) |

注意:还有一个单一参数的to\_timestamp函数。

提示:to\_timestamp和to\_date存在的目的是为了处理无法用简单造型转换的输入格式。对于大部分标准的日期/时间格式，简单地把源字符串造型成所需的数据类型是可以的，并且简单很多。类似地，对于标准的数字表示形式，to\_number也是没有必要的。

在一个to\_char输出模板串中，一些特定的模式可以被识别并且被替换成基于给定值的被恰当地格式化的数据。任何不属于模板模式的文本都简单地照字面拷贝。同样，在一个输入 模板串里（对其他函数），模板模式标识由输入数据串提供的值。如果在模板字符串中有不是模板模式的字符，输入数据字符串中的对应字符会被简单地跳过（不管它们是否等于模板字符串字符）。

[表 ]展示了可以用于格式化日期和时间值的模版。

**表 .用于日期/时间格式化的模板模式**

| 模式 | 描述 |
| --- | --- |
| HH | 一天中的小时 （01-12） |
| HH12 | 一天中的小时 （01-12） |
| HH24 | 一天中的小时 （00-23） |
| MI | 分钟 （00-59）minute (00-59) |
| SS | 秒（00-59） |
| MS | 毫秒（000-999） |
| US | 微秒（000000-999999） |
| SSSS | 午夜后的秒（0-86399） |
| AM, am, PM or pm | 正午指示器（不带句号） |
| A.M., a.m., P.M. or p.m. | 正午指示器（带句号） |
| Y,YYY | 带逗号的年（4 位或者更多位） |
| YYYY | 年（4 位或者更多位） |
| YYY | 年的后三位 |
| YY | 年的后两位 |
| Y | 年的最后一位 |
| IYYY | ISO 8601 周编号方式的年（4 位或更多位） |
| IYY | ISO 8601 周编号方式的年的最后 3 位 |
| IY | ISO 8601 周编号方式的年的最后 2 位 |
| I | ISO 8601 周编号方式的年的最后一位 |
| BC, bc, AD或者ad | 纪元指示器（不带句号） |
| B.C., b.c., A.D.或者a.d. | 纪元指示器（带句号） |
| MONTH | 全大写形式的月名（空格补齐到 9 字符） |
| Month | 全首字母大写形式的月名（空格补齐到 9 字符） |
| month | 全小写形式的月名（空格补齐到 9 字符） |
| MON | 简写的大写形式的月名（英文 3 字符，本地化长度可变） |
| Mon | 简写的首字母大写形式的月名（英文 3 字符，本地化长度可变） |
| mon | 简写的小写形式的月名（英文 3 字符，本地化长度可变） |
| MM | 月编号（01-12） |
| DAY | 全大写形式的日名（空格补齐到 9 字符） |
| Day | 全首字母大写形式的日名（空格补齐到 9 字符） |
| day | 全小写形式的日名（空格补齐到 9 字符） |
| DY | 简写的大写形式的日名（英语 3 字符，本地化长度可变） |
| Dy | 简写的首字母大写形式的日名（英语 3 字符，本地化长度可变） |
| dy | 简写的小写形式的日名（英语 3 字符，本地化长度可变） |
| DDD | 一年中的日（001-366） |
| IDDD | ISO 8601 周编号方式的年中的日（001-371，年的第 1 日时第一个 ISO 周的周一） |
| DD | 月中的日（01-31） |
| D | 周中的日，周日（1）到周六（7） |
| ID | 周中的 ISO 8601 日，周一（1）到周日（7） |
| W | 月中的周（1-5）（第一周从该月的第一天开始） |
| WW | 年中的周数（1-53）（第一周从该年的第一天开始） |
| IW | ISO 8601 周编号方式的年中的周数（01 - 53；新的一年的第一个周四在第一周） |
| CC | 世纪（2 位数）（21 世纪开始于 2001-01-01） |
| J | 儒略日（从午夜 UTC 的公元前 4714 年 11 月 24 日开始的整数日数） |
| Q | 季度（to\_date和to\_timestamp会忽略） |
| RM | 大写形式的罗马计数法的月（I-XII；I 是 一月） |
| rm | 小写形式的罗马计数法的月（i-xii；i 是 一月） |
| TZ | 大写形式的时区缩写（仅在to\_char中支持） |
| tz | 小写形式的时区缩写（仅在to\_char中支持） |
| TZH | 时区的小时 |
| TZM | 时区的分钟 |
| OF | 从UTC开始的时区偏移（仅在to\_char中支持） |

修饰语可以被应用于模板模式来修改它们的行为。例如，FMMonth就是带着FM修饰语的Month模式。展示了可用于日期/时间格式化的修饰语模式。

**表. 用于日期/时间格式化的模板模式修饰语**

| 修饰语 | 描述 | 例子 |
| --- | --- | --- |
| FM prefix | 填充模式（抑制前导零和填充的空格） | FMMonth |
| TH suffix | 大写形式的序数后缀 | DDTH, e.g., 12TH |
| th suffix | 小写形式的序数后缀 | DDth, e.g., 12th |
| FX prefix | 固定的格式化全局选项（见使用须知） | FX Month DD Day |
| TM prefix | 翻译模式（基于[lc\_time]打印本地化的日和月名） | TMMonth |
| SP suffix | 拼写模式（未实现） | DDSP |

日期/时间格式化的使用须知：

· FM抑制前导的零或尾随的空白， 否则会把它们增加到输入从而把一个模式的输出变成固定宽度。FM只修改下一个声明，而在 Oracle 中，FM影响所有随后的声明，并且重复的FM修饰语将触发填充模式开和关。

· TM不包括结尾空白。to\_timestamp和to\_date会忽略TM修饰语。

· 如果没有使用FX选项，to\_timestamp和to\_date会跳过输入字符串中的多个空白。例如，to\_timestamp(‘2000 JUN’, ‘YYYY MON’)是正确的，但to\_timestamp(‘2000 JUN’, ‘FXYYYY MON’)会返回一个错误，因为to\_timestamp只期望一个空白。FX必须被指定为模板中的第一个项。

· 在to\_char模板里可以有普通文本，并且它们会被照字面输出。你可以把一个子串放到双引号里强迫它被解释成一个文本，即使它里面包含模板模式也如此。例如，在 ‘“Hello Year “YYYY’中，YYYY将被年份数据代替，但是Year中单独的Y不会。在to\_date、to\_number以及to\_timestamp中，文本和双引号字符串会导致跳过该字符串中所包含的字符数量，例如"XX"会跳过两个输入字符（不管它们是不是XX）。

· 如果你想在输出里有双引号，那么你必须在它们前面放反斜线，例如 ‘"YYYY Month"’。不然，在双引号字符串外面的反斜线就不是特殊的。在双引号字符串内，反斜线会导致下一个字符被取其字面形式，不管它是什么字符（但是这没有特殊效果，除非下一个字符是一个双引号或者另一个反斜线）。

· 在to\_timestamp和to\_date中，如果年份格式声明少于四位（如YYY）并且提供的年份少于四位，年份将被调整为最接近于 2020 年，例如95会变成 1995。

· 在to\_timestamp和to\_date中，在处理超过4位数的年份时，YYYY转换具有限制。你必须在YYYY后面使用一些非数字字符或者模板， 否则年份总是被解释为 4 位数字。例如（对于 20000 年）：to\_date(‘200001131’, ‘YYYYMMDD’)将会被解释成一个 4 位数字的年份，而不是在年份后使用一个非数字分隔符，像to\_date(‘20000-1131’, ‘YYYY-MMDD’)或to\_date(‘20000Nov31’, ‘YYYYMonDD’)。

· 在to\_timestamp和to\_date中，CC（世纪）字段会被接受，但是如果有YYY、YYYY或者Y,YYY字段则会忽略它。如果CC与YY或Y一起使用，则结果被计算为指定世纪中的那一年。如果指定了世纪但是没有指定年，则会假定为该世纪的第一年。

· 在to\_timestamp和to\_date中，工作日名称或编号（DAY、D以及相关的字段类型）会被接受，但会为了计算结果的目的而忽略。季度（Q）字段也是一样。

· 在to\_timestamp和to\_date中，一个 ISO 8601 周编号的日期（与一个格里高利日期相区别）可以用两种方法之一被指定为to\_timestamp和to\_date：

n 年、周编号和工作日：例如to\_date(‘2006-42-4’, ‘IYYY-IW-ID’)返回日期2006-10-19。如果你忽略工作日，它被假定为 1（周一）。

n 年和一年中的日：例如to\_date(‘2006-291’, ‘IYYY-IDDD’)也返回2006-10-19。

尝试使用一个混合了 ISO 8601 周编号和格里高利日期的域来输入一个日期是无意义的，并且将导致一个错误。在一个 ISO 周编号的年的环境下，一个“月”或“月中的日”的概念没有意义。在一个格里高利年的环境下，ISO 周没有意义。用户应当避免混合格里高利和 ISO 日期声明。

小心:虽然to\_date将会拒绝混合使用格里高利和 ISO 周编号日期的域， to\_char却不会，因为YYYY-MM-DD (IYYY-IDDD) 这种输出格式也会有用。但是避免写类似IYYY-MM-DD的东西，那会得到在 起始年附近令人惊讶的结果。

· 在to\_timestamp中，毫秒（MS）和微秒（US）域都被用作小数点后的秒位。例如to\_timestamp(‘12.3’, ‘SS.MS’)不是 3 毫秒, 而是 300，因为该转换把它看做 12 + 0.3 秒。这意味着对于格式SS.MS而言，输入值12.3、12.30和12.300指定了相同数目的毫秒。要得到三毫秒，你必须使用 12.003，转换会把它看做 12 + 0.003 = 12.003 秒。

· 下面是一个更复杂的例子∶to\_timestamp(`'15:12:02.020.001230'`, `'HH24:MI:SS.MS.US'`)是 15 小时、12 分钟和 2 秒 + 20 毫秒 + 1230微秒 = 2.021230 秒。

· to\_char(…, ‘ID’)的一周中日的编号匹配extract(isodow from …)函数，但是to\_char(…, ‘D’)不匹配extract(dow from …)的日编号。

· to\_char(interval)格式化HH和HH12为显示在一个 12 小时的时钟上，即零小时和 36 小时输出为12，而HH24会输出完整的小时值，对于间隔它可以超过 23.

表展示了可以用于格式化数字值的模版模式。

**表 . 用于数字格式化的模板模式**

| 模式 | 描述 |
| --- | --- |
| 9 | 数位（如果无意义可以被删除） |
| 0 | 数位（即便没有意义也不会被删除） |
| . (period) | 小数点 |
| , (comma) | 分组（千）分隔符 |
| PR | 尖括号内的负值 |
| S | 带符号的数字（使用区域） |
| L | 货币符号（使用区域） |
| D | 小数点（使用区域） |
| G | 分组分隔符（使用区域） |
| MI | 在指定位置的负号（如果数字 < 0） |
| PL | 在指定位置的正号（如果数字 > 0） |
| SG | 在指定位置的正/负号 |
| RN | 罗马数字（输入在 1 和 3999 之间） |
| TH or th | 序数后缀 |
| V | 移动指定位数（参阅注解） |
| EEEE | 科学记数的指数 |

数字格式化的用法须知：

· 0指定一个总是被打印的数位，即便它包含前导/拖尾的零。9也指定一个数位，但是如果它是前导零则会被空格替换，而如果是拖尾零并且指定了填充模式则它会被删除（对于to\_number()来说，这两种模式字符等效）。

· 模式字符S、L、D以及G表示当前locale定义的负号、货币符号、小数点以及数字分隔符字符。不管locale是什么，模式字符句号和逗号就表示小数点和数字分隔符。

· 对于to\_char()的模式中的一个负号，如果没有明确的规定，将为该负号保留一列，并且它将被锚接到（出现在左边）那个数字。如果S正好出现在某个9的左边，它也将被锚接到那个数字。

· 使用SG、PL或MI格式化的符号并不挂在数字上面； 例如，to\_char(-12, ‘MI9999’)生成’- 12’，而to\_char(-12, ‘S9999’)生成 ’ -12’。（Oracle 里的实现不允许在9前面使用MI，而是要求9在MI前面。）

· TH不会转换小于零的数值，也不会转换小数。

· 在to\_number中，如果没有使用L或TH之类的非数据模板模式，相应数量的输入字符会被跳过，不管它们是否匹配模板模式，除非它们是数据字符（也就是数位、负号、小数点或者逗号）。例如，TH会跳过两个非数据字符。

· 带有to\_char的V会把输入值乘上10^n，其中n是跟在V后面的位数。带有to\_number的V以类似的方式做除法。to\_char和to\_number不支持使用结合小数点的V（例如，不允许99.9V99）。

· EEEE（科学记数法）不能和任何其他格式化模式或修饰语（数字和小数点模式除外）组合在一起使用，并且必须位于格式化字符串的最后（例如9.99EEEE是一个合法的模式）。

某些修饰语可以被应用到任何模板来改变其行为。例如，FM99.99是带有FM修饰语的99.99模式。

**表. 用于数字格式化的模板模式修饰语**

| 修饰语 | 描述 | 例子 |
| --- | --- | --- |
| FM prefix | 填充模式（抑制拖尾零和填充的空白） | FM99.99 |
| TH suffix | 大写序数后缀 | 999TH |
| th suffix | 小写序数后缀 | 999th |

表展示了一些使用to\_char函数的例子。

**表. to\_char例子**

| 表达式 | 结果 |
| --- | --- |
| to\_char(current\_timestamp, `'Day, DD HH12:MI:SS'`) | `'Tuesday , 06 05:39:18'` |
| to\_char(current\_timestamp, `'FMDay, FMDD HH12:MI:SS'`) | `'Tuesday, 6 05:39:18'` |
| to\_char(-0.1, ‘99.99’) | ’ -.10' |
| to\_char(-0.1, ‘FM9.99’) | ‘-.1’ |
| to\_char(-0.1, ‘FM90.99’) | ‘-0.1’ |
| to\_char(0.1, ‘0.9’) | ’ 0.1' |
| to\_char(12, ‘9990999.9’) | ’ 0012.0' |
| to\_char(12, ‘FM9990999.9’) | ‘0012.’ |
| to\_char(485, ‘999’) | ’ 485' |
| to\_char(-485, ‘999’) | ‘-485’ |
| to\_char(485, ‘9 9 9’) | ’ 4 8 5' |
| to\_char(1485, ‘9,999’) | ’ 1,485' |
| to\_char(1485, ‘9G999’) | ’ 1 485' |
| to\_char(148.5, ‘999.999’) | ’ 148.500' |
| to\_char(148.5, ‘FM999.999’) | ‘148.5’ |
| to\_char(148.5, ‘FM999.990’) | ‘148.500’ |
| to\_char(148.5, ‘999D999’) | ’ 148,500' |
| to\_char(3148.5, ‘9G999D999’) | ’ 3 148,500' |
| to\_char(-485, ‘999S’) | ‘485-’ |
| to\_char(-485, ‘999MI’) | ‘485-’ |
| to\_char(485, ‘999MI’) | ‘485 ' |
| to\_char(485, ‘FM999MI’) | ‘485’ |
| to\_char(485, ‘PL999’) | ‘+485’ |
| to\_char(485, ‘SG999’) | ‘+485’ |
| to\_char(-485, ‘SG999’) | ‘-485’ |
| to\_char(-485, ‘9SG99’) | ‘4-85’ |
| to\_char(-485, ‘999PR’) | ‘<485>’ |
| to\_char(485, ‘L999’) | ‘DM 485’ |
| to\_char(485, ‘RN’) | ’ CDLXXXV’ |
| to\_char(485, ‘FMRN’) | ‘CDLXXXV’ |
| to\_char(5.2, ‘FMRN’) | ‘V’ |
| to\_char(482, ‘999th’) | ’ 482nd' |
| to\_char(485, ‘“Good number:“999’) | ‘Good number: 485’ |
| to\_char(485.8, ‘“Pre:“999” Post:” .999’) | ‘Pre: 485 Post: .800’ |
| to\_char(12, ‘99V999’) | ’ 12000' |
| to\_char(12.4, ‘99V999’) | ’ 12400' |
| to\_char(12.45, ‘99V9’) | ’ 125' |
| to\_char(0.0004859, ‘9.99EEEE’) | ’ 4.86e-04' |

## 时间/日期函数和操作符 [*link*](#%e6%97%b6%e9%97%b4%e6%97%a5%e6%9c%9f%e5%87%bd%e6%95%b0%e5%92%8c%e6%93%8d%e4%bd%9c%e7%ac%a6)

表展示了可用于处理日期/时间值的函数，其细节在随后的小节中描述。表演示了基本算术操作符 （+、\*等）的行为。

所有下文描述的接受time或timestamp输入的函数和操作符实际上都有两种变体： 一种接收time with time zone或timestamp with time zone， 另外一种接受time without time zone或者 timestamp without time zone。为了简化，这些变种没有被独立地展示。此外，+和\*操作符都是可交换的操作符对（例如，date + integer 和 integer + date）；我们只显示其中一个。

**表 日期/时间操作符**

| 操作符 | 例子 | 结果 |
| --- | --- | --- |
| + | date ‘2001-09-28’ + integer ‘7’ | date ‘2001-10-05’ |
| + | date ‘2001-09-28’ + interval ‘1 hour’ | `timestamp '2001-09-28 01:00:00'` |
| + | date ‘2001-09-28’ + time ‘03:00’ | `timestamp '2001-09-28 03:00:00'` |
| + | interval ‘1 day’ + interval ‘1 hour’ | `interval '1 day 01:00:00'` |
| + | timestamp ‘2001-09-28 01:00’ + interval ‘23 hours’ | `timestamp '2001-09-29 00:00:00'` |
| + | time ‘01:00’ + interval ‘3 hours’ | `time '04:00:00'` |
| - | - interval ‘23 hours’ | `interval '-23:00:00'` |
| - | date ‘2001-10-01’ - date ‘2001-09-28’ | integer ‘3’ (days) |
| - | date ‘2001-10-01’ - integer ‘7’ | date ‘2001-09-24’ |
| - | date ‘2001-09-28’ - interval ‘1 hour’ | `timestamp '2001-09-27 23:00:00'` |
| - | time ‘05:00’ - time ‘03:00’ | `interval '02:00:00'` |
| - | time ‘05:00’ - interval ‘2 hours’ | `time '03:00:00'` |
| - | timestamp ‘2001-09-28 23:00’ - interval ‘23 hours’ | `timestamp '2001-09-28 00:00:00'` |
| - | interval ‘1 day’ - interval ‘1 hour’ | `interval '1 day -01:00:00'` |
| - | timestamp ‘2001-09-29 03:00’ - timestamp ‘2001-09-27 12:00’ | `interval '1 day 15:00:00'` |
| \* | 900 \* interval ‘1 second’ | `interval '00:15:00'` |
| \* | 21 \* interval ‘1 day’ | interval ‘21 days’ |
| \* | double precision ‘3.5’ \* interval ‘1 hour’ | `interval '03:30:00'` |
| / | interval ‘1 hour’ / double precision ‘1.5’ | `interval '00:40:00'` |

**表. 日期/时间函数**

| 函数 | 返回类型 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- | --- |
| age(timestamp, timestamp) | interval | 减去参数，生成一个使用年、月（而不是只用日）的“符号化”的结果 | age(timestamp ‘2001-04-10’, timestamp ‘1957-06-13’) | 43 年 9 月 27 日 |
| age(timestamp) | interval | 从current\_date（在午夜）减去 | age(timestamp ‘1957-06-13’) | 43 years 8 mons 3 days |
| clock\_timestamp() | timestamp with time zone | 当前日期和时间（在语句执行期间变化）； |  |  |
| current\_date | date | 当前日期； |  |  |
| current\_time | time with time zone | 当前时间（一天中的时间）； |  |  |
| current\_timestamp | timestamp with time zone | 当前日期和时间（当前事务开始时）； |  |  |
| date\_part(text, timestamp) | double precision | 获得子域（等价于extract）； | `date_part('hour', timestamp '2001-02-16 20:38:40')` | 20 |
| date\_part(text, interval) | double precision | 获得子域（等价于extract）； | date\_part(‘month’, interval ‘2 years 3 months’) | 3 |
| date\_trunc(text, timestamp) | timestamp | 截断到指定精度； | `date_trunc('hour', timestamp '2001-02-16 20:38:40')` | `2001-02-16 20:00:00` |
| date\_trunc(text, interval) | interval | 截断到指定精度； | date\_trunc(‘hour’, interval ‘2 days 3 hours 40 minutes’) | `2 days 03:00:00` |
| extract(field from timestamp) | double precision | 获得子域； | `extract(hour from timestamp '2001-02-16 20:38:40')` | 20 |
| extract(field from interval) | double precision | 获得子域； | extract(month from interval ‘2 years 3 months’) | 3 |
| isfinite(date) | boolean | 测试有限日期（不是+/-无限） | isfinite(date ‘2001-02-16’) | true |
| isfinite(timestamp) | boolean | 测试有限时间戳（不是+/-无限） | `isfinite(timestamp '2001-02-16 21:28:30')` | true |
| isfinite(interval) | boolean | 测试有限间隔 | isfinite(interval ‘4 hours’) | true |
| justify\_days(interval) | interval | 调整间隔这样30天时间周期可以表示为月 | justify\_days(interval ‘35 days’) | 1 mon 5 days |
| justify\_hours(interval) | interval | 调整间隔这样24小时时间周期可以表示为日 | justify\_hours(interval ‘27 hours’) | `1 day 03:00:00` |
| justify\_interval(interval) | interval | 使用justify\_days和justify\_hours调整间隔，使用额外的符号调整 | justify\_interval(interval ‘1 mon -1 hour’) | `29 days 23:00:00` |
| localtime | time | 当前时间（一天中的时间）； |  |  |
| localtimestamp | timestamp | 当前日期和时间（当前事务的开始）； |  |  |
| make\_date(year int, month int, day int) | date | 从年、月、日域创建日期 | make\_date(2013, 7, 15) | 2013-07-15 |
| make\_interval(years int DEFAULT 0, months int DEFAULT 0, weeks int DEFAULT 0, days int DEFAULT 0, hours int DEFAULT 0, mins int DEFAULT 0, secs double precision DEFAULT 0.0) | interval | 从年、月、周、日、时、分、秒域创建 interval | make\_interval(days => 10) | 10 days |
| make\_time(hour int, min int, sec double precision) | time | 从时、分、秒域创建时间 | make\_time(8, 15, 23.5) | `08:15:23.5` |
| make\_timestamp(year int, month int, day int, hour int, min int, sec double precision) | timestamp | 从年、月、日、时、分、秒域创建时间戳 | make\_timestamp(2013, 7, 15, 8, 15, 23.5) | `2013-07-15 08:15:23.5` |
| make\_timestamptz(year int, month int, day int, hour int, min int, sec double precision, [ timezone text ]) | timestamp with time zone | 从年、月、日、时、分、秒域创建带时区的时间戳。如果没有指定timezone， 则使用当前时区。 | make\_timestamptz(2013, 7, 15, 8, 15, 23.5) | `2013-07-15 08:15:23.5+01` |
| now() | timestamp with time zone | 当前日期和时间（当前事务的开始）； |  |  |
| statement\_timestamp() | timestamp with time zone | 当前日期和时间（当前事务的开始）； |  |  |
| timeofday() | text | 当前日期和时间（像clock\_timestamp，但是作为一个text字符串）； |  |  |
| transaction\_timestamp() | timestamp with time zone | 当前日期和时间（当前事务的开始）； |  |  |
| to\_timestamp(double precision) | timestamp with time zone | 把 Unix 时间（从 1970-01-01 00:00:00+00 开始的秒）转换成 timestamp | to\_timestamp(1284352323) | `2010-09-13 04:32:03+00` |

除了这些函数以外，还支持 SQL 操作符OVERLAPS：

```
(start1, end1) OVERLAPS (start2, end2)
(start1, length1) OVERLAPS (start2, length2)
```

这个表达式在两个时间域（用它们的端点定义）重叠的时候得到真，当它们不重叠时得到假。端点可以用一对日期、时间或者时间戳来指定；或者是用一个后面跟着一个间隔的日期、时间或时间戳来指定。当一对值被提供时，起点或终点都可以被写在前面，OVERLAPS会自动地把较早的值作为起点。每一个时间段被认为是表示半开的间隔start <= time < end，除非start和end相等，这种情况下它表示单个时间实例。例如这表示两个只有一个共同端点的时间段不重叠。

```
SELECT (DATE '2001-02-16', DATE '2001-12-21') OVERLAPS
       (DATE '2001-10-30', DATE '2002-10-30');
结果：true
SELECT (DATE '2001-02-16', INTERVAL '100 days') OVERLAPS
       (DATE '2001-10-30', DATE '2002-10-30');
结果：false
SELECT (DATE '2001-10-29', DATE '2001-10-30') OVERLAPS
       (DATE '2001-10-30', DATE '2001-10-31');
结果：false
SELECT (DATE '2001-10-30', DATE '2001-10-30') OVERLAPS
       (DATE '2001-10-30', DATE '2001-10-31');
结果：true
```

当把一个interval值添加到timestamp with time zone上（或从中减去）时， days 部分会按照指定的天数增加或减少timestamp with time zone的日期。 对于横跨夏令时的变化（当会话的时区被设置为可识别DST的时区时），这意味着interval ‘1 day’并 不一定等于interval ‘24 hours’。例如，当会话的时区设置为CST7CDT时，timestamp with time zone ‘2005-04-02 12:00-07’ + interval ‘1 day’ 的结果是timestamp with time zone ‘2005-04-03 12:00-06’，而将interval ‘24 hours’增加到相同的初始timestamp with time zone的结果 则是timestamp with time zone ‘2005-04-03 13:00-06’， 因为CST7CDT时区在2005-04-03 02:00有一个夏令时变更。

注意age返回的月数域可能有歧义，因为不同的月份有不同的天数。当计算部分月数时，采用两个日期中较早的月。例如：age(‘2004-06-01’, ‘2004-04-30’)使用4月份得到1 mon 1 day，而用5月分时会得到1 mon 2 days，因为5月有31天，而4月只有30天。

日期和时间戳的减法也可能会很复杂。执行减法的一种概念上很简单的方法是，使用 EXTRACT(EPOCH FROM …)把每个值都转换成秒数，然后执行减法， 这样会得到两个值之间的*秒*数。这种方法将会适应每个月中天数、 时区改变和夏令时调整。使用“-”操作符的日期或时间 戳减法会返回值之间的天数（24小时）以及时/分/秒，也会做同样的调整。 age函数会返回年、月、日以及时/分/秒，执行按域的减法，然后对 负值域进行调整。下面的查询展示了这些方法的不同。例子中的结果由 timezone = ‘US/Eastern’产生，这使得两个使用的日期之间存在着夏令 时的变化：

```
SELECT EXTRACT(EPOCH FROM timestamptz '2013-07-01 12:00:00') -
       EXTRACT(EPOCH FROM timestamptz '2013-03-01 12:00:00');
Result: 10537200
SELECT (EXTRACT(EPOCH FROM timestamptz '2013-07-01 12:00:00') -
        EXTRACT(EPOCH FROM timestamptz '2013-03-01 12:00:00'))
        / 60 / 60 / 24;
Result: 121.958333333333
SELECT timestamptz '2013-07-01 12:00:00' - timestamptz '2013-03-01 12:00:00';
Result: 121 days 23:00:00
SELECT age(timestamptz '2013-07-01 12:00:00', timestamptz '2013-03-01 12:00:00');
Result: 4 mons
```

### EXTRACT, date\_part [*link*](#extract-date_part)

```
EXTRACT(field FROM source)
```

extract函数从日期/时间值中抽取子域，例如年或者小时等。source必须是一个类型 timestamp、time或interval的值表达式（类型为date的表达式将被造型为 timestamp，并且因此也可以被同样使用）。field是一个标识符或者字符串，它指定从源值中抽取的域。extract函数返回类型为double precision的值。 下列值是有效的域名字∶

century

世纪

```
SELECT EXTRACT(CENTURY FROM TIMESTAMP '2000-12-16 12:21:13');
结果：20
SELECT EXTRACT(CENTURY FROM TIMESTAMP '2001-02-16 20:38:40');
结果：21
```

第一个世纪从 `0001-01-01 00:00:00 AD` 开始， 尽管那时候人们还不知道这是第一个世纪。这个定义适用于所有使用格里高利历法的国家。其中没有 0 世纪，我们直接从公元前 1 世纪到公元 1 世纪。 如果你认为这个不合理，那么请把抱怨发给：罗马圣彼得教堂，梵蒂冈，教皇收。

```
day
```

对于timestamp值，是（月份）里的日域（1-31）；对于interval值，是日数

```
SELECT EXTRACT(DAY FROM TIMESTAMP '2001-02-16 20:38:40');
结果：16

SELECT EXTRACT(DAY FROM INTERVAL '40 days 1 minute');
结果：40
decade
```

年份域除以10

```
SELECT EXTRACT(DECADE FROM TIMESTAMP '2001-02-16 20:38:40');
结果：200
dow
```

一周中的日，从周日（0）到周六（6）

```
SELECT EXTRACT(DOW FROM TIMESTAMP '2001-02-16 20:38:40');
结果：5
```

请注意，extract的一周中的日和to\_char(…, ‘D’)函数不同。

```
doy
```

一年的第几天（1 -365/366）

```
SELECT EXTRACT(DOY FROM TIMESTAMP '2001-02-16 20:38:40');
结果：47
epoch
```

对于timestamp with time zone值， 是自`1970-01-01 00:00:00 UTC`以来的秒数（结果可能是负数）； 对于date and timestamp值，是自本地时间 `1970-01-01 00:00:00` 以来的描述；对于interval值，它是时间间隔的总秒数。

```
SELECT EXTRACT(EPOCH FROM TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40.12-08');
结果：982384720.12

SELECT EXTRACT(EPOCH FROM INTERVAL '5 days 3 hours');
结果：442800
```

不能用to\_timestamp把一个 epoch 值转换回成时间戳：

```
SELECT to_timestamp(982384720.12);
Result: 2001-02-17 04:38:40.12+00
hour
```

小时域（0 - 23）

```
SELECT EXTRACT(HOUR FROM TIMESTAMP '2001-02-16 20:38:40');
结果：20
isodow
```

一周中的日，从周一（1）到周日（7）

```
SELECT EXTRACT(ISODOW FROM TIMESTAMP '2001-02-18 20:38:40');
结果：7
```

除了周日，这和dow相同。这符合ISO 8601 中一周中的日的编号。

```
isoyear
```

日期所落在的ISO 8601 周编号的年（不适用于间隔）

```
SELECT EXTRACT(ISOYEAR FROM DATE '2006-01-01');
结果：2005
SELECT EXTRACT(ISOYEAR FROM DATE '2006-01-02');
结果：2006
```

每一个ISO 8601 周编号的年都开始于包含1月4日的那一周的周一，在早的1月或迟的12月中ISO年可能和格里高利年不同。更多信息见week域。

这个域不能用于 PostgreSQL 8.3之前的版本。

```
microseconds
```

秒域，包括小数部分，乘以 1,000,000。请注意它包括全部的秒

```
SELECT EXTRACT(MICROSECONDS FROM TIME '17:12:28.5');
结果：28500000
millennium
```

千年

```
SELECT EXTRACT(MILLENNIUM FROM TIMESTAMP '2001-02-16 20:38:40');
结果：3
```

19xx的年份在第二个千年里。第三个千年从 2001 年 1 月 1 日开始。

```
milliseconds
```

秒域，包括小数部分，乘以 1000。请注意它包括完整的秒。

```
SELECT EXTRACT(MILLISECONDS FROM TIME '17:12:28.5');
结果：28500
minute
```

分钟域（0 - 59）

```
SELECT EXTRACT(MINUTE FROM TIMESTAMP '2001-02-16 20:38:40');
结果：38
month
```

对于timestamp值，它是一年里的月份数（1 - 12）； 对于interval值，它是月的数目，然后对 12 取模（0 - 11）

```
SELECT EXTRACT(MONTH FROM TIMESTAMP '2001-02-16 20:38:40');
结果：2

SELECT EXTRACT(MONTH FROM INTERVAL '2 years 3 months');
结果：3

SELECT EXTRACT(MONTH FROM INTERVAL '2 years 13 months');
结果：1
quarter
```

该天所在的该年的季度（1 - 4）

```
SELECT EXTRACT(QUARTER FROM TIMESTAMP '2001-02-16 20:38:40');
结果：1
second
```

秒域，包括小数部分（0 - 59[[7]](http://postgres.cn/docs/11/functions-datetime.html#ftn.id-1.5.8.14.12.5.11.16.2.1.1)）

```
SELECT EXTRACT(SECOND FROM TIMESTAMP '2001-02-16 20:38:40');
结果：40

SELECT EXTRACT(SECOND FROM TIME '17:12:28.5');
结果：28.5
timezone
```

与 UTC 的时区偏移，以秒记。正数对应 UTC 东边的时区，负数对应 UTC 西边的时区（从技术上来看，PostgreSQL不使用 UTC，因为其中不处理闰秒）。

```
timezone_hour
```

时区偏移的小时部分。

```
timezone_minute
```

时区偏移的分钟部分。

```
week
```

该天在所在的ISO 8601 周编号的年份里是第几周。根据定义， 一年的第一周包含该年的 1月 4 日并且 ISO 周从星期一开始。换句话说，一年的第一个星期四在第一周。

在 ISO 周编号系统中，早的 1 月的日期可能位于前一年的第五十二或者第五十三周，而迟的 12 月的日期可能位于下一年的第一周。例如， 2005-01-01位于 2004 年的第五十三周，并且2006-01-01位于 2005 年的第五十二周，而2012-12-31位于 2013 年的第一周。我们推荐把isoyear域和week一起使用来得到一致的结果。

```
SELECT EXTRACT(WEEK FROM TIMESTAMP '2001-02-16 20:38:40');
结果：7
year
```

年份域。要记住这里没有0 AD，所以从AD年里抽取BC年应该小心处理。

```
SELECT EXTRACT(YEAR FROM TIMESTAMP '2001-02-16 20:38:40');
结果：2001
```

注意

当输入值为 +/-Infinity 时，extract对于单调增的域（epoch、julian、year、isoyear、decade、century以及millennium）返回 +/-Infinity。对于其他域返回 NULL。PostgreSQL 9.6 之前的版本对所有输入无穷的情况都返回零。

在传统的Ingres上建模的date\_part函数等价于SQL标准函数extract：

```
date_part('field', source)
```

请注意这里的field参数必须是一个串值，而不是一个名字。有效的date\_part域名 和extract相同。

```
SELECT date_part('day', TIMESTAMP '2001-02-16 20:38:40');
结果：16

SELECT date_part('hour', INTERVAL '4 hours 3 minutes');
结果：4
```

### date\_trunc [*link*](#date_trunc)

date\_trunc函数在概念上和用于数字的trunc函数类似。

```
date_trunc('field', source)
```

source是类型timestamp或interval的值表达式（类型date和 time的值都分别被自动转换成timestamp或者interval）。field选择对输入值选用什么样的精度进行截断。返回的值是timestamp类型或者所有小于选定的 精度的域都设置为零（或者一，对于日期和月份）的interval。

field的有效值是∶

| microseconds |
| --- |
| milliseconds |
| second |
| minute |
| hour |
| day |
| week |
| month |
| quarter |
| year |
| decade |
| century |
| millennium |

例子：

```
SELECT date_trunc('hour', TIMESTAMP '2001-02-16 20:38:40');
结果：2001-02-16 20:00:00

SELECT date_trunc('year', TIMESTAMP '2001-02-16 20:38:40');
结果：2001-01-01 00:00:00
```

### AT TIME ZONE [*link*](#at-time-zone)

AT TIME ZONE把时间戳*without time zone*转换成时间戳*with time zone*或者反过来，并且把*time*值转换成不同的时区。表展示了它的变体。

**表** **.** AT TIME ZONE**变体**

| 表达式 | 返回类型 | 描述 |
| --- | --- | --- |
| timestamp without time zone AT TIME ZONE zone | timestamp with time zone | 把给定的不带时区的时间戳当作位于指定时区的时间对待 |
| timestamp with time zone AT TIME ZONE zone | timestamp without time zone | 把给定的带时区的时间戳转换到新的时区，不带时区指定 |
| time with time zone AT TIME ZONE zone | time with time zone | 把给定的带时区的时间转换到新时区 |

在这些表达式里，我们需要的时区zone可以指定为文本串（例如，‘America/Los\_Angeles’）或者一个间隔 （例如，INTERVAL ‘-08:00’）。

例子（假设本地时区是America/Los\_Angeles）：

```
SELECT TIMESTAMP '2001-02-16 20:38:40' AT TIME ZONE 'America/Denver';
Result: 2001-02-16 19:38:40-08

SELECT TIMESTAMP WITH TIME ZONE '2001-02-16 20:38:40-05' AT TIME ZONE 'America/Denver';
Result: 2001-02-16 18:38:40

SELECT TIMESTAMP '2001-02-16 20:38:40-05' AT TIME ZONE 'Asia/Tokyo' AT TIME ZONE 'America/Chicago';
Result: 2001-02-16 05:38:40
```

第一个例子给缺少时区的值加上了时区，并且显示了使用当前TimeZone设置的值。第二个例子把带有时区值的时间戳移动到指定的时区，并且返回不带时区的值。这允许存储和显示不同于当前TimeZone设置的值。第三个例子把东京时间转换成芝加哥时间。把*time*值转换成其他时区会使用当前活跃的时区规则，因为没有提供日期。

函数timezone(zone, timestamp)等效于 SQL 兼容的结构timestamp AT TIME ZONE zone。

### 当前日期/时间 [*link*](#%e5%bd%93%e5%89%8d%e6%97%a5%e6%9c%9f%e6%97%b6%e9%97%b4)

MemFireDB提供了许多返回当前日期和时间的函数。这些 SQL 标准的函数全部都按照当前事务的开始时刻返回值：

```
CURRENT_DATE
CURRENT_TIME
CURRENT_TIMESTAMP
CURRENT_TIME(precision)
CURRENT_TIMESTAMP(precision)
LOCALTIME
LOCALTIMESTAMP
LOCALTIME(precision)
LOCALTIMESTAMP(precision)
```

CURRENT\_TIME和CURRENT\_TIMESTAMP传递带有时区的值；LOCALTIME和LOCALTIMESTAMP传递的值不带时区。

CURRENT\_TIME、CURRENT\_TIMESTAMP、LOCALTIME和 LOCALTIMESTAMP可以有选择地接受一个精度参数， 该精度导致结果的秒域被园整为指定小数位。如果没有精度参数，结果将被给予所能得到的全部精度。

一些例子：

```
SELECT CURRENT_TIME;
结果：14:39:53.662522-05

SELECT CURRENT_DATE;
结果：2001-12-23

SELECT CURRENT_TIMESTAMP;
结果：2001-12-23 14:39:53.662522-05

SELECT CURRENT_TIMESTAMP(2);
结果：2001-12-23 14:39:53.66-05

SELECT LOCALTIMESTAMP;
结果：2001-12-23 14:39:53.662522
```

因为这些函数全部都按照当前事务的开始时刻返回结果，所以它们的值在事务运行的整个期间内都不改变。 我们认为这是一个特性：目的是为了允许一个事务在“当前”时间上有一致的概念， 这样在同一个事务里的多个修改可以保持同样的时间戳。

注意:许多其它数据库系统可能会更频繁地推进这些值。
MemFireDB同样也提供了返回当前语句开始时间的函数， 它们会返回函数被调用时的真实当前时间。这些非 SQL 标准的函数列表如下：

```
transaction_timestamp()
statement_timestamp()
clock_timestamp()
timeofday()
now()
```

`transaction_timestamp()`等价于`CURRENT_TIMESTAMP`，但是其命名清楚地反映了它的返回值。statement\_timestamp()返回当前语句的开始时刻（更准确的说是收到 客户端最后一条命令的时间）。statement\_timestamp()和transaction\_timestamp()在一个事务的第一条命令期间返回值相同，但是在随后的命令中却不一定相同。 clock\_timestamp()返回真正的当前时间，因此它的值甚至在同一条 SQL 命令中都会变化。timeofday()是一个有历史原因的PostgreSQL函数。和clock\_timestamp()相似，timeofday()也返回真实的当前时间，但是它的结果是一个格式化的text串，而不是timestamp with time zone值。now()是PostgreSQL的一个传统，等效于transaction\_timestamp()。

所有日期/时间类型还接受特殊的文字值now，用于指定当前的日期和时间（重申，被解释为当前事务的开始时刻）。 因此，下面三个都返回相同的结果：

```
SELECT CURRENT_TIMESTAMP;
SELECT now();
SELECT TIMESTAMP 'now';  -- 对于和 DEFAULT 一起使用是不正确的
```

提示:在创建表期间指定一个DEFAULT子句时，你不会希望使用第三种形式。系统将在分析这个常量的时候把now转换为一个timestamp， 这样需要默认值时就会得到创建表的时间！而前两种形式要到实际使用缺省值的时候才被计算， 因为它们是函数调用。因此它们可以给出每次插入行的时刻。

### 延时执行 [*link*](#%e5%bb%b6%e6%97%b6%e6%89%a7%e8%a1%8c)

下面的这些函数可以用于让服务器进程延时执行：

```
pg_sleep(seconds)
pg_sleep_for(interval)
pg_sleep_until(timestamp with time zone)
```

pg\_sleep让当前的会话进程休眠seconds 秒以后再执行。seconds是一个double precision 类型的值，所以可以指定带小数的秒数。pg\_sleep\_for是针对用 interval指定的较长休眠时间的函数。pg\_sleep\_until 则可以用来休眠到一个指定的时刻唤醒。例如：

```
SELECT pg_sleep(1.5);
SELECT pg_sleep_for('5 minutes');
SELECT pg_sleep_until('tomorrow 03:00');
```

## 枚举支持函数 [*link*](#%e6%9e%9a%e4%b8%be%e6%94%af%e6%8c%81%e5%87%bd%e6%95%b0)

对于枚举类型， 有一些函数允许更清洁的编码，而不需要为一个枚举类型硬写特定的值。它们被列在表 中。本例假定一个枚举类型被创建为：

```
CREATE TYPE rainbow AS ENUM ('red', 'orange', 'yellow', 'green', 'blue', 'purple');
```

**表. 枚举支持函数**

| 函数 | 描述 |  |  |
| --- | --- | --- | --- |
| enum\_first(anyenum) | 返回输入枚举类型的第一个值 | enum\_first(null::rainbow) | red |
| enum\_last(anyenum) | 返回输入枚举类型的最后一个值 | enum\_last(null::rainbow) | purple |
| enum\_range(anyenum) | 将输入枚举类型的所有值作为一个有序的数组返回 | enum\_range(null::rainbow) | {red,orange,yellow,green,blue,purple} |
| enum\_range(anyenum, anyenum) | 以一个数组返回在给定两个枚举值之间的范围。值必须来自相同的枚举类型。 如果第一个参数为空，其结果将从枚举类型的第一个值开始。如果第二参数为空，其结果将以枚举类型的最后一个值结束。 | enum\_range(‘orange’::rainbow, ‘green’::rainbow) | {orange,yellow,green} |
|  |  | enum\_range(NULL, ‘green’::rainbow)` | {red,orange,yellow,green} |
|  |  | enum\_range(‘orange’::rainbow, NULL)` | {orange,yellow,green,blue,purple} |

请注意，除了双参数形式的enum\_range外， 这些函数忽略传递给它们的具体值，它们只关心声明的数据类型。 空值或类型的一个特定值可以通过，并得到相同的结果。这些函数更多地被用于一个表列或函数参数，而不是一个硬写的类型名，如例子中所建议。

枚举样例如下：

```
create type enum_clor as enum ('red','black','green','white','blue');
select enum_first('black'::enum_clor),enum_first(null::enum_clor);

select enum_last('black'::enum_clor),enum_last(null::enum_clor);
select enum_range('black'::enum_clor),enum_range(null::enum_clor);
select enum_range(null,'white'::enum_clor);
select enum_range('black'::enum_clor,null);
select enum_range('black'::enum_clor,'white'::enum_clor);
```

## 几何函数和操作符 [*link*](#%e5%87%a0%e4%bd%95%e5%87%bd%e6%95%b0%e5%92%8c%e6%93%8d%e4%bd%9c%e7%ac%a6)

几何类型point、box、 lseg、line、path、 polygon和circle有一大堆本地支持函数和操作符，如下表中所示。

**表** **.** **几何操作符**

| 操作符 | 描述 | 例子 |
| --- | --- | --- |
| + | 平移 | select box ‘((0,0),(1,1))’ + point ‘(2.0,0)’; |
| - | 平移 | select box ‘((0,0),(1,1))’ - point ‘(2.0,0)’; |
| \* | 缩放/旋转 | select box ‘((0,0),(1,1))’ \* point ‘(2.0,0)’; |
| / | 缩放/旋转 | select box ‘((0,0),(2,2))’ / point ‘(2.0,0)’; |
| # | 相交的点或方框 | select box’((1,-1),(-1,1))’ # box’((1,1),(-1,-1))’; |
| # | 路径或多边形中的点数 | select # path ‘((1,0),(0,1),(-1,0))’; |
| @-@ | 长度或周长 | select @-@ path ‘((0,0),(1,0))’; |
| @@ | 中心 | select @@ circle ‘((0,0),10)’; |
| ## | 第二个操作数上最接近第一个操作数的点 | select point ‘(0,0)’ ## lseg ‘((2,0),(0,2))’; |
| <-> | 距离 | select circle ‘((0,0),1)’ <-> circle ‘((5,0),1)’; |
| && | 是否重叠？（只要有一个公共点这就为真） | select box ‘((0,0),(1,1))’ && box ‘((0,0),(2,2))’; |
| « | 是否严格地在左侧？ | select circle ‘((0,0),1)’ « circle ‘((5,0),1)’; |
| » | 是否严格地在右侧？ | select circle ‘((5,0),1)’ » circle ‘((0,0),1)’; |
| &< | 没有延展到右边？ | select box ‘((0,0),(1,1))’ &< box ‘((0,0),(2,2))’; |
| &> | 没有延展到左边？ | select box ‘((0,0),(3,3))’ &> box ‘((0,0),(2,2))’; |
| «| | 严格在下？ | select box ‘((0,0),(3,3))’ «| box ‘((3,4),(5,5))’; |
| |» | 严格在上？ | select box ‘((3,4),(5,5))’ |» box ‘((0,0),(3,3))’; |
| &<| | 没有延展到上面？ | select box ‘((0,0),(1,1))’ &<| box ‘((0,0),(2,2))’; |
| |&> | 没有延展到下面？ | select box ‘((0,0),(3,3))’ |&> box ‘((0,0),(2,2))’; |
| <^ | 在下面（允许相切）？ | select circle ‘((0,0),1)’ <^ circle ‘((0,5),1)’; |
| >^ | 在上面（允许相切）？ | select circle ‘((0,5),1)’ >^ circle ‘((0,0),1)’; |
| ?# | 相交？ | select lseg ‘((-1,0),(1,0))’ ?# box ‘((-2,-2),(2,2))’; |
| ?- | 水平？ | select ?- lseg ‘((-1,0),(1,0))’; |
| ?- | 水平对齐？ | select point ‘(1,0)’ ?- point ‘(0,0)’; |
| ?| | 垂直？ | select ?| lseg ‘((-1,0),(1,0))’; |
| ?| | 垂直对齐？ | select point ‘(0,1)’ ?| point ‘(0,0)’; |
| ?-| | 相互垂直？ | select lseg ‘((0,0),(0,1))’ ?-| lseg ‘((0,0),(1,0))’; |
| ?|| | 平行？ | select lseg ‘((-1,0),(1,0))’ ?|| lseg ‘((-1,2),(1,2))’; |
| @> | 包含？ | select circle ‘((0,0),2)’ @> point ‘(1,1)’; |
| <@ | 包含在内或在上？ | select point ‘(1,1)’ <@ circle ‘((0,0),2)’; |
| ~= | 相同？ | select polygon ‘((0,0),(1,1))’ ~= polygon ‘((1,1),(0,0))’; |

**表** **.** **几何函数**

| 函数 | 返回类型 | 描述 | 例子 |
| --- | --- | --- | --- |
| area(object) | double precision | 面积 | select area(circle’((0,0),1)’) ; |
| center(object) | point | 中心 | select center(box ‘((0,0),(1,2))’) ; |
| diameter(circle) | double precision | 圆的直径 | select diameter(circle ‘((0,0),2.0)’) ; |
| height(box) | double precision | 方框的垂直尺寸 | select height(box ‘((0,0),(1,1))’) ; |
| isclosed(path) | boolean | 一个封闭路径？ | select isclosed(path ‘((0,0),(1,1),(2,0))’) ; |
| isopen(path) | boolean | 一个开放路径？ | select isopen(path ‘[(0,0),(1,1),(2,0)]’) ; |
| length(object) | double precision | 长度 | select length(path ‘((-1,0),(1,0))’) ; |
| npoints(path) | int | 点数 | select npoints(path ‘[(0,0),(1,1),(2,0)]’) ; |
| npoints(polygon) | int | 点数 | select npoints(polygon ‘((1,1),(0,0))’) ; |
| pclose(path) | path | 将路径转换成封闭的 | select pclose(path ‘[(0,0),(1,1),(2,0)]’) ; |
| popen(path) | path | 将路径转换成开放 | select popen(path ‘((0,0),(1,1),(2,0))’) ; |
| radius(circle) | double precision | 圆的半径 | select radius(circle ‘((0,0),2.0)’) ; |
| width(box) | double precision | 方框的水平尺寸 | select width(box ‘((0,0),(1,1))’) ; |

**表** **.** **几何类型转换函数**

| 函数 | 返回类型 | 描述 | 例子 |
| --- | --- | --- | --- |
| box(circle) | box | 圆到方框 | select box(circle ‘((0,0),2.0)’); |
| box(point) | box | 点到空方框 | select box(point ‘(0,0)’) ; |
| box(point, point) | box | 点到方框 | select box(point ‘(0,0)’, point ‘(1,1)’) ; |
| box(polygon) | box | 多边形到方框 | select box(polygon ‘((0,0),(1,1),(2,0))’) ; |
| bound\_box(box, box) | box | 方框到外包框 | select bound\_box(box ‘((0,0),(1,1))’, box ‘((3,3),(4,4))’) ; |
| circle(box) | circle | 方框到圆 | select circle(box ‘((0,0),(1,1))’) ; |
| circle(point, double precision) | circle | 中心和半径到圆 | select circle(point ‘(0,0)’, 2.0) ; |
| circle(polygon) | circle | 多边形到圆 | select circle(polygon ‘((0,0),(1,1),(2,0))’) ; |
| line(point, point) | line | 点到线 | select line(point ‘(-1,0)’, point ‘(1,0)’) ; |
| lseg(box) | lseg | 方框对角线到线段 | select lseg(box ‘((-1,0),(1,0))’) ; |
| lseg(point, point) | lseg | 点到线段 | select lseg(point ‘(-1,0)’, point ‘(1,0)’) ; |
| path(polygon) | path | 多边形到路径 | select path(polygon ‘((0,0),(1,1),(2,0))’) ; |
| point(double precision, double precision) | point | 构造点 | select point(23.4, -44.5) ; |
| point(box) | point | 方框的中心 | select point(box ‘((-1,0),(1,0))’) ; |
| point(circle) | point | 圆的中心 | select point(circle ‘((0,0),2.0)’) ; |
| point(lseg) | point | 线段的中心 | select point(lseg ‘((-1,0),(1,0))’) ; |
| point(polygon) | point | 多边形的中心 | select point(polygon ‘((0,0),(1,1),(2,0))’) ; |
| polygon(box) | polygon | 方框到4点多边形 | select polygon(box ‘((0,0),(1,1))’) ; |
| polygon(circle) | polygon | 圆到12点多边形 | select polygon(circle ‘((0,0),2.0)’) ; |
| polygon(npts, circle) | polygon | 点到npts点多边形 | select polygon(12, circle ‘((0,0),2.0)’) ; |
| polygon(path) | polygon | 路径到多边形 | select polygon(path ‘((0,0),(1,1),(2,0))’) ; |

我们可以把一个point的两个组成数字当作具有索引 0 和 1 的数组访问。例如，如果t.p是一个point列，那么SELECT p[0] FROM t检索 X 座标而 UPDATE t SET p[1] = …改变 Y 座标。同样，box或者lseg类型的值可以当作两个point值的数组值看待。

函数area可以用于类型box、circle和path。area函数操作path数据类型的时候， 只有在path的点没有交叉的情况下才可用。例如，path ‘((0,0),(0,1),(2,1),(2,2),(1,2),(1,0),(0,0))’::PATH是不行的， 而下面的视觉上相同的 path ‘((0,0),(0,1),(1,1),(1,2),(2,2),(2,1),(1,1),(1,0),(0,0))’::PATH就可以。 如果交叉和不交叉的path概念让你疑惑，那么把上面两个path都画在一张图纸上，你就明白了。

## 网络地址函数和操作符 [*link*](#%e7%bd%91%e7%bb%9c%e5%9c%b0%e5%9d%80%e5%87%bd%e6%95%b0%e5%92%8c%e6%93%8d%e4%bd%9c%e7%ac%a6)

展示了可以用于cidr和 inet类型的操作符。 操作符«、«=、 »、»=和 &&测试用于子网包含。它们只考虑两个地址的网络部分（忽略任何主机部分），然后判断其中一个网络部分是等于另外一个或者是另外一个的子网。

**表.cidr和inet操作符**

| 操作符 | 描述 | 例子 |
| --- | --- | --- |
| < | 小于 | select inet ‘192.168.1.5’ < inet ‘192.168.1.6’ ; |
| <= | 小于等于 | select inet ‘192.168.1.5’ <= inet ‘192.168.1.5’ ; |
| = | 等于 | select inet ‘192.168.1.5’ = inet ‘192.168.1.5’ ; |
| >= | 大于等于 | select inet ‘192.168.1.5’ >= inet ‘192.168.1.5’ ; |
| > | 大于 | select inet ‘192.168.1.5’ > inet ‘192.168.1.4’ ; |
| <> | 不等于 | select inet ‘192.168.1.5’ <> inet ‘192.168.1.4’ ; |
| « | 被包含在内 | select inet ‘192.168.1.5’ « inet ‘192.168.1/24’ ; |
| «= | 被包含在内或等于 | select inet ‘192.168.1/24’ «= inet ‘192.168.1/24’ ; |
| » | 包含 | select inet ‘192.168.1/24’ » inet ‘192.168.1.5’ ; |
| »= | 包含或等于 | select inet ‘192.168.1/24’ »= inet ‘192.168.1/24’ ; |
| && | 包含或者被包含contains or is contained by | select inet ‘192.168.1/24’ && inet ‘192.168.1.80/28’ ; |
| ~ | 按位 NOT | select ~ inet ‘192.168.1.6’ ; |
| & | 按位 AND | select inet ‘192.168.1.6’ & inet ‘0.0.0.255’ ; |
| | | 按位 OR | select inet ‘192.168.1.6’ | inet ‘0.0.0.255’ ; |
| + | 加 | select inet ‘192.168.1.6’ + 25 ; |
| - | 减 | select inet ‘192.168.1.43’ - 36 ; |
| - | 减 | select inet ‘192.168.1.43’ - inet ‘192.168.1.19’ ; |

展示了所有可以用于cidr和inet类型的函数。函数abbrev、host和text主要是为了提供可选的显示格式用的。

**表** **. cidr和inet函数**

| **函数** | **返回类型** | **描述** | **例子** | **结果** |
| --- | --- | --- | --- | --- |
| abbrev(inet) | text | 缩写显示格式文本 | select abbrev(inet ‘10.1.0.0/16’); | 10.1.0.0/16 |
| abbrev(cidr) | text | 缩写显示格式文本 | select abbrev(cidr ‘10.1.0.0/16’) ; | 10.1/16 |
| broadcast(inet) | inet | 网络广播地址 | select broadcast(‘192.168.1.5/24’) ; | 192.168.1.255/24 |
| family(inet) | int | 抽取地址族；4为 IPv4， 6为 IPv6 | select family(’::1’) ; | 6 |
| host(inet) | text | 抽取 IP 地址为文本 | select host(‘192.168.1.5/24’) ; | 192.168.1.5 |
| hostmask(inet) | inet | 为网络构造主机掩码 | select hostmask(‘192.168.23.20/30’) ; | 0.0.0.3 |
| masklen(inet) | int | 抽取网络掩码长度 | select masklen(‘192.168.1.5/24’) ; | 24 |
| netmask(inet) | inet | 为网络构造网络掩码 | select netmask(‘192.168.1.5/24’) ; | 255.255.255.0 |
| network(inet) | cidr | 抽取地址的网络部分 | select network(‘192.168.1.5/24’) ; | 192.168.1.0/24 |
| set\_masklen(inet, int) | inet | 为inet值设置网络掩码长度 | select set\_masklen(‘192.168.1.5/24’, 16) ; | 192.168.1.5/16 |
| set\_masklen(cidr, int) | cidr | 为cidr值设置网络掩码长度 | select set\_masklen(‘192.168.1.0/24’::cidr, 16) ; | 192.168.0.0/16 |
| text(inet) | text | 抽取 IP 地址和网络掩码长度为文本 | select text(inet ‘192.168.1.5’) ; | 192.168.1.5/32 |
| inet\_same\_family(inet, inet) | boolean | 地址是来自于同一个家族吗？ | select inet\_same\_family(‘192.168.1.5/24’, ‘::1’) ; | false |
| inet\_merge(inet, inet) | cidr | 包括给定网络的最小网络 | select inet\_merge(‘192.168.1.5/24’, ‘192.168.2.5/24’) ; | 192.168.0.0/22 |

任何cidr值都能够被隐式或显式地转换为inet值， 因此上述能够操作inet值的函数也同样能够操作cidr值（也有独立的用于inet和cidr的函数，因为它的行为应当和这两种情况不同）。inet值也可以转换为cidr值。完成时，该网络掩码右侧的任何位都将无声地转换为零以获得一个有效的cidr值。另外，你还可以使用常规的造型语法将一个文本字符串转换为inet或cidr值：例如，inet(expression)或colname::cidr。

下表展示了可以用于macaddr类型的函数。 函数trunc(macaddr)返回一个 MAC 地址，该地址的最后三个字节设置为零。这样可以把剩下的前缀与一个制造商相关联。

**表. macaddr函数**

| **函数** | **返回类型** | **描述** | **例子** | **结果** |
| --- | --- | --- | --- | --- |
| trunc(macaddr) | macaddr | 设置最后3个字节为零 | `select trunc(macaddr '12:34:56:78:90:ab');` | `12:34:56:00:00:00` |

macaddr类型还支持标准关系操作符 （>、<=等） 用于编辑次序，并且按位算术操作符（~、&和|）用于 NOT、AND 和 OR。

表 中展示了可以用于macaddr8类型的函数。函数trunc(macaddr8)返回一个后五个字节设置为零的MAC地址。这可以被用来为一个制造商关联一个前缀。

**表. macaddr8函数**

| **函数** | **返回类型** | **描述** | **例子** | **结果** |
| --- | --- | --- | --- | --- |
| trunc(macaddr8) | macaddr8 | 设置最后五个字节为零 | `select trunc(macaddr8 '12:34:56:78:90:ab:cd:ef');` | `12:34:56:00:00:00:00:00` |
| macaddr8\_set7bit(macaddr8) | macaddr8 | 设置第7位为一，也被称为修改版的EUI-64，用于内含在IPv6地址中 | `select macaddr8_set7bit(macaddr8 '00:34:56:ab:cd:ef');` | `02:34:56:ff:fe:ab:cd:ef` |

macaddr8类型也支持用于排序的标准关系操作符（>、<=等）以及用于NOT、AND和OR的位运算操作符（~、&和|）。

## 文本搜索函数和操作符 [*link*](#%e6%96%87%e6%9c%ac%e6%90%9c%e7%b4%a2%e5%87%bd%e6%95%b0%e5%92%8c%e6%93%8d%e4%bd%9c%e7%ac%a6)

结了为全文搜索提供的函数和操作符。

**表.文本搜索操作符**

| 操作符 | 返回类型 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- | --- |
| || | tsvector | 连接tsvector | ‘a:1 b:2’::tsvector || ‘c:1 d:2 b:3’::tsvector | ‘a’:1 ‘b’:2,5 ‘c’:3 ’d’:4 |
| && | tsquery | 将tsquery用 AND 连接起来 | ‘fat | rat’::tsquery && ‘cat’::tsquery | ( ‘fat’ | ‘rat’ ) & ‘cat’ |
| || | tsquery | 将tsquery用 OR 连接起来 | ‘fat | rat’::tsquery || ‘cat’::tsquery | ( ‘fat’ | ‘rat’ ) | ‘cat’ |
| !! | tsquery | 对一个tsquery取反 | !! ‘cat’::tsquery | !‘cat’ |
| @> | boolean | tsquery包含另一个？ | ‘cat’::tsquery @> ‘cat & rat’::tsquery | f |
| <@ | boolean | tsquery被包含？ | ‘cat’::tsquery <@ ‘cat & rat’::tsquery | t |

除了显示在表中的操作符，还定义了tsvector和tsquery类型的普通B-tree比较操作符（=、<等）。它们对于文本搜索不是很有用，但是允许使用。例如，建在这些类型列上的唯一索引。

**表.文本搜索函数**

| 函数 | 返回类型 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- | --- |
| array\_to\_tsvector(text[]) | tsvector | 把词位数组转换成tsvector | array\_to\_tsvector(’{fat,cat,rat}’::text[]) | ‘cat’ ‘fat’ ‘rat’ |
| length(tsvector) | integer | tsvector中的词位数 | length(‘fat:2,4 cat:3 rat:5A’::tsvector) | 3 |
| numnode(tsquery) | integer | tsquery中词位外加操作符的数目 | numnode(’(fat & rat) | cat’::tsquery) | 5 |
| querytree(query tsquery) | text | 获得一个tsquery的可索引部分 | querytree(‘foo & ! bar’::tsquery) | ‘foo’ |
| setweight(vector tsvector, weight “char”) | tsvector | 为vector的每一个元素分配权重 | setweight(‘fat:2,4 cat:3 rat:5B’::tsvector, ‘A’) | ‘cat’:3A ‘fat’:2A,4A ‘rat’:5A |
| setweight(vector tsvector, weight “char”, lexemes text[]) | tsvector | 为lexemes中列出的vector的元素分配权重 | setweight(‘fat:2,4 cat:3 rat:5B’::tsvector, ‘A’, ‘{cat,rat}’) | ‘cat’:3A ‘fat’:2,4 ‘rat’:5A |
| strip(tsvector) | tsvector | 从tsvector中移除位置和权重 | strip(‘fat:2,4 cat:3 rat:5A’::tsvector) | ‘cat’ ‘fat’ ‘rat’ |
| ts\_delete(vector tsvector, lexeme text) | tsvector | 从vector中移除给定的lexeme | ts\_delete(‘fat:2,4 cat:3 rat:5A’::tsvector, ‘fat’) | ‘cat’:3 ‘rat’:5A |
| ts\_delete(vector tsvector, lexemes text[]) | tsvector | 从vector中移除lexemes中词位的任何出现 | ts\_delete(‘fat:2,4 cat:3 rat:5A’::tsvector, ARRAY[‘fat’,‘rat’]) | ‘cat’:3 |
| ts\_filter(vector tsvector, weights “char”[]) | tsvector | 从vector中只选择带有给定权重的元素 | ts\_filter(‘fat:2,4 cat:3b rat:5A’::tsvector, ‘{a,b}’) | ‘cat’:3B ‘rat’:5A |
| ts\_rewrite(query tsquery, target tsquery, substitute tsquery) | tsquery | 在查询内用substitute替换target | ts\_rewrite(‘a & b’::tsquery, ‘a’::tsquery, ‘foo|bar’::tsquery) | ‘b’ & ( ‘foo’ | ‘bar’ ) |
| tsvector\_to\_array(tsvector) | text[] | 把tsvector转换为词位数组 | tsvector\_to\_array(‘fat:2,4 cat:3 rat:5A’::tsvector) | {cat,fat,rat} |
| unnest(tsvector, OUT lexeme text, OUT positions smallint[], OUT weights text) | setof record | 把一个 tsvector 扩展成一组行 | unnest(‘fat:2,4 cat:3 rat:5A’::tsvector) | (cat,{3},{D}) … |

表中的函数被单独列出，因为它们通常不被用于日常的文本搜索操作。 它们有助于开发和调试新的文本搜索配置。

**表.文本搜索调试函数**

| 函数 | 返回类型 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- | --- |
| ts\_parse(parser\_name text, document text, OUT tokid integer, OUT token text) | setof record | 测试一个解析器 | ts\_parse(‘default’, ‘foo - bar’) | (1,foo) … |
| ts\_parse(parser\_oid oid, document text, OUT tokid integer, OUT token text) | setof record | 测试一个解析器 | ts\_parse(3722, ‘foo - bar’) | (1,foo) … |
| ts\_token\_type(parser\_name text, OUT tokid integer, OUT alias text, OUT description text) | setof record | 获得解析器定义的记号类型 | ts\_token\_type(‘default’) | (1,asciiword,“Word, all ASCII”) … |
| ts\_token\_type(parser\_oid oid, OUT tokid integer, OUT alias text, OUT description text) | setof record | 获得解析器定义的记号类型 | ts\_token\_type(3722) | (1,asciiword,“Word, all ASCII”) … |

## JSON函数与操作符 [*link*](#json%e5%87%bd%e6%95%b0%e4%b8%8e%e6%93%8d%e4%bd%9c%e7%ac%a6)

大多数运算符都是重载的，因此可以同时在json和jsonb值上使用它们。下表展示了可以用于两种 JSON 数据类型的操作符。

**表** json**和**jsonb **操作符**

| **操作符** | **右操作数类型** | **描述** | **例子** | **例子结果** |
| --- | --- | --- | --- | --- |
| -> | int | 获得 JSON 数组元素（索引从 0 开始，负整数从末尾开始计） | ‘[{“a”:“foo”},{“b”:“bar”},{“c”:“baz”}]’::json->2 | {“c”:“baz”} |
| -> | text | 通过键获得 JSON 对象域 | ‘{“a”: {“b”:“foo”}}’::json->‘a’ | {“b”:“foo”} |
| -» | int | 以text形式获得 JSON 数组元素 | ‘[1,2,3]’::json-»2 | 3 |
| -» | text | 以text形式获得 JSON 对象域 | ‘{“a”:1,“b”:2}’::json-»‘b’ | 2 |
| #> | text[] | 获取在指定路径的 JSON 对象 | ‘{“a”: {“b”:{“c”: “foo”}}}’::json#>’{a,b}’ | {“c”: “foo”} |
| #» | text[] | 以text形式获取在指定路径的 JSON 对象 | ‘{“a”:[1,2,3],“b”:[4,5,6]}’::json#»’{a,2}’ | 3 |

注意：对json和jsonb类型，这些操作符都有其并行变体。 域/元素/路径抽取操作符返回与其左手输入（json或jsonb） 相同的类型，不过那些被指定为返回text的除外，它们的返回值会被强制 为文本。如果该 JSON 输入没有匹配请求的正确结构（例如那样的元素不存在），这些 域/元素/路径抽取操作符会返回 NULL 而不是失败。 接受整数 JSON 数组下标的 域/元素/路径抽取操作符都支持表示从数组末尾开始的负值下标形式。

**表** **额外的jsonb操作符**

| **操作符** | **右操作数类型** | **描述** | **例子** |
| --- | --- | --- | --- |
| @> | jsonb | 左边的 JSON 值是否在顶层包含右边的 JSON 路径/值项？ | ‘{“a”:1, “b”:2}’::jsonb @> ‘{“b”:2}’::jsonb |
| <@ | jsonb | 左边的 JSON 路径/值项是否被包含在右边的 JSON 值的顶层？ | ‘{“b”:2}’::jsonb <@ ‘{“a”:1, “b”:2}’::jsonb |
| ? | text | 键/元素字符串是否存在于 JSON 值的顶层？ | ‘{“a”:1, “b”:2}’::jsonb ? ‘b’ |
| ?| | text[] | 这些数组字符串中的任何一个是否做为顶层键存在？ | ‘{“a”:1, “b”:2, “c”:3}’::jsonb ?| array[‘b’, ‘c’] |
| ?& | text[] | 是否所有这些数组字符串都作为顶层键存在？ | ‘[“a”, “b”]’::jsonb ?& array[‘a’, ‘b’] |
| || | jsonb | 把两个jsonb值串接成一个新的jsonb值 | ‘[“a”, “b”]’::jsonb || ‘[“c”, “d”]’::jsonb |
| - | text | 从左操作数删除键/值对或者string 元素。键/值对基于它们的键值来匹配。 | ‘{“a”: “b”}’::jsonb - ‘a’ |
| - | text[] | 从左操作数中删除多个键/值对或者string元素。键/值对基于它们的键值来匹配。 | ‘{“a”: “b”, “c”: “d”}’::jsonb - ‘{a,c}’::text[] |
| - | integer | 删除具有指定索引（负值表示倒数）的数组元素。如果 顶层容器不是数组则抛出一个错误。 | ‘[“a”, “b”]’::jsonb - 1 |
| #- | text[] | 删除具有指定路径的域或者元素（对于 JSON 数组，负值 表示倒数） | ‘[“a”, {“b”:1}]’::jsonb #- ‘{1,b}’ |

注意：||操作符将其每一个操作数的顶层的元素串接起来。它不会递归操作。例如，如果两个操作数都是具有公共域名称的对象，结果中的域值将只是来自右手操作数的值。

下表展示了可用于创建 json 和 jsonb值的函数（没有用于 jsonb的与row\_to\_json和 array\_to\_json等价的函数。不过，to\_jsonb函数 提供了这些函数的很大一部分相同的功能）。

**表. JSON创建函数**

| **函数** | **描述** | **例子** | **例子结果** |
| --- | --- | --- | --- |
| to\_json(anyelement) to\_jsonb(anyelement) | 把该值返回为json或者jsonb。数组和组合 会被（递归）转换成数组和对象；对于不是数组和组合的值，如果有 从该类型到json的造型，造型函数将被用来执行该 转换；否则将产生一个标量值。对于任何不是数字、布尔、空值的标 量类型，将使用文本表达，在这种风格下它是一个合法的 json或者jsonb值。 | to\_json(‘Fred said “Hi.”’::text) | “Fred said "Hi."” |
| row\_to\_json(record [, pretty\_bool]) | 把行作为一个 JSON 对象返回。如果pretty\_bool为真，将在第1层元素之间增加换行。 | row\_to\_json(row(1,‘foo’)) | {“f1”:1,“f2”:“foo”} |
| json\_build\_array(VARIADIC “any”) jsonb\_build\_array(VARIADIC “any”) | 从一个可变参数列表构造一个可能包含异质类型的 JSON 数组。 | json\_build\_array(1,2,‘3’,4,5) | [1, 2, “3”, 4, 5] |
| json\_build\_object(VARIADIC “any”) jsonb\_build\_object(VARIADIC “any”) | 从一个可变参数列表构造一个 JSON 对象。通过转换，该参数列表由交替 出现的键和值构成。 | json\_build\_object(‘foo’,1,‘bar’,2) | {“foo”: 1, “bar”: 2} |
| json\_object(keys text[], values text[]) jsonb\_object(keys text[], values text[]) | json\_object的这种形式从两个独立的数组得到键/值对。在其 他方面和一个参数的形式相同。 | json\_object(’{a, b}’, ‘{1,2}’) | {“a”: “1”, “b”: “2”} |

注意：array\_to\_json和row\_to\_json与to\_json 具有相同的行为，不过它们提供了更好的打印选项。针对to\_json所描述 的行为同样也适用于由其他 JSON 创建函数转换的每个值。

下表展示了可用来处理json 和jsonb值的函数。

**表. JSON处理**

| **函数** | **返回值** | **描述** | **例子** | **例子结果** |
| --- | --- | --- | --- | --- |
| json\_array\_length(json) jsonb\_array\_length(jsonb) | int | 返回最外层 JSON 数组中的元素数量。 | json\_array\_length(’[1,2,3,{“f1”:1,“f2”:[5,6]},4]') | 5 |
| json\_each(json) jsonb\_each(jsonb) | setof key text, value json setof key text, value jsonb | 扩展最外层的 JSON 对象成为一组键/值对。 | select \* from json\_each(’{“a”:“foo”, “b”:“bar”}') | key | value —–+——- a | “foo” b | “bar” |
| json\_each\_text(json) jsonb\_each\_text(jsonb) | setof key text, value text | 扩展最外层的 JSON 对象成为一组键/值对。返回值将是text类型。 | select \* from json\_each\_text(’{“a”:“foo”, “b”:“bar”}') | key | value —–+——- a | foo b | bar |
| json\_extract\_path(from\_json json, VARIADIC path\_elems text[]) jsonb\_extract\_path(from\_json jsonb, VARIADIC path\_elems text[]) | json jsonb | 返回由path\_elems指向的 JSON 值（等效于#>操作符）。 | json\_extract\_path(’{“f2”:{“f3”:1},“f4”:{“f5”:99,“f6”:“foo”}}’,‘f4’) | {“f5”:99,“f6”:“foo”} |
| json\_extract\_path\_text(from\_json json, VARIADIC path\_elems text[]) jsonb\_extract\_path\_text(from\_json jsonb, VARIADIC path\_elems text[]) | text | 以text返回由path\_elems指向的 JSON 值（等效于#»操作符）。 | json\_extract\_path\_text(’{“f2”:{“f3”:1},“f4”:{“f5”:99,“f6”:“foo”}}’,‘f4’, ‘f6’) | foo |
| json\_object\_keys(json) jsonb\_object\_keys(jsonb) | setof text | 返回最外层 JSON 对象中的键集合。 | json\_object\_keys(’{“f1”:“abc”,“f2”:{“f3”:“a”, “f4”:“b”}}’) | json\_object\_keys —————— f1 f2 |
| json\_populate\_record(base anyelement, from\_json json) jsonb\_populate\_record(base anyelement, from\_json jsonb) | anyelement | 扩展from\_json中的对象成一个行，它的列匹配由base定义的记录类型。 | select \* from json\_populate\_record(null::myrowtype, ‘{“a”: 1, “b”: [“2”, “a b”], “c”: {“d”: 4, “e”: “a b c”}}’) | a | b | c —+———–+————- 1 | {2,“a b”} | (4,“a b c”) |
| json\_populate\_recordset(base anyelement, from\_json json) jsonb\_populate\_recordset(base anyelement, from\_json jsonb) | setof anyelement | 扩展from\_json中最外的对象数组为一个集合，该集合的列匹配由base定义的记录类型。 | select \* from json\_populate\_recordset(null::myrowtype, ‘[{“a”:1,“b”:2},{“a”:3,“b”:4}]’) | a | b —+— 1 | 2 3 | 4 |
| json\_array\_elements(json) jsonb\_array\_elements(jsonb) | setof json setof jsonb | 把一个 JSON 数组扩展成一个 JSON 值的集合。 | select \* from json\_array\_elements(’[1,true, [2,false]]') | value ———– 1 true [2,false] |
| json\_array\_elements\_text(json) jsonb\_array\_elements\_text(jsonb) | setof text | 把一个 JSON 数组扩展成一个text值集合。 | select \* from json\_array\_elements\_text(’[“foo”, “bar”]') | value ———– foo bar |
| json\_typeof(json) jsonb\_typeof(jsonb) | text | 把最外层的 JSON 值的类型作为一个文本字符串返回。可能的类型是： object、array、string、number、 boolean以及null。 | json\_typeof(’-123.4') | number |
| json\_to\_record(json) jsonb\_to\_record(jsonb) | record | 从一个 JSON 对象（见下文的注解）构建一个任意的记录。正如所有返回record 的函数一样，调用者必须用一个AS子句显式地定义记录的结构。 | select \* from json\_to\_record(’{“a”:1,“b”:[1,2,3],“c”:[1,2,3],“e”:“bar”,“r”: {“a”: 123, “b”: “a b c”}}’) as x(a int, b text, c int[], d text, r myrowtype) | a | b | c | d | r —+———+———+—+————— 1 | [1,2,3] | {1,2,3} | | (123,“a b c”) |
| json\_to\_recordset(json) jsonb\_to\_recordset(jsonb) | setof record | 从一个 JSON 对象数组构建一个任意的记录集合。正如所有返回record 的函数一样，调用者必须用一个AS子句显式地定义记录的结构。 | select \* from json\_to\_recordset(’[{“a”:1,“b”:“foo”},{“a”:“2”,“c”:“bar”}]’) as x(a int, b text); | a | b —+—– 1 | foo 2 | |
| json\_strip\_nulls(from\_json json) jsonb\_strip\_nulls(from\_json jsonb) | json jsonb | 返回from\_json，其中所有具有空值的 对象域都被省略。其他空值不动。 | json\_strip\_nulls(’[{“f1”:1,“f2”:null},2,null,3]') | [{“f1”:1},2,null,3] |
| jsonb\_set(target jsonb, path text[], new\_value jsonb[, create\_missing boolean]) | jsonb | 返回target，其中由 path指定的节用 new\_value替换，如果 path指定的项不存在并且 create\_missing为真则加上 new\_value。正如面向路径的 操作符一样，出现在path中的 负整数表示从 JSON 数组的末尾开始数。 | jsonb\_set(’[{“f1”:1,“f2”:null},2,null,3]’, ‘{0,f1}’,’[2,3,4]’, false) jsonb\_set(’[{“f1”:1,“f2”:null},2]’, ‘{0,f3}’,’[2,3,4]’) | [{“f1”:[2,3,4],“f2”:null},2,null,3] [{“f1”: 1, “f2”: null, “f3”: [2, 3, 4]}, 2] |
| jsonb\_insert(target jsonb, path text[], new\_value jsonb, [insert\_after boolean]) | jsonb | 返回被插入了new\_value的target。如果path指定的target节在一个 JSONB 数组中，new\_value将被插入到目标之前（insert\_after为false，默认情况）或者之后（insert\_after为真）。如果path指定的target节在一个 JSONB 对象内，则只有当target不存在时才插入new\_value。对于面向路径的操作符来说，出现在path中的负整数表示从 JSON 数组的末尾开始计数。 | jsonb\_insert(’{“a”: [0,1,2]}’, ‘{a, 1}’, ‘“new\_value”’) jsonb\_insert(’{“a”: [0,1,2]}’, ‘{a, 1}’, ‘“new\_value”’, true) | {“a”: [0, “new\_value”, 1, 2]} {“a”: [0, 1, “new\_value”, 2]} |
| jsonb\_pretty(from\_json jsonb) | text | 把from\_json返回成一段 缩进后的 JSON 文本。 | jsonb\_pretty(’[{“f1”:1,“f2”:null},2,null,3]’) | [ { “f1”: 1, “f2”: null }, 2, null, 3 ] |

```
drop type if exists json_test_columns;
--根据json结构创建自定义类型
create type json_test_columns as (a int,b int,c int,d int);
--使用自定义类型输出
select * from json_populate_record(null::json_test_columns,'{"a":1,"b":2,"c":3,"d":4}');
select * from json_populate_recordset(null::json_test_columns,'[{"a":1,"b":2,"c":3,"d":4},{"a":2,"b":3,"c":4,"d":5}]');
--上面的压缩版本,目前还不支持,我个人觉得应该支持,
-- select * from json_populate_recordset(null::json_test_columns,'[[1,2,3,4],[2,3,4,5]]');
--变通方法
select value->>0 as a,value->>1 as b,value->>2 as c,value->>3 as c from (select * from jsonb_array_elements('[[1,2,3,4],[2,3,4,5]]')) as tmp;
```

注意:很多这些函数和操作符将把 JSON 字符串中的 Unicode 转义转换成合适的单一字符。如果 输入类型是jsonb，这就没有问题，因为该转换已经完成了。但是对于json 输入，这可能会导致抛出一个错误。

注意:虽然函数json\_populate\_record、json\_populate\_recordset、json\_to\_record以及json\_to\_recordset的例子使用了常量，但常见的用法是引用FROM子句中的表并且使用其json或jsonb列之一作为函数的参数。然后抽取出的键值可以被查询的其他部分引用，例如WHERE子句和目标列表。以这种方式抽取多个值的性能比用以键为单位的操作符单个抽取它们的性能更好。

JSON键被匹配到目标行类型中的相同列名。这些函数的JSON类型强制是一种“尽力而为”的方式并且对于某些类型可能得不到想要的值。不出现在目标行类型中的JSON字段将从输出中忽略，而且不匹配任何JSON字段的目标列将为NULL。

注意:jsonb\_set和jsonb\_insert的path参数中除最后一项之外的所有项都必须存在于target中。如果create\_missing为假，jsonb\_set的path参数的所有项都必须存在。如果这些条件不满足，则返回的target不会被改变。

如果最后的路径项是一个对象键，在它不存在且给定了新值的情况下会创建它。如果最后的路径项是一个数组索引，为正值则表示从左边开始计数，为负值表示从右边开始计数 - -1表示最右边的元素，以此类推。如果该项超过范围 -array\_length .. array\_length -1 并且 create\_missing 为真，则该项为负时把新值加载数组的开始处，而该项为正时把新值加在数组的末尾处。

注意:不要把json\_typeof函数的null返回值与 SQL 的 NULL 弄混。 虽然调用json\_typeof(’null’::json)将会返回null，但调用 json\_typeof(NULL::json)将会返回一个 SQL 的 NULL。

注意:如果json\_strip\_nulls的参数在任何对象中包含重复的域名称， 结果在语义上可能有所不同，具体取决于它们发生的顺序。这不是 jsonb\_strip\_nulls的一个问题，因为jsonb值 不能具有重复的对象域名称。

## 序列操作函数 [*link*](#%e5%ba%8f%e5%88%97%e6%93%8d%e4%bd%9c%e5%87%bd%e6%95%b0)

本节描述用于操作序列对象的函数，序列对象也被称为序列生成器或者就是序列。序列对象都是用CREATE SEQUENCE创建的特殊的单行表。序列对象通常用于为表的行生成唯一的标识符。表中列出的这些序列函数，可以为我们从序列对象中获取连续的序列值提供了简单的、多用户安全的方法。

**表** **.** **序列函数**

| 函数 | 返回类型 | 描述 |
| --- | --- | --- |
| currval(regclass) | bigint | 返回最近一次用nextval获取的指定序列的值 |
| lastval() | bigint | 返回最近一次用nextval获取的任何序列的值 |
| nextval(regclass) | bigint | 递增序列并返回新值 |
| setval(regclass, bigint) | bigint | 设置序列的当前值 |
| setval(regclass, bigint, boolean) | bigint | 设置序列的当前值以及is\_called标志 |

**创建序列**

```
create sequence public.test_sequece
increment by 1
minvalue 10000000
maxvalue 9999999999
start with 10000000
cache 1;
```

查看序列结构

```
\d test_sequece
                     Sequence "public.test_sequece"
  Type  |  Start   | Minimum  |  Maximum   | Increment | Cycles? | Cache
--------+----------+----------+------------+-----------+---------+-------
 bigint | 10000000 | 10000000 | 9999999999 |         1 | no      |   100

SELECT nextval('test_sequece');
 nextval
----------
 10000000
(1 row)

SELECT nextval('test_sequece');
 nextval
----------
 10000001
(1 row)
select currval('test_sequece');
 currval
----------
 10000001
(1 row)

SELECT setval('test_sequece',  11000001);
  setval
----------
 11000001
(1 row)

select currval('test_sequece');
 currval
----------
 11000001
(1 row)
```

将要由序列函数调用操作的序列是用一个regclass参数声明的， 它只是序列在pg\_class系统表里面的 OID。不过，你不需要手工查找 OID， 因为regclass数据类型的输入转换器会帮你做这件事情。 只要写出用单引号包围的序列名字即可，因此它看上去像文本常量。为了和普通SQL名字处理兼容，这个字串将转换成小写形式， 除非在序列名字周围包含双引号。因此：

```
nextval('test_sequece');      操作序列test_sequece
nextval(' test_sequece ')      操作序列test_sequece
nextval(' test_Sequece "')    操作序列test_sequece
```

必要时序列名可以用模式限定∶

```
nextval(' public.test_sequece ')     操作myschema.foo
nextval('"public". test_sequece ') ;   同上
nextval(' test_sequece ')              在搜索路径中查找foo
nextval(' test_sequece '::text)      foo在运行时查找
查看数据库中有哪些序列
--r =普通表， i =索引，S =序列，v =视图，m =物化视图， c =复合类型，t = TOAST表，f =外部表
select *  from pg_class where relkind='S'
```

可用的序列函数有∶

**nextval**

递增序列对象到它的下一个值并且返回该值。这个动作是自动完成的： 即使多个会话并发执行nextval，每个进程也会安全地收到一个唯一的序列值。

如果一个序列对象是用默认参数创建的，连续的nextval调用将会返回从 1 开始的连续的值。其他的行为可以通过在CREATE SEQUENCE命令中使用特殊参数来获得；详见该命令的参考页。

重要

为了避免阻塞从同一个序列获取序号的并发事务，nextval操作从来不会被回滚。也就是说，一旦一个值被取出就视同被用掉并且不会被再次返回给调用者，即便调用该操作的外层事务后来中止或者调用查询后来没有使用取得的值也是这样。例如一个带有ON CONFLICT子句的INSERT会计算要被插入的元组，其中可能就包括调用nextval，然后才会检测到导致它转向ON CONFLICT规则的冲突。这种情况就会在已分配值的序列中留下未被使用的“空洞”。因此，序列对象不能被用来得到“无间隙”的序列。

这个函数要求序列上的USAGE或者UPDATE特权。

**currval**

在当前会话中返回最近一次nextval取到的该序列的值（如果在本会话中从未在该序列上调用过nextval，那么会报告一个错误）。请注意因为此函数返回一个会话本地的值，不论其它会话是否在当前会话之后执行过nextval，它都能给出一个可预测的回答。

这个函数要求序列上的USAGE或者SELECT特权。

**lastval**

返回当前会话里最近一次nextval返回的值。 这个函数等效于currval，只是它不用序列名作为参数， 它会引用当前会话里面最近一次被应用的序列的nextval。如果当前会话还没有调用过nextval，那么调用lastval会报错。

这个函数要求上一次使用的序列上的USAGE或者SELECT特权。

**setval**

重置序列对象的计数器值。双参数的形式设置序列的last\_value域为指定值并且将其is\_called域设置为 true，表示下一次nextval将在返回值之前递增该序列。currval报告的值也被设置为指定的值。在三参数形式里，is\_called可以设置为true或false。true具有和双参数形式相同的效果。如果你把它设置为false，那么下一次nextval将返回指定的值，而从随后的nextval才开始递增该序列。此外，在这种情况中currval报告的值不会被改变。 例如：

```
SELECT setval(' test_sequece ', 10000001);           下一次nextval会返回 43
SELECT setval(' test_sequece ', 10000001, true);     同上
SELECT setval(' test_sequece ', 10000001, false);    下一次nextval将返回 42
```

setval返回的结果就是它的第二个参数的值。

## 条件表达式 [*link*](#%e6%9d%a1%e4%bb%b6%e8%a1%a8%e8%be%be%e5%bc%8f)

本节描述在MemFireDB中可用的SQL兼容的条件表达式。

### CASE [*link*](#case)

SQL CASE表达式是一种通用的条件表达式，类似于其它编程语言中的 if/else 语句：

```
CASE WHEN condition THEN result
     [WHEN ...]
     [ELSE result]
END
```

CASE子句可以用于任何表达式可以出现的地方。每一个condition是一个返回boolean结果的表达式。如果结果为真，那么CASE表达式的结果就是符合条件的result，并且剩下的CASE表达式不会被处理。如果条件的结果不为真，那么以相同方式搜寻任何随后的WHEN子句。如果没有WHEN condition为真，那么CASE表达式的值就是在ELSE子句里的result。如果省略了ELSE子句而且没有条件为真，结果为空。

例子：

```
create table test (a integer);
insert into table test values(1),(2),(3);
SELECT * FROM test;

 a
---
 1
 2
 3

SELECT a,
       CASE WHEN a=1 THEN 'one'
            WHEN a=2 THEN 'two'
            ELSE 'other'
       END
    FROM test;

 a | case
---+-------
 1 | one
 2 | two
 3 | other
```

所有result表达式的数据类型都必须可以转换成单一的输出类型。

下面这个“简单”形式的CASE表达式是上述通用形式的一个变种：

```
CASE expression
    WHEN value THEN result
    [WHEN ...]
    [ELSE result]
END
```

第一个expression会被计算，然后与所有在WHEN子句中的每一个value对比，直到找到一个相等的。如果没有找到匹配的，则返回在ELSE子句中的result（或者控制）。 这类似于 C 里的switch语句。

上面的例子可以用简单CASE语法来写：

```
SELECT a,
       CASE a WHEN 1 THEN 'one'
              WHEN 2 THEN 'two'
              ELSE 'other'
       END
    FROM test;

 a | case
---+-------
 1 | one
 2 | two
 3 | other
```

CASE表达式并不计算任何无助于判断结果的子表达式。例如，下面是一个可以避免被零除错误的方法：

```
SELECT ... WHERE CASE WHEN x <> 0 THEN y/x > 1.5 ELSE false END;
```

### COALESCE [*link*](#coalesce)

```
COALESCE(value [, ...])
```

COALESCE函数返回它的第一个非空参数的值。当且仅当所有参数都为空时才会返回空。它常用于在为显示目的检索数据时用缺省值替换空值。例如：

```
SELECT COALESCE(description, short_description, '(none)') ...
```

如果description不为空，这将会返回它的值，否则如果short\_description非空则返回short\_description的值，如果前两个都为空则返回(none)。

```
SELECT COALESCE(null,null,now()::varchar, ' ');
```

和CASE表达式一样，COALESCE将不会计算无助于判断结果的参数；也就是说，在第一个非空参数右边的参数不会被计算。这个 SQL 标准函数提供了类似于NVL和IFNULL的能力，它们被用在某些其他数据库系统中。

### NULLIF [*link*](#nullif)

```
NULLIF(value1, value2)
```

当value1和value2相等时，NULLIF返回一个空值。 否则它返回value1。 这些可以用于执行前文给出的COALESCE例子的逆操作：

```
SELECT NULLIF(value, '(none)') ...
```

在这个例子中，如果value是(none)，将返回空值，否则返回value的值。

### GREATEST和LEAST [*link*](#greatest%e5%92%8cleast)

```
GREATEST(value [, ...])
LEAST(value [, ...])
```

GREATEST和LEAST函数从一个任意的数字表达式列表里选取最大或者最小的数值。 这些表达式必须都可以转换成一个普通的数据类型，它将会是结果类型。列表中的 NULL 数值将被忽略。只有所有表达式的结果都是 NULL 的时候，结果才会是 NULL。

请注意GREATEST和LEAST都不是 SQL 标准，但却是很常见的扩展。某些其他数据库让它们在任何参数为 NULL 时返回 NULL，而不是在所有参数都为 NULL 时才返回 NULL。

```
drop table biztable
create table biztable (
           id int PRIMARY key,
           time1 TIMESTAMP,
           time2 TIMESTAMP,
    time3 TIMESTAMP
);
select * from biztable;
insert into            biztable VALUES(1,'2018-05-20 22:52','2019-05-20 22:54','2019-05-20 23:52');

select id,GREATEST(time1,time2,time3)as maxval, LEAST(time1,time2,time3) AS minval
from biztable;
```

## 数组函数与操作符 [*link*](#%e6%95%b0%e7%bb%84%e5%87%bd%e6%95%b0%e4%b8%8e%e6%93%8d%e4%bd%9c%e7%ac%a6)

显示了可以用于数组类型的操作符。

**表.数组操作符**

| 操作符 | 描述 | 例子 | 结果 |
| --- | --- | --- | --- |
| = | 等于 | ARRAY[1.1,2.1,3.1]::int[] = ARRAY[1,2,3] | t |
| <> | 不等于 | ARRAY[1,2,3] <> ARRAY[1,2,4] | t |
| < | 小于 | ARRAY[1,2,3] < ARRAY[1,2,4] | t |
| > | 大于 | ARRAY[1,4,3] > ARRAY[1,2,4] | t |
| <= | 小于等于 | ARRAY[1,2,3] <= ARRAY[1,2,3] | t |
| >= | 大于等于 | ARRAY[1,4,3] >= ARRAY[1,4,3] | t |
| @> | 包含 | ARRAY[1,4,3] @> ARRAY[3,1] | t |
| <@ | 被包含 | ARRAY[2,7] <@ ARRAY[1,7,4,2,6] | t |
| && | 重叠（具有公共元素） | ARRAY[1,4,3] && ARRAY[2,1] | t |
| || | 数组和数组串接 | ARRAY[1,2,3] || ARRAY[4,5,6] | {1,2,3,4,5,6} |
| || | 元素到数组串接 | 3 || ARRAY[4,5,6] | {3,4,5,6} |
| || | 数组到元素串接 | ARRAY[4,5,6] || 7 | {4,5,6,7} |

**表.数组函数**

| **函数** | **返回类型** | **描述** | **例子** | **结果** |
| --- | --- | --- | --- | --- |
| array\_append(anyarray, anyelement) | anyarray | 向一个数组的末端追加一个元素 | array\_append(ARRAY[1,2], 3) | {1,2,3} |
| array\_cat(anyarray, anyarray) | anyarray | 连接两个数组 | array\_cat(ARRAY[1,2,3], ARRAY[4,5]) | {1,2,3,4,5} |
| array\_ndims(anyarray) | int | 返回数组的维度数 | array\_ndims(ARRAY[[1,2,3], [4,5,6]]) | 2 |
| array\_dims(anyarray) | text | 返回数组的维度的文本表示 | array\_dims(ARRAY[[1,2,3], [4,5,6]]) | [1:2][1:3] |
| array\_fill(anyelement, int[], [, int[]]) | anyarray | 返回一个用提供的值和维度初始化好的数组，可以选择下界不为 1 | array\_fill(7, ARRAY[3], ARRAY[2]) | [2:4]={7,7,7} |
| array\_length(anyarray, int) | int | 返回被请求的数组维度的长度 | array\_length(array[1,2,3], 1) | 3 |
| array\_lower(anyarray, int) | int | 返回被请求的数组维度的下界 | array\_lower(’[0:2]={1,2,3}’::int[], 1) | 0 |
| array\_position(anyarray, anyelement [, int]) | int | 返回在该数组中从第三个参数指定的元素开始或者 第一个元素开始（数组必须是一维的）、第二个参数的 第一次出现的下标 | array\_position(ARRAY[‘sun’,‘mon’,’tue’,‘wed’,’thu’,‘fri’,‘sat’], ‘mon’) | 2 |
| array\_positions(anyarray, anyelement) | int[] | 返回在第一个参数给定的数组（数组必须是一维的）中， 第二个参数所有出现位置的下标组成的数组 | array\_positions(ARRAY[‘A’,‘A’,‘B’,‘A’], ‘A’) | {1,2,4} |
| array\_prepend(anyelement, anyarray) | anyarray | 向一个数组的首部追加一个元素 | array\_prepend(1, ARRAY[2,3]) | {1,2,3} |
| array\_remove(anyarray, anyelement) | anyarray | 从数组中移除所有等于给定值的所有元素（数组必须是一维的） | array\_remove(ARRAY[1,2,3,2], 2) | {1,3} |
| array\_replace(anyarray, anyelement, anyelement) | anyarray | 将每一个等于给定值的数组元素替换成一个新值 | array\_replace(ARRAY[1,2,5,4], 5, 3) | {1,2,3,4} |
| array\_to\_string(anyarray, text [, text]) | text | 使用提供的定界符和可选的空串连接数组元素 | array\_to\_string(ARRAY[1, 2, 3, NULL, 5], ‘,’, ‘\*’) | 1,2,3,\*,5 |
| array\_upper(anyarray, int) | int | 返回被请求的数组维度的上界 | array\_upper(ARRAY[1,8,3,7], 1) | 4 |
| cardinality(anyarray) | int | 返回数组中元素的总数，如果数组为空则返回 0 | cardinality(ARRAY[[1,2],[3,4]]) | 4 |
| string\_to\_array(text, text [, text]) | text[] | 使用提供的定界符和可选的空串将字符串划分成数组元素 | string\_to\_array(‘xx~^~yy~^~zz’, ‘~^~’, ‘yy’) | {xx,NULL,zz} |
| unnest(anyarray) | setof anyelement | 将一个数组扩展成一组行 | unnest(ARRAY[1,2]) | 1 2 (2 rows) |
| unnest(anyarray, anyarray [, …]) | setof anyelement, anyelement [, …] | 把多维数组（可能是不同类型）扩展成一个行的集合。 这只允许用在 FROM 子句中 | SELECT \* from unnest(ARRAY[1,2],ARRAY[‘foo’,‘bar’,‘baz’]); | 1 foo 2 bar NULL baz (3 rows) |

在array\_position和array\_positions中， 每一个数组元素都使用IS NOT DISTINCT FROM 语义与要搜索的值比较。

在array\_position中，如果值没有找到则返回 NULL。

在array\_positions中，只有当数组为 NULL时才返回NULL，如果该值 没有在该数组中找到则返回一个空数组。

在string\_to\_array中，如果定界符参数为 NULL，输入字符串中的每一个字符将变成结果数组中的一个独立元素。如果定界符是一个空串，则整个输入字符串被作为一个单一元素的数组返回。否则输入字符串会被在每一个出现定界符字符串的位置分裂。

在string\_to\_array中，如果空值串参数被忽略或者为 NULL，输入中的子串不会被替换成 NULL。在array\_to\_string中，如果空值串参数被忽略或者为 NULL，该数组中的任何空值元素会被简单地跳过并且不会在输出串中被表示。

## 范围函数和操作符 [*link*](#%e8%8c%83%e5%9b%b4%e5%87%bd%e6%95%b0%e5%92%8c%e6%93%8d%e4%bd%9c%e7%ac%a6)

下表 展示了范围类型可用的操作符。

**表.范围操作符**

| **操作符** | **描述** | **例子** | **结果** |
| --- | --- | --- | --- |
| = | 等于 | int4range(1,5) = ‘[1,4]’::int4range | t |
| <> | 不等于 | numrange(1.1,2.2) <> numrange(1.1,2.3) | t |
| < | 小于 | int4range(1,10) < int4range(2,3) | t |
| > | 大于 | int4range(1,10) > int4range(1,5) | t |
| <= | 小于等于 | numrange(1.1,2.2) <= numrange(1.1,2.2) | t |
| >= | 大于等于 | numrange(1.1,2.2) >= numrange(1.1,2.0) | t |
| @> | 包含范围 | int4range(2,4) @> int4range(2,3) | t |
| @> | 包含元素 | ‘[2011-01-01,2011-03-01)’::tsrange @> ‘2011-01-10’::timestamp | t |
| <@ | 范围被包含 | int4range(2,4) <@ int4range(1,7) | t |
| <@ | 元素被包含 | 42 <@ int4range(1,7) | f |
| && | 重叠（有公共点） | int8range(3,7) && int8range(4,12) | t |
| « | 严格左部 | int8range(1,10) « int8range(100,110) | t |
| » | 严格右部 | int8range(50,60) » int8range(20,30) | t |
| &< | 不超过右部 | int8range(1,20) &< int8range(18,20) | t |
| &> | 不超过左部 | int8range(7,20) &> int8range(5,10) | t |
| -|- | 相邻 | numrange(1.1,2.2) -|- numrange(2.2,3.3) | t |
| + | 并 | numrange(5,15) + numrange(10,20) | [5,20) |
| \* | 交 | int8range(5,15) \* int8range(10,20) | [10,15) |
| - | 差 | int8range(5,15) - int8range(10,20) | [5,10) |

简单比较操作符<、 >、<=和 >=首先比较下界，并且只有在下界相等时才比较上界。这些比较通常对范围不怎么有用，但是还是提供它们以便能够在范围上构建 B树索引。

当涉及一个空范围时，左部/右部/相邻操作符总是返回假；即一个空范围被认为不在任何其他范围前面或者后面。

如果结果范围可能需要包含两个分离的子范围，并和差操作符将会失败，因为这样的范围无法被表示。

下表显示可用于范围类型的函数。

**表. 范围函数**

| **函数** | **返回类型** | **描述** | **例子** | **结果** |
| --- | --- | --- | --- | --- |
| lower(anyrange) | 范围的元素类型 | 范围的下界 | lower(numrange(1.1,2.2)) | 1.1 |
| upper(anyrange) | 范围的元素类型 | 范围的上界 | upper(numrange(1.1,2.2)) | 2.2 |
| isempty(anyrange) | boolean | 范围为空？ | isempty(numrange(1.1,2.2)) | false |
| lower\_inc(anyrange) | boolean | 下界包含在内？ | lower\_inc(numrange(1.1,2.2)) | true |
| upper\_inc(anyrange) | boolean | 上界包含在内？ | upper\_inc(numrange(1.1,2.2)) | false |
| lower\_inf(anyrange) | boolean | 下界无限？ | lower\_inf(’(,)’::daterange) | true |
| upper\_inf(anyrange) | boolean | 上界无限？ | upper\_inf(’(,)’::daterange) | true |
| range\_merge(anyrange, anyrange) | anyrange | 包含两个给定范围的最小范围 | range\_merge(’[1,2)’::int4range, ‘[3,4)’::int4range) | [1,4) |

如果范围为空或者被请求的界是无限的，lower和upper函数返回空值。函数lower\_inc、upper\_inc、lower\_inf和upper\_inf对一个空范围全部返回假。

## 聚集函数 [*link*](#%e8%81%9a%e9%9b%86%e5%87%bd%e6%95%b0)

聚集函数从一个输入值的集合计算出一个单一值；

聚合函数分为四类：

· 通用聚集函数

· 统计聚集函数

· 有序集聚集函数

· 假象集聚集函数

**通用聚集函数**

| **函数** | **参数类型** | **返回类型** | **部分模式** | **描述** |  |
| --- | --- | --- | --- | --- | --- |
| array\_agg(expression) | 任何非数组类型 | 参数类型的数组 | No | 输入值（包括空）被连接到一个数组 |  |
| array\_agg(expression) | 任意数组类型 | 和参数数据类型相同 | No | 输入数组被串接到一个更高维度的数组中 （输入必须都具有相同的维度并且不能为空或者 NULL） |  |
| avg(expression) | smallint, int, bigint、real、double precision、numeric或interval | 对于任何整数类型参数是numeric，对于一个浮点参数是double precision，否则和参数数据类型相同 | Yes | 所有输入值的平均值（算术平均） |  |
| bit\_and(expression) | smallint、int、bigint或bit | 与参数数据类型相同 | Yes | 所有非空输入值的按位与，如果没有非空值则结果是空值 |  |
| bit\_or(expression) | smallint, int, bigint, or bit | 与参数数据类型相同 | Yes | 所有非空输入值的按位或，如果没有非空值则结果是空值 |  |
| bool\_and(expression) | bool | bool | Yes | 如果所有输入值为真则结果为真，否则为假 |  |
| bool\_or(expression) | bool | bool | Yes | 至少一个输入值为真时结果为真，否则为假 |  |
| count(\*) |  | bigint | Yes | 输入的行数 |  |
| count(expression) | any | bigint | Yes | expression值非空的输入行的数目 |  |
| every(expression) | bool | bool | Yes | 等价于bool\_and |  |
| json\_agg(expression) | any | json | No | 将值聚集成一个 JSON 数组 |  |
| jsonb\_agg(expression) | any | jsonb | No | 把值聚合成一个 JSON 数组 |  |
| json\_object\_agg(name, value) | (any, any) | json | No | 将名字/值对聚集成一个 JSON 对象 |  |
| jsonb\_object\_agg(name, value) | (any, any) | jsonb | No | 把名字/值对聚合成一个 JSON 对象 |  |
| max(expression) | 任意数组、数字、串、日期/时间、网络或者枚举类型，或者这些类型的数组 | 与参数数据类型相同 | Yes | 所有输入值中expression的最大值 |  |
| min(expression) | 任意数组、数字、串、日期/时间、网络或者枚举类型，或者这些类型的数组 | 与参数数据类型相同 | Yes | 所有输入值中expression的最小值 |  |
| string\_agg(expression, delimiter) | (text, text) 或 (bytea, bytea) | 与参数数据类型相同 | No | 输入值连接成一个串，用定界符分隔 |  |
| sum(expression) | smallint、int、 bigint、real、double precision、numeric、 interval或money | 对smallint或int参数是bigint，对bigint参数是numeric，否则和参数数据类型相同 | Yes | 所有输入值的expression的和 |  |
|  |  |  |  |  |  |

对于array\_agg()，string\_agg()，jsonb\_agg()，和json\_agg()，所述列表顺序是由确定ORDER BY子句中的SELECT列表表达式调用的聚合函数。由于jsonb\_object\_agg()（和json\_object\_agg()）产生的单个值是一个JSON对象，并且由于该值的元素没有顺序，ORDER BY因此SELECT列表表达式中的子句无效。

**用于统计的聚集函数**

| **函数** | **参数类型** | **返回类型** | **部分模式** | **描述** |
| --- | --- | --- | --- | --- |
| corr(Y, X) | double precision | double precision | Yes | 相关系数 |
| covar\_pop(Y, X) | double precision | double precision | Yes | 总体协方差 |
| covar\_samp(Y, X) | double precision | double precision | Yes | 样本协方差 |
| regr\_avgx(Y, X) | double precision | double precision | Yes | 自变量的平均值 （sum(X)/N） |
| regr\_avgy(Y, X) | double precision | double precision | Yes | 因变量的平均值 （sum(Y)/N） |
| regr\_count(Y, X) | double precision | bigint | Yes | 两个表达式都不为空的输入行的数目 |
| regr\_intercept(Y, X) | double precision | double precision | Yes | 由（X, Y）对决定的最小二乘拟合的线性方程的 y截距 |
| regr\_r2(Y, X) | double precision | double precision | Yes | 相关系数的平方 |
| regr\_slope(Y, X) | double precision | double precision | Yes | 由（X, Y）对决定的最小二乘拟合的线性方程的斜率 |
| regr\_sxx(Y, X) | double precision | double precision | Yes | sum(X^2) - sum(X)^2/N（自变量的“平方和”） |
| regr\_sxy(Y, X) | double precision | double precision | Yes | sum(X\*Y) - sum(X) \* sum(Y)/N（自变量乘以因变量的“积之合”） |
| regr\_syy(Y, X) | double precision | double precision | Yes | sum(Y^2) - sum(Y)^2/N（因变量的“平方和”） |
| stddev(expression) | smallint、int、 bigint、real、double precision或numeric | 浮点参数为double precision，否则为numeric | Yes | stddev\_samp的历史别名 |
| stddev\_pop(expression) | smallint、int、 bigint、real、double precision或numeric | 浮点参数为double precision，否则为numeric | Yes | 输入值的总体标准偏差 |
| stddev\_samp(expression) | smallint、int、 bigint、real、double precision或numeric | 浮点参数为double precision，否则为numeric | Yes | 输入值的样本标准偏差 |
| variance(expression) | smallint、int、 bigint、real、double precision或numeric | 浮点参数为double precision，否则为numeric | Yes | var\_samp的历史别名 |
| var\_pop(expression) | smallint、int、 bigint、real、double precision或numeric | 浮点参数为double precision，否则为numeric | Yes | 输入值的总体方差（总体标准偏差的平方） |
| var\_samp(expression) | smallint、int、 bigint、real、double precision或numeric | 浮点参数为double precision，否则为numeric | Yes | 输入值的样本方差（样本标准偏差的平方） |

可以通过以下两种方法之一调用此类中的聚合函数：

· GROUP BY当表中的所有行返回一组行的单个值时，*要么*“通常”在表中的所有行上，要么与结合。在这种用法中，行排序无关紧要。

· *或*作为窗口函数用OVER。在此用法中，针对窗口中的每一行评估聚合函数时，排序始终很重要。

**有序集聚集函数**

只能使用专用WITHIN GROUP (ORDER BY …)语法来调用它们。他们不能被调用的窗函数有OVER。

| 函数 | 直接参数类型 | 聚集参数类型 | 返回类型 | 部分模式 | 描述 |
| --- | --- | --- | --- | --- | --- |
| mode() WITHIN GROUP (ORDER BY sort\_expression) |  | 任何可排序类型 | 与排序表达式相同 | No | 返回最频繁的输入值（如果有多个频度相同的值就选第一个） |
| percentile\_cont(fraction) WITHIN GROUP (ORDER BY sort\_expression) | double precision | double precision或者interval | 与排序表达式相同 | No | 连续百分率：返回一个对应于排序中指定分数的值，如有必要就在相邻的输入项之间插值 |
| percentile\_cont(fractions) WITHIN GROUP (ORDER BY sort\_expression) | double precision[] | double precision或者interval | 排序表达式的类型的数组 | No | 多重连续百分率：返回一个匹配fractions参数形状的结果数组， 其中每一个非空元素都用对应于那个百分率的值替换 |
| percentile\_disc(fraction) WITHIN GROUP (ORDER BY sort\_expression) | double precision | 一种可排序类型 | 与排序表达式相同 | No | 离散百分率：返回第一个在排序中位置等于或者超过指定分数的输入值 |
| percentile\_disc(fractions) WITHIN GROUP (ORDER BY sort\_expression) | double precision[] | 任何可排序类型 | 排序表达式的类型的数组 | No | 多重离散百分率：返回一个匹配fractions参数形状的结果数组， 其中每一个非空元素都用对应于那个百分率的输入值替换 |

**假想集聚集函数**

| **函数** | 直接参数类型 | 聚集参数类型 | 返回类型 | 部分模式 | 描述 |
| --- | --- | --- | --- | --- | --- |
| rank(args) WITHIN GROUP (ORDER BY sorted\_args) | VARIADIC “any” | VARIADIC “any” | bigint | No | 假想行的排名，为重复的行留下间隔 |
| dense\_rank(args) WITHIN GROUP (ORDER BY sorted\_args) | VARIADIC “any” | VARIADIC “any” | bigint | No | 假想行的排名，不留间隔 |
| percent\_rank(args) WITHIN GROUP (ORDER BY sorted\_args) | VARIADIC “any” | VARIADIC “any” | double precision | No | 假想行的相对排名，范围从 0 到 1 |
| cume\_dist(args) WITHIN GROUP (ORDER BY sorted\_args) | VARIADIC “any” | VARIADIC “any” | double precision | No | 假想行的相对排名，范围从 1/N 到 1 |

**表. 分组操作**

| 函数 | 返回类型 | 描述 |
| --- | --- | --- |
| GROUPING(args…) | integer | 整数位掩码指示哪些参数不被包括在当前分组集合中 |

分组操作用来与分组集合共同来区分结果行。GROUPING操作的参数并不会被实际计算，但是它们必 须准确地匹配在相关查询层次的GROUP BY子句中给定的表达式。 最右边参数指派的位是最低有效位，如果对应的表达式被包括在产生结果行的分组 集合的分组条件中则每一位是 0，否则是 1。例如：

```
=> SELECT * FROM items_sold;
 make  | model | sales
-------+-------+-------
 Foo   | GT    |  10
 Foo   | Tour  |  20
 Bar   | City  |  15
 Bar   | Sport |  5
(4 rows)

=> SELECT make, model, GROUPING(make,model), sum(sales) FROM items_sold GROUP BY ROLLUP(make,model);
 make  | model | grouping | sum
-------+-------+----------+-----
 Foo   | GT    |        0 | 10
 Foo   | Tour  |        0 | 20
 Bar   | City  |        0 | 15
 Bar   | Sport |        0 | 5
 Foo   |       |        1 | 30
 Bar   |       |        1 | 20
       |       |        3 | 50
(7 rows)
```

## 窗口函数 [*link*](#%e7%aa%97%e5%8f%a3%e5%87%bd%e6%95%b0)

窗口函数提供在与当前查询行相关的行集合上执行计算的能力。注意：必须使用窗口函数的语法调用这些函数； 一个OVER子句是必需的。

**通用窗口函数**

| 函数 | 描述 |
| --- | --- |
| row\_number() | 当前行在其分区中的行号，从1计 |
| rank() | 带间隙的当前行排名； 与该行的第一个同等行的row\_number相同 |
| dense\_rank() | 不带间隙的当前行排名； 这个函数计数同等组 |
| percent\_rank() | 当前行的相对排名： (rank- 1) / (总行数 - 1) |
| cume\_dist() | 累积分布：(在当前行之前或者平级的分区行数) / 分区行总数 |
| ntile() | 从1到参数值的整数范围，尽可能等分分区 |
| lag(value anyelement [, offset integer [, default anyelement ]]) | 返回value，它在分区内当前行的之前offset个位置的行上计算；如果没有这样的行，返回default替代（必须和value类型相同）。offset和default都是根据当前行计算的结果。如果忽略它们，则offset默认是1，default默认是空值 |
| lead(value anyelement [, offset integer [, default anyelement ]]) | 返回value，它在分区内当前行的之后offset个位置的行上计算；如果没有这样的行，返回default替代（必须和value类型相同）。offset和default都是根据当前行计算的结果。如果忽略它们，则offset默认是1，default默认是空值 |
| first\_value() | 返回在窗口帧中第一行上计算的值 |
| last\_value() | 返回在窗口帧中最后一行上计算的值 |
| nth\_value() | 返回在窗口帧中第n行（行从1计数）上计算的值；没有这样的行则返回空值 |

## 子查询表达式 [*link*](#%e5%ad%90%e6%9f%a5%e8%af%a2%e8%a1%a8%e8%be%be%e5%bc%8f)

本节描述MemFireDB中可用的SQL兼容的子查询表达式。所有本节中成文的表达式都返回布尔值（真/假）结果。

### EXISTS [*link*](#exists)

```
EXISTS (subquery)
```

EXISTS的参数是一个任意的SELECT语句， 或者说子查询。系统对子查询进行运算以判断它是否返回行。如果它至少返回一行，那么EXISTS的结果就为“真”； 如果子查询没有返回行，那么EXISTS的结果是“假”。

```
NOT EXISTS (subquery)
not exists与exists正好相反，如果子查询没有返回结果，为'TRUE'，否则'FALSE'。
```

子查询可以引用来自周围的查询的变量，这些变量在该子查询的任何一次计算中都起常量的作用。

这个子查询通常只是运行到能判断它是否可以返回至少一行为止， 而不是等到全部结束。在这里写任何有副作用的子查询都是不明智的（例如调用序列函数）；这些副作用是否发生是很难判断的。

因为结果只取决于是否会返回行，而不取决于这些行的内容， 所以这个子查询的输出列表通常是无关紧要的。一个常用的编码习惯是用EXISTS(SELECT 1 WHERE …)的形式写所有的EXISTS测试。不过这条规则有例外，例如那些使用INTERSECT的子查询。

下面这个简单的例子类似在col2上的一次内联接，但是它为每个 tab1的行生成最多一个输出，即使存在多个匹配tab2的行也如此∶

```
SELECT col1
FROM tab1
WHERE EXISTS (SELECT 1 FROM tab2 WHERE col2 = tab1.col2);
```

### IN [*link*](#in)

```
expression IN (subquery)
```

右手边是一个圆括弧括起来的子查询， 它必须正好只返回一个列。左手边表达式将被计算并与子查询结果逐行进行比较。 如果找到任何等于子查询行的情况，那么IN的结果就是“真”。 如果没有找到相等行，那么结果是“假”（包括子查询没有返回任何行的情况）。

请注意如果左手边表达式得到空值，或者没有相等的右手边值， 并且至少有一个右手边行得到空值，那么IN结构的结果将是空值，而不是假。这个行为是遵照 SQL 处理空值的一般规则的。

```
DROP TABLE COMPANY;
CREATE TABLE COMPANY(
   ID INT PRIMARY KEY     NOT NULL,
   NAME           TEXT    NOT NULL,
   AGE            INT     NOT NULL,
   ADDRESS        CHAR(50),
   SALARY         REAL
);
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
VALUES (1, 'Paul', 32, 'California', 20000.00 );
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
VALUES (2, 'Allen', 25, 'Texas', 15000.00 );
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
VALUES (3, 'Teddy', 23, 'Norway', 20000.00 );
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
VALUES (4, 'Mark', 25, 'Rich-Mond ', 65000.00 );
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
VALUES (5, 'David', 27, 'Texas', 85000.00 );
INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY)
VALUES (6, 'Kim', 22, 'South-Hall', 45000.00 );
INSERT INTO COMPANY VALUES (7, 'James', 24, 'Houston', 10000.00 );
SELECT * FROM COMPANY WHERE ID IN (SELECT ID FROM COMPANY  WHERE SALARY > 45000) ;
```

和EXISTS一样，假设子查询将被完成运行完全是不明智的。

```
row_constructor IN (subquery)
```

这种形式的IN的左手边是一个行构造器。 右手边是一个圆括弧子查询，它必须返回和左手边返回的行中表达式所构成的完全一样多的列。 左手边表达式将被计算并与子查询结果逐行进行比较。如果找到任意相等的子查询行，则IN的结果为“真”。如果没有找到相等行， 那么结果为“假”（包括子查询不返回行的情况）。

通常，表达式或者子查询行里的空值是按照 SQL 布尔表达式的一般规则进行组合的。 如果两个行对应的成员都非空并且相等，那么认为这两行相等；如果任意对应成员为非空且不等，那么这两行不等； 否则这样的行比较的结果是未知（空值）。如果所有行的结果要么是不等， 要么是空值，并且至少有一个空值，那么IN的结果是空值。

### NOT IN [*link*](#not-in)

```
expression NOT IN (subquery)
```

右手边是一个用圆括弧包围的子查询，它必须返回正好一个列。左手边表达式将被计算并与子查询结果逐行进行比较。 如果只找到不相等的子查询行（包括子查询不返回行的情况），那么NOT IN的结果是“真”。 如果找到任何相等行，则结果为“假”。

请注意如果左手边表达式得到空值，或者没有相等的右手边值， 并且至少有一个右手边行得到空值，那么NOT IN结构的结果将是空值，而不是真。这个行为是遵照 SQL 处理空值的一般规则的。

和EXISTS一样，假设子查询会完全结束是不明智的。

```
row_constructor NOT IN (subquery)
```

这种形式的NOT IN的左手边是一个行构造器。 右手边是一个圆括弧子查询，它必须返回和左手边返回的行中表达式所构成的完全一样多的列。 左手边表达式将被计算并与子查询结果逐行进行比较。如果找到不等于子查询行的行，则NOT IN的结果为“真”。如果找到相等行， 那么结果为“假”（包括子查询不返回行的情况）。

通常，表达式或者子查询行里的空值是按照 SQL 布尔表达式的一般规则进行组合的。 如果两个行对应的成员都非空并且相等，那么认为这两行相等；如果任意对应成员为非空且不等，那么这两行不等； 否则这样的行比较的结果是未知（空值）。如果所有行的结果要么是不等， 要么是空值，并且至少有一个空值，那么NOT IN的结果是空值。

```
SELECT * FROM COMPANY WHERE ID not IN (SELECT ID FROM COMPANY  WHERE SALARY > 45000) ;
```

### ANY/SOME [*link*](#anysome)

```
expression operator ANY (subquery)
expression operator SOME (subquery)
```

这种形式的右手边是一个圆括弧括起来的子查询， 它必须返回正好一个列。左手边表达式将被计算并使用给出的 操作符对子查询结果逐行进行比较。如果获得任何真值结果，那么ANY的结果就是“真”。 如果没有找到真值结果，那么结果是“假”（包括子查询没有返回任何行的情况）。

SOME是ANY的同义词。IN等价于= ANY。

请注意如果没有任何成功并且至少有一个右手边行为该操作符结果生成空值， 那么ANY结构的结果将是空值，而不是假。 这个行为是遵照 SQL 处理空值布尔组合的一般规则制定的。

和EXISTS一样，假设子查询将被完全运行是不明智的。

```
row_constructor operator ANY (subquery)
row_constructor operator SOME (subquery)
```

这种形式的左手边是一个行构造器。右手边是一个圆括弧括起来的子查询， 它必须返回和左手边列表给出的表达式一样多的列。左手边表达式将被计算并使用给出的操作符对子查询结果逐行进行比较。如果比较为任何子查询行返回真，则ANY的结果为“真”。如果比较对每一个子查询行都返回假，则结果为“假”（包括子查询不返回行的情况）。如果比较不对任何行返回真并且至少对一行返回 NULL，则结果为 NULL。

### ALL [*link*](#all)

```
expression operator ALL (subquery)
```

ALL 的这种形式的右手边是一个圆括弧括起来的子查询， 它必须只返回一列。左手边表达式将被计算并使用给出的 操作符对子查询结果逐行进行比较。该操作符必须生成布尔结果。 如果所有行得到真（包括子查询没有返回任何行的情况），ALL的结果就是“真”。如果没有存在任何假值结果，那么结果是“假”。如果比较为任何行都不返回假并且对至少一行返回 NULL，则结果为 NULL。

NOT IN等价于<> ALL。

和EXISTS一样，假设子查询将被完全运行是不明智的。

```
row_constructor operator ALL (subquery)
```

ALL的这种形式的左手边是一个行构造器。 右手边是一个圆括弧括起来的子查询，它必须返回和左手边行中表达式一样多的列。 左手边表达式将被计算并使用给出的 操作符对子查询结果逐行进行比较。如果对所有子查询行该比较都返回真，那么ALL的结果就是“真”（包括子查询没有返回任何行的情况）。如果对任何子查询行比较返回假，则结果为“假”。如果比较对任何子查询行都不返回假并且对至少一行返回 NULL，则结果为 NULL。

### 单一行比较 [*link*](#%e5%8d%95%e4%b8%80%e8%a1%8c%e6%af%94%e8%be%83)

```
row_constructor operator (subquery)
```

左手边是一个行构造器，。 右手边是一个圆括弧括起来的子查询，该查询必须返回和左手边行中表达式数目完全一样的列。 另外，该子查询不能返回超过一行的数量（如果它返回零行，那么结果就是空值）。 左手边被计算并逐行与右手边的子查询结果行比较。

## 行与数组比较 [*link*](#%e8%a1%8c%e4%b8%8e%e6%95%b0%e7%bb%84%e6%af%94%e8%be%83)

本节描述几个特殊的结构，用于在值的组之间进行多重比较。这些形式语法上和前面一节的子查询形式相关，但是不涉及子查询。所有本节记录的表达式形式都返回布尔（Boolean）结果（真/假）。

### IN [*link*](#in-1)

```
expression IN (value [, ...])
```

右手边是一个圆括弧包围的标量列表。如果左手边表达式的结果等于任何右手边表达式中的一个，结果为“真”。它是下面形式的缩写

```
expression = value1
OR
expression = value2
OR
...
```

请注意如果左手边表达式得到空值，或者没有相等的右手边值并且至少有一个右手边的表达式得到空值，那么IN结构的结果将为空值，而不是假。这符合 SQL 处理空值的布尔组合的一般规则。

### NOT IN [*link*](#not-in-1)

```
expression NOT IN (value [, ...])
```

右手边是一个圆括弧包围的标量列表。如果左手边表达式的结果不等于所有右手边表达式，结果为“真”。它是下面形式的缩写

```
expression <> value1
AND
expression <> value2
AND
...
```

请注意如果左手边表达式得到空值，或者没有相等的右手边值并且至少有一个右手边的表达式得到空值，那么NOT IN结构的结果将为空值， 而不是我们可能天真地认为的真值。这符合 SQL 处理空值的布尔组合的一般规则。

提示

x NOT IN y在所有情况下都等效于NOT (x IN y)。但是，在处理空值的时候，用NOT IN比用IN更可能迷惑新手。最好尽可能用正逻辑来表达你的条件。

### ANY/SOME (array) [*link*](#anysome-array)

```
expression operator ANY (array expression)
expression operator SOME (array expression)
```

右手边是一个圆括弧包围的表达式，它必须得到一个数组值。左手边表达式被计算并且使用给出的操作符对数组的每个元素进行比较，这个操作符必须得到布尔结果。如果得到了任何真值结果，那么ANY的结果是“真”。 如果没有找到真值结果（包括数组只有零个元素的情况），那么结果是“假”。

如果数组表达式得到一个空数组，ANY的结果将为空值。如果左手边的表达式得到空值，ANY通常是空值（尽管一个非严格比较操作符可能得到一个不同的结果）。另外，如果右手边的数组包含任何空值元素或者没有得到真值比较结果，ANY的结果将是空值而不是假（再次，假设是一个严格的比较操作符）。这符合 SQL 对空值的布尔组合的一般规则。

SOME是ANY的同义词。

### ALL (array) [*link*](#all-array)

```
expression operator ALL (array expression)
```

右手边是一个圆括弧包围的表达式，它必须得到一个数组值。左手边表达式将被计算并使用给出的操作符与数组的每个元素进行比较，这个操作符必须得到一个布尔结果。如果所有比较都得到真值结果，那么ALL的结果是 “真”（包括数组只有零个元素的情况）。如果有任何假值结果，那么结果是“假”。

```
create table t1(id  int);
insert into t1 Values (1), (2),(3);
select * from t1 where t1 in (2,5,6);
select * from t1 where id not  in (2,5,6);
select * from t1 where id < any(array[1,3]);
select * from t1 where id > some(array[1,3]);
select * from t1 where id < ALL(array[3]);
```

如果数组表达式得到一个空数组，ALL的结果将为空值。如果左手边的表达式得到空值，ALL通常是空值（尽管一个非严格比较操作符可能得到一个不同的结果）。另外，如果右手边的数组包含任何空值元素或者没有得到假值比较结果，ALL的结果将是空值而不是真（再次，假设是一个严格的比较操作符）。这符合 SQL 对空值的布尔组合的一般规则。

### 行构造器比较 [*link*](#%e8%a1%8c%e6%9e%84%e9%80%a0%e5%99%a8%e6%af%94%e8%be%83)

```
row_constructor operator row_constructor
```

每一边都是一个行构造器。两个行值必须具有相同数量的域。每一边被计算并且被逐行比较。当操作符是 =、 <>、 < <=、 >、 >=时，允许进行行构造器比较。

=和<>情况略有不同。如果两行的所有对应成员都是非空且相等则这两行被认为相等；如果任何对应成员是非空但是不相等则这两行不相等；否则行比较的结果为未知（空值）。

对于<、<=、>和>=情况，行元素被从左至右比较，在找到一处不等的或为空的元素对就立刻停下来。如果这一对元素都为空值，则行比较的结果为未知（空值）；否则这一对元素的比较结果决定行比较的结果。例如，ROW(1,2,NULL) < ROW(1,3,0)得到真，而不是空值，因为第三对元素并没有被考虑。

```
row_constructor IS DISTINCT FROM row_constructor
```

这个结构与<>行比较相似，但是它对于空值输入不会得到空值。任何空值被认为和任何非空值不相等（有区别），并且任意两个空值被认为相等（无区别）。因此结果将总是为真或为假，永远不会是空值。

```
row_constructor IS NOT DISTINCT FROM row_constructor
```

这个结构与=行比较相似，但是它对于空值输入不会得到空值。任何空值被认为和任何非空值不相等（有区别），并且任意两个空值被认为相等（无区别）。因此结果将总是为真或为假，永远不会是空值。

### 组合类型比较 [*link*](#%e7%bb%84%e5%90%88%e7%b1%bb%e5%9e%8b%e6%af%94%e8%be%83)

```
record operator record
```

SQL 规范要求在结果依赖于比较两个 NULL 值或者一个 NULL 与一个非 NULL 时逐行比较返回 NULL。PostgreSQL只有在比较两个行构造器的结果或者比较一个行构造器与一个子查询的输出时才这样做。在其他比较两个组合类型值的环境中，两个 NULL 域值被认为相等，并且一个 NULL 被认为大于一个非 NULL。为了得到组合类型的一致的排序和索引行为，这样做是必要的。

## 集合返回函数 [*link*](#%e9%9b%86%e5%90%88%e8%bf%94%e5%9b%9e%e5%87%bd%e6%95%b0)

本节描述那些可能返回多于一行的函数。目前这个类中被使用最广泛的是级数生成函数， 如表所述。其他更特殊的集合返回函数在本手册的其他地方描述。

**表.级数生成函数**

| **函数** | **参数类型** | **返回类型** | **描述** |
| --- | --- | --- | --- |
| generate\_series(start, stop) | int、bigint或者numeric | setof int、setof bigint或者setof numeric（与参数类型相同） | 产生一系列值，从start到stop，步长为 1 |
| generate\_series(start, stop, step) | int、bigint或者numeric | setof int、setof bigint或者setof numeric（与参数类型相同） | 产生一系列值，从start到stop，步长为step |
| generate\_series(start, stop, step interval) | timestamp或timestamp with time zone | setof timestamp或setof timestamp with time zone（和参数类型相同） | 产生一系列值，从start到stop，步长为step |

当step为正时，如果start大于stop则返回零行。相反，当step为负时，如果start小于stop则返回零行。对于NULL输入也会返回零行。step为零是一个错误。下面是一些例子：

```
SELECT * FROM generate_series(2,4);
 generate_series
-----------------
               2
               3
               4
(3 rows)

SELECT * FROM generate_series(5,1,-2);
 generate_series
-----------------
               5
               3
               1
(3 rows)

SELECT * FROM generate_series(4,3);
 generate_series
-----------------
(0 rows)

SELECT generate_series(1.1, 4, 1.3);
 generate_series
-----------------
             1.1
             2.4
             3.7
(3 rows)

-- 这个例子依赖于日期+整数操作符
SELECT current_date + s.a AS dates FROM generate_series(0,14,7) AS s(a);
   dates
------------
 2004-02-05
 2004-02-12
 2004-02-19
(3 rows)

SELECT * FROM generate_series('2008-03-01 00:00'::timestamp,
                              '2008-03-04 12:00', '10 hours');
   generate_series
---------------------
 2008-03-01 00:00:00
 2008-03-01 10:00:00
 2008-03-01 20:00:00
 2008-03-02 06:00:00
 2008-03-02 16:00:00
 2008-03-03 02:00:00
 2008-03-03 12:00:00
 2008-03-03 22:00:00
 2008-03-04 08:00:00
(9 rows)
```

**表.下标生成函数**

| 函数 | 返回类型 | 描述 |
| --- | --- | --- |
| generate\_subscripts(array anyarray, dim int) | setof int | 生成一个级数组成给定数组的下标。 |
| generate\_subscripts(array anyarray, dim int, reverse boolean) | setof int | 生成一个级数组成给定数组的下标。当reverse为真，级数以逆序返回。 |

generate\_subscripts是一个快捷函数，它为给定数组的指定维度生成一组合法的下标。对于不具有请求维度的数组返回零行，对于 NULL 数组也返回零行（但是会对 NULL 数组元素返回合法的下标）。下面是一些例子：

```
-- 基本使用
SELECT generate_subscripts('{NULL,1,NULL,2}'::int[], 1) AS s;
 s
---
 1
 2
 3
 4
(4 rows)
生成数组下标
select generate_subscripts( array['a','b','c','d'],1);
generate_subscripts
---------------------
                   1
                   2
                   3
                   4
(4 rows)

-- 表示一个数组，下标和被下标的值需要一个子查询
SELECT * FROM arrays;
         a
--------------------
 {-1,-2}
 {100,200,300}
(2 rows)

SELECT a AS array, s AS subscript, a[s] AS value
FROM (SELECT generate_subscripts(a, 1) AS s, a FROM arrays) foo;
     array     | subscript | value
---------------+-----------+-------
 {-1,-2}       |         1 |    -1
 {-1,-2}       |         2 |    -2
 {100,200,300} |         1 |   100
 {100,200,300} |         2 |   200
 {100,200,300} |         3 |   300
(5 rows)

-- 平面化一个 2D 数组
CREATE OR REPLACE FUNCTION unnest2(anyarray)
RETURNS SETOF anyelement AS $$
select $1[i][j]
   from generate_subscripts($1,1) g1(i),
        generate_subscripts($1,2) g2(j);
$$ LANGUAGE sql IMMUTABLE;
CREATE FUNCTION
SELECT * FROM unnest2(ARRAY[[1,2],[3,4]]);
 unnest2
---------
       1
       2
       3
       4
(4 rows)
```

当FROM子句中的一个函数后面有WITH ORDINALITY时，输出中会追加一个bigint列，它的值从1开始并且该函数输出的每一行加1。这在unnest()之类的集合返回函数中最有用。

---

[*navigate\_before* SQL语法](/docs/db/guides/sql-grammar/)

[联系我们 *navigate\_next*](/docs/contactus/)