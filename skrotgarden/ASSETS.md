# Skrotgården – assets

Genererad av `npm run gen:assets` från `src/data/`. Redigera inte för hand.

## Så funkar det
- Alla bilder ligger i `public/assets/` och är **PNG med transparens** (utom bakgrunder).
- Platshållare är **SVG med samma basnamn**. Spelet laddar `.png` först och faller
  tillbaka på `.svg` – **droppa bara in PNG-filen så används den direkt**.
- Måtten nedan är 1x. Rita gärna i **2x** (dubbla måtten) och exportera i 1x-måttet,
  eller leverera 2x – spelet skalar ändå till en designyta på 1600×1000.
- Namngivning: `parts/<slot>_<id>.png`, `bg/<scen>.png`, `char/<namn>_<pose>.png`,
  `ui/btn_<namn>.png`, `props/pile_<slot>.png`.
- Delar ritas **från sidan, vända åt höger** (körriktning). Hjul ritas centrerade.
- Chassin: hjul och övriga delar snappar mot fasta punkter i chassi-bilden (se nedan),
  så rita chassit så att golvlinjen ligger i nedre delen av bilden.

## Sprite-mått per slot
| Slot | Mått (px) | Antal delar |
|---|---|---|
| Chassi (`chassis`) | 512×256 | 6 |
| Hjul (`wheel`) | 160×160 | 8 |
| Motor (`motor`) | 192×160 | 6 |
| Ratt (`steering`) | 128×128 | 3 |
| Säte (`seat`) | 160×160 | 4 |
| Ljus (`light`) | 96×96 | 3 |
| Tak (`roof`) | 384×160 | 3 |
| Extra (`extra`) | 128×128 | 6 |

## Fästpunkter i chassin (px från övre vänstra hörnet i 512×256)
- **Rostbaljan** (`rost`): hjul (110,220) (400,220) · motor (120,120) · steering (250,90) · seat (330,130) · light (40,150) · roof (300,30) · extra (460,110)
- **Badkaret** (`badkar`): hjul (110,220) (400,220) · motor (120,120) · steering (250,90) · seat (330,130) · light (40,150) · roof (300,30) · extra (460,110)
- **Trälådan** (`lada`): hjul (110,220) (400,220) · motor (120,120) · steering (250,90) · seat (330,130) · light (40,150) · roof (300,30) · extra (460,110)
- **Oljetunnan** (`tunna`): hjul (110,220) (400,220) · motor (120,120) · steering (250,90) · seat (330,130) · light (40,150) · roof (300,30) · extra (460,110)
- **Kanoten** (`kanot`): hjul (90,220) (256,225) (420,220) · motor (120,120) · steering (250,90) · seat (330,130) · light (40,150) · roof (300,30) · extra (460,110)
- **Långa Lisa** (`buss`): hjul (70,220) (190,220) (320,220) (440,220) · motor (120,120) · steering (250,90) · seat (330,130) · light (40,150) · roof (256,20) · extra (460,110)

