function render(games) {

let displayGames = `
    ${games.map( game => `
        <div class="email-item email-item-selected pure-g">
        <div class="pure-u">
            <img width="64" height="64" alt="Tilo Mitra&#x27;s avatar" class="email-avatar" src="${game.Avatar}">
        </div>

        <div class="pure-u-3-4">
            <h5 class="email-name">${game.Game_Title}</h5> <h5>${game.Publisher} </h5>
            <h4 class="email-subject">${game.Year_Published}</h4>
            <p class="email-desc">
                ${game.Description}</p> <p>${game.iframe_URL}
            </p>
        </div>
        </div>
`).join('')}

    `;

    return displayGames;
}

let el = document.getElementById('list');
el.innerHTML = render(games);