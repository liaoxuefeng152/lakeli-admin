'use client';

import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const keywordRecords = [
  { id: 'KW001', customer: '深圳跨境通科技有限公司', keyword: 'cross-border ecommerce solutions', difficulty: '中', searchVolume: 1200, date: '2026-07-10' },
  { id: 'KW002', customer: '东莞精密工业设备有限公司', keyword: 'CNC precision machining', difficulty: '高', searchVolume: 3500, date: '2026-07-10' },
  { id: 'KW003', customer: '珠海黄精生物科技有限公司', keyword: 'natural health supplements', difficulty: '低', searchVolume: 800, date: '2026-07-09' },
  { id: 'KW004', customer: '深圳创新科技集团', keyword: 'AI powered analytics', difficulty: '高', searchVolume: 5200, date: '2026-07-09' },
  { id: 'KW005', customer: '佛山外贸制造有限公司', keyword: 'OEM furniture manufacturer', difficulty: '中', searchVolume: 2100, date: '2026-07-08' },
];

const difficultyColors: Record<string, string> = { '低': '#00B42A', '中': '#FF7D00', '高': '#F53F3F' };

export default function GeoKeywordsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">关键词挖掘记录</h1>
          <p className="text-sm text-gray-500 mt-1">AI挖掘的高价值关键词记录</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />导出</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="搜索关键词/客户" className="pl-10" />
        </div>
        <Button className="bg-[#0F52BA] hover:bg-[#0F52BA]/90">查询</Button>
      </div>

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
            {keywordRecords.map((r) => (
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
