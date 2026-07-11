'use client';

import { useState } from 'react';
import { Search, Eye, MessageSquare, UserCheck, FileInput, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { agentChatRecords } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function AgentChatsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');
  const [leadFilter, setLeadFilter] = useState('all');
  const [wecomFilter, setWecomFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedChat, setSelectedChat] = useState<typeof agentChatRecords[0] | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const agents = [...new Set(agentChatRecords.map((r) => r.agentName))];

  const filtered = agentChatRecords.filter((record) => {
    const matchSearch = record.customerName.includes(searchTerm) ||
      record.customerPhone.includes(searchTerm) ||
      record.customerCompany.includes(searchTerm) ||
      record.question.includes(searchTerm);
    const matchAgent = agentFilter === 'all' || record.agentName === agentFilter;
    const matchLead = leadFilter === 'all' ||
      (leadFilter === 'yes' && record.isLeadGenerated) ||
      (leadFilter === 'no' && !record.isLeadGenerated);
    const matchWecom = wecomFilter === 'all' ||
      (wecomFilter === 'yes' && record.isTransferredToWecom) ||
      (wecomFilter === 'no' && !record.isTransferredToWecom);
    return matchSearch && matchAgent && matchLead && matchWecom;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedRecords = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === pagedRecords.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(pagedRecords.map((r) => r.id)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">全平台对话记录查询</h1>
          <p className="text-sm text-gray-500 mt-1">查看拉克力Agent中台全部智能体对话数据，同步至客户360档案</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <div className="relative flex-1 min-w-[180px] max-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="客户手机号/公司"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="所属Agent行业" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部Agent</SelectItem>
            {agents.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" className="w-[140px]" placeholder="对话起始时间" />
        <span className="text-gray-400">-</span>
        <Input type="date" className="w-[140px]" placeholder="对话结束时间" />
        <Select value={leadFilter} onValueChange={setLeadFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="是否留资" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="yes">已留资</SelectItem>
            <SelectItem value="no">未留资</SelectItem>
          </SelectContent>
        </Select>
        <Select value={wecomFilter} onValueChange={setWecomFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="是否唤起企微" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="yes">已唤起</SelectItem>
            <SelectItem value="no">未唤起</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setAgentFilter('all'); setLeadFilter('all'); setWecomFilter('all'); }}>重置</Button>
          <Button size="sm" className="bg-[#FF7D00] hover:bg-[#e86e00] text-white">查询</Button>
        </div>
      </div>

      {/* Batch actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={selectedRows.size === 0}
          className={selectedRows.size > 0 ? 'border-[#FF7D00] text-[#FF7D00]' : ''}
        >
          <FileInput className="mr-1.5 h-3.5 w-3.5" />
          批量导出Excel ({selectedRows.size})
        </Button>
        <span className="text-xs text-gray-400">导出文件带操作人水印</span>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-3 py-3 w-10">
                <input type="checkbox" className="h-4 w-4 rounded accent-[#FF7D00]" checked={selectedRows.size === pagedRecords.length && pagedRecords.length > 0} onChange={toggleAll} />
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">对话ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">客户ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">客户名称</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">对应Agent</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">客户提问摘要</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">是否留资</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">是否转企微</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">当日Token</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">创建时间</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {pagedRecords.map((record) => (
              <tr key={record.id} className="border-b border-gray-50 hover:bg-[#F0F5FF]/30 transition-colors">
                <td className="px-3 py-3">
                  <input type="checkbox" className="h-4 w-4 rounded accent-[#FF7D00]" checked={selectedRows.has(record.id)} onChange={() => toggleRow(record.id)} />
                </td>
                <td className="px-3 py-3 text-xs text-gray-500 font-mono">{record.id}</td>
                <td className="px-3 py-3 text-xs text-gray-500 font-mono">{record.customerId}</td>
                <td className="px-3 py-3 text-sm text-gray-700">{record.customerName}</td>
                <td className="px-3 py-3">
                  <span className="text-sm font-medium text-[#FF7D00]">{record.agentName}</span>
                </td>
                <td className="px-3 py-3">
                  <p className="text-sm text-gray-600 max-w-[200px] truncate">{record.question}</p>
                </td>
                <td className="px-3 py-3">
                  {record.isLeadGenerated ? (
                    <Badge className="bg-green-50 text-green-600 border-green-200">是</Badge>
                  ) : (
                    <span className="text-xs text-gray-400">否</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {record.isTransferredToWecom ? (
                    <Badge className="bg-blue-50 text-blue-600 border-blue-200">是</Badge>
                  ) : (
                    <span className="text-xs text-gray-400">否</span>
                  )}
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">{record.tokensUsed}</td>
                <td className="px-3 py-3 text-sm text-gray-500">{record.createdAt}</td>
                <td className="px-3 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#FF7D00] hover:text-[#e86e00] h-7 px-2"
                    onClick={() => { setSelectedChat(record); setShowDetail(true); }}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    查看完整对话快照
                  </Button>
                </td>
              </tr>
            ))}
            {pagedRecords.length === 0 && (
              <tr>
                <td colSpan={11} className="py-16 text-center text-gray-400">
                  <MessageSquare className="mx-auto h-10 w-10 mb-3 text-gray-300" />
                  <p>暂无数据，请调整筛选条件</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">共 {filtered.length} 条</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">第 {currentPage} / {totalPages || 1} 页</span>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Select defaultValue="20">
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10条/页</SelectItem>
                <SelectItem value="20">20条/页</SelectItem>
                <SelectItem value="50">50条/页</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chat Snapshot Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-[800px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>完整对话快照</DialogTitle>
          </DialogHeader>
          {selectedChat && (
            <div className="space-y-4">
              {/* Customer Info Bar */}
              <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-3 text-sm">
                <span className="text-gray-500">客户: <span className="text-gray-700 font-medium">{selectedChat.customerName}</span></span>
                <span className="text-gray-500">手机: <span className="text-gray-700">{selectedChat.customerPhone}</span></span>
                <span className="text-gray-500">Agent: <span className="text-[#FF7D00] font-medium">{selectedChat.agentName}</span></span>
                <span className="text-gray-500">时间: <span className="text-gray-700">{selectedChat.createdAt}</span></span>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 py-2">
                {selectedChat.messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'customer' ? '' : 'flex-row-reverse'}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                      msg.role === 'customer'
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-[#FF7D00]/10 text-[#FF7D00]'
                    }`}>
                      {msg.role === 'customer' ? '客' : <MessageSquare className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`max-w-[75%] rounded-lg px-4 py-3 text-sm whitespace-pre-line ${
                      msg.role === 'customer'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-orange-50 text-gray-700'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Info */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                {selectedChat.isLeadGenerated && (
                  <Badge className="bg-green-50 text-green-600 border-green-200">
                    <UserCheck className="mr-1 h-3 w-3" />
                    已产生留资
                  </Badge>
                )}
                {selectedChat.isTransferredToWecom && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200">已转企微人工</Badge>
                )}
                <span className="text-sm text-gray-500">本次消耗Token: <span className="font-medium text-gray-700">{selectedChat.tokensUsed}</span></span>
                <Button variant="outline" size="sm" className="ml-auto">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  跳转客户360档案
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
