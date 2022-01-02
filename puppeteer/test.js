const puppeteer = require('puppeteer');
const http = require('http');
const fsp = require('fs').promises;

(async () => {
	const requestListener = async function (req, res) {
		
		const parsedUrl = new URL(req.url, 'http://localhost:8080');
		const pathname = parsedUrl.pathname;

		switch (pathname) {
			case '/index.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(await fsp.readFile('index.html'));
				break;
			case '/index.css':
				res.setHeader('Content-type', 'text/css');
				res.writeHead(200);
				res.end(await fsp.readFile('index.css'));
				break;
			case '/index.js':
				res.setHeader('Content-type', 'text/javascript');
				res.writeHead(200);
				res.end(await fsp.readFile('index.js'));
				break;
		
			default:
				res.setHeader('Content-type', 'text/plain' );
				res.writeHead(404);
				res.end('Not found');
				break;
		}
	}

	const server = http.createServer(requestListener);
	server.listen(8080);

	const browser = await puppeteer.launch({
		headless: true,
	});
	const page = await browser.newPage();
	await page.goto('http://localhost:8080/index.html');
	await page.screenshot({
		path: 'example.png'
	});

	await browser.close();

	await server.close();
})();
