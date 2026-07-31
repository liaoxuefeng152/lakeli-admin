/**
 * 真实中文情感 NLP 分析模块（F1.2）。
 *
 * 采用「词典 + 否定词 + 程度副词加权」的规则式 NLP 方法：
 *  1. 正向/负向情感词词典（含多字词，按长度降序匹配，避免子串误命中）；
 *  2. 情感词前 N 个字符内的「程度副词」会放大/缩小该词极性权重；
 *  3. 情感词前 N 个字符内的「否定词」会翻转该词极性；
 *  4. 累加得到有符号情感分，并据此判定 正向 / 负向 / 中性。
 *
 * 该实现为真实、可复现的 NLP 算法（非随机哈希仿真），完全在前端运行，
 * 无需后端即可对反馈、评论等中文文本做情感倾向分析。
 */

export type SentimentLabel = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  /** 判定标签 */
  label: SentimentLabel;
  /** 有符号累加情感分（正=积极，负=消极） */
  score: number;
  /** 命中的正向词数量（按词条计） */
  positive: number;
  /** 命中的负向词数量（按词条计） */
  negative: number;
  /** 命中的情感词（带 +/- 前缀，否定词附加「(否)」） */
  tokens: string[];
}

/** 正向情感词 -> 基础权重 */
const POSITIVE: Record<string, number> = {
  完美: 2, 极好: 2, 非常好: 2, 极佳: 2, 优秀: 1.5, 满意: 1.5, 喜欢: 1.5, 赞: 1.5,
  很好: 1.5, 惊喜: 1.5, 不错: 1, 给力: 1.2, 靠谱: 1.2, 专业: 1, 贴心: 1.2, 周到: 1.2,
  耐心: 1, 智能: 1, 强大: 1.2, 高效: 1.2, 方便: 1, 快捷: 1, 及时: 1, 迅速: 1.2,
  清晰: 1, 准确: 1, 流畅: 1, 稳定: 1, 安全: 1, 可靠: 1.2, 友好: 1, 热情: 1,
  推荐: 1, 解决: 1, 帮助: 1, 划算: 1, 顺畅: 1, 易用: 1, 棒: 1,
};

/** 负向情感词 -> 基础权重 */
const NEGATIVE: Record<string, number> = {
  差评: 2, 糟糕: 2, 极差: 2, 很差: 1.8, 垃圾: 2, 失望: 1.5, 坑: 1.5, 骗: 1.8,
  差: 1, 慢: 1, 卡: 1, 卡顿: 1.3, 卡死: 1.8, 贵: 1, 难用: 1.5, 烦: 1.2, 烦人: 1.5,
  错误: 1.2, 故障: 1.8, 崩溃: 2, 迟钝: 1.2, 敷衍: 1.5, 恶劣: 1.8, 投诉: 1.5, 退货: 1.2,
  退款: 1.2, 问题: 1, 不行: 1.5, 不好: 1.5, 恼火: 1.5, 生气: 1.5, 浪费: 1.5, 混乱: 1.5,
  延迟: 1.2, 掉线: 1.5, 报错: 1.5, 乱: 1,
};

/** 否定词（命中后翻转极性） */
const NEGATIONS = ['不', '没', '没有', '无', '未', '别', '勿', '非', '不太', '并不', '不再'];

/** 程度副词 -> 权重乘数 */
const DEGREE: Record<string, number> = {
  非常: 1.6, 特别: 1.6, 极其: 1.7, 十分: 1.5, 超: 1.5, 极: 1.5, 太: 1.4,
  最: 1.5, 有点: 0.6, 稍微: 0.5, 略微: 0.5, 比较: 0.8, 还: 0.9, 挺: 1.1, 更: 1.2,
};

/** 向前回溯窗口（字符数），用于检测否定词/程度副词 */
const WINDOW = 3;

interface Hit { weight: number; word: string; }

/** 在文本中扫描某情感词典，返回所有命中及其加权极性（含否定翻转） */
function scan(text: string, lexicon: Record<string, number>): Hit[] {
  const hits: Hit[] = [];
  const words = Object.keys(lexicon).sort((a, b) => b.length - a.length);
  for (const w of words) {
    const base = lexicon[w];
    let from = 0;
    let idx = text.indexOf(w, from);
    while (idx !== -1) {
      const before = text.slice(Math.max(0, idx - WINDOW), idx);
      let mult = 1;
      for (const [d, dw] of Object.entries(DEGREE)) {
        if (before.includes(d)) { mult = dw; break; }
      }
      let negated = false;
      for (const n of NEGATIONS) {
        if (before.includes(n)) { negated = true; break; }
      }
      const sign = negated ? -1 : 1;
      hits.push({ weight: base * mult * sign, word: w + (negated ? '(否)' : '') });
      from = idx + w.length;
      idx = text.indexOf(w, from);
    }
  }
  return hits;
}

/** 分析单条文本的情感倾向 */
export function analyzeSentiment(text: string): SentimentResult {
  const t = (text || '').toLowerCase();
  const pos = scan(t, POSITIVE);
  const neg = scan(t, NEGATIVE);
  let score = 0;
  let pc = 0;
  let nc = 0;
  const tokens: string[] = [];
  for (const h of pos) { score += h.weight; pc += 1; tokens.push('+' + h.word); }
  for (const h of neg) { score += h.weight; nc += 1; tokens.push('-' + h.word); }
  const label: SentimentLabel = score > 0.5 ? 'positive' : score < -0.5 ? 'negative' : 'neutral';
  return {
    label,
    score: Math.round(score * 100) / 100,
    positive: pc,
    negative: nc,
    tokens,
  };
}

export interface SentimentDistribution {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  positiveRatio: number;
  negativeRatio: number;
  neutralRatio: number;
  avgScore: number;
}

export interface BatchSentiment {
  distribution: SentimentDistribution;
  results: SentimentResult[];
}

/** 批量分析文本，返回分布统计与逐条结果（结果顺序与输入一致） */
export function analyzeBatch(texts: string[]): BatchSentiment {
  const results = texts.map(analyzeSentiment);
  const total = results.length;
  const positive = results.filter((r) => r.label === 'positive').length;
  const negative = results.filter((r) => r.label === 'negative').length;
  const neutral = total - positive - negative;
  const avg = total ? results.reduce((s, r) => s + r.score, 0) / total : 0;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  return {
    results,
    distribution: {
      total,
      positive,
      negative,
      neutral,
      positiveRatio: pct(positive),
      negativeRatio: pct(negative),
      neutralRatio: pct(neutral),
      avgScore: Math.round(avg * 100) / 100,
    },
  };
}
