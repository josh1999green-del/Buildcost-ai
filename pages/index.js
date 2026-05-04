import { useState, useRef, useCallback, useEffect } from "react";
import Head from "next/head";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PROJECT_TYPES = ["Rear Extension","Loft Conversion","New Build","Basement","Garage Conversion","Refurbishment","Kitchen Fit-out","Bathroom Fit-out","Commercial Fit-out","Groundworks Only","Roofing","Other"];
const STATUSES = ["Quote Sent","In Discussion","Won","Lost","On Hold"];
const STATUS_COL = {"Quote Sent":"#f59e0b","In Discussion":"#60a5fa","Won":"#4caf50","Lost":"#ef5350","On Hold":"#888"};

const SYSTEM_PROMPT = `You are a senior UK quantity surveyor with 25+ years experience producing accurate Bills of Quantities.

OUTPUT RULES — CRITICAL:
- Output ONLY a single raw JSON object. Start with { end with }
- No markdown fences, no explanation, no text before or after
- JSON must be complete and valid — never truncate it
- Keep item descriptions under 80 characters
- Up to 20 items per category — be thorough and detailed

JSON shape (replace all values, keep all keys):
{"projectName":"","projectType":"","projectRef":"","summary":"","totalCost":0,"laborCost":0,"materialCost":0,"plantCost":0,"prelimsCost":0,"contingency":0,"contingencyPercent":10,"designFees":0,"vatAmount":0,"grandTotal":0,"timeline":"","confidence":"High","confidenceReason":"","notes":[],"exclusions":[],"inclusions":[],"categories":[{"name":"","icon":"","subtotal":0,"items":[{"ref":"","name":"","description":"","quantity":0,"unit":"","unitCost":0,"totalCost":0,"supplier":"","notes":""}]}]}

Rules: UK 2025 prices in GBP. grandTotal = (totalCost + contingency + designFees) * 1.20. vatAmount = (totalCost + contingency + designFees) * 0.20. Suppliers: Jewson, Travis Perkins, Screwfix, Selco, MKM, Toolstation, Buildbase.

LEVEL OF DETAIL — THIS IS CRITICAL:
Price every single item down to the smallest component. Do NOT group items together. Every fixing, fitting and consumable gets its own line. Examples of the detail required:

PLUMBING must include individual items such as:
- 22mm copper pipe (per metre)
- 15mm copper pipe (per metre)
- 22mm compression elbows (per nr)
- 15mm compression elbows (per nr)
- 22mm compression tee pieces (per nr)
- 15mm compression tee pieces (per nr)
- 22mm straight couplings (per nr)
- 15mm straight couplings (per nr)
- 22mm gate valves (per nr)
- 15mm isolating valves (per nr)
- PTFE tape (per roll)
- Pipe clips 15mm (per nr)
- Pipe clips 22mm (per nr)
- Pipe lagging/insulation (per metre)
- Soldering flux and solder (per tin)
- Push-fit fittings where specified

ELECTRICAL must include individual items such as:
- 2.5mm 3-core & earth cable (per metre)
- 1.5mm 3-core & earth cable (per metre)
- 6mm 2-core & earth cable (per metre)
- 10mm 2-core & earth cable (per metre)
- 20mm white conduit (per metre)
- 25mm grey conduit (per metre)
- Junction boxes (per nr)
- Back boxes single (per nr)
- Back boxes double (per nr)
- Cable clips (per box of 100)
- Earth sleeving (per metre)
- Consumer unit with MCBs (per nr)
- 32A MCB (per nr)
- 16A MCB (per nr)
- RCD breaker (per nr)
- Electrical tape (per roll)

CARPENTRY/JOINERY must include:
- Screws — specify size e.g. 4x50mm wood screws (per box of 200)
- Screws — specify size e.g. 3.5x40mm wood screws (per box of 200)
- Nails — specify e.g. 75mm round wire nails (per kg)
- Nails — specify e.g. 50mm oval nails (per kg)
- Joist hangers (per nr)
- Restraint straps (per nr)
- Timber connectors/bolts (per nr)
- Expanding bolts/rawlplugs (per box)
- Adhesive PVA (per litre)
- Silicone sealant (per tube)
- Frame fixings (per box)

MASONRY must include:
- Bricks (per thousand)
- Blocks 100mm 7N (per nr or m2)
- Mortar/sand and cement (per tonne/bags)
- DPC (per metre roll)
- Cavity wall ties (per 100)
- Brick ties stainless (per 100)
- Wall plugs (per box)
- Masonry screws (per box)

PLASTERBOARD/DRYLINING must include:
- Plasterboard sheets 12.5mm (per sheet)
- Plasterboard screws (per box of 200)
- Jointing tape (per roll)
- Joint compound/plaster (per bag)
- Corner beads (per nr)
- Angle beads (per nr)
- Plasterboard adhesive (per bag)

ALWAYS include a "Preliminaries & Site Establishment" category with:
- Site toilet hire weekly
- Site toilet servicing weekly
- Scaffold erect, hire and strike
- Skip hire per load
- Concrete mixer hire weekly
- Mini dumper hire weekly
- Power tools hire weekly (drills, grinders, saws)
- Hand wash unit welfare weekly
- PPE and site safety equipment
- Site hoarding/security fencing
- Insurance and preliminaries (1-2% of contract value)

Price every single item. Leave nothing out. A proper BOQ prices every nail and every tube of sealant.`;

const FAIRHAVEN_SPECS = `PROJECT: Ground floor rear extension + internal refurbishment, 2 Fairhaven Avenue, Chorlton, Manchester M21 8TW. Architect: Darwent Architecture March 2026. Drawings BR007-BR014.

EXTERNAL WALLS WT1: 100mm 7N blockwork outer, 90mm Recticel Eurowall+ full-fill cavity insulation, 100mm 7N blockwork inner. Wall ties 750mm horiz/450mm vert. 12.5mm skimmed plasterboard on dabs internally. Silicone render externally. U-value 0.18.
EXISTING WALL DRYLINING WT2: 25x50mm sw battens, 77.5mm Recticel Eurothane PL insulated plasterboard. U-value 0.30.
INTERNAL STUD WALLS WT3: 100x50mm sw studwork 600ctrs, 100mm mineral wool, 12.5mm plasterboard both sides. Wet areas: moisture resistant PB + Schluter-KERDI-BOARD tanking.
ACOUSTIC WALLS WT4: 100x50mm C16 studwork, mineral wool, Gypframe RB1 resilient bars 600ctrs, 2x 12.5mm Gyproc Soundbloc both sides.
BLOCKWORK WALLS WT5: 100mm 7N blockwork, 12.5mm plasterboard on dabs.
EXTENSION FLOOR: 25mm sand blinding, 150mm hardcore, 1200g DPM, 100mm RC25 slab A142 mesh, 100mm Recticel Eurothane GP insulation, 500g DPM, UFH pipes, 75mm sand/cement screed, porcelain tiles 300x400mm on Schluter-DITRA 25. U-value 0.17.
FOUNDATIONS FND1: 600x225mm GEN3 mass concrete strip footing min -0.9m. Footprint approx 6.69x6.58m.
STEEL BEAMS: BM1: 2no 152x89UB bolted. BM2: 120x60RHS6.3 S355 cranked. BM3: 2no 305x102UB28 S355 bolted. BM4: 300x100RHS10 + 8mm plate welded u/s.
PADSTONES: PS1: 440x215x150mm C40/50. PS2-3: 215x100x150mm. PS4: 2no 440x100x215mm. PS5: 600x100x300mm.
LINTELS: LB1: Catnic CG100/100. LB2: Catnic CG50/100. LB3: Catnic CG100/100/2100. LB4: Catnic BHD100.
OAK POSTS TP1: 250x75mm C30 oak posts, galvanised base plates.
ROOF STRUCTURE: 175x47mm C24 rafters 400ctrs. Hip/ridge/trimmer beams TB1-TB7: 2no 47x175 C24 bolted. 100x50mm wallplate + hold-down straps. Rooflight trimmed opening 2200x1120mm.
ZINC STANDING SEAM ROOF: 18mm marine ply, Aludex Max VCL, Metdeck composite panel (Kingspan Resol foam), VMZINC Pigmento Brown. 12.5mm plasterboard underside. U-value 0.15.
ROSEMARY TILED LEAN-TO: Clay rosemary tiles, Code 4 lead flashing, 25x50 battens on Proctor breather membrane, 150x50 C24 rafters 400ctrs, 120mm Recticel between rafters, 50mm Recticel + VCL underside, plasterboard. U-value 0.15.
ROOFLIGHT: 2.2x1.12m Velux Vario fixed, 300mm insulated upstands. U-value 1.3.
DOORS: ED1: SMART Alitherm aluminium RAL7035 U1.4. ED2: SMART Invisoglide 3-pane sliding RAL7035 U1.4. ED3: Aluminium French door RAL7035 U1.4. ED4: Aluminium patio doors U1.4.
WINDOWS: W1-W3: Slim uPVC RAL7035 U1.4. W4: Aluminium obscure glazing. Oriel window copper reveals.
ELECTRICAL: ~40nr double sockets USB-A+C. LED recessed spotlights throughout. UFH manifold to extension. Electric UFH to en-suite. 5no new radiators various BTU. Heated towel rail. Kitchen extract 30 l/s. WC extract 15 l/s. Utility extract 30 l/s. Cat6 data sockets. Security: cameras, contacts, PIR, keypad. Smoke/CO alarms. EV charging point.
PLUMBING/HEATING: Boiler relocated. New boiler flue. UFH to extension. En-suite: shower, WC, basin. WC: WC, basin. Utility: sink, washer/dryer. New MH x2. Pop-up gullies x5. SVP relocated. RWP x4.
EXTERNAL: Indian limestone paving on mortar over 150mm hardcore. 1.8m brick wall + timber fence. New gate. EV charge point.
FINISHES: Silicone render all new external walls. Re-skim existing hall/stairs/landing. Plasterboard and skim all new walls/ceilings. Black uPVC gutters/downpipes. Code 4 lead flashings.
EXCLUDE: Kitchen units and appliances (by others). Landscaping/lawn (by others). Window seat joinery (by others). Built-in storage (by others).`;

