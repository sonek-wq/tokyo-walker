#!/usr/bin/env python3
"""TOKYO WALKER のビルド: src/ のファイルを1つの HTML (dist/tokyo_walker.html) にまとめる。

    python3 build.py            # dist/tokyo_walker.html を作る
    python3 build.py --zip      # ついでにソース一式の zip (dist/tokyo_walker_src.zip) も作る

- 結合の順番は src/build_order.txt に書く (上から順に1つの <script type="module"> になる)
- 駅は src/stations/*.js を置くだけで、ファイル名の順 (= JY番号順) に自動で組み込まれる
"""
import pathlib, sys, zipfile

ROOT = pathlib.Path(__file__).resolve().parent
SRC, DIST = ROOT / 'src', ROOT / 'dist'

def build():
    tpl = (SRC / 'index.template.html').read_text(encoding='utf-8')
    order = [l.strip() for l in (SRC / 'build_order.txt').read_text(encoding='utf-8').splitlines()
             if l.strip() and not l.lstrip().startswith('#')]
    stations = sorted((SRC / 'stations').glob('*.js'))
    parts = []
    for rel in order:
        txt = (SRC / rel).read_text(encoding='utf-8')
        if txt.endswith('\n'): txt = txt[:-1]   # ファイル末尾の改行1つ分だけ外す
        if '/*@@STATIONS@@*/' in txt:
            txt = txt.replace('/*@@STATIONS@@*/', '\n'.join(p.read_text(encoding='utf-8').rstrip('\n') for p in stations))
        parts.append(txt)
    listed = set(order) | {p.relative_to(SRC).as_posix() for p in stations}
    missing = [p.relative_to(SRC).as_posix() for p in SRC.rglob('*.js') if p.relative_to(SRC).as_posix() not in listed]
    if missing: print('警告: build_order.txt に載っていないファイル:', ', '.join(missing))
    html = tpl.replace('/*@@BUNDLE@@*/', '\n'.join(parts))
    DIST.mkdir(exist_ok=True)
    out = DIST / 'tokyo_walker.html'
    out.write_text(html, encoding='utf-8')
    print(f'{out.relative_to(ROOT)}  {len(html.encode()) // 1024} KB  ({len(order)} files + {len(stations)} stations)')

def make_zip():
    z = DIST / 'tokyo_walker_src.zip'
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as f:
        for p in sorted(ROOT.rglob('*')):
            rel = p.relative_to(ROOT)
            if p.is_file() and rel.parts[0] not in ('dist', '.git') and '__pycache__' not in rel.parts:
                f.write(p, 'tokyo-walker/' + rel.as_posix())
    print(f'{z.relative_to(ROOT)}  {z.stat().st_size // 1024} KB')

if __name__ == '__main__':
    build()
    if '--zip' in sys.argv: make_zip()
