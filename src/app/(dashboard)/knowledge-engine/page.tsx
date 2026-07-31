'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Globe, TrendingUp, Building2, Target, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { fetchKeStats, fetchKeTenants, type KeStats, type KeTenant } from '@/lib/services/knowledge-engine-api';

const THEME = '#13C2C2';

const STATUS_STYLE: Record<string, string> = {
  启用: 'bg-green-50 text-green-600',
  待开通: 'bg-orange-50 text-orange-600',
  已停用: 'bg-gray-100 text-gray-500',
};

function exportStatsCsv(s: KeStats) {
  const rows = [
    ['指标', '数值'],
    ['租户总数(活跃/总计)', `${s.tenants.active}/${s.tenants.total}`],
    ['知识条目总量', s.knowledge.total],
    ['GEO内容总量', s.geoContent.total],
    ['实体完整率(%)', s.knowledge.avgCompleteness],
    ['问答命中率(%)', s.qa.hit_rate],
    ['待处理知识缺口', s.gaps.open],
    ['本周新增知识', s.weeklyNewKnowledge],
    ['本周新增GEO', s.weeklyNewGeo],
  ];
  const csv = '﻿' + rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'knowledge-engine-stats.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function KnowledgeEnginePage() {
  const [stats, setStats] = useState<KeStats | null>(null);
  const [tenants, setTenants] = useState<KeTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchKeStats(), fetchKeTenants({ pageSize: 8 })])
      .then(([s, t]) => {
        if (!alive) return;
        setStats(s.data);
        setTenants(t.data.list);
      })
      .catch((e) => alive && setError(e instanceof Error ? e.message : '加载失败'))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const importTrend = stats
    ? stats.trend.labels.map((m, i) => ({
        month: m,
        knowledge: stats.trend.knowledge[i] || 0,
        geo: stats.trend.geo[i] || 0,
      }))
    : [];
  const growthTrend = stats
    ? stats.trend.labels.map((m, i) => ({ month: m, tenants: stats.trend.tenants[i] || 0 }))
    : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">跨境外贸知识引擎 · 产品概览</h1>
          <p className="mt-1 text-sm text-gray-500">跨租户运营数据总览 · 外贸知识底座监控</p>
        </div>
        <Button variant="outline" size="sm" disabled={!stats} onClick={() => stats && exportStatsCsv(stats)}>
          <Download className="mr-2 h-4 w-4" />
          导出报表
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          数据加载失败：{error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label="租户总数"
          value={stats ? `${stats.tenants.active}/${stats.tenants.total}` : '—'}
          subtext="活跃/总计"
          color="#1677FF"
        />
        <StatCard
          icon={<Brain className="h-5 w-5" />}
          label="知识条目总量"
          value={stats ? stats.knowledge.total.toLocaleString() : '—'}
          subtext={stats ? `本周新增 +${stats.weeklyNewKnowledge}` : '加载中…'}
          color={THEME}
        />
        <StatCard
          icon={<Globe className="h-5 w-5" />}
          label="GEO内容总量"
          value={stats ? stats.geoContent.total.toLocaleString() : '—'}
          subtext={stats ? `本周新增 +${stats.weeklyNewGeo}` : '加载中…'}
          color="#722ED1"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="实体完整率"
          value={stats ? `${stats.knowledge.avgCompleteness}%` : '—'}
          subtext="全平台均值"
          color="#00B42A"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="问答命中率"
          value={stats ? `${stats.qa.hit_rate}%` : '—'}
          subtext="近7天均值"
          color="#FF7D00"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">知识导入与GEO内容趋势（按月）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={importTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="knowledge" name="知识条目" fill={THEME} radius={[4, 4, 0, 0]} />
                <Bar dataKey="geo" name="GEO内容" fill="#722ED1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">租户增长趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={growthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="tenants" name="租户数" stroke="#1677FF" strokeWidth={2.5} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">租户列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="py-2 pr-4 font-medium">企业名称</th>
                  <th className="py-2 pr-4 font-medium">行业</th>
                  <th className="py-2 pr-4 font-medium">联系人</th>
                  <th className="py-2 pr-4 font-medium">知识条目</th>
                  <th className="py-2 pr-4 font-medium">状态</th>
                  <th className="py-2 pr-4 font-medium">创建时间</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      加载中…
                    </td>
                  </tr>
                )}
                {!loading && tenants.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      暂无租户
                    </td>
                  </tr>
                )}
                {!loading &&
                  tenants.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">{t.company_name}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{t.industry}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{t.contact_person}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{t.knowledge_count ?? 0}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[t.status] || 'bg-gray-100 text-gray-500'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-gray-500">
                        {t.created_at ? new Date(t.created_at).toLocaleDateString('zh-CN') : '—'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white shrink-0"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
            </div>
            <p className="text-xs text-gray-400">{subtext}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
