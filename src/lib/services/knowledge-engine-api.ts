// 跨境外贸知识引擎 - API 服务层
// 数据来源于 /api/knowledge-engine/*（经 next.config 代理到 lakeli-app-xc:5002）

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface KeStats {
  knowledge: { total: number; avgCompleteness: number; byStatus: { status: string; count: string }[] };
  importTasks: { byStatus: { status: string; count: string }[] };
  geoContent: { total: number };
  gaps: { total: number; open: number };
  reports: Record<string, unknown>[];
  tenants: { total: number; active: number };
  qa: { total_questions: number; hit_rate: number; avg_response_ms: number };
  weeklyNewKnowledge: number;
  weeklyNewGeo: number;
  trend: { labels: string[]; knowledge: number[]; geo: number[]; tenants: number[] };
}

export async function fetchKeStats(): Promise<{ success: boolean; data: KeStats }> {
  return fetchJSON('/api/knowledge-engine/stats');
}

export interface KeTenant {
  id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  industry: string;
  data_isolation: string;
  vector_space: string;
  status: string;
  knowledge_count: number | null;
  created_at: string;
}

export interface KeTenantList {
  list: KeTenant[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface KeTenantQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  industry?: string;
  keyword?: string;
}

export async function fetchKeTenants(params: KeTenantQuery = {}): Promise<{ success: boolean; data: KeTenantList }> {
  const sp = new URLSearchParams();
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  if (params.status) sp.set('status', params.status);
  if (params.industry) sp.set('industry', params.industry);
  if (params.keyword) sp.set('keyword', params.keyword);
  return fetchJSON(`/api/knowledge-engine/tenants?${sp.toString()}`);
}

// ============ 日志统计中心 ============

export interface KeImportLog {
  id: string;
  task_name: string;
  action: string;
  file_info: string;
  status: 'success' | 'failed' | 'partial';
  details: string;
  operator_name: string;
  tenant_name: string;
  created_at: string;
}

export interface KeGeoLog {
  id: string;
  related_product_name: string;
  content_type: string;
  language: string;
  result: string;
  details: string;
  tenant_name: string;
  created_at: string;
}

export interface KeQaLog {
  id: string;
  user_question: string;
  retrieved_content: string;
  final_answer: string;
  is_hit: boolean;
  confidence: number;
  response_time: number;
  tenant_name: string;
  created_at: string;
}

export interface KeLogList<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchKeLog<T>(
  type: 'import-logs' | 'geo-logs' | 'qa-logs',
  params: { page?: number; pageSize?: number } = {},
): Promise<{ success: boolean; data: KeLogList<T> }> {
  const sp = new URLSearchParams();
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  return fetchJSON(`/api/knowledge-engine/${type}?${sp.toString()}`);
}

export function fetchKeImportLogs(
  params: { page?: number; pageSize?: number } = {},
): Promise<{ success: boolean; data: KeLogList<KeImportLog> }> {
  return fetchKeLog<KeImportLog>('import-logs', params);
}

export function fetchKeGeoLogs(
  params: { page?: number; pageSize?: number } = {},
): Promise<{ success: boolean; data: KeLogList<KeGeoLog> }> {
  return fetchKeLog<KeGeoLog>('geo-logs', params);
}

export function fetchKeQaLogs(
  params: { page?: number; pageSize?: number } = {},
): Promise<{ success: boolean; data: KeLogList<KeQaLog> }> {
  return fetchKeLog<KeQaLog>('qa-logs', params);
}

// ============ 系统权限管理 ============

export interface KeAccount {
  id: string;
  name: string;
  tenant_name: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface KeAccountList {
  list: KeAccount[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchKeAccounts(
  params: { page?: number; pageSize?: number } = {},
): Promise<{ success: boolean; data: KeAccountList }> {
  const sp = new URLSearchParams();
  if (params.page) sp.set('page', String(params.page));
  if (params.pageSize) sp.set('pageSize', String(params.pageSize));
  return fetchJSON(`/api/knowledge-engine/accounts?${sp.toString()}`);
}
