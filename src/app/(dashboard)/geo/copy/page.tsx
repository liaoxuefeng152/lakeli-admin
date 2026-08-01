'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Download, Eye, Loader2, PenLine, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchGeoRecords, generateGeoCopywriting } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';
import { toast } from 'sonner';

interface CopyRecord {
  id: string;
  customer: string;
  type: string;
  language: string;
  wordCount: number;
  date: string;
}

const COPY_TYPES = ['产品介绍', 'SEO文章', '社媒文案', '广告语', '品牌故事', '问答文案'];
const LANGUAGES = ['中文', '英文', '中英双语'];
const WORD_COUNT_OPTIONS = [500, 800, 1000, 1500, 2000];

function CopywritingPageInner() {
  const searchParams = useSearchParams();
  const prefillKeyword = searchParams.get('keyword') || '';
  const prefillCustomer = searchParams.get('customer') || '';

  // 生成表单状态
  const [keyword, setKeyword] = useState('');
  const [customer, setCustomer] = useState('');
  const [copyType, setCopyType] = useState(COPY_TYPES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [wordCount, setWordCount] = useState(WORD_COUNT_OPTIONS[1]);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  // 记录列表状态
  const [records, setRecords] = useState<CopyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // URL 参数预填
  useEffect(() => {
    if (prefillKeyword) setKeyword(prefillKeyword);
    if (prefillCustomer) setCustomer(prefillCustomer);
  }, [prefillKeyword, prefillCustomer]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      setRecords(await fetchGeoRecords('copywriting') as CopyRecord[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast.error('请输入关键词');
      return;
    }
    if (!customer.trim()) {
      toast.error('请输入客户名称');
      return;
    }
    try {
      setGenerating(true);
      setResult('');
      const res = await generateGeoCopywriting({
        keyword: keyword.trim(),
        customer: customer.trim(),
        copyType,
        language,
        wordCount,
      });
      setResult(res.content);
      toast.success('文案生成成功');
      // 刷新记录列表
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '生成失败');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败');
    }
  };

  const filtered = records.filter(
    (r) => !search || r.customer.includes(search) || r.type.includes(search),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">AI文案工作台</h1>
        <p className="text-sm text-gray-500 mt-1">基于关键词生成GEO优化文案，查看历史生成记录</p>
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate" className="flex items-center gap-1.5">
            <PenLine className="h-3.5 w-3.5" />
            生成文案
          </TabsTrigger>
          <TabsTrigger value="records">
            生成记录
          </TabsTrigger>
        </TabsList>

        {/* ============ 生成文案 Tab ============ */}
        <TabsContent value="generate" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧表单 */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">文案生成配置</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">关键词 <span className="text-red-400">*</span></label>
                <Input
                  placeholder="输入目标关键词，如：工业机器人"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">客户名称 <span className="text-red-400">*</span></label>
                <Input
                  placeholder="输入客户名称"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">文案类型</label>
                  <Select value={copyType} onValueChange={setCopyType}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COPY_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">语言</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">目标字数</label>
                <div className="flex flex-wrap gap-2">
                  {WORD_COUNT_OPTIONS.map((n) => (
                    <Button
                      key={n}
                      variant={wordCount === n ? 'default' : 'outline'}
                      size="sm"
                      className={wordCount === n ? 'bg-[#0F52BA] hover:bg-[#0F52BA]/90' : ''}
                      onClick={() => setWordCount(n)}
                    >
                      {n}字
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-[#0F52BA] hover:bg-[#0F52BA]/90"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />生成中...</>
                ) : (
                  <><PenLine className="h-4 w-4 mr-2" />生成文案</>
                )}
              </Button>
            </div>

            {/* 右侧结果区 */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col min-h-[360px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">生成结果</h3>
                {result && (
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <><Check className="h-3.5 w-3.5 mr-1 text-green-600" />已复制</>
                    ) : (
                      <><Copy className="h-3.5 w-3.5 mr-1" />复制</>
                    )}
                  </Button>
                )}
              </div>
              <div className="flex-1">
                {generating ? (
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />AI 正在生成文案...
                  </div>
                ) : result ? (
                  <div className="prose prose-sm max-w-none text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {result}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                    填写左侧配置后点击「生成文案」，结果将在此处展示
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ============ 生成记录 Tab ============ */}
        <TabsContent value="records" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="搜索客户/文案类型"
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button className="bg-[#0F52BA] hover:bg-[#0F52BA]/90" onClick={load} disabled={loading}>查询</Button>
            </div>
            <Button variant="outline" onClick={() => exportToCsv('文案生成记录.csv', ['记录ID', '客户', '文案类型', '语言', '字数', '生成时间'], filtered.map((r) => [r.id, r.customer, r.type, r.language, r.wordCount, r.date]))}>
              <Download className="mr-2 h-4 w-4" />
              导出记录
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}<Button variant="link" className="h-auto p-0 ml-2 text-red-700" onClick={load}>重试</Button>
            </div>
          )}

          <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">记录ID</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">文案类型</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">语言</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">字数</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">生成时间</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin inline mr-2" />加载中...
                  </td></tr>
                ) : filtered.map((record) => (
                  <tr key={record.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500">{record.id}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{record.customer}</td>
                    <td className="px-5 py-4">
                      <Badge variant="secondary" className="text-xs">{record.type}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{record.language}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{record.wordCount}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{record.date}</td>
                    <td className="px-5 py-4 text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        查看
                      </Button>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">暂无文案记录</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function GeoCopyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-48 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />加载中...
      </div>
    }>
      <CopywritingPageInner />
    </Suspense>
  );
}
