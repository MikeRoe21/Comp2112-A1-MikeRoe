// Keeps track of last selected game
let selectedGame = 0;

let linkTrash = document.getElementById('linkTrash');
let linkInbox = document.getElementById('inbox');
let linkCompose = document.getElementById('compose');

linkTrash.addEventListener('click', function(e){
    e.preventDefault();
    let filtered = games.filter( email => email.deleted);
    selectedGame = 0;
    render(filtered);
});

linkInbox.addEventListener('click', function(e){
    e.preventDefault();
    let inbox = games.filter( email => !email.deleted)
    selectedGame = 0;
    render(inbox);
});

linkCompose.addEventListener('click', composeForm);

function composeForm(e) {
    e.preventDefault();
    let html_composeForm = `
    <div class="pure-g">
    <div class="pure-u-1">
        <form id="addGame" class="pure-form pure-form-aligned" name="addGame">
        <fieldset>
            <div class="pure-control-group">
            <label for="Game_Title">Game Title</label>
            <input id="Game_Title" type="text" name="Game_Title">
            </div>

            <div class="pure-control-group">
            <label for="Publisher">Publisher</label>
            <input id="Publisher" type="text" name="Publisher">
            </div>

            <div class="pure-control-group">
            <label for="Year_Published">Year Published</label>
            <input id="Year_Published" type="text" name="Year_Published">
            </div>

            <div class="pure-control-group">
            <label for="Description">Description</label>
            <input id="Description" type="text" name="Description">
            </div>

            <div class="pure-control-group">
            <label for="Avatar">Avatar</label>
            <input id="Avatar" type="text" name="Avatar">
            </div>

            <div class="pure-control-group">
            <label for="iframe_URL">iframe_URL</label>
            <input id="iframe_URL" type="text" name="iframe_URL">
            </div>

            <div class="pure-controls">
            <button id="send" type="submit" class="pure-button pure-button-primary">Send</button>
            </div>
        </fieldset>
        </form>
    </div>

    </div>
    `;

    let main = document.getElementById('main');
    main.innerHTML = html_composeForm;

    let send = document.getElementById('addGame');
    send.addEventListener('submit', function(e) {
        e.preventDefault();

        let date = new Date();

        let obj_addGame = {
            Game_Title : document.forms.addGame.Game_Title.value,
            Publisher : document.forms.addGame.Publisher.value,
            Year_Published : document.forms.addGame.Year_Published.value,
            Description : document.forms.addGame.Description.value,
            date : date.toDateString(),
            time : date.toLocaleDateString(),
            Avatar : document.forms.addGame.Avatar.value,
            iframe_URL : document.forms.addGame.iframe_URL.value
        }
        games.unshift(obj_addGame);
        
        // use localStorage
        setLocalStorage();
    
        // update inbox
        linkInbox.click();
    });
}

function render(games) {

let displayGames = `
    ${games.map( (game, index) => `
        <div class="email-item pure-g" data-id="${index}">
        <div class="pure-u">
            <img width="64" height="64" alt="" class="email-avatar" src="${game.Avatar}">
        </div>

        <div class="pure-u-3-4">
            <h5 class="email-name">${game.Game_Title}</h5> <h5>${game.Publisher} </h5>
            <h4 class="email-subject">${game.Year_Published}</h4>
            <p class="email-desc">
                ${game.Description > 100 ? `${game.Description.substr(0, 99)}...` : game.Description}</p> 
        </div>
        </div>
`).join('')}

    `;

    let el = document.getElementById('list');
    el.innerHTML = displayGames;

    initialize(games);
}

function initialize(games) {
    let gameList = [...document.querySelectorAll('[data-id]')];
    gameList.map ( (game, index) => game.addEventListener('click', function(e){
        //remove class from previous selection
        gameList[selectedGame].classList.remove('email-item-selected');
        game.classList.add('email-item-selected');
        selectedGame = index;
        showGameBody(index, games);
    }));

    // select first game

    if (games.length){
        gameList[selectedGame].classList.add('email-item-selected');
        showGameBody(selectedGame, games);
    } else {
            let main = document.getElementById('main');
            main.innerHTML = '<h1 style="color: #aaa">Nothing to see here</h1>';
        }
    }


function showGameBody(index, games) {
 let DisplayGameBody = `
 <div class="email-content">
 <div class="email-content-header pure-g">
     <div class="pure-u-1-2">
         <h1 class="email-content-title">${games[index].Game_Title}</h1>
         <p class="email-content-subtitle">
             By <a>${games[index].Publisher}</a>
         </p>
     </div>
 
     <div class="email-content-controls pure-u-1-2">
         <button id="delete" class="secondary-button pure-button ${games[index].deleted ? 'btn-pressed' : ''}" data-id="${index}">${games[index].deleted == true ? 'Deleted' : 'Delete'}</button>
         <button class="secondary-button pure-button">Forward</button>
         <button class="secondary-button pure-button">Move to</button>
     </div>
 </div>
 
 <div class="email-content-body">
     <p>
     ${games[index].iframe_URL}
     </p>
 </div>
 </div>
 `;

    let main = document.getElementById('main');
    main.innerHTML = DisplayGameBody;

    let btn_delete = document.getElementById('delete');
    btn_delete.addEventListener('click', () =>  deleteGame(btn_delete.dataset.id, games));

}

function deleteGame(index, games) {

    // if no deleted:true
    if (!games[index].deleted) {

    // add key value property deleted: true
    games[index].deleted = true;

    // use localStorage
    setLocalStorage();

    // update inbox
    let inbox = games.filter( email => !email.deleted)
    selectedGame = 0;
    render(inbox);

    } else {

    // if deleted:true
        delete games[index].deleted;
        let filtered = games.filter( email => email.deleted);
        selectedGame = 0;
        render(filtered);
    }
}

function setLocalStorage() {
    localStorage.setItem('items', JSON.stringify(games));
}




// if localStorage exists, use it
if (localStorage.getItem('items')) {
    games = JSON.parse(localStorage.getItem('items'));
    let filtered = games.filter( game => !game.deleted);
    render(filtered);
} else{
render(games);

}


