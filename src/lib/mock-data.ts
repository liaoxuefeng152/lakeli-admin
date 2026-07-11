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
