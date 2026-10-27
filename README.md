# 영어 본문 빈칸 학습지 웹툴

학생이 영어 본문의 빈칸(한국어 해석)을 채워 제출하면, 교사가 구글시트로 제출 현황을 확인하는 웹툴.

## 폴더 구조

```
교과서본문/
├── docs/                   ← 이 폴더가 그대로 학생용 사이트가 됨 (다른 자료 넣지 말 것)
│   └── index.html          ← 학생용 학습지
├── apps-script/
│   └── Code.gs             ← 구글 Apps Script 코드 (시트 저장/불러오기 서버)
├── assets/                 ← QR 코드·안내판 (예전 Netlify 주소라 저장소에는 안 올림, 새로 만들 예정)
├── 구글시트_연결하기.md     ← 처음 한 번 하는 시트 연결 방법
└── README.md
```

## 작동 구조

1. **학생** → `index.html`에서 학번·이름 입력, 빈칸 채우고 제출
2. **통신** → JSONP 방식으로 구글 Apps Script 웹앱에 요청 (CORS 제약 우회)
3. **저장** → Apps Script가 구글시트에 한 줄씩 기록, 학번순 자동 정렬. 같은 학번이 다시 내면 덮어씀
4. **교사** → 학습지 하단 "교사 확인"에서 PIN 입력 후 제출 명단·CSV 확인 (PIN은 Apps Script가 확인)

## 현재 설정값

| 항목 | 값 | 위치 |
|---|---|---|
| 웹앱 URL | 연결됨 (2026-10-27) | index.html 상단 `SCRIPT_URL` |
| 교사 PIN | 이 저장소에는 적지 않음 | Apps Script 편집기의 Code.gs `TEACHER_PIN` |
| 빈칸 개수 | 38 | 자동 계산 / Code.gs `NUM_BLANKS` |
| 배포 주소 | https://lowclass11-bit.github.io/english-blank-worksheet/ | GitHub Pages (main 브랜치 docs 폴더, 올리면 자동 반영) |
| 현재 단원 | Discover Yourself (진로 설계 본문, 40문장) | index.html 본문 |

## 수정 & 배포 방법

### 처음 시트 연결
- `구글시트_연결하기.md` 순서대로 진행 → 받은 웹앱 주소를 `index.html`의 `SCRIPT_URL`에 넣기

### 학습지 내용/디자인/학생 기능만 바꿀 때
- `docs/index.html`만 수정 → 저장본 만들어 GitHub에 올리기 (1~2분 뒤 사이트에 반영)
- **Apps Script 재배포 불필요**

### 시트 저장 구조나 PIN이 바뀔 때
- `apps-script/Code.gs` 수정 → Apps Script 편집기에 붙여넣기 (PIN 숫자 다시 넣기) → 저장(Ctrl+S)
- 배포 → 배포 관리 → 연필(수정) → 버전 "새 버전" → 배포
- **URL 유지되므로 학습지 수정 불필요**

## 다음 작업 (NEXT.md 참고)

1. 자동 채점 (정답 등록 → 점수·오답 자동 표시)
2. 본문·빈칸 분리 (새 단원을 코드 수정 없이 추가)
3. 자동 임시 저장 (제출 전에도 입력 유실 방지)
