"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Users,
  Eye,
} from "lucide-react";

const CLIENTS = ["域途GEO", "SEO大师", "AI优化王", "智推客服", "拉客力", "域途跨境"];

type ClientBvi = {
  name: string;
  ok: boolean;
  bvi?: number;
  bvi_level?: "excellent" | "good" | "medium" | "weak";
  trend?: { bvi: number }[];
  metrics?: { ai_recommendation_rate?: number; top1_rate?: number };
  platform_details?: unknown[];
  alerts?: { title: string }[];
};

const LEVEL_TONE: Record<string, string> = {
  excellent: "#00B42A",
  good: "#1677FF",
  medium: "#FF7D00",
  weak: "#F53F39",
};

export default function AgencyPage() {
  const [clients, setClients] = useState<ClientBvi[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const results = await Promise.all(
      CLIENTS.map(async (name) => {
        try {
          const res = await fetch(`/api/geo/monitoring?keyword=${encodeURIComponent(name)}`);
          const json = await res.json();
          if (json.success) return { name, ...json.current, ok: true };
        } catch {
          /* ignore */
        }
        return { name, ok: false };
      })
    );
    setClients(results);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valid = clients.filter((c) => c.ok);
  const avgBvi = valid.length
    ? Math.round(valid.reduce((s, c) => s + (c.bvi || 0), 0) / valid.length)
    : 0;
  const atRisk = valid.filter((c) => (c.bvi_level === "weak" || c.bvi_level === "medium")).length;
  const totalAlerts = valid.reduce((s, c) => s + (c.alerts?.length || 0), 0);

  const kpis = [
    { label: "在管客户", value: clients.length, icon: Users, color: "#1677FF" },
    { label: "平均 BVI", value: avgBvi, icon: Eye, color: LEVEL_TONE[avgBvi >= 70 ? "excellent" : avgBvi >= 50 ? "good" : avgBvi >= 35 ? "medium" : "weak"] },
    { label: "风险客户", value: atRisk, icon: AlertTriangle, color: "#F53F39" },
    { label: "活跃预警", value: totalAlerts, icon: TrendingUp, color: "#FF7D00" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">代理商后台 · 客户 BVI 看板</h1>
          <p className="text-sm text-gray-500">一站式监测所服务客户的 AI 可见度（BVI）健康度，分钟级刷新</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${k.color}1a` }}>
                  <Icon className="w-5 h-5" style={{ color: k.color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{k.label}</p>
                  <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {loading && <div className="text-center text-gray-400 py-12">加载客户 BVI 中…</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map((c) => {
          const tone = LEVEL_TONE[c.bvi_level ?? "medium"] || "#FF7D00";
          return (
            <Card key={c.name} className="hover:shadow-md transition">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" /> {c.name}
                </CardTitle>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${tone}1a`, color: tone }}
                >
                  {c.bvi_level === "excellent" ? "优秀" : c.bvi_level === "good" ? "良好" : c.bvi_level === "medium" ? "中等" : c.bvi_level === "weak" ? "偏弱" : "—"}
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                {c.ok ? (
                  <>
                    <div className="flex items-end gap-4">
                      <div>
                        <div className="text-3xl font-bold" style={{ color: tone }}>{c.bvi}</div>
                        <div className="text-xs text-gray-400">BVI 指数</div>
                      </div>
                      <div className="flex-1 h-14">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={c.trend || []}>
                            <Line type="monotone" dataKey="bvi" stroke={tone} strokeWidth={2} dot={false} />
                            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-gray-50 py-2">
                        <div className="text-sm font-bold text-gray-900">{c.metrics?.ai_recommendation_rate ?? 0}%</div>
                        <div className="text-[10px] text-gray-400">AI推荐率</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 py-2">
                        <div className="text-sm font-bold text-gray-900">{c.metrics?.top1_rate ?? 0}%</div>
                        <div className="text-[10px] text-gray-400">首位率</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 py-2">
                        <div className="text-sm font-bold text-gray-900">{c.platform_details?.length ?? 0}</div>
                        <div className="text-[10px] text-gray-400">覆盖平台</div>
                      </div>
                    </div>

                    {c.alerts && c.alerts.length > 0 && (
                      <div className="text-xs text-amber-600 flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{c.alerts[0]?.title}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-400 py-6 text-sm">暂无可监测数据</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
