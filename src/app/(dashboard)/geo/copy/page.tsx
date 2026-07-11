'use client';

import { Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const copyRecords = [
  { id: 'CP001', customer: '深圳跨境通科技有限公司', type: '产品描述', language: '英文', wordCount: 280, date: '2026-07-10 15:20' },
  { id: 'CP002', customer: '东莞精密工业设备有限公司', type: '公司介绍', language: '英文', wordCount: 450, date: '2026-07-10 13:10' },
  { id: 'CP003', customer: '珠海黄精生物科技有限公司', type: 'FAQ', language: '英文', wordCount: 320, date: '2026-07-10 10:45' },
  { id: 'CP004', customer: '深圳创新科技集团', type: '博客文章', language: '英文', wordCount: 800, date: '2026-07-09 16:30' },
  { id: 'CP005', customer: '佛山外贸制造有限公司', type: '产品描述', language: '英文', wordCount: 250, date: '2026-07-09 11:20' },
];

export default function GeoCopyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">文案生成记录查询</h1>
          <p className="text-sm text-gray-500 mt-1">查看AI生成的GEO优化文案记录</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          导出记录
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="搜索客户/文案类型" className="pl-10" />
        </div>
        <Button className="bg-[#0F52BA] hover:bg-[#0F52BA]/90">查询</Button>
      </div>

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
            {copyRecords.map((record) => (
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
