import { useContext, useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import { useLocation } from "react-router-dom";
import { ScrapedDataContext } from "../context/ScrappedDataContext";
import {
  generateAnalysisForCloseRelative,
  generateAnalysisForScore,
  generateText,
} from "../../geminiService";

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

const calculateFinalMeterScore = async (
  totalScore,
  EEEligibility,

  streamEligibility,
  scrapedDataInfo
) => {
  let SWM = false;
  let SWMEducation = false;
  let IES = false;
  let closeRelative = false;
  let score = false;

  let finalMeterScore;

  let analysis = [];

  if (streamEligibility?.streams?.includes("Skilled Worker In Manitoba")) {
    SWM = true;

    if (
      streamEligibility?.categories?.includes(
        "Completed post-secondary education in Manitoba"
      )
    ) {
      SWMEducation = true;
    }
  }

  if (
    streamEligibility?.streams?.includes("International Educational stream")
  ) {
    IES = true;
  }

  if (
    streamEligibility?.categories?.includes(
      "Close relative in Manitoba selection"
    )
  ) {
    closeRelative = true;
  }

  if (totalScore >= scrapedDataInfo?.lowestScoreSWMEducation) {
    score = true;
  }

  //Score analysis
  if (SWMEducation && IES && score) {
    let scoreAnalysis;

    scoreAnalysis = {
      heading: "Great score!",
      invitationChances: "Very high",
    };

    const recomendations = await generateAnalysisForScore(
      scoreAnalysis.invitationChances
    );
    scoreAnalysis.recomendations = recomendations;

    analysis.push(scoreAnalysis);
  } else if (SWMEducation && IES && !score) {
    let scoreAnalysis;
    if (totalScore >= 800) {
      scoreAnalysis = {
        heading: "Score is good. Could be improved.",
        invitationChances: "High",
      };
    } else if (totalScore >= 780) {
      scoreAnalysis = {
        heading: "Average score. Needs improvement.",
        invitationChances: "Average",
      };

      //   if(lowestScoreSWMEducation - 50 >= totalScore) analysis.scoreAnalysis.recomendations.unshift(` `)
    } else if (totalScore >= 700) {
      scoreAnalysis = {
        heading: "Score is low. Needs action!",
        invitationChances: "Low",
      };
    } else {
      scoreAnalysis = {
        heading: "Score is very low. Needs urgent action!",
        invitationChances: "Very low",
      };
    }

    const recomendations = await generateAnalysisForScore(
      scoreAnalysis.invitationChances
    );

    scoreAnalysis.recomendations = recomendations;

    analysis.push(scoreAnalysis);
  }

  let closeRelativeAnalysis = [];

  if (SWMEducation && IES && score && closeRelative) {
    closeRelativeAnalysis = {
      heading:
        "You qualify for 'Close relative in Manitoba selection'. Check the analysis.",
      scoreLevel: "Very high",
    };

    const recomendations = await generateAnalysisForCloseRelative(
      closeRelativeAnalysis.scoreLevel
    );

    closeRelativeAnalysis.recomendations = recomendations;

    analysis.push(closeRelativeAnalysis);
  } else if (SWMEducation && IES && !score && closeRelative) {
    if (score > scrapedDataInfo?.lowestScoresCloseRelative) {
      closeRelativeAnalysis = {
        heading:
          "You qualify for 'Close relative in Manitoba selection'. Check the analysis.",
        scoreLevel: "Very high",
      };

      const recomendations = await generateAnalysisForCloseRelative(
        closeRelativeAnalysis.scoreLevel
      );

      closeRelativeAnalysis.recomendations = recomendations;

      analysis.push(closeRelativeAnalysis);
    } else if (score > scrapedDataInfo?.lowestScoresCloseRelative - 25) {
      closeRelativeAnalysis = {
        heading:
          "You qualify for 'Close relative in Manitoba selection'. Check the analysis.",
        scoreLevel: "Average",
      };
      const recomendations = await generateAnalysisForCloseRelative(
        closeRelativeAnalysis.scoreLevel
      );

      closeRelativeAnalysis.recomendations = recomendations;

      analysis.push(closeRelativeAnalysis);
    } else {
      closeRelativeAnalysis = {
        heading:
          "You qualify for 'Close relative in Manitoba selection'. Check the analysis.",
        scoreLevel: "Low",
      };
      const recomendations = await generateAnalysisForCloseRelative(
        closeRelativeAnalysis.scoreLevel
      );

      closeRelativeAnalysis.recomendations = recomendations;

      analysis.push(closeRelativeAnalysis);
    }
  }

  //   analysis.scoreAnalysis = generateAnalysisForScore(810);

  //   console.log(analysis);

  //   if (SWM && SWMEducation && IES && closeRelative && score)
  //     finalMeterScore = 95;
  //   else if (SWM && SWMEducation && IES && !score) {
  //     if (totalScore > 800 && closeRelative) finalMeterScore = 90;
  //     else if (totalScore > 750 && closeRelative) finalMeterScore = 75;
  //     else if (totalScore > 800 && !closeRelative) finalMeterScore = 80;
  //     else if (totalScore > 750 && !closeRelative) finalMeterScore = 65;
  //     else if (totalScore < 750 && totalScore > 700) finalMeterScore = 60;
  //     else if (totalScore <= 700) finalMeterScore = 45;
  //   } else if (SWM && !SWMEducation) {
  //     if (totalScore < 700) finalMeterScore = 60;
  //   }

  return analysis;
};

const Result = () => {
  const { state } = useLocation();
  const finalInfo = state?.finalInfo ? JSON.parse(state.finalInfo) : [];
  const { scrapedData, loading, error } = useContext(ScrapedDataContext);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [EEEligibility, setEEEligibility] = useState(false);
  const [streamEligibility, setStreamEligibility] = useState({});

  const [scrapedDataInfo, setScrapedDataInfo] = useState(null);

  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    if (finalInfo) {
      const calculatedTotalPoints = calculatePoints(finalInfo);
      const calculatedEEEligibilty = checkExpressEntryEligibility(finalInfo);

      const calculatedStreamEligibility = checkStreamEligibility(finalInfo);

      setTotalScore(calculatedTotalPoints);
      setEEEligibility(calculatedEEEligibilty);
      setStreamEligibility(calculatedStreamEligibility);
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
            scrapedDataInfo
          );

          setAnalysis(analysis);
        } catch (error) {
          console.error("Failed to calculate final meter score:", error);
        }
      };

      getAnalysis();
    }
  }, [scrapedDataInfo]);

  console.log(analysis);

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

                {typeof analysis[selectedIndex]?.recomendations ===
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
