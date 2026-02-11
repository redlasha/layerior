# 층층이 - 홈 레이아웃 플래닝 확장 계획

## 현재 상태

- CLAUDE.md에 명세만 존재, 코드 구현 0%
- 기존 레이어: 바닥(floor), 벽면(wall), 천장(ceiling), 전기/조명(electrical) 4개

## 사용자 피드백 요약

사용자가 실제 인테리어 시공 관점에서 부족한 부분들을 지적함:

1. **전기 배선이 너무 단순함** - 콘센트/스위치/조명 개수만으로는 실제 시공 불가. 배선 경로, 전기 용량, 가전 배치(로봇청소기 충전 위치, TV 위치, 냉장고 위치 등)를 고려해야 함
2. **난방 배관 누락** - 바닥난방(온돌) 배관은 한국 인테리어의 핵심인데 완전히 빠져 있음
3. **목공/문/환기/에어컨 누락** - 문 교체, 환기 시스템, 에어컨 배관, 몰딩 등 목공 관련 레이어가 없음
4. **AI 조합 추천 부족** - 자재를 바꿔가며 비교할 때 AI가 적극적으로 "이 조합이면 이런 점이 좋다/나쁘다" 피드백을 줘야 함
5. **평면도 입력 지원** - 방 사진뿐 아니라 평면도(도면)가 있으면 그걸 기반으로 더 정확한 분석 가능

## 확장 계획

### Phase 1: 레이어 시스템 확장

기존 4개 레이어를 더 세분화하고, 실무에 가까운 구조로 재설계한다.

#### 변경되는 레이어 구조

```
기존:
  floor | wall | ceiling | electrical (4개)

확장:
  floor        → 바닥 마감재 + 난방배관(바닥난방/온돌)
  wall         → 벽면 마감재 (기존 유지)
  ceiling      → 천장 마감재 (기존 유지)
  electrical   → 전기 배선 (배선 경로, 용량, 가전 배치 포함으로 확장)
  plumbing     → 난방/배관 (바닥난방, 수도배관)  [NEW]
  woodwork     → 목공 (문, 몰딩, 붙박이장, 신발장 등) [NEW]
  hvac         → 환기/냉난방 (에어컨, 환기구, 시스템에어컨) [NEW]
```

**총 7개 레이어**로 확장

#### 타입 변경

```typescript
// 기존
export type LayerKey = 'floor' | 'wall' | 'ceiling' | 'electrical';

// 확장
export type LayerKey =
  | 'floor'       // 바닥 마감재
  | 'wall'        // 벽면
  | 'ceiling'     // 천장
  | 'electrical'  // 전기/배선
  | 'plumbing'    // 난방/배관
  | 'woodwork'    // 목공 (문, 몰딩, 붙박이장)
  | 'hvac';       // 환기/냉난방 (에어컨, 환기)
```

#### 새로운 자재 데이터

```
plumbing (난방/배관):
  - 바닥난방 온수파이프 (XL파이프)  | m   | 8,000원  | 기본 온돌
  - 바닥난방 전기필름              | ㎡  | 30,000원 | 전기식 대안
  - 분배기 교체                   | 세트 | 150,000원 | 존별 온도조절
  - 수전 교체 (주방/욕실)         | 개  | 80,000원 | 디자인 수전

woodwork (목공):
  - 방문 교체 (ABS도어)           | 개  | 180,000원 | 가성비 도어
  - 방문 교체 (원목도어)          | 개  | 350,000원 | 고급 원목
  - 현관문 시트지                 | 개  | 120,000원 | 현관 새단장
  - 붙박이장 (슬라이딩)           | 세트 | 800,000원 | 수납 극대화
  - 신발장 (맞춤제작)             | 세트 | 500,000원 | 현관 정리
  - 걸레받이 몰딩                 | m   | 5,000원  | 마감 디테일

hvac (환기/냉난방):
  - 벽걸이 에어컨 설치             | 대  | 800,000원 | 기본형
  - 시스템 에어컨 (1way)          | 대  | 1,500,000원 | 천장 매립
  - 전열교환기                    | 대  | 600,000원 | 환기 시스템
  - 욕실 환풍기 교체               | 개  | 80,000원  | 습기 제거
  - 레인지후드 교체                | 개  | 250,000원 | 주방 환기
```

#### electrical 레이어 확장

기존 콘센트/스위치에 더해 배선 관련 요소 추가:

