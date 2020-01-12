const { href, protocol, hostname, port, pathname } = window.location;
const newBoard = document.getElementById('hidden');
url = `${protocol}//${hostname}:${port}/api/v1/`;
window.setInterval(() => {
    fetch(`${url}getLeaderboard?channel=${pathname.replace('/', '')}`)
        .then(res => {
            if (
                JSON.stringify(res.data.leaderboard) != newBoard.innerHTML
            ) {
                window.location.reload(true);
            }
        });
}, 5000);
