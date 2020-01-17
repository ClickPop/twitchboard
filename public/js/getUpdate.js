const { href, protocol, hostname, port, pathname } = window.location;
var leaderboard = [];
url = `${protocol}//${hostname}:${port}/api/v1/`;

$(document).ready(() => {
    $('.leaderboard__row').each((row, tr) => {
        if (row != 0) {
            leaderboard[row - 1] = {
                referrer: $(tr)
                    .find('div:eq(0)')
                    .text(),
                views: parseInt($(tr)
                    .find('div:eq(1)')
                    .text(), 10)
            };
        }
    });
});

window.setInterval(() => {
    fetch(`${url}getLeaderboard?channel=${pathname.replace('/', '')}`)
        .then(response => {
            return response.json();
        })
        .then(json => {
            const newBoard = json.data.leaderboard;

            if (JSON.stringify(leaderboard) != JSON.stringify(newBoard)) {
                for (var i = 0; i < leaderboard.length; i += 1) {
                    if (leaderboard[i] != newBoard[i]) {
                        leaderboard[i] = newBoard[i];
                    }
                }

                $('.leaderboard__row').each((row, tr) => {
                    if (row != 0) {
                        $(tr).hide();
                        $(tr)
                            .find('div:eq(0)')
                            .text(leaderboard[row - 1].referrer);
                        $(tr)
                            .find('div:eq(1)')
                            .text(leaderboard[row - 1].views);
                        setInterval(() => {
                            $(tr).show('fast');
                        }, 100);
                    }
                });
            }
        });
}, 5000);
