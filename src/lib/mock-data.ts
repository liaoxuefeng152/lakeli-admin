// Mock data for the Lakeli Admin System

export interface Admin {
  id: string;
  name: string;
  role: 'super_admin' | 'operator' | 'sales' | 'support';
  dataScope: string;
  modules: string[];
  createdAt: string;
  status: 'active' | 'disabled';
}

export interface Customer {
  id: string;
  company: string;
  contact: string;
  phone: string;
  industry: string;
  currentPlan: string;
  expiryDate: string;
  salesPerson: string;
  registeredAt: string;
}

export interface Lead {
  id: string;
  phone: string;
  company: string;
  industry: string;
  intentLevel: 'high' | 'medium' | 'low';
  source: string;
  assignedTo: string;
  followUpStatus: 'pending' | 'following' | 'converted' | 'rejected';
  createdAt: string;
}

export interface Order {
  id: string;
  customer: string;
  plan: string;
  amount: number;
  paidAt: string;
  expiryDate: string;
  status: 'paid' | 'pending' | 'expired' | 'refunded';
}

export interface KnowledgeItem {
  id: string;
  category: string;
  title: string;
  keywords: string[];
  status: 'active' | 'inactive';
  updatedAt: string;
}

export interface ChatRecord {
  id: string;
  customerId: string;
  customerName: string;
  question: string;
  answer: string;
  confidence: number;
  isHumanIntervention: boolean;
  isConverted: boolean;
  createdAt: string;
}

export interface GeoRecord {
  id: string;
  customerId: string;
  customerName: string;
  diagnosticsCount: number;
  copyCount: number;
  monitorExposure: number;
  date: string;
}

export const roleLabels: Record<string, string> = {
  super_admin: '超级管理员',
  operator: '运营',
  sales: '销售',
  support: '客服',
};

export const industryOptions = [
  '跨境电商', '工业设备', '本地门店', '科创企业', '外贸制造', '金融服务', '教育培训', '医疗健康',
];

export const planOptions = [
  'GEO基础版', 'GEO专业版', 'GEO旗舰版',
  '代运营标准版', '代运营高级版', '代运营尊享版',
  'AI客服基础版', 'AI客服专业版',
];

export const admins: Admin[] = [
  { id: 'A001', name: '张超管', role: 'super_admin', dataScope: '全部数据', modules: ['全部模块'], createdAt: '2025-01-01', status: 'active' },
  { id: 'A002', name: '李运营', role: 'operator', dataScope: '全部客户', modules: ['客户管理', '线索管理', '知识库', '数据看板'], createdAt: '2025-02-15', status: 'active' },
  { id: 'A003', name: '王销售', role: 'sales', dataScope: '仅自己客户', modules: ['客户管理', '线索管理', 'AI客服'], createdAt: '2025-03-10', status: 'active' },
  { id: 'A004', name: '赵客服', role: 'support', dataScope: '仅自己客户', modules: ['客户管理', 'AI客服'], createdAt: '2025-04-01', status: 'active' },
  { id: 'A005', name: '刘销售', role: 'sales', dataScope: '仅自己客户', modules: ['客户管理', '线索管理'], createdAt: '2025-05-20', status: 'disabled' },
];

export const customers: Customer[] = [
  { id: 'C001', company: '深圳跨境通科技有限公司', contact: '陈总', phone: '13800138001', industry: '跨境电商', currentPlan: 'GEO专业版', expiryDate: '2026-08-15', salesPerson: '王销售', registeredAt: '2025-06-01' },
  { id: 'C002', company: '东莞精密工业设备有限公司', contact: '李经理', phone: '13800138002', industry: '工业设备', currentPlan: 'GEO旗舰版', expiryDate: '2026-09-20', salesPerson: '王销售', registeredAt: '2025-07-15' },
  { id: 'C003', company: '广州本地生活服务有限公司', contact: '黄总', phone: '13800138003', industry: '本地门店', currentPlan: 'AI客服基础版', expiryDate: '2026-07-25', salesPerson: '刘销售', registeredAt: '2025-08-10' },
  { id: 'C004', company: '深圳创新科技集团', contact: '张CTO', phone: '13800138004', industry: '科创企业', currentPlan: 'GEO专业版', expiryDate: '2026-10-01', salesPerson: '王销售', registeredAt: '2025-09-05' },
  { id: 'C005', company: '佛山外贸制造有限公司', contact: '何总', phone: '13800138005', industry: '外贸制造', currentPlan: '代运营标准版', expiryDate: '2026-07-18', salesPerson: '刘销售', registeredAt: '2025-10-20' },
  { id: 'C006', company: '珠海黄精生物科技有限公司', contact: '周经理', phone: '13800138006', industry: '跨境电商', currentPlan: 'GEO旗舰版', expiryDate: '2026-11-30', salesPerson: '王销售', registeredAt: '2025-11-01' },
  { id: 'C007', company: '深圳前海金融服务公司', contact: '吴总', phone: '13800138007', industry: '金融服务', currentPlan: 'AI客服专业版', expiryDate: '2026-08-10', salesPerson: '刘销售', registeredAt: '2025-12-15' },
  { id: 'C008', company: '惠州教育培训机构', contact: '郑校长', phone: '13800138008', industry: '教育培训', currentPlan: 'GEO基础版', expiryDate: '2026-07-30', salesPerson: '王销售', registeredAt: '2026-01-10' },
];

