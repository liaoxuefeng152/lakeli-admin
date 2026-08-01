'use client';

import { useEffect, useState } from 'react';
import { Search, Download, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { fetchGeoRecords } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';

interface CopyRecord {
  id: string;
  customer: string;
  type: string;
  language: string;
  wordCount: number;
  date: string;
}

export default function GeoCopyPage() {
  const [records, setRecords] = useState<CopyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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

  const filtered = records.filter(
    (r) => !search || r.customer.includes(search) || r.type.includes(search),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">文案生成记录查询</h1>
          <p className="text-sm text-gray-500 mt-1">查看AI生成的GEO优化文案记录</p>
        </div>
        <Button variant="outline" onClick={() => exportToCsv('文案生成记录.csv', ['记录ID', '客户', '文案类型', '语言', '字数', '生成时间'], filtered.map((r) => [r.id, r.customer, r.type, r.language, r.wordCount, r.date]))}>
          <Download className="mr-2 h-4 w-4" />
          导出记录
        </Button>
      </div>

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
    </div>
  );
}
