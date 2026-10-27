const SHEET_NAME = 'Sheet1';  // 시트 탭 이름 (기본 그대로면 Sheet1, 한국어 구글이면 '시트1')
const NUM_BLANKS = 38;        // 빈칸 개수 (학습지와 일치시킬 것)
const TEACHER_PIN = '여기에_PIN';  // 교사 확인용 숫자. Apps Script 편집기에서만 바꾸고, GitHub에는 올리지 말 것

function doGet(e) { return handle(e); }
function doPost(e) { return handle(e); }

function handle(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  const params = (e && e.parameter) ? e.parameter : {};
  const action = params.action || 'save';
  const callback = /^[\w$]+$/.test(params.callback || '') ? params.callback : null;

  if (action === 'load') {
    ensureHeader(sheet);
    const sid = String(params.sid || '').trim();
    const row = findRow(sheet, sid);
    let result = null;
    if (row > 0) {
      const vals = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
      result = { sid: String(vals[0]), sname: String(vals[1]), at: String(vals[2]),
        answers: vals.slice(3).map(v => String(v)) };
    }
    return out(callback, { ok: true, record: result });
  }

  if (action === 'list') {
    // 제출 명단은 학생 개인정보라 PIN이 맞을 때만 보여준다
    if (String(params.pin || '') !== TEACHER_PIN || TEACHER_PIN === '여기에_PIN') {
      return out(callback, { ok: false, error: 'pin' });
    }
    ensureHeader(sheet);
    const last = sheet.getLastRow();
    const records = [];
    if (last > 1) {
      const data = sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues();
      for (const vals of data) {
        if (!vals[0]) continue;
        records.push({ sid: String(vals[0]), sname: String(vals[1]), at: String(vals[2]),
          answers: vals.slice(3).map(v => String(v)) });
      }
    }
    return out(callback, { ok: true, records: records });
  }

  // save — 한 반이 동시에 제출해도 줄이 겹치거나 중복되지 않게 한 명씩 차례로 처리
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return out(callback, { ok: false, error: 'busy' });
  try {
    ensureHeader(sheet);
    const sid = String(params.sid || '').trim();
    const sname = String(params.sname || '').trim();
    const at = String(params.at || '');
    if (!sid) return out(callback, { ok: false, error: 'sid' });
    let answers = [];
    try { answers = JSON.parse(params.answers || '[]'); } catch (err) { answers = []; }
    // 글자 그대로 저장: '=' 등으로 시작하면 앞에 ' 를 붙여 계산식이 되지 않게 (시트에는 ' 가 안 보임)
    const asText = v => /^[=+\-@]/.test(v) ? "'" + v : v;
    const rowData = [sid, sname, at].concat(answers.map(a => String(a))).map(asText);
    const existing = findRow(sheet, sid);
    const row = existing > 0 ? existing : sheet.getLastRow() + 1;
    // 숫자·날짜처럼 보이는 답도 바뀌지 않게 글자 형식으로
    sheet.getRange(row, 1, 1, rowData.length).setNumberFormat('@').setValues([rowData]);
    sortByStudentId(sheet);
    return out(callback, { ok: true });
  } finally {
    lock.releaseLock();
  }
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    const header = ['학번', '이름', '제출시각'];
    for (let i = 1; i <= NUM_BLANKS; i++) header.push('빈칸' + i);
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
  }
}

function sortByStudentId(sheet) {
  const last = sheet.getLastRow();
  if (last < 3) return;
  sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).sort({ column: 1, ascending: true });
}

function findRow(sheet, sid) {
  const last = sheet.getLastRow();
  if (last < 2 || !sid) return -1;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === sid) return i + 2;
  }
  return -1;
}

function out(callback, obj) {
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + JSON.stringify(obj) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
