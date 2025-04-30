// import { Request, Response } from 'express';
// import { callOpenAI } from '../services/aiService';
// import GeneratedContent from '../models/GeneratedContent';

// // Generate Interview Questions based on Resume
// export const generateQuestions = async (req: Request, res: Response) => {
//   try {
//     const { resumeData } = req.body;

//     if (!resumeData) {
//       return res.status(400).json({ message: 'Resume data is required.' });
//     }

//     const prompt = `Generate 40 personalized interview questions based on this candidate:

//     Name: ${resumeData.personalInfo.name}
//     Role: ${resumeData.personalInfo.role || 'Not specified'}
//     Summary: ${resumeData.personalInfo.summary || 'No summary provided'}

//     Key Skills: ${resumeData.skills.slice(0, 5).map((skill: any) => skill.name).join(', ')}
//     Top Achievements: ${resumeData.experience.slice(0, 2).flatMap((exp: any) => exp.achievements).join(', ')}

//     Group them as:
//     1. Technical Questions (10)
//     2. Behavioral Questions (10)
//     3. HR Questions (10)
//     4. Leadership Questions (10)

//     Format:
//     Q1: [Question]
//     Sample Answer: [Answer]`;

//     const systemMessage = `You are an experienced interviewer specializing in technical and leadership hiring. Create relevant, challenging questions and strong sample answers. Focus on both technical depth and interpersonal skills.`;

//     const content = await callOpenAI(prompt, systemMessage);

//     // Save generated questions to MongoDB
//     const generatedContent = new GeneratedContent({
//       userId: resumeData.userId,
//       resumeId: resumeData.id,
//       type: 'interview-questions',
//       content,
//       metadata: {
//         generatedAt: new Date(),
//       },
//     });

//     await generatedContent.save();

//     res.status(200).json({ content });
//   } catch (error: any) {
//     console.error('Error generating interview questions:', error);
//     res.status(500).json({ message: error.message || 'Failed to generate interview questions.' });
//   }
// };

// // Generate Cover Letter based on Resume and Job Description
// export const generateCoverLetter = async (req: Request, res: Response) => {
//   try {
//     const { resumeData, jobDescription } = req.body;

//     if (!resumeData || !jobDescription) {
//       return res.status(400).json({ message: 'Both resume data and job description are required.' });
//     }

//     const prompt = `Generate a professional cover letter based on this candidate's profile and job description:

//     CANDIDATE PROFILE:
//     Name: ${resumeData.personalInfo.name}
//     Current Role: ${resumeData.personalInfo.role || 'Not specified'}
//     Key Experience: ${resumeData.experience[0]?.position} at ${resumeData.experience[0]?.company}
//     Top Skills: ${resumeData.skills.slice(0, 5).map((skill: any) => skill.name).join(', ')}
//     Notable Achievements: ${resumeData.experience[0]?.achievements.slice(0, 2).join('; ')}

//     JOB DESCRIPTION:
//     ${jobDescription}

//     Please create a compelling cover letter that:
//     1. Opens with a strong, personalized introduction
//     2. Aligns the candidate's experience with job requirements
//     3. Highlights relevant achievements and skills
//     4. Demonstrates enthusiasm and cultural fit
//     5. Concludes with a clear call to action
//     6. Maintains a professional yet engaging tone
//     7. Keeps length to 350-400 words

//     Format as a proper business letter with appropriate spacing and structure.`;

//     const systemMessage = `You are an expert cover letter writer with experience in crafting compelling, ATS-friendly cover letters. Focus on creating a personalized narrative that connects the candidate's experience with the job requirements while maintaining a professional tone. The letter should be concise, impactful, and highlight the candidate's unique value proposition.`;

//     const content = await callOpenAI(prompt, systemMessage);

//     // Save generated cover letter to MongoDB
//     const generatedContent = new GeneratedContent({
//       userId: resumeData.userId,
//       resumeId: resumeData.id,
//       type: 'cover-letter',
//       content,
//       metadata: {
//         jobDescription,
//         generatedAt: new Date(),
//       },
//     });

//     await generatedContent.save();

//     res.status(200).json({ content });
//   } catch (error: any) {
//     console.error('Error generating cover letter:', error);
//     res.status(500).json({ message: error.message || 'Failed to generate cover letter.' });
//   }
// };

