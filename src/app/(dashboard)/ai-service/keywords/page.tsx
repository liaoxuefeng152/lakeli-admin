'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
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
import { fetchAiServiceRecords, updateIntentKeyword, type AiIntentKeyword } from '@/lib/services/admin-api';

export default function AiKeywordsPage() {
  const [keywords, setKeywords] = useState<AiIntentKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAiServiceRecords('intent-keywords');
        setKeywords(data as AiIntentKeyword[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleStatus = async (kw: AiIntentKeyword) => {
    const next = kw.status === 'active' ? 'inactive' : 'active';
    setKeywords((prev) => prev.map((k) => (k.id === kw.id ? { ...k, status: next } : k)));
    try {
      await updateIntentKeyword(kw.id, next);
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失败');
      setKeywords((prev) => prev.map((k) => (k.id === kw.id ? { ...k, status: kw.status } : k)));
    }
  };

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

      {error && <div className="text-sm text-[#F53F3F]">{error}</div>}

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
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  <Loader2 className="inline h-4 w-4 animate-spin mr-2" />加载中...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[#F53F3F]">{error}</td>
              </tr>
            ) : keywords.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">暂无数据</td>
              </tr>
            ) : (
              keywords.map((kw) => (
                <tr key={kw.id} className="border-b border-gray-50 hover:bg-[#F0FFF4] transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{kw.keyword}</td>
                  <td className="px-5 py-4">
                    <Badge variant="secondary" className="text-xs">{kw.category}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{kw.triggerCount} 次</td>
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => toggleStatus(kw)}>
                      <Badge variant={kw.status === 'active' ? 'default' : 'secondary'} className="text-xs cursor-pointer">
                        {kw.status === 'active' ? '启用' : '停用'}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="text-[#F53F3F] hover:text-[#F53F3F]"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
