'use client';

import { useStore } from '@/store/useStore';
import { LAYER_ORDER, LAYER_META } from '@/data/materials';
import { LayerKey } from '@/types';

export default function LayerPanel() {
  const { plans, activePlanIndex, toggleLayer, activeLayer, setActiveLayer } = useStore();
  const plan = plans[activePlanIndex];

  return (
    <div className="bg-surface rounded-[16px] border border-border p-4">
      <h3 className="text-sm font-semibold text-text-secondary mb-3">레이어</h3>
      <div className="flex flex-col gap-2">
        {LAYER_ORDER.map((key: LayerKey) => {
          const meta = LAYER_META[key];
          const isOn = plan.layers[key];
          const selected = plan.selections[key];
          const isActive = activeLayer === key;

          return (
            <div
              key={key}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                isActive ? 'bg-primary-light ring-1 ring-primary' : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveLayer(key)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLayer(key);
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-150 shrink-0 ${
                  isOn
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-muted'
                }`}
              >
                {isOn ? '✓' : meta.icon}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{meta.icon} {meta.label}</p>
                <p className="text-xs text-text-muted truncate">
                  {selected ? selected.name : '자재 미선택'}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-[20px] ${
                  isOn ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-muted'
                }`}
              >
                {isOn ? 'ON' : 'OFF'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
