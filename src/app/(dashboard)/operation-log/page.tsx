'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ScrollText, Clock, User, ShieldAlert, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchActivityLogs, ActivityLog } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';

const actionColors: Record<string, string> = {
  'user.create': 'bg-green-100 text-green-700', 'user.update': 'bg-blue-100 text-blue-700',
  'user.delete': 'bg-red-100 text-red-700', 'config.update': 'bg-yellow-100 text-yellow-700',
  'agent.call': 'bg-purple-100 text-purple-700', 'login': 'bg-indigo-100 text-indigo-700',
  'knowledge.create': 'bg-teal-100 text-teal-700', 'knowledge.update': 'bg-teal-100 text-teal-700',
  'knowledge.delete': 'bg-red-100 text-red-700',
};

type Severity = 'high' | 'medium' | 'low';

interface AuditAlert {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  control: string; // 等保三级控制项映射
  log: ActivityLog;
}

const SEVERITY_TONE: Record<Severity, string> = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-blue-50 text-blue-700 border-blue-200',
};
const SEVERITY_SCORE: Record<Severity, number> = { high: 10, medium: 5, low: 2 };

const KEY_RE = /(api_key|apikey|secret|password|密钥|密码|token|access_key|ak|sk)/i;
const PERM_RE = /(role|角色|权限|disable|禁用|封禁|lock)/i;
const EXPORT_RE = /(导出|export|批量|下载全部|dump)/i;

// NF6-6：从操作日志派生安全告警（前端启发式，配合后端 /api/admin/activity-logs）
function buildAuditAlerts(logs: ActivityLog[]): AuditAlert[] {
  const alerts: AuditAlert[] = [];
  for (const log of logs) {
    const detail = log.detail || '';
    if (log.action === 'user.delete') {
      alerts.push({ id: 'a-' + log.id, severity: 'high', category: '账号生命周期', title: '账号被删除', control: 'NF6-5 账号变更审批留痕', log });
    } else if (log.action === 'config.update' && KEY_RE.test(detail)) {
      alerts.push({ id: 'a-' + log.id, severity: 'high', category: '密钥/凭证', title: '敏感配置变更（疑似密钥/凭证）', control: 'NF6-4 密钥托管 + 双因子核验', log });
    } else if (log.action === 'user.update' && PERM_RE.test(detail)) {
      alerts.push({ id: 'a-' + log.id, severity: 'medium', category: '权限', title: '账号权限/状态变更', control: 'NF6-2 最小权限 + 变更审批', log });
    } else if (log.action === 'knowledge.delete') {
      alerts.push({ id: 'a-' + log.id, severity: 'medium', category: '知识资产', title: '知识条目删除', control: 'NF6-5 资产删除审计留痕', log });
    } else if (EXPORT_RE.test(detail)) {
      alerts.push({ id: 'a-' + log.id, severity: 'medium', category: '数据导出', title: '批量数据导出', control: 'NF6-6 导出行为审计 + 告警', log });
    }
  }
  return alerts;
}

