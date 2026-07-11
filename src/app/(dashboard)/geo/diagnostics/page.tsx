'use client';

import { Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const diagnosticsRecords = [
  { id: 'D001', customer: '深圳跨境通科技有限公司', url: 'www.crossborder-trade.com', score: 78, issues: 12, date: '2026-07-10 14:30' },
  { id: 'D002', customer: '东莞精密工业设备有限公司', url: 'www.precision-equipment.cn', score: 85, issues: 8, date: '2026-07-10 11:20' },
  { id: 'D003', customer: '深圳创新科技集团', url: 'www.innovatech.com', score: 62, issues: 18, date: '2026-07-10 09:45' },
  { id: 'D004', customer: '珠海黄精生物科技有限公司', url: 'www.biohuangjing.com', score: 91, issues: 5, date: '2026-07-09 16:10' },
  { id: 'D005', customer: '惠州教育培训机构', url: 'www.huizhouedu.cn', score: 55, issues: 22, date: '2026-07-09 10:30' },
  { id: 'D006', customer: '佛山外贸制造有限公司', url: 'www.foshanexport.com', score: 72, issues: 15, date: '2026-07-08 15:40' },
];

function getScoreColor(score: number): string {
  if (score >= 80) return '#00B42A';
  if (score >= 60) return '#FF7D00';
  return '#F53F3F';
}

export default function GeoDiagnosticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">GEO诊断记录查询</h1>
          <p className="text-sm text-gray-500 mt-1">查看客户网站的GEO智能诊断结果</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          导出记录
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="搜索客户/URL" className="pl-10" />
        </div>
        <Button className="bg-[#0F52BA] hover:bg-[#0F52BA]/90">查询</Button>
      </div>

      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">记录ID</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">诊断URL</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">GEO评分</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">待优化项</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">诊断时间</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {diagnosticsRecords.map((record) => (
              <tr key={record.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                <td className="px-5 py-4 text-sm text-gray-500">{record.id}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{record.customer}</td>
                <td className="px-5 py-4 text-sm text-[#0F52BA]">{record.url}</td>
                <td className="px-5 py-4">
                  <span className="text-sm font-bold" style={{ color: getScoreColor(record.score) }}>
                    {record.score}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">/100</span>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="secondary" className="text-xs">{record.issues} 项</Badge>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{record.date}</td>
                <td className="px-5 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    查看报告
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
