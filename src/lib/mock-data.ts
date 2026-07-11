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

// Agent Management Data
export interface AgentInfo {
  id: string;
  name: string;
  industry: string;
  language: 'zh' | 'en' | 'both';
  status: 'active' | 'inactive';
  totalChats: number;
  tokenUsed: number;
  leadCount: number;
  createdAt: string;
  updatedAt: string;
  promptConfig: string;
  knowledgeBases: string[];
  triggerKeywords: string;
  leadGuideScripts: string;
  geoToolEnabled: boolean;
  dailyExtraQuota: number;
}

export interface ChatMessage {
  role: 'customer' | 'agent';
  content: string;
  meta?: string;
}

export interface AgentChatRecord {
  id: string;
  agentName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCompany: string;
  question: string;
  answer: string;
  tokensUsed: number;
  isLeadGenerated: boolean;
  isTransferredToWecom: boolean;
  createdAt: string;
  messages: ChatMessage[];
}

export interface MigrationLog {
  id: string;
  importTime: string;
  total: number;
  success: number;
  failed: number;
  fileName: string;
}

export interface ModelRouteConfig {
  id: string;
  industry: string;
  defaultModel: string;
  agentCount: number;
}

export interface OperationLog {
  id: string;
  operator: string;
  action: string;
  module: string;
  detail: string;
  ip: string;
  createdAt: string;
}

export const agents: AgentInfo[] = [
  { id: 'AG001', name: '跨境电商顾问', industry: '通用GEO', language: 'both', status: 'active', totalChats: 1250, tokenUsed: 850000, leadCount: 45, createdAt: '2026-03-01', updatedAt: '2026-07-10', promptConfig: '你是一个专业的跨境电商顾问AI助手，精通GEO优化、Google SGE排名策略、多语言SEO。你需要以专业、友好的语气回答用户问题，并在适当时机引导用户留下联系方式。', knowledgeBases: ['product', 'geo'], triggerKeywords: '报价,合作,价格,多少钱', leadGuideScripts: '感谢您的关注！为了给您提供更精准的方案，方便留下您的手机号或微信吗？我们的专属顾问会在24小时内联系您。', geoToolEnabled: true, dailyExtraQuota: 0 },
  { id: 'AG002', name: '工业设备专家', industry: '工业机械', language: 'zh', status: 'active', totalChats: 680, tokenUsed: 420000, leadCount: 22, createdAt: '2026-04-15', updatedAt: '2026-07-09', promptConfig: '你是一位工业设备领域的资深技术顾问，熟悉数控机床、自动化设备、智能制造等行业。你需要根据用户的具体需求，提供专业的技术建议和市场分析。', knowledgeBases: ['product', 'industry'], triggerKeywords: '报价,技术参数,联系方式', leadGuideScripts: '如需获取详细技术方案和报价，请留下您的联系方式，我们的工程师团队会尽快与您对接。', geoToolEnabled: false, dailyExtraQuota: 20 },
  { id: 'AG003', name: '本地门店助手', industry: '本地商家', language: 'zh', status: 'active', totalChats: 920, tokenUsed: 580000, leadCount: 38, createdAt: '2026-03-20', updatedAt: '2026-07-10', promptConfig: '你是本地门店经营AI助手，擅长本地SEO、Google商家资料优化、门店引流策略。回答要简洁实用，适合中小门店经营者理解。', knowledgeBases: ['product'], triggerKeywords: '报价,合作,联系方式', leadGuideScripts: '我们可以为您提供免费的门店AI曝光诊断，请留下您的联系方式，顾问会尽快安排。', geoToolEnabled: true, dailyExtraQuota: 0 },
  { id: 'AG004', name: '黄精外贸顾问', industry: '黄精跨境', language: 'en', status: 'active', totalChats: 450, tokenUsed: 310000, leadCount: 15, createdAt: '2026-05-10', updatedAt: '2026-07-08', promptConfig: 'You are a professional cross-border trade consultant specializing in Rhodiola rosea and herbal products. You should provide export compliance, certification guidance, and market analysis for EU/US markets.', knowledgeBases: ['product', 'geo', 'industry'], triggerKeywords: 'quote,certification,contact', leadGuideScripts: 'For detailed export consultation, please leave your contact information. Our trade specialist will reach out within 24 hours.', geoToolEnabled: false, dailyExtraQuota: 10 },
  { id: 'AG005', name: '科创企业助手', industry: '通用GEO', language: 'both', status: 'inactive', totalChats: 120, tokenUsed: 85000, leadCount: 5, createdAt: '2026-06-01', updatedAt: '2026-07-05', promptConfig: '你是科创企业的AI营销顾问，专注于帮助科技初创公司提升品牌在AI搜索引擎中的可见度。', knowledgeBases: ['product'], triggerKeywords: '合作,方案', leadGuideScripts: '如需定制化的AI品牌曝光方案，请留下联系方式。', geoToolEnabled: false, dailyExtraQuota: 0 },
];

