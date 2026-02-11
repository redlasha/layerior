'use client';

import { useStore } from '@/store/useStore';

export default function PlanTabs() {
  const { plans, activePlanIndex, setActivePlan, addPlan } = useStore();

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {plans.map((plan, i) => (
        <button
          key={plan.id}
          onClick={() => setActivePlan(i)}
          className={`px-4 py-1.5 rounded-[20px] text-sm font-medium whitespace-nowrap transition-all duration-150 ${
            activePlanIndex === i
              ? 'bg-primary text-white'
              : 'bg-surface text-text-secondary border border-border hover:border-text-muted'
          }`}
        >
          {plan.name}
        </button>
      ))}
      {plans.length < 4 && (
        <button
          onClick={addPlan}
          className="px-3 py-1.5 rounded-[20px] text-sm text-text-muted border border-dashed border-border hover:border-text-muted transition-colors"
        >
          + 안 추가
        </button>
      )}
    </div>
  );
}
