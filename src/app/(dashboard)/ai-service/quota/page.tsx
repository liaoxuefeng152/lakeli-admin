'use client';

import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function AiQuotaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI助手配额全局设置</h1>
          <p className="text-sm text-gray-500 mt-1">配置AI客服的全局配额与响应规则</p>
        </div>
        <Button className="bg-[#00B42A] hover:bg-[#00B42A]/90">
          <Save className="mr-2 h-4 w-4" />
          保存设置
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Quota Settings */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">配额设置</h3>
          <div className="space-y-2">
            <Label>每日提问配额(每客户)</Label>
            <Input type="number" defaultValue="50" />
            <p className="text-xs text-gray-400">每个客户每天最多可提问次数</p>
          </div>
          <div className="space-y-2">
            <Label>单次对话最大轮数</Label>
            <Input type="number" defaultValue="20" />
          </div>
          <div className="space-y-2">
            <Label>全局并发上限</Label>
            <Input type="number" defaultValue="100" />
            <p className="text-xs text-gray-400">同时进行的对话数量上限</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>AI回复超时时间(秒)</Label>
            <Input type="number" defaultValue="30" />
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
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>转人工置信度阈值(%)</Label>
            <Input type="number" defaultValue="60" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">留资表单自动弹出</div>
              <p className="text-xs text-gray-400">检测到高意向时自动弹出留资表单</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">非工作时间自动回复</div>
              <p className="text-xs text-gray-400">非工作时间启用离线回复</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">对话记录同步企微</div>
              <p className="text-xs text-gray-400">自动将对话记录同步至企微会话存档</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
