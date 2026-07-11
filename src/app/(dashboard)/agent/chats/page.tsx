'use client';

import { useState } from 'react';
import { Search, Eye, MessageSquare, UserCheck, FileInput } from 'lucide-react';
import { agentChatRecords } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AgentChatsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');
  const [leadFilter, setLeadFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedChat, setSelectedChat] = useState<typeof agentChatRecords[0] | null>(null);

  const agents = [...new Set(agentChatRecords.map((r) => r.agentName))];

  const filtered = agentChatRecords.filter((record) => {
    const matchSearch = record.customerName.includes(searchTerm) || record.question.includes(searchTerm);
    const matchAgent = agentFilter === 'all' || record.agentName === agentFilter;
    const matchLead = leadFilter === 'all' ||
      (leadFilter === 'lead' && record.isLeadGenerated) ||
      (leadFilter === 'wecom' && record.isTransferredToWecom);
    return matchSearch && matchAgent && matchLead;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">全平台Agent对话记录</h1>
        <p className="text-sm text-gray-500 mt-1">查看拉克力Agent中台全部智能体对话数据，同步至客户360档案</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索客户名称/提问内容..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="智能体筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部智能体</SelectItem>
            {agents.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={leadFilter} onValueChange={setLeadFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="留资筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="lead">已留资</SelectItem>
            <SelectItem value="wecom">已转企微</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <FileInput className="mr-1 h-3 w-3" />
          导出
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">智能体</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">客户</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">提问内容</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Token</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">留资</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">转企微</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => (
              <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-[#FF7D00]">{record.agentName}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{record.customerName}</td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-600 max-w-[200px] truncate">{record.question}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{record.tokensUsed}</td>
                <td className="px-4 py-3">
                  {record.isLeadGenerated ? (
                    <Badge className="bg-green-50 text-green-600 border-green-200">已留资</Badge>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {record.isTransferredToWecom ? (
                    <Badge className="bg-blue-50 text-blue-600 border-blue-200">已转</Badge>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{record.createdAt}</td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedChat(record); setShowDetail(true); }}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    查看
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chat Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>对话快照详情</DialogTitle>
          </DialogHeader>
          {selectedChat && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>智能体: <span className="text-[#FF7D00] font-medium">{selectedChat.agentName}</span></span>
                <span>客户: {selectedChat.customerName}</span>
                <span>Token: {selectedChat.tokensUsed}</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">客</div>
                  <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-gray-700">
                    {selectedChat.question}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF7D00]/10 text-xs text-[#FF7D00]">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-lg bg-orange-50 px-4 py-3 text-sm text-gray-700">
                    {selectedChat.answer}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                {selectedChat.isLeadGenerated && (
                  <Badge className="bg-green-50 text-green-600 border-green-200">
                    <UserCheck className="mr-1 h-3 w-3" />
                    已产生留资
                  </Badge>
                )}
                {selectedChat.isTransferredToWecom && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200">已转企微人工</Badge>
                )}
                <span className="text-xs text-gray-400 ml-auto">{selectedChat.createdAt}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
