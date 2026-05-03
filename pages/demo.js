export const DEMO_ESTIMATE = {
projectName: “Rear Extension — 4m x 5m (DEMO)”,
projectType: “Rear Extension”,
projectRef: “BCO-DEMO-001”,
summary: “Single storey rear extension with brick and block cavity wall construction, zinc standing seam flat roof with rooflight, bi-fold doors to rear, underfloor heating throughout, full electrical and plumbing installation. This is a DEMO estimate — add your Anthropic API key to generate real estimates.”,
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
timeline: “14-18 weeks”,
confidence: “High”,
confidenceReason: “Demo estimate based on typical North West pricing”,
notes: [
“This is a DEMO estimate — real estimates require an Anthropic API key”,
“Prices based on North West UK market rates 2025”,
“All quantities based on typical 4m x 5m single storey rear extension”,
“Scaffold included for full duration of works”
],
exclusions: [
“Kitchen units and appliances (by others)”,
“Floor finishes to existing areas”,
“Landscaping and garden works”
],
inclusions: [
“All labour and materials”,
“Site toilet and welfare throughout”,
“All tool and plant hire”,
“Scaffold for full duration”
],
categories: [
{ name:“Demolition & Clearance”, icon:“🔨”, subtotal:2850,
items:[
{ref:“A1”,name:“Remove existing rear doors/windows”,description:“Strip out 2no existing rear openings”,quantity:2,unit:“nr”,unitCost:175,totalCost:350,supplier:“N/A”,notes:””},
{ref:“A2”,name:“Break out existing concrete slab”,description:“Break out and remove 20m2 slab”,quantity:20,unit:“m²”,unitCost:44,totalCost:880,supplier:“N/A”,notes:””},
{ref:“A3”,name:“General demolition & clearance”,description:“Strip out and remove debris”,quantity:1,unit:“nr”,unitCost:820,totalCost:820,supplier:“N/A”,notes:””},
{ref:“A4”,name:“Skip hire — demolition”,description:“2no 8-yard skips”,quantity:2,unit:“nr”,unitCost:400,totalCost:800,supplier:“Local hire”,notes:””}
]
},
{ name:“Groundworks & Foundations”, icon:“🌱”, subtotal:9800,
items:[
{ref:“B1”,name:“Strip foundations 600x225mm”,description:“GEN3 mass concrete strip footing”,quantity:22,unit:“m”,unitCost:180,totalCost:3960,supplier:“Jewson”,notes:“Min -0.9m below ground”},
{ref:“B2”,name:“Hardcore filling 150mm”,description:“Compacted MOT Type 1”,quantity:20,unit:“m²”,unitCost:18,totalCost:360,supplier:“MKM”,notes:””},
{ref:“B3”,name:“Concrete slab RC25 100mm”,description:“A142 mesh reinforcement”,quantity:20,unit:“m²”,unitCost:68,totalCost:1360,supplier:“Jewson”,notes:””},
{ref:“B4”,name:“DPM 1200 gauge”,description:“Taped seams, continuous”,quantity:20,unit:“m²”,unitCost:4,totalCost:80,supplier:“Travis Perkins”,notes:””},
{ref:“B5”,name:“New manhole complete”,description:“Precast concrete MH + cover”,quantity:1,unit:“nr”,unitCost:850,totalCost:850,supplier:“Jewson”,notes:””},
{ref:“B6”,name:“Drainage connections”,description:“Pop-up gullies and connections”,quantity:3,unit:“nr”,unitCost:230,totalCost:690,supplier:“Travis Perkins”,notes:””},
{ref:“B7”,name:“Sand blinding 25mm”,description:“Over hardcore prior to DPM”,quantity:20,unit:“m²”,unitCost:8,totalCost:160,supplier:“MKM”,notes:””},
{ref:“B8”,name:“Excavation and disposal”,description:“Machine dig and remove spoil”,quantity:25,unit:“m³”,unitCost:46,totalCost:1150,supplier:“N/A”,notes:””}
]
},
{ name:“Structural Steelwork”, icon:“🔩”, subtotal:5200,
items:[
{ref:“C1”,name:“Steel beam RSJ supply & fix”,description:“2no 152x89UB bolted together”,quantity:1,unit:“nr”,unitCost:1850,totalCost:1850,supplier:“Travis Perkins”,notes:“To SE design”},
{ref:“C2”,name:“Padstones C40/50 concrete”,description:“440x215x150mm padstones”,quantity:4,unit:“nr”,unitCost:185,totalCost:740,supplier:“Jewson”,notes:””},
{ref:“C3”,name:“Catnic lintels supply & fix”,description:“CG100/100 with 150mm bearing”,quantity:4,unit:“nr”,unitCost:145,totalCost:580,supplier:“Travis Perkins”,notes:””},
{ref:“C4”,name:“Structural engineer fees”,description:“Design, calcs and inspections”,quantity:1,unit:“nr”,unitCost:1200,totalCost:1200,supplier:“N/A”,notes:””},
{ref:“C5”,name:“Steelwork encasing Fireline”,description:“Gyproc Fireline board to all steels”,quantity:8,unit:“m²”,unitCost:104,totalCost:830,supplier:“Travis Perkins”,notes:””}
]
},
{ name:“Masonry & Brickwork”, icon:“🧱”, subtotal:11200,
items:[
{ref:“D1”,name:“Cavity wall WT1 — new extension”,description:“100mm blockwork, 90mm insulation, block”,quantity:42,unit:“m²”,unitCost:185,totalCost:7770,supplier:“MKM”,notes:“U-value 0.18”},
{ref:“D2”,name:“Recticel Eurowall+ full fill”,description:“90mm cavity insulation boards”,quantity:42,unit:“m²”,unitCost:28,totalCost:1176,supplier:“Travis Perkins”,notes:””},
{ref:“D3”,name:“Wall ties stainless steel”,description:“750x450mm centres”,quantity:42,unit:“m²”,unitCost:4,totalCost:168,supplier:“Jewson”,notes:””},
{ref:“D4”,name:“Cavity closers with DPC”,description:“Kooltherm insulated closers”,quantity:18,unit:“m”,unitCost:18,totalCost:324,supplier:“Travis Perkins”,notes:””},
{ref:“D5”,name:“Internal blockwork partition”,description:“100mm 7N blockwork WT5”,quantity:12,unit:“m²”,unitCost:63,totalCost:756,supplier:“MKM”,notes:””},
{ref:“D6”,name:“Stepped DPC”,description:“Through construction at threshold”,quantity:10,unit:“m”,unitCost:21,totalCost:210,supplier:“Jewson”,notes:””}
]
},
{ name:“Roofing”, icon:“🏠”, subtotal:12400,
items:[
{ref:“E1”,name:“175x47mm C24 rafters 400ctrs”,description:“Roof structure to extension”,quantity:20,unit:“m²”,unitCost:38,totalCost:760,supplier:“Travis Perkins”,notes:””},
{ref:“E2”,name:“18mm marine ply decking”,description:“WBP ply over rafters”,quantity:20,unit:“m²”,unitCost:42,totalCost:840,supplier:“MKM”,notes:””},
{ref:“E3”,name:“Aludex Max VCL”,description:“Bituminous vapour control layer”,quantity:20,unit:“m²”,unitCost:18,totalCost:360,supplier:“Travis Perkins”,notes:””},
{ref:“E4”,name:“Metdeck composite panel”,description:“Kingspan Resol rigid foam insulation”,quantity:20,unit:“m²”,unitCost:95,totalCost:1900,supplier:“Travis Perkins”,notes:“U-value 0.15”},
{ref:“E5”,name:“VMZINC Pigmento Brown standing seam”,description:“By approved installer”,quantity:20,unit:“m²”,unitCost:185,totalCost:3700,supplier:“Specialist”,notes:””},
{ref:“E6”,name:“Hidden gutter perimeter”,description:“Detail TBC with installer”,quantity:14,unit:“m”,unitCost:145,totalCost:2030,supplier:“Specialist”,notes:””},
{ref:“E7”,name:“Velux Vario rooflight 1.2x0.9m”,description:“Fixed with 300mm insulated upstands”,quantity:1,unit:“nr”,unitCost:2200,totalCost:2200,supplier:“Travis Perkins”,notes:“U-value 1.3”},
{ref:“E8”,name:“Black uPVC gutters & downpipes”,description:“To match existing”,quantity:16,unit:“m”,unitCost:32,totalCost:512,supplier:“MKM”,notes:””}
]
},
{ name:“Doors & Windows”, icon:“🪟”, subtotal:7800,
items:[
{ref:“F1”,name:“Bi-fold doors aluminium RAL7035”,description:“3-pane SMART Alitherm, U1.4”,quantity:1,unit:“nr”,unitCost:3800,totalCost:3800,supplier:“Specialist”,notes:“Low profile sill”},
{ref:“F2”,name:“Rear door aluminium RAL7035”,description:“SMART Alitherm, U1.4”,quantity:1,unit:“nr”,unitCost:1800,totalCost:1800,supplier:“Specialist”,notes:””},
{ref:“F3”,name:“uPVC windows slim profile”,description:“RAL7035, U1.4, trickle vents”,quantity:2,unit:“nr”,unitCost:950,totalCost:1900,supplier:“Specialist”,notes:””},
{ref:“F4”,name:“Insulated PB reveals & trickle vents”,description:“To all new openings”,quantity:4,unit:“nr”,unitCost:75,totalCost:300,supplier:“Travis Perkins”,notes:””}
]
},
{ name:“Insulation & Floor Finishes”, icon:“🧊”, subtotal:5900,
items:[
{ref:“G1”,name:“Recticel Eurothane GP 100mm floor”,description:“Rigid insulation over slab”,quantity:20,unit:“m²”,unitCost:24,totalCost:480,supplier:“Travis Perkins”,notes:“U-value 0.17”},
{ref:“G2”,name:“UFH pipes manifold & zone valves”,description:“Clipped to insulation”,quantity:20,unit:“m²”,unitCost:48,totalCost:960,supplier:“MKM”,notes:””},
{ref:“G3”,name:“75mm sand/cement screed”,description:“Over UFH pipes”,quantity:20,unit:“m²”,unitCost:32,totalCost:640,supplier:“Jewson”,notes:“1mm/day drying”},
{ref:“G4”,name:“Schluter-DITRA 25 membrane”,description:“Tanking membrane under tiles”,quantity:20,unit:“m²”,unitCost:22,totalCost:440,supplier:“Travis Perkins”,notes:””},
{ref:“G5”,name:“Porcelain tile fixing 300x400mm”,description:“Tiles supplied by client”,quantity:20,unit:“m²”,unitCost:45,totalCost:900,supplier:“N/A”,notes:””},
{ref:“G6”,name:“Perimeter insulation 15mm”,description:“Recticel to screed edges”,quantity:16,unit:“m”,unitCost:8,totalCost:128,supplier:“Travis Perkins”,notes:””},
{ref:“G7”,name:“500g isolating DPM”,description:“Over insulation, taped”,quantity:20,unit:“m²”,unitCost:3,totalCost:60,supplier:“Jewson”,notes:””},
{ref:“G8”,name:“Dryline existing walls WT2”,description:“Recticel Eurothane PL 77.5mm”,quantity:18,unit:“m²”,unitCost:68,totalCost:1224,supplier:“Travis Perkins”,notes:“U-value 0.30”}
]
},
{ name:“Internal Walls & Partitions”, icon:“🪵”, subtotal:3200,
items:[
{ref:“H1”,name:“Stud walls WT3 100x50mm”,description:“Mineral wool, plasterboard both sides”,quantity:22,unit:“m²”,unitCost:72,totalCost:1584,supplier:“Travis Perkins”,notes:””},
{ref:“H2”,name:“Acoustic wall WT4 Soundbloc”,description:“Resilient bars, 2x Soundbloc”,quantity:10,unit:“m²”,unitCost:110,totalCost:1100,supplier:“Travis Perkins”,notes:””},
{ref:“H3”,name:“Schluter-KERDI-BOARD tanking”,description:“Wet area wall tanking”,quantity:8,unit:“m²”,unitCost:64,totalCost:512,supplier:“Travis Perkins”,notes:””}
]
},
{ name:“Electrical”, icon:“🔌”, subtotal:7200,
items:[
{ref:“I1”,name:“Double sockets USB-A+C”,description:“Throughout extension”,quantity:18,unit:“nr”,unitCost:85,totalCost:1530,supplier:“Screwfix”,notes:””},
{ref:“I2”,name:“LED recessed spotlights”,description:“Supply and fix throughout”,quantity:14,unit:“nr”,unitCost:65,totalCost:910,supplier:“Screwfix”,notes:””},
{ref:“I3”,name:“UFH manifold & wiring”,description:“Zone valves and controls”,quantity:1,unit:“nr”,unitCost:480,totalCost:480,supplier:“MKM”,notes:””},
{ref:“I4”,name:“Extract fan WC/bathroom”,description:“15 l/s with 5 min overrun”,quantity:1,unit:“nr”,unitCost:220,totalCost:220,supplier:“Screwfix”,notes:””},
{ref:“I5”,name:“Smoke & CO alarms interlinked”,description:“Mains wired throughout”,quantity:4,unit:“nr”,unitCost:85,totalCost:340,supplier:“Screwfix”,notes:””},
{ref:“I6”,name:“First & second fix wiring”,description:“Consumer unit upgrade & cert”,quantity:1,unit:“nr”,unitCost:2800,totalCost:2800,supplier:“N/A”,notes:””},
{ref:“I7”,name:“New radiator supply & fix”,description:“Various BTU to match rooms”,quantity:2,unit:“nr”,unitCost:320,totalCost:640,supplier:“MKM”,notes:””},
{ref:“I8”,name:“EV charging point external”,description:“7kW smart charger”,quantity:1,unit:“nr”,unitCost:950,totalCost:950,supplier:“Screwfix”,notes:””}
]
},
{ name:“Plumbing & Heating”, icon:“🚿”, subtotal:4800,
items:[
{ref:“J1”,name:“UFH pipework & manifold”,description:“Extension zones, zone valves”,quantity:1,unit:“nr”,unitCost:1800,totalCost:1800,supplier:“MKM”,notes:””},
{ref:“J2”,name:“En-suite shower WC basin”,description:“Full fit-out and connections”,quantity:1,unit:“nr”,unitCost:1800,totalCost:1800,supplier:“Travis Perkins”,notes:””},
{ref:“J3”,name:“WC pan and basin”,description:“Supply, fix and connect”,quantity:1,unit:“nr”,unitCost:680,totalCost:680,supplier:“Travis Perkins”,notes:””},
{ref:“J4”,name:“Drainage connections”,description:“All soil and waste connections”,quantity:1,unit:“nr”,unitCost:520,totalCost:520,supplier:“Jewson”,notes:””}
]
},
{ name:“Plastering & Decorations”, icon:“🖌️”, subtotal:5820,
items:[
{ref:“K1”,name:“Plasterboard & skim new areas”,description:“12.5mm boards, plaster skim”,quantity:90,unit:“m²”,unitCost:28,totalCost:2520,supplier:“Travis Perkins”,notes:””},
{ref:“K2”,name:“Silicone render external walls”,description:“All new external wall faces”,quantity:42,unit:“m²”,unitCost:48,totalCost:2016,supplier:“Jewson”,notes:””},
{ref:“K3”,name:“Decoration mist coat + 2 coats”,description:“Throughout new areas”,quantity:110,unit:“m²”,unitCost:12,totalCost:1320,supplier:“Screwfix”,notes:””}
]
},
{ name:“External Works”, icon:“🌿”, subtotal:2450,
items:[
{ref:“L1”,name:“Indian limestone paving”,description:“35-50mm mortar over hardcore”,quantity:16,unit:“m²”,unitCost:95,totalCost:1520,supplier:“MKM”,notes:“Min 1:80 fall”},
{ref:“L2”,name:“Code 4 lead flashings”,description:“To all abutments”,quantity:8,unit:“m”,unitCost:85,totalCost:680,supplier:“Travis Perkins”,notes:””},
{ref:“L3”,name:“New gate supply & hang”,description:“Timber gate to match”,quantity:1,unit:“nr”,unitCost:650,totalCost:650,supplier:“N/A”,notes:””}
]
},
{ name:“Preliminaries & Site Establishment”, icon:“🏕️”, subtotal:4800,
items:[
{ref:“M1”,name:“Site toilet hire”,description:“Chemical toilet weekly hire”,quantity:16,unit:“week”,unitCost:45,totalCost:720,supplier:“Local hire”,notes:“Full duration”},
{ref:“M2”,name:“Site toilet servicing”,description:“Weekly service and empty”,quantity:16,unit:“week”,unitCost:28,totalCost:448,supplier:“Local hire”,notes:””},
{ref:“M3”,name:“Scaffold erect hire and strike”,description:“Full perimeter 16 weeks”,quantity:1,unit:“nr”,unitCost:2200,totalCost:2200,supplier:“Local scaffold”,notes:””},
{ref:“M4”,name:“Skip hire general waste”,description:“8-yard skip x builds”,quantity:4,unit:“nr”,unitCost:320,totalCost:1280,supplier:“Local hire”,notes:””},
{ref:“M5”,name:“Concrete mixer hire”,description:“Weekly hire throughout”,quantity:6,unit:“week”,unitCost:55,totalCost:330,supplier:“HSS Hire”,notes:””},
{ref:“M6”,name:“Power tools hire”,description:“Drills, grinders, saws weekly”,quantity:16,unit:“week”,unitCost:95,totalCost:1520,supplier:“HSS Hire”,notes:””},
{ref:“M7”,name:“PPE and site safety”,description:“Hard hats, boots, hi-vis etc”,quantity:1,unit:“nr”,unitCost:380,totalCost:380,supplier:“Screwfix”,notes:””},
{ref:“M8”,name:“Hand wash unit welfare”,description:“Weekly hire”,quantity:16,unit:“week”,unitCost:22,totalCost:352,supplier:“Local hire”,notes:””}
]
}
]
};
