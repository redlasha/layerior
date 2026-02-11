# 층층이 - AI 인테리어 견적 시뮬레이터

## 프로젝트 개요

방 사진 한 장으로 인테리어 자재를 레이어별로 비교하고, 실시간 견적과 AI 시공 가이드를 제공하는 웹 서비스.
프라이머 x 조코딩 x OpenAI 해커톤 출품작.

## 핵심 컨셉

포토샵의 레이어 시스템을 인테리어 견적에 적용한다.
- 바닥, 벽면, 천장, 전기/조명을 독립 레이어로 분리
- 레이어별로 자재를 선택하면 사진 위에 오버레이가 실시간 반영
- 여러 시안(A안/B안/C안)을 만들어 비교 가능
- AI가 시공 순서, 주의사항, 비용 절감 팁 제공

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **AI**: OpenAI API (GPT-4o Vision, GPT-4o, DALL-E 3)
- **상태관리**: Zustand
- **배포**: Vercel

## 디렉토리 구조

```
층층이/
├── CLAUDE.md                    # 이 파일 (에이전트 컨텍스트)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .env.local                   # OPENAI_API_KEY
├── public/
│   ├── logo.png                 # 60x60 로고
│   └── sample-room.jpg          # 데모용 샘플 이미지
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 루트 레이아웃 (Pretendard 폰트)
│   │   ├── page.tsx             # 메인 페이지
│   │   ├── globals.css
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts     # OpenAI Vision - 공간 영역 인식
│   │       ├── guide/
│   │       │   └── route.ts     # OpenAI GPT - 시공 가이드 생성
│   │       └── preview/
│   │           └── route.ts     # OpenAI DALL-E - 자재 적용 이미지
│   ├── components/
│   │   ├── Header.tsx           # 앱 헤더 + 사진 업로드 버튼
│   │   ├── RoomCanvas.tsx       # 방 사진 + 레이어 오버레이 캔버스
│   │   ├── LayerPanel.tsx       # 레이어 토글 패널 (ON/OFF)
│   │   ├── MaterialSelector.tsx # 자재 선택 탭 + 카드 목록
│   │   ├── MaterialCard.tsx     # 개별 자재 카드
│   │   ├── CostBreakdown.tsx    # 견적서 (자재비 + 인건비)
│   │   ├── AiGuide.tsx          # AI 시공 가이드 패널
│   │   ├── PlanTabs.tsx         # A안/B안/C안 탭 전환
│   │   ├── PlanCompare.tsx      # 시안 비교 테이블
│   │   └── ExportButton.tsx     # 견적서 PDF 내보내기
│   ├── store/
│   │   └── useStore.ts          # Zustand 스토어
│   ├── data/
│   │   └── materials.ts         # 자재 DB (정적 데이터)
│   ├── types/
│   │   └── index.ts             # TypeScript 타입 정의
│   └── lib/
│       ├── openai.ts            # OpenAI 클라이언트 설정
│       └── utils.ts             # 가격 포맷 등 유틸
```

## 타입 정의 (src/types/index.ts)

```typescript
export type LayerKey = 'floor' | 'wall' | 'ceiling' | 'electrical';

export interface Material {
  id: string;
  name: string;
  unit: string;        // "㎡", "롤", "개", "m", "세트"
  price: number;       // 단가 (원)
  color: string;       // HEX - 오버레이 표시용
  texture?: string;    // 텍스처 이미지 URL (있으면)
  description: string; // 짧은 설명
  category: LayerKey;
}

export interface Plan {
  id: string;
  name: string;                          // "A안", "B안", ...
  layers: Record<LayerKey, boolean>;     // 레이어 ON/OFF
  selections: Partial<Record<LayerKey, Material>>;  // 선택된 자재
  quantities: Record<LayerKey, number>;  // 수량
}

export interface CostItem {
  layer: string;
  material: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface StoreState {
  // 이미지
  image: string | null;
  setImage: (img: string | null) => void;

  // 시안
  plans: Plan[];
  activePlanIndex: number;
  setActivePlan: (index: number) => void;
  addPlan: () => void;
  toggleLayer: (key: LayerKey) => void;
  selectMaterial: (key: LayerKey, mat: Material) => void;
  updateQuantity: (key: LayerKey, qty: number) => void;

  // UI
  activeLayer: LayerKey;
  setActiveLayer: (key: LayerKey) => void;

  // AI
  aiLoading: boolean;
  aiAnalysis: string;
  setAiLoading: (v: boolean) => void;
  setAiAnalysis: (v: string) => void;
}
```

## 자재 데이터 (src/data/materials.ts)

