'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Download, Users, Eye, Edit, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { industryOptions } from '@/lib/mock-data';
import type { Lead } from '@/lib/mock-data';
import { fetchLeads } from '@/lib/services/admin-api';
import { exportToCsv } from '@/lib/utils';

const intentColors: Record<string, string> = {
  high: '#F53F3F',
  medium: '#FF7D00',
  low: '#8C97A9',
};
const intentLabels: Record<string, string> = { high: '高意向', medium: '普通', low: '无意向' };
const statusLabels: Record<string, string> = {
  pending: '待跟进',
  following: '跟进中',
  converted: '已转化',
  rejected: '无意向',
};
const statusColors: Record<string, string> = {
  pending: '#FF7D00',
  following: '#1677FF',
  converted: '#00B42A',
  rejected: '#8C97A9',
};

export default function LeadsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [intentFilter, setIntentFilter] = useState('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchLeads({
        search: searchTerm,
        source: sourceFilter,
        intentLevel: intentFilter,
        page: 1,
        pageSize: 200,
      });
      setLeads(res.data as Lead[]);
    } catch (e) {
      console.error('[Leads] load failed', e);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sourceFilter, intentFilter]);

  useEffect(() => {
    const t = setTimeout(loadData, 300);
    return () => clearTimeout(t);
  }, [loadData]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    setSelected((prev) => (prev.length === leads.length ? [] : leads.map((l) => l.id)));
  };

  const handleExport = () => {
    const rowsToExport = selected.length > 0 ? leads.filter((l) => selected.includes(l.id)) : leads;
    exportToCsv(
      '线索数据.csv',
      ['线索ID', '手机号', '公司', '行业', '意向等级', '来源', '分配销售', '跟进状态'],
      rowsToExport.map((l) => [
        l.id,
        l.phone,
        l.company,
        l.industry,
        intentLabels[l.intentLevel],
        l.source,
        l.assignedTo || '-',
        statusLabels[l.followUpStatus],
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">全域线索管理池</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            批量导出
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            disabled={selected.length === 0}
            onClick={() => setShowAssignDialog(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            批量分配
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索手机号/公司名"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="线索来源" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            <SelectItem value="AI客服留资">AI客服留资</SelectItem>
            <SelectItem value="线下陌拜">线下陌拜</SelectItem>
          </SelectContent>
        </Select>
        <Select value={intentFilter} onValueChange={setIntentFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="意向等级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部意向</SelectItem>
            <SelectItem value="high">高意向</SelectItem>
            <SelectItem value="medium">普通</SelectItem>
            <SelectItem value="low">无意向</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => loadData()}>查询</Button>
        <Button
          variant="outline"
          onClick={() => { setSearchTerm(''); setSourceFilter('all'); setIntentFilter('all'); }}
        >重置</Button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left">
                <Checkbox checked={selected.length === leads.length} onCheckedChange={toggleAll} />
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">线索ID</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">手机号</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">公司</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">行业</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">意向等级</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">来源</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">分配销售</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">跟进状态</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                <td className="px-5 py-4">
                  <Checkbox checked={selected.includes(lead.id)} onCheckedChange={() => toggleSelect(lead.id)} />
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{lead.id}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{lead.phone}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{lead.company}</td>
                <td className="px-5 py-4">
                  <Badge variant="secondary" className="text-xs">{lead.industry}</Badge>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: intentColors[lead.intentLevel], backgroundColor: intentColors[lead.intentLevel] + '15' }}>
                    {intentLabels[lead.intentLevel]}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{lead.source}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{lead.assignedTo || '-'}</td>
                <td className="px-5 py-4">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: statusColors[lead.followUpStatus], backgroundColor: statusColors[lead.followUpStatus] + '15' }}>
                    {statusLabels[lead.followUpStatus]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedLead(lead); setShowFollowDialog(true); }}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowAssignDialog(true)}>
                      <Users className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>分配销售</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>选择销售人员</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择销售" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wang">王销售</SelectItem>
                  <SelectItem value="liu">刘销售</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-gray-500">
              {selected.length > 0 ? `已选择 ${selected.length} 条线索` : '未选择线索时将对所有未分配线索进行批量分配'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>取消</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAssignDialog(false)}>确认分配</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Follow Up Dialog */}
      <Dialog open={showFollowDialog} onOpenChange={setShowFollowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑跟进记录</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="py-4 space-y-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="text-sm font-medium">{selectedLead.company}</div>
                <div className="text-xs text-gray-500 mt-1">{selectedLead.phone} | {selectedLead.source}</div>
              </div>
              <div className="space-y-2">
                <Label>跟进状态</Label>
                <Select defaultValue={selectedLead.followUpStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待跟进</SelectItem>
                    <SelectItem value="following">跟进中</SelectItem>
                    <SelectItem value="converted">已转化</SelectItem>
                    <SelectItem value="rejected">无意向</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>跟进记录</Label>
                <Textarea placeholder="请输入跟进记录..." rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFollowDialog(false)}>取消</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowFollowDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
