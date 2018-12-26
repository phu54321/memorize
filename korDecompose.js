const jconv = {
    'ㄱ': 'g',
    'ㄲ': 'g',
    'ㄴ': 'n',
    'ㄷ': 'd',
    'ㄸ': 'd',
    'ㄹ': 'rl',
    'ㅁ': 'm',
    'ㅂ': 'b',
    'ㅃ': 'bp',
    'ㅅ': 's',
    'ㅆ': 's',
    'ㅇ': 'aeiou',
    'ㅈ': 'j',
    'ㅉ': 'j',
    'ㅊ': 'c',
    'ㅋ': 'ck',
    'ㅌ': 't',
    'ㅍ': 'p',
    'ㅎ': 'h',
};

const rCho = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
    'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];
const rJung = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
    'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];
const rJong = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
    'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ',
    'ㅍ', 'ㅎ'
];

function koreanDecomposeCharacter (ch) {
    const nTmp = ch.charCodeAt(0) - 0xAC00;
    const jong = nTmp % 28;
    const jung = ((nTmp - jong) / 28) % 21;
    const cho = (((nTmp - jong) / 28) - jung) / 21;
    return [rCho[cho], rJung[jung], rJong[cho]];
}

function koreanCollectChosung (str) {
    return Array.prototype.map.call(str, ch => koreanDecomposeCharacter(ch)[0]);
}

function koreanCreateCorrespondingString (str) {
    const chosungs = koreanCollectChosung(str).map(ch => jconv[ch]);
    const vi = new Array(chosungs.length).fill(0);
    const strList = [];
    for(;;) {
        const chArr = [];
        for(let i = 0 ; i < vi.length ; i++) {
            chArr.push(chosungs[i][vi[i]]);
        }
        strList.push(chArr.join(''));

        let cursor = 0;
        while(cursor < chosungs.length) {
            vi[cursor]++;
            if(vi[cursor] < chosungs[cursor].length) break;
            else vi[cursor++] = 0;
        }
        if(cursor == chosungs.length) break;
    }

    return strList;
}

window.korMapper = {};

for(const word of window.hangulWordList) {
    for (const engRepr of koreanCreateCorrespondingString(word)) {
        if (!window.korMapper[engRepr]) window.korMapper[engRepr] = [];
        window.korMapper[engRepr].push(word);
        // window.wordList.push(engRepr);  // already inside wordList
    }
}
