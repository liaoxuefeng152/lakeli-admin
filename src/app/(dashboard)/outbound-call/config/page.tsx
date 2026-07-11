'use client';

import { useState } from 'react';
import { Save, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { outboundCallConfig } from '@/lib/mock-data';

export default function OutboundConfigPage() {
  const [config, setConfig] = useState(outboundCallConfig);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult('success');
    }, 2000);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const statusConfig = {
    '已连接': { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: '接口连接正常' },
    '未配置': { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', label: '尚未配置接口参数' },
    '连接失败': { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: '接口连接失败' },
  };

  const currentStatus = statusConfig[config.status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#333]">阿里云接口配置</h1>
        <p className="mt-1 text-sm text-[#999]">统一配置阿里云智能外呼对接参数，全局生效</p>
      </div>

      {/* Connection Status */}
      <div className={`mb-6 flex items-center gap-3 rounded-lg ${currentStatus.bg} p-4`}>
        <StatusIcon className={`h-5 w-5 ${currentStatus.color}`} />
        <div>
          <p className={`text-sm font-medium ${currentStatus.color}`}>{currentStatus.label}</p>
          <p className="text-xs text-[#999]">上次检测时间：2026-07-10 16:30:00</p>
        </div>
        <button onClick={handleTest} disabled={testing} className="ml-auto flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm text-[#666] shadow-sm hover:bg-gray-50">
          <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin' : ''}`} />
          {testing ? '检测中...' : '重新检测'}
        </button>
      </div>

      {testResult && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm ${testResult === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {testResult === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {testResult === 'success' ? '接口连接成功，所有参数验证通过' : '接口连接失败，请检查AccessKey和网络配置'}
        </div>
      )}

      {/* Config Form */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-base font-medium text-[#333]">接口参数配置</h3>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-1 block text-sm text-[#333]">AccessKey ID <span className="text-red-500">*</span></label>
              <input type="text" value={config.accessKeyId} onChange={(e) => setConfig({ ...config, accessKeyId: e.target.value })} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
              <p className="mt-1 text-xs text-[#999]">阿里云RAM用户的AccessKey ID</p>
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#333]">AccessKey Secret <span className="text-red-500">*</span></label>
              <input type="password" value={config.accessKeySecret} onChange={(e) => setConfig({ ...config, accessKeySecret: e.target.value })} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
              <p className="mt-1 text-xs text-[#999]">阿里云RAM用户的AccessKey Secret</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-1 block text-sm text-[#333]">外呼主号码 <span className="text-red-500">*</span></label>
              <input type="text" value={config.outboundPhone} onChange={(e) => setConfig({ ...config, outboundPhone: e.target.value })} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
              <p className="mt-1 text-xs text-[#999]">阿里云购买的正规外呼号码</p>
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#333]">回调地址（HTTPS）<span className="text-red-500">*</span></label>
              <input type="text" value={config.callbackUrl} onChange={(e) => setConfig({ ...config, callbackUrl: e.target.value })} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
              <p className="mt-1 text-xs text-[#999]">接收阿里云通话结果回调的HTTPS地址</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-1 block text-sm text-[#333]">接口超时时间（秒）</label>
              <input type="number" value={config.timeout} onChange={(e) => setConfig({ ...config, timeout: Number(e.target.value) })} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#333]">失败重试次数</label>
              <input type="number" value={config.retryCount} onChange={(e) => setConfig({ ...config, retryCount: Number(e.target.value) })} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1677FF]" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button onClick={handleSave} className="flex items-center gap-1.5 rounded-md bg-[#1677FF] px-6 py-2 text-sm text-white hover:bg-[#4096FF]">
            <Save className="h-4 w-4" />
            {saving ? '保存中...' : '保存配置'}
          </button>
          <button onClick={handleTest} disabled={testing} className="flex items-center gap-1.5 rounded-md border border-gray-200 px-4 py-2 text-sm text-[#666] hover:bg-gray-50">
            <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin' : ''}`} />
            保存并检测连通性
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-500">
              <CheckCircle className="h-4 w-4" /> 配置已保存
            </span>
          )}
        </div>
      </div>

      {/* Help Info */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-[#1677FF]">配置说明</h4>
        <ul className="space-y-1 text-xs text-[#666]">
          <li>1. 请确保阿里云账号已完成实名认证和语音资质审核</li>
          <li>2. AccessKey需要具有智能外呼相关API调用权限</li>
          <li>3. 回调地址必须为HTTPS协议，且服务器可公网访问</li>
          <li>4. 外呼号码需为阿里云正规申请并备案的号码</li>
          <li>5. 保存配置后建议点击「重新检测」验证连通性</li>
        </ul>
      </div>
    </div>
  );
}
