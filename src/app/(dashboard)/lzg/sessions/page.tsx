'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { fetchSessions, SessionItem } from '@/lib/services/admin-api';

export default function LzgSessionsPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = (p = page, s = search) => {
    setLoading(true);
    fetchSessions({ page: p, pageSize: 20, search: s })
      .then(r => { setSessions(r.data); setTotal(r.total); })
      .catch(e => toast.error('加载失败: ' + e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => { setPage(1); load(1, search); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI 会话监控</h1>
          <p className="text-sm text-gray-500 mt-1">共 {total} 个会话</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="搜索标题/用户..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} className="pl-9 w-64" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                <th className="py-3 px-4">会话标题</th>
                <th className="py-3 px-4">用户</th>
                <th className="py-3 px-4 text-right">消息数</th>
                <th className="py-3 px-4 text-right">估算Token</th>
                <th className="py-3 px-4">更新时间</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="p-8 text-center text-gray-400">加载中...</td></tr>}
              {!loading && sessions.length===0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">暂无会话</td></tr>}
              {sessions.map(s => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{s.title || '新对话'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3 text-gray-400" />
                      {s.user_name || s.user_email || '未知'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="secondary">{s.message_count}条</Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-sm">
                    {(s.estimated_tokens||0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{new Date(s.updated_at||s.created_at).toLocaleString('zh-CN')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {total > 20 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page<=1} onClick={()=>{const np=page-1;setPage(np);load(np);}}>上一页</Button>
          <span className="flex items-center px-2 text-sm text-gray-500">第 {page} 页</span>
          <Button variant="outline" disabled={page*20>=total} onClick={()=>{const np=page+1;setPage(np);load(np);}}>下一页</Button>
        </div>
      )}
    </div>
  );
}
