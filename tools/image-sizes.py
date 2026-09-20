#!/usr/bin/env python3
"""Adds w/h (real pixel size) to every image entry in js/data.js.

Browsers need width/height on an <img> to reserve its space before it loads
(no layout jump, and Lighthouse's "unsized images" check passes). Run this
after adding or replacing images:   python3 tools/image-sizes.py
Needs ImageMagick's `identify`. Safe to re-run: it rewrites the w/h it wrote.
"""
import re, subprocess, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(root, "js", "data.js")
text = open(path, encoding="utf-8").read()

def size(src):
    out = subprocess.run(["identify", "-format", "%w %h", os.path.join(root, src) + "[0]"],
                         capture_output=True, text=True).stdout.split()
    return (int(out[0]), int(out[1])) if len(out) == 2 else None

def fix(m):
    src = m.group(2)
    wh = size(src)
    if not wh: return m.group(0)
    return f'{m.group(1)}"{src}", w: {wh[0]}, h: {wh[1]}'

# matches   { src: "assets/...",   optionally already followed by w:/h:
pattern = re.compile(r'(\{ src: )"(assets/[^"]+)"(?:, w: \d+, h: \d+)?')
new = pattern.sub(fix, text)
open(path, "w", encoding="utf-8").write(new)
print("updated", len(pattern.findall(text)), "image entries")
