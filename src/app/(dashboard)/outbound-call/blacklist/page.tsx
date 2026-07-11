'use client';

import { useState } from 'react';
import { Plus, Upload, Trash2, AlertTriangle, X } from 'lucide-react';
import { blacklistItems } from '@/lib/mock-data';
import type { BlacklistItem } from '@/lib/mock-data';

export default function BlacklistPage() {
  const [items, setItems] = useState<BlacklistItem[]>(blacklistItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setShowRemoveConfirm(null);
  };

  const handleClearAll = () => {
    setItems([]);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#333]">黑名单管理</h1>
        <p className="mt-1 text-sm text-[#999]">防骚扰合规管控，所有外呼任务自动跳过黑名单号码</p>
      </div>

      {/* Warning Banner */}
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-600">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <span>黑名单号码在所有外呼任务中会被自动跳过，无需人工过滤。请谨慎管理。</span>
      </div>

      {/* Actions */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 rounded-md bg-[#1677FF] px-4 py-2 text-sm text-white hover:bg-[#4096FF]">
            <Plus className="h-4 w-4" /> 手动添加
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-[#666] hover:bg-gray-50">
            <Upload className="h-3.5 w-3.5" /> 批量导入
          </button>
          <button onClick={handleClearAll} disabled={items.length === 0} className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm ${items.length > 0 ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}>
            <Trash2 className="h-3.5 w-3.5" /> 清空黑名单
          </button>
        </div>
        <span className="text-xs text-[#999]">共 {items.length} 条黑名单</span>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-[#999]">
              <th className="px-4 py-3 text-left font-medium">手机号</th>
              <th className="px-4 py-3 text-left font-medium">拉黑原因</th>
              <th className="px-4 py-3 text-left font-medium">操作人</th>
              <th className="px-4 py-3 text-left font-medium">拉黑时间</th>
              <th className="px-4 py-3 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 text-sm hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#333]">{item.phone}</td>
                <td className="px-4 py-3 text-[#666]">{item.reason}</td>
                <td className="px-4 py-3 text-[#666]">{item.operator}</td>
                <td className="px-4 py-3 text-[#999]">{item.createdAt}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setShowRemoveConfirm(item.id)} className="text-xs text-[#1677FF] hover:underline">移出黑名单</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="py-16 text-center text-sm text-[#999]">黑名单为空</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="w-[450px] rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#333]">添加黑名单</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#999] hover:text-[#333]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[#333]">手机号 <span className="text-red-500">*</span></label>
                <input type="text" placeholder="请输入手机号" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#333]">拉黑原因 <span className="text-red-500">*</span></label>
                <textarea placeholder="请输入拉黑原因" rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666]">取消</button>
              <button onClick={() => setShowAddModal(false)} className="rounded-md bg-[#1677FF] px-4 py-2 text-sm text-white hover:bg-[#4096FF]">确认添加</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirm */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowRemoveConfirm(null)}>
          <div className="w-[400px] rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-base font-semibold text-[#333]">确认移出黑名单？</h3>
            <p className="mb-6 text-sm text-[#666]">移出后该号码将可以接收外呼任务拨打。</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRemoveConfirm(null)} className="rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666]">取消</button>
              <button onClick={() => handleRemove(showRemoveConfirm)} className="rounded-md bg-[#1677FF] px-4 py-2 text-sm text-white hover:bg-[#4096FF]">确认移出</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
