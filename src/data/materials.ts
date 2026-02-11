import { LayerKey, Material } from '@/types';

export const MATERIALS: Record<LayerKey, Material[]> = {
  floor: [
    { id: 'f1', name: '강화마루 (8mm)', unit: '㎡', price: 25000, color: '#C4A882', description: '가성비 좋은 기본형', category: 'floor' },
    { id: 'f2', name: '원목마루 (오크)', unit: '㎡', price: 65000, color: '#A0784C', description: '따뜻한 고급감', category: 'floor' },
    { id: 'f3', name: '헤링본 마루', unit: '㎡', price: 85000, color: '#B8956A', description: '클래식 패턴', category: 'floor' },
    { id: 'f4', name: '폴리싱 타일', unit: '㎡', price: 45000, color: '#D4CFC8', description: '모던한 광택', category: 'floor' },
    { id: 'f5', name: 'SPC 바닥재', unit: '㎡', price: 35000, color: '#BEB5A8', description: '방수·내구성', category: 'floor' },
  ],
  wall: [
    { id: 'w1', name: '실크 벽지', unit: '롤', price: 15000, color: '#F5F0E8', description: '부드러운 질감', category: 'wall' },
    { id: 'w2', name: '합지 벽지', unit: '롤', price: 8000, color: '#FFFEF5', description: '경제적 선택', category: 'wall' },
    { id: 'w3', name: '페인트 (매트)', unit: '㎡', price: 12000, color: '#E8E4DC', description: '깔끔한 마감', category: 'wall' },
    { id: 'w4', name: '페인트 (무광 그레이)', unit: '㎡', price: 14000, color: '#C8C4BC', description: '모던 분위기', category: 'wall' },
    { id: 'w5', name: '포인트 타일', unit: '㎡', price: 55000, color: '#4A6B5A', description: '감각적 포인트', category: 'wall' },
  ],
  ceiling: [
    { id: 'c1', name: '평천장 도배', unit: '㎡', price: 18000, color: '#FFFFFF', description: '기본 마감', category: 'ceiling' },
    { id: 'c2', name: '우물천장', unit: '㎡', price: 45000, color: '#F8F6F0', description: '간접조명 가능', category: 'ceiling' },
    { id: 'c3', name: '몰딩 마감', unit: 'm', price: 12000, color: '#F0EDE5', description: '클래식 디테일', category: 'ceiling' },
  ],
  electrical: [
    { id: 'e1', name: '매입등 (LED)', unit: '개', price: 35000, color: '#FFE4A0', description: '깔끔한 조명', category: 'electrical' },
    { id: 'e2', name: '레일 조명', unit: '세트', price: 120000, color: '#FFF0C0', description: '카페 느낌', category: 'electrical' },
    { id: 'e3', name: '간접 조명 (LED바)', unit: 'm', price: 25000, color: '#FFFBE0', description: '은은한 무드', category: 'electrical' },
    { id: 'e4', name: '콘센트 증설', unit: '개', price: 50000, color: '#E0E0E0', description: '편의성 향상', category: 'electrical' },
    { id: 'e5', name: '스위치 교체', unit: '개', price: 15000, color: '#D0D0D0', description: '터치식 전환', category: 'electrical' },
  ],
};

export const LAYER_META: Record<LayerKey, { label: string; icon: string; defaultQty: number }> = {
  floor:      { label: '바닥',      icon: '⬛', defaultQty: 26 },
  wall:       { label: '벽면',      icon: '🧱', defaultQty: 40 },
  ceiling:    { label: '천장',      icon: '⬜', defaultQty: 26 },
  electrical: { label: '전기/조명', icon: '💡', defaultQty: 6 },
};

export const LAYER_ORDER: LayerKey[] = ['floor', 'wall', 'ceiling', 'electrical'];
