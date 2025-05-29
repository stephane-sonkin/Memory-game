const movesSpan = document.querySelector('.moves');
const restartButton = document.getElementById('restart-button');
const gameBoard = document.querySelector('.game-board');

// Définissez vos images ou symboles ici (en double pour les paires)
const cardValues = ['🍎', '🍌', '🍒', '🍓', '🍇', '🍉', '🍎', '🍌', '🍒', '🍓', '🍇', '🍉'];

let firstCard = null;
let secondCard = null;
let lockBoard = false; // Pour empêcher de cliquer pendant la vérification
let moves = 0;

// Fonction pour mélanger les cartes (algorithme de Fisher-Yates)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Fonction pour créer les cartes
function createBoard() {
    gameBoard.innerHTML = ''; // Vide le plateau
    moves = 0;
    movesSpan.textContent = `Mouvements : ${moves}`;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    const shuffledCards = shuffle(cardValues);

    shuffledCards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value; // Stocke la valeur dans un attribut data

        const frontFace = document.createElement('div');
        frontFace.classList.add('card-face', 'front-face');
        frontFace.textContent = '?'; // Ce qui est visible au départ

        const backFace = document.createElement('div');
        backFace.classList.add('card-face', 'back-face');
        backFace.textContent = value; // La valeur cachée

        card.appendChild(frontFace);
        card.appendChild(backFace);

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Fonction pour retourner une carte
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // Empêche de cliquer deux fois sur la même carte

    this.classList.add('is-flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesSpan.textContent = `Mouvements : ${moves}`;
    checkForMatch();
}

// Fonction pour vérifier si les cartes correspondent
function checkForMatch() {
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;

    isMatch ? disableCards() : unflipCards();
}

// Fonction si les cartes correspondent
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

// Fonction si les cartes ne correspondent pas
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');
        resetBoard();
    }, 1000); // Attend 1 seconde avant de retourner
}

// Fonction pour réinitialiser les variables après un tour
function resetBoard() {
    [firstCard, secondCard] = [null, null];;
    lockBoard = false;
}

// Écouteur pour le bouton "Recommencer"
restartButton.addEventListener('click', createBoard);

// Crée le plateau de jeu au chargement de la page
createBoard();