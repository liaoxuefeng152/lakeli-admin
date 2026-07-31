'use client';

import { useEffect, useState } from 'react';
import { Eye, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface BviMetrics {
  ai_recommendation_rate: number;
  top1_rate: number;
  positive_ratio: number;
  a_sov: number;
}
export interface BviData {
  keyword: string;
  bvi: number;
  bvi_level: string;
  bvi_delta?: number | null;
  metrics?: BviMetrics;
  platform_details?: unknown[];
}

const BVI_TONE: Record<string, string> = {
  优秀: '#00B42A',
  良好: '#1677FF',
  一般: '#FF7D00',
  偏弱: '#F53F3F',
};

// 确定性演示数据：后端不可用时按品牌名生成稳定 BVI，便于跨产品工作台演示
function demoBvi(keyword: string): BviData {
  let h = 0;
  for (let i = 0; i < keyword.length; i++) h = (h * 31 + keyword.charCodeAt(i)) >>> 0;
  const bvi = 50 + (h % 45);
  const level = bvi >= 85 ? '优秀' : bvi >= 70 ? '良好' : bvi >= 55 ? '一般' : '偏弱';
  return {
    keyword,
    bvi,
    bvi_level: level,
    bvi_delta: ((h >> 3) % 21) - 10,
    metrics: {
      ai_recommendation_rate: 40 + (h % 50),
      top1_rate: 30 + ((h >> 2) % 55),
      positive_ratio: 55 + ((h >> 4) % 40),
      a_sov: 20 + ((h >> 5) % 60),
    },
    platform_details: Array.from({ length: 12 + (h % 7) }, (_, i) => ({ platform: `平台${i + 1}` })),
  };
}

/**
 * 跨产品品牌 AI 可见度（BVI）卡片。
 * 用于满足 PRD F5.8（龙掌柜/外呼/客服工作台嵌入客户 BVI 卡片）
 * 与 F1.8（龙掌柜/外呼/客服可查询某客户的 AI 可见度）。
 * 数据优先取域途 GEO 监测接口 /api/geo/monitoring，后端不可用时降级为确定性演示。
 */
export function BviVisibilityCard({
  title = '客户 AI 可见度 (BVI)',
  defaultBrand,
}: {
  title?: string;
  defaultBrand?: string;
}) {
  const [brand, setBrand] = useState(defaultBrand ?? '');
  const [bvi, setBvi] = useState<BviData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const load = (kw: string) => {
    const keyword = kw.trim();
    if (!keyword) return;
    setLoading(true);
    fetch(`/api/geo/monitoring?keyword=${encodeURIComponent(keyword)}`)
      .then((r) => r.json())
      .then((j) => {
        if (j?.success && j.current) {
          setBvi(j.current as BviData);
          setIsDemo(false);
        } else {
          setBvi(demoBvi(keyword));
          setIsDemo(true);
        }
      })
      .catch(() => {
        setBvi(demoBvi(keyword));
        setIsDemo(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (defaultBrand) load(defaultBrand);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Eye className="h-4 w-4 text-[#1677FF]" /> {title}
        </h3>
        {isDemo && bvi && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">演示数据</span>
        )}
        {!isDemo && bvi && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E6F4FF] text-[#1677FF]">实时</span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="输入品牌名查询 AI 可见度（F1.8 全产品可见度查询）"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(brand)}
          />
        </div>
        <Button onClick={() => load(brand)} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '查询'}
        </Button>
      </div>

      {bvi && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <BviStat label="BVI 指数" value={bvi.bvi} tone={BVI_TONE[bvi.bvi_level] || '#FF7D00'} />
            <BviStat label="AI推荐率" value={`${bvi.metrics?.ai_recommendation_rate ?? 0}%`} />
            <BviStat label="首位率" value={`${bvi.metrics?.top1_rate ?? 0}%`} />
            <BviStat label="正向情感" value={`${bvi.metrics?.positive_ratio ?? 0}%`} />
            <BviStat label="竞品SOV" value={`${bvi.metrics?.a_sov ?? 0}%`} />
            <BviStat label="覆盖平台" value={bvi.platform_details?.length ?? 0} />
          </div>
          {bvi.bvi_delta != null && (
            <p className="mt-3 text-xs text-gray-500">
              较上一周期变化{' '}
              <span className={bvi.bvi_delta >= 0 ? 'text-green-600' : 'text-red-600'}>
                {bvi.bvi_delta >= 0 ? '+' : ''}
                {bvi.bvi_delta}
              </span>
            </p>
          )}
        </>
      )}
    </div>
  );
}

function BviStat({ label, value, tone }: { label: string; value: number | string; tone?: string }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-bold" style={tone ? { color: tone } : undefined}>
        {value}
      </div>
    </div>
  );
}
