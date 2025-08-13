# 快速入门: Android Kotlin | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/quickstart/with-kotlin/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

第一步：在 MemFire Cloud 仪表板中

# 快速入门: Android Kotlin

## 第一步：在 MemFire Cloud 仪表板中[创建](https://cloud.memfiredb.com/project)一个新应用。 [*link*](#%e7%ac%ac%e4%b8%80%e6%ad%a5%e5%9c%a8-memfire-cloud-%e4%bb%aa%e8%a1%a8%e6%9d%bf%e4%b8%ad%e5%88%9b%e5%bb%bahttpscloudmemfiredbcomproject%e4%b8%80%e4%b8%aa%e6%96%b0%e5%ba%94%e7%94%a8)

应用准备就绪后，进入应用，在左侧菜单->表编辑器选择 SQL 编辑器在 MemFire Cloud 数据库中创建一个表。使用以下 SQL 语句创建包含一些示例数据的国家/地区表。

```
-- Create the table
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
-- Insert some sample data into the table
INSERT INTO countries (name) VALUES ('United States');
INSERT INTO countries (name) VALUES ('Canada');
INSERT INTO countries (name) VALUES ('Mexico');
```

## 第二步：使用 Android Studio 创建 Android 应用 [*link*](#%e7%ac%ac%e4%ba%8c%e6%ad%a5%e4%bd%bf%e7%94%a8-android-studio-%e5%88%9b%e5%bb%ba-android-%e5%ba%94%e7%94%a8)

打开 Android Studio > 新建 > 新建 Android 项目。

```
npm create vite@latest my-app -- --template react
```

## 第三步：安装 Supabase 客户端库 [*link*](#%e7%ac%ac%e4%b8%89%e6%ad%a5%e5%ae%89%e8%a3%85-supabase-%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ba%93)

导入 Supabase 和所有必需的依赖项。将版本占位符 $supabase\_version 和 $ktor\_version 替换为各自的最新版本。

```
implementation "io.github.jan-tennert.supabase:postgrest-kt:$supabase_version"
implementation "io.ktor:ktor-client-android:$ktor_version"
```

## 第四步： 安装序列化插件 [*link*](#%e7%ac%ac%e5%9b%9b%e6%ad%a5-%e5%ae%89%e8%a3%85%e5%ba%8f%e5%88%97%e5%8c%96%e6%8f%92%e4%bb%b6)

打开build.gradle（app），添加序列化插件以使用注解进行数据解析。请注意，插件版本应与应用中的 Kotlin 版本相同。

```
plugins {
    ...
    id 'org.jetbrains.kotlin.plugin.serialization' version '$kotlin_version'
    ...
}
```

## 第五步：初始化 Supabase 客户端 [*link*](#%e7%ac%ac%e4%ba%94%e6%ad%a5%e5%88%9d%e5%a7%8b%e5%8c%96-supabase-%e5%ae%a2%e6%88%b7%e7%ab%af)