```
추가 자재:
  - 전용회로 증설 (에어컨/인덕션)  | 회로 | 150,000원 | 고용량 가전용
  - 멀티탭 매립 콘센트             | 개  | 35,000원  | TV존/데스크존
  - USB 콘센트                    | 개  | 25,000원  | 충전 편의
  - 로봇청소기 충전 콘센트 (바닥)   | 개  | 40,000원  | 바닥 매립형
```

### Phase 2: 입력 방식 확장 (사진 + 평면도)

현재는 방 사진 1장만 받지만, 평면도도 받을 수 있게 확장한다.

#### 입력 모드 2가지

1. **사진 모드** (기존) - 방 사진 업로드 → Vision API로 영역 분석
2. **평면도 모드** (신규) - 평면도 이미지 업로드 → Vision API로 구조 분석

#### 평면도 분석 API (/api/analyze-floorplan)

```typescript
// Vision API로 평면도에서 추출할 정보
{
  rooms: [
    { name: "거실", area_m2: 18, shape: "직사각형" },
    { name: "안방", area_m2: 12, shape: "직사각형" },
    // ...
  ],
  walls: { total_length_m: 45, bearing_walls: ["남측 외벽"] },
  doors: [
    { type: "현관문", width_mm: 900 },
    { type: "방문", width_mm: 800, count: 3 },
  ],
  windows: [
    { location: "거실 남측", width_mm: 2400, type: "이중창" },
  ],
  plumbing_points: ["주방", "화장실1", "화장실2"],
  electrical_panel_location: "현관 옆",
  total_area_m2: 59,
}
```

평면도에서 추출된 정보로:
- 각 방별로 자재 수량 자동 계산
- 문 개수/종류 자동 감지 → 목공 레이어에 반영
- 배관 포인트 감지 → 난방/배관 레이어에 반영
- 콘센트 위치 제안 가능

#### UI 변경

- Header에 "사진 업로드" / "평면도 업로드" 탭 또는 토글 추가
- 평면도 모드일 때는 RoomCanvas 대신 FloorplanCanvas 표시
  - 각 방을 클릭하면 해당 방의 레이어/자재를 편집
  - 방별로 독립적인 자재 선택 가능

#### 타입 추가

```typescript
export type InputMode = 'photo' | 'floorplan';

export interface Room {
  id: string;
  name: string;        // "거실", "안방" 등
  area_m2: number;
  // 각 방별 레이어 선택
  selections: Partial<Record<LayerKey, Material>>;
  quantities: Record<LayerKey, number>;
}

// StoreState 확장
interface StoreState {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;

  // 평면도 모드 전용
  rooms: Room[];
  activeRoomIndex: number;
  setActiveRoom: (index: number) => void;
  // ...기존 필드들
}
```

### Phase 3: AI 조합 추천 강화

자재를 변경할 때마다 AI가 적극적으로 피드백을 주는 시스템.

#### 3-1. 실시간 조합 피드백

자재 선택이 변경될 때 AI가 자동으로 코멘트:

```
예시:
- "오크 원목마루 + 무광 그레이 페인트 → 모던 내추럴 스타일. 궁합 ★★★★★"
- "헤링본 마루 + 실크 벽지 → 클래식한 분위기. 간접조명 추가 추천"
- "SPC 바닥재 + 바닥난방 → 주의: SPC는 열전도율이 낮아 난방 효율 저하 가능"
```

#### 3-2. AI 자동 제안 기능

"AI 추천" 버튼을 누르면:
- 현재 방 타입, 면적, 예산 범위를 고려
- 3가지 스타일 조합을 한번에 제안 (가성비/모던/프리미엄)
- 각 조합을 Plan A/B/C에 자동 배치

#### 3-3. 전기 배선 AI 어드바이저

전기/배선 레이어 선택 시 AI가 추가 질문:
- "TV는 어디에 배치하실 예정인가요?" → TV 뒤 콘센트 매립 추천
- "로봇청소기 사용하시나요?" → 충전 콘센트 위치 추천
- "인덕션/전기오븐 사용?" → 전용회로 필요 여부 안내
- 전체 전기 용량 계산 (기본 30A 기준 초과 여부)

#### API 변경