const DEMO_ESTIMATE = {
  projectName: "Rear Extension — 4m x 5m (DEMO)",
  projectType: "Rear Extension",
  projectRef: "BCO-DEMO-001",
  summary: "Single storey rear extension with brick and block cavity wall construction, zinc standing seam flat roof with rooflight, bi-fold doors to rear, underfloor heating throughout, full electrical and plumbing installation. This is a DEMO estimate — add your Anthropic API key to generate real estimates.",
  totalCost: 68420,
  laborCost: 28500,
  materialCost: 39920,
  plantCost: 2100,
  prelimsCost: 4800,
  contingency: 6842,
  contingencyPercent: 10,
  designFees: 0,
  vatAmount: 15052,
  grandTotal: 90314,
  timeline: "14-18 weeks",
  confidence: "High",
  confidenceReason: "Demo estimate based on typical North West pricing",
  notes: [
    "This is a DEMO estimate — real estimates require an Anthropic API key",
    "Prices based on North West UK market rates 2025",
    "All quantities based on typical 4m x 5m single storey rear extension",
    "Scaffold included for full duration of works"
  ],
  exclusions: [
    "Kitchen units and appliances (by others)",
    "Floor finishes to existing areas",
    "Landscaping and garden works"
  ],
  inclusions: [
    "All labour and materials",
    "Site toilet and welfare throughout",
    "All tool and plant hire",
    "Scaffold for full duration"
  ],
  categories: [
    { name:"Demolition & Clearance", icon:"🔨", subtotal:2850,
      items:[
        {ref:"A1",name:"Remove existing rear doors/windows",description:"Strip out 2no existing rear openings",quantity:2,unit:"nr",unitCost:175,totalCost:350,supplier:"N/A",notes:""},
        {ref:"A2",name:"Break out existing concrete slab",description:"Break out and remove 20m2 slab",quantity:20,unit:"m²",unitCost:44,totalCost:880,supplier:"N/A",notes:""},
        {ref:"A3",name:"General demolition & clearance",description:"Strip out and remove debris",quantity:1,unit:"nr",unitCost:820,totalCost:820,supplier:"N/A",notes:""},
        {ref:"A4",name:"Skip hire — demolition",description:"2no 8-yard skips",quantity:2,unit:"nr",unitCost:400,totalCost:800,supplier:"Local hire",notes:""}
      ]
    },
    { name:"Groundworks & Foundations", icon:"🌱", subtotal:9800,
      items:[
        {ref:"B1",name:"Strip foundations 600x225mm",description:"GEN3 mass concrete strip footing",quantity:22,unit:"m",unitCost:180,totalCost:3960,supplier:"Jewson",notes:"Min -0.9m below ground"},
        {ref:"B2",name:"Hardcore filling 150mm",description:"Compacted MOT Type 1",quantity:20,unit:"m²",unitCost:18,totalCost:360,supplier:"MKM",notes:""},
        {ref:"B3",name:"Concrete slab RC25 100mm",description:"A142 mesh reinforcement",quantity:20,unit:"m²",unitCost:68,totalCost:1360,supplier:"Jewson",notes:""},
        {ref:"B4",name:"DPM 1200 gauge",description:"Taped seams, continuous",quantity:20,unit:"m²",unitCost:4,totalCost:80,supplier:"Travis Perkins",notes:""},
        {ref:"B5",name:"New manhole complete",description:"Precast concrete MH + cover",quantity:1,unit:"nr",unitCost:850,totalCost:850,supplier:"Jewson",notes:""},
        {ref:"B6",name:"Drainage connections",description:"Pop-up gullies and connections",quantity:3,unit:"nr",unitCost:230,totalCost:690,supplier:"Travis Perkins",notes:""},
        {ref:"B7",name:"Sand blinding 25mm",description:"Over hardcore prior to DPM",quantity:20,unit:"m²",unitCost:8,totalCost:160,supplier:"MKM",notes:""},
        {ref:"B8",name:"Excavation and disposal",description:"Machine dig and remove spoil",quantity:25,unit:"m³",unitCost:46,totalCost:1150,supplier:"N/A",notes:""}
      ]
    },
    { name:"Structural Steelwork", icon:"🔩", subtotal:5200,
      items:[
        {ref:"C1",name:"Steel beam RSJ supply & fix",description:"2no 152x89UB bolted together",quantity:1,unit:"nr",unitCost:1850,totalCost:1850,supplier:"Travis Perkins",notes:"To SE design"},
        {ref:"C2",name:"Padstones C40/50 concrete",description:"440x215x150mm padstones",quantity:4,unit:"nr",unitCost:185,totalCost:740,supplier:"Jewson",notes:""},
        {ref:"C3",name:"Catnic lintels supply & fix",description:"CG100/100 with 150mm bearing",quantity:4,unit:"nr",unitCost:145,totalCost:580,supplier:"Travis Perkins",notes:""},
        {ref:"C4",name:"Structural engineer fees",description:"Design, calcs and inspections",quantity:1,unit:"nr",unitCost:1200,totalCost:1200,supplier:"N/A",notes:""},
        {ref:"C5",name:"Steelwork encasing Fireline",description:"Gyproc Fireline board to all steels",quantity:8,unit:"m²",unitCost:104,totalCost:830,supplier:"Travis Perkins",notes:""}
      ]
    },
    { name:"Masonry & Brickwork", icon:"🧱", subtotal:11200,
      items:[
        {ref:"D1",name:"Cavity wall WT1 — new extension",description:"100mm blockwork, 90mm insulation, block",quantity:42,unit:"m²",unitCost:185,totalCost:7770,supplier:"MKM",notes:"U-value 0.18"},
        {ref:"D2",name:"Recticel Eurowall+ full fill",description:"90mm cavity insulation boards",quantity:42,unit:"m²",unitCost:28,totalCost:1176,supplier:"Travis Perkins",notes:""},
        {ref:"D3",name:"Wall ties stainless steel",description:"750x450mm centres",quantity:42,unit:"m²",unitCost:4,totalCost:168,supplier:"Jewson",notes:""},
        {ref:"D4",name:"Cavity closers with DPC",description:"Kooltherm insulated closers",quantity:18,unit:"m",unitCost:18,totalCost:324,supplier:"Travis Perkins",notes:""},
        {ref:"D5",name:"Internal blockwork partition",description:"100mm 7N blockwork WT5",quantity:12,unit:"m²",unitCost:63,totalCost:756,supplier:"MKM",notes:""},
        {ref:"D6",name:"Stepped DPC",description:"Through construction at threshold",quantity:10,unit:"m",unitCost:21,totalCost:210,supplier:"Jewson",notes:""}
      ]
    },
    { name:"Roofing", icon:"🏠", subtotal:12400,
      items:[
        {ref:"E1",name:"175x47mm C24 rafters 400ctrs",description:"Roof structure to extension",quantity:20,unit:"m²",unitCost:38,totalCost:760,supplier:"Travis Perkins",notes:""},
        {ref:"E2",name:"18mm marine ply decking",description:"WBP ply over rafters",quantity:20,unit:"m²",unitCost:42,totalCost:840,supplier:"MKM",notes:""},
        {ref:"E3",name:"Aludex Max VCL",description:"Bituminous vapour control layer",quantity:20,unit:"m²",unitCost:18,totalCost:360,supplier:"Travis Perkins",notes:""},
        {ref:"E4",name:"Metdeck composite panel",description:"Kingspan Resol rigid foam insulation",quantity:20,unit:"m²",unitCost:95,totalCost:1900,supplier:"Travis Perkins",notes:"U-value 0.15"},
        {ref:"E5",name:"VMZINC Pigmento Brown standing seam",description:"By approved installer",quantity:20,unit:"m²",unitCost:185,totalCost:3700,supplier:"Specialist",notes:""},
        {ref:"E6",name:"Hidden gutter perimeter",description:"Detail TBC with installer",quantity:14,unit:"m",unitCost:145,totalCost:2030,supplier:"Specialist",notes:""},
        {ref:"E7",name:"Velux Vario rooflight 1.2x0.9m",description:"Fixed with 300mm insulated upstands",quantity:1,unit:"nr",unitCost:2200,totalCost:2200,supplier:"Travis Perkins",notes:"U-value 1.3"},
        {ref:"E8",name:"Black uPVC gutters & downpipes",description:"To match existing",quantity:16,unit:"m",unitCost:32,totalCost:512,supplier:"MKM",notes:""}
      ]
    },
    { name:"Doors & Windows", icon:"🪟", subtotal:7800,
      items:[
        {ref:"F1",name:"Bi-fold doors aluminium RAL7035",description:"3-pane SMART Alitherm, U1.4",quantity:1,unit:"nr",unitCost:3800,totalCost:3800,supplier:"Specialist",notes:"Low profile sill"},
        {ref:"F2",name:"Rear door aluminium RAL7035",description:"SMART Alitherm, U1.4",quantity:1,unit:"nr",unitCost:1800,totalCost:1800,supplier:"Specialist",notes:""},
        {ref:"F3",name:"uPVC windows slim profile",description:"RAL7035, U1.4, trickle vents",quantity:2,unit:"nr",unitCost:950,totalCost:1900,supplier:"Specialist",notes:""},
        {ref:"F4",name:"Insulated PB reveals & trickle vents",description:"To all new openings",quantity:4,unit:"nr",unitCost:75,totalCost:300,supplier:"Travis Perkins",notes:""}
      ]
    },
    { name:"Insulation & Floor Finishes", icon:"🧊", subtotal:5900,
      items:[
        {ref:"G1",name:"Recticel Eurothane GP 100mm floor",description:"Rigid insulation over slab",quantity:20,unit:"m²",unitCost:24,totalCost:480,supplier:"Travis Perkins",notes:"U-value 0.17"},
        {ref:"G2",name:"UFH pipes manifold & zone valves",description:"Clipped to insulation",quantity:20,unit:"m²",unitCost:48,totalCost:960,supplier:"MKM",notes:""},
        {ref:"G3",name:"75mm sand/cement screed",description:"Over UFH pipes",quantity:20,unit:"m²",unitCost:32,totalCost:640,supplier:"Jewson",notes:"1mm/day drying"},
        {ref:"G4",name:"Schluter-DITRA 25 membrane",description:"Tanking membrane under tiles",quantity:20,unit:"m²",unitCost:22,totalCost:440,supplier:"Travis Perkins",notes:""},
        {ref:"G5",name:"Porcelain tile fixing 300x400mm",description:"Tiles supplied by client",quantity:20,unit:"m²",unitCost:45,totalCost:900,supplier:"N/A",notes:""},
        {ref:"G6",name:"Perimeter insulation 15mm",description:"Recticel to screed edges",quantity:16,unit:"m",unitCost:8,totalCost:128,supplier:"Travis Perkins",notes:""},
        {ref:"G7",name:"500g isolating DPM",description:"Over insulation, taped",quantity:20,unit:"m²",unitCost:3,totalCost:60,supplier:"Jewson",notes:""},
        {ref:"G8",name:"Dryline existing walls WT2",description:"Recticel Eurothane PL 77.5mm",quantity:18,unit:"m²",unitCost:68,totalCost:1224,supplier:"Travis Perkins",notes:"U-value 0.30"}
      ]
    },
    { name:"Internal Walls & Partitions", icon:"🪵", subtotal:3200,
      items:[
        {ref:"H1",name:"Stud walls WT3 100x50mm",description:"Mineral wool, plasterboard both sides",quantity:22,unit:"m²",unitCost:72,totalCost:1584,supplier:"Travis Perkins",notes:""},
        {ref:"H2",name:"Acoustic wall WT4 Soundbloc",description:"Resilient bars, 2x Soundbloc",quantity:10,unit:"m²",unitCost:110,totalCost:1100,supplier:"Travis Perkins",notes:""},
        {ref:"H3",name:"Schluter-KERDI-BOARD tanking",description:"Wet area wall tanking",quantity:8,unit:"m²",unitCost:64,totalCost:512,supplier:"Travis Perkins",notes:""}
      ]
    },
    { name:"Electrical", icon:"🔌", subtotal:7200,
      items:[
        {ref:"I1",name:"Double sockets USB-A+C",description:"Throughout extension",quantity:18,unit:"nr",unitCost:85,totalCost:1530,supplier:"Screwfix",notes:""},
        {ref:"I2",name:"LED recessed spotlights",description:"Supply and fix throughout",quantity:14,unit:"nr",unitCost:65,totalCost:910,supplier:"Screwfix",notes:""},
        {ref:"I3",name:"UFH manifold & wiring",description:"Zone valves and controls",quantity:1,unit:"nr",unitCost:480,totalCost:480,supplier:"MKM",notes:""},
        {ref:"I4",name:"Extract fan WC/bathroom",description:"15 l/s with 5 min overrun",quantity:1,unit:"nr",unitCost:220,totalCost:220,supplier:"Screwfix",notes:""},
        {ref:"I5",name:"Smoke & CO alarms interlinked",description:"Mains wired throughout",quantity:4,unit:"nr",unitCost:85,totalCost:340,supplier:"Screwfix",notes:""},
        {ref:"I6",name:"First & second fix wiring",description:"Consumer unit upgrade & cert",quantity:1,unit:"nr",unitCost:2800,totalCost:2800,supplier:"N/A",notes:""},
        {ref:"I7",name:"New radiator supply & fix",description:"Various BTU to match rooms",quantity:2,unit:"nr",unitCost:320,totalCost:640,supplier:"MKM",notes:""},
        {ref:"I8",name:"EV charging point external",description:"7kW smart charger",quantity:1,unit:"nr",unitCost:950,totalCost:950,supplier:"Screwfix",notes:""}
      ]
    },
    { name:"Plumbing & Heating", icon:"🚿", subtotal:4800,
      items:[
        {ref:"J1",name:"UFH pipework & manifold",description:"Extension zones, zone valves",quantity:1,unit:"nr",unitCost:1800,totalCost:1800,supplier:"MKM",notes:""},
        {ref:"J2",name:"En-suite shower WC basin",description:"Full fit-out and connections",quantity:1,unit:"nr",unitCost:1800,totalCost:1800,supplier:"Travis Perkins",notes:""},
        {ref:"J3",name:"WC pan and basin",description:"Supply, fix and connect",quantity:1,unit:"nr",unitCost:680,totalCost:680,supplier:"Travis Perkins",notes:""},
        {ref:"J4",name:"Drainage connections",description:"All soil and waste connections",quantity:1,unit:"nr",unitCost:520,totalCost:520,supplier:"Jewson",notes:""}
      ]
    },
    { name:"Plastering & Decorations", icon:"🖌️", subtotal:5820,
      items:[
        {ref:"K1",name:"Plasterboard & skim new areas",description:"12.5mm boards, plaster skim",quantity:90,unit:"m²",unitCost:28,totalCost:2520,supplier:"Travis Perkins",notes:""},
        {ref:"K2",name:"Silicone render external walls",description:"All new external wall faces",quantity:42,unit:"m²",unitCost:48,totalCost:2016,supplier:"Jewson",notes:""},
        {ref:"K3",name:"Decoration mist coat + 2 coats",description:"Throughout new areas",quantity:110,unit:"m²",unitCost:12,totalCost:1320,supplier:"Screwfix",notes:""}
      ]
    },
    { name:"External Works", icon:"🌿", subtotal:2450,
      items:[
        {ref:"L1",name:"Indian limestone paving",description:"35-50mm mortar over hardcore",quantity:16,unit:"m²",unitCost:95,totalCost:1520,supplier:"MKM",notes:"Min 1:80 fall"},
        {ref:"L2",name:"Code 4 lead flashings",description:"To all abutments",quantity:8,unit:"m",unitCost:85,totalCost:680,supplier:"Travis Perkins",notes:""},
        {ref:"L3",name:"New gate supply & hang",description:"Timber gate to match",quantity:1,unit:"nr",unitCost:650,totalCost:650,supplier:"N/A",notes:""}
      ]
    },
    { name:"Preliminaries & Site Establishment", icon:"🏕️", subtotal:4800,
      items:[
        {ref:"M1",name:"Site toilet hire",description:"Chemical toilet weekly hire",quantity:16,unit:"week",unitCost:45,totalCost:720,supplier:"Local hire",notes:"Full duration"},
        {ref:"M2",name:"Site toilet servicing",description:"Weekly service and empty",quantity:16,unit:"week",unitCost:28,totalCost:448,supplier:"Local hire",notes:""},
        {ref:"M3",name:"Scaffold erect hire and strike",description:"Full perimeter 16 weeks",quantity:1,unit:"nr",unitCost:2200,totalCost:2200,supplier:"Local scaffold",notes:""},
        {ref:"M4",name:"Skip hire general waste",description:"8-yard skip x builds",quantity:4,unit:"nr",unitCost:320,totalCost:1280,supplier:"Local hire",notes:""},
        {ref:"M5",name:"Concrete mixer hire",description:"Weekly hire throughout",quantity:6,unit:"week",unitCost:55,totalCost:330,supplier:"HSS Hire",notes:""},
        {ref:"M6",name:"Power tools hire",description:"Drills, grinders, saws weekly",quantity:16,unit:"week",unitCost:95,totalCost:1520,supplier:"HSS Hire",notes:""},
        {ref:"M7",name:"PPE and site safety",description:"Hard hats, boots, hi-vis etc",quantity:1,unit:"nr",unitCost:380,totalCost:380,supplier:"Screwfix",notes:""},
        {ref:"M8",name:"Hand wash unit welfare",description:"Weekly hire",quantity:16,unit:"week",unitCost:22,totalCost:352,supplier:"Local hire",notes:""}
      ]
    }
  ]
};


