'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { scriptScenes } from '@/lib/mock-data';
import type { ScriptScene } from '@/lib/mock-data';

export default function ScriptsPage() {
  const [scenes, setScenes] = useState<ScriptScene[]>(scriptScenes);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingScene, setEditingScene] = useState<ScriptScene | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, status: s.status === '启用' ? '禁用' : '启用' } : s));
  };

  const handleDelete = (id: string) => {
    setScenes(prev => prev.filter(s => s.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleEdit = (scene: ScriptScene) => {
    setEditingScene(scene);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setEditingScene(null);
    setShowEditModal(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#333]">AI话术场景管理</h1>
        <p className="mt-1 text-sm text-[#999]">绑定阿里云外呼话术脚本，管理推销对话场景</p>
      </div>

      {/* Actions */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={handleCreate} className="flex items-center gap-1.5 rounded-md bg-[#1677FF] px-4 py-2 text-sm text-white hover:bg-[#4096FF]">
          <Plus className="h-4 w-4" /> 新增场景
        </button>
        <span className="text-xs text-[#999]">共 {scenes.length} 个场景</span>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-[#999]">
              <th className="px-4 py-3 text-left font-medium">场景名称</th>
              <th className="px-4 py-3 text-left font-medium">阿里云InstanceId</th>
              <th className="px-4 py-3 text-left font-medium">ScriptId</th>
              <th className="px-4 py-3 text-center font-medium">FAQ数量</th>
              <th className="px-4 py-3 text-center font-medium">状态</th>
              <th className="px-4 py-3 text-left font-medium">创建时间</th>
              <th className="px-4 py-3 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {scenes.map((scene) => (
              <tr key={scene.id} className="border-b border-gray-50 text-sm hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#333]">{scene.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#666]">{scene.instanceId}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#666]">{scene.scriptId}</td>
                <td className="px-4 py-3 text-center text-[#666]">{scene.faqCount}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded px-2 py-0.5 text-xs ${scene.status === '启用' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {scene.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#999]">{scene.createdAt.split(' ')[0]}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(scene)} className="flex items-center gap-1 text-xs text-[#1677FF] hover:underline">
                      <Edit2 className="h-3 w-3" /> 编辑
                    </button>
                    <button onClick={() => handleToggle(scene.id)} className="flex items-center gap-1 text-xs text-[#FF7D00] hover:underline">
                      {scene.status === '启用' ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                      {scene.status === '启用' ? '禁用' : '启用'}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-[#666] hover:underline">
                      <Eye className="h-3 w-3" /> 录音
                    </button>
                    <button onClick={() => setShowDeleteConfirm(scene.id)} className="flex items-center gap-1 text-xs text-red-500 hover:underline">
                      <Trash2 className="h-3 w-3" /> 删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowEditModal(false)}>
          <div className="w-[700px] max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#333]">{editingScene ? '编辑话术场景' : '新增话术场景'}</h2>
              <button onClick={() => setShowEditModal(false)} className="text-[#999] hover:text-[#333]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[#333]">场景名称 <span className="text-red-500">*</span></label>
                <input type="text" defaultValue={editingScene?.name} placeholder="请输入场景名称" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-[#333]">阿里云实例ID <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue={editingScene?.instanceId} placeholder="InstanceId" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[#333]">阿里云脚本ID <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue={editingScene?.scriptId} placeholder="ScriptId" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#333]">开场推销话术 <span className="text-red-500">*</span></label>
                <textarea defaultValue={editingScene?.openingScript} placeholder="请输入AI接通后的开场白" rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#333]">结束语</label>
                <textarea defaultValue={editingScene?.closingScript} placeholder="请输入结束语" rows={2} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-[#333]">常见问答配置</label>
                  <button className="text-xs text-[#1677FF] hover:underline">+ 添加问答</button>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="text" placeholder="关键词" className="w-1/3 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none" />
                    <input type="text" placeholder="回答内容" className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="关键词" className="w-1/3 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none" />
                    <input type="text" placeholder="回答内容" className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666]">取消</button>
              <button onClick={() => setShowEditModal(false)} className="rounded-md bg-[#1677FF] px-4 py-2 text-sm text-white hover:bg-[#4096FF]">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowDeleteConfirm(null)}>
          <div className="w-[400px] rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-base font-semibold text-[#333]">确认删除？</h3>
            <p className="mb-6 text-sm text-[#666]">删除后话术场景数据不可恢复，确认继续？</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666]">取消</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
