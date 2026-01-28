import os
from datetime import datetime, timedelta, timezone
from supabase import create_client, Client

class DBClient:
    def __init__(self):
        # 環境変数からキーを取得
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        
        if not url or not key:
            raise ValueError("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")
            
        self.supabase: Client = create_client(url, key)
        self.table_name = "jobs"

    def upsert_job(self, job_data: dict):
        """
        求人データをDBに保存または更新する
        :param job_data: 共通フォーマットの辞書
        :return: (is_new, original_response)
                 is_new: Trueなら新規作成、Falseなら更新またはスキップ
        """
        try:
            # Upsert実行 (on_conflict='url')
            # ignore_duplicates=False にすると更新になる
            response = self.supabase.table(self.table_name).upsert(
                job_data, on_conflict="url"
            ).execute()
            
            # レスポンスから結果を解析
            # Supabase(PostgREST)のレスポンスは data 属性に入っている
            if response.data:
                # insert/update成功
                # created_at と updated_at が同じなら新規、違えば更新と判定できるが、
                # 厳密にはDB側のトリガー次第。ここでは単に成功を返す。
                return True, response.data
            else:
                return False, None
                
        except Exception as e:
            print(f"⚠️ DB Error: {e}")
            return False, str(e)

    def check_url_exists(self, url: str) -> bool:
        """URLが既に存在するかチェックする（早期終了判定用）"""
        try:
            response = self.supabase.table(self.table_name).select("id").eq("url", url).execute()
            return len(response.data) > 0
        except:
            return False

    def delete_old_jobs(self, days: int = 30):
        """
        最終更新から指定日数以上経過した求人を削除する
        """
        try:
            threshold = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
            response = self.supabase.table(self.table_name).delete().lt("updated_at", threshold).execute()
            return len(response.data) if response.data else 0
        except Exception as e:
            print(f"⚠️ DB Delete Error: {e}")
            return 0

    def fetch_all_jobs(self):
        """
        全求人を新着順（created_at降順）で取得する
        """
        try:
            # limitを指定しないとデフォルトで最大1000件などの制限がある場合があるが、
            # 一旦全件取得を試みる (件数が多い場合はpaginationが必要)
            response = self.supabase.table(self.table_name).select("*").order("created_at", desc=True).limit(2000).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"⚠️ DB Fetch Error: {e}")
            return []
