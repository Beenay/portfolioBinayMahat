#!/usr/bin/env python3
"""Packs the site into folders you can drag onto GitHub's "Upload files" page.

GitHub's web upload takes at most 100 files at a time and can't delete files,
so this tool does the counting for you:

  python3 tools/prepare-upload.py          first run: everything, split into
                                           _upload/batch-1, batch-2, ...
                                           later runs: only files that changed
                                           since your last upload
  python3 tools/prepare-upload.py --done   run this AFTER you have uploaded, to
                                           remember what is now on GitHub

Drag the CONTENTS of each batch folder onto the upload page (folders inside
keep their structure). Files listed under "delete on GitHub" must be removed by
hand there (open the file, three-dot menu, Delete file). Run the site build
(python3 tools/build.py) BEFORE this, so dist/ and index.html are current.
"""
import hashlib, json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, ".upload-manifest.json")
OUT = os.path.join(ROOT, "_upload")
SKIP_DIRS = {".git", "_upload", "node_modules", "__pycache__"}
SKIP_FILES = {".DS_Store", ".upload-manifest.json", ".gitignore"}
BATCH = 90  # under GitHub's 100-files-per-upload limit


def scan():
    found = {}
    for dirpath, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if f in SKIP_FILES:
                continue
            full = os.path.join(dirpath, f)
            rel = os.path.relpath(full, ROOT).replace(os.sep, "/")
            with open(full, "rb") as fh:
                found[rel] = hashlib.sha1(fh.read()).hexdigest()
    return found


def main():
    current = scan()
    if "--done" in sys.argv:
        json.dump(current, open(MANIFEST, "w"), indent=0)
        print(f"Recorded {len(current)} files as uploaded.")
        return
    previous = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
    todo = sorted(p for p in current if previous.get(p) != current[p])
    deleted = sorted(p for p in previous if p not in current)

    shutil.rmtree(OUT, ignore_errors=True)
    for i in range(0, len(todo), BATCH):
        folder = os.path.join(OUT, f"batch-{i // BATCH + 1}")
        for rel in todo[i:i + BATCH]:
            dest = os.path.join(folder, rel)
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.copy2(os.path.join(ROOT, rel), dest)

    kind = "changed or new" if previous else "to upload (first time)"
    print(f"{len(todo)} files {kind}, in {max(1, -(-len(todo) // BATCH)) if todo else 0} batch folder(s) under _upload/")
    if deleted:
        print("\nDelete on GitHub by hand:")
        for p in deleted:
            print("  -", p)
    if not todo and not deleted:
        print("Nothing changed since the last upload.")
    print("\nAfter uploading, run:  python3 tools/prepare-upload.py --done")


if __name__ == "__main__":
    main()
