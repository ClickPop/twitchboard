const { href, protocol, hostname, port, pathname } = window.location;
var leaderboard = [];
url = `${protocol}//${hostname}:${port}/api/v1/`;

$(document).ready(() => {
    $('table.leaderboard__table tr').each((row, tr) => {
        if (row != 0) {
            leaderboard[row - 1] = {
                referrer: $(tr)
                    .find('td:eq(0)')
                    .text(),
                views: $(tr)
                    .find('td:eq(1)')
                    .text()
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
            if (newBoard != leaderboard) {
                for (var i = 0; i < leaderboard.length; i += 1) {
                    if (leaderboard[i] != newBoard[i]) {
                        leaderboard[i] = newBoard[i];
                    }
                }

                $('table.leaderboard__table tr').each((row, tr) => {
                    if (row != 0) {
                        $(tr)
                            .find('td:eq(0)')
                            .text(leaderboard[row - 1].referrer);
                        $(tr)
                            .find('td:eq(1)')
                            .text(leaderboard[row - 1].views);
                    }
                });
            }
        });
}, 5000);
