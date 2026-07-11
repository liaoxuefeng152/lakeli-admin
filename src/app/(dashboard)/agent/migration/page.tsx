'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MigrationItem {
  id: string;
  name: string;
  source: string;
  status: 'pending' | 'importing' | 'success' | 'failed';
  type: string;
}

export default function MigrationPage() {
  const [migrationItems] = useState<MigrationItem[]>([
    { id: 'M001', name: '跨境电商顾问Prompt', source: '扣子平台', status: 'success', type: 'Prompt' },
    { id: 'M002', name: '工业设备FAQ知识库', source: '扣子平台', status: 'success', type: 'FAQ' },
    { id: 'M003', name: '本地门店话术模板', source: 'Excel导入', status: 'success', type: 'FAQ' },
    { id: 'M004', name: '黄精外贸英文Prompt', source: '扣子平台', status: 'importing', type: 'Prompt' },
    { id: 'M005', name: '科创企业知识库', source: 'Excel导入', status: 'pending', type: '知识库' },
  ]);

  const statusConfig = {
    pending: { label: '待导入', color: 'bg-gray-100 text-gray-600' },
    importing: { label: '导入中', color: 'bg-blue-50 text-blue-600' },
    success: { label: '已完成', color: 'bg-green-50 text-green-600' },
    failed: { label: '失败', color: 'bg-red-50 text-red-600' },
  };

  const stats = {
    total: migrationItems.length,
    success: migrationItems.filter((i) => i.status === 'success').length,
    importing: migrationItems.filter((i) => i.status === 'importing').length,
    pending: migrationItems.filter((i) => i.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">扣子资产批量迁移工具</h1>
        <p className="text-sm text-gray-500 mt-1">从扣子平台导入Prompt、FAQ、知识库素材，一键生成对应行业智能体</p>
      </div>

      {/* Migration Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">总资产数</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">已完成</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.success}</div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">导入中</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.importing}</div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">待处理</div>
          <div className="text-2xl font-bold text-gray-600 mt-1">{stats.pending}</div>
        </div>
      </div>

      {/* Dual Engine Status */}
      <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">双引擎并行状态</h3>
          <Badge className="bg-orange-50 text-orange-600 border-orange-200">过渡期</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-green-200 bg-green-50/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">自研Agent引擎</span>
            </div>
            <p className="text-xs text-gray-500">主力引擎运行中，已承载3个行业智能体</p>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">扣子平台（兜底）</span>
            </div>
            <p className="text-xs text-gray-500">并行运行中，预计2周后完全切换</p>
          </div>
        </div>
      </div>

      {/* Import Actions */}
      <div className="flex gap-3">
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          导入Prompt Excel
        </Button>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          导入FAQ Excel
        </Button>
        <Button className="bg-[#FF7D00] hover:bg-[#FF7D00]/90">
          <ArrowRight className="mr-2 h-4 w-4" />
          一键生成智能体
        </Button>
      </div>

      {/* Migration List */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">资产名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">来源</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {migrationItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.source}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{item.type}</Badge>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig[item.status].color}`}>
                    {statusConfig[item.status].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item.status === 'success' && (
                    <Button variant="ghost" size="sm" className="text-[#FF7D00]">
                      查看智能体
                    </Button>
                  )}
                  {item.status === 'pending' && (
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      开始导入
                    </Button>
                  )}
                  {item.status === 'importing' && (
                    <span className="text-xs text-blue-500">导入中...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
