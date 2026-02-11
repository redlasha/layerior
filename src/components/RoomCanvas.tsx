'use client';

import { useStore } from '@/store/useStore';
import { LAYER_META, LAYER_ORDER } from '@/data/materials';

export default function RoomCanvas() {
  const { image, plans, activePlanIndex, analysisResult } = useStore();
  const plan = plans[activePlanIndex];

  const floorRatio = analysisResult?.floor_ratio ?? 0.35;
  const wallRatio = analysisResult?.wall_ratio ?? 0.45;
  const ceilingRatio = analysisResult?.ceiling_ratio ?? 0.20;

  if (!image) {
    return (
      <div className="w-full aspect-[4/3] bg-surface rounded-[16px] border border-border flex flex-col items-center justify-center gap-3 text-text-muted">
        <span className="text-5xl">📷</span>
        <p className="text-sm">사진을 업로드하세요</p>
        <p className="text-xs">방 사진 한 장이면 시작할 수 있어요</p>
      </div>
    );
  }

  const activeLayers = LAYER_ORDER.filter((k) => plan.layers[k] && plan.selections[k]);

  return (
    <div className="w-full relative rounded-[16px] overflow-hidden border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt="업로드된 방 사진"
        className="w-full aspect-[4/3] object-cover"
      />

      {/* Layer overlays */}
      {plan.layers.floor && plan.selections.floor && (
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none transition-opacity duration-300"
          style={{
            height: `${floorRatio * 100}%`,
            background: `linear-gradient(to top, ${plan.selections.floor.color}88, ${plan.selections.floor.color}00)`,
          }}
        />
      )}
      {plan.layers.wall && plan.selections.wall && (
        <div
          className="absolute left-0 right-0 pointer-events-none transition-opacity duration-300"
          style={{
            top: `${ceilingRatio * 100}%`,
            height: `${wallRatio * 100}%`,
            background: `linear-gradient(to right, ${plan.selections.wall.color}00, ${plan.selections.wall.color}66, ${plan.selections.wall.color}66, ${plan.selections.wall.color}00)`,
          }}
        />
      )}
      {plan.layers.ceiling && plan.selections.ceiling && (
        <div
          className="absolute left-0 right-0 top-0 pointer-events-none transition-opacity duration-300"
          style={{
            height: `${ceilingRatio * 100}%`,
            background: `linear-gradient(to bottom, ${plan.selections.ceiling.color}88, ${plan.selections.ceiling.color}00)`,
          }}
        />
      )}
      {plan.layers.electrical && plan.selections.electrical && (
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-300"
          style={{
            width: '40%',
            aspectRatio: '1',
            background: `radial-gradient(circle, ${plan.selections.electrical.color}55 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Active layer badges */}
      {activeLayers.length > 0 && (
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {activeLayers.map((k) => (
            <span
              key={k}
              className="px-2 py-0.5 rounded-[20px] bg-black/50 text-white text-xs backdrop-blur-sm"
            >
              {LAYER_META[k].icon} {LAYER_META[k].label}
            </span>
          ))}
        </div>
      )}

      {/* Room analysis info */}
      {analysisResult && (
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/50 text-white text-xs backdrop-blur-sm">
          {analysisResult.room_type} · 약 {analysisResult.estimated_area_m2}㎡
        </div>
      )}
    </div>
  );
}
