-- ==========================================================
-- 1. إنشاء جدول المعلمين (teachers)
-- ==========================================================
create table if not exists public.teachers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  id_number    text not null,
  phone        text not null,
  email        text not null,
  degree       text not null,
  major        text not null,
  position     text not null,
  start_date   date not null,
  experience   text,
  sections     text[] not null default '{}',
  id_image     text,
  pass_image   text,
  submitted_at timestamptz not null default now()
);

-- تفعيل Row Level Security (RLS)
alter table public.teachers enable row level security;

-- السماح لجميع الزوار بإرسال نماذج جديدة (Insert)
create policy "Allow anonymous insert"
  on public.teachers
  for insert
  to anon, authenticated
  with check (true);

-- السماح بالقراءة (Select) لعرضها في لوحة HR
create policy "Allow read for dashboard"
  on public.teachers
  for select
  to anon, authenticated
  using (true);

-- ==========================================================
-- 2. إعداد مستودع التخزين (Storage Bucket) للصور
-- ==========================================================
-- إنشاء الـ bucket للصور ومستندات الهوية والجواز
insert into storage.buckets (id, name, public)
values ('teacher-images', 'teacher-images', true)
on conflict (id) do update set public = true;

-- سياسة السماح برفع الصور لجميع المستخدمين في هذا الـ bucket
create policy "Allow public uploads"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'teacher-images');

-- سياسة السماح بعرض الصور للجميع
create policy "Allow public read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'teacher-images');
