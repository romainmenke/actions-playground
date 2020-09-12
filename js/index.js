console.log('hello world!');

reportGitHubActionAnnotations();

function reportGitHubActionAnnotations() {
	if (!process.env.GITHUB_ACTIONS || process.env.DISABLE_GITHUB_ACTIONS_ANNOTATIONS) {
		return;
	}

	let annotation = formatGitHubActionAnnotation('hello!', { file: 'js/index.js', line: 1, cole: 1 });
	console.log(annotation);
}

function formatGitHubActionAnnotation(message, options = {}) {
	message = message || '';

	let output = '::error';

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