export const leads: Lead[] = [
  { id: 'L001', phone: '13900139001', company: '深圳某跨境贸易公司', industry: '跨境电商', intentLevel: 'high', source: 'AI客服留资', assignedTo: '王销售', followUpStatus: 'following', createdAt: '2026-07-08' },
  { id: 'L002', phone: '13900139002', company: '东莞某五金工厂', industry: '工业设备', intentLevel: 'medium', source: 'AI客服留资', assignedTo: '王销售', followUpStatus: 'pending', createdAt: '2026-07-09' },
  { id: 'L003', phone: '13900139003', company: '广州某餐饮连锁', industry: '本地门店', intentLevel: 'high', source: 'AI客服留资', assignedTo: '刘销售', followUpStatus: 'converted', createdAt: '2026-07-07' },
  { id: 'L004', phone: '13900139004', company: '深圳某科技公司', industry: '科创企业', intentLevel: 'low', source: '线下陌拜', assignedTo: '', followUpStatus: 'pending', createdAt: '2026-07-10' },
  { id: 'L005', phone: '13900139005', company: '佛山某家具出口商', industry: '外贸制造', intentLevel: 'high', source: 'AI客服留资', assignedTo: '刘销售', followUpStatus: 'following', createdAt: '2026-07-06' },
  { id: 'L006', phone: '13900139006', company: '珠海某生物科技公司', industry: '跨境电商', intentLevel: 'medium', source: 'AI客服留资', assignedTo: '王销售', followUpStatus: 'following', createdAt: '2026-07-05' },
  { id: 'L007', phone: '13900139007', company: '深圳某投资管理公司', industry: '金融服务', intentLevel: 'low', source: 'AI客服留资', assignedTo: '', followUpStatus: 'rejected', createdAt: '2026-07-04' },
];

export const orders: Order[] = [
  { id: 'ORD20260001', customer: '深圳跨境通科技有限公司', plan: 'GEO专业版', amount: 12800, paidAt: '2025-08-15', expiryDate: '2026-08-15', status: 'paid' },
  { id: 'ORD20260002', customer: '东莞精密工业设备有限公司', plan: 'GEO旗舰版', amount: 29800, paidAt: '2025-09-20', expiryDate: '2026-09-20', status: 'paid' },
  { id: 'ORD20260003', customer: '广州本地生活服务有限公司', plan: 'AI客服基础版', amount: 5800, paidAt: '2025-07-25', expiryDate: '2026-07-25', status: 'paid' },
  { id: 'ORD20260004', customer: '深圳创新科技集团', plan: 'GEO专业版', amount: 12800, paidAt: '2025-10-01', expiryDate: '2026-10-01', status: 'paid' },
  { id: 'ORD20260005', customer: '佛山外贸制造有限公司', plan: '代运营标准版', amount: 38000, paidAt: '2025-10-20', expiryDate: '2026-07-18', status: 'paid' },
  { id: 'ORD20260006', customer: '珠海黄精生物科技有限公司', plan: 'GEO旗舰版', amount: 29800, paidAt: '2025-12-01', expiryDate: '2026-11-30', status: 'paid' },
  { id: 'ORD20260007', customer: '深圳前海金融服务公司', plan: 'AI客服专业版', amount: 9800, paidAt: '2025-08-10', expiryDate: '2026-08-10', status: 'pending' },
  { id: 'ORD20260008', customer: '惠州教育培训机构', plan: 'GEO基础版', amount: 6800, paidAt: '2026-01-10', expiryDate: '2026-07-30', status: 'expired' },
];

export const knowledgeItems: KnowledgeItem[] = [
  { id: 'K001', category: '产品知识库', title: 'GEO智能诊断功能使用说明', keywords: ['GEO', '诊断', 'SEO'], status: 'active', updatedAt: '2026-07-01' },
  { id: 'K002', category: '产品知识库', title: 'AI客服接入流程指南', keywords: ['AI客服', '接入', '企微'], status: 'active', updatedAt: '2026-07-02' },
  { id: 'K003', category: 'GEO专业库', title: 'Google AI搜索引擎优化最佳实践', keywords: ['Google', 'AI搜索', 'SGE', 'GEO'], status: 'active', updatedAt: '2026-06-28' },
  { id: 'K004', category: 'GEO专业库', title: '英文文案优化技巧与模板', keywords: ['英文', '文案', '优化'], status: 'active', updatedAt: '2026-06-25' },
  { id: 'K005', category: '行业场景库', title: '跨境电商GEO优化方案', keywords: ['跨境', '外贸', '电商'], status: 'active', updatedAt: '2026-07-05' },
  { id: 'K006', category: '行业场景库', title: '工业设备行业AI客服话术', keywords: ['工业', '设备', '话术'], status: 'inactive', updatedAt: '2026-06-20' },
  { id: 'K007', category: '产品知识库', title: '套餐升级与续费操作指南', keywords: ['套餐', '升级', '续费'], status: 'active', updatedAt: '2026-07-08' },
];

export const chatRecords: ChatRecord[] = [
  { id: 'CH001', customerId: 'C001', customerName: '深圳跨境通科技有限公司', question: 'GEO专业版能监测哪些AI搜索引擎？', answer: 'GEO专业版支持监测Google SGE、Bing Copilot、Perplexity等主流AI搜索引擎的曝光数据。', confidence: 0.95, isHumanIntervention: false, isConverted: false, createdAt: '2026-07-10 09:30' },
  { id: 'CH002', customerId: 'C002', customerName: '东莞精密工业设备有限公司', question: '你们支持外贸行业吗？', answer: '是的，我们专注服务外贸和跨境电商企业，GEO系统支持多语言优化，帮助您在海外AI搜索中获得曝光。', confidence: 0.92, isHumanIntervention: false, isConverted: true, createdAt: '2026-07-10 10:15' },
  { id: 'CH003', customerId: 'C003', customerName: '广州本地生活服务有限公司', question: '价格是多少？有优惠吗？', answer: '我们提供多个套餐方案，基础版5800元/年起。当前有年签9折优惠，具体可以安排销售顾问为您详细介绍。', confidence: 0.88, isHumanIntervention: true, isConverted: true, createdAt: '2026-07-10 11:00' },
  { id: 'CH004', customerId: 'C004', customerName: '深圳创新科技集团', question: 'AI客服能接入我们的企业微信吗？', answer: '完全支持！我们提供企微JS-SDK无缝接入，配置完成后自动同步客户对话和留资信息到中台。', confidence: 0.96, isHumanIntervention: false, isConverted: false, createdAt: '2026-07-10 14:20' },
  { id: 'CH005', customerId: 'C005', customerName: '佛山外贸制造有限公司', question: '诊断报告能导出PDF吗？', answer: '可以的，GEO系统支持一键导出PDF诊断报告，包含详细的优化建议和评分。', confidence: 0.90, isHumanIntervention: false, isConverted: false, createdAt: '2026-07-10 15:45' },
];

