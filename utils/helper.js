import {
  generateAnalysisForCloseRelative,
  generateAnalysisForScore,
  generateAnalysisForWorkPermit,
} from "../geminiService";

export const filterOutput = (output) => {
  const start = output.indexOf("[");
  const end = output.lastIndexOf("]") + 1;

  const arrayString = output.slice(start, end);

  const parsedArray = JSON.parse(arrayString);
  return parsedArray;
};

//Helpers used in Result.jsx
export const calculateFinalMeterScore = async (
  totalScore,
  EEEligibility,

  streamEligibility,
  scrapedDataInfo,
  workPermitDuration
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
      heading: "You qualify for 'Close relative in Manitoba selection'.",
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
        heading: "You qualify for 'Close relative in Manitoba selection'.",
        scoreLevel: "Very high",
      };

      const recomendations = await generateAnalysisForCloseRelative(
        closeRelativeAnalysis.scoreLevel
      );

      closeRelativeAnalysis.recomendations = recomendations;

      analysis.push(closeRelativeAnalysis);
    } else if (score > scrapedDataInfo?.lowestScoresCloseRelative - 25) {
      closeRelativeAnalysis = {
        heading: "You qualify for 'Close relative in Manitoba selection'.",
        scoreLevel: "Average",
      };
      const recomendations = await generateAnalysisForCloseRelative(
        closeRelativeAnalysis.scoreLevel
      );

      closeRelativeAnalysis.recomendations = recomendations;

      analysis.push(closeRelativeAnalysis);
    } else {
      closeRelativeAnalysis = {
        heading: "You qualify for 'Close relative in Manitoba selection'.",
        scoreLevel: "Low",
      };
      const recomendations = await generateAnalysisForCloseRelative(
        closeRelativeAnalysis.scoreLevel
      );

      closeRelativeAnalysis.recomendations = recomendations;

      analysis.push(closeRelativeAnalysis);
    }
  }

  //Work permit analysis

  let workPermitAnalysis;

  if (workPermitDuration === 1) {
    if (EEEligibility) {
      workPermitAnalysis = {
        heading: "Work permit duration is low!",
        workPermitScore: "Low",
      };
    } else {
      workPermitAnalysis = {
        heading: "Work permit duration is low!",
        workPermitScore: "Very low",
      };
    }
  } else {
    if (EEEligibility) {
      workPermitAnalysis = {
        heading: "Work permit duration is perfect",
        workPermitScore: "Very high",
      };
    } else {
      workPermitAnalysis = {
        heading: "Work permit duration is good!",
        workPermitScore: "High",
      };
    }
  }

  const recomendations = await generateAnalysisForWorkPermit(
    workPermitAnalysis.workPermitScore
  );

  workPermitAnalysis.recomendations = recomendations;

  analysis.push(workPermitAnalysis);
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
