'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Database, Layers } from 'lucide-react';
import { fetchGovernance, type GovernanceResponse } from '@/lib/services/data-platform-api';

const THEME = '#13C2C2';

export default function GovernancePage() {
  const [data, setData] = useState<GovernanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGovernance()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const inv = data?.inventory || {};
  const invEntries = Object.entries(inv).filter(([, v]) => v >= 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">治理看板</h1>
        <p className="mt-1 text-sm text-gray-500">L4 治理层 · 数据质量、资产盘点与知识复用监控</p>
      </div>

      {loading ? <div className="text-center text-gray-400 py-12">加载中…</div> : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.governance || []).map((g, i: number) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white" style={{ backgroundColor: THEME }}>
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{g.metric_name}</p>
                      <p className="text-xl font-bold text-gray-900">
                        {g.metric_value}{g.metric_name.includes('completeness') ? '%' : ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Database className="h-5 w-5" style={{ color: THEME }} />数据资产盘点</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-gray-500">
                        <th className="py-2 pr-4">模块.表</th><th className="py-2 pr-4">记录数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invEntries.map(([k, v]) => (
                        <tr key={k} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs">{k}</td>
                          <td className="py-2 pr-4 text-gray-700">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Layers className="h-5 w-5" style={{ color: THEME }} />知识底座 · 租户分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-gray-500">
                        <th className="py-2 pr-4">向量空间</th><th className="py-2 pr-4">知识条目</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.knowledgeTenants || []).map((t, i: number) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 pr-4 text-gray-700">{t.vector_space}</td>
                          <td className="py-2 pr-4 text-gray-700">{t.c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
