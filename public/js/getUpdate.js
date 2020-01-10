const { href, protocol, hostname, port, pathname } = window.location;
const newBoard = document.getElementById('hidden');
url = `${protocol}//${hostname}:${port}/api/v1`;
axios.defaults.baseURL = url;
window.setInterval(() => {
    axios
        .get(`getLeaderboard?channel=${pathname.replace('/', '')}`)
        .then(res => {
            console.log();
            if (
                JSON.stringify(res.data.data.leaderboard) != newBoard.innerHTML
            ) {
                window.location.reload(true);
            }
        });
}, 5000);
