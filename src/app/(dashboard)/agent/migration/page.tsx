'use client';

import { useState, useCallback } from 'react';
import {
  Upload, FileText, CheckCircle2, XCircle, Download,
  Trash2, ArrowRight, FileSpreadsheet, AlertCircle,
} from 'lucide-react';
import { migrationLogs } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function MigrationPage() {
  const [dualEngine, setDualEngine] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [parsePreview, setParsePreview] = useState<{ industry: string; count: number }[] | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      simulateUpload(file.name);
    }
  }, []);

  const handleFileSelect = () => {
    simulateUpload('coze_export_prompt_20260711.xlsx');
  };

  const simulateUpload = (fileName: string) => {
    setUploadedFile(fileName);
    setParsePreview([
      { industry: '通用GEO', count: 18 },
      { industry: '黄精跨境', count: 12 },
      { industry: '工业机械', count: 8 },
      { industry: '本地商家', count: 7 },
    ]);
  };

  const handleClearUpload = () => {
    setUploadedFile(null);
    setParsePreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">扣子资产批量迁移工具</h1>
          <p className="text-sm text-gray-500 mt-1">从扣子平台导入Prompt、FAQ、知识库素材，一键生成对应行业智能体</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">双引擎并行</span>
          <button
            onClick={() => setDualEngine(!dualEngine)}
            className={`relative h-5 w-9 rounded-full transition-colors ${dualEngine ? 'bg-[#FF7D00]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${dualEngine ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
          <span className="text-xs text-gray-500">
            {dualEngine ? '客户中台同时走扣子+自研Agent引擎' : '仅使用自研Agent引擎'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left 2/3: Upload + Logs */}
        <div className="col-span-2 space-y-4">
          {/* Upload Area */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="h-4 w-4 text-[#FF7D00]" />
              文件上传
            </h3>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragging
                  ? 'border-[#FF7D00] bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileSpreadsheet className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-600 mb-1">拖拽文件到此处上传，或点击下方按钮选择文件</p>
              <p className="text-xs text-gray-400 mb-4">支持格式：Excel (.xlsx)、CSV，文件大小不超过50MB</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleFileSelect}>
                  <Upload className="mr-2 h-4 w-4" />
                  上传扣子导出Excel（Prompt/FAQ）
                </Button>
              </div>
            </div>

            {/* Parse Preview */}
            {uploadedFile && parsePreview && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#FF7D00]" />
                    <span className="text-sm font-medium text-gray-700">{uploadedFile}</span>
                    <Badge className="bg-green-50 text-green-600 border-green-200">解析成功</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClearUpload}>
                    <XCircle className="mr-1 h-3 w-3" />移除
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mb-2">行业分类预览：</p>
                <div className="flex flex-wrap gap-2">
                  {parsePreview.map((item) => (
                    <div key={item.industry} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 border border-gray-200">
                      <span className="text-sm text-gray-700">{item.industry}</span>
                      <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">{item.count}条</Badge>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  共解析 {parsePreview.reduce((sum, i) => sum + i.count, 0)} 条资产
                </p>
              </div>
            )}
          </div>

          {/* Import Logs */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#FF7D00]" />
              导入日志
            </h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">导入时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">文件名</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">导入总数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">成功条数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">失败条数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {migrationLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">{log.importTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-mono truncate max-w-[200px]">{log.fileName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{log.total}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />{log.success}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {log.failed > 0 ? (
                        <span className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />{log.failed}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {log.failed > 0 && (
                        <Button variant="ghost" size="sm" className="text-[#FF7D00] h-7 px-2">
                          <Download className="mr-1 h-3 w-3" />
                          下载错误修正模板
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1/3: Actions & Status */}
        <div className="space-y-4">
          {/* Dual Engine Status */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">引擎状态</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-green-200 bg-green-50/50 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">自研Agent引擎</span>
                </div>
                <p className="text-xs text-gray-500">主力引擎运行中，已承载5个行业智能体</p>
              </div>
              <div className={`rounded-lg border p-3 ${dualEngine ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {dualEngine ? (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm font-medium ${dualEngine ? 'text-orange-700' : 'text-gray-400'}`}>
                    扣子平台（兜底）
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {dualEngine ? '并行运行中，预计2周后完全切换' : '已关闭，仅使用自研引擎'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">操作</h3>
            <Button
              className="w-full bg-[#FF7D00] hover:bg-[#e86e00] text-white"
              disabled={!uploadedFile}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              一键批量生成Agent
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClearUpload}
              disabled={!uploadedFile}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              清空导入记录
            </Button>
            {!uploadedFile && (
              <p className="text-xs text-gray-400 text-center">请先上传文件后再执行操作</p>
            )}
          </div>

          {/* Tips */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">使用说明</h3>
            <div className="space-y-2 text-xs text-gray-500">
              <p>1. 从扣子平台导出Prompt/FAQ数据为Excel文件</p>
              <p>2. 上传文件后系统自动解析并按行业分类</p>
              <p>3. 点击「一键批量生成Agent」自动创建对应智能体</p>
              <p>4. 失败词条可下载错误修正模板，修正后重新导入</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
