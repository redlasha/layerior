'use client';

import { Material } from '@/types';
import { formatPrice } from '@/lib/utils';

interface MaterialCardProps {
  material: Material;
  isSelected: boolean;
  onSelect: () => void;
}

export default function MaterialCard({ material, isSelected, onSelect }: MaterialCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150 ${
        isSelected
          ? 'bg-primary-light border-2 border-primary'
          : 'bg-surface border border-border hover:border-text-muted'
      }`}
    >
      <div
        className="w-9 h-9 rounded-lg shrink-0 border border-border"
        style={{ backgroundColor: material.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{material.name}</p>
        <p className="text-xs text-text-muted">{material.description}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-primary">{formatPrice(material.price)}</p>
        <p className="text-xs text-text-muted">/{material.unit}</p>
      </div>
    </button>
  );
}
