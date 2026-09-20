#!/usr/bin/env python3
"""Bundles and minifies the site for production. Run after ANY change:

    python3 tools/build.py

What it does
  1. (if ImageMagick is installed) fills in image w/h in js/data.js
  2. joins css/*.css into  dist/site.min.css   (in the order listed below)
  3. joins js/*.js  into  dist/site.min.js    (in the order listed below)
  4. stamps each file's content hash into index.html as its ?v= number, so
     browsers re-download a file exactly when it changed (no manual bumping)
  5. with SITE_URL set: writes the canonical / og:url / og:image tags,
     robots.txt and sitemap.xml; then runs tools/audit-seo.py

Edit the source files in css/ and js/, never the files in dist/. Needs Node
(uses `npx esbuild` for minifying). GitHub Pages serves dist/ as committed.
"""
import hashlib, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# The live address of the site, with no trailing slash. While empty, the build
# skips the tags and files that need an absolute address (canonical link,
# og:url, og:image, twitter:image, sitemap.xml). Set it once and rebuild.
SITE_URL = ""

# order matters: later files may use names defined by earlier ones
CSS = ["fonts", "base", "background", "layout", "hero", "lightbox", "music",
       "timeline", "gallery", "pagenav", "responsive"]
JS = ["data", "hovertooltip", "arrowbutton", "stick", "lightbox", "marquee",
      "gallery", "timeline", "pagenav", "music", "main"]


def join(kind, names):
    parts = []
    for n in names:
        with open(os.path.join(ROOT, kind, n + "." + kind), encoding="utf-8") as f:
            parts.append(f.read().rstrip("\n") + "\n")
    return "\n".join(parts)


def minify(src_text, ext, out_path):
    tmp = os.path.join(ROOT, "dist", "_tmp." + ext)
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(src_text)
    r = subprocess.run(["npx", "--yes", "esbuild", tmp, "--minify", "--outfile=" + out_path],
                       capture_output=True, text=True)
    os.remove(tmp)
    if r.returncode != 0:
        sys.exit("esbuild failed:\n" + r.stderr)


def main():
    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    if shutil.which("identify"):
        subprocess.run([sys.executable, os.path.join(ROOT, "tools", "image-sizes.py")], check=True)

    outputs = {}
    for kind, names in (("css", CSS), ("js", JS)):
        out = os.path.join(ROOT, "dist", "site.min." + kind)
        minify(join(kind, names), kind, out)
        with open(out, "rb") as f:
            outputs[kind] = hashlib.sha256(f.read()).hexdigest()[:8]
        print(f"dist/site.min.{kind}  {os.path.getsize(out) // 1024} KB  v={outputs[kind]}")

    path = os.path.join(ROOT, "index.html")
    html = open(path, encoding="utf-8").read()
    for kind in ("css", "js"):
        html, n = re.subn(r"(dist/site\.min\." + kind + r")\?v=[0-9a-f]+", r"\1?v=" + outputs[kind], html)
        if n != 1:
            sys.exit(f"index.html must reference dist/site.min.{kind} exactly once")
    html = write_site_url_parts(html)
    open(path, "w", encoding="utf-8").write(html)
    print("index.html updated")
    r = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "audit-seo.py")] +
                       (["--site-url-set"] if SITE_URL else []))
    sys.exit(r.returncode)


def write_site_url_parts(html):
    base = SITE_URL.rstrip("/")
    if base:
        block = (f'<link rel="canonical" href="{base}/">\n'
                 f'<meta property="og:url" content="{base}/">\n'
                 f'<meta property="og:image" content="{base}/assets/og-image.png">\n'
                 f'<meta name="twitter:image" content="{base}/assets/og-image.png">\n')
    else:
        block = ""
    html = re.sub(r"(<!-- site-url:start -->\n).*?(<!-- site-url:end -->)",
                  lambda m: m.group(1) + block + m.group(2), html, flags=re.S)
    robots = "User-agent: *\nAllow: /\n" + (f"\nSitemap: {base}/sitemap.xml\n" if base else "")
    open(os.path.join(ROOT, "robots.txt"), "w").write(robots)
    sm = os.path.join(ROOT, "sitemap.xml")
    if base:
        import datetime
        open(sm, "w").write('<?xml version="1.0" encoding="UTF-8"?>\n'
                            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                            f'  <url><loc>{base}/</loc><lastmod>{datetime.date.today()}</lastmod></url>\n'
                            '</urlset>\n')
    elif os.path.exists(sm):
        os.remove(sm)
    return html


if __name__ == "__main__":
    main()
