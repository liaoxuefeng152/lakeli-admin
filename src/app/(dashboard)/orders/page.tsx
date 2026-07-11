'use client';

import { useState } from 'react';
import { Search, Download, Eye, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { orders, planOptions } from '@/lib/mock-data';

const statusLabels: Record<string, string> = {
  paid: '已支付',
  pending: '待支付',
  expired: '已过期',
  refunded: '已退款',
};
const statusColors: Record<string, string> = {
  paid: '#00B42A',
  pending: '#FF7D00',
  expired: '#F53F3F',
  refunded: '#8C97A9',
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">统一订单&计费中心</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出对账Excel
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="orders">订单记录</TabsTrigger>
          <TabsTrigger value="plans">套餐配置</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="搜索客户名称/订单号" className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="支付状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">已支付</SelectItem>
                <SelectItem value="pending">待支付</SelectItem>
                <SelectItem value="expired">已过期</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-[#1677FF] hover:bg-[#1677FF]/90">查询</Button>
          </div>

          {/* Table */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">套餐</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">支付时间</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">到期日</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500 font-mono">{order.id}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{order.customer}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{order.plan}</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">¥{order.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{order.paidAt}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{order.expiryDate}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: statusColors[order.status], backgroundColor: statusColors[order.status] + '15' }}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">配置自助套餐、代运营套餐的定价与折扣规则</p>
            <Button className="bg-[#1677FF] hover:bg-[#1677FF]/90" onClick={() => setShowPlanDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新增套餐
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'GEO基础版', price: '6,800', period: '年', features: ['每月10次诊断', '基础文案生成', '国内AI监测'], color: '#1677FF' },
              { name: 'GEO专业版', price: '12,800', period: '年', features: ['每月50次诊断', '高级文案生成', '国内外AI监测', '关键词挖掘'], color: '#0F52BA' },
              { name: 'GEO旗舰版', price: '29,800', period: '年', features: ['无限诊断', '无限文案', '全球AI监测', '专属客服', 'API接口'], color: '#001529' },
            ].map((plan) => (
              <div key={plan.name} className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="text-sm font-medium text-gray-500">{plan.name}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold" style={{ color: plan.color }}>¥{plan.price}</span>
                  <span className="text-sm text-gray-500">/{plan.period}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="h-1 w-1 rounded-full bg-[#1677FF]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-5" size="sm">编辑配置</Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Plan Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>新增套餐</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>套餐名称</Label>
              <Input placeholder="请输入套餐名称" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>价格(元)</Label>
                <Input type="number" placeholder="请输入价格" />
              </div>
              <div className="space-y-2">
                <Label>计费周期</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="选择周期" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">月付</SelectItem>
                    <SelectItem value="quarter">季付</SelectItem>
                    <SelectItem value="year">年付</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>年签折扣(%)</Label>
              <Input type="number" placeholder="如: 90 表示9折" defaultValue="90" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>取消</Button>
            <Button className="bg-[#1677FF] hover:bg-[#1677FF]/90" onClick={() => setShowPlanDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