const REGIONS = [
  { id:"london",     label:"London & SE",         multiplier:1.25 },
  { id:"southeast",  label:"South East",           multiplier:1.12 },
  { id:"southwest",  label:"South West",           multiplier:1.05 },
  { id:"midlands",   label:"Midlands",             multiplier:1.00 },
  { id:"northwest",  label:"North West",           multiplier:0.97 },
  { id:"northeast",  label:"North East",           multiplier:0.93 },
  { id:"yorkshire",  label:"Yorkshire & Humber",   multiplier:0.95 },
  { id:"wales",      label:"Wales",                multiplier:0.92 },
  { id:"scotland",   label:"Scotland",             multiplier:0.98 },
  { id:"nireland",   label:"Northern Ireland",     multiplier:0.90 },
];

const MERCHANTS = [
  "Jewson", "Travis Perkins", "MKM Building Supplies", "Selco",
  "Buildbase", "Screwfix", "Toolstation", "CCF", "SIG", "Huws Gray",
  "Bradfords", "National Timber Group", "Parker Building Supplies", "Other",
];





// ─── HELPERS ──────────────────────────────────────────────────────────────────

const C = { bg:"#080807",surface:"#0f0f0e",card:"#121211",border:"#1e1e1c",gold:"#d4a853",text:"#e8e4dc",muted:"#666",dim:"#3a3a38",green:"#4caf50",red:"#ef5350",amber:"#f59e0b" };

const fmt    = n => new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(n||0);
const fmtDec = n => new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",minimumFractionDigits:2,maximumFractionDigits:2}).format(n||0);
const uid    = () => Math.random().toString(36).slice(2,9);
const today  = () => new Date().toLocaleDateString("en-GB");

const STEPS = ["Reading drawings…","Analysing dimensions…","Computing quantities…","Applying UK 2025 rates…","Compiling BOQ…","Generating report…"];

