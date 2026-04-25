import re

with open('/home/carneiro888/ziiiTV/src/services/contentSelector.ts', 'r') as f:
    content = f.read()

# Replace the specific lines with bad escapes and fix the titles

replacements = {
    r"'\\U0001f525 Mais '": r"'🔥 O Que Você '",
    r"'Assistidos'": r"'Mais Assiste'",
    r"'\\U0001f3ac Top 10 '": r"'🎬 Top 10 '",
    r"'\\U0001f4fa Top 10 '": r"'📺 Top 10 '",
    r"'\\u26a1 Top 10 '": r"'⚡ Top 10 '",
    r"'\\u26bd Jogos '": r"'⚽ Jogos '",
    r"'\\u25b6\\ufe0f Top 10 '": r"'▶️ Top 10 '",
}

for old, new in replacements.items():
    content = re.sub(old, new, content)

with open('/home/carneiro888/ziiiTV/src/services/contentSelector.ts', 'w') as f:
    f.write(content)

print("Fixed!")
