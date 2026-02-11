'use client';

import { useStore } from '@/store/useStore';
import { LAYER_ORDER, LAYER_META } from '@/data/materials';
import { formatPrice } from '@/lib/utils';
import { CostItem } from '@/types';

export default function CostBreakdown() {
  const { plans, activePlanIndex } = useStore();
  const plan = plans[activePlanIndex];

  const items: CostItem[] = LAYER_ORDER
    .filter((key) => plan.selections[key])
    .map((key) => {
      const mat = plan.selections[key]!;
      const qty = plan.quantities[key];
      return {
        layer: LAYER_META[key].label,
        material: mat.name,
        qty,
        unit: mat.unit,
        unitPrice: mat.price,
        total: mat.price * qty,
      };
    });

  const materialTotal = items.reduce((sum, item) => sum + item.total, 0);
  const laborCost = Math.round(materialTotal * 0.4);
  const grandTotal = materialTotal + laborCost;

  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-[16px] border border-border p-4">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">견적서</h3>
        <p className="text-sm text-text-muted text-center py-4">자재를 선택하면 견적이 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-[16px] border border-border p-4">
      <h3 className="text-sm font-semibold text-text-secondary mb-3">견적서</h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.layer} className="flex items-center justify-between text-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.material}</p>
              <p className="text-xs text-text-muted">
                {formatPrice(item.unitPrice)} x {item.qty}{item.unit}
              </p>
            </div>
            <span className="font-medium shrink-0 ml-3">{formatPrice(item.total)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-3 pt-3 flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">자재비 소계</span>
          <span>{formatPrice(materialTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">예상 인건비 (40%)</span>
          <span>{formatPrice(laborCost)}</span>
        </div>
        <div className="flex justify-between text-base font-bold mt-1 pt-2 border-t border-border">
          <span>예상 총액</span>
          <span className="text-primary">{formatPrice(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