const extractJSON = raw => {
  const clean = raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  try { return JSON.parse(clean); } catch {}
  const s=clean.indexOf("{"), e=clean.lastIndexOf("}");
  if(s>=0&&e>s){ try{return JSON.parse(clean.slice(s,e+1));}catch{} }
  if(s>=0){
    let p=clean.slice(s).replace(/,\s*"[^"]{0,60}":\s*[^,}\]]*$/,"");
    let ob=0,ab=0; for(const c of p){if(c==="{")ob++;else if(c==="}")ob--;else if(c==="[")ab++;else if(c==="]")ab--;}
    try{return JSON.parse(p+"]".repeat(Math.max(0,ab))+"}".repeat(Math.max(0,ob)));}catch{}
  }
  throw new Error("Could not parse response");
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [view,        setView]        = useState("landing");
  const [files,       setFiles]       = useState([]);
  const [projType,    setProjType]    = useState("");
  const [projDesc,    setProjDesc]    = useState("");
  const [clientName,  setClientName]  = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [siteAddr,    setSiteAddr]    = useState("");
  const [siteContact, setSiteContact] = useState("");
  const [siteNotes,   setSiteNotes]   = useState("");
  const [intNote,     setIntNote]     = useState("");
  const [exclusions,  setExclusions]  = useState("");
  const [overhead,    setOverhead]    = useState(12);
  const [result,      setResult]      = useState(null);
  const [estimates,   setEstimates]   = useState([]);
  const [loadStep,    setLoadStep]    = useState(0);
  const [error,       setError]       = useState("");
  const [expandCat,   setExpandCat]   = useState(null);
  const [dragOver,    setDragOver]    = useState(false);
  const [activeTab,   setActiveTab]   = useState("breakdown");
  const [editMode,    setEditMode]    = useState(false);
  const [emailModal,  setEmailModal]  = useState(false);
  const [emailSent,   setEmailSent]   = useState(false);
  const [region,      setRegion]      = useState("northwest");
  const [merchants,   setMerchants]   = useState(["Jewson","Travis Perkins","MKM Building Supplies"]);
  const [showSettings,setShowSettings]= useState(false);
  // Labour rates — what you pay your lads per day
  const [labourRates, setLabourRates] = useState({
    labourer:    { label:"Labourer",          rate:180 },
    bricklayer:  { label:"Bricklayer",        rate:260 },
    carpenter:   { label:"Carpenter/Joiner",  rate:250 },
    electrician: { label:"Electrician",       rate:300 },
    plumber:     { label:"Plumber/Heating",   rate:290 },
    plasterer:   { label:"Plasterer",         rate:260 },
    roofer:      { label:"Roofer",            rate:270 },
    groundwork:  { label:"Groundworker",      rate:220 },
  });
  // Desired profit margin %
  const [profitMargin, setProfitMargin] = useState(20);
  // Fixings preferences
  const [fixings, setFixings] = useState({
    carpentry:   "screws",   // screws | nails | both
    framing:     "screws",   // screws | nails | both
    decking:     "screws",   // screws | nails | both
    plumbing:    "compression", // compression | soldered | pushfit | mixed
    pipeMaterial:"copper",   // copper | plastic | mixed
    electrical:  "clipped",  // clipped | conduit | trunking
  });
  const fileRef = useRef();

  useEffect(()=>{ try{const s=JSON.parse(localStorage.getItem("bc_v3")||"[]");setEstimates(s);}catch{} },[]);

  const persist = useCallback(list=>{ setEstimates(list); try{localStorage.setItem("bc_v3",JSON.stringify(list));}catch{} },[]);
  const saveEst  = useCallback(est=>{ const e={id:uid(),date:today(),pipelineStatus:"Quote Sent",internalNote:"",...est}; const u=[e,...estimates].slice(0,50); persist(u); return e; },[estimates,persist]);
  const updateEst= useCallback((id,patch)=>{ const u=estimates.map(e=>e.id===id?{...e,...patch}:e); persist(u); if(result?.id===id)setResult(r=>({...r,...patch})); },[estimates,persist,result]);
  const deleteEst= useCallback(id=>{ persist(estimates.filter(e=>e.id!==id)); if(result?.id===id){setResult(null);setView("dashboard");} },[estimates,persist,result]);

  const handleFiles = nf => { const a=Array.from(nf).filter(f=>f.type.startsWith("image/")||f.type==="application/pdf"); setFiles(p=>[...p,...a].slice(0,20)); };

  const applyOverhead = (p,pct) => {
    const m=1+pct/100, sc=n=>Math.round((n||0)*m);
    p.categories=p.categories?.map(cat=>({...cat,subtotal:sc(cat.subtotal),items:cat.items?.map(i=>({...i,unitCost:parseFloat(((i.unitCost||0)*m).toFixed(2)),totalCost:sc(i.totalCost)}))}));
    p.totalCost=sc(p.totalCost);p.materialCost=sc(p.materialCost);p.laborCost=sc(p.laborCost);p.plantCost=sc(p.plantCost);p.prelimsCost=sc(p.prelimsCost);p.contingency=sc(p.contingency);p.designFees=sc(p.designFees);
    const sub=p.totalCost+p.contingency+(p.designFees||0);p.vatAmount=Math.round(sub*0.2);p.grandTotal=sub+p.vatAmount;
    return p;
  };

  const runEstimate = async () => {
    if(!projDesc.trim()&&files.length===0){setError("Please upload drawings or describe your project.");return;}
    setError("");setView("loading");setLoadStep(0);
    const timer=setInterval(()=>setLoadStep(s=>Math.min(s+1,STEPS.length-1)),1400);
    try {
      const isFairhaven=files.some(f=>f.name.includes("BR00")||f.name.includes("BR01")||f.name.includes("491_"));
      const specText=isFairhaven?`\n\nSPECIFICATIONS FROM DRAWINGS:\n${FAIRHAVEN_SPECS}`:files.length>0?`\nDrawings: ${files.map(f=>f.name).join(", ")}`:"";
      const regionData = REGIONS.find(r=>r.id===region)||REGIONS[4];
      const merchantList = merchants.length>0 ? merchants.join(", ") : "Jewson, Travis Perkins";
      const userPrompt=[
        "Produce a full Bill of Quantities and cost estimate.",
        clientName&&`Client: ${clientName}`,
        projType&&`Project type: ${projType}`,
        siteAddr&&`Site: ${siteAddr}`,
        `Region: ${regionData.label} — apply a ${regionData.multiplier >= 1 ? "+" : ""}${Math.round((regionData.multiplier-1)*100)}% regional pricing adjustment to all material and labour rates.`,
        `Preferred building merchants (use these for supplier references): ${merchantList}`,
        projDesc&&`Description: ${projDesc}`,
        specText,
        exclusions.trim()&&`\nEXCLUDE from BOQ (client has separate prices):\n${exclusions}`,
        `\nFIXINGS & MATERIALS PREFERENCES (use these throughout the BOQ):
- Carpentry fixings: ${fixings.carpentry === "both" ? "price both screws AND nails as separate line items" : fixings.carpentry === "screws" ? "use screws throughout (price wood screws, not nails)" : "use nails throughout (price wire nails and oval nails, not screws)"}
- Structural framing fixings: ${fixings.framing === "both" ? "price both framing screws AND joist hanger nails" : fixings.framing === "screws" ? "use structural framing screws" : "use nails (joist hanger nails, ring shank nails)"}
- Decking/boarding fixings: ${fixings.decking === "both" ? "price both decking screws AND nails" : fixings.decking === "screws" ? "use stainless decking screws" : "use galvanised nails"}
- Plumbing fittings: ${fixings.plumbing === "compression" ? "use compression fittings throughout (elbows, tees, couplings all compression type)" : fixings.plumbing === "soldered" ? "use end-feed solder fittings (elbows, tees, couplings all solder type)" : fixings.plumbing === "pushfit" ? "use push-fit fittings throughout (Speedfit or equivalent)" : "mix of compression for accessible locations, solder for concealed"}
- Pipe material: ${fixings.pipeMaterial === "copper" ? "use copper pipe throughout" : fixings.pipeMaterial === "plastic" ? "use plastic pipe (MDPE/barrier pipe) throughout" : "mix copper and plastic as appropriate"}
- Electrical cable routing: ${fixings.electrical === "clipped" ? "clip cables directly to surfaces" : fixings.electrical === "conduit" ? "run cables in conduit throughout" : "run cables in trunking throughout"}
Price all fixings and fittings according to these preferences. Include every individual item.`,
      ].filter(Boolean).join("\n");

      // Call our own API route — no CORS issues, key is on the server
      const resp=await fetch("/api/estimate",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({systemPrompt:SYSTEM_PROMPT,userPrompt}),
      });
      clearInterval(timer);
      const data=await resp.json();
      if(!resp.ok||data.error) throw new Error(data.error||"Server error");
      const raw=data.text||"";
      if(!raw.trim()) throw new Error("Empty response");
      let parsed=extractJSON(raw);

      const def=(v,fb)=>v!=null?v:fb;
      parsed.categories=def(parsed.categories,[]);parsed.totalCost=def(parsed.totalCost,0);parsed.laborCost=def(parsed.laborCost,0);parsed.materialCost=def(parsed.materialCost,0);parsed.plantCost=def(parsed.plantCost,0);parsed.prelimsCost=def(parsed.prelimsCost,0);parsed.contingency=def(parsed.contingency,0);parsed.contingencyPercent=def(parsed.contingencyPercent,10);parsed.designFees=def(parsed.designFees,0);parsed.vatAmount=def(parsed.vatAmount,0);parsed.grandTotal=def(parsed.grandTotal,parsed.totalCost);parsed.notes=def(parsed.notes,[]);parsed.exclusions=def(parsed.exclusions,[]);parsed.inclusions=def(parsed.inclusions,[]);parsed.confidence=def(parsed.confidence,"Medium");parsed.confidenceReason=def(parsed.confidenceReason,"");parsed.timeline=def(parsed.timeline,"TBC");parsed.projectName=def(parsed.projectName,"Estimate");parsed.projectType=def(parsed.projectType,projType||"Construction");parsed.projectRef=def(parsed.projectRef,`BCO-${Date.now().toString().slice(-6)}`);parsed.summary=def(parsed.summary,"");

      parsed=applyOverhead(parsed,overhead);
      parsed._clientName=clientName;parsed._clientEmail=clientEmail;parsed._siteAddr=siteAddr;parsed._siteContact=siteContact;parsed._siteNotes=siteNotes;parsed._internalNote=intNote;parsed._files=files.map(f=>f.name);

      const saved=saveEst(parsed);
      setResult(saved);setExpandCat(saved.categories?.[0]?.name||null);setActiveTab("breakdown");setEditMode(false);setView("results");
    } catch(e) {
      clearInterval(timer);setError(e.message||"Unknown error");setView("upload");
    }
  };

  const reset=()=>{setView("landing");setFiles([]);setProjDesc("");setProjType("");setClientName("");setClientEmail("");setSiteAddr("");setSiteContact("");setSiteNotes("");setIntNote("");setExclusions("");setOverhead(12);setResult(null);setError("");setEditMode(false);};

  const runDemo = () => {
    const demo = JSON.parse(JSON.stringify(DEMO_ESTIMATE));
    demo._clientName = "Demo Client";
    demo._clientEmail = "demo@example.com";
    demo._siteAddr = "123 Demo Street, Manchester";
    demo._siteContact = "";
    demo._siteNotes = "";
    demo._internalNote = "This is a demo estimate — add your API key to generate real estimates";
    demo._files = [];
    demo._isDemo = true;
    const saved = saveEst(demo);
    setResult(saved);
    setExpandCat(saved.categories?.[0]?.name||null);
    setActiveTab("breakdown");
    setEditMode(false);
    setView("results");
  };
  const toggleMerchant = m => setMerchants(prev => prev.includes(m) ? prev.filter(x=>x!==m) : [...prev, m]);

  return (
    <>
      <Head><title>BuildCostAI — Construction Estimating</title><meta name="viewport" content="width=device-width,initial-scale=1"/></Head>
      {view==="landing"   && <Landing   onStart={()=>setView("upload")} onDash={()=>setView("dashboard")} hasEsts={estimates.length>0} />}
      {view==="upload"    && <UploadScr files={files} setFiles={setFiles} onFiles={handleFiles} fileRef={fileRef} dragOver={dragOver} setDragOver={setDragOver} projType={projType} setProjType={setProjType} projDesc={projDesc} setProjDesc={setProjDesc} clientName={clientName} setClientName={setClientName} clientEmail={clientEmail} setClientEmail={setClientEmail} siteAddr={siteAddr} setSiteAddr={setSiteAddr} siteContact={siteContact} setSiteContact={setSiteContact} siteNotes={siteNotes} setSiteNotes={setSiteNotes} intNote={intNote} setIntNote={setIntNote} exclusions={exclusions} setExclusions={setExclusions} overhead={overhead} setOverhead={setOverhead} region={region} setRegion={setRegion} merchants={merchants} toggleMerchant={toggleMerchant} showSettings={showSettings} setShowSettings={setShowSettings} error={error} onSubmit={runEstimate} onDemo={runDemo} onBack={()=>setView("landing")} fixings={fixings} setFixings={setFixings} />}
      {view==="loading"   && <LoadingScr step={loadStep} />}
      {view==="results"   && <ResultsScr result={result} expandCat={expandCat} setExpandCat={setExpandCat} activeTab={activeTab} setActiveTab={setActiveTab} onNew={reset} onDash={()=>setView("dashboard")} editMode={editMode} setEditMode={setEditMode} onUpdate={patch=>updateEst(result.id,patch)} onDelete={()=>deleteEst(result.id)} emailModal={emailModal} setEmailModal={setEmailModal} emailSent={emailSent} setEmailSent={setEmailSent} labourRates={labourRates} setLabourRates={setLabourRates} profitMargin={profitMargin} setProfitMargin={setProfitMargin} />}
      {view==="dashboard" && <DashScr   estimates={estimates} onNew={()=>setView("upload")} onView={e=>{setResult(e);setExpandCat(e.categories?.[0]?.name);setActiveTab("breakdown");setEditMode(false);setView("results");}} onBack={()=>setView("landing")} onStatus={(id,s)=>updateEst(id,{pipelineStatus:s})} onDelete={deleteEst} />}
    </>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({onBack,onNew,onDash}){
  return(
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"15px 22px",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,background:C.bg,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}><span style={{color:C.gold}}>⬛</span><span style={{fontSize:18,fontWeight:700,letterSpacing:"-0.5px"}}>BuildCost<span style={{color:C.gold}}>AI</span></span></div>
      <div style={{display:"flex",gap:6}}>
        {onDash&&<button style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,padding:"7px 9px"}} onClick={onDash}>📊 Dashboard</button>}
        {onNew &&<button style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,cursor:"pointer",fontSize:12,padding:"6px 13px",borderRadius:6}}  onClick={onNew}>+ New Estimate</button>}
        {onBack&&<button style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,padding:"7px 9px"}} onClick={onBack}>← Back</button>}
      </div>
    </nav>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({onStart,onDash,hasEsts}){
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <Nav onDash={hasEsts?onDash:null}/>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"56px 22px 68px",display:"flex",gap:44,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:260}}>
          <div className="fu" style={{fontSize:10,letterSpacing:3,color:C.gold,marginBottom:14,fontFamily:"monospace"}}>🇬🇧 UK PRICING · AI-POWERED · INSTANT BOQ</div>
          <h1 className="fu d1" style={{fontSize:"clamp(28px,5vw,54px)",fontWeight:700,lineHeight:1.1,letterSpacing:"-2px",marginBottom:20}}>Construction Estimates<br/><em style={{fontStyle:"italic",color:C.gold}}>In Under 60 Seconds.</em></h1>
          <p className="fu d2" style={{fontSize:15,color:C.muted,lineHeight:1.8,marginBottom:30,maxWidth:480}}>Upload your drawings. Our AI reads every dimension, calculates every material, and delivers a fully priced Bill of Quantities. 6× cheaper than traditional estimating services.</p>
          <div className="fu d3" style={{display:"flex",gap:12,marginBottom:44,flexWrap:"wrap"}}>
            <button style={{background:C.gold,color:"#080807",border:"none",padding:"14px 30px",fontSize:15,fontWeight:700,borderRadius:4,cursor:"pointer"}} onClick={onStart} className="glow">Get Your Estimate →</button>
            {hasEsts&&<button style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"14px 22px",fontSize:14,borderRadius:4,cursor:"pointer"}} onClick={onDash}>View Dashboard</button>}
          </div>
          <div className="fu d4" style={{display:"flex",gap:28,flexWrap:"wrap"}}>
            {[["£49","Starting from"],["60s","Turnaround"],["100%","Itemised BOQ"],["£300+","Saved vs rivals"]].map(([v,l])=>(
              <div key={l}><div style={{fontSize:26,fontWeight:700,color:C.gold}}>{v}</div><div style={{fontSize:11,color:C.dim,letterSpacing:1}}>{l}</div></div>
            ))}
          </div>
        </div>
        <div className="fu d2" style={{flexShrink:0}}>
          <MockCard/>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto 72px",padding:"0 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14}}>
        {[["📐","Upload Any Drawings","JPG, PNG or PDF — up to 20 files. AI reads architectural, structural & planning drawings."],["🧱","Full Material Takeoff","Every item priced: from fixings to structural steel. Nothing missed."],["💷","UK 2025 Pricing","Cross-referenced with Jewson, Travis Perkins, Screwfix & BCIS."],["📊","Dashboard","Pipeline view — track every quote from first contact to won job."],["✏️","Edit & Adjust","Tweak any quantity or price after the AI generates the estimate."],["🔒","Hidden Markup","Add your overhead % silently — client never sees it."]].map(([i,t,d])=>(
          <div key={t} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"22px 18px"}} className="fc">
            <span style={{fontSize:30,marginBottom:12,display:"block"}}>{i}</span>
            <h3 style={{fontSize:15,fontWeight:700,marginBottom:7}}>{t}</h3>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{d}</p>
          </div>
        ))}
      </div>
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <span style={{fontWeight:700,fontSize:17}}>BuildCost<span style={{color:C.gold}}>AI</span></span>
        <span style={{fontSize:12,color:C.dim}}>© 2025 · Estimates are indicative. Always verify with a qualified QS.</span>
      </footer>
    </div>
  );
}

