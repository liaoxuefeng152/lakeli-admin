'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SlidersHorizontal, Plus, Trash2, Eye, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { finetuneApi, FINETUNE_STATUS_LABEL, FinetuneTask } from '@/lib/services/finetune-api';

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  building: 'bg-blue-100 text-blue-600',
  training: 'bg-indigo-100 text-indigo-600',
  evaluating: 'bg-orange-100 text-orange-600',
  deployed: 'bg-green-100 text-green-600',
  failed: 'bg-red-100 text-red-600',
};

const PIPELINE = ['pending', 'building', 'training', 'evaluating', 'deployed'];

export default function FinetunePage() {
  const [tasks, setTasks] = useState<FinetuneTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [detail, setDetail] = useState<FinetuneTask | null>(null);
  const [form, setForm] = useState({
    name: '', base_model: 'hunyuan-turbo-7b', dataset_path: 'data/train.jsonl',
    lora_rank: 8, lora_alpha: 16,
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    finetuneApi.list()
      .then((r) => setTasks(r.data))
      .catch((e) => toast.error('加载失败: ' + e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.warning('请填写任务名'); return; }
    setSubmitting(true);
    try {
      await finetuneApi.create(form);
      toast.success('已创建微调任务，开始构建');
      setShowCreate(false);
      load();
    } catch (e) {
      toast.error('创建失败: ' + (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该微调任务？')) return;
    try {
      await finetuneApi.remove(id);
      toast.success('已删除');
      load();
    } catch (e) { toast.error('删除失败: ' + (e as Error).message); }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#1D2129]">模型微调管理</h1>
            <p className="text-sm text-[#4E5969]">百炼 LoRA 训练任务 · 构建→训练→评测→部署</p>
          </div>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" /> 新建任务
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">任务列表</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-[#4E5969]"><Loader2 className="inline h-4 w-4 animate-spin" /> 加载中…</div>
          ) : tasks.length === 0 ? (
            <div className="py-10 text-center text-[#4E5969]">暂无微调任务，点击右上角新建</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>任务名</TableHead>
                  <TableHead>基座模型</TableHead>
                  <TableHead>LoRA(r/α)</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>进度</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((t) => (
                  <TableRow key={t.id} className="hover:bg-[#F5F7FA]">
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.base_model}</TableCell>
                    <TableCell>{t.lora_rank}/{t.lora_alpha}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_STYLE[t.status]}>{FINETUNE_STATUS_LABEL[t.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${t.progress}%` }} />
                        </div>
                        <span className="text-xs text-[#4E5969]">{t.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-[#86909c]">
                      {t.updated_at ? new Date(t.updated_at).toLocaleString('zh-CN') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setDetail(t)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600"
                          onClick={() => handleDelete(t.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 新建任务抽屉 */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>新建微调任务</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>任务名</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如：lakeli-lora-th-01" />
            </div>
            <div>
              <Label>基座模型</Label>
              <Input value={form.base_model} onChange={(e) => setForm({ ...form, base_model: e.target.value })} />
            </div>
            <div>
              <Label>数据集路径</Label>
              <Input value={form.dataset_path} onChange={(e) => setForm({ ...form, dataset_path: e.target.value })} />
            </div>
            <div>
              <Label>LoRA Rank: {form.lora_rank}</Label>
              <Slider value={[form.lora_rank]} min={4} max={64} step={4}
                onValueChange={(v) => setForm({ ...form, lora_rank: v[0] })} />
            </div>
            <div>
              <Label>LoRA Alpha: {form.lora_alpha}</Label>
              <Slider value={[form.lora_alpha]} min={8} max={128} step={8}
                onValueChange={(v) => setForm({ ...form, lora_alpha: v[0] })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>取消</Button>
            <Button onClick={handleCreate} disabled={submitting} className="bg-primary hover:bg-primary/90">
              {submitting ? '提交中…' : '创建并构建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情抽屉：状态流水线 + 评测报告 */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>任务详情 · {detail?.name}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-5 py-2">
              <div>
                <div className="text-sm font-medium mb-2">状态流水线</div>
                <div className="flex items-center gap-1">
                  {PIPELINE.map((s, i) => {
                    const idx = PIPELINE.indexOf(detail.status === 'failed' ? 'failed' : detail.status);
                    const active = detail.status === 'failed' ? false : i <= idx;
                    return (
                      <div key={s} className="flex-1 flex items-center">
                        <div className={`flex-1 h-1.5 rounded-full ${active ? 'bg-primary' : 'bg-gray-100'}`} />
                        <span className={`ml-1 text-[10px] ${active ? 'text-primary' : 'text-gray-400'}`}>
                          {FINETUNE_STATUS_LABEL[s]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {detail.status === 'failed' && (
                  <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> 任务失败
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-[#86909c]">基座：</span>{detail.base_model}</div>
                <div><span className="text-[#86909c]">LoRA：</span>{detail.lora_rank}/{detail.lora_alpha}</div>
                <div><span className="text-[#86909c]">百炼 task：</span>{detail.task_id || '-'}</div>
                <div><span className="text-[#86909c]">数据集：</span>{detail.dataset_path || '-'}</div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> 评测报告
                </div>
                {detail.eval_report ? (
                  <div className="bg-[#F5F7FA] rounded-lg p-3 text-sm space-y-1">
                    <div>用例数：{detail.eval_report.total}</div>
                    <div>通过：{detail.eval_report.passed}（{detail.eval_report.pass_rate}）</div>
                    <div>结论：{detail.eval_report.conclusion}</div>
                    {detail.eval_report.reasons && (
                      <div className="text-xs text-[#86909c]">
                        失败原因：{Object.entries(detail.eval_report.reasons).map(([k, v]) => `${k}×${v}`).join('，')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-[#86909c]">评测尚未执行</div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetail(null)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
