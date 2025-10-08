import { GoogleGenAI, Part, Content, Chat } from "@google/genai";
import { ChatMessage, GeneratedReportData, Report, Theme, UserProfile, LegalAssistantResponse, StoredDocument } from '../types';
import { SYSTEM_PROMPT_CHAT, SYSTEM_PROMPT_REPORT_GENERATION, SYSTEM_PROMPT_THEME_ANALYSIS } from '../constants';
import { SYSTEM_PROMPT_SINGLE_INCIDENT_ANALYSIS } from '../constants/behavioralPrompts';
import { SYSTEM_PROMPT_LEGAL_ASSISTANT, SYSTEM_PROMPT_LEGAL_ANALYSIS_SUGGESTION, SYSTEM_PROMPT_DOCUMENT_ANALYSIS, SYSTEM_PROMPT_DOCUMENT_REDRAFT } from '../constants/legalPrompts';
import { INDIANA_LEGAL_CONTEXT } from "../constants/legalContext";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const formatUserProfileContext = (profile: UserProfile | null): string => {
    if (!profile || !profile.name) return '';
    
    let context = `The user's name is ${profile.name}`;
    if (profile.role) {
        context += `, and they identify as the ${profile.role}. The other parent should be referred to as the ${profile.role === 'Mother' ? 'Father' : 'Mother'}.`;
    }
    if (profile.children && profile.children.length > 0) {
        context += ` The child/children involved are: ${profile.children.join(', ')}.`;
    }
    return `\n### User Context\n${context}\n`;
}

const formatMessagesToContent = (messages: ChatMessage[]): Content[] => {
    return messages.map(msg => {
        const parts: Part[] = [{ text: msg.content }];
        if (msg.images) {
            msg.images.forEach(image => {
                parts.push({
                    inlineData: {
                        mimeType: image.mimeType,
                        data: image.data,
                    },
                });
            });
        }
        return {
            role: msg.role,
            parts,
        };
    });
};

export const getChatResponse = async (messages: ChatMessage[], userProfile: UserProfile | null): Promise<string> => {
    const contents = formatMessagesToContent(messages);
    const systemInstruction = SYSTEM_PROMPT_CHAT.replace('{USER_PROFILE_CONTEXT}', formatUserProfileContext(userProfile));

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response.text;
};

export const generateJsonReport = async (messages: ChatMessage[], userProfile: UserProfile | null): Promise<GeneratedReportData | null> => {
    const conversationText = messages
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n');
    
    const userPrompt = `Based on the conversation transcript provided below, please generate the incident report JSON.\n\n--- CONVERSATION START ---\n\n${conversationText}\n\n--- CONVERSATION END ---`;
    
    const systemInstruction = SYSTEM_PROMPT_REPORT_GENERATION.replace('{USER_PROFILE_CONTEXT}', formatUserProfileContext(userProfile));

    try {
        const chat: Chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            }
        });

        const response = await chat.sendMessage({ message: userPrompt });

        const jsonText = response.text.trim();
        const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        
        if (!cleanedJsonText) {
            console.error("Received empty response from report generation.");
            return null;
        }

        const reportData = JSON.parse(cleanedJsonText);
        
        if (reportData.content && reportData.category && reportData.tags) {
            return reportData as GeneratedReportData;
        }
        return null;
    } catch (e) {
        console.error("Failed to generate or parse report JSON:", e);
        return null;
    }
};

export const getThemeAnalysis = async (reports: Report[], category: string): Promise<Theme[]> => {
    const reportsContent = reports.map(r => `--- REPORT ---\n${r.content}\n--- END REPORT ---`).join('\n\n');
    const prompt = SYSTEM_PROMPT_THEME_ANALYSIS.replace('{CATEGORY_NAME}', category);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${prompt}\n\n## Incident Reports Content\n\n${reportsContent}`,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const jsonText = response.text.trim();
        const themes = JSON.parse(jsonText);
        if (Array.isArray(themes)) {
            return themes as Theme[];
        }
        return [];
    } catch (e) {
        console.error("Failed to get theme analysis:", e);
        return [];
    }
};