function MockCard(){
  return(
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:28,boxShadow:"0 24px 64px rgba(0,0,0,0.6)",minWidth:290,maxWidth:370}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div><div style={{fontSize:10,color:C.gold,letterSpacing:2,marginBottom:5,fontFamily:"monospace"}}>BCO-2025-047</div><div style={{fontSize:15,fontWeight:700}}>Rear Extension — 4m × 5m</div></div>
        <span style={{background:"#1a2a1a",color:C.green,fontSize:11,padding:"4px 10px",borderRadius:20,border:`1px solid #2a4a2a`}}>✓ Won</span>
      </div>
      <div style={{fontSize:38,fontWeight:700,color:C.gold,marginBottom:4}}>£38,450</div>
      <div style={{fontSize:12,color:C.dim,marginBottom:20}}>inc. labour, materials & contingency</div>
      {[["🧱 Masonry",42],["🏗️ Groundworks",29],["🪵 Carpentry",21],["🔌 Electrical",14]].map(([l,w])=>(
        <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
          <span style={{fontSize:12,width:100,color:C.muted}}>{l}</span>
          <div style={{flex:1,height:4,background:C.border,borderRadius:2}}><div style={{height:"100%",background:C.gold,borderRadius:2,width:`${w}%`}}/></div>
          <span style={{fontSize:11,color:C.text,width:28,textAlign:"right"}}>{w}%</span>
        </div>
      ))}
      <div style={{fontSize:11,color:C.dim,borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:12}}>📅 10–14 weeks · 📋 127 items · 📄 PDF ready</div>
    </div>
  );
}

