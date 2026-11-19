/* R-EALIZE 学習の画面（サンプル）
 * GAS にはつながない。下の SAMPLE のデータだけで動く、デザイン確認用の画面
 * 文字の {漢字|よみ} は、ふりがな（ruby）にして出す
 */
(function () {
  'use strict';

  /* ---------- サンプルのデータ ---------- */
  var USER = { name: 'Nguyen', streak: 5, fields: ['kaigo', 'accommodation'] };

  var FIELDS = [
    { id: 'kaigo', name: '{介護|かいご}', icon: 'fa-hand-holding-heart', done: 38, total: 500, stage: 'EASY',
      subjects: [
        { id: 'gakka', name: '{学科|がっか}', exam: 40, cats: [['{介護|かいご}の{基本|きほん}', 10], ['こころとからだのしくみ', 6], ['コミュニケーション{技術|ぎじゅつ}', 4], ['{生活支援技術|せいかつしえんぎじゅつ}', 20]] },
        { id: 'jitsugi', name: '{実技|じつぎ}', exam: 5, cats: [['{生活支援技術|せいかつしえんぎじゅつ}（{写真|しゃしん}・イラストで{判断|はんだん}）', 5]] },
        { id: 'nihongo', name: '{日本語|にほんご}', exam: 15, cats: [['{介護|かいご}のことば', 5], ['{介護|かいご}の{会話|かいわ}・{声|こえ}かけ', 5], ['{介護|かいご}の{文書|ぶんしょ}', 5]] }
      ] },
    { id: 'building', name: 'ビルクリーニング', icon: 'fa-broom', done: 0, total: 500, stage: 'EASY', subjects: [] },
    { id: 'accommodation', name: '{宿泊|しゅくはく}', icon: 'fa-hotel', done: 12, total: 500, stage: 'EASY',
      subjects: [
        { id: 'gakka', name: '{学科|がっか}', exam: 30, cats: [['フロント', null], ['{企画|きかく}・{広報|こうほう}', null], ['{接客|せっきゃく}', null], ['レストランサービス', null], ['{安全衛生|あんぜんえいせい}・その{他|た}', null]] },
        { id: 'jitsugi', name: '{実技|じつぎ}', exam: 6, cats: [['{判断|はんだん}（イラストで{選|えら}ぶ）', null], ['{計画立案|けいかくりつあん}', null]] }
      ] },
    { id: 'manufacturing', name: '{工業製品製造業|こうぎょうせいひんせいぞうぎょう}', icon: 'fa-industry', done: 0, total: 500, stage: 'EASY', subjects: [] }
  ];

  // 形式の見本になる問題（介護をえらぶと、この5問を出す）
  var QUESTIONS = [
    { subj: '{学科|がっか}', cat: '{介護|かいご}の{基本|きほん}', form: '4択',
      q: '{利用者|りようしゃ}の{気持|きも}ちを{大切|たいせつ}にする{対応|たいおう}として、{最|もっと}も{適切|てきせつ}なものはどれですか。',
      c: ['{時間|じかん}がないので、{何|なに}も{言|い}わずに{介助|かいじょ}を{始|はじ}める', '{本人|ほんにん}ができることも、すべて{介護職|かいごしょく}がする', '{本人|ほんにん}の{希望|きぼう}を{聞|き}いてから{介助|かいじょ}する', '{家族|かぞく}の{希望|きぼう}だけで{決|き}める'],
      a: 2, exp: '{介護|かいご}では、{本人|ほんにん}が{自分|じぶん}で{決|き}めること（{自己決定|じこけってい}）を{大切|たいせつ}にします。' },
    { subj: '{学科|がっか}', cat: '{生活支援技術|せいかつしえんぎじゅつ}', form: '○×',
      q: '{服|ふく}を{着|き}るときは、{麻痺|まひ}がないほうの{腕|うで}から{袖|そで}を{通|とお}す。',
      a: 1, exp: '「{脱健着患|だっけんちゃっかん}」です。{着|き}るときは{麻痺|まひ}があるほう（{患側|かんそく}）から{通|とお}します。だから「×」です。' },
    { subj: '{実技|じつぎ}', cat: '{生活支援技術|せいかつしえんぎじゅつ}', form: '4択', img: '（ここに{写真|しゃしん}・イラストが{出|で}ます）\nkaigo_0001.png',
      q: '{写真|しゃしん}のように、{右|みぎ}の{片麻痺|かたまひ}がある{人|ひと}が{杖|つえ}で{歩|ある}きます。{介護者|かいごしゃ}が{立|た}つ{位置|いち}として、{適切|てきせつ}なものはどれですか。',
      c: ['{右|みぎ}の{前|まえ}', '{右|みぎ}の{後|うし}ろ', '{左|ひだり}の{前|まえ}', '{左|ひだり}の{後|うし}ろ'],
      a: 1, exp: '{麻痺|まひ}があるほう（{右|みぎ}）は{転|ころ}びやすいので、{右|みぎ}の{後|うし}ろに{立|た}って{支|ささ}えます。' },
    { subj: '{実技|じつぎ}', cat: '{生活支援技術|せいかつしえんぎじゅつ}', form: '並べ替え',
      q: 'ベッドから{車|くるま}いすに{移|うつ}るときの{手順|てじゅん}を、{正|ただ}しい{順番|じゅんばん}に{並|なら}べてください。',
      c: ['{利用者|りようしゃ}に{声|こえ}をかける', '{車|くるま}いすのブレーキをかける', 'ベッドに{浅|あさ}く{座|すわ}ってもらう', '{立|た}ち{上|あ}がって{体|からだ}の{向|む}きを{変|か}える'],
      exp: '{最初|さいしょ}に{声|こえ}をかけて、ブレーキをかけてから、{浅|あさ}く{座|すわ}ってもらい、{立|た}ち{上|あ}がって{向|む}きを{変|か}えます。' },
    { subj: '{日本語|にほんご}', cat: '{介護|かいご}のことば', form: '4択',
      q: '「{起床|きしょう}」と{同|おな}じ{意味|いみ}の{言葉|ことば}はどれですか。',
      c: ['{寝|ね}ること', '{起|お}きること', '{着替|きが}えること', '{食|た}べること'],
      a: 1, exp: '「{起床|きしょう}」は、{朝|あさ}などに{起|お}きることです。{寝|ね}ることは「{就寝|しゅうしん}」といいます。' }
  ];

  /* ---------- 共通 ---------- */
  var view = document.getElementById('view');
  function rb(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; })
      .replace(/\{([^|{}]+)\|([^{}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>').replace(/\n/g, '<br>');
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function setTab(name) {
    document.querySelectorAll('#tabbar button').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-go') === name); });
  }
  function quizMode(on) {
    document.getElementById('appHeader').hidden = on;
    document.getElementById('quizTop').hidden = !on;
    document.getElementById('tabbar').hidden = on;
    document.body.style.paddingBottom = on ? '0' : '';
  }
  var LABELS = ['1', '2', '3', '4', '5'];

  /* ---------- ① ホーム ---------- */
  function home() {
    quizMode(false); setTab('home');
    var html = '<div class="hello"><div><p class="hello-name">こんにちは、' + rb(USER.name) + 'さん</p>' +
      '<p class="hello-msg">' + rb('{今日|きょう}も{少|すこ}しずつ、がんばろう！') + '</p></div>' +
      '<div class="hello-streak"><b>' + USER.streak + '</b><span>' + rb('{日|にち}{連続|れんぞく}') + '</span></div></div>' +
      '<h1 class="app-title"><span class="en">MY FIELDS</span>' + rb('{分野|ぶんや}を{選|えら}ぶ') + '</h1>' +
      '<div class="field-list">';
    FIELDS.forEach(function (f) {
      var own = USER.fields.indexOf(f.id) !== -1;
      var pct = Math.round(f.done / f.total * 100);
      html += '<button type="button" class="fcard' + (own ? '' : ' is-locked') + '" data-field="' + f.id + '"' + (own ? '' : ' disabled') + '>' +
        '<span class="fcard-icon"><i class="fa-solid ' + f.icon + '" aria-hidden="true"></i></span>' +
        '<span class="fcard-body"><span class="fcard-name">' + rb(f.name) + '</span>' +
        (own ? '<span class="fcard-meta">' + rb('{解|と}いた{問題|もんだい} ') + f.done + ' / ' + f.total + '</span><span class="fcard-bar"><span style="width:' + pct + '%"></span></span>'
             : '<span class="fcard-meta">' + rb('{申|もう}し{込|こ}むと{使|つか}えます') + '</span>') +
        '</span>' +
        (own ? '<span class="fcard-stage en">' + f.stage + '</span>' : '<span class="fcard-lock">' + rb('{未購入|みこうにゅう}') + '</span>') +
        '</button>';
    });
    html += '</div>';
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }

  /* ---------- 分野の画面（STAGE・科目・カテゴリ） ---------- */
  var count = 10;
  function field(id) {
    quizMode(false); setTab('home');
    var f = FIELDS.filter(function (x) { return x.id === id; })[0];
    var html = '<p><a href="#" data-go="home" class="auth-links" style="display:inline;color:#fff">← ホーム</a></p>' +
      '<h1 class="app-title"><span class="en">FIELD</span>' + rb(f.name) + '</h1>' +
      '<div class="stage-tabs">' +
        '<button type="button" class="stage-tab is-active">EASY<small>' + rb('{基礎|きそ}') + '</small></button>' +
        '<button type="button" class="stage-tab" disabled><i class="fa-solid fa-lock" aria-hidden="true"></i> NORMAL<small>' + rb('{本番|ほんばん}レベル') + '</small></button>' +
        '<button type="button" class="stage-tab" disabled><i class="fa-solid fa-lock" aria-hidden="true"></i> HARD<small>' + rb('{応用|おうよう}') + '</small></button>' +
      '</div>' +
      '<p class="lock-note">' + rb('NORMAL・HARD は、ひとつ{前|まえ}の STAGE の{模試|もし}に{合格|ごうかく}すると{解|と}けるようになります。') + '</p>' +
      '<div class="count-row"><span>' + rb('1{回|かい}に{出|だ}す{数|かず}') + '</span>' +
        [5, 10, 20].map(function (n) { return '<button type="button" class="count-btn' + (n === count ? ' is-active' : '') + '" data-count="' + n + '">' + n + '</button>'; }).join('') +
      '</div>';
    f.subjects.forEach(function (s) {
      html += '<section class="subj"><div class="subj-head"><span class="subj-name">' + rb(s.name) + '</span>' +
        '<span class="subj-count">' + rb('{本番|ほんばん}は') + ' ' + s.exam + rb('{問|もん}') + '</span></div><div class="cat-list">';
      s.cats.forEach(function (c) {
        html += '<button type="button" class="cat" data-start="' + f.id + '"><span class="cat-name">' + rb(c[0]) + '</span>' +
          '<span class="cat-num">' + (c[1] ? rb('{本番|ほんばん}') + ' ' + c[1] + rb('{問|もん}') : '') + '</span><span class="cat-go">›</span></button>';
      });
      html += '</div><button type="button" class="btn btn-red btn-clip subj-all" data-start="' + f.id + '"><span>' + rb(s.name + 'の{問題|もんだい}をぜんぶから{出|だ}す') + '</span></button></section>';
    });
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }

  /* ---------- 問題を解く ---------- */
  var quiz = null;
  function start() {
    quiz = { list: QUESTIONS.slice(), i: 0, results: [] };
    question();
  }
  function question() {
    quizMode(true);
    var q = quiz.list[quiz.i];
    var n = quiz.list.length;
    document.getElementById('quizWhere').innerHTML = rb('{介護|かいご}・EASY') + '<br>' + rb(q.subj + '・' + q.cat);
    document.getElementById('quizNum').textContent = (quiz.i + 1) + ' / ' + n;
    document.getElementById('quizBar').style.width = (quiz.i / n * 100) + '%';

    var html = '<div class="q-card"><div class="q-tags"><span class="q-tag is-red">' + rb(q.subj) + '</span><span class="q-tag">' + rb(q.form === '並べ替え' ? '{並|なら}べ{替|か}え' : q.form) + '</span></div>' +
      '<p class="q-text">' + rb(q.q) + '</p>' + (q.img ? '<div class="q-img"><span>' + rb(q.img) + '</span></div>' : '') + '</div>';

    if (q.form === '○×') {
      html += '<div class="tf"><button type="button" class="tf-btn is-o" data-tf="0" aria-label="○">○</button><button type="button" class="tf-btn is-x" data-tf="1" aria-label="×">×</button></div>';
    } else if (q.form === '並べ替え') {
      q.order = shuffle(q.c.map(function (_, k) { return k; }));
      quiz.picked = [];
      html += '<p class="q-hint">' + rb('{正|ただ}しい{順番|じゅんばん}に、{下|した}の{選択肢|せんたくし}を{押|お}してください。') + '</p>' +
        '<div class="order-picked" id="picked">' + rb('ここに{選|えら}んだ{順番|じゅんばん}が{出|で}ます') + '</div><div class="choices">';
      q.order.forEach(function (orig, k) {
        html += '<button type="button" class="order-opt" data-ord="' + orig + '"><span class="choice-no en">' + LABELS[k] + '</span><span class="choice-txt">' + rb(q.c[orig]) + '</span></button>';
      });
      html += '</div><div class="order-btns"><button type="button" class="btn btn-gray" id="ordReset"><span>やり{直|なお}す</span></button>' +
        '<button type="button" class="btn btn-red btn-clip" id="ordDone" disabled><span>' + rb('{答|こた}える') + '</span></button></div>';
    } else {
      q.order = shuffle(q.c.map(function (_, k) { return k; }));
      html += '<div class="choices">';
      q.order.forEach(function (orig, k) {
        html += '<button type="button" class="choice-btn" data-ch="' + orig + '"><span class="choice-no en">' + LABELS[k] + '</span><span class="choice-txt">' + rb(q.c[orig]) + '</span></button>';
      });
      html += '</div>';
    }
    html += '<div id="expBox"></div>';
    view.innerHTML = html.replace('やり{直|なお}す', rb('やり{直|なお}す'));
    window.scrollTo(0, 0);
  }
  function judge(ok) {
    var q = quiz.list[quiz.i];
    quiz.results.push(ok);
    var last = quiz.i === quiz.list.length - 1;
    document.getElementById('expBox').innerHTML =
      '<div class="exp"><div class="exp-head"><span class="exp-badge en' + (ok ? '' : ' is-miss') + '">' + (ok ? 'CORRECT!' : 'MISS') + '</span>' +
      '<h3>' + rb('やさしい{解説|かいせつ}') + '</h3></div><p>' + rb(q.exp) + '</p></div>' +
      '<button type="button" class="btn btn-black btn-block q-next" id="qNext"><span>' + rb(last ? '{結果|けっか}を{見|み}る →' : '{次|つぎ}の{問題|もんだい}へ →') + '</span></button>';
    document.getElementById('expBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- 結果 ---------- */
  function result() {
    quizMode(false); setTab('home');
    var n = quiz.results.length;
    var ok = quiz.results.filter(Boolean).length;
    var html = '<h1 class="app-title"><span class="en">RESULT</span>' + rb('{結果|けっか}') + '</h1>' +
      '<div class="result-card"><div class="result-score en">' + ok + '<small> / ' + n + '</small></div>' +
      '<p class="result-rate">' + rb('{正答率|せいとうりつ} ') + Math.round(ok / n * 100) + '%</p>' +
      '<p class="result-msg">' + rb(ok === n ? 'ぜんぶ{正解|せいかい}です！' : 'まちがえた{問題|もんだい}は、「{復習|ふくしゅう}」で{解|と}き{直|なお}せます。') + '</p></div>' +
      '<div class="result-list">';
    quiz.list.forEach(function (q, k) {
      html += '<div class="result-row"><span class="result-mark' + (quiz.results[k] ? '' : ' is-miss') + '">' + (quiz.results[k] ? '○' : '×') + '</span><span>' + rb(q.q) + '</span></div>';
    });
    html += '</div><div class="result-btns">' +
      '<button type="button" class="btn btn-red btn-clip btn-block" data-start="kaigo"><span>' + rb('もう{一度|いちど}（{別|べつ}の{問題|もんだい}）') + '</span></button>' +
      '<button type="button" class="btn btn-white btn-block" data-retry="1"><span>' + rb('まちがえた{問題|もんだい}だけ{解|と}き{直|なお}す') + '</span></button>' +
      '<button type="button" class="btn btn-gray btn-block" data-field="kaigo"><span>' + rb('{分野|ぶんや}の{画面|がめん}にもどる') + '</span></button></div>';
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }

  /* ---------- 操作 ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var go = t.closest('[data-go]');
    if (go) {
      e.preventDefault();
      var name = go.getAttribute('data-go');
      if (name === 'home') return home();
      if (name === 'mypage') return alert('マイページ（パスワードの変更・分野の追加など）は、あとで作ります。');
      return alert('この機能は、② 〜 ④ で作ります。');
    }
    var f = t.closest('[data-field]');
    if (f && !f.disabled) return field(f.getAttribute('data-field'));
    var cnt = t.closest('[data-count]');
    if (cnt) { count = Number(cnt.getAttribute('data-count')); document.querySelectorAll('.count-btn').forEach(function (b) { b.classList.toggle('is-active', b === cnt); }); return; }
    if (t.closest('[data-start]')) return start();
    if (t.closest('[data-retry]')) {
      var miss = quiz.list.filter(function (_, k) { return !quiz.results[k]; });
      if (!miss.length) return alert('まちがえた問題はありません。');
      quiz = { list: miss, i: 0, results: [] };
      return question();
    }
    if (!quiz) return;
    var q = quiz.list[quiz.i];
    var ch = t.closest('[data-ch]');
    if (ch && !ch.disabled) {
      var picked = Number(ch.getAttribute('data-ch'));
      document.querySelectorAll('.choice-btn').forEach(function (b) {
        var v = Number(b.getAttribute('data-ch'));
        b.disabled = true;
        if (v === q.a) b.classList.add('is-correct'); else if (v === picked) b.classList.add('is-wrong');
      });
      return judge(picked === q.a);
    }
    var tf = t.closest('[data-tf]');
    if (tf && !tf.disabled) {
      var v = Number(tf.getAttribute('data-tf'));
      document.querySelectorAll('.tf-btn').forEach(function (b) {
        var w = Number(b.getAttribute('data-tf'));
        b.disabled = true;
        if (w === q.a) b.classList.add('is-correct'); else if (w === v) b.classList.add('is-wrong');
      });
      return judge(v === q.a);
    }
    var ord = t.closest('[data-ord]');
    if (ord && !ord.classList.contains('is-picked') && !ord.disabled) {
      quiz.picked.push(Number(ord.getAttribute('data-ord')));
      ord.classList.add('is-picked');
      ord.querySelector('.choice-no').textContent = quiz.picked.length;
      document.getElementById('picked').innerHTML = quiz.picked.map(function (o, k) { return '<span class="order-chip"><b>' + (k + 1) + '</b>' + rb(q.c[o]) + '</span>'; }).join('');
      document.getElementById('ordDone').disabled = quiz.picked.length !== q.c.length;
      return;
    }
    if (t.closest('#ordReset')) return question();
    if (t.closest('#ordDone')) {
      var good = quiz.picked.every(function (o, k) { return o === k; });
      document.querySelectorAll('.order-opt').forEach(function (b) { b.disabled = true; });
      document.querySelector('.order-btns').hidden = true;
      if (!good) {
        document.getElementById('picked').insertAdjacentHTML('afterend', '<p class="order-answer">' + rb('{正|ただ}しい{順番|じゅんばん}：') + q.c.map(function (c, k) { return (k + 1) + '. ' + rb(c); }).join('　') + '</p>');
      }
      return judge(good);
    }
    if (t.closest('#qNext')) {
      quiz.i++;
      return quiz.i < quiz.list.length ? question() : result();
    }
    if (t.closest('#quizQuit')) { if (confirm('問題をやめて、分野の画面にもどりますか？')) field('kaigo'); }
  });

  document.addEventListener('DOMContentLoaded', function () {
    RZ.initFurigana();
    home();
  });
})();
