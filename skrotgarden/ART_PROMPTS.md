# Skrotgården – bildprompter

Genererad av `node scripts/gen-prompts.mjs`. En rad per asset i ASSETS.md.
Modell: Recraft V4.1 (standard, 1k), vit bakgrund + bakgrundsborttagning för
allt utom bakgrunder. Efter generering: lägg filerna i en mapp med namn
`<kategori>_<id>.png` (t.ex. `parts_wheel_cykel.png`) och kör
`node scripts/import-art.mjs <mapp>` som skalar till rätt mått och lägger
dem i `public/assets/`.

## Gemensam stil
> Flat cartoon illustration in the spirit of 1990s Swedish children’s edutainment CD-ROM games: bold dark outlines, warm saturated colors, simple friendly shapes, slight painterly texture. No text, no letters, no logos, no watermark.

## Prompter
| Asset | Mått | Ratio | Prompt |
|---|---|---|---|
| `parts/chassis_rost` | 512×256 | 16:9 | Old rusty small car body without wheels, orange-brown rust patches, dented, cheerful Leave empty space along the bottom where wheels will be attached. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/chassis_badkar` | 512×256 | 16:9 | White enamel bathtub with claw feet removed, used as a car body, blue rim, no wheels Leave empty space along the bottom where wheels will be attached. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/chassis_lada` | 512×256 | 16:9 | Wooden crate car body made of pine planks with nails, no wheels Leave empty space along the bottom where wheels will be attached. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/chassis_tunna` | 512×256 | 16:9 | Blue steel oil barrel lying on its side used as a car body, no wheels Leave empty space along the bottom where wheels will be attached. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/chassis_kanot` | 512×256 | 16:9 | Green wooden canoe used as a long car body, no wheels Leave empty space along the bottom where wheels will be attached. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/chassis_buss` | 512×256 | 16:9 | Long yellow toy bus body with many windows, no wheels Leave empty space along the bottom where wheels will be attached. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/wheel_cykel` | 160×160 | 1:1 | Bicycle wheel with thin spokes and a narrow black tire Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/wheel_traktor` | 160×160 | 1:1 | Big chunky tractor wheel with deep tread and red hub Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/wheel_vagn` | 160×160 | 1:1 | Small pram wheel with white rubber tire and chrome hub Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/wheel_ost` | 160×160 | 1:1 | Round wheel of yellow cheese with holes, used as a car wheel Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/wheel_klump` | 160×160 | 1:1 | Lumpy black rubber ball wheel with knobby grip Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/wheel_skate` | 160×160 | 1:1 | Tiny orange skateboard wheel Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/wheel_fjader` | 160×160 | 1:1 | Wheel made of a coiled silver spring with a rubber rim Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/wheel_kvarnsten` | 160×160 | 1:1 | Heavy grey stone millstone wheel with a square hole Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/motor_gummiband` | 192×160 | 4:3 | Toy motor made of a big wound-up red rubber band on a wooden frame Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/motor_hamster` | 192×160 | 4:3 | Hamster running inside an exercise wheel mounted on a small engine block Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/motor_moped` | 192×160 | 4:3 | Small blue moped engine with a chrome exhaust pipe Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/motor_anga` | 192×160 | 4:3 | Little copper steam boiler with a chimney and pressure gauge Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/motor_raket` | 192×160 | 4:3 | Red and white toy rocket engine with a nozzle at the back Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/motor_flakt` | 192×160 | 4:3 | Big propeller fan in a round cage, like an airboat fan Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/steering_styre` | 128×128 | 1:1 | Bicycle handlebar with a bell and rubber grips Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/steering_ratt` | 128×128 | 1:1 | Classic round car steering wheel, dark red Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/steering_grytlock` | 128×128 | 1:1 | Silver pot lid with a black knob, used as a steering wheel Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/seat_pall` | 160×160 | 1:1 | Small wooden three-legged stool Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/seat_fatolj` | 160×160 | 1:1 | Cozy green armchair with a pillow Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/seat_hink` | 160×160 | 1:1 | Upside-down red plastic bucket used as a seat Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/seat_soffa` | 160×160 | 1:1 | Small striped sofa with cushions Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/light_ficklampa` | 96×96 | 1:1 | Yellow flashlight, beam pointing right Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/light_lykta` | 96×96 | 1:1 | Old brass lantern with a candle inside Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/light_disco` | 96×96 | 1:1 | Sparkling mirror disco ball Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/roof_paraply` | 384×160 | 16:9 | Open striped umbrella seen from the side, red and white Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/roof_plat` | 384×160 | 16:9 | Corrugated tin roof sheet, grey with a few rust spots Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/roof_talt` | 384×160 | 16:9 | Small orange camping tent roof Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/extra_tuta` | 128×128 | 1:1 | Brass bulb horn with a red rubber bulb Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/extra_bubbel` | 128×128 | 1:1 | Little bubble machine with a fan and soap bubbles coming out Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/extra_flagga` | 128×128 | 1:1 | Small triangular pennant flag on a pole, blue and yellow Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/extra_radio` | 128×128 | 1:1 | Retro portable radio with an antenna, teal Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/extra_antenn` | 128×128 | 1:1 | Wobbly car antenna with a small ball on top Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `parts/extra_skruvburk` | 128×128 | 1:1 | Glass jar full of loose screws and nuts, lid off Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `bg/yard` | 2048×1280 | 3:2 | Wide scene of a friendly scrapyard on a sunny day: wooden fence, blue sky with clouds, sandy ground, a few tires and barrels at the edges, open sandy space in the lower half Wide landscape composition, no characters. |
| `bg/garage` | 2048×1280 | 3:2 | Wide interior of a cozy workshop garage: brick walls, tool shelves along the sides, a big empty concrete floor in the middle, warm light from a window Wide landscape composition, no characters. |
| `bg/track_sky` | 2048×1280 | 3:2 | Wide bright blue sky with soft white cartoon clouds and a warm sun, seamless horizontally Wide landscape composition, no characters. |
| `bg/track_hills` | 2048×640 | 16:9 | Wide rolling green cartoon hills with a few trees and a red cottage, transparent above the hills, seamless horizontally Wide landscape composition, no characters. |
| `bg/track_ground` | 256×256 | 1:1 | Seamless tile of cartoon grass on top and brown soil with little stones below |
| `char/skruvis_idle` | 384×512 | 3:4 | Friendly rusty orange robot mechanic with a screwdriver hand and big round eyes, standing, full body Full body visible, feet at the bottom edge, friendly expression. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `char/skruvis_wave` | 384×512 | 3:4 | Friendly rusty orange robot mechanic with a screwdriver hand, waving happily, full body Full body visible, feet at the bottom edge, friendly expression. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `char/skruvis_cheer` | 384×512 | 3:4 | Friendly rusty orange robot mechanic with both arms up cheering, full body Full body visible, feet at the bottom edge, friendly expression. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `char/skruvis_think` | 384×512 | 3:4 | Friendly rusty orange robot mechanic scratching its head thoughtfully, full body Full body visible, feet at the bottom edge, friendly expression. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `char/mira_idle` | 384×512 | 3:4 | Cheerful child in a teal overall and an oversized yellow helmet, standing, full body Full body visible, feet at the bottom edge, friendly expression. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `char/mira_wave` | 384×512 | 3:4 | Cheerful child in a teal overall and an oversized yellow helmet, waving, full body Full body visible, feet at the bottom edge, friendly expression. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `char/mira_cheer` | 384×512 | 3:4 | Cheerful child in a teal overall and an oversized yellow helmet, jumping with joy, full body Full body visible, feet at the bottom edge, friendly expression. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `char/mira_think` | 384×512 | 3:4 | Cheerful child in a teal overall and an oversized yellow helmet, finger on chin thinking, full body Full body visible, feet at the bottom edge, friendly expression. Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/btn_yard` | 128×128 | 1:1 | Round game button icon with a heap of scrap parts Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/btn_garage` | 128×128 | 1:1 | Round game button icon with a little garage house and a wrench Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/btn_drive` | 128×128 | 1:1 | Round game button icon with a small car and speed lines Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/btn_gas` | 128×128 | 1:1 | Round green game button icon with a big upward arrow Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/btn_brake` | 128×128 | 1:1 | Round red game button icon with a raised open hand Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/btn_reset` | 128×128 | 1:1 | Round game button icon with a circular arrow Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/btn_save` | 128×128 | 1:1 | Round game button icon with a pink heart Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/btn_sound` | 128×128 | 1:1 | Round game button icon with a loudspeaker Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/btn_tilt` | 128×128 | 1:1 | Round game button icon with a tilted tablet and a curved arrow Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/token` | 96×96 | 1:1 | Shiny golden hex nut icon Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `ui/rotate` | 256×256 | 1:1 | Icon of a tablet rotating from portrait to landscape with a curved arrow Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `props/pile_chassis` | 320×256 | 4:3 | Heap of old car bodies and a bathtub Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `props/pile_wheel` | 320×256 | 4:3 | Heap of assorted wheels and tires Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `props/pile_motor` | 320×256 | 4:3 | Heap of small engines and gears Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `props/pile_steering` | 320×256 | 4:3 | Heap of steering wheels and handlebars Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `props/pile_seat` | 320×256 | 4:3 | Heap of old chairs, stools and cushions Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `props/pile_light` | 320×256 | 4:3 | Heap of lamps, lanterns and flashlights Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `props/pile_roof` | 320×256 | 4:3 | Heap of umbrellas, tin sheets and tent cloth Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
| `props/pile_extra` | 320×256 | 4:3 | Heap of horns, flags, radios and jars of screws Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground. |
