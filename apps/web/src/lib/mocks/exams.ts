import type { MockExam } from "./types";

// PRD 02 (Mock Test Engine) FR1: marking schemes are data, not hardcoded
// logic, and the engine is generic across schemes — these two sample exams
// deliberately use different schemes (negative marking vs none) to prove
// that, not just describe it. Real content (state-wise, previous papers)
// arrives via the Exam & Papers Library (PRD 03, Term 2); until then this
// is a small hand-written sample set, not claimed to be a real past paper.
export const MOCK_EXAMS: MockExam[] = [
  {
    id: "neet-physics-sample",
    name: "NEET Physics — Quick Practice (Sample)",
    durationMinutes: 5,
    marking: { correct: 4, incorrect: -1, unanswered: 0 },
    questions: [
      {
        id: "q1",
        text: "The SI unit of electric charge is:",
        options: ["Ampere", "Coulomb", "Volt", "Ohm"],
        correctIndex: 1,
      },
      {
        id: "q2",
        text: "Which of these is a vector quantity?",
        options: ["Mass", "Speed", "Displacement", "Temperature"],
        correctIndex: 2,
      },
      {
        id: "q3",
        text: "The acceleration due to gravity on the surface of Earth is approximately:",
        options: ["9.8 m/s²", "3.8 m/s²", "6.8 m/s²", "1.8 m/s²"],
        correctIndex: 0,
      },
      {
        id: "q4",
        text: "Ohm's Law relates voltage, current, and:",
        options: ["Power", "Resistance", "Charge", "Frequency"],
        correctIndex: 1,
      },
      {
        id: "q5",
        text: "The work done by a force is a:",
        options: ["Vector quantity", "Scalar quantity", "Tensor quantity", "None of these"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "up-police-constable-sample",
    name: "UP Police Constable — GK & Reasoning (Sample)",
    durationMinutes: 5,
    marking: { correct: 1, incorrect: 0, unanswered: 0 },
    questions: [
      {
        id: "q1",
        text: "Uttar Pradesh's capital city is:",
        options: ["Kanpur", "Lucknow", "Agra", "Varanasi"],
        correctIndex: 1,
      },
      {
        id: "q2",
        text: "Complete the series: 2, 4, 8, 16, ?",
        options: ["24", "32", "30", "20"],
        correctIndex: 1,
      },
      {
        id: "q3",
        text: "The national bird of India is:",
        options: ["Peacock", "Sparrow", "Parrot", "Eagle"],
        correctIndex: 0,
      },
      {
        id: "q4",
        text: "A is the brother of B. B is the sister of C. C is the son of D. How is A related to D?",
        options: ["Son", "Daughter", "Nephew", "Cannot be determined"],
        correctIndex: 0,
      },
      {
        id: "q5",
        text: "Select the odd one out:",
        options: ["Triangle", "Square", "Circle", "Number"],
        correctIndex: 3,
      },
    ],
  },
];

export function getMockExam(id: string): MockExam | undefined {
  return MOCK_EXAMS.find((e) => e.id === id);
}
