import { create } from 'zustand';
import { StoreState, LayerKey, Material, Plan, AnalysisResult } from '@/types';
import { LAYER_META } from '@/data/materials';
import { generateId } from '@/lib/utils';

function createDefaultPlan(name: string): Plan {
  return {
    id: generateId(),
    name,
    layers: { floor: true, wall: true, ceiling: true, electrical: true },
    selections: {},
    quantities: {
      floor: LAYER_META.floor.defaultQty,
      wall: LAYER_META.wall.defaultQty,
      ceiling: LAYER_META.ceiling.defaultQty,
      electrical: LAYER_META.electrical.defaultQty,
    },
  };
}

export const useStore = create<StoreState>((set, get) => ({
  image: null,
  setImage: (img: string | null) => set({ image: img }),

  plans: [createDefaultPlan('A안')],
  activePlanIndex: 0,

  setActivePlan: (index: number) => set({ activePlanIndex: index }),

  addPlan: () => {
    const { plans } = get();
    if (plans.length >= 4) return;
    const names = ['A안', 'B안', 'C안', 'D안'];
    const newPlan = createDefaultPlan(names[plans.length] || `${plans.length + 1}안`);
    set({ plans: [...plans, newPlan], activePlanIndex: plans.length });
  },

  toggleLayer: (key: LayerKey) => {
    const { plans, activePlanIndex } = get();
    const updated = plans.map((p, i) => {
      if (i !== activePlanIndex) return p;
      return { ...p, layers: { ...p.layers, [key]: !p.layers[key] } };
    });
    set({ plans: updated });
  },

  selectMaterial: (key: LayerKey, mat: Material) => {
    const { plans, activePlanIndex } = get();
    const updated = plans.map((p, i) => {
      if (i !== activePlanIndex) return p;
      return { ...p, selections: { ...p.selections, [key]: mat } };
    });
    set({ plans: updated });
  },

  updateQuantity: (key: LayerKey, qty: number) => {
    const { plans, activePlanIndex } = get();
    const updated = plans.map((p, i) => {
      if (i !== activePlanIndex) return p;
      return { ...p, quantities: { ...p.quantities, [key]: qty } };
    });
    set({ plans: updated });
  },

  activeLayer: 'floor',
  setActiveLayer: (key: LayerKey) => set({ activeLayer: key }),

  aiLoading: false,
  aiAnalysis: '',
  setAiLoading: (v: boolean) => set({ aiLoading: v }),
  setAiAnalysis: (v: string) => set({ aiAnalysis: v }),

  analysisResult: null,
  setAnalysisResult: (r: AnalysisResult | null) => set({ analysisResult: r }),
}));
