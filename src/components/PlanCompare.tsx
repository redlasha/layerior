'use client';

import { useStore } from '@/store/useStore';
import { LAYER_ORDER, LAYER_META } from '@/data/materials';
import { formatPrice } from '@/lib/utils';

export default function PlanCompare() {
  const { plans } = useStore();

  if (plans.length < 2) return null;

  const planSummaries = plans.map((plan) => {
    const items = LAYER_ORDER.filter((key) => plan.selections[key]);
    const materialTotal = items.reduce((sum, key) => {
      const mat = plan.selections[key]!;
      return sum + mat.price * plan.quantities[key];
    }, 0);
    const laborCost = Math.round(materialTotal * 0.4);
    return {
      name: plan.name,
      itemCount: items.length,
      materialTotal,
      grandTotal: materialTotal + laborCost,
      selections: LAYER_ORDER.map((key) => ({
        layer: LAYER_META[key].label,
        material: plan.selections[key]?.name ?? '-',
      })),
    };
  });

  return (
    <div className="bg-surface rounded-[16px] border border-border p-4">
      <h3 className="text-sm font-semibold text-text-secondary mb-3">시안 비교</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-text-muted font-normal">구분</th>
              {planSummaries.map((s) => (
                <th key={s.name} className="text-right py-2 px-2 font-medium">{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LAYER_ORDER.map((key, i) => (
              <tr key={key} className="border-b border-border/50">
                <td className="py-2 pr-4 text-text-muted">{LAYER_META[key].label}</td>
                {planSummaries.map((s) => (
                  <td key={s.name} className="py-2 px-2 text-right">{s.selections[i].material}</td>
                ))}
              </tr>
            ))}
            <tr className="border-b border-border">
              <td className="py-2 pr-4 text-text-muted">선택 항목</td>
              {planSummaries.map((s) => (
                <td key={s.name} className="py-2 px-2 text-right">{s.itemCount}개</td>
              ))}
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium">예상 총액</td>
              {planSummaries.map((s) => (
                <td key={s.name} className="py-2 px-2 text-right font-bold text-primary">
                  {s.grandTotal > 0 ? formatPrice(s.grandTotal) : '-'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
