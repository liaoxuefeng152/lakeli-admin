'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserPlus, Search, Shield, Zap, MessageSquare, Clock, Trash2, Edit3 } from 'lucide-react';
import { fetchUsers, createUser, updateUser, deleteUser, UserItem } from '@/lib/services/admin-api';

const roleBadge: Record<string, string> = {
  admin: 'bg-red-100 text-red-700', user: 'bg-blue-100 text-blue-700', editor: 'bg-green-100 text-green-700',
};

export default function AccountsPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'user' });

  const load = (p = page, s = search) => {
    setLoading(true);
    fetchUsers({ page: p, pageSize: 20, search: s })
      .then(r => { setUsers(r.data); setTotal(r.total); })
      .catch(e => toast.error('加载失败: ' + e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => { setPage(1); load(1, search); };

  const handleCreate = async () => {
    try {
      await createUser(form);
      toast.success('用户创建成功');
      setShowCreate(false);
      setForm({ email: '', password: '', name: '', role: 'user' });
      load();
    } catch (e) { toast.error('创建失败: ' + (e as Error).message); }
  };

  const handleEdit = async () => {
    if (!editUser) return;
    try {
      await updateUser(editUser.id, { name: form.name, role: form.role });
      toast.success('更新成功');
      setShowEdit(false);
      load();
    } catch (e) { toast.error('更新失败: ' + (e as Error).message); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定删除用户「${name}」？此操作不可恢复。`)) return;
    try { await deleteUser(id); toast.success('已删除'); load(); }
    catch (e) { toast.error('删除失败: ' + (e as Error).message); }
  };

  const openEdit = (u: UserItem) => {
    setEditUser(u);
    setForm({ email: u.email, password: '', name: u.name || '', role: u.role });
    setShowEdit(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="text-sm text-gray-500 mt-1">共 {total} 位用户</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="搜索用户名/邮箱..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSearch()} className="pl-9 w-60" />
          </div>
          <Button onClick={() => { setForm({ email: '', password: '', name: '', role: 'user' }); setShowCreate(true); }} className="bg-primary">
            <UserPlus className="mr-2 h-4 w-4" />新增用户
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                <th className="py-3 px-4">用户</th>
                <th className="py-3 px-4">角色</th>
                <th className="py-3 px-4 text-right">Token消耗</th>
                <th className="py-3 px-4 text-right">会话数</th>
                <th className="py-3 px-4">注册时间</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="p-8 text-center text-gray-400">加载中...</td></tr>}
              {!loading && users.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">暂无用户</td></tr>}
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{u.name || '未命名'}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={roleBadge[u.role] || roleBadge.user}>{u.role}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-sm">
                    <span className="flex items-center justify-end gap-1"><Zap className="h-3 w-3 text-yellow-500"/>{(u.total_tokens||0).toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm">
                    <span className="flex items-center justify-end gap-1"><MessageSquare className="h-3 w-3 text-blue-500"/>{u.session_count||0}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{new Date(u.created_at).toLocaleDateString('zh-CN')}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(u)}><Edit3 className="h-3.5 w-3.5"/></Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(u.id, u.name)}><Trash2 className="h-3.5 w-3.5"/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 创建弹窗 */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>新增用户</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><label className="text-sm font-medium">邮箱</label><Input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="user@example.com"/></div>
            <div><label className="text-sm font-medium">密码</label><Input type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="至少6位"/></div>
            <div><label className="text-sm font-medium">名称</label><Input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="用户名称"/></div>
            <div><label className="text-sm font-medium">角色</label>
              <Select value={form.role} onValueChange={v=>setForm(p=>({...p,role:v}))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent><SelectItem value="user">普通用户</SelectItem><SelectItem value="admin">管理员</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={()=>setShowCreate(false)}>取消</Button><Button onClick={handleCreate} disabled={!form.email||!form.password}>创建</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader><DialogTitle>编辑用户</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><label className="text-sm font-medium">邮箱</label><Input value={form.email} disabled className="bg-gray-50"/></div>
            <div><label className="text-sm font-medium">名称</label><Input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
            <div><label className="text-sm font-medium">角色</label>
              <Select value={form.role} onValueChange={v=>setForm(p=>({...p,role:v}))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent><SelectItem value="user">普通用户</SelectItem><SelectItem value="admin">管理员</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={()=>setShowEdit(false)}>取消</Button><Button onClick={handleEdit}>保存</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
