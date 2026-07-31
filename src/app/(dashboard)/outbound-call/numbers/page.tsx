'use client';

import { useState, useEffect } from 'react';
import {
  Search, Plus, Upload, Trash2, Ban, RefreshCw, Download, Loader2,
} from 'lucide-react';
import { fetchOutboundRecords, type OutboundPhoneNumber } from '@/lib/services/admin-api';

const statusColors: Record<string, string> = {
  '未拨打': 'bg-gray-100 text-gray-600',
  '已拨打': 'bg-blue-50 text-blue-600',
  '已接通': 'bg-green-50 text-green-600',
  '有意向': 'bg-orange-50 text-orange-600',
  '无意向': 'bg-gray-50 text-gray-500',
};

export default function NumbersPage() {
  const [numbers, setNumbers] = useState<OutboundPhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const n = await fetchOutboundRecords('phone-numbers');
        setNumbers(n as OutboundPhoneNumber[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = numbers.filter(n => {
    if (search && !n.customerName.includes(search) && !n.phone.includes(search)) return false;
    if (filterStatus && n.callStatus !== filterStatus) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map(n => n.id));
    }
  };

  const handleBatchDelete = () => {
    setNumbers(prev => prev.filter(n => !selected.includes(n.id)));
    setSelected([]);
  };

  const handleBatchBlacklist = () => {
    setSelected([]);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#333]">客户号码管理</h1>
        <p className="mt-1 text-sm text-[#999]">管理所有待外呼客户号码资源，支持导入、筛选和批量操作</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
          <input type="text" placeholder="搜索手机号/客户姓名" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none">
          <option value="">全部状态</option>
          <option value="未拨打">未拨打</option>
          <option value="已拨打">已拨打</option>
          <option value="已接通">已接通</option>
          <option value="有意向">有意向</option>
          <option value="无意向">无意向</option>
        </select>
        <button onClick={() => { setSearch(''); setFilterStatus(''); }} className="rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666] hover:bg-gray-50">重置</button>
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-[#4096FF]">查询</button>
      </div>

      {/* Actions */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-[#4096FF]">
            <Upload className="h-4 w-4" /> 导入号码
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-[#666] hover:bg-gray-50">
            <Plus className="h-3.5 w-3.5" /> 新增单个
          </button>
          <button onClick={handleBatchDelete} disabled={selected.length === 0} className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm ${selected.length > 0 ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}>
            <Trash2 className="h-3.5 w-3.5" /> 批量删除
          </button>
          <button onClick={handleBatchBlacklist} disabled={selected.length === 0} className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm ${selected.length > 0 ? 'border-orange-200 text-orange-500 hover:bg-orange-50' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}>
            <Ban className="h-3.5 w-3.5" /> 加入黑名单
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-[#666] hover:bg-gray-50">
            <RefreshCw className="h-3.5 w-3.5" /> 刷新
          </button>
        </div>
        <span className="text-xs text-[#999]">共 {filtered.length} 条号码</span>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-[#999]">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
              </th>
              <th className="px-4 py-3 text-left font-medium">手机号</th>
              <th className="px-4 py-3 text-left font-medium">客户姓名</th>
              <th className="px-4 py-3 text-left font-medium">备注</th>
              <th className="px-4 py-3 text-left font-medium">来源渠道</th>
              <th className="px-4 py-3 text-center font-medium">外呼状态</th>
              <th className="px-4 py-3 text-center font-medium">意向标签</th>
              <th className="px-4 py-3 text-left font-medium">最近拨打</th>
              <th className="px-4 py-3 text-left font-medium">创建时间</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} className="py-16 text-center text-sm text-[#999]"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />加载中...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={9} className="py-16 text-center text-sm text-[#999]">暂无客户号码，点击「导入号码」开始</td></tr>
            )}
            {!loading && filtered.map((n) => (
              <tr key={n.id} className="border-b border-gray-50 text-sm hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(n.id)} onChange={() => toggleSelect(n.id)} className="rounded" />
                </td>
                <td className="px-4 py-3 font-medium text-[#333]">{n.phone}</td>
                <td className="px-4 py-3 text-[#666]">{n.customerName}</td>
                <td className="px-4 py-3 text-[#666]">{n.remark || '-'}</td>
                <td className="px-4 py-3 text-[#666]">{n.source}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded px-2 py-0.5 text-xs ${statusColors[n.callStatus]}`}>{n.callStatus}</span>
                </td>
                <td className="px-4 py-3 text-center text-xs text-[#666]">{n.intentTag || '-'}</td>
                <td className="px-4 py-3 text-[#999]">{n.lastCallTime || '-'}</td>
                <td className="px-4 py-3 text-[#999]">{n.createdAt.split(' ')[0]}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="py-16 text-center text-sm text-[#999]">暂无客户号码，点击「导入号码」开始</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
