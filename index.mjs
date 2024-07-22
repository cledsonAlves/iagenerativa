import fetch from 'node-fetch';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Carregar configurações do arquivo JSON
const configPath = resolve('config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

// Carregar sentimentos do arquivo de texto
const sentimentosPath = resolve('sentimentos.txt');
const sentimentos = readFileSync(sentimentosPath, 'utf8').split('\n').filter(Boolean);

const apiKey = process.env.GEMINI_API_KEY || config.apiKey;
const genAI = new GoogleGenerativeAI(apiKey, { fetch });

// Concatena as instruções do sistema com quebras de linha
const systemInstruction = config.systemInstructions.join('\n');

async function run(prompt) {
  // Cria um prompt que inclui os sentimentos
  const fullPrompt = `${prompt}\nAqui estão alguns sentimentos a serem considerados: ${sentimentos.join(', ')}`;

  const model = genAI.getGenerativeModel({
    model: config.model,
    systemInstruction: systemInstruction,
  });

  try {
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = await response.text(); // Adicione 'await' aqui
    console.log(text);
  } catch (error) {
    console.error("Erro ao gerar o conteúdo:", error);
  }
}

// Captura o argumento da linha de comando
const prompt = process.argv[2] || config.defaultPrompt; // Valor padrão, se nenhum argumento for passado
run(prompt);
