/**
 * R-EALIZE API - 申し込み（R-ANGUAGE の Apply.gs と同じ流れ）
 * - お支払いは銀行振込だけ。振込先は、スクリプト プロパティ BANK_INFO に入れる（コードには書かない）
 * - 料金は買い切り・期限なし（R-ANGUAGE と違い、利用期限・更新はない）
 * - 期限切れ・キャンセルで「入金待ち」のまま残ったアカウントは、同じメールアドレスで申し込み直せる
 */

// 分野（LP の分野の id と同じ）と料金（税込・買い切り）
const FIELDS = [
  { id: 'kaigo', label: '介護' },
  { id: 'building', label: 'ビルクリーニング' },
  { id: 'accommodation', label: '宿泊' },
  { id: 'manufacturing', label: '工業製品製造業' }
];
const FIELD_PRICE = 5000;
// 4分野まとめてプラン（発行すると4分野すべてが使える）
const BUNDLE = { code: 'all', price: 18000, label: '4分野まとめて' };
const PLAN_PRICES = (function () {
  const p = {};
  FIELDS.forEach(function (f) { p[f.id] = FIELD_PRICE; });
  p[BUNDLE.code] = BUNDLE.price;
  return p;
})();
const FIELD_ORDER = FIELDS.map(function (f) { return f.id; });

/** 分野の id の表示名（kaigo →「介護」） */
function fieldLabel_(id) {
  const f = FIELDS.filter(function (x) { return x.id === id; })[0];
  return f ? f.label : String(id);
}
/** 申込のプランの表示名（all →「4分野まとめて」） */
function planLabel_(plan) { return plan === BUNDLE.code ? BUNDLE.label : fieldLabel_(plan); }
/** 申込を発行したときに使えるようになる分野 */
function fieldsOf_(plan) { return plan === BUNDLE.code ? FIELD_ORDER.slice() : [String(plan)]; }
/** 分野の並びを、決まった順（介護・ビルクリーニング・宿泊・工業製品製造業）にそろえる */
function sortFields_(list) {
  return list.sort(function (a, b) { return FIELD_ORDER.indexOf(a) - FIELD_ORDER.indexOf(b); });
}

// お支払い方法の名前
const PAYMENT_METHODS = { bank_transfer: '銀行振込' };
const PAYMENT_DEFAULT = 'bank_transfer'; // 新しい申込は、すべて銀行振込
const PAYMENT_DAYS = 7; // 支払期限（日）
const APPLY_MAX_PER_HOUR = 30; // 1時間に受け付ける申込の数（いたずら対策）

/** 申込番号を作る（例：RZ-20261119-K7Q2） */
function makeApplicationId_() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 見間違えやすい O/0/I/1 は使わない
  let rand = '';
  for (let i = 0; i < 4; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length));
  const date = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd');
  return 'RZ-' + date + '-' + rand;
}