export default function OperationLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const load = (p = page, s = search, a = action) => {
    setLoading(true);
    fetchActivityLogs({ page: p, pageSize: 20, search: s, action: a || undefined })
      .then(r => { setLogs(r.data); setTotal(r.total); })
      .catch(e => toast.error('加载失败: ' + e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => { setPage(1); load(1, search, action); };

  const allAlerts = useMemo(() => buildAuditAlerts(logs), [logs]);
  const activeAlerts = useMemo(() => allAlerts.filter(a => !dismissed.has(a.id)), [allAlerts, dismissed]);
  const riskScore = useMemo(() => {
    const s = activeAlerts.reduce((acc, a) => acc + SEVERITY_SCORE[a.severity], 0);
    return Math.min(100, s);
  }, [activeAlerts]);
  const riskLevel = riskScore >= 30 ? '需立即处置' : riskScore >= 10 ? '需关注' : '态势正常';
  const riskTone = riskScore >= 30 ? 'bg-red-50 text-red-700 border-red-200' : riskScore >= 10 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200';

  const dismiss = (id: string) => setDismissed(prev => new Set(prev).add(id));

  const handleExport = () => {
    exportToCsv(
      `operation-log-${new Date().toISOString().slice(0, 10)}.csv`,
      ['时间', '操作人', '操作类型', '目标类型', '目标ID', '详情', 'IP'],
      logs.map(l => [new Date(l.created_at).toLocaleString('zh-CN'), l.user_id, l.action, l.target_type, l.target_id, l.detail, l.ip]),
    );
    toast.success('审计日志已导出');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">操作日志</h1>
          <p className="text-sm text-gray-500 mt-1">系统操作审计记录 · 共 {total} 条</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-1" />导出审计</Button>
          <Select value={action} onValueChange={v => { setAction(v); load(1, search, v); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="全部操作"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部操作</SelectItem>
              <SelectItem value="user.create">用户创建</SelectItem>
              <SelectItem value="user.update">用户更新</SelectItem>
              <SelectItem value="user.delete">用户删除</SelectItem>
              <SelectItem value="config.update">配置修改</SelectItem>
              <SelectItem value="knowledge.create">知识创建</SelectItem>
              <SelectItem value="knowledge.update">知识更新</SelectItem>
              <SelectItem value="knowledge.delete">知识删除</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="搜索用户/内容..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} className="pl-9 w-56" />
          </div>
        </div>
      </div>

      {/* NF6-6 审计安全态势告警 */}
      <Card className="border-l-4 border-l-[#1677FF]">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#1677FF]" />
              <h2 className="text-base font-semibold">审计安全态势 · 异常操作告警 (NF6-6)</h2>
              <Badge className={riskTone}>{riskLevel} · 风险值 {riskScore}</Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />高危 {activeAlerts.filter(a=>a.severity==='high').length}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />中危 {activeAlerts.filter(a=>a.severity==='medium').length}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />低危 {activeAlerts.filter(a=>a.severity==='low').length}</span>
            </div>
          </div>

          {activeAlerts.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
              <CheckCircle2 className="h-4 w-4" /> 当前页未检出高危/异常操作，审计态势健康。
            </div>
          ) : (
            <div className="space-y-2">
              {activeAlerts.map(a => (
                <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border ${SEVERITY_TONE[a.severity]}`}>
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{a.title}</span>
                      <Badge variant="outline" className="text-[10px] border-current">{a.category}</Badge>
                      <span className="text-[11px] text-gray-500">{a.log.user_id} · {new Date(a.log.created_at).toLocaleString('zh-CN')}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{a.log.detail || '-'}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">合规映射：{a.control}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="shrink-0" onClick={() => dismiss(a.id)}>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />标记已处理
                  </Button>
                </div>
              ))}
            </div>
          )}
          {dismissed.size > 0 && (
            <p className="text-xs text-gray-400 mt-3">已标记 {dismissed.size} 条为已处理（本页内存状态，重新加载后重置）。</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                <th className="py-3 px-4 w-44">时间</th>
                <th className="py-3 px-4 w-32">操作人</th>
                <th className="py-3 px-4 w-28">操作类型</th>
                <th className="py-3 px-4">详情</th>
                <th className="py-3 px-4 w-32">IP</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="p-8 text-center text-gray-400">加载中...</td></tr>}
              {!loading && logs.length===0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">暂无日志</td></tr>}
              {logs.map(log => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{new Date(log.created_at).toLocaleString('zh-CN')}</span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="flex items-center gap-1"><User className="h-3 w-3 text-gray-400"/>{log.user_id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={actionColors[log.action] || 'bg-gray-100 text-gray-700'}>{log.action}</Badge>
                  </td>
                  <td className="py-3 px-4 text-sm">{log.detail || '-'}</td>
                  <td className="py-3 px-4 text-xs text-gray-400 font-mono">{log.ip || '-'}</td>
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
