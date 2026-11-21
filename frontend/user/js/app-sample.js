/* R-EALIZE 学習の画面（サンプル・宿泊）
 * GAS にはつながない。下のサンプルのデータだけで動く、デザイン確認用の画面
 * 文字の {漢字|よみ} は、ふりがな（ruby）にして出す
 */
(function () {
  'use strict';

  /* ---------- サンプルのデータ ---------- */
  var USER = { name: 'Nguyen', fields: ['accommodation'] };

  var FIELDS = [
    { id: 'kaigo', name: '{介護|かいご}' },
    { id: 'building', name: 'ビルクリーニング' },
    { id: 'accommodation', name: '{宿泊|しゅくはく}' },
    { id: 'manufacturing', name: '{工業製品製造業|こうぎょうせいひんせいぞうぎょう}' }
  ];

  // 宿泊のカテゴリとトピック：[トピック, 500問の中の数, 解いた数, まちがいの数]
  var CATS = [
    { subj: '{学科|がっか}', name: 'フロント', topics: [
      ['{予約|よやく}の{受付|うけつけ}', 17, 5, 1], ['チェックイン・チェックアウト', 17, 5, 0], ['{客室|きゃくしつ}と{料金|りょうきん}の{案内|あんない}', 17, 2, 1],
      ['{会計|かいけい}・{精算|せいさん}', 16, 0, 0], ['{館内|かんない}の{案内|あんない}・{問|と}い{合|あ}わせ', 16, 0, 0]] },
    { subj: '{学科|がっか}', name: '{企画|きかく}・{広報|こうほう}', topics: [
      ['{宿泊|しゅくはく}プランづくり', 21, 4, 1], ['{料金|りょうきん}と{売上|うりあげ}', 21, 3, 2], ['{販売|はんばい}と{予約|よやく}サイト', 21, 0, 0], ['{情報発信|じょうほうはっしん}', 20, 0, 0]] },
    { subj: '{学科|がっか}', name: '{接客|せっきゃく}', topics: [
      ['{接客|せっきゃく}の{基本|きほん}とマナー', 21, 6, 0], ['{言葉|ことば}づかい・{電話|でんわ}', 21, 4, 1], ['いろいろなお{客様|きゃくさま}への{対応|たいおう}', 21, 0, 0], ['{要望|ようぼう}・{苦情|くじょう}', 20, 0, 0]] },
    { subj: '{学科|がっか}', name: 'レストランサービス', topics: [
      ['{席|せき}の{案内|あんない}と{注文|ちゅうもん}', 21, 3, 1], ['{料理|りょうり}の{提供|ていきょう}と{片付|かたづ}け', 21, 2, 1], ['{料理|りょうり}・{飲|の}み{物|もの}とマナー', 21, 0, 0], ['{食物|しょくもつ}アレルギー', 21, 0, 0]] },
    { subj: '{学科|がっか}', name: '{安全衛生|あんぜんえいせい}・その{他|た}', topics: [
      ['{事故|じこ}とけがの{予防|よぼう}', 17, 4, 0], ['{火災|かさい}・{地震|じしん}の{対応|たいおう}', 17, 3, 0], ['{衛生|えいせい}と{食中毒|しょくちゅうどく}・{感染予防|かんせんよぼう}', 17, 0, 0],
      ['{防犯|ぼうはん}と{個人情報|こじんじょうほう}', 17, 0, 0], ['{旅館業法|りょかんぎょうほう}などのきまり', 16, 0, 0]] },
    { subj: '{実技|じつぎ}', name: '{判断|はんだん}', topics: [
      ['フロントの{場面|ばめん}', 14, 2, 1], ['{接客|せっきゃく}・レストランの{場面|ばめん}', 14, 0, 0], ['{安全衛生|あんぜんえいせい}の{場面|ばめん}', 14, 0, 0]] },
    { subj: '{実技|じつぎ}', name: '{計画立案|けいかくりつあん}', topics: [
      ['{作業|さぎょう}の{順番|じゅんばん}・{段取|だんど}り', 21, 2, 1], ['{時間|じかん}と{人|ひと}の{割|わ}りふり', 20, 0, 0]] }
  ];

  // 見本の問題（すべて3択。a は正解の番号 0〜2）
  var BANK = [
    { cat: 'フロント', topic: '{予約|よやく}の{受付|うけつけ}',
      q: '{電話|でんわ}で{宿泊|しゅくはく}の{予約|よやく}を{受|う}けます。{最初|さいしょ}に{確認|かくにん}することとして、{正|ただ}しいものはどれですか。',
      c: ['{泊|と}まる{日|ひ}と{人数|にんずう}', 'お{客様|きゃくさま}の{好|す}きな{食|た}べ{物|もの}', '{帰|かえ}りの{電車|でんしゃ}の{時間|じかん}'], a: 0,
      exp: '{予約|よやく}では、まず「いつ（{泊|と}まる{日|ひ}・{何泊|なんぱく}）」「{何人|なんにん}」を{確認|かくにん}します。それから{部屋|へや}の{種類|しゅるい}や{名前|なまえ}・{連絡先|れんらくさき}を{聞|き}きます。' },
    { cat: 'フロント', topic: 'チェックイン・チェックアウト',
      q: '「チェックイン」の{説明|せつめい}として、{正|ただ}しいものはどれですか。',
      c: ['ホテルに{着|つ}いて、{泊|と}まるための{手続|てつづ}きをすること', 'ホテルを{出|で}るときに、{料金|りょうきん}を{払|はら}うこと', '{客室|きゃくしつ}を{掃除|そうじ}すること'], a: 0,
      exp: 'ホテルに{着|つ}いて{宿泊|しゅくはく}の{手続|てつづ}きをするのが「チェックイン」、ホテルを{出|で}るときの{手続|てつづ}きが「チェックアウト」です。' },
    { cat: 'フロント', topic: '{会計|かいけい}・{精算|せいさん}',
      q: 'チェックアウトのとき、お{客様|きゃくさま}が「{客室|きゃくしつ}の{冷蔵庫|れいぞうこ}の{飲|の}み{物|もの}を2{本|ほん}{飲|の}みました」と{言|い}いました。{正|ただ}しい{対応|たいおう}はどれですか。',
      c: ['{飲|の}み{物|もの}の{料金|りょうきん}を、{宿泊料金|しゅくはくりょうきん}といっしょに{精算|せいさん}する', '{宿泊料金|しゅくはくりょうきん}にふくまれているので、{何|なに}もしない', 'あとで{客室|きゃくしつ}を{確認|かくにん}してから、お{客様|きゃくさま}に{電話|でんわ}をする'], a: 0,
      exp: '{客室|きゃくしつ}の{冷蔵庫|れいぞうこ}の{飲|の}み{物|もの}は、ふつう{宿泊料金|しゅくはくりょうきん}とは{別|べつ}の{料金|りょうきん}です。チェックアウトのときに、いっしょに{精算|せいさん}します。' },
    { cat: '{企画|きかく}・{広報|こうほう}', topic: '{料金|りょうきん}と{売上|うりあげ}',
      q: '「{客室稼働率|きゃくしつかどうりつ}」の{説明|せつめい}として、{正|ただ}しいものはどれですか。',
      c: ['{販売|はんばい}できる{客室|きゃくしつ}のうち、{実際|じっさい}に{売|う}れた{客室|きゃくしつ}の{割合|わりあい}', 'ホテルの{売上|うりあげ}のうち、レストランの{売上|うりあげ}の{割合|わりあい}', '{予約|よやく}のうち、キャンセルされた{予約|よやく}の{割合|わりあい}'], a: 0,
      exp: '{客室稼働率|きゃくしつかどうりつ}は、{売|う}れた{客室|きゃくしつ}の{数|かず}を、{販売|はんばい}できる{客室|きゃくしつ}の{数|かず}で{割|わ}ったものです。' },
    { cat: '{企画|きかく}・{広報|こうほう}', topic: '{情報発信|じょうほうはっしん}',
      q: 'ホテルの SNS に{写真|しゃしん}をのせます。{正|ただ}しいものはどれですか。',
      c: ['ほかのお{客様|きゃくさま}の{顔|かお}が{写|うつ}っていても、そのままのせる', 'お{客様|きゃくさま}の{顔|かお}が{写|うつ}るときは、{本人|ほんにん}の{許可|きょか}をもらう', 'インターネットで{見|み}つけた{写真|しゃしん}を、{自由|じゆう}に{使|つか}う'], a: 1,
      exp: 'お{客様|きゃくさま}の{顔|かお}が{写|うつ}った{写真|しゃしん}は、{本人|ほんにん}の{許可|きょか}が{必要|ひつよう}です。ほかの{人|ひと}が{撮|と}った{写真|しゃしん}も、{勝手|かって}に{使|つか}ってはいけません。' },
    { cat: '{接客|せっきゃく}', topic: '{言葉|ことば}づかい・{電話|でんわ}',
      q: 'お{客様|きゃくさま}に{名前|なまえ}を{聞|き}くとき、{正|ただ}しい{言|い}い{方|かた}はどれですか。',
      c: ['「{名前|なまえ}は{何|なん}ですか」', '「お{名前|なまえ}をうかがってもよろしいでしょうか」', '「{名前|なまえ}、{教|おし}えて」'], a: 1,
      exp: 'お{客様|きゃくさま}には{敬語|けいご}を{使|つか}います。「うかがう」は「{聞|き}く」のていねいな{言|い}い{方|かた}です。' },
    { cat: '{接客|せっきゃく}', topic: 'いろいろなお{客様|きゃくさま}への{対応|たいおう}',
      q: '{車|くるま}いすのお{客様|きゃくさま}を{客室|きゃくしつ}まで{案内|あんない}します。{正|ただ}しいものはどれですか。',
      c: ['{階段|かいだん}を{使|つか}い、{急|いそ}いで{案内|あんない}する', 'エレベーターなど、{段差|だんさ}のない{道|みち}で{案内|あんない}する', 'お{客様|きゃくさま}に、ひとりで{行|い}ってもらう'], a: 1,
      exp: '{車|くるま}いすのお{客様|きゃくさま}には、エレベーターやスロープなど{段差|だんさ}のない{道|みち}を{選|えら}んで、お{客様|きゃくさま}のペースに{合|あ}わせて{案内|あんない}します。' },
    { cat: 'レストランサービス', topic: '{料理|りょうり}の{提供|ていきょう}と{片付|かたづ}け',
      q: 'お{客様|きゃくさま}が{食事中|しょくじちゅう}です。{空|あ}いたお{皿|さら}を{下|さ}げるとき、{正|ただ}しいものはどれですか。',
      c: ['{何|なに}も{言|い}わずに、すぐに{下|さ}げる', '「お{下|さ}げしてもよろしいでしょうか」と{声|こえ}をかけてから{下|さ}げる', 'お{客様|きゃくさま}が{帰|かえ}るまで、{下|さ}げない'], a: 1,
      exp: 'お{皿|さら}を{下|さ}げるときは、ひと{声|こえ}かけて、お{客様|きゃくさま}の{了解|りょうかい}をもらってから{下|さ}げます。' },
    { cat: 'レストランサービス', topic: '{食物|しょくもつ}アレルギー',
      q: 'お{客様|きゃくさま}から「{卵|たまご}のアレルギーがあります」と{言|い}われました。{正|ただ}しい{対応|たいおう}はどれですか。',
      c: ['「たぶん{入|はい}っていません」と{答|こた}える', '{料理|りょうり}に{卵|たまご}が{使|つか}われているか、{調理|ちょうり}の{担当者|たんとうしゃ}に{確認|かくにん}してから{答|こた}える', '{卵|たまご}が{見|み}えない{料理|りょうり}なら、そのまま{出|だ}す'], a: 1,
      exp: 'アレルギーは{命|いのち}にかかわることがあります。わからないときは{推測|すいそく}で{答|こた}えず、{必|かなら}ず{調理|ちょうり}の{担当者|たんとうしゃ}に{確認|かくにん}します。' },
    { cat: '{安全衛生|あんぜんえいせい}・その{他|た}', topic: '{火災|かさい}・{地震|じしん}の{対応|たいおう}',
      q: '{館内|かんない}で{火災|かさい}が{起|お}きました。お{客様|きゃくさま}を{避難|ひなん}させるとき、{正|ただ}しいものはどれですか。',
      c: ['エレベーターを{使|つか}って、{早|はや}く{避難|ひなん}してもらう', '{荷物|にもつ}をまとめ{終|お}わるまで、{客室|きゃくしつ}で{待|ま}ってもらう', '{決|き}められた{避難経路|ひなんけいろ}で、{階段|かいだん}を{使|つか}って{避難|ひなん}してもらう'], a: 2,
      exp: '{火災|かさい}のときは、エレベーターが{止|と}まって{閉|と}じこめられるおそれがあります。{決|き}められた{避難経路|ひなんけいろ}を{通|とお}り、{階段|かいだん}で{避難|ひなん}します。' },
    { cat: '{安全衛生|あんぜんえいせい}・その{他|た}', topic: '{衛生|えいせい}と{食中毒|しょくちゅうどく}・{感染予防|かんせんよぼう}',
      q: '{食中毒|しょくちゅうどく}を{防|ふせ}ぐために、{正|ただ}しいものはどれですか。',
      c: ['{料理|りょうり}を{運|はこ}ぶ{前|まえ}に、{石|せっ}けんで{手|て}を{洗|あら}う', '{手|て}が{汚|よご}れて{見|み}えなければ、{洗|あら}わなくてよい', '{手|て}を{洗|あら}ったあと、エプロンで{手|て}をふく'], a: 0,
      exp: '{料理|りょうり}をさわる{前|まえ}や{運|はこ}ぶ{前|まえ}は、{石|せっ}けんで{手|て}を{洗|あら}い、{清潔|せいけつ}なペーパータオルなどでふきます。' },
    { cat: '{判断|はんだん}', topic: 'フロントの{場面|ばめん}',
      q: '{予約|よやく}したお{客様|きゃくさま}から「もっと{広|ひろ}い{部屋|へや}に{変|か}えたい」と{言|い}われました。{空|あ}いている{部屋|へや}はあります。{正|ただ}しい{対応|たいおう}はどれですか。',
      c: ['{空|あ}いている{広|ひろ}い{部屋|へや}と、{料金|りょうきん}の{差額|さがく}を{案内|あんない}する', '{予約|よやく}と{違|ちが}うので、すぐに{断|ことわ}る', '{何|なに}も{言|い}わずに、{広|ひろ}い{部屋|へや}の{鍵|かぎ}をわたす'], a: 0,
      exp: '{部屋|へや}を{変|か}えられるときは、{空|あ}いている{部屋|へや}と{料金|りょうきん}の{差額|さがく}を{説明|せつめい}して、お{客様|きゃくさま}に{決|き}めてもらいます。' },
    { cat: '{判断|はんだん}', topic: '{安全衛生|あんぜんえいせい}の{場面|ばめん}',
      q: 'ロビーの{床|ゆか}が、こぼれた{水|みず}でぬれています。{正|ただ}しい{対応|たいおう}はどれですか。',
      c: ['すぐにふいて、かわくまで「{足元注意|あしもとちゅうい}」の{看板|かんばん}を{置|お}く', '{清掃|せいそう}の{時間|じかん}まで、そのままにしておく', 'お{客様|きゃくさま}が{通|とお}らないうちに、{見|み}なかったことにする'], a: 0,
      exp: 'ぬれた{床|ゆか}は、すべって{転|ころ}ぶ{事故|じこ}の{原因|げんいん}になります。すぐにふき、かわくまで{看板|かんばん}で{知|し}らせます。' },
    { cat: '{計画立案|けいかくりつあん}', topic: '{作業|さぎょう}の{順番|じゅんばん}・{段取|だんど}り',
      q: '{客室|きゃくしつ}の{清掃|せいそう}の{順番|じゅんばん}として、いちばん{正|ただ}しいものはどれですか。',
      c: ['ごみを{集|あつ}める → ベッドメイク → {掃除機|そうじき}をかける → {最後|さいご}に{点検|てんけん}する', '{掃除機|そうじき}をかける → ベッドメイク → ごみを{集|あつ}める → {最後|さいご}に{点検|てんけん}する', '{最初|さいしょ}に{点検|てんけん}する → {掃除機|そうじき}をかける → ベッドメイク → ごみを{集|あつ}める'], a: 0,
      exp: 'ベッドメイクでほこりや{髪|かみ}の{毛|け}が{床|ゆか}に{落|お}ちるので、{掃除機|そうじき}はベッドメイクのあとにかけます。{最後|さいご}に{部屋|へや}{全体|ぜんたい}を{点検|てんけん}します。' },
    { cat: '{計画立案|けいかくりつあん}', topic: '{時間|じかん}と{人|ひと}の{割|わ}りふり',
      q: '15{時|じ}から18{時|じ}は、チェックインのお{客様|きゃくさま}がいちばん{多|おお}い{時間|じかん}です。{人|ひと}の{割|わ}りふりとして、{正|ただ}しいものはどれですか。',
      c: ['この{時間|じかん}は、フロントの{担当者|たんとうしゃ}を{増|ふ}やす', 'この{時間|じかん}に、フロントの{担当者|たんとうしゃ}が{休憩|きゅうけい}をとる', 'この{時間|じかん}は、フロントをひとりにして{清掃|せいそう}を{手伝|てつだ}う'], a: 0,
      exp: 'お{客様|きゃくさま}が{多|おお}い{時間|じかん}にフロントの{人|ひと}を{増|ふ}やすと、{待|ま}ち{時間|じかん}を{短|みじか}くできます。{休憩|きゅうけい}は、{少|すく}ない{時間|じかん}にとります。' }
  ];
  BANK.forEach(function (q) { q.subj = subjOf(q.cat); });

  var MOCK_SPEC = { minutes: 60, gakkaPerCat: 6, jitsugi: 6, pass: 65 };

  /* ---------- 共通 ---------- */
  var view = document.getElementById('view');
  function rb(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; })
      .replace(/\{([^|{}]+)\|([^{}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>').replace(/\n/g, '<br>');
  }
  function plain(s) { return String(s).replace(/\{([^|]+)\|[^}]+\}/g, '$1'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function subjOf(cat) { return CATS.filter(function (c) { return c.name === cat; })[0].subj; }
  function setTab(name) {
    document.querySelectorAll('#tabbar button').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-go') === name); });
    document.querySelectorAll('.dash-nav a').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-go') === name); });
  }
  function quizMode(on) {
    document.getElementById('appHeader').hidden = on;
    document.getElementById('quizTop').hidden = !on;
    document.getElementById('tabbar').hidden = on;
    document.body.style.paddingBottom = on ? '0' : '';
    if (!on) stopTimer();
    if (!on || !mock) showMockBar(false);
  }
  function fieldOf(id) { return FIELDS.filter(function (x) { return x.id === id; })[0]; }
  var LABELS = ['1', '2', '3', '4', '5'];
  var combo = { now: 3, best: 12 }; // 連続正解（問題演習だけで数える。見本の数字から始める）
  var current = 'accommodation';

  /* ---------- ① ホーム（ダッシュボード） ---------- */
  var DASH = {
    accommodation: { streak: 15, rate: 70, solved: 48, review: 10,
      mocks: [['11/10', 15, 3], ['11/13', 18, 3], ['11/16', 19, 4], ['11/18', 21, 4], ['{昨日|きのう}', 22, 5]],
      mock: { gakka: 22, jitsugi: 5 },
      week: [0, 5, 0, 0, 10, 0, 5],
      cats: [['フロント', 80], ['{企画|きかく}・{広報|こうほう}', 66], ['{接客|せっきゃく}', 75], ['レストランサービス', 58], ['{安全衛生|あんぜんえいせい}・その{他|た}', 70], ['{実技|じつぎ}', 67]],
      hist: [['mock', '{模擬試験|もぎしけん}（36{問|もん}）', '{昨日|きのう} 21:15', '{学科|がっか}73%・{実技|じつぎ}83%'], ['drill', '{学科|がっか}・フロント（10{問|もん}）', '3{日前|にちまえ} 20:05', '8/10']] }
  };
  var DAYS = ['{木|もく}', '{金|きん}', '{土|ど}', '{日|にち}', '{月|げつ}', '{火|か}', '{今日|きょう}'];

  function pct(n, d) { return Math.round(n / d * 100); }

  function home() {
    quizMode(false); setTab('home');
    view.classList.add('is-wide');
    var f = fieldOf(current);
    var d = DASH[current];
    var own = FIELDS.filter(function (x) { return USER.fields.indexOf(x.id) !== -1; });
    var weakest = d.cats.slice().sort(function (a, b) { return a[1] - b[1]; })[0];
    var gp = pct(d.mock.gakka, 30), jp = pct(d.mock.jitsugi, 6);
    var mockPass = gp >= MOCK_SPEC.pass && jp >= MOCK_SPEC.pass;
    var h = '<div class="dash">';

    h += '<section class="welcome"><div class="welcome-star" aria-hidden="true">★</div><div class="welcome-in"><div>' +
      '<span class="welcome-tag"><i class="fa-solid fa-bolt" aria-hidden="true"></i><span>' + rb('{特定技能|とくていぎのう}1{号|ごう} {合格|ごうかく}プログラム') + '</span></span>' +
      '<h1>おかえりなさい、<span>' + rb(USER.name) + 'さん</span>！</h1>' +
      '<p class="welcome-lead">' + rb('{今日|きょう}も{少|すこ}しずつ、{合格|ごうかく}に{近|ちか}づこう！') + '</p></div>' +
      '<div class="field-switch"><label for="fieldSelect">' + rb('{学習中|がくしゅうちゅう}の{分野|ぶんや}') + '</label>' +
      '<select id="fieldSelect">' + own.map(function (x) { return '<option value="' + x.id + '"' + (x.id === current ? ' selected' : '') + '>' + plain(x.name) + '</option>'; }).join('') + '</select>' +
      '<div class="field-switch-row"><span>' + rb('ほかの{分野|ぶんや}') + '</span><a href="#" data-go="mypage">' + rb('{追加|ついか}する') + '</a></div></div>' +
      '<div class="resume"><div class="resume-l"><span class="resume-badge">RESUME</span><div>' +
      '<p class="resume-small">' + rb('{前回|ぜんかい}の{続|つづ}き') + '</p>' +
      '<p class="resume-text"><span>【' + rb(f.name) + '】</span>' + rb('{学科|がっか}・フロント（4/10{問|もん}）') + '</p></div></div>' +
      '<button type="button" class="btn btn-red btn-clip" data-go="practice"><i class="fa-solid fa-play" aria-hidden="true"></i><span>' + rb('{問題演習|もんだいえんしゅう}へ') + '</span></button></div>' +
      '</div></section>';

    h += '<section class="kpis">' +
      '<div class="kpi"><div class="kpi-top"><span class="kpi-tag">STREAK</span><i class="fa-solid fa-fire" aria-hidden="true"></i></div>' +
        '<p class="kpi-label">' + rb('{連続|れんぞく}{学習|がくしゅう}{日数|にっすう}') + '</p><p class="kpi-num">' + d.streak + '<small>' + rb('{日|にち}') + '</small></p>' +
        '<div class="kpi-combo"><p class="kpi-label">' + rb('{連続正解|れんぞくせいかい}') + '</p><p class="kpi-combo-num"><b class="en">' + combo.now + '</b><span class="en">COMBO</span></p>' +
        '<p class="kpi-combo-best">' + rb('{最高|さいこう} ') + combo.best + ' COMBO</p></div></div>' +
      '<div class="kpi"><div class="kpi-top"><span class="kpi-tag is-red">ACCURACY</span><i class="fa-solid fa-bullseye" aria-hidden="true"></i></div>' +
        '<p class="kpi-label">' + rb('{正答率|せいとうりつ}（この{分野|ぶんや}）') + '</p><p class="kpi-num">' + d.rate + '<small>%</small></p>' +
        '<div class="kpi-bar"><span style="width:' + d.rate + '%"></span></div></div>' +
      '<div class="kpi"><div class="kpi-top"><span class="kpi-tag">SOLVED</span><i class="fa-solid fa-list-check" aria-hidden="true"></i></div>' +
        '<p class="kpi-label">' + rb('{解|と}いた{問題|もんだい}') + '</p><p class="kpi-num">' + d.solved + '<small>/ 500' + rb('{問|もん}') + '</small></p>' +
        '<div class="kpi-bar"><span style="width:' + Math.round(d.solved / 5) + '%"></span></div></div>' +
      '<div class="kpi is-mock"><div class="kpi-top"><span class="kpi-tag">MOCK EXAM</span><i class="fa-solid fa-trophy" aria-hidden="true"></i></div>' +
        '<p class="kpi-label">' + rb('{最新|さいしん}の{模擬試験|もぎしけん}') + '</p>' +
        '<p class="kpi-num">' + (d.mock.gakka + d.mock.jitsugi) + '<small>/ 36' + rb('{問|もん}') + '</small></p>' +
        '<span class="kpi-pill">' + rb('{学科|がっか} ' + gp + '%・{実技|じつぎ} ' + jp + '% ／ ' + (mockPass ? '{合格|ごうかく}' : '{不合格|ふごうかく}')) + '</span>' +
      '</div></section>';

    h += '<section><span class="dash-sec-en">QUICK ACTIONS</span><h2 class="dash-sec-title">' + rb('{今日|きょう}やることを') + '<span class="t-yellow">' + rb('{選|えら}ぼう') + '</span></h2><div class="actions">' +
      '<button type="button" class="action" data-go="practice"><div class="action-top"><span class="action-tag">DRILL</span><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></div>' +
        '<h3>' + rb('{問題|もんだい}を{解|と}く') + '</h3><p>' + rb('カテゴリ・トピックを{選|えら}んで{練習|れんしゅう}する') + '</p></button>' +
      '<button type="button" class="action" data-go="review"><div class="action-top"><span class="action-tag is-black">REVIEW</span><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></div>' +
        '<h3>' + rb('まちがい{復習|ふくしゅう}') + '</h3><p>' + rb('まちがえた{問題|もんだい}だけを{解|と}き{直|なお}す（' + d.review + '{問|もん}）') + '</p></button>' +
      '<button type="button" class="action is-mock" data-go="mock"><div class="action-top"><span class="action-tag is-black">MOCK</span><i class="fa-solid fa-stopwatch" aria-hidden="true"></i></div>' +
        '<h3>' + rb('{模擬試験|もぎしけん}に{挑戦|ちょうせん}') + '</h3><p>' + rb('{本番|ほんばん}と{同|おな}じ36{問|もん}・60{分|ぷん}で{力|ちから}を{確|たし}かめる') + '</p></button>' +
      '</div></section>';

    h += '<section class="dash-2col"><div class="panel-w"><div class="panel-head"><div><span class="dash-sec-en">MOCK EXAM HISTORY</span><h2 class="dash-sec-title">' + rb('{模擬試験|もぎしけん}の{記録|きろく}') + '</h2></div>' +
      '<span class="panel-chip">' + d.mocks.length + ' TIMES</span></div>' +
      '<p class="mh-legend"><span class="mh-key is-g"></span><span>' + rb('{学科|がっか}') + '</span><span class="mh-key is-j"></span><span>' + rb('{実技|じつぎ}') + '</span><span class="mh-key is-line"></span><span>' + rb('{合格|ごうかく}ライン 65%') + '</span></p><div class="mh">';
    d.mocks.forEach(function (m) {
      var g = pct(m[1], 30), j = pct(m[2], 6), ok = g >= 65 && j >= 65;
      h += '<div class="mh-row"><span class="mh-date">' + rb(m[0]) + '</span><div class="mh-bars">' +
        '<div class="mh-bar"><span class="is-g" style="width:' + g + '%"></span><em>' + g + '%</em></div>' +
        '<div class="mh-bar"><span class="is-j" style="width:' + j + '%"></span><em>' + j + '%</em></div>' +
        '<i class="mh-line" aria-hidden="true"></i></div><span class="mh-res' + (ok ? ' is-ok' : '') + '">' + rb(ok ? '{合格|ごうかく}' : '{不合格|ふごうかく}') + '</span></div>';
    });
    h += '</div><button type="button" class="btn btn-red btn-clip btn-block mh-btn" data-go="mock"><i class="fa-solid fa-stopwatch" aria-hidden="true"></i><span>' + rb('{模擬試験|もぎしけん}を{受|う}ける') + '</span></button>';
    var total = d.week.reduce(function (a, b) { return a + b; }, 0);
    h += '</div><div class="panel-d"><div class="panel-head"><div><span class="dash-sec-en">STUDY ACTIVITY</span><h2 class="dash-sec-title">' + rb('この1{週間|しゅうかん}の{学習|がくしゅう}') + '</h2></div>' +
      '<span class="panel-chip-ja">' + rb('{今週|こんしゅう}：') + total + rb('{問|もん}') + '</span></div>' +
      '<p class="week-label">' + rb('{毎日|まいにち}{解|と}いた{問題|もんだい}の{数|かず}') + '</p><div class="week">';
    d.week.forEach(function (n, k) {
      var today = k === 6;
      h += '<div class="day' + (today ? ' is-today' : (n ? '' : ' is-off')) + '"><span class="day-name">' + rb(DAYS[k]) + '</span>' +
        '<i class="fa-solid ' + (today ? 'fa-bolt' : (n ? 'fa-check' : 'fa-minus')) + '" aria-hidden="true"></i><span class="day-num">' + n + rb('{問|もん}') + '</span></div>';
    });
    h += '</div><div class="cats-box"><div class="cats-head"><h3>' + rb('カテゴリ{別|べつ}の{正答率|せいとうりつ}（{合格|ごうかく}ライン 65%）') + '</h3><span>' + rb('{自動|じどう}で{集計|しゅうけい}') + '</span></div>';
    d.cats.forEach(function (c) {
      var cls = c[1] >= 80 ? 'is-good' : (c[1] < 65 ? 'is-low' : '');
      h += '<div><div class="cat-row-top"><span>' + rb(c[0]) + '</span><b class="' + (cls === 'is-low' ? 'is-low' : '') + '">' + c[1] + '%' + (cls === 'is-low' ? rb('（{要復習|ようふくしゅう}）') : '') + '</b></div>' +
        '<div class="cat-row-bar"><span class="' + cls + '" style="width:' + c[1] + '%"></span></div></div>';
    });
    h += '</div></div></section>';

    h += '<section class="dash-2col is-rev"><div class="panel-w"><div class="panel-head"><h2 class="dash-sec-title"><i class="fa-solid fa-clock-rotate-left t-red" aria-hidden="true"></i> ' + rb('{最近|さいきん}の{学習|がくしゅう}') + '</h2></div><div class="hist">';
    d.hist.forEach(function (x) {
      h += '<div class="hist-row"><div><span class="hist-kind' + (x[0] === 'mock' ? '' : ' is-black') + '">' + rb(x[0] === 'mock' ? '{模擬試験|もぎしけん}' : '{問題演習|もんだいえんしゅう}') + '</span>' +
        '<span class="hist-name">' + rb(x[1]) + '</span><p class="hist-time">' + rb(x[2]) + '</p></div><span class="hist-score' + (x[3].length > 6 ? ' is-small' : '') + '">' + rb(x[3]) + '</span></div>';
    });
    h += '</div></div><div class="panel-d"><div class="panel-head"><h2 class="dash-sec-title t-yellow"><i class="fa-solid fa-bullhorn" aria-hidden="true"></i> ' + rb('{合格|ごうかく}へのアドバイス') + '</h2></div>' +
      '<div class="tip"><p class="tip-label">TODAY\'S TIP // ' + rb('{今日|きょう}のポイント') + '</p>' +
      '<p>' + rb('「' + weakest[0] + '」の{正答率|せいとうりつ}が ' + weakest[1] + '% です。{問題演習|もんだいえんしゅう}でこのカテゴリを{選|えら}んで、まちがえた{問題|もんだい}の{解説|かいせつ}を{読|よ}みましょう。') + '</p></div></div></section>';

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
  function cutIn(main, descHtml, sub, dark) {
    var ov = document.getElementById('cutin');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'cutin';
      ov.className = 'cutin';
      ov.setAttribute('aria-hidden', 'true');
      ov.innerHTML = '<div class="cutin-banner" id="cutinBanner"><div class="halftone"></div><span class="cutin-sub en" id="cutinSub">R-EALIZE</span><p class="cutin-main en" id="cutinMain"></p><p class="cutin-desc" id="cutinDesc"></p></div>';
      document.body.appendChild(ov);
    }
    document.getElementById('cutinMain').textContent = main;
    document.getElementById('cutinSub').textContent = sub || 'R-EALIZE';
    document.getElementById('cutinDesc').innerHTML = descHtml;
    var banner = document.getElementById('cutinBanner');
    banner.classList.toggle('is-dark', !!dark);
    ov.hidden = false;
    banner.classList.remove('is-anim'); void banner.offsetWidth;
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) banner.classList.add('is-anim');
    clearTimeout(cutIn.t);
    cutIn.t = setTimeout(function () { ov.hidden = true; }, 1500);
  }

  /* ---------- 問題演習の設定 ---------- */
  var saved = null; // 途中でやめた演習（「続きから」用）


  var PER_TOPIC = 6;                      // 1トピックから出す数（トピックの問題からランダム）
  var CAT_RATE = [80, 66, 75, 58, 70, 67, 67]; // 見本の正答率（本物は答えの記録から計算する）
  function catStat(c) {
    var n = 0, miss = 0;
    c.topics.forEach(function (t) { n += Math.min(PER_TOPIC, t[1]); miss += t[3]; });
    return { n: n, miss: miss };
  }
  function practice() {
    quizMode(false); setTab('practice'); view.classList.remove('is-wide');
    var html = '<h1 class="app-title"><span class="en">PRACTICE</span>' + rb('{問題演習|もんだいえんしゅう}（{宿泊|しゅくはく}）') + '</h1>' +
      '<p class="app-sub">' + rb('{宿泊|しゅくはく}の500{問|もん}から{出|だ}します') + '</p>';

    if (saved) {
      html += '<button type="button" class="quick-resume" id="resumeBtn"><i class="fa-solid fa-play" aria-hidden="true"></i><span><b>' + rb('{続|つづ}きから') + '</b>' +
        rb('（' + (saved.i + 1) + ' / ' + saved.list.length + '{問目|もんめ}から）') + '</span></button>';
    }

    // ① カテゴリを選んで解く
    html += '<h2 class="quick-head"><span class="quick-no en">1</span><span>' + rb('カテゴリを{選|えら}んで{解|と}く') + '</span></h2>' +
      '<p class="quick-desc">' + rb('カテゴリの{中|なか}のトピックを{順番|じゅんばん}に、1つのトピックから' + PER_TOPIC + '{問|もん}ずつ{出|だ}します。') + '</p>';
    var lastSubj = '';
    CATS.forEach(function (c, ci) {
      if (c.subj !== lastSubj) { if (lastSubj) html += '</div>'; html += '<p class="set-subj">' + rb(c.subj) + '</p><div class="quick-cats">'; lastSubj = c.subj; }
      var st = catStat(c), rate = CAT_RATE[ci];
      html += '<button type="button" class="quick-cat" data-quick="' + ci + '"><span class="quick-cat-name">' + rb(c.name) + '</span>' +
        '<span class="quick-cat-num">' + rb(c.topics.length + 'トピック・' + st.n + '{問|もん}') + '</span>' +
        '<span class="quick-cat-rate">' + rb('{正答率|せいとうりつ}') + ' <b class="' + (rate < 65 ? 'is-low' : '') + '">' + rate + '%</b>' + (st.miss ? '<em>' + rb('まちがい ') + st.miss + '</em>' : '') + '</span>' +
        '<span class="quick-cat-bar"><span class="' + (rate < 65 ? 'is-low' : '') + '" style="width:' + rate + '%"></span></span></button>';
    });
    html += '</div>';

    // ② すべてのカテゴリから解く（本番と同じ36問：学科は5カテゴリ×6問・実技は判断3問・計画立案3問）
    html += '<h2 class="quick-head"><span class="quick-no en">2</span><span>' + rb('すべてのカテゴリから{解|と}く') + '</span></h2>' +
      '<button type="button" class="quick-rec" data-quick="all"><span class="quick-rec-tag en">36 QUESTIONS</span>' +
      '<span class="quick-rec-title">' + rb('{本番|ほんばん}と{同|おな}じ36{問|もん}（{学科|がっか}30・{実技|じつぎ}6）') + '</span>' +
      '<span class="quick-rec-desc">' + rb('カテゴリの{順番|じゅんばん}に{出|だ}します。{時間|じかん}の{制限|せいげん}はありません') + '</span>' +
      '<span class="quick-rec-go"><i class="fa-solid fa-play" aria-hidden="true"></i></span></button>' +
      '<p class="start-note">' + rb('サンプルなので、{見本|みほん}の{問題|もんだい}（15{問|もん}）をくり{返|かえ}して{出|だ}します。') + '</p>';
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }
  // 本番と同じ36問：カテゴリの順番どおりに、そのカテゴリの問題からランダムに
  var ALL_SPEC = [6, 6, 6, 6, 6, 3, 3]; // CATS の順（学科5カテゴリ・判断・計画立案）
  function buildAll36() {
    var list = [];
    CATS.forEach(function (c, ci) {
      var pool = shuffle(BANK.filter(function (q) { return q.cat === c.name; }));
      for (var k = 0; k < ALL_SPEC[ci]; k++) list.push(pool[k % pool.length]);
    });
    return list;
  }
  // トピックの順番どおりに、1トピックから per 問（トピックの中はランダム）
  function buildPractice(cats, per) {
    var list = [];
    cats.forEach(function (c) {
      c.topics.forEach(function (t) {
        var want = Math.min(per, t[1]);
        var pool = shuffle(BANK.filter(function (q) { return plain(q.topic) === plain(t[0]); }));
        if (!pool.length) pool = shuffle(BANK.filter(function (q) { return q.cat === c.name; })); // サンプルで、そのトピックの見本が無いとき
        for (var k = 0; k < want; k++) {
          var q = pool[k % pool.length];
          list.push(Object.assign({}, q, { topic: t[0] }));
        }
      });
    });
    return list;
  }

  /* ---------- 問題を解く（練習：選ぶとすぐ判定） ---------- */
  var quiz = null;
  function question() {
    quizMode(true); view.classList.remove('is-wide');
    var q = quiz.list[quiz.i];
    var n = quiz.list.length;
    document.getElementById('quizWhere').innerHTML = '<span>' + rb('{宿泊|しゅくはく}・{問題演習|もんだいえんしゅう}') + '</span><br><span>' + rb(q.subj + '・' + q.cat + '・' + q.topic) + '</span>';
    document.getElementById('quizNum').textContent = (quiz.i + 1) + ' / ' + n;
    document.getElementById('quizBar').style.width = (quiz.i / n * 100) + '%';
    q.order = shuffle(q.c.map(function (_, k) { return k; }));
    var html = '<div class="q-card"><div class="q-tags"><span class="q-tag is-red">' + rb(q.subj) + '</span><span class="q-tag">' + rb(q.cat) + '</span><span class="q-tag">' + rb('3{択|たく}') + '</span></div>' +
      '<p class="q-text">' + rb(q.q) + '</p></div><div class="choices">';
    q.order.forEach(function (orig, k) {
      html += '<button type="button" class="choice-btn" data-ch="' + orig + '"><span class="choice-no en">' + LABELS[k] + '</span><span class="choice-txt">' + rb(q.c[orig]) + '</span></button>';
    });
    html += '</div><div id="expBox"></div>';
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }
  function judge(ok) {
    var q = quiz.list[quiz.i];
    quiz.results.push(ok);
    if (ok) {
      combo.now++; if (combo.now > combo.best) combo.best = combo.now;
      cutIn(combo.now >= 2 ? combo.now + ' COMBO!' : 'NICE!',
        rb('{正解|せいかい}！' + (combo.now >= 2 ? '{連続|れんぞく}' + combo.now + '{問|もん}{正解|せいかい}です！' : 'その{調子|ちょうし}です！')), 'CORRECT!', false);
    } else {
      combo.now = 0;
      cutIn('TRY AGAIN!', rb('{惜|お}しい！{下|した}の{解説|かいせつ}を{読|よ}んでみよう！'), 'CHECK THE POINT!', true);
    }
    var last = quiz.i === quiz.list.length - 1;
    document.getElementById('expBox').innerHTML =
      '<div class="exp"><div class="exp-head"><span class="exp-badge en' + (ok ? '' : ' is-miss') + '">' + (ok ? 'CORRECT!' : 'MISS') + '</span>' +
      '<h3>' + rb('やさしい{解説|かいせつ}') + '</h3></div><p>' + rb(q.exp) + '</p></div>' +
      '<button type="button" class="btn btn-black btn-block q-next" id="qNext"><span>' + rb(last ? '{結果|けっか}を{見|み}る →' : '{次|つぎ}の{問題|もんだい}へ →') + '</span></button>';
    document.getElementById('expBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function result() {
    quizMode(false); setTab('practice'); view.classList.remove('is-wide');
    var n = quiz.results.length;
    var ok = quiz.results.filter(Boolean).length;
    var html = '<h1 class="app-title"><span class="en">RESULT</span>' + rb('{結果|けっか}') + '</h1>' +
      '<div class="result-card"><div class="result-score en">' + ok + '<small> / ' + n + '</small></div>' +
      '<p class="result-rate">' + rb('{正答率|せいとうりつ} ') + pct(ok, n) + '%</p>' +
      '<p class="result-msg">' + rb(ok === n ? 'ぜんぶ{正解|せいかい}です！' : 'まちがえた{問題|もんだい}は、「まちがい{復習|ふくしゅう}」で{解|と}き{直|なお}せます。') + '</p></div>' +
      '<div class="result-list">';
    quiz.list.forEach(function (q, k) {
      html += '<div class="result-row"><span class="result-mark' + (quiz.results[k] ? '' : ' is-miss') + '">' + (quiz.results[k] ? '○' : '×') + '</span><span>' + rb(q.q) + '</span></div>';
    });
    html += '</div><div class="result-btns">' +
      '<button type="button" class="btn btn-red btn-clip btn-block" data-go="practice"><span>' + rb('{問題演習|もんだいえんしゅう}の{設定|せってい}にもどる') + '</span></button>' +
      '<button type="button" class="btn btn-white btn-block" data-retry="1"' + (ok === n ? ' disabled' : '') + '><span>' + rb('まちがえた{問題|もんだい}だけ{解|と}き{直|なお}す') + '</span></button>' +
      '<button type="button" class="btn btn-gray btn-block" data-go="home"><span>' + rb('ホームにもどる') + '</span></button></div>';
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }

  /* ---------- 模擬試験（本番と同じ 36問・60分。答えは最後にまとめて採点） ---------- */
  var mock = null, timerId = null;
  function showMockBar(on) {
    document.getElementById('mockBar').hidden = !on;
    if (!on) setPanel(false);
  }
  function setPanel(open) {
    var p = document.getElementById('mockPanel'), b = document.getElementById('palToggle');
    p.hidden = !open; b.setAttribute('aria-expanded', open ? 'true' : 'false'); b.classList.toggle('is-open', open);
  }
  function answeredCount() { return mock.ans.filter(function (a) { return a !== undefined; }).length; }
  function updateMockCount() {
    var n = answeredCount();
    document.getElementById('mockCount').innerHTML = rb('{答|こた}えた{問題|もんだい}') + ' <b class="en">' + n + '</b> / ' + mock.list.length;
    document.getElementById('quizBar').style.width = (n / mock.list.length * 100) + '%';
  }
  function renderPanel() {
    var html = '<p class="palette-head">' + rb('{番号|ばんごう}を{押|お}すと、その{問題|もんだい}へ{移|うつ}ります') + '</p><p class="palette-sub">' + rb('{学科|がっか}') + '</p><div class="palette-grid">';
    mock.list.forEach(function (it, k) {
      if (k === 30) html += '</div><p class="palette-sub">' + rb('{実技|じつぎ}') + '</p><div class="palette-grid">';
      html += '<button type="button" class="pal' + (mock.ans[k] !== undefined ? ' is-done' : '') + (k === mock.i ? ' is-now' : '') + '" data-pal="' + k + '">' + (k + 1) + '</button>';
    });
    html += '</div><p class="palette-legend"><span class="lg is-done"></span><span>' + rb('{答|こた}えた') + '</span><span class="lg"></span><span>' + rb('まだ') + '</span><span class="lg is-now"></span><span>' + rb('いまの{問題|もんだい}') + '</span></p>' +
      '<button type="button" class="btn btn-red btn-clip btn-block" id="mFinish"><span>' + rb('{解答|かいとう}を{終|お}わって{採点|さいてん}する') + '</span></button>';
    document.getElementById('mockPanel').innerHTML = html;
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function mockIntro() {
    quizMode(false); setTab('mock'); view.classList.remove('is-wide');
    var html = '<h1 class="app-title"><span class="en">MOCK EXAM</span>' + rb('{模擬試験|もぎしけん}（{宿泊|しゅくはく}）') + '</h1>' +
      '<div class="mock-spec">' +
        '<div><span>' + rb('{問題数|もんだいすう}') + '</span><b>36<small>' + rb('{問|もん}') + '</small></b><em>' + rb('{学科|がっか}30・{実技|じつぎ}6') + '</em></div>' +
        '<div><span>' + rb('{時間|じかん}') + '</span><b>60<small>' + rb('{分|ぷん}') + '</small></b><em>' + rb('{本番|ほんばん}と{同|おな}じ') + '</em></div>' +
        '<div><span>' + rb('{合格|ごうかく}') + '</span><b>65<small>%</small></b><em>' + rb('{学科|がっか}・{実技|じつぎ}それぞれ') + '</em></div>' +
      '</div>' +
      '<section class="set-box"><div class="set-head"><h2>' + rb('{受|う}ける{前|まえ}に') + '</h2></div><ul class="mock-rules">' +
        '<li>' + rb('{学科|がっか}は、フロント・{企画|きかく}・{広報|こうほう}・{接客|せっきゃく}・レストランサービス・{安全衛生|あんぜんえいせい}から6{問|もん}ずつ{出|で}ます。') + '</li>' +
        '<li>' + rb('{本番|ほんばん}と{同|おな}じく、{答|こた}えはその{場|ば}では{判定|はんてい}しません。{最後|さいご}にまとめて{採点|さいてん}します。') + '</li>' +
        '<li>' + rb('{前|まえ}の{問題|もんだい}にもどって、{答|こた}えを{変|か}えられます。{画面|がめん}の{上|うえ}の「{一覧|いちらん}・{採点|さいてん}」で、{答|こた}えた{問題|もんだい}を{確|たし}かめたり、{採点|さいてん}したりできます。') + '</li>' +
        '<li>' + rb('60{分|ぷん}たつと、{自動|じどう}で{終|お}わって{採点|さいてん}します。') + '</li>' +
        '<li>' + rb('{合格|ごうかく}するには、{学科|がっか}20{問|もん}{以上|いじょう}・{実技|じつぎ}4{問|もん}{以上|いじょう}の{正解|せいかい}が{必要|ひつよう}です。') + '</li>' +
      '</ul></section>' +
      '<button type="button" class="btn btn-red btn-clip btn-block" id="mockStart"><i class="fa-solid fa-stopwatch" aria-hidden="true"></i><span>' + rb('{模擬試験|もぎしけん}を{始|はじ}める') + '</span></button>' +
      '<p class="start-note">' + rb('サンプルなので、{見本|みほん}の{問題|もんだい}をくり{返|かえ}して36{問|もん}にしています。') + '</p>';
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }
  function buildMock() {
    var list = [];
    CATS.filter(function (c) { return c.subj === '{学科|がっか}'; }).forEach(function (c) {
      var pool = BANK.filter(function (q) { return q.cat === c.name; });
      for (var k = 0; k < MOCK_SPEC.gakkaPerCat; k++) list.push(pool[k % pool.length]);
    });
    list = shuffle(list);
    var jp = shuffle(BANK.filter(function (q) { return q.subj === '{実技|じつぎ}'; }));
    var jl = [];
    for (var k = 0; k < MOCK_SPEC.jitsugi; k++) jl.push(jp[k % jp.length]);
    return list.concat(jl).map(function (q) { return { q: q, order: shuffle([0, 1, 2]) }; });
  }
  function startMock() {
    mock = { list: buildMock(), ans: [], i: 0, end: Date.now() + MOCK_SPEC.minutes * 60 * 1000 };
    cutIn('EXAM START!', rb('{制限時間|せいげんじかん}は60{分|ぷん}です。がんばって！'));
    setTimeout(function () {
      mockQuestion();
      stopTimer();
      timerId = setInterval(tick, 1000);
      tick();
    }, 700);
  }
  function tick() {
    if (!mock) return;
    var left = Math.max(0, Math.round((mock.end - Date.now()) / 1000));
    var el = document.getElementById('quizNum');
    el.innerHTML = '<span class="timer' + (left <= 300 ? ' is-low' : '') + '"><i class="fa-solid fa-stopwatch" aria-hidden="true"></i> ' +
      Math.floor(left / 60) + ':' + ('0' + left % 60).slice(-2) + '</span>';
    if (left === 0) { stopTimer(); cutIn('TIME UP!', rb('{時間|じかん}になりました。{採点|さいてん}します。')); setTimeout(mockResult, 900); }
  }
  function mockQuestion() {
    quizMode(true); view.classList.remove('is-wide');
    var item = mock.list[mock.i], q = item.q, n = mock.list.length;
    var isJ = q.subj === '{実技|じつぎ}';
    document.getElementById('quizWhere').innerHTML = '<span>' + rb('{模擬試験|もぎしけん}・{宿泊|しゅくはく}') + '</span><br><span>' + rb((isJ ? '{実技|じつぎ}' : '{学科|がっか}') + ' ' + (mock.i + 1) + ' / ' + n + '{問|もん}') + '</span>';
    var html = '<div class="q-card"><div class="q-tags"><span class="q-tag is-red">' + rb(q.subj) + '</span><span class="q-tag en">Q' + (mock.i + 1) + '</span></div>' +
      '<p class="q-text">' + rb(q.q) + '</p></div><div class="choices">';
    item.order.forEach(function (orig, k) {
      html += '<button type="button" class="choice-btn' + (mock.ans[mock.i] === orig ? ' is-picked' : '') + '" data-mch="' + orig + '"><span class="choice-no en">' + LABELS[k] + '</span><span class="choice-txt">' + rb(q.c[orig]) + '</span></button>';
    });
    html += '</div><div class="mock-nav">' +
      '<button type="button" class="btn btn-gray" id="mPrev"' + (mock.i === 0 ? ' disabled' : '') + '><span>' + rb('← {前|まえ}の{問題|もんだい}') + '</span></button>' +
      '<button type="button" class="btn btn-black" id="mNext"' + (mock.i === n - 1 ? ' disabled' : '') + '><span>' + rb('{次|つぎ}の{問題|もんだい} →') + '</span></button></div>' +
      (mock.i === n - 1 ? '<p class="mock-last">' + rb('これが{最後|さいご}の{問題|もんだい}です。{答|こた}え{終|お}わったら、{上|うえ}の「{一覧|いちらん}・{採点|さいてん}」を{押|お}して{採点|さいてん}してください。') + '</p>' : '');
    showMockBar(true); setPanel(false); renderPanel(); updateMockCount();
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }
  function mockResult() {
    stopTimer(); showMockBar(false);
    var g = 0, j = 0, catScore = {};
    mock.list.forEach(function (it, k) {
      var ok = mock.ans[k] === it.q.a;
      if (it.q.subj === '{実技|じつぎ}') { if (ok) j++; } else { if (ok) g++; }
      var key = it.q.subj === '{実技|じつぎ}' ? '{実技|じつぎ}' : it.q.cat;
      catScore[key] = catScore[key] || [0, 0];
      catScore[key][1]++; if (ok) catScore[key][0]++;
    });
    var used = Math.min(MOCK_SPEC.minutes * 60, Math.round((Date.now() - (mock.end - MOCK_SPEC.minutes * 60 * 1000)) / 1000));
    var gp = pct(g, 30), jp = pct(j, 6);
    var gOk = gp >= MOCK_SPEC.pass, jOk = jp >= MOCK_SPEC.pass, pass = gOk && jOk;
    quizMode(false); setTab('mock'); view.classList.remove('is-wide');
    var html = '<h1 class="app-title"><span class="en">MOCK RESULT</span>' + rb('{模擬試験|もぎしけん}の{結果|けっか}') + '</h1>' +
      '<div class="mock-verdict ' + (pass ? 'is-pass' : 'is-fail') + '"><span class="en">' + (pass ? 'PASS' : 'NOT YET') + '</span><p>' + rb(pass ? '{合格|ごうかく}ラインに{届|とど}きました！' : 'もう{少|すこ}し！ {苦手|にがて}なカテゴリを{練習|れんしゅう}しよう') + '</p></div>' +
      '<div class="mock-scores">' +
        '<div class="' + (gOk ? 'is-ok' : 'is-ng') + '"><span>' + rb('{学科|がっか}') + '</span><b class="en">' + g + '<small> / 30</small></b><em>' + gp + '% ' + rb(gOk ? '{合格|ごうかく}' : '{不合格|ふごうかく}') + '</em></div>' +
        '<div class="' + (jOk ? 'is-ok' : 'is-ng') + '"><span>' + rb('{実技|じつぎ}') + '</span><b class="en">' + j + '<small> / 6</small></b><em>' + jp + '% ' + rb(jOk ? '{合格|ごうかく}' : '{不合格|ふごうかく}') + '</em></div>' +
      '</div>' +
      '<p class="mock-time">' + rb('かかった{時間|じかん}：') + Math.floor(used / 60) + rb('{分|ふん}') + (used % 60) + rb('{秒|びょう}') + '　' + rb('{合格|ごうかく}ライン：{学科|がっか}・{実技|じつぎ}それぞれ 65%') + '</p>' +
      '<section class="set-box"><div class="set-head"><h2>' + rb('カテゴリ{別|べつ}') + '</h2></div>';
    CATS.filter(function (c) { return c.subj === '{学科|がっか}'; }).map(function (c) { return c.name; }).concat(['{実技|じつぎ}']).filter(function (k) { return catScore[k]; }).forEach(function (k) {
      var s = catScore[k], p = pct(s[0], s[1]);
      html += '<div class="mcat"><div class="mcat-top"><span>' + rb(k) + '</span><b class="' + (p < 65 ? 'is-low' : '') + '">' + s[0] + ' / ' + s[1] + '</b></div>' +
        '<div class="mcat-bar"><span class="' + (p < 65 ? 'is-low' : '') + '" style="width:' + p + '%"></span></div></div>';
    });
    html += '</section><section class="set-box"><div class="set-head"><h2>' + rb('{答|こた}えと{解説|かいせつ}') + '</h2></div><div class="mans">';
    mock.list.forEach(function (it, k) {
      var a = mock.ans[k], ok = a === it.q.a;
      html += '<details class="mans-row"><summary><span class="result-mark' + (ok ? '' : ' is-miss') + '">' + (ok ? '○' : '×') + '</span><span class="mans-q"><b class="en">Q' + (k + 1) + '</b> ' + rb(it.q.q) + '</span></summary>' +
        '<div class="mans-body"><p>' + rb('あなたの{答|こた}え：') + (a === undefined ? rb('{未回答|みかいとう}') : rb(it.q.c[a])) + '</p>' +
        '<p class="mans-good">' + rb('{正解|せいかい}：') + rb(it.q.c[it.q.a]) + '</p><p>' + rb(it.q.exp) + '</p></div></details>';
    });
    html += '</div></section><div class="result-btns">' +
      '<button type="button" class="btn btn-red btn-clip btn-block" data-go="mock"><span>' + rb('もう{一度|いちど}{受|う}ける') + '</span></button>' +
      '<button type="button" class="btn btn-white btn-block" data-go="practice"><span>' + rb('{問題演習|もんだいえんしゅう}で{練習|れんしゅう}する') + '</span></button>' +
      '<button type="button" class="btn btn-gray btn-block" data-go="home"><span>' + rb('ホームにもどる') + '</span></button></div>';
    mock = null;
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
      if (mock && !confirm('模擬試験をやめますか？（答えは保存されません）')) return;
      mock = null;
      if (name === 'home') return home();
      if (name === 'practice') return practice();
      if (name === 'mock') return mockIntro();
      if (name === 'mypage') return alert('マイページ（パスワードの変更・分野の追加など）は、あとで作ります。');
      return alert('この機能は、② 〜 ④ で作ります。');
    }
    var qk = t.closest('[data-quick]');
    if (qk) {
      var key = qk.getAttribute('data-quick');
      var list = key === 'all' ? buildAll36() : buildPractice([CATS[Number(key)]], PER_TOPIC);
      quiz = { list: list, i: 0, results: [] };
      saved = null;
      cutIn('START!', rb('{問題演習|もんだいえんしゅう}を{始|はじ}めます！'));
      return setTimeout(question, 700);
    }
    if (t.closest('#resumeBtn') && saved) { quiz = saved; saved = null; return question(); }
    if (t.closest('[data-retry]')) {
      var miss = quiz.list.filter(function (_, k) { return !quiz.results[k]; });
      if (!miss.length) return;
      quiz = { list: miss, i: 0, results: [] };
      return question();
    }
    var ch = t.closest('[data-ch]');
    if (ch && !ch.disabled) {
      var q = quiz.list[quiz.i];
      var pickedNo = Number(ch.getAttribute('data-ch'));
      document.querySelectorAll('.choice-btn').forEach(function (b) {
        b.disabled = true;
        var w = Number(b.getAttribute('data-ch'));
        if (w === q.a) b.classList.add('is-correct'); else if (w === pickedNo) b.classList.add('is-wrong');
      });
      return judge(pickedNo === q.a);
    }
    if (t.closest('#qNext')) {
      quiz.i++;
      return quiz.i < quiz.list.length ? question() : result();
    }
    // 模擬試験
    if (t.closest('#mockStart')) return startMock();
    var mc = t.closest('[data-mch]');
    if (mc && mock) {
      mock.ans[mock.i] = Number(mc.getAttribute('data-mch'));
      document.querySelectorAll('[data-mch]').forEach(function (b) { b.classList.toggle('is-picked', b === mc); });
      renderPanel(); updateMockCount();
      return;
    }
    if (t.closest('#mPrev') && mock) { mock.i--; return mockQuestion(); }
    if (t.closest('#mNext') && mock) { mock.i++; return mockQuestion(); }
    var pl = t.closest('[data-pal]'); if (pl && mock) { mock.i = Number(pl.getAttribute('data-pal')); return mockQuestion(); }
    if (t.closest('#palToggle') && mock) return setPanel(document.getElementById('mockPanel').hidden);
    if (t.closest('#mFinish') && mock) {
      var rest = mock.list.length - answeredCount();
      if (confirm(rest ? 'まだ答えていない問題が ' + rest + ' 問あります。採点しますか？' : '採点しますか？')) return mockResult();
      return;
    }
    if (t.closest('#quizQuit')) {
      if (mock) { if (confirm('模擬試験をやめますか？（答えは保存されません）')) { mock = null; mockIntro(); } return; }
      if (confirm('問題をやめますか？（「続きから始める」で、この問題から再開できます）')) { saved = quiz; practice(); }
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    RZ.initFurigana();
    home();
  });
})();
