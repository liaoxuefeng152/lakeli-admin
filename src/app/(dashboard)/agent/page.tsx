'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Power, MessageSquare, Zap, Users } from 'lucide-react';
import { agents, type AgentInfo } from '@/lib/mock-data';
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

export default function AgentRepoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentInfo | null>(null);

  const filteredAgents = agents.filter((agent) => {
    const matchSearch = agent.name.includes(searchTerm) || agent.industry.includes(searchTerm);
    const matchIndustry = industryFilter === 'all' || agent.industry === industryFilter;
    return matchSearch && matchIndustry;
  });

  const industries = [...new Set(agents.map((a) => a.industry))];

  const handleEdit = (agent: AgentInfo) => {
    setEditingAgent(agent);
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingAgent(null);
    setShowDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent资源仓库</h1>
          <p className="text-sm text-gray-500 mt-1">管理全部行业AI智能体，配置Prompt、知识库、触发规则</p>
        </div>
        <Button onClick={handleAdd} className="bg-[#FF7D00] hover:bg-[#FF7D00]/90">
          <Plus className="mr-2 h-4 w-4" />
          新增智能体
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索智能体名称/行业..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="行业筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部行业</SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF7D00]/10">
                  <MessageSquare className="h-5 w-5 text-[#FF7D00]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-xs text-gray-500">{agent.industry}</p>
                </div>
              </div>
              <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                {agent.status === 'active' ? '运行中' : '已下架'}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center rounded-lg bg-gray-50 py-2">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <MessageSquare className="h-3 w-3" />
                  对话量
                </div>
                <div className="text-sm font-semibold text-gray-900">{agent.totalChats.toLocaleString()}</div>
              </div>
              <div className="text-center rounded-lg bg-gray-50 py-2">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <Zap className="h-3 w-3" />
                  Token
                </div>
                <div className="text-sm font-semibold text-gray-900">{(agent.tokenUsed / 1000).toFixed(0)}K</div>
              </div>
              <div className="text-center rounded-lg bg-gray-50 py-2">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <Users className="h-3 w-3" />
                  线索
                </div>
                <div className="text-sm font-semibold text-gray-900">{agent.leadCount}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span>语言: {agent.language === 'zh' ? '中文' : agent.language === 'en' ? 'English' : '中英双语'}</span>
              <span>更新于 {agent.updatedAt}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(agent)}>
                <Edit className="mr-1 h-3 w-3" />
                编辑配置
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="mr-1 h-3 w-3" />
                沙盒测试
              </Button>
              <Button variant="outline" size="sm">
                <Power className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAgent ? '编辑智能体' : '新增智能体'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">智能体名称</label>
                <Input placeholder="如：跨境电商顾问" defaultValue={editingAgent?.name} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">行业分类</label>
                <Select defaultValue={editingAgent?.industry}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择行业" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="跨境电商">跨境电商</SelectItem>
                    <SelectItem value="工业设备">工业设备</SelectItem>
                    <SelectItem value="本地门店">本地门店</SelectItem>
                    <SelectItem value="科创企业">科创企业</SelectItem>
                    <SelectItem value="外贸制造">外贸制造</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">语言模式</label>
              <Select defaultValue={editingAgent?.language || 'zh'}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="both">中英双语</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Prompt配置</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="输入智能体系统Prompt..."
                defaultValue={editingAgent ? '已配置的系统Prompt内容...' : ''}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">绑定知识库</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择关联知识库" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">产品知识库</SelectItem>
                  <SelectItem value="geo">GEO专业知识库</SelectItem>
                  <SelectItem value="industry">行业场景库</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">企微触发词（逗号分隔）</label>
              <Input placeholder="如：报价,合作,价格,联系方式" defaultValue="报价,合作,价格,多少钱" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">GEO工具开关</label>
              <div className="h-5 w-9 rounded-full bg-gray-200 relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform" />
              </div>
              <span className="text-xs text-gray-500">启用后智能体可调用GEO诊断能力</span>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDialog(false)}>取消</Button>
              <Button className="bg-[#FF7D00] hover:bg-[#FF7D00]/90" onClick={() => setShowDialog(false)}>
                {editingAgent ? '保存修改' : '创建智能体'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
