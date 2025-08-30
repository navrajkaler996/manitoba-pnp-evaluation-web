import React, { useContext, useEffect, useState } from "react";
import { data as allData } from "../data";
import Button from "../components/Button";
import manitobaImage from "../assets/manitoba-welcome-screen.png";
import { ScrapedDataContext } from "../context/ScrappedDataContext";
import { useNavigate } from "react-router-dom";
// Placeholder for the Button component

// Placeholder for the Input component
const Input = ({ label, value, onChangeText, placeholder, numeric }) => (
  <div className="flex flex-col space-y-2 mb-4">
    {label && <label className="text-gray-700 font-medium">{label}</label>}
    <input
      type={numeric ? "number" : "text"}
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
      className="bg-gray-200 p-3 rounded-lg border-b-2 border-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
    />
  </div>
);

const Questionnaire = () => {
  const navigate = useNavigate();

  // const router = useRouter(); // React Router equivalent is useNavigate
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionNextId, setSelectedOptionNextId] = useState(null);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [data, setData] = useState(null);
  const [finalInfo, setFinalInfo] = useState([]);
  const [input, setInput] = useState("");
  const [type, setType] = useState(null);
  const [languageScores, setLanguageScores] = useState({
    listening: "",
    speaking: "",
    reading: "",
    writing: "",
  });

  const [optionNotSelected, setOptionNotSelected] = useState(false);

  useEffect(() => {
    if (nextQuestion) {
      setSelectedOption(null);
      setData([nextQuestion]);
    } else {
      const tempData = allData?.find((data) => data.question_id === "BASE");
      setData([tempData]);
    }
  }, [nextQuestion]);

  const handleOptionSelected = (index) => {
    setSelectedOption(index);
    setSelectedOptionNextId(data[0].options[index].next);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      if (optionNotSelected) setOptionNotSelected(false);
      let finalInfoTemp = [...finalInfo];
      finalInfoTemp.push({
        question: data[0].question,
        answer: data[0]?.options[selectedOption]?.text,
        points: data[0]?.options[selectedOption]?.points ?? null,
        id: data[0]?.question_id ?? null,
      });

      let selectedOptionNextIdTemp = selectedOptionNextId;
      setFinalInfo(finalInfoTemp);

      if (selectedOptionNextId === "RESULT") {
        navigate("/result", {
          state: {
            finalInfo: JSON.stringify(finalInfoTemp),
          },
        });

        return;
      }

      if (selectedOptionNextId !== null) {
        const endsWithAlphabet = /[A-Z]$/i.test(selectedOptionNextId);

        if (endsWithAlphabet) {
          selectedOptionNextIdTemp = selectedOptionNextId.slice(0, -1) + "*";
          setType(selectedOptionNextId);
        } else {
          selectedOptionNextIdTemp = selectedOptionNextId;
        }
      }

      const nextQuestionTemp = allData?.find((d) => {
        return d.question_id === selectedOptionNextIdTemp;
      });

      setNextQuestion(nextQuestionTemp);
    } else if (input?.length > 0) {
      const selectedOptionNextIdTemp = data[0].options[0].next;
      let finalInfoTemp = [...finalInfo];
      finalInfoTemp.push({
        question: data[0].question,
        answer: input,
        id: data[0]?.question_id ?? null,
      });
      const nextQuestionTemp = allData?.find(
        (d) => d.question_id === selectedOptionNextIdTemp
      );
      setFinalInfo(finalInfoTemp);
      setInput("");
      setSelectedOptionNextId(selectedOptionNextIdTemp);
      setNextQuestion(nextQuestionTemp);
    } else if (
      languageScores?.listening?.length > 0 ||
      languageScores?.speaking?.length > 0 ||
      languageScores?.length > 0 ||
      languageScores?.reading?.length > 0
    ) {
      const selectedOptionNextIdTemp = data[0].options[0].next;
      let finalInfoTemp = [...finalInfo];

      finalInfoTemp.push({
        question: data[0].question,
        answer: languageScores,
      });

      const nextQuestionTemp = allData?.find(
        (d) => d.question_id === selectedOptionNextIdTemp
      );
      setFinalInfo(finalInfoTemp);
      setLanguageScores({
        listening: "",
        speaking: "",
        reading: "",
        writing: "",
      });
      setSelectedOptionNextId(selectedOptionNextIdTemp);
      setNextQuestion(nextQuestionTemp);
    } else {
      setOptionNotSelected(true);
    }
  };

  return (
    <div
      className="flex flex-col items-center  pt-0 font-nunito-regular   
">
      <h1 className="text-3xl mb-5 font-semibold">Tell us about yourself</h1>
      {data?.map((d, questionIndex) => (
        <div
          key={questionIndex}
          className="flex flex-col items-center w-full max-w-lg">
          <div className="bg-tint-light w-12/12 min-h-[70px] flex justify-center items-center rounded p-4 mt-6">
            <p className="text-xl text-gray-800 font-semibold text-center tracking-wide">
              {d?.question}
            </p>
          </div>

          {d.options?.length > 0 &&
            d.options?.map((option, index) => {
              if (d?.type === "LANGUAGE_SCORES") {
                return (
                  <div key={index} className="w-11/12 mt-12 space-y-4">
                    {(type === "LANGUAGE_3A" ||
                      type === "LANGUAGE_3B" ||
                      type === "LANGUAGE_3C") && (
                      <>
                        <Input
                          label="Listening"
                          value={languageScores.listening}
                          onChangeText={(text) =>
                            setLanguageScores({
                              ...languageScores,
                              listening: text,
                            })
                          }
                          placeholder="Enter Listening score"
                          numeric={true}
                        />
                        <Input
                          label="Speaking"
                          value={languageScores.speaking}
                          onChangeText={(text) =>
                            setLanguageScores({
                              ...languageScores,
                              speaking: text,
                            })
                          }
                          placeholder="Enter Speaking score"
                          numeric={true}
                        />
                        <Input
                          label="Reading"
                          value={languageScores.reading}
                          onChangeText={(text) =>
                            setLanguageScores({
                              ...languageScores,
                              reading: text,
                            })
                          }
                          placeholder="Enter Reading score"
                          numeric={true}
                        />
                        <Input
                          label="Writing"
                          value={languageScores.writing}
                          onChangeText={(text) =>
                            setLanguageScores({
                              ...languageScores,
                              writing: text,
                            })
                          }
                          placeholder="Enter Writing score"
                          numeric={true}
                        />
                      </>
                    )}
                    {(type === "LANGUAGE_3D" || type === "LANGUAGE_3E") && (
                      <>
                        <Input
                          label="Compréhension de l’oral"
                          value={languageScores.listening}
                          onChangeText={(text) =>
                            setLanguageScores({
                              ...languageScores,
                              listening: text,
                            })
                          }
                          placeholder="Enter Listening score"
                        />
                        <Input
                          label="Expression orale"
                          value={languageScores.speaking}
                          onChangeText={(text) =>
                            setLanguageScores({
                              ...languageScores,
                              speaking: text,
                            })
                          }
                          placeholder="Enter Speaking score"
                        />
                        <Input
                          label="Compréhension écrite"
                          value={languageScores.reading}
                          onChangeText={(text) =>
                            setLanguageScores({
                              ...languageScores,
                              reading: text,
                            })
                          }
                          placeholder="Enter Reading score"
                        />
                        <Input
                          label="Expression écrite"
                          value={languageScores.writing}
                          onChangeText={(text) =>
                            setLanguageScores({
                              ...languageScores,
                              writing: text,
                            })
                          }
                          placeholder="Enter Writing score"
                        />
                      </>
                    )}
                  </div>
                );
              }

              if (option.text === null) {
                return (
                  <div key={index} className="mt-12 w-11/12">
                    <div className="flex items-end mt-7">
                      <img
                        src="https://placehold.co/50x50/E5E7EB/525252?text=Tip"
                        alt="Tip Icon"
                        className="w-12 h-12"
                      />
                      <p className="text-base ml-2 font-normal">
                        Mention the exact name.
                      </p>
                    </div>
                    <div className="mt-12">
                      <Input
                        label={null}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type here..."
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div key={index} className="mt-5 w-11/12">
                  <button
                    className={`w-full min-h-[50px] text-md flex justify-center items-center rounded p-4 hover:cursor-pointer transition-colors duration-200 ${
                      selectedOption === index ? "bg-green-400" : "bg-gray-200"
                    }`}
                    onClick={() => handleOptionSelected(index)}>
                    <p className="font-semibold text-center">{option.text}</p>
                  </button>
                </div>
              );
            })}
          <div className=" mt-10 w-full max-w-lg min-h-[70px] text-center  ">
            {/* <Button text="Next" onPress={handleNext} /> */}
            {optionNotSelected && (
              <p className="text-red-600 tracking-wider mb-5 ">
                Please select an option!
              </p>
            )}
            <Button onPress={handleNext} text="Next" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Questionnaire;
