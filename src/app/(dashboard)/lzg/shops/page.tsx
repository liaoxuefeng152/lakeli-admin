'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Store, Globe, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function LzgShopsPage() {
  const [shops, setShops] = useState<Array<Record<string,unknown>>>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = page, s = search) => {
    setLoading(true);
    try {
      const sp = new URLSearchParams({ page: String(p), pageSize: '20' });
      if (s) sp.set('search', s);
      const res = await fetch(`/api/admin/shops?${sp.toString()}`);
      const data = await res.json();
      setShops(data.data || []);
      setTotal(data.total || 0);
    } catch (e) {
      toast.error('加载店铺失败');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700', suspended: 'bg-yellow-100 text-yellow-700', closed: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">店铺管理</h1>
          <p className="text-sm text-gray-500 mt-1">已绑定电商平台店铺 · 共 {total} 家</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="搜索店铺名..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()} className="pl-9 w-64" />
        </div>
      </div>

      {loading && <p className="text-center py-8 text-gray-400">加载中...</p>}
      {!loading && shops.length===0 && <p className="text-center py-8 text-gray-400">暂无绑定店铺</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shops.map(s => (
          <Card key={String(s.id)} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">{String(s.name||'未命名店铺')}</h3>
                    <p className="text-xs text-gray-400">{String(s.marketplace||'')}</p>
                  </div>
                </div>
                <Badge className={statusColors[String(s.status)] || statusColors.active}>{String(s.status||'active')}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Globe className="h-3 w-3"/>{String(s.platform||'未知平台')}</span>
                <span className="ml-auto flex items-center gap-0.5 text-xs"><Clock className="h-2.5 w-2.5"/>{new Date(String(s.created_at||Date.now())).toLocaleDateString('zh-CN')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
