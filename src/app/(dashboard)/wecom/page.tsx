'use client';

import { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function WecomPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">全局企业微信配置中心</h1>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          保存配置
        </Button>
      </div>

      <div className="rounded-lg bg-[#FFF7E8] border border-[#FF7D00]/20 px-4 py-3 text-sm text-[#FF7D00]">
        演示页面：当前未对接后端接口，「保存配置」仅临时保存在浏览器本地，不会真正下发到企业微信。
      </div>

      {saved && (
        <div className="rounded-lg bg-[#E8FFEA] border border-[#00B42A]/20 px-4 py-3 text-sm text-[#00B42A]">
          配置已保存到本地（演示）
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Basic Config */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">基础配置</h3>
          <div className="space-y-2">
            <Label>企微CorpID</Label>
            <Input placeholder="请输入企业微信CorpID" defaultValue="ww1234567890abcdef" />
          </div>
          <div className="space-y-2">
            <Label>微信客服接入URL</Label>
            <Input placeholder="请输入客服接入链接" defaultValue="https://work.weixin.qq.com/kfid/xxx" />
          </div>
          <div className="space-y-2">
            <Label>CorpSecret</Label>
            <Input type="password" placeholder="请输入Secret" defaultValue="************" />
          </div>
          <div className="space-y-2">
            <Label>离线自动回复文案</Label>
            <Textarea
              rows={3}
              defaultValue="您好，当前非工作时间，您的消息我们已收到，工作时间内会尽快回复您。"
            />
          </div>
        </div>

        {/* Material Upload */}
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">素材上传</h3>
          <div className="space-y-2">
            <Label>企微活码</Label>
            <div className="flex items-center gap-4">
              <div className="h-28 w-28 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <Button variant="outline" size="sm">上传活码图片</Button>
                <p className="text-xs text-gray-400 mt-2">支持 PNG/JPG，建议尺寸 400x400</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>个人微信二维码</Label>
            <div className="flex items-center gap-4">
              <div className="h-28 w-28 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <Button variant="outline" size="sm">上传二维码</Button>
                <p className="text-xs text-gray-400 mt-2">用于添加好友场景</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>行业资料附件</Label>
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center bg-gray-50">
              <Upload className="h-5 w-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">点击或拖拽上传行业资料</p>
              <p className="text-xs text-gray-400 mt-1">支持 PDF/DOC/XLS，最大 20MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Distribution Rules */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-900">分流规则配置</h3>
        <p className="text-sm text-gray-500">不同行业客户自动分配对应销售</p>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          {[
            { industry: '跨境电商', sales: '王销售' },
            { industry: '工业设备', sales: '王销售' },
            { industry: '本地门店', sales: '刘销售' },
            { industry: '科创企业', sales: '王销售' },
            { industry: '外贸制造', sales: '刘销售' },
            { industry: '金融服务', sales: '刘销售' },
          ].map((rule) => (
            <div key={rule.industry} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-24">{rule.industry}</span>
              <Select defaultValue={rule.sales}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="王销售">王销售</SelectItem>
                  <SelectItem value="刘销售">刘销售</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
