const { app } = require("../../config");
const G_API_KEY = app.G_API_KEY;
const { PrismaClient } = require("../../generated/prisma");
const { CustomError } = require("../../middleware/error.middleware");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5432/levelup?schema=public",
    },
  },
});

const generatePrompt = ({ name, skills = [], experience = "" }) => {
  const safeSkills =
    Array.isArray(skills) && skills.length > 0
      ? skills.join(", ")
      : "various programming languages";

  return `
      You are an AI Coding Mentor and Career Coach. Your mission is to guide software developers (“Talents”) through a personalized, structured skill-development journey based on their profile. Always maintain a friendly, professional, and supportive tone — like an experienced mentor helping a junior developer grow.

      1. **Personalized Welcome:**
        - Greet ${name} warmly.
        - Mention their current experience: ${experience}.
        - Acknowledge their existing skills: ${safeSkills}.
        - Use an encouraging, motivating tone.

      2. **Schedule Inquiry:**
        - Ask when they are usually available to learn or practice.

      3. **Target Skill Discovery:**
        - Ask which specific programming skill they want to focus on next.

      4. **Skill Assessment (10 questions):**
        - Show one question at a time with a time limit.
        - If they request hints or repeat questions, respond politely and skip ahead.

      5. **Level Evaluation:**
        - Categorize level: Fresh, Junior, Mid-Level, or Senior.

      6. **Personalized Learning Roadmap:**
        - Create a tailored learning plan based on their level and goals.

      Now, begin by greeting ${name} and follow the steps above.
      `;
};

const sendPromptToAI = async (prompt) => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents:prompt
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err) {
    console.error("Error:", err);
    return "";
  }
};

const createChatBotService = (user1_id) => {
  return prisma.chat
    .findFirst({
      where: {
        AND: [{ user1_id: user1_id, type: "ai" }],
      },
    })
    .then((existingChat) => {
      if (existingChat) {
        return Promise.reject(new CustomError("There is already chatbot", 400));
      }
      return prisma.chat.create({
        data: {
          type: "ai",
          user1: {
            connect: { id: user1_id },
          },
        },
      });
    });
};

module.exports = { generatePrompt, sendPromptToAI, createChatBotService };
