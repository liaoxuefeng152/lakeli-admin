'use client';

import { useState } from 'react';
import { Save, Settings, Zap, Globe, MessageSquare } from 'lucide-react';
import { systemConfig } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function SystemConfigPage() {
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
          <h1 className="text-xl font-bold text-gray-900">系统基础配置</h1>
          <p className="text-sm text-gray-500 mt-1">全局系统参数配置，修改后实时生效</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          保存配置
          {saved && <span className="ml-2 text-xs opacity-80">已保存</span>}
        </Button>
      </div>

      {/* AI Configuration */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#1677FF]" />
          AI助手配置
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">每日提问配额（次/客户/天）</label>
            <Input
              type="number"
              value={config.aiDailyQuota}
              onChange={(e) => setConfig({ ...config, aiDailyQuota: Number(e.target.value) })}
            />
            <p className="text-xs text-gray-400 mt-1">超出后提示用户次日再试</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">单客户Token上限</label>
            <Input
              type="number"
              value={config.tokenLimitPerCustomer}
              onChange={(e) => setConfig({ ...config, tokenLimitPerCustomer: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      {/* GEO Configuration */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#0F52BA]" />
          GEO打分规则
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">GEO评分阈值</label>
            <Input
              type="number"
              value={config.geoScoreThreshold}
              onChange={(e) => setConfig({ ...config, geoScoreThreshold: Number(e.target.value) })}
            />
            <p className="text-xs text-gray-400 mt-1">低于此分数将触发优化建议</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">默认诊断语言</label>
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option>中英双语</option>
              <option>仅中文</option>
              <option>仅英文</option>
            </select>
          </div>
        </div>
      </div>

      {/* Intent Keywords */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#00B42A]" />
          意向关键词库
        </h3>
        <p className="text-xs text-gray-500 mb-3">客户对话命中以下关键词时，自动触发企微人工转接</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {config.intentKeywords.map((kw, i) => (
            <Badge key={i} variant="outline" className="px-3 py-1 text-sm gap-1">
              {kw}
              <button className="ml-1 text-gray-400 hover:text-red-500">&times;</button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="输入新的意向关键词..." className="max-w-xs" />
          <Button variant="outline" size="sm">添加</Button>
        </div>
      </div>

      {/* Engine Configuration */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-600" />
          引擎与降级配置
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">主AI引擎</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={config.modelProvider}
              onChange={(e) => setConfig({ ...config, modelProvider: e.target.value })}
            >
              <option>自研Agent引擎</option>
              <option>OpenAI</option>
              <option>Claude</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">降级兜底引擎</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={config.fallbackEngine}
              onChange={(e) => setConfig({ ...config, fallbackEngine: e.target.value })}
            >
              <option>扣子平台</option>
              <option>OpenAI</option>
              <option>不启用兜底</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">双引擎并行模式</label>
          <button
            onClick={() => setConfig({ ...config, dualEngineMode: !config.dualEngineMode })}
            className={`relative h-5 w-9 rounded-full transition-colors ${config.dualEngineMode ? 'bg-[#1677FF]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${config.dualEngineMode ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
          <span className="text-xs text-gray-500">迁移过渡期建议开启，主引擎异常时自动切换</span>
        </div>
      </div>
    </div>
  );
}
