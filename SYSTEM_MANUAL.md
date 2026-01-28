# RE:BOOT Job Aggregation System - System Manual

本プロジェクトは、4つの異なる求人サイトからエンジニア・インターン求人をスクレイピングし、一元管理されたデータベース(Supabase)を通してWebサイト(Next.js)に表示するシステムです。

---

## 🏗 システム全体構成

```mermaid
graph TD
    subgraph "Scraping Batch (Local Mac)"
        Indeed[Indeed Scraper]
        Kyujin[Kyujinbox Scraper]
        Infra[Infra Scraper]
        ZeroOne[ZeroOne Scraper]
        Cron[Cron (Daily 19:00)]
        
        Cron -->|sh| Indeed
        Cron -->|sh| Kyujin
        Cron -->|sh| Infra
        Cron -->|sh| ZeroOne
    end

    subgraph "Database (Cloud)"
        Supabase[(Supabase PostgreSQL)]
        Table[jobs Table]
    end

    subgraph "Frontend (Vercel/Cloud)"
        WebTime[Next.js App]
    end

    Indeed -->|Upsert| Table
    Kyujin -->|Upsert| Table
    Infra -->|Upsert| Table
    ZeroOne -->|Upsert| Table
    
    Supabase -->|Fetch| WebTime
```

---

## 📂 ディレクトリ構造

本システムは以下の5つのリポジトリ（フォルダ）で構成されています。

```text
Engineering/
├── R-website/                  # メインプロジェクト (Next.js)
│   ├── SYSTEM_MANUAL.md        # このファイル
│   ├── run_all_scrapers.sh     # 全スクレーパーを実行するシェルスクリプト
│   ├── scraping_log.txt        # 実行ログ
│   ├── supabase_schema.sql     # DB定義書
│   └── db_client_template.py   # DB接続コードの原本
│
├── indeed-scraping/            # Indeed用スクレーパー
├── kyujin-scraping/            # 求人ボックス用スクレーパー
├── infra-scraping/             # Infraインターン用スクレーパー
└── zeroone-scraping/           # ゼロワンインターン用スクレーパー
```

---

## ⚙️ セットアップ手順

### 1. 必須環境
*   **Python 3.9+** (推奨: `.venv` を使用)
*   **Node.js 18+**
*   **Supabase アカウント**

### 2. 環境変数 (.env)
各スクレーパーフォルダ (`indeed-scraping` 等) すべてに `.env` ファイルが必要です。

```ini
SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
SUPABASE_KEY="YOUR_KEY"
```

### 3. スクレーパーのセットアップ
各フォルダでライブラリをインストールします。

```bash
cd indeed-scraping
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# (playwright install が必要な場合あり)
playwright install chromium
```

---

## 🕰 自動実行と運用 (Cron)

### 実行スケジュール
Macの `cron` により、**毎日 19:00** に自動実行されます。
PCがスリープまたは起動している必要があります（電源OFFだと動きません）。

**登録コマンドの確認:**
```bash
crontab -l
# 出力例: 0 19 * * * /Users/nodayousuke/Engineering/R-website/run_all_scrapers.sh
```

### ログの確認
実行結果は以下のファイルに追記されます。エラーや取得件数はここで確認してください。
`/Users/nodayousuke/Engineering/R-website/scraping_log.txt`

---

## ⚠️ Indeedスクレーパーの運用注意点 (重要)

Indeedは強力なBot対策（Cloudflare Turnstile）を行っています。
そのため、**完全な全自動実行はできません。**

### 運用フロー
1.  **通常時**: バッチは毎日動きますが、Indeedのみ「手動操作待ち」状態で止まる（またはタイムアウトする）可能性があります。
2.  **手動認証**:
    *   定期的に（またはログで失敗を確認したら）、手動でスクリプトを実行してください。
    *   `cd indeed-scraping && source .venv/bin/activate && python main.py`
    *   Chromeブラウザが起動し、Cloudflareの「人間確認」チェックボックスが出たらクリックします。
    *   Indeedのトップページが表示されたら、コンソールで **Enterキー** を押します。
    *   一度認証を通れば、Cookieが更新され、しばらくの間は自動実行も通るようになります。

---

## 🗄 データベース設計 (Supabase)

すべての求人データは `jobs` テーブルに集約されます。

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `site_name` | text | 'Indeed', 'Kyujin', 'Infra', 'ZeroOne' |
| `title` | text | 求人タイトル |
| `company` | text | 会社名 |
| `url` | text | **Unique Key** (重複排除用) |
| `salary` | text | 給与テキスト |
| `location` | text | 勤務地 |
| `created_at` | timestamp | 取得日時 |

### 重複排除ロジック
*   `url` カラムをキーとして **Upsert (On Conflict)** を行っています。
*   既存のURLが見つかった場合、データは更新（上書き）されます。
*   **早期終了 (Early Stopping)**: スクレーピング中、既知の求人が5件連続で続いたら「これ以上新しい求人は無い」と判断し、そのサイトの処理を中断します。

### 🧹 データの定期クリーンアップと同期
求人サイトには明確な「掲載終了日」が無いため、以下のロジックでデータの鮮度を保っています。

1. **最終確認日 (updated_at) の更新**: 各スクレーパーは求人を確認するたびに `updated_at` を更新します。
2. **期限切れ削除 (Cleanup)**: 全スクレーパー実行後、`sync_jobs.py` が実行され、最終更新から **30日以上** 経過した求人をDBから物理削除します。
3. **新着順の反映**: 同スクリプトがDBから最新の求人を `created_at` 降順（新着順）で取得し、`jobs.json` を生成してWebサイトに反映させます。

