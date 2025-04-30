"use strict";
// src/services/aiService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.callOpenAI = void 0;
const openai_1 = require("openai");
// Initialize OpenAI Client
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    timeout: 30000, // Global timeout: 30 seconds
    maxRetries: 3, // Auto retry for transient errors
});
// Helper: Exponential backoff delay calculation
const getBackoffDelay = (retryCount, baseDelay = 1000) => {
    return Math.min(baseDelay * Math.pow(2, retryCount), 10000); // Max delay 10s
};
// Main Helper: Safely call OpenAI with retry logic
const callOpenAI = async (prompt, systemMessage, maxRetries = 3) => {
    let retryCount = 0;
    let lastError;
    while (retryCount <= maxRetries) {
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo', // You can also switch to 'gpt-3.5-turbo' if needed
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 2500,
            });
            // ✅ SAFELY handle possible null content
            const content = completion.choices[0].message.content;
            if (!content) {
                throw new Error('No content received from OpenAI.');
            }
            return content;
        }
        catch (error) {
            lastError = error;
            const isRetryable = error instanceof openai_1.APIError && (error.message.includes('Connection error') ||
                error.message.includes('timeout') ||
                error.status === 429 || // Too Many Requests
                error.status === 500 || // Internal Server Error
                error.status === 502 ||
                error.status === 503 ||
                error.status === 504);
            if (isRetryable && retryCount < maxRetries) {
                const delay = getBackoffDelay(retryCount);
                console.warn(`Retrying OpenAI API in ${delay}ms (Attempt ${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
                continue;
            }
            console.error('OpenAI API Error:', {
                message: error.message,
                type: error.constructor.name,
                status: error.status,
                retryCount,
                stack: error.stack
            });
            throw new Error('Failed to generate content from OpenAI. ' + (error.message || ''));
        }
    }
    throw lastError || new Error('Maximum retry attempts reached.');
};
exports.callOpenAI = callOpenAI;
// import { OpenAI, APIError } from 'openai';
// // Initialize OpenAI Client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   baseURL: 'https://api.openai.com/v1',
//   timeout: 30000,
//   maxRetries: 2,
// });
// // Helper: Exponential backoff delay calculation
// const getBackoffDelay = (retryCount: number, baseDelay: number = 1000): number => {
//   return Math.min(baseDelay * Math.pow(2, retryCount), 8000); // Max delay 8s
// };
// // Main Helper: Safely call OpenAI with retry logic and optimizations
// export const callOpenAI = async (
//   prompt: string,
//   systemMessage: string,
//   maxRetries: number = 2
// ): Promise<string> => {
//   let retryCount = 0;
//   let lastError: any;
//   // Optimize prompt by removing unnecessary whitespace and newlines
//   const cleanedPrompt = prompt.trim().replace(/\s+/g, ' ');
//   const cleanedSystemMessage = systemMessage.trim().replace(/\s+/g, ' ');
//   while (retryCount <= maxRetries) {
//     try {
//       const completion = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo-1106', // Using the latest optimized model
//         messages: [
//           { role: 'system', content: cleanedSystemMessage },
//           { role: 'user', content: cleanedPrompt },
//         ],
//         temperature: 0.7,
//         max_tokens: 1500, // Reduced max tokens
//         presence_penalty: 0.1, // Slight penalty for repetition
//         frequency_penalty: 0.1, // Slight penalty for frequent tokens
//         response_format: { type: "text" }, // Force text response for faster processing
//       });
//       const content = completion.choices[0].message.content;
//       if (!content) {
//         throw new Error('No content received from OpenAI.');
//       }
//       return content;
//     } catch (error: any) {
//       lastError = error;
//       const isRetryable = error instanceof APIError && (
//         error.message.includes('Connection error') ||
//         error.message.includes('timeout') ||
//         error.status === 429 ||
//         (error.status >= 500 && error.status <= 504)
//       );
//       if (isRetryable && retryCount < maxRetries) {
//         const delay = getBackoffDelay(retryCount);
//         console.warn(`Retrying OpenAI API in ${delay}ms (Attempt ${retryCount + 1}/${maxRetries})`);
//         await new Promise(resolve => setTimeout(resolve, delay));
//         retryCount++;
//         continue;
//       }
//       console.error('OpenAI API Error:', {
//         message: error.message,
//         type: error.constructor.name,
//         status: error.status,
//         retryCount
//       });
//       throw new Error('Failed to generate content from OpenAI. ' + (error.message || ''));
//     }
//   }
//   throw lastError || new Error('Maximum retry attempts reached.');
// };
