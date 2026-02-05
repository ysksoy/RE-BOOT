#!/bin/bash

# ログファイルの保存先
LOGFILE="/Users/nodayousuke/Engineering/R-website/scraping_log_full.txt"

echo "==================================================" > "$LOGFILE"
echo "Full Update Job Started at $(date)" >> "$LOGFILE"

# 1. Infra Scraping
echo "--- [1/4] Running Infra Scraper ---" | tee -a "$LOGFILE"
cd /Users/nodayousuke/Engineering/infra-scraping
if [ -d ".venv" ]; then
    source .venv/bin/activate
    python main.py >> "$LOGFILE" 2>&1
    deactivate
else
    echo "Error: No .venv found for infra-scraping" >> "$LOGFILE"
fi

# 2. ZeroOne Scraping
echo "--- [2/4] Running ZeroOne Scraper ---" | tee -a "$LOGFILE"
cd /Users/nodayousuke/Engineering/zeroone-scraping
if [ -d ".venv" ]; then
    source .venv/bin/activate
    python main.py >> "$LOGFILE" 2>&1
    deactivate
else
    echo "Error: No .venv found for zeroone-scraping" >> "$LOGFILE"
fi

# 3. Sync Jobs from DB (Filtered to Infra/ZeroOne only)
echo "--- [3/4] Syncing Jobs from DB (Infra & ZeroOne Only) ---" | tee -a "$LOGFILE"
cd /Users/nodayousuke/Engineering/R-website
# 既存の jobs.json を一旦削除してリフレッシュしたい場合
rm -f src/data/jobs.json

if [ -d ".venv" ]; then
    source .venv/bin/activate
    python sync_jobs.py >> "$LOGFILE" 2>&1
    # deactivate (次のステップでも同じvenvを使うならkeepでもいいが、念のため)
else
    python sync_jobs.py >> "$LOGFILE" 2>&1
fi

# 4. Update Job Details (Summary & Image)
echo "--- [4/4] Updating Job Details ---" | tee -a "$LOGFILE"
# .venv is already activated or needs activation
if [ -d ".venv" ]; then
    # if deactivated above
    source .venv/bin/activate
    python update_job_details.py >> "$LOGFILE" 2>&1
    deactivate
fi

echo "All Jobs Finished at $(date)" | tee -a "$LOGFILE"
echo "==================================================" >> "$LOGFILE"
