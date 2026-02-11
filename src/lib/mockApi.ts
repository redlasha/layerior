import { AnalysisResult } from '@/types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function mockAnalyze(imageBase64: string): Promise<AnalysisResult> {
  await delay(1500);
  return {
    floor_ratio: 0.35,
    wall_ratio: 0.45,
    ceiling_ratio: 0.20,
    room_type: '거실',
    estimated_area_m2: 26,
    features: ['남향 창문 1개', '출입문 2개', '에어컨 배관 확인됨'],
  };
}

export async function mockGuide(
  materials: { layer: string; name: string; qty: number; unit: string }[]
): Promise<string> {
  await delay(2000);

  const materialList = materials.map((m) => `${m.layer}: ${m.name} (${m.qty}${m.unit})`).join('\n');

  return `[시공 가이드 - AI 분석 결과]

1. 시공 순서
  1) 기존 마감재 철거 및 폐기물 처리
  2) 전기 배선 공사 (콘센트/조명 위치 확정 후 배선)
  3) 천장 작업 (도배 또는 우물천장 시공)
  4) 벽면 작업 (벽지 또는 페인트)
  5) 바닥 시공 (마루 또는 타일)
  6) 조명 설치 및 마감

2. 선택 자재 정보
${materialList}

3. 자재별 주의사항
  - 바닥재: 시공 전 최소 48시간 실내 적응 필요. 하부 수분 체크 필수.
  - 벽면: 벽지 시공 시 초배지 상태 확인. 페인트는 2회 이상 도포 권장.
  - 천장: 우물천장의 경우 간접조명 배선을 사전에 매입해야 함.
  - 조명: LED 드라이버 용량과 조명 수량 매칭 확인 필요.

4. 예상 시공 기간
  - 26㎡ 기준 약 5~7일 (철거 1일 + 전기 1일 + 천장/벽 2일 + 바닥 1~2일)

5. 비용 절감 팁
  - 강화마루는 셀프 시공 가능 (인건비 30~40% 절감)
  - 벽지 대신 페인트 선택 시 추후 부분 보수가 쉬움
  - 매입등은 규격 통일 시 교체 비용 절감
  - 철거 폐기물은 직접 배출하면 처리비 절약 가능

6. 종합 의견
  선택하신 자재 조합은 전체적으로 모던하고 깔끔한 분위기를 연출할 수 있습니다.
  바닥과 벽면의 톤이 조화롭게 어울리며, 조명 계획이 공간 활용도를 높여줍니다.
  시공 순서를 반드시 지켜주시고, 특히 전기 작업은 자격 있는 기술자에게 맡기시길 권장합니다.`;
}
