import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";

export default function Home() {
	const [userInput, setUserInput] = useState("");
	const [apiOutput, setApiOutput] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);

	// Scroll to output when it's visible
	const outputRef = useRef(null);
	const [outputVisible, setOutputVisible] = useState(false);

	useEffect(() => {
		if (outputVisible && outputRef.current) {
			outputRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [outputVisible, outputRef]);

	const callGenerateEndpoint = async () => {
		setIsGenerating(true);
		setOutputVisible(false);

		const response = await fetch("/api/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userInput }),
		});

		const data = await response.json();
		const { output } = data;
		// console.log("OpenAI replied...", output.text);

		setApiOutput(`${output.text}`);
		setIsGenerating(false);
		setOutputVisible(true);
	};

	const onUserChangedText = (event) => {
		setUserInput(event.target.value);
	};

	const lines = apiOutput.split("\n");

	// Array to store list items
	const listItems = [];

	const outputJSX = lines.map((line, index) => {
		if (line.startsWith("- ")) {
			// If the line starts with "- ", add it to the listItems array
			listItems.push(<li key={index}>{line.substring(2)}</li>);
			return null;
		} else if (line !== "") {
			// If not, return a paragraph
			return <p key={index}>{line}</p>;
		} else {
			// If empty, return nothing
			return null;
		}
	});

	// Filter out any null elements from the outputJSX array
	const filteredOutputJSX = outputJSX.filter((el) => el !== null);

	function handleClick(event) {
		const spanText = event.currentTarget.querySelector("span").textContent;
		setUserInput(spanText);
	}

	const githubLink = () => {
		window.open("https://github.com/niknorf/inspiration_ai");
	};

	return (
		<>
			<Head>
				<title>Inspiration AI</title>
				<meta name="description" content="Service design inspiration" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="mx-auto mt-20 mb-20 max-w-2xl format lg:format-lg format-blue dark:format-invert px-4">
				<h1 className="animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-extrabold">
					inspiration_ai
				</h1>

				<p className="lead">
					Describe your service design challenge and receive customized ideas
					and explanations on how it can benefit your customer.
				</p>
				<h4>
					The more specific your description, the better AI can tailor its
					solutions.
				</h4>

				<div className="container space-y-4 text-right">
					<textarea
						id="message"
						rows="4"
						className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Write about your challenge here:"
						value={userInput}
						onChange={onUserChangedText}
					></textarea>
					{isGenerating ? (
						<button
							disabled
							type="button"
							class="text-white transition-colors bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
						>
							<svg
								aria-hidden="true"
								role="status"
								class="inline w-4 h-4 mr-3 text-white animate-spin"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="#E5E7EB"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentColor"
								/>
							</svg>
							Generating...
						</button>
					) : (
						<button
							type="button"
							onClick={callGenerateEndpoint}
							className={`mr-2 mb-2 transition-colors rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
								userInput ? "" : "cursor-not-allowed opacity-50"
							}`}
							disabled={!userInput}
						>
							Generate
						</button>
					)}
				</div>

				<p>Or try the examples below:</p>

				<div className="space-y-2">
					<div
						onClick={handleClick}
						className="p-4 bg-slate-100 border-2 transition-colors hover:border-slate-400 rounded-xl text-base cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 float-left mr-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
							/>
						</svg>
						<span>
							The national postal service struggles to attract new corporate
							customers due to a lack of centralized customer data management
							and a lengthy onboarding process.
						</span>
					</div>
					<div
						onClick={handleClick}
						className="p-4 bg-slate-100 border-2 transition-colors hover:border-slate-400 rounded-xl text-base cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 mr-2 float-left"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
							/>
						</svg>

						<span>
							A company that produces elevators, escalators, and automatic
							building doors would like to create an automated analytics system
							to reduce maintenance costs and minimize the need for manual
							inspections. The system should continuously analyze the machines
							and alert of any faults or maintenance requirements.
						</span>
					</div>
					<div
						onClick={handleClick}
						className="p-4 bg-slate-100 border-2 transition-colors hover:border-slate-400 rounded-xl text-base cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6 mr-2 float-left"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
							/>
						</svg>

						<span>
							The public transportation provider would like to introduce a
							&quot;Journey Planner&quot; feature, giving customers a smarter
							way to plan trips, considering real-time transport availability
							and weather conditions.
						</span>
					</div>
				</div>

				<div className="container mt-20">
					{apiOutput && (
						<div ref={outputRef} className="output">
							<h3>Ideas:</h3>
							<div>
								{filteredOutputJSX}
								<ul>{listItems}</ul>
							</div>
						</div>
					)}
				</div>
				<div className="fixed bottom-0 right-0 transform translate-x-2">
					<button
						type="button"
						onClick={githubLink}
						className="text-white mb-7 mr-9 bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
					>
						<svg
							className="w-4 h-4 mr-2 -ml-1"
							aria-hidden="true"
							focusable="false"
							data-prefix="fab"
							data-icon="github"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 496 512"
						>
							<path
								fill="currentColor"
								d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
							></path>
						</svg>
						Source code on GitHub
					</button>
				</div>
			</div>
		</>
	);
}