## Delar
| Fil | Mått (px) | Vad | Anteckning | PNG finns |
|---|---|---|---|---|
| `parts/chassis_rost.png` | 512×256 | Rostbaljan | Quirk: rattle | ⬜ |
| `parts/chassis_badkar.png` | 512×256 | Badkaret | Quirk: bubbles | ⬜ |
| `parts/chassis_lada.png` | 512×256 | Trälådan |  | ⬜ |
| `parts/chassis_tunna.png` | 512×256 | Oljetunnan | Quirk: wobble | ⬜ |
| `parts/chassis_kanot.png` | 512×256 | Kanoten |  | ⬜ |
| `parts/chassis_buss.png` | 512×256 | Långa Lisa | Quirk: music | ⬜ |
| `parts/wheel_cykel.png` | 160×160 | Cykelhjul |  | ⬜ |
| `parts/wheel_traktor.png` | 160×160 | Traktorhjul |  | ⬜ |
| `parts/wheel_vagn.png` | 160×160 | Barnvagnshjul | Quirk: squeak | ⬜ |
| `parts/wheel_ost.png` | 160×160 | Osthjul | Quirk: wobble | ⬜ |
| `parts/wheel_klump.png` | 160×160 | Gummiklumpar |  | ⬜ |
| `parts/wheel_skate.png` | 160×160 | Skateboardhjul | Quirk: rattle | ⬜ |
| `parts/wheel_fjader.png` | 160×160 | Fjäderhjul | Quirk: sparkle | ⬜ |
| `parts/wheel_kvarnsten.png` | 160×160 | Kvarnstenar | Quirk: lose_screw | ⬜ |
| `parts/motor_gummiband.png` | 192×160 | Gummibandet |  | ⬜ |
| `parts/motor_hamster.png` | 192×160 | Hamsterhjulet | Quirk: squeak | ⬜ |
| `parts/motor_moped.png` | 192×160 | Mopedmotorn | Quirk: rattle | ⬜ |
| `parts/motor_anga.png` | 192×160 | Ångpannan | Quirk: smoke | ⬜ |
| `parts/motor_raket.png` | 192×160 | Raketen | Quirk: confetti | ⬜ |
| `parts/motor_flakt.png` | 192×160 | Fläkten | Quirk: bubbles | ⬜ |
| `parts/steering_styre.png` | 128×128 | Cykelstyret |  | ⬜ |
| `parts/steering_ratt.png` | 128×128 | Bilratten |  | ⬜ |
| `parts/steering_grytlock.png` | 128×128 | Grytlocket | Quirk: rattle | ⬜ |
| `parts/seat_pall.png` | 160×160 | Pallen |  | ⬜ |
| `parts/seat_fatolj.png` | 160×160 | Fåtöljen |  | ⬜ |
| `parts/seat_hink.png` | 160×160 | Hinken | Quirk: wobble | ⬜ |
| `parts/seat_soffa.png` | 160×160 | Soffan | Quirk: music | ⬜ |
| `parts/light_ficklampa.png` | 96×96 | Ficklampan |  | ⬜ |
| `parts/light_lykta.png` | 96×96 | Lyktan |  | ⬜ |
| `parts/light_disco.png` | 96×96 | Discokulan | Quirk: sparkle | ⬜ |
| `parts/roof_paraply.png` | 384×160 | Paraplyet |  | ⬜ |
| `parts/roof_plat.png` | 384×160 | Plåttaket | Quirk: rattle | ⬜ |
| `parts/roof_talt.png` | 384×160 | Tältet |  | ⬜ |
| `parts/extra_tuta.png` | 128×128 | Tutan | Quirk: honk | ⬜ |
| `parts/extra_bubbel.png` | 128×128 | Bubbelmaskinen | Quirk: bubbles | ⬜ |
| `parts/extra_flagga.png` | 128×128 | Flaggan |  | ⬜ |
| `parts/extra_radio.png` | 128×128 | Radion | Quirk: music | ⬜ |
| `parts/extra_antenn.png` | 128×128 | Antennen | Quirk: sparkle | ⬜ |
| `parts/extra_skruvburk.png` | 128×128 | Skruvburken | Quirk: lose_screw | ⬜ |

## Bakgrunder
| Fil | Mått (px) | Vad | Anteckning | PNG finns |
|---|---|---|---|---|
| `bg/yard.png` | 2048×1280 | Skrotgården | Gård med staket, himmel, plats för högar i nedre halvan. | ⬜ |
| `bg/garage.png` | 2048×1280 | Garaget | Verkstad, tomt golv i mitten (bilen ritas ovanpå), hyllor längs kanterna. | ⬜ |
| `bg/track_sky.png` | 2048×1280 | Bana: himmel | Bakersta parallaxlagret. Kaklas horisontellt – kanterna måste matcha. | ⬜ |
| `bg/track_hills.png` | 2048×640 | Bana: kullar | Mellanlager, transparent ovanför kullarna. Kaklas horisontellt. | ⬜ |
| `bg/track_ground.png` | 256×256 | Bana: mark | Kaklad marktextur (gräs/jord), sömlös i x-led. | ⬜ |

## Figurer
Alla poser för samma figur ska ha fötterna på samma höjd så de kan bytas rakt av.

| Fil | Mått (px) | Vad | Anteckning | PNG finns |
|---|---|---|---|---|
| `char/skruvis_idle.png` | 384×512 | Skruvis (idle) | Rostig, snäll robot-mekaniker med skruvmejsel-hand. | ⬜ |
| `char/skruvis_wave.png` | 384×512 | Skruvis (wave) | Rostig, snäll robot-mekaniker med skruvmejsel-hand. | ⬜ |
| `char/skruvis_cheer.png` | 384×512 | Skruvis (cheer) | Rostig, snäll robot-mekaniker med skruvmejsel-hand. | ⬜ |
| `char/skruvis_think.png` | 384×512 | Skruvis (think) | Rostig, snäll robot-mekaniker med skruvmejsel-hand. | ⬜ |
| `char/mira_idle.png` | 384×512 | Mira (idle) | Barn i overall och för stor hjälm. | ⬜ |
| `char/mira_wave.png` | 384×512 | Mira (wave) | Barn i overall och för stor hjälm. | ⬜ |
| `char/mira_cheer.png` | 384×512 | Mira (cheer) | Barn i overall och för stor hjälm. | ⬜ |
| `char/mira_think.png` | 384×512 | Mira (think) | Barn i overall och för stor hjälm. | ⬜ |

