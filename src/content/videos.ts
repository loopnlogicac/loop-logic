// Every playlist on the Loop & Logic YouTube channel, with its videos in
// playlist order. Read from youtube.com/@loopNlogic on 18 Nov 2026.
// Videos are embedded from YouTube, never copied; views count on YouTube.
// To refresh: re-read the playlists and replace the two text blocks below.

export interface ChannelVideo {
  id: string;
  title: string;
  /** Display length, e.g. "16:28" or "1:49:20". */
  duration: string;
  seconds: number;
  /** null = Loop & Logic; otherwise the channel that owns the video. */
  by: string | null;
}

export interface ChannelPlaylist {
  id: string;
  title: string;
  videoIds: string[];
}

export const CHANNEL_CHECKED_ON = '2026-11-18';

/** Videos in the playlists that belong to other channels (checked with YouTube oEmbed). */
const OTHER_CHANNELS: Record<string, string> = {
  'yutWy_7jHss': 'Q-bit Learning',
  '79fVSRD-Yi4': 'Electrical Engineering Solution',
  'NaxjSHhCEAM': 'Electrical Engineering Solution',
  '0DnhQbbXTAw': 'Electrical Engineering Solution',
  'esBosMCcCx0': 'Electrical Engineering Solution',
  'm0BoAXa0CYk': 'Electrical Engineering Solution',
  'aAsMlzI9unE': 'Electrical Engineering Solution',
  'HI6wtb2D04c': 'Electrical Engineering Solution',
  'rMQnPdC7J5c': 'Electrical Engineering Solution',
  'IXdMGoZjhQ8': 'Electrical Engineering Solution',
  'M48TzUqbJWQ': 'Intelligible Physics - Bishwajeet Chatterjee',
  'MPE9H5DMd2Q': "Chinmoy's Physics Solutions",
  'K0tju2f4Kg8': 'RATAN INSTITUTE OF - PHYSICS (Research)',
  '28qTvMg5MZw': 'Last moment tuitions',
  '8TEBhquIqhc': 'Last moment tuitions',
  'fNENWhaV680': 'HelloDiploma',
  'H-QWeaJEm7s': 'HelloDiploma',
  '0XVpD9tqayA': 'HelloDiploma',
  'WnAEB-JJda4': 'Perfect Computer Engineer',
  'AIpJB4eJom0': 'Perfect Computer Engineer',
  'EutdwX7bNHA': 'LEEEB',
  'Y61Nqo_kJKg': 'Perfect Computer Engineer',
  'YGb9xghSddc': 'Perfect Computer Engineer',
};

