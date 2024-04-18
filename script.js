console.log('ok');
class Puissance4 {

    constructor(element_id) { // Constructeur !
        this.SizePlateau();
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
        this.turn = 1;
        this.moves = 0;
        this.winner = null;
        this.scores = { 1: 0, 2: 0 };
        this.colors = { 1: 'red', 2: 'yellow' };
        this.element = document.querySelector(element_id);
        this.element.addEventListener('click', (event) => this.effet_click(event));
        this.buttoncancel();
        this.Plateau();
        this.Titre();
        this.Selectcolorplateau();
        this.ColorPlayer()
        this.stats();
        this.moveHistory = [];
        this.tour();
        this.effet_click();


    }

    /* < ------------------------------------------------------------------------------------------ > */


    Titre() { // Titre Clignotant
        const title = document.createElement('h1');
        title.textContent = 'PUISSANCE 4';
        title.id = 'titrep4';
        document.body.insertBefore(title, document.body.firstChild);
    }

    /* < ------------------------------------------------------------------------------------------ > */

    SizePlateau() { // Choix de la taille du plateau 
        let rows = prompt("Entrez le nombre de lignes pour le plateau :", "6");
        let cols = prompt("Entrez le nombre de colonnes pour le plateau :", "7");
        this.rows = rows ? parseInt(rows) : 6;
        this.cols = cols ? parseInt(cols) : 7;
    }
    Plateau() {
        let table = document.createElement('table');
        table.style.backgroundColor = this.backgroundColor;
        for (let i = this.rows - 1; i >= 0; i--) {
            let tr = table.appendChild(document.createElement('tr'));
            for (let j = 0; j < this.cols; j++) {
                let td = tr.appendChild(document.createElement('td'));
                let player = this.board[i][j];
                td.style.width = '50px';
                td.style.height = '50px';
                if (player) {
                    td.style.backgroundColor = this.colors[player];
                    if (this.lastMove && this.lastMove.row === i && this.lastMove.column === j) {
                        td.classList.add('pion');
                    }
                }
                td.dataset.column = j;
            }
        }
        this.element.innerHTML = '';
        this.element.appendChild(table);
    }
    

    /* < ------------------------------------------------------------------------------------------ > */
    Selectcolorplateau() { // Selecteur de Couleur du plateau 
        const backgroundColorSelector = document.createElement('select');
        backgroundColorSelector.id = 'backgroundColorSelector';
        const options = [
            { name: 'Bleu', value: 'blue' },
            { name: 'Rose', value: 'pink' }
        ];
        options.forEach(opt => {
            let option = document.createElement('option');
            option.value = opt.value;
            option.text = opt.name;
            backgroundColorSelector.appendChild(option);
        });
        document.body.appendChild(backgroundColorSelector);
        backgroundColorSelector.addEventListener('change', () => this.ColorPlateau());
        backgroundColorSelector.style.position = 'fixed';
        backgroundColorSelector.style.top = '90px';
        backgroundColorSelector.style.padding = '10px';
    }

    ColorPlateau() { // Application de la couleur choisit
        const selectedColor = document.getElementById('backgroundColorSelector').value;
        this.backgroundColor = selectedColor;
        this.Plateau();
    }

    /* < ------------------------------------------------------------------------------------------ > */

    tour() {
        this.tour = document.createElement('div');
        this.tour.id = 'tour';
        this.tour.style.position = 'fixed';
        this.tour.style.top = '40px';
        this.tour.style.left = '0';
        this.tour.style.padding = '10px';
        this.tour.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        document.body.appendChild(this.tour);
        this.touractuel();
    }

    touractuel() {
        const playerColor = this.colors[this.turn];
        this.tour.innerHTML = `Tour du joueur <span style="color: ${playerColor};">Joueur ${this.turn}</span> (${playerColor})`;
    }

    /* < ------------------------------------------------------------------------------------------ > */


    ColorPlayer() {
        let player1Color = prompt("Joueur 1, choisissez votre couleur (Rouge, Jaune, Orange) :", "Rouge").toLowerCase();
        let player2Color = prompt("Joueur 2, choisissez votre couleur (Rouge, Jaune, Orange) :", "Jaune").toLowerCase();
        this.colors[1] = this.convertColor(player1Color);
        this.colors[2] = this.convertColor(player2Color);
    }

