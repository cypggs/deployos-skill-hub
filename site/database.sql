-- DeployOS / FullStack Deploy Skill Hub Database Schema
-- Enables interactive exploration of the fullstack-deploy skill

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Track page visits for the live dashboard
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Master list of checklist items for the 6 pipeline phases
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phase INT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  item_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Per-visitor checklist progress
CREATE TABLE IF NOT EXISTS user_checklists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(visitor_id, item_id)
);

-- Per-visitor votes for the most interesting pipeline phase
CREATE TABLE IF NOT EXISTS phase_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  phase INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(visitor_id, phase)
);

-- Public feedback wall
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  author TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seed checklist items for all 6 phases of the fullstack-deploy skill
INSERT INTO checklist_items (phase, label, description, item_order) VALUES
(1, '明确应用需求', '确定核心功能、目标用户、技术栈偏好与部署目标', 1),
(1, '选择前端框架', '根据场景选择 Next.js / Vite / Flask / FastAPI / Astro 等', 2),
(1, '设计数据库结构', '规划表、关系、RLS 策略、Storage 存储桶', 3),
(2, '创建 Supabase 项目', '在 supabase.com 创建项目并记录 Project URL', 1),
(2, '编写 database.sql', '包含表、索引、触发器、RLS 策略、示例数据', 2),
(2, '自动执行 SQL', '使用 SUPABASE_MANAGEMENT_TOKEN 调用 Management API 或手动粘贴到 SQL Editor', 3),
(3, '初始化项目', '创建 Next.js / Flask 等项目结构并配置环境变量', 1),
(3, '安装依赖', '安装框架依赖和 @supabase/supabase-js 客户端', 2),
(3, '实现功能', '数据库客户端、API 路由、UI 组件、认证、上传等', 3),
(3, '本地测试', '运行 npm run dev 或等价命令验证所有功能', 4),
(4, '初始化 Git', 'git init 并创建 .gitignore 排除敏感文件', 1),
(4, '提交代码', 'git add . && git commit 完成初始提交', 2),
(4, '创建 GitHub 仓库', '使用 GITHUB_TOKEN 调用 GitHub API 创建远程仓库', 3),
(4, '推送代码', 'git remote add origin ... && git push -u origin main', 4),
(5, '安装 Vercel CLI', 'npm i -g vercel 或在 CI 中使用已安装版本', 1),
(5, '首次部署', 'vercel --token $VERCEL_TOKEN --yes --prod 获取 projectId', 2),
(5, '配置环境变量', '通过 Vercel API 添加 NEXT_PUBLIC_* 等生产环境变量', 3),
(5, '重新部署', 'vercel --token $VERCEL_TOKEN --prod --force 应用环境变量', 4),
(5, '关闭访问保护', '禁用 ssoProtection / passwordProtection 让站点公开可访问', 5),
(6, '验证线上功能', 'curl 生产 URL 返回 200，访问关键流程确认正常', 1),
(6, '交付文档', '提供生产 URL、GitHub 仓库、Vercel Dashboard 链接与 README', 2)
ON CONFLICT DO NOTHING;

-- Row Level Security
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Anonymous users can read public data
-- Drop existing policies to make reruns idempotent
DROP POLICY IF EXISTS "Select visits" ON visits;
DROP POLICY IF EXISTS "Select checklist items" ON checklist_items;
DROP POLICY IF EXISTS "Select user_checklists" ON user_checklists;
DROP POLICY IF EXISTS "Select phase_votes" ON phase_votes;
DROP POLICY IF EXISTS "Select feedbacks" ON feedbacks;
DROP POLICY IF EXISTS "Insert visits" ON visits;
DROP POLICY IF EXISTS "Insert user_checklists" ON user_checklists;
DROP POLICY IF EXISTS "Update user_checklists" ON user_checklists;
DROP POLICY IF EXISTS "Insert phase_votes" ON phase_votes;
DROP POLICY IF EXISTS "Insert feedbacks" ON feedbacks;

CREATE POLICY "Select visits" ON visits FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Select checklist items" ON checklist_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Select user_checklists" ON user_checklists FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Select phase_votes" ON phase_votes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Select feedbacks" ON feedbacks FOR SELECT TO anon, authenticated USING (true);

-- Anonymous users can insert their own rows (enforced at application layer via visitor_id)
CREATE POLICY "Insert visits" ON visits FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Insert user_checklists" ON user_checklists FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Update user_checklists" ON user_checklists FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Insert phase_votes" ON phase_votes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Insert feedbacks" ON feedbacks FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Realtime: broadcast new feedbacks, votes, and visits
-- Supabase already creates a supabase_realtime publication; attach tables idempotently.
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE feedbacks;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE phase_votes;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE visits;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