// id|title
const TITLES = String.raw`
F8OWdzcf6go|C Programming Introduction in Bangla | Beginners, SPL & PPS
3-b8QUMn2m4|First C Program in Bangla | Header Files & printf Explained
TNeSuQ6heJY|Data Types & Variables in C Bangla | Declaration & Naming Rules
uCMCAncnd3E|Simple Calculator in C Bangla | User Input & Output Project
hFyKPUhHja8|Binary Operators in C Bangla | Expressions for Beginners
qDe3NmJn9G8|Increment & Decrement in C Bangla | Unary Operators Explained
-hKyBMhs5sY|Take Off Programming Contest Preparation Bangla | Problem Solving
oKZQ9qwcsz8|PPS Midterm Question Solve Bangla | Fall 2023 | C Programming
8bqq-oOwhs0|PPS Midterm Question Solve Bangla | Summer 2025 | DIU CSE
FVwLNzYeo7w|C Programming Final Question Solve Bangla | Fall 2024
yPIqiy4rqu0|PPS Final Question Solve Bangla | Summer 2025 | C Programming
Em5alI4vU1M|Operator Precedence & Associativity in C Bangla | Solved Examples
Mm-iM3NFaJc|Expression Evaluation in C Bangla | Precedence & Associativity
loqMd16E_XE|If Else in C Bangla | Conditional Statements & Examples
6PYskvAmqvk|Nested If Else in C Bangla | Step-by-Step Examples
I3OxwOgC-U0|If Else Problems in C Bangla | 10 Solved Examples & Logic Building
kaKbn8cctXI|While Loop in C Bangla | Syntax, Examples & SPL Practice
yVVUheO9Fuc|Do While Loop in C Bangla | Examples & While Loop Comparison
renKZk61Y-s|For Loop in C Bangla | SPL For Loop with Solved Examples
1f-Vu5dLd_w|Nested Loops in C Bangla | Patterns & Multiplication Tables
97q_SvHy54g|Loop Problems in C Bangla | 5 Solved Examples + 40 Practice Tasks
xesw00UuTiU|Arrays in C Bangla Part 1 | Declaration, Initialization & Indexing
raVKeryrlyY|Arrays in C Bangla Part 2 | Traversal & Element Operations
Swqtlp4Qe-s|Array Example in C Bangla | Initialization & Printing with Loops
pZOE3GDiZNs|Array Program Walkthrough in C Bangla | Access & Print Elements
V5CiCYHH5bk|2D Arrays in C Bangla Part 1 | Rows, Columns & Initialization
SdL6dLGlgy4|2D Arrays in C Bangla Part 2 | Nested Loops & Traversal
0kt0aqbLZZQ|TOC Midterm One Shot | Spring 2025 Questions | Bangla | CSE224
Uo5IZxciqPM|TOC Midterm One Shot | Fall 2024 Questions | Bangla | CSE224
PYmz8M6evSo|Introduction to Theory of Computation | Bangla | CSE224
Jtwh372T1tc|Alphabet, String & Language | TOC Basics Bangla | CSE224
COq2t-qvkow|Strings: Prefix, Suffix & Substring | TOC Bangla | CSE224
2m0N_cgqzMo|Kleene Star & Positive Closure | TOC Bangla | CSE224
wyhAiX2onRU|Finite State Machine: Formal Definition | TOC Bangla | CSE224
RD9XfexanFM|ID3 Decision Tree Math Bangla | Entropy & Information Gain
AnJzqaKEbhA|Support Vector Machine (SVM) Explained in Bangla | Machine Learning
-zous9AMAAw|Hard Margin SVM Derivation Bangla | Step-by-Step Math
i4sKACmk9Sw|Decision Tree Threshold Selection Bangla | Numeric Features
vix-k6UC_Uc|Logistic Regression Bangla | 3 Solved Numerical Examples
YNIiD3ZLx_Y|Linear Regression Bangla | Least Squares & Solved Example
cqkJJxNL-ec|SVM Math in Bangla | Step-by-Step Support Vector Machine
SE-uHZHk-Mc|Decision Tree Math Bangla | Numeric Feature Worked Example
74GKhKA-1fo|Data Preprocessing in Machine Learning | Data Science Bangla Tutorial
pMl3iPlJXSw|Simple Linear Regression Solved Example
s9zVYasUeAU|Multi Variable Linear Regression
_glF8Qk23s4|Multicollinearity in Multi-Variable Linear Regression
hsGF3v1tctU|Gradient Descent Algorithm Math
Ud97lOC4LX8|REVISION CLASS C PROGRAMMING—PART 1
yutWy_7jHss|C Programming Midterm Question-Solving Class-1 || C Programming Exam Preparation || Q-bit Learning
-fgct5BGUNU|Differentiation Formulas & Solved Problems Bangla | MAT-101| DIU
eY2-LgvOt-Q|Logarithmic Differentiation Bangla | Solved Problems | MAT-101|DIU
9GLdWKx4f6k|Chain Rule Differentiation Bangla | Derivative Problems | MAT-101| DIU
Xzb3Sl1sNNo|Parametric Differentiation Bangla | Parametric Equations | MAT-101 | DIU
fxdbp1cW-y0|Factor & Remainder Theorems Bangla | MAT-101
6btPU4GyfPs|Inequalities Bangla | MAT-101
UqgXIW3dq_o|Functions, Types & Inverse Functions Bangla | MAT-101
VRDGgQp2Xzk|Limits Bangla | MAT-101
WmviWO2UQrs|Continuity Bangla | MAT-101
yS5NRaSwxxY|Polynomial Basics Bangla | MAT-101
QDlH1gTvzXI|Differentiability Bangla | MAT-101
6VGRIQ0Xxkk|Trigonometric Function Differentiation Formulas & Solved Problems Bangla | MAT-101| DIU
-FMWI-ztfEU|Introduction to Array | Structured Programming Language
oj2kk11MFKg|Array Practice Problems | Basic to Advanced | Programming & Problem Solving
O8mxDRL6JlQ|Propositional Logic | Discrete Mathematics Bangla | CSE212
68DfGTrGkrA|Propositional Equivalence | Discrete Mathematics Bangla | CSE212
aRIysVwBHKo|Predicates & Quantifiers | Discrete Mathematics Bangla | CSE212
U_xqXLO7GLY|Sets & Set Operations | Discrete Mathematics Bangla | CSE212
9fxQ4zC3tkg|Functions | Discrete Mathematics Bangla | CSE212
wV5_SxhD58w|Rules of Inference | Discrete Mathematics Bangla | CSE212
ztg5QRcbLFc|Mathematical Induction | Discrete Mathematics Bangla | CSE212
ZUHzudq2H-0|Relations | Discrete Mathematics Bangla | CSE212
f_FFPJq8i4M|Graph Models Part 1 | Discrete Mathematics Bangla | CSE212
S8Vuxx-39bQ|Graph Models Part 2 | Discrete Mathematics Bangla | CSE212
ntAxuTpaM_I|Graph Theory & Spanning Trees | Discrete Mathematics Bangla | CSE212
f3-Y_57GOqs|Number Systems, Boolean Algebra & Logic Gates | DLD Bangla
rUHFo4Vk6Ew|SOP & POS in Boolean Algebra | Standard Form Conversion Bangla
M_rQQANkHgc|K-Map Simplification in Bangla | Digital Logic Design Exam Prep
KDFPlAiJk9c|Digital Logic Design Midterm Questions Solved | Spring 2026 Bangla
A19jFfPewaY|SFG construction from equation - Part 2
muRhy9wYmho|Masson's Gain Formula
7ebBM2LSoU8|Introduction to Signal Flow Graph
pLa-I2eCojk|Routh-Hurwitz Criterion: All 3 Cases Explained with Examples | Stability Analysis
TF2kw9Cbb6U|Introduction to Stability Analysis
zEVWduNhCak|Steady State Error in Control System
qnCsO7VXqfE|AC Signal & Sinusoidal Waveform in Bangla | Properties Explained
YmriLPTCMaU|Leading vs Lagging Phase in AC Circuits | Bangla Tutorial
ki5K1f9XCPw|Phasor Representation in AC Circuits | Phasor Diagram Bangla Tutorial
zH-79wv3kzg|RLC Phasor Relationship & Impedance Combination | Bangla Tutorial
ICWvaH1qMcs|Average Value & RMS Value in AC Circuits | Bangla Tutorial
insu14Hn8G4|Instantaneous & Average Power in AC Circuits | Bangla Tutorial
P-Mg-HW1eJs|Apparent Power & Power Factor in AC Circuits | Bangla Tutorial
XjXaZAhy5kA|Complex Power & Power Triangle in AC Circuits | Bangla Tutorial
rIP4R_7dB-A|Beecrowd with C | EP 01 | Introduction & Understanding Problem Statements
gUtDJMo_3eM|BeeCrowd 1001 C Solution | Extremely Basic | Step-by-Step
4qVAUQ-5m9E|BeeCrowd 1007 C Solution | Difference | Beginner-Friendly
16cTyww1FIs|BeeCrowd 1008 C Solution | Salary | Step-by-Step
TWdQODRVOW8|BeeCrowd 1010 C Solution | Simple Calculate | Easy Tutorial
76Ec-x4UewY|BeeCrowd 1020 C Solution | Age in Days | Explained
o_3LV5-HNhw|BeeCrowd 1805 C Solution | Natural Sum | Formula Explained
01_cVZzeGDY|Programming Contest Preparation Guide | Competitive Programming Bangla Tutorial for Beginners
plLvM3y3gpU|EDC Midterm Question Solve Bangla | Fall 2025 | Electronic Devices and Circuits
Lc5kbBW4lwk|EDC Midterm Question Solve Bangla | Summer 2025 | Electronic Devices and Circuits
1PpOYSc22yQ|Semiconductor Basics Bangla | P-Type, N-Type & Energy Bands | EDC
ASsV_tw4mjU|Semiconductor & PN Junction Diode Bangla | Electronic Devices and Circuits
cyENDMxsZjk|Half Wave & Full Wave Rectifier Math Bangla | Solved Numerical Problems
WVQfHfUqQwM|Zener Diode Numerical Problems Bangla | Voltage Regulator Circuit Math
XY0GWYA0TPE|EDC Question Solve Bangla | Summer 2025 | Amplifiers, Oscillators & JFET
GORdAagEf4M|Instrumentation and Control: Chapter 1
PSFS0V1E2kg|Instrumentation and Control | Lecture 02 | Ammeter, Voltmeter & Rectifier-Based DC Meter Explained
bScdW7cpfWI|PMMC Rectifier-Type AC Voltmeter & Ammeter | Complete Numerical Tutorial
TE4nRT0YI7Y|Wattmeter Connection and Derivation Problem
79fVSRD-Yi4|1.Introduction to Control System | Open Loop and Closed Loop System Explained in Bangla
NaxjSHhCEAM|2.Feedback System in Control System | Positive vs Negative Feedback | Control System Bangla Tutorial
0DnhQbbXTAw|3.Transfer Function, Sensitivity & Stability | Feedback Effect in Control System | Bangla Tutorial
esBosMCcCx0|4.Solving Transfer Function for Circuits | Control System Engineering | Bangla Tutorial
m0BoAXa0CYk|5.Block Diagram Simplification Techniques | Control System Basics | Bangla Tutorial
aAsMlzI9unE|6.Solve Block Diagram Step by Step | Control System Example Solution 1 (Bangla Tutorial)
HI6wtb2D04c|7.Solve Block Diagram Step by Step | Control System Example Solution 2 (Bangla Tutorial)
rMQnPdC7J5c|8.Solve Block Diagram Step by Step | Control System Example Solution 3 (Bangla Tutorial)
IXdMGoZjhQ8|9.Solve Block Diagram Step by Step | Control System Example Solution 4 (Bangla Tutorial)
U3CUjKKVPXw|Alpha Beta Pruning with 2 Solved Examples | Artificial Intelligence Bangla Tutorial
5KZCPQzWZT0|Genetic Algorithm in Artificial Intelligence | Selection, Crossover & Mutation | AI Bangla Tutorial
C6SA6IxAlWw|A* Search Algorithm in Artificial Intelligence Explained | Informed Search | AI Bangla Tutorial
lbFZf4mkC8Y|Min Max Algorithm in Game Playing Explained | Artificial Intelligence Bangla Tutorial
Pzr4ex-QG0g|8 Puzzle Problem Using A* Search Algorithm | Artificial Intelligence Bangla Tutorial
17ulOYAy_fM|Hill Climbing Algorithm in Artificial Intelligence Explained | AI Bangla Tutorial
IJHh2QJuK8M|Natural Language Processing (NLP) in Artificial Intelligence Explained | AI Bangla Tutorial
3WUGb3Z_wJ0|CFG to CNF Conversion: Chomsky Normal Form | Bangla | CSE224
tvGHT64vUBY|CFG Simplification Explained | Context-Free Grammar | Theory of Computation Bangla Tutorial
Mso3l1faSGc|Logical Agents in Artificial Intelligence Explained | AI Bangla Tutorial
0uv-WJJdSTA|Uncertainty in Artificial Intelligence Explained | AI Bangla Tutorial
qLs9ZOW7WZ0|Artificial Neural Network (ANN) Explained | Deep Learning Bangla Tutorial
ifTvhvIdTCU|Perceptron Learning Rule Explained | Neural Networks | Machine Learning Bangla Tutorial
F5P7_zgb8eo|আম্মুর রান্নাঘরেই লুকিয়ে আছে মেশিন লার্নিং!
ewA_Ufr4FBo|COCOMO Model Explained with Math Solution | Effort, Time & Cost Estimation
FhZKVBS_WPA|Software Maintenance Models & Maintenance Cost Calculation | Software Engineering Bangla Tutorial
Erh9e2hNblk|UML Diagram from Scratch
3wwmhmOeQYY|Object-Oriented Modeling & UML Explained | Unified Modeling Language Tutorial
PMm2vVR2KbA|Software Testing Explained with Examples | White Box, Black Box, EP & Boundary Value Analysis
f2iC3NmKIec|Business Process Model and Notation (BPMN) Explained | Software Engineering Bangla Tutorial
R7FoKrrDlo8|OS Final Term Question Solution | Important Questions Explained
60s-iPyQIb8|Deadlock in Operating System | Conditions, Prevention, Avoidance & Detection | OS Bangla Tutorial
wtz5XdMz5X0|Banker’s Algorithm in Operating System | Deadlock Avoidance Explained | OS Tutorial in bangla
UTMf8lUISkM|Resource Allocation Graph (RAG) in Operating System | Deadlock Detection | OS Bangla Tutorial
73MTfWJn9bs|Best Fit, First Fit & Worst Fit in Fixed Partition Memory Allocation | OS Solved Problem| OS Bangla
QNOwYwmu-Qk|Page Replacement Algorithms in OS | FIFO, LRU & Optimal Explained | OS Bangla Tutorial | OS Bangla
l8w7B7xEMQY|Disk Scheduling Algorithms | Disk Scheduling in OS | FCFS, SSTF, SCAN, C-SCAN Explained in Bangla
llREZ69NzFw|Semaphore & Critical Section in OS | Process Synchronization Explained | OS Tutorial
L6GGdKxLMDo|Dining Philosophers Problem in OS | Deadlock & Synchronization Explained | OS Bangla Tutorial
RTP0UzlWtzg|Banker’s Algorithm Extra Resource Request | Safety Check & Request Handling Explained | OS Bangla
40WRpwuDkxY|Belady’s Anomaly in FIFO Page Replacement | Hits, Misses & Page Faults Explained | OS Bangla
zrkGG27W_ug|Regression Analysis Explained with Solved Problems | Statistics Bangla Tutorial
ZtwAdzmZvnk|Data Visualization Explained | Machine Learning & Data Science Bangla Tutorial
W2trKT69hXI|Correlation & Coefficient of Determination Explained | Statistics Bangla Tutorial
w3m8ztmePKY|Supervised, Unsupervised & Semi-Supervised Learning Explained | Machine Learning Bangla Tutorial
AVWUvCuXlcU|KNN Algorithm Solved Numerical Examples | K-Nearest Neighbors | Machine Learning Bangla Tutorial
sdFe96Fhpq8|Confusion Matrix, Precision, Recall & F1 Score Explained | Machine Learning Bangla Tutorial
fwAGLfUlLUk|MSE, RMSE & R² (Coefficient of Determination) Explained | Machine Learning Bangla Tutorial
rcl-eocpdmY|AI Search Problem Solving Explained | Artificial Intelligence Bangla Tutorial
KNh36cw8aHw|Breadth First Search (BFS) in Artificial Intelligence Explained | AI Bangla Tutorial
1_QL_SoXiiM|Depth First Search (DFS) in Artificial Intelligence Explained | AI Bangla Tutorial
7lw7M6sAiMM|Depth Limited Search (DLS) in Artificial Intelligence Explained | AI Bangla Tutorial
JkepVa6Fn8E|Uniform Cost Search (UCS) in Artificial Intelligence Explained | AI Bangla Tutorial
yDidX6izCCo|Iterative Deepening DFS (IDDFS) in Artificial Intelligence Explained | AI Bangla Tutorial
y8I4-KHemCs|Bidirectional Search in Artificial Intelligence Explained | AI Bangla Tutorial
uj4VedXe0Oc|Best First Search (Greedy) in Artificial Intelligence Explained | AI Bangla Tutorial
zAplobCsxF8|PEAS Framework for Intelligent Agents in AI Explained | AI Bangla Tutorial
NuRUwM33Imc|Electrostatics in One Shot | Physics Chapter 1 Complete Theory Lecture
Izx-iTsp7LA|Electrostatics Problem Solving | Complete Numerical Session
WLa67Bq3ncQ|Electrodynamics Full Chapter | Physics Chapter 2 Complete Explanation
YM4FJG7E0_s|Electrodynamics Numericals | Physics Chapter 2 Math Practice
vGQNFRkeXfo|Magnetic Field and Magnetism—Complete Theory & Concepts | Physics Chapter Explained
Z8Hxzj7T5PY|Magnetic Field and Magnetism Numericals | Important Math Problems Solved | Physics Chapter
5LKVhmpw-V0|Electromagnetic Induction - Complete Theory & Numericals | Physics Bangla Tutorial
bt4bWMZTnpw|Atomic Structure & Nuclear Physics | All Theory & Math Solved | Physics Bangla Tutorial
Mc8Mf7Q2Ei4|Nuclear Reactions & Radioactivity | All Theory & Math Solved | Physics Bangla Tutorial
2kVSFzKnHd0|Quantum Theory Explained | All Theory & Math Problems Solved | Physics Bangla Tutorial
M48TzUqbJWQ|Length Contraction: Derivation from Lorentz Transformations | Special Relativity
MPE9H5DMd2Q|02. আধুনিক পদার্থবিজ্ঞানের সূচনাঃ কাল দীর্ঘায়ন | সময়ের আপেক্ষিকতা | Modern Physics | [HSC|ADMISSION]
K0tju2f4Kg8|Derivation Of E=mc2 || Einstein Mass-Energy Equivalence Relation || Ratnesh Shukla
tofjo1Z1w5M|Introduction to Operating System | Operating System Bangla Tutorial | OS Bangla Tutorial
brIUpgD_p3Y|Accessing Operating System Services | OS Services | OS Services Bangla | OS Bangla Tutorial
-oeXgsxUoCI|Processes in Operating System | Process States, PCB & Scheduling |OS Lecture Bangla Tutorial
KysOSB4ZxYo|FCFS Scheduling Algorithm in OS | FCFS Scheduling Algorithm | FCFS Scheduling Algorithm Bangla
w5b8mQrpgwU|Shortest Job First (SJF) Scheduling Algorithm |SJF Scheduling Algorithm in Operating System
2cZp4HR6sRg|SRTF Scheduling Algorithm | SRTF Scheduling Algorithm Bangla | SRTF Scheduling Algorithm in OS
8t27nVRTZKs|Round Robin Algorithm | Round Robin Scheduling in OS | Round Robin Scheduling Bangla Tutorial
-syPwx_FrTM|Preemptive Priority Scheduling | Priority Scheduling Algorithm in Operating System | Bangla Tutorial
DvVkmkXiD0g|Propositional Logic - Lecture 1 | Discrete Mathematics Bangla Tutorial
oY2YVbjXBoA|Propositional Equivalences - Lecture 2 | Discrete Mathematics Bangla Tutorial
mqySdjqraXw|Predicates & Quantifiers - Lecture 3 | Discrete Mathematics Bangla Tutorial
D_mE6bU1TnQ|Rules of Inference - Lecture 4 | Discrete Mathematics Bangla Tutorial
oxXBa_jXkm4|Functions in Discrete Mathematics Explained | Discrete Math Bangla Tutorial
WIGOCxlxziE|Sets in Discrete Mathematics Explained | Discrete Math Bangla Tutorial
J6_r2fnHKK4|Mathematical Induction in Discrete Mathematics | Easy Explanation with Examples
Prd0NJ_hr2U|Graphs in Discrete Mathematics Explained | Discrete Math Bangla Tutorial
oln2SzBGhT0|Relations in Discrete Mathematics Explained | Discrete Math Bangla Tutorial
WsD-QcWrgsA|Tree in Discrete Mathematics Explained | Discrete Math Bangla Tutorial
qme4-SC_gu4|Electrical Circuit Basics in Bangla | Charge, Current, Voltage, Resistance & Ohm's Law
FpvT_RctUmc|Circuit Terms in Bangla | Node, Branch, Junction, Loop & Mesh Explained
TcqIacoRyB4|Series & Parallel DC Circuits | Step-by-Step Problem Solving in Bangla
XeOGTe-sJ7o|Voltage Divider Rule in Bangla | Formula, Derivation & Solved Problems
8y3bxP6PXYE|Current Divider Rule in Bangla | Formula, Derivation & Solved Problems
QqoYWiREy3E|Kirchhoff's Voltage Law (KVL) | Solved Circuit Problem in Bangla
_70zMUc50zc|Kirchhoff's Current Law (KCL) | Solved Circuit Problem in Bangla
uzBQuELX8qE|Mesh Analysis in Bangla | Step-by-Step Circuit Problem Solving
28qTvMg5MZw|Nodel analysis of Super node | BEE in Hindi
8TEBhquIqhc|Mesh analysis for Supermesh | BEE in Hindi
fNENWhaV680|Super Position Theorem In Bangla | সুপার পজিশন থিওরেম | Part-01 | Electrical Circuit Bangla
H-QWeaJEm7s|Super Position Theorem In Bangla | Example-01 | Part-02 | সুপার পজিশন থিওরেম| Electrical Circuit
0XVpD9tqayA|Super Position Theorem In Bangla | Part-03 | সুপার পজিশন থিওরেম | Elecrical Circuit
WnAEB-JJda4|Complete video on Thevenin Theorem Basic Electrical Engineering in Hindi [ 3 PROBLEMS SOLVED! ]
AIpJB4eJom0|Thevenin Theorem problems in Hindi [ Problem 1 ]
EutdwX7bNHA|Thevenin Theorem with Solved Math Problems in Bangla (Bangla Tutorial)
Y61Nqo_kJKg|All Norton's Theorem problems from Basic Electrical Engineering covered in Hindi [ 3 PROBLEMS ]
YGb9xghSddc|Norton's Theorem problems in Hindi [ Problem 1 ]
0q5sV8LKQek|Physics Mechanics for Beginners | Complete Concepts Explained | Part 1
8Soc2suaFis|Projectile Motion Complete Lecture | Range, Time of Flight, Maximum Height
1fwcZPhuSpk|Waves & Oscillations - Part 1 | Physics Bangla Tutorial
6Y7i-1cLhA4|Waves & Oscillations - Part 2 | Physics Bangla Tutorial
azIPCTqWuZQ|Thermodynamics Mathematics Explained | Simple Concepts and Formulas
t04d9k3fXiE|Optics Math Solve for Beginners | Easy Numerical Problems and Formula Explanation
wqpWX2C39CY|Heat & Thermodynamics Class 1 | Basics Explained
rzrQ-klKyyU|Heat & Thermodynamics Class 2 | Core Concepts
DJ2yA-4OMBU|Heat & Thermodynamics Class 3 | Core Concepts
ufDbGQfd9ik|Optics in Physics - Class 1: Basics of Light Explained | Physics Bangla Tutorial
-dXKxyJJxhg|Optics Class 2 | Physics Optics Concepts Explained
UhS1N7I4v2Y|Gamma Function Full Lecture | Properties, Formula & Relation with Beta Function
IwtsB7x8SWc|Beta Function Explained Step by Step | Relation with Gamma Function
BN5C-Sl84rk|Homogeneous Function Explained | Euler’s Theorem with Proof & Examples
Up5SpYTuZq0|Partial Differentiation Full Course | Partial Derivatives with Solved Examples
rITY0AsCd6s|Double Integration Full Lecture | Double Integral Solved Problems
m_pxTVoVJjo|Triple Integration Explained | Triple Integral Solved Problems | Advanced Calculus
JsNxbDw4Lco|Complex Variables Explained | Engineering Mathematics Bangla Tutorial
V8y7PuYOCdo|Matrices Basic Concepts Bangla | MAT102 Class 1 | Easy Matrix Introduction for Beginners
v4suJnHbfJA|Matrix Operations Bangla | Addition, Subtraction & Multiplication | MAT102 Class
SkRzhAFE9PA|Rank of Matrix Bangla | Row Echelon Form Explained | MAT102 Class 3
VWmV8-TcHik|Inverse & Orthogonal Matrix Bangla | Easy Explanation + Shortcuts | MAT102 Class 4
EiyqT86zRc8|Eigenvalues & Eigenvectors Bangla | Easy Concept + Problems | MAT102 Class 5
3dEManNXKsM|System of Linear Equations Bangla | Solve Using Matrix Method | MAT102 Class 6 (Part 1)
Oia_PCHX4Y4|System of Linear Equations Bangla | Solve Using Inverse & Row Reduction | MAT102 Class 6 (Part 2)
3jwuAfI141w|Linear Transformation Bangla | Concept + Examples | MAT102 Class 7
FronUpdV_98|Linear Dependent & Independent Bangla | Easy Concept + Tricks | MAT102 Class 8
DMfG4-MdwT8|Introduction to Molecular & Cellular Biology | Bioinformatics Bangla Tutorial
bMuc9onOCjE|Sequence Alignment: Global & Local Alignment Explained | Bioinformatics Bangla Tutorial
GjEr7M6R31U|DCS (Distributed Control System) & Chromatography Basics | IBCC | Instrumentation Bangla Tutorial
LZyvKjLPhkI|DNA Sequencing Explained | IBCC Biology Guide
oBKDfbfMYbU|Gene Duplication & Read Mapping Explained | Bioinformatics Bangla Tutorial
LrB7nkGBakY|FASTA Database Searching | IBCC Biology Guide
Z6n7EwBtmWc|Computer Fundamentals - Lecture 1 | Digital Literacy & Computer Systems Bangla Tutorial
39LH57PdRCU|Boolean Algebra Full Course in 40 Minutes | Logic Gates, Laws & Simplification Explained
y8BzRpCKnLo|Introduction to All Logic Gates | AND, OR, NOT, NAND, NOR, XOR, XNOR Explained
N4_wGkJ1Ga0|Construct Logic Circuits from Any Boolean Expression | Step-by-Step Tutorial
Zz1SXcmO0fM|Any Base to Any Base Conversion in 15 Minutes | Number System | Binary, Octal, Decimal & Hexadecimal
OarwEoks8D8|Number System Addition in 5 Minutes | Binary, Octal, Decimal, Hexadecimal & Any Base
qCSBCo3OebE|Subtraction Using Complement Method & Overflow | 1's & 2's Complement | Number System in Bangla
7Eve3D7O10A|Any Base Division Explained with Base 4 Example | Number System Division in Bangla
pYFeImClZ1A|Fundamentals of Artificial Intelligence (AI) & Machine Learning (ML) | Complete Beginner's Guide
TUm0aNkfJ0Y|Computer Fundamentals Midterm Question Solution | Previous Semester Questions Solved
9MrOZvyuqc0|Best Productivity Tools & Websites for Students 2026 | MS Office, Google Workspace, AI Tools & More
5-KEUXhV9Ns|Flowchart Basics Every Programmer Should Know | Programming Bangla Tutorial
mcgb7onCmNA|Data Science, Database & Big Data Explained | Computer Fundamentals
K_-9OZhzNWc|Network Security Basics for Beginners | Cybersecurity Explained in Bangla
CwcsR9dX7Bk|Symmetric Cryptography in Bangla | Private Key Cryptography & Encryption Explained
aAsDIMT3-K8|Asymmetric Cryptography in Bangla | Public Key Cryptography Explained with RSA Basics
Wynzn5GL6yk|Computer Fundamentals Final Question Analysis | Exam Preparation Bangla Tutorial
opMukoqp6qY|Emerging Web Technologies Explained | Modern Web Development & Future Trends
7Zm541KSZsg|Introduction to Cyber Security | Cybersecurity Basics for Beginners
dbniQjiOMo0|Data Science, Database & Big Data in Bangla | Complete Introduction for Beginners
bNgg1lNSBbY|IoT Devices Explained | Internet of Things (IoT) Basics for Beginners
eCnc-9wbOPI|Client Server Architecture
7nMU-HTMr50|Cloud Computing in Bangla | Types, Service Models & Deployment Models Explained
uefQ1q-VT_I|Algorithm Bangla Tutorial | Class 1 - Introduction to Algorithms & Complexity | Summer 2026
UxIoaU3cWcQ|Algorithm Bangla Tutorial | Class 2 - Algorithm Analysis & Complexity | Summer 2026
6uOl9zSlvvc|Algorithm Final Term Question Solution | Exam Preparation | Algorithm Bangla Tutorial
fS_QRPm03EU|Disjoint Set Union DSU Explained | Union Find with Path Compression
l4znHwJmgYk|BFS & DFS Algorithm Explained with Pseudocode and C Code | Graph Traversal Tutorial
LAX9dmwn0Tw|Euclidean Algorithm for GCD - Part 1 | Number Theory | Algorithm Bangla Tutorial
pzlzwN5bw2c|Midterm Algorithm Question Solving | Spring 2025 & Fall 2024 Complete Solutions
3_ZIkx88ZAA|Algorithm Bootcamp - Live Class 1 | Algorithm Bangla Tutorial
qBpNvl9l-DY|Algorithm Bootcamp - Live Class 2 | Algorithm Bangla Tutorial
B8H2Z1OC_Rk|25+ Time Complexity Questions Solved | Basic to Advanced
gcEiWnKeqUk|Engineering Mathematics Midterm Question Paper Solution | Previous Semester
6DxdlPP_3Uc|Engineering Mathematics Question Solve MIDTERM Spring 2026
qmwJpWXzWuE|Differential Equations: Order & Degree - Lesson 1 | Differential Equations Bangla Tutorial
04LMtF9eVp4|Formation of Differential Equations - Lesson 2 | Differential Equations Bangla Tutorial
AhkVs7A90Rs|Variable Separation Method - Lesson 3 | Differential Equations Bangla Tutorial
RltIyTeLknU|Linked List in Bangla | Previous Semester Questions Solved
wsHzdE1h3HE|Stack & Queue in Bangla | Previous Semester Questions Solved
CafpQ0qfIEY|Introduction to Linked List in Data Structures | Explained in Bangla for Beginners
gHlxccR8B40|Structures in C Programming Explained | C Bangla Tutorial
o_lrZ_qmpOY|Data Structure Live Class 3 | DSA Bangla Tutorial
0eqHp8Upa9g|Data Structure Live Class 2 | DSA Bangla Tutorial
0S05ZMKUYBY|Linked List Question Analysis
PZL29a8CP8A|Stack Oneshot
Soswmk6iwcI|Expression Evaluation 1 shot
9fjsFDfgqgc|QUEUE one-shot class
U21Mx6CkJtI|Electric Circuits Lab Tutorial _ Basic Components & Tinkercad Simulation _ Part - 1
v50llIS_pgU|Verification of Ohm's Law - Electric Circuit Lab Experiment 2 | Physics Bangla Tutorial
thaIIvP_hNQ|Basic Accounting: Cost Sheet Explained | Accounting Bangla Tutorial
BbUeOP_-AiA|Basic Accounting: Cost-Volume-Profit (CVP) Analysis Explained | Accounting Bangla Tutorial
yveNk8x6E1M|Basic Accounting: Worksheet Explained | Accounting Bangla Tutorial
`;

