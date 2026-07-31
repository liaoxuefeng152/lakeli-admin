'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Plus, Search, Pencil, Trash2, Cpu, Zap, Settings2,
} from 'lucide-react';
import {
  fetchModels, createModel, updateModel, deleteModel,
  AiModelItem,
} from '@/lib/services/admin-api';

const providerLabels: Record<string, string> = {
  system: '系统', volcengine: '火山引擎', openai: 'OpenAI',
  anthropic: 'Anthropic', zhipu: '智谱AI', moonshot: 'Moonshot',
};

export default function PlatformModelManagementPage() {
  const [models, setModels] = useState<AiModelItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // 编辑弹窗
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<AiModelItem>>({});

  // 删除确认
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchModels(search || undefined);
      setModels(data);
    } catch (e) { toast.error('加载失败: ' + (e as Error).message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = () => { load(); };

  const openNew = () => {
    setEditing({
      name: '', provider: 'volcengine', model_id: '', description: '',
      api_base_url: '', api_key: '', temperature: 0.7, max_tokens: 4096,
      cost_multiplier: 1, color: '#3B82F6', icon: 'Zap', sort_order: models.length,
      is_enabled: true, is_default: false, can_auto_route: false,
      auto_route_keywords: '',
    });
    setEditOpen(true);
  };

  const openEdit = (m: AiModelItem) => {
    setEditing({ ...m });
    setEditOpen(true);
  };

  const saveModel = async () => {
    if (!editing.name || !editing.provider || !editing.model_id) {
      toast.error('名称、提供商、模型ID 为必填项'); return;
    }
    try {
      if (editing.id) {
        await updateModel(editing.id, editing);
        toast.success('模型已更新');
      } else {
        await createModel(editing);
        toast.success('模型已创建');
      }
      setEditOpen(false);
      load();
    } catch (e) { toast.error('保存失败: ' + (e as Error).message); }
  };

  const toggleEnabled = async (m: AiModelItem) => {
    try {
      await updateModel(m.id, { is_enabled: !m.is_enabled });
      load();
    } catch (e) { toast.error('操作失败: ' + (e as Error).message); }
  };

  const setDefault = async (m: AiModelItem) => {
    try {
      // 先把所有默认取消
      for (const mm of models) {
        if (mm.is_default && mm.id !== m.id) {
          await updateModel(mm.id, { is_default: false });
        }
      }
      await updateModel(m.id, { is_default: true });
      toast.success(`${m.name} 已设为默认模型`);
      load();
    } catch (e) { toast.error('操作失败: ' + (e as Error).message); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteModel(deleteId);
      toast.success('模型已删除');
      setDeleteId(null);
      load();
    } catch (e) { toast.error('删除失败: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">模型配置</h1>
          <p className="text-sm text-gray-500 mt-1">
            平台级 LLM 模型管理中心。此处配置的模型及其 API Key / Base URL 将被所有智能体统一调用，无需在各模块重复配置。
          </p>
        </div>
        <Button onClick={openNew} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />新增模型
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-dashed">
        <CardContent className="p-4 flex items-center gap-3">
          <Settings2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <div className="text-sm text-gray-500">
            模型配置为<strong>平台级全局设置</strong>：龙掌柜 AI 助手、GEO 域途、智推 AI 客服、智能外呼等所有智能体均从此处读取模型列表及 API 密钥。
            <span className="text-gray-400 ml-1">
              如需为某个模型单独配置 API Key，在编辑弹窗中填写即可（留空则使用全局环境变量）。
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{models.length}</div>
            <div className="text-sm text-gray-500">已配置模型</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {models.filter(m => m.is_enabled).length}
            </div>
            <div className="text-sm text-gray-500">已启用</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {models.filter(m => m.can_auto_route).length}
            </div>
            <div className="text-sm text-gray-500">支持自动路由</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索模型名称..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={handleSearch}>搜索</Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                <th className="py-3 px-4">模型名称</th>
                <th className="py-3 px-4">提供商</th>
                <th className="py-3 px-4">模型 ID</th>
                <th className="py-3 px-4 text-right">成本系数</th>
                <th className="py-3 px-4">标签</th>
                <th className="py-3 px-4 text-center">自动路由</th>
                <th className="py-3 px-4 text-center">启用</th>
                <th className="py-3 px-4 text-center">默认</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={9} className="p-8 text-center text-gray-400">加载中...</td></tr>
              )}
              {!loading && models.length === 0 && (
                <tr><td colSpan={9} className="p-8 text-center text-gray-400">暂无模型，点击「新增模型」添加</td></tr>
              )}
              {models.map(m => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: m.color || '#6B7280' }}
                      />
                      <span className="font-medium">{m.name}</span>
                      {m.is_default && (
                        <Badge variant="default" className="text-[10px] px-1">默认</Badge>
                      )}
                    </div>
                    {m.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {providerLabels[m.provider] || m.provider}
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs bg-gray-100 rounded px-1.5 py-0.5">
                      {m.model_id}
                    </code>
                  </td>
                  <td className="py-3 px-4 text-right text-sm">
                    {m.cost_multiplier === 0 ? (
                      <span className="text-gray-400">-</span>
                    ) : (
                      <span className={m.cost_multiplier <= 1 ? 'text-green-600' : 'text-orange-600'}>
                        x{m.cost_multiplier}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(typeof m.tags === 'string' ? m.tags.split(',').filter(Boolean) : m.tags || []).map(t => (
                        <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {m.can_auto_route ? (
                      <Badge variant="default" className="bg-blue-100 text-blue-700">
                        <Settings2 className="mr-1 h-3 w-3" />自动
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">手动</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Switch
                      checked={m.is_enabled}
                      onCheckedChange={() => toggleEnabled(m)}
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      size="sm"
                      variant={m.is_default ? 'default' : 'outline'}
                      className="h-7 text-xs"
                      onClick={() => setDefault(m)}
                      disabled={m.is_default}
                    >
                      {m.is_default ? '默认' : '设为默认'}
                    </Button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm" variant="ghost" className="h-8 w-8"
                        onClick={() => openEdit(m)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {m.provider !== 'system' && (
                        <Button
                          size="sm" variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => setDeleteId(m.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit / Create Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing.id ? '编辑模型' : '新增模型'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium">名称 *</label>
              <Input value={editing.name || ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                placeholder="如：通义千问 Plus" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">提供商 *</label>
              <Input value={editing.provider || ''} onChange={e => setEditing(p => ({ ...p, provider: e.target.value }))}
                placeholder="volcengine / qwen / deepseek" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">模型 ID *</label>
              <Input value={editing.model_id || ''} onChange={e => setEditing(p => ({ ...p, model_id: e.target.value }))}
                placeholder="qwen-plus" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium">描述</label>
              <Input value={editing.description || ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
                placeholder="模型能力说明" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium">API 地址 (Base URL)</label>
              <Input value={editing.api_base_url || ''} onChange={e => setEditing(p => ({ ...p, api_base_url: e.target.value }))}
                placeholder="留空则按提供商自动使用默认地址（如 dashscope.aliyuncs.com）" />
              <p className="text-xs text-gray-400 mt-1">
                设置后引擎将直接使用此地址调用该模型。常见取值：火山引擎 Ark → ark.cn-beijing.volces.com/api/v3，
                阿里云百炼 → dashscope.aliyuncs.com/compatible-mode/v1，DeepSeek → api.deepseek.com/v1
              </p>
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium">API Key</label>
              <Input type="password" value={editing.api_key || ''}
                onChange={e => setEditing(p => ({ ...p, api_key: e.target.value }))}
                placeholder="留空则使用全局环境变量（ARK_API_KEY / QWEN_API_KEY 等）" />
              <p className="text-xs text-gray-400 mt-1">
                为该模型单独配置的 API Key。设置后引擎优先使用此 Key 而非全局环境变量。
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">温度 (Temperature)</label>
              <Input type="number" step="0.1" min="0" max="2"
                value={editing.temperature ?? 0.7}
                onChange={e => setEditing(p => ({ ...p, temperature: parseFloat(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">最大 Token</label>
              <Input type="number" value={editing.max_tokens ?? 4096}
                onChange={e => setEditing(p => ({ ...p, max_tokens: parseInt(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">成本系数</label>
              <Input type="number" step="0.1" min="0" value={editing.cost_multiplier ?? 1}
                onChange={e => setEditing(p => ({ ...p, cost_multiplier: parseFloat(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">排序</label>
              <Input type="number" value={editing.sort_order ?? 0}
                onChange={e => setEditing(p => ({ ...p, sort_order: parseInt(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">颜色</label>
              <Input value={editing.color || ''} onChange={e => setEditing(p => ({ ...p, color: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">图标</label>
              <Input value={editing.icon || ''} onChange={e => setEditing(p => ({ ...p, icon: e.target.value }))}
                placeholder="Zap" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium">标签（逗号分隔）</label>
              <Input
                value={editing.tags ? (Array.isArray(editing.tags) ? editing.tags.join(',') : '') : ''}
                onChange={e => setEditing(p => ({
                  ...p,
                  tags: (e.target.value ? e.target.value.split(',').map(t => t.trim()).filter(Boolean) : []) as unknown as string,
                }))}
                placeholder="推荐,旗舰" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">支持自动路由</label>
                <Switch checked={editing.can_auto_route ?? false}
                  onCheckedChange={v => setEditing(p => ({ ...p, can_auto_route: v }))} />
              </div>
            </div>
            {editing.can_auto_route && (
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium">自动路由关键词（逗号分隔）</label>
                <Input
                  value={editing.auto_route_keywords || ''}
                  onChange={e => setEditing(p => ({ ...p, auto_route_keywords: e.target.value }))}
                  placeholder="分析,深度,报告,策略" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button>
            <Button className="bg-primary" onClick={saveModel}>
              {editing.id ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              删除后不可恢复。如果该模型正在被使用，用户将无法继续调用。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
