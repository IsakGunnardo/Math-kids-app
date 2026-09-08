# Skrotgården

Lugn, barnvänlig sandlåda (3–7 år): bygg en bil av skrotdelar och provkör den.
Ingen text behövs, inga fail-states, inga timers.

## Köra

```bash
cd skrotgarden
npm install
npm run dev        # http://localhost:5174 (även på iPad i samma nät via --host)
npm run build      # typkontroll + produktionsbygge till dist/
npm run gen        # regenerera platshållar-assets + ASSETS.md + ljud
```

## Teknik
- Vite + TypeScript + React (byggskärm, DOM-baserad drag & drop)
- Matter.js i `<canvas>` för körfysiken
- Zustand + localStorage (`skrotgarden-v1`) för state och sparade bilar
- Ingen backend, ingen nätverkstrafik i runtime

## Struktur
```
src/
  data/        ren speldata: types, slots, parts/, assets (mått), sfx
  systems/     logik utan rendering: carStats, asset-laddning
  state/       zustand-store
  components/  Stage (1600×1000 designyta), Sprite, knappar, nav
  scenes/      YardScene, GarageScene, DriveScene
scripts/       genererar platshållar-SVG/WAV och ASSETS.md ur src/data
public/assets/ parts/ bg/ char/ ui/ props/ sfx/
```
Ingen fil över 200 rader. Rendering är skild från speldata.

## Spelloop och progression
- Man börjar med ett litet startkit och tre skruvar (plock).
- Varje hög på skrotgården ger en slumpad ny del ur sin kategori för en skruv.
  Hjul kan man ha flera av (upp till fyra likadana), annars en av varje.
- Delmål på banan ger nya skruvar: första backen, hoppet, stora backen (1 var)
  och målflaggan (2). Räknas en gång per besök på banan.
- Knappen för nästa rimliga steg pulserar. Inga fail-states.

## Assets
Se [ASSETS.md](./ASSETS.md). Platshållare är SVG; droppa in en PNG med samma
basnamn så används den automatiskt.

## Byggordning
1. ✅ Skelett + scenväxling + platshållar-assets + ASSETS.md
2. ✅ Garaget: inventarie, drag & drop, snap, spara/ladda
3. ✅ Körningen: Matter.js, bana, egenskaper från delar
4. ✅ Skrotgården: plocka delar, progression
5. ✅ Ljud, quirks, polish
