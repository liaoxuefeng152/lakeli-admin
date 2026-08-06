'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { Search, Sparkles, Crown, FileText, GitBranch } from 'lucide-react';
import { toast } from 'sonner';

interface HitItem {
  id: string;
  title: string;
  content: string;
  category: string;
  score?: number;
  mode?: 'semantic' | 'keyword' | 'hybrid';
}

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  try {
    const raw = localStorage.getItem('lakeli_admin_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u.id) h['x-user-id'] = String(u.id);
      if (u.role) h['x-user-role'] = String(u.role);
      if (u.email) h['x-user-email'] = String(u.email);
    }
  } catch { /* ignore */ }
  return h;
}

const MODE_LABEL: Record<string, string> = {
  semantic: '语义命中',
  keyword: '关键词命中',
  hybrid: '混合命中',
};

export default function RagDebugPage() {
  const [query, setQuery] = useState('');
  const [alpha, setAlpha] = useState(0.7);
  const [hits, setHits] = useState<HitItem[]>([]);
  const [mode, setMode] = useState('hybrid');
  const [loading, setLoading] = useState(false);
  const [lastMode, setLastMode] = useState<string>('');

  const run = async () => {
    if (!query.trim()) { toast.warning('请输入检索语句'); return; }
    // 模式切换映射为 alpha：纯语义=1，纯关键词=0，混合=0.7
    const a = mode === 'semantic' ? 1 : mode === 'keyword' ? 0 : alpha;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/knowledge/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ query, limit: 8, alpha: a }),
      });
      const json = await res.json();
      setHits(json.data || []);
      setLastMode(json.mode || (json.data?.[0]?.mode ?? ''));
      if (!json.data?.length) toast.info('未命中，已回退关键词检索');
    } catch (e) {
      toast.error('检索失败: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const contextPreview = hits
    .map((h) => `【${h.title}】\n${h.content}`)
    .join('\n\n---\n\n');

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#1D2129]">RAG 调试台</h1>
          <p className="text-sm text-[#4E5969]">知识库语义检索 · 混合召回 · 上下文预览</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && run()}
              placeholder="输入检索语句，如：防水蓝牙耳机泰国带货标题"
              className="flex-1"
            />
            <Button onClick={run} disabled={loading} className="gap-2 bg-primary hover:bg-primary/90">
              <Sparkles className="h-4 w-4" /> {loading ? '检索中…' : '检索'}
            </Button>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList>
                <TabsTrigger value="semantic">语义</TabsTrigger>
                <TabsTrigger value="hybrid">混合</TabsTrigger>
                <TabsTrigger value="keyword">关键词</TabsTrigger>
              </TabsList>
            </Tabs>
            {mode === 'hybrid' && (
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                <span className="text-xs text-[#4E5969] whitespace-nowrap">语义权重 α</span>
                <Slider value={[alpha]} min={0} max={1} step={0.1}
                  onValueChange={(v) => setAlpha(v[0])} className="flex-1" />
                <Badge variant="outline">{alpha.toFixed(1)}</Badge>
              </div>
            )}
            {lastMode && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                上次召回：{MODE_LABEL[lastMode] || lastMode}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="text-sm font-medium text-[#1D2129]">命中结果（{hits.length}）</div>
          {hits.length === 0 && (
            <Card><CardContent className="py-10 text-center text-[#4E5969]">
              暂无命中，输入查询语句开始调试
            </CardContent></Card>
          )}
          {hits.map((h) => (
            <Card key={h.id} className="group hover:border-primary/40 transition-colors">
              <CardContent className="flex items-start gap-4 pt-4">
                <div className="h-16 w-16 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="65%" outerRadius="100%"
                      data={[{ name: 's', value: Math.round((h.score ?? 0) * 100), fill: '#1677FF' }]}>
                      <RadialBar dataKey="value" background data={[{ name: 's', value: 100, fill: '#eef2f7' }]} cornerRadius={8} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium text-[#1D2129] truncate">{h.title}</span>
                    <Badge variant="secondary" className="shrink-0">{h.category}</Badge>
                    <Badge variant="outline" className="shrink-0 text-[#4E5969]">
                      {MODE_LABEL[h.mode || ''] || h.mode}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#4E5969] line-clamp-3 group-hover:text-[#1D2129] transition-colors">
                    {h.content}
                  </p>
                  <div className="text-xs text-[#86909c] mt-1">
                    相似度：{((h.score ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-[#1D2129] flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" /> Prompt 上下文注入预览
          </div>
          <Card className="sticky top-4">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2 text-xs text-[#4E5969]">
                <Crown className="h-3 w-3" /> 将注入 system prompt 的知识片段
              </div>
              <pre className="text-xs bg-[#F5F7FA] rounded-lg p-3 max-h-[60vh] overflow-auto whitespace-pre-wrap text-[#1D2129]">
                {contextPreview || '（检索后展示将被注入的上下文）'}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
