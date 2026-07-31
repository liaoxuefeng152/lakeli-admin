'use client';

import { useState, useEffect } from 'react';
import {
  Search, Plus, RefreshCw, Download, Play, Pause, Square, Eye,
  Edit2, Trash2, FileDown, Calendar, X, Loader2,
} from 'lucide-react';
import { fetchOutboundRecords, type OutboundTask, type OutboundScriptScene } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';

const statusColors: Record<string, string> = {
  '待执行': 'bg-gray-100 text-gray-600',
  '执行中': 'bg-blue-50 text-blue-600',
  '已暂停': 'bg-yellow-50 text-yellow-600',
  '已完成': 'bg-gray-800 text-white',
  '已终止': 'bg-gray-300 text-gray-600',
  '异常失败': 'bg-red-50 text-red-600',
};

export default function OutboundTasksPage() {
  const [tasks, setTasks] = useState<OutboundTask[]>([]);
  const [scriptScenes, setScriptScenes] = useState<OutboundScriptScene[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterScript, setFilterScript] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [t, s] = await Promise.all([
          fetchOutboundRecords('tasks'),
          fetchOutboundRecords('script-scenes'),
        ]);
        setTasks(t as OutboundTask[]);
        setScriptScenes(s as OutboundScriptScene[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = tasks.filter(t => {
    if (searchName && !t.name.includes(searchName)) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterScript && t.scriptSceneName !== filterScript) return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: OutboundTask['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const buildTaskRows = (list: OutboundTask[]) =>
    list.map((t) => [
      t.id,
      t.name,
      t.scriptSceneName,
      t.totalNumbers,
      t.calledCount,
      t.connectedCount,
      t.leadCount,
      t.status,
      t.createdAt,
    ]);

  const handleBatchExport = () => {
    exportToCsv(
      '外呼任务.csv',
      ['任务ID', '任务名称', '话术场景', '总号码', '已拨打', '接通', '意向', '状态', '创建时间'],
      buildTaskRows(filtered)
    );
  };

  const handleExportTask = (task: OutboundTask) => {
    exportToCsv(
      `外呼任务_${task.id}.csv`,
      ['任务ID', '任务名称', '话术场景', '总号码', '已拨打', '接通', '意向', '状态', '创建时间'],
      buildTaskRows([task])
    );
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setShowDeleteConfirm(null);
  };

  const renderActions = (task: OutboundTask) => {
    const actions: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }[] = [];
    switch (task.status) {
      case '待执行':
        actions.push(
          { icon: <Play className="h-3 w-3" />, label: '启动', onClick: () => handleStatusChange(task.id, '执行中') },
          { icon: <Edit2 className="h-3 w-3" />, label: '编辑', onClick: () => {} },
          { icon: <Trash2 className="h-3 w-3" />, label: '删除', onClick: () => setShowDeleteConfirm(task.id), danger: true },
        );
        break;
      case '执行中':
        actions.push(
          { icon: <Pause className="h-3 w-3" />, label: '暂停', onClick: () => handleStatusChange(task.id, '已暂停') },
          { icon: <Square className="h-3 w-3" />, label: '终止', onClick: () => handleStatusChange(task.id, '已终止') },
          { icon: <Eye className="h-3 w-3" />, label: '详情', onClick: () => {} },
        );
        break;
      case '已暂停':
        actions.push(
          { icon: <Play className="h-3 w-3" />, label: '启动', onClick: () => handleStatusChange(task.id, '执行中') },
          { icon: <Square className="h-3 w-3" />, label: '终止', onClick: () => handleStatusChange(task.id, '已终止') },
        );
        break;
      default:
        actions.push(
          { icon: <Eye className="h-3 w-3" />, label: '详情', onClick: () => {} },
          { icon: <FileDown className="h-3 w-3" />, label: '导出', onClick: () => handleExportTask(task) },
        );
    }
    return actions;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#333]">外呼任务管理</h1>
        <p className="mt-1 text-sm text-[#999]">管理所有智能外呼任务，支持启停、监控和复盘</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
          <input
            type="text"
            placeholder="搜索任务名称"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none">
          <option value="">全部状态</option>
          <option value="待执行">待执行</option>
          <option value="执行中">执行中</option>
          <option value="已暂停">已暂停</option>
          <option value="已完成">已完成</option>
          <option value="已终止">已终止</option>
          <option value="异常失败">异常失败</option>
        </select>
        <select value={filterScript} onChange={(e) => setFilterScript(e.target.value)} className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none">
          <option value="">全部话术场景</option>
          {scriptScenes.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        <button onClick={() => { setSearchName(''); setFilterStatus(''); setFilterScript(''); }} className="rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666] hover:bg-gray-50">重置</button>
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-[#4096FF]">查询</button>
      </div>

      {/* Actions */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-[#4096FF]">
            <Plus className="h-4 w-4" /> 创建任务
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-[#666] hover:bg-gray-50">
            <RefreshCw className="h-3.5 w-3.5" /> 刷新
          </button>
          <button onClick={handleBatchExport} className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-[#666] hover:bg-gray-50">
            <Download className="h-3.5 w-3.5" /> 批量导出
          </button>
        </div>
        <span className="text-xs text-[#999]">共 {filtered.length} 条任务</span>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-[#999]">
              <th className="px-4 py-3 text-left font-medium">任务ID</th>
              <th className="px-4 py-3 text-left font-medium">任务名称</th>
              <th className="px-4 py-3 text-left font-medium">话术场景</th>
              <th className="px-4 py-3 text-center font-medium">总号码</th>
              <th className="px-4 py-3 text-center font-medium">已拨打</th>
              <th className="px-4 py-3 text-center font-medium">接通</th>
              <th className="px-4 py-3 text-center font-medium">意向</th>
              <th className="px-4 py-3 text-center font-medium">状态</th>
              <th className="px-4 py-3 text-left font-medium">创建时间</th>
              <th className="px-4 py-3 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={10} className="py-16 text-center text-sm text-[#999]"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />加载中...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={10} className="py-16 text-center text-sm text-[#999]">暂无外呼任务，点击「创建任务」开始</td></tr>
            )}
            {!loading && filtered.map((task) => (
              <tr key={task.id} className="border-b border-gray-50 text-sm hover:bg-gray-50">
                <td className="px-4 py-3 text-[#999]">{task.id}</td>
                <td className="px-4 py-3 font-medium text-[#333]">{task.name}</td>
                <td className="px-4 py-3 text-[#666]">{task.scriptSceneName}</td>
                <td className="px-4 py-3 text-center text-[#666]">{task.totalNumbers}</td>
                <td className="px-4 py-3 text-center text-[#666]">{task.calledCount}</td>
                <td className="px-4 py-3 text-center text-[#666]">{task.connectedCount}</td>
                <td className="px-4 py-3 text-center font-medium text-[#FF7D00]">{task.leadCount}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs ${statusColors[task.status]}`}>
                    {task.status === '执行中' && <Play className="h-3 w-3" />}
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#999]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {task.createdAt.split(' ')[0]}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {renderActions(task).map((action, i) => (
                      <button
                        key={i}
                        onClick={action.onClick}
                        className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                          action.danger ? 'text-red-500 hover:bg-red-50' : 'text-primary hover:bg-blue-50'
                        }`}
                      >
                        {action.icon} {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="py-16 text-center text-sm text-[#999]">暂无外呼任务，点击「创建任务」开始</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateModal(false)}>
          <div className="w-[700px] rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#333]">创建外呼任务</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[#999] hover:text-[#333]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[#333]">任务名称 <span className="text-red-500">*</span></label>
                <input type="text" placeholder="请输入任务名称" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#333]">选择AI话术场景 <span className="text-red-500">*</span></label>
                <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none">
                  <option value="">请选择话术场景</option>
                  {scriptScenes.filter(s => s.status === '启用').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#333]">外呼模式</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name="mode" defaultChecked /> 自动外呼</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name="mode" /> 预测外呼</label>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-[#333]">允许开始时间</label>
                  <input type="time" defaultValue="09:00" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[#333]">允许结束时间</label>
                  <input type="time" defaultValue="18:00" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[#333]">未接通重试次数</label>
                  <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none">
                    <option value="0">0次</option>
                    <option value="1">1次</option>
                    <option value="2">2次</option>
                    <option value="3" defaultChecked>3次</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#333]">单号码拨打间隔（秒）</label>
                <input type="number" defaultValue={60} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#333]">选择外呼号码</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name="numberSource" defaultChecked /> 选择已有号码分组</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name="numberSource" /> 现场Excel导入</label>
                </div>
                <div className="mt-2 rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-sm text-[#999]">
                  拖拽文件到此处或 <span className="cursor-pointer text-primary">点击上传</span>
                  <p className="mt-1 text-xs text-[#bbb]">支持 .xlsx / .csv 格式</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666] hover:bg-gray-50">返回列表</button>
              <button className="rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666] hover:bg-gray-50">保存草稿</button>
              <button onClick={() => setShowCreateModal(false)} className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-[#4096FF]">立即创建</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowDeleteConfirm(null)}>
          <div className="w-[400px] rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-base font-semibold text-[#333]">确认删除？</h3>
            <p className="mb-6 text-sm text-[#666]">删除后任务数据不可恢复，确认继续？</p>
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