// #playlistId|title, then one videoId|duration per line, in playlist order
const PLAYLIST_TEXT = String.raw`
#PL66eeXZhO4z6o42wWTvMZZpwSAgxsQR5V|C Programming in Bangla | SPL, PPS & HSC ICT Chapter 5
F8OWdzcf6go|16:28
3-b8QUMn2m4|15:57
TNeSuQ6heJY|23:01
uCMCAncnd3E|19:58
hFyKPUhHja8|14:51
qDe3NmJn9G8|5:10
-hKyBMhs5sY|48:15
oKZQ9qwcsz8|59:27
8bqq-oOwhs0|1:49:20
FVwLNzYeo7w|1:34:39
yPIqiy4rqu0|1:34:40
Em5alI4vU1M|11:04
Mm-iM3NFaJc|13:34
loqMd16E_XE|20:57
6PYskvAmqvk|10:13
I3OxwOgC-U0|16:36
kaKbn8cctXI|12:37
yVVUheO9Fuc|6:11
renKZk61Y-s|9:27
1f-Vu5dLd_w|13:45
97q_SvHy54g|21:14
xesw00UuTiU|11:50
raVKeryrlyY|18:02
Swqtlp4Qe-s|9:52
pZOE3GDiZNs|11:59
V5CiCYHH5bk|14:40
SdL6dLGlgy4|14:45
#PLaneiiW1yIwA|TOC MID TERM
0kt0aqbLZZQ|1:24:40
Uo5IZxciqPM|41:47
PYmz8M6evSo|10:17
Jtwh372T1tc|14:16
COq2t-qvkow|10:25
2m0N_cgqzMo|8:21
wyhAiX2onRU|18:05
#PLZrRnQlMJw08|Machine Learning in Bangla | Concepts, Math & Examples
RD9XfexanFM|43:38
AnJzqaKEbhA|24:56
-zous9AMAAw|34:00
i4sKACmk9Sw|12:34
vix-k6UC_Uc|11:12
YNIiD3ZLx_Y|11:56
cqkJJxNL-ec|44:46
SE-uHZHk-Mc|28:43
74GKhKA-1fo|1:04:44
pMl3iPlJXSw|12:49
s9zVYasUeAU|11:37
_glF8Qk23s4|6:16
hsGF3v1tctU|13:52
#PLCrDUY95Hws4|REvision
8bqq-oOwhs0|1:49:20
oKZQ9qwcsz8|59:27
Ud97lOC4LX8|1:11:54
yutWy_7jHss|42:05
#PLKI11uRhyWyo|MAT-101
-fgct5BGUNU|30:37
eY2-LgvOt-Q|19:26
9GLdWKx4f6k|11:39
Xzb3Sl1sNNo|12:06
fxdbp1cW-y0|45:08
6btPU4GyfPs|52:48
UqgXIW3dq_o|34:11
VRDGgQp2Xzk|19:23
WmviWO2UQrs|16:04
yS5NRaSwxxY|10:31
QDlH1gTvzXI|22:05
6VGRIQ0Xxkk|47:45
#PLdy3tDZmQLoc|Array in C
-FMWI-ztfEU|22:30
oj2kk11MFKg|33:25
#PLRxmKODZHZdY|Discrete Mathematics 2.0
O8mxDRL6JlQ|56:35
68DfGTrGkrA|44:03
aRIysVwBHKo|34:52
U_xqXLO7GLY|39:28
9fxQ4zC3tkg|43:59
wV5_SxhD58w|37:16
ztg5QRcbLFc|24:46
ZUHzudq2H-0|1:41:49
f_FFPJq8i4M|49:37
S8Vuxx-39bQ|1:33:41
ntAxuTpaM_I|55:05
#PLDrZyglXC0_I|Digital Logic Design
f3-Y_57GOqs|1:12:47
rUHFo4Vk6Ew|46:29
M_rQQANkHgc|38:55
KDFPlAiJk9c|55:52
#PLJ_Ql24cr4dw|IC FInal
A19jFfPewaY|6:07
muRhy9wYmho|23:16
7ebBM2LSoU8|36:35
pLa-I2eCojk|31:49
TF2kw9Cbb6U|16:33
zEVWduNhCak|53:38
#PLeWFoKcHbhAg|EC Final
qnCsO7VXqfE|19:19
YmriLPTCMaU|18:11
ki5K1f9XCPw|33:30
zH-79wv3kzg|47:46
ICWvaH1qMcs|29:25
insu14Hn8G4|29:22
P-Mg-HW1eJs|30:16
XjXaZAhy5kA|27:07
#PLUYyHYU-qzUU|Beecrowd Problem Solving
rIP4R_7dB-A|12:57
gUtDJMo_3eM|5:45
4qVAUQ-5m9E|5:15
16cTyww1FIs|8:17
TWdQODRVOW8|8:20
76Ec-x4UewY|9:54
o_3LV5-HNhw|12:19
01_cVZzeGDY|47:54
#PLLpPXGmhoSA0|Electronic Devices and Circuits Bangla | EDC Tutorials & Question Solutions
plLvM3y3gpU|50:03
Lc5kbBW4lwk|34:50
1PpOYSc22yQ|1:03:07
ASsV_tw4mjU|1:07:49
cyENDMxsZjk|1:01:22
WVQfHfUqQwM|49:10
XY0GWYA0TPE|55:11
#PL66eeXZhO4z7sZtR9PMHy41ipvrUp5jSD|Instrumental and Control
GORdAagEf4M|23:00
PSFS0V1E2kg|55:15
bScdW7cpfWI|38:53
TE4nRT0YI7Y|27:02
79fVSRD-Yi4|21:26
NaxjSHhCEAM|14:10
0DnhQbbXTAw|17:21
esBosMCcCx0|14:40
m0BoAXa0CYk|23:52
aAsMlzI9unE|10:54
HI6wtb2D04c|10:53
rMQnPdC7J5c|8:07
IXdMGoZjhQ8|6:51
zEVWduNhCak|53:38
TF2kw9Cbb6U|16:33
pLa-I2eCojk|31:49
7ebBM2LSoU8|36:35
muRhy9wYmho|23:16
A19jFfPewaY|6:07
#PL66eeXZhO4z4gwINt6SRVFFp-xhMyCs_N|Artificial Intelligence Final
U3CUjKKVPXw|12:05
5KZCPQzWZT0|17:10
C6SA6IxAlWw|12:21
lbFZf4mkC8Y|6:39
Pzr4ex-QG0g|10:52
17ulOYAy_fM|14:43
IJHh2QJuK8M|41:47
3WUGb3Z_wJ0|19:18
tvGHT64vUBY|22:48
Mso3l1faSGc|26:37
0uv-WJJdSTA|13:39
qLs9ZOW7WZ0|26:30
ifTvhvIdTCU|16:49
F5P7_zgb8eo|5:15
#PL66eeXZhO4z7F__j9fnTgOajGUmo8nzuu|SWE
ewA_Ufr4FBo|16:52
FhZKVBS_WPA|15:12
Erh9e2hNblk|45:10
3wwmhmOeQYY|1:00:24
PMm2vVR2KbA|23:53
f2iC3NmKIec|19:54
F5P7_zgb8eo|5:15
#PL66eeXZhO4z4SaL9H1v_FOjsI3zz92P89|OS Final
R7FoKrrDlo8|23:55
60s-iPyQIb8|12:37
wtz5XdMz5X0|17:53
UTMf8lUISkM|10:42
73MTfWJn9bs|21:42
QNOwYwmu-Qk|16:09
l8w7B7xEMQY|18:38
llREZ69NzFw|21:56
L6GGdKxLMDo|26:53
RTP0UzlWtzg|11:50
40WRpwuDkxY|10:06
F5P7_zgb8eo|5:15
#PL66eeXZhO4z4j8fCZd7x0MWL08pitnH4Q|Data Science & Machine Learning Bangla Tutorial | Full Course
zrkGG27W_ug|23:34
74GKhKA-1fo|1:04:44
ZtwAdzmZvnk|24:19
W2trKT69hXI|22:23
w3m8ztmePKY|8:54
YNIiD3ZLx_Y|11:56
vix-k6UC_Uc|11:12
AVWUvCuXlcU|10:46
sdFe96Fhpq8|13:56
fwAGLfUlLUk|5:37
F5P7_zgb8eo|5:15
#PL66eeXZhO4z694xbE6GvcQqqJLX_N8cza|Artificial Intelligence (AI) Bangla Tutorial | Full Course
rcl-eocpdmY|12:03
KNh36cw8aHw|9:40
1_QL_SoXiiM|13:23
7lw7M6sAiMM|7:44
JkepVa6Fn8E|10:12
yDidX6izCCo|5:52
y8I4-KHemCs|7:56
C6SA6IxAlWw|12:21
uj4VedXe0Oc|7:33
zAplobCsxF8|10:53
5KZCPQzWZT0|17:10
U3CUjKKVPXw|12:05
lbFZf4mkC8Y|6:39
Pzr4ex-QG0g|10:52
17ulOYAy_fM|14:43
IJHh2QJuK8M|41:47
Mso3l1faSGc|26:37
0uv-WJJdSTA|13:39
qLs9ZOW7WZ0|26:30
ifTvhvIdTCU|16:49
F5P7_zgb8eo|5:15
#PL66eeXZhO4z6V0_URcjkELL-J-8GZTjfJ|PHY-102
NuRUwM33Imc|1:02:52
Izx-iTsp7LA|29:03
WLa67Bq3ncQ|25:38
YM4FJG7E0_s|39:41
vGQNFRkeXfo|32:56
Z8Hxzj7T5PY|26:44
5LKVhmpw-V0|16:49
bt4bWMZTnpw|48:42
Mc8Mf7Q2Ei4|41:36
2kVSFzKnHd0|28:15
M48TzUqbJWQ|9:44
MPE9H5DMd2Q|25:04
K0tju2f4Kg8|14:39
F5P7_zgb8eo|5:15
#PL66eeXZhO4z6069rHpvH3j7sKsi42-lac|Operating System (OS) Full Course in Bangla | CSE OS Bangla Tutorial
tofjo1Z1w5M|1:12:51
brIUpgD_p3Y|51:50
-oeXgsxUoCI|1:04:18
KysOSB4ZxYo|15:39
w5b8mQrpgwU|8:13
2cZp4HR6sRg|17:37
8t27nVRTZKs|22:31
-syPwx_FrTM|19:50
llREZ69NzFw|21:56
L6GGdKxLMDo|26:53
60s-iPyQIb8|12:37
wtz5XdMz5X0|17:53
RTP0UzlWtzg|11:50
UTMf8lUISkM|10:42
73MTfWJn9bs|21:42
QNOwYwmu-Qk|16:09
40WRpwuDkxY|10:06
l8w7B7xEMQY|18:38
R7FoKrrDlo8|23:55
F5P7_zgb8eo|5:15
#PL66eeXZhO4z6epJkdJnHNY6swkIZG7sRH|Discrete Mathematics
DvVkmkXiD0g|30:59
oY2YVbjXBoA|28:32
mqySdjqraXw|53:54
D_mE6bU1TnQ|28:07
oxXBa_jXkm4|33:41
WIGOCxlxziE|40:53
J6_r2fnHKK4|49:30
Prd0NJ_hr2U|1:17:33
oln2SzBGhT0|10:53
WsD-QcWrgsA|17:10
#PL66eeXZhO4z7zxrEROpPg7HvBrQ-afEHs|Electric Circuits Bangla Tutorial | DC & AC Circuit Analysis Full Course
qme4-SC_gu4|27:37
FpvT_RctUmc|13:45
TcqIacoRyB4|13:31
XeOGTe-sJ7o|12:17
8y3bxP6PXYE|9:55
QqoYWiREy3E|10:32
_70zMUc50zc|9:06
uzBQuELX8qE|22:23
28qTvMg5MZw|8:14
8TEBhquIqhc|11:53
fNENWhaV680|13:17
H-QWeaJEm7s|10:37
0XVpD9tqayA|11:33
WnAEB-JJda4|33:02
AIpJB4eJom0|10:10
EutdwX7bNHA|10:33
Y61Nqo_kJKg|24:32
YGb9xghSddc|10:50
qnCsO7VXqfE|19:19
YmriLPTCMaU|18:11
ki5K1f9XCPw|33:30
zH-79wv3kzg|47:46
ICWvaH1qMcs|29:25
insu14Hn8G4|29:22
P-Mg-HW1eJs|30:16
XjXaZAhy5kA|27:07
#PL66eeXZhO4z4wFFpXCW6vbegJxBcaYz-n|PHY-101 (PHY101) | DIU Daffodil International University | Loop and Logic
0q5sV8LKQek|51:44
8Soc2suaFis|35:45
1fwcZPhuSpk|20:07
6Y7i-1cLhA4|41:24
azIPCTqWuZQ|42:44
t04d9k3fXiE|35:30
wqpWX2C39CY|35:34
rzrQ-klKyyU|33:29
DJ2yA-4OMBU|23:31
ufDbGQfd9ik|50:00
-dXKxyJJxhg|46:08
F5P7_zgb8eo|5:15
#PL66eeXZhO4z7a-pM3YV38JP5f5U1rofBw|MAT-102 (MAT102) | DIU Daffodil International University | Loop and Logic
UhS1N7I4v2Y|45:52
IwtsB7x8SWc|40:21
BN5C-Sl84rk|27:14
Up5SpYTuZq0|1:09:58
rITY0AsCd6s|39:34
m_pxTVoVJjo|25:11
JsNxbDw4Lco|1:15:11
V8y7PuYOCdo|29:59
v4suJnHbfJA|34:41
SkRzhAFE9PA|35:54
VWmV8-TcHik|27:48
EiyqT86zRc8|17:09
3dEManNXKsM|24:32
Oia_PCHX4Y4|14:38
3jwuAfI141w|30:43
FronUpdV_98|14:35
F5P7_zgb8eo|5:15
#PL66eeXZhO4z65dn52igceukP7BfnG6PZV|Introduction to Biology and Chemistry
DMfG4-MdwT8|1:13:45
bMuc9onOCjE|53:24
GjEr7M6R31U|21:14
LZyvKjLPhkI|30:16
oBKDfbfMYbU|43:14
LrB7nkGBakY|32:10
F5P7_zgb8eo|5:15
#PL66eeXZhO4z6_OfsZzit4MHDnZFEYsvRP|Computer Fundamental
Z6n7EwBtmWc|47:58
39LH57PdRCU|38:10
y8BzRpCKnLo|16:03
N4_wGkJ1Ga0|18:45
Zz1SXcmO0fM|16:43
OarwEoks8D8|5:32
qCSBCo3OebE|7:00
7Eve3D7O10A|7:46
pYFeImClZ1A|47:14
TUm0aNkfJ0Y|1:54:56
9MrOZvyuqc0|21:42
5-KEUXhV9Ns|33:18
mcgb7onCmNA|50:25
K_-9OZhzNWc|12:00
CwcsR9dX7Bk|7:23
aAsDIMT3-K8|7:33
Wynzn5GL6yk|1:31:35
opMukoqp6qY|34:05
7Zm541KSZsg|40:31
dbniQjiOMo0|32:31
bNgg1lNSBbY|37:36
eCnc-9wbOPI|7:40
7nMU-HTMr50|45:17
F5P7_zgb8eo|5:15
#PL66eeXZhO4z6y7NDo_jAEd9RYy8TfYgB7|Algorithm
uefQ1q-VT_I|1:16:52
UxIoaU3cWcQ|1:08:49
6uOl9zSlvvc|1:42:33
fS_QRPm03EU|40:06
l4znHwJmgYk|37:00
LAX9dmwn0Tw|26:51
pzlzwN5bw2c|48:25
3_ZIkx88ZAA|1:42:01
qBpNvl9l-DY|2:05:22
B8H2Z1OC_Rk|1:48:40
#PL66eeXZhO4z40zsmGF1svBVHtvCVSJUZL|Engineering Mathematics
gcEiWnKeqUk|1:22:46
6DxdlPP_3Uc|38:19
qmwJpWXzWuE|22:00
04LMtF9eVp4|38:28
AhkVs7A90Rs|38:41
#PL66eeXZhO4z4Alloq0LhOoXnov8_mvEz0|Data Structures Live Class Spring - 2026
RltIyTeLknU|1:06:34
wsHzdE1h3HE|28:59
CafpQ0qfIEY|43:22
gHlxccR8B40|21:23
o_lrZ_qmpOY|1:35:29
0eqHp8Upa9g|1:21:33
0S05ZMKUYBY|1:02:28
PZL29a8CP8A|57:38
Soswmk6iwcI|1:13:14
9fjsFDfgqgc|37:39
#PL66eeXZhO4z7DqidWoQjJpd-QC7DoO2xD|Electric Circuits Lab
U21Mx6CkJtI|48:34
v50llIS_pgU|14:52
#PL66eeXZhO4z6egM60wj2oDm8WzMY4v1Lw|Basic Accounting
thaIIvP_hNQ|22:42
BbUeOP_-AiA|23:40
yveNk8x6E1M|21:55
`;