export const geoRecords: GeoRecord[] = [
  { id: 'G001', customerId: 'C001', customerName: '深圳跨境通科技有限公司', diagnosticsCount: 45, copyCount: 120, monitorExposure: 8500, date: '2026-07-10' },
  { id: 'G002', customerId: 'C002', customerName: '东莞精密工业设备有限公司', diagnosticsCount: 32, copyCount: 85, monitorExposure: 6200, date: '2026-07-10' },
  { id: 'G003', customerId: 'C004', customerName: '深圳创新科技集团', diagnosticsCount: 28, copyCount: 65, monitorExposure: 4800, date: '2026-07-10' },
  { id: 'G004', customerId: 'C006', customerName: '珠海黄精生物科技有限公司', diagnosticsCount: 56, copyCount: 150, monitorExposure: 12000, date: '2026-07-10' },
  { id: 'G005', customerId: 'C008', customerName: '惠州教育培训机构', diagnosticsCount: 15, copyCount: 30, monitorExposure: 2100, date: '2026-07-10' },
];

export const dashboardStats = {
  todayNewCustomers: 3,
  pendingLeads: 12,
  weeklyRevenue: 128600,
  expiringCustomers: 5,
  pendingLeadAssignment: 4,
  expiringIn7Days: 3,
  unresolvedBadReviews: 2,
  agentHighTokenAlert: 1,
};

export const weeklyTrend = [
  { date: '07-04', newCustomers: 2, newLeads: 5 },
  { date: '07-05', newCustomers: 1, newLeads: 3 },
  { date: '07-06', newCustomers: 3, newLeads: 7 },
  { date: '07-07', newCustomers: 0, newLeads: 2 },
  { date: '07-08', newCustomers: 4, newLeads: 8 },
  { date: '07-09', newCustomers: 2, newLeads: 4 },
  { date: '07-10', newCustomers: 3, newLeads: 6 },
];

export const monthlyRevenue = [
  { month: '1月', revenue: 86000 },
  { month: '2月', revenue: 92000 },
  { month: '3月', revenue: 105000 },
  { month: '4月', revenue: 98000 },
  { month: '5月', revenue: 118000 },
  { month: '6月', revenue: 135000 },
  { month: '7月', revenue: 128600 },
];

export const industryDistribution = [
  { name: '跨境电商', value: 35 },
  { name: '工业设备', value: 20 },
  { name: '本地门店', value: 15 },
  { name: '科创企业', value: 15 },
  { name: '外贸制造', value: 10 },
  { name: '其他', value: 5 },
];

export const planDistribution = [
  { name: 'GEO基础版', value: 25 },
  { name: 'GEO专业版', value: 30 },
  { name: 'GEO旗舰版', value: 15 },
  { name: '代运营', value: 18 },
  { name: 'AI客服', value: 12 },
];

export interface OperationLog {
  id: string;
  operator: string;
  action: string;
  module: string;
  detail: string;
  ip: string;
  createdAt: string;
}

