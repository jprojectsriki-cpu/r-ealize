/**
 * R-EALIZE API - 管理者用（申込一覧・発行・キャンセル、受講生の一覧・停止・分野の追加）
 * （R-ANGUAGE の Admin.gs と同じ。利用期限・STAGE はない）
 */

/** 管理者かどうかを確かめる */
function requireAdmin_(token) {
  const auth = checkSession_(token);
  if (!auth.ok) return auth;
  if (auth.user.role !== 'admin') {
    return { ok: false, reason: 'forbidden', message: '管理者のみ利用できます。' };
  }
  return auth;
}

/** Applicationsシートを読み込んで、オブジェクトの配列にする */
function readApplications_() {
  const sheet = getSheet_(SHEET_APPLICATIONS);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, 14).getValues().map(function (r, i) {
    return {
      row: i + 2,
      applicationId: String(r[0]),
      userId: String(r[1]),
      email: String(r[2]),
      name: String(r[3]),
      plan: String(r[4]),
      amount: Number(r[5]),
      paymentMethod: String(r[6]),
      status: String(r[7]),
      createdAt: r[8] || null,
      expiresAt: r[9] || null,
      paidAt: r[10] || null,
      issuedAt: r[11] || null,
      note: String(r[13] || '')
    };
  });
}

/** userId から Users の行を探す（見つからなければ null） */
function findUserRowById_(userId) {
  const sheet = getSheet_(SHEET_USERS);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === userId) return i + 2;
  }
  return null;
}

/** 【管理者】申込の一覧（status を指定すると絞り込み。新しい順） */
function adminListApplications_(token, status) {
  const auth = requireAdmin_(token);
  if (!auth.ok) return auth;

  let list = readApplications_();
  if (status) list = list.filter(function (a) { return a.status === status; });
  list.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

  return {
    ok: true,
    applications: list.map(function (a) { delete a.row; a.planLabel = planLabel_(a.plan); return a; })
  };
}

/** 【管理者】入金を確認して、アカウントを発行する */
function adminIssue_(token, applicationId) {
  const auth = requireAdmin_(token);
  if (!auth.ok) return auth;

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  let app;
  try {
    app = readApplications_().filter(function (a) { return a.applicationId === applicationId; })[0];
    if (!app) return { ok: false, message: '申込が見つかりません。' };

    // 期限切れの申込も、期限のあとに入金を確認できたときは発行できる
    const blocked = { issued: '発行済み', cancelled: 'キャンセル済み' };
    if (blocked[app.status]) {
      return { ok: false, message: 'この申込は「' + blocked[app.status] + '」のため発行できません。' };
    }

    const userRow = findUserRowById_(app.userId);
    if (!userRow) return { ok: false, message: 'アカウントが見つかりません。' };

    const users = getSheet_(SHEET_USERS);
    const u = users.getRange(userRow, 1, 1, 11).getValues()[0];
    if (String(u[6]) === 'suspended') {
      return { ok: false, message: 'このアカウントは停止中のため発行できません。先に停止を解除してください。' };
    }

    const now = new Date();

    // 申込：発行済みにする
    const apps = getSheet_(SHEET_APPLICATIONS);
    apps.getRange(app.row, 8).setValue('issued');               // status
    if (!app.paidAt) apps.getRange(app.row, 11).setValue(now);  // paidAt
    apps.getRange(app.row, 12).setValue(now);                   // issuedAt
    if (app.status === 'expired') {
      const stamp = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
      apps.getRange(app.row, 14).setValue((app.note ? app.note + '\n' : '') + '[' + stamp + ' 期限のあとに入金を確認して発行]'); // note
    }

    // アカウント：有効にして、分野を追加する（まとめてプランは4分野すべて）
    const fields = String(u[7] || '').split(',').filter(String);
    fieldsOf_(app.plan).forEach(function (f) { if (fields.indexOf(f) === -1) fields.push(f); });
    sortFields_(fields);

    users.getRange(userRow, 7).setValue('active');              // status
    users.getRange(userRow, 8).setValue(fields.join(','));      // fields
    if (!u[9]) users.getRange(userRow, 10).setValue(now);       // activatedAt（初回だけ）

    app.fields = fields;
    // 同じアカウントに、ほかの「入金待ち」の申込がないか（申し込み直したあとなど。二重の入金に気づくため）
    app.others = readApplications_().filter(function (x) {
      return x.userId === app.userId && x.applicationId !== app.applicationId && (x.status === 'awaiting_payment' || x.status === 'paid');
    }).map(function (x) { return x.applicationId + '（' + planLabel_(x.plan) + '）'; });
  } finally {
    lock.releaseLock();
  }

  sendIssueMail_(app);
  return { ok: true, applicationId: app.applicationId, fields: app.fields, others: app.others };
}

