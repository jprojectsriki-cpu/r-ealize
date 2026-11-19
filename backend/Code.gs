/**
 * R-EALIZE API - エントリポイント
 * （R-ANGUAGE と同じつくり。申込 → 入金確認 → 管理者がアカウントを発行）
 */

// シート名（スプレッドシートのタブ名と完全一致させる）
const SHEET_USERS = 'Users';
const SHEET_APPLICATIONS = 'Applications';

// 画面の URL（メールに書く）
const SITE_URL = 'https://jprojectsriki-cpu.github.io/r-ealize/frontend/user/';
const LOGIN_URL = SITE_URL + 'login.html';
const ADMIN_URL = 'https://jprojectsriki-cpu.github.io/r-ealize/frontend/admin/';
const MAIL_NAME = 'R-EALIZE';
const MAIL_FOOTER = 'R-EALIZE｜留学生向け 特定技能1号 試験対策システム';

/**
 * GETリクエストの入口（動作確認用）
 */
function doGet(e) {
  return json_({ ok: true, message: 'R-EALIZE API is running' });
}

/**
 * オブジェクトをJSONで返す共通関数
 */
function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 名前を指定してシートを取得する（なければエラー）
 */
function getSheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error(name + ' シートが見つかりません。先に setupSheets を実行してください。');
  return sheet;
}

/**
 * POSTリクエストの入口
 * フロントからは { action: '○○', ... } の形のJSONを送ってもらう
 */
function doPost(e) {
  let req;
  try {
    req = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, message: 'リクエストの形式が正しくありません。' });
  }

  try {
    switch (req.action) {
      case 'apply':
        return json_(apply_(req));
      case 'login':
        return json_(login_(req.email, req.password));
      case 'resetRequest':
        return json_(requestPasswordReset_(req.email));
      case 'resetCheck':
        return json_(checkResetToken_(req.token));
      case 'resetPassword':
        return json_(resetPassword_(req.token, req.password));
      case 'logout':
        return json_(logout_(req.token));
      case 'me':
        return json_(checkSession_(req.token));
      case 'admin.list':
        return json_(adminListApplications_(req.token, req.status));
      case 'admin.issue':
        return json_(adminIssue_(req.token, req.applicationId));
      case 'admin.users':
        return json_(adminListUsers_(req.token));
      case 'admin.userStatus':
        return json_(adminSetUserStatus_(req.token, req.userId, req.status));
      case 'admin.addField':
        return json_(adminAddField_(req.token, req.userId, req.field));
      case 'admin.cancel':
        return json_(adminCancelApplication_(req.token, req.applicationId, req.note));
      default:
        return json_({ ok: false, message: '不明な操作です。' });
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, message: 'サーバーでエラーが発生しました。時間をおいてもう一度お試しください。' });
  }
}
