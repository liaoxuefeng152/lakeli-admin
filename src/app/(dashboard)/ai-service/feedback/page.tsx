'use client';

import { useEffect, useState, useMemo } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { fetchAiServiceRecords, type AiFeedbackData } from '@/lib/services/admin-api';
import { analyzeBatch, type SentimentLabel } from '@/lib/sentiment';

export default function FeedbackPage() {
  const [data, setData] = useState<AiFeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await fetchAiServiceRecords('feedback');
        setData(d as AiFeedbackData);
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const feedbackStats = data?.chart || [];
  const recentFeedback = data?.recent || [];
  const stats = data?.stats;
  const totalLikes = stats?.totalLikes ?? 0;
  const totalDislikes = stats?.totalDislikes ?? 0;
  const satisfactionRate = stats?.satisfactionRate ?? 0;
  const pendingDislikes = stats?.pendingDislikes ?? 0;

  // F1.2 真实情感 NLP：对每条反馈的「对话问题」做本地词典式情感分析（可复现、无需后端）
  const sentiment = useMemo(
    () => analyzeBatch((data?.recent || []).map((f) => f.question)),
    [data]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">用户反馈统计</h1>
        <p className="text-sm text-gray-500 mt-1">AI客服对话的点赞/差评数据分析</p>
      </div>

      {loading && <div className="text-sm text-gray-400 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />加载中...</div>}
      {error && <div className="text-sm text-[#F53F3F]">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8FFEA]">
            <ThumbsUp className="h-5 w-5 text-[#00B42A]" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{totalLikes.toLocaleString()}</div>
            <div className="text-xs text-gray-500">总点赞数</div>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFECE8]">
            <ThumbsDown className="h-5 w-5 text-[#F53F3F]" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{totalDislikes}</div>
            <div className="text-xs text-gray-500">总差评数</div>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F4FF]">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{satisfactionRate}%</div>
            <div className="text-xs text-gray-500">满意度</div>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF7E6]">
            <ThumbsDown className="h-5 w-5 text-[#FF7D00]" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{pendingDislikes}</div>
            <div className="text-xs text-gray-500">待处理差评</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">月度反馈趋势</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={feedbackStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8C97A9' }} />
              <YAxis tick={{ fontSize: 12, fill: '#8C97A9' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" name="点赞" fill="#00B42A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dislikes" name="差评" fill="#F53F3F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* F1.2 真实情感 NLP */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-1">反馈情感分析（F1.2 真实情感 NLP）</h3>
        <p className="text-xs text-gray-500 mb-4">
          基于本地中文情感词典（正向/负向词 + 否定词 + 程度副词加权）的实时 NLP 分析，无需后端调用，结果可复现。
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SentimentStat label="正向占比" value={`${sentiment.distribution.positiveRatio}%`} count={sentiment.distribution.positive} color="#00B42A" />
          <SentimentStat label="负向占比" value={`${sentiment.distribution.negativeRatio}%`} count={sentiment.distribution.negative} color="#F53F3F" />
          <SentimentStat label="中性占比" value={`${sentiment.distribution.neutralRatio}%`} count={sentiment.distribution.neutral} color="#8C97A9" />
          <SentimentStat label="平均情感分" value={sentiment.distribution.avgScore.toFixed(2)} count={sentiment.distribution.total} color="#1677FF" />
        </div>
        <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div style={{ width: `${sentiment.distribution.positiveRatio}%`, backgroundColor: '#00B42A' }} />
          <div style={{ width: `${sentiment.distribution.negativeRatio}%`, backgroundColor: '#F53F3F' }} />
          <div style={{ width: `${sentiment.distribution.neutralRatio}%`, backgroundColor: '#8C97A9' }} />
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">最近反馈记录</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">反馈类型</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">对话问题</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">情感</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
            </tr>
          </thead>
          <tbody>
            {recentFeedback.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">暂无数据</td>
              </tr>
            ) : (
              recentFeedback.map((f, idx) => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-[#F0FFF4] transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{f.customer}</td>
                  <td className="px-5 py-4">
                    {f.type === 'like' ? (
                      <span className="flex items-center gap-1 text-xs text-[#00B42A]">
                        <ThumbsUp className="h-3 w-3" /> 点赞
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-[#F53F3F]">
                        <ThumbsDown className="h-3 w-3" /> 差评
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{f.question}</td>
                  <td className="px-5 py-4 text-sm"><SentimentBadge label={sentiment.results[idx]?.label ?? 'neutral'} /></td>
                  <td className="px-5 py-4 text-sm text-gray-500">{f.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SentimentBadge({ label }: { label: SentimentLabel }) {
  const map: Record<SentimentLabel, { text: string; cls: string }> = {
    positive: { text: '正向', cls: 'bg-[#E8FFEA] text-[#00B42A]' },
    negative: { text: '负向', cls: 'bg-[#FFECE8] text-[#F53F3F]' },
    neutral: { text: '中性', cls: 'bg-gray-100 text-gray-500' },
  };
  const m = map[label];
  return <span className={`text-xs px-2 py-0.5 rounded-full ${m.cls}`}>{m.text}</span>;
}

function SentimentStat({ label, value, count, color }: { label: string; value: string; count: number; color: string }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-bold" style={{ color }}>{value}</div>
      <div className="mt-0.5 text-xs text-gray-400">{count} 条</div>
    </div>
  );
}
