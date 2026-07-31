'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  MessageSquare, Building2, Target, Wallet, Phone, Network, Bot,
  RefreshCw, LayoutDashboard, Globe, Headphones,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import {
  fetchDashboard, fetchOutboundDashboard,
  type DashboardData, type OutboundDashboardData,
} from '@/lib/services/admin-api';
import { fetchMetrics } from '@/lib/services/data-platform-api';

// Transformed analytics shapes (from dp metrics)
interface DpDashboardData {
  monthlyRevenue: { month: string; revenue: number }[];
  industryDistribution: { name: string; value: number }[];
  planDistribution: { name: string; value: number }[];
  leadStats: { month: string; leads: number; converted: number }[];
  keImportTrend: { month: string; geo: number; knowledge: number }[];
  keTenantGrowth: { month: string; tenants: number }[];
}

const CHART_COLORS = ['#1677FF', '#00B42A', '#FF7D00', '#F53F39', '#722ED1', '#13C2C2', '#EB2F96', '#FAAD14'];

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const fmtMoney = (n: number) => '¥' + n.toLocaleString('zh-CN');

const EmptyHint = ({ text = '暂无数据' }: { text?: string }) => (
  <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">{text}</div>
);

interface Kpi {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  suffix?: string;
  money?: boolean;
  accent: string;
}

