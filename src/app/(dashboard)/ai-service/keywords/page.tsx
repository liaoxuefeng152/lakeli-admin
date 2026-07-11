'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const keywords = [
  { id: 'IK001', keyword: '报价', category: '价格类', triggerCount: 156, status: 'active' },
  { id: 'IK002', keyword: '价格', category: '价格类', triggerCount: 203, status: 'active' },
  { id: 'IK003', keyword: '合作', category: '商务类', triggerCount: 89, status: 'active' },
  { id: 'IK004', keyword: '外贸', category: '行业类', triggerCount: 124, status: 'active' },
  { id: 'IK005', keyword: '代理', category: '商务类', triggerCount: 67, status: 'active' },
  { id: 'IK006', keyword: '定制', category: '需求类', triggerCount: 95, status: 'inactive' },
  { id: 'IK007', keyword: 'OEM', category: '行业类', triggerCount: 78, status: 'active' },
];

export default function AiKeywordsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">意向关键词配置</h1>
          <p className="text-sm text-gray-500 mt-1">配置触发高意向识别的关键词，用于线索自动标记</p>
        </div>
        <Button className="bg-[#00B42A] hover:bg-[#00B42A]/90" onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增关键词
        </Button>
      </div>

      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">关键词</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">触发次数</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw) => (
              <tr key={kw.id} className="border-b border-gray-50 hover:bg-[#F0FFF4] transition-colors">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{kw.keyword}</td>
                <td className="px-5 py-4">
                  <Badge variant="secondary" className="text-xs">{kw.category}</Badge>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{kw.triggerCount} 次</td>
                <td className="px-5 py-4">
                  <Badge variant={kw.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {kw.status === 'active' ? '启用' : '停用'}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-[#F53F3F] hover:text-[#F53F3F]"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>新增意向关键词</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>关键词</Label>
              <Input placeholder="请输入关键词" />
            </div>
            <div className="space-y-2">
              <Label>分类</Label>
              <Input placeholder="如: 价格类、商务类、行业类" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            <Button className="bg-[#00B42A] hover:bg-[#00B42A]/90" onClick={() => setShowAddDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
