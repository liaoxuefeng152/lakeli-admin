"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, UserPlus, CreditCard, TrendingUp, Copy, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";

type AgentAccount = {
  id: string;
  company: string;
  phone?: string;
  email?: string;
  level: string;
  commissionRate: number;
  balance: number;
  inviteCode?: string;
  status: "active" | "suspended";
  createdAt: string;
};

export default function AgentPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<AgentAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLevel, setNewLevel] = useState("金牌代理");
  const [newCommissionRate, setNewCommissionRate] = useState("0.1");
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // 带登录态的请求头（与后端 x-user-* 鉴权约定对齐）
  const authHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    ...(user
      ? {
          "x-user-id": user.id,
          "x-user-role": user.role,
          "x-user-email": user.email,
        }
      : {}),
  });

  React.useEffect(() => {
    const fetchAgentData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/geo/agent?action=overview", {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (data.code === 0) {
          const list: AgentAccount[] = data.data?.accounts || [];
          setAccounts(list);
          setInviteCode(list[0]?.inviteCode || "");
        } else {
          setError(data.msg || "加载失败");
        }
      } catch {
        setError("网络错误，无法加载代理商数据");
      }
      setLoading(false);
    };
    fetchAgentData();
  }, [user]);

  const activeAccounts = accounts.filter((a) => a.status === "active").length;
  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0);
  const totalCommission = accounts.reduce(
    (sum, a) => sum + Number(a.commissionRate || 0) * Number(a.balance || 0),
    0,
  );

  const handleCreate = async () => {
    if (!newCompany || !newEmail) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/geo/agent", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          company: newCompany,
          email: newEmail,
          phone: newPhone,
          level: newLevel,
          commissionRate: parseFloat(newCommissionRate) || 0.1,
        }),
      });
      const data = await res.json();
      if (data.code === 0) {
        const created: AgentAccount = data.data;
        setAccounts((prev) => [created, ...prev]);
        setInviteCode(created.inviteCode || inviteCode);
        setNewCompany("");
        setNewEmail("");
        setNewPhone("");
        setShowCreateDialog(false);
      } else {
        setError(data.msg || "创建失败");
      }
    } catch {
      setError("网络错误，创建失败");
    }
    setCreating(false);
  };

  const handleAdjustBalance = async (agent: AgentAccount) => {
    const raw = window.prompt(`调整「${agent.company}」余额（正为调增，负为扣减）：`, "0");
    if (raw === null) return;
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount === 0) return;
    setError("");
    try {
      const res = await fetch("/api/geo/agent", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ agentId: agent.id, amount }),
      });
      const data = await res.json();
      if (data.code === 0) {
        setAccounts((prev) =>
          prev.map((a) => (a.id === agent.id ? { ...a, balance: Number(data.data.balance) } : a)),
        );
      } else {
        setError(data.msg || "余额调整失败");
      }
    } catch {
      setError("网络错误，余额调整失败");
    }
  };

  const handleUpdateCommission = async (agent: AgentAccount) => {
    const raw = window.prompt(`设置「${agent.company}」佣金比例（0~1，如 0.15）：`, String(agent.commissionRate));
    if (raw === null) return;
    const rate = Number(raw);
    if (!Number.isFinite(rate)) return;
    setError("");
    try {
      const res = await fetch("/api/geo/agent", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ agentId: agent.id, commissionRate: rate }),
      });
      const data = await res.json();
      if (data.code === 0) {
        setAccounts((prev) =>
          prev.map((a) => (a.id === agent.id ? { ...a, commissionRate: Number(data.data.commissionRate) } : a)),
        );
      } else {
        setError(data.msg || "佣金调整失败");
      }
    } catch {
      setError("网络错误，佣金调整失败");
    }
  };

  const handleCopyCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">代理商后台</h1>
          <p className="text-gray-500 mt-1">开通代理账户、分配额度、查看收益明细</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          开通代理账户
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 加载中…
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 tabular-nums">{accounts.length}</p>
                    <p className="text-xs text-gray-500">代理账户总数</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 tabular-nums">{activeAccounts}</p>
                    <p className="text-xs text-gray-500">活跃账户</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 tabular-nums">¥{totalCommission.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">累计预估佣金</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Copy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-mono font-bold text-gray-900">{inviteCode || "—"}</p>
                    <button
                      className="text-xs text-primary hover:underline flex items-center gap-0.5 disabled:opacity-40"
                      onClick={handleCopyCode}
                      disabled={!inviteCode}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "已复制" : "复制邀请码"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">代理账户列表</CardTitle>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">暂无代理账户</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="text-left py-3 px-2 font-medium">企业名称</th>
                        <th className="text-left py-3 px-2 font-medium">邮箱</th>
                        <th className="text-center py-3 px-2 font-medium">等级</th>
                        <th className="text-center py-3 px-2 font-medium">邀请码</th>
                        <th className="text-center py-3 px-2 font-medium">余额</th>
                        <th className="text-center py-3 px-2 font-medium">状态</th>
                        <th className="text-right py-3 px-2 font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((acc) => (
                        <tr key={acc.id} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="py-3 px-2 font-medium text-gray-900">{acc.company}</td>
                          <td className="py-3 px-2 text-gray-500">{acc.email}</td>
                          <td className="py-3 px-2 text-center">{acc.level}</td>
                          <td className="py-3 px-2 text-center font-mono text-xs text-gray-500">{acc.inviteCode || "—"}</td>
                          <td className="py-3 px-2 text-center tabular-nums">¥{Number(acc.balance || 0).toFixed(0)}</td>
                          <td className="py-3 px-2 text-center">
                            <Badge variant={acc.status === "active" ? "default" : "destructive"}>
                              {acc.status === "active" ? "活跃" : "已停用"}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-right space-x-2 whitespace-nowrap">
                            <button className="text-xs text-primary hover:underline" onClick={() => handleAdjustBalance(acc)}>
                              调整余额
                            </button>
                            <button className="text-xs text-primary hover:underline" onClick={() => handleUpdateCommission(acc)}>
                              调佣金
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commission Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">收益明细</CardTitle>
              <CardDescription>代理账户余额 × 佣金比例 的预估佣金收益</CardDescription>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center">暂无收益明细</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="text-left py-3 px-2 font-medium">代理账户</th>
                        <th className="text-center py-3 px-2 font-medium">等级</th>
                        <th className="text-center py-3 px-2 font-medium">余额</th>
                        <th className="text-right py-3 px-2 font-medium">佣金比例</th>
                        <th className="text-right py-3 px-2 font-medium">预估佣金</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((acc) => {
                        const rate = `${(Number(acc.commissionRate || 0) * 100).toFixed(0)}%`;
                        const amount = Number(acc.commissionRate || 0) * Number(acc.balance || 0);
                        return (
                          <tr key={acc.id} className="border-b last:border-0 hover:bg-slate-50">
                            <td className="py-3 px-2 font-medium text-gray-900">{acc.company}</td>
                            <td className="py-3 px-2 text-center">{acc.level}</td>
                            <td className="py-3 px-2 text-center tabular-nums">¥{Number(acc.balance || 0).toFixed(0)}</td>
                            <td className="py-3 px-2 text-right tabular-nums text-gray-500">{rate}</td>
                            <td className="py-3 px-2 text-right tabular-nums font-medium text-emerald-600">¥{amount.toFixed(0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-gray-500">累计预估佣金合计</span>
                <span className="text-xl font-bold text-emerald-600">¥{totalCommission.toFixed(0)}</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Create Dialog (inline) */}
      {showCreateDialog && (
        <Card className="border-primary border-2">
          <CardHeader>
            <CardTitle className="text-lg">开通代理账户</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="企业名称" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
            <Input placeholder="邮箱" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <Input placeholder="联系电话" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">等级</label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                >
                  <option value="金牌代理">金牌代理</option>
                  <option value="银牌代理">银牌代理</option>
                  <option value="普通代理">普通代理</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">佣金比例（0~1）</label>
                <Input type="number" step="0.01" value={newCommissionRate} onChange={(e) => setNewCommissionRate(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={!newCompany || !newEmail || creating}>
                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                确认开通
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
