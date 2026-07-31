'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Tags, Plus } from 'lucide-react';
import {
  fetchTags, createTag, assignTag, fetchSegments, type Tag, type Segment,
} from '@/lib/services/data-platform-api';

const THEME = '#13C2C2';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [newName, setNewName] = useState('');
  const [assign, setAssign] = useState({ entity_type: 'customer', entity_id: '', tag_id: '' });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([fetchTags(), fetchSegments()])
      .then(([t, s]) => { setTags(t); setSegments(s); })
      .catch((e) => toast.error('加载失败: ' + e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onAdd = async () => {
    if (!newName.trim()) return;
    try { await createTag(newName.trim()); toast.success('标签已创建'); setNewName(''); load(); }
    catch (e) { toast.error('创建失败: ' + (e as Error).message); }
  };

  const onAssign = async () => {
    if (!assign.entity_id || !assign.tag_id) { toast.error('请填写实体ID并选择标签'); return; }
    try {
      await assignTag(assign.entity_type, assign.entity_id, assign.tag_id);
      toast.success('已打标签'); load();
    } catch (e) { toast.error('打标签失败: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">标签分群</h1>
        <p className="mt-1 text-sm text-gray-500">统一标签体系 · 跨模块实体分群运营</p>
      </div>

      {loading ? <div className="text-center text-gray-400 py-12">加载中…</div> : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 标签管理 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Tags className="h-5 w-5" style={{ color: THEME }} />标签库（{tags.length}）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="新标签名" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <Button onClick={onAdd} style={{ backgroundColor: THEME }}><Plus className="mr-1 h-4 w-4" />新增</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t.tag_id} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    {t.name} <span className="text-gray-400">({t.entity_count})</span>
                  </span>
                ))}
                {tags.length === 0 && <span className="text-sm text-gray-400">暂无标签</span>}
              </div>

              <div className="border-t pt-3 space-y-2">
                <p className="text-xs text-gray-500">给实体打标签</p>
                <div className="flex gap-2">
                  <select
                    className="rounded-md border px-2 py-1.5 text-sm"
                    value={assign.entity_type}
                    onChange={(e) => setAssign({ ...assign, entity_type: e.target.value })}
                  >
                    <option value="customer">客户</option>
                    <option value="tenant">租户</option>
                  </select>
                  <Input placeholder="实体ID" value={assign.entity_id} onChange={(e) => setAssign({ ...assign, entity_id: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <select
                    className="rounded-md border px-2 py-1.5 text-sm flex-1"
                    value={assign.tag_id}
                    onChange={(e) => setAssign({ ...assign, tag_id: e.target.value })}
                  >
                    <option value="">选择标签…</option>
                    {tags.map((t) => <option key={t.tag_id} value={t.tag_id}>{t.name}</option>)}
                  </select>
                  <Button variant="outline" onClick={onAssign}>打标签</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 分群视图 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">分群视图</CardTitle>
            </CardHeader>
            <CardContent>
              {segments.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">暂无分群（先创建标签并给实体打标）</p>
              ) : (
                <div className="space-y-3">
                  {segments.map((seg) => (
                    <div key={seg.tag_id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{seg.tag_name}</span>
                        <span className="text-xs text-gray-400">{seg.entities.length} 个实体</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {seg.entities.map((e, i: number) => (
                          <span key={i} className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
                            {e.type}:{e.id.slice(0, 8)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
