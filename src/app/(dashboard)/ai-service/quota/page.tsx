'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { fetchAiQuotaConfig, updateAiQuotaConfig, type AiQuotaConfig } from '@/lib/services/admin-api';

export default function AiQuotaPage() {
  const [cfg, setCfg] = useState<AiQuotaConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const c = await fetchAiQuotaConfig();
        setCfg(c);
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (patch: Partial<AiQuotaConfig>) =>
    setCfg((prev) => (prev ? { ...prev, ...patch } : prev));

  const handleSave = async () => {
    if (!cfg) return;
    setSaving(true);
    setError(null);
    try {
      await updateAiQuotaConfig(cfg);
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !cfg) {
    return (
      <div className="flex items-center gap-2 text-gray-400 p-10">
        <Loader2 className="h-4 w-4 animate-spin" />加载中...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI助手配额全局设置</h1>
          <p className="text-sm text-gray-500 mt-1">配置AI客服的全局配额与响应规则</p>
        </div>
        <Button className="bg-[#00B42A] hover:bg-[#00B42A]/90" onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? '保存中...' : '保存设置'}
        </Button>
      </div>

      {error && <div className="text-sm text-[#F53F3F]">{error}</div>}

      <div className="grid grid-cols-2 gap-6">
        {/* Quota Settings */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">配额设置</h3>
          <div className="space-y-2">
            <Label>每日提问配额(每客户)</Label>
            <Input type="number" value={cfg.dailyQuestionLimit} onChange={(e) => update({ dailyQuestionLimit: Number(e.target.value) })} />
            <p className="text-xs text-gray-400">每个客户每天最多可提问次数</p>
          </div>
          <div className="space-y-2">
            <Label>单次对话最大轮数</Label>
            <Input type="number" value={cfg.maxTurnsPerChat} onChange={(e) => update({ maxTurnsPerChat: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>全局并发上限</Label>
            <Input type="number" value={cfg.maxConcurrency} onChange={(e) => update({ maxConcurrency: Number(e.target.value) })} />
            <p className="text-xs text-gray-400">同时进行的对话数量上限</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>AI回复超时时间(秒)</Label>
            <Input type="number" value={cfg.replyTimeout} onChange={(e) => update({ replyTimeout: Number(e.target.value) })} />
          </div>
        </div>

        {/* Response Settings */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">响应规则</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">自动转人工</div>
              <p className="text-xs text-gray-400">置信度低于阈值时自动转人工</p>
            </div>
            <Switch checked={cfg.autoTransfer} onCheckedChange={(v) => update({ autoTransfer: v })} />
          </div>
          <div className="space-y-2">
            <Label>转人工置信度阈值(%)</Label>
            <Input type="number" value={cfg.transferConfidenceThreshold} onChange={(e) => update({ transferConfidenceThreshold: Number(e.target.value) })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">留资表单自动弹出</div>
              <p className="text-xs text-gray-400">检测到高意向时自动弹出留资表单</p>
            </div>
            <Switch checked={cfg.leadFormAutoPopup} onCheckedChange={(v) => update({ leadFormAutoPopup: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">非工作时间自动回复</div>
              <p className="text-xs text-gray-400">非工作时间启用离线回复</p>
            </div>
            <Switch checked={cfg.offhoursAutoReply} onCheckedChange={(v) => update({ offhoursAutoReply: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">对话记录同步企微</div>
              <p className="text-xs text-gray-400">自动将对话记录同步至企微会话存档</p>
            </div>
            <Switch checked={cfg.syncToWecom} onCheckedChange={(v) => update({ syncToWecom: v })} />
          </div>
        </div>
      </div>
    </div>
  );
}
