import json, re, pathlib, subprocess
root = pathlib.Path(__file__).parent
plan = (root/'src/plan-data.json').read_text()
eng = (root/'src/engine.js').read_text().replace('__PLAN__', plan)
(root/'public/engine.js').write_text(eng)
if (root/'src/index.html').exists():
    (root/'public/index.html').write_text((root/'src/index.html').read_text())
# piano settimanale per il promemoria su Google Calendar (serve Node)
subprocess.run(['node', str(root/'piano-json.js')], check=True)
print('ok')
