/**
 * Bildbeskrivningar per asset (nyckel = sökväg utan filändelse).
 * Stilen läggs på av gen-prompts.mjs; här står bara VAD som ska ritas.
 */
export const STYLE =
  'Flat cartoon illustration in the spirit of 1990s Swedish children’s edutainment CD-ROM games: ' +
  'bold dark outlines, warm saturated colors, simple friendly shapes, slight painterly texture. ' +
  'No text, no letters, no logos, no watermark.';

export const ISOLATED =
  'Single object, centered, side view facing right, isolated on a solid pure white background, no shadow, no ground.';

export const DESCRIPTIONS = {
  // Chassin (512x256, sidovy, golvlinje i nedre delen, plats för hjul)
  'parts/chassis_rost': 'Old rusty small car body without wheels, orange-brown rust patches, dented, cheerful',
  'parts/chassis_badkar': 'White enamel bathtub with claw feet removed, used as a car body, blue rim, no wheels',
  'parts/chassis_lada': 'Wooden crate car body made of pine planks with nails, no wheels',
  'parts/chassis_tunna': 'Blue steel oil barrel lying on its side used as a car body, no wheels',
  'parts/chassis_kanot': 'Green wooden canoe used as a long car body, no wheels',
  'parts/chassis_buss': 'Long yellow toy bus body with many windows, no wheels',
  // Hjul (160x160, centrerade)
  'parts/wheel_cykel': 'Bicycle wheel with thin spokes and a narrow black tire',
  'parts/wheel_traktor': 'Big chunky tractor wheel with deep tread and red hub',
  'parts/wheel_vagn': 'Small pram wheel with white rubber tire and chrome hub',
  'parts/wheel_ost': 'Round wheel of yellow cheese with holes, used as a car wheel',
  'parts/wheel_klump': 'Lumpy black rubber ball wheel with knobby grip',
  'parts/wheel_skate': 'Tiny orange skateboard wheel',
  'parts/wheel_fjader': 'Wheel made of a coiled silver spring with a rubber rim',
  'parts/wheel_kvarnsten': 'Heavy grey stone millstone wheel with a square hole',
  // Motorer (192x160)
  'parts/motor_gummiband': 'Toy motor made of a big wound-up red rubber band on a wooden frame',
  'parts/motor_hamster': 'Hamster running inside an exercise wheel mounted on a small engine block',
  'parts/motor_moped': 'Small blue moped engine with a chrome exhaust pipe',
  'parts/motor_anga': 'Little copper steam boiler with a chimney and pressure gauge',
  'parts/motor_raket': 'Red and white toy rocket engine with a nozzle at the back',
  'parts/motor_flakt': 'Big propeller fan in a round cage, like an airboat fan',
  // Ratt (128x128)
  'parts/steering_styre': 'Bicycle handlebar with a bell and rubber grips',
  'parts/steering_ratt': 'Classic round car steering wheel, dark red',
  'parts/steering_grytlock': 'Silver pot lid with a black knob, used as a steering wheel',
  // Säte (160x160)
  'parts/seat_pall': 'Small wooden three-legged stool',
  'parts/seat_fatolj': 'Cozy green armchair with a pillow',
  'parts/seat_hink': 'Upside-down red plastic bucket used as a seat',
  'parts/seat_soffa': 'Small striped sofa with cushions',
  // Ljus (96x96)
  'parts/light_ficklampa': 'Yellow flashlight, beam pointing right',
  'parts/light_lykta': 'Old brass lantern with a candle inside',
  'parts/light_disco': 'Sparkling mirror disco ball',
  // Tak (384x160)
  'parts/roof_paraply': 'Open striped umbrella seen from the side, red and white',
  'parts/roof_plat': 'Corrugated tin roof sheet, grey with a few rust spots',
  'parts/roof_talt': 'Small orange camping tent roof',
  // Extra (128x128)
  'parts/extra_tuta': 'Brass bulb horn with a red rubber bulb',
  'parts/extra_bubbel': 'Little bubble machine with a fan and soap bubbles coming out',
  'parts/extra_flagga': 'Small triangular pennant flag on a pole, blue and yellow',
  'parts/extra_radio': 'Retro portable radio with an antenna, teal',
  'parts/extra_antenn': 'Wobbly car antenna with a small ball on top',
  'parts/extra_skruvburk': 'Glass jar full of loose screws and nuts, lid off',
  // Bakgrunder
  'bg/yard': 'Wide scene of a friendly scrapyard on a sunny day: wooden fence, blue sky with clouds, sandy ground, a few tires and barrels at the edges, open sandy space in the lower half',
  'bg/garage': 'Wide interior of a cozy workshop garage: brick walls, tool shelves along the sides, a big empty concrete floor in the middle, warm light from a window',
  'bg/track_sky': 'Wide bright blue sky with soft white cartoon clouds and a warm sun, seamless horizontally',
  'bg/track_hills': 'Wide rolling green cartoon hills with a few trees and a red cottage, transparent above the hills, seamless horizontally',
  'bg/track_ground': 'Seamless tile of cartoon grass on top and brown soil with little stones below',
  // Figurer (384x512, fötter på samma höjd)
  'char/skruvis_idle': 'Friendly rusty orange robot mechanic with a screwdriver hand and big round eyes, standing, full body',
  'char/skruvis_wave': 'Friendly rusty orange robot mechanic with a screwdriver hand, waving happily, full body',
  'char/skruvis_cheer': 'Friendly rusty orange robot mechanic with both arms up cheering, full body',
  'char/skruvis_think': 'Friendly rusty orange robot mechanic scratching its head thoughtfully, full body',
  'char/mira_idle': 'Cheerful child in a teal overall and an oversized yellow helmet, standing, full body',
  'char/mira_wave': 'Cheerful child in a teal overall and an oversized yellow helmet, waving, full body',
  'char/mira_cheer': 'Cheerful child in a teal overall and an oversized yellow helmet, jumping with joy, full body',
  'char/mira_think': 'Cheerful child in a teal overall and an oversized yellow helmet, finger on chin thinking, full body',
  // Knappar (128x128, rund/rundad form, tydlig symbol)
  'ui/btn_yard': 'Round game button icon with a heap of scrap parts',
  'ui/btn_garage': 'Round game button icon with a little garage house and a wrench',
  'ui/btn_drive': 'Round game button icon with a small car and speed lines',
  'ui/btn_gas': 'Round green game button icon with a big upward arrow',
  'ui/btn_brake': 'Round red game button icon with a raised open hand',
  'ui/btn_reset': 'Round game button icon with a circular arrow',
  'ui/btn_save': 'Round game button icon with a pink heart',
  'ui/btn_sound': 'Round game button icon with a loudspeaker',
  'ui/btn_tilt': 'Round game button icon with a tilted tablet and a curved arrow',
  'ui/token': 'Shiny golden hex nut icon',
  'ui/rotate': 'Icon of a tablet rotating from portrait to landscape with a curved arrow',
  // Högar
  'props/pile_chassis': 'Heap of old car bodies and a bathtub',
  'props/pile_wheel': 'Heap of assorted wheels and tires',
  'props/pile_motor': 'Heap of small engines and gears',
  'props/pile_steering': 'Heap of steering wheels and handlebars',
  'props/pile_seat': 'Heap of old chairs, stools and cushions',
  'props/pile_light': 'Heap of lamps, lanterns and flashlights',
  'props/pile_roof': 'Heap of umbrellas, tin sheets and tent cloth',
  'props/pile_extra': 'Heap of horns, flags, radios and jars of screws',
};
