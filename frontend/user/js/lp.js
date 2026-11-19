/* R-EALIZE LP */
(function () {
  'use strict';

  // ルビの省略形：r('漢字','かんじ')
  function r(kanji, kana) { return '<ruby>' + kanji + '<rt>' + kana + '</rt></ruby>'; }

  /* ---------- 分野 ---------- */
  var FIELDS = [
    {
      id: 'kaigo',
      code: 'FIELD 01',
      name: r('介護', 'かいご'),
      icon: 'fa-hand-holding-heart',
      tag: r('技能', 'ぎのう') + '＋' + r('介護', 'かいご') + 'の' + r('日本語', 'にほんご'),
      desc: r('介護', 'かいご') + 'の' + r('基本', 'きほん') + '、こころとからだのしくみ、' + r('移動', 'いどう') + '・' + r('食事', 'しょくじ') + '・' + r('入浴', 'にゅうよく') + 'などの' + r('介護技術', 'かいごぎじゅつ') + '、' + r('介護', 'かいご') + 'の' + r('日本語', 'にほんご') + 'を' + r('学', 'まな') + 'びます。',
      points: [
        r('介護技能評価試験', 'かいごぎのうひょうかしけん') + 'と' + r('同', 'おな') + 'じ' + r('形式', 'けいしき') + 'の' + r('問題', 'もんだい'),
        r('介護日本語評価試験', 'かいごにほんごひょうかしけん') + 'の' + r('言葉', 'ことば') + 'と' + r('声', 'こえ') + 'かけ',
        r('介助', 'かいじょ') + 'の' + r('手順', 'てじゅん') + 'をやさしい' + r('解説', 'かいせつ') + 'で'
      ],
      featured: true
    },
    {
      id: 'building',
      code: 'FIELD 02',
      name: 'ビルクリーニング',
      icon: 'fa-broom',
      tag: r('建築物', 'けんちくぶつ') + 'の' + r('清掃', 'せいそう'),
      desc: r('床', 'ゆか') + '・トイレ・ガラスなどの' + r('清掃', 'せいそう') + 'の' + r('手順', 'てじゅん') + '、' + r('洗剤', 'せんざい') + 'と' + r('道具', 'どうぐ') + 'の' + r('使', 'つか') + 'い' + r('方', 'かた') + '、' + r('安全', 'あんぜん') + '・' + r('衛生', 'えいせい') + 'のルールを' + r('学', 'まな') + 'びます。',
      points: [
        r('清掃', 'せいそう') + 'の' + r('順番', 'じゅんばん') + 'と' + r('道具', 'どうぐ') + 'の' + r('名前', 'なまえ'),
        r('洗剤', 'せんざい') + 'の' + r('正', 'ただ') + 'しい' + r('使', 'つか') + 'い' + r('方', 'かた'),
        r('作業', 'さぎょう') + 'の' + r('安全', 'あんぜん') + 'ルール'
      ],
      featured: false
    },
    {
      id: 'accommodation',
      code: 'FIELD 03',
      name: r('宿泊', 'しゅくはく'),
      icon: 'fa-hotel',
      tag: 'フロント・' + r('接客', 'せっきゃく') + '・レストラン',
      desc: 'ホテル・' + r('旅館', 'りょかん') + 'のフロント、' + r('企画', 'きかく') + '・' + r('広報', 'こうほう') + '、' + r('接客', 'せっきゃく') + '、レストランサービスと、' + r('敬語', 'けいご') + 'のマナーを' + r('学', 'まな') + 'びます。',
      points: [
        r('敬語', 'けいご') + '・' + r('接客', 'せっきゃく') + 'の' + r('言葉', 'ことば'),
        'チェックイン・チェックアウトの' + r('流', 'なが') + 'れ',
        r('安全', 'あんぜん') + '・' + r('衛生', 'えいせい') + 'の' + r('基本', 'きほん')
      ],
      featured: false
    },
    {
      id: 'manufacturing',
      code: 'FIELD 04',
      name: r('工業製品製造業', 'こうぎょうせいひんせいぞうぎょう'),
      icon: 'fa-industry',
      tag: r('区分', 'くぶん') + 'に' + r('共通', 'きょうつう') + 'の' + r('基本', 'きほん'),
      desc: r('工場', 'こうじょう') + 'での' + r('安全', 'あんぜん') + 'な' + r('作業', 'さぎょう') + '、5S、' + r('品質', 'ひんしつ') + 'の' + r('基本', 'きほん') + 'など、どの' + r('区分', 'くぶん') + 'でも' + r('大切', 'たいせつ') + 'なことを' + r('学', 'まな') + 'びます。',
      points: [
        '5S（' + r('整理', 'せいり') + '・' + r('整頓', 'せいとん') + '・' + r('清掃', 'せいそう') + '・' + r('清潔', 'せいけつ') + '・しつけ）',
        r('機械', 'きかい') + 'と' + r('工具', 'こうぐ') + 'の' + r('安全', 'あんぜん') + 'ルール',
        r('品質', 'ひんしつ') + 'と' + r('報告', 'ほうこく') + 'の' + r('基本', 'きほん')
      ],
      featured: false
    }
  ];

  /* ---------- 体験デモの問題（案） ---------- */
  var QUESTIONS = {
    kaigo: [
      {
        q: r('右', 'みぎ') + 'の' + r('片麻痺', 'かたまひ') + '（' + r('右側', 'みぎがわ') + 'が' + r('動', 'うご') + 'きにくい）がある' + r('利用者', 'りようしゃ') + 'が、' + r('上着', 'うわぎ') + 'を' + r('着', 'き') + 'ます。' + r('最初', 'さいしょ') + 'に' + r('袖', 'そで') + 'を' + r('通', 'とお') + 'すのはどちらですか。',
        choices: [
          r('左腕', 'ひだりうで') + '（' + r('動', 'うご') + 'くほう）',
          r('右腕', 'みぎうで') + '（' + r('麻痺', 'まひ') + 'があるほう）',
          r('両腕', 'りょううで') + 'を' + r('同時', 'どうじ') + 'に' + r('通', 'とお') + 'す',
          'どちらからでもよい'
        ],
        answer: 1,
        exp: '「' + r('脱健着患', 'だっけんちゃっかん') + '」が' + r('基本', 'きほん') + 'です。' + r('着', 'き') + 'るときは' + r('麻痺', 'まひ') + 'があるほう（' + r('患側', 'かんそく') + '）から、' + r('脱', 'ぬ') + 'ぐときは' + r('動', 'うご') + 'くほう（' + r('健側', 'けんそく') + '）からです。'
      },
      {
        q: r('利用者', 'りようしゃ') + 'の' + r('気持', 'きも') + 'ちを' + r('大切', 'たいせつ') + 'にする' + r('対応', 'たいおう') + 'として、' + r('最', 'もっと') + 'も' + r('適切', 'てきせつ') + 'なものはどれですか。',
        choices: [
          r('時間', 'じかん') + 'がないので、' + r('何', 'なに') + 'も' + r('言', 'い') + 'わずに' + r('介助', 'かいじょ') + 'を' + r('始', 'はじ') + 'める',
          r('本人', 'ほんにん') + 'ができることも、すべて' + r('介護職', 'かいごしょく') + 'がする',
          r('本人', 'ほんにん') + 'の' + r('希望', 'きぼう') + 'を' + r('聞', 'き') + 'いてから' + r('介助', 'かいじょ') + 'する',
          r('家族', 'かぞく') + 'の' + r('希望', 'きぼう') + 'だけで' + r('決', 'き') + 'める'
        ],
        answer: 2,
        exp: r('介護', 'かいご') + 'では、' + r('本人', 'ほんにん') + 'が' + r('自分', 'じぶん') + 'で' + r('決', 'き') + 'めること（' + r('自己決定', 'じこけってい') + '）を' + r('大切', 'たいせつ') + 'にします。' + r('声', 'こえ') + 'をかけて、' + r('本人', 'ほんにん') + 'の' + r('希望', 'きぼう') + 'を' + r('確', 'たし') + 'かめましょう。'
      },
      {
        q: '「' + r('起床', 'きしょう') + '」と' + r('同', 'おな') + 'じ' + r('意味', 'いみ') + 'の' + r('言葉', 'ことば') + 'はどれですか。',
        choices: [
          r('寝', 'ね') + 'ること',
          r('起', 'お') + 'きること',
          r('着替', 'きが') + 'えること',
          r('食', 'た') + 'べること'
        ],
        answer: 1,
        exp: '「' + r('起床', 'きしょう') + '」は、' + r('朝', 'あさ') + 'などに' + r('起', 'お') + 'きることです。' + r('寝', 'ね') + 'ることは「' + r('就寝', 'しゅうしん') + '」といいます。' + r('介護', 'かいご') + 'の' + r('記録', 'きろく') + 'でよく' + r('使', 'つか') + 'います。'
      }
    ],
    building: [
      {
        q: 'ダストモップで' + r('床', 'ゆか') + 'のほこりを' + r('取', 'と') + 'ります。' + r('正', 'ただ') + 'しい' + r('進', 'すす') + 'め' + r('方', 'かた') + 'はどれですか。',
        choices: [
          r('部屋', 'へや') + 'の' + r('出口', 'でぐち') + 'から' + r('奥', 'おく') + 'に' + r('向', 'む') + 'かって' + r('進', 'すす') + 'む',
          r('部屋', 'へや') + 'の' + r('奥', 'おく') + 'から' + r('出口', 'でぐち') + 'に' + r('向', 'む') + 'かって' + r('進', 'すす') + 'む',
          'モップを' + r('床', 'ゆか') + 'から' + r('上', 'あ') + 'げて、' + r('振', 'ふ') + 'りながら' + r('進', 'すす') + 'む'
        ],
        answer: 1,
        exp: r('清掃', 'せいそう') + 'は「' + r('奥', 'おく') + 'から' + r('出口', 'でぐち') + 'へ」が' + r('基本', 'きほん') + 'です。きれいにした' + r('場所', 'ばしょ') + 'を' + r('歩', 'ある') + 'かずにすみます。モップを' + r('振', 'ふ') + 'ると、ほこりが' + r('舞', 'ま') + 'い' + r('上', 'あ') + 'がります。'
      },
      {
        q: r('高', 'たか') + 'いところと' + r('低', 'ひく') + 'いところを' + r('掃除', 'そうじ') + 'します。' + r('正', 'ただ') + 'しい' + r('順番', 'じゅんばん') + 'はどれですか。',
        choices: [
          r('低', 'ひく') + 'いところから' + r('高', 'たか') + 'いところへ',
          r('高', 'たか') + 'いところから' + r('低', 'ひく') + 'いところへ',
          r('順番', 'じゅんばん') + 'は' + r('関係', 'かんけい') + 'ない'
        ],
        answer: 1,
        exp: 'ほこりやよごれは' + r('上', 'うえ') + 'から' + r('下', 'した') + 'へ' + r('落', 'お') + 'ちます。だから「' + r('上', 'うえ') + 'から' + r('下', 'した') + 'へ」の' + r('順番', 'じゅんばん') + 'で' + r('掃除', 'そうじ') + 'します。'
      },
      {
        q: r('塩素系', 'えんそけい') + 'の' + r('洗剤', 'せんざい') + 'と' + r('酸性', 'さんせい') + 'の' + r('洗剤', 'せんざい') + 'について、' + r('正', 'ただ') + 'しいものはどれですか。',
        choices: [
          r('混', 'ま') + 'ぜると、よごれがよく' + r('落', 'お') + 'ちる',
          r('水', 'みず') + 'でうすめれば、' + r('混', 'ま') + 'ぜてもよい',
          r('混', 'ま') + 'ぜてはいけない'
        ],
        answer: 2,
        exp: r('塩素系', 'えんそけい') + 'と' + r('酸性', 'さんせい') + 'の' + r('洗剤', 'せんざい') + 'を' + r('混', 'ま') + 'ぜると、' + r('体', 'からだ') + 'に' + r('危険', 'きけん') + 'なガスが' + r('出', 'で') + 'ます。' + r('容器', 'ようき') + 'の「まぜるな' + r('危険', 'きけん') + '」の' + r('表示', 'ひょうじ') + 'を' + r('必', 'かなら') + 'ず' + r('見', 'み') + 'ましょう。'
      }
    ],
    accommodation: [
      {
        q: 'フロントでお' + r('客様', 'きゃくさま') + 'の' + r('名前', 'なまえ') + 'を' + r('聞', 'き') + 'きます。' + r('正', 'ただ') + 'しい' + r('言', 'い') + 'い' + r('方', 'かた') + 'はどれですか。',
        choices: [
          '「お' + r('名前', 'なまえ') + 'を' + r('言', 'い') + 'ってください」',
          '「お' + r('名前', 'なまえ') + 'を' + r('伺', 'うかが') + 'ってもよろしいでしょうか」',
          '「' + r('名前', 'なまえ') + 'は' + r('何', 'なん') + 'ですか」'
        ],
        answer: 1,
        exp: 'お' + r('客様', 'きゃくさま') + 'に' + r('聞', 'き') + 'くときは、「' + r('聞', 'き') + 'く」の' + r('謙譲語', 'けんじょうご') + 'の「' + r('伺', 'うかが') + 'う」を' + r('使', 'つか') + 'います。「〜てもよろしいでしょうか」で、ていねいにお' + r('願', 'ねが') + 'いします。'
      },
      {
        q: '「チェックイン」の' + r('説明', 'せつめい') + 'として、' + r('正', 'ただ') + 'しいものはどれですか。',
        choices: [
          r('泊', 'と') + 'まるために、ホテルに' + r('着', 'つ') + 'いて' + r('手続', 'てつづ') + 'きをすること',
          'ホテルを' + r('出', 'で') + 'るときに、' + r('料金', 'りょうきん') + 'を' + r('払', 'はら') + 'うこと',
          r('客室', 'きゃくしつ') + 'を' + r('掃除', 'そうじ') + 'すること'
        ],
        answer: 0,
        exp: 'ホテルに' + r('着', 'つ') + 'いて' + r('宿泊', 'しゅくはく') + 'の' + r('手続', 'てつづ') + 'きをするのが「チェックイン」、ホテルを' + r('出', 'で') + 'るときの' + r('手続', 'てつづ') + 'きが「チェックアウト」です。'
      },
      {
        q: 'お' + r('客様', 'きゃくさま') + 'を' + r('客室', 'きゃくしつ') + 'まで' + r('案内', 'あんない') + 'します。' + r('正', 'ただ') + 'しい' + r('歩', 'ある') + 'き' + r('方', 'かた') + 'はどれですか。',
        choices: [
          'お' + r('客様', 'きゃくさま') + 'の' + r('後', 'うし') + 'ろを' + r('歩', 'ある') + 'く',
          r('急', 'いそ') + 'いで' + r('歩', 'ある') + 'いて、' + r('先', 'さき') + 'に' + r('客室', 'きゃくしつ') + 'に' + r('入', 'はい') + 'る',
          'お' + r('客様', 'きゃくさま') + 'の' + r('斜', 'なな') + 'め' + r('前', 'まえ') + 'を、' + r('歩', 'ある') + 'く' + r('速', 'はや') + 'さに' + r('合', 'あ') + 'わせて' + r('歩', 'ある') + 'く'
        ],
        answer: 2,
        exp: r('案内', 'あんない') + 'するときは、お' + r('客様', 'きゃくさま') + 'の' + r('斜', 'なな') + 'め' + r('前', 'まえ') + 'を' + r('歩', 'ある') + 'きます。ときどき' + r('振', 'ふ') + 'り' + r('返', 'かえ') + 'って、お' + r('客様', 'きゃくさま') + 'の' + r('速', 'はや') + 'さに' + r('合', 'あ') + 'わせましょう。'
      }
    ],
    manufacturing: [
      {
        q: '5S の' + r('中', 'なか') + 'で、「' + r('必要', 'ひつよう') + 'なものと' + r('不要', 'ふよう') + 'なものを' + r('分', 'わ') + 'けて、' + r('不要', 'ふよう') + 'なものを' + r('捨', 'す') + 'てること」を' + r('何', 'なん') + 'といいますか。',
        choices: [
          r('整理', 'せいり'),
          r('整頓', 'せいとん'),
          r('清潔', 'せいけつ')
        ],
        answer: 0,
        exp: 'いらないものを' + r('分', 'わ') + 'けて' + r('捨', 'す') + 'てるのが「' + r('整理', 'せいり') + '」、' + r('使', 'つか') + 'いやすい' + r('場所', 'ばしょ') + 'に' + r('決', 'き') + 'めて' + r('置', 'お') + 'くのが「' + r('整頓', 'せいとん') + '」です。'
      },
      {
        q: r('機械', 'きかい') + 'に' + r('材料', 'ざいりょう') + 'がつまって' + r('止', 'と') + 'まりました。' + r('手', 'て') + 'を' + r('入', 'い') + 'れて' + r('取', 'と') + 'る' + r('前', 'まえ') + 'に、まずすることはどれですか。',
        choices: [
          r('急', 'いそ') + 'いで' + r('手', 'て') + 'を' + r('入', 'い') + 'れて' + r('取', 'と') + 'る',
          r('機械', 'きかい') + 'の' + r('電源', 'でんげん') + 'を' + r('切', 'き') + 'って、' + r('動', 'うご') + 'かないことを' + r('確', 'たし') + 'かめる',
          r('機械', 'きかい') + 'を' + r('動', 'うご') + 'かしたまま、' + r('棒', 'ぼう') + 'でつつく'
        ],
        answer: 1,
        exp: r('止', 'と') + 'まっている' + r('機械', 'きかい') + 'も、' + r('急', 'きゅう') + 'に' + r('動', 'うご') + 'くことがあります。' + r('電源', 'でんげん') + 'を' + r('切', 'き') + 'って、' + r('動', 'うご') + 'かないことを' + r('確', 'たし') + 'かめてから' + r('作業', 'さぎょう') + 'します。わからないときは、' + r('上司', 'じょうし') + 'に' + r('報告', 'ほうこく') + 'しましょう。'
      },
      {
        q: '「ヒヤリ・ハット」の' + r('説明', 'せつめい') + 'として、' + r('正', 'ただ') + 'しいものはどれですか。',
        choices: [
          'けがはしなかったが、' + r('危', 'あぶ') + 'なかったできごと',
          'けがをした' + r('大', 'おお') + 'きな' + r('事故', 'じこ'),
          r('工場', 'こうじょう') + 'で' + r('使', 'つか') + 'う' + r('機械', 'きかい') + 'の' + r('名前', 'なまえ')
        ],
        answer: 0,
        exp: '「ヒヤリ」「ハッ」とした、' + r('事故', 'じこ') + 'になる' + r('一歩手前', 'いっぽてまえ') + 'のできごとです。' + r('小', 'ちい') + 'さなことでも' + r('報告', 'ほうこく') + 'して、' + r('事故', 'じこ') + 'を' + r('防', 'ふせ') + 'ぎます。'
      }
    ]
  };

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 分野カード ---------- */
  function renderFields() {
    var grid = $('fields-grid');
    grid.innerHTML = FIELDS.map(function (f, i) {
      var cls = f.featured ? 'field-card is-featured' : 'field-card light';
      var pts = f.points.map(function (p) {
        return '<li><i class="fa-solid fa-star" aria-hidden="true"></i><span>' + p + '</span></li>';
      }).join('');
      return '' +
        '<article class="' + cls + ' box reveal" style="transition-delay:' + (i * 100) + 'ms">' +
          '<div class="field-code en">' + f.code + '</div>' +
          '<div>' +
            '<div class="field-tag clip-tag">' + f.tag + '</div>' +
            '<div class="field-head">' +
              '<div class="field-icon"><i class="fa-solid ' + f.icon + '" aria-hidden="true"></i></div>' +
              '<h3>' + f.name + '</h3>' +
            '</div>' +
            '<div class="field-price dark"><span>1' + r('分野', 'ぶんや') + '（' + r('税込', 'ぜいこみ') + '）</span><b><small>¥</small><span class="en">5,000</span></b></div>' +
            '<p class="field-desc">' + f.desc + '</p>' +
            '<ul class="field-points">' + pts + '</ul>' +
          '</div>' +
          '<button type="button" class="btn btn-clip field-btn" data-apply="' + f.id + '">' +
            '<span>この' + r('分野', 'ぶんや') + 'を' + r('申', 'もう') + 'し' + r('込', 'こ') + 'む</span><i class="fa-solid fa-bolt" aria-hidden="true"></i>' +
          '</button>' +
        '</article>';
    }).join('');
  }

  /* ---------- 体験デモ ---------- */
  var cur = { field: 'kaigo', idx: 0, selected: null, answered: false };
  var correctCount = 0;
  var streak = 0;
  var LABELS = ['A', 'B', 'C', 'D'];

  function renderFilterButtons() {
    $('demo-fields').innerHTML = FIELDS.map(function (f) {
      return '<button type="button" class="demo-field-btn" data-field="' + f.id + '" aria-pressed="false">' +
        '<i class="fa-solid ' + f.icon + '" aria-hidden="true"></i><span>' + f.name + '</span></button>';
    }).join('');
  }

  function showQuestion(fieldId, idx) {
    cur.field = fieldId;
    cur.idx = idx;
    cur.selected = null;
    cur.answered = false;

    var fIndex = FIELDS.findIndex(function (f) { return f.id === fieldId; });
    var f = FIELDS[fIndex];
    var list = QUESTIONS[fieldId];
    var q = list[idx];

    document.querySelectorAll('.demo-field-btn').forEach(function (b) {
      var on = b.getAttribute('data-field') === fieldId;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    $('q-field').innerHTML = f.name;
    $('q-label').textContent = 'FIELD 0' + (fIndex + 1) + ' / 0' + FIELDS.length + ' · Q' + (idx + 1) + ' / ' + list.length;
    $('q-text').innerHTML = q.q;
    $('q-exp').hidden = true;

    var box = $('q-choices');
    box.innerHTML = '';
    q.choices.forEach(function (html, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice';
      btn.innerHTML = '<span class="choice-label en">' + LABELS[i] + '</span><span class="choice-text">' + html + '</span>';
      btn.addEventListener('click', function () {
        if (cur.answered) return;
        cur.selected = i;
        checkAnswer();
      });
      box.appendChild(btn);
    });

    var isLast = idx === list.length - 1;
    // ボタンは inline-flex なので、文字とふりがなを span でまとめる（まとめないと間があく）
    $('q-next').innerHTML = '<span>' + (isLast
      ? r('次', 'つぎ') + 'の' + r('分野', 'ぶんや') + 'へ →'
      : r('次', 'つぎ') + 'の' + r('問題', 'もんだい') + 'へ →') + '</span>';
  }

  function checkAnswer() {
    var q = QUESTIONS[cur.field][cur.idx];
    var exp = $('q-exp');
    var badge = $('q-result');
    var text = $('q-exp-text');

    if (cur.selected === null || cur.answered) return;
    exp.hidden = false;
    cur.answered = true;

    var buttons = $('q-choices').querySelectorAll('.choice');
    buttons.forEach(function (b, i) {
      b.disabled = true;
      if (i === q.answer) b.classList.add('is-correct');
      else if (i === cur.selected) b.classList.add('is-wrong');
    });
    text.innerHTML = q.exp;

    if (cur.selected === q.answer) {
      correctCount++;
      streak++;
      $('q-score').textContent = correctCount;
      badge.textContent = 'CORRECT!';
      badge.className = 'result-badge en is-ok';
      cutIn(
        streak >= 2 ? streak + ' COMBO!' : 'NICE!',
        'CORRECT!',
        r('正解', 'せいかい') + '！' + (streak >= 2 ? r('連続', 'れんぞく') + streak + r('問', 'もん') + r('正解', 'せいかい') + 'です！' : 'その' + r('調子', 'ちょうし') + 'です！'),
        false
      );
    } else {
      streak = 0;
      badge.textContent = 'MISS';
      badge.className = 'result-badge en is-miss';
      cutIn(
        'TRY AGAIN!',
        'CHECK THE POINT!',
        r('惜', 'お') + 'しい！' + r('下', 'した') + 'の' + r('解説', 'かいせつ') + 'を' + r('読', 'よ') + 'んでみよう！',
        true
      );
    }
  }

  function nextQuestion() {
    var list = QUESTIONS[cur.field];
    if (cur.idx < list.length - 1) {
      showQuestion(cur.field, cur.idx + 1);
    } else {
      var i = FIELDS.findIndex(function (f) { return f.id === cur.field; });
      showQuestion(FIELDS[(i + 1) % FIELDS.length].id, 0);
    }
  }

  /* ---------- カットイン ---------- */
  var cutTimer = null;
  function cutIn(main, sub, descHtml, dark) {
    var ov = $('cutin');
    var banner = $('cutin-banner');
    $('cutin-main').textContent = main;
    $('cutin-sub').textContent = sub;
    $('cutin-desc').innerHTML = descHtml;
    banner.classList.toggle('is-dark', !!dark);

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ov.hidden = false;
    banner.classList.remove('is-anim');
    void banner.offsetWidth;
    if (!reduce) banner.classList.add('is-anim');
    clearTimeout(cutTimer);
    cutTimer = setTimeout(function () { ov.hidden = true; }, reduce ? 1200 : 1750);
  }

  /* ---------- 申込（準備中のお知らせ） ---------- */
  function planLabel(id) {
    if (id === 'all') return '4' + r('分野', 'ぶんや') + 'まとめて（' + FIELDS.map(function (f) { return f.name; }).join('・') + '）';
    var f = FIELDS.find(function (x) { return x.id === id; });
    return f ? f.name + '（1' + r('分野', 'ぶんや') + '）' : '';
  }
  function planPrice(id) {
    return id === 'all' ? '¥18,000（' + r('税込', 'ぜいこみ') + '）' : '¥5,000（' + r('税込', 'ぜいこみ') + '）';
  }
  // モーダルは重ねて開ける（申込フォームの上に利用規約を開く、など）。閉じると1つ前にもどる
  var stack = [];
  function topModal() { return stack.length ? stack[stack.length - 1].el : null; }
  function openModal(id) {
    var m = $(id);
    if (!m || topModal() === m) return;
    stack.push({ el: m, focus: document.activeElement });
    m.style.zIndex = String(60 + stack.length);
    m.hidden = false;
    document.body.classList.add('no-scroll');
    var c = m.querySelector('.modal-close');
    if (c) c.focus();
  }
  function closeModal() {
    var top = stack.pop();
    if (!top) return;
    top.el.hidden = true;
    top.el.style.zIndex = '';
    if (!stack.length) document.body.classList.remove('no-scroll');
    if (top.focus && top.focus.focus) top.focus.focus();
  }
  function applyOpen() {
    var c = window.REALIZE_CONFIG || {};
    return c.APPLY_OPEN === true && /^https:\/\//.test(c.API_URL || '');
  }
  function openApply(id) {
    if (applyOpen()) {
      var radio = document.querySelector('#applyForm input[name="plan"][value="' + id + '"]');
      if (radio) radio.checked = true;
      $('applyDone').hidden = true;
      $('applyForm').hidden = false;
      setApplyMsg('');
      openModal('applyform-modal');
      return;
    }
    $('apply-plan').innerHTML = planLabel(id);
    $('apply-price').innerHTML = planPrice(id);
    openModal('apply-modal');
  }

  /* ---------- 申込フォーム（R-ANGUAGE と同じ項目） ---------- */
  function setApplyMsg(text, isError) {
    var el = $('applyMsg');
    el.textContent = text || '';
    el.classList.toggle('is-error', !!isError);
  }
  function initApplyForm() {
    var form = $('applyForm');
    if (!form) return;
    form.querySelectorAll('[data-pw-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var input = b.parentNode.querySelector('input');
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        b.setAttribute('aria-pressed', String(show));
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var pw = f.password.value;
      if (!f.name.value.trim()) return setApplyMsg('お名前を入力してください。', true);
      if (!f.email.value.trim() || !f.email.checkValidity()) return setApplyMsg('メールアドレスを確認してください。', true);
      if (pw.length < 8 || pw.length > 64) return setApplyMsg('パスワードは8〜64文字で入力してください。', true);
      if (pw !== f.passwordConfirm.value) return setApplyMsg('パスワード（確認）が一致しません。', true);
      if (!f.agree.checked) return setApplyMsg('利用規約とプライバシーポリシーへの同意が必要です。', true);
      if (!applyOpen() || !window.RZ) return setApplyMsg('現在、お申し込みの受付を準備中です。', true);

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      setApplyMsg('');
      RZ.loading('お' + r('申', 'もう') + 'し' + r('込', 'こ') + 'みを' + r('送', 'おく') + 'っています', RZ.api({
        action: 'apply',
        plan: (form.querySelector('input[name="plan"]:checked') || {}).value,
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        password: pw,
        website: f.website.value
      })).then(function (res) {
        if (res && res.ok) {
          form.reset();
          form.hidden = true;
          var done = $('applyDone');
          done.textContent = 'お申し込みを受け付けました（申込番号：' + (res.applicationId || '—') + '）。確認のメールをお送りしましたので、メールに書かれた口座に、7日以内にお振り込みください。メールが届かないときは、迷惑メールのフォルダも確認してください。';
          done.hidden = false;
        } else {
          setApplyMsg((res && res.message) || 'お申し込みに失敗しました。', true);
        }
      }).catch(function (err) {
        console.error(err);
        setApplyMsg('通信に失敗しました。時間をおいてもう一度お試しください。', true);
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ---------- ふりがな ---------- */
  var KEY = 'realize_furigana';
  function setFurigana(on) {
    document.body.classList.toggle('furigana-off', !on);
    var btn = $('furigana-toggle');
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? 'ON' : 'OFF';
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) { /* 保存できなくても動く */ }
  }

  /* ---------- メニュー ---------- */
  function toggleMenu(force) {
    var nav = $('mobile-nav');
    var btn = $('menu-btn');
    var open = typeof force === 'boolean' ? force : nav.hidden;
    nav.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    $('menu-icon').className = 'fa-solid ' + (open ? 'fa-xmark' : 'fa-bars');
  }

  /* ---------- スクロールで表示 ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-shown'); });
      return;
    }
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-shown'); ob.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.12 });
    els.forEach(function (el) { ob.observe(el); });
  }

  /* ---------- 開始 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderFields();
    renderFilterButtons();
    showQuestion('kaigo', 0);

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { saved = null; }
    setFurigana(saved !== '0');
    $('furigana-toggle').addEventListener('click', function () {
      setFurigana(document.body.classList.contains('furigana-off'));
    });

    $('menu-btn').addEventListener('click', function () { toggleMenu(); });
    document.querySelectorAll('#mobile-nav a').forEach(function (a) {
      a.addEventListener('click', function () { toggleMenu(false); });
    });

    $('demo-fields').addEventListener('click', function (e) {
      var b = e.target.closest('.demo-field-btn');
      if (b) showQuestion(b.getAttribute('data-field'), 0);
    });
    $('q-next').addEventListener('click', nextQuestion);

    document.addEventListener('click', function (e) {
      var t = e.target;
      var a = t.closest('[data-apply]');
      if (a) {
        var id = a.getAttribute('data-apply');
        if (id === 'select') id = $('plan-select').value;
        openApply(id);
        return;
      }
      var o = t.closest('[data-open]');
      if (o) { e.preventDefault(); openModal(o.getAttribute('data-open')); return; }
      if (t.closest('[data-close]') || (topModal() && t === topModal())) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    initApplyForm();
    initReveal();
  });
})();
