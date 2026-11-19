/* R-EALIZE 管理画面（R-ANGUAGE の管理画面の「申込」「受講生」と同じ流れ）
 * - ダッシュボード：入金待ち・今月の売上・利用中の受講生・分野ごとの人数
 * - 申込：状態で絞り込み・探す。入金待ち／期限切れは「発行」、入金待ちは「キャンセル」
 * - 受講生：停止・再開、分野の追加
 * ※ 画面に出す値は、すべて textContent で入れる（HTML として扱わない）
 */
(function () {
  'use strict';

  var FIELDS = [
    { id: 'kaigo', label: '介護' },
    { id: 'building', label: 'ビルクリーニング' },
    { id: 'accommodation', label: '宿泊' },
    { id: 'manufacturing', label: '工業製品製造業' }
  ];
  var FIELD_NAMES = {};
  FIELDS.forEach(function (f) { FIELD_NAMES[f.id] = f.label; });
  var PLAN_NAMES = Object.assign({ all: '4分野まとめて' }, FIELD_NAMES);
  var STATUS_NAMES = { awaiting_payment: '入金待ち', paid: '入金確認済み', issued: '発行済み', expired: '期限切れ', cancelled: 'キャンセル' };
  var USER_STATUS = { active: '利用中', suspended: '停止中', pending: '入金待ち' };

  var state = { applications: [], users: [], status: 'awaiting_payment', appQuery: '', userQuery: '' };

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  }
  function yen(n) { return '¥' + Number(n || 0).toLocaleString('ja-JP'); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmt(v, withTime) {
    if (!v) return '—';
    var d = new Date(v);
    if (isNaN(d.getTime())) return '—';
    var s = d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate());
    return withTime ? s + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : s;
  }
  function isOverdue(a) { return a.status === 'awaiting_payment' && a.expiresAt && new Date(a.expiresAt).getTime() < Date.now(); }

  function notice(text, isError) {
    var n = $('notice');
    n.textContent = text || '';
    n.classList.toggle('is-error', !!isError);
    n.hidden = !text;
    if (text) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- ログイン ---------- */
  function showLogin(msg, isError) {
    $('appView').hidden = true;
    $('loginView').hidden = false;
    RZ.setMsg('loginMsg', msg || '', isError);
  }
  function showApp() {
    $('loginView').hidden = true;
    $('appView').hidden = false;
  }
  /** ログインが切れた・管理者でないとき */
  function handleAuth(res) {
    if (res && (res.reason === 'expired' || res.reason === 'replaced' || res.reason === 'suspended' || res.reason === 'forbidden')) {
      RZ.setToken('');
      showLogin(res.message, true);
      return true;
    }
    return false;
  }

  function initLogin() {
    var form = $('loginForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.elements.email.value.trim();
      var password = form.elements.password.value;
      if (!email || !password) return RZ.setMsg('loginMsg', 'メールアドレスとパスワードを入力してください。', true);
      if (!RZ.apiReady()) return RZ.setMsg('loginMsg', 'config.js の API_URL が入っていません。', true);
      RZ.loading('ログインしています', RZ.api({ action: 'login', email: email, password: password }))
        .then(function (res) {
          if (!res || !res.ok) return RZ.setMsg('loginMsg', (res && res.message) || 'ログインに失敗しました。', true);
          if (res.user.role !== 'admin') {
            RZ.api({ action: 'logout', token: res.token }).catch(function () {});
            return RZ.setMsg('loginMsg', '管理者のアカウントではありません。', true);
          }
          RZ.setToken(res.token);
          form.reset();
          showApp();
          loadAll();
        })
        .catch(function () { RZ.setMsg('loginMsg', '通信に失敗しました。時間をおいてもう一度お試しください。', true); });
    });
    $('logoutBtn').addEventListener('click', function () {
      var t = RZ.token();
      RZ.setToken('');
      showLogin('ログアウトしました。');
      if (t) RZ.api({ action: 'logout', token: t }).catch(function () {});
    });
  }

  /* ---------- 読み込み ---------- */
  function loadAll() {
    var token = RZ.token();
    return RZ.loading('読み込んでいます', Promise.all([
      RZ.api({ action: 'admin.list', token: token }),
      RZ.api({ action: 'admin.users', token: token })
    ])).then(function (r) {
      if (handleAuth(r[0]) || handleAuth(r[1])) return;
      if (!r[0].ok || !r[1].ok) return notice((r[0].message || r[1].message) || '読み込めませんでした。', true);
      state.applications = r[0].applications || [];
      state.users = r[1].users || [];
      renderAll();
    }).catch(function (err) {
      console.error(err);
      notice('通信に失敗しました。「最新にする」を押してください。', true);
    });
  }

  function renderAll() {
    renderDashboard();
    renderApplications();
    renderUsers();
    var waiting = state.applications.filter(function (a) { return a.status === 'awaiting_payment'; }).length;
    $('waitingBadge').textContent = waiting;
    $('waitingBadge').hidden = !waiting;
  }

  /* ---------- ダッシュボード ---------- */
  function renderDashboard() {
    var apps = state.applications;
    var waiting = apps.filter(function (a) { return a.status === 'awaiting_payment'; });
    $('kpiWaiting').textContent = waiting.length + '件';
    $('kpiWaitingSub').textContent = waiting.length ? '合計 ' + yen(waiting.reduce(function (s, a) { return s + Number(a.amount || 0); }, 0)) : '入金待ちはありません';

    var now = new Date();
    var key = function (v) { var d = new Date(v); return d.getFullYear() + '-' + d.getMonth(); };
    var thisKey = now.getFullYear() + '-' + now.getMonth();
    var prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    var prevKey = prev.getFullYear() + '-' + prev.getMonth();
    var issued = apps.filter(function (a) { return a.status === 'issued' && a.issuedAt; });
    var sum = function (list) { return list.reduce(function (s, a) { return s + Number(a.amount || 0); }, 0); };
    $('kpiSales').textContent = yen(sum(issued.filter(function (a) { return key(a.issuedAt) === thisKey; })));
    $('kpiSalesSub').textContent = '先月 ' + yen(sum(issued.filter(function (a) { return key(a.issuedAt) === prevKey; }))) + '・累計 ' + yen(sum(issued));

    var active = state.users.filter(function (u) { return u.status === 'active'; });
    $('kpiUsers').textContent = active.length + '人';
    $('kpiUsersSub').textContent = '停止中 ' + state.users.filter(function (u) { return u.status === 'suspended'; }).length + '人・入金待ち ' +
      state.users.filter(function (u) { return u.status === 'pending'; }).length + '人';

    var box = $('fieldBars');
    box.textContent = '';
    var counts = FIELDS.map(function (f) { return active.filter(function (u) { return (u.fields || []).indexOf(f.id) !== -1; }).length; });
    var max = Math.max.apply(null, [1].concat(counts));
    FIELDS.forEach(function (f, i) {
      var row = el('div', 'bar-row');
      var track = el('div', 'bar-track');
      var fill = el('div', 'bar-fill');
      fill.style.width = Math.round(counts[i] / max * 100) + '%';
      track.appendChild(fill);
      row.append(el('span', '', f.label), track, el('span', 'bar-num', counts[i] + '人'));
      box.appendChild(row);
    });
  }

  /* ---------- 申込 ---------- */
  function renderApplications() {
    var counts = { all: state.applications.length };
    state.applications.forEach(function (a) { counts[a.status] = (counts[a.status] || 0) + 1; });
    document.querySelectorAll('[data-count]').forEach(function (b) { b.textContent = counts[b.getAttribute('data-count')] || 0; });
    document.querySelectorAll('#statusChips .chip').forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-status') === state.status); });

    var q = state.appQuery.toLowerCase();
    var list = state.applications.filter(function (a) {
      if (state.status && a.status !== state.status) return false;
      if (!q) return true;
      return [a.applicationId, a.name, a.email].join(' ').toLowerCase().indexOf(q) !== -1;
    });

    var body = $('appRows');
    body.textContent = '';
    list.forEach(function (a) {
      var tr = el('tr');
      tr.appendChild(el('td', '', fmt(a.createdAt, true)));
      tr.appendChild(el('td', 'mono', a.applicationId));
      var who = el('td');
      who.append(el('span', '', a.name), el('span', 'cell-sub', a.email));
      tr.appendChild(who);
      tr.appendChild(el('td', '', a.planLabel || PLAN_NAMES[a.plan] || a.plan));
      tr.appendChild(el('td', '', yen(a.amount)));
      tr.appendChild(el('td', isOverdue(a) ? 'is-overdue' : '', fmt(a.expiresAt, true) + (isOverdue(a) ? '（過ぎています）' : '')));
      var st = el('td');
      st.appendChild(el('span', 'status st-' + a.status, STATUS_NAMES[a.status] || a.status));
      if (a.issuedAt) st.appendChild(el('span', 'cell-sub', '発行 ' + fmt(a.issuedAt, true)));
      if (a.note) st.appendChild(el('span', 'cell-note', a.note));
      tr.appendChild(st);
      var acts = el('td');
      var box = el('div', 'acts');
      if (a.status === 'awaiting_payment' || a.status === 'paid' || a.status === 'expired') {
        box.appendChild(button('発行', 'btn btn-red btn-xs', function () { issue(a); }));
      }
      if (a.status === 'awaiting_payment' || a.status === 'paid') {
        box.appendChild(button('キャンセル', 'btn btn-white btn-xs', function () { cancel(a); }));
      }
      acts.appendChild(box);
      tr.appendChild(acts);
      body.appendChild(tr);
    });
    $('appEmpty').hidden = list.length > 0;
  }

  function button(text, cls, onClick) {
    var b = el('button', cls, text);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }

  function detailList(pairs) {
    var dl = el('dl');
    pairs.forEach(function (p) { dl.append(el('dt', '', p[0]), el('dd', '', p[1])); });
    return dl;
  }

  function issue(a) {
    var lines = [el('p', '', '入金を確かめましたか？ 発行すると、受講生に発行メールが届きます。'),
      detailList([['申込番号', a.applicationId], ['お名前', a.name], ['分野', a.planLabel || PLAN_NAMES[a.plan]], ['金額', yen(a.amount)]])];
    if (a.status === 'expired') lines.push(el('p', 'is-overdue', 'この申込は支払期限を過ぎています。期限のあとに入金を確かめたときだけ発行してください。'));
    confirmBox('アカウントを発行する', lines, false, '発行する').then(function (ok) {
      if (!ok) return;
      run('アカウントを発行しています', { action: 'admin.issue', applicationId: a.applicationId }, function (res) {
        var msg = a.name + ' さんのアカウントを発行しました（' + (res.fields || []).map(function (f) { return FIELD_NAMES[f] || f; }).join('・') + '）。';
        if (res.others && res.others.length) msg += ' ※ 同じアカウントに、ほかの入金待ちの申込があります：' + res.others.join('、');
        return msg;
      });
    });
  }

  function cancel(a) {
    confirmBox('申込をキャンセルする', [
      el('p', '', 'この申込をキャンセルします。受講生にメールは送られません。'),
      detailList([['申込番号', a.applicationId], ['お名前', a.name], ['分野', a.planLabel || PLAN_NAMES[a.plan]]])
    ], true, 'キャンセルする').then(function (note) {
      if (note === false) return;
      run('キャンセルしています', { action: 'admin.cancel', applicationId: a.applicationId, note: note }, function () {
        return a.applicationId + ' をキャンセルしました。';
      });
    });
  }

  /* ---------- 受講生 ---------- */
  function renderUsers() {
    var q = state.userQuery.toLowerCase();
    var list = state.users.filter(function (u) {
      if (!q) return true;
      return [u.name, u.email].join(' ').toLowerCase().indexOf(q) !== -1;
    }).sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

    var body = $('userRows');
    body.textContent = '';
    list.forEach(function (u) {
      var tr = el('tr');
      var who = el('td');
      who.append(el('span', '', u.name), el('span', 'cell-sub', u.email));
      tr.appendChild(who);
      var st = el('td');
      st.appendChild(el('span', 'status st-' + u.status, USER_STATUS[u.status] || u.status));
      tr.appendChild(st);
      var fs = el('td');
      var tags = el('div', 'field-tags');
      (u.fields || []).forEach(function (f) { tags.appendChild(el('span', 'field-tag', FIELD_NAMES[f] || f)); });
      if (!(u.fields || []).length) tags.appendChild(el('span', 'cell-sub', '—'));
      fs.appendChild(tags);
      tr.appendChild(fs);
      tr.appendChild(el('td', '', fmt(u.activatedAt)));
      tr.appendChild(el('td', '', fmt(u.lastLoginAt, true)));

      var acts = el('td');
      if (u.status === 'active' || u.status === 'suspended') {
        var box = el('div', 'acts');
        box.appendChild(u.status === 'active'
          ? button('停止', 'btn btn-white btn-xs', function () { setStatus(u, 'suspended'); })
          : button('再開', 'btn btn-ok btn-xs', function () { setStatus(u, 'active'); }));
        acts.appendChild(box);

        var missing = FIELDS.filter(function (f) { return (u.fields || []).indexOf(f.id) === -1; });
        if (missing.length) {
          var add = el('div', 'add-field');
          var sel = el('select');
          sel.setAttribute('aria-label', u.name + ' さんに追加する分野');
          missing.forEach(function (f) { var o = el('option', '', f.label); o.value = f.id; sel.appendChild(o); });
          if (missing.length > 1) { var o = el('option', '', '残りぜんぶ'); o.value = 'all'; sel.appendChild(o); }
          add.append(sel, button('分野を追加', 'btn btn-white btn-xs', function () { addField(u, sel.value); }));
          acts.appendChild(add);
        }
      } else {
        acts.appendChild(el('span', 'cell-sub', '申込の「発行」で有効になります'));
      }
      tr.appendChild(acts);
      body.appendChild(tr);
    });
    $('userEmpty').hidden = list.length > 0;
  }

  function setStatus(u, status) {
    var stop = status === 'suspended';
    confirmBox(stop ? 'アカウントを停止する' : 'アカウントを再開する', [
      el('p', '', stop ? '停止すると、この受講生はログインできなくなります（ログイン中の端末も、次の操作でログアウトします）。' : 'この受講生が、またログインできるようになります。'),
      detailList([['お名前', u.name], ['メール', u.email]])
    ], false, stop ? '停止する' : '再開する').then(function (ok) {
      if (!ok) return;
      run(stop ? '停止しています' : '再開しています', { action: 'admin.userStatus', userId: u.userId, status: status }, function () {
        return u.name + ' さんのアカウントを' + (stop ? '停止' : '再開') + 'しました。';
      });
    });
  }

  function addField(u, field) {
    confirmBox('分野を追加する', [
      el('p', '', '受講生に、分野を追加します（メールは送られません）。'),
      detailList([['お名前', u.name], ['追加する分野', field === 'all' ? '残りの分野すべて' : FIELD_NAMES[field]]])
    ], false, '追加する').then(function (ok) {
      if (!ok) return;
      run('分野を追加しています', { action: 'admin.addField', userId: u.userId, field: field }, function (res) {
        return u.name + ' さんに追加しました（' + (res.added || []).map(function (f) { return FIELD_NAMES[f] || f; }).join('・') + '）。';
      });
    });
  }

  /* ---------- 共通：実行して読み直す ---------- */
  function run(label, data, okMessage) {
    data.token = RZ.token();
    RZ.loading(label, RZ.api(data)).then(function (res) {
      if (handleAuth(res)) return;
      if (!res || !res.ok) return notice((res && res.message) || 'できませんでした。', true);
      var msg = okMessage(res);
      return loadAll().then(function () { notice(msg); });
    }).catch(function (err) {
      console.error(err);
      notice('通信に失敗しました。「最新にする」を押して、結果を確かめてください。', true);
    });
  }

  /* ---------- 確認のダイアログ（withNote のときは、メモの文字を返す。やめたら false） ---------- */
  function confirmBox(title, nodes, withNote, yesText) {
    return new Promise(function (resolve) {
      var m = $('confirmModal');
      $('confirmTitle').textContent = title;
      var body = $('confirmBody');
      body.textContent = '';
      nodes.forEach(function (n) { body.appendChild(n); });
      $('confirmNoteWrap').hidden = !withNote;
      $('confirmNote').value = '';
      $('confirmYes').textContent = yesText || '実行する';
      m.hidden = false;
      $('confirmNo').focus();
      function done(v) {
        m.hidden = true;
        $('confirmYes').onclick = null;
        $('confirmNo').onclick = null;
        document.removeEventListener('keydown', onKey);
        resolve(v);
      }
      function onKey(e) { if (e.key === 'Escape') done(false); }
      document.addEventListener('keydown', onKey);
      $('confirmYes').onclick = function () { done(withNote ? $('confirmNote').value.trim() : true); };
      $('confirmNo').onclick = function () { done(false); };
    });
  }

  /* ---------- タブ・絞り込み ---------- */
  function initNav() {
    document.querySelectorAll('.tab').forEach(function (t) {
      t.addEventListener('click', function () {
        var name = t.getAttribute('data-view');
        document.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('is-active', x === t); });
        document.querySelectorAll('.view').forEach(function (v) { v.hidden = v.getAttribute('data-view') !== name; });
        notice('');
      });
    });
    document.querySelectorAll('#statusChips .chip').forEach(function (c) {
      c.addEventListener('click', function () { state.status = c.getAttribute('data-status'); renderApplications(); });
    });
    $('appSearch').addEventListener('input', function () { state.appQuery = this.value.trim(); renderApplications(); });
    $('userSearch').addEventListener('input', function () { state.userQuery = this.value.trim(); renderUsers(); });
    $('reloadBtn').addEventListener('click', function () { notice(''); loadAll(); });
  }

  /* ---------- 開いたとき ---------- */
  function start() {
    var token = RZ.token();
    if (!token || !RZ.apiReady()) { showLogin(RZ.apiReady() ? '' : 'config.js の API_URL が入っていません。', !RZ.apiReady()); return; }
    RZ.loading('ログインの状態を確かめています', RZ.api({ action: 'me', token: token })).then(function (res) {
      if (res && res.ok && res.user.role === 'admin') { showApp(); loadAll(); return; }
      if (res && res.ok) { showLogin('管理者のアカウントでログインしてください。', true); return; }
      RZ.setToken('');
      showLogin(res && res.reason === 'replaced' ? res.message : '', true);
    }).catch(function () { showLogin('通信に失敗しました。読み込み直してください。', true); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLogin();
    initNav();
    start();
  });
})();