export function toSeconds(duration: string): number {
  return duration.split(':').reduce((total, part) => total * 60 + Number(part), 0);
}

function parse() {
  const titles = new Map<string, string>();
  for (const line of TITLES.trim().split('\n')) {
    const i = line.indexOf('|');
    titles.set(line.slice(0, i), line.slice(i + 1).trim());
  }
  const videos = new Map<string, ChannelVideo>();
  const playlists: ChannelPlaylist[] = [];
  let current: ChannelPlaylist | null = null;
  for (const line of PLAYLIST_TEXT.trim().split('\n')) {
    if (line.startsWith('#')) {
      const i = line.indexOf('|');
      current = { id: line.slice(1, i), title: line.slice(i + 1).trim(), videoIds: [] };
      playlists.push(current);
      continue;
    }
    const [id, duration] = line.split('|') as [string, string];
    current!.videoIds.push(id);
    if (!videos.has(id)) {
      videos.set(id, { id, title: titles.get(id) ?? id, duration, seconds: toSeconds(duration), by: OTHER_CHANNELS[id] ?? null });
    }
  }
  return { videos, playlists };
}

const DATA = parse();
export const VIDEOS: ReadonlyMap<string, ChannelVideo> = DATA.videos;
export const PLAYLISTS: readonly ChannelPlaylist[] = DATA.playlists;
export const getPlaylist = (id: string) => PLAYLISTS.find((p) => p.id === id);
export const getVideo = (id: string) => VIDEOS.get(id);
/** Every video title we parsed; used by the tests to check nothing is missing. */
export const TITLE_IDS: ReadonlySet<string> = new Set(TITLES.trim().split('\n').map((l) => l.slice(0, l.indexOf('|'))));
