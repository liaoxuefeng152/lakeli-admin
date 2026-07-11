'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User, Search, Zap, MessageSquare, AlertCircle } from 'lucide-react';
import { agents } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface SandboxMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  meta?: {
    ragSources?: string[];
    keywordHit?: string;
    leadPrompt?: boolean;
  };
  timestamp: string;
}

const testIndustries = ['跨境电商', '工业设备', '本地门店', '黄精跨境', '科创企业'];

const mockResponses: Record<string, { content: string; meta: SandboxMessage['meta'] }[]> = {
  default: [
    {
      content: '您好！我是AI智能助手，很高兴为您服务。请问有什么可以帮助您的？',
      meta: { ragSources: ['产品知识库 - 欢迎语模板'] },
    },
    {
      content: '根据我们的产品体系，为您提供以下方案建议：\n\n1. **GEO基础版**：5,800元/年起，适合初创企业\n2. **GEO专业版**：12,800元/年起，包含完整GEO优化\n3. **GEO旗舰版**：28,800元/年起，全渠道AI搜索优化\n\n如需更详细的方案介绍，我可以安排专属顾问与您对接。',
      meta: { ragSources: ['产品知识库 - 套餐方案', '产品知识库 - 价格表'], keywordHit: '报价', leadPrompt: true },
    },
  ],
};

export default function AgentSandboxPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || '');
  const [selectedIndustry, setSelectedIndustry] = useState('跨境电商');
  const [messages, setMessages] = useState<SandboxMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const responseIndexRef = useRef(0);

  const currentAgent = agents.find((a) => a.id === selectedAgent);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: SandboxMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = mockResponses.default;
      const response = responses[responseIndexRef.current % responses.length];
      responseIndexRef.current += 1;

      const agentMsg: SandboxMessage = {
        id: `msg-${Date.now()}-reply`,
        role: 'agent',
        content: response.content,
        meta: response.meta,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleClear = () => {
    setMessages([]);
    responseIndexRef.current = 0;
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Agent测试沙盒</h1>
        <p className="text-sm text-gray-500 mt-1">运营专用测试环境，模拟客户对话验证智能体问答效果，对话不存入正式记录</p>
      </div>

      <div className="flex gap-4" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Left Panel - Config */}
        <div className="w-[280px] shrink-0 rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-4">测试配置</h3>

          <div className="space-y-4 flex-1">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">选择智能体</label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="选择Agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">模拟客户行业</label>
              <div className="flex flex-wrap gap-2">
                {testIndustries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`rounded-full px-3 py-1 text-xs transition-colors ${
                      selectedIndustry === ind
                        ? 'bg-[#FF7D00] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {currentAgent && (
              <div className="rounded-lg bg-gray-50 p-3 space-y-2">
                <p className="text-xs font-medium text-gray-600">当前Agent信息</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>名称: <span className="text-gray-700">{currentAgent.name}</span></p>
                  <p>行业: <span className="text-gray-700">{currentAgent.industry}</span></p>
                  <p>语言: <span className="text-gray-700">{currentAgent.language === 'zh' ? '中文' : currentAgent.language === 'en' ? 'English' : '中英双语'}</span></p>
                  <p>状态: <span className={currentAgent.status === 'active' ? 'text-green-600' : 'text-gray-400'}>{currentAgent.status === 'active' ? '上架' : '下架'}</span></p>
                </div>
              </div>
            )}

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-700">沙盒对话不存入正式客户对话表，仅用于运营测试问答效果。</p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            清空会话
          </Button>
        </div>

        {/* Right Panel - Chat Window */}
        <div className="flex-1 rounded-xl bg-white shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF7D00]/10">
              <Bot className="h-4 w-4 text-[#FF7D00]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{currentAgent?.name || '未选择智能体'}</p>
              <p className="text-xs text-gray-500">模拟行业: {selectedIndustry}</p>
            </div>
            <Badge className="ml-auto bg-green-50 text-green-600 border-green-200">测试中</Badge>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="h-12 w-12 mb-3 text-gray-300" />
                <p className="text-sm">开始测试对话，验证智能体问答效果</p>
                <p className="text-xs mt-1">在下方输入框中输入客户问题</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-[#FF7D00]/10 text-[#FF7D00]'
                }`}>
                  {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div className={`max-w-[70%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-lg px-4 py-3 text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-blue-50 text-gray-700'
                      : 'bg-orange-50 text-gray-700'
                  }`}>
                    {msg.content}
                  </div>
                  {/* Meta info for agent messages */}
                  {msg.role === 'agent' && msg.meta && (
                    <div className="mt-2 space-y-1">
                      {msg.meta.ragSources && msg.meta.ragSources.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <Search className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">RAG检索:</span>
                          {msg.meta.ragSources.map((src, i) => (
                            <Badge key={i} variant="outline" className="text-xs px-1.5 py-0 h-5">{src}</Badge>
                          ))}
                        </div>
                      )}
                      {msg.meta.keywordHit && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" />
                          <span className="text-xs text-amber-600">命中企微关键词: {msg.meta.keywordHit}</span>
                        </div>
                      )}
                      {msg.meta.leadPrompt && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">已触发留资引导</span>
                        </div>
                      )}
                    </div>
                  )}
                  <span className="text-xs text-gray-400 mt-1 block">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF7D00]/10 text-[#FF7D00]">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-lg bg-orange-50 px-4 py-3 text-sm text-gray-400">
                  <span className="animate-pulse">AI正在思考...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <Input
                placeholder="输入客户问题，测试智能体回答效果..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="bg-[#FF7D00] hover:bg-[#e86e00] text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
