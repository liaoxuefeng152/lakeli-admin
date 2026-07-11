'use client';

import { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { operationLogs } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function OperationLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');

  const modules = [...new Set(operationLogs.map((log) => log.module))];
  const operators = [...new Set(operationLogs.map((log) => log.operator))];

  const filtered = operationLogs.filter((log) => {
    const matchSearch = log.detail.includes(searchTerm) || log.action.includes(searchTerm);
    const matchModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchOperator = operatorFilter === 'all' || log.operator === operatorFilter;
    return matchSearch && matchModule && matchOperator;
  });

  const actionColors: Record<string, string> = {
    '新增管理员': 'bg-blue-50 text-blue-600 border-blue-200',
    '编辑知识库': 'bg-green-50 text-green-600 border-green-200',
    '修改企微配置': 'bg-purple-50 text-purple-600 border-purple-200',
    '导出客户数据': 'bg-orange-50 text-orange-600 border-orange-200',
    '分配线索': 'bg-cyan-50 text-cyan-600 border-cyan-200',
    '编辑Agent': 'bg-[#FF7D00]/10 text-[#FF7D00] border-[#FF7D00]/20',
    '修改套餐配置': 'bg-red-50 text-red-600 border-red-200',
    '批量导入知识库': 'bg-green-50 text-green-600 border-green-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">操作日志</h1>
          <p className="text-sm text-gray-500 mt-1">全平台操作留痕，支持筛选导出，保障数据安全可追溯</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          导出日志
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索操作内容..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-36">
            <Filter className="mr-1 h-3 w-3" />
            <SelectValue placeholder="模块筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部模块</SelectItem>
            {modules.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={operatorFilter} onValueChange={setOperatorFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="操作人筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部人员</SelectItem>
            {operators.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Log Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">所属模块</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作详情</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">IP地址</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{log.createdAt}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-gray-900">{log.operator}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={`text-xs ${actionColors[log.action] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  >
                    {log.action}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{log.module}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[300px] truncate">{log.detail}</td>
                <td className="px-4 py-3 text-sm text-gray-400 font-mono">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            暂无匹配的操作日志
          </div>
        )}
      </div>
    </div>
  );
}
