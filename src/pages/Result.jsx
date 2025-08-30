import { useContext, useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import { useLocation } from "react-router-dom";
import { ScrapedDataContext } from "../context/ScrappedDataContext";
import {
  generateAnalysisForCloseRelative,
  generateAnalysisForScore,
  generateText,
} from "../../geminiService";
import { calculateFinalMeterScore } from "../../utils/helper";
import { QUESTIONNAIRE_CODE } from "../../utils/constants";

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
  if (!Array.isArray(finalInfo)) return -1;

  const language = finalInfo?.find(
    (obj) =>
      obj?.question === "Please provide the result of the test." && obj.answer
  );

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

const checkExpressEntryEligibility = (finalInfo) => {
  finalInfo?.forEach((info) => {
    if (
      info?.question ===
      "How many years of full-time work experience do you have in your home country?"
    )
      return true;
  });

  return false;
};

const checkStreamEligibility = (finalInfo) => {
  let eligibleStreams = [];
  let eligibleStreamsCategories = [];

  finalInfo?.forEach((info) => {
    if (info?.id === "STUDY_1") {
      eligibleStreams?.push(
        "Skilled Worker In Manitoba",

        "International Educational stream"
      );
      eligibleStreamsCategories?.push(
        "Completed post-secondary education in Manitoba"
      );
    }

    if (info?.id === "RELATIVE_1" && info?.answer === "Yes") {
      eligibleStreamsCategories?.push("Close relative in Manitoba selection");
    }
  });

  return {
    streams: eligibleStreams,
    categories: eligibleStreamsCategories,
  };
};

const calculateWorkPermitDuration = (finalInfo) => {
  const result = finalInfo?.find((info) => info?.id === "STUDY_1");

  if (result) {
    return result.answer === "1 year" ? 1 : 3;
  }

  return null;
};

const checkJobSituation = (finalInfo) => {
  let studyHistory = {};
  let workHistory = {};
  finalInfo?.forEach((info) => {
    switch (info?.id) {
      case "STUDY_1":
        studyHistory.canadianEducationDuration = info?.answer;
        break;
      case "STUDY_2":
        studyHistory.canadianEducationType = info?.answer;
        break;
      case "STUDY_3":
        studyHistory.canadianEducationName = info?.answer;
        break;
      case "STUDY_6":
        studyHistory.homeCountryEducation = info?.answer;
        break;
      case "WORK_2":
        workHistory.homeCountryWorkDesignation = info?.answer;
        break;
      default:
        break;
    }
  });

  return {
    studyHistory,
    workHistory,
  };
};

const Result = () => {
  const { state } = useLocation();
  const finalInfo = state?.finalInfo ? JSON.parse(state.finalInfo) : [];
  const { scrapedData, loading, error } = useContext(ScrapedDataContext);

  //console.log(finalInfo);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [EEEligibility, setEEEligibility] = useState(false);
  const [streamEligibility, setStreamEligibility] = useState({});
  const [workPermitDuration, setWorkPermitDuration] = useState(0);
  const [jobSituation, setJobSituation] = useState({});
  const [fieldJobAnswer, setFieldJobAnswer] = useState(null);
  const [scrapedDataInfo, setScrapedDataInfo] = useState(null);

  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    if (finalInfo) {
      const calculatedTotalPoints = calculatePoints(finalInfo);
      const calculatedEEEligibilty = checkExpressEntryEligibility(finalInfo);

      const calculatedStreamEligibility = checkStreamEligibility(finalInfo);
      const calculatedWorkPermitDuration =
        calculateWorkPermitDuration(finalInfo);

      const calculatedJobSituation = checkJobSituation(finalInfo);

      setTotalScore(calculatedTotalPoints);
      setEEEligibility(calculatedEEEligibilty);
      setStreamEligibility(calculatedStreamEligibility);
      setWorkPermitDuration(calculatedWorkPermitDuration);
      setJobSituation(calculatedJobSituation);

      const checkFieldJobAnswer = finalInfo?.find(
        (item) => item?.id === "JOB_1"
      )?.answer;

      if (checkFieldJobAnswer === QUESTIONNAIRE_CODE?.FIELD_JOB_ANSWER_2) {
        setFieldJobAnswer(false);
      } else setFieldJobAnswer(true);

      console.log("11111", checkFieldJobAnswer);
    }
  }, []);

  useEffect(() => {
    if (scrapedData) {
      const filteredScoresSWMEducation = scrapedData
        .filter(
          (item) =>
            item.title === "Skilled Worker in Manitoba" &&
            item.subtitle
              .toLowerCase()
              .includes("completed post-secondary education in manitoba") &&
            item.score !== null
        )
        .map((item) => Number(item.score));

      const filteredIES = scrapedData
        .filter((item) => item.title === "International Education Stream")
        .map((item) => Number(item));

      const filteredCloseRelative = scrapedData
        .filter((item) => item.subtitle.toLowerCase().includes("relative"))
        .map((item) => (Number(item.score) != 0 ? Number(item.score) : null));

      const lowestScoreSWMEducation = Math.min(...filteredScoresSWMEducation);
      const totalSWMEducationDraws = filteredScoresSWMEducation?.length;
      const totalIESDraws = filteredIES?.length;
      const totalCloseRelativeDraws = filteredCloseRelative?.length;
      const lowestScoresCloseRelative = Math.min(
        ...filteredCloseRelative?.filter((score) => score > 0)
      );

      setScrapedDataInfo({
        lowestScoreSWMEducation,
        totalSWMEducationDraws,
        totalIESDraws,
        totalCloseRelativeDraws,
        lowestScoresCloseRelative,
      });
    }
  }, [scrapedData]);

  useEffect(() => {
    if (scrapedDataInfo && analysis?.length === 0) {
      const getAnalysis = async () => {
        try {
          const analysis = await calculateFinalMeterScore(
            totalScore,
            EEEligibility,
            streamEligibility,
            scrapedDataInfo,
            workPermitDuration,
            jobSituation,
            fieldJobAnswer
          );

          setAnalysis(analysis);
        } catch (error) {
          console.error("Failed to calculate final meter score:", error);
        }
      };

      getAnalysis();
    }
  }, [scrapedDataInfo]);

  console.log("aaa", analysis);

  return (
    <div className="p-8 font-nunito-regular mt-8">
      <div className="flex flex-wrap">
        {/* Left side: the grid with cards */}
        <div className="w-full md:w-1/2 flex items-center">
          <div className="grid grid-cols-2 gap-4 w-full mx-auto">
            {/* Card 1 */}
            <div className="bg-tint-light p-6 rounded shadow-sm flex flex-col items-center gap-2">
              <p className="text-sm font-medium uppercase">Your score</p>
              <p className="text-4xl font-bold text-gray-800">{totalScore}</p>
            </div>

            {/* Card 2 */}
            <div className="bg-tint-light p-6 rounded shadow-sm flex flex-col items-center gap-2">
              <p className="text-sm font-medium uppercase">Express entry</p>
              <p className="text-3xl font-bold uppercase">
                {" "}
                {EEEligibility ? "Eligible" : "Not eligible"}{" "}
              </p>
            </div>

            {/* Full-width Card 3 */}

            <div className="col-span-2 p-6 bg-tint-light rounded shadow-sm text-left">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center uppercase">
                Streams eligible
              </h2>
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                {streamEligibility?.streams?.length > 0 &&
                  streamEligibility?.streams?.map((stream) => (
                    <li>{stream}</li>
                  ))}
              </ul>
            </div>
            <div className="col-span-2 p-6 bg-tint-light rounded shadow-sm text-left">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center  uppercase">
                Categories elegible
              </h2>
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                {streamEligibility?.categories?.length > 0 &&
                  streamEligibility?.categories?.map((category) => (
                    <li>{category}</li>
                  ))}
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
          <div className="mt-4 pl-6 pr-6 pt-4 pb-4 border border-gray-200 rounded-md bg-gray-100 ">
            <h3 className="text-xl font-semibold mb-2">Analysis result:</h3>
            <ul className="list-none text-md space-y-1">
              {analysis?.length > 0 &&
                analysis?.map((item, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer hover:text-yellow-900 transition-colors flex justify-between items-center px-2 py-1 rounded ${
                      selectedIndex === index ? "font-semibold" : ""
                    }`}
                    onClick={() => setSelectedIndex(index)}>
                    <span>{item.heading}</span>
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
          <div className="mt-4 pl-6 pr-6 pt-4 pb-4  bg-gray-100 border border-gray-200  rounded-md  h-full">
            <h3 className="text-2xl font-semibold mb-2 text-center uppercase tracking-wide">
              Details
            </h3>
            {selectedIndex !== null ? (
              <>
                <section className="mb-4">
                  <p className="text-gray-800 text-base font-medium">
                    {analysis[selectedIndex]?.invitationChances && (
                      <p className="text-gray-800 text-base font-medium">
                        <span className="font-semibold">
                          Invitation chances:
                        </span>{" "}
                        <span
                          className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                            analysis[
                              selectedIndex
                            ]?.invitationChances?.toLowerCase() === "high"
                              ? "bg-green-100 text-green-800"
                              : analysis[
                                  selectedIndex
                                ]?.invitationChances?.toLowerCase() ===
                                "average"
                              ? "bg-yellow-100 text-yellow-800"
                              : analysis[
                                  selectedIndex
                                ]?.invitationChances?.toLowerCase() === "low"
                              ? "bg-orange-100 text-orange-800"
                              : analysis[
                                  selectedIndex
                                ]?.invitationChances?.toLowerCase() ===
                                "very low"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                          {analysis[selectedIndex]?.invitationChances ?? "N/A"}
                        </span>
                      </p>
                    )}
                  </p>
                </section>

                {analysis[selectedIndex]?.id === "jobAnalysis" &&
                  analysis[selectedIndex]?.studyAnalysis?.length > 0 && (
                    <div className="space-y-8 mt-6">
                      {analysis[selectedIndex].studyAnalysis.map(
                        (item, idx) => (
                          <article key={idx} className="rounded-lg p-5 ">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                              {item.heading}
                            </h2>
                            <div className="space-y-4">
                              {item?.analysis?.map((ana, i) => (
                                <section
                                  key={i}
                                  className="bg-gray-50 p-4 rounded-md">
                                  {Object.entries(ana).map(([key, value]) => (
                                    <p
                                      key={key}
                                      className="text-gray-700 text-base">
                                      <span className="font-medium text-gray-900">
                                        {key}:
                                      </span>{" "}
                                      {value}
                                    </p>
                                  ))}
                                </section>
                              ))}
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  )}

                {analysis[selectedIndex]?.id === "skilledWorkerAnalysis" &&
                  Array.isArray(
                    analysis[selectedIndex]?.skilledWorkerAnalysis
                  ) &&
                  analysis[selectedIndex].skilledWorkerAnalysis.length > 0 && (
                    <div className="mt-6 space-y-8">
                      <p>{analysis[selectedIndex]?.detail}</p>
                      {analysis[selectedIndex].skilledWorkerAnalysis.map(
                        (item, idx) => (
                          <div
                            key={idx}
                            className="pb-4 border-b border-gray-300 last:border-b-0">
                            <ul className="list-inside list-disc space-y-1 text-gray-700">
                              {Object.entries(item).map(([key, value]) =>
                                key !== "heading" ? (
                                  <li key={key} className="flex">
                                    <span className="font-semibold capitalize mr-2 min-w-[120px]">
                                      {key}:
                                    </span>
                                    <span>{value}</span>
                                  </li>
                                ) : null
                              )}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {typeof analysis[selectedIndex]?.recomendations == "object" &&
                  analysis[selectedIndex]?.recomendations?.length > 0 && (
                    <section>
                      <p className="text-gray-800 text-base font-medium mb-2">
                        <span className="font-semibold">Recommendations:</span>
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {analysis[selectedIndex].recomendations.map(
                          (recomendation, idx) => (
                            <li key={idx}>{recomendation}</li>
                          )
                        )}
                      </ul>
                    </section>
                  )}

                {analysis[selectedIndex]?.id !== "jobAnalysis" &&
                  typeof analysis[selectedIndex]?.recomendations ===
                    "string" && (
                    <section>
                      <p className="text-gray-800 text-base font-medium mb-2">
                        {analysis[selectedIndex]?.recomendations}
                      </p>
                    </section>
                  )}
              </>
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
