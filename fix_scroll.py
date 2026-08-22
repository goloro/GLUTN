import re

with open('HTML/settings.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'body\s*\{\s*height:\s*100vh;\s*height:\s*100dvh;\s*overflow:\s*hidden;\s*\}', '', content)
content = re.sub(r'overflow-y:\s*auto;', '', content)

with open('HTML/settings.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed body overflow hidden")
