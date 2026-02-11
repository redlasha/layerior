'use client';

import { useStore } from '@/store/useStore';
import { LAYER_ORDER, LAYER_META } from '@/data/materials';
import { mockGuide } from '@/lib/mockApi';

export default function AiGuide() {
  const { plans, activePlanIndex, aiLoading, aiAnalysis, setAiLoading, setAiAnalysis } = useStore();
  const plan = plans[activePlanIndex];

  const hasSelections = LAYER_ORDER.some((key) => plan.selections[key]);

  const handleAnalyze = async () => {
    setAiLoading(true);
    setAiAnalysis('');

    const materials = LAYER_ORDER
      .filter((key) => plan.selections[key])
      .map((key) => ({
        layer: LAYER_META[key].label,
        name: plan.selections[key]!.name,
        qty: plan.quantities[key],
        unit: plan.selections[key]!.unit,
      }));

    try {
      const guide = await mockGuide(materials);
      setAiAnalysis(guide);
    } catch {
      setAiAnalysis('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-[16px] border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-secondary">AI 시공 가이드</h3>
        <button
          onClick={handleAnalyze}
          disabled={aiLoading || !hasSelections}
          className={`px-4 py-1.5 rounded-[10px] text-sm font-medium transition-all duration-150 ${
            aiLoading || !hasSelections
              ? 'bg-gray-100 text-text-muted cursor-not-allowed'
              : 'bg-primary text-white hover:opacity-90'
          }`}
        >
          {aiLoading ? '분석 중...' : 'AI 분석'}
        </button>
      </div>

      {aiLoading && (
        <div className="flex items-center justify-center py-8 gap-2 text-text-muted">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm">AI가 분석하고 있습니다...</span>
        </div>
      )}

      {!aiLoading && aiAnalysis && (
        <div className="text-sm leading-relaxed whitespace-pre-wrap text-text-primary bg-gray-50 rounded-xl p-4 max-h-[500px] overflow-y-auto">
          {aiAnalysis}
        </div>
      )}

      {!aiLoading && !aiAnalysis && !hasSelections && (
        <p className="text-sm text-text-muted text-center py-4">
          자재를 선택한 후 AI 분석을 요청하세요
        </p>
      )}

      {!aiLoading && !aiAnalysis && hasSelections && (
        <p className="text-sm text-text-muted text-center py-4">
          AI 분석 버튼을 눌러 시공 가이드를 받아보세요
        </p>
      )}
    </div>
  );
}
