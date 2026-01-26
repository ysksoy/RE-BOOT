-- 1. 既存のテーブルがあれば削除 (開発用: 本番運用後はコメントアウト)
drop table if exists public.jobs;

-- 2. 求人情報を格納するメインテーブルを作成
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  
  -- どのサイトから取得したか ('Indeed', 'Kyujin', 'Infra', 'ZeroOne')
  site_name text not null,
  
  -- 求人の基本情報
  title text not null,           -- 求人タイトル
  company text,                  -- 会社名
  location text,                 -- 勤務地 (都道府県など)
  
  -- 給与情報の正規化は難しいので、まずはテキストでそのまま保存
  salary text,                   
  
  -- 求人詳細ページのURL (重複排除のキーとなる)
  url text not null unique,
  
  -- 画像URL (Infra, ZeroOneなど画像がある場合)
  image_url text,
  
  -- その他のメタデータ
  tags text[],                   -- 特徴タグ (例: ['未経験可', 'リモート'])
  summary text,                  -- 概要・詳細テキスト
  
  -- タイムスタンプ
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. 検索を高速化するためのインデックス
create index jobs_url_index on public.jobs (url);
create index jobs_site_name_index on public.jobs (site_name);
create index jobs_created_at_index on public.jobs (created_at);

-- 4. Row Level Security (RLS) の設定
-- 読み取りは全ユーザー許可、書き込みは要認証
alter table public.jobs enable row level security;

-- 匿名ユーザー(Webサイト訪問者)は参照のみ可能
create policy "Enable read access for all users" on public.jobs
  for select using (true);

-- 認証済みユーザー(スクレーパー)のみ追加・更新が可能
-- ※ バックエンドで service_role key を使う場合はRLSを無視できるが、念のため設定
create policy "Enable insert for authenticated users only" on public.jobs
  for insert with check (auth.role() = 'service_role');

create policy "Enable update for authenticated users only" on public.jobs
  for update using (auth.role() = 'service_role');
