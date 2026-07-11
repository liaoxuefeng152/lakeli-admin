'use client';

import { useState } from 'react';
import { Save, Edit2, Zap, AlertTriangle, Shield } from 'lucide-react';
import { modelRouteConfigs, systemConfig } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const modelOptions = ['文心4.0', '通义千问Max', 'GPT-4o', 'Gemini Pro'];

export default function AgentSchedulingPage() {
  const [routeConfigs, setRouteConfigs] = useState(modelRouteConfigs);
  const [rateLimit, setRateLimit] = useState(30);
  const [tokenWarningThreshold, setTokenWarningThreshold] = useState(80000);
  const [editingRoute, setEditingRoute] = useState<typeof routeConfigs[0] | null>(null);
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEditRoute = (config: typeof routeConfigs[0]) => {
    setEditingRoute(config);
    setShowRouteDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI调度与配额管控</h1>
          <p className="text-sm text-gray-500 mt-1">多模型路由配置、全局配额展示、限流预警规则</p>
        </div>
        <Button onClick={handleSave} className="bg-[#FF7D00] hover:bg-[#e86e00] text-white">
          <Save className="mr-2 h-4 w-4" />
          保存配置
          {saved && <span className="ml-2 text-xs opacity-80">已保存</span>}
        </Button>
      </div>

      {/* Card 1: Multi-Model Route Config */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Edit2 className="h-4 w-4 text-[#FF7D00]" />
          多模型路由配置
        </h3>
        <p className="text-sm text-gray-500 mb-4">配置各行业Agent默认调用的大模型，修改后即时同步至Agent引擎</p>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">行业</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">默认模型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Agent数量</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {routeConfigs.map((config) => (
              <tr key={config.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{config.industry}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="font-medium">{config.defaultModel}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{config.agentCount}</td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#FF7D00] hover:text-[#e86e00] h-7 px-2"
                    onClick={() => handleEditRoute(config)}
                  >
                    <Edit2 className="mr-1 h-3 w-3" />
                    编辑修改模型
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card 2: Global Quota & Rate Limit */}
      <div className="grid grid-cols-2 gap-4">
        {/* Quota Display (not editable) */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#FF7D00]" />
            套餐基础配额（不可编辑）
          </h3>
          <p className="text-sm text-gray-500 mb-4">取自拉克力订单配置，仅展示</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">免费版</p>
                <p className="text-xs text-gray-400">每日提问次数限制</p>
              </div>
              <span className="text-lg font-bold text-gray-900">10<span className="text-sm font-normal text-gray-500">次/天</span></span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-blue-50/50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">基础版</p>
                <p className="text-xs text-gray-400">每日提问次数限制</p>
              </div>
              <span className="text-lg font-bold text-blue-600">50<span className="text-sm font-normal text-gray-500">次/天</span></span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-orange-50/50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">专业版</p>
                <p className="text-xs text-gray-400">每日提问次数限制</p>
              </div>
              <span className="text-lg font-bold text-[#FF7D00]">不限</span>
            </div>
          </div>
        </div>

        {/* Rate Limit & Warning Config */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#FF7D00]" />
            限流规则配置
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                单客户1分钟最大提问次数
              </label>
              <Input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(Number(e.target.value))}
                className="w-[200px]"
              />
              <p className="text-xs text-gray-400 mt-1">默认30次/分钟，超出后返回限流提示</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Token消耗预警阈值
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={tokenWarningThreshold}
                  onChange={(e) => setTokenWarningThreshold(Number(e.target.value))}
                  className="w-[200px]"
                />
                <span className="text-sm text-gray-500">Token</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">单客户当日Token消耗超过此阈值，自动在工作台红点提醒</p>
            </div>

            {/* Current monitoring */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">今日预警状态</span>
              </div>
              <p className="text-xs text-amber-600">当前有 <span className="font-bold">2</span> 个客户触发Token预警阈值</p>
              <p className="text-xs text-amber-600">当前有 <span className="font-bold">0</span> 个客户触发限流规则</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Route Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>修改默认模型</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-sm text-gray-500">
              修改 <span className="font-medium text-gray-700">{editingRoute?.industry}</span> 行业Agent的默认调用模型
            </p>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">默认模型</label>
              <Select defaultValue={editingRoute?.defaultModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowRouteDialog(false)}>取消</Button>
            <Button className="bg-[#FF7D00] hover:bg-[#e86e00] text-white" onClick={() => setShowRouteDialog(false)}>
              确认修改
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
