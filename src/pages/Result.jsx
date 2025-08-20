import { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import { useLocation } from "react-router-dom";

const analysisItems = [
  {
    analysis: "Score is low for skilled worker stream.",
    details:
      "Your overall score does not meet the minimum threshold for the Skilled Worker Stream. You may improve it by gaining more work experience, education, or language proficiency.",
  },
  {
    analysis: "Express entry not eligible.",
    details:
      "You are currently not eligible for Express Entry due to an insufficient CLB score or missing qualifications. Review the criteria to understand your gaps.",
  },
  {
    analysis: "Not enough work permit.",
    details:
      "Your current work permit duration or type does not meet the eligibility requirements. A longer or more suitable permit may be needed.",
  },
];

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

  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    console.log("----", finalInfo);
    if (finalInfo) console.log(calculatePoints(finalInfo));
  }, []);
  return (
    <div className="p-8 font-nunito-regular">
      <div className="flex flex-wrap">
        {/* Left side: the grid with cards */}
        <div className="w-full md:w-1/2 flex items-center">
          <div className="grid grid-cols-2 gap-6 w-full mx-auto">
            {/* Card 1 */}
            <div className="bg-tint-light p-6 rounded shadow-lg flex flex-col items-center gap-2">
              <p className="text-sm font-medium uppercase">Your score</p>
              <p className="text-4xl font-bold text-gray-800">845</p>
            </div>

            {/* Card 2 */}
            <div className="bg-tint-light p-6 rounded shadow-lg flex flex-col items-center gap-2">
              <p className="text-sm font-medium uppercase">Express entry</p>
              <p className="text-4xl">Eligible</p>
            </div>

            {/* Full-width Card 3 */}
            <div className="col-span-2 mt-4 p-6 bg-tint-light rounded shadow-lg text-left">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Eligible for:
              </h2>
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                <li>Skilled Worker in Manitoba</li>
                <li>International Education Stream</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side: another div occupying 50% */}
        <div className="w-full md:w-1/2">
          <GaugeComponent
            value={50} // current gauge value
            arc={{
              subArcs: [
                { limit: 20, color: "#EA4228", showTick: false },
                { limit: 40, color: "#F58B19", showTick: false },
                { limit: 60, color: "#F5CD19", showTick: false },
                { limit: 100, color: "#5BE12C", showTick: false },
              ],
            }}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 mt-8 w-full mx-auto">
        {/* List section */}
        <div className="w-full md:w-1/2">
          <div className="mt-4 pl-6 pr-6 pt-4 pb-4 border border-gray-300 rounded-md bg-gray-10 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Analysis result:</h3>
            <ul className="list-none text-md space-y-1">
              {analysisItems.map((item, index) => (
                <li
                  key={index}
                  className={`cursor-pointer hover:text-yellow-900 transition-colors flex justify-between items-center px-2 py-1 rounded ${
                    selectedIndex === index ? "font-semibold" : ""
                  }`}
                  onClick={() => setSelectedIndex(index)}>
                  <span>{item.analysis}</span>
                  <span className="text-yellow-700 text-sm">
                    {selectedIndex === index ? "››" : "›"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detail section */}
        <div className="w-full md:w-1/2">
          <div className="mt-4 pl-6 pr-6 pt-4 pb-4  bg-white  rounded-md  h-full">
            <h3 className="text-2xl font-semibold mb-2 text-center uppercase tracking-wide">
              Details
            </h3>
            {selectedIndex !== null ? (
              <p className="text-gray-700 text-md leading-relaxed">
                {analysisItems[selectedIndex].details}
              </p>
            ) : (
              <div className="text-center text-gray-500 text-md">
                Select an analysis point to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
