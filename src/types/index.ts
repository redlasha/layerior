export type LayerKey = 'floor' | 'wall' | 'ceiling' | 'electrical';

export interface Material {
  id: string;
  name: string;
  unit: string;
  price: number;
  color: string;
  texture?: string;
  description: string;
  category: LayerKey;
}

export interface Plan {
  id: string;
  name: string;
  layers: Record<LayerKey, boolean>;
  selections: Partial<Record<LayerKey, Material>>;
  quantities: Record<LayerKey, number>;
}

export interface CostItem {
  layer: string;
  material: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface AnalysisResult {
  floor_ratio: number;
  wall_ratio: number;
  ceiling_ratio: number;
  room_type: string;
  estimated_area_m2: number;
  features: string[];
}

export interface StoreState {
  image: string | null;
  setImage: (img: string | null) => void;

  plans: Plan[];
  activePlanIndex: number;
  setActivePlan: (index: number) => void;
  addPlan: () => void;
  toggleLayer: (key: LayerKey) => void;
  selectMaterial: (key: LayerKey, mat: Material) => void;
  updateQuantity: (key: LayerKey, qty: number) => void;

  activeLayer: LayerKey;
  setActiveLayer: (key: LayerKey) => void;

  aiLoading: boolean;
  aiAnalysis: string;
  setAiLoading: (v: boolean) => void;
  setAiAnalysis: (v: string) => void;

  analysisResult: AnalysisResult | null;
  setAnalysisResult: (r: AnalysisResult | null) => void;
}