    convertColor(colorText) {
        switch (colorText) {
            case 'rouge':
                return 'red';
            case 'jaune':
                return 'yellow';
            case 'orange':
                return 'orange';
            default:
                return 'grey';
        }
    }

    /* < ------------------------------------------------------------------------------------------ > */
    stats() {
        this.statsElement = document.createElement('div');
        this.statsElement.id = 'stats';
        this.statsElement.style.position = 'fixed';
        this.statsElement.style.top = '0';
        this.statsElement.style.left = '0';
        this.statsElement.style.padding = '10px';
        this.statsElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        document.body.appendChild(this.statsElement);
        this.AfficheScore();
    }

    AfficheScore() {
        this.statsElement.innerHTML = `Score — Joueur 1 : ${this.scores[1]} | Joueur 2 : ${this.scores[2]}`;
    }
    /* < ------------------------------------------------------------------------------------------ > */




    /* < ------------------------------------------------------------------------------------------ > */
    effet_click(event) {
        if (this.winner !== null) {
            if (window.confirm("Partie finie !\n\nVoulez-vous relancer ?")) {
                this.relance();
                this.Plateau();
            }
            return;
        }


        let column = event.target.dataset.column;
        if (column !== undefined) {
            column = parseInt(column);
            let row = this.play(parseInt(column));

            if (row === null) {
                window.alert("Plus d'espace dans cette colonne!");
            } else {
                if (this.victoire(row, column, this.turn)) {
                    this.winner = this.turn;
                    this.scores[this.turn]++;
                    this.AfficheScore();
                } else if (this.moves >= this.rows * this.cols) {
                    this.winner = 0;
                }
                this.turn = 3 - this.turn;
                this.touractuel();
                this.Plateau();
                if (this.winner !== null) {
                    let message = this.winner === 0 ? "Partie nulle !" : `Joueur ${this.winner} gagne !`;
                    window.alert(message);
                }
            }
        }
    }
    /* < ------------------------------------------------------------------------------------------ > */

    set(row, column, player) {
        this.board[row][column] = player;
        this.moves++;
        this.lastMove = { row, column, player };
    }
    

    play(column) {
        let row;
        for (let i = 0; i < this.rows; i++) {
            if (this.board[i][column] === 0) {
                row = i;
                break;
            }
        }
        if (row === undefined) {
            return null;
        } else {
            this.set(row, column, this.turn);
            this.moveHistory.push({ column: column, row: row, player: this.turn }); 
            return row;
        }
    }

    /* < ------------------------------------------------------------------------------------------ > */

    victoire(row, column, player) {
        let count = 0;
        for (let j = 0; j < this.cols; j++) {
            count = (this.board[row][j] == player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        count = 0;
        for (let i = 0; i < this.rows; i++) {
            count = (this.board[i][column] == player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        count = 0;
        let shift = row - column;
        for (let i = Math.max(shift, 0); i < Math.min(this.rows, this.cols + shift); i++) {
            count = (this.board[i][i - shift] == player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        count = 0;
        shift = row + column;

        for (let i = Math.max(shift - this.cols + 1, 0); i < Math.min(this.rows, shift + 1); i++) {
            console.log(i, shift - i, shift)
            count = (this.board[i][shift - i] == player) ? count + 1 : 0;
            if (count >= 4) return true;

        }
        return false;
    }

    /* < ------------------------------------------------------------------------------------------ > */
    relance() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = 0;
            }
        }
        this.touractuel();
        this.moves = 0;
        this.winner = null;
        this.turn = 1;
        this.Plateau();
        this.AfficheScore();
    }

    buttoncancel() {
        const undoButton = document.createElement('button');
        undoButton.textContent = 'Annuler le dernier coup';
        undoButton.addEventListener('click', () => this.cancel());
        document.body.appendChild(undoButton);
    }
    cancel() {
        if (this.moveHistory.length === 0) {
            alert("Aucun coup à annuler !");
            return;
        }
        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.column] = 0; 
        this.turn = 3 - this.turn; 
        this.moves--; 
        if (this.winner) { 
            this.winner = null;
            this.scores[this.turn]--;
        }
        this.touractuel(); 
        this.Plateau(); 
        this.AfficheScore();
    }


}
let p4 = new Puissance4('#game');