// ─── UPLOAD ───────────────────────────────────────────────────────────────────
function Coll({icon,title,sub,open,setOpen,highlight,children}){
  return(
    <div style={{background:highlight?"#0f0e09":C.surface,border:`1px solid ${highlight?C.gold+"40":C.border}`,borderRadius:10,marginBottom:12,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer"}} onClick={()=>setOpen(v=>!v)}>
        <span style={{fontSize:18}}>{icon}</span>
        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{title}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{sub}</div></div>
        <span style={{color:C.dim,fontSize:11}}>{open?"▲":"▼"}</span>
      </div>
      {open&&<div style={{padding:"14px 16px",borderTop:`1px solid ${C.border}`}}>{children}</div>}
    </div>
  );
}

function UploadScr({files,setFiles,onFiles,fileRef,dragOver,setDragOver,projType,setProjType,projDesc,setProjDesc,clientName,setClientName,clientEmail,setClientEmail,siteAddr,setSiteAddr,siteContact,setSiteContact,siteNotes,setSiteNotes,intNote,setIntNote,exclusions,setExclusions,overhead,setOverhead,region,setRegion,merchants,toggleMerchant,showSettings,setShowSettings,error,onSubmit,onDemo,onBack,fixings,setFixings}){
  const [openSite,setOpenSite]=useState(false);
  const [openExcl,setOpenExcl]=useState(false);
  const [openNote,setOpenNote]=useState(false);
  const [openOH,  setOpenOH  ]=useState(false);
  const [openReg, setOpenReg ]=useState(false);
  const [openFix, setOpenFix ]=useState(false);
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <Nav onBack={onBack}/>
      <div style={{maxWidth:760,margin:"0 auto",padding:"0 20px 80px"}}>
        <div style={{padding:"36px 0 24px"}}><div style={{fontSize:10,letterSpacing:3,color:C.gold,marginBottom:14,fontFamily:"monospace"}}>NEW ESTIMATE</div><h2 style={{fontSize:"clamp(24px,4vw,34px)",fontWeight:700,letterSpacing:"-1px"}}>Upload Drawings</h2></div>
        <div style={{border:`2px dashed ${C.border}`,borderRadius:14,padding:"46px 20px",textAlign:"center",cursor:"pointer",marginBottom:18,transition:"all 0.2s",...(dragOver?{border:`2px dashed ${C.gold}`,background:`${C.gold}08`}:{})}} className="dz"
          onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);onFiles(e.dataTransfer.files);}} onClick={()=>fileRef.current.click()}>
          <input ref={fileRef} type="file" multiple accept="image/*,.pdf" style={{display:"none"}} onChange={e=>onFiles(e.target.files)}/>
          <div style={{fontSize:42,marginBottom:10}}>📐</div>
          <div style={{fontSize:16,fontWeight:600,marginBottom:5}}>Drop construction drawings here</div>
          <div style={{fontSize:13,color:C.dim}}>JPG · PNG · PDF · Up to 20 files</div>
        </div>
        {files.length>0&&(
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:600}}>📁 {files.length} file{files.length>1?"s":""} ready</span>
              <button style={{background:"none",border:"none",color:C.gold,cursor:"pointer",fontSize:13,padding:0}} onClick={()=>setFiles([])}>Remove all</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:180,overflowY:"auto"}}>
              {files.map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:C.bg,borderRadius:6,fontSize:13}}>
                  <span>{f.type==="application/pdf"?"📄":"🖼️"}</span>
                  <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
                  <span style={{color:C.dim,fontSize:11}}>{(f.size/1024).toFixed(0)}KB</span>
                  <button style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:"0 3px"}} onClick={()=>setFiles(files.filter((_,j)=>j!==i))}>✕</button>
                </div>
              ))}
            </div>
            <button style={{...{background:"none",border:"none",color:C.gold,cursor:"pointer",fontSize:13,padding:0},marginTop:10}} onClick={()=>fileRef.current.click()}>+ Add more files</button>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="g2">
          <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Client Name</label><input style={{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"}} placeholder="Mr & Mrs Johnson" value={clientName} onChange={e=>setClientName(e.target.value)}/></div>
          <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Client Email</label><input style={{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"}} type="email" placeholder="client@email.com" value={clientEmail} onChange={e=>setClientEmail(e.target.value)}/></div>
        </div>
        <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Project Type</label>
          <select style={{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"}} value={projType} onChange={e=>setProjType(e.target.value)}>
            <option value="">Select…</option>{PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Project Description</label>
          <textarea style={{...{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"},resize:"vertical",lineHeight:1.7,minHeight:100}} rows={4} value={projDesc} onChange={e=>setProjDesc(e.target.value)} placeholder="e.g. Single storey rear extension, 4m x 5m, brick and block cavity wall, flat roof, bi-fold doors, UFH throughout…"/>
        </div>
        <Coll icon="📍" title="Site Details" sub="Address, contact & access notes" open={openSite} setOpen={setOpenSite}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="g2">
            <div><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Site Address</label><input style={{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"}} placeholder="12 Elm St, Manchester" value={siteAddr} onChange={e=>setSiteAddr(e.target.value)}/></div>
            <div><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Site Contact</label><input style={{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"}} placeholder="Name & phone" value={siteContact} onChange={e=>setSiteContact(e.target.value)}/></div>
          </div>
          <div><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Access Notes</label><textarea style={{...{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"},resize:"vertical"}} rows={2} value={siteNotes} onChange={e=>setSiteNotes(e.target.value)}/></div>
        </Coll>
        {/* Region & Merchants */}
        <Coll icon="📍" title={`Region & Pricing Area — ${REGIONS.find(r=>r.id===region)?.label||"North West"}`} sub="Adjusts all rates for your local market" open={openReg} setOpen={setOpenReg} highlight>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Your Region</label>
            <select style={{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"}} value={region} onChange={e=>setRegion(e.target.value)}>
              {REGIONS.map(r=>(
                <option key={r.id} value={r.id}>
                  {r.label} ({r.multiplier>=1?"+":""}{Math.round((r.multiplier-1)*100)}% vs national average)
                </option>
              ))}
            </select>
            <div style={{fontSize:11,color:C.dim,marginTop:6}}>
              Prices are automatically scaled for your region based on BCIS regional factors.
            </div>
          </div>
          <div>
            <label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Your Building Merchants <span style={{color:C.dim,fontWeight:400}}>(tick all you use)</span></label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
              {MERCHANTS.map(m=>{
                const active=merchants.includes(m);
                return(
                  <button key={m} onClick={()=>toggleMerchant(m)}
                    style={{background:active?C.gold:"#1a1a18",color:active?"#080807":C.muted,border:`1px solid ${active?C.gold:C.border}`,padding:"7px 14px",borderRadius:20,fontSize:13,cursor:"pointer",transition:"all 0.15s"}}>
                    {active?"✓ ":""}{m}
                  </button>
                );
              })}
            </div>
            <div style={{fontSize:11,color:C.dim,marginTop:8}}>
              Selected merchants will be used for all supplier references in the BOQ.
            </div>
          </div>
        </Coll>

        <Coll icon="🚫" title="Items to Exclude" sub="Remove anything the customer has priced elsewhere" open={openExcl} setOpen={setOpenExcl}>
          <textarea style={{...{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"},resize:"vertical"}} rows={3} value={exclusions} onChange={e=>setExclusions(e.target.value)} placeholder={"e.g.\n- Windows and doors (customer has separate quote)\n- Kitchen units and appliances"}/>
        </Coll>
        <Coll icon="💬" title="Internal Notes" sub="Private notes — never shown to client" open={openNote} setOpen={setOpenNote}>
          <textarea style={{...{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"},resize:"vertical"}} rows={3} value={intNote} onChange={e=>setIntNote(e.target.value)} placeholder="e.g. Client flexible on budget. Check groundworks depth."/>
        </Coll>
        <Coll icon="🔒" title={`Office & Overhead Markup — ${overhead}%`} sub="Baked silently into all costs, never visible to client" open={openOH} setOpen={setOpenOH} highlight>
          <p style={{fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:14}}>Covers office running costs, estimating time and profit margin. <strong style={{color:C.text}}>Baked into every line item</strong> — client never sees this figure.</p>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <span style={{fontSize:12,color:C.dim}}>0%</span>
            <input type="range" min={0} max={30} step={1} value={overhead} onChange={e=>setOverhead(Number(e.target.value))} style={{flex:1}}/>
            <span style={{fontSize:12,color:C.dim}}>30%</span>
            <div style={{background:C.gold,color:"#080807",fontWeight:700,fontSize:17,padding:"6px 14px",borderRadius:6,minWidth:52,textAlign:"center"}}>{overhead}%</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[[10,"Tight"],[15,"Standard"],[20,"Premium"]].map(([v,l])=>(
              <button key={v} style={{background:overhead===v?C.gold:"#222",color:overhead===v?"#080807":C.muted,border:"none",padding:"6px 14px",borderRadius:20,fontSize:12,cursor:"pointer"}} onClick={()=>setOverhead(v)}>{v}% — {l}</button>
            ))}
          </div>
        </Coll>
        {/* ── FIXINGS PREFERENCES ─────────────────────────────────── */}
        <Coll icon="🔧" title="Fixings & Materials Preferences" sub="Set your preferred fixings — screws vs nails, pipe fittings etc" open={openFix} setOpen={setOpenFix}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:8,color:"#bbb"}}>🪵 Carpentry Fixings</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["screws","Screws"],["nails","Nails"],["both","Price Both"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setFixings(p=>({...p,carpentry:v}))}
                    style={{background:fixings.carpentry===v?C.gold:"#1a1a18",color:fixings.carpentry===v?"#080807":C.muted,border:`1px solid ${fixings.carpentry===v?C.gold:C.border}`,padding:"8px 16px",borderRadius:20,fontSize:13,cursor:"pointer"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:8,color:"#bbb"}}>🏗️ Structural Framing Fixings</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["screws","Framing Screws"],["nails","Nails"],["both","Price Both"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setFixings(p=>({...p,framing:v}))}
                    style={{background:fixings.framing===v?C.gold:"#1a1a18",color:fixings.framing===v?"#080807":C.muted,border:`1px solid ${fixings.framing===v?C.gold:C.border}`,padding:"8px 16px",borderRadius:20,fontSize:13,cursor:"pointer"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:8,color:"#bbb"}}>🚿 Plumbing Fittings</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["compression","Compression"],["soldered","Solder/End-feed"],["pushfit","Push-fit"],["mixed","Mixed"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setFixings(p=>({...p,plumbing:v}))}
                    style={{background:fixings.plumbing===v?C.gold:"#1a1a18",color:fixings.plumbing===v?"#080807":C.muted,border:`1px solid ${fixings.plumbing===v?C.gold:C.border}`,padding:"8px 16px",borderRadius:20,fontSize:13,cursor:"pointer"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:8,color:"#bbb"}}>🪠 Pipe Material</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["copper","Copper"],["plastic","Plastic (MDPE)"],["mixed","Mixed"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setFixings(p=>({...p,pipeMaterial:v}))}
                    style={{background:fixings.pipeMaterial===v?C.gold:"#1a1a18",color:fixings.pipeMaterial===v?"#080807":C.muted,border:`1px solid ${fixings.pipeMaterial===v?C.gold:C.border}`,padding:"8px 16px",borderRadius:20,fontSize:13,cursor:"pointer"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:8,color:"#bbb"}}>🔌 Electrical Cable Routing</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["clipped","Clipped Direct"],["conduit","In Conduit"],["trunking","In Trunking"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setFixings(p=>({...p,electrical:v}))}
                    style={{background:fixings.electrical===v?C.gold:"#1a1a18",color:fixings.electrical===v?"#080807":C.muted,border:`1px solid ${fixings.electrical===v?C.gold:C.border}`,padding:"8px 16px",borderRadius:20,fontSize:13,cursor:"pointer"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </Coll>

        {error&&<div style={{background:"#2a1212",border:"1px solid #5a2020",borderRadius:8,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#ff8080"}}>⚠️ {error}</div>}

        {/* Demo mode banner */}
        <div style={{background:"#0f0e09",border:`1px solid ${C.gold}40`,borderRadius:10,padding:"16px 18px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <span style={{fontSize:18}}>🎮</span>
            <div>
              <div style={{fontWeight:600,fontSize:14}}>Try Demo Mode</div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>Test the full app with a pre-built estimate — no API key needed</div>
            </div>
          </div>
          <button style={{width:"100%",background:"transparent",border:`1px solid ${C.gold}`,color:C.gold,padding:"12px",fontSize:14,fontWeight:600,borderRadius:6,cursor:"pointer"}} onClick={onDemo}>
            🚀 Load Demo Estimate →
          </button>
        </div>

        <button style={{width:"100%",background:C.gold,color:"#080807",border:"none",padding:16,fontSize:16,fontWeight:700,borderRadius:6,cursor:"pointer"}} onClick={onSubmit} className="glow">🔍 Analyse & Generate Estimate →</button>
        <p style={{color:C.dim,fontSize:11,textAlign:"center",marginTop:12,lineHeight:1.6}}>AI estimates are indicative. Always verify with a qualified QS for tender purposes.</p>
      </div>
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────────────────────
function LoadingScr({step}){
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,padding:32,color:C.text}}>
      <div style={{width:80,height:80,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.gold}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}} className="spin"><span style={{fontSize:24}}>⬛</span></div>
      <h2 style={{fontSize:24,fontWeight:700}}>Analysing your project…</h2>
      <p style={{color:C.muted,fontSize:14}}>Reading drawings and computing material quantities</p>
      <div style={{display:"flex",flexDirection:"column",gap:9,maxWidth:380,width:"100%"}}>
        {STEPS.map((st,i)=>(
          <div key={i} style={{fontSize:13,color:i===step?C.gold:i<step?C.green:C.dim,display:"flex",gap:9,alignItems:"center"}}>
            <span style={{fontFamily:"monospace",width:16}}>{i<step?"✓":i===step?"●":"○"}</span>{st}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function ResultsScr({result,expandCat,setExpandCat,activeTab,setActiveTab,onNew,onDash,editMode,setEditMode,onUpdate,onDelete,emailModal,setEmailModal,emailSent,setEmailSent,labourRates,setLabourRates,profitMargin,setProfitMargin}){
  const [editRes,setEditRes]=useState(result);
  const [delConfirm,setDelConfirm]=useState(false);
  const [noteVal,setNoteVal]=useState(result?._internalNote||"");
  const [noteSaved,setNoteSaved]=useState(false);
  const [showProfit,setShowProfit]=useState(false);
  const [showLabour,setShowLabour]=useState(false);
  useEffect(()=>{setEditRes(result);setNoteVal(result?._internalNote||"");},[result]);
  if(!result)return null;
  const r=editMode?editRes:result;
  const confCol={High:C.green,Medium:C.amber,Low:C.red}[r.confidence]||C.muted;
  const saveEdits=()=>{onUpdate(editRes);setEditMode(false);};

  // Profit calculations — private, never shown to client
  const exVAT = (r.grandTotal||r.totalCost) / 1.2;
  const totalCosts = r.totalCost || 0;
  const profitAmount = Math.round(totalCosts * (profitMargin / 100));
  const chargeToClient = totalCosts + profitAmount;
  const chargeIncVAT = Math.round(chargeToClient * 1.2);
  const actualLabour = r.laborCost || 0;
  const editItem=(catName,idx,field,val)=>{
    const cats=editRes.categories.map(cat=>{
      if(cat.name!==catName)return cat;
      const items=cat.items.map((it,i)=>{if(i!==idx)return it;const u={...it,[field]:["quantity","unitCost"].includes(field)?parseFloat(val)||0:val};u.totalCost=Math.round(u.quantity*u.unitCost);return u;});
      return{...cat,subtotal:items.reduce((a,it)=>a+it.totalCost,0),items};
    });
    const tc=cats.reduce((a,c)=>a+c.subtotal,0);const sub=tc+(editRes.contingency||0)+(editRes.designFees||0);
    setEditRes({...editRes,categories:cats,totalCost:tc,vatAmount:Math.round(sub*0.2),grandTotal:sub+Math.round(sub*0.2)});
  };
  const saveNote=()=>{onUpdate({_internalNote:noteVal});setNoteSaved(true);setTimeout(()=>setNoteSaved(false),2000);};
  const disp=editMode?editRes:r;
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}} id="pr">
      <Nav onNew={onNew} onDash={onDash}/>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"32px 0 24px"}} className="no-print">
        <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px"}}>
          <div style={{fontSize:10,letterSpacing:3,color:C.gold,marginBottom:6,fontFamily:"monospace"}}>{r.projectRef||"ESTIMATE"} · {r.projectType}</div>
          <h2 style={{fontSize:"clamp(22px,4vw,34px)",fontWeight:700,letterSpacing:"-1px",margin:"6px 0"}}>{r.projectName}</h2>
          {r._clientName&&<div style={{color:C.muted,fontSize:13,marginBottom:5}}>👤 {r._clientName}{r._clientEmail?` · ${r._clientEmail}`:""}</div>}
          {r._siteAddr&&<div style={{color:C.muted,fontSize:13,marginBottom:5}}>📍 {r._siteAddr}{r._siteContact?` · ${r._siteContact}`:""}</div>}
          <p style={{color:C.muted,fontSize:13,lineHeight:1.8,maxWidth:660,marginBottom:8}}>{r.summary}</p>
          <div style={{fontSize:12,color:C.dim}}>📅 {r.timeline} · <span style={{color:confCol}}>● {r.confidence}</span> · {r.confidenceReason}</div>
          <div style={{display:"flex",gap:8,marginTop:18,flexWrap:"wrap"}}>
            <Abtn onClick={()=>window.print()}>🖨️ Print / PDF</Abtn>
            <Abtn onClick={()=>setEmailModal(true)}>📧 Email Client</Abtn>
            <Abtn onClick={()=>editMode?saveEdits():setEditMode(true)} gold={editMode}>{editMode?"💾 Save Changes":"✏️ Edit Estimate"}</Abtn>
            {editMode&&<Abtn onClick={()=>{setEditMode(false);setEditRes(result);}}>✕ Cancel</Abtn>}
            <Abtn onClick={()=>setDelConfirm(true)} danger>🗑 Delete</Abtn>
          </div>
        </div>
      </div>
      <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px 80px"}}>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"24px 20px",margin:"24px 0"}}>
          <div style={{marginBottom:18}}>
            <div style={{fontSize:10,letterSpacing:3,color:C.gold,marginBottom:5,fontFamily:"monospace"}}>TOTAL PROJECT COST</div>
            <div style={{fontSize:"clamp(32px,7vw,52px)",fontWeight:700,color:C.gold,letterSpacing:"-2px"}}>{fmt(disp.grandTotal||disp.totalCost)}</div>
            <div style={{fontSize:12,color:C.dim,marginTop:3}}>inc. contingency & VAT at 20%</div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
            {[["Materials",r.materialCost],["Labour",r.laborCost],["Plant & Prelims",(r.plantCost||0)+(r.prelimsCost||0)],["Contingency",r.contingency],["VAT (20%)",r.vatAmount]].filter(([,v])=>v>0).map(([l,v])=>(
              <div key={l} style={{background:"#111",border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 14px"}}>
                <div style={{fontSize:10,color:C.dim,marginBottom:3}}>{l}</div>
                <div style={{fontSize:15,fontWeight:700}}>{fmt(v)}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#0f0e09",border:`1px solid ${C.gold}28`,borderRadius:10,padding:"14px 16px",marginBottom:20}} className="no-print">
          <div style={{fontSize:10,color:C.gold,letterSpacing:2,marginBottom:8,fontFamily:"monospace"}}>🔒 INTERNAL NOTES — NOT VISIBLE TO CLIENT</div>
          <textarea style={{...{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"},marginBottom:8,background:"#0a0908",resize:"vertical"}} rows={2} value={noteVal} onChange={e=>setNoteVal(e.target.value)} placeholder="Add private notes…"/>
          <button style={{...{background:"none",border:"none",color:C.gold,cursor:"pointer",fontSize:13,padding:0},...(noteSaved?{color:C.green}:{})}} onClick={saveNote}>{noteSaved?"✓ Saved":"Save note"}</button>
        </div>
        {/* ── PROFIT MARGIN PANEL ── private, no-print ─────────────────── */}
        <div style={{background:"#0a0f0a",border:`1px solid ${C.green}30`,borderRadius:10,padding:"14px 16px",marginBottom:12}} className="no-print">
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setShowProfit(v=>!v)}>
            <span style={{fontSize:18}}>💰</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:14}}>Profit Margin — {profitMargin}%</div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>Your profit on this job — never shown to client</div>
            </div>
            <div style={{color:C.green,fontWeight:700,fontSize:16}}>{fmt(profitAmount)}</div>
            <span style={{color:C.dim,fontSize:11,marginLeft:6}}>{showProfit?"▲":"▼"}</span>
          </div>
          {showProfit&&(
            <div style={{borderTop:`1px solid ${C.border}`,marginTop:14,paddingTop:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <span style={{fontSize:12,color:C.dim}}>0%</span>
                <input type="range" min={0} max={50} step={1} value={profitMargin} onChange={e=>setProfitMargin(Number(e.target.value))} style={{flex:1,accentColor:C.green}}/>
                <span style={{fontSize:12,color:C.dim}}>50%</span>
                <div style={{background:C.green,color:"#080807",fontWeight:700,fontSize:16,padding:"5px 13px",borderRadius:6,minWidth:48,textAlign:"center"}}>{profitMargin}%</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {[
                  ["Cost of Works (ex VAT)",fmt(totalCosts),"Your actual cost"],
                  ["Profit ("+profitMargin+"%)",fmt(profitAmount),"Your margin"],
                  ["Charge to Client (ex VAT)",fmt(chargeToClient),"What to quote"],
                  ["Charge to Client (inc VAT)",fmt(chargeIncVAT),"Final client price"],
                ].map(([l,v,sub])=>(
                  <div key={l} style={{background:"#111",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:C.dim,marginBottom:3}}>{l}</div>
                    <div style={{fontSize:16,fontWeight:700,color:C.green}}>{v}</div>
                    <div style={{fontSize:10,color:C.dim,marginTop:2}}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,color:C.dim,lineHeight:1.6}}>
                💡 The overhead markup you set at quote stage has already been baked into the BOQ rates. This profit margin is on top of that — pure profit after all costs.
              </div>
            </div>
          )}
        </div>

        {/* ── LABOUR BREAKDOWN ── editable day rates ────────────────────── */}
        <div style={{background:"#0a0a0f",border:`1px solid #60a5fa30`,borderRadius:10,padding:"14px 16px",marginBottom:20}} className="no-print">
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setShowLabour(v=>!v)}>
            <span style={{fontSize:18}}>👷</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:14}}>Labour Breakdown</div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>Set what you pay your lads — adjusts labour costs</div>
            </div>
            <div style={{color:"#60a5fa",fontWeight:700,fontSize:16}}>{fmt(actualLabour)}</div>
            <span style={{color:C.dim,fontSize:11,marginLeft:6}}>{showLabour?"▲":"▼"}</span>
          </div>
          {showLabour&&(
            <div style={{borderTop:`1px solid ${C.border}`,marginTop:14,paddingTop:14}}>
              <p style={{fontSize:12,color:C.muted,marginBottom:14,lineHeight:1.6}}>
                Set your actual day rates below. The AI estimated labour at <strong style={{color:C.text}}>{fmt(actualLabour)}</strong> based on UK averages. Adjust to match what you pay — your margin section above will update accordingly.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {Object.entries(labourRates).map(([key,{label,rate}])=>(
                  <div key={key} style={{background:"#111",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px"}}>
                    <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{label}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,color:C.dim}}>£</span>
                      <input type="number" value={rate}
                        onChange={e=>setLabourRates(prev=>({...prev,[key]:{...prev[key],rate:Number(e.target.value)||0}}))}
                        style={{flex:1,background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:5,padding:"6px 8px",color:C.text,fontSize:14,fontWeight:700,width:"100%"}}/>
                      <span style={{fontSize:11,color:C.dim}}>/day</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:"#111",border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 14px"}}>
                <div style={{fontSize:11,color:C.dim,marginBottom:4}}>Average day rate across all trades</div>
                <div style={{fontSize:20,fontWeight:700,color:"#60a5fa"}}>
                  £{Math.round(Object.values(labourRates).reduce((s,{rate})=>s+rate,0)/Object.values(labourRates).length)}/day
                </div>
              </div>
              <p style={{fontSize:11,color:C.dim,marginTop:10,lineHeight:1.5}}>
                💡 To recalculate the full BOQ with your exact rates, generate a new estimate and include your day rates in the project description.
              </p>
            </div>
          )}
        </div>

        <div style={{display:"flex",gap:2,marginBottom:22,borderBottom:`1px solid ${C.border}`,overflowX:"auto"}} className="no-print">
          {[["breakdown","📋 Full BOQ"],["inclusions","✓ Inclusions"],["exclusions","✗ Exclusions"],["notes","📝 Notes"]].map(([t,l])=>(
            <button key={t} style={{background:"none",border:"none",borderBottom:`2px solid ${activeTab===t?C.gold:"transparent"}`,color:activeTab===t?C.gold:C.muted,padding:"11px 14px",cursor:"pointer",fontSize:13,whiteSpace:"nowrap",marginBottom:-1}} onClick={()=>setActiveTab(t)}>{l}</button>
          ))}
        </div>
        {activeTab==="breakdown"&&(
          <>
            <h3 style={{fontSize:19,fontWeight:700,marginBottom:16}}>Bill of Quantities</h3>
            {disp.categories?.map(cat=>(
              <div key={cat.name} style={{marginBottom:8,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",background:"#111",cursor:"pointer"}} onClick={()=>setExpandCat(expandCat===cat.name?null:cat.name)}>
                  <span style={{fontSize:18}}>{cat.icon}</span>
                  <span style={{flex:1,fontWeight:600,fontSize:14}}>{cat.name}</span>
                  <span style={{color:C.gold,fontWeight:700,fontSize:14}}>{fmt(cat.subtotal)}</span>
                  <span style={{color:C.dim,fontSize:11,marginLeft:6}}>{expandCat===cat.name?"▲":"▼"}</span>
                </div>
                {expandCat===cat.name&&(
                  <div style={{background:"#0c0c0b",overflowX:"auto"}}>
                    <div style={{display:"flex",padding:"8px 14px",fontSize:10,color:C.dim,letterSpacing:1,borderBottom:`1px solid #1a1a18`,fontFamily:"monospace",gap:6,minWidth:520}}>
                      <span style={{width:32}}>Ref</span><span style={{flex:3}}>Item</span><span style={{width:52,textAlign:"right"}}>Qty</span><span style={{width:32,textAlign:"right"}}>Unit</span><span style={{width:64,textAlign:"right"}}>Rate</span><span style={{width:64,textAlign:"right"}}>Total</span>
                    </div>
                    {cat.items?.map((item,i)=>(
                      <div key={i} style={{display:"flex",padding:"11px 14px",fontSize:13,alignItems:"flex-start",gap:6,borderBottom:`1px solid #131312`,background:i%2?"#0a0a09":"transparent",minWidth:520}}>
                        <span style={{width:32,color:C.dim,fontSize:11,flexShrink:0,paddingTop:2}}>{item.ref}</span>
                        <div style={{flex:3,minWidth:0}}>
                          <div style={{fontWeight:600,marginBottom:2}}>{item.name}</div>
                          <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{item.description}</div>
                          {item.supplier&&<div style={{fontSize:10,color:C.dim}}>📦 {item.supplier}</div>}
                        </div>
                        {editMode?(
                          <>
                            <input style={{width:50,background:"#111",border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 5px",color:C.text,fontSize:12,textAlign:"right"}} type="number" value={item.quantity} onChange={e=>editItem(cat.name,i,"quantity",e.target.value)}/>
                            <span style={{width:32,textAlign:"right",color:C.muted,fontSize:10,paddingTop:5,flexShrink:0}}>{item.unit}</span>
                            <input style={{width:60,background:"#111",border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 5px",color:C.text,fontSize:12,textAlign:"right"}} type="number" step="0.01" value={item.unitCost} onChange={e=>editItem(cat.name,i,"unitCost",e.target.value)}/>
                            </>
                          ):(
                                            <span style={{color:C.gold,fontWeight:700,fontSize:14}}>{fmt(cat.subtotal)}</span>
                          <>
                  <span style={{color:C.dim,fontSize:11,marginLeft:6}}>{expandCat===cat.name?"▲":"▼"}</span>
                          </>
                          )
                </div>
                {expandCat===cat.name&&(
                  <div style={{background:"#0c0c0b",overflowX:"auto"}}>
                    <div style={{display:"flex",padding:"8px 14px",fontSize:10,color:C.dim,letterSpacing:1,borderBottom:`1px solid #1a1a18`,fontFamily:"monospace",gap:6,minWidth:520}}>
                      <span style={{width:32}}>Ref</span><span style={{flex:3}}>Item</span><span style={{width:52,textAlign:"right"}}>Qty</span><span style={{width:32,textAlign:"right"}}>Unit</span><span style={{width:64,textAlign:"right"}}>Rate</span><span style={{width:64,textAlign:"right"}}>Total</span>
                    </div>
                    {cat.items?.map((item,i)=>(
                      <div key={i} style={{display:"flex",padding:"11px 14px",fontSize:13,alignItems:"flex-start",gap:6,borderBottom:`1px solid #131312`,background:i%2?"#0a0a09":"transparent",minWidth:520}}>
                        <span style={{width:32,color:C.dim,fontSize:11,flexShrink:0,paddingTop:2}}>{item.ref}</span>
                        <div style={{flex:3,minWidth:0}}>
                          <div style={{fontWeight:600,marginBottom:2}}>{item.name}</div>
                          <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{item.description}</div>
                          {item.supplier&&<div style={{fontSize:10,color:C.dim}}>📦 {item.supplier}</div>}
                        </div>
                        {editMode?(
                          <>
                            <input style={{width:50,background:"#111",border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 5px",color:C.text,fontSize:12,textAlign:"right"}} type="number" value={item.quantity} onChange={e=>editItem(cat.name,i,"quantity",e.target.value)}/>
                            <span style={{width:32,textAlign:"right",color:C.muted,fontSize:10,paddingTop:5,flexShrink:0}}>{item.unit}</span>
                            <input style={{width:60,background:"#111",border:`1px solid ${C.border}`,borderRadius:4,padding:"3px 5px",color:C.text,fontSize:12,textAlign:"right"}} type="number" step="0.01" value={item.unitCost} onChange={e=>editItem(cat.name,i,"unitCost",e.target.value)}/>
                          </>
                        ):(
                          <>
                            <span style={{width:52,textAlign:"right",flexShrink:0}}>{item.quantity}</span>
                            <span style={{width:32,textAlign:"right",color:C.muted,fontSize:10,flexShrink:0,paddingTop:2}}>{item.unit}</span>
                            <span style={{width:64,textAlign:"right",flexShrink:0}}>{fmtDec(item.unitCost)}</span>
                          </>
                        )}
                        <span style={{width:64,textAlign:"right",fontWeight:700,flexShrink:0}}>{fmt(item.totalCost)}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",borderTop:`1px solid ${C.border}`,fontWeight:700,color:C.gold,fontSize:14}}><span>Subtotal — {cat.name}</span><span>{fmt(cat.subtotal)}</span></div>
                  </div>
                )}
              </div>
            ))}
            <div style={{border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginTop:18,marginBottom:28}}>
              {[["Sub Total",disp.totalCost],[`Contingency (${r.contingencyPercent}%)`,disp.contingency],r.designFees>0?["Design Fees",disp.designFees]:null,["Sub Total (ex. VAT)",(disp.grandTotal||disp.totalCost)/1.2],["VAT at 20%",disp.vatAmount]].filter(Boolean).map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"12px 18px",borderBottom:`1px solid ${C.border}`,fontSize:14}}><span>{l}</span><span>{fmt(v)}</span></div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"15px 18px",background:"#1a1508",color:C.gold,fontWeight:700,fontSize:17}}><span>TOTAL INC. VAT</span><span>{fmt(disp.grandTotal||disp.totalCost)}</span></div>
            </div>
          </>
        )}
        {activeTab==="inclusions"&&<ListTab items={r.inclusions} title="What's Included" col={C.green} sym="✓"/>}
        {activeTab==="exclusions"&&<ListTab items={r.exclusions} title="Exclusions" col={C.red} sym="✗"/>}
        {activeTab==="notes"&&<ListTab items={r.notes} title="Estimator Notes" col={C.gold} sym="•"/>}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:24}} className="no-print">
          <button style={{width:"100%",background:C.gold,color:"#080807",border:"none",padding:16,fontSize:16,fontWeight:700,borderRadius:6,cursor:"pointer"}} onClick={()=>window.print()}>🖨️ Print / Save as PDF</button>
          <div style={{display:"flex",gap:10}}><button style={{...{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"14px 22px",fontSize:14,borderRadius:4,cursor:"pointer"}Btn,flex:1}} onClick={onNew}>+ New Estimate</button><button style={{...{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"14px 22px",fontSize:14,borderRadius:4,cursor:"pointer"}Btn,flex:1}} onClick={onDash}>📊 Dashboard</button></div>
        </div>
      </div>
      {emailModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setEmailModal(false)}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:26,width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <h3 style={{fontSize:19,fontWeight:700,marginBottom:16}}>📧 Email Estimate to Client</h3>
            {emailSent?(
              <div style={{textAlign:"center",padding:"24px 0"}}><div style={{fontSize:44,marginBottom:10}}>✅</div><div style={{fontSize:16,fontWeight:700,marginBottom:6}}>Estimate sent!</div><button style={{width:"100%",background:C.gold,color:"#080807",border:"none",padding:16,fontSize:16,fontWeight:700,borderRadius:6,cursor:"pointer"}} onClick={()=>{setEmailModal(false);setEmailSent(false);}}>Close</button></div>
            ):(
              <>
                <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>To</label><input style={{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"}} defaultValue={r._clientEmail} placeholder="client@email.com"/></div>
                <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Subject</label><input style={{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"}} defaultValue={`Estimate: ${r.projectName} — ${fmt(r.grandTotal||r.totalCost)}`}/></div>
                <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:6,color:"#bbb"}}>Message</label><textarea style={{...{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"},resize:"vertical"}} rows={5} defaultValue={`Dear ${r._clientName||"Client"},\n\nPlease find your construction estimate for ${r.projectName}.\n\nTotal: ${fmt(r.grandTotal||r.totalCost)} inc. VAT\nTimeline: ${r.timeline}\n\nKind regards,\nBuildCostAI`}/></div>
                <div style={{display:"flex",gap:10}}><button style={{...{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"14px 22px",fontSize:14,borderRadius:4,cursor:"pointer"}Btn,flex:1}} onClick={()=>setEmailModal(false)}>Cancel</button><button style={{...{width:"100%",background:C.gold,color:"#080807",border:"none",padding:16,fontSize:16,fontWeight:700,borderRadius:6,cursor:"pointer"},flex:2}} onClick={()=>setEmailSent(true)}>Send Estimate 📧</button></div>
              </>
            )}
          </div>
        </div>
      )}
      {delConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setDelConfirm(false)}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:26,maxWidth:380,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:38,marginBottom:10}}>🗑</div>
            <h3 style={{fontSize:17,fontWeight:700,marginBottom:8}}>Delete this estimate?</h3>
            <p style={{color:C.muted,fontSize:13,marginBottom:22}}>This cannot be undone.</p>
            <div style={{display:"flex",gap:10}}><button style={{...{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"14px 22px",fontSize:14,borderRadius:4,cursor:"pointer"}Btn,flex:1}} onClick={()=>setDelConfirm(false)}>Cancel</button><button style={{...{width:"100%",background:C.gold,color:"#080807",border:"none",padding:16,fontSize:16,fontWeight:700,borderRadius:6,cursor:"pointer"},flex:1,background:C.red}} onClick={()=>{setDelConfirm(false);onDelete();}}>Delete</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function Abtn({onClick,children,gold,danger}){return(<button style={{background:gold?C.gold:danger?"transparent":"#1a1a18",color:gold?"#080807":danger?C.red:C.text,border:`1px solid ${gold?C.gold:danger?C.red+"55":C.border}`,padding:"8px 14px",borderRadius:6,cursor:"pointer",fontSize:13}} onClick={onClick}>{children}</button>);}
function ListTab({items,title,col,sym}){return(<div style={{paddingBottom:36}}><h3 style={{fontSize:19,fontWeight:700,marginBottom:16}}>{title}</h3>{items?.length?items.map((x,i)=>(<div key={i} style={{padding:"11px 0",borderBottom:`1px solid ${C.border}`,fontSize:14,color:"#bbb",display:"flex",gap:12,lineHeight:1.6}}><span style={{color:col,flexShrink:0}}>{sym}</span>{x}</div>)):<p style={{color:C.muted,fontSize:14}}>None listed.</p>}</div>);}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashScr({estimates,onNew,onView,onBack,onStatus,onDelete}){
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("All");
  const totalVal=estimates.reduce((a,e)=>a+(e.grandTotal||e.totalCost||0),0);
  const wonVal=estimates.filter(e=>e.pipelineStatus==="Won").reduce((a,e)=>a+(e.grandTotal||e.totalCost||0),0);
  const wonCount=estimates.filter(e=>e.pipelineStatus==="Won").length;
  const filtered=estimates.filter(e=>filter==="All"||e.pipelineStatus===filter).filter(e=>!search||[e.projectName,e._clientName,e._siteAddr].some(v=>v?.toLowerCase().includes(search.toLowerCase())));
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <Nav onBack={onBack} onNew={onNew}/>
      <div style={{maxWidth:960,margin:"0 auto",padding:"0 20px 80px"}}>
        <div style={{padding:"36px 0 24px"}}><div style={{fontSize:10,letterSpacing:3,color:C.gold,marginBottom:14,fontFamily:"monospace"}}>DASHBOARD</div><h2 style={{fontSize:"clamp(24px,4vw,34px)",fontWeight:700,letterSpacing:"-1px"}}>Job Pipeline</h2></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
          {[["Pipeline",fmt(totalVal),"All estimates",C.gold],["Won",fmt(wonVal),`${wonCount} job${wonCount!==1?"s":""}`,C.green],["Estimates",estimates.length,"Saved","#60a5fa"],["Active",estimates.filter(e=>!["Won","Lost"].includes(e.pipelineStatus)).length,"In progress",C.amber]].map(([l,v,sub,col])=>(
            <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}}>
              <div style={{fontSize:10,color:C.muted,letterSpacing:1,marginBottom:5}}>{l}</div>
              <div style={{fontSize:24,fontWeight:700,color:col,marginBottom:2}}>{v}</div>
              <div style={{fontSize:11,color:C.dim}}>{sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:7,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {["All",...STATUSES].map(st=>{const cnt=st==="All"?estimates.length:estimates.filter(e=>e.pipelineStatus===st).length;const col=STATUS_COL[st]||C.gold;return(<button key={st} style={{background:filter===st?(st==="All"?C.gold:col):"transparent",color:filter===st?"#080807":C.muted,border:`1px solid ${filter===st?(st==="All"?C.gold:col):C.border}`,padding:"7px 14px",borderRadius:20,cursor:"pointer",fontSize:12,whiteSpace:"nowrap"}} onClick={()=>setFilter(st)}>{st} ({cnt})</button>);})}
        </div>
        <input style={{...{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:7,padding:"11px 14px",color:C.text,fontSize:14,boxSizing:"border-box"},marginBottom:18}} placeholder="🔍 Search project or client…" value={search} onChange={e=>setSearch(e.target.value)}/>
        {estimates.length===0?(
