'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Download, Loader2, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { fetchGeoRecords } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';

interface KeywordRecord {
  id: string;
  customer: string;
  keyword: string;
  type: string;
  difficulty: string;
  aiSearchVolume: string;
  searchVolume: number;
  geoValue: string;
  date: string;
}

const difficultyColors: Record<string, string> = { '低': '#00B42A', '中': '#FF7D00', '高': '#F53F3F' };

const typeBadgeStyle: Record<string, { bg: string; text: string }> = {
  '疑问型': { bg: '#E8F4FD', text: '#0F52BA' },
  '对比型': { bg: '#F3E8FF', text: '#7C3AED' },
  '参数选型': { bg: '#D1FAE5', text: '#059669' },
};

const volumeBadgeStyle: Record<string, { bg: string; text: string }> = {
  '高': { bg: '#FEE2E2', text: '#DC2626' },
  '中': { bg: '#FEF3C7', text: '#D97706' },
  '低': { bg: '#F1F5F9', text: '#64748B' },
};

export default function GeoKeywordsPage() {
  const router = useRouter();
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
    (r) => !search || r.keyword.includes(search) || r.customer.includes(search) || (r.geoValue || '').includes(search),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">关键词挖掘记录</h1>
          <p className="text-sm text-gray-500 mt-1">AI挖掘的高价值关键词记录，含类型、热度、GEO价值等完整信息</p>
        </div>
        <Button variant="outline" onClick={() => exportToCsv('关键词挖掘记录.csv',
          ['ID', '客户', '关键词', '类型', 'AI搜索热度', '竞争难度', '搜索量', 'GEO价值', '挖掘时间'],
          filtered.map((r) => [r.id, r.customer, r.keyword, r.type || '', r.aiSearchVolume || '', r.difficulty, r.searchVolume, r.geoValue || '', r.date])
        )}><Download className="mr-2 h-4 w-4" />导出</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索关键词/客户/GEO价值"
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

      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">关键词</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">AI热度</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">难度</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">搜索量</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">GEO价值</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">挖掘时间</th>
              <th className="px-5 py-3.5 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="px-5 py-12 text-center text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin inline mr-2" />加载中...
              </td></tr>
            ) : filtered.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                <td className="px-5 py-4 text-sm text-gray-500">{r.id}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{r.customer}</td>
                <td className="px-5 py-4 text-sm text-[#0F52BA] font-mono">{r.keyword}</td>
                <td className="px-5 py-4">
                  {r.type ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: typeBadgeStyle[r.type]?.text || '#64748B', backgroundColor: typeBadgeStyle[r.type]?.bg || '#F1F5F9' }}>
                      {r.type}
                    </span>
                  ) : <span className="text-sm text-gray-400">-</span>}
                </td>
                <td className="px-5 py-4">
                  {r.aiSearchVolume ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: volumeBadgeStyle[r.aiSearchVolume]?.text || '#64748B', backgroundColor: volumeBadgeStyle[r.aiSearchVolume]?.bg || '#F1F5F9' }}>
                      {r.aiSearchVolume}
                    </span>
                  ) : <span className="text-sm text-gray-400">-</span>}
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: difficultyColors[r.difficulty], backgroundColor: difficultyColors[r.difficulty] + '15' }}>
                    {r.difficulty}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{r.searchVolume.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm text-gray-500 max-w-[200px] truncate" title={r.geoValue || ''}>
                  {r.geoValue || '-'}
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{r.date}</td>
                <td className="px-5 py-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#0F52BA] border-[#0F52BA]/30 hover:bg-[#F0F5FF] hover:border-[#0F52BA]"
                    onClick={() => router.push(`/geo/copy?keyword=${encodeURIComponent(r.keyword)}&customer=${encodeURIComponent(r.customer)}`)}
                  >
                    <PenLine className="h-3.5 w-3.5 mr-1" />
                    去生成文案
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={10} className="px-5 py-12 text-center text-gray-400">暂无关键词记录</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
