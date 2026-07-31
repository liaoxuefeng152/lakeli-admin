// 拉客力数据中台 - 统一服务层客户端（Phase D）
// 所有取数经 /api/dp/* ，替代各模块直连业务接口。

const BASE = '/api/dp';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || (err as { message?: string }).message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ---------------- 指标平台 ----------------
export interface MetricResult {
  name: string;
  title: string;
  chart_type: string;
  dimensions: string[];
  rows: Record<string, unknown>[];
}

export interface MetricDefinition {
  id: string;
  name: string;
  title: string;
  sql_template: string;
  dimensions: string[];
  chart_type: string;
  owner_module: string | null;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchMetrics(names?: string[], filters?: Record<string, string>): Promise<MetricResult[]> {
  const params = new URLSearchParams();
  if (names && names.length) params.set('names', names.join(','));
  if (filters) params.set('filters', Object.entries(filters).map(([k, v]) => `${k}:${v}`).join(','));
  const q = params.toString();
  const res = await fetchJSON<{ code: number; data: MetricResult[]; message: string }>(`${BASE}/metrics${q ? `?${q}` : ''}`);
  return res.data;
}

export async function fetchMetricDefinitions(status?: string): Promise<MetricDefinition[]> {
  const q = status ? `?status=${status}` : '';
  const res = await fetchJSON<{ code: number; data: MetricDefinition[] }>(`${BASE}/metrics/definitions${q}`);
  return res.data;
}

export async function createMetricDefinition(body: Partial<MetricDefinition>): Promise<MetricDefinition> {
  const res = await fetchJSON<{ code: number; data: MetricDefinition }>(`${BASE}/metrics/definitions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return res.data;
}

export async function updateMetricDefinition(id: string, body: Partial<MetricDefinition>): Promise<MetricDefinition> {
  const res = await fetchJSON<{ code: number; data: MetricDefinition }>(`${BASE}/metrics/definitions`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...body }),
  });
  return res.data;
}

export async function deleteMetricDefinition(id: string): Promise<void> {
  await fetchJSON(`${BASE}/metrics/definitions?id=${id}`, { method: 'DELETE' });
}

export async function triggerSync(): Promise<{ step: string; affected: number }[]> {
  const res = await fetchJSON<{ code: number; data: { step: string; affected: number }[] }>(`${BASE}/sync`, { method: 'POST' });
  return res.data;
}

// ---------------- 主数据 / 维度 ----------------
export async function fetchDimensions(name: string): Promise<{ value: string; label: string }[]> {
  const res = await fetchJSON<{ code: number; data: { value: string; label: string }[] }>(`${BASE}/dimensions/${name}`);
  return res.data;
}

// ---------------- 客户 360 ----------------
export interface Customer360 {
  profile: { customer_id: string; source_system: string; source_id: string; unified_profile_json: unknown };
  identities: { source_system: string; source_id: string }[];
  leads: Record<string, unknown>[];
  calls: Record<string, unknown>[];
  revenue: Record<string, unknown>[];
  chats: Record<string, unknown>[];
  summary: { leadCount: number; callCount: number; totalRevenue: number; totalCallDuration: number; chatCount: number };
}

export async function fetchCustomer360(id: string): Promise<Customer360> {
  const res = await fetchJSON<{ code: number; data: Customer360 }>(`${BASE}/entities/customer/${id}`);
  return res.data;
}

export interface CustomerListItem {
  customer_id: string;
  source_id: string;
  unified_profile_json: unknown;
}
export async function fetchCustomerList(): Promise<CustomerListItem[]> {
  const res = await fetchJSON<{ code: number; data: CustomerListItem[] }>(`${BASE}/entities/customer`);
  return res.data;
}

// ---------------- 治理层 ----------------
export interface GovernanceMetric {
  metric_name: string;
  metric_value: string | number;
}
export interface GovernanceResponse {
  governance: GovernanceMetric[];
  inventory: Record<string, number>;
  knowledgeTenants: { vector_space: string; c: string }[];
}
export async function fetchGovernance(): Promise<GovernanceResponse> {
  const res = await fetchJSON<{ code: number; data: GovernanceResponse }>(`${BASE}/governance`);
  return res.data;
}

// ---------------- 标签分群 ----------------
export interface Tag {
  tag_id: string;
  name: string;
  type: string;
  rule: string | null;
  created_at: string;
  entity_count: number;
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetchJSON<{ code: number; data: Tag[] }>(`${BASE}/tags`);
  return res.data;
}

export async function createTag(name: string, type = 'manual', rule?: string): Promise<Tag> {
  const res = await fetchJSON<{ code: number; data: Tag }>(`${BASE}/tags`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, type, rule }),
  });
  return res.data;
}

export async function assignTag(entity_type: string, entity_id: string, tag_id: string): Promise<void> {
  await fetchJSON(`${BASE}/tags/assign`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entity_type, entity_id, tag_id }),
  });
}

export interface SegmentEntity {
  type: string;
  id: string;
}
export interface Segment {
  tag_id: string;
  tag_name: string;
  entities: SegmentEntity[];
}
export async function fetchSegments(tag_id?: string): Promise<Segment[]> {
  const q = tag_id ? `?tag_id=${tag_id}` : '';
  const res = await fetchJSON<{ code: number; data: Segment[] }>(`${BASE}/segments${q}`);
  return res.data;
}
