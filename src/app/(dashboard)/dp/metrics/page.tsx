'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { RefreshCw, Plus, Trash2, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {
  fetchMetrics, fetchMetricDefinitions, createMetricDefinition, deleteMetricDefinition,
  triggerSync, type MetricResult, type MetricDefinition,
} from '@/lib/services/data-platform-api';

const THEME = '#13C2C2';
const CHART_COLORS = ['#13C2C2', '#1677FF', '#00B42A', '#FF7D00', '#722ED1', '#F53F39'];

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricResult[]>([]);
  const [defs, setDefs] = useState<MetricDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', sql_template: '', chart_type: 'line', dimensions: '' });

  const load = () => {
    setLoading(true);
    Promise.all([fetchMetricDefinitions('enabled'), fetchMetrics()])
      .then(([d, m]) => { setDefs(d); setMetrics(m); })
      .catch((e) => toast.error('加载失败: ' + e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onSync = async () => {
    setSyncing(true);
    try {
      const r = await triggerSync();
      toast.success('同步完成: ' + r.map((x) => `${x.step}(${x.affected})`).join(', '));
      load();
    } catch (e) { toast.error('同步失败: ' + (e as Error).message); }
    finally { setSyncing(false); }
  };

  const onAdd = async () => {
    if (!form.name || !form.title || !form.sql_template) { toast.error('name/title/sql_template 必填'); return; }
    try {
      await createMetricDefinition({
        name: form.name, title: form.title, sql_template: form.sql_template,
        chart_type: form.chart_type, dimensions: form.dimensions.split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('指标已添加');
      setForm({ name: '', title: '', sql_template: '', chart_type: 'line', dimensions: '' });
      setShowForm(false);
      load();
    } catch (e) { toast.error('添加失败: ' + (e as Error).message); }
  };

  const onDelete = async (id: string) => {
    try { await deleteMetricDefinition(id); toast.success('已删除'); load(); }
    catch (e) { toast.error('删除失败: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">指标平台</h1>
          <p className="mt-1 text-sm text-gray-500">配置驱动 · 指标一次定义、处处可用（消灭硬编码 SQL）</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowForm((v) => !v)}>
            <Plus className="mr-2 h-4 w-4" />新增指标
          </Button>
          <Button onClick={onSync} disabled={syncing} style={{ backgroundColor: THEME }}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? '同步中…' : '同步数据'}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">新增指标定义</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input placeholder="标识(英文, 如 monthly_revenue)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="中文名(如 月度营收)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select className="rounded-md border px-3 py-2 text-sm" value={form.chart_type} onChange={(e) => setForm({ ...form, chart_type: e.target.value })}>
              <option value="line">折线图 line</option>
              <option value="bar">柱状图 bar</option>
              <option value="pie">饼图 pie</option>
            </select>
            <Input placeholder="可下钻维度(逗号分隔, 如 plan,tenant_id)" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} />
            <div className="md:col-span-2">
              <Textarea
                rows={4}
                placeholder="SQL 模板（须返回 dim / val 两列，过滤条件处写 --FILTERS--）&#10;例: SELECT to_char(created_at,'YYYY-MM') AS dim, COUNT(*)::int AS val FROM admin.customers --FILTERS-- GROUP BY 1 ORDER BY 1"
                value={form.sql_template}
                onChange={(e) => setForm({ ...form, sql_template: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>取消</Button>
              <Button onClick={onAdd} style={{ backgroundColor: THEME }}>保存</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-12">加载中…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {metrics.map((m) => (
              <MetricChart key={m.name} metric={m} />
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-5 w-5" style={{ color: THEME }} />指标定义（{defs.length}）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-gray-500">
                      <th className="py-2 pr-4">标识</th><th className="py-2 pr-4">名称</th>
                      <th className="py-2 pr-4">图表</th><th className="py-2 pr-4">归属</th><th className="py-2 pr-4">状态</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {defs.map((d) => (
                      <tr key={d.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-mono text-xs">{d.name}</td>
                        <td className="py-2 pr-4">{d.title}</td>
                        <td className="py-2 pr-4 text-gray-500">{d.chart_type}</td>
                        <td className="py-2 pr-4 text-gray-500">{d.owner_module || '—'}</td>
                        <td className="py-2 pr-4">{d.status}</td>
                        <td className="py-2 pr-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => onDelete(d.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function MetricChart({ metric }: { metric: MetricResult }) {
  const data = metric.rows;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{metric.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="py-12 text-center text-gray-400">暂无数据（点击「同步数据」）</div>
        ) : metric.chart_type === 'pie' ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data} dataKey="val" nameKey="dim" outerRadius={100} label>
                {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : metric.chart_type === 'bar' ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dim" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip /><Legend />
              <Bar dataKey="val" name={metric.title} fill={THEME} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dim" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="val" name={metric.title} stroke={THEME} strokeWidth={2.5} dot={{ r: 4 }} />
              {data[0] && 'converted' in data[0] && (
                <Line type="monotone" dataKey="converted" name="已转化" stroke="#FF7D00" strokeWidth={2} dot={{ r: 3 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
