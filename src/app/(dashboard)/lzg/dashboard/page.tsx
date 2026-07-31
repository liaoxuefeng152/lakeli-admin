'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  MessageSquare, Users, Zap, Image as ImageIcon,
  TrendingUp, Clock,
} from 'lucide-react';
import { fetchLzgDashboard, type LzgDashboardData } from '@/lib/services/admin-api';
import { BviVisibilityCard } from '@/components/bvi-visibility-card';

export default function LzgDashboardPage() {
  const [data, setData] = useState<LzgDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLzgDashboard()
      .then(setData)
      .catch((e) => toast.error('加载看板数据失败: ' + (e instanceof Error ? e.message : String(e))))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-400">
        加载中...
      </div>
    );
  }

  const o = data?.overview;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">龙掌柜数据看板</h2>
        <p className="text-sm text-gray-500 mt-1">AI助手使用数据概览</p>
      </div>

      {/* 指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatsCard
          title="今日会话"
          value={o?.today_sessions ?? 0}
          icon={MessageSquare}
          color="blue"
        />
        <StatsCard
          title="今日消息"
          value={o?.today_messages ?? 0}
          icon={Zap}
          color="green"
        />
        <StatsCard
          title="技能总数"
          value={o?.total_skills ?? 0}
          icon={ImageIcon}
          color="purple"
        />
        <StatsCard
          title="总资产数"
          value={o?.total_assets ?? 0}
          icon={TrendingUp}
          color="orange"
        />
        <StatsCard
          title="总用户数"
          value={o?.total_users ?? 0}
          icon={Users}
          color="cyan"
        />
      </div>

      {/* F5.8 龙掌柜工作台嵌入客户品牌 AI 可见度（BVI） */}
      <BviVisibilityCard title="品牌 AI 可见度 (BVI)" defaultBrand="龙掌柜" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 趋势图 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              7天趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.trend.map((item) => (
                <div key={item.date} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-12">{item.date}</span>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 h-6 bg-blue-50 rounded flex items-center">
                      <div
                        className="h-full bg-blue-500 rounded-l"
                        style={{ width: `${Math.min((item.sessions / 300) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-blue-600 w-10 text-right">{item.sessions}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 h-6 bg-green-50 rounded flex items-center">
                      <div
                        className="h-full bg-green-500 rounded-l"
                        style={{ width: `${Math.min((item.messages / 4500) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-green-600 w-10 text-right">{item.messages}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t text-xs text-gray-400">
                <span className="w-12" />
                <div className="flex-1 flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-blue-500" />
                  会话数
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-green-500" />
                  消息数
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 技能排行 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              技能调用排行
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data?.skillRank.map((item, idx) => {
                const colors = ['#1677FF', '#00B42A', '#FF7D00', '#722ED1', '#F53F3F', '#0FC6C2', '#F7BA1E', '#14C9C9'];
                return (
                  <div key={item.skill} className="flex items-center gap-3">
                    <span className={`w-5 text-center text-xs font-semibold ${
                      idx < 3 ? 'text-orange-500' : 'text-gray-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 h-7 bg-gray-50 rounded flex items-center relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded opacity-15"
                        style={{
                          width: `${((item.count / (data?.skillRank[0]?.count || 1)) * 100)}%`,
                          backgroundColor: colors[idx % colors.length],
                        }}
                      />
                      <span className="relative z-10 pl-3 text-sm font-medium text-gray-700">{item.skill}</span>
                    </div>
                    <span className="text-sm text-gray-500 w-16 text-right">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 活跃用户 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            活跃用户 TOP10
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 font-medium">用户</th>
                  <th className="py-2 font-medium">邮箱</th>
                  <th className="py-2 font-medium text-right">消息数</th>
                  <th className="py-2 font-medium text-center">活跃度</th>
                </tr>
              </thead>
              <tbody>
                {data?.activeUsers.map((user, idx) => {
                  const dots = Math.min(5, Math.ceil((user.message_count / 500) * 5));
                  return (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-2.5 font-medium text-gray-800">{user.name}</td>
                      <td className="py-2.5 text-gray-500">{user.email}</td>
                      <td className="py-2.5 text-right text-gray-700">{user.message_count.toLocaleString()}</td>
                      <td className="py-2.5">
                        <div className="flex items-center justify-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${i < dots ? 'bg-blue-500' : 'bg-gray-200'}`}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title, value, icon: Icon, color,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'cyan';
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {value.toLocaleString()}
            </p>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