// // Get all generated content for a resume
// export const getGeneratedContent = async (req: Request, res: Response) => {
//   try {
//     const { resumeId, type } = req.query;

//     if (!resumeId) {
//       return res.status(400).json({ message: 'Resume ID is required.' });
//     }

//     const query: any = { resumeId };
//     if (type) {
//       query.type = type;
//     }

//     const content = await GeneratedContent.find(query).sort({ createdAt: -1 });
//     res.status(200).json(content);
//   } catch (error: any) {
//     console.error('Error fetching generated content:', error);
//     res.status(500).json({ message: error.message || 'Failed to fetch generated content.' });
//   }
// };

// // Delete generated content
// export const deleteGeneratedContent = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     await GeneratedContent.findByIdAndDelete(id);
//     res.status(200).json({ message: 'Content deleted successfully.' });
//   } catch (error: any) {
//     console.error('Error deleting generated content:', error);
//     res.status(500).json({ message: error.message || 'Failed to delete generated content.' });
//   }
// };





import { Request, Response } from 'express';
import { callOpenAI } from '../services/aiService';
import GeneratedContent from '../models/GeneratedContent';

// Generate Interview Questions based on Resume
export const generateQuestions = async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: 'Resume data is required.' });
    }

    // Optimized prompt structure for faster processing
    const prompt = `Generate 40 interview questions for ${resumeData.personalInfo.name}:
Skills: ${resumeData.skills.slice(0, 5).map((skill: any) => skill.name).join(', ')}
Experience: ${resumeData.experience[0]?.position} at ${resumeData.experience[0]?.company}
Achievements: ${resumeData.experience[0]?.achievements.slice(0, 2).join('; ')}

Format: 10 questions each for Technical, Behavioral, HR, and Leadership categories.
Each Q&A pair should be concise and focused.`;

    const systemMessage = 'Create relevant interview questions with brief, focused sample answers. Prioritize clarity and practicality.';

    const content = await callOpenAI(prompt, systemMessage);

    // Save to MongoDB
    const generatedContent = new GeneratedContent({
      userId: resumeData.userId,
      resumeId: resumeData.id,
      type: 'interview-questions',
      content,
      metadata: { generatedAt: new Date() },
    });

    await generatedContent.save();

    res.status(200).json({ content });
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    res.status(500).json({ message: error.message || 'Failed to generate interview questions.' });
  }
};

// Generate Cover Letter based on Resume and Job Description
export const generateCoverLetter = async (req: Request, res: Response) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ message: 'Both resume data and job description are required.' });
    }

    // Optimized prompt for faster, focused generation
    const prompt = `Write cover letter for ${resumeData.personalInfo.name}:
Role: ${resumeData.personalInfo.role || 'Not specified'}
Experience: ${resumeData.experience[0]?.position} at ${resumeData.experience[0]?.company}
Skills: ${resumeData.skills.slice(0, 5).map((skill: any) => skill.name).join(', ')}
Achievement: ${resumeData.experience[0]?.achievements[0]}

Job Description:
${jobDescription}

Format: Business letter, 350 words max. Focus on matching skills to requirements.`;

    const systemMessage = 'Create a concise, compelling cover letter that connects candidate experience to job requirements.';

    const content = await callOpenAI(prompt, systemMessage);

    // Save to MongoDB
    const generatedContent = new GeneratedContent({
      userId: resumeData.userId,
      resumeId: resumeData.id,
      type: 'cover-letter',
      content,
      metadata: {
        jobDescription,
        generatedAt: new Date(),
      },
    });

    await generatedContent.save();

    res.status(200).json({ content });
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ message: error.message || 'Failed to generate cover letter.' });
  }
};

// Get all generated content for a resume
export const getGeneratedContent = async (req: Request, res: Response) => {
  try {
    const { resumeId, type } = req.query;

    if (!resumeId) {
      return res.status(400).json({ message: 'Resume ID is required.' });
    }

    const query: any = { resumeId };
    if (type) query.type = type;

    const content = await GeneratedContent.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(content);
  } catch (error: any) {
    console.error('Error fetching generated content:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch generated content.' });
  }
};

// Delete generated content
export const deleteGeneratedContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await GeneratedContent.findByIdAndDelete(id);
    res.status(200).json({ message: 'Content deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting generated content:', error);
    res.status(500).json({ message: error.message || 'Failed to delete generated content.' });
  }
};