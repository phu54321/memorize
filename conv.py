import re
import hgtk
import json

cvTb = {}

for line in open('Korean.aff', 'r', encoding='utf-8').readlines():
    match = re.match(r'^ICONV (.+) (.+)$', line)
    if match:
        cvTb[match.group(2)] = match.group(1)

lines = [line.strip() for line in  open('test.txt', 'r', encoding='utf-8').readlines() if line]

print(len(lines), lines[0])

words = []

for line in lines:
    match = re.match(r'^(.+?)(/\d+)?$', line)
    if not match:
        print(line)
        continue
    uncomposed = match.group(1)
    composed = []
    i = 0
    while i < len(uncomposed):
        oldI = i
        for j in range(3, 0, -1):
            if uncomposed[i:i + j] in cvTb:
                composed.append(cvTb[uncomposed[i:i+j]])
                i += j

        if i == oldI:
            break

    if i < len(uncomposed):
        continue

    composed = ''.join(composed)
    words.append(composed)

print(len(words))
open('hangul.json', 'w', encoding='utf-8').write(json.dumps(words, indent=4))
