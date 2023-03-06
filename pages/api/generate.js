import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
You are a service design agency. Generate 5 ideas to solve the following problem, provide an explanation why it will be beneficial, display answers in a numbered list:

Problem:
`;
const generateAction = async (req, res) => {
	const baseCompletion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: "user",
				content: `${basePromptPrefix}${req.body.userInput}`,
			},
		],
		temperature: 0.6,
		max_tokens: 650,
	});

	const basePromptOutput = baseCompletion.data.choices[0].message;

	res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
