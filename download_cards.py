#!/usr/bin/env python3
"""
실패 카드 29장 보충 다운로드
- 다양한 파일명 패턴 시도
- Wikimedia 검색 API fallback
- 이미 있는 파일 건너뛰기
- 429 완벽 대응
"""

import os
import time
import json
import urllib.request
import urllib.parse
import urllib.error

# ============================================
# 설정
# ============================================
OUTPUT_BASE = "images/cards"
DELAY = 5.0
RETRY_MAX = 3
RETRY_WAIT = 20
THUMB_WIDTH = 400

HEADERS = {
    'User-Agent': 'TarotLearningApp/1.0 (educational tarot project; Python)'
}

os.makedirs(f"{OUTPUT_BASE}/minor", exist_ok=True)

# ============================================
# 안전한 API 요청
# ============================================
def api_request(params):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    for attempt in range(RETRY_MAX):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=20) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = RETRY_WAIT * (attempt + 1)
                print(f"      ⏳ 429 - {wait}초 대기... ({attempt+1}/{RETRY_MAX})")
                time.sleep(wait)
                continue
            return None
        except Exception:
            if attempt < RETRY_MAX - 1:
                time.sleep(5)
                continue
            return None
    return None

# ============================================
# Wikimedia 파일 존재 확인 + URL
# ============================================
def check_file(filename):
    params = {
        "action": "query",
        "titles": f"File:{filename}",
        "prop": "imageinfo",
        "iiprop": "url",
        "iiurlwidth": str(THUMB_WIDTH),
        "format": "json"
    }
    data = api_request(params)
    if not data:
        return None
    pages = data.get("query", {}).get("pages", {})
    for pid, pdata in pages.items():
        if pid == "-1":
            return None
        info = pdata.get("imageinfo", [{}])
        if info:
            return info[0].get("thumburl") or info[0].get("url")
    return None

# ============================================
# 파일 다운로드
# ============================================
def download_url(url, dest):
    for attempt in range(RETRY_MAX):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                with open(dest, 'wb') as f:
                    f.write(data)
                return len(data)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = RETRY_WAIT * (attempt + 1)
                print(f"      ⏳ 429 - {wait}초 대기... ({attempt+1}/{RETRY_MAX})")
                time.sleep(wait)
                continue
            return 0
        except Exception:
            if attempt < RETRY_MAX - 1:
                time.sleep(5)
                continue
            return 0
    return 0

# ============================================
# Wikimedia 검색으로 파일 찾기
# ============================================
def search_card(query):
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srnamespace": "6",
        "srlimit": "10",
        "format": "json"
    }
    data = api_request(params)
    if not data:
        return None
    results = data.get("query", {}).get("search", [])
    for r in results:
        title = r.get("title", "")
        if not title.startswith("File:"):
            continue
        fname = title[5:].lower()
        if any(kw in fname for kw in ["rws", "rider", "waite", "smith", "tarot"]):
            if fname.endswith((".jpg", ".jpeg", ".png")):
                return title[5:]
    return None

# ============================================
# 실패 카드 목록 생성
# ============================================
def build_missing_list():
    suits_wiki = {
        "wands":     ["Wands"],
        "cups":      ["Cups"],
        "swords":    ["Swords"],
        "pentacles": ["Pentacles", "Pents", "Coins"],
    }

    rank_wiki = {
        "01": ["Ace", "01", "1", "ace"],
        "02": ["02", "2", "Two"],
        "03": ["03", "3", "Three"],
        "04": ["04", "4", "Four"],
        "05": ["05", "5", "Five"],
        "06": ["06", "6", "Six"],
        "07": ["07", "7", "Seven"],
        "08": ["08", "8", "Eight"],
        "09": ["09", "9", "Nine"],
        "10": ["10", "Ten"],
        "11": ["Page", "11", "page"],
        "12": ["Knight", "12", "knight"],
        "13": ["Queen", "13", "queen"],
        "14": ["King", "14", "king"],
    }

    rank_search_name = {
        "01": "Ace", "02": "Two", "03": "Three", "04": "Four",
        "05": "Five", "06": "Six", "07": "Seven", "08": "Eight",
        "09": "Nine", "10": "Ten", "11": "Page", "12": "Knight",
        "13": "Queen", "14": "King",
    }

    failed = [
        ("wands",     ["01", "11", "12", "13", "14"]),
        ("cups",      ["01", "11", "12", "13", "14"]),
        ("swords",    ["01", "11", "12", "13", "14"]),
        ("pentacles", [f"{i:02d}" for i in range(1, 15)]),
    ]

    missing = []
    for suit, ranks in failed:
        for rank in ranks:
            app_name = f"{suit}-{rank}.jpg"
            dest = f"{OUTPUT_BASE}/minor/{app_name}"

            if os.path.exists(dest) and os.path.getsize(dest) > 1000:
                continue

            candidates = []
            for ws in suits_wiki[suit]:
                for wr in rank_wiki[rank]:
                    candidates.append(f"{ws}{wr}.jpg")
                    candidates.append(f"{ws}_{wr}.jpg")
                    candidates.append(f"{ws} {wr}.jpg")
                    candidates.append(f"RWS Tarot {ws} {wr}.jpg")
                    candidates.append(f"RWS_Tarot_{ws}_{wr}.jpg")

            rname = rank_search_name[rank]
            suit_cap = suit.capitalize()
            search_queries = [
                f"RWS Tarot {rname} {suit_cap}",
                f"Rider-Waite {rname} of {suit_cap}",
                f"Rider Waite Smith {rname} {suit_cap}",
                f"Pamela Colman Smith {rname} {suit_cap}",
            ]

            missing.append({
                "app_name": app_name,
                "dest": dest,
                "candidates": candidates,
                "search_queries": search_queries,
            })

    return missing

