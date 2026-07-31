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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Search, Pencil, Zap, Tag, BarChart3, Loader2,
  Image, Video, SearchCheck, FileText, Megaphone,
  MessageCircle, Globe, Eye, Shield, Truck,
  Languages, MessageSquare, Share2, TrendingUp, Star,
} from 'lucide-react';
import { fetchSkills, updateSkill, type LzgSkill } from '@/lib/services/admin-api';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Image, Video, SearchCheck, FileText, Megaphone,
  MessageCircle, Globe, Eye, Shield, Truck,
  Languages, MessageSquare, Share2, TrendingUp, Star,
};

const IconComp = (iconName: string) =>
  iconMap[iconName] || Zap;

export default function LzgSkillsPage() {
  const [skills, setSkills] = useState<LzgSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // 编辑弹窗
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<LzgSkill | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSkills();
      setSkills(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载技能失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = skills.filter((s) => {
    if (activeTab === 'builtin' && s.type !== 'builtin') return false;
    if (activeTab === 'marketplace' && s.type !== 'marketplace') return false;
    if (search && !s.name.includes(search) && !s.description.includes(search) && !s.category.includes(search))
      return false;
    return true;
  });

  const builtinSkills = skills.filter((s) => s.type === 'builtin');
  const marketplaceSkills = skills.filter((s) => s.type === 'marketplace');

  const toggleSkill = async (id: string) => {
    const skill = skills.find((s) => s.id === id);
    if (!skill) return;
    const next = !skill.isEnabled;
    // 乐观更新
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: next } : s)),
    );
    try {
      await updateSkill(id, { isEnabled: next });
      toast.success(`技能「${skill.name}」已${next ? '启用' : '禁用'}`);
    } catch (e) {
      // 回滚
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isEnabled: !next } : s)),
      );
      toast.error(e instanceof Error ? e.message : '操作失败');
    }
  };

  const openEdit = (skill: LzgSkill) => {
    setEditing({ ...skill });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateSkill(editing.id, {
        name: editing.name,
        description: editing.description,
        category: editing.category,
        modelId: editing.modelId,
        modelName: editing.modelName,
        promptTemplate: editing.promptTemplate,
        icon: editing.icon,
        isEnabled: editing.isEnabled,
      });
      setSkills((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...editing } : s)),
      );
      setEditOpen(false);
      toast.success(`技能「${editing.name}」已更新`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">技能管理</h2>
          <p className="text-sm text-gray-500 mt-1">
            管理龙掌柜AI助手的内置技能和技能市场
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '刷新'}
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">内置技能</p>
                <p className="text-2xl font-semibold text-gray-900 mt-0.5">{builtinSkills.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  启用 {builtinSkills.filter((s) => s.isEnabled).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Zap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">市场技能</p>
                <p className="text-2xl font-semibold text-gray-900 mt-0.5">{marketplaceSkills.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  启用 {marketplaceSkills.filter((s) => s.isEnabled).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">总调用次数</p>
                <p className="text-2xl font-semibold text-gray-900 mt-0.5">
                  {skills.reduce((sum, s) => sum + s.callCount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  平均成功率 {skills.length ? (skills.reduce((sum, s) => sum + s.successRate, 0) / skills.length * 100).toFixed(0) : 0}%
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索 & 分栏 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索技能名称、描述或分类..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
          <Button variant="link" className="h-auto p-0 ml-2 text-red-700" onClick={load}>重试</Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">全部 ({skills.length})</TabsTrigger>
            <TabsTrigger value="builtin">内置 ({builtinSkills.length})</TabsTrigger>
            <TabsTrigger value="marketplace">市场 ({marketplaceSkills.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50/50 text-left text-gray-500">
                        <th className="py-3 pl-4 font-medium">技能</th>
                        <th className="py-3 font-medium">分类</th>
                        <th className="py-3 font-medium">类型</th>
                        <th className="py-3 font-medium">绑定模型</th>
                        <th className="py-3 font-medium text-right">调用次数</th>
                        <th className="py-3 font-medium text-right">成功率</th>
                        <th className="py-3 font-medium text-right">平均耗时</th>
                        <th className="py-3 font-medium text-center">状态</th>
                        <th className="py-3 pr-4 font-medium text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((skill) => {
                        const Icon = IconComp(skill.icon);
                        return (
                          <tr
                            key={skill.id}
                            className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                              !skill.isEnabled ? 'opacity-60' : ''
                            }`}
                          >
                            <td className="py-3 pl-4">
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                  skill.isEnabled ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{skill.name}</p>
                                  <p className="text-xs text-gray-400">{skill.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <Badge variant="secondary" className="text-xs">{skill.category}</Badge>
                            </td>
                            <td className="py-3">
                              <Badge
                                variant={skill.type === 'builtin' ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {skill.type === 'builtin' ? '内置' : '市场'}
                              </Badge>
                            </td>
                            <td className="py-3 text-gray-600">{skill.modelName || '-'}</td>
                            <td className="py-3 text-right text-gray-700">
                              {skill.callCount.toLocaleString()}
                            </td>
                            <td className="py-3 text-right">
                              <span className={skill.successRate >= 0.9 ? 'text-green-600' : 'text-orange-600'}>
                                {(skill.successRate * 100).toFixed(0)}%
                              </span>
                            </td>
                            <td className="py-3 text-right text-gray-500">{skill.avgDuration}s</td>
                            <td className="py-3 text-center">
                              <Switch
                                checked={skill.isEnabled}
                                onCheckedChange={() => toggleSkill(skill.id)}
                              />
                            </td>
                            <td className="py-3 pr-4 text-right">
                              <Button variant="ghost" size="sm" onClick={() => openEdit(skill)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-gray-400">
                            暂无匹配的技能
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* 编辑弹窗 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑技能配置</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium text-gray-700">技能名称</label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">描述</label>
                <Input
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">分类</label>
                  <Input
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">绑定模型</label>
                  <Input
                    value={editing.modelId}
                    onChange={(e) => setEditing({ ...editing, modelId: e.target.value })}
                    className="mt-1"
                    placeholder="模型ID"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Prompt 模板</label>
                <textarea
                  value={editing.promptTemplate}
                  onChange={(e) => setEditing({ ...editing, promptTemplate: e.target.value })}
                  className="mt-1 w-full min-h-[100px] rounded-lg border border-gray-200 p-3 text-sm resize-y focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none"
                  placeholder="输入Prompt模板，支持 {变量} 占位..."
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">启用状态</label>
                <Switch
                  checked={editing.isEnabled}
                  onCheckedChange={(v) => setEditing({ ...editing, isEnabled: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>取消</Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
