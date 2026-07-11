'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Download } from 'lucide-react';
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
import { customers, orders, chatRecords, industryOptions } from '@/lib/mock-data';
import type { Customer } from '@/lib/mock-data';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact.includes(searchTerm) ||
      c.phone.includes(searchTerm);
    const matchIndustry = industryFilter === 'all' || c.industry === industryFilter;
    return matchSearch && matchIndustry;
  });

  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetail(true);
  };

  const isExpiringSoon = (date: string) => {
    if (currentTime === 0) return false;
    const diff = new Date(date).getTime() - currentTime;
    return diff < 30 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">全域客户档案中心</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          批量导出
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="客户名称/手机号/联系人"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="行业筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部行业</SelectItem>
            {industryOptions.map((i) => (
              <SelectItem key={i} value={i}>{i}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="bg-[#1677FF] hover:bg-[#1677FF]/90">查询</Button>
        <Button variant="outline" onClick={() => { setSearchTerm(''); setIndustryFilter('all'); }}>重置</Button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户ID</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">公司名称</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">联系人</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">行业</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">当前套餐</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">到期时间</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">负责销售</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                <td className="px-5 py-4 text-sm text-gray-500">{customer.id}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleViewDetail(customer)}
                    className="text-sm font-medium text-[#1677FF] hover:text-[#1677FF]/80"
                  >
                    {customer.company}
                  </button>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{customer.contact}</td>
                <td className="px-5 py-4">
                  <Badge variant="secondary" className="text-xs">{customer.industry}</Badge>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{customer.currentPlan}</td>
                <td className="px-5 py-4">
                  <span className={`text-sm ${isExpiringSoon(customer.expiryDate) ? 'text-[#F53F3F] font-medium' : 'text-gray-600'}`}>
                    {customer.expiryDate}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{customer.salesPerson}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetail(customer)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 360° Customer Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>360° 客户全景档案</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="basic" className="mt-2">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="basic">基础信息</TabsTrigger>
                <TabsTrigger value="orders">订单记录</TabsTrigger>
                <TabsTrigger value="geo">GEO数据</TabsTrigger>
                <TabsTrigger value="chats">AI对话</TabsTrigger>
                <TabsTrigger value="leads">线索来源</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">公司名</span>
                    <p className="text-sm font-medium">{selectedCustomer.company}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">行业</span>
                    <p className="text-sm font-medium">{selectedCustomer.industry}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">联系人</span>
                    <p className="text-sm font-medium">{selectedCustomer.contact}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">手机号</span>
                    <p className="text-sm font-medium">{selectedCustomer.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">注册时间</span>
                    <p className="text-sm font-medium">{selectedCustomer.registeredAt}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">负责销售</span>
                    <p className="text-sm font-medium">{selectedCustomer.salesPerson}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-4">
                <div className="space-y-3">
                  {orders
                    .filter((o) => o.customer === selectedCustomer.company)
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                        <div>
                          <div className="text-sm font-medium">{order.plan}</div>
                          <div className="text-xs text-gray-500 mt-1">订单号: {order.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#1677FF]">¥{order.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">到期: {order.expiryDate}</div>
                        </div>
                      </div>
                    ))}
                  {orders.filter((o) => o.customer === selectedCustomer.company).length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-8">暂无订单记录</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="geo" className="mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-gray-100 p-4 text-center">
                    <div className="text-2xl font-bold text-[#0F52BA]">45</div>
                    <div className="text-xs text-gray-500 mt-1">诊断次数</div>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-4 text-center">
                    <div className="text-2xl font-bold text-[#0F52BA]">120</div>
                    <div className="text-xs text-gray-500 mt-1">文案产出</div>
                  </div>
                  <div className="rounded-lg border border-gray-100 p-4 text-center">
                    <div className="text-2xl font-bold text-[#0F52BA]">8,500</div>
                    <div className="text-xs text-gray-500 mt-1">AI曝光量</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chats" className="mt-4">
                <div className="space-y-3">
                  {chatRecords
                    .filter((c) => c.customerId === selectedCustomer.id)
                    .map((chat) => (
                      <div key={chat.id} className="rounded-lg border border-gray-100 p-4">
                        <div className="text-sm font-medium text-gray-900 mb-1">Q: {chat.question}</div>
                        <div className="text-sm text-gray-600">A: {chat.answer}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{chat.createdAt}</span>
                          <span>置信度: {(chat.confidence * 100).toFixed(0)}%</span>
                          {chat.isHumanIntervention && <Badge variant="secondary" className="text-xs">人工介入</Badge>}
                        </div>
                      </div>
                    ))}
                  {chatRecords.filter((c) => c.customerId === selectedCustomer.id).length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-8">暂无对话记录</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="leads" className="mt-4">
                <div className="rounded-lg border border-gray-100 p-6 text-center">
                  <p className="text-sm text-gray-500">线索来源: AI客服对话留资</p>
                  <p className="text-xs text-gray-400 mt-2">通过AI客服自动采集的客户留资信息</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetail(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