export const agentChatRecords: AgentChatRecord[] = [
  { id: 'AC001', agentName: '跨境电商顾问', customerId: 'C001', customerName: '深圳跨境通科技有限公司', customerPhone: '13800001111', customerCompany: '深圳跨境通科技有限公司', question: '如何提升在Google SGE中的排名？', answer: '建议优化产品页面的结构化数据，增加FAQ Schema，并确保内容包含用户搜索意图的长尾关键词。', tokensUsed: 850, isLeadGenerated: false, isTransferredToWecom: false, createdAt: '2026-07-10 09:15', messages: [
    { role: 'customer', content: '你好，我想了解一下怎么提升我们在Google SGE中的排名？' },
    { role: 'agent', content: '您好！很高兴为您解答。提升Google SGE排名需要从以下几个方面入手：\n\n1. **结构化数据优化**：确保产品页面包含FAQ Schema、Product Schema等结构化标记\n2. **内容意图匹配**：围绕用户搜索意图创建长尾关键词内容\n3. **E-E-A-T强化**：增加作者专业背景、引用权威数据源\n4. **技术SEO基础**：确保Core Web Vitals达标、移动端适配良好\n\n请问您的网站目前主要面向哪些市场？我可以给出更有针对性的建议。' },
    { role: 'customer', content: '主要面向欧美市场，做消费电子产品的' },
    { role: 'agent', content: '针对欧美消费电子市场，建议重点关注：\n\n- **产品评测类内容**：欧美用户购买前习惯搜索评测，可创建对比类文章\n- **视频内容嵌入**：YouTube视频在SGE中有较高权重\n- **本地化关键词**：注意美式英语与英式英语的差异\n\n如需更详细的优化方案，我可以安排专属顾问为您做免费诊断。' },
  ]},
  { id: 'AC002', agentName: '工业设备专家', customerId: 'C002', customerName: '东莞精密工业设备有限公司', customerPhone: '13900002222', customerCompany: '东莞精密工业设备有限公司', question: '我们的数控机床适合海外市场吗？', answer: '根据当前市场数据，东南亚和中东地区对中高端数控机床需求旺盛。建议先从越南、泰国市场切入，提供多语言产品资料。', tokensUsed: 1200, isLeadGenerated: true, isTransferredToWecom: true, createdAt: '2026-07-10 10:30', messages: [
    { role: 'customer', content: '我们公司主要生产CNC数控机床，想开拓海外市场，你觉得哪些市场比较适合？' },
    { role: 'agent', content: '根据当前市场数据分析，以下区域对中高端数控机床需求旺盛：\n\n1. **东南亚**（越南、泰国）：制造业转移承接地，需求增长30%+\n2. **中东**（沙特、阿联酋）：基建投资加大，高端设备进口需求强\n3. **南美**（巴西、墨西哥）：汽车产业链配套需求\n\n建议先从越南、泰国切入，这两个市场：\n- 关税优惠较多\n- 中文服务接受度高\n- 竞品以日系为主，中国设备性价比优势明显\n\n需要我帮您分析具体的市场准入要求吗？' },
    { role: 'customer', content: '好的，那出口的话需要哪些认证？报价方案是怎样的？' },
    { role: 'agent', content: '出口认证方面：\n- **CE认证**（欧洲市场必备）\n- **ISO 9001**（基础质量管理体系）\n- **目标国本地认证**（如越南的CR标志）\n\n关于详细的报价方案和出口支持计划，我可以安排我们的海外业务总监与您一对一沟通。方便留下您的手机号或微信吗？我们的顾问会在24小时内联系您。' },
    { role: 'customer', content: '好的，我的手机号是13900002222，姓张' },
    { role: 'agent', content: '收到！已为您记录信息。我们的海外业务总监张顾问会在明天上午联系您，为您提供：\n1. 目标市场认证清单\n2. 定制化报价方案\n3. 售后支持体系介绍\n\n感谢您的信任！' },
  ]},
  { id: 'AC003', agentName: '本地门店助手', customerId: 'C003', customerName: '广州本地生活服务有限公司', customerPhone: '13700003333', customerCompany: '广州本地生活服务有限公司', question: '怎么提高门店在AI搜索中的曝光？', answer: '建议完善Google商家资料、增加本地化关键词内容、鼓励客户留下好评，并定期更新门店动态。', tokensUsed: 680, isLeadGenerated: false, isTransferredToWecom: false, createdAt: '2026-07-10 11:45', messages: [
    { role: 'customer', content: '我开了一家美容院，怎么让附近的人在用AI搜索的时候能找到我的店？' },
    { role: 'agent', content: '提升门店在AI搜索中的曝光，建议从以下几点入手：\n\n1. **完善Google商家资料**：确保地址、营业时间、服务项目、照片全部填写完整\n2. **本地化关键词**：在网站内容中加入"城市+区域+服务"的关键词组合\n3. **好评管理**：鼓励满意客户在Google留下好评，回复每一条评价\n4. **定期更新动态**：每周至少发布1-2条门店动态/优惠信息\n5. **本地内容营销**：创建与本地社区相关的内容\n\n您的门店目前有线上网站吗？' },
    { role: 'customer', content: '有一个简单的网站，但很久没更新了' },
    { role: 'agent', content: '建议您优先做这几件事：\n\n1. 更新网站内容，加入最新的服务项目和价格\n2. 确保网站在手机上能正常浏览\n3. 在Google商家资料中上传最新的门店照片\n4. 设置一个定期更新计划\n\n我们可以帮您做一套完整的本地AI曝光优化方案，需要的话请留下联系方式。' },
  ]},
  { id: 'AC004', agentName: '黄精外贸顾问', customerId: 'C006', customerName: '珠海黄精生物科技有限公司', customerPhone: '13600006666', customerCompany: '珠海黄精生物科技有限公司', question: 'What certifications do we need for EU market?', answer: 'For the EU market, you will need CE marking, REACH compliance, and potentially Novel Food authorization for Rhodiola rosea products.', tokensUsed: 950, isLeadGenerated: true, isTransferredToWecom: false, createdAt: '2026-07-10 14:00', messages: [
    { role: 'customer', content: 'Hi, we are a Rhodiola rosea manufacturer in China. What certifications do we need to export to the EU market?' },
    { role: 'agent', content: 'For the EU market, you will need the following certifications:\n\n1. **CE Marking** - Required for product safety compliance\n2. **REACH Compliance** - Registration, Evaluation, Authorisation and Restriction of Chemicals\n3. **Novel Food Authorization** - Required for Rhodiola rosea products if marketed as food/supplement\n4. **GMP Certificate** - Good Manufacturing Practice documentation\n5. **Certificate of Analysis (CoA)** - For each batch\n\nAdditionally, if you plan to make health claims, you will need EFSA (European Food Safety Authority) approval.\n\nWould you like detailed guidance on any specific certification?' },
    { role: 'customer', content: 'Yes, we need more details on Novel Food authorization. How long does it take?' },
    { role: 'agent', content: 'The Novel Food authorization process typically takes **18-24 months** and involves:\n\n1. **Application Submission** to a EU member state competent authority\n2. **Safety Assessment** by EFSA (European Food Safety Authority)\n3. **Authorization Decision** by the European Commission\n\nRequired documentation:\n- Comprehensive safety studies\n- Composition and nutritional data\n- Proposed uses and use levels\n- Manufacturing process details\n\nFor detailed consultation on the application process, please leave your contact information. Our trade specialist will reach out within 24 hours.' },
    { role: 'customer', content: 'Sure, my email is export@huangjing-bio.com' },
    { role: 'agent', content: 'Thank you! Our EU trade compliance specialist will contact you at export@huangjing-bio.com within 24 hours with:\n1. Detailed Novel Food application guide\n2. Timeline estimation for your specific products\n3. Recommended testing labs\n\nWe look forward to supporting your EU market entry!' },
  ]},
  { id: 'AC005', agentName: '跨境电商顾问', customerId: 'C004', customerName: '深圳创新科技集团', customerPhone: '13500004444', customerCompany: '深圳创新科技集团', question: '报价是多少？想了解一下合作方案', answer: '我们提供多种套餐方案，基础版5800元/年起。我可以安排专属销售顾问为您详细讲解，请问方便留个联系方式吗？', tokensUsed: 720, isLeadGenerated: true, isTransferredToWecom: true, createdAt: '2026-07-10 15:20', messages: [
    { role: 'customer', content: '你们的报价是多少？我想了解一下合作方案' },
    { role: 'agent', content: '我们提供多种套餐方案：\n\n- **GEO基础版**：5,800元/年起，适合初创企业\n- **GEO专业版**：12,800元/年起，包含完整GEO优化\n- **GEO旗舰版**：28,800元/年起，全渠道AI搜索优化\n\n每个方案都包含：AI搜索排名监控、内容优化建议、竞品分析。\n\n请问您的企业规模和主要需求是什么？我可以帮您推荐最合适的方案。' },
    { role: 'customer', content: '我们是一个50人的科技公司，主要做智能硬件出口' },
    { role: 'agent', content: '针对50人规模的智能硬件出口企业，我推荐**GEO专业版**：\n\n- 覆盖Google SGE、Bing Copilot、Perplexity等主流AI搜索\n- 多语言内容优化（英/日/韩）\n- 每周排名监控报告\n- 专属客户成功经理\n\n如需详细了解方案内容和成功案例，我可以安排专属销售顾问为您做一对一讲解。方便留下您的手机号或微信吗？' },
    { role: 'customer', content: '好的，我手机13500004444，微信同号' },
    { role: 'agent', content: '收到！已为您记录信息。我们的专属顾问会在今天内联系您，为您准备：\n1. GEO专业版详细方案\n2. 智能硬件行业成功案例\n3. 免费AI搜索曝光诊断报告\n\n感谢您的信任！' },
  ]},
  { id: 'AC006', agentName: '本地门店助手', customerId: 'C007', customerName: '成都味道餐饮管理有限公司', customerPhone: '13100007777', customerCompany: '成都味道餐饮管理有限公司', question: '我们开了3家分店，怎么让每家店都能在AI搜索中被推荐？', answer: '建议为每家分店创建独立的Google商家资料，使用本地化关键词策略，并确保各分店信息一致性。', tokensUsed: 560, isLeadGenerated: false, isTransferredToWecom: false, createdAt: '2026-07-09 16:30', messages: [
    { role: 'customer', content: '我们成都有3家火锅店分店，怎么让每家店都能在AI搜索中被推荐？' },
    { role: 'agent', content: '多门店AI搜索优化策略：\n\n1. **独立商家资料**：为每家分店创建独立的Google商家资料\n2. **地址精准化**：确保每家店的地址、电话、营业时间准确\n3. **区域关键词**：每家店侧重"区域+火锅"关键词（如"春熙路火锅"、"玉林路火锅"）\n4. **评价差异化**：鼓励各分店客户留下带具体位置的评价\n5. **信息一致性**：确保各平台（美团、大众点评、Google）信息一致\n\n需要帮您制定详细的多门店优化方案吗？' },
  ]},
  { id: 'AC007', agentName: '工业设备专家', customerId: 'C008', customerName: '苏州自动化科技有限公司', customerPhone: '13200008888', customerCompany: '苏州自动化科技有限公司', question: '我们的自动化产线出口到东南亚需要什么技术支持？', answer: '东南亚市场需要关注电压标准适配、多语言操作界面、当地售后服务网络建设等方面。', tokensUsed: 890, isLeadGenerated: true, isTransferredToWecom: false, createdAt: '2026-07-09 14:20', messages: [
    { role: 'customer', content: '我们的自动化产线想出口到越南，需要哪些技术支持？' },
    { role: 'agent', content: '出口越南的自动化产线需要关注以下技术要点：\n\n1. **电压标准适配**：越南使用220V/50Hz，需确认设备兼容性\n2. **多语言HMI**：操作界面需支持越南语\n3. **热带环境适配**：防潮、散热设计需加强\n4. **备件供应**：建议在越南设立备件仓库\n5. **培训支持**：需提供越南语操作培训资料\n\n需要更详细的技术方案吗？' },
    { role: 'customer', content: '需要，请安排技术人员和我们对接' },
    { role: 'agent', content: '好的，我可以安排我们的海外技术支持团队与您对接。请留下您的联系方式，技术总监会在24小时内联系您，为您提供：\n1. 越南市场技术适配清单\n2. 定制化改造方案\n3. 售后服务体系建议' },
    { role: 'customer', content: '我的电话13200008888，找李工' },
    { role: 'agent', content: '收到！李工，我们的海外技术支持团队会在明天上午联系您。感谢您的信任！' },
  ]},
];

