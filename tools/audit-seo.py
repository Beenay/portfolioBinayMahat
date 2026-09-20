#!/usr/bin/env python3
"""SEO and accessibility audit of index.html. Run by tools/build.py.

Same checklist as the Remote Colleagues site's scripts/audit-build.mjs,
adapted to this single page:
  title (present, under 70 chars) · meta description (present, under 165) ·
  canonical + og:url + og:image + twitter:image (once SITE_URL is set) ·
  og:title / og:description / twitter:card · real content page is not noindex ·
  own meta keywords · valid JSON-LD structured data · every <img> has alt text
  and an explicit loading="lazy"/"eager" · every inline <svg> is aria-hidden ·
  one <h1>, html lang, viewport, favicon · robots.txt (and sitemap.xml with URL)
Exits 1 when something fails. Items that wait on SITE_URL are only warnings.
"""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
site_url_set = "--site-url-set" in sys.argv
issues, warnings = [], []

def get(rx):
    m = re.search(rx, html)
    return m.group(1) if m else None

title = get(r"<title>([^<]*)</title>")
if not title: issues.append("missing <title>")
elif len(title) > 70: issues.append(f"<title> too long ({len(title)} chars, aim under 70)")

desc = get(r'<meta name="description" content="([^"]*)"')
if not desc: issues.append("missing meta description")
elif len(desc) > 165: issues.append(f"meta description too long ({len(desc)} chars, aim under 165)")

for label, rx in (("canonical link", r'<link rel="canonical" href="([^"]*)"'),
                  ("og:url", r'<meta property="og:url" content="([^"]*)"'),
                  ("og:image", r'<meta property="og:image" content="([^"]*)"'),
                  ("twitter:image", r'<meta name="twitter:image" content="([^"]*)"')):
    if not get(rx):
        (issues if site_url_set else warnings).append(
            f"missing {label}" + ("" if site_url_set else " (waiting on SITE_URL in tools/build.py)"))

for tag in ("og:title", "og:description"):
    if not get(rf'<meta property="{tag}" content="([^"]*)"'): issues.append(f"missing {tag}")
if not get(r'<meta name="twitter:card" content="([^"]*)"'): issues.append("missing twitter:card")
if re.search(r'<meta name="robots" content="noindex', html): issues.append("real content page unexpectedly has noindex")
if not get(r'<meta name="keywords" content="([^"]*)"'): issues.append("missing meta keywords")

blocks = re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', html)
if not blocks: issues.append("missing structured data (schema.org JSON-LD)")
for b in blocks:
    try: json.loads(b)
    except ValueError: issues.append("structured data block is not valid JSON")

for tag in re.findall(r"<img\b[^>]*>", html):
    alt = re.search(r'alt="([^"]*)"', tag)
    if not alt or not alt.group(1).strip(): issues.append(f"<img> missing alt text: {tag[:70]}")
    if not re.search(r'loading="(lazy|eager)"', tag): issues.append(f'<img> missing explicit loading="lazy"/"eager": {tag[:70]}')
for tag in re.findall(r"<svg\b[^>]*>", html):
    if 'aria-hidden="true"' not in tag: issues.append(f'<svg> missing aria-hidden="true": {tag[:70]}')

if len(re.findall(r"<h1\b", html)) != 1: issues.append("page must have exactly one <h1>")
if not re.search(r'<html lang="[a-z-]+"', html): issues.append("missing <html lang>")
if 'name="viewport"' not in html: issues.append("missing viewport meta")
if 'rel="icon"' not in html: issues.append("missing favicon link")
if not os.path.exists(os.path.join(ROOT, "robots.txt")): issues.append("missing robots.txt")
if site_url_set and not os.path.exists(os.path.join(ROOT, "sitemap.xml")): issues.append("missing sitemap.xml")

for w in warnings: print("  warning:", w)
if issues:
    print("SEO audit found issues:")
    for i in issues: print("  -", i)
    sys.exit(1)
print("SEO audit passed" + (" (with warnings above)" if warnings else ""))