/** 発行メールを送る */
function sendIssueMail_(app) {
  MailApp.sendEmail({
    to: app.email,
    subject: '【R-EALIZE】アカウントを発行しました（' + app.applicationId + '）',
    name: MAIL_NAME,
    body: [
      app.name + ' 様',
      '',
      'お支払いを確認いたしました。ありがとうございます。',
      'R-EALIZE のアカウントを発行しましたので、お知らせします。',
      '',
      '■ 申込番号　　　：' + app.applicationId,
      '■ お申し込みの分野：' + planLabel_(app.plan),
      '■ ご利用中の分野：' + app.fields.map(fieldLabel_).join('、'),
      '■ 利用期限　　　：なし（買い切り）',
      '■ ログインID　　：' + app.email,
      '',
      'ログインには、お申し込み時に設定したパスワードをお使いください。',
      '下のログインページからお入りいただけます。',
      LOGIN_URL,
      '',
      '※ 同じアカウントで、別の端末から同時にログインすることはできません。',
      '　 あとからログインした端末が優先され、前の端末は自動でログアウトします。',
      '',
      '----------------------------------------',
      MAIL_FOOTER
    ].join('\n')
  });
}

/* =========================================================
 * 受講生の管理
 * ========================================================= */

/** 【管理者】受講生の一覧（パスワードのハッシュ・ソルトは渡さない） */
function adminListUsers_(token) {
  const auth = requireAdmin_(token);
  if (!auth.ok) return auth;

  const sheet = getSheet_(SHEET_USERS);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { ok: true, users: [] };

  const users = sheet.getRange(2, 1, lastRow - 1, 11).getValues()
    .filter(function (r) { return String(r[5]) === 'user'; })
    .map(function (r) {
      return {
        userId: String(r[0]),
        email: String(r[1]),
        name: String(r[4]),
        status: String(r[6]),
        fields: String(r[7] || '').split(',').filter(String),
        createdAt: r[8] || null,
        activatedAt: r[9] || null,
        lastLoginAt: r[10] || null
      };
    });
  return { ok: true, users: users };
}

/** 【管理者】アカウントの停止・再開（active ⇔ suspended のみ） */
function adminSetUserStatus_(token, userId, status) {
  const auth = requireAdmin_(token);
  if (!auth.ok) return auth;
  if (status !== 'active' && status !== 'suspended') return { ok: false, message: '状態の指定が正しくありません。' };

  const row = findUserRowById_(String(userId || ''));
  if (!row) return { ok: false, message: 'アカウントが見つかりません。' };

  const sheet = getSheet_(SHEET_USERS);
  const u = sheet.getRange(row, 1, 1, 11).getValues()[0];
  if (String(u[5]) === 'admin') return { ok: false, message: '管理者のアカウントは変更できません。' };
  if (String(u[6]) === 'pending') return { ok: false, message: '入金待ちのアカウントは、申込の「発行」で有効にしてください。' };

  sheet.getRange(row, 7).setValue(status);

  const cache = CacheService.getScriptCache();
  if (status === 'suspended') {
    // ログイン中の端末を、次の操作のときにログアウトさせる
    cache.put('current_' + userId, 'suspended', SESSION_TTL_SEC);
  } else {
    cache.remove('current_' + userId);
  }
  return { ok: true, userId: userId, status: status };
}

