export const data = [
  {
    question_id: "BASE",
    question: "What best describes your current situation?",
    options: [
      {
        text: "You are currently living in Manitoba on a study permit.",
        next: "STUDY_1",
      },
      {
        text: "You are currently living in Manitoba on a work permit.",
        next: {
          question: "What type of work are you currently doing?",
          options: [
            { text: "Full-time" },
            { text: "Part-time" },
            { text: "Freelance or contract" },
            { text: "Seasonal" },
            { text: "Other" },
          ],
        },
      },
      {
        text: "You are currently living in a foreign country.",
        next: {
          question: "Which region are you currently residing in?",
          options: [
            { text: "Asia" },
            { text: "Europe" },
            { text: "Africa" },
            { text: "North America" },
            { text: "Other" },
          ],
        },
      },
      {
        text: "You are currently living in any other Canadian province.",
        next: {
          question: "Which province are you currently living in?",
          options: [
            { text: "Ontario" },
            { text: "British Columbia" },
            { text: "Alberta" },
            { text: "Quebec" },
            { text: "Other" },
          ],
        },
      },
      {
        text: "You are currently living in Manitoba on a visitor visa.",
        next: {
          question: "What is the main purpose of your visit?",
          options: [
            { text: "Tourism" },
            { text: "Family visit" },
            { text: "Business" },
            { text: "Medical" },
            { text: "Other" },
          ],
        },
      },
    ],
  },
  {
    question_id: "STUDY_1",
    question: "What is the total duration of your studies?",
    options: [
      { text: "1 year", next: "STUDY_2" },
      { text: "2 years", next: "STUDY_2" },
      { text: "3 years or more", next: "STUDY_2" },
    ],
  },
  {
    question_id: "STUDY_2",
    question: "Are you doing a degree or diploma?",
    options: [
      {
        text: "Degree",
        next: "STUDY_3",
      },
      {
        text: "Diploma",
        next: "STUDY_3",
      },
    ],
  },
  {
    question_id: "STUDY_3",
    question: "What is the name of your course?",
    options: [
      {
        text: null,
        next: "STUDY_4",
      },
    ],
  },
  {
    question_id: "STUDY_4",
    question:
      "Do you have any prior education that you completed in your home country after high school?",
    options: [
      {
        text: "Yes",
        next: "STUDY_5",
      },
      {
        text: "No",
        next: "STUDY_7",
      },
    ],
  },
  {
    question_id: "STUDY_5",
    question:
      "What describes your total education after high school? (including both, your home country if applicable, and Canada)",
    options: [
      {
        text: "Master’s degree or Doctorate",
        next: "STUDY_6",
        points: 125,
      },
      {
        text: "Two post-secondary programs of at least 2 years each",
        next: "STUDY_6",
        points: 115,
      },
      {
        text: "One post-secondary program of three years or more",
        next: "STUDY_6",
        points: 110,
      },
      {
        text: "One post-secondary program of two years",
        next: "STUDY_6",
        points: 100,
      },
      {
        text: "One-year post-secondary program",
        next: "STUDY_6",
        points: 70,
      },
      {
        text: "Trade Certificate",
        next: "STUDY_6",
        points: 70,
      },
    ],
  },
  {
    question_id: "STUDY_6",
    question:
      "Enter names of every diploma or degrees you have completed in your home country.",
    options: [
      {
        text: null,
        next: "WORK_1",
      },
    ],
  },
  {
    question_id: "STUDY_7",
    question: "What describes your total education after high school?",
    options: [
      {
        text: "Master’s degree or Doctorate",
        next: "WORK_1",
        points: 125,
      },
      {
        text: "Two post-secondary programs of at least 2 years each",
        next: "WORK_1",
        points: 115,
      },
      {
        text: "One post-secondary program of three years or more",
        next: "WORK_1",
        points: 110,
      },
      {
        text: "One post-secondary program of two years",
        next: "WORK_1",
        points: 100,
      },
      {
        text: "One-year post-secondary program",
        next: "WORK_1",
        points: 70,
      },
      {
        text: "Trade Certificate",
        next: "WORK_1",
        points: 70,
      },
    ],
  },

  {
    question_id: "WORK_1",
    question: "Do you have any work experience in your home country?",
    options: [
      {
        text: "Yes",
        next: "WORK_2",
      },
      {
        text: "No",
        next: "LANGUAGE_1",
      },
    ],
  },
  {
    question_id: "WORK_2",
    question:
      "How many years of TEER 0, 1, 2, 3, 4 full-time work experience do you have in your home country?",
    options: [
      {
        text: "Less than 1 year",
        next: "WORK_3",
        points: 0,
      },
      {
        text: "1 year",
        next: "WORK_3",
        points: 40,
      },
      {
        text: "2 years",
        next: "WORK_3",
        points: 50,
      },
      {
        text: "3 years",
        next: "WORK_3",
        points: 60,
      },
      {
        text: "4 years or more",
        next: "WORK_3",
        points: 75,
      },
    ],
  },
  {
    question_id: "WORK_3",
    question:
      "Enter every designation you worked full time in your home country.",
    options: [
      {
        text: null,
        next: "LANGUAGE_1",
      },
    ],
  },
  {
    question_id: "LANGUAGE_1",
    question: "Have you taken a language test in Canada in the last two years?",
    options: [
      {
        text: "Yes",
        next: "LANGUAGE_2",
      },
      {
        text: "No",
        next: "LANGUAGE_4",
      },
    ],
  },
  {
    question_id: "LANGUAGE_2",
    question:
      "Which language test did you take in Canada in the last two years?",
    options: [
      {
        text: "CELPIP-General (Canadian English Language Proficiency Index Program)",
        next: "LANGUAGE_3A",
      },
      {
        text: "IELTS General Training (International English Language Testing System)",
        next: "LANGUAGE_3B",
      },
      {
        text: "PTE Core (Pearson Test of English)",
        next: "LANGUAGE_3C",
      },
      {
        text: "TEF Canada (Test d’évaluation de français)",
        next: "LANGUAGE_3D",
      },
      {
        text: "TCF Canada (Test de connaissance du français)",
        next: "LANGUAGE_3E",
      },
    ],
  },
  {
    question_id: "LANGUAGE_3*",
    question: "Please provide the result of the test.",
    type: "LANGUAGE_SCORES",
    options: [
      {
        text: null,
        next: "RELATIVE_1",
      },
    ],
  },
  {
    question_id: "LANGUAGE_4",
    question: "Are you planning to take a language test in Canada?",
    options: [
      {
        text: "Yes",
        next: "LANGUAGE_5",
      },
      {
        text: "No",
        next: "RELATIVE_1",
      },
    ],
  },
  {
    question_id: "LANGUAGE_5",
    question: "Which test are you planning to take?",
    options: [
      {
        text: "CELPIP-General (Canadian English Language Proficiency Index Program)",
        next: "LANGUAGE_3A",
      },
      {
        text: "IELTS General Training (International English Language Testing System)",
        next: "LANGUAGE_3B",
      },
      {
        text: "PTE Core (Pearson Test of English)",
        next: "LANGUAGE_3C",
      },
      {
        text: "TEF Canada (Test d’évaluation de français)",
        next: "LANGUAGE_3D",
      },
      {
        text: "TCF Canada (Test de connaissance du français)",
        next: "LANGUAGE_3E",
      },
    ],
  },
  {
    question_id: "LANGUAGE_6*",
    question: "How many scores can you achieve?",
    type: "LANGUAGE_SCORES",
    options: [
      {
        text: "scores",
        next: "RELATIVE_1",
      },
    ],
  },
  {
    question_id: "RELATIVE_1",
    question:
      "Do you have any close relative in Manitoba who is a permanent resident for atleast 1 year?",
    options: [
      {
        text: "Yes",
        next: "JOB_1",
      },
      {
        text: "No",
        next: "JOB_1",
      },
    ],
  },
  {
    question_id: "JOB_1",
    question:
      "Are you confident that you will find a job related to your education?",
    options: [
      {
        text: "I am confident I will find a job related to my education.",
        next: "RISK_1",
      },
      {
        text: "I am not confident I will find a job related to my education.",
        next: "JOB_2",
      },
    ],
  },
  {
    question_id: "JOB_2",
    question:
      "Are you confident that you will find a fulltime in demand job in Manitoba for skilled worker program?",
    options: [
      {
        text: "Yes",
        next: "RISK_1",
        points: 500,
      },
      {
        text: "No",
        next: "RISK_1",
      },
    ],
  },
  {
    question_id: "RISK_1",
    question:
      "Were you enrolled in a study program in any other Canadian province?",
    options: [
      {
        text: "Yes",
        next: "RISK_2",
      },
      {
        text: "No",
        next: "RISK_2",
      },
    ],
  },
  {
    question_id: "RISK_2",
    question: "Have you ever worked in another Canadian province?",
    options: [
      {
        text: "Yes",
        next: "AGE_1",
      },
      {
        text: "No",
        next: "AGE_1",
      },
    ],
  },
  {
    question_id: "AGE_1",
    question: "How old are you?",
    options: [
      { text: "18", points: 20, next: "RESULT" },
      { text: "19", points: 30, next: "RESULT" },
      { text: "20", points: 40, next: "RESULT" },
      { text: "21 to 45", points: 75, next: "RESULT" },
      { text: "46", points: 40, next: "RESULT" },
      { text: "47", points: 30, next: "RESULT" },
      { text: "48", points: 20, next: "RESULT" },
      { text: "49", points: 10, next: "RESULT" },
      { text: "50 or older", points: 0, next: "RESULT" },
    ],
  },
];