export default function DashboardPage() {
  const [dash, setDash] = useState<DashboardData | null>(null);
  const [dpData, setDpData] = useState<DpDashboardData | null>(null);
  const [outbound, setOutbound] = useState<OutboundDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  /** Transform MetricResult[] from dp/metrics → DpDashboardData */
  const transformDpMetrics = (metrics: Array<{ name: string; rows: Record<string, unknown>[] }>): DpDashboardData => {
    const find = (name: string) => metrics.find(m => m.name === name)?.rows ?? [];

    return {
      monthlyRevenue: find('monthly_revenue').map(r => ({ month: String(r.dim || ''), revenue: Number(r.val) || 0 })),
      industryDistribution: find('industry_distribution').map(r => ({ name: String(r.dim || ''), value: Number(r.val) || 0 })),
      planDistribution: find('plan_distribution').map(r => ({ name: String(r.dim || ''), value: Number(r.val) || 0 })),
      leadStats: find('lead_conversion').map(r => ({ month: String(r.dim || ''), leads: Number(r.val) || 0, converted: Number(r.converted) || 0 })),
      keImportTrend: find('ke_import_trend').map(r => ({ month: String(r.dim || ''), geo: Number(r.geo) || 0, knowledge: Number(r.knowledge) || 0 })),
      keTenantGrowth: find('ke_tenant_growth').map(r => ({ month: String(r.dim || ''), tenants: Number(r.val) || 0 })),
    };
  };

  const load = async () => {
    setLoading(true);
    setErrors([]);
    const [d, m, o] = await Promise.allSettled([
      fetchDashboard(),
      fetchMetrics(['monthly_revenue', 'industry_distribution', 'plan_distribution', 'lead_conversion', 'ke_import_trend', 'ke_tenant_growth']),
      fetchOutboundDashboard(),
    ]);
    const errs: string[] = [];
    if (d.status === 'fulfilled') setDash(d.value); else errs.push('工作台概览');
    if (m.status === 'fulfilled') setDpData(transformDpMetrics(m.value)); else errs.push('数据中台指标');
    if (o.status === 'fulfilled') setOutbound(o.value); else errs.push('智能外呼');
    setErrors(errs);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const o = dash?.overview;
  const totalCustomers = dpData ? sum(dpData.planDistribution.map((p) => p.value)) : 0;
  const totalLeads = dpData ? sum(dpData.leadStats.map((l) => l.leads)) : 0;
  const totalRevenue = dpData ? sum(dpData.monthlyRevenue.map((r) => r.revenue)) : 0;
  const totalTenants =
    dpData && dpData.keTenantGrowth.length
      ? dpData.keTenantGrowth[dpData.keTenantGrowth.length - 1].tenants
      : 0;

  const kpis: Kpi[] = [
    { label: '龙掌柜 AI 用户', value: o?.total_users ?? 0, icon: Bot, suffix: '人', accent: 'bg-primary' },
    { label: '龙掌柜 会话', value: o?.total_sessions ?? 0, icon: MessageSquare, suffix: '次', accent: 'bg-primary' },
    { label: '龙掌柜 消息', value: o?.total_messages ?? 0, icon: MessageSquare, suffix: '条', accent: 'bg-primary' },
    { label: '全域客户', value: totalCustomers, icon: Building2, suffix: '家', accent: 'bg-[#0F52BA]' },
    { label: '全域线索', value: totalLeads, icon: Target, suffix: '条', accent: 'bg-[#0F52BA]' },
    { label: '累计营收', value: totalRevenue, icon: Wallet, money: true, accent: 'bg-[#00B42A]' },
    { label: '智能外呼通话', value: outbound?.stats.totalCalls ?? 0, icon: Phone, suffix: '通', accent: 'bg-primary' },
    { label: '数据中台租户', value: totalTenants, icon: Network, suffix: '个', accent: 'bg-[#722ED1]' },
  ];

  const modules = [
    { label: '龙掌柜 AI 助手', desc: '会话 · 技能 · 模型 · 素材', href: '/lzg/dashboard', icon: Bot, color: 'text-primary' },
    { label: '域途 GEO SaaS', desc: '诊断 · 文案 · 关键词 · 监测', href: '/geo', icon: Globe, color: 'text-[#0F52BA]' },
    { label: '智推 AI 客服', desc: '对话 · 关键词 · 配额', href: '/ai-service', icon: Headphones, color: 'text-[#00B42A]' },
    { label: '智能外呼', desc: '任务 · 通话 · 报表', href: '/outbound-call', icon: Phone, color: 'text-primary' },
    { label: '跨境外贸知识引擎', desc: '知识空间 · 租户 · 日志', href: '/knowledge-engine', icon: Network, color: 'text-[#722ED1]' },
    { label: '平台管理', desc: '账号 · 客户 · 订单 · 配置', href: '/customers', icon: LayoutDashboard, color: 'text-gray-700' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">加载概览数据...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">拉克力管理后台 · 概览仪表盘</h2>
          <p className="text-sm text-gray-500 mt-1">全业务模块核心运营指标统一汇总</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          以下数据源暂不可用（后端未运行或接口异常）：{errors.join('、')}。已展示其余可用数据。
          <Button variant="link" className="h-auto p-0 ml-2 text-amber-800" onClick={load}>重试</Button>
        </div>
      )}

      {/* 平台核心指标 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{k.label}</span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${k.accent} text-white`}>
                <k.icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">
              {k.money ? fmtMoney(k.value) : k.value.toLocaleString('zh-CN')}
              {!k.money && k.suffix && <span className="ml-1 text-sm font-normal text-gray-400">{k.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 营收 + 龙掌柜近7天活跃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>月度营收趋势</CardTitle></CardHeader>
          <CardContent>
            {dpData && dpData.monthlyRevenue.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dpData.monthlyRevenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v: number | string) => `¥${Number(v).toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" name="营收" stroke="#1677FF" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyHint />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>龙掌柜近 7 天活跃</CardTitle></CardHeader>
          <CardContent>
            {dash && dash.trend.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dash.trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sessions" name="会话" stroke="#1677FF" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="messages" name="消息" stroke="#00B42A" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="new_users" name="新增用户" stroke="#FF7D00" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyHint text="暂无龙掌柜活跃数据" />}
          </CardContent>
        </Card>
      </div>

      {/* 客户行业 + 套餐分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>客户行业分布</CardTitle></CardHeader>
          <CardContent>
            {dpData && dpData.industryDistribution.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={dpData.industryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {dpData.industryDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyHint text="暂无客户数据" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>客户套餐分布</CardTitle></CardHeader>
          <CardContent>
            {dpData && dpData.planDistribution.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={dpData.planDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {dpData.planDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyHint text="暂无客户数据" />}
          </CardContent>
        </Card>
      </div>

      {/* 线索转化 + 外呼趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>线索转化趋势</CardTitle></CardHeader>
          <CardContent>
            {dpData && dpData.leadStats.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dpData.leadStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" name="总线索" fill="#1677FF" />
                  <Bar dataKey="converted" name="已转化" fill="#00B42A" />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyHint text="暂无线索数据" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>智能外呼趋势</CardTitle></CardHeader>
          <CardContent>
            {outbound && outbound.trend.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={outbound.trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="calls" name="呼叫" stroke="#1677FF" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="connected" name="接通" stroke="#00B42A" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="leads" name="线索" stroke="#FF7D00" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyHint text="暂无外呼数据" />}
          </CardContent>
        </Card>
      </div>

      {/* 数据中台趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>数据中台导入趋势</CardTitle></CardHeader>
          <CardContent>
            {dpData && dpData.keImportTrend.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dpData.keImportTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="knowledge" name="知识缺口" fill="#1677FF" />
                  <Bar dataKey="geo" name="GEO 内容" fill="#FF7D00" />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyHint text="暂无数据中台数据" />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>数据中台租户增长</CardTitle></CardHeader>
          <CardContent>
            {dpData && dpData.keTenantGrowth.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dpData.keTenantGrowth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tenants" name="租户数" stroke="#722ED1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyHint text="暂无数据中台数据" />}
          </CardContent>
        </Card>
      </div>

      {/* 龙掌柜技能调用排行 */}
      <Card>
        <CardHeader><CardTitle>龙掌柜技能调用排行</CardTitle></CardHeader>
        <CardContent>
          {dash && dash.skillRank.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dash.skillRank} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="skill" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" name="调用次数" fill="#1677FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyHint text="暂无技能调用数据" />}
        </CardContent>
      </Card>

      {/* 模块入口 */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">业务模块</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <m.icon className={`h-6 w-6 ${m.color}`} />
              <div className="mt-2 text-sm font-medium text-gray-900">{m.label}</div>
              <div className="mt-0.5 text-xs text-gray-400">{m.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
