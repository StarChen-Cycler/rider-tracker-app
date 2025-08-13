# Stripe | MemFire Cloud在线文档

**URL:** https://docs.memfiredb.com/docs/app/development_guide/database/wrappers/stripe/
**Layer/Depth:** 1

[MemFireDB备份 6](/)

menu

[官网](https://memfiredb.com/)
[论坛](https://community.memfiredb.com/)
[登录](https://cloud.memfiredb.com/auth/login)

Enable dark mode

Enable light mode

本页

准备

# Stripe

Stripe 是一个由 API 驱动的在线支付处理工具。`supabase/wrappers` 提供了以下端点。

## 准备 [*link*](#%e5%87%86%e5%a4%87)

在开始之前，请确保您的数据库上安装了 `wrappers` 扩展：

```
create extension if not exists wrappers with schema extensions;
```

然后创建外部数据封装器：

```
create foreign data wrapper stripe_wrapper
handler stripe_fdw_handler
validator stripe_fdw_validator;
```

### 安全保护您的凭证（可选） [*link*](#%e5%ae%89%e5%85%a8%e4%bf%9d%e6%8a%a4%e6%82%a8%e7%9a%84%e5%87%ad%e8%af%81%e5%8f%af%e9%80%89)

默认情况下，Postgres 将 FDW 凭证以明文形式存储在 `pg_catalog.pg_foreign_server` 中。任何有权访问此表的人都能够查看这些凭证。封装器设计为与 [Vault](https://supabase.com/docs/guides/database/vault) 配合使用，Vault 提供了额外的安全级别来存储凭证。我们建议您使用 Vault 存储您的凭证。

```
-- Save your Stripe API key in Vault and retrieve the `key_id`
insert into vault.secrets (name, secret)
values (
  'stripe',
  'YOUR_SECRET'
)
returning key_id;
```

### 连接到 Stripe [*link*](#%e8%bf%9e%e6%8e%a5%e5%88%b0-stripe)

我们需要为 Postgres 提供连接到 Stripe 的凭证和任何额外的选项。我们可以使用 `create server` 命令来完成这个操作：

使用 Vault

```
create server stripe_server
foreign data wrapper stripe_wrapper
options (
  api_key_id '<key_ID>', -- The Key ID from above, required.
  api_url 'https://api.stripe.com/v1/'  -- Stripe API base URL, optional. Default is 'https://api.stripe.com/v1/'
);
```

不使用 Vault

```
create server stripe_server
foreign data wrapper stripe_wrapper
options (
  api_key '<Stripe API Key>',  -- Stripe API key, required
  api_url 'https://api.stripe.com/v1/'  -- Stripe API base URL, optional. Default is 'https://api.stripe.com/v1/'
);
```

## 创建外部表 [*link*](#%e5%88%9b%e5%bb%ba%e5%a4%96%e9%83%a8%e8%a1%a8)

Stripe 封装器支持从 Stripe API 读取和修改数据。.

| Object | Select | Insert | Update | Delete | Truncate |
| --- | --- | --- | --- | --- | --- |
| [Accounts](https://stripe.com/docs/api/accounts/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Balance](https://stripe.com/docs/api/balance) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Balance Transactions](https://stripe.com/docs/api/balance_transactions/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Charges](https://stripe.com/docs/api/charges/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Checkout Sessions](https://stripe.com/docs/api/checkout/sessions/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Customers](https://stripe.com/docs/api/customers/list) | ✅ | ✅ | ✅ | ✅ | ❌ |
| [Disputes](https://stripe.com/docs/api/disputes/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Events](https://stripe.com/docs/api/events/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Files](https://stripe.com/docs/api/files/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [File Links](https://stripe.com/docs/api/file_links/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Invoices](https://stripe.com/docs/api/invoices/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Mandates](https://stripe.com/docs/api/mandates) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [PaymentIntents](https://stripe.com/docs/api/payment_intents/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Payouts](https://stripe.com/docs/api/payouts/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Prices](https://stripe.com/docs/api/prices/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Products](https://stripe.com/docs/api/products/list) | ✅ | ✅ | ✅ | ✅ | ❌ |
| [Refunds](https://stripe.com/docs/api/refunds/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [SetupAttempts](https://stripe.com/docs/api/setup_attempts/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [SetupIntents](https://stripe.com/docs/api/setup_intents/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Subscriptions](https://stripe.com/docs/api/subscriptions/list) | ✅ | ✅ | ✅ | ✅ | ❌ |
| [Tokens](https://stripe.com/docs/api/tokens) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Topups](https://stripe.com/docs/api/topups/list) | ✅ | ❌ | ❌ | ❌ | ❌ |
| [Transfers](https://stripe.com/docs/api/transfers/list) | ✅ | ❌ | ❌ | ❌ | ❌ |

Stripe 外部表反映了 Stripe 的 API。我们可以创建一个模式来容纳所有 Stripe 表。

```
create schema stripe;
```

然后创建外部表，例如：

```
create foreign table stripe.accounts (
  id text,
  business_type text,
  country text,
  email text,
  type text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'accounts'
  );
```

`attrs` 是一个特殊列，它以 JSON 格式存储所有对象属性，您可以从中提取任何需要的属性或其关联的子对象。请参阅下面的更多示例。

### Accounts [*link*](#accounts)

*read only*

这是一个代表 Stripe 账户的对象。

參考: [Stripe 文档](https://stripe.com/docs/api/accounts/list)

```
create foreign table stripe.accounts (
  id text,
  business_type text,
  country text,
  email text,
  type text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'accounts'
  );
```

虽然在 where 子句中允许任何列，但按以下方式过滤最高效：

* id

### Balance [*link*](#balance)

*read only*

显示您 Stripe 账户当前的余额。

參考: [Stripe 文档](https://stripe.com/docs/api/balance)

```
create foreign table stripe.balance (
  balance_type text,
  amount bigint,
  currency text,
  attrs jsonb
)
  server stripe_server
  options (
    object 'balance'
  );
```

### Balance Transactions [*link*](#balance-transactions)

*read only*

余额交易代表通过您的 Stripe 账户的资金流动。它们为您的 Stripe 账户余额中进出的每种交易类型创建。

參考: [Stripe 文档](https://stripe.com/docs/api/balance_transactions/list)

```
create foreign table stripe.balance_transactions (
  id text,
  amount bigint,
  currency text,
  description text,
  fee bigint,
  net bigint,
  status text,
  type text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'balance_transactions'
  );
```

虽然在 where 子句中允许任何列，但按以下方式过滤最高效：

* id
* type

### Charges [*link*](#charges)

*read only*

要对信用卡或借记卡进行收费，您需要创建一个 Charge 对象。您可以检索和退款个别收费，以及列出所有收费。收费由一个唯一的随机 ID 标识。

參考: [Stripe 文档](https://stripe.com/docs/api/charges/list)

```
create foreign table stripe.charges (
  id text,
  amount bigint,
  currency text,
  customer text,
  description text,
  invoice text,
  payment_intent text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'charges'
  );
```

虽然在 where 子句中允许任何列，但按以下方式过滤最高效：

* id
* customer

### Checkout Sessions [*link*](#checkout-sessions)

*read only*

收银会话代表客户通过收银或支付链接进行一次性购买或订阅时的会话。我们建议每次客户尝试支付时都创建一个新的会话。

參考: [Stripe 文档](https://stripe.com/docs/api/checkout/sessions/list)

```
create foreign table stripe.checkout_sessions (
  id text,
  customer text,
  payment_intent text,
  subscription text,
  attrs jsonb
)
  server stripe_server
  options (
    object 'checkout/sessions',
    rowid_column 'id'
  );
```

虽然在 where 子句中允许任何列，但按以下方式过滤最高效：

* id
* customer
* payment\_intent
* subscription

### Customers [*link*](#customers)

*read and modify*

包含 Stripe 已知的客户信息。

參考: [Stripe 文档](https://stripe.com/docs/api/customers/list)

```
create foreign table stripe.customers (
  id text,
  email text,
  name text,
  description text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'customers',
    rowid_column 'id'
  );
```

虽然在 where 子句中允许任何列，但按以下方式过滤最高效：

* id
* email

### Disputes [*link*](#disputes)

*read only*

客户向其信用卡发行机构质疑您的收费时，就会发生争议。

參考: [Stripe 文档](https://stripe.com/docs/api/disputes/list)

```
create foreign table stripe.disputes (
  id text,
  amount bigint,
  currency text,
  charge text,
  payment_intent text,
  reason text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'disputes'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* charge
* payment\_intent

### Events [*link*](#events)

*read only*

事件是我们通知您账户中发生有趣事情的方式。

參考: [Stripe 文档](https://stripe.com/docs/api/events/list)

```
create foreign table stripe.events (
  id text,
  type text,
  api_version text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'events'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* type

### Files [*link*](#files)

*read only*

这是一个代表在 Stripe 服务器上托管的文件的对象。

參考: [Stripe 文档](https://stripe.com/docs/api/files/list)

```
create foreign table stripe.files (
  id text,
  filename text,
  purpose text,
  title text,
  size bigint,
  type text,
  url text,
  created timestamp,
  expires_at timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'files'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* purpose

### File Links [*link*](#file-links)

*read only*

要与非 Stripe 用户共享 `File`对象的内容，您可以创建一个 `FileLink`。

參考: [Stripe 文档](https://stripe.com/docs/api/file_links/list)

```
create foreign table stripe.file_links (
  id text,
  file text,
  url text,
  created timestamp,
  expired bool,
  expires_at timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'file_links'
  );
```

### Invoices# [*link*](#invoices)

*read only*

发票是客户所欠金额的报表，可以一次性生成，也可以通过订阅定期生成。

參考: [Stripe 文档](https://stripe.com/docs/api/invoices/list)

```
create foreign table stripe.invoices (
  id text,
  customer text,
  subscription text,
  status text,
  total bigint,
  currency text,
  period_start timestamp,
  period_end timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'invoices'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* customer
* status
* subscription

### Mandates [*link*](#mandates)

*read only*

授权是记录客户授予您从其支付方式中扣款的权限的记录。

參考: [Stripe 文档](https://stripe.com/docs/api/mandates)

```
create foreign table stripe.mandates (
  id text,
  payment_method text,
  status text,
  type text,
  attrs jsonb
)
  server stripe_server
  options (
    object 'mandates'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id

### Payment Intents [*link*](#payment-intents)

*read only*

付款意向可引导您完成向客户收款的过程。

參考: [Stripe 文档](https://stripe.com/docs/api/payment_intents/list)

```
create foreign table stripe.payment_intents (
  id text,
  customer text,
  amount bigint,
  currency text,
  payment_method text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'payment_intents'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* customer

### Payouts [*link*](#payouts)

*read only*

当您从 Stripe 收到资金，或者当您启动向连接的 Stripe 账户的银行账户或借记卡进行提现时，会创建一个 `Payout` 对象。

參考: [Stripe 文档](https://stripe.com/docs/api/payouts/list)

```
create foreign table stripe.payouts (
  id text,
  amount bigint,
  currency text,
  arrival_date timestamp,
  description text,
  statement_descriptor text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'payouts'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* status

### Prices [*link*](#prices)

*read only*

为了支持多种货币和定价选项，您的所有产品都需要一个`Price` 对象。

參考: [Stripe 文档](https://stripe.com/docs/api/prices/list)

```
create foreign table stripe.prices (
  id text,
  active bool,
  currency text,
  product text,
  unit_amount bigint,
  type text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'prices'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* active

### Products [*link*](#products)

*read and modify*

Stripe 上提供的所有产品。

參考: [Stripe 文档](https://stripe.com/docs/api/products/list)

```
create foreign table stripe.products (
  id text,
  name text,
  active bool,
  default_price text,
  description text,
  created timestamp,
  updated timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'products',
    rowid_column 'id'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* active

### Refunds [*link*](#refunds)

*read only*

`Refund`对象允许您退还之前已创建但尚未退还的收费。

參考: [Stripe 文档](https://stripe.com/docs/api/refunds/list)

```
create foreign table stripe.refunds (
  id text,
  amount bigint,
  currency text,
  charge text,
  payment_intent text,
  reason text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'refunds'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* charge
* payment\_intent

### SetupAttempts [*link*](#setupattempts)

*read only*

一个 `SetupAttempt` 描述了对 SetupIntent 的一次尝试确认，无论这次确认是成功还是失败。

參考: [Stripe 文档](https://stripe.com/docs/api/setup_attempts/list)

```
create foreign table stripe.setup_attempts (
  id text,
  application text,
  customer text,
  on_behalf_of text,
  payment_method text,
  setup_intent text,
  status text,
  usage text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'setup_attempts'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* setup\_intent

### SetupIntents [*link*](#setupintents)

*read only*

`SetupIntent` 可引导您设置和保存客户支付凭证，以便将来付款。

參考: [Stripe 文档](https://stripe.com/docs/api/setup_intents/list)

```
create foreign table stripe.setup_intents (
  id text,
  client_secret text,
  customer text,
  description text,
  payment_method text,
  status text,
  usage text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'setup_intents'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* customer
* payment\_method

### Subscriptions [*link*](#subscriptions)

*read and modify*

客户的定期支付计划。

參考: [Stripe 文档](https://stripe.com/docs/api/subscriptions/list)

```
create foreign table stripe.subscriptions (
  id text,
  customer text,
  currency text,
  current_period_start timestamp,
  current_period_end timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'subscriptions',
    rowid_column 'id'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* customer
* price
* status

### Tokens [*link*](#tokens)

*read only*

令牌化是 Stripe 用来以安全方式直接从客户处收集敏感的银行卡或银行账户信息或个人身份信息 (PII) 的过程。

參考: [Stripe 文档](https://stripe.com/docs/api/tokens)

```
create foreign table stripe.tokens (
  id text,
  customer text,
  currency text,
  current_period_start timestamp,
  current_period_end timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'tokens'
  );
```

### Top-ups [*link*](#top-ups)

*read only*

要为 Stripe 余额充值，您需要创建一个充值对象。

參考: [Stripe 文档](https://stripe.com/docs/api/topups/list)

```
create foreign table stripe.topups (
  id text,
  amount bigint,
  currency text,
  description text,
  status text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'topups'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* status

### Transfers [*link*](#transfers)

*read only*

转账对象是在 Stripe 账户之间转移资金时创建的，是连接的一部分。

參考: [Stripe 文档](https://stripe.com/docs/api/transfers/list)

```
create foreign table stripe.transfers (
  id text,
  amount bigint,
  currency text,
  description text,
  destination text,
  created timestamp,
  attrs jsonb
)
  server stripe_server
  options (
    object 'transfers'
  );
```

虽然在 where 子句中允许使用任何列进行过滤，但以下方式的过滤最为高效：

* id
* destination

## 支持查询下推 [*link*](#%e6%94%af%e6%8c%81%e6%9f%a5%e8%af%a2%e4%b8%8b%e6%8e%a8)

FDW 支持 `where` 子句下推。您可以在 `where` 子句中指定过滤器，并将其传递给 Stripe API 调用。

例如，此查询：

```
select * from stripe.customers where id = 'cus_xxx';
```

将被翻译为 Stripe API 调用: `https://api.stripe.com/v1/customers/cus_xxx`.

有关每个对象支持的过滤列，请查看上面的外部表文档。

## 示例 [*link*](#%e7%a4%ba%e4%be%8b)

关于如何使用 Stripe 外部表的一些示例。

### 基本示例 [*link*](#%e5%9f%ba%e6%9c%ac%e7%a4%ba%e4%be%8b)

```
-- always limit records to reduce API calls to Stripe
select * from stripe.customers limit 10;
select * from stripe.invoices limit 10;
select * from stripe.subscriptions limit 10;
```

### 查询 JSON 属性 [*link*](#%e6%9f%a5%e8%af%a2-json-%e5%b1%9e%e6%80%a7)

```
-- extract account name for an invoice
select id, attrs->>'account_name' as account_name
from stripe.invoices where id = 'in_xxx';

-- extract invoice line items for an invoice
select id, attrs#>'{lines,data}' as line_items
from stripe.invoices where id = 'in_xxx';

-- extract subscription items for a subscription
select id, attrs#>'{items,data}' as items
from stripe.subscriptions where id = 'sub_xxx';
```

### 数据修改 [*link*](#%e6%95%b0%e6%8d%ae%e4%bf%ae%e6%94%b9)

```
insert into stripe.customers(email,name,description) values ('test@test.com', 'test name', null);
update stripe.customers set description='hello fdw' where id ='cus_xxx';
update stripe.customers set attrs='{"metadata[foo]": "bar"}' where id ='cus_xxx';
delete from stripe.customers where id ='cus_xxx';
```

---

[*navigate\_before* Logflare](/docs/app/development_guide/database/wrappers/logflare/)

[概述 *navigate\_next*](/docs/app/development_guide/api/api/)