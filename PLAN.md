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
6. **라이프스타일 컨텍스트** - 피아노/악기 연주, 반려동물, 아이 유무, IoT 고려 여부 등 생활 맥락이 인테리어 결정에 큰 영향을 미침

---

## 설계 원칙

### 1. 레이어는 가변적 (Dynamic Layers)

레이어를 고정 enum으로 하드코딩하지 않는다. 라이프스타일 컨텍스트에 따라 필요한 레이어가 달라지기 때문.

```
기본 레이어 (항상 표시):
  바닥 마감 | 벽면 | 천장

컨텍스트에 따라 활성화되는 레이어:
  전기/배선     ← 항상 (필수)
  난방/배관     ← 바닥난방 선택 시 또는 배관 작업 필요 시
  목공          ← 문 교체, 붙박이장 등 선택 시
  환기/냉난방   ← 에어컨, 환기 시스템 선택 시
  방음/단열     ← 악기 연주자, 층간소음 우려 시 [NEW]
  안전/키즈     ← 아이가 있는 가정 [NEW]
  IoT/스마트홈  ← IoT 도입 희망 시 [NEW]
  반려동물      ← 반려동물 가정 [NEW]
```

### 2. 평면도 우선 (Floorplan First)

평면도가 있으면 사진보다 훨씬 정확한 분석이 가능하다. 평면도를 메인 입력으로 지원하되, 사진도 보조로 활용.

### 3. 라이프스타일이 견적을 결정한다

자재 선택 전에 "어떻게 사시나요?"를 먼저 물어본다. 이 답변이 레이어 구성, AI 추천, 주의사항 모두에 영향.

---

## Phase 1: 라이프스타일 온보딩

프로젝트 시작 시 사용자에게 간단한 질문을 던져 컨텍스트를 수집한다.

### 온보딩 질문 설계

```typescript
interface LifestyleProfile {
  // 가족 구성
  hasChildren: boolean;
  childrenAges?: string[];           // "영유아(0-3)", "유아(4-7)", "초등", "중고등"
  hasPets: boolean;
  petTypes?: string[];               // "강아지(소형)", "강아지(대형)", "고양이", "기타"

  // 생활 패턴
  playsInstrument: boolean;
  instrumentType?: string;           // "피아노", "드럼", "기타/현악기", "관악기"
  worksFromHome: boolean;            // 재택근무

  // 기술/설비
  wantsIoT: boolean;                 // 스마트홈 관심
  iotDevices?: string[];             // "스마트스피커", "스마트조명", "스마트도어락", "로봇청소기", "스마트커튼"
  hasFloorHeating: boolean;          // 기존 바닥난방 여부
  acType?: 'wall' | 'system' | 'none'; // 에어컨 타입

  // 주요 가전 배치
  appliances: string[];              // "TV(벽걸이)", "TV(스탠드)", "인덕션", "전기오븐", "건조기", "식기세척기"

  // 예산 범위
  budgetRange: 'economy' | 'standard' | 'premium';

  // 스타일 선호
  stylePreference?: string;          // "모던", "내추럴", "클래식", "미니멀", "북유럽"
}
```

### 컨텍스트 → 레이어/자재 매핑