/**
 * 【管理者】分野を手動で追加する（受講生から追加の入金があったとき、など）
 * field に 'all' を渡すと4分野すべてを追加する
 */
function adminAddField_(token, userId, field) {
  const auth = requireAdmin_(token);
  if (!auth.ok) return auth;
  field = String(field || '');
  if (!PLAN_PRICES[field]) return { ok: false, message: '分野の指定が正しくありません。' };

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const row = findUserRowById_(String(userId || ''));
    if (!row) return { ok: false, message: 'アカウントが見つかりません。' };

    const sheet = getSheet_(SHEET_USERS);
    const u = sheet.getRange(row, 1, 1, 11).getValues()[0];
    if (String(u[5]) === 'admin') return { ok: false, message: '管理者のアカウントは変更できません。' };
    if (String(u[6]) === 'pending') return { ok: false, message: '入金待ちのアカウントは、申込の「発行」で有効にしてください。' };

    const fields = String(u[7] || '').split(',').filter(String);
    const add = fieldsOf_(field).filter(function (f) { return fields.indexOf(f) === -1; });
    if (!add.length) return { ok: false, message: 'すでに「' + planLabel_(field) + '」を持っています。' };

    add.forEach(function (f) { fields.push(f); });
    sortFields_(fields);
    sheet.getRange(row, 8).setValue(fields.join(','));
    return { ok: true, userId: userId, fields: fields, added: add };
  } finally {
    lock.releaseLock();
  }
}

/** 【管理者】申込をキャンセルする（入金待ち・入金確認済みのみ）。メモを残す */
function adminCancelApplication_(token, applicationId, note) {
  const auth = requireAdmin_(token);
  if (!auth.ok) return auth;

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const app = readApplications_().filter(function (a) { return a.applicationId === applicationId; })[0];
    if (!app) return { ok: false, message: '申込が見つかりません。' };
    if (app.status !== 'awaiting_payment' && app.status !== 'paid') {
      return { ok: false, message: '入金待ち・入金確認済みの申込だけキャンセルできます。' };
    }

    const stamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
    const memo = (app.note ? app.note + '\n' : '') + '[' + stamp + ' キャンセル] ' + String(note || '').slice(0, 200);

    const sheet = getSheet_(SHEET_APPLICATIONS);
    sheet.getRange(app.row, 8).setValue('cancelled');
    sheet.getRange(app.row, 14).setValue(memo);
    return { ok: true, applicationId: applicationId, status: 'cancelled' };
  } finally {
    lock.releaseLock();
  }
}

/* =========================================================
 * テスト用（確認だけ → 実行 の順）
 * ========================================================= */

/**
 * 【テスト用】申込 → 発行 → ログイン → 停止・再開 → 分野追加 → キャンセル をまとめて確かめる
 * - 管理者のメールアドレスに「+rztest」「+rztest2」を付けたアドレスで申し込む（メールは管理者の受信箱に届く）
 * - 事前に、スクリプト プロパティに TEST_PASSWORD（R-EALIZE の管理者アカウントのパスワード）を入れておく
 * - 終わったら TEST_PASSWORD は自動で消える。テストの行は previewCleanupTest → cleanupTest で消す
 */
