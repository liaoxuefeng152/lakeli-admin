'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Download, Play, X, Calendar, Clock, Phone, Loader2 } from 'lucide-react';
import { fetchOutboundRecords, type OutboundCallRecord, type OutboundTask } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  '已接通': 'bg-green-50 text-green-600',
  '未接通': 'bg-orange-50 text-orange-600',
  '空号': 'bg-gray-100 text-gray-500',
  '停机': 'bg-gray-100 text-gray-500',
  '拒接': 'bg-red-50 text-red-500',
  '正在拨打': 'bg-blue-50 text-blue-600',
};

const intentColors: Record<string, string> = {
  'S-高意向': 'text-blue-600 bg-blue-50',
  'A-观望': 'text-orange-600 bg-orange-50',
  'B-无意向': 'text-gray-600 bg-gray-100',
  'C-无效号码': 'text-gray-400 bg-gray-50',
  'D-拒接': 'text-red-500 bg-red-50',
};

const formatDuration = (seconds: number) => {
  if (seconds === 0) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function CallRecordsPage() {
  const [records, setRecords] = useState<OutboundCallRecord[]>([]);
  const [tasks, setTasks] = useState<OutboundTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTask, setFilterTask] = useState('');
  const [filterIntent, setFilterIntent] = useState('');
  const [filterConnected, setFilterConnected] = useState('');
  const [viewRecord, setViewRecord] = useState<OutboundCallRecord | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [r, t] = await Promise.all([
          fetchOutboundRecords('call-records'),
          fetchOutboundRecords('tasks'),
        ]);
        setRecords(r as OutboundCallRecord[]);
        setTasks(t as OutboundTask[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = records.filter(r => {
    if (search && !r.phone.includes(search) && !r.customerName.includes(search)) return false;
    if (filterTask && r.taskName !== filterTask) return false;
    if (filterIntent && r.intentTag !== filterIntent) return false;
    if (filterConnected === '已接通' && r.status !== '已接通') return false;
    if (filterConnected === '未接通' && r.status === '已接通') return false;
    return true;
  });

  const handleExport = () => {
    exportToCsv(
      '通话记录.csv',
      ['手机号', '客户姓名', '所属任务', '拨打时间', '通话时长(秒)', '接通状态', '意向标签'],
      filtered.map((r) => [
        r.phone,
        r.customerName,
        r.taskName,
        r.callTime,
        r.duration,
        r.status,
        r.intentTag,
      ])
    );
  };

  const playRecording = (url?: string) => {
    if (!url) {
      toast('暂无录音', { description: '该通话暂未生成录音文件' });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const downloadRecording = (url?: string) => {
    if (!url) {
      toast('暂无可下载的录音', { description: '录音文件待后端接口提供' });
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#333]">通话记录与复盘</h1>
        <p className="mt-1 text-sm text-[#999]">全量通话数据复盘、质检、回访，支持录音播放和对话转写查看</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
          <input type="text" placeholder="搜索手机号/客户姓名" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        <select value={filterTask} onChange={(e) => setFilterTask(e.target.value)} className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none">
          <option value="">全部任务</option>
          {tasks.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
        </select>
        <select value={filterIntent} onChange={(e) => setFilterIntent(e.target.value)} className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none">
          <option value="">全部意向</option>
          <option value="S-高意向">S-高意向</option>
          <option value="A-观望">A-观望</option>
          <option value="B-无意向">B-无意向</option>
          <option value="C-无效号码">C-无效号码</option>
          <option value="D-拒接">D-拒接</option>
        </select>
        <select value={filterConnected} onChange={(e) => setFilterConnected(e.target.value)} className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none">
          <option value="">是否接通</option>
          <option value="已接通">已接通</option>
          <option value="未接通">未接通</option>
        </select>
        <button onClick={() => { setSearch(''); setFilterTask(''); setFilterIntent(''); setFilterConnected(''); }} className="rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666] hover:bg-gray-50">重置</button>
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-[#4096FF]">查询</button>
      </div>

      {/* Actions */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={handleExport} className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-[#666] hover:bg-gray-50">
          <Download className="h-3.5 w-3.5" /> 导出通话记录
        </button>
        <span className="text-xs text-[#999]">共 {filtered.length} 条记录</span>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-[#999]">
              <th className="px-4 py-3 text-left font-medium">手机号</th>
              <th className="px-4 py-3 text-left font-medium">客户姓名</th>
              <th className="px-4 py-3 text-left font-medium">所属任务</th>
              <th className="px-4 py-3 text-left font-medium">拨打时间</th>
              <th className="px-4 py-3 text-center font-medium">通话时长</th>
              <th className="px-4 py-3 text-center font-medium">接通状态</th>
              <th className="px-4 py-3 text-center font-medium">意向标签</th>
              <th className="px-4 py-3 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="py-16 text-center text-sm text-[#999]"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />加载中...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={8} className="py-16 text-center text-sm text-[#999]">暂无外呼通话数据</td></tr>
            )}
            {!loading && filtered.map((record) => (
              <tr key={record.id} className="border-b border-gray-50 text-sm hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#333]">{record.phone}</td>
                <td className="px-4 py-3 text-[#666]">{record.customerName}</td>
                <td className="px-4 py-3 text-[#666]">{record.taskName}</td>
                <td className="px-4 py-3 text-[#999]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {record.callTime}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3 text-[#999]" />
                    <span className="text-[#666]">{formatDuration(record.duration)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded px-2 py-0.5 text-xs ${statusColors[record.status]}`}>{record.status}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded px-2 py-0.5 text-xs ${intentColors[record.intentTag] || 'bg-gray-50 text-gray-400'}`}>{record.intentTag}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewRecord(record)} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Eye className="h-3 w-3" /> 查看对话
                    </button>
                    {record.duration > 0 && (
                      <button
                        onClick={() => playRecording(record.recordingUrl)}
                        className="flex items-center gap-1 text-xs text-[#666] hover:underline"
                      >
                        <Play className="h-3 w-3" /> 播放录音
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Call Detail Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewRecord(null)}>
          <div className="w-[800px] max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#333]">通话详情</h2>
              <button onClick={() => setViewRecord(null)} className="text-[#999] hover:text-[#333]"><X className="h-5 w-5" /></button>
            </div>

            {/* Info Bar */}
            <div className="mb-4 flex items-center gap-6 rounded-lg bg-gray-50 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#999]" />
                <span className="text-[#666]">{viewRecord.phone}</span>
                <span className="text-[#333]">{viewRecord.customerName}</span>
              </div>
              <div className="text-[#999]">
                <span className="mr-1">所属任务:</span>{viewRecord.taskName}
              </div>
              <div className="text-[#999]">
                <span className="mr-1">拨打时间:</span>{viewRecord.callTime}
              </div>
              <div className="text-[#999]">
                <span className="mr-1">时长:</span>{formatDuration(viewRecord.duration)}
              </div>
            </div>

            {/* Audio Player Placeholder */}
            {viewRecord.duration > 0 && (
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                <Play className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <div className="h-1.5 rounded-full bg-blue-200">
                    <div className="h-1.5 w-1/3 rounded-full bg-primary" />
                  </div>
                </div>
                <span className="text-xs text-[#666]">{formatDuration(viewRecord.duration)}</span>
                <button
                  onClick={() => downloadRecording(viewRecord.recordingUrl)}
                  className="text-xs text-primary hover:underline"
                >下载录音</button>
              </div>
            )}

            {/* Transcript */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#333]">对话转写文本</h3>
              {viewRecord.transcript.length > 0 ? (
                viewRecord.transcript.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'customer' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] rounded-lg px-4 py-2.5 text-sm ${
                      msg.role === 'customer'
                        ? 'bg-gray-100 text-[#333]'
                        : 'bg-primary text-white'
                    }`}>
                      <div className={`mb-1 text-xs ${msg.role === 'customer' ? 'text-[#999]' : 'text-white/70'}`}>
                        {msg.role === 'customer' ? '客户' : 'AI机器人'}
                      </div>
                      {msg.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-[#999]">未接通，无对话记录</div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setViewRecord(null)} className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-[#4096FF]">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
