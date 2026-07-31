"use client";

import { useEffect, useState } from "react";
import {
  Crown,
  Plus,
  Zap,
  Users,
  Coins,
  Check,
  X,
  Edit,
  MessageSquare,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchQuotaPlans,
  updateQuotaPlan,
  type QuotaPlan,
} from "@/lib/services/admin-api";

type Plan = QuotaPlan & {
  features?: string[];
  usage?: { used: number; limit: number };
};

function getStatusStyle(plan: Plan) {
  if (plan.name.includes("企业")) return { bg: "bg-purple-50", border: "border-purple-200", accent: "text-purple-600", badge: "bg-purple-100 text-purple-700" };
  if (plan.name.includes("旗舰")) return { bg: "bg-amber-50", border: "border-amber-200", accent: "text-amber-600", badge: "bg-amber-100 text-amber-700" };
  if (plan.name.includes("专业")) return { bg: "bg-blue-50", border: "border-blue-200", accent: "text-blue-600", badge: "bg-blue-100 text-blue-700" };
  return { bg: "bg-gray-50", border: "border-gray-200", accent: "text-gray-600", badge: "bg-gray-100 text-gray-700" };
}

function getUsagePercent(plan: Plan) {
  return Math.min(100, Math.round(((plan.usage?.used || 0) / (plan.usage?.limit || 1)) * 100));
}

function formatLimit(n: number) {
  return n === -1 ? "无限" : n.toLocaleString();
}

function PlanCard({ plan, onEdit }: { plan: Plan; onEdit: (p: Plan) => void }) {
  const style = getStatusStyle(plan);
  const usagePercent = getUsagePercent(plan);
  const isUnlimited = plan.monthlyTokenLimit === -1;

  return (
    <Card className={`${style.border} ${style.bg} border-2 relative overflow-hidden`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className={`h-5 w-5 ${style.accent}`} />
            <CardTitle className="text-lg">{plan.name}</CardTitle>
          </div>
          <Badge className={style.badge}>
            {plan.userCount} 用户
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">¥{plan.price.toLocaleString()}</span>
          <span className="text-gray-500 text-sm">/月</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> 每日对话
            </span>
            <span className="font-medium">{formatLimit(plan.dailyChatLimit)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" /> 每日技能
            </span>
            <span className="font-medium">{formatLimit(plan.dailySkillLimit)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <Coins className="h-3.5 w-3.5" /> 月度 Token
            </span>
            <span className="font-medium">{isUnlimited ? "无限" : plan.monthlyTokenLimit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> 并发上限
            </span>
            <span className="font-medium">{formatLimit(plan.maxConcurrent)}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>用量</span>
            <span>{usagePercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${usagePercent > 80 ? "bg-red-500" : "bg-blue-500"}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={() => onEdit(plan)}>
          <Edit className="h-4 w-4 mr-1" /> 编辑配额
        </Button>
      </CardContent>
    </Card>
  );
}

function FeaturesSection({ plan }: { plan: Plan }) {
  if (!plan.features || plan.features.length === 0) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">功能特权</h4>
      <ul className="space-y-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="h-3.5 w-3.5 text-green-500" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function UsageSection({ plan }: { plan: Plan }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="h-4 w-4" /> 今日实时用量
          </CardTitle>
          <Badge variant="outline">{plan.name}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>资源类型</TableHead>
              <TableHead>已用 / 上限</TableHead>
              <TableHead>使用率</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>API 总调用</TableCell>
              <TableCell>3,840 / 10,000</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-700">38%</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>技能调用</TableCell>
              <TableCell>1,205 / 5,000</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-700">24%</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Token 消耗</TableCell>
              <TableCell>182K / 500K</TableCell>
              <TableCell>
                <Badge className="bg-amber-100 text-amber-700">36%</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function LzgQuotaPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchQuotaPlans()
      .then((data) => {
        if (mounted) setPlans(data as Plan[]);
      })
      .catch((e: Error) => {
        if (mounted) setError(e.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleEdit = (plan: Plan) => {
    setEditingPlan({ ...plan });
  };

  const handleSave = async () => {
    if (!editingPlan) return;
    setSaving(true);
    try {
      await updateQuotaPlan(editingPlan.id, {
        dailyChatLimit: editingPlan.dailyChatLimit,
        dailySkillLimit: editingPlan.dailySkillLimit,
        monthlyTokenLimit: editingPlan.monthlyTokenLimit,
        maxConcurrent: editingPlan.maxConcurrent,
        price: editingPlan.price,
      });
      setPlans((prev) =>
        prev.map((p) => (p.id === editingPlan.id ? { ...p, ...editingPlan } : p)),
      );
      setEditingPlan(null);
    } catch (e) {
      alert("保存失败：" + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          加载失败：{error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">配额与套餐管理</h1>
          <p className="text-gray-500 text-sm mt-1">管理龙掌柜 AI 助手的套餐配额与资源限制</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-1" /> 新增套餐
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onEdit={handleEdit} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <UsageSection key={`usage-${plan.id}`} plan={plan} />
        ))}
      </div>

      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑配额 - {editingPlan?.name}</DialogTitle>
            <DialogDescription>修改套餐的配额参数，保存后立即生效</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>每日对话上限</Label>
                  <Input
                    type="number"
                    value={editingPlan.dailyChatLimit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, dailyChatLimit: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>每日技能上限</Label>
                  <Input
                    type="number"
                    value={editingPlan.dailySkillLimit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, dailySkillLimit: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>月度 Token 上限</Label>
                  <Input
                    type="number"
                    value={editingPlan.monthlyTokenLimit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, monthlyTokenLimit: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>并发上限</Label>
                  <Input
                    type="number"
                    value={editingPlan.maxConcurrent}
                    onChange={(e) => setEditingPlan({ ...editingPlan, maxConcurrent: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>月度价格（元）</Label>
                <Input
                  type="number"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)} disabled={saving}>
              <X className="h-4 w-4 mr-1" /> 取消
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Check className="h-4 w-4 mr-1" /> {saving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
