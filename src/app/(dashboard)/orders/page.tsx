'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Trash2, Plus, Download } from 'lucide-react';
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
import {
  fetchBills,
  createBill,
  deleteBill,
  fetchSubscriptions,
  createSubscription,
  deleteSubscription,
  fetchUsers,
  type BillRecord,
  type SubscriptionRecord,
  type UserItem,
} from '@/lib/services/admin-api';

const BILL_STATUS: Record<string, { label: string; className: string }> = {
  paid: { label: '已支付', className: 'bg-green-50 text-green-600' },
  pending: { label: '待支付', className: 'bg-orange-50 text-orange-600' },
  refunded: { label: '已退款', className: 'bg-gray-100 text-gray-500' },
  expired: { label: '已过期', className: 'bg-red-50 text-red-500' },
};

const SUBSCRIPTION_STATUS: Record<string, { label: string; className: string }> = {
  active: { label: '生效中', className: 'bg-green-50 text-green-600' },
  trial: { label: '试用', className: 'bg-blue-50 text-blue-600' },
  canceled: { label: '已取消', className: 'bg-gray-100 text-gray-500' },
};

function formatMoney(amount: string | number, currency = 'CNY') {
  const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : '';
  return `${symbol}${Number(amount).toLocaleString()}`;
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('zh-CN', { hour12: false });
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'bills' | 'subscriptions'>('bills');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bills, setBills] = useState<BillRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);

  const [viewTarget, setViewTarget] = useState<BillRecord | SubscriptionRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: 'bill' | 'subscription'; id: string } | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    user_id: '',
    plan: '',
    amount: '',
    currency: 'CNY',
    status: 'paid',
    start: '',
    end: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'bills') {
        const res = await fetchBills({
          search: search || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter,
          pageSize: 200,
        });
        setBills(res.data);
      } else {
        const res = await fetchSubscriptions({
          search: search || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter,
          pageSize: 200,
        });
        setSubscriptions(res.data);
      }
    } catch (e) {
      console.error('[Orders] load failed', e);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(loadData, 300);
    return () => clearTimeout(t);
  }, [loadData]);

  useEffect(() => {
    fetchUsers({ pageSize: 200 })
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.kind === 'bill') await deleteBill(deleteTarget.id);
      else await deleteSubscription(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (e) {
      console.error('[Orders] delete failed', e);
    }
  };

  const openCreate = () => {
    setForm({ user_id: users[0]?.id || '', plan: '', amount: '', currency: 'CNY', status: 'paid', start: '', end: '' });
    setShowCreate(true);
  };

  const handleCreate = async () => {
    try {
      if (activeTab === 'bills') {
        await createBill({
          user_id: form.user_id,
          plan: form.plan,
          amount: Number(form.amount) || 0,
          currency: form.currency,
          status: form.status,
          paid_at: form.start ? new Date(form.start).toISOString() : new Date().toISOString(),
        });
      } else {
        await createSubscription({
          user_id: form.user_id,
          plan: form.plan,
          status: form.status,
          started_at: form.start ? new Date(form.start).toISOString() : new Date().toISOString(),
          expires_at: form.end ? new Date(form.end).toISOString() : null,
        });
      }
      setShowCreate(false);
      loadData();
    } catch (e) {
      console.error('[Orders] create failed', e);
    }
  };

  const exportCsv = () => {
    const rows =
      activeTab === 'bills'
        ? bills.map((b) => [b.id, b.username || b.email || '', b.plan, formatMoney(b.amount, b.currency), b.status, b.paid_at || ''])
        : subscriptions.map((s) => [s.id, s.username || s.email || '', s.plan, s.status, s.started_at, s.expires_at || '']);
    const header = activeTab === 'bills' ? ['订单号', '客户', '套餐', '金额', '状态', '支付时间'] : ['订阅ID', '客户', '套餐', '状态', '开始时间', '到期时间'];
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'bills' ? '订单记录.csv' : '订阅管理.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusOptions = activeTab === 'bills' ? BILL_STATUS : SUBSCRIPTION_STATUS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">订单计费中心</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" />
            导出对账
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === 'bills' ? '新增订单' : '新增订阅'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'bills' | 'subscriptions')}>
        <TabsList>
          <TabsTrigger value="bills">订单记录</TabsTrigger>
          <TabsTrigger value="subscriptions">订阅管理</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap mt-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={activeTab === 'bills' ? '客户/套餐搜索' : '客户/套餐搜索'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {Object.entries(statusOptions).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => loadData()}>查询</Button>
          <Button variant="outline" onClick={resetFilters}>重置</Button>
        </div>

        <TabsContent value="bills" className="mt-4">
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">套餐</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">支付时间</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500 font-mono">{b.id.slice(0, 8)}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{b.username || b.email || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{b.plan}</td>
                    <td className="px-5 py-4 text-sm font-medium text-primary">{formatMoney(b.amount, b.currency)}</td>
                    <td className="px-5 py-4">
                      <Badge className={`${BILL_STATUS[b.status]?.className || 'bg-gray-100 text-gray-500'} border-0`}>
                        {BILL_STATUS[b.status]?.label || b.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(b.paid_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewTarget(b)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteTarget({ kind: 'bill', id: b.id })}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && bills.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">暂无订单记录</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-4">
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">订阅ID</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">套餐</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">开始时间</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">到期时间</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-500 font-mono">{s.id.slice(0, 8)}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{s.username || s.email || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{s.plan}</td>
                    <td className="px-5 py-4">
                      <Badge className={`${SUBSCRIPTION_STATUS[s.status]?.className || 'bg-gray-100 text-gray-500'} border-0`}>
                        {SUBSCRIPTION_STATUS[s.status]?.label || s.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(s.started_at)}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(s.expires_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewTarget(s)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteTarget({ kind: 'subscription', id: s.id })}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && subscriptions.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">暂无订阅记录</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* 详情对话框 */}
      <Dialog open={!!viewTarget} onOpenChange={(o) => !o && setViewTarget(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>记录详情</DialogTitle>
          </DialogHeader>
          {viewTarget && (
            <div className="grid grid-cols-2 gap-4">
              <Detail label="记录ID" value={viewTarget.id} />
              <Detail label="客户" value={viewTarget.username || viewTarget.email || '—'} />
              <Detail label="套餐" value={viewTarget.plan} />
              <Detail label="状态" value={viewTarget.status} />
              {'amount' in viewTarget && <Detail label="金额" value={formatMoney(viewTarget.amount, viewTarget.currency)} />}
              {'paid_at' in viewTarget && <Detail label="支付时间" value={formatDate(viewTarget.paid_at)} />}
              {'started_at' in viewTarget && <Detail label="开始时间" value={formatDate(viewTarget.started_at)} />}
              {'expires_at' in viewTarget && <Detail label="到期时间" value={formatDate(viewTarget.expires_at)} />}
              {'metadata' in viewTarget && viewTarget.metadata && (
                <div className="col-span-2 space-y-1">
                  <span className="text-xs text-gray-500">扩展信息</span>
                  <pre className="text-xs bg-gray-50 rounded p-3 overflow-x-auto">{JSON.stringify(viewTarget.metadata, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTarget(null)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">确定要删除该{deleteTarget?.kind === 'bill' ? '订单' : '订阅'}记录吗？此操作不可撤销。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>取消</Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增对话框 */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{activeTab === 'bills' ? '新增订单' : '新增订阅'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">客户</label>
              <Select value={form.user_id} onValueChange={(v) => setForm((f) => ({ ...f, user_id: v }))}>
                <SelectTrigger><SelectValue placeholder="选择客户" /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name || u.email}{u.email ? ` (${u.email})` : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">套餐名称</label>
              <Input value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))} placeholder="如：GEO专业版" />
            </div>
            {activeTab === 'bills' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">金额</label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">币种</label>
                  <Select value={form.currency} onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNY">CNY</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}
            <div className="space-y-1">
              <label className="text-sm font-medium">状态</label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(statusOptions).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">{activeTab === 'bills' ? '支付时间' : '开始时间'}</label>
                <Input type="datetime-local" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">到期时间</label>
                <Input type="datetime-local" value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>取消</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleCreate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-gray-500">{label}</span>
      <p className="text-sm font-medium break-all">{value}</p>
    </div>
  );
}
