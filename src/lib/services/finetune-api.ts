// 微调任务管理 API 服务层（对接后端 /api/admin/finetune）

const BASE = '/api/admin/finetune';

type FinetuneStatus =
  | 'pending'
  | 'building'
  | 'training'
  | 'evaluating'
  | 'deployed'
  | 'failed';

export interface FinetuneTask {
  id: string;
  name: string;
  base_model: string;
  dataset_path?: string;
  lora_rank: number;
  lora_alpha: number;
  status: FinetuneStatus;
  progress: number;
  eval_report?: {
    total?: number;
    passed?: number;
    pass_rate?: string;
    conclusion?: string;
    reasons?: Record<string, number>;
  } | null;
  task_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export const FINETUNE_STATUS_LABEL: Record<FinetuneStatus, string> = {
  pending: '待构建',
  building: '构建中',
  training: '训练中',
  evaluating: '评测中',
  deployed: '已部署',
  failed: '失败',
};

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const raw = localStorage.getItem('lakeli_admin_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u.id) headers['x-user-id'] = String(u.id);
      if (u.role) headers['x-user-role'] = String(u.role);
      if (u.email) headers['x-user-email'] = String(u.email);
    }
  } catch {
    // ignore
  }
  return headers;
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options?.headers as Record<string, string> | undefined) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const finetuneApi = {
  async list(): Promise<{ data: FinetuneTask[]; total: number }> {
    return fetchJSON(`${BASE}`);
  },
  async create(input: {
    name: string;
    base_model?: string;
    dataset_path?: string;
    lora_rank?: number;
    lora_alpha?: number;
  }): Promise<{ data: FinetuneTask }> {
    return fetchJSON(`${BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  },
  async update(
    id: string,
    patch: Partial<Pick<FinetuneTask, 'status' | 'progress' | 'eval_report' | 'task_id'>>,
  ): Promise<{ data: FinetuneTask }> {
    return fetchJSON(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  },
  async remove(id: string): Promise<{ success: boolean }> {
    return fetchJSON(`${BASE}/${id}`, { method: 'DELETE' });
  },
};
