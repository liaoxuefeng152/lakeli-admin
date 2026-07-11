'use client';

import { useState } from 'react';
import { Search, Plus, Upload, Download, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { knowledgeItems } from '@/lib/mock-data';

const categories = [
  { key: 'all', label: '全部分类', count: 7 },
  { key: 'product', label: '产品知识库', count: 3 },
  { key: 'geo', label: 'GEO专业库', count: 2 },
  { key: 'industry', label: '行业场景库', count: 2 },
];

export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = knowledgeItems.filter((item) => {
    const matchCategory = activeCategory === 'all' ||
      (activeCategory === 'product' && item.category === '产品知识库') ||
      (activeCategory === 'geo' && item.category === 'GEO专业库') ||
      (activeCategory === 'industry' && item.category === '行业场景库');
    const matchSearch = !searchTerm ||
      item.title.includes(searchTerm) ||
      item.keywords.some((k) => k.includes(searchTerm));
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">统一知识库管理中心</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            批量导入
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            批量导出
          </Button>
          <Button className="bg-[#1677FF] hover:bg-[#1677FF]/90" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新增词条
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: Category Tree */}
        <div className="w-52 shrink-0">
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-3">
            <h3 className="text-xs font-medium text-gray-500 uppercase px-2 py-1.5 mb-1">知识库分类</h3>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-[#E6F4FF] text-[#1677FF] font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-xs text-gray-400">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: List */}
        <div className="flex-1 space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索标题/关键词..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">关键词</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">更新时间</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                    <td className="px-5 py-4">
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.keywords.map((k) => (
                          <span key={k} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{k}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {item.status === 'active' ? '上架' : '下架'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{item.updatedAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          {item.status === 'active' ? (
                            <ToggleRight className="h-4 w-4 text-[#00B42A]" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>新增知识词条</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>分类</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">产品知识库</SelectItem>
                  <SelectItem value="geo">GEO专业库</SelectItem>
                  <SelectItem value="industry">行业场景库</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>词条标题</Label>
              <Input placeholder="请输入标题" />
            </div>
            <div className="space-y-2">
              <Label>关键词(逗号分隔)</Label>
              <Input placeholder="如: GEO,SEO,优化" />
            </div>
            <div className="space-y-2">
              <Label>标准答案</Label>
              <Textarea placeholder="请输入标准答案内容..." rows={5} />
            </div>
            <div className="space-y-2">
              <Label>生效状态</Label>
              <Select defaultValue="active">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">上架</SelectItem>
                  <SelectItem value="inactive">下架</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            <Button className="bg-[#1677FF] hover:bg-[#1677FF]/90" onClick={() => setShowAddDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
