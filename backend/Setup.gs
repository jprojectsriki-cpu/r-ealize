/**
 * R-EALIZE API - 最初の準備（1回だけ実行）
 *
 * 順番：
 *   1. setupSheets        … Users・Applications シートと見出しを作る
 *   2. setupAdmin（Auth.gs）… 管理者アカウントを作る（先にスクリプト プロパティ ADMIN_EMAIL・ADMIN_PASSWORD）
 *   3. setupPaymentCheck（Expire.gs）… 毎日3時ごろの支払期限の処理を登録する
 */

const USER_HEADERS = ['userId', 'email', 'passwordHash', 'salt', 'name', 'role', 'status', 'fields', 'createdAt', 'activatedAt', 'lastLoginAt'];
const APP_HEADERS = ['applicationId', 'userId', 'email', 'name', 'plan', 'amount', 'paymentMethod', 'status', 'createdAt', 'expiresAt', 'paidAt', 'issuedAt', 'refund', 'note', 'remindedAt'];

/**
 * 【1回だけ実行】Users・Applications シートを用意する
 * - なければ作る。あれば見出しだけ書き直す（データの行は消さない）
 * - 最初からある「シート1」は、空なら消す
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Asia/Tokyo');

  [[SHEET_USERS, USER_HEADERS, '#FFE3E6'], [SHEET_APPLICATIONS, APP_HEADERS, '#FFF6BF']].forEach(function (t) {
    let sheet = ss.getSheetByName(t[0]);
    if (!sheet) sheet = ss.insertSheet(t[0]);
    sheet.getRange(1, 1, 1, t[1].length).setValues([t[1]]).setFontWeight('bold').setBackground(t[2]);
    sheet.setFrozenRows(1);
  });

  // ハッシュ・ソルト・分野の列が、数値などに自動で変わらないよう「書式なしテキスト」にする
  const users = ss.getSheetByName(SHEET_USERS);
  users.getRange('C:D').setNumberFormat('@');
  users.getRange('H:H').setNumberFormat('@');

  // 最初からある空のシートを消す
  ['シート1', 'Sheet1'].forEach(function (name) {
    const s = ss.getSheetByName(name);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });

  Logger.log('Users（' + USER_HEADERS.length + '列）と Applications（' + APP_HEADERS.length + '列）を用意しました');
}

/** 動作確認：2つのシートの見出しを読み取ってログに出す */
function testSheets() {
  [SHEET_USERS, SHEET_APPLICATIONS].forEach(function (name) {
    const sheet = getSheet_(name);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Logger.log(name + '（' + headers.length + '列）: ' + headers.join(', '));
  });
  const p = PropertiesService.getScriptProperties();
  Logger.log('ADMIN_EMAIL：' + (p.getProperty('ADMIN_EMAIL') ? '入っています' : 'まだです'));
  Logger.log('BANK_INFO：' + (p.getProperty('BANK_INFO') ? '入っています' : 'まだです'));
}