# ============================================
# 메인
# ============================================
def main():
    print()
    print("=" * 60)
    print("  🎴 실패 카드 보충 다운로드")
    print("  📁 소스: Wikimedia Commons (Public Domain)")
    print("  ⏱️  간격: 5초 / 429시 20초 대기")
    print("=" * 60)

    missing = build_missing_list()

    if not missing:
        print("\n  🎉 보충할 카드가 없습니다! 모두 완료!")
        return

    print(f"\n  📋 보충 필요: {len(missing)}장")
    print("-" * 60)

    success = 0
    fail = 0
    failed_list = []

    for i, card in enumerate(missing):
        idx = f"[{i+1:2d}/{len(missing)}]"
        found = False

        # ---- 방법 1: 후보 파일명 직접 확인 ----
        print(f"  {idx} {card['app_name']}")
        print(f"        후보 {len(card['candidates'])}개 시도 중...")

        for cand in card["candidates"]:
            url = check_file(cand)
            time.sleep(DELAY)

            if url:
                size = download_url(url, card["dest"])
                time.sleep(DELAY)

                if size > 0:
                    size_kb = size / 1024
                    print(f"        ✅ OK ({size_kb:.0f}KB) ← {cand}")
                    success += 1
                    found = True
                    break

        if found:
            continue

        # ---- 방법 2: 검색 API ----
        print(f"        후보 실패 → 검색 시도...")

        for sq in card["search_queries"]:
            print(f"        검색: {sq}")
            wiki_file = search_card(sq)
            time.sleep(DELAY)

            if wiki_file:
                print(f"        발견: {wiki_file}")
                url = check_file(wiki_file)
                time.sleep(DELAY)

                if url:
                    size = download_url(url, card["dest"])
                    time.sleep(DELAY)

                    if size > 0:
                        size_kb = size / 1024
                        print(f"        ✅ OK ({size_kb:.0f}KB) ← {wiki_file}")
                        success += 1
                        found = True
                        break

        if not found:
            print(f"        ❌ 실패")
            fail += 1
            failed_list.append(card["app_name"])

    # ------------------------------------------
    # 결과
    # ------------------------------------------
    print("\n" + "=" * 60)
    print("  📊 보충 결과")
    print("=" * 60)

    major_dir = f"{OUTPUT_BASE}/major"
    minor_dir = f"{OUTPUT_BASE}/minor"
    major_count = len([f for f in os.listdir(major_dir) if f.lower().endswith(('.jpg','.jpeg','.png'))]) if os.path.exists(major_dir) else 0
    minor_count = len([f for f in os.listdir(minor_dir) if f.lower().endswith(('.jpg','.jpeg','.png'))]) if os.path.exists(minor_dir) else 0

    print(f"  ✅ 보충 성공: {success}장")
    print(f"  ❌ 보충 실패: {fail}장")
    print(f"  📁 major/ : {major_count}/22 장")
    print(f"  📁 minor/ : {minor_count}/56 장")
    print(f"  📊 합계   : {major_count + minor_count}/78 장")

    total_size = 0
    for folder in [major_dir, minor_dir]:
        if os.path.exists(folder):
            for f in os.listdir(folder):
                fp = os.path.join(folder, f)
                if os.path.isfile(fp):
                    total_size += os.path.getsize(fp)
    print(f"  💾 총 용량: {total_size / 1024 / 1024:.2f} MB")

    if failed_list:
        print(f"\n  ⚠️  최종 실패:")
        for f in failed_list:
            print(f"     - {f}")
        print(f"\n  💡 최종 실패 카드는 수동 다운로드가 필요합니다.")
        print(f"  💡 아래 사이트에서 검색:")
        print(f"     https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck")
        print(f"     https://en.wikipedia.org/wiki/Rider-Waite_Tarot")
        print(f"\n  💡 또는 앱에서 SVG 플레이스홀더가 자동 표시됩니다.")
    else:
        print(f"\n  🎉 모든 카드 보충 완료!")

    if major_count + minor_count == 78:
        print(f"\n  📌 GitHub 업로드:")
        print(f"     git add .")
        print(f'     git commit -m "Add 78 RWS tarot card images"')
        print(f"     git push origin main")

    print("=" * 60)


if __name__ == "__main__":
    main()