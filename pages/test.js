import React, { useState, useEffect } from "react";

function MyComponent() {
	const [userInput, setUserInput] = useState("");

	useEffect(() => {
		function handleClick(event) {
			const spanText = event.target.querySelector("span").textContent;
			setUserInput(spanText);
		}

		const divEl = document.querySelector("div");
		divEl.addEventListener("click", handleClick);

		return () => {
			divEl.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<div>
			<div>
				<span>Text to be populated in input</span>
			</div>
			<input type="text" value={userInput} />
		</div>
	);
}

export default MyComponent;
