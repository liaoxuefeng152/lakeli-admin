'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Send,
  Loader2,
  ArrowUpRight,
  Sparkles,
  CornerDownLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchJSON } from '@/lib/services/admin-api';

type MsgRole = 'user' | 'assistant';

interface AssistantMessage {
  id: string;
  role: MsgRole;
  type: 'text' | 'action_required' | 'action_result' | 'navigate';
  message?: string;
  result?: any;
  suggestions?: string[];
  target?: string;
  path?: string;
  // 追问模式下，助手缺参，需要把上一轮的意图与已知参数回传
  pending?: { intent: string; params: Record<string, string> };
}

const QUICK_PROMPTS = [
  '帮我诊断一下网站 https://www.example.com 的 GEO 表现',
  '生成一篇"工业自动化"行业的品牌介绍文案',
  '挖掘"跨境物流"相关的 GEO 关键词',
  '帮我生成 example.com 的 llms.txt',
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function GeoAssistantPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // 当前待补全的意图（action_required 时填充）
  const pendingRef = useRef<{ intent: string; params: Record<string, string> } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setInput('');
    // 用户消息
    const userMsg: AssistantMessage = { id: uid(), role: 'user', type: 'text', message: content };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    // 组装请求体：若是追问，带上待补全意图与已填参数
    const body: any = { message: content };
    if (pendingRef.current) {
      body.context_params = pendingRef.current.params;
    }

    try {
      const res = await fetchJSON<AssistantMessage>('/api/geo/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      pendingRef.current = res.type === 'action_required' ? (res.pending ?? null) : null;
      setMessages((m) => [...m, { id: uid(), role: 'assistant', ...res }]);
    } catch (e: any) {
      const isAuth = /401|403/.test(e?.message || '');
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: 'assistant',
          type: 'text',
          message: isAuth
            ? '当前账号无权限使用域途AI助手，请使用管理员或运营账号登录。'
            : '助手暂时不可用，请稍后重试。',
        },
      ]);
      pendingRef.current = null;
    } finally {
      setLoading(false);
    }
  }

  function onSuggestion(s: string) {
    if (pendingRef.current) {
      // 追问场景下，suggestion 通常是要补的参数值，直接作为回答发送
      send(s);
    } else {
      send(s);
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">域途AI助手</h1>
          <p className="text-sm text-gray-500">
            自然语言驱动 GEO 诊断、文案、关键词、建站与分发
          </p>
        </div>
      </div>

      {/* 消息区 */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
            <Sparkles className="mb-3 h-10 w-10" />
            <p className="text-sm">试着对我说点什么，例如：</p>
            <div className="mt-4 grid w-full max-w-md gap-2">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-600 transition hover:border-primary hover:text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} onSuggestion={onSuggestion} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" /> 助手思考中…
          </div>
        )}
      </div>

      {/* 输入区 */}
      <div className="mt-3 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="输入你的 GEO 需求，回车发送…"
          disabled={loading}
        />
        <Button onClick={() => send(input)} disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
        <CornerDownLeft className="h-3 w-3" /> 回车发送；需要补充参数时，助手会引导你继续填写。
      </p>
    </div>
  );
}

function ChatBubble({
  msg,
  onSuggestion,
}: {
  msg: AssistantMessage;
  onSuggestion: (s: string) => void;
}) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-white">
          {msg.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="max-w-[85%] space-y-2">
        {msg.message && (
          <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-2 text-sm text-gray-800 shadow-sm">
            {msg.message}
          </div>
        )}

        {msg.type === 'navigate' && msg.path && (
          <Link
            href={msg.path}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-white hover:opacity-90"
          >
            {msg.target || '立即前往'} <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}

        {msg.result !== undefined && (
          <pre className="max-h-80 overflow-auto rounded-lg bg-gray-900 px-3 py-2 text-xs text-gray-100">
            {typeof msg.result === 'string' ? msg.result : JSON.stringify(msg.result, null, 2)}
          </pre>
        )}

        {msg.suggestions && msg.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {msg.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSuggestion(s)}
                className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary transition hover:bg-primary/10"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
