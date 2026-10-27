# 프로젝트 컨텍스트 (클로드 코드용)

영어 교사가 쓰는 "본문 빈칸 학습지" 웹툴. 학생이 영어 본문의 한국어 해석 빈칸을 채워 제출하면, 교사가 구글시트로 확인한다.

## 핵심 파일
- `docs/index.html` — 학생용 학습지. 단일 HTML 파일(스타일·스크립트 인라인). GitHub Pages가 main 브랜치의 docs 폴더를 그대로 사이트로 보여준다. docs 폴더 = 학생에게 공개되는 사이트이므로 다른 자료는 넣지 않는다.
- `apps-script/Code.gs` — 구글 Apps Script 웹앱. 시트에 저장/불러오기, 교사 PIN 확인. JSONP 응답.
- `구글시트_연결하기.md` — 교사가 직접 따라 하는 시트 연결 안내.
- GitHub Actions 워크플로 파일은 쓰지 않는다 (gh 로그인에 workflow 권한이 없어 push가 거부됨).

## 작업 원칙
- 사용자(Felix)는 비개발자 교사다. 기술 용어보다 학생·교사가 이해할 말로 설명한다.
- 자료는 바로 인쇄/사용 가능한 완성형으로. 긴 설명보다 짧은 방향 피드백으로 반복 개선한다.
- 통신은 반드시 JSONP를 유지한다 (CORS/아티팩트 제약 때문). fetch로 바꾸지 말 것.
- index.html만 바꾸면 Apps Script 재배포 없이 다시 올리기만 하면 반영된다. 시트 구조가 바뀔 때만 Code.gs도 재배포한다.
- 빈칸 개수를 바꾸면 Code.gs의 `NUM_BLANKS`도 맞춘다.
- 교사 PIN은 Code.gs(Apps Script 편집기 안)에만 둔다. 저장소가 공개될 예정이라 index.html·문서·커밋에 실제 PIN을 적지 않는다.

## 현재 상태
- 단원: Discover Yourself (40문장, 빈칸 38개)
- 시트 연결: 됨 (2026-10-27, 새 웹앱 주소를 `SCRIPT_URL`에 넣고 실제 제출·불러오기 확인). 예전 주소는 404라 폐기
- 배포: https://lowclass11-bit.github.io/english-blank-worksheet/ (저장소 lowclass11-bit/english-blank-worksheet, 공개, main에 올리면 자동 배포)
- 공개 저장소이므로 `*.hwp` 등 교사 자료·학생 자료는 올리지 않는다. 커밋 이메일은 GitHub noreply 주소(이 저장소 로컬 설정)
- QR: 예전 Netlify 주소라 폐기. 새 주소로 다시 만들어야 함
- 다음 작업 우선순위는 NEXT.md 참고 (1.자동채점 2.본문분리 3.임시저장)

## 하지 말 것
- 한 번 연결한 웹앱 URL은 임의로 바꾸지 않는다 (바꾸면 학습지·시트 연결이 끊김).
- 사용자 확인 없이 배포(GitHub에 올리기)나 시트 구조 변경을 단정하지 않는다.
