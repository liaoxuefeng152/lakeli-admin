'use client';

import { useEffect, useState } from 'react';
import { Search, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { fetchGeoRecords } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';

interface KeywordRecord {
  id: string;
  customer: string;
  keyword: string;
  difficulty: string;
  searchVolume: number;
  date: string;
}

const difficultyColors: Record<string, string> = { '低': '#00B42A', '中': '#FF7D00', '高': '#F53F3F' };

export default function GeoKeywordsPage() {
  const [records, setRecords] = useState<KeywordRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      setRecords(await fetchGeoRecords('keywords') as KeywordRecord[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(
    (r) => !search || r.keyword.includes(search) || r.customer.includes(search),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">关键词挖掘记录</h1>
          <p className="text-sm text-gray-500 mt-1">AI挖掘的高价值关键词记录</p>
        </div>
        <Button variant="outline" onClick={() => exportToCsv('关键词挖掘记录.csv', ['ID', '客户', '关键词', '竞争难度', '搜索量', '挖掘时间'], filtered.map((r) => [r.id, r.customer, r.keyword, r.difficulty, r.searchVolume, r.date]))}><Download className="mr-2 h-4 w-4" />导出</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索关键词/客户"
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
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">关键词</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">竞争难度</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">搜索量</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">挖掘时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin inline mr-2" />加载中...
              </td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                <td className="px-5 py-4 text-sm text-gray-500">{r.id}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{r.customer}</td>
                <td className="px-5 py-4 text-sm text-[#0F52BA] font-mono">{r.keyword}</td>
                <td className="px-5 py-4">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: difficultyColors[r.difficulty], backgroundColor: difficultyColors[r.difficulty] + '15' }}>
                    {r.difficulty}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{r.searchVolume.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{r.date}</td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">暂无关键词记录</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
