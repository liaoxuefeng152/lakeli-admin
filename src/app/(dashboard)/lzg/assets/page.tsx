'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Search, Image, FileText, Video, Download, Trash2, Clock } from 'lucide-react';
import { fetchAssets, deleteAssets, AssetItem } from '@/lib/services/admin-api';

const typeIcons: Record<string, React.ComponentType<{className?:string}>> = {
  image: Image, video: Video, file: FileText,
};

export default function LzgAssetsPage() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = (p = page, s = search, t = type) => {
    setLoading(true);
    fetchAssets({ page: p, pageSize: 24, search: s, type: t || undefined })
      .then(r => { setAssets(r.data); setTotal(r.total); })
      .catch(e => toast.error('加载失败: ' + e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => { setPage(1); load(1, search, type); };

  const handleDelete = async () => {
    if (selected.size===0) return;
    if (!confirm(`确定删除 ${selected.size} 个资产？`)) return;
    try { await deleteAssets(Array.from(selected)); toast.success('已删除'); setSelected(new Set()); load(); }
    catch (e) { toast.error('删除失败: '+(e as Error).message); }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">生成资产管理</h1>
          <p className="text-sm text-gray-500 mt-1">AI生成的图片、视频等素材 · 共 {total} 个</p>
        </div>
        <div className="flex gap-2">
          <Select value={type} onValueChange={v => { setType(v); load(1, search, v); }}>
            <SelectTrigger className="w-32"><SelectValue placeholder="全部类型"/></SelectTrigger>
            <SelectContent><SelectItem value="all">全部类型</SelectItem><SelectItem value="image">图片</SelectItem><SelectItem value="video">视频</SelectItem></SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
            <Input placeholder="搜索文件名..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} className="pl-9 w-48"/>
          </div>
          {selected.size > 0 && (
            <Button variant="destructive" onClick={handleDelete}><Trash2 className="mr-2 h-4 w-4"/>删除({selected.size})</Button>
          )}
        </div>
      </div>

      {loading && <p className="text-center py-8 text-gray-400">加载中...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {assets.map(a => {
          const Icon = typeIcons[a.type] || FileText;
          return (
            <Card key={a.id} className={`cursor-pointer hover:shadow-md transition-shadow ${selected.has(a.id)?'ring-2 ring-primary':''}`} onClick={()=>toggleSelect(a.id)}>
              <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-t-lg overflow-hidden">
                {a.type==='image' && a.url ? (
                  <img src={a.url} alt={a.filename} className="w-full h-full object-cover" onError={e=>(e.target as HTMLImageElement).style.display='none'}/>
                ) : (
                  <Icon className="h-10 w-10 text-gray-400"/>
                )}
              </div>
              <CardContent className="p-2">
                <p className="text-xs truncate">{a.filename}</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="secondary" className="text-[10px]">{a.type}</Badge>
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Clock className="h-2.5 w-2.5"/>{new Date(a.created_at).toLocaleDateString('zh-CN')}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
