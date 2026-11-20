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

  /* ---------- ① ホーム（ダッシュボード） ---------- */
  // 分野ごとの見本の数字（本物は、答えの記録から計算する）
  var DASH = {
    kaigo: { streak: 15, rate: 78, solved: 132, mock: 82, pass: 60, review: 12, stageNow: 1, stageRate: 72,
      week: [8, 12, 0, 10, 15, 6, 5],
      cats: [['{介護|かいご}の{基本|きほん}', 85], ['こころとからだのしくみ', 76], ['コミュニケーション{技術|ぎじゅつ}', 81], ['{生活支援技術|せいかつしえんぎじゅつ}', 72], ['{日本語|にほんご}', 64]],
      hist: [['mock', 'NORMAL {模擬試験|もぎしけん}', '{昨日|きのう} 21:15', '82{点|てん}'], ['drill', '{学科|がっか}・{生活支援技術|せいかつしえんぎじゅつ}（10{問|もん}）', '2{日前|にちまえ} 18:40', '8/10']] },
    accommodation: { streak: 15, rate: 70, solved: 48, mock: null, pass: 65, review: 5, stageNow: 0, stageRate: 30,
      week: [0, 5, 0, 0, 10, 0, 5],
      cats: [['フロント', 80], ['{企画|きかく}・{広報|こうほう}', 66], ['{接客|せっきゃく}', 75], ['レストランサービス', 58], ['{安全衛生|あんぜんえいせい}・その{他|た}', 70]],
      hist: [['drill', '{学科|がっか}・フロント（10{問|もん}）', '3{日前|にちまえ} 20:05', '8/10']] }
  };
  var current = 'kaigo';
  var DAYS = ['{木|もく}', '{金|きん}', '{土|ど}', '{日|にち}', '{月|げつ}', '{火|か}', '{今日|きょう}'];
  var STG = [['EASY', '{基礎|きそ}', '{現場|げんば}の{言葉|ことば}と{基本|きほん}のルール'], ['NORMAL', '{本番|ほんばん}レベル', '{本番|ほんばん}と{同|おな}じ{形式|けいしき}で{練習|れんしゅう}'], ['HARD', '{応用|おうよう}', '{応用|おうよう}{問題|もんだい}で{仕上|しあ}げ']];

  function fieldOf(id) { return FIELDS.filter(function (x) { return x.id === id; })[0]; }
  function home() {
    quizMode(false); setTab('home');
    view.classList.add('is-wide');
    var f = fieldOf(current);
    var d = DASH[current];
    var own = FIELDS.filter(function (x) { return USER.fields.indexOf(x.id) !== -1; });
    var weakest = d.cats.slice().sort(function (a, b) { return a[1] - b[1]; })[0];
    var h = '<div class="dash">';

    // あいさつ・分野・続きから
    h += '<section class="welcome"><div class="welcome-star" aria-hidden="true">★</div><div class="welcome-in"><div>' +
      '<span class="welcome-tag"><i class="fa-solid fa-bolt" aria-hidden="true"></i><span>' + rb('{特定技能|とくていぎのう}1{号|ごう} {合格|ごうかく}プログラム') + '</span></span>' +
      '<h1>おかえりなさい、<span>' + rb(USER.name) + 'さん</span>！</h1>' +
      '<p class="welcome-lead">' + rb('{今日|きょう}も{少|すこ}しずつ、{合格|ごうかく}に{近|ちか}づこう！ {試験日|しけんび}まであと') + '<b>24</b>' + rb('{日|にち}') + '</p></div>' +
      '<div class="field-switch"><label for="fieldSelect">' + rb('{学習中|がくしゅうちゅう}の{分野|ぶんや}') + '</label>' +
      '<select id="fieldSelect">' + own.map(function (x) { return '<option value="' + x.id + '"' + (x.id === current ? ' selected' : '') + '>' + x.name.replace(/\{([^|]+)\|[^}]+\}/g, '$1') + '</option>'; }).join('') + '</select>' +
      '<div class="field-switch-row"><span>' + rb('{利用期限|りようきげん}') + '</span><b>' + rb('なし（{買|か}い{切|き}り）') + '</b></div>' +
      '<div class="field-switch-row"><span>' + rb('ほかの{分野|ぶんや}') + '</span><a href="#" data-go="mypage">' + rb('{追加|ついか}する') + '</a></div></div>' +
      '<div class="resume"><div class="resume-l"><span class="resume-badge">RESUME</span><div>' +
      '<p class="resume-small">' + rb('{前回|ぜんかい}の{続|つづ}き') + '</p>' +
      '<p class="resume-text"><span>【' + rb(f.name) + '】</span>' + rb('まちがい{復習|ふくしゅう}（{残|のこ}り ') + d.review + rb('{問|もん}）') + '</p></div></div>' +
      '<button type="button" class="btn btn-red btn-clip" data-action="review"><i class="fa-solid fa-play" aria-hidden="true"></i><span>' + rb('{今|いま}すぐ{続|つづ}きから{解|と}く') + '</span></button></div>' +
      '</div></section>';

    // 数字のカード
    h += '<section class="kpis">' +
      '<div class="kpi"><div class="kpi-top"><span class="kpi-tag">STREAK</span><i class="fa-solid fa-fire" aria-hidden="true"></i></div>' +
        '<p class="kpi-label">' + rb('{連続|れんぞく}{学習|がくしゅう}{日数|にっすう}') + '</p><p class="kpi-num">' + d.streak + '<small>' + rb('{日|にち}') + '</small></p>' +
        '<p class="kpi-note">' + rb('{毎日|まいにち}1{問|もん}でも{解|と}くと{続|つづ}きます') + '</p></div>' +
      '<div class="kpi"><div class="kpi-top"><span class="kpi-tag is-red">ACCURACY</span><i class="fa-solid fa-bullseye" aria-hidden="true"></i></div>' +
        '<p class="kpi-label">' + rb('{正答率|せいとうりつ}（この{分野|ぶんや}）') + '</p><p class="kpi-num">' + d.rate + '<small>%</small></p>' +
        '<div class="kpi-bar"><span style="width:' + d.rate + '%"></span></div></div>' +
      '<div class="kpi"><div class="kpi-top"><span class="kpi-tag">SOLVED</span><i class="fa-solid fa-list-check" aria-hidden="true"></i></div>' +
        '<p class="kpi-label">' + rb('{解|と}いた{問題|もんだい}') + '</p><p class="kpi-num">' + d.solved + '<small>/ 500' + rb('{問|もん}') + '</small></p>' +
        '<div class="kpi-bar"><span style="width:' + Math.round(d.solved / 5) + '%"></span></div></div>' +
      '<div class="kpi is-mock"><div class="kpi-top"><span class="kpi-tag">MOCK EXAM</span><i class="fa-solid fa-trophy" aria-hidden="true"></i></div>' +
        '<p class="kpi-label">' + rb('{最新|さいしん}の{模擬試験|もぎしけん}') + '</p>' +
        (d.mock === null ? '<p class="kpi-num">—</p><span class="kpi-pill">' + rb('まだ{受|う}けていません') + '</span>'
          : '<p class="kpi-num">' + d.mock + '<small>/ 100' + rb('{点|てん}') + '</small></p><span class="kpi-pill">' + rb(d.mock >= d.pass ? '{合格|ごうかく}ライン{以上|いじょう}' : 'もう{少|すこ}し！') + '</span>') +
      '</div></section>';

    // 今日やること
    h += '<section><span class="dash-sec-en">QUICK ACTIONS</span><h2 class="dash-sec-title">' + rb('{今日|きょう}やることを') + '<span class="t-yellow">' + rb('{選|えら}ぼう') + '</span></h2><div class="actions">' +
      '<button type="button" class="action" data-action="drill"><div class="action-top"><span class="action-tag">DRILL</span><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></div>' +
        '<h3>' + rb('{問題|もんだい}を{解|と}く') + '</h3><p>' + rb('{科目|かもく}・カテゴリを{選|えら}んで{練習|れんしゅう}する') + '</p></button>' +
      '<button type="button" class="action" data-action="review"><div class="action-top"><span class="action-tag is-black">REVIEW</span><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></div>' +
        '<h3>' + rb('まちがい{復習|ふくしゅう}') + '</h3><p>' + rb('まちがえた{問題|もんだい}だけを{解|と}き{直|なお}す（' + d.review + '{問|もん}）') + '</p></button>' +
      '<button type="button" class="action is-mock" data-action="mock"><div class="action-top"><span class="action-tag is-black">MOCK</span><i class="fa-solid fa-stopwatch" aria-hidden="true"></i></div>' +
        '<h3>' + rb('{模擬試験|もぎしけん}に{挑戦|ちょうせん}') + '</h3><p>' + rb('{本番|ほんばん}と{同|おな}じ{問題数|もんだいすう}・{制限時間|せいげんじかん}で{力|ちから}を{確|たし}かめる') + '</p></button>' +
      '</div></section>';

    // STAGE と 学習の記録
    h += '<section class="dash-2col"><div class="panel-w"><div class="panel-head"><div><span class="dash-sec-en">STAGE PROGRESS</span><h2 class="dash-sec-title">' + rb('{合格|ごうかく}までの STAGE') + '</h2></div>' +
      '<span class="panel-chip">STAGE 0' + (d.stageNow + 1) + '</span></div>';
    STG.forEach(function (s, k) {
      if (k < d.stageNow) {
        h += '<div class="stg"><div class="stg-top"><span class="stg-tag">STAGE 0' + (k + 1) + ' // ' + s[0] + '</span><span class="stg-state"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> ' + rb('クリア{済|ず}み') + '</span></div>' +
          '<p class="stg-name">' + rb(s[2]) + '</p><div class="stg-bar is-done"><span style="width:100%"></span></div></div>';
      } else if (k === d.stageNow) {
        h += '<div class="stg is-now"><div class="stg-top"><span class="stg-tag is-red">STAGE 0' + (k + 1) + ' // ' + s[0] + '（' + rb('{挑戦中|ちょうせんちゅう}') + '）</span><span class="en">' + d.stageRate + '%</span></div>' +
          '<p class="stg-name">' + rb(s[2]) + '</p><div class="stg-bar"><span style="width:' + d.stageRate + '%"></span></div>' +
          '<p class="stg-note">' + rb(k < 2 ? s[0] + ' の{模試|もし}に{合格|ごうかく}すると STAGE 0' + (k + 2) + ' が{解|と}けるようになります（{合格|ごうかく}の{基準|きじゅん}は③で{決|き}めます）' : 'HARD の{模試|もし}に{合格|ごうかく}して{本番|ほんばん}へ！') + '</p></div>';
      } else {
        h += '<div class="stg is-locked"><div class="stg-top"><span class="stg-tag is-gray">STAGE 0' + (k + 1) + ' // ' + s[0] + '</span><span class="stg-state is-gray"><i class="fa-solid fa-lock" aria-hidden="true"></i> STAGE 0' + k + rb(' クリアで{解放|かいほう}') + '</span></div>' +
          '<p class="stg-name">' + rb(s[2]) + '</p></div>';
      }
    });
    var total = d.week.reduce(function (a, b) { return a + b; }, 0);
    h += '</div><div class="panel-d"><div class="panel-head"><div><span class="dash-sec-en">STUDY ACTIVITY</span><h2 class="dash-sec-title">' + rb('この1{週間|しゅうかん}の{学習|がくしゅう}') + '</h2></div>' +
      '<span class="panel-chip-ja">' + rb('{今週|こんしゅう}：') + total + rb('{問|もん}') + '</span></div>' +
      '<p class="week-label">' + rb('{毎日|まいにち}{解|と}いた{問題|もんだい}の{数|かず}') + '</p><div class="week">';
    d.week.forEach(function (n, k) {
      var today = k === 6;
      h += '<div class="day' + (today ? ' is-today' : (n ? '' : ' is-off')) + '"><span class="day-name">' + rb(DAYS[k]) + '</span>' +
        '<i class="fa-solid ' + (today ? 'fa-bolt' : (n ? 'fa-check' : 'fa-minus')) + '" aria-hidden="true"></i><span class="day-num">' + n + rb('{問|もん}') + '</span></div>';
    });
    h += '</div><div class="cats-box"><div class="cats-head"><h3>' + rb('カテゴリ{別|べつ}の{正答率|せいとうりつ}（{目標|もくひょう} 75%）') + '</h3><span>' + rb('{自動|じどう}で{集計|しゅうけい}') + '</span></div>';
    d.cats.forEach(function (c) {
      var cls = c[1] >= 80 ? 'is-good' : (c[1] < 65 ? 'is-low' : '');
      h += '<div><div class="cat-row-top"><span>' + rb(c[0]) + '</span><b class="' + (cls === 'is-low' ? 'is-low' : '') + '">' + c[1] + '%' + (cls === 'is-low' ? rb('（{要復習|ようふくしゅう}）') : '') + '</b></div>' +
        '<div class="cat-row-bar"><span class="' + cls + '" style="width:' + c[1] + '%"></span></div></div>';
    });
    h += '</div></div></section>';

    // 最近の学習・アドバイス
    h += '<section class="dash-2col is-rev"><div class="panel-w"><div class="panel-head"><h2 class="dash-sec-title"><i class="fa-solid fa-clock-rotate-left t-red" aria-hidden="true"></i> ' + rb('{最近|さいきん}の{学習|がくしゅう}') + '</h2></div><div class="hist">';
    d.hist.forEach(function (x) {
      h += '<div class="hist-row"><div><span class="hist-kind' + (x[0] === 'mock' ? '' : ' is-black') + '">' + rb(x[0] === 'mock' ? '{模擬試験|もぎしけん}' : '{問題演習|もんだいえんしゅう}') + '</span>' +
        '<span class="hist-name">' + rb(x[1]) + '</span><p class="hist-time">' + rb(x[2]) + '</p></div><span class="hist-score">' + rb(x[3]) + '</span></div>';
    });
    h += '</div></div><div class="panel-d"><div class="panel-head"><h2 class="dash-sec-title t-yellow"><i class="fa-solid fa-bullhorn" aria-hidden="true"></i> ' + rb('{合格|ごうかく}へのアドバイス') + '</h2></div>' +
      '<div class="tip"><p class="tip-label">TODAY\'S TIP // ' + rb('{今日|きょう}のポイント') + '</p>' +
      '<p>' + rb('「' + weakest[0] + '」の{正答率|せいとうりつ}が ' + weakest[1] + '% です。まちがえた{問題|もんだい}の{解説|かいせつ}を{読|よ}んでから、「まちがい{復習|ふくしゅう}」で{解|と}き{直|なお}しましょう。') + '</p></div></div></section>';

    h += '</div>';
    view.innerHTML = h;
    document.getElementById('fieldSelect').addEventListener('change', function () {
      current = this.value;
      home();
      cutIn('FIELD CHANGED', rb('「' + fieldOf(current).name + '」に{切|き}りかえました！'));
    });
    window.scrollTo(0, 0);
  }

  /* ---------- カットイン（LP と同じ演出） ---------- */
  function cutIn(main, descHtml) {
    var ov = document.getElementById('cutin');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'cutin';
      ov.className = 'cutin';
      ov.setAttribute('aria-hidden', 'true');
      ov.innerHTML = '<div class="cutin-banner" id="cutinBanner"><div class="halftone"></div><span class="cutin-sub en">R-EALIZE</span><p class="cutin-main en" id="cutinMain"></p><p class="cutin-desc" id="cutinDesc"></p></div>';
      document.body.appendChild(ov);
    }
    document.getElementById('cutinMain').textContent = main;
    document.getElementById('cutinDesc').innerHTML = descHtml;
    var banner = document.getElementById('cutinBanner');
    ov.hidden = false;
    banner.classList.remove('is-anim'); void banner.offsetWidth;
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) banner.classList.add('is-anim');
    clearTimeout(cutIn.t);
    cutIn.t = setTimeout(function () { ov.hidden = true; }, 1500);
  }

  /* ---------- 分野の画面（STAGE・科目・カテゴリ） ---------- */
  var count = 10;
  function field(id) {
    quizMode(false); setTab('home'); view.classList.remove('is-wide');
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
    quizMode(true); view.classList.remove('is-wide');
    var q = quiz.list[quiz.i];
    var n = quiz.list.length;
    document.getElementById('quizWhere').innerHTML = rb(fieldOf(current).name + '・EASY') + '<br>' + rb(q.subj + '・' + q.cat);
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
    quizMode(false); setTab('home'); view.classList.remove('is-wide');
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
      '<button type="button" class="btn btn-red btn-clip btn-block" data-start="x"><span>' + rb('もう{一度|いちど}（{別|べつ}の{問題|もんだい}）') + '</span></button>' +
      '<button type="button" class="btn btn-white btn-block" data-retry="1"><span>' + rb('まちがえた{問題|もんだい}だけ{解|と}き{直|なお}す') + '</span></button>' +
      '<button type="button" class="btn btn-gray btn-block" data-go="home"><span>' + rb('ホームにもどる') + '</span></button></div>';
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
      if (name === 'practice') return field(current);
      if (name === 'mypage') return alert('マイページ（パスワードの変更・分野の追加など）は、あとで作ります。');
      return alert('この機能は、② 〜 ④ で作ります。');
    }
    var act = t.closest('[data-action]');
    if (act) {
      var k = act.getAttribute('data-action');
      if (k === 'drill') return field(current);
      if (k === 'review') { cutIn('START!', rb('まちがい{復習|ふくしゅう}を{始|はじ}めます！')); return setTimeout(start, 900); }
      return alert('模擬試験は ③ で作ります。');
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
    if (t.closest('#quizQuit')) { if (confirm('問題をやめて、ホームにもどりますか？')) home(); }
  });

  document.addEventListener('DOMContentLoaded', function () {
    RZ.initFurigana();
    home();
  });
})();