// ==================== 龙掌柜AI助手 - 技能管理 ====================
export interface LzgSkill {
  id: string;
  name: string;
  key: string;
  category: string;
  type: 'builtin' | 'marketplace';
  description: string;
  modelId: string;
  modelName: string;
  promptTemplate: string;
  defaultParams: Record<string, string>;
  icon: string;
  sortOrder: number;
  isEnabled: boolean;
  callCount: number;
  successRate: number;
  avgDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface LzgSkillCategory {
  id: string;
  name: string;
  sortOrder: number;
}

export const lzgSkillCategories: LzgSkillCategory[] = [
  { id: 'SC001', name: '内容创作', sortOrder: 1 },
  { id: 'SC002', name: '选品分析', sortOrder: 2 },
  { id: 'SC003', name: '运营工具', sortOrder: 3 },
  { id: 'SC004', name: '营销推广', sortOrder: 4 },
  { id: 'SC005', name: '数据分析', sortOrder: 5 },
];

export const lzgSkills: LzgSkill[] = [
  { id: 'SK001', name: 'AI 作图', key: 'ai-image', category: '内容创作', type: 'builtin', description: '根据描述生成商品展示图、营销海报、场景图', modelId: 'M001', modelName: 'GPT-4o', promptTemplate: '生成一张电商商品展示图，产品为{product}，风格{style}，背景{background}。要求高清、适合跨境电商平台。', defaultParams: { product: '', style: '简约商务', background: '纯白' }, icon: 'Image', sortOrder: 1, isEnabled: true, callCount: 3250, successRate: 0.94, avgDuration: 8.5, createdAt: '2026-05-01', updatedAt: '2026-07-20' },
  { id: 'SK002', name: 'AI 视频', key: 'ai-video', category: '内容创作', type: 'builtin', description: 'AI生成短视频广告素材，支持多尺寸、多语言', modelId: 'M002', modelName: 'Sora', promptTemplate: '', defaultParams: { duration: '15s', ratio: '16:9', lang: 'en' }, icon: 'Video', sortOrder: 2, isEnabled: true, callCount: 1800, successRate: 0.88, avgDuration: 45.2, createdAt: '2026-05-10', updatedAt: '2026-07-18' },
  { id: 'SK003', name: '智能选品', key: 'smart-selection', category: '选品分析', type: 'builtin', description: '基于市场趋势和竞品分析，推荐高潜力商品', modelId: 'M003', modelName: 'DeepSeek-V3', promptTemplate: '分析{market}市场{categorization}品类，结合近期趋势和竞品表现，推荐{count}个高潜力商品，并给出理由。', defaultParams: { market: '美国', categorization: '家居', count: '10' }, icon: 'SearchCheck', sortOrder: 3, isEnabled: true, callCount: 4200, successRate: 0.92, avgDuration: 12.3, createdAt: '2026-04-20', updatedAt: '2026-07-22' },
  { id: 'SK004', name: 'Listing 优化', key: 'listing-optimizer', category: '运营工具', type: 'builtin', description: '优化商品标题、五点描述、A+文案，提升搜索排名', modelId: 'M003', modelName: 'DeepSeek-V3', promptTemplate: '优化以下跨境电商商品Listing：\n平台：{platform}\n原标题：{title}\n产品要点：{keyPoints}\n目标关键词：{keywords}\n要求：SEO友好、突出卖点、含关键词语义覆盖', defaultParams: { platform: 'Amazon', title: '', keyPoints: '', keywords: '' }, icon: 'FileText', sortOrder: 4, isEnabled: true, callCount: 5600, successRate: 0.96, avgDuration: 6.8, createdAt: '2026-04-15', updatedAt: '2026-07-21' },
  { id: 'SK005', name: '广告优化', key: 'ad-optimizer', category: '营销推广', type: 'builtin', description: '智能优化PPC广告文案和投放策略', modelId: 'M004', modelName: 'Claude 3.5', promptTemplate: '', defaultParams: {}, icon: 'Megaphone', sortOrder: 5, isEnabled: true, callCount: 2100, successRate: 0.85, avgDuration: 9.1, createdAt: '2026-05-20', updatedAt: '2026-07-15' },
  { id: 'SK006', name: '自动客服', key: 'auto-service', category: '运营工具', type: 'builtin', description: 'AI自动回复买家消息、处理退货、发送跟进', modelId: 'M001', modelName: 'GPT-4o', promptTemplate: '', defaultParams: {}, icon: 'MessageCircle', sortOrder: 6, isEnabled: true, callCount: 8900, successRate: 0.91, avgDuration: 3.2, createdAt: '2026-04-01', updatedAt: '2026-07-22' },
  { id: 'SK007', name: '浏览器自动化', key: 'browser-agent', category: '运营工具', type: 'builtin', description: 'AI操作浏览器完成批量上架、数据采集、报表导出', modelId: 'M003', modelName: 'DeepSeek-V3', promptTemplate: '', defaultParams: {}, icon: 'Globe', sortOrder: 7, isEnabled: false, callCount: 450, successRate: 0.72, avgDuration: 28.5, createdAt: '2026-06-01', updatedAt: '2026-07-10' },
  { id: 'SK008', name: '数据洞察', key: 'data-insight', category: '数据分析', type: 'builtin', description: '分析店铺运营数据，生成可视化报告和经营建议', modelId: 'M004', modelName: 'Claude 3.5', promptTemplate: '', defaultParams: {}, icon: 'BarChart3', sortOrder: 8, isEnabled: true, callCount: 3100, successRate: 0.93, avgDuration: 15.7, createdAt: '2026-04-25', updatedAt: '2026-07-19' },
  { id: 'SK009', name: '竞品监控', key: 'competitor-watch', category: '选品分析', type: 'marketplace', description: '自动追踪竞品价格、评分、排名变化并预警', modelId: 'M003', modelName: 'DeepSeek-V3', promptTemplate: '', defaultParams: {}, icon: 'Eye', sortOrder: 9, isEnabled: true, callCount: 750, successRate: 0.89, avgDuration: 20.1, createdAt: '2026-06-10', updatedAt: '2026-07-08' },
  { id: 'SK010', name: '侵权检测', key: 'infringement-check', category: '选品分析', type: 'marketplace', description: '检测商品图片和标题是否存在版权/商标侵权风险', modelId: 'M001', modelName: 'GPT-4o', promptTemplate: '', defaultParams: {}, icon: 'Shield', sortOrder: 10, isEnabled: true, callCount: 1200, successRate: 0.87, avgDuration: 11.4, createdAt: '2026-06-15', updatedAt: '2026-07-12' },
  { id: 'SK011', name: '物流比价', key: 'logistics-compare', category: '运营工具', type: 'marketplace', description: '对比多家物流方案，计算最优成本和时效', modelId: 'M003', modelName: 'DeepSeek-V3', promptTemplate: '', defaultParams: {}, icon: 'Truck', sortOrder: 11, isEnabled: true, callCount: 680, successRate: 0.95, avgDuration: 5.2, createdAt: '2026-07-01', updatedAt: '2026-07-20' },
  { id: 'SK012', name: '多语言翻译', key: 'multi-translate', category: '内容创作', type: 'marketplace', description: '跨境电商专业翻译，保持SEO优化和语感自然', modelId: 'M001', modelName: 'GPT-4o', promptTemplate: '', defaultParams: {}, icon: 'Languages', sortOrder: 12, isEnabled: true, callCount: 2500, successRate: 0.98, avgDuration: 2.8, createdAt: '2026-05-25', updatedAt: '2026-07-21' },
  { id: 'SK013', name: '客服话术模板', key: 'crm-scripts', category: '营销推广', type: 'marketplace', description: '预制多场景客服话术模板，自动适配买家情绪', modelId: 'M001', modelName: 'GPT-4o', promptTemplate: '', defaultParams: {}, icon: 'MessageSquare', sortOrder: 13, isEnabled: false, callCount: 320, successRate: 0.82, avgDuration: 4.6, createdAt: '2026-07-05', updatedAt: '2026-07-15' },
  { id: 'SK014', name: '社媒营销文案', key: 'social-copy', category: '营销推广', type: 'marketplace', description: '生成TikTok/Instagram/Facebook等平台的营销文案', modelId: 'M004', modelName: 'Claude 3.5', promptTemplate: '', defaultParams: {}, icon: 'Share2', sortOrder: 14, isEnabled: true, callCount: 1850, successRate: 0.90, avgDuration: 4.2, createdAt: '2026-06-20', updatedAt: '2026-07-18' },
  { id: 'SK015', name: '关键词分析', key: 'keyword-analysis', category: '选品分析', type: 'marketplace', description: '深度分析搜索关键词热度、竞争度和转化潜力', modelId: 'M003', modelName: 'DeepSeek-V3', promptTemplate: '', defaultParams: {}, icon: 'TrendingUp', sortOrder: 15, isEnabled: true, callCount: 3400, successRate: 0.94, avgDuration: 7.6, createdAt: '2026-05-15', updatedAt: '2026-07-22' },
  { id: 'SK016', name: '评论分析', key: 'review-analyzer', category: '数据分析', type: 'marketplace', description: 'AI分析买家评论情感、提取高频关键词和产品痛点', modelId: 'M003', modelName: 'DeepSeek-V3', promptTemplate: '', defaultParams: {}, icon: 'Star', sortOrder: 16, isEnabled: true, callCount: 2200, successRate: 0.91, avgDuration: 10.3, createdAt: '2026-05-28', updatedAt: '2026-07-20' },
];

// ==================== 龙掌柜AI助手 - 配额管理 ====================
export interface LzgQuotaPlan {
  id: string;
  name: string;
  dailyChatLimit: number;
  dailySkillLimit: number;
  monthlyTokenLimit: number;
  maxConcurrent: number;
  price: number;
  userCount: number;
}

export const lzgQuotaPlans: LzgQuotaPlan[] = [
  { id: 'QP001', name: '免费版', dailyChatLimit: 20, dailySkillLimit: 5, monthlyTokenLimit: 50000, maxConcurrent: 1, price: 0, userCount: 128 },
  { id: 'QP002', name: '专业版', dailyChatLimit: 200, dailySkillLimit: 50, monthlyTokenLimit: 500000, maxConcurrent: 3, price: 299, userCount: 56 },
  { id: 'QP003', name: '旗舰版', dailyChatLimit: 1000, dailySkillLimit: 200, monthlyTokenLimit: 2000000, maxConcurrent: 5, price: 999, userCount: 18 },
  { id: 'QP004', name: '企业版', dailyChatLimit: -1, dailySkillLimit: -1, monthlyTokenLimit: -1, maxConcurrent: 10, price: 3999, userCount: 5 },
];

// ==================== 龙掌柜AI助手 - 数据看板 ====================
export interface LzgDashboardStats {
  todaySessions: number;
  todayMessages: number;
  todayUsers: number;
  todaySkills: number;
  todayAssets: number;
  totalUsers: number;
  totalSessions: number;
  avgResponseTime: number;
}

export const lzgDashboardStats: LzgDashboardStats = {
  todaySessions: 256,
  todayMessages: 3840,
  todayUsers: 89,
  todaySkills: 1520,
  todayAssets: 340,
  totalUsers: 1208,
  totalSessions: 28560,
  avgResponseTime: 2.8,
};

export const lzgDashboardTrend = [
  { date: '07-17', sessions: 198, messages: 3120, users: 72, skills: 1340 },
  { date: '07-18', sessions: 215, messages: 3450, users: 78, skills: 1420 },
  { date: '07-19', sessions: 230, messages: 3580, users: 85, skills: 1480 },
  { date: '07-20', sessions: 185, messages: 2860, users: 68, skills: 1150 },
  { date: '07-21', sessions: 242, messages: 3720, users: 91, skills: 1550 },
  { date: '07-22', sessions: 278, messages: 4050, users: 95, skills: 1600 },
  { date: '07-23', sessions: 256, messages: 3840, users: 89, skills: 1520 },
];

export const lzgSkillRanks = [
  { skill: '自动客服', count: 8900, color: '#1677FF' },
  { skill: 'Listing 优化', count: 5600, color: '#00B42A' },
  { skill: '智能选品', count: 4200, color: '#FF7D00' },
  { skill: '关键词分析', count: 3400, color: '#722ED1' },
  { skill: 'AI 作图', count: 3250, color: '#F53F3F' },
  { skill: '数据洞察', count: 3100, color: '#0FC6C2' },
  { skill: '多语言翻译', count: 2500, color: '#F7BA1E' },
  { skill: '评论分析', count: 2200, color: '#14C9C9' },
];

export const operationLogs: OperationLog[] = [
  { id: 'LOG001', operator: '张超管', action: '新增管理员', module: '账号管理', detail: '新增账号：刘销售（角色：销售）', ip: '192.168.1.100', createdAt: '2026-07-10 16:30' },
  { id: 'LOG002', operator: '李运营', action: '编辑知识库', module: '知识库', detail: '更新词条：跨境电商GEO优化方案', ip: '192.168.1.101', createdAt: '2026-07-10 15:45' },
  { id: 'LOG003', operator: '张超管', action: '修改企微配置', module: '企微配置', detail: '更新欢迎语文案和分流规则', ip: '192.168.1.100', createdAt: '2026-07-10 14:20' },
  { id: 'LOG004', operator: '李运营', action: '导出客户数据', module: '客户管理', detail: '导出跨境电商行业客户列表（共35条）', ip: '192.168.1.101', createdAt: '2026-07-10 11:30' },
  { id: 'LOG005', operator: '王销售', action: '分配线索', module: '线索管理', detail: '将线索L004分配给刘销售', ip: '192.168.1.102', createdAt: '2026-07-10 10:15' },
  { id: 'LOG006', operator: '李运营', action: '编辑技能配置', module: '龙掌柜技能管理', detail: '启用技能「浏览器自动化」', ip: '192.168.1.101', createdAt: '2026-07-10 09:40' },
  { id: 'LOG007', operator: '张超管', action: '修改套餐配置', module: '订单中心', detail: '调整GEO专业版月付价格', ip: '192.168.1.100', createdAt: '2026-07-09 17:00' },
  { id: 'LOG008', operator: '李运营', action: '批量导入知识库', module: '知识库', detail: '导入行业场景库词条12条', ip: '192.168.1.101', createdAt: '2026-07-09 14:30' },
];

// ==================== 智能推销外呼系统 ====================

export interface OutboundTask {
  id: string;
  name: string;
  scriptSceneId: string;
  scriptSceneName: string;
  totalNumbers: number;
  calledCount: number;
  connectedCount: number;
  leadCount: number;
  status: '待执行' | '执行中' | '已暂停' | '已完成' | '已终止' | '异常失败';
  callMode: '自动外呼' | '预测外呼';
  createdAt: string;
  updatedAt: string;
}

export interface PhoneNumberItem {
  id: string;
  phone: string;
  customerName: string;
  remark: string;
  source: string;
  callStatus: '未拨打' | '已拨打' | '已接通' | '有意向' | '无意向';
  intentTag: string;
  lastCallTime: string;
  createdAt: string;
}

export interface BlacklistItem {
  id: string;
  phone: string;
  reason: string;
  operator: string;
  createdAt: string;
}

export interface ScriptScene {
  id: string;
  name: string;
  instanceId: string;
  scriptId: string;
  status: '启用' | '禁用';
  openingScript: string;
  closingScript: string;
  faqCount: number;
  createdAt: string;
}

export interface CallRecord {
  id: string;
  taskId: string;
  taskName: string;
  phone: string;
  customerName: string;
  callTime: string;
  duration: number; // seconds
  status: '已接通' | '未接通' | '空号' | '停机' | '拒接' | '正在拨打';
  intentTag: 'S-高意向' | 'A-观望' | 'B-无意向' | 'C-无效号码' | 'D-拒接';
  recordingUrl: string;
  transcript: { role: 'robot' | 'customer'; content: string }[];
}

export interface OutboundCallConfig {
  accessKeyId: string;
  accessKeySecret: string;
  outboundPhone: string;
  callbackUrl: string;
  timeout: number;
  retryCount: number;
  status: '已连接' | '未配置' | '连接失败';
}

export const outboundTasks: OutboundTask[] = [
  { id: 'OT001', name: '黄精保健品618促销外呼', scriptSceneId: 'SS001', scriptSceneName: '黄精保健品推销', totalNumbers: 500, calledCount: 487, connectedCount: 312, leadCount: 45, status: '已完成', callMode: '自动外呼', createdAt: '2026-06-15 09:00', updatedAt: '2026-06-15 18:30' },
  { id: 'OT002', name: 'GEO服务新客推广', scriptSceneId: 'SS002', scriptSceneName: 'GEO服务推广', totalNumbers: 200, calledCount: 156, connectedCount: 98, leadCount: 22, status: '执行中', callMode: '自动外呼', createdAt: '2026-07-10 09:00', updatedAt: '2026-07-10 14:20' },
  { id: 'OT003', name: 'AI客服产品回访', scriptSceneId: 'SS003', scriptSceneName: '客户回访', totalNumbers: 100, calledCount: 0, connectedCount: 0, leadCount: 0, status: '待执行', callMode: '预测外呼', createdAt: '2026-07-11 10:00', updatedAt: '2026-07-11 10:00' },
  { id: 'OT004', name: '工业设备展会邀约', scriptSceneId: 'SS004', scriptSceneName: '展会邀约', totalNumbers: 300, calledCount: 120, connectedCount: 75, leadCount: 18, status: '已暂停', callMode: '自动外呼', createdAt: '2026-07-08 09:30', updatedAt: '2026-07-09 16:00' },
  { id: 'OT005', name: '本地商家地推跟进', scriptSceneId: 'SS005', scriptSceneName: '本地商家推销', totalNumbers: 150, calledCount: 150, connectedCount: 88, leadCount: 31, status: '已完成', callMode: '自动外呼', createdAt: '2026-07-05 09:00', updatedAt: '2026-07-05 17:30' },
  { id: 'OT006', name: '跨境电商服务推广', scriptSceneId: 'SS002', scriptSceneName: 'GEO服务推广', totalNumbers: 80, calledCount: 12, connectedCount: 5, leadCount: 1, status: '异常失败', callMode: '自动外呼', createdAt: '2026-07-09 14:00', updatedAt: '2026-07-09 14:30' },
];

export const phoneNumbers: PhoneNumberItem[] = [
  { id: 'PN001', phone: '138****1234', customerName: '张伟', remark: '黄精保健品意向客户', source: '官网表单', callStatus: '有意向', intentTag: 'A-观望', lastCallTime: '2026-07-10 14:30', createdAt: '2026-07-01 10:00' },
  { id: 'PN002', phone: '139****5678', customerName: '李娜', remark: 'GEO服务咨询', source: '电话营销', callStatus: '已接通', intentTag: 'B-无意向', lastCallTime: '2026-07-10 15:00', createdAt: '2026-07-02 11:00' },
  { id: 'PN003', phone: '136****9012', customerName: '王强', remark: '工业设备采购经理', source: '展会收集', callStatus: '未拨打', intentTag: '', lastCallTime: '', createdAt: '2026-07-03 09:00' },
  { id: 'PN004', phone: '137****3456', customerName: '赵敏', remark: '本地餐饮老板', source: '地推', callStatus: '有意向', intentTag: 'S-高意向', lastCallTime: '2026-07-10 16:20', createdAt: '2026-07-04 14:00' },
  { id: 'PN005', phone: '135****7890', customerName: '刘洋', remark: '跨境电商负责人', source: '官网表单', callStatus: '已拨打', intentTag: '', lastCallTime: '2026-07-09 11:00', createdAt: '2026-07-05 10:00' },
  { id: 'PN006', phone: '133****2345', customerName: '陈芳', remark: '', source: '电话营销', callStatus: '未拨打', intentTag: '', lastCallTime: '', createdAt: '2026-07-06 09:00' },
  { id: 'PN007', phone: '158****6789', customerName: '杨磊', remark: '黄精保健品老客户', source: '客户转介绍', callStatus: '已接通', intentTag: 'A-观望', lastCallTime: '2026-07-10 10:30', createdAt: '2026-07-07 15:00' },
  { id: 'PN008', phone: '159****0123', customerName: '周婷', remark: 'AI客服需求', source: '官网表单', callStatus: '未拨打', intentTag: '', lastCallTime: '', createdAt: '2026-07-08 11:00' },
];

export const blacklistItems: BlacklistItem[] = [
  { id: 'BL001', phone: '130****9999', reason: '客户明确要求不再拨打', operator: '张三', createdAt: '2026-07-01 10:00' },
  { id: 'BL002', phone: '131****8888', reason: '投诉骚扰', operator: '李四', createdAt: '2026-07-03 14:30' },
  { id: 'BL003', phone: '132****7777', reason: '号码已注销', operator: '张三', createdAt: '2026-07-05 09:00' },
  { id: 'BL004', phone: '155****6666', reason: '客户明确表示无需求', operator: '王五', createdAt: '2026-07-08 16:00' },
];

export const scriptScenes: ScriptScene[] = [
  { id: 'SS001', name: '黄精保健品推销', instanceId: 'inst-abc123', scriptId: 'script-hj001', status: '启用', openingScript: '您好，这里是拉克力健康顾问，我们有一款源自长白山的天然黄精保健品...', closingScript: '感谢您的时间，如有需要随时联系我们，祝您生活愉快！', faqCount: 12, createdAt: '2026-06-01 10:00' },
  { id: 'SS002', name: 'GEO服务推广', instanceId: 'inst-abc123', scriptId: 'script-geo002', status: '启用', openingScript: '您好，我是拉克力GEO优化顾问，请问您了解过AI搜索优化服务吗？...', closingScript: '感谢您的关注，我们会在24小时内发送详细方案到您邮箱。', faqCount: 8, createdAt: '2026-06-15 14:00' },
  { id: 'SS003', name: '客户回访', instanceId: 'inst-abc123', scriptId: 'script-visit003', status: '启用', openingScript: '您好，这里是拉克力客服中心，想对您之前的服务体验做个简单回访...', closingScript: '感谢您的反馈，我们会持续改进服务质量。', faqCount: 5, createdAt: '2026-07-01 09:00' },
  { id: 'SS004', name: '展会邀约', instanceId: 'inst-def456', scriptId: 'script-expo004', status: '禁用', openingScript: '您好，我们是拉克力科技，8月份在广交会有展位，想邀请您参加...', closingScript: '期待在展会上见到您，届时会有专属优惠。', faqCount: 6, createdAt: '2026-07-05 11:00' },
  { id: 'SS005', name: '本地商家推销', instanceId: 'inst-def456', scriptId: 'script-local005', status: '启用', openingScript: '您好，我们是拉克力本地生活服务平台，专门帮助本地商家提升线上曝光...', closingScript: '感谢了解，我们可以安排专人上门为您做免费诊断。', faqCount: 10, createdAt: '2026-07-03 15:00' },
];

export const callRecords: CallRecord[] = [
  { id: 'CR001', taskId: 'OT001', taskName: '黄精保健品618促销外呼', phone: '138****1234', customerName: '张伟', callTime: '2026-07-10 14:30', duration: 125, status: '已接通', intentTag: 'S-高意向', recordingUrl: '#', transcript: [
    { role: 'robot', content: '您好，这里是拉克力健康顾问，我们有一款源自长白山的天然黄精保健品，想跟您简单介绍一下，方便吗？' },
    { role: 'customer', content: '嗯，你说吧，我听听。' },
    { role: 'robot', content: '好的。我们的黄精保健品采用长白山野生黄精，经过九蒸九晒传统工艺制作，具有补气养阴、健脾润肺的功效。目前有618特惠活动，买二送一，您有兴趣了解一下吗？' },
    { role: 'customer', content: '价格多少？有什么成分？' },
    { role: 'robot', content: '我们的黄精胶囊每盒298元，主要成分是黄精多糖、黄精皂苷，每盒60粒，建议每天2次每次2粒。618活动买二送一，三盒只要596元。' },
    { role: 'customer', content: '听起来不错，能发个详细资料给我看看吗？' },
    { role: 'robot', content: '好的，我这边安排专属顾问在24小时内把详细资料发给您，请问您的手机号是多少？' },
    { role: 'customer', content: '就这个手机号13812341234' },
    { role: 'robot', content: '好的，已为您记录。我们的健康顾问会在今天内联系您，感谢您的关注！' },
  ]},
  { id: 'CR002', taskId: 'OT001', taskName: '黄精保健品618促销外呼', phone: '139****5678', customerName: '李娜', callTime: '2026-07-10 15:00', duration: 38, status: '已接通', intentTag: 'B-无意向', recordingUrl: '#', transcript: [
    { role: 'robot', content: '您好，这里是拉克力健康顾问，我们有一款源自长白山的天然黄精保健品...' },
    { role: 'customer', content: '不需要，谢谢。' },
    { role: 'robot', content: '好的，打扰您了，祝您生活愉快！' },
  ]},
  { id: 'CR003', taskId: 'OT002', taskName: 'GEO服务新客推广', phone: '136****9012', customerName: '王强', callTime: '2026-07-10 15:30', duration: 0, status: '未接通', intentTag: 'C-无效号码', recordingUrl: '#', transcript: [] },
  { id: 'CR004', taskId: 'OT002', taskName: 'GEO服务新客推广', phone: '137****3456', customerName: '赵敏', callTime: '2026-07-10 16:20', duration: 210, status: '已接通', intentTag: 'S-高意向', recordingUrl: '#', transcript: [
    { role: 'robot', content: '您好，我是拉克力GEO优化顾问，请问您了解过AI搜索优化服务吗？' },
    { role: 'customer', content: 'AI搜索优化？具体是什么？' },
    { role: 'robot', content: 'GEO是Generative Engine Optimization的缩写，帮助您的品牌在ChatGPT、Perplexity、Google SGE等AI搜索引擎中被推荐。现在越来越多的用户通过AI获取答案，如果您的品牌不在AI推荐列表中，就会失去大量潜在客户。' },
    { role: 'customer', content: '这个确实有道理，我们做跨境电商的，很需要这个服务。怎么收费？' },
    { role: 'robot', content: '我们提供三种方案：基础版5800元/年、专业版12800元/年、旗舰版28800元/年。针对跨境电商企业，我推荐专业版，覆盖多语言AI搜索优化。' },
    { role: 'customer', content: '专业版都包含什么？能看看案例吗？' },
    { role: 'robot', content: '专业版包含：AI搜索排名监控、多语言内容优化、竞品分析、每周报告。我们有多个跨境电商成功案例，我安排顾问发给您参考。方便留个联系方式吗？' },
    { role: 'customer', content: '好的，我微信zhao_min_2026' },
    { role: 'robot', content: '收到！我们的跨境GEO顾问会在24小时内添加您微信，发送详细方案和案例。感谢您的信任！' },
  ]},
  { id: 'CR005', taskId: 'OT005', taskName: '本地商家地推跟进', phone: '133****2345', customerName: '陈芳', callTime: '2026-07-10 10:00', duration: 0, status: '拒接', intentTag: 'D-拒接', recordingUrl: '#', transcript: [] },
  { id: 'CR006', taskId: 'OT005', taskName: '本地商家地推跟进', phone: '158****6789', customerName: '杨磊', callTime: '2026-07-10 10:30', duration: 95, status: '已接通', intentTag: 'A-观望', recordingUrl: '#', transcript: [
    { role: 'robot', content: '您好，我们是拉克力本地生活服务平台，专门帮助本地商家提升线上曝光率...' },
    { role: 'customer', content: '哦，你们具体做什么的？' },
    { role: 'robot', content: '我们帮助本地商家在AI搜索、大众点评、美团等平台提升曝光，让更多附近客户找到您。目前有免费诊断活动，可以帮您分析目前线上曝光情况。' },
    { role: 'customer', content: '我考虑考虑吧，暂时不急。' },
    { role: 'robot', content: '理解的，我先帮您做个免费诊断，您看看结果再决定。方便加个微信吗？' },
    { role: 'customer', content: '行吧，yanglei888' },
    { role: 'robot', content: '好的，我们运营同事会添加您微信，发送免费诊断报告。感谢您的时间！' },
  ]},
];

export const outboundCallConfig: OutboundCallConfig = {
  accessKeyId: 'LTAI5t****',
  accessKeySecret: '******',
  outboundPhone: '0571-8888****',
  callbackUrl: 'https://api.lakeli.com/callback/outbound',
  timeout: 30,
  retryCount: 3,
  status: '已连接',
};

// ==================== 跨境外贸知识引擎 - 跨租户汇总 ====================

export interface KnowledgeEngineCrossTenantStats {
  totalTenants: number;
  activeTenants: number;
  totalKnowledgeCount: number;
  totalGeoContent: number;
  avgEntityCompleteness: number;
  avgQaHitRate: number;
  weeklyNewKnowledge: number;
  weeklyNewGeo: number;
}

export const knowledgeEngineCrossTenantStats: KnowledgeEngineCrossTenantStats = {
  totalTenants: 12,
  activeTenants: 9,
  totalKnowledgeCount: 34680,
  totalGeoContent: 2150,
  avgEntityCompleteness: 87.5,
  avgQaHitRate: 89.3,
  weeklyNewKnowledge: 1280,
  weeklyNewGeo: 95,
};

export const knowledgeEngineImportMonthTrend = [
  { month: '1月', knowledge: 2800, geo: 180 },
  { month: '2月', knowledge: 3200, geo: 210 },
  { month: '3月', knowledge: 4100, geo: 280 },
  { month: '4月', knowledge: 3800, geo: 250 },
  { month: '5月', knowledge: 4500, geo: 310 },
  { month: '6月', knowledge: 5200, geo: 350 },
  { month: '7月', knowledge: 4800, geo: 320 },
];

export const knowledgeEngineTenantGrowthTrend = [
  { month: '1月', tenants: 5 },
  { month: '2月', tenants: 6 },
  { month: '3月', tenants: 7 },
  { month: '4月', tenants: 8 },
  { month: '5月', tenants: 9 },
  { month: '6月', tenants: 11 },
  { month: '7月', tenants: 12 },
];

export interface KnowledgeEngineTenantStat {
  tenantId: string;
  tenantName: string;
  knowledgeCount: number;
  geoContentCount: number;
  entityCompleteness: number;
  qaHitRate: number;
  lastImportAt: string;
  status: 'active' | 'inactive';
}

export const knowledgeEngineTenantList: KnowledgeEngineTenantStat[] = [
  { tenantId: 'T001', tenantName: '华易通国际贸易', knowledgeCount: 5280, geoContentCount: 310, entityCompleteness: 92.1, qaHitRate: 91.5, lastImportAt: '2026-07-20 14:30', status: 'active' },
  { tenantId: 'T002', tenantName: '鑫盛源工贸集团', knowledgeCount: 4160, geoContentCount: 260, entityCompleteness: 88.7, qaHitRate: 88.2, lastImportAt: '2026-07-19 09:15', status: 'active' },
  { tenantId: 'T003', tenantName: '鼎丰机械贸易', knowledgeCount: 3850, geoContentCount: 220, entityCompleteness: 85.3, qaHitRate: 89.8, lastImportAt: '2026-07-18 16:45', status: 'active' },
  { tenantId: 'T004', tenantName: '瑞达化工', knowledgeCount: 4120, geoContentCount: 245, entityCompleteness: 90.4, qaHitRate: 92.1, lastImportAt: '2026-07-21 11:00', status: 'active' },
  { tenantId: 'T005', tenantName: '恒通数码科技', knowledgeCount: 2980, geoContentCount: 185, entityCompleteness: 82.6, qaHitRate: 85.9, lastImportAt: '2026-07-15 08:30', status: 'inactive' },
  { tenantId: 'T006', tenantName: '锦程纺织', knowledgeCount: 3450, geoContentCount: 200, entityCompleteness: 87.1, qaHitRate: 88.7, lastImportAt: '2026-07-20 10:20', status: 'active' },
  { tenantId: 'T007', tenantName: '康源生物科技', knowledgeCount: 5100, geoContentCount: 310, entityCompleteness: 93.5, qaHitRate: 94.2, lastImportAt: '2026-07-22 13:15', status: 'active' },
  { tenantId: 'T008', tenantName: '德铭建材', knowledgeCount: 1740, geoContentCount: 120, entityCompleteness: 78.4, qaHitRate: 82.3, lastImportAt: '2026-07-10 09:00', status: 'inactive' },
];
