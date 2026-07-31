'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchGeoRecords } from '@/lib/services/admin-api';

interface Template {
  id: string;
  name: string;
  industry: string;
  pages: number;
  status: string;
  updatedAt: string;
}

export default function GeoTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      setTemplates(await fetchGeoRecords('templates') as Template[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">GEO行业模板管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理各行业的GEO优化模板，同步至知识库</p>
        </div>
        <Button className="bg-[#0F52BA] hover:bg-[#0F52BA]/90" onClick={load} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          新增模板
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}<Button variant="link" className="h-auto p-0 ml-2 text-red-700" onClick={load}>重试</Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" /><span className="ml-2">加载模板...</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{t.name}</h3>
                  <Badge variant="secondary" className="text-xs mt-2">{t.industry}</Badge>
                </div>
                <Badge variant={t.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {t.status === 'active' ? '启用' : '停用'}
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <span>{t.pages} 个页面</span>
                <span>更新: {t.updatedAt}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" /> 编辑
                </Button>
                <Button variant="outline" size="sm" className="text-[#F53F3F] hover:text-[#F53F3F] hover:bg-red-50">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
            <div className="col-span-3 py-12 text-center text-gray-400">暂无模板</div>
          )}
        </div>
      )}
    </div>
  );
}
