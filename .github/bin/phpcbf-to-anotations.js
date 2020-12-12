if (!process.env.GITHUB_ACTIONS || process.env.DISABLE_GITHUB_ACTIONS_ANNOTATIONS) {
	process.exit(0);
}

const fs = require("fs");
const data = fs.readFileSync(0, "utf-8");
const phpcbfOutput = JSON.parse(data);

if (!phpcbfOutput || !phpcbfOutput.files) {
	process.exit(0);
}

Object.entries(phpcbfOutput.files).forEach((pair) => {
	const path = pair[0];
	const file = pair[1];

	if (!file.messages || !file.messages.length) {
		return;
	}

	file.messages.forEach((message) => {
		let level = 'error';
		switch (message.type) {
			case 'ERROR':
				level = 'error';
				break;
			case 'WARNING':
				level = 'warning';
				break;

			default:
				break;
		}

		let annotation = formatGitHubActionAnnotation(
			message.message,
			level, {
				file: path,
				line: message.line,
				col: message.column
			}
		);
		console.log(annotation);
	});
});


function formatGitHubActionAnnotation(message, level = 'error', options = {}) {
	message = message || '';

	let output = '::' + level;

	let outputOptions = Object.keys(options)
		.map(key => `${key}=${escape(String(options[key]))}`)
		.join(',');

	if (outputOptions) {
		output += ` ${outputOptions}`;
	}

	return `${output}::${escapeData(message)}`;
}

function escapeData(s) {
	return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function escape(s) {
	return s
		.replace(/\r/g, '%0D')
		.replace(/\n/g, '%0A')
		.replace(/]/g, '%5D')
		.replace(/;/g, '%3B');
}
