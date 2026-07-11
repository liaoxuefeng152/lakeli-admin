'use client';

import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const feedbackStats = [
  { month: '1月', likes: 320, dislikes: 28 },
  { month: '2月', likes: 385, dislikes: 32 },
  { month: '3月', likes: 420, dislikes: 25 },
  { month: '4月', likes: 398, dislikes: 35 },
  { month: '5月', likes: 480, dislikes: 22 },
  { month: '6月', likes: 520, dislikes: 30 },
  { month: '7月', likes: 560, dislikes: 18 },
];

const recentFeedback = [
  { id: 'F001', customer: '深圳跨境通科技有限公司', type: 'like', question: 'GEO专业版支持哪些AI搜索引擎？', date: '2026-07-10 15:30' },
  { id: 'F002', customer: '东莞精密工业设备有限公司', type: 'like', question: '你们支持外贸行业吗？', date: '2026-07-10 14:20' },
  { id: 'F003', customer: '广州本地生活服务有限公司', type: 'dislike', question: '帮我推荐一个方案', date: '2026-07-10 13:10' },
  { id: 'F004', customer: '深圳创新科技集团', type: 'like', question: 'AI客服能接入企微吗？', date: '2026-07-10 11:45' },
  { id: 'F005', customer: '佛山外贸制造有限公司', type: 'dislike', question: '诊断报告内容太少了', date: '2026-07-10 10:30' },
];

export default function FeedbackPage() {
  const totalLikes = feedbackStats.reduce((sum, m) => sum + m.likes, 0);
  const totalDislikes = feedbackStats.reduce((sum, m) => sum + m.dislikes, 0);
  const satisfactionRate = ((totalLikes / (totalLikes + totalDislikes)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">用户反馈统计</h1>
        <p className="text-sm text-gray-500 mt-1">AI客服对话的点赞/差评数据分析</p>
      </div>

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
            <MessageSquare className="h-5 w-5 text-[#1677FF]" />
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
            <div className="text-xl font-bold text-gray-900">2</div>
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
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
            </tr>
          </thead>
          <tbody>
            {recentFeedback.map((f) => (
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
                <td className="px-5 py-4 text-sm text-gray-500">{f.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
