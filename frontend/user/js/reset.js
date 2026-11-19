/* R-EALIZE パスワード再設定（R-ANGUAGE の reset.js と同じ流れ）
 * - ?token= なし：メールアドレスを入力して、再設定のメールを送る
 * - ?token= あり：リンクを確かめて、新しいパスワードを設定する（リンクは30分・1回だけ）
 */
(function () {
  'use strict';

  var CARDS = ['requestCard', 'sentCard', 'newCard', 'doneCard', 'invalidCard'];
  var resetToken = '';

  function $(id) { return document.getElementById(id); }
  function show(id) { CARDS.forEach(function (c) { $(c).hidden = c !== id; }); }

  /* ---------- ① メールアドレスを入力して送る ---------- */
  function initRequest() {
    var form = $('requestForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.elements.email;
      var email = input.value.trim();
      if (!email || !input.checkValidity()) return RZ.setMsg('requestMsg', 'メールアドレスを確認してください。', true);
      if (!RZ.apiReady()) return RZ.setMsg('requestMsg', 'ただいまお手続きできません。時間をおいてお試しください。', true);

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      RZ.setMsg('requestMsg', '');
      RZ.loading('メールを<ruby>送<rt>おく</rt></ruby>っています', RZ.api({ action: 'resetRequest', email: email }))
        .then(function (res) {
          if (res && res.ok) { form.reset(); show('sentCard'); }
          else RZ.setMsg('requestMsg', (res && res.message) || 'お手続きできませんでした。', true);
        })
        .catch(function (err) {
          console.error(err);
          RZ.setMsg('requestMsg', '通信に失敗しました。時間をおいてもう一度お試しください。', true);
        })
        .then(function () { btn.disabled = false; });
    });

    $('againBtn').addEventListener('click', function () {
      RZ.setMsg('requestMsg', '');
      show('requestCard');
      form.elements.email.focus();
    });
  }

  /* ---------- ③ 新しいパスワードを設定する ---------- */
  function initNewPassword() {
    var form = $('newForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var pw = form.elements.password.value;
      var pw2 = form.elements.passwordConfirm.value;
      if (pw.length < 8 || pw.length > 64) return RZ.setMsg('newMsg', 'パスワードは8〜64文字で入力してください。', true);
      if (pw !== pw2) return RZ.setMsg('newMsg', 'パスワード（確認）が一致しません。', true);

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      RZ.setMsg('newMsg', '');
      RZ.loading('パスワードを<ruby>変更<rt>へんこう</rt></ruby>しています', RZ.api({ action: 'resetPassword', token: resetToken, password: pw }))
        .then(function (res) {
          if (res && res.ok) {
            form.reset();
            resetToken = '';
            RZ.setToken(''); // この端末のログイン情報も消す（GAS 側で、ログイン中の端末はすべてログアウトしている）
            show('doneCard');
          } else if (res && res.reason === 'invalid') {
            show('invalidCard');
          } else {
            RZ.setMsg('newMsg', (res && res.message) || 'パスワードを変更できませんでした。', true);
          }
        })
        .catch(function (err) {
          console.error(err);
          RZ.setMsg('newMsg', '通信に失敗しました。時間をおいてもう一度お試しください。', true);
        })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- 開いたとき ---------- */
  function start() {
    resetToken = new URLSearchParams(location.search).get('token') || '';
    if (!resetToken) { show('requestCard'); return; }
    if (!RZ.apiReady()) { show('invalidCard'); return; }

    RZ.loading('リンクを<ruby>確<rt>たし</rt></ruby>かめています', RZ.api({ action: 'resetCheck', token: resetToken }))
      .then(function (res) {
        // アドレスバーや履歴にリンクの文字列が残らないように、URL から消しておく
        try { history.replaceState(null, '', location.pathname); } catch (e) { /* 無視 */ }
        if (res && res.ok) {
          $('maskedEmail').textContent = res.email || '';
          show('newCard');
          $('newForm').elements.password.focus();
        } else {
          show('invalidCard');
        }
      })
      .catch(function (err) {
        // 通信の失敗のときは、URL を残したままにする（読み込み直せば、もう一度確かめられる）
        console.error(err);
        $('invalidTitle').textContent = '通信に失敗しました';
        $('invalidLead').textContent = 'インターネットの接続を確認してから、このページを読み込み直してください。';
        show('invalidCard');
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    RZ.initFurigana();
    RZ.initPwToggles();
    initRequest();
    initNewPassword();
    start();
  });
})();