/** 申し込みを受け付ける */
function apply_(req) {
  const plan = String(req.plan || '');
  const payment = PAYMENT_DEFAULT; // 画面から何が送られても、銀行振込で受け付ける
  const name = String(req.name || '').trim();
  const email = String(req.email || '').trim().toLowerCase();
  const password = String(req.password || '');

  // ---- いたずら対策：見えない欄（website）に何か入っていたら、受け付けたふりをして何もしない ----
  if (String(req.website || '').trim()) return { ok: true, applicationId: '' };

  // ---- 入力チェック ----
  if (!PLAN_PRICES[plan]) return { ok: false, message: '分野を選択してください。' };
  if (!name || name.length > 50) return { ok: false, message: 'お名前を50文字以内で入力してください。' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { ok: false, message: 'メールアドレスの形式を確認してください。' };
  }
  if (password.length < 8 || password.length > 64) {
    return { ok: false, message: 'パスワードは8〜64文字で入力してください。' };
  }

  // ---- 1時間あたりの申込の数 ----
  const cache = CacheService.getScriptCache();
  const hourKey = 'applycount_' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMddHH');
  const count = Number(cache.get(hourKey) || 0);
  if (count >= APPLY_MAX_PER_HOUR) {
    return { ok: false, message: 'ただいまお申し込みが混み合っています。時間をおいてもう一度お試しください。' };
  }

  // ---- 登録（同時に申し込みが来ても重ならないよう、順番に処理する） ----
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  let application;
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + PAYMENT_DAYS * 24 * 60 * 60 * 1000);
    const salt = generateSalt_();
    let userId;

    const existing = findUserByEmail_(email);
    if (existing) {
      // 利用中・停止中のアカウントは、新しく申し込めない
      if (existing.status !== 'pending') {
        return {
          ok: false,
          message: 'このメールアドレスはすでに登録されています。分野の追加は、お問い合わせからご連絡ください。'
        };
      }

      // 「入金待ち」のアカウント：お支払い待ちの申込がまだ有効なら、二重の申し込みを防ぐ
      const apps = readApplications_().filter(function (a) { return a.userId === existing.userId; });
      const open = apps.filter(function (a) {
        if (a.status === 'paid') return true;
        return a.status === 'awaiting_payment' && a.expiresAt && new Date(a.expiresAt).getTime() > now.getTime();
      });
      if (open.length) {
        return {
          ok: false,
          message: 'このメールアドレスでは、お支払い待ちのお申し込み（' + open[0].applicationId + '）があります。受付メールに書かれた支払期限までにお支払いください。'
        };
      }

      // 期限が過ぎたのに、まだ「入金待ち」のままの申込は、ここで「期限切れ」にする（期限切れメールは送らない）
      const appSheet = getSheet_(SHEET_APPLICATIONS);
      const stamp = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
      apps.filter(function (a) { return a.status === 'awaiting_payment'; }).forEach(function (a) {
        appSheet.getRange(a.row, 8).setValue('expired');
        appSheet.getRange(a.row, 14).setValue((a.note ? a.note + '\n' : '') + '[' + stamp + ' 期限切れ（申し込み直しのため）]');
      });

      // 期限切れ・キャンセルで残っていたアカウントを、新しい内容で使い直す（C：passwordHash、D：salt、E：name）
      userId = existing.userId;
      getSheet_(SHEET_USERS).getRange(existing.row, 3, 1, 3).setValues([[hashPassword_(password, salt), salt, name]]);
    } else {
      userId = Utilities.getUuid();
      getSheet_(SHEET_USERS).appendRow([
        userId, email, hashPassword_(password, salt), salt, name,
        'user',      // role
        'pending',   // status（入金待ち）
        '',          // fields（発行時に追加する）
        now, '', ''  // createdAt, activatedAt, lastLoginAt
      ]);
    }

    application = {
      applicationId: makeApplicationId_(),
      plan: plan,
      amount: PLAN_PRICES[plan],
      payment: payment,
      expiresAt: expiresAt
    };
    getSheet_(SHEET_APPLICATIONS).appendRow([
      application.applicationId, userId, email, name, plan, application.amount,
      payment, 'awaiting_payment', now, expiresAt, '', '', '', ''
    ]);
    cache.put(hourKey, String(count + 1), 60 * 60);
  } finally {
    lock.releaseLock();
  }

  sendApplyMails_(name, email, application);

  return {
    ok: true,
    applicationId: application.applicationId,
    expiresAt: application.expiresAt.toISOString()
  };
}

/** メールアドレスがUsersに登録済みか */
function emailExists_(email) {
  return !!findUserByEmail_(String(email || '').trim().toLowerCase());
}

/**
 * 振込先の案内（受付メール・リマインドメールで使う）
 * 振込先は、スクリプト プロパティ BANK_INFO（例：「〇〇銀行 〇〇支店 普通 1234567 ナカムラ リキ」）
 */
function bankLines_(applicationId) {
  const bank = String(PropertiesService.getScriptProperties().getProperty('BANK_INFO') || '').trim();
  const code = String(applicationId || '').slice(-4);
  if (!bank) return ['振込先の口座は、追ってメールでお知らせします。'];
  return [
    '■ 振込先　：' + bank,
    '',
    '振込名義（お名前）の前に、申込番号の最後の4文字「' + code + '」を付けてください。',
    '（例：' + code + ' ヤマダ タロウ）',
    '振込手数料は、お客様のご負担となります。',
    '',
    '【ATMでの振り込み方】',
    '1. 銀行のATMで「振込」を選びます。',
    '2. 上の「振込先」の銀行・支店・口座の種類（普通）・口座番号を入れます。',
    '3. 金額を入れます（上の「金額」と同じ）。',
    '4. 振込名義（あなたの名前）の前に「' + code + '」を入れます。',
    '5. 内容を確かめて、お金を払います（現金か、キャッシュカード）。',
    '6. 明細書（レシート）は、アカウントが届くまで捨てないでください。',
    '※ コンビニのATMは、キャッシュカードがないと振り込めないことがあります。現金のときは、銀行のATMを使ってください。',
    '※ わからないときは、銀行の窓口で、このメールを見せてください。',
    '',
    '[How to pay at an ATM]',
    '1. At a bank ATM, choose "振込" (Transfer).',
    '2. Enter the bank, branch, account type (普通 = ordinary) and account number shown in "振込先" above.',
    '3. Enter the amount shown in "金額" above.',
    '4. Before your name (振込名義), enter "' + code + '". Your name is entered in katakana. Example: ' + code + ' ヤマダ タロウ',
    '5. Check the details and pay (cash or cash card).',
    '6. Keep the receipt (明細書) until you receive your account email.',
    '* Convenience store ATMs often accept transfers only with a cash card. To pay in cash, please use a bank ATM.',
    '* If you are not sure, show this email to the staff at the bank counter.'
  ];
}

