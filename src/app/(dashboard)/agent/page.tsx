'use client';

import { useState } from 'react';
import {
  Plus, Search, Edit, Copy, MessageSquare, Power, Eye,
  Download, Upload, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { agents, type AgentInfo } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const industryOptions = ['通用GEO', '黄精跨境', '工业机械', '本地商家'];
const knowledgeOptions = [
  { value: 'product', label: '产品知识库' },
  { value: 'geo', label: 'GEO专业库' },
  { value: 'huangjing', label: '黄精跨境行业库' },
  { value: 'industry', label: '工业行业库' },
];

const TABS = ['基础信息', 'Prompt人设配置', '知识库绑定', '规则配置', '附加配额限制'] as const;

export default function AgentRepoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentInfo | null>(null);
  const [copyingAgent, setCopyingAgent] = useState<AgentInfo | null>(null);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('基础信息');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredAgents = agents.filter((agent) => {
    const matchSearch = agent.name.includes(searchTerm) || agent.id.includes(searchTerm);
    const matchIndustry = industryFilter === 'all' || agent.industry === industryFilter;
    const matchStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchSearch && matchIndustry && matchStatus;
  });

  const totalPages = Math.ceil(filteredAgents.length / pageSize);
  const pagedAgents = filteredAgents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleEdit = (agent: AgentInfo) => {
    setEditingAgent(agent);
    setActiveTab('基础信息');
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingAgent(null);
    setActiveTab('基础信息');
    setShowDialog(true);
  };

  const handleCopy = (agent: AgentInfo) => {
    setCopyingAgent(agent);
    setShowCopyDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent资源仓库</h1>
          <p className="text-sm text-gray-500 mt-1">管理全部行业AI智能体，配置Prompt、知识库、触发规则</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd} className="bg-[#FF7D00] hover:bg-[#e86e00] text-white">
            <Plus className="mr-1.5 h-4 w-4" />
            新建Agent
          </Button>
          <Button variant="outline">
            <Upload className="mr-1.5 h-4 w-4" />
            批量导入扣子资产
          </Button>
          <Button variant="outline">
            <Download className="mr-1.5 h-4 w-4" />
            批量导出全部Agent配置
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Agent名称"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="所属行业" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部行业</SelectItem>
            {industryOptions.map((ind) => (
              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">上架</SelectItem>
            <SelectItem value="inactive">下架</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-[150px]" placeholder="创建时间起" />
        <span className="text-gray-400">-</span>
        <Input type="date" className="w-[150px]" placeholder="创建时间止" />
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setIndustryFilter('all'); setStatusFilter('all'); }}>重置</Button>
          <Button size="sm" className="bg-[#FF7D00] hover:bg-[#e86e00] text-white">查询</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Agent ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">智能体名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">所属行业</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">语言模式</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">累计对话</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">累计产出线索</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">创建时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {pagedAgents.map((agent) => (
              <tr key={agent.id} className="border-b border-gray-50 hover:bg-[#F0F5FF]/30 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-500 font-mono">{agent.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{agent.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{agent.industry}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {agent.language === 'zh' ? '中文' : agent.language === 'en' ? 'English' : '中英双语'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={agent.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' : ''}>
                    {agent.status === 'active' ? '上架' : '下架'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{agent.totalChats.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{agent.leadCount}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{agent.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="text-[#FF7D00] hover:text-[#e86e00] h-7 px-2" onClick={() => handleEdit(agent)}>
                      <Edit className="mr-1 h-3 w-3" />编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#FF7D00] hover:text-[#e86e00] h-7 px-2" onClick={() => handleCopy(agent)}>
                      <Copy className="mr-1 h-3 w-3" />复制新建
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#FF7D00] hover:text-[#e86e00] h-7 px-2">
                      <MessageSquare className="mr-1 h-3 w-3" />沙盒测试
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#FF7D00] hover:text-[#e86e00] h-7 px-2">
                      <Eye className="mr-1 h-3 w-3" />查看对话
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#FF7D00] hover:text-[#e86e00] h-7 px-2">
                      <Power className="mr-1 h-3 w-3" />{agent.status === 'active' ? '下架' : '上架'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {pagedAgents.length === 0 && (
              <tr>
                <td colSpan={9} className="py-16 text-center text-gray-400">
                  <MessageSquare className="mx-auto h-10 w-10 mb-3 text-gray-300" />
                  <p>暂无数据，请创建Agent或调整筛选条件</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">共 {filteredAgents.length} 条</span>
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

      {/* Multi-tab Edit/Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAgent ? '编辑智能体' : '新建Agent'}</DialogTitle>
          </DialogHeader>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#FF7D00] text-[#FF7D00]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-2 min-h-[300px]">
            {/* Tab 1: 基础信息 */}
            {activeTab === '基础信息' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      智能体名称 <span className="text-red-500">*</span>
                    </label>
                    <Input placeholder="如：跨境电商顾问" defaultValue={editingAgent?.name} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">所属行业</label>
                    <Select defaultValue={editingAgent?.industry}>
                      <SelectTrigger><SelectValue placeholder="选择行业" /></SelectTrigger>
                      <SelectContent>
                        {industryOptions.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">语言模式</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="lang" defaultChecked={editingAgent?.language === 'zh'} className="accent-[#FF7D00]" />
                      <span className="text-sm">仅中文</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="lang" defaultChecked={editingAgent?.language === 'both'} className="accent-[#FF7D00]" />
                      <span className="text-sm">中英双语</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">上架状态</label>
                  <button
                    type="button"
                    className={`relative h-5 w-9 rounded-full transition-colors ${editingAgent?.status === 'active' ? 'bg-[#FF7D00]' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${editingAgent?.status === 'active' ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                  <span className="text-xs text-gray-500">默认下架，配置完成后再上架</span>
                </div>
              </div>
            )}

            {/* Tab 2: Prompt人设配置 */}
            {activeTab === 'Prompt人设配置' && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">系统Prompt</label>
                <textarea
                  className="flex min-h-[240px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#FF7D00]"
                  placeholder="输入智能体系统Prompt，支持一键粘贴导入扣子导出Prompt..."
                  defaultValue={editingAgent?.promptConfig || ''}
                />
                <div className="text-right text-xs text-gray-400">
                  {(editingAgent?.promptConfig || '').length} 字
                </div>
              </div>
            )}

            {/* Tab 3: 知识库绑定 */}
            {activeTab === '知识库绑定' && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">选择绑定的知识库</label>
                <div className="space-y-2">
                  {knowledgeOptions.map((kb) => (
                    <label key={kb.value} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={editingAgent?.knowledgeBases.includes(kb.value)}
                        className="h-4 w-4 rounded accent-[#FF7D00]"
                      />
                      <span className="text-sm text-gray-700">{kb.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: 规则配置 */}
            {activeTab === '规则配置' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">企微触发关键词（逗号分隔）</label>
                  <Input placeholder="如：报价,合作,价格,联系方式" defaultValue={editingAgent?.triggerKeywords || ''} />
                  <p className="text-xs text-gray-400 mt-1">复用全局关键词库，客户对话命中时自动唤起企微</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">三层留资引导话术</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#FF7D00]"
                    placeholder="输入留资引导话术..."
                    defaultValue={editingAgent?.leadGuideScripts || ''}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">GEO工具开关</label>
                  <button
                    type="button"
                    className={`relative h-5 w-9 rounded-full transition-colors ${editingAgent?.geoToolEnabled ? 'bg-[#FF7D00]' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${editingAgent?.geoToolEnabled ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                  <span className="text-xs text-gray-500">开启后AI对话可调用诊断、关键词生成能力</span>
                </div>
              </div>
            )}

            {/* Tab 5: 附加配额限制 */}
            {activeTab === '附加配额限制' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    该行业客户每日额外提问上限
                  </label>
                  <Input
                    type="number"
                    placeholder="不填则复用套餐基础额度"
                    defaultValue={editingAgent?.dailyExtraQuota || ''}
                    className="w-[240px]"
                  />
                  <p className="text-xs text-gray-400 mt-1">在套餐基础额度之上，额外增加的每日提问次数</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">当前套餐基础额度参考</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>免费版：10次/天</p>
                    <p>基础版：50次/天</p>
                    <p>专业版：不限次数</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowDialog(false)}>取消</Button>
            <Button className="bg-[#FF7D00] hover:bg-[#e86e00] text-white" onClick={() => setShowDialog(false)}>
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Copy Dialog */}
      <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>复制新建Agent</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-sm text-gray-500">将复制「{copyingAgent?.name}」的全部配置，仅需修改名称即可创建新智能体。</p>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                新智能体名称 <span className="text-red-500">*</span>
              </label>
              <Input placeholder={`如：${copyingAgent?.name}（副本）`} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCopyDialog(false)}>取消</Button>
            <Button className="bg-[#FF7D00] hover:bg-[#e86e00] text-white" onClick={() => setShowCopyDialog(false)}>
              确认复制
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
