'use client';

import { Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const wecomRecords = [
  { id: 'WC001', customer: '深圳跨境通科技有限公司', contact: '陈总', messageCount: 24, lastMessage: '请问GEO旗舰版支持哪些监测平台？', date: '2026-07-10 16:30', status: 'active' },
  { id: 'WC002', customer: '广州本地生活服务有限公司', contact: '黄总', messageCount: 8, lastMessage: '好的，我考虑一下', date: '2026-07-10 14:20', status: 'active' },
  { id: 'WC003', customer: '东莞精密工业设备有限公司', contact: '李经理', messageCount: 15, lastMessage: '诊断报告已收到，谢谢', date: '2026-07-10 11:45', status: 'archived' },
  { id: 'WC004', customer: '佛山外贸制造有限公司', contact: '何总', messageCount: 32, lastMessage: '下周方便安排线上演示吗？', date: '2026-07-09 17:10', status: 'active' },
  { id: 'WC005', customer: '深圳前海金融服务公司', contact: '吴总', messageCount: 6, lastMessage: '发一份方案给我看看', date: '2026-07-09 10:30', status: 'archived' },
];

export default function WecomArchivePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">企微会话存档查询</h1>
          <p className="text-sm text-gray-500 mt-1">查看企业微信中的客户会话记录</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          导出记录
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="搜索客户/联系人" className="pl-10" />
        </div>
        <Button className="bg-[#00B42A] hover:bg-[#00B42A]/90">查询</Button>
      </div>

      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">联系人</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">消息数</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">最新消息</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {wecomRecords.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-[#F0FFF4] transition-colors">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{r.customer}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{r.contact}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{r.messageCount} 条</td>
                <td className="px-5 py-4 text-sm text-gray-500 max-w-[250px] truncate">{r.lastMessage}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{r.date}</td>
                <td className="px-5 py-4">
                  <Badge variant={r.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {r.status === 'active' ? '进行中' : '已归档'}
                  </Badge>
                </td>
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
