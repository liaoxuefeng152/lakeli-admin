'use client';

import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Ban, KeyRound, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { admins, roleLabels } from '@/lib/mock-data';
import type { Admin } from '@/lib/mock-data';

export default function AccountsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAdmins = admins.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowViewDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">账号与权限管理</h1>
        <Button onClick={() => setShowAddDialog(true)} className="bg-[#1677FF] hover:bg-[#1677FF]/90">
          <Plus className="mr-2 h-4 w-4" />
          新增管理员
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索账号名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">账号名称</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">数据权限</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-50 hover:bg-[#F0F5FF] transition-colors">
                <td className="px-5 py-4 text-sm font-medium text-gray-900">{admin.name}</td>
                <td className="px-5 py-4">
                  <Badge variant="secondary" className="text-xs">
                    {roleLabels[admin.role]}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{admin.dataScope}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{admin.createdAt}</td>
                <td className="px-5 py-4">
                  <Badge variant={admin.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                    {admin.status === 'active' ? '正常' : '已禁用'}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleView(admin)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <KeyRound className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#F53F3F] hover:text-[#F53F3F]">
                      <Ban className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>新增后台管理员</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>账号</Label>
                <Input placeholder="请输入账号" />
              </div>
              <div className="space-y-2">
                <Label>密码</Label>
                <Input type="password" placeholder="请输入密码" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>角色</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>数据权限范围</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="请选择数据权限" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部数据</SelectItem>
                  <SelectItem value="own">仅自己分配客户</SelectItem>
                  <SelectItem value="industry">按行业分配</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>可访问模块</Label>
              <div className="flex flex-wrap gap-2">
                {['客户管理', '线索管理', '订单管理', '知识库', '企微配置', '数据看板', 'GEO模块', 'AI客服模块'].map((m) => (
                  <label key={m} className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="accent-[#1677FF]" />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            <Button className="bg-[#1677FF] hover:bg-[#1677FF]/90" onClick={() => setShowAddDialog(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>管理员详情</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">账号名称</span>
                  <p className="text-sm font-medium">{selectedAdmin.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">角色</span>
                  <p className="text-sm font-medium">{roleLabels[selectedAdmin.role]}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">数据权限</span>
                  <p className="text-sm font-medium">{selectedAdmin.dataScope}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">创建时间</span>
                  <p className="text-sm font-medium">{selectedAdmin.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">状态</span>
                  <p className="text-sm font-medium">{selectedAdmin.status === 'active' ? '正常' : '已禁用'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">可访问模块</span>
                  <p className="text-sm font-medium">{selectedAdmin.modules.join('、')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