```
hasChildren(영유아) →
  - "안전/키즈" 레이어 활성화
  - 자재: 모서리 보호대, 미끄럼방지 바닥, 안전 콘센트 커버, 안전문
  - AI 주의사항: "유해물질 없는 친환경 자재 권장", "날카로운 몰딩 피하기"

hasPets(고양이) →
  - "반려동물" 레이어 활성화
  - 자재: 스크래치방지 벽지, 강화 바닥재, 캣워크 선반, 방묘문
  - AI 주의사항: "루프형 카펫 피하기 (발톱 걸림)", "유리 조명 주의"

hasPets(강아지 대형) →
  - "반려동물" 레이어 활성화
  - 자재: 논슬립 바닥재, 강화 도어, 펫도어
  - AI 주의사항: "마루 스크래치 고려", "미끄럼방지 필수"

playsInstrument(피아노) →
  - "방음/단열" 레이어 활성화
  - 자재: 방음패드, 방음문, 흡음패널, 방진매트
  - AI 주의사항: "피아노 하중(200~400kg) 고려", "바닥 보강 필요 여부 확인"
  - 전기: "피아노 조명용 콘센트 위치"

playsInstrument(드럼) →
  - "방음/단열" 레이어 활성화 (최고 등급)
  - 자재: 방음실 시공, 부유바닥, 이중벽체
  - AI 경고: "일반 아파트에서는 전문 방음 시공 필수"

wantsIoT →
  - "IoT/스마트홈" 레이어 활성화
  - 자재: 스마트 스위치, 스마트 도어락, IoT 허브, Wi-Fi AP 매립, 스마트 커튼 레일
  - 전기 레이어 연동: "IoT 기기 전원 포인트 추가", "CAT6 랜선 매립"
  - AI 추천: "메쉬 와이파이 권장 여부", "허브 설치 위치"

worksFromHome →
  - 전기 레이어에 "데스크 존 콘센트 6구+" 자동 추가
  - AI 추천: "조명 색온도 5000K 작업등 추천", "방음 파티션 고려"
```

### 온보딩 UI 컴포넌트 (LifestyleOnboarding.tsx)

- 단계별 카드형 질문 (4~5단계)
- 각 단계에서 아이콘 + 짧은 질문 + 선택지
- "건너뛰기" 가능 (기본값 적용)
- 완료 후 활성화될 레이어 미리보기 표시

```
Step 1: 가족 구성
  "함께 사는 가족을 알려주세요"
  [아이 있음(나이대 선택)] [반려동물(종류 선택)] [해당없음]

Step 2: 생활 패턴
  "특별히 고려할 활동이 있나요?"
  [악기 연주] [재택근무] [홈트레이닝] [해당없음]

Step 3: 스마트홈
  "스마트홈 기기를 사용하거나 도입 예정인가요?"
  [이미 사용중(기기 선택)] [도입 예정] [관심없음]

Step 4: 주요 가전
  "어떤 가전을 배치하실 예정인가요?"
  [TV 벽걸이] [인덕션] [건조기] [식기세척기] [로봇청소기] [직접입력]

Step 5: 예산 & 스타일
  "예산 범위와 선호 스타일을 알려주세요"
  [가성비] [표준] [프리미엄]
  [모던] [내추럴] [클래식] [미니멀] [북유럽]
```

---

## Phase 2: 가변 레이어 시스템

### 타입 설계

```typescript
// 레이어를 고정 enum 대신 동적 구조로
export interface LayerDefinition {
  id: string;                    // 'floor', 'wall', 'soundproof', 'pet', 등
  label: string;                 // "바닥 마감", "방음/단열" 등
  icon: string;                  // 아이콘
  group: 'finish' | 'infra' | 'lifestyle';  // 마감 | 설비 | 라이프스타일
  alwaysVisible: boolean;        // true면 항상 표시, false면 조건부
  activatedBy?: (profile: LifestyleProfile) => boolean;  // 활성화 조건
  defaultQty: number;
  laborCostRatio: number;        // 인건비 비율 (전기/배관은 높음)
  materials: Material[];
}

// 기본 제공 레이어 정의
export const LAYER_DEFINITIONS: LayerDefinition[] = [
  // 마감 그룹 (항상 표시)
  { id: 'floor', label: '바닥', group: 'finish', alwaysVisible: true, laborCostRatio: 0.3, ... },
  { id: 'wall', label: '벽면', group: 'finish', alwaysVisible: true, laborCostRatio: 0.35, ... },
  { id: 'ceiling', label: '천장', group: 'finish', alwaysVisible: true, laborCostRatio: 0.4, ... },

  // 설비 그룹 (항상 표시)
  { id: 'electrical', label: '전기/배선', group: 'infra', alwaysVisible: true, laborCostRatio: 0.5, ... },
  { id: 'plumbing', label: '난방/배관', group: 'infra', alwaysVisible: true, laborCostRatio: 0.5, ... },
  { id: 'woodwork', label: '목공', group: 'infra', alwaysVisible: true, laborCostRatio: 0.4, ... },
  { id: 'hvac', label: '환기/냉난방', group: 'infra', alwaysVisible: true, laborCostRatio: 0.45, ... },

  // 라이프스타일 그룹 (조건부 표시)
  {
    id: 'soundproof', label: '방음/단열', group: 'lifestyle',
    alwaysVisible: false,
    activatedBy: (p) => p.playsInstrument,
    laborCostRatio: 0.5,
    ...
  },
  {
    id: 'kids-safety', label: '안전/키즈', group: 'lifestyle',
    alwaysVisible: false,
    activatedBy: (p) => p.hasChildren,
    laborCostRatio: 0.2,
    ...
  },
  {
    id: 'iot', label: 'IoT/스마트홈', group: 'lifestyle',
    alwaysVisible: false,
    activatedBy: (p) => p.wantsIoT,
    laborCostRatio: 0.3,
    ...
  },
  {
    id: 'pet', label: '반려동물', group: 'lifestyle',
    alwaysVisible: false,
    activatedBy: (p) => p.hasPets,
    laborCostRatio: 0.25,
    ...
  },
];
```

