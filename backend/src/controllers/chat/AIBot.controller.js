const { createChatBotService } = require("../../services/chat/geminiService");
const {
  addMessageService,
  getMessagesChatIdService,
} = require("../../services/chat/message.service");
const {
  sendPromptToAI,
  generatePrompt,
} = require("../../services/chat/geminiService");

const startChatBot = async (req, res, next) => {
  try {
    const { name, skills, experience, user1_id } = req.body;
    if (!name || !skills || !experience || !user1_id) {
      return res.status(400).json({ message: "some data is missing" });
    }

    const experienceText =
      experience.length > 0
        ? experience
            .map((exp) => {
              const title = exp.title || "Intern";
              const company = exp.company || "Unknown Company";
              const years = exp.years ? exp.years : "N/A";
              const desc =
                Array.isArray(exp.description) && exp.description.length > 0
                  ? exp.description.join(", ")
                  : "Gained experience in multiple software development areas.";
              return `${title} at ${company} (${years}): ${desc}`;
            })
            .join("\n")
        : "No prior work experience listed.";

    const prompt = generatePrompt({ name, skills, experience: experienceText });
    console.log(prompt);

    const responseAI = await sendPromptToAI(prompt);

    const chat = await createChatBotService(user1_id);
    const messageData = {
      sender_id: null,
      chat_id: chat.id,
      content: responseAI,
      content_type: "text",
    };
    const message = await addMessageService(messageData);
    res
      .status(201)
      .json({ message: "Chat created successfully!", data: { chat, message } });
  } catch (err) {
    next(err);
  }
};

const sendMessageToChatBot = async (req, res, next) => {
  try {
    const { chat_id, content, user_id } = req.body;

    if (!chat_id || !content || !user_id)
      return res.status(400).json({ message: "Missing data" });

    await addMessageService({
      chat_id,
      sender_id: user_id,
      content: content,
      content_type: "text",
    });

    const messages = await getMessagesChatIdService(chat_id);

    const systemPrompt = {
      role: "user",
      parts: [
        {
          text: `
        You are a skill assessment mentor. Follow these strict rules:
        1. Ask the user which programming skill they want to test.
        2. Once they choose the skill, conduct a 10-question skill assessment with increasing difficulty.
        3. Show one question at a time and specify a time limit for each.
        4. If they ask for hints or answers, reply briefly:
          > "Let’s move on to the next question — remember, this is a test of your current knowledge 😊"
          Then immediately continue to the next question.
        5. If they repeat a previous question, respond:
          > "We've already covered that question — let's move on to the next one 😊"
        6. If no response is given within the time limit, automatically skip to the next question.
        7. After 10 questions, analyze their answers and categorize their level as:
          - Fresh (Beginner)
          - Junior
          - Mid-Level
          - Senior
        8. Based on their level and chosen skill, design a personalized learning roadmap with:
          - Plan Name
          - Content (topics & skills)
          - Resources (articles, docs, videos, projects)
          - Estimated Duration
          - Expected Level After Completion

        Style:
        - Always sound supportive and encouraging.
        - Keep conversations interactive and never reveal answers during the test.
        - Be clear, structured, and motivating.
      `,
        },
      ],
    };

    const conversation = [
      systemPrompt,
      ...messages
        .filter((m) => m.content && m.content.trim() !== "")
        .map((msg) => ({
          role: msg.sender_id ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
    ];
console.log("Final Prompt Sent to Gemini:", JSON.stringify(conversation, null, 2));

    const aiResponse = await sendPromptToAI(conversation);

    const newAIMessage = await addMessageService({
      chat_id,
      sender_id: null,
      content: aiResponse,
      content_type: "text",
    });

    res.status(200).json({
      message: "Message sent successfully",
      data: newAIMessage,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { startChatBot, sendMessageToChatBot };
