#!/bin/bash

# ログファイルの保存先 (R-websiteの直下)
LOGFILE="/Users/nodayousuke/Engineering/R-website/scraping_log.txt"

# 開始時刻を記録
echo "==================================================" >> "$LOGFILE"
echo "Job Started at $(date)" >> "$LOGFILE"

# 1. Indeed Scraping
echo "--- [1/4] Running Indeed Scraper ---" >> "$LOGFILE"
cd /Users/nodayousuke/Engineering/indeed-scraping
if [ -d ".venv" ]; then
    source .venv/bin/activate
    # エラーで止まらないように || true をつける、または set +e
    python main.py >> "$LOGFILE" 2>&1
    deactivate
else
    echo "Error: No .venv found for indeed-scraping" >> "$LOGFILE"
fi

# 2. Kyujin Scraping
echo "--- [2/4] Running Kyujin Scraper ---" >> "$LOGFILE"
cd /Users/nodayousuke/Engineering/kyujin-scraping
if [ -d ".venv" ]; then
    source .venv/bin/activate
    python main.py >> "$LOGFILE" 2>&1
    deactivate
else
    echo "Error: No .venv found for kyujin-scraping" >> "$LOGFILE"
fi

# 3. Infra Scraping
echo "--- [3/4] Running Infra Scraper ---" >> "$LOGFILE"
cd /Users/nodayousuke/Engineering/infra-scraping
if [ -d ".venv" ]; then
    source .venv/bin/activate
    python main.py >> "$LOGFILE" 2>&1
    deactivate
else
    echo "Error: No .venv found for infra-scraping" >> "$LOGFILE"
fi

# 4. ZeroOne Scraping
echo "--- [4/4] Running ZeroOne Scraper ---" >> "$LOGFILE"
cd /Users/nodayousuke/Engineering/zeroone-scraping
if [ -d ".venv" ]; then
    source .venv/bin/activate
    python main.py >> "$LOGFILE" 2>&1
    deactivate
else
    echo "Error: No .venv found for zeroone-scraping" >> "$LOGFILE"
fi


# 5. Sync & Cleanup (Supabase -> JSON)
echo "--- [5/5] Syncing Jobs from DB ---" >> "$LOGFILE"
cd /Users/nodayousuke/Engineering/R-website
if [ -d ".venv" ]; then
    source .venv/bin/activate
    python sync_jobs.py >> "$LOGFILE" 2>&1
    deactivate
else
    # .venvが無い場合は作成してインストールを試みる、もしくはグローバルで実行
    # ここでは既存環境があればそれを使う前提
    python sync_jobs.py >> "$LOGFILE" 2>&1
fi

echo "All Jobs Finished at $(date)" >> "$LOGFILE"
echo "==================================================" >> "$LOGFILE"
