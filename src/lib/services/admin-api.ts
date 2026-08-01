// 龙掌柜AI助手 - 后台管理 API 服务层
// 所有接口从 /api/admin/* 获取数据

const BASE = '/api/admin';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ============ 仪表盘 ============
export interface AnalyticsOverview {
  total_users: number;
  total_sessions: number;
  total_messages: number;
  total_assets: number;
  total_products: number;
  total_shops: number;
  total_knowledge: number;
  today_sessions: number;
  today_messages: number;
  today_users: number;
}

export interface TrendItem {
  date: string;
  sessions: number;
  messages: number;
  new_users: number;
}

export interface SkillRankItem {
  skill: string;
  count: number;
}

export interface ActiveUser {
  name: string;
  email: string;
  message_count: number;
}

// ============ 主工作台概览 ============
export interface DashboardData {
  overview: AnalyticsOverview;
  trend: TrendItem[];
  skillRank: SkillRankItem[];
}

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetchJSON<{ data: DashboardData }>(`/api/dashboard`);
  return res.data;
}

// ============ 系统配置 ============
export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  label: string;
  description: string;
  encrypted: boolean;
  updated_at: string;
  updated_by: string;
}

export async function fetchConfigs(category?: string): Promise<SystemConfig[]> {
  const url = category ? `${BASE}/config?category=${category}` : `${BASE}/config`;
  const res = await fetchJSON<{ data: SystemConfig[] }>(url);
  return res.data;
}

export async function updateConfig(key: string, value: string): Promise<void> {
  await fetchJSON(`${BASE}/config/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
}

export async function bulkUpdateConfigs(configs: { key: string; value: string }[]): Promise<void> {
  await fetchJSON(`${BASE}/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ configs }),
  });
}

// ============ 用户管理 ============
export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  total_tokens: number;
  session_count: number;
}