export const getSingleIncidentAnalysis = async (mainReport: Report, allReports: Report[], userProfile: UserProfile | null): Promise<{ analysis: string; sources: any[] }> => {
    try {
        const mainReportContent = `--- PRIMARY INCIDENT TO ANALYZE (ID: ${mainReport.id}, Date: ${new Date(mainReport.createdAt).toLocaleDateString()}) ---\n${mainReport.content}\n--- END PRIMARY INCIDENT ---`;

        const otherReportsContent = allReports
            .filter(r => r.id !== mainReport.id)
            .map(r => `--- SUPPORTING REPORT (ID: ${r.id}, Date: ${new Date(r.createdAt).toLocaleDateString()}) ---\n${r.content}\n--- END SUPPORTING REPORT ---`)
            .join('\n\n');

        const systemInstruction = SYSTEM_PROMPT_SINGLE_INCIDENT_ANALYSIS;
        const fullPrompt = `${systemInstruction}\n\n${formatUserProfileContext(userProfile)}\n\n## Incident Reports for Analysis:\n\n${mainReportContent}\n\n${otherReportsContent}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                tools: [{googleSearch: {}}],
            }
        });

        console.log('Raw response from Gemini:', response);
        console.log('Response candidates:', response.candidates);
        console.log('Response text:', response.text);

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const analysisText = response.text || '';

        if (!analysisText) {
            console.error('Empty response text received from Gemini API');
            throw new Error('Received empty response from AI. Please try again.');
        }

        return { analysis: analysisText, sources: sources };
    } catch (error: any) {
        console.error("Error generating single incident analysis:", error);
        if (error.message?.includes('empty response')) {
            throw error;
        }
        throw new Error(`Failed to generate behavioral insights: ${error.message || 'Unknown error'}`);
    }
};


export const getLegalAssistantResponse = async (
    reports: Report[], 
    documents: StoredDocument[], 
    query: string, 
    userProfile: UserProfile | null,
    analysisContext: string | null
): Promise<LegalAssistantResponse & { sources?: any[] }> => {
    const reportsContent = reports.map(r => `--- REPORT (ID: ${r.id}, Date: ${new Date(r.createdAt).toLocaleDateString()}) ---\n${r.content}\n--- END REPORT ---`).join('\n\n');
    const systemInstruction = `${SYSTEM_PROMPT_LEGAL_ASSISTANT}\n${formatUserProfileContext(userProfile)}`;
    
    try {
        let promptText = `${systemInstruction}\n\n## Incident Reports Available for Query:\n\n${reportsContent}`;

        if (analysisContext) {
            promptText += `\n\n## Forensic Behavioral Analysis (Primary Context):\n\n${analysisContext}`;
        }

        promptText += `\n\n## User's Question:\n\n${query}`;

        const textPart: Part = { text: promptText };

        const documentParts: Part[] = documents.map(doc => ({
            inlineData: {
                data: doc.data,
                mimeType: doc.mimeType,
            }
        }));

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, ...documentParts] },
            config: {
                 tools: [{googleSearch: {}}],
            }
        });
    
        const responseText = response.text;
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            throw new Error("No valid JSON object found in the response from Legal Assistant API.");
        }
        
        const jsonText = responseText.substring(firstBrace, lastBrace + 1);
        const parsedResponse = JSON.parse(jsonText);

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        if (parsedResponse.type && parsedResponse.content) {
            return { ...parsedResponse, sources } as LegalAssistantResponse & { sources?: any[] };
        }

        throw new Error("Invalid JSON structure from Legal Assistant API.");

    } catch (error) {
        console.error("Error getting or parsing legal assistant response:", error);
        return {
            type: 'chat',
            content: "I'm sorry, an unexpected error occurred while processing your request. Please try again."
        };
    }
};

export const getInitialLegalAnalysis = async (mainReport: Report, allReports: Report[], userProfile: UserProfile | null): Promise<LegalAssistantResponse & { sources?: any[] }> => {
    const mainReportContent = `--- PRIMARY INCIDENT TO ANALYZE (ID: ${mainReport.id}, Date: ${new Date(mainReport.createdAt).toLocaleDateString()}) ---\n${mainReport.content}\n--- END PRIMARY INCIDENT ---`;
    
    const otherReportsContent = allReports
        .filter(r => r.id !== mainReport.id)
        .map(r => `--- SUPPORTING REPORT (ID: ${r.id}, Date: ${new Date(r.createdAt).toLocaleDateString()}) ---\n${r.content}\n--- END SUPPORTING REPORT ---`)
        .join('\n\n');

    const systemInstruction = `${SYSTEM_PROMPT_LEGAL_ANALYSIS_SUGGESTION}\n${formatUserProfileContext(userProfile)}`;
    const fullPrompt = `${systemInstruction}\n\n## Incident Reports for Analysis:\n\n${mainReportContent}\n\n${otherReportsContent}`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                tools: [{googleSearch: {}}],
            }
        });
    
        const responseText = response.text;
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            throw new Error("No valid JSON object found in the response from Legal Analysis API.");
        }
        
        const jsonText = responseText.substring(firstBrace, lastBrace + 1);
        const parsedResponse = JSON.parse(jsonText);
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        if (parsedResponse.type === 'chat' && parsedResponse.content) {
            return { ...parsedResponse, sources } as LegalAssistantResponse & { sources?: any[] };
        }

        throw new Error("Invalid JSON structure from Legal Analysis API.");

    } catch (error) {
        console.error("Error getting or parsing initial legal analysis:", error);
        return {
            type: 'chat',
            content: "I'm sorry, an unexpected error occurred while analyzing the incident. Please try asking your question directly."
        };
    }
};

export const analyzeDocument = async (
    fileData: string, 
    mimeType: string, 
    userProfile: UserProfile | null
): Promise<string> => {
    const systemInstruction = `${SYSTEM_PROMPT_DOCUMENT_ANALYSIS}\n${formatUserProfileContext(userProfile)}`;
    
    const documentPart = {
        inlineData: {
            data: fileData,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: "Please review and analyze this document according to your instructions."
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [documentPart, textPart] },
            config: {
                systemInstruction: systemInstruction,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Error analyzing document:", error);
        return "I'm sorry, an unexpected error occurred while analyzing the document. Please try again.";
    }
};

export const redraftDocument = async (
    fileData: string,
    mimeType: string,
    analysisText: string,
    userProfile: UserProfile | null
): Promise<string> => {
    const systemInstruction = `${SYSTEM_PROMPT_DOCUMENT_REDRAFT}\n${formatUserProfileContext(userProfile)}`;

    const documentPart = {
        inlineData: {
            data: fileData,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: `Here is the analysis of the document you are about to redraft. Please incorporate all these suggestions into the new version:\n\n--- ANALYSIS ---\n${analysisText}\n--- END ANALYSIS ---`
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [documentPart, textPart] },
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error redrafting document:", error);
        return "I'm sorry, an unexpected error occurred while redrafting the document. Please try again.";
    }
};