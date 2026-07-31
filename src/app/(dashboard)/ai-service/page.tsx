'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Eye, MessageSquare, UserCheck, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { fetchAiServiceRecords, type AiServiceChatRecord } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';
import { BviVisibilityCard } from '@/components/bvi-visibility-card';

export default function AiChatsPage() {
  const [chatRecords, setChatRecords] = useState<AiServiceChatRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedChat, setSelectedChat] = useState<AiServiceChatRecord | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAiServiceRecords('chats');
        setChatRecords(data as AiServiceChatRecord[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleView = (chat: AiServiceChatRecord) => {
    setSelectedChat(chat);
    setShowDetail(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">全量AI对话记录</h1>
          <p className="text-sm text-gray-500 mt-1">查看所有AI客服对话记录与留资情况</p>
        </div>
          <Button variant="outline" onClick={() => exportToCsv('AI客服会话记录.csv', ['客户', '提问内容', '置信度', '人工介入', '是否留资', '时间'], chatRecords.map((r) => [r.customerName, r.question, r.confidence, r.isHumanIntervention ? '是' : '否', r.isConverted ? '是' : '否', r.createdAt]))}>
            <Download className="mr-2 h-4 w-4" />
            导出记录
          </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F4FF]">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">2,350</div>
            <div className="text-xs text-gray-500">总对话量</div>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8FFEA]">
            <UserCheck className="h-5 w-5 text-[#00B42A]" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">80%</div>
            <div className="text-xs text-gray-500">AI自动解决率</div>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF7E6]">
            <FileText className="h-5 w-5 text-[#FF7D00]" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">52</div>
            <div className="text-xs text-gray-500">有效线索</div>
          </div>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFECE8]">
            <MessageSquare className="h-5 w-5 text-[#F53F3F]" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">470</div>
            <div className="text-xs text-gray-500">人工介入</div>
          </div>
        </div>
      </div>

      {/* F5.8 客服工作台嵌入客户品牌 AI 可见度（BVI） */}
      <BviVisibilityCard title="客户 AI 可见度 (BVI)" defaultBrand="智推AI客服" />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="搜索客户/对话内容" className="pl-10" />
        </div>
        <Button className="bg-[#00B42A] hover:bg-[#00B42A]/90">查询</Button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">客户</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">提问内容</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">置信度</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">人工介入</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">是否留资</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                  <Loader2 className="inline h-4 w-4 animate-spin mr-2" />加载中...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[#F53F3F]">{error}</td>
              </tr>
            ) : chatRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-400">暂无数据</td>
              </tr>
            ) : (
              chatRecords.map((chat) => (
                <tr key={chat.id} className="border-b border-gray-50 hover:bg-[#F0FFF4] transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{chat.customerName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 max-w-[300px] truncate">{chat.question}</td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${chat.confidence >= 0.9 ? 'text-[#00B42A]' : chat.confidence >= 0.8 ? 'text-[#FF7D00]' : 'text-[#F53F3F]'}`}>
                      {(chat.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {chat.isHumanIntervention ? (
                      <Badge variant="secondary" className="text-xs bg-[#FFF7E6] text-[#FF7D00]">是</Badge>
                    ) : (
                      <span className="text-xs text-gray-400">否</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {chat.isConverted ? (
                      <Badge className="text-xs bg-[#E8FFEA] text-[#00B42A] border-0">已留资</Badge>
                    ) : (
                      <span className="text-xs text-gray-400">否</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{chat.createdAt}</td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleView(chat)}>
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      查看对话
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Chat Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>对话快照</DialogTitle>
          </DialogHeader>
          {selectedChat && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>客户: {selectedChat.customerName}</span>
                <span>|</span>
                <span>{selectedChat.createdAt}</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6F4FF] text-xs text-primary">客</div>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-800">
                    {selectedChat.question}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8FFEA] text-xs text-[#00B42A]">AI</div>
                  <div className="rounded-lg bg-[#F0FFF4] p-3 text-sm text-gray-800">
                    {selectedChat.answer}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>置信度: {(selectedChat.confidence * 100).toFixed(0)}%</span>
                <span>人工介入: {selectedChat.isHumanIntervention ? '是' : '否'}</span>
                <span>留资: {selectedChat.isConverted ? '是' : '否'}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetail(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