export const operationLogs: OperationLog[] = [
  { id: 'LOG001', operator: '张超管', action: '新增管理员', module: '账号管理', detail: '新增账号：刘销售（角色：销售）', ip: '192.168.1.100', createdAt: '2026-07-10 16:30' },
  { id: 'LOG002', operator: '李运营', action: '编辑知识库', module: '知识库', detail: '更新词条：跨境电商GEO优化方案', ip: '192.168.1.101', createdAt: '2026-07-10 15:45' },
  { id: 'LOG003', operator: '张超管', action: '修改企微配置', module: '企微配置', detail: '更新欢迎语文案和分流规则', ip: '192.168.1.100', createdAt: '2026-07-10 14:20' },
  { id: 'LOG004', operator: '李运营', action: '导出客户数据', module: '客户管理', detail: '导出跨境电商行业客户列表（共35条）', ip: '192.168.1.101', createdAt: '2026-07-10 11:30' },
  { id: 'LOG005', operator: '王销售', action: '分配线索', module: '线索管理', detail: '将线索L004分配给刘销售', ip: '192.168.1.102', createdAt: '2026-07-10 10:15' },
  { id: 'LOG006', operator: '李运营', action: '编辑Agent', module: 'Agent管理', detail: '更新智能体「跨境电商顾问」Prompt', ip: '192.168.1.101', createdAt: '2026-07-10 09:40' },
  { id: 'LOG007', operator: '张超管', action: '修改套餐配置', module: '订单中心', detail: '调整GEO专业版月付价格', ip: '192.168.1.100', createdAt: '2026-07-09 17:00' },
  { id: 'LOG008', operator: '李运营', action: '批量导入知识库', module: '知识库', detail: '导入行业场景库词条12条', ip: '192.168.1.101', createdAt: '2026-07-09 14:30' },
];

