'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Clock } from 'lucide-react';
import { toast } from 'sonner';

// 产品直接在页面内查询，通过 API 代理到 lakeli-app-xc
export default function LzgProductsPage() {
  const [products, setProducts] = useState<Array<Record<string,unknown>>>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = page, s = search) => {
    setLoading(true);
    try {
      // fetch via internal API
      const sp = new URLSearchParams({ page: String(p), pageSize: '20' });
      if (s) sp.set('search', s);
      const res = await fetch(`/api/admin/products?${sp.toString()}`);
      const data = await res.json();
      setProducts(data.data || []);
      setTotal(data.total || 0);
    } catch (e) {
      toast.error('加载产品失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">商品选品记录</h1>
          <p className="text-sm text-gray-500 mt-1">通过1688等平台选品的商品记录 · 共 {total} 件</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="搜索商品名称..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()} className="pl-9 w-64" />
        </div>
      </div>

      {loading && <p className="text-center py-8 text-gray-400">加载中...</p>}
      {!loading && products.length===0 && <p className="text-center py-8 text-gray-400">暂无选品记录</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p,i) => (
          <Card key={String(p.id||i)} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{String(p.name||'未命名商品')}</h3>
                  {p.price != null && <div className="text-lg font-bold text-primary mt-1">¥{String(Number(p.price).toFixed(2))} <span className="text-xs text-gray-400 font-normal">{String(p.currency||'USD')}</span></div>}
                  <div className="flex items-center gap-2 mt-2">
                    {!!p.category && <Badge variant="secondary" className="text-xs">{String(p.category)}</Badge>}
                    {!!p.platform && <Badge variant="outline" className="text-xs">{String(p.platform)}</Badge>}
                    <span className="text-xs text-gray-400 ml-auto flex items-center gap-0.5"><Clock className="h-2.5 w-2.5"/>{new Date(String(p.created_at||Date.now())).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
