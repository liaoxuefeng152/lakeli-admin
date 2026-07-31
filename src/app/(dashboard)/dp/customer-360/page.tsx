'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Phone, Building } from 'lucide-react';
import { fetchCustomerList, fetchCustomer360, type Customer360 } from '@/lib/services/data-platform-api';
import { Eye } from 'lucide-react';

interface BviMetrics {
  ai_recommendation_rate: number;
  top1_rate: number;
  positive_ratio: number;
  a_sov: number;
}
interface BviData {
  keyword: string;
  bvi: number;
  bvi_level: string;
  bvi_delta?: number | null;
  metrics?: BviMetrics;
  platform_details?: unknown[];
}

export default function Customer360Page() {
  const [list, setList] = useState<{ customer_id: string; source_id: string }[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [data, setData] = useState<Customer360 | null>(null);
  const [loading, setLoading] = useState(false);
  const [bvi, setBvi] = useState<BviData | null>(null);

  useEffect(() => {
    fetchCustomerList().then(setList).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setBvi(null);
    fetchCustomer360(selected)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [selected]);

  // F5.8 嵌入 BVI：若该主体同时是 GEO 监测品牌，拉取其 AI 可见度
  useEffect(() => {
    if (!selected || !data) return;
    const brand = data.profile?.source_id || selected;
    fetch(`/api/geo/monitoring?keyword=${encodeURIComponent(brand)}`)
      .then((r) => r.json())
      .then((j) => setBvi(j.success ? j.current : null))
      .catch(() => setBvi(null));
  }, [selected, data]);

  const s = data?.summary;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户 360</h1>
          <p className="mt-1 text-sm text-gray-500">跨模块身份归并 · 同一客户在龙掌柜/外呼/线索/营收中的全量痕迹</p>
        </div>
        <select
          className="rounded-md border px-3 py-2 text-sm min-w-[260px]"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">选择客户…</option>
          {list.map((c) => (
            <option key={c.customer_id} value={c.customer_id}>
              {c.source_id || c.customer_id}
            </option>
          ))}
        </select>
      </div>

      {!selected && (
        <div className="text-center text-gray-400 py-16">请选择一位客户查看 360 视图</div>
      )}

      {selected && loading && <div className="text-center text-gray-400 py-12">加载中…</div>}

      {selected && data && (
        <>
          {/* 概览卡 */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="线索数" value={s?.leadCount ?? 0} color="#1677FF" />
            <Stat label="外呼数" value={s?.callCount ?? 0} color="#13C2C2" />
            <Stat label="对话数" value={s?.chatCount ?? 0} color="#722ED1" />
            <Stat label="累计营收" value={`¥${(s?.totalRevenue ?? 0).toLocaleString()}`} color="#00B42A" />
            <Stat label="通话时长" value={`${s?.totalCallDuration ?? 0}s`} color="#FF7D00" />
          </div>

          {/* F5.8 品牌 AI 可见度（BVI） */}
          {bvi && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#1677FF]" /> 品牌 AI 可见度（BVI）
                </CardTitle>
                <CardDescription>
                  该主体在 AI 平台的可见度 · 数据来源：域途 GEO（{bvi.keyword}）· 已注册为指标平台 geo_bvi_trend 全产品可查
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  <BviStat label="BVI 指数" value={bvi.bvi} tone={BVI_TONE[bvi.bvi_level] || '#FF7D00'} />
                  <BviStat label="AI推荐率" value={`${bvi.metrics?.ai_recommendation_rate ?? 0}%`} />
                  <BviStat label="首位率" value={`${bvi.metrics?.top1_rate ?? 0}%`} />
                  <BviStat label="正向情感" value={`${bvi.metrics?.positive_ratio ?? 0}%`} />
                  <BviStat label="竞品SOV" value={`${bvi.metrics?.a_sov ?? 0}%`} />
                  <BviStat label="覆盖平台" value={bvi.platform_details?.length ?? 0} />
                </div>
                {bvi.bvi_delta != null && (
                  <p className="mt-3 text-xs text-gray-500">
                    较上一周期变化{" "}
                    <span className={bvi.bvi_delta >= 0 ? "text-green-600" : "text-red-600"}>
                      {bvi.bvi_delta >= 0 ? "+" : ""}
                      {bvi.bvi_delta}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          {bvi === null && selected && data && (
            <Card>
              <CardContent className="py-6 text-center text-sm text-gray-400">
                该主体暂无 GEO 可见度（BVI）数据——非品牌主体或尚未在域途 GEO 中监测
              </CardContent>
            </Card>
          )}

          {/* 档案 + 身份 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">主数据档案</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row icon={<User className="h-4 w-4" />} k="客户ID" v={data.profile.customer_id} />
                <Row icon={<Building className="h-4 w-4" />} k="来源系统" v={data.profile.source_system} />
                <Row icon={<Phone className="h-4 w-4" />} k="身份键" v={data.profile.source_id} />
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">统一档案</p>
                  <pre className="rounded bg-gray-50 p-2 text-xs overflow-auto">{JSON.stringify(data.profile.unified_profile_json, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">跨模块身份映射</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.identities.map((i, idx) => (
                    <span key={idx} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      {i.source_system} → {i.source_id}
                    </span>
                  ))}
                  {data.identities.length === 0 && <span className="text-gray-400 text-sm">无映射</span>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 明细 */}
          <Section title="线索记录" rows={data.leads} cols={['month', 'industry', 'source', 'intent_level', 'follow_up_status']} />
          <Section title="外呼记录" rows={data.calls} cols={['month', 'task_name', 'phone', 'duration', 'status', 'intent_tag']} />
          <Section title="营收记录" rows={data.revenue} cols={['month', 'plan', 'amount', 'status']} />
          <Section title="对话记录" rows={data.chats} cols={['month', 'source_system', 'tokens_used']} />
        </>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 text-xl font-bold" style={{ color }}>{value}</p>
      </CardContent>
    </Card>
  );
}

function Row({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <span className="text-gray-500 w-20">{k}</span>
      <span className="font-mono text-xs text-gray-800 break-all">{v}</span>
    </div>
  );
}

function Section({ title, rows, cols }: { title: string; rows: Record<string, unknown>[]; cols: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}（{rows.length}）</CardTitle></CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">该客户在此模块暂无关联记录</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  {cols.map((c) => <th key={c} className="py-2 pr-4 font-medium">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {cols.map((c) => <td key={c} className="py-2 pr-4 text-gray-700">{String(r[c] ?? '—')}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const BVI_TONE: Record<string, string> = {
  excellent: '#00B42A',
  good: '#1677FF',
  medium: '#FF7D00',
  weak: '#F53F39',
};

function BviStat({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 text-xl font-bold" style={{ color: tone || '#1677FF' }}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
