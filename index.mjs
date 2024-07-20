import fetch from 'node-fetch';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';


const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey, { fetch });

async function run(prompt) {
  const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  system_instruction="Caso seja perguntado sobre Flamengo\nInforme sobre o bairro Flamengo do Rio.\nCaso seja perguntado sobre São Paulo\nForneça informações sobre a cidade de São Paulo.\nCaso seja perguntado sobre o clima\nInforme sobre a previsão do tempo atual."


});

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text(); // Adicione 'await' aqui
    console.log(text);
  } catch (error) {
    console.error("Erro ao gerar o conteúdo:", error);
  }
}

// Captura o argumento da linha de comando
const prompt = process.argv[2] || "Ola IA?"; // Valor padrão, se nenhum argumento for passado
run(prompt);
