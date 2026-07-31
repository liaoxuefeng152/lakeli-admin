'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// 各业务模块的主题强调色（对应 AGENTS.md 设计规范）
// 拉克力主色 #1677FF；GEO 深蓝 #0F52BA；AI客服 绿 #00B42A
// 智能外呼沿用主色；龙掌柜沿用主色；跨境外贸知识引擎用紫色作为独立品牌色
// 数据平台（拉客力数据中台 dp）用青色 #13C2C2 作为独立品牌色
const MODULE_THEME: { prefix: string; primary: string }[] = [
  { prefix: '/geo', primary: '#0F52BA' },
  { prefix: '/ai-service', primary: '#00B42A' },
  { prefix: '/outbound-call', primary: '#1677FF' },
  { prefix: '/lzg', primary: '#1677FF' },
  { prefix: '/dp', primary: '#13C2C2' },
  { prefix: '/knowledge-engine', primary: '#7C3AED' },
];

const DEFAULT_PRIMARY = '#1677FF';

// 根据当前路由前缀动态设置 --primary 等 CSS 变量，
// 实现「主题色随模块切换」(globals.css 中 --color-primary 已映射为 Tailwind 的 bg-primary 等)。
export default function ModuleTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const matched = MODULE_THEME.find((m) => pathname?.startsWith(m.prefix));
    const color = matched?.primary ?? DEFAULT_PRIMARY;
    const root = document.documentElement;
    root.style.setProperty('--primary', color);
    root.style.setProperty('--ring', color);
    root.style.setProperty('--sidebar-primary', color);
    root.style.setProperty('--chart-1', color);
  }, [pathname]);

  return null;
}
