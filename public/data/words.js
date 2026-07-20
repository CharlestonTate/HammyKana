const WORDS = {
  hiragana: [
    // group 0 — あいうえお
    { kana: 'あお', romaji: 'ao', meaning: 'blue', requiredGroup: 0 },
    { kana: 'いえ', romaji: 'ie', meaning: 'house', requiredGroup: 0 },
    { kana: 'うえ', romaji: 'ue', meaning: 'above', requiredGroup: 0 },
    { kana: 'あい', romaji: 'ai', meaning: 'love', requiredGroup: 0 },
    { kana: 'あう', romaji: 'au', meaning: 'to meet', requiredGroup: 0 },
    { kana: 'あおい', romaji: 'aoi', meaning: 'blue (adjective)', requiredGroup: 0 },
    { kana: 'いいえ', romaji: 'iie', meaning: 'no', requiredGroup: 0 },
    { kana: 'おう', romaji: 'ou', meaning: 'king', requiredGroup: 0 },

    // group 1 — かきくけこ
    { kana: 'えき', romaji: 'eki', meaning: 'station', requiredGroup: 1 },
    { kana: 'おか', romaji: 'oka', meaning: 'hill', requiredGroup: 1 },
    { kana: 'かお', romaji: 'kao', meaning: 'face', requiredGroup: 1 },
    { kana: 'あき', romaji: 'aki', meaning: 'autumn', requiredGroup: 1 },
    { kana: 'いけ', romaji: 'ike', meaning: 'pond', requiredGroup: 1 },
    { kana: 'こえ', romaji: 'koe', meaning: 'voice', requiredGroup: 1 },
    { kana: 'かき', romaji: 'kaki', meaning: 'persimmon', requiredGroup: 1 },
    { kana: 'いく', romaji: 'iku', meaning: 'to go', requiredGroup: 1 },
    { kana: 'あかい', romaji: 'akai', meaning: 'red', requiredGroup: 1 },
    { kana: 'いか', romaji: 'ika', meaning: 'squid', requiredGroup: 1 },
    { kana: 'かく', romaji: 'kaku', meaning: 'to write', requiredGroup: 1 },
    { kana: 'きく', romaji: 'kiku', meaning: 'to listen / chrysanthemum', requiredGroup: 1 },
    { kana: 'かう', romaji: 'kau', meaning: 'to buy', requiredGroup: 1 },
    { kana: 'あか', romaji: 'aka', meaning: 'red (color)', requiredGroup: 1 },
    { kana: 'いき', romaji: 'iki', meaning: 'breath', requiredGroup: 1 },
    { kana: 'おおきい', romaji: 'ookii', meaning: 'big', requiredGroup: 1 },
    { kana: 'くうこう', romaji: 'kuukou', meaning: 'airport', requiredGroup: 1 },

    // group 2 — さしすせそ
    { kana: 'さけ', romaji: 'sake', meaning: 'salmon / alcohol', requiredGroup: 2 },
    { kana: 'すし', romaji: 'sushi', meaning: 'sushi', requiredGroup: 2 },
    { kana: 'あさ', romaji: 'asa', meaning: 'morning', requiredGroup: 2 },
    { kana: 'ここ', romaji: 'koko', meaning: 'here', requiredGroup: 2 },
    { kana: 'しか', romaji: 'shika', meaning: 'deer', requiredGroup: 2 },
    { kana: 'あし', romaji: 'ashi', meaning: 'foot / leg', requiredGroup: 2 },
    { kana: 'いす', romaji: 'isu', meaning: 'chair', requiredGroup: 2 },
    { kana: 'かさ', romaji: 'kasa', meaning: 'umbrella', requiredGroup: 2 },
    { kana: 'すき', romaji: 'suki', meaning: 'like / fond of', requiredGroup: 2 },
    { kana: 'あそこ', romaji: 'asoko', meaning: 'over there', requiredGroup: 2 },
    { kana: 'すそ', romaji: 'suso', meaning: 'hem', requiredGroup: 2 },
    { kana: 'さか', romaji: 'saka', meaning: 'slope', requiredGroup: 2 },
    { kana: 'しお', romaji: 'shio', meaning: 'salt', requiredGroup: 2 },
    { kana: 'あせ', romaji: 'ase', meaning: 'sweat', requiredGroup: 2 },
    { kana: 'すいえい', romaji: 'suiei', meaning: 'swimming', requiredGroup: 2 },
    { kana: 'せかい', romaji: 'sekai', meaning: 'world', requiredGroup: 2 },

    // group 3 — たちつてと
    { kana: 'たこ', romaji: 'tako', meaning: 'octopus', requiredGroup: 3 },
    { kana: 'ちち', romaji: 'chichi', meaning: 'father', requiredGroup: 3 },
    { kana: 'てつ', romaji: 'tetsu', meaning: 'iron', requiredGroup: 3 },
    { kana: 'とけい', romaji: 'tokei', meaning: 'clock', requiredGroup: 3 },
    { kana: 'つき', romaji: 'tsuki', meaning: 'moon', requiredGroup: 3 },
    { kana: 'した', romaji: 'shita', meaning: 'under', requiredGroup: 3 },
    { kana: 'とし', romaji: 'toshi', meaning: 'year / age', requiredGroup: 3 },
    { kana: 'くつ', romaji: 'kutsu', meaning: 'shoes', requiredGroup: 3 },
    { kana: 'たつ', romaji: 'tatsu', meaning: 'to stand', requiredGroup: 3 },
    { kana: 'とち', romaji: 'tochi', meaning: 'land', requiredGroup: 3 },
    { kana: 'つち', romaji: 'tsuchi', meaning: 'soil', requiredGroup: 3 },
    { kana: 'ちかてつ', romaji: 'chikatetsu', meaning: 'subway', requiredGroup: 3 },
    { kana: 'たき', romaji: 'taki', meaning: 'waterfall', requiredGroup: 3 },
    { kana: 'たいせつ', romaji: 'taisetsu', meaning: 'important', requiredGroup: 3 },
    { kana: 'あいさつ', romaji: 'aisatsu', meaning: 'greeting', requiredGroup: 3 },
    { kana: 'ちいさい', romaji: 'chiisai', meaning: 'small', requiredGroup: 3 },
    { kana: 'たかい', romaji: 'takai', meaning: 'tall / expensive', requiredGroup: 3 },
    { kana: 'うつくしい', romaji: 'utsukushii', meaning: 'beautiful', requiredGroup: 3 },

    // group 4 — なにぬねの
    { kana: 'ねこ', romaji: 'neko', meaning: 'cat', requiredGroup: 4 },
    { kana: 'なつ', romaji: 'natsu', meaning: 'summer', requiredGroup: 4 },
    { kana: 'にく', romaji: 'niku', meaning: 'meat', requiredGroup: 4 },
    { kana: 'なに', romaji: 'nani', meaning: 'what', requiredGroup: 4 },
    { kana: 'ぬの', romaji: 'nuno', meaning: 'cloth', requiredGroup: 4 },
    { kana: 'いぬ', romaji: 'inu', meaning: 'dog', requiredGroup: 4 },
    { kana: 'あに', romaji: 'ani', meaning: 'older brother', requiredGroup: 4 },
    { kana: 'さかな', romaji: 'sakana', meaning: 'fish', requiredGroup: 4 },
    { kana: 'あね', romaji: 'ane', meaning: 'older sister', requiredGroup: 4 },
    { kana: 'あなた', romaji: 'anata', meaning: 'you', requiredGroup: 4 },
    { kana: 'なな', romaji: 'nana', meaning: 'seven', requiredGroup: 4 },
    { kana: 'ねつ', romaji: 'netsu', meaning: 'fever', requiredGroup: 4 },
    { kana: 'にし', romaji: 'nishi', meaning: 'west', requiredGroup: 4 },
    { kana: 'たのしい', romaji: 'tanoshii', meaning: 'fun', requiredGroup: 4 },

    // group 5 — はひふへほ
    { kana: 'はな', romaji: 'hana', meaning: 'flower / nose', requiredGroup: 5 },
    { kana: 'ひと', romaji: 'hito', meaning: 'person', requiredGroup: 5 },
    { kana: 'ふね', romaji: 'fune', meaning: 'boat', requiredGroup: 5 },
    { kana: 'ほし', romaji: 'hoshi', meaning: 'star', requiredGroup: 5 },
    { kana: 'はし', romaji: 'hashi', meaning: 'bridge', requiredGroup: 5 },
    { kana: 'はは', romaji: 'haha', meaning: 'mother', requiredGroup: 5 },
    { kana: 'ひくい', romaji: 'hikui', meaning: 'low', requiredGroup: 5 },
    { kana: 'ほそい', romaji: 'hosoi', meaning: 'thin', requiredGroup: 5 },
    { kana: 'ひこうき', romaji: 'hikouki', meaning: 'airplane', requiredGroup: 5 },

    // group 6 — まみむめも
    { kana: 'まめ', romaji: 'mame', meaning: 'bean', requiredGroup: 6 },
    { kana: 'みみ', romaji: 'mimi', meaning: 'ear', requiredGroup: 6 },
    { kana: 'むし', romaji: 'mushi', meaning: 'insect', requiredGroup: 6 },
    { kana: 'もも', romaji: 'momo', meaning: 'peach', requiredGroup: 6 },
    { kana: 'め', romaji: 'me', meaning: 'eye', requiredGroup: 6 },
    { kana: 'あめ', romaji: 'ame', meaning: 'rain', requiredGroup: 6 },
    { kana: 'くも', romaji: 'kumo', meaning: 'cloud', requiredGroup: 6 },
    { kana: 'みち', romaji: 'michi', meaning: 'road', requiredGroup: 6 },
    { kana: 'あたま', romaji: 'atama', meaning: 'head', requiredGroup: 6 },
    { kana: 'みなみ', romaji: 'minami', meaning: 'south', requiredGroup: 6 },
    { kana: 'むかし', romaji: 'mukashi', meaning: 'long ago', requiredGroup: 6 },

    // group 7 — やゆよらり
    { kana: 'へや', romaji: 'heya', meaning: 'room', requiredGroup: 7 },
    { kana: 'やま', romaji: 'yama', meaning: 'mountain', requiredGroup: 7 },
    { kana: 'ゆき', romaji: 'yuki', meaning: 'snow', requiredGroup: 7 },
    { kana: 'りす', romaji: 'risu', meaning: 'squirrel', requiredGroup: 7 },
    { kana: 'とり', romaji: 'tori', meaning: 'bird', requiredGroup: 7 },
    { kana: 'くらい', romaji: 'kurai', meaning: 'dark', requiredGroup: 7 },
    { kana: 'からい', romaji: 'karai', meaning: 'spicy', requiredGroup: 7 },
    { kana: 'より', romaji: 'yori', meaning: 'than / from', requiredGroup: 7 },
    { kana: 'よこ', romaji: 'yoko', meaning: 'side', requiredGroup: 7 },
    { kana: 'りゆう', romaji: 'riyuu', meaning: 'reason', requiredGroup: 7 },
    { kana: 'からす', romaji: 'karasu', meaning: 'crow', requiredGroup: 7 },
    { kana: 'あらう', romaji: 'arau', meaning: 'to wash', requiredGroup: 7 },
    { kana: 'くらす', romaji: 'kurasu', meaning: 'to live', requiredGroup: 7 },
    { kana: 'からくり', romaji: 'karakuri', meaning: 'mechanism', requiredGroup: 7 },
    { kana: 'やくそく', romaji: 'yakusoku', meaning: 'promise', requiredGroup: 7 },
    { kana: 'やすい', romaji: 'yasui', meaning: 'cheap', requiredGroup: 7 },
    { kana: 'つよい', romaji: 'tsuyoi', meaning: 'strong', requiredGroup: 7 },
    { kana: 'あたらしい', romaji: 'atarashii', meaning: 'new', requiredGroup: 7 },
    { kana: 'なつやすみ', romaji: 'natsuyasumi', meaning: 'summer vacation', requiredGroup: 7 },
    { kana: 'ふゆやすみ', romaji: 'fuyuyasumi', meaning: 'winter vacation', requiredGroup: 7 },

    // group 8 — るれろわを
    { kana: 'よる', romaji: 'yoru', meaning: 'night', requiredGroup: 8 },
    { kana: 'るす', romaji: 'rusu', meaning: 'absence', requiredGroup: 8 },
    { kana: 'ろく', romaji: 'roku', meaning: 'six', requiredGroup: 8 },
    { kana: 'わに', romaji: 'wani', meaning: 'crocodile', requiredGroup: 8 },
    { kana: 'ろう', romaji: 'rou', meaning: 'lamp', requiredGroup: 8 },
    { kana: 'くろ', romaji: 'kuro', meaning: 'black', requiredGroup: 8 },
    { kana: 'しろ', romaji: 'shiro', meaning: 'white', requiredGroup: 8 },
    { kana: 'くるま', romaji: 'kuruma', meaning: 'car', requiredGroup: 8 },
    { kana: 'とる', romaji: 'toru', meaning: 'to take', requiredGroup: 8 },
    { kana: 'はる', romaji: 'haru', meaning: 'spring (season)', requiredGroup: 8 },
    { kana: 'まわり', romaji: 'mawari', meaning: 'surroundings', requiredGroup: 8 },
    { kana: 'わたし', romaji: 'watashi', meaning: 'I / me', requiredGroup: 8 },
    { kana: 'あかるい', romaji: 'akarui', meaning: 'bright', requiredGroup: 8 },
    { kana: 'ふるさと', romaji: 'furusato', meaning: 'hometown', requiredGroup: 8 },
    { kana: 'れきし', romaji: 'rekishi', meaning: 'history', requiredGroup: 8 },
    { kana: 'きれい', romaji: 'kirei', meaning: 'pretty', requiredGroup: 8 },
    { kana: 'ひろい', romaji: 'hiroi', meaning: 'wide', requiredGroup: 8 },
    { kana: 'よわい', romaji: 'yowai', meaning: 'weak', requiredGroup: 8 },
    { kana: 'はるやすみ', romaji: 'haruyasumi', meaning: 'spring vacation', requiredGroup: 8 },
    { kana: 'にわとり', romaji: 'niwatori', meaning: 'chicken', requiredGroup: 8 },

    // group 9 — ん
    { kana: 'ほん', romaji: 'hon', meaning: 'book', requiredGroup: 9 },
    { kana: 'さん', romaji: 'san', meaning: 'three', requiredGroup: 9 },
    { kana: 'にほん', romaji: 'nihon', meaning: 'Japan', requiredGroup: 9 },
    { kana: 'せんせい', romaji: 'sensei', meaning: 'teacher', requiredGroup: 9 },
    { kana: 'おんな', romaji: 'onna', meaning: 'woman', requiredGroup: 9 },
    { kana: 'みんな', romaji: 'minna', meaning: 'everyone', requiredGroup: 9 },
    { kana: 'ほんとう', romaji: 'hontou', meaning: 'really / true', requiredGroup: 9 },
    { kana: 'おんせん', romaji: 'onsen', meaning: 'hot spring', requiredGroup: 9 },
    { kana: 'てんき', romaji: 'tenki', meaning: 'weather', requiredGroup: 9 },
    { kana: 'にんき', romaji: 'ninki', meaning: 'popularity', requiredGroup: 9 },
    { kana: 'かんたん', romaji: 'kantan', meaning: 'simple / easy', requiredGroup: 9 },
    { kana: 'せんたく', romaji: 'sentaku', meaning: 'laundry / choice', requiredGroup: 9 },
    { kana: 'れんらく', romaji: 'renraku', meaning: 'contact', requiredGroup: 9 },
    { kana: 'うんてん', romaji: 'unten', meaning: 'driving', requiredGroup: 9 },
    { kana: 'きんにく', romaji: 'kinniku', meaning: 'muscle', requiredGroup: 9 },
    { kana: 'おかあさん', romaji: 'okaasan', meaning: 'mother', requiredGroup: 9 },
    { kana: 'おとうさん', romaji: 'otousan', meaning: 'father', requiredGroup: 9 },
    { kana: 'ゆうはん', romaji: 'yuuhan', meaning: 'dinner', requiredGroup: 9 },

    // ----- stage 2: dakuten (゛) -----

    // group 10 — がぎぐげご
    { kana: 'がくせい', romaji: 'gakusei', meaning: 'student', requiredGroup: 10 },
    { kana: 'がいこく', romaji: 'gaikoku', meaning: 'foreign country', requiredGroup: 10 },
    { kana: 'かぎ', romaji: 'kagi', meaning: 'key', requiredGroup: 10 },
    { kana: 'ぎんこう', romaji: 'ginkou', meaning: 'bank', requiredGroup: 10 },
    { kana: 'およぐ', romaji: 'oyogu', meaning: 'to swim', requiredGroup: 10 },
    { kana: 'げんき', romaji: 'genki', meaning: 'healthy / energetic', requiredGroup: 10 },
    { kana: 'げつようび', romaji: 'getsuyoubi', meaning: 'monday', requiredGroup: 10 },
    { kana: 'ごはん', romaji: 'gohan', meaning: 'meal / cooked rice', requiredGroup: 10 },
    { kana: 'ごご', romaji: 'gogo', meaning: 'afternoon', requiredGroup: 10 },

    // group 11 — ざじずぜぞ
    { kana: 'ざっし', romaji: 'zasshi', meaning: 'magazine', requiredGroup: 11 },
    { kana: 'ざんねん', romaji: 'zannen', meaning: 'unfortunate', requiredGroup: 11 },
    { kana: 'じかん', romaji: 'jikan', meaning: 'time', requiredGroup: 11 },
    { kana: 'じしょ', romaji: 'jisho', meaning: 'dictionary', requiredGroup: 11 },
    { kana: 'みず', romaji: 'mizu', meaning: 'water', requiredGroup: 11 },
    { kana: 'ずっと', romaji: 'zutto', meaning: 'all the time', requiredGroup: 11 },
    { kana: 'ぜんぶ', romaji: 'zenbu', meaning: 'all', requiredGroup: 11 },
    { kana: 'ぜんぜん', romaji: 'zenzen', meaning: 'not at all', requiredGroup: 11 },
    { kana: 'ぞう', romaji: 'zou', meaning: 'elephant', requiredGroup: 11 },

    // group 12 — だぢづでど
    { kana: 'だいがく', romaji: 'daigaku', meaning: 'university', requiredGroup: 12 },
    { kana: 'だれ', romaji: 'dare', meaning: 'who', requiredGroup: 12 },
    { kana: 'でんしゃ', romaji: 'densha', meaning: 'train', requiredGroup: 12 },
    { kana: 'でぐち', romaji: 'deguchi', meaning: 'exit', requiredGroup: 12 },
    { kana: 'どようび', romaji: 'doyoubi', meaning: 'saturday', requiredGroup: 12 },
    { kana: 'どこ', romaji: 'doko', meaning: 'where', requiredGroup: 12 },

    // group 13 — ばびぶべぼ
    { kana: 'ばす', romaji: 'basu', meaning: 'bus', requiredGroup: 13 },
    { kana: 'ばんごう', romaji: 'bangou', meaning: 'number', requiredGroup: 13 },
    { kana: 'びょういん', romaji: 'byouin', meaning: 'hospital', requiredGroup: 13 },
    { kana: 'ぶた', romaji: 'buta', meaning: 'pig', requiredGroup: 13 },
    { kana: 'べんきょう', romaji: 'benkyou', meaning: 'study', requiredGroup: 13 },
    { kana: 'べんとう', romaji: 'bentou', meaning: 'boxed lunch', requiredGroup: 13 },
    { kana: 'ぼうし', romaji: 'boushi', meaning: 'hat', requiredGroup: 13 },
    { kana: 'ぼく', romaji: 'boku', meaning: 'I (male)', requiredGroup: 13 },

    // ----- stage 3: handakuten (゜) -----

    // group 14 — ぱぴぷぺぽ
    { kana: 'ぱん', romaji: 'pan', meaning: 'bread', requiredGroup: 14 },
    { kana: 'ぱんだ', romaji: 'panda', meaning: 'panda', requiredGroup: 14 },
    { kana: 'ぴあの', romaji: 'piano', meaning: 'piano', requiredGroup: 14 },
    { kana: 'ぴんく', romaji: 'pinku', meaning: 'pink', requiredGroup: 14 },
    { kana: 'ぷーる', romaji: 'puuru', meaning: 'pool', requiredGroup: 14 },
    { kana: 'ぷりん', romaji: 'purin', meaning: 'custard pudding', requiredGroup: 14 },
    { kana: 'ぺん', romaji: 'pen', meaning: 'pen', requiredGroup: 14 },
    { kana: 'ぺーじ', romaji: 'peeji', meaning: 'page', requiredGroup: 14 },
    { kana: 'ぽけっと', romaji: 'poketto', meaning: 'pocket', requiredGroup: 14 },
    { kana: 'ぽすと', romaji: 'posuto', meaning: 'mailbox', requiredGroup: 14 },

    // ----- stage 4: combination kana (ゃゅょ) -----

    // group 15 — きゃきゅきょ
    { kana: 'きゃく', romaji: 'kyaku', meaning: 'guest', requiredGroup: 15 },
    { kana: 'きゅう', romaji: 'kyuu', meaning: 'nine', requiredGroup: 15 },
    { kana: 'きょう', romaji: 'kyou', meaning: 'today', requiredGroup: 15 },

    // group 16 — しゃしゅしょ
    { kana: 'しゃしん', romaji: 'shashin', meaning: 'photograph', requiredGroup: 16 },
    { kana: 'しゅくだい', romaji: 'shukudai', meaning: 'homework', requiredGroup: 16 },
    { kana: 'しょうがくせい', romaji: 'shougakusei', meaning: 'elementary school student', requiredGroup: 16 },

    // group 17 — ちゃちゅちょ
    { kana: 'ちゃ', romaji: 'cha', meaning: 'tea', requiredGroup: 17 },
    { kana: 'ちゅうがく', romaji: 'chuugaku', meaning: 'middle school', requiredGroup: 17 },
    { kana: 'ちょっと', romaji: 'chotto', meaning: 'a little', requiredGroup: 17 },

    // group 18 — にゃにゅにょ
    { kana: 'にゃー', romaji: 'nyaa', meaning: 'meow', requiredGroup: 18 },
    { kana: 'こんにゃく', romaji: 'konnyaku', meaning: 'konjac', requiredGroup: 18 },

    // group 19 — ひゃひゅひょ
    { kana: 'ひゃく', romaji: 'hyaku', meaning: 'one hundred', requiredGroup: 19 },

    // group 20 — みゃみゅみょ
    { kana: 'みゅーじっく', romaji: 'myuujikku', meaning: 'music', requiredGroup: 20 },
    { kana: 'みょうじ', romaji: 'myouji', meaning: 'surname', requiredGroup: 20 },

    // group 21 — りゃりゅりょ
    { kana: 'りゅう', romaji: 'ryuu', meaning: 'dragon', requiredGroup: 21 },
    { kana: 'りょうり', romaji: 'ryouri', meaning: 'cooking', requiredGroup: 21 },

    // group 22 — ぎゃぎゅぎょ
    { kana: 'ぎゅうにゅう', romaji: 'gyuunyuu', meaning: 'milk', requiredGroup: 22 },
    { kana: 'ぎょうざ', romaji: 'gyouza', meaning: 'dumplings', requiredGroup: 22 },

    // group 23 — じゃじゅじょ
    { kana: 'じゅう', romaji: 'juu', meaning: 'ten', requiredGroup: 23 },
    { kana: 'じょうず', romaji: 'jouzu', meaning: 'skillful', requiredGroup: 23 },

    // group 24 — びゃびゅびょ
    // (all removed — too rare)

    // group 25 — ぴゃぴゅぴょ
    // (all removed — too rare)
  ],

  katakana: [
    // group 0 — アイウエオ
    { kana: 'アオ', romaji: 'ao', meaning: 'blue', requiredGroup: 0 },
    { kana: 'イエ', romaji: 'ie', meaning: 'house', requiredGroup: 0 },
    { kana: 'ウエ', romaji: 'ue', meaning: 'above', requiredGroup: 0 },
    { kana: 'アイ', romaji: 'ai', meaning: 'love', requiredGroup: 0 },
    { kana: 'アウ', romaji: 'au', meaning: 'to meet', requiredGroup: 0 },
    { kana: 'アオイ', romaji: 'aoi', meaning: 'blue (adjective)', requiredGroup: 0 },
    { kana: 'イイエ', romaji: 'iie', meaning: 'no', requiredGroup: 0 },
    { kana: 'オウ', romaji: 'ou', meaning: 'king', requiredGroup: 0 },

    // group 1 — カキクケコ
    { kana: 'エキ', romaji: 'eki', meaning: 'station', requiredGroup: 1 },
    { kana: 'オカ', romaji: 'oka', meaning: 'hill', requiredGroup: 1 },
    { kana: 'カオ', romaji: 'kao', meaning: 'face', requiredGroup: 1 },
    { kana: 'アキ', romaji: 'aki', meaning: 'autumn', requiredGroup: 1 },
    { kana: 'イケ', romaji: 'ike', meaning: 'pond', requiredGroup: 1 },
    { kana: 'コエ', romaji: 'koe', meaning: 'voice', requiredGroup: 1 },
    { kana: 'カキ', romaji: 'kaki', meaning: 'persimmon', requiredGroup: 1 },
    { kana: 'イク', romaji: 'iku', meaning: 'to go', requiredGroup: 1 },
    { kana: 'アカイ', romaji: 'akai', meaning: 'red', requiredGroup: 1 },
    { kana: 'イカ', romaji: 'ika', meaning: 'squid', requiredGroup: 1 },
    { kana: 'カク', romaji: 'kaku', meaning: 'to write', requiredGroup: 1 },
    { kana: 'キク', romaji: 'kiku', meaning: 'to listen / chrysanthemum', requiredGroup: 1 },
    { kana: 'カウ', romaji: 'kau', meaning: 'to buy', requiredGroup: 1 },
    { kana: 'アカ', romaji: 'aka', meaning: 'red (color)', requiredGroup: 1 },
    { kana: 'イキ', romaji: 'iki', meaning: 'breath', requiredGroup: 1 },
    { kana: 'オオキイ', romaji: 'ookii', meaning: 'big', requiredGroup: 1 },
    { kana: 'クウコウ', romaji: 'kuukou', meaning: 'airport', requiredGroup: 1 },

    // group 2 — サシスセソ
    { kana: 'サケ', romaji: 'sake', meaning: 'salmon / alcohol', requiredGroup: 2 },
    { kana: 'スシ', romaji: 'sushi', meaning: 'sushi', requiredGroup: 2 },
    { kana: 'アサ', romaji: 'asa', meaning: 'morning', requiredGroup: 2 },
    { kana: 'ココ', romaji: 'koko', meaning: 'here', requiredGroup: 2 },
    { kana: 'シカ', romaji: 'shika', meaning: 'deer', requiredGroup: 2 },
    { kana: 'アシ', romaji: 'ashi', meaning: 'foot / leg', requiredGroup: 2 },
    { kana: 'イス', romaji: 'isu', meaning: 'chair', requiredGroup: 2 },
    { kana: 'カサ', romaji: 'kasa', meaning: 'umbrella', requiredGroup: 2 },
    { kana: 'スキ', romaji: 'suki', meaning: 'like / fond of', requiredGroup: 2 },
    { kana: 'アソコ', romaji: 'asoko', meaning: 'over there', requiredGroup: 2 },
    { kana: 'スソ', romaji: 'suso', meaning: 'hem', requiredGroup: 2 },
    { kana: 'サカ', romaji: 'saka', meaning: 'slope', requiredGroup: 2 },
    { kana: 'シオ', romaji: 'shio', meaning: 'salt', requiredGroup: 2 },
    { kana: 'アセ', romaji: 'ase', meaning: 'sweat', requiredGroup: 2 },
    { kana: 'スイエイ', romaji: 'suiei', meaning: 'swimming', requiredGroup: 2 },
    { kana: 'セカイ', romaji: 'sekai', meaning: 'world', requiredGroup: 2 },

    // group 3 — タチツテト
    { kana: 'タコ', romaji: 'tako', meaning: 'octopus', requiredGroup: 3 },
    { kana: 'チチ', romaji: 'chichi', meaning: 'father', requiredGroup: 3 },
    { kana: 'テツ', romaji: 'tetsu', meaning: 'iron', requiredGroup: 3 },
    { kana: 'トケイ', romaji: 'tokei', meaning: 'clock', requiredGroup: 3 },
    { kana: 'ツキ', romaji: 'tsuki', meaning: 'moon', requiredGroup: 3 },
    { kana: 'シタ', romaji: 'shita', meaning: 'under', requiredGroup: 3 },
    { kana: 'トシ', romaji: 'toshi', meaning: 'year / age', requiredGroup: 3 },
    { kana: 'クツ', romaji: 'kutsu', meaning: 'shoes', requiredGroup: 3 },
    { kana: 'タツ', romaji: 'tatsu', meaning: 'to stand', requiredGroup: 3 },
    { kana: 'トチ', romaji: 'tochi', meaning: 'land', requiredGroup: 3 },
    { kana: 'ツチ', romaji: 'tsuchi', meaning: 'soil', requiredGroup: 3 },
    { kana: 'チカテツ', romaji: 'chikatetsu', meaning: 'subway', requiredGroup: 3 },
    { kana: 'タキ', romaji: 'taki', meaning: 'waterfall', requiredGroup: 3 },
    { kana: 'タイセツ', romaji: 'taisetsu', meaning: 'important', requiredGroup: 3 },
    { kana: 'アイサツ', romaji: 'aisatsu', meaning: 'greeting', requiredGroup: 3 },
    { kana: 'チイサイ', romaji: 'chiisai', meaning: 'small', requiredGroup: 3 },
    { kana: 'タカイ', romaji: 'takai', meaning: 'tall / expensive', requiredGroup: 3 },
    { kana: 'ウツクシイ', romaji: 'utsukushii', meaning: 'beautiful', requiredGroup: 3 },

    // group 4 — ナニヌネノ
    { kana: 'ネコ', romaji: 'neko', meaning: 'cat', requiredGroup: 4 },
    { kana: 'ナツ', romaji: 'natsu', meaning: 'summer', requiredGroup: 4 },
    { kana: 'ニク', romaji: 'niku', meaning: 'meat', requiredGroup: 4 },
    { kana: 'ナニ', romaji: 'nani', meaning: 'what', requiredGroup: 4 },
    { kana: 'ヌノ', romaji: 'nuno', meaning: 'cloth', requiredGroup: 4 },
    { kana: 'イヌ', romaji: 'inu', meaning: 'dog', requiredGroup: 4 },
    { kana: 'アニ', romaji: 'ani', meaning: 'older brother', requiredGroup: 4 },
    { kana: 'サカナ', romaji: 'sakana', meaning: 'fish', requiredGroup: 4 },
    { kana: 'アネ', romaji: 'ane', meaning: 'older sister', requiredGroup: 4 },
    { kana: 'アナタ', romaji: 'anata', meaning: 'you', requiredGroup: 4 },
    { kana: 'ナナ', romaji: 'nana', meaning: 'seven', requiredGroup: 4 },
    { kana: 'ネツ', romaji: 'netsu', meaning: 'fever', requiredGroup: 4 },
    { kana: 'ニシ', romaji: 'nishi', meaning: 'west', requiredGroup: 4 },
    { kana: 'タノシイ', romaji: 'tanoshii', meaning: 'fun', requiredGroup: 4 },

    // group 5 — ハヒフヘホ
    { kana: 'ハナ', romaji: 'hana', meaning: 'flower / nose', requiredGroup: 5 },
    { kana: 'ヒト', romaji: 'hito', meaning: 'person', requiredGroup: 5 },
    { kana: 'フネ', romaji: 'fune', meaning: 'boat', requiredGroup: 5 },
    { kana: 'ホシ', romaji: 'hoshi', meaning: 'star', requiredGroup: 5 },
    { kana: 'ハシ', romaji: 'hashi', meaning: 'bridge', requiredGroup: 5 },
    { kana: 'ハハ', romaji: 'haha', meaning: 'mother', requiredGroup: 5 },
    { kana: 'ヒクイ', romaji: 'hikui', meaning: 'low', requiredGroup: 5 },
    { kana: 'ホソイ', romaji: 'hosoi', meaning: 'thin', requiredGroup: 5 },
    { kana: 'ヒコウキ', romaji: 'hikouki', meaning: 'airplane', requiredGroup: 5 },

    // group 6 — マミムメモ
    { kana: 'マメ', romaji: 'mame', meaning: 'bean', requiredGroup: 6 },
    { kana: 'ミミ', romaji: 'mimi', meaning: 'ear', requiredGroup: 6 },
    { kana: 'ムシ', romaji: 'mushi', meaning: 'insect', requiredGroup: 6 },
    { kana: 'モモ', romaji: 'momo', meaning: 'peach', requiredGroup: 6 },
    { kana: 'メ', romaji: 'me', meaning: 'eye', requiredGroup: 6 },
    { kana: 'アメ', romaji: 'ame', meaning: 'rain', requiredGroup: 6 },
    { kana: 'クモ', romaji: 'kumo', meaning: 'cloud', requiredGroup: 6 },
    { kana: 'ミチ', romaji: 'michi', meaning: 'road', requiredGroup: 6 },
    { kana: 'アタマ', romaji: 'atama', meaning: 'head', requiredGroup: 6 },
    { kana: 'ミナミ', romaji: 'minami', meaning: 'south', requiredGroup: 6 },
    { kana: 'ムカシ', romaji: 'mukashi', meaning: 'long ago', requiredGroup: 6 },

    // group 7 — ヤユヨラリ
    { kana: 'ヘヤ', romaji: 'heya', meaning: 'room', requiredGroup: 7 },
    { kana: 'ヤマ', romaji: 'yama', meaning: 'mountain', requiredGroup: 7 },
    { kana: 'ユキ', romaji: 'yuki', meaning: 'snow', requiredGroup: 7 },
    { kana: 'リス', romaji: 'risu', meaning: 'squirrel', requiredGroup: 7 },
    { kana: 'トリ', romaji: 'tori', meaning: 'bird', requiredGroup: 7 },
    { kana: 'クライ', romaji: 'kurai', meaning: 'dark', requiredGroup: 7 },
    { kana: 'カライ', romaji: 'karai', meaning: 'spicy', requiredGroup: 7 },
    { kana: 'ヨリ', romaji: 'yori', meaning: 'than / from', requiredGroup: 7 },
    { kana: 'ヨコ', romaji: 'yoko', meaning: 'side', requiredGroup: 7 },
    { kana: 'リユウ', romaji: 'riyuu', meaning: 'reason', requiredGroup: 7 },
    { kana: 'カラス', romaji: 'karasu', meaning: 'crow', requiredGroup: 7 },
    { kana: 'アラウ', romaji: 'arau', meaning: 'to wash', requiredGroup: 7 },
    { kana: 'クラス', romaji: 'kurasu', meaning: 'to live', requiredGroup: 7 },
    { kana: 'カラクリ', romaji: 'karakuri', meaning: 'mechanism', requiredGroup: 7 },
    { kana: 'ヤクソク', romaji: 'yakusoku', meaning: 'promise', requiredGroup: 7 },
    { kana: 'ヤスイ', romaji: 'yasui', meaning: 'cheap', requiredGroup: 7 },
    { kana: 'ツヨイ', romaji: 'tsuyoi', meaning: 'strong', requiredGroup: 7 },
    { kana: 'アタラシイ', romaji: 'atarashii', meaning: 'new', requiredGroup: 7 },
    { kana: 'ナツヤスミ', romaji: 'natsuyasumi', meaning: 'summer vacation', requiredGroup: 7 },
    { kana: 'フユヤスミ', romaji: 'fuyuyasumi', meaning: 'winter vacation', requiredGroup: 7 },

    // group 8 — ルレロワヲ
    { kana: 'ヨル', romaji: 'yoru', meaning: 'night', requiredGroup: 8 },
    { kana: 'ルス', romaji: 'rusu', meaning: 'absence', requiredGroup: 8 },
    { kana: 'ロク', romaji: 'roku', meaning: 'six', requiredGroup: 8 },
    { kana: 'ワニ', romaji: 'wani', meaning: 'crocodile', requiredGroup: 8 },
    { kana: 'ロウ', romaji: 'rou', meaning: 'lamp', requiredGroup: 8 },
    { kana: 'クロ', romaji: 'kuro', meaning: 'black', requiredGroup: 8 },
    { kana: 'シロ', romaji: 'shiro', meaning: 'white', requiredGroup: 8 },
    { kana: 'クルマ', romaji: 'kuruma', meaning: 'car', requiredGroup: 8 },
    { kana: 'トル', romaji: 'toru', meaning: 'to take', requiredGroup: 8 },
    { kana: 'ハル', romaji: 'haru', meaning: 'spring (season)', requiredGroup: 8 },
    { kana: 'マワリ', romaji: 'mawari', meaning: 'surroundings', requiredGroup: 8 },
    { kana: 'ワタシ', romaji: 'watashi', meaning: 'I / me', requiredGroup: 8 },
    { kana: 'アカルイ', romaji: 'akarui', meaning: 'bright', requiredGroup: 8 },
    { kana: 'フルサト', romaji: 'furusato', meaning: 'hometown', requiredGroup: 8 },
    { kana: 'レキシ', romaji: 'rekishi', meaning: 'history', requiredGroup: 8 },
    { kana: 'キレイ', romaji: 'kirei', meaning: 'pretty', requiredGroup: 8 },
    { kana: 'ヒロイ', romaji: 'hiroi', meaning: 'wide', requiredGroup: 8 },
    { kana: 'ヨワイ', romaji: 'yowai', meaning: 'weak', requiredGroup: 8 },
    { kana: 'ハルヤスミ', romaji: 'haruyasumi', meaning: 'spring vacation', requiredGroup: 8 },
    { kana: 'ニワトリ', romaji: 'niwatori', meaning: 'chicken', requiredGroup: 8 },

    // group 9 — ン
    { kana: 'ホン', romaji: 'hon', meaning: 'book', requiredGroup: 9 },
    { kana: 'サン', romaji: 'san', meaning: 'three', requiredGroup: 9 },
    { kana: 'ニホン', romaji: 'nihon', meaning: 'Japan', requiredGroup: 9 },
    { kana: 'センセイ', romaji: 'sensei', meaning: 'teacher', requiredGroup: 9 },
    { kana: 'オンナ', romaji: 'onna', meaning: 'woman', requiredGroup: 9 },
    { kana: 'ミンナ', romaji: 'minna', meaning: 'everyone', requiredGroup: 9 },
    { kana: 'ホントウ', romaji: 'hontou', meaning: 'really / true', requiredGroup: 9 },
    { kana: 'オンセン', romaji: 'onsen', meaning: 'hot spring', requiredGroup: 9 },
    { kana: 'テンキ', romaji: 'tenki', meaning: 'weather', requiredGroup: 9 },
    { kana: 'ニンキ', romaji: 'ninki', meaning: 'popularity', requiredGroup: 9 },
    { kana: 'カンタン', romaji: 'kantan', meaning: 'simple / easy', requiredGroup: 9 },
    { kana: 'センタク', romaji: 'sentaku', meaning: 'laundry / choice', requiredGroup: 9 },
    { kana: 'レンラク', romaji: 'renraku', meaning: 'contact', requiredGroup: 9 },
    { kana: 'ウンテン', romaji: 'unten', meaning: 'driving', requiredGroup: 9 },
    { kana: 'キンニク', romaji: 'kinniku', meaning: 'muscle', requiredGroup: 9 },
    { kana: 'オカアサン', romaji: 'okaasan', meaning: 'mother', requiredGroup: 9 },
    { kana: 'オトウサン', romaji: 'otousan', meaning: 'father', requiredGroup: 9 },
    { kana: 'ユウハン', romaji: 'yuuhan', meaning: 'dinner', requiredGroup: 9 },

    // ----- stage 2: dakuten (゛) -----

    // group 10 — ガギグゲゴ
    { kana: 'ガクセイ', romaji: 'gakusei', meaning: 'student', requiredGroup: 10 },
    { kana: 'ガイコク', romaji: 'gaikoku', meaning: 'foreign country', requiredGroup: 10 },
    { kana: 'カギ', romaji: 'kagi', meaning: 'key', requiredGroup: 10 },
    { kana: 'ギンコウ', romaji: 'ginkou', meaning: 'bank', requiredGroup: 10 },
    { kana: 'オヨグ', romaji: 'oyogu', meaning: 'to swim', requiredGroup: 10 },
    { kana: 'ゲンキ', romaji: 'genki', meaning: 'healthy / energetic', requiredGroup: 10 },
    { kana: 'ゲツヨウビ', romaji: 'getsuyoubi', meaning: 'monday', requiredGroup: 10 },
    { kana: 'ゴハン', romaji: 'gohan', meaning: 'meal / cooked rice', requiredGroup: 10 },
    { kana: 'ゴゴ', romaji: 'gogo', meaning: 'afternoon', requiredGroup: 10 },

    // group 11 — ザジズゼゾ
    { kana: 'ザッシ', romaji: 'zasshi', meaning: 'magazine', requiredGroup: 11 },
    { kana: 'ザンネン', romaji: 'zannen', meaning: 'unfortunate', requiredGroup: 11 },
    { kana: 'ジカン', romaji: 'jikan', meaning: 'time', requiredGroup: 11 },
    { kana: 'ジショ', romaji: 'jisho', meaning: 'dictionary', requiredGroup: 11 },
    { kana: 'ミズ', romaji: 'mizu', meaning: 'water', requiredGroup: 11 },
    { kana: 'ズット', romaji: 'zutto', meaning: 'all the time', requiredGroup: 11 },
    { kana: 'ゼンブ', romaji: 'zenbu', meaning: 'all', requiredGroup: 11 },
    { kana: 'ゼンゼン', romaji: 'zenzen', meaning: 'not at all', requiredGroup: 11 },
    { kana: 'ゾウ', romaji: 'zou', meaning: 'elephant', requiredGroup: 11 },

    // group 12 — ダヂヅデド
    { kana: 'ダイガク', romaji: 'daigaku', meaning: 'university', requiredGroup: 12 },
    { kana: 'ダレ', romaji: 'dare', meaning: 'who', requiredGroup: 12 },
    { kana: 'デンシャ', romaji: 'densha', meaning: 'train', requiredGroup: 12 },
    { kana: 'デグチ', romaji: 'deguchi', meaning: 'exit', requiredGroup: 12 },
    { kana: 'ドヨウビ', romaji: 'doyoubi', meaning: 'saturday', requiredGroup: 12 },
    { kana: 'ドコ', romaji: 'doko', meaning: 'where', requiredGroup: 12 },

    // group 13 — バビブベボ
    { kana: 'バス', romaji: 'basu', meaning: 'bus', requiredGroup: 13 },
    { kana: 'バンゴウ', romaji: 'bangou', meaning: 'number', requiredGroup: 13 },
    { kana: 'ビョウイン', romaji: 'byouin', meaning: 'hospital', requiredGroup: 13 },
    { kana: 'ブタ', romaji: 'buta', meaning: 'pig', requiredGroup: 13 },
    { kana: 'ベンキョウ', romaji: 'benkyou', meaning: 'study', requiredGroup: 13 },
    { kana: 'ベントウ', romaji: 'bentou', meaning: 'boxed lunch', requiredGroup: 13 },
    { kana: 'ボウシ', romaji: 'boushi', meaning: 'hat', requiredGroup: 13 },
    { kana: 'ボク', romaji: 'boku', meaning: 'I (male)', requiredGroup: 13 },

    // ----- stage 3: handakuten (゜) -----

    // group 14 — パピプペポ
    { kana: 'パン', romaji: 'pan', meaning: 'bread', requiredGroup: 14 },
    { kana: 'パンダ', romaji: 'panda', meaning: 'panda', requiredGroup: 14 },
    { kana: 'ピアノ', romaji: 'piano', meaning: 'piano', requiredGroup: 14 },
    { kana: 'ピンク', romaji: 'pinku', meaning: 'pink', requiredGroup: 14 },
    { kana: 'プール', romaji: 'puuru', meaning: 'pool', requiredGroup: 14 },
    { kana: 'プリン', romaji: 'purin', meaning: 'custard pudding', requiredGroup: 14 },
    { kana: 'ペン', romaji: 'pen', meaning: 'pen', requiredGroup: 14 },
    { kana: 'ページ', romaji: 'peeji', meaning: 'page', requiredGroup: 14 },
    { kana: 'ポケット', romaji: 'poketto', meaning: 'pocket', requiredGroup: 14 },
    { kana: 'ポスト', romaji: 'posuto', meaning: 'mailbox', requiredGroup: 14 },

    // ----- stage 4: combination kana -----

    // group 15 — キャキュキョ
    { kana: 'キャク', romaji: 'kyaku', meaning: 'guest', requiredGroup: 15 },
    { kana: 'キュウ', romaji: 'kyuu', meaning: 'nine', requiredGroup: 15 },
    { kana: 'キョウ', romaji: 'kyou', meaning: 'today', requiredGroup: 15 },

    // group 16 — シャシュショ
    { kana: 'シャシン', romaji: 'shashin', meaning: 'photograph', requiredGroup: 16 },
    { kana: 'シュクダイ', romaji: 'shukudai', meaning: 'homework', requiredGroup: 16 },
    { kana: 'ショウガクセイ', romaji: 'shougakusei', meaning: 'elementary school student', requiredGroup: 16 },

    // group 17 — チャチュチョ
    { kana: 'チャ', romaji: 'cha', meaning: 'tea', requiredGroup: 17 },
    { kana: 'チュウガク', romaji: 'chuugaku', meaning: 'middle school', requiredGroup: 17 },
    { kana: 'チョット', romaji: 'chotto', meaning: 'a little', requiredGroup: 17 },

    // group 18 — ニャニュニョ
    { kana: 'ニャー', romaji: 'nyaa', meaning: 'meow', requiredGroup: 18 },
    { kana: 'コンニャク', romaji: 'konnyaku', meaning: 'konjac', requiredGroup: 18 },

    // group 19 — ヒャヒュヒョ
    { kana: 'ヒャク', romaji: 'hyaku', meaning: 'one hundred', requiredGroup: 19 },

    // group 20 — ミャミュミョ
    { kana: 'ミュージック', romaji: 'myuujikku', meaning: 'music', requiredGroup: 20 },
    { kana: 'ミョウジ', romaji: 'myouji', meaning: 'surname', requiredGroup: 20 },

    // group 21 — リャリュリョ
    { kana: 'リュウ', romaji: 'ryuu', meaning: 'dragon', requiredGroup: 21 },
    { kana: 'リョウリ', romaji: 'ryouri', meaning: 'cooking', requiredGroup: 21 },

    // group 22 — ギャギュギョ
    { kana: 'ギュウニュウ', romaji: 'gyuunyuu', meaning: 'milk', requiredGroup: 22 },
    { kana: 'ギョウザ', romaji: 'gyouza', meaning: 'dumplings', requiredGroup: 22 },

    // group 23 — ジャジュジョ
    { kana: 'ジュウ', romaji: 'juu', meaning: 'ten', requiredGroup: 23 },
    { kana: 'ジョウズ', romaji: 'jouzu', meaning: 'skillful', requiredGroup: 23 },

    // group 24 — ビャビュビョ
    // (all removed)

    // group 25 — ピャピュピョ
    // (all removed)
  ]
};