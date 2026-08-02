"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, UserPlus, CreditCard, TrendingUp, Copy, Check, Eye, EyeOff } from "lucide-react";

type SubAccount = {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  creditsUsed: number;
  status: "active" | "suspended";
  createdAt: string;
};

const DEMO_ACCOUNTS: SubAccount[] = [
  { id: "sub_001", name: "张三的企业", email: "zhangsan@company.com", plan: "basic", credits: 100, creditsUsed: 67, status: "active", createdAt: "2026-05-10" },
  { id: "sub_002", name: "李四科技", email: "lisi@tech.com", plan: "pro", credits: 500, creditsUsed: 320, status: "active", createdAt: "2026-05-15" },
  { id: "sub_003", name: "王五传媒", email: "wangwu@media.com", plan: "basic", credits: 100, creditsUsed: 12, status: "suspended", createdAt: "2026-05-20" },
];

export default function AgentPage() {
  const [accounts, setAccounts] = useState<SubAccount[]>([]);
  const [commissionRate, setCommissionRate] = useState({ basic: 15, pro: 30 });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState("basic");
  const [newCredits, setNewCredits] = useState("100");
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch agent data on mount
  React.useEffect(() => {
    const fetchAgentData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/geo/agent?action=overview");
        const data = await res.json();
        if (data.success) {
          setAccounts(data.accounts || []);
          setInviteCode(data.invite_code || "");
          if (data.commission_rate) setCommissionRate(data.commission_rate);
        }
      } catch { /* use empty state */ }
      setLoading(false);
    };
    fetchAgentData();
  }, []);

  const totalCommission = accounts.reduce((sum, a) => sum + a.creditsUsed * (a.plan === "pro" ? commissionRate.pro / 10 : commissionRate.basic / 10), 0);
  const activeAccounts = accounts.filter(a => a.status === "active").length;

  const handleCreate = async () => {
    if (!newName || !newEmail) return;
    setCreating(true);
    try {
      const res = await fetch("/api/geo/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_account", name: newName, email: newEmail, plan: newPlan, credits: parseInt(newCredits) || 100 }),
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(prev => [...prev, data.account]);
        setNewName("");
        setNewEmail("");
        setShowCreateDialog(false);
      }
    } catch { /* silent */ }
    setCreating(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">代理商后台</h1>
          <p className="text-gray-500 mt-1">管理子账号、分配额度、查看收益明细</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          开通子账号
        </Button>
      </div>

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
                <p className="text-xs text-gray-500">子账号总数</p>
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
                <p className="text-xs text-gray-500">活跃账号</p>
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
                <p className="text-xs text-gray-500">累计佣金</p>
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
                <p className="text-sm font-mono font-bold text-gray-900">{inviteCode}</p>
                <button className="text-xs text-primary hover:underline flex items-center gap-0.5" onClick={handleCopyCode}>
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "已复制" : "复制邀请码"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">子账号列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-3 px-2 font-medium">名称</th>
                  <th className="text-left py-3 px-2 font-medium">邮箱</th>
                  <th className="text-center py-3 px-2 font-medium">套餐</th>
                  <th className="text-center py-3 px-2 font-medium">额度</th>
                  <th className="text-center py-3 px-2 font-medium">已用</th>
                  <th className="text-center py-3 px-2 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{acc.name}</td>
                    <td className="py-3 px-2 text-gray-500">{acc.email}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant={acc.plan === "pro" ? "default" : "secondary"}>
                        {acc.plan === "pro" ? "专业版" : "基础版"}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center tabular-nums">{acc.credits}</td>
                    <td className="py-3 px-2 text-center tabular-nums">{acc.creditsUsed}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant={acc.status === "active" ? "default" : "destructive"}>
                        {acc.status === "active" ? "活跃" : "已停用"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Commission Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">收益明细</CardTitle>
          <CardDescription>子账号消费产生的佣金收益</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-3 px-2 font-medium">子账号</th>
                  <th className="text-center py-3 px-2 font-medium">套餐</th>
                  <th className="text-center py-3 px-2 font-medium">消费额度</th>
                  <th className="text-right py-3 px-2 font-medium">佣金比例</th>
                  <th className="text-right py-3 px-2 font-medium">佣金金额</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => {
                  const rate = acc.plan === "pro" ? `${commissionRate.pro}%` : `${commissionRate.basic}%`;
                  const amount = acc.creditsUsed * (acc.plan === "pro" ? commissionRate.pro / 10 : commissionRate.basic / 10);
                  return (
                    <tr key={acc.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-3 px-2 font-medium text-gray-900">{acc.name}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={acc.plan === "pro" ? "default" : "secondary"}>
                          {acc.plan === "pro" ? "专业版" : "基础版"}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center tabular-nums">{acc.creditsUsed}</td>
                      <td className="py-3 px-2 text-right tabular-nums text-gray-500">{rate}</td>
                      <td className="py-3 px-2 text-right tabular-nums font-medium text-emerald-600">¥{amount.toFixed(0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-gray-500">累计佣金合计</span>
            <span className="text-xl font-bold text-emerald-600">¥{totalCommission.toFixed(0)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog (simple inline) */}
      {showCreateDialog && (
        <Card className="border-primary border-2">
          <CardHeader>
            <CardTitle className="text-lg">开通子账号</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="企业名称" value={newName} onChange={e => setNewName(e.target.value)} />
            <Input placeholder="邮箱" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">套餐</label>
                <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={newPlan} onChange={e => setNewPlan(e.target.value)}>
                  <option value="basic">基础版</option>
                  <option value="pro">专业版</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">额度</label>
                <Input type="number" value={newCredits} onChange={e => setNewCredits(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={!newName || !newEmail}>确认开通</Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