每当需要执行 API 调用时，您都可以创建 Supabase 客户端。话虽这么说，建议使用像 [Hilt](https://developer.android.com/training/dependency-injection/hilt-android?hl=zh-cn#kts) 这样的依赖注入库。

```
val client = createSupabaseClient(
    supabaseUrl = "https://xyzcompany.supabase.co",
    supabaseKey = "public-anon-key"
  ) {
    install(Postgrest)
}
```

## 第六步：创建数据传输对象 [*link*](#%e7%ac%ac%e5%85%ad%e6%ad%a5%e5%88%9b%e5%bb%ba%e6%95%b0%e6%8d%ae%e4%bc%a0%e8%be%93%e5%af%b9%e8%b1%a1)

```
@Serializable
data class ProductDto(
    @SerialName("productid")
    val productId: String,
    @SerialName("name")
    val name: String,
    @SerialName("description")
    val description: String,
    @SerialName("price")
    val price: Double,
    @SerialName("image")
    val image: String,
    @SerialName("category")
    val category: String,
    @SerialName("nutrition")
    val nutrition: String,
    @SerialName("_id")
    val _id: Int,
)
```

## 第七步：创建一个domain 对象 [*link*](#%e7%ac%ac%e4%b8%83%e6%ad%a5%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aadomain-%e5%af%b9%e8%b1%a1)

这种对象将被视图消耗。

```
data class Product(
    val productId: String,
    val name: String,
    val description: String,
    val price: Double,
    val image: String,
    val category: String,
    val nutrition: String,
    val _id: Int,
)
```

## 第八步：从应用程序查询数据 [*link*](#%e7%ac%ac%e5%85%ab%e6%ad%a5%e4%bb%8e%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f%e6%9f%a5%e8%af%a2%e6%95%b0%e6%8d%ae)

创建存储库以与数据源交互。

```
interface ProductRepository {
  fun getProducts(): List<ProductDto>
}

class ProductRepositoryImpl @Inject constructor(
      private val postgrest: Postgrest,
  ) : ProductRepository {
    override suspend fun getProducts(): List<ProductDto> {
      val result = client.postgrest["products"]
          .select().decodeList<ProductDto>()
      // Handle result data for next step
      return result
    }
}
```

## 第九步：创建一个模块来提供存储库 [*link*](#%e7%ac%ac%e4%b9%9d%e6%ad%a5%e5%88%9b%e5%bb%ba%e4%b8%80%e4%b8%aa%e6%a8%a1%e5%9d%97%e6%9d%a5%e6%8f%90%e4%be%9b%e5%ad%98%e5%82%a8%e5%ba%93)

使用Hilt进行依赖注入。

```
InstallIn(SingletonComponent::class)
@Module
abstract class RepositoryModule {
    @Binds
    abstract fun bindProductRepository(impl: ProductRepositoryImpl): ProductRepository
}
```

## 第十步：从协程范围内的 ViewModel 获取数据 [*link*](#%e7%ac%ac%e5%8d%81%e6%ad%a5%e4%bb%8e%e5%8d%8f%e7%a8%8b%e8%8c%83%e5%9b%b4%e5%86%85%e7%9a%84-viewmodel-%e8%8e%b7%e5%8f%96%e6%95%b0%e6%8d%ae)

添加 @Inject 注释以在 ViewModel 中使用存储库。

```
class ProductListViewModel @Inject constructor(
  private val productRepository: ProductRepository
) : ViewModel() {

  private val _productList = MutableStateFlow<List<Product>?>(listOf())
  val productList: Flow<List<Product>?> = _productList

  init {
      getProducts()
  }

  fun getProducts() {
      viewModelScope.launch {
          val products = productRepository.getProducts()
          _productList.emit(products?.map { it -> it.asDomainModel() })
      }
  }

  private fun ProductDto.asDomainModel(): Product {
    return Product(
        productId = this.productId,
        name = this.name,
        price = this.price,
        image = this.image,
        description = this.description,
        category = this.category,
        nutrition = this.nutrition,
        _id = this._id
    )
}
```

## 第十步：观察可组合项中的数据 [*link*](#%e7%ac%ac%e5%8d%81%e6%ad%a5%e8%a7%82%e5%af%9f%e5%8f%af%e7%bb%84%e5%90%88%e9%a1%b9%e4%b8%ad%e7%9a%84%e6%95%b0%e6%8d%ae)

```
@Composable
fun ProductListScreen(
    modifier: Modifier = Modifier,
    navController: NavController,
    viewModel: ProductListViewModel = hiltViewModel(),
) {
    val productList = viewModel.productList.collectAsState(initial = listOf()).value
    if (!productList.isNullOrEmpty()) {
        LazyColumn(
            modifier = modifier.padding(24.dp),
            contentPadding = PaddingValues(5.dp)
        ) {
            items(productList) { item ->
                ProductListItem(
                    product = item,
                    modifier = modifier,
                    onClick = {
                        navController.navigate(
                            ProductDetailsDestination.createRouteWithParam(
                                item.id
                            )
                        )
                    },
                )
            }
        }
    }
}
```

## 第十二步：启动应用程序 [*link*](#%e7%ac%ac%e5%8d%81%e4%ba%8c%e6%ad%a5%e5%90%af%e5%8a%a8%e5%ba%94%e7%94%a8%e7%a8%8b%e5%ba%8f)

---

[*navigate\_before* 快速入门: Angular](/docs/app/quickstart/with-angular/)

[快速入门: Nuxt 3 *navigate\_next*](/docs/app/quickstart/with-nuxt-3/)