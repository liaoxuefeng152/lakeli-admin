-- 龙掌柜AI助手后台管理系统 - 新增表
-- 执行方式: docker exec -i lzg-postgres psql -U postgres -d lzg_db < scripts/migrate-admin.sql

-- 系统配置表（替代 .env）
CREATE TABLE IF NOT EXISTS system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(200) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string','number','boolean','json')),
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    label VARCHAR(200),
    description TEXT,
    encrypted BOOLEAN DEFAULT false,
    updated_by VARCHAR(100),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认配置
INSERT INTO system_configs (key, value, type, category, label, description, encrypted) VALUES
('llm_api_key', '', 'string', 'llm', 'API Key', '火山引擎 API Key', true),
('llm_base_url', 'https://ark.cn-beijing.volces.com/api/v3', 'string', 'llm', 'Base URL', 'LLM 服务地址', false),
('llm_model', 'doubao-seed-2-0-lite-260215', 'string', 'llm', '默认模型', '默认使用的 LLM 模型', false),
('llm_temperature', '0.7', 'number', 'llm', 'Temperature', '生成随机性 (0-1)', false),
('llm_max_tokens', '4096', 'number', 'llm', 'Max Tokens', '最大输出 Token 数', false),
('sandbox_enabled', 'true', 'boolean', 'sandbox', '启用沙盒', '是否启用 Docker 代码执行沙盒', false),
('sandbox_timeout', '30000', 'number', 'sandbox', '超时时间(ms)', '代码执行超时时间', false),
('sandbox_max_memory', '512', 'number', 'sandbox', '最大内存(MB)', '沙盒最大内存限制', false),
('browser_max_sessions', '5', 'number', 'browser', '浏览器并发数', 'Playwright 最大并发会话数', false),
('browser_headful', 'false', 'boolean', 'browser', '显示浏览器窗口', '是否显示浏览器界面', false)
ON CONFLICT (key) DO NOTHING;

-- 用户操作日志
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(100),
    detail TEXT,
    ip VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);
