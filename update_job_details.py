
import json
import asyncio
import random
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

DATA_FILE = "src/data/jobs.json"
TARGET_SOURCE = "Infra"

async def scrape_job_detail(page, url):
    print(f"🔍 Visiting: {url}")
    try:
        await page.goto(url, timeout=60000, wait_until="domcontentloaded")
        await asyncio.sleep(random.uniform(2, 4)) # ランダムな待機時間

        # HTML解析
        content = await page.content()
        soup = BeautifulSoup(content, "html.parser")

        details = {}

        # JSON-LDの解析ロジック（共通）
        json_ld_elem = soup.find("script", type="application/ld+json")
        if json_ld_elem:
            try:
                data = json.loads(json_ld_elem.string)
                if isinstance(data, list):
                    data = data[0] if data else {}
                
                if data.get("description"):
                    raw_desc = data["description"]
                    # 改行コードの統一
                    clean_desc = raw_desc.replace("<br>", "\n").replace("<br />", "\n").replace("<br/>", "\n")
                    # HTMLタグ除去 & テキスト化
                    soup_desc = BeautifulSoup(clean_desc, "html.parser")
                    details["summary"] = soup_desc.get_text(separator="\n", strip=True)

            except json.JSONDecodeError:
                print("⚠️ Failed to parse JSON-LD")

        # 2. 画像 (Metaタグから取得)
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            details["image_url"] = og_image["content"]

        # JSON-LDで取得できなかった場合のフォールバック
        if not details.get("summary"):
             summary_elem = soup.select_one(".job-description") or soup.select_one(".post-content")
             if summary_elem:
                details["summary"] = summary_elem.get_text(strip=True)[:600]

        # 特徴タグ（もしあれば）
        # 現状のHTML構造からは明確なリストが見当たらないため、実装保留
        
        return details

    except Exception as e:
        print(f"⚠️ Error scraping {url}: {e}")
        return None

async def main():
    print("🚀 Starting detailed scraping for jobs...")
    
    # 1. データ読み込み
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            jobs = json.load(f)
    except FileNotFoundError:
        print("❌ Jobs data file not found.")
        return

    TARGET_SOURCES = ["Infra", "ZeroOne"]

    # 全データから対象ソースの求人を抽出 (まだsummaryがないもの、または再度取得したい場合は条件を緩和)
    # ここでは「summaryがない」条件を残しますが、sync直後の新規jsonであれば全てsummaryはないはずです。
    target_jobs = [j for j in jobs if j.get("source") in TARGET_SOURCES and not j.get("summary")]
    
    print(f"📋 Found {len(target_jobs)} jobs to update.")
    if len(target_jobs) == 0:
        print("✅ No jobs need updating.")
        return

    # 2. スクレイピング実行
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        updated_count = 0
        
        # 本番実行用にバッチサイズを拡大
        BATCH_SIZE = 100  
        
        for i, job in enumerate(target_jobs[:BATCH_SIZE]):
            print(f"[{i+1}/{min(len(target_jobs), BATCH_SIZE)}] Processing: {job['title']}...")
            
            details = await scrape_job_detail(page, job["link"])
            
            if details:
                # 元のリスト内のオブジェクトを直接更新
                if details.get("summary"):
                    job["summary"] = details["summary"]
                if details.get("image_url"):
                    job["image_url"] = details["image_url"]
                if details.get("features"):
                    job["features"] = details["features"]
                
                updated_count += 1
                print("  ✅ Updated details.")
            else:
                print("  ⚠️ Failed to get details.")

        await browser.close()

    # 3. 保存
    if updated_count > 0:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            # 元のjobsリスト（更新されたオブジェクトを含む）を保存
            json.dump(jobs, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved {updated_count} jobs with new details to {DATA_FILE}")
    else:
        print("No changes to save.")

if __name__ == "__main__":
    asyncio.run(main())