export interface UserListResponse {
  data: UserItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchUsers(params: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<UserListResponse> {
  const sp = new URLSearchParams();
  if (params.search) sp.set('search', params.search);
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  return fetchJSON(`${BASE}/users?${sp.toString()}`);
}

export async function createUser(data: { email: string; password: string; name: string; role: string }) {
  return fetchJSON(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: string, data: Record<string, unknown>) {
  return fetchJSON(`${BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: string) {
  return fetchJSON(`${BASE}/users/${id}`, { method: 'DELETE' });
}

// ============ 知识库 ============
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface KnowledgeListResponse {
  data: KnowledgeItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchKnowledge(params: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<KnowledgeListResponse> {
  const sp = new URLSearchParams();
  if (params.search) sp.set('search', params.search);
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  return fetchJSON(`${BASE}/knowledge?${sp.toString()}`);
}

export async function createKnowledge(data: { title: string; content: string; category: string; tags?: string[] }) {
  return fetchJSON(`${BASE}/knowledge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateKnowledge(id: string, data: Record<string, unknown>) {
  return fetchJSON(`${BASE}/knowledge/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteKnowledge(id: string) {
  return fetchJSON(`${BASE}/knowledge/${id}`, { method: 'DELETE' });
}

// ============ 会话管理 ============
export interface SessionItem {
  id: string;
  title: string;
  user_name: string;
  user_email: string;
  message_count: number;
  estimated_tokens: number;
  created_at: string;
  updated_at: string;
}

export interface SessionListResponse {
  data: SessionItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchSessions(params: {
  search?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}): Promise<SessionListResponse> {
  const sp = new URLSearchParams();
  if (params.search) sp.set('search', params.search);
  if (params.userId) sp.set('userId', params.userId);
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  return fetchJSON(`${BASE}/sessions?${sp.toString()}`);
}

// ============ 资产管理 ============
export interface AssetItem {
  id: string;
  filename: string;
  type: string;
  url: string;
  size: number;
  user_name: string;
  created_at: string;
}

export interface AssetListResponse {
  data: AssetItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchAssets(params: {
  search?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}): Promise<AssetListResponse> {
  const sp = new URLSearchParams();
  if (params.search) sp.set('search', params.search);
  if (params.type) sp.set('type', params.type);
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  return fetchJSON(`${BASE}/assets?${sp.toString()}`);
}

export async function deleteAssets(ids: string[]) {
  return fetchJSON(`${BASE}/assets`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
}

// ============ 操作日志 ============
export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  target_type: string;
  target_id: string;
  detail: string;
  ip: string;
  created_at: string;
}

export interface LogListResponse {
  data: ActivityLog[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchActivityLogs(params: {
  search?: string;
  action?: string;
  page?: number;
  pageSize?: number;
}): Promise<LogListResponse> {
  const sp = new URLSearchParams();
  if (params.search) sp.set('search', params.search);
  if (params.action) sp.set('action', params.action);
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  return fetchJSON(`${BASE}/activity-logs?${sp.toString()}`);
}

// ============ 模型管理 ============
export interface AiModelItem {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  description: string | null;
  api_base_url: string | null;
  api_key: string | null;
  temperature: number;
  max_tokens: number;
  cost_multiplier: number;
  tags: string | null;
  color: string | null;
  icon: string | null;
  sort_order: number;
  is_enabled: boolean;
  is_default: boolean;
  can_auto_route: boolean;
  auto_route_keywords: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchModels(search?: string): Promise<AiModelItem[]> {
  const url = search ? `${BASE}/models?search=${encodeURIComponent(search)}` : `${BASE}/models`;
  const res = await fetchJSON<{ data: AiModelItem[] }>(url);
  return res.data;
}

export async function createModel(data: Partial<AiModelItem>): Promise<AiModelItem> {
  const res = await fetchJSON<{ data: AiModelItem }>(`${BASE}/models`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateModel(id: string, data: Partial<AiModelItem>): Promise<AiModelItem> {
  const res = await fetchJSON<{ data: AiModelItem }>(`${BASE}/models/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteModel(id: string): Promise<void> {
  await fetchJSON(`${BASE}/models/${id}`, { method: 'DELETE' });
}

// ============ 计费 / 订阅 ============
export interface BillRecord {
  id: string;
  user_id: string;
  username?: string;
  email?: string;
  plan: string;
  amount: string | number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
}

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  username?: string;
  email?: string;
  plan: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface BillListResponse {
  data: BillRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SubscriptionListResponse {
  data: SubscriptionRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BillingQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}

export async function fetchBills(params: BillingQuery = {}): Promise<BillListResponse> {
  const sp = new URLSearchParams();
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  if (params.status) sp.set('status', params.status);
  if (params.search) sp.set('search', params.search);
  return fetchJSON<BillListResponse>(`${BASE}/billing?type=bills&${sp.toString()}`);
}

export async function createBill(payload: {
  user_id: string;
  plan: string;
  amount: number;
  currency?: string;
  status?: string;
  paid_at?: string | null;
}): Promise<{ data: BillRecord }> {
  return fetchJSON<{ data: BillRecord }>(`${BASE}/billing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'bill', ...payload }),
  });
}

export async function updateBill(
  id: string,
  payload: Partial<Pick<BillRecord, 'plan' | 'amount' | 'currency' | 'status' | 'paid_at'>>,
): Promise<{ data: BillRecord }> {
  return fetchJSON<{ data: BillRecord }>(`${BASE}/billing/${id}?type=bill`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'bill', ...payload }),
  });
}

export async function deleteBill(id: string): Promise<{ success: boolean }> {
  return fetchJSON<{ success: boolean }>(`${BASE}/billing/${id}?type=bill`, { method: 'DELETE' });
}

export async function fetchSubscriptions(params: BillingQuery = {}): Promise<SubscriptionListResponse> {
  const sp = new URLSearchParams();
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  if (params.status) sp.set('status', params.status);
  if (params.search) sp.set('search', params.search);
  return fetchJSON<SubscriptionListResponse>(`${BASE}/billing?type=subscriptions&${sp.toString()}`);
}

export async function createSubscription(payload: {
  user_id: string;
  plan: string;
  status?: string;
  started_at?: string;
  expires_at?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<{ data: SubscriptionRecord }> {
  return fetchJSON<{ data: SubscriptionRecord }>(`${BASE}/billing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'subscription', ...payload }),
  });
}

export async function updateSubscription(
  id: string,
  payload: Partial<Pick<SubscriptionRecord, 'plan' | 'status' | 'started_at' | 'expires_at' | 'metadata'>>,
): Promise<{ data: SubscriptionRecord }> {
  return fetchJSON<{ data: SubscriptionRecord }>(`${BASE}/billing/${id}?type=subscription`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'subscription', ...payload }),
  });
}

export async function deleteSubscription(id: string): Promise<{ success: boolean }> {
  return fetchJSON<{ success: boolean }>(`${BASE}/billing/${id}?type=subscription`, { method: 'DELETE' });
}

// ============ 客户档案 (CRM) ============
export interface CustomerRecord {
  id: string;
  company: string;
  contact?: string | null;
  phone?: string | null;
  industry?: string | null;
  currentPlan?: string | null;
  expiryDate?: string | null;
  salesPerson?: string | null;
  registeredAt?: string | null;
}

export interface CustomerListResponse {
  data: CustomerRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchCustomers(
  params: { search?: string; industry?: string; page?: number; pageSize?: number } = {},
): Promise<CustomerListResponse> {
  const sp = new URLSearchParams();
  if (params.search) sp.set('search', params.search);
  if (params.industry) sp.set('industry', params.industry);
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  return fetchJSON(`${BASE}/customers?${sp.toString()}`);
}

export async function createCustomer(data: Partial<CustomerRecord>): Promise<CustomerRecord> {
  const res = await fetchJSON<{ data: CustomerRecord }>(`${BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateCustomer(id: string, data: Partial<CustomerRecord>): Promise<CustomerRecord> {
  const res = await fetchJSON<{ data: CustomerRecord }>(`${BASE}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteCustomer(id: string): Promise<void> {
  await fetchJSON(`${BASE}/customers/${id}`, { method: 'DELETE' });
}

// ============ 线索管理 (CRM) ============
export interface LeadRecord {
  id: string;
  phone?: string | null;
  company?: string | null;
  industry?: string | null;
  intentLevel?: string | null;
  source?: string | null;
  assignedTo?: string | null;
  followUpStatus?: string | null;
  createdAt?: string | null;
}

export interface LeadListResponse {
  data: LeadRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchLeads(
  params: {
    search?: string;
    industry?: string;
    intentLevel?: string;
    source?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  } = {},
): Promise<LeadListResponse> {
  const sp = new URLSearchParams();
  if (params.search) sp.set('search', params.search);
  if (params.industry) sp.set('industry', params.industry);
  if (params.intentLevel) sp.set('intentLevel', params.intentLevel);
  if (params.source) sp.set('source', params.source);
  if (params.status) sp.set('status', params.status);
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  return fetchJSON(`${BASE}/leads?${sp.toString()}`);
}

export async function createLead(data: Partial<LeadRecord>): Promise<LeadRecord> {
  const res = await fetchJSON<{ data: LeadRecord }>(`${BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateLead(id: string, data: Partial<LeadRecord>): Promise<LeadRecord> {
  const res = await fetchJSON<{ data: LeadRecord }>(`${BASE}/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteLead(id: string): Promise<void> {
  await fetchJSON(`${BASE}/leads/${id}`, { method: 'DELETE' });
}

// ============ 龙掌柜套餐配额 ============
export interface QuotaPlan {
  id: string;
  name: string;
  dailyChatLimit: number;
  dailySkillLimit: number;
  monthlyTokenLimit: number;
  maxConcurrent: number;
  price: number;
  userCount: number;
  status?: string;
}

export async function fetchQuotaPlans(): Promise<QuotaPlan[]> {
  const res = await fetchJSON<{ data: QuotaPlan[] }>(`${BASE}/plans`);
  return res.data;
}

export async function updateQuotaPlan(
  id: string,
  payload: Partial<
    Pick<QuotaPlan, 'dailyChatLimit' | 'dailySkillLimit' | 'monthlyTokenLimit' | 'maxConcurrent' | 'price'>
  >,
): Promise<void> {
  await fetchJSON(`${BASE}/plans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ============ 龙掌柜技能管理 ============
export interface LzgSkill {
  id: string;
  key: string;
  name: string;
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

export async function fetchSkills(): Promise<LzgSkill[]> {
  const res = await fetchJSON<{ data: LzgSkill[] }>(`/api/skills`);
  return res.data;
}

export async function updateSkill(
  id: string,
  payload: Partial<
    Pick<LzgSkill, 'name' | 'description' | 'category' | 'modelId' | 'modelName' | 'promptTemplate' | 'icon' | 'isEnabled'>
  >,
): Promise<void> {
  await fetchJSON(`/api/skills/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ============ 全域数据看板 ============
export interface AnalyticsData {
  monthlyRevenue: { month: string; revenue: number }[];
  chatStats: { month: string; total: number; autoResolved: number; humanIntervention: number }[];
  industryDistribution: { name: string; value: number }[];
  planDistribution: { name: string; value: number }[];
  leadStats: { month: string; leads: number; converted: number }[];
  knowledgeEngineImportMonthTrend: { month: string; knowledge: number; geo: number }[];
  knowledgeEngineTenantGrowthTrend: { month: string; tenants: number }[];
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetchJSON<{ data: AnalyticsData }>(`${BASE}/analytics`);
  return res.data;
}

// ============ 龙掌柜数据看板 ============
export interface LzgDashboardData {
  overview: {
    total_users: number;
    total_assets: number;
    total_skills: number;
    enabled_skills: number;
    today_sessions: number;
    today_messages: number;
  };
  trend: { date: string; sessions: number; messages: number }[];
  skillRank: { skill: string; count: number }[];
  activeUsers: { name: string; email: string; message_count: number }[];
}

export async function fetchLzgDashboard(): Promise<LzgDashboardData> {
  const res = await fetchJSON<{ data: LzgDashboardData }>(`/api/lzg/dashboard`);
  return res.data;
}

// ============ 域途 GEO 管理记录 ============
export type GeoRecordType = 'diagnosis' | 'keywords' | 'copywriting' | 'templates' | 'monitoring';

export async function fetchGeoRecords(type: GeoRecordType): Promise<unknown[]> {
  const res = await fetchJSON<{ data: unknown[] }>(`/api/geo/admin-records?type=${type}`);
  return res.data;
}

// ============ 域途 GEO 文案生成 ============
export interface GenerateCopyParams {
  keyword: string;
  customer: string;
  copyType: string;
  language: string;
  wordCount: number;
}

export interface GenerateCopyResult {
  content: string;
}

export async function generateGeoCopywriting(params: GenerateCopyParams): Promise<GenerateCopyResult> {
  const res = await fetchJSON<{ data: GenerateCopyResult }>(`/api/geo/copywriting/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.data;
}

// ============ 智推 AI 客服 ============
export interface AiServiceChatRecord {
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

export interface AiFeedbackData {
  stats: { totalLikes: number; totalDislikes: number; satisfactionRate: number; pendingDislikes: number };
  chart: { month: string; likes: number; dislikes: number }[];
  recent: { id: string; customer: string; title: string; type: 'like' | 'dislike'; question: string; date: string }[];
}

export interface AiIntentKeyword {
  id: string;
  keyword: string;
  category: string;
  triggerCount: number;
  status: 'active' | 'inactive';
}

export interface AiQuotaConfig {
  dailyQuestionLimit: number;
  maxTurnsPerChat: number;
  maxConcurrency: number;
  replyTimeout: number;
  autoTransfer: boolean;
  transferConfidenceThreshold: number;
  leadFormAutoPopup: boolean;
  offhoursAutoReply: boolean;
  syncToWecom: boolean;
  updatedAt: string;
}

export interface AiWecomArchive {
  id: string;
  customer: string;
  contact: string;
  messageCount: number;
  lastMessage: string;
  date: string;
  status: string;
}

export async function fetchAiServiceRecords(
  type: 'chats' | 'feedback' | 'intent-keywords' | 'wecom-archives',
): Promise<unknown> {
  const res = await fetchJSON<{ data: unknown }>(`/api/ai-service/records?type=${type}`);
  return res.data;
}

export async function updateIntentKeyword(id: string, status: 'active' | 'inactive'): Promise<void> {
  await fetchJSON(`/api/ai-service/records`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
}

export async function fetchAiQuotaConfig(): Promise<AiQuotaConfig> {
  const res = await fetchJSON<{ data: AiQuotaConfig }>(`/api/ai-service/quota-config`);
  return res.data;
}

export async function updateAiQuotaConfig(payload: Partial<AiQuotaConfig>): Promise<void> {
  await fetchJSON(`/api/ai-service/quota-config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ============ 智能外呼 ============
export interface OutboundTask {
  id: string;
  name: string;
  scriptSceneId: string;
  scriptSceneName: string;
  totalNumbers: number;
  calledCount: number;
  connectedCount: number;
  leadCount: number;
  status: string;
  callMode: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutboundScriptScene {
  id: string;
  name: string;
  instanceId: string;
  scriptId: string;
  status: string;
  openingScript: string;
  closingScript: string;
  faqCount: number;
  createdAt: string;
}

export interface OutboundPhoneNumber {
  id: string;
  phone: string;
  customerName: string;
  remark: string;
  source: string;
  callStatus: string;
  intentTag: string;
  lastCallTime: string | null;
  createdAt: string;
}

export interface OutboundBlacklistItem {
  id: string;
  phone: string;
  reason: string;
  operator: string;
  createdAt: string;
}

export interface OutboundCallRecord {
  id: string;
  taskId: string;
  taskName: string;
  phone: string;
  customerName: string;
  callTime: string;
  duration: number;
  status: string;
  intentTag: string;
  recordingUrl: string;
  transcript: { role: string; content: string }[];
}

export interface OutboundConfig {
  accessKeyId: string;
  accessKeySecret: string;
  outboundPhone: string;
  callbackUrl: string;
  timeout: number;
  retryCount: number;
  status: string;
}

export interface OutboundDashboardData {
  stats: {
    totalCalls: number;
    connectedCalls: number;
    connectRate: number;
    leadCount: number;
    leadRate: number;
    activeTasks: number;
  };
  trend: { date: string; calls: number; connected: number; leads: number }[];
  intentData: { name: string; value: number }[];
  recentTasks: OutboundTask[];
}

export interface OutboundReportData {
  summary: { totalCalls: number; connectRate: number; leadRate: number; leadCount: number };
  dailyData: { date: string; calls: number; connected: number; leads: number }[];
  scriptCompareData: {
    name: string;
    total: number;
    connected: number;
    leads: number;
    rate: number;
  }[];
  intentDistData: { name: string; value: number }[];
  invalidData: { name: string; value: number }[];
}

export async function fetchOutboundRecords(
  type: 'tasks' | 'script-scenes' | 'phone-numbers' | 'blacklist' | 'call-records',
): Promise<unknown[]> {
  const res = await fetchJSON<{ data: unknown[] }>(`/api/outbound/records?type=${type}`);
  return res.data;
}

export async function addBlacklist(payload: { phone: string; reason: string; operator?: string }): Promise<void> {
  await fetchJSON(`/api/outbound/blacklist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteBlacklist(id: string): Promise<void> {
  await fetchJSON(`/api/outbound/blacklist/${id}`, { method: 'DELETE' });
}

export async function fetchOutboundConfig(): Promise<OutboundConfig> {
  const res = await fetchJSON<{ data: OutboundConfig }>(`/api/outbound/config`);
  return res.data;
}

export async function updateOutboundConfig(payload: Partial<OutboundConfig>): Promise<void> {
  await fetchJSON(`/api/outbound/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function fetchOutboundDashboard(): Promise<OutboundDashboardData> {
  const res = await fetchJSON<{ data: OutboundDashboardData }>(`/api/outbound/dashboard`);
  return res.data;
}

export async function fetchOutboundReports(): Promise<OutboundReportData> {
  const res = await fetchJSON<{ data: OutboundReportData }>(`/api/outbound/reports`);
  return res.data;
}
