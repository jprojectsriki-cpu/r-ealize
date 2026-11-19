/* R-EALIZE ログインページ（R-ANGUAGE の login.js と同じ流れ）
 * - ログインできたらトークンを保存して、「ようこそ」の表示にする（学習の画面ができたら、そこへ移る）
 * - すでにログイン中なら、その状態を表示する
 * - 「?reason=replaced」「?reason=expired」付きで開かれたら、理由を表示する
 */
(function () {
  'use strict';

  var FIELD_NAMES = { kaigo: '介護', building: 'ビルクリーニング', accommodation: '宿泊', manufacturing: '工業製品製造業' };

  function $(id) { return document.getElementById(id); }
  function alertBox(text) {
    var el = $('loginAlert');
    el.textContent = text || '';
    el.hidden = !text;
  }

  function showLogin() {
    $('doneCard').hidden = true;
    $('loginCard').hidden = false;
  }
  function showDone(user) {
    $('userName').textContent = user.name || '';
    var names = (user.fields || []).map(function (f) { return FIELD_NAMES[f] || f; });
    $('userFields').textContent = user.role === 'admin' ? '管理者（すべての分野）' : (names.join('・') || '—');
    $('adminLink').hidden = user.role !== 'admin';
    $('loginCard').hidden = true;
    $('doneCard').hidden = false;
  }

  function initForm() {
    var form = $('loginForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alertBox('');
      var email = form.elements.email.value.trim();
      var password = form.elements.password.value;
      if (!email || !password) return RZ.setMsg('loginMsg', 'メールアドレスとパスワードを入力してください。', true);
      if (!RZ.apiReady()) return RZ.setMsg('loginMsg', 'ただいまログインできません。時間をおいてお試しください。', true);

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      RZ.setMsg('loginMsg', '');
      RZ.loading('ログインしています', RZ.api({ action: 'login', email: email, password: password }))
        .then(function (res) {
          if (res && res.ok) {
            RZ.setToken(res.token);
            form.reset();
            showDone(res.user);
          } else {
            RZ.setMsg('loginMsg', (res && res.message) || 'ログインに失敗しました。', true);
          }
        })
        .catch(function (err) {
          console.error(err);
          RZ.setMsg('loginMsg', '通信に失敗しました。時間をおいてもう一度お試しください。', true);
        })
        .then(function () { btn.disabled = false; });
    });

    $('logoutBtn').addEventListener('click', function () {
      var token = RZ.token();
      RZ.setToken('');
      showLogin();
      RZ.setMsg('loginMsg', 'ログアウトしました。');
      if (token && RZ.apiReady()) RZ.api({ action: 'logout', token: token }).catch(function () {});
    });
  }

  function start() {
    var reason = new URLSearchParams(location.search).get('reason');
    if (reason === 'replaced') alertBox('別の端末でログインされたため、ログアウトしました。');
    if (reason === 'expired') alertBox('ログインの有効期限が切れました。もう一度ログインしてください。');

    var token = RZ.token();
    if (!token || !RZ.apiReady()) { showLogin(); return; }

    RZ.loading('ログインの状態を<ruby>確<rt>たし</rt></ruby>かめています', RZ.api({ action: 'me', token: token }))
      .then(function (res) {
        if (res && res.ok) { showDone(res.user); return; }
        RZ.setToken('');
        showLogin();
        if (res && (res.reason === 'replaced' || res.reason === 'suspended')) alertBox(res.message);
      })
      .catch(function () { showLogin(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    RZ.initFurigana();
    RZ.initPwToggles();
    initForm();
    start();
  });
})();
