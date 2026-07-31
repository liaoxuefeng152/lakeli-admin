'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, Container, Monitor } from 'lucide-react';
import { fetchConfigs, bulkUpdateConfigs, SystemConfig } from '@/lib/services/admin-api';

const groupIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  sandbox: Container,
  browser: Monitor,
};

const groupTitles: Record<string, string> = {
  sandbox: 'Docker 沙盒环境',
  browser: '浏览器自动化',
};

const TARGET_CATEGORIES = ['sandbox', 'browser'];

export default function EnvConfigPage() {
  const [allConfigs, setAllConfigs] = useState<SystemConfig[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs()
      .then(cs => {
        const filtered = cs.filter(c => TARGET_CATEGORIES.includes(c.category));
        setAllConfigs(filtered);
        const init: Record<string, string> = {};
        filtered.forEach(c => { init[c.key] = c.value; });
        setEdited(init);
      })
      .catch(e => toast.error('加载配置失败: ' + e.message))
      .finally(() => setLoading(false));
  }, []);

  const groups = [...new Set(allConfigs.map(c => c.category))];

  const handleSave = async () => {
    setSaving(true);
    try {
      await bulkUpdateConfigs(Object.entries(edited).map(([key, value]) => ({ key, value })));
      toast.success('所有配置已保存');
    } catch (e) { toast.error('保存失败: ' + (e as Error).message); }
    finally { setSaving(false); }
  };

  if (loading) {
    return <div className="space-y-4">{[1,2].map(i=><Card key={i}><CardContent className="p-4"><div className="h-24 animate-pulse rounded bg-gray-100"/></CardContent></Card>)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">运行环境配置</h1>
          <p className="text-sm text-gray-500 mt-1">管理 Docker 沙盒、浏览器自动化等运行时环境配置</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary">
          <Save className="mr-2 h-4 w-4" />{saving ? '保存中...' : '保存所有配置'}
        </Button>
      </div>

      {groups.map(cat => {
        const configs = allConfigs.filter(c => c.category === cat);
        const Icon = groupIcons[cat] || Container;
        return (
          <Card key={cat}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />{groupTitles[cat] || cat}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {configs.map(c => (
                  <div key={c.key} className="space-y-1.5">
                    <label className="text-sm font-medium">{c.label}</label>
                    {c.description && <p className="text-xs text-gray-400">{c.description}</p>}
                    {c.type === 'boolean' ? (
                      <div className="flex items-center gap-2 pt-1">
                        <Switch checked={edited[c.key] === 'true'} onCheckedChange={v => setEdited(p => ({...p, [c.key]: v?'true':'false'}))} />
                        <span className="text-xs text-gray-500">{edited[c.key]==='true'?'已启用':'已禁用'}</span>
                      </div>
                    ) : (
                      <Input
                        type={c.encrypted ? 'password' : 'text'}
                        value={edited[c.key] || ''}
                        onChange={e => setEdited(p => ({...p, [c.key]: e.target.value}))}
                        className={c.encrypted ? 'font-mono' : ''}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
