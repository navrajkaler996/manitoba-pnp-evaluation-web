import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FINAL = [
  {
    question: "What best describes your current situation?",
    answer: "You are currently living in Manitoba on a study permit.",
    points: null,
  },
  {
    question: "What is the total duration of your studies?",
    answer: "2 years",
    points: null,
  },
  {
    question: "Are you doing a degree or diploma?",
    answer: "Diploma",
    points: null,
  },
  { question: "What is the name of your course?", answer: "sadasd" },
  {
    question:
      "Do you have any prior education that you completed in your home country after high school?",
    answer: "Yes",
    points: null,
  },
  {
    question:
      "What describes your total education after high school? (including both, your home country and Canada",
    answer: "One post-secondary program of three years or more",
    points: 110,
  },
  {
    question:
      "Enter names of every diploma or degrees you have completed in your home country.",
    answer: "asdsadas",
  },
  {
    question: "Do you have any work experience in your home country?",
    answer: "Yes",
    points: null,
  },
  {
    question:
      "How many years of full-time work experience do you have in your home country?",
    answer: "3 years",
    points: 60,
  },
  {
    question:
      "Enter every designation you worked full time in your home country.",
    answer: "asdsad",
  },
  {
    question: "Have you taken a language test in Canada in the last two years?",
    answer: "Yes",
    points: null,
  },
  {
    question:
      "Which language test did you take in Canada in the last two years?",
    answer:
      "CELPIP-General (Canadian English Language Proficiency Index Program)",
    points: null,
  },
  {
    question: "Please provide the result of the test.",
    answer: { listening: "11", speaking: "9", reading: "11", writing: "11" },
  },
  {
    question:
      "Do you have any close relative in Manitoba who is a permanent resident for atleast 1 year?",
    answer: "No",
    points: null,
  },
  {
    question:
      "Are you confident that you will find a job related to your education?",
    answer: "I am not confident I will find a job related to my education.",
    points: null,
  },
  {
    question:
      "Are you confident that you will find a fulltime in demand job in Manitoba for skilled worker program?",
    answer: "Yes",
    points: 500,
  },
  {
    question:
      "Were you enrolled in a study program in any other Canadian province?",
    answer: "No",
    points: null,
  },
  {
    question: "Have you ever worked in another Canadian province?",
    answer: "No",
    points: null,
  },
];
const celpipToCLB = (score) => {
  const parsedScore = parseInt(score);

  if (parsedScore >= 10) return 10;
  if (parsedScore === 9) return 9;
  if (parsedScore === 8) return 8;
  if (parsedScore === 7) return 7;
  if (parsedScore === 6) return 6;
  if (parsedScore === 5) return 5;

  return null;
};

const getFinalCLBLevel = (scores) => {
  const clbScores = Object.values(scores).map(celpipToCLB);

  if (clbScores.includes(null)) {
    return null;
  }

  const clb = Math.min(...clbScores);

  if (clb >= 8) return 100;
  else if (clb === 7) return 88;
  else if (clb === 6) return 80;
  else if (clb === 5) return 68;
  else if (clb === 4) return 48;
  else return 0;
};

const calculatePoints = (finalInfo) => {
  console.log(typeof finalInfo);
  if (!Array.isArray(finalInfo)) return -1;

  const language = finalInfo?.find(
    (obj) =>
      obj?.question === "Please provide the result of the test." && obj.answer
  );

  console.log("language", language);

  let langaugePoints = language?.answer
    ? getFinalCLBLevel(language?.answer)
    : 0;

  let finalPoints =
    finalInfo.reduce((total, item) => {
      if (typeof item?.points == "number") {
        return total + item?.points;
      }
      return total;
    }, 0) + langaugePoints;

  return finalPoints;
};

const Result = () => {
  const { state } = useLocation();
  const finalInfo = state?.finalInfo ? JSON.parse(state.finalInfo) : [];

  useEffect(() => {
    console.log("----", finalInfo);
    if (finalInfo) console.log(calculatePoints(finalInfo));
  }, []);
  return <div></div>;
};

export default Result;
