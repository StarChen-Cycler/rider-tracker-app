# stream() | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/dart/realtime/stream/
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

# stream()

通知被查询表的数据。

```
supabase.from('countries')
  .stream(primaryKey: ['id'])
  .listen((List<Map<String, dynamic>> data) {
  // Do something awesome with the data
});
```

## Notes [*link*](#notes)

* `stream()`通过结合Postgrest和Realtime，将初始数据以及数据库上的任何进一步变化作为`List<Map<String, dynamic>`的`Stream`发出。
* 接受一个主键列的列表作为其参数。

## Examples [*link*](#examples)

### 监听一个特定的表 [*link*](#%e7%9b%91%e5%90%ac%e4%b8%80%e4%b8%aa%e7%89%b9%e5%ae%9a%e7%9a%84%e8%a1%a8)

```
supabase.from('countries')
  .stream(primaryKey: ['id'])
  .listen((List<Map<String, dynamic>> data) {
  // Do something awesome with the data
});
```

### 监听表格中的特定行数 [*link*](#%e7%9b%91%e5%90%ac%e8%a1%a8%e6%a0%bc%e4%b8%ad%e7%9a%84%e7%89%b9%e5%ae%9a%e8%a1%8c%e6%95%b0)

你可以使用`{table}:{col}=eq.{val}`的格式来监听个别行，其中`{col}`是列名，`{val}`是你想要匹配的值。
这种语法与你在Realtime中过滤数据的方式相同

```
supabase.from('countries')
  .stream(primaryKey: ['id'])
  .eq('id', '120')
  .listen((List<Map<String, dynamic>> data) {
  // Do something awesome with the data
});
```

### 使用 `order()` [*link*](#%e4%bd%bf%e7%94%a8-order)

```
supabase.from('countries')
  .stream(primaryKey: ['id'])
  .order('name', ascending: true)
  .listen((List<Map<String, dynamic>> data) {
  // Do something awesome with the data
});
```

### 使用 `limit()` [*link*](#%e4%bd%bf%e7%94%a8-limit)

```
supabase.from('countries')
  .stream(primaryKey: ['id'])
  .order('name', ascending: true)
  .limit(10)
  .listen((List<Map<String, dynamic>> data) {
  // Do something awesome with the data
});
```

### 使用 `stream()`与 `StreamBuilder`的关系 [*link*](#%e4%bd%bf%e7%94%a8-stream%e4%b8%8e-streambuilder%e7%9a%84%e5%85%b3%e7%b3%bb)

当在你的Flutter应用程序中使用`stream()`与`StreamBuilder`时，确保将你的流存储在一个变量中，以防止重建时重新获取。

```
final supabase = Supabase.instance.client;

class MyWidget extends StatefulWidget {
  const MyWidget({Key? key}) : super(key: key);

  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  // Persist the stream in a local variable to prevent refetching upon rebuilds
  final _stream = supabase.from('countries').stream(primaryKey: ['id']);

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: _stream,
      builder: (context, snapshot) {
        // Return your widget with the data from the snapshot
      },
    );
  }
}
```

---

[*navigate\_before* 待补充](/docs/app/sdkdocs/dart/function/invoke/)

[on().subscribe() *navigate\_next*](/docs/app/sdkdocs/dart/realtime/subscribe/)