### 추가 자재 데이터

```
soundproof (방음/단열):
  - 방음매트 (바닥)             | ㎡  | 30,000원  | 층간소음 저감
  - 흡음패널 (벽면)             | ㎡  | 45,000원  | 중고음 흡수
  - 방음문 (교체)               | 개  | 400,000원 | 차음등급 향상
  - 이중창 교체                  | 개  | 500,000원 | 외부소음 차단
  - 방진매트 (피아노/드럼 전용)  | 세트 | 150,000원 | 진동 차단

kids-safety (안전/키즈):
  - 모서리 보호대                | 세트 | 25,000원  | 충돌 방지
  - 미끄럼방지 코팅              | ㎡  | 15,000원  | 낙상 방지
  - 안전 콘센트 커버             | 개  | 3,000원   | 감전 방지
  - 안전문 (계단/주방)           | 개  | 45,000원  | 진입 차단
  - 친환경 페인트 업그레이드      | ㎡  | 8,000원   | VOC 제로

iot (IoT/스마트홈):
  - 스마트 스위치 (Wi-Fi)        | 개  | 35,000원  | 원격 제어
  - 스마트 도어락                | 개  | 300,000원 | 비밀번호/지문
  - IoT 허브 (Matter 호환)      | 대  | 80,000원  | 통합 제어
  - Wi-Fi AP 매립               | 개  | 120,000원 | 끊김없는 연결
  - 스마트 커튼 레일             | 세트 | 200,000원 | 자동 개폐
  - CAT6 랜선 매립              | m   | 5,000원   | 유선 네트워크

pet (반려동물):
  - 스크래치방지 벽지            | 롤  | 25,000원  | 고양이 대응
  - 논슬립 강화 바닥재           | ㎡  | 40,000원  | 미끄럼 방지
  - 캣워크 선반                  | 세트 | 150,000원 | 고양이 놀이
  - 펫도어                      | 개  | 80,000원  | 자유 이동
  - 방묘문/방견문               | 개  | 60,000원  | 영역 분리
```

---

## Phase 3: 입력 방식 (사진 + 평면도)

### 입력 모드

1. **평면도 모드** (메인) - 평면도 이미지 → Vision API로 구조 분석 → 방별 자재 선택
2. **사진 모드** (보조) - 방 사진 → Vision API로 영역 분석 → 단일 방 자재 선택
3. **혼합 모드** - 평면도 + 개별 방 사진 함께 업로드

### 평면도 분석 API (/api/analyze-floorplan)

```typescript
// Vision API로 평면도에서 추출할 정보
interface FloorplanAnalysis {
  rooms: {
    name: string;       // "거실", "안방", "아이방" 등
    area_m2: number;
    shape: string;
    suggested_layers: string[];  // 라이프스타일 기반 추천 레이어
  }[];
  walls: {
    total_length_m: number;
    bearing_walls: string[];     // 철거 불가 벽
  };
  doors: { type: string; width_mm: number; count: number }[];
  windows: { location: string; width_mm: number; type: string }[];
  plumbing_points: string[];
  electrical_panel_location: string;
  total_area_m2: number;
}
```

### 평면도 + 라이프스타일 연동

평면도에서 추출된 방 정보 + 라이프스타일 프로필을 결합:

```
예시: 아이(유아) + 고양이 + 피아노 가정의 평면도 분석 시

거실(18㎡) → 기본 레이어 + 안전/키즈(모서리 보호) + 반려동물(논슬립 바닥)
안방(12㎡) → 기본 레이어 + 방음/단열(방음매트)
아이방(8㎡) → 기본 레이어 + 안전/키즈(전체) + 친환경 우선
서재(6㎡) → 기본 레이어 + 방음/단열(피아노실) + IoT(스마트조명)
```

### UI 구조

```
[평면도 업로드] → [라이프스타일 온보딩] → [방 선택] → [레이어/자재 편집] → [견적서]

평면도 모드 화면:
┌─────────────────────────────────────────────┐
│ Header + 입력모드 토글                        │
├──────────────────┬──────────────────────────┤
│                  │ [방 탭: 거실|안방|아이방]   │
│   평면도 뷰어     │ [레이어 패널]              │
│   (방 클릭 선택)  │ [자재 선택]               │
│                  │ [AI 피드백]               │
├──────────────────┴──────────────────────────┤
│ [전체 견적서] [시안 비교] [AI 가이드]          │
└─────────────────────────────────────────────┘
```

---

## Phase 4: AI 조합 추천 강화

### 4-1. 실시간 조합 피드백

자재 선택이 변경될 때 AI가 자동으로 코멘트. 라이프스타일 컨텍스트를 반영.

```
예시:
- "오크 원목마루 + 바닥난방 → 원목은 열변형 가능. 열처리 원목 또는 강화마루 추천"
- "헤링본 마루 + 고양이 → 스크래치 우려. UV코팅 추가 또는 SPC 헤링본 대안 추천"
- "SPC 바닥재 + 아이(유아) → 좋은 선택! 방수+내구성 우수, 미끄럼방지 등급 확인 필요"
- "일반 콘센트 + IoT 다수 → USB 콘센트로 변경 추천, 전용회로 검토 필요"
```

### 4-2. 전기 배선 AI 어드바이저

라이프스타일 프로필 기반으로 전기 배선을 종합 설계:

```
입력:
  - 가전 목록 (인덕션, TV 벽걸이, 로봇청소기, 식기세척기, 건조기)
  - IoT 기기 목록
  - 방별 용도 (서재=피아노실, 아이방 등)

출력:
  - 방별 콘센트 위치/개수 추천
  - 전용회로 필요 가전 목록
  - 총 전기 용량 계산 (30A/40A/60A)
  - "현재 계획이면 전기 용량 초과 위험 → 40A 증설 추천" 같은 경고
  - IoT 기기 전원 포인트 배치 제안
```

### 4-3. AI 자동 추천 (스타일별 3안)

라이프스타일 + 예산 + 스타일 선호를 기반으로 3가지 안을 자동 생성:

```
가성비안: 총 850만원 - 강화마루 + 합지벽지 + 기본천장 + ...
표준안:   총 1,400만원 - 원목마루 + 실크벽지 + 우물천장 + ...
프리미엄: 총 2,200만원 - 헤링본마루 + 포인트타일 + 시스템에어컨 + ...

각 안에 라이프스타일 필수항목 자동 포함:
  - 아이 있음 → 3안 모두 안전 콘센트 커버 포함
  - 고양이 → 3안 모두 스크래치방지 벽지 포함
  - 피아노 → 3안 모두 해당 방 방음매트 포함
```

---

## Phase 5: API 엔드포인트 (확장)

```
기존:
  POST /api/analyze          → 방 사진 공간 인식
  POST /api/guide            → 시공 가이드
  POST /api/preview          → DALL-E 미리보기

추가:
  POST /api/analyze-floorplan → 평면도 구조 분석
  POST /api/combo-feedback    → 자재 조합 실시간 피드백
  POST /api/recommend         → AI 자동 추천 (3안 생성)
  POST /api/electrical-advisor → 전기 배선 종합 설계
  POST /api/lifestyle-layers  → 라이프스타일 → 레이어 매핑
```

---

## 구현 순서 (최종 로드맵)

### Step 1: 프로젝트 초기화
- Next.js 14 + Tailwind + TypeScript 세팅
- 디렉토리 구조 생성
- Pretendard 폰트, globals.css

### Step 2: 타입 + 가변 레이어 + 자재 데이터
- LayerDefinition, LifestyleProfile, Material 등 타입 정의
- 기본 레이어 + 라이프스타일 레이어 정의
- 전체 자재 데이터 (기본 + soundproof, kids-safety, iot, pet)

### Step 3: Zustand 스토어
- 라이프스타일 프로필 상태
- 가변 레이어 시스템 (활성 레이어 동적 계산)
- inputMode (photo/floorplan)
- rooms (평면도 모드)
- plans (시안 비교)

### Step 4: 라이프스타일 온보딩 UI
- LifestyleOnboarding.tsx (단계별 질문)
- 완료 시 활성 레이어 자동 결정
- 건너뛰기 지원 (기본값 적용)

### Step 5: 기본 레이아웃 + Header
- 2컬럼 레이아웃
- Header + 입력 모드 토글 (사진/평면도)
- 사진/평면도 업로드

### Step 6: RoomCanvas + 레이어 오버레이
- 사진 모드 캔버스 + 가변 레이어 오버레이
- 평면도 모드 캔버스 (FloorplanCanvas)

### Step 7: LayerPanel + MaterialSelector
- 가변 레이어를 그룹별(마감/설비/라이프스타일) 표시
- 비활성 레이어는 흐리게 + "활성화하려면 온보딩에서 설정" 안내
- 각 레이어별 자재 선택 + 수량 입력

### Step 8: CostBreakdown
- 전체 레이어 견적
- 레이어별 차등 인건비 비율
- 라이프스타일 필수항목 별도 표시

### Step 9: AI 조합 피드백
- /api/combo-feedback (라이프스타일 컨텍스트 포함)
- 자재 변경 시 디바운스 호출
- 궁합 평가 + 경고 + 대안 제안

### Step 10: PlanTabs + PlanCompare + AI 추천
- 시안 A/B/C 탭
- /api/recommend → 라이프스타일 기반 3안 자동 생성
- 시안 비교 테이블

### Step 11: AI 시공 가이드 + 전기 어드바이저
- /api/guide (가변 레이어 + 라이프스타일 반영)
- /api/electrical-advisor (가전 + IoT 종합 배선 설계)

### Step 12: 평면도 분석
- /api/analyze-floorplan
- FloorplanCanvas + RoomSelector
- 방별 독립 자재 선택 + 라이프스타일 매핑

### Step 13: 보너스
- /api/analyze (Vision 사진 공간 인식)
- 모바일 반응형
- PDF 내보내기
- DALL-E 미리보기

---

## 핵심 원칙

1. **라이프스타일이 먼저** - "어떤 자재?" 전에 "어떻게 사세요?"를 묻는다
2. **레이어는 가변적** - 하드코딩 금지, 프로필에 따라 동적 구성
3. **AI는 맥락을 안다** - 단순 자재 추천이 아니라 "고양이가 있으니 이건 피하세요" 수준
4. **평면도 = 정밀도** - 평면도가 있으면 방별 맞춤 견적, 없으면 사진 기반 추정
5. **해커톤 MVP** - Step 1~8이 코어. 동작하는 제품 먼저, AI 기능은 점진 추가