## Knappar och UI
Rund/rundad form, tydlig symbol, ingen text.

| Fil | Mått (px) | Vad | Anteckning | PNG finns |
|---|---|---|---|---|
| `ui/btn_yard.png` | 128×128 | Knapp: till skrotgården | Hög med skrot. | ⬜ |
| `ui/btn_garage.png` | 128×128 | Knapp: till garaget | Litet hus med skiftnyckel. | ⬜ |
| `ui/btn_drive.png` | 128×128 | Knapp: provkör | Bil med fartstreck. | ⬜ |
| `ui/btn_gas.png` | 128×128 | Knapp: gas | Grön pil uppåt / fot på pedal. | ⬜ |
| `ui/btn_brake.png` | 128×128 | Knapp: broms | Röd hand / stopp. | ⬜ |
| `ui/btn_reset.png` | 128×128 | Knapp: börja om | Rund pil. | ⬜ |
| `ui/btn_save.png` | 128×128 | Knapp: spara bil | Stjärna/hjärta. | ⬜ |
| `ui/btn_sound.png` | 128×128 | Knapp: ljud på/av | Högtalare. | ⬜ |
| `ui/btn_tilt.png` | 128×128 | Knapp: lutningsstyrning på/av | Lutad surfplatta med pil. | ⬜ |
| `ui/token.png` | 96×96 | Plock-polett (en skruv = en del att plocka) | Glansig skruv/mutter. Visas i rad uppe till vänster. | ⬜ |
| `ui/rotate.png` | 256×256 | Vrid enheten (visas i porträttläge) | Surfplatta som roterar till landskap. | ⬜ |

## Högar på skrotgården
| Fil | Mått (px) | Vad | Anteckning | PNG finns |
|---|---|---|---|---|
| `props/pile_chassis.png` | 320×256 | Hög: Chassi | Hög med chassi-delar på skrotgården. | ⬜ |
| `props/pile_wheel.png` | 320×256 | Hög: Hjul | Hög med hjul-delar på skrotgården. | ⬜ |
| `props/pile_motor.png` | 320×256 | Hög: Motor | Hög med motor-delar på skrotgården. | ⬜ |
| `props/pile_steering.png` | 320×256 | Hög: Ratt | Hög med ratt-delar på skrotgården. | ⬜ |
| `props/pile_seat.png` | 320×256 | Hög: Säte | Hög med säte-delar på skrotgården. | ⬜ |
| `props/pile_light.png` | 320×256 | Hög: Ljus | Hög med ljus-delar på skrotgården. | ⬜ |
| `props/pile_roof.png` | 320×256 | Hög: Tak | Hög med tak-delar på skrotgården. | ⬜ |
| `props/pile_extra.png` | 320×256 | Hög: Extra | Hög med extra-delar på skrotgården. | ⬜ |

## Ljud
Ligger i `public/assets/sfx/<id>.wav` (platshållare, genererade av `npm run gen:sfx`).
Riktiga ljud levereras som `.mp3` eller `.wav` med samma basnamn; `.mp3` vinner om den finns.

| Fil | Längd | Vad | Loop |
|---|---|---|---|
| `sfx/pick.wav` | ~0.15s | Plocka upp en del |  |
| `sfx/snap.wav` | ~0.2s | Del snäpper fast |  |
| `sfx/nope.wav` | ~0.25s | Del passar inte (mjukt, inte negativt) |  |
| `sfx/engine.wav` | ~1s | Motor-loop | ja |
| `sfx/horn.wav` | ~0.5s | Tuta |  |
| `sfx/bubbles.wav` | ~0.6s | Bubblor |  |
| `sfx/clunk.wav` | ~0.3s | Skruv trillar av |  |
| `sfx/whoosh.wav` | ~0.4s | Scenbyte |  |
| `sfx/cheer.wav` | ~1s | Hurra! (klarade backen) |  |
| `sfx/sparkle.wav` | ~0.5s | Glitter |  |
