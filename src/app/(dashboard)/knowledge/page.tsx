'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BookOpen, Search, Plus, Edit3, Trash2, Clock } from 'lucide-react';
import { fetchKnowledge, createKnowledge, updateKnowledge, deleteKnowledge, KnowledgeItem } from '@/lib/services/admin-api';

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<KnowledgeItem | null>(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', tags: '' });

  const load = (p = page, s = search) => {
    setLoading(true);
    fetchKnowledge({ page: p, pageSize: 20, search: s })
      .then(r => { setItems(r.data); setTotal(r.total); })
      .catch(e => toast.error('加载失败: ' + e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => { setPage(1); load(1, search); };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', category: 'general', tags: '' });
    setShowDialog(true);
  };

  const openEdit = (item: KnowledgeItem) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content, category: item.category || 'general', tags: (item.tags||[]).join(', ') });
    setShowDialog(true);
  };

  const handleSave = async () => {
    const data = { title: form.title, content: form.content, category: form.category, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
    try {
      if (editing) { await updateKnowledge(editing.id, data); toast.success('已更新'); }
      else { await createKnowledge(data); toast.success('已创建'); }
      setShowDialog(false);
      load();
    } catch (e) { toast.error('保存失败: ' + (e as Error).message); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定删除「${title}」？`)) return;
    try { await deleteKnowledge(id); toast.success('已删除'); load(); }
    catch (e) { toast.error('删除失败: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">知识空间</h1>
          <p className="text-sm text-gray-500 mt-1">龙掌柜 AI 助手 · 共 {total} 条知识</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="搜索标题/内容..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSearch()} className="pl-9 w-60" />
          </div>
          <Button onClick={openCreate} className="bg-primary"><Plus className="mr-2 h-4 w-4"/>新增知识</Button>
        </div>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-center text-gray-400 py-8">加载中...</p>}
        {!loading && items.length===0 && <p className="text-center text-gray-400 py-8">暂无知识条目</p>}
        {items.map(item => (
          <Card key={item.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {(item.tags||[]).map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                    <span className="text-xs text-gray-400 ml-auto flex items-center gap-1"><Clock className="h-3 w-3"/>{new Date(item.updated_at||item.created_at).toLocaleString('zh-CN')}</span>
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button variant="ghost" size="sm" onClick={()=>openEdit(item)}><Edit3 className="h-3.5 w-3.5"/></Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={()=>handleDelete(item.id,item.title)}><Trash2 className="h-3.5 w-3.5"/></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? '编辑知识' : '新增知识'}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><label className="text-sm font-medium">标题</label><Input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="知识标题"/></div>
            <div><label className="text-sm font-medium">分类</label>
              <Select value={form.category} onValueChange={v=>setForm(p=>({...p,category:v}))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent><SelectItem value="general">通用</SelectItem><SelectItem value="product">产品知识</SelectItem><SelectItem value="listing">Listing优化</SelectItem><SelectItem value="policy">平台政策</SelectItem></SelectContent>
              </Select>
            </div>
            <div><label className="text-sm font-medium">标签（逗号分隔）</label><Input value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))} placeholder="选品, 1688, 爆款"/></div>
            <div><label className="text-sm font-medium">内容</label><Textarea value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="知识内容..." rows={6}/></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={()=>setShowDialog(false)}>取消</Button><Button onClick={handleSave} disabled={!form.title||!form.content}>保存</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