/** 【確認用】振込先（BANK_INFO）が入っているかをログに出す */
function checkBankInfo() {
  const bank = PropertiesService.getScriptProperties().getProperty('BANK_INFO');
  Logger.log('BANK_INFO：' + (bank ? '入っています' : 'まだです（スクリプト プロパティに入れてください）'));
  Logger.log(bankLines_('RZ-20261119-AB12').join('\n'));
}

/** 受付メール（申込者あて）と、新着通知（管理者あて）を送る */
function sendApplyMails_(name, email, a) {
  const deadline = Utilities.formatDate(a.expiresAt, 'Asia/Tokyo', 'yyyy年M月d日 HH:mm');
  const amount = a.amount.toLocaleString('ja-JP');

  MailApp.sendEmail({
    to: email,
    subject: '【R-EALIZE】お申し込みを受け付けました（' + a.applicationId + '）',
    name: MAIL_NAME,
    body: [
      name + ' 様',
      '',
      'R-EALIZE にお申し込みいただき、ありがとうございます。',
      '以下の内容でお申し込みを受け付けました。',
      '',
      '■ 申込番号：' + a.applicationId,
      '■ 分野　　：' + planLabel_(a.plan),
      '■ 金額　　：' + amount + '円（税込・買い切り・期限なし）',
      '■ お支払い：' + PAYMENT_METHODS[a.payment],
      '■ 支払期限：' + deadline,
      '',
    ].concat(bankLines_(a.applicationId)).concat([
      '',
      'お支払いを確認したあと、アカウントを発行してメールでお知らせします。',
      'ログインには、お申し込み時に設定したパスワードをお使いください。',
      '',
      '※ 支払期限を過ぎると、お申し込みは自動的に取り消されます。',
      '※ このメールに心当たりがない場合は、このメールを破棄してください。',
      '',
      '----------------------------------------',
      MAIL_FOOTER,
      SITE_URL
    ]).join('\n')
  });

  const adminEmail = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
  if (adminEmail) {
    MailApp.sendEmail({
      to: adminEmail,
      subject: '【R-EALIZE管理】新しいお申し込み（' + a.applicationId + '）',
      name: MAIL_NAME,
      body: [
        '新しいお申し込みがありました。',
        '',
        '申込番号：' + a.applicationId,
        'お名前　：' + name,
        'メール　：' + email,
        '分野　　：' + planLabel_(a.plan) + '（' + amount + '円）',
        'お支払い：' + PAYMENT_METHODS[a.payment],
        '支払期限：' + deadline,
        '',
        '管理画面：' + ADMIN_URL
      ].join('\n')
    });
  }
}

/**
 * 【テスト用】申込の動作確認
 * 管理者のメールアドレスに「+rztest」を付けたアドレスで申し込む
 * （Gmailは「名前+好きな文字@gmail.com」宛のメールも、本人の受信箱に届く）
 * 終わったら、Users・Applications のテストの行は cleanupTest で消す
 */
function testApply() {
  const adminEmail = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
  const testEmail = adminEmail.replace('@', '+rztest@');

  const res1 = apply_({ plan: 'kaigo', name: 'テスト 太郎', email: testEmail, password: 'testpass123' });
  Logger.log('① 1回目の申込 → ' + JSON.stringify(res1));

  const res2 = apply_({ plan: 'all', name: 'テスト 太郎', email: testEmail, password: 'testpass123' });
  Logger.log('② 同じメールで2回目 → ' + JSON.stringify(res2));

  const res3 = apply_({ plan: 'gaishoku', name: 'テスト', email: 'x@example.com', password: 'testpass123' });
  Logger.log('③ ない分野 → ' + JSON.stringify(res3));
}
