/* R-EALIZE 共通（ログイン・パスワード再設定・管理画面で使う）
 *   RZ.api({ action: '…' })            … GAS に送る（Promise で JSON が返る）
 *   RZ.apiReady()                      … API_URL が入っているか
 *   RZ.loading('送っています', promise) … 処理中の画面を出して、終わったら消す
 *   RZ.token() / RZ.setToken(t)        … ログインのトークン（この端末に保存）
 *   RZ.initFurigana()                  … ふりがな ON/OFF ボタン（LP と同じ設定を使う）
 * ※ loading に渡す文字は、プログラムで決めた固定の文字だけにすること（入力された値は渡さない）
 */
window.RZ = (function () {
  'use strict';

  var CONFIG = window.REALIZE_CONFIG || {};
  var TOKEN_KEY = 'realize_token';
  var FURIGANA_KEY = 'realize_furigana';
  var MIN_SHOW_MS = 600; // 一瞬で消えてチラつかないよう、最低限表示する時間

  function apiReady() { return /^https:\/\//.test(CONFIG.API_URL || ''); }

  function api(data) {
    return fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function token() { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } }
  function setToken(t) {
    try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch (e) { /* 保存できなくても動く */ }
  }

  /* ---------- 処理中の画面 ---------- */
  var box = null;
  var shownAt = 0;
  function build() {
    box = document.createElement('div');
    box.className = 'rz-loading';
    box.hidden = true;
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    box.innerHTML =
      '<div class="rz-loading-card">' +
        '<div class="rz-loading-title en">LOADING</div>' +
        '<div class="rz-loading-bar" aria-hidden="true"><span></span></div>' +
        '<p class="rz-loading-text"></p>' +
      '</div>';
    document.body.appendChild(box);
  }
  function showLoading(html) {
    if (!box) build();
    box.querySelector('.rz-loading-text').innerHTML = html || '';
    box.hidden = false;
    shownAt = Date.now();
  }
  function hideLoading() {
    return new Promise(function (resolve) {
      if (!box || box.hidden) { resolve(); return; }
      var wait = Math.max(0, MIN_SHOW_MS - (Date.now() - shownAt));
      setTimeout(function () { box.hidden = true; resolve(); }, wait);
    });
  }
  function loading(html, promise) {
    showLoading(html);
    return promise.then(
      function (res) { return hideLoading().then(function () { return res; }); },
      function (err) { return hideLoading().then(function () { throw err; }); }
    );
  }

  /* ---------- ふりがな ---------- */
  function initFurigana() {
    var btn = document.getElementById('furigana-toggle');
    function apply(on) {
      document.body.classList.toggle('furigana-off', !on);
      if (btn) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.textContent = on ? 'ON' : 'OFF'; }
    }
    var saved = null;
    try { saved = localStorage.getItem(FURIGANA_KEY); } catch (e) { saved = null; }
    apply(saved !== '0');
    if (btn) btn.addEventListener('click', function () {
      var on = document.body.classList.contains('furigana-off');
      apply(on);
      try { localStorage.setItem(FURIGANA_KEY, on ? '1' : '0'); } catch (e) { /* 保存できなくても動く */ }
    });
  }

  /* ---------- メッセージ ---------- */
  function setMsg(el, text, isError) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    el.textContent = text || '';
    el.classList.toggle('is-error', !!isError);
  }

  /* ---------- パスワードの「表示」ボタン ---------- */
  function initPwToggles(root) {
    (root || document).querySelectorAll('[data-pw-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var input = b.parentNode.querySelector('input');
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        b.setAttribute('aria-pressed', String(show));
      });
    });
  }

  return {
    config: CONFIG, api: api, apiReady: apiReady, token: token, setToken: setToken,
    loading: loading, showLoading: showLoading, hideLoading: hideLoading,
    initFurigana: initFurigana, setMsg: setMsg, initPwToggles: initPwToggles
  };
})();