```typescript
export const MATERIALS: Record<LayerKey, Material[]> = {
  floor: [
    { id: "f1", name: "강화마루 (8mm)", unit: "㎡", price: 25000, color: "#C4A882", description: "가성비 좋은 기본형", category: "floor" },
    { id: "f2", name: "원목마루 (오크)", unit: "㎡", price: 65000, color: "#A0784C", description: "따뜻한 고급감", category: "floor" },
    { id: "f3", name: "헤링본 마루", unit: "㎡", price: 85000, color: "#B8956A", description: "클래식 패턴", category: "floor" },
    { id: "f4", name: "폴리싱 타일", unit: "㎡", price: 45000, color: "#D4CFC8", description: "모던한 광택", category: "floor" },
    { id: "f5", name: "SPC 바닥재", unit: "㎡", price: 35000, color: "#BEB5A8", description: "방수·내구성", category: "floor" },
  ],
  wall: [
    { id: "w1", name: "실크 벽지", unit: "롤", price: 15000, color: "#F5F0E8", description: "부드러운 질감", category: "wall" },
    { id: "w2", name: "합지 벽지", unit: "롤", price: 8000, color: "#FFFEF5", description: "경제적 선택", category: "wall" },
    { id: "w3", name: "페인트 (매트)", unit: "㎡", price: 12000, color: "#E8E4DC", description: "깔끔한 마감", category: "wall" },
    { id: "w4", name: "페인트 (무광 그레이)", unit: "㎡", price: 14000, color: "#C8C4BC", description: "모던 분위기", category: "wall" },
    { id: "w5", name: "포인트 타일", unit: "㎡", price: 55000, color: "#4A6B5A", description: "감각적 포인트", category: "wall" },
  ],
  ceiling: [
    { id: "c1", name: "평천장 도배", unit: "㎡", price: 18000, color: "#FFFFFF", description: "기본 마감", category: "ceiling" },
    { id: "c2", name: "우물천장", unit: "㎡", price: 45000, color: "#F8F6F0", description: "간접조명 가능", category: "ceiling" },
    { id: "c3", name: "몰딩 마감", unit: "m", price: 12000, color: "#F0EDE5", description: "클래식 디테일", category: "ceiling" },
  ],
  electrical: [
    { id: "e1", name: "매입등 (LED)", unit: "개", price: 35000, color: "#FFE4A0", description: "깔끔한 조명", category: "electrical" },
    { id: "e2", name: "레일 조명", unit: "세트", price: 120000, color: "#FFF0C0", description: "카페 느낌", category: "electrical" },
    { id: "e3", name: "간접 조명 (LED바)", unit: "m", price: 25000, color: "#FFFBE0", description: "은은한 무드", category: "electrical" },
    { id: "e4", name: "콘센트 증설", unit: "개", price: 50000, color: "#E0E0E0", description: "편의성 향상", category: "electrical" },
    { id: "e5", name: "스위치 교체", unit: "개", price: 15000, color: "#D0D0D0", description: "터치식 전환", category: "electrical" },
  ],
};

export const LAYER_META: Record<LayerKey, { label: string; icon: string; defaultQty: number }> = {
  floor:      { label: "바닥",      icon: "⬛", defaultQty: 26 },
  wall:       { label: "벽면",      icon: "🧱", defaultQty: 40 },
  ceiling:    { label: "천장",      icon: "⬜", defaultQty: 26 },
  electrical: { label: "전기/조명", icon: "💡", defaultQty: 6 },
};

export const LAYER_ORDER: LayerKey[] = ['floor', 'wall', 'ceiling', 'electrical'];
```

## API 엔드포인트

### POST /api/analyze (공간 인식)

OpenAI Vision으로 업로드된 방 사진에서 벽면/바닥/천장 영역을 인식한다.

```typescript
// Request
{ image: string } // base64 data URL

// System Prompt
`당신은 인테리어 공간 분석 전문가입니다.
업로드된 방 사진을 분석하여 다음 영역의 대략적인 면적 비율을 JSON으로 반환하세요:
- floor_ratio: 바닥이 사진에서 차지하는 비율 (0~1)
- wall_ratio: 벽면이 사진에서 차지하는 비율 (0~1)
- ceiling_ratio: 천장이 사진에서 차지하는 비율 (0~1)
- room_type: 방 종류 (거실/침실/주방/화장실/현관 등)
- estimated_area_m2: 추정 면적 (㎡)
- features: 특이사항 배열 (창문 위치, 문 개수 등)
JSON만 반환하세요.`

// Response
{
  floor_ratio: 0.35,
  wall_ratio: 0.45,
  ceiling_ratio: 0.20,
  room_type: "거실",
  estimated_area_m2: 26,
  features: ["남향 창문 1개", "출입문 2개"]
}
```

### POST /api/guide (시공 가이드)

선택된 자재 조합에 대한 AI 시공 가이드를 생성한다.

```typescript
// Request
{ materials: { layer: string; name: string; qty: number; unit: string }[] }

// System Prompt
`당신은 10년 경력의 인테리어 시공 전문가입니다.
고객이 선택한 자재 목록을 받아 다음 내용을 간결하게 한국어로 안내하세요:
1. 시공 순서 (어떤 작업부터 해야 하는지)
2. 각 자재별 시공 시 주의사항
3. 예상 시공 기간
4. 비용 절감 팁
5. 자재 조합에 대한 전체 의견
전문적이지만 고객이 이해하기 쉽게 설명하세요. 이모지 사용 금지.`

// Response
{ guide: string }
```

### POST /api/preview (이미지 미리보기) - 선택 기능

