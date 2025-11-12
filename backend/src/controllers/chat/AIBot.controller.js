const { sendPromptToAI, generatePrompt } = require("../../utils/helper");

const sendPrompt = (req, res, next) => {
  const info = {
    name: "Aysha Volidis",
    skills: ["React", "Next.js", "JavaScript", "HTML", "CSS", "ASP.NET Core"],
    experiences: [
      {
        position: "Intern",
        company_name: "Yaffa Solutions",
        year: 2025,
        description: [
          "Developed and maintained web applications using JavaScript, React.js, Node.js, and ASP.NET Core",
          "Collaborated in agile environment, participated in testing and bug reporting",
          "Built responsive and accessible UI designs",
          "Managed SQL Server databases and worked with version control tools (Git/GitHub)",
        ],
      },
      {
        position: "Intern",
        company_name: "Eng. Zakaria Abu Selmia",
        description: [
          "Developed web applications using ASP.NET Core and Razor Pages",
          "Learned backend logic, logging, error handling, and application routing in .NET",
          "Practiced database operations using Entity Framework Core and SQL Server",
        ],
      },
    ],
  };

  const prompt = generatePrompt(info);
  sendPromptToAI(prompt)
    .then((result) => res.status(200).json({ response: result }))
    .catch((err) => next(err));
};

module.exports={sendPrompt}