export const systemConfig = {
  aiDailyQuota: 100,
  geoScoreThreshold: 75,
  intentKeywords: ['报价', '合作', '价格', '多少钱', '怎么收费', '联系方式', '电话'],
  tokenLimitPerCustomer: 50000,
  modelProvider: '自研Agent引擎',
  fallbackEngine: '扣子平台',
  dualEngineMode: true,
};

export const migrationLogs: MigrationLog[] = [
  { id: 'ML001', importTime: '2026-07-10 14:30', total: 45, success: 43, failed: 2, fileName: 'coze_export_prompt_20260710.xlsx' },
  { id: 'ML002', importTime: '2026-07-09 10:15', total: 120, success: 118, failed: 2, fileName: 'coze_export_faq_20260709.xlsx' },
  { id: 'ML003', importTime: '2026-07-08 16:45', total: 30, success: 30, failed: 0, fileName: 'coze_export_knowledge_20260708.xlsx' },
  { id: 'ML004', importTime: '2026-07-05 09:20', total: 80, success: 76, failed: 4, fileName: 'coze_export_prompt_20260705.xlsx' },
];

export const modelRouteConfigs: ModelRouteConfig[] = [
  { id: 'MR001', industry: '通用GEO', defaultModel: '文心4.0', agentCount: 2 },
  { id: 'MR002', industry: '黄精跨境', defaultModel: 'GPT-4o', agentCount: 1 },
  { id: 'MR003', industry: '工业机械', defaultModel: '通义千问Max', agentCount: 1 },
  { id: 'MR004', industry: '本地商家', defaultModel: '文心4.0', agentCount: 1 },
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
