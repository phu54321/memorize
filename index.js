// import wordList from './wordlist';

// From https://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/
function binaryIndexOf(searchElement) {
    'use strict';

    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = this[currentIndex];

        if (currentElement < searchElement) {
            minIndex = currentIndex + 1;
        }
        else if (currentElement > searchElement) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }

    return -1;
}

Array.prototype.binaryIndexOf = binaryIndexOf;


var caesarShift = function(str, amount) {

    // Wrap the amount
    if (amount < 0)
        return caesarShift(str, amount + 26);

    // Make an output variable
    var output = '';

    // Go through each character
    for (var i = 0; i < str.length; i ++) {

        // Get the character we'll be appending
        var c = str[i];

        // If it's a letter...
        if (c.match(/[a-z]/i)) {

            // Get its code
            var code = str.charCodeAt(i);

            // Uppercase letters
            if ((code >= 65) && (code <= 90))
                c = String.fromCharCode(((code - 65 + amount) % 26) + 65);

            // Lowercase letters
            else if ((code >= 97) && (code <= 122))
                c = String.fromCharCode(((code - 97 + amount) % 26) + 97);

        }

        // Append
        output += c;

    }

    // All done!
    return output;

};


function update () {
    var inputElmn = document.getElementById('input');
    var inp = inputElmn.value;

    var htmlArray = [];
    htmlArray.push('<table><thead><th>Shift</th><th>Word</th><th>Shifted</th></thead>');
    var candidates = findAllCandidate(inp);
    candidates.forEach(args => {
        const [rotate, repr, word] = args;
        htmlArray.push(
            '<tr>',
            '<td>', rotate.toString(), '</td>',
            '<td>', repr, '</td>',
            '<td>', caesarShift(word, -rotate), '</td>',
            '</tr>'
        );
    });
    htmlArray.push('</table>');

    var outputElmn = document.getElementById('output');
    outputElmn.innerHTML = htmlArray.join('');
}


function word2vec(word) {
    const vec = new Array(26).fill(0);
    for(let i = 0 ; i < word.length ; i++) {
        const ch = word.charCodeAt(i);
        if(64 + 1 <= ch && ch <= 64 + 26) vec[ch - 64 - 1]++;
        if(96 + 1 <= ch && ch <= 96 + 26) vec[ch - 96 - 1]++;
    }
    return vec;
}

const wordVectorList = [];
window.wordList.forEach(w => {
    wordVectorList.push(word2vec(w));
});


function rotateVec(v, rot) {
    const len = v.length;

    rot = rot % len;
    if(rot < 0) rot += len;

    const v2 = new Array(v.length);
    for(let i = 0 ; i < len ; i++) {
        v2[(i + rot) % len] = v[i];
    }
    return v2;
}

// Given a word, find a predicate
function findAllCandidate(w) {
    const arrs = w.split(' ').filter(x => x);
    if (arrs.length <= 1) return [];

    const candidates = [];

    const vi = new Array(arrs.length).fill(0);
    for(;;) {
        const chArr = [];
        for(let i = 0 ; i < vi.length ; i++) {
            chArr.push(arrs[i][vi[i]]);
        }
        candidates.push(...findWordCandidate(chArr.join('')));

        let cursor = 0;
        while(cursor < arrs.length) {
            vi[cursor]++;
            if(vi[cursor] < arrs[cursor].length) break;
            else vi[cursor++] = 0;
        }
        if(cursor == arrs.length) break;
    }
    candidates.sort((a, b) => {
        return Math.abs(a[0]) - Math.abs(b[0]);
    });
    return candidates;
}

function findWordCandidate(w) {
    const baseV = word2vec(w);
    const candidates = [];
    for(let rotate = -12 ; rotate < 13 ; rotate++) {
    // for(let rotate = 0 ; rotate == 0; rotate++) {
        const v = rotateVec(baseV, rotate);
        const baseIndex = wordVectorList.binaryIndexOf(v);
        if(baseIndex == -1) continue;

        let minIndex = baseIndex - 1;
        while(minIndex >= 0 && wordVectorList[minIndex] >= v) minIndex--;
        minIndex++;

        let maxIndex = baseIndex + 1;
        while(maxIndex < wordVectorList.length && wordVectorList[maxIndex] <= v) maxIndex++;
        maxIndex--;

        for(let index = minIndex ; index <= maxIndex ; index++) {
            const latin = window.wordList[index];
            let repr = latin;
            if (korMapper[w]) repr = korMapper[w].join(', ');
            candidates.push([
                rotate,
                latin,
                repr,
            ]);
        }
    }
    return candidates;
}
