'use client';

import { useStore } from '@/store/useStore';
import { LAYER_ORDER, LAYER_META, MATERIALS } from '@/data/materials';
import { LayerKey } from '@/types';
import MaterialCard from './MaterialCard';

export default function MaterialSelector() {
  const { activeLayer, setActiveLayer, plans, activePlanIndex, selectMaterial, updateQuantity } = useStore();
  const plan = plans[activePlanIndex];
  const materials = MATERIALS[activeLayer];
  const meta = LAYER_META[activeLayer];
  const selectedMaterial = plan.selections[activeLayer];
  const qty = plan.quantities[activeLayer];

  return (
    <div className="bg-surface rounded-[16px] border border-border p-4">
      {/* Layer tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {LAYER_ORDER.map((key: LayerKey) => (
          <button
            key={key}
            onClick={() => setActiveLayer(key)}
            className={`px-3 py-1.5 rounded-[10px] text-sm whitespace-nowrap transition-all duration-150 ${
              activeLayer === key
                ? 'bg-primary text-white font-medium'
                : 'text-text-secondary hover:bg-gray-100'
            }`}
          >
            {LAYER_META[key].icon} {LAYER_META[key].label}
          </button>
        ))}
      </div>

      {/* Quantity input */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <label className="text-sm text-text-secondary">수량</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => updateQuantity(activeLayer, Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 px-3 py-1.5 rounded-[8px] border border-border text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="text-sm text-text-muted">{selectedMaterial?.unit ?? meta.label}</span>
      </div>

      {/* Material list */}
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
        {materials.map((mat) => (
          <MaterialCard
            key={mat.id}
            material={mat}
            isSelected={selectedMaterial?.id === mat.id}
            onSelect={() => selectMaterial(activeLayer, mat)}
          />
        ))}
      </div>
    </div>
  );
}
