// Mock database for demonstration purposes
// In a real application, you would use MongoDB or another database

// Users collection
export const users: {
  id: string
  name: string
  email: string
  password: string
  role?: string
  collegeName?: string
  rollNumber?: string
  phoneNumber?: string
}[] = []

// Add a demo user for testing
users.push({
  id: "demo1",
  name: "Demo User",
  email: "demo@example.com",
  password: "password123",
  role: "user",
})

// Add admin user
users.push({
  id: "admin1",
  name: "Administrator",
  email: "admin",
  password: "admin@321",
  role: "admin",
})

// Questions collection
export const questions: {
  id: string
  text: string
  options: string[]
  correctOption: string
  subject: "math" | "physics" | "chemistry"
}[] = [
  // Math questions
  {
    id: "math-1",
    text: "If the sum of the roots of the quadratic equation ax² + bx + c = 0 is equal to the product of the roots, then:",
    options: ["a + c = b", "a = c", "b = 2√(ac)", "a - c = b"],
    correctOption: "a = c",
    subject: "math",
  },
  {
    id: "math-2",
    text: "The value of lim(x→0) (sin x)/x is:",
    options: ["0", "1", "∞", "Does not exist"],
    correctOption: "1",
    subject: "math",
  },
  {
    id: "math-3",
    text: "If f(x) = x³ - 3x² + 4x - 2, then f'(2) equals:",
    options: ["4", "6", "8", "10"],
    correctOption: "4",
    subject: "math",
  },
  {
    id: "math-4",
    text: "The area bounded by the curve y = x² and the lines y = 1, y = 4, and x = 0 is:",
    options: ["5/3", "7/3", "8/3", "9/3"],
    correctOption: "7/3",
    subject: "math",
  },
  {
    id: "math-5",
    text: "If the vectors a = 2i + 3j and b = i - j are perpendicular to vector c = xi + yj, then:",
    options: ["2x - 3y = 0", "2x + 3y = 0", "3x - 2y = 0", "3x + 2y = 0"],
    correctOption: "2x - 3y = 0",
    subject: "math",
  },
  {
    id: "math-6",
    text: "The solution of the differential equation dy/dx = e^(x+y) is:",
    options: ["e^y = e^x + C", "e^y = -e^x + C", "e^y = e^(-x) + C", "e^y = -e^(-x) + C"],
    correctOption: "e^y = -e^(-x) + C",
    subject: "math",
  },
  {
    id: "math-7",
    text: "The value of ∫(0 to π/2) sin²x dx is:",
    options: ["π/4", "π/2", "π/3", "π"],
    correctOption: "π/4",
    subject: "math",
  },
  {
    id: "math-8",
    text: "If A and B are two events such that P(A) = 0.3, P(B) = 0.4 and P(A∩B) = 0.2, then P(A|B) is:",
    options: ["0.5", "0.3", "0.4", "0.7"],
    correctOption: "0.5",
    subject: "math",
  },
  {
    id: "math-9",
    text: "The equation of the tangent to the curve y = x² + 2x at the point (1, 3) is:",
    options: ["y = 4x - 1", "y = 4x - 4", "y = 4x", "y = 4x + 3"],
    correctOption: "y = 4x - 1",
    subject: "math",
  },
  {
    id: "math-10",
    text: "The distance between the lines 3x - 4y + 7 = 0 and 6x - 8y - 5 = 0 is:",
    options: ["1", "2", "3", "4"],
    correctOption: "2",
    subject: "math",
  },
  {
    id: "math-11",
    text: "If z = x + iy is a complex number such that |z| = 1 and arg(z) = π/3, then z equals:",
    options: ["1/2 + i√3/2", "√3/2 + i/2", "-1/2 + i√3/2", "-√3/2 + i/2"],
    correctOption: "1/2 + i√3/2",
    subject: "math",
  },
  {
    id: "math-12",
    text: "The rank of the matrix [[1, 2, 3], [2, 4, 6], [3, 6, 9]] is:",
    options: ["1", "2", "3", "0"],
    correctOption: "1",
    subject: "math",
  },
  {
    id: "math-13",
    text: "The general solution of the differential equation d²y/dx² + 4y = 0 is:",
    options: ["y = A cos 2x + B sin 2x", "y = Ae^(2x) + Be^(-2x)", "y = A cos 2x", "y = B sin 2x"],
    correctOption: "y = A cos 2x + B sin 2x",
    subject: "math",
  },
  {
    id: "math-14",
    text: "If f(x) = x³ - 6x² + 12x - 8, then the value of x for which f(x) = 0 is:",
    options: ["1", "2", "3", "4"],
    correctOption: "2",
    subject: "math",
  },
  {
    id: "math-15",
    text: "The value of ∫(1 to 2) (x² + 1)/(x³ + 3x) dx is:",
    options: ["ln(7/4)", "ln(4/7)", "ln(7)", "ln(4)"],
    correctOption: "ln(7/4)",
    subject: "math",
  },
  {
    id: "math-16",
    text: "If the lines 2x + 3y = 5 and 3x + ky = 8 are perpendicular, then the value of k is:",
    options: ["-2", "2", "-3/2", "3/2"],
    correctOption: "-2",
    subject: "math",
  },
  {
    id: "math-17",
    text: "The probability that a leap year has 53 Sundays is:",
    options: ["1/7", "2/7", "3/7", "4/7"],
    correctOption: "2/7",
    subject: "math",
  },
  {
    id: "math-18",
    text: "The locus of the point of intersection of perpendicular tangents to the parabola y² = 4ax is:",
    options: ["x = -a", "x = a", "y = a", "y = -a"],
    correctOption: "x = -a",
    subject: "math",
  },
  {
    id: "math-19",
    text: "If A is a square matrix such that A² = A, then (I - A)² equals:",
    options: ["I - A", "I + A", "I - 2A", "I"],
    correctOption: "I - A",
    subject: "math",
  },
  {
    id: "math-20",
    text: "The value of the determinant |2 3 1; 4 1 3; 2 5 2| is:",
    options: ["-13", "13", "0", "1"],
    correctOption: "-13",
    subject: "math",
  },

  // Physics questions
  {
    id: "physics-1",
    text: "A body is thrown vertically upward with a velocity of 19.6 m/s. The maximum height reached by the body is (g = 9.8 m/s²):",
    options: ["19.6 m", "9.8 m", "39.2 m", "20 m"],
    correctOption: "19.6 m",
    subject: "physics",
  },
  {
    id: "physics-2",
    text: "The dimensional formula for the coefficient of viscosity is:",
    options: ["[ML⁻¹T⁻¹]", "[MLT⁻¹]", "[ML⁻¹T⁻²]", "[ML²T⁻²]"],
    correctOption: "[ML⁻¹T⁻¹]",
    subject: "physics",
  },
  {
    id: "physics-3",
    text: "The work done in moving a charge of 2 coulombs from a point at 10V to another point at 30V is:",
    options: ["40 J", "20 J", "60 J", "-40 J"],
    correctOption: "40 J",
    subject: "physics",
  },
  {
    id: "physics-4",
    text: "A body of mass 2 kg is rotating in a circle of radius 2 m with an angular velocity of 3 rad/s. The centripetal force acting on it is:",
    options: ["36 N", "12 N", "24 N", "18 N"],
    correctOption: "36 N",
    subject: "physics",
  },
  {
    id: "physics-5",
    text: "The energy equivalent of 1 gram of matter is:",
    options: ["9 × 10¹³ J", "9 × 10¹⁶ J", "9 × 10¹⁰ J", "9 × 10¹⁹ J"],
    correctOption: "9 × 10¹⁶ J",
    subject: "physics",
  },
  {
    id: "physics-6",
    text: "The focal length of a convex lens is 20 cm. The power of the lens is:",
    options: ["5 D", "0.05 D", "0.5 D", "50 D"],
    correctOption: "5 D",
    subject: "physics",
  },
  {
    id: "physics-7",
    text: "The wavelength of the first line of Balmer series in hydrogen spectrum is 656.3 nm. The wavelength of the second line of the series is approximately:",
    options: ["486.1 nm", "410.2 nm", "434.1 nm", "364.6 nm"],
    correctOption: "486.1 nm",
    subject: "physics",
  },
  {
    id: "physics-8",
    text: "The resistance of a wire is R. If its length and radius are both doubled, the new resistance will be:",
    options: ["R/2", "R", "2R", "4R"],
    correctOption: "R/2",
    subject: "physics",
  },
  {
    id: "physics-9",
    text: "A particle is moving with a velocity v = 3i + 4j + 5k. The magnitude of the velocity is:",
    options: ["√50", "12", "5", "√34"],
    correctOption: "√50",
    subject: "physics",
  },
  {
    id: "physics-10",
    text: "The moment of inertia of a uniform circular disc about an axis passing through its center and perpendicular to its plane is:",
    options: ["MR²/2", "MR²", "2MR²", "MR²/4"],
    correctOption: "MR²/2",
    subject: "physics",
  },
  {
    id: "physics-11",
    text: "The electric field inside a charged conducting sphere is:",
    options: ["Zero", "Directly proportional to radius", "Inversely proportional to radius", "Constant"],
    correctOption: "Zero",
    subject: "physics",
  },
  {
    id: "physics-12",
    text: "The magnetic field at the center of a circular coil of radius R carrying current I is:",
    options: ["μ₀I/2R", "μ₀I/R", "μ₀I/2πR", "μ₀I/4πR"],
    correctOption: "μ₀I/2R",
    subject: "physics",
  },
  {
    id: "physics-13",
    text: "In a Young's double-slit experiment, the fringe width is β. If the entire apparatus is immersed in water (refractive index 4/3), the new fringe width will be:",
    options: ["3β/4", "4β/3", "β", "β/2"],
    correctOption: "3β/4",
    subject: "physics",
  },
  {
    id: "physics-14",
    text: "The half-life of a radioactive element is 30 days. The fraction of the initial amount that remains after 90 days is:",
    options: ["1/8", "1/4", "1/2", "3/8"],
    correctOption: "1/8",
    subject: "physics",
  },
  {
    id: "physics-15",
    text: "The energy of a photon of wavelength 6000 Å is approximately:",
    options: ["2.07 eV", "3.1 eV", "1.5 eV", "0.5 eV"],
    correctOption: "2.07 eV",
    subject: "physics",
  },
  {
    id: "physics-16",
    text: "The de Broglie wavelength of an electron accelerated through a potential difference of 100 V is approximately:",
    options: ["1.23 Å", "0.123 nm", "12.3 pm", "0.0123 nm"],
    correctOption: "1.23 Å",
    subject: "physics",
  },
  {
    id: "physics-17",
    text: "A body is projected with a velocity of 20 m/s at an angle of 30° with the horizontal. The maximum height reached by the body is (g = 10 m/s²):",
    options: ["5 m", "10 m", "15 m", "20 m"],
    correctOption: "5 m",
    subject: "physics",
  },
  {
    id: "physics-18",
    text: "The efficiency of a Carnot engine working between 127°C and 27°C is:",
    options: ["25%", "50%", "75%", "100%"],
    correctOption: "25%",
    subject: "physics",
  },
  {
    id: "physics-19",
    text: "The ratio of the specific heat capacities (γ = Cp/Cv) for a monoatomic gas is:",
    options: ["5/3", "7/5", "4/3", "3/2"],
    correctOption: "5/3",
    subject: "physics",
  },
  {
    id: "physics-20",
    text: "The electric potential at a distance r from a point charge q is V. The electric field at the same point is:",
    options: ["-dV/dr", "dV/dr", "-V/r", "V/r"],
    correctOption: "-dV/dr",
    subject: "physics",
  },

  // Chemistry questions
  {
    id: "chemistry-1",
    text: "The IUPAC name of the compound CH₃-CH=CH-CHO is:",
    options: ["But-2-enal", "But-3-enal", "But-2-en-1-al", "But-3-en-1-al"],
    correctOption: "But-2-enal",
    subject: "chemistry",
  },
  {
    id: "chemistry-2",
    text: "The hybridization of carbon in diamond is:",
    options: ["sp³", "sp²", "sp", "dsp²"],
    correctOption: "sp³",
    subject: "chemistry",
  },
  {
    id: "chemistry-3",
    text: "The pH of a 0.001 M HCl solution is:",
    options: ["3", "2", "1", "4"],
    correctOption: "3",
    subject: "chemistry",
  },
  {
    id: "chemistry-4",
    text: "Which of the following is not a colligative property?",
    options: ["Viscosity", "Osmotic pressure", "Depression in freezing point", "Elevation in boiling point"],
    correctOption: "Viscosity",
    subject: "chemistry",
  },
  {
    id: "chemistry-5",
    text: "The oxidation state of chromium in K₂Cr₂O₇ is:",
    options: ["+6", "+3", "+2", "+4"],
    correctOption: "+6",
    subject: "chemistry",
  },
  {
    id: "chemistry-6",
    text: "The electronic configuration of Cu²⁺ is:",
    options: ["[Ar] 3d⁹", "[Ar] 3d¹⁰", "[Ar] 3d⁸ 4s¹", "[Ar] 3d⁷ 4s²"],
    correctOption: "[Ar] 3d⁹",
    subject: "chemistry",
  },
  {
    id: "chemistry-7",
    text: "Which of the following is not an aromatic compound?",
    options: ["Cyclohexane", "Benzene", "Naphthalene", "Pyridine"],
    correctOption: "Cyclohexane",
    subject: "chemistry",
  },
  {
    id: "chemistry-8",
    text: "The number of isomers possible for C₄H₉Cl is:",
    options: ["4", "5", "6", "7"],
    correctOption: "4",
    subject: "chemistry",
  },
  {
    id: "chemistry-9",
    text: "The reaction of phenol with bromine water gives:",
    options: ["2,4,6-tribromophenol", "o-bromophenol", "p-bromophenol", "m-bromophenol"],
    correctOption: "2,4,6-tribromophenol",
    subject: "chemistry",
  },
  {
    id: "chemistry-10",
    text: "The most electronegative element among the following is:",
    options: ["F", "Cl", "O", "N"],
    correctOption: "F",
    subject: "chemistry",
  },
  {
    id: "chemistry-11",
    text: "Which of the following is a strong electrolyte?",
    options: ["NaCl", "CH₃COOH", "NH₄OH", "C₆H₁₂O₆"],
    correctOption: "NaCl",
    subject: "chemistry",
  },
  {
    id: "chemistry-12",
    text: "The compound that does not undergo nucleophilic substitution reaction is:",
    options: ["Chlorobenzene", "Ethyl chloride", "Isopropyl chloride", "Methyl chloride"],
    correctOption: "Chlorobenzene",
    subject: "chemistry",
  },
  {
    id: "chemistry-13",
    text: "The geometry of PCl₅ molecule is:",
    options: ["Trigonal bipyramidal", "Tetrahedral", "Octahedral", "Square pyramidal"],
    correctOption: "Trigonal bipyramidal",
    subject: "chemistry",
  },
  {
    id: "chemistry-14",
    text: "The number of d-electrons in Fe²⁺ (Atomic number of Fe = 26) is:",
    options: ["6", "4", "3", "8"],
    correctOption: "6",
    subject: "chemistry",
  },
  {
    id: "chemistry-15",
    text: "Which of the following is not a Lewis acid?",
    options: ["NH₃", "BF₃", "AlCl₃", "FeCl₃"],
    correctOption: "NH₃",
    subject: "chemistry",
  },
  {
    id: "chemistry-16",
    text: "The correct order of increasing acidic strength is:",
    options: [
      "Phenol < Ethanol < Chloroacetic acid < Acetic acid",
      "Ethanol < Phenol < Acetic acid < Chloroacetic acid",
      "Ethanol < Acetic acid < Phenol < Chloroacetic acid",
      "Acetic acid < Chloroacetic acid < Phenol < Ethanol",
    ],
    correctOption: "Ethanol < Phenol < Acetic acid < Chloroacetic acid",
    subject: "chemistry",
  },
  {
    id: "chemistry-17",
    text: "The compound that gives a positive Fehling's test is:",
    options: ["Acetaldehyde", "Acetone", "Benzaldehyde", "Benzoic acid"],
    correctOption: "Acetaldehyde",
    subject: "chemistry",
  },
  {
    id: "chemistry-18",
    text: "The IUPAC name of the compound CH₃-CH(OH)-COOH is:",
    options: ["2-hydroxypropanoic acid", "2-hydroxyethanoic acid", "3-hydroxypropanoic acid", "3-hydroxybutanoic acid"],
    correctOption: "2-hydroxypropanoic acid",
    subject: "chemistry",
  },
  {
    id: "chemistry-19",
    text: "The major product formed when propene reacts with HBr in the presence of peroxide is:",
    options: ["1-bromopropane", "2-bromopropane", "1,2-dibromopropane", "propyl bromide"],
    correctOption: "1-bromopropane",
    subject: "chemistry",
  },
  {
    id: "chemistry-20",
    text: "The bond angle in NH₃ is approximately:",
    options: ["107°", "109.5°", "120°", "180°"],
    correctOption: "107°",
    subject: "chemistry",
  },
]

// Exam results collection
export const examResults: {
  id: string
  userId: string
  userName: string
  userEmail: string
  totalQuestions: number
  correctAnswers: number
  score: number
  subjectScores: Record<string, number>
  date: string
}[] = [
  // Sample results
  {
    id: "result1",
    userId: "demo1",
    userName: "Demo User",
    userEmail: "demo@example.com",
    totalQuestions: 60,
    correctAnswers: 46,
    score: 76.7,
    subjectScores: {
      math: 85,
      physics: 75,
      chemistry: 70,
    },
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: "result2",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    totalQuestions: 60,
    correctAnswers: 52,
    score: 86.7,
    subjectScores: {
      math: 90,
      physics: 85,
      chemistry: 85,
    },
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
]
