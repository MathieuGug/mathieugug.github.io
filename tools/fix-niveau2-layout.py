# -*- coding: utf-8 -*-
"""
Fix niveau-2 layout : single-column slots + viewBox aspect 1.66 (matche stage)
- Repositionne les <g id="n2-{sub}"> à col=0 (avant : 2 cols × 7 rangs)
- Met à jour les data-niveau2-viewbox pour étendre horizontalement et
  centrer le contenu (évite révéler le slot voisin)
"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'evaluation-agentique/20260521-evaluation-agentique-canvas.html'

SLOTS_ORDER = ['S0','S1','S2','S3','S4','S5','S6','S7',
               'C1','C2','C3','C4','C5','C6']
SLOT_W = 2000
SLOT_H = 2700
START_Y = 3100
ROW_GAP = 100
ZOOM_VB_W = 4500
ZOOM_VB_H = 2700
ZOOM_VB_X_OFFSET = -(ZOOM_VB_W - SLOT_W) // 2  # -1250

def slot_y(idx):
    return START_Y + idx * (SLOT_H + ROW_GAP)

def slot_vb(idx):
    return f'{ZOOM_VB_X_OFFSET} {slot_y(idx)} {ZOOM_VB_W} {ZOOM_VB_H}'

with open(PATH, encoding='utf-8') as f:
    html = f.read()

# 1) Mettre à jour les transform des <g id="n2-XX">
n_translates = 0
for idx, sub in enumerate(SLOTS_ORDER):
    y = slot_y(idx)
    # Match : <g id="n2-S0" data-niveau2-id="S0" transform="translate(X, Y)" ... or transform="translate(X, Y) scale(...)">
    pat = re.compile(
        rf'(<g id="n2-{sub}" data-niveau2-id="{sub}" transform=")translate\([^)]+\)([^"]*")'
    )
    new = pat.sub(rf'\1translate(0, {y})\2', html, count=1)
    if new != html:
        n_translates += 1
        html = new
    else:
        print(f'  ! transform n2-{sub} not matched')
print(f'Niveau-2 translates repositionnés : {n_translates}/14')

# 2) Mettre à jour data-niveau2-viewbox des sub-cards
n_vb = 0
for idx, sub in enumerate(SLOTS_ORDER):
    new_vb = slot_vb(idx)
    pat = re.compile(rf'(data-niveau2-target="{sub}"[^>]*data-niveau2-viewbox=")[^"]*(")')
    new1 = pat.sub(rf'\g<1>{new_vb}\2', html, count=1)
    pat2 = re.compile(rf'(data-niveau2-viewbox=")[^"]*("[^>]*data-niveau2-target="{sub}")')
    new2 = pat2.sub(rf'\g<1>{new_vb}\2', new1, count=1)
    if new2 != html:
        html = new2
        n_vb += 1
    else:
        print(f'  ! data-niveau2-viewbox {sub} not matched')
print(f'Sub-cards viewbox mis à jour : {n_vb}/14')

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print('\nDone.')