DALL-E로 선택된 자재가 적용된 예상 완성 이미지를 생성한다.
해커톤 MVP에서는 후순위. 레이어 오버레이로 대체 가능.

```typescript
// Request
{ 
  room_type: string,
  materials: { layer: string; name: string }[]
}

// Prompt 생성 예시
`A photorealistic interior render of a Korean ${room_type}.
Floor: ${floor_material}, Wall: ${wall_material}, Ceiling: ${ceiling_material}.
${lighting_description}. Clean, modern photography style.`
```

## 컴포넌트 상세

### RoomCanvas.tsx

- 업로드된 이미지를 Canvas 또는 img 태그로 표시
- 활성화된 레이어별로 CSS 오버레이를 겹침
  - floor: 하단 35% 영역, 그라디언트 (아래→위로 투명해짐)
  - wall: 중간 50% 영역, 양쪽에서 투명해지는 그라디언트
  - ceiling: 상단 25% 영역, 그라디언트 (위→아래로 투명해짐)
  - electrical: 상단에 radial-gradient 발광 효과
- Vision API로 영역 비율을 받으면 비율에 따라 오버레이 위치 조정
- 활성 레이어 뱃지를 좌상단에 표시
- 이미지 없을 때: "📷 사진을 업로드하세요" placeholder

### LayerPanel.tsx

- 4개 레이어 토글 버튼 (ON/OFF)
- 각 토글에 아이콘, 레이어명, 현재 선택된 자재명 표시
- ON 상태: 녹색 보더 + 체크마크
- OFF 상태: 반투명

### MaterialSelector.tsx

- 상단 탭: 바닥 | 벽면 | 천장 | 전기/조명
- 탭 아래 수량 입력 (숫자 input + 단위 표시)
- 자재 카드 리스트 (MaterialCard 컴포넌트)

### MaterialCard.tsx

- 좌측: 자재 색상 스와치 (36x36 rounded)
- 중앙: 자재명 + 설명
- 우측: 단가 + 단위
- 선택 시: 녹색 보더 + 배경색 변경

### CostBreakdown.tsx

- 선택된 자재별 항목 (자재명, 단가×수량, 소계)
- 자재비 소계
- 시공 인건비 (자재비의 40% 추정)
- 예상 총액 (굵은 녹색)

### PlanTabs.tsx

- A안/B안/C안 탭 (최대 4개)
- "+ 안 추가" 버튼
- 활성 탭: 녹색 pill 스타일

### PlanCompare.tsx

- 2개 이상 시안이 있을 때만 표시
- 각 시안의 항목 수, 총액을 한 줄씩

### AiGuide.tsx

- "AI 분석" 버튼 → /api/guide 호출
- 로딩 중: 스피너 + "분석 중..."
- 결과: whiteSpace pre-wrap 텍스트 표시

## 디자인 시스템

### 색상
- Primary: #2D5A3D (진한 녹색)
- Primary Light: #F0F7F2
- Text: #1A1A1A
- Text Secondary: #666666
- Text Muted: #AAAAAA
- Border: #E8E8E8
- Background: #F6F4F0 (따뜻한 라이트 그레이)
- Surface: #FFFFFF
- Danger: #C0392B

### 폰트
- Pretendard Variable (CDN)
- `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`

### 컴포넌트 스타일
- border-radius: 카드 16px, 버튼 10px, 뱃지 20px, 인풋 8px
- 그림자: 최소한으로, 보더 위주
- 전환: transition 0.15s~0.3s

### 레이아웃
- 데스크탑: 2컬럼 (좌: 캔버스+자재선택 / 우: 레이어+견적+AI)
- 모바일: 1컬럼 스택
- max-width: 1200px, 가운데 정렬
- 헤더: sticky top, z-index 100

## 환경 변수

```
OPENAI_API_KEY=sk-...
```

## 개발 순서 (우선순위)

1. 프로젝트 초기화 (Next.js + Tailwind + TypeScript)
2. 타입 정의 + 자재 데이터
3. Zustand 스토어
4. 레이아웃 + Header
5. RoomCanvas (이미지 업로드 + 레이어 오버레이)
6. LayerPanel + MaterialSelector + MaterialCard
7. CostBreakdown (실시간 견적)
8. PlanTabs + PlanCompare (시안 비교)
9. /api/guide + AiGuide (AI 시공 가이드)
10. /api/analyze (Vision 공간 인식) - 보너스
11. 모바일 반응형 - 보너스
12. ExportButton (PDF 내보내기) - 보너스

## 주의사항

- OpenAI API 키는 서버사이드(API Route)에서만 사용. 클라이언트에 노출 금지.
- 이미지 업로드는 base64로 처리 (별도 스토리지 불필요, 해커톤이므로)
- 가격 표시는 항상 천 단위 콤마 + "원" 접미사
- 한국어 UI, 모든 텍스트 한국어
- Pretendard 폰트 CDN 로드 (next/font 대신 link 태그로 간단히)
- 시안은 최대 4개까지
- 인건비 추정: 자재비의 40% (업계 평균 근사치)
