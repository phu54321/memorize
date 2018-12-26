# Wordlist sorter

lns = open('wordlist.js', 'r').readlines();
words = lns[1:-4]
words = [w[5:-3] for w in words]

def w2v(w):
    v = [0] * 26
    for ch in w:
        v[ord(ch) - ord('a')] += 1
    return tuple(v)

words = [(w2v(w), w) for w in words]
words.sort()

with open('wordlist.js', 'w') as wf:
    wf.write("window.wordList = [\n")
    for w in words:
        wf.write("    \"%s\",\n" % w[1])
    wf.write("""\
];
""")
