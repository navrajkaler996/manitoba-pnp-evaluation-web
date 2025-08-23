import { GoogleGenerativeAI } from "@google/generative-ai";
import { filterOutput } from "./utils/helper";

// WARNING: This is for prototyping only! Do not use your real API key in production
// client-side code.
const API_KEY = "AIzaSyBitvCLK44U6NGRT5ycyTl80_MGEtRK8lw"; // Keep this empty! Canvas will inject the API key for you.

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the generative model to use
// We use gemini-2.5-flash-preview-05-20 for text generation.
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
});

/**
 * Generates a text response from the Gemini model based on a given prompt.
 *
 * @param {string} prompt The text prompt to send to the model.
 * @returns {Promise<string>} A promise that resolves to the generated text response.
 */
export async function generateText(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate content. Please try again.";
  }
}

export async function generateAnalysisForScore(invitationChances) {
  try {
    const result = await model.generateContent(
      `
      The value of invitation changes is: ${invitationChances}.
      If value is very high, give one recomendation. 1. Your score is higher than the least score in Skilled worker Manitoba (Completed post-secondary education in Manitoba). Your chances are very high and doesn't need any improvement.
      If value is high, give two recomendations. 1. Despite score being good, still try to increase the score if possible. 2. Both skilled worker in Manitoba and International Education Stream can work but priority should be IES.
      If value is average, give three recomendations. 1. Try to get your score above 800. 2. Field job is the best option if score cannot come close to the lowest Skilled Workers scre in last 12 months, that was: ", 3. If field job is not possible, find a TEER 0, 1, 2, 3, or 4 job which is often targeted by MPNP.
      If value is low, give four recomendations. 1. Score is very low. 2. Field job is the best option. 3. The second option is to find a TEER 0, 1, 2, 3, or 4 job which is often targeted by MPNP. 4. If the above two options are not possible, maximise your language profiency and learn the second language. ",
      If value is very low, give four recomendations. 1. Score is not enough.
          2. Field job is the best option. 
          3. The second option is to find a TEER 0, 1, 2, 3, or 4 job which is often targeted by MPNP. 
          4. Would not recommend going for Skilled worker in Manitoba stream without a noc-specific job which is often targeted by MPNP.
      
          ********
          You have to polish the recomendations yourself. Output should be an array of strings. Each string representing recomendation. There should be nothing else in the output. 
      
          `
    );
    const response = await result.response;
    const text = response.text();

    return filterOutput(text);
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate content. Please try again.";
  }
}

export async function generateAnalysisForCloseRelative(scoreLevel) {
  try {
    const result = await model.generateContent(
      `
        The value of scoreLevel is: ${scoreLevel}.
        If value is very high, give one recomendation. 1. Your score is higher than the lowest score in Close relative in Manitoba selection in last 12 months. The chances of getting an invitation if the draw comes out are very high.

        If value is average, give one recomendations. 1. Though your score is not more than the score in Close relative in Manitoba selection in last 12 months, it is close enough. Chances are good you might get an invitation in future draws.
        If value is low, give one recomendations. 1. Though you qualify for 'Close relative in Manitoba selection', your score is quite low when compared to the lowest score in this category in last 12 months.,
   
            ********
            You have to polish the recomendation yourself. Try to give 3 to 5 lines. Output should be a string. There should be nothing else in the output. 
        
            `
    );
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate content. Please try again.";
  }
}

export async function generateAnalysisForWorkPermit(workPermitScore) {
  try {
    const result = await model.generateContent(
      `workPermitScore
        The value of workPermitScore is: ${workPermitScore}.
        If value is very high, give one recomendation. 1. You will recieve 3 years of work permit and you are already elgible for Express entry. This is a perfect combination.

        If value is high, give two recomendations. 1. You will recieve 3 years of work permit which is perfect but you are not eligible for Express entry.
                                                   2. Processing time for Express Entry under PNP is 8 months while non-express entry is 20 months. It would save you a lot of time if you can find a job which could make you eligible for Express Entry!
        If value is low, give three recomendations. 1. You are Express entry eligible which fastens your process but still one year is low considering the processing time.
                                    2. Processing time for MPNP more than six months and express entry under PNP category is 8 months. These estimations are after you recieve invitation for MPNP and Express entry, respectively.
                                    3. So 1 year of work permit is low. The best path is to have an employer that could support a close work permit.
            
            If value is very low, give four recomendations. 1. One year of work permit without express entry eligibility is very low considering longer processing time.
                                    2. Processing time for MPNP more than six months and non-express entry is 20 months. These estimations are after you recieve invitation for MPNP.
                                    3. So 1 year of work permit is very low. If your invitation chances are low, the best option is to take another one year course if you have not applied for PGWP.
                                    4. If you have applied for PGWP, then make sure to find an employer that could support a closed work permit.
           
            
                      
             ********
          You have to polish the recomendations yourself. Output should be an array of strings. Each string representing recomendation. There should be nothing else in the output. 
      
            `
    );
    const response = await result.response;
    const text = response.text();

    return filterOutput(text);
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate content. Please try again.";
  }
}
