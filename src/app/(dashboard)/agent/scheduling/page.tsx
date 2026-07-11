'use client';

import { useState } from 'react';
import { Save, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { systemConfig } from '@/lib/mock-data';
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

export default function AgentSchedulingPage() {
  const [config, setConfig] = useState(systemConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI调度&配额管控</h1>
          <p className="text-sm text-gray-500 mt-1">多模型切换配置、Token消耗监控、单客户限流规则</p>
        </div>
        <Button onClick={handleSave} className="bg-[#FF7D00] hover:bg-[#FF7D00]/90">
          <Save className="mr-2 h-4 w-4" />
          保存配置
          {saved && <span className="ml-2 text-xs opacity-80">已保存</span>}
        </Button>
      </div>

      {/* Engine Configuration */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-[#FF7D00]" />
          模型引擎配置
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">主引擎</label>
            <Select value={config.modelProvider} onValueChange={(v) => setConfig({ ...config, modelProvider: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="自研Agent引擎">自研Agent引擎</SelectItem>
                <SelectItem value="OpenAI">OpenAI</SelectItem>
                <SelectItem value="Claude">Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">兜底引擎</label>
            <Select value={config.fallbackEngine} onValueChange={(v) => setConfig({ ...config, fallbackEngine: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="扣子平台">扣子平台</SelectItem>
                <SelectItem value="OpenAI">OpenAI</SelectItem>
                <SelectItem value="无">不启用兜底</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">双引擎并行模式</label>
          <button
            onClick={() => setConfig({ ...config, dualEngineMode: !config.dualEngineMode })}
            className={`relative h-5 w-9 rounded-full transition-colors ${config.dualEngineMode ? 'bg-[#FF7D00]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${config.dualEngineMode ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
          <span className="text-xs text-gray-500">开启后主引擎异常时自动切换兜底引擎</span>
        </div>
      </div>

      {/* Quota Configuration */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#FF7D00]" />
          Token配额管控
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">AI每日提问配额（次/客户/天）</label>
            <Input
              type="number"
              value={config.aiDailyQuota}
              onChange={(e) => setConfig({ ...config, aiDailyQuota: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">单客户Token上限</label>
            <Input
              type="number"
              value={config.tokenLimitPerCustomer}
              onChange={(e) => setConfig({ ...config, tokenLimitPerCustomer: Number(e.target.value) })}
            />
            <p className="text-xs text-gray-400 mt-1">超出后自动限流，提示用户次日再试</p>
          </div>
        </div>
      </div>

      {/* Token Consumption Overview */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#FF7D00]" />
          Token消耗监控（今日）
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">今日总消耗</div>
            <div className="text-xl font-bold text-gray-900">2.24M</div>
            <div className="text-xs text-gray-400">Token</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">高消耗智能体</div>
            <div className="text-xl font-bold text-[#FF7D00]">跨境电商顾问</div>
            <div className="text-xs text-gray-400">850K Token</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">触发限流客户</div>
            <div className="text-xl font-bold text-red-500">2</div>
            <div className="text-xs text-gray-400">今日</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">引擎切换次数</div>
            <div className="text-xl font-bold text-blue-600">0</div>
            <div className="text-xs text-gray-400">兜底未触发</div>
          </div>
        </div>
      </div>

      {/* Intent Keywords */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">意向触发关键词</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {config.intentKeywords.map((kw, i) => (
            <Badge key={i} variant="outline" className="px-3 py-1 text-sm">
              {kw}
            </Badge>
          ))}
          <Input placeholder="添加关键词..." className="w-32 h-7 text-sm" />
        </div>
        <p className="text-xs text-gray-500">客户对话命中以上关键词时，自动调用企微配置唤起人工聊天窗口</p>
      </div>
    </div>
  );
}
