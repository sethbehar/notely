// academicTerms.js

const academicTerms = [
  // Original terms:
  "analysis",
  "algorithm",
  "biology",
  "chemistry",
  "calculus",
  "derivative",
  "equation",
  "function",
  "genetics",
  "hypothesis",
  "integral",
  "journal",
  "kinetics",
  "laboratory",
  "mathematics",
  "neuroscience",
  "observation",
  "physics",
  "quantum",
  "research",
  "statistics",
  "theory",
  "university",
  "variable",
  "wavelength",
  "abstraction",
  "artificial",
  "cognitive",
  "differential",
  "electromagnetism",
  "feedback",
  "graph theory",
  "heuristics",
  "isotope",
  "linear algebra",
  "machine learning",
  "nanotechnology",
  "ontology",
  "probability",
  "regression",
  "semantics",
  "tensor",
  "utility",
  "virtual reality",
  "vortex",
  "zoology",

  // 500 additional terms:
  "aerobic",
  "acyclic",
  "adenovirus",
  "adjudicate",
  "adsorption",
  "aforementioned",
  "agarose",
  "albedo",
  "algebraic",
  "algorithmically",
  "alkaline",
  "alliteration",
  "alveolus",
  "ambiguity",
  "ambrosia",
  "amendment",
  "amorphous",
  "amphibious",
  "amplitude",
  "anachronism",

  "anemia",
  "anemone",
  "angiogenesis",
  "angular",
  "anomalous",
  "anthocyanin",
  "anthropogenic",
  "antimatter",
  "aphasia",
  "aphorism",
  "apologia",
  "appellation",
  "archipelago",
  "areology",
  "arithmetic",
  "artifact",
  "asymptote",
  "auditory",
  "augmentation",
  "aureole",

  "authenticity",
  "autocracy",
  "autotrophic",
  "auxin",
  "balneology",
  "barometric",
  "behavioral",
  "beneficence",
  "benthic",
  "bioaccumulation",
  "biodiversity",
  "bioethics",
  "bioluminescence",
  "biomechanics",
  "biosynthesis",
  "bitwise",
  "blackbody",
  "blastula",
  "boiling",
  "bolometer",

  "Boolean",
  "botany",
  "boundary",
  "calcification",
  "calibration",
  "calorimeter",
  "cambium",
  "canopy",
  "capacitance",
  "capillary",
  "capitalization",
  "carcinogen",
  "cardinality",
  "carotenoid",
  "cartography",
  "catalysis",
  "categorical",
  "catenate",
  "causality",
  "cauterization",

  "cellulose",
  "centrifugal",
  "centripetal",
  "cephalopod",
  "cerebellum",
  "cerebral",
  "cerevisiae",
  "cetacean",
  "characterization",
  "chemotaxis",
  "chondrule",
  "chromatic",
  "chromosomal",
  "chronometry",
  "cirrus",
  "cladistics",
  "clarity",
  "classification",
  "climatology",
  "coagulation",

  "cognition",
  "coil",
  "colloidal",
  "commutative",
  "comparative",
  "compendium",
  "complementary",
  "computation",
  "concurrency",
  "condensation",
  "conduction",
  "conflation",
  "confluence",
  "confounding",
  "coniferous",
  "conjugate",
  "connectivity",
  "conservation",
  "consilience",
  "convection",

  "convexity",
  "coordinate",
  "correlation",
  "cortical",
  "cosmogony",
  "cosmology",
  "counterexample",
  "covariance",
  "craniology",
  "crater",
  "crystalline",
  "cytokinesis",
  "cytoplasm",
  "decarboxylation",
  "deciduous",
  "decomposition",
  "deconvolution",
  "deductive",
  "deforestation",
  "dehydration",

  "deism",
  "demographic",
  "demography",
  "denaturation",
  "denominator",
  "depolarization",
  "dermatology",
  "desalination",
  "detection",
  "determinant",
  "detritus",
  "diagnostic",
  "diaphanous",
  "diffraction",
  "digitalis",
  "dihybrid",
  "dilution",
  "dimorphism",
  "dioxin",
  "dipole",

  "dissertation",
  "dissipative",
  "distillation",
  "diurnal",
  "divergence",
  "diversification",
  "doppler",
  "dorsal",
  "drainage",
  "ductile",
  "dynamic",
  "dynamo",
  "echinoderm",
  "eclectic",
  "ecological",
  "ecosystem",
  "ectothermic",
  "efficacy",
  "electrolysis",
  "electrophoresis",

  "electrostatic",
  "emission",
  "empathy",
  "empirical",
  "encephalopathy",
  "endemic",
  "endocytosis",
  "endoparasite",
  "engram",
  "entomology",
  "entropy",
  "enumeration",
  "enviable",
  "epicycle",
  "epigenetics",
  "epiphyte",
  "epistemology",
  "equilibrium",
  "equinoctial",
  "ergodic",

  "erroneous",
  "esoteric",
  "estuarine",
  "ethanol",
  "ethological",
  "ethology",
  "etiology",
  "eukaryote",
  "evolutionary",
  "extrapolation",
  "fabrication",
  "facilitation",
  "fallacy",
  "falsifiability",
  "falsification",
  "familiarity",
  "fascicle",
  "feedback",
  "fermentation",
  "fiduciary",

  "filament",
  "filtration",
  "flagellum",
  "flatworm",
  "fluorescence",
  "fluxional",
  "focal",
  "follicle",
  "folklore",
  "fomentation",
  "forensic",
  "formaldehyde",
  "formant",
  "formic",
  "fossilization",
  "fracture",
  "fragility",
  "frictionless",
  "frugivorous",
  "fulcrum",

  "fungistatic",
  "fusion",
  "galaxy",
  "gallium",
  "galvanic",
  "game-theoretic",
  "ganglion",
  "gaseous",
  "gastronomy",
  "genealogy",
  "genealogical",
  "geneva",
  "genome",
  "geocentric",
  "geochemistry",
  "geodesic",
  "geomorphology",
  "gerontology",
  "gestation",
  "glandular",

  "globalization",
  "glycolysis",
  "gonadotropin",
  "granulocyte",
  "granum",
  "graphical",
  "gravitational",
  "graviton",
  "greenhouse",
  "gubernatorial",
  "gynoecium",
  "habitat",
  "hadrons",
  "halophile",
  "haplotype",
  "harmonic",
  "hematology",
  "herbarium",
  "herbicide",
  "heritability",

  "heterochromatin",
  "heterozygous",
  "hierarchical",
  "histogram",
  "histology",
  "homeostasis",
  "homologous",
  "homonuclear",
  "homozygous",
  "honeycomb",
  "horizon",
  "hormonal",
  "horticulture",
  "hubble",
  "humanistic",
  "humidity",
  "hyaline",
  "hydration",
  "hydrodynamics",
  "hydrolysis",

  "hydrosphere",
  "hyperbola",
  "hyperbole",
  "hypertonic",
  "hyperspace",
  "hypodermic",
  "hypotenuse",
  "hypothesis",
  "ichthyology",
  "identitarian",
  "idiopathic",
  "immunization",
  "immunology",
  "impedance",
  "incandescent",
  "inception",
  "inclusion",
  "incompressible",
  "incremental",
  "indeterminate",

  "indexical",
  "indigenous",
  "inductive",
  "inertia",
  "inequality",
  "infinite",
  "infix",
  "inflammatory",
  "infrared",
  "ingress",
  "inhibitor",
  "inoculation",
  "inorganic",
  "insectivore",
  "insoluble",
  "instantiation",
  "institutional",
  "integer",
  "integrable",
  "intercalation",

  "interdisciplinary",
  "interferometry",
  "interglacial",
  "intermolecular",
  "internalization",
  "international",
  "interspecific",
  "intracellular",
  "intransitive",
  "inversion",
  "investiture",
  "ionization",
  "irradiance",
  "irreducible",
  "isometric",
  "isotope",
  "isotropic",
  "iterative",
  "juxtaposition",
  "juvenile",

  "keratin",
  "ketone",
  "kinematics",
  "kinetic",
  "klebsiella",
  "knotting",
  "kymograph",
  "labile",
  "lactation",
  "lactobacillus",
  "laminar",
  "landmass",
  "language",
  "laparoscopy",
  "lapidary",
  "lateralization",
  "latitude",
  "lawful",
  "legibility",
  "lemma",

  "lexicography",
  "libration",
  "licensure",
  "lignin",
  "limnology",
  "linearity",
  "linguistic",
  "lipid",
  "lithification",
  "litigation",
  "littoral",
  "locality",
  "logicism",
  "lognormal",
  "logogram",
  "longitude",
  "luminance",
  "lymphocyte",
  "lysis",
  "macrocosm",

  "magnetosphere",
  "malformation",
  "mammalian",
  "manifold",
  "manipulative",
  "manuscript",
  "maritime",
  "massive",
  "materialism",
  "matrilineal",
  "mechatronics",
  "mechanoreceptor",
  "mechanotransduction",
  "mediator",
  "medullary",
  "melanin",
  "melatonin",
  "memetic",
  "mesoderm",
  "metallurgy",
  "metamaterial",
  "metastasis",
  "meteorological",
  "methanogen",
  "methodology",
  "metronome",
  "microbe",
  "microcosm",
  "microfauna",
  "micronutrient",
  "microprocessor",
  "microtubule",
  "mildew",
  "milestone",
  "millennium",
  "mimeograph",
  "mineralogy",
  "mistranslation",
  "mitochondria",
  "mitosis",

  "mixotroph",
  "molecular",
  "molefraction",
  "molybdenum",
  "monograph",
  "monomer",
  "morphogenesis",
  "morphology",
  "mortality",
  "motif",
  "multifactorial",
  "multiplexing",
  "multitude",
  "mutagen",
  "mycology",
  "nanoparticle",
  "narrative",
  "nascent",
  "nationalization",
  "nativism",

  "necrosis",
  "neolithic",
  "neonatal",
  "neoplatonism",
  "neutron",
  "nexus",
  "niche",
  "nitrification",
  "nocturnal",
  "nomogram",
  "nomenclature",
  "nonlinear",
  "normative",
  "nucleotide",
  "nucleus",
  "nullification",
  "nutrition",
  "obedience",
  "obliquity",
  "observation",

  "obstetrics",
  "occipital",
  "octave",
  "oligomer",
  "oncology",
  "ondansetron",
  "ontology",
  "opalescent",
  "optical",
  "optimizable",
  "ordinal",
  "oreography",
  "organismic",
  "organogenesis",
  "orientational",
  "orthogonal",
  "osmoregulation",
  "ossification",
  "oxidative",
  "oxygenation",
];

export default academicTerms;