```typescript
// POST /api/combo-feedback (조합 피드백)
{
  selections: Record<LayerKey, Material>,
  room_type: string,
  area_m2: number
}
// → { feedback: string, rating: number, suggestions: string[] }

// POST /api/recommend (AI 자동 추천)
{
  room_type: string,
  area_m2: number,
  budget_range: "low" | "mid" | "high",
  preferences?: string  // 사용자가 입력한 선호 스타일
}
// → { plans: Plan[] }  // 3가지 추천 조합

// POST /api/electrical-advisor (전기 어드바이저)
{
  appliances: string[],  // 사용 가전 목록
  room_layout: string,   // 가전 배치 설명
  current_capacity_a: number  // 현재 전기 용량 (기본 30A)
}
// → { advice: string, required_circuits: number, warnings: string[] }
```

### Phase 4: UI/UX 개선

#### 컴포넌트 추가/변경

```
새로운 컴포넌트:
  - InputModeToggle.tsx    // 사진/평면도 모드 전환
  - FloorplanCanvas.tsx    // 평면도 뷰어 + 방 선택
  - RoomSelector.tsx       // 평면도 모드에서 방 선택 탭
  - ComboFeedback.tsx      // AI 조합 피드백 표시 (선택 변경 시 실시간)
  - AiRecommend.tsx        // AI 자동 추천 패널
  - ElectricalAdvisor.tsx  // 전기 배선 어드바이저 대화형 UI

변경되는 컴포넌트:
  - LayerPanel.tsx         // 7개 레이어로 확장, 스크롤 가능
  - MaterialSelector.tsx   // 7개 탭으로 확장
  - CostBreakdown.tsx      // 새 레이어 포함 견적
  - Header.tsx             // 입력 모드 토글 추가
```

#### 레이어 패널 그룹핑 (7개가 많으니)

```
마감 ─── 바닥 | 벽면 | 천장
설비 ─── 전기/배선 | 난방/배관 | 환기/냉난방
기타 ─── 목공
```

## 구현 순서 (수정된 로드맵)

### Step 1: 프로젝트 초기화
- Next.js 14 + Tailwind + TypeScript 세팅
- 디렉토리 구조 생성
- Pretendard 폰트, globals.css

### Step 2: 확장된 타입 + 자재 데이터
- 7개 레이어 타입 정의
- 기존 자재 + 새 자재(plumbing, woodwork, hvac) 데이터
- electrical 자재 확장

### Step 3: Zustand 스토어
- 기존 스펙 기반 + inputMode, rooms 등 확장 상태
- 7개 레이어 지원

### Step 4: 기본 레이아웃 + Header
- 2컬럼 레이아웃
- Header + 사진 업로드 (평면도 모드는 Phase 2에서)
- 입력 모드 토글 UI (사진/평면도)

### Step 5: RoomCanvas + 레이어 오버레이
- 사진 모드의 캔버스
- 7개 레이어 오버레이 (새 레이어 포함)

### Step 6: LayerPanel + MaterialSelector
- 7개 레이어를 그룹별로 표시
- 각 레이어별 자재 선택 + 수량 입력

### Step 7: CostBreakdown
- 7개 레이어 전체 견적
- 인건비 추정 (레이어별 차등 비율: 배관/전기는 인건비 비중 높음)

### Step 8: AI 조합 피드백 (ComboFeedback)
- 자재 선택 변경 시 /api/combo-feedback 호출
- 디바운스 적용 (1초 대기 후 호출)
- 궁합 평가 + 제안 표시

### Step 9: PlanTabs + PlanCompare
- 시안 A/B/C 탭
- AI 추천으로 자동 생성 기능

### Step 10: AI 시공 가이드 + 전기 어드바이저
- /api/guide (확장된 7레이어 지원)
- /api/electrical-advisor (가전 배치 기반 배선 조언)
- AiGuide + ElectricalAdvisor 컴포넌트

### Step 11: 평면도 모드 (Phase 2)
- /api/analyze-floorplan API
- FloorplanCanvas + RoomSelector
- 방별 독립 자재 선택

### Step 12: 보너스
- /api/analyze (Vision 공간 인식)
- 모바일 반응형
- PDF 내보내기
- AI 자동 추천 (/api/recommend)

## 핵심 원칙

1. **해커톤 MVP 우선** - Step 1~7이 핵심. 동작하는 제품 먼저.
2. **AI는 도우미** - 자재 변경할 때마다 AI가 코멘트해주는 것이 핵심 차별점
3. **실무 반영** - 전기 용량, 난방 배관, 환기 등 실제 시공에서 빠지면 안 되는 것들 포함
4. **점진적 확장** - 사진 모드 완성 → 평면도 모드 추가 순서