function testAdmin() {
  const props = PropertiesService.getScriptProperties();
  const adminEmail = props.getProperty('ADMIN_EMAIL');
  const password = props.getProperty('TEST_PASSWORD');
  if (!password) throw new Error('スクリプト プロパティに TEST_PASSWORD（R-EALIZE の管理者アカウントのパスワード）を設定してください。');
  const emailA = adminEmail.replace('@', '+rztest@').toLowerCase();
  const emailB = adminEmail.replace('@', '+rztest2@').toLowerCase();
  if (findUserByEmail_(emailA) || findUserByEmail_(emailB)) {
    throw new Error('前のテストの行（+rztest / +rztest2）が残っています。先に cleanupTest を実行してください。');
  }

  try {
    const a = apply_({ plan: 'kaigo', name: 'テスト 太郎', email: emailA, password: 'testpass123' });
    const b = apply_({ plan: 'all', name: 'テスト 花子', email: emailB, password: 'testpass123' });
    if (!a.ok || !b.ok) throw new Error('テスト申込に失敗しました：' + (a.message || b.message));
    Logger.log('① テスト申込 → ' + a.applicationId + '（介護）、' + b.applicationId + '（4分野まとめて）');
    Logger.log('② 発行前の太郎のログイン → ' + login_(emailA, 'testpass123').message);

    const admin = login_(adminEmail, password);
    if (!admin.ok) throw new Error('管理者のログインに失敗しました：' + admin.message + '（TEST_PASSWORD を確認してください）');
    const waiting = adminListApplications_(admin.token, 'awaiting_payment');
    Logger.log('③ 入金待ちの一覧 → ' + waiting.applications.length + '件');

    Logger.log('④ 太郎を発行 → ' + JSON.stringify(adminIssue_(admin.token, a.applicationId)));
    Logger.log('⑤ もう一度発行 → ' + adminIssue_(admin.token, a.applicationId).message);

    const user = login_(emailA, 'testpass123');
    Logger.log('⑥ 発行後の太郎のログイン → ok: ' + user.ok + ' / fields: ' + (user.user && user.user.fields));
    Logger.log('⑦ 太郎が管理機能を呼ぶ → ' + adminListApplications_(user.token).message);

    const userA = findUserByEmail_(emailA);
    Logger.log('⑧ 停止 → ' + JSON.stringify(adminSetUserStatus_(admin.token, userA.userId, 'suspended')));
    Logger.log('⑨ 停止後、ログイン中の太郎 → ' + checkSession_(user.token).reason);
    Logger.log('⑩ 再開 → ' + JSON.stringify(adminSetUserStatus_(admin.token, userA.userId, 'active')));
    Logger.log('⑪ 分野を追加（宿泊） → ' + JSON.stringify(adminAddField_(admin.token, userA.userId, 'accommodation')));
    Logger.log('⑫ 同じ分野をもう一度 → ' + adminAddField_(admin.token, userA.userId, 'accommodation').message);

    Logger.log('⑬ 花子の申込をキャンセル → ' + JSON.stringify(adminCancelApplication_(admin.token, b.applicationId, 'テストのため')));
    logout_(admin.token);
  } finally {
    props.deleteProperty('TEST_PASSWORD');
    Logger.log('TEST_PASSWORD を削除しました。テストの行は previewCleanupTest → cleanupTest で消してください');
  }
}

/** テストで作った行（メールに「+rztest」を含む）を探す */
function findTestRows_() {
  const found = { users: [], apps: [] };
  [[SHEET_USERS, 2, 'users'], [SHEET_APPLICATIONS, 3, 'apps']].forEach(function (t) {
    const sheet = getSheet_(t[0]);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return;
    sheet.getRange(2, t[1], lastRow - 1, 1).getValues().forEach(function (r, i) {
      if (String(r[0]).toLowerCase().indexOf('+rztest') !== -1) found[t[2]].push({ row: i + 2, email: String(r[0]) });
    });
  });
  return found;
}

/** 【確認だけ】テストで作った行を一覧にする（何も消さない） */
function previewCleanupTest() {
  const f = findTestRows_();
  Logger.log('Users：' + f.users.length + '行 ' + f.users.map(function (x) { return x.row + '行目 ' + x.email; }).join('、'));
  Logger.log('Applications：' + f.apps.length + '行 ' + f.apps.map(function (x) { return x.row + '行目 ' + x.email; }).join('、'));
  Logger.log('消してよければ cleanupTest を実行してください');
}

/** 【実行】テストで作った行を消す（下の行から消す） */
function cleanupTest() {
  const f = findTestRows_();
  [[SHEET_USERS, f.users], [SHEET_APPLICATIONS, f.apps]].forEach(function (t) {
    const sheet = getSheet_(t[0]);
    t[1].slice().reverse().forEach(function (x) { sheet.deleteRow(x.row); });
  });
  Logger.log('消しました：Users ' + f.users.length + '行・Applications ' + f.apps.length + '行');
}
