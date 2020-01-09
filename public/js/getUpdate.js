const { href, protocol, hostname, port, pathname } = window.location;
const newBoard = document.getElementById('hidden');
url = `${protocol}//${hostname}:${port}/api/v1`;
axios.defaults.baseURL = url;

window.setInterval(() => {
	axios.get(pathname).then(res => {
		if (JSON.stringify(res.data) != newBoard.innerHTML) {
			window.location.reload(true);
		}
	});
}, 5000);
