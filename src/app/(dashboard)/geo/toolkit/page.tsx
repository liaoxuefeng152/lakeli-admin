'use client';

import { useState } from 'react';
import { FileCode, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchJSON } from '@/lib/services/admin-api';

const TOOLS = [
  { key: 'schema', label: 'Schema 标记', hint: '生成 JSON-LD 结构化数据' },
  { key: 'llmstxt', label: 'llms.txt', hint: '生成 AI 友好的网站说明文件' },
  { key: 'alt', label: 'ALT 标签', hint: '批量生成图片 ALT 文本' },
  { key: 'internal_links', label: '内链规划', hint: '规划站内链接结构' },
] as const;

type ToolKey = (typeof TOOLS)[number]['key'];

export default function GeoToolkitPage() {
  const [tool, setTool] = useState<ToolKey>('llmstxt');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (loading) return;
    setLoading(true);
    setOutput('');
    try {
      const res = await fetchJSON<{ success: boolean; output: string; source?: string }>('/api/geo/toolkit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool,
          data: { name, url, description },
        }),
      });
      setOutput(res.output || '');
    } catch (e: any) {
      setOutput(/401|403/.test(e?.message || '') ? '当前账号无权限使用此工具，请使用管理员或运营账号登录。' : '生成失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">GEO 站内工具箱</h1>
        <p className="text-sm text-gray-500 mt-1">快速生成 Schema / llms.txt / ALT 标签 / 内链方案</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTool(t.key)}
            className={`rounded-xl border p-3 text-left transition ${
              tool === t.key ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'
            }`}
          >
            <div className="text-sm font-medium text-gray-900">{t.label}</div>
            <div className="mt-1 text-xs text-gray-500">{t.hint}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-gray-600">公司/品牌名</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：拉克力" className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">官网地址</label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">一句话描述</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="核心业务描述" className="mt-1" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={generate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          生成
        </Button>
        <Button variant="outline" onClick={copy} disabled={!output}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? '已复制' : '复制结果'}
        </Button>
      </div>

      {output && (
        <pre className="max-h-[60vh] overflow-auto rounded-xl border border-gray-200 bg-gray-900 p-4 text-xs text-gray-100">
          {output}
        </pre>
      )}
    </div>
  );
}
