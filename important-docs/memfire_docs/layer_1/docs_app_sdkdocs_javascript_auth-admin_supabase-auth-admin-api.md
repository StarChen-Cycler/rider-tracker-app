# 概览 | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/sdkdocs/javascript/auth-admin/supabase-auth-admin-api/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

案例教程

# 概览

* 在 `supabase.auth.admin` 命名空间下的任何方法都需要使用 `service_role` 密钥。
* 这些方法被认为是管理员级别的方法，它们应该只在可信任的服务器端被调用执行，而不应该在客户端浏览器等不受信任的环境中使用。

* 绝对不要在客户端浏览器中公开或传递 service\_role 密钥。因为这个密钥拥有管理用户认证和权限的权限，如果泄露给不信任的用户，可能会导致安全风险.

## 案例教程 [*link*](#%e6%a1%88%e4%be%8b%e6%95%99%e7%a8%8b)

### 案例1 （创建服务器端认证客户端） [*link*](#%e6%a1%88%e4%be%8b1-%e5%88%9b%e5%bb%ba%e6%9c%8d%e5%8a%a1%e5%99%a8%e7%ab%af%e8%ae%a4%e8%af%81%e5%ae%a2%e6%88%b7%e7%ab%af)

```
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabase_url, service_role_key, {
auth: {
  autoRefreshToken: false,
  persistSession: false
}
})

// Access auth admin api
const adminAuthClient = supabase.auth.admin
```

---

[*navigate\_before* onAuthStateChange()](/docs/app/sdkdocs/javascript/auth/auth-onauthstatechange/)

[getUserById() *navigate\_next*](/docs/app/sdkdocs/javascript/auth-admin/auth-admin-getuserbyid/)