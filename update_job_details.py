import json
import asyncio
import random
import os
from openai import OpenAI
from dotenv import load_dotenv
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

# Load environment variables
load_dotenv()

DATA_FILE = "src/data/jobs.json"
TARGET_SOURCE = "Infra"

# OpenAI Client Setup
api_key = os.environ.get("OPENAI_API_KEY")

client = OpenAI(api_key=api_key) if api_key else None

if not api_key:
    print("⚠️  OPENAI_API_KEY is not set in .env. AI recommendations will be skipped.")

def generate_ai_recommendation(title, summary):
    if not client or not summary:
        return None

    try:
        response = client.chat.completions.create(
            model="gpt-5-nano",
            messages=[
                {
                    "role": "system", 
                    "content": """あなたは未経験者向け求人サイト「RE:BOOT」の編集部です。
求人の「一番のウリ（高時給、フルリモート、有名企業、特定のスキル習得など）」を見つけ出し、それを強調したおすすめコメントを100〜150文字程度で作成してください。

# 重要ルール
- 「成長できる」「やりがいがある」といった**ありきたりな表現は禁止**です。具体的に何が得られるかを書いてください。
- ターゲットは未経験の大学生です。彼らにとって魅力的なメリット（稼げる、就活に有利など）を具体的に訴求してください。
- 読み手の目を引くような、少しエッジの効いたキャッチーな書き出しにしてください。
- 丁寧語（〜です、〜ます）で書きますが、堅苦しくならないようにしてください。
- 最後に「〜なら今すぐ応募！」「〜したい人におすすめ！」などで行動を促してください。"""
                },
                {"role": "user", "content": f"求人タイトル: {title}\n\n概要:\n{summary[:1000]}"}
            ],
            max_completion_tokens=8000  # 4000でも足りないケースがあったため倍増
        )

        if response.choices and len(response.choices) > 0:
            content = response.choices[0].message.content
            if content:
                return content.strip()
            return None
        return None
    except Exception as e:
        print(f"⚠️ OpenAI API Error: {e}")
        # 詳細なエラー情報を出力
        if hasattr(e, 'response'): 
            pass # Removed debug print
        return None

async def scrape_job_detail(page, url):
    # Removed debug print: print(f"🔍 Visiting: {url}")
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
        
        return details

    except Exception as e:
        print(f"⚠️ Error scraping {url}: {e}")
        return None

async def main():
    print("🚀 Starting detailed scraping & AI generation...")
    
    # 1. データ読み込み
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            jobs = json.load(f)
    except FileNotFoundError:
        print("❌ Jobs data file not found.")
        return

    # Reverted force-update logic: only process jobs from TARGET_SOURCE
    target_jobs = [
        j for j in jobs 
        if j.get("source") == TARGET_SOURCE and (not j.get("summary") or not j.get("recommendation"))
    ]
    
    print(f"📋 Found {len(target_jobs)} jobs to process.")
    if len(target_jobs) == 0:
        print("✅ No jobs need updating.")
        return

    # 2. 処理実行
    updated_count = 0
    BATCH_SIZE = 100
    
    # Playwright起動（必要な場合のみ）
    # summaryがないジョブが1つでもある場合のみブラウザを起動
    needs_scraping = any(not j.get("summary") for j in target_jobs[:BATCH_SIZE])
    
    browser = None
    page = None
    playwright = None

    if needs_scraping:
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

    try:
        for i, job in enumerate(target_jobs[:BATCH_SIZE]):
            print(f"[{i+1}/{min(len(target_jobs), BATCH_SIZE)}] Processing: {job['title']}...")
            job_updated = False
            
            # 1. Scraping (if summary missing)
            if not job.get("summary") and page:
                details = await scrape_job_detail(page, job["link"])
                if details:
                    if details.get("summary"):
                        job["summary"] = details["summary"]
                        job_updated = True
                    if details.get("image_url"):
                        job["image_url"] = details["image_url"]
                        job_updated = True
            
            # 2. AI Recommendation (if summary exists but recommendation missing)
            if job.get("summary") and not job.get("recommendation") and api_key:
                print("  🤖 Generating AI recommendation...")
                rec_text = generate_ai_recommendation(job["title"], job["summary"])
                if rec_text:
                    job["recommendation"] = rec_text
                    print("  ✨ Recommendation generated.")
                    job_updated = True
                else:
                    print("  ⚠️ AI Generation failed.")
            
            if job_updated:
                updated_count += 1

    finally:
        if browser:
            await browser.close()
        if playwright:
            await playwright.stop()

    # 3. 保存
    if updated_count > 0:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(jobs, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved {updated_count} jobs with new details to {DATA_FILE}")
    else:
        print("No changes saved.")

if __name__ == "__main__":
    asyncio.run(main())
