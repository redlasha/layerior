'use client';

import Header from '@/components/Header';
import RoomCanvas from '@/components/RoomCanvas';
import LayerPanel from '@/components/LayerPanel';
import MaterialSelector from '@/components/MaterialSelector';
import CostBreakdown from '@/components/CostBreakdown';
import PlanTabs from '@/components/PlanTabs';
import PlanCompare from '@/components/PlanCompare';
import AiGuide from '@/components/AiGuide';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Plan tabs */}
        <div className="mb-4">
          <PlanTabs />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          {/* Left column: Canvas + Material selector */}
          <div className="flex flex-col gap-4">
            <RoomCanvas />
            <MaterialSelector />
          </div>

          {/* Right column: Layers + Cost + AI */}
          <div className="flex flex-col gap-4">
            <LayerPanel />
            <CostBreakdown />
            <AiGuide />
          </div>
        </div>

        {/* Plan comparison (only shown with 2+ plans) */}
        <div className="mt-4">
          <PlanCompare />
        </div>
      </main>
    </div>
  );
}
