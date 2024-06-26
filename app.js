const cards = ['🌌', '🚀', '🌠', '🤖', '👽', '🕷️', '🛡️', '🦇'];
let shuffledCards = [];
let openedCards = [];
let moves = 0;
let matchedPairs = 0;
let canFlip = true;
let voiceEnabled = false;
let language = 'pt-br';

document.addEventListener('DOMContentLoaded', function () {
    const langToggleBtn = document.getElementById('lang-toggle');
    const voiceToggleBtn = document.getElementById('voice-toggle');
    const startGameBtn = document.getElementById('start-game');

    langToggleBtn.addEventListener('click', toggleLanguage);
    voiceToggleBtn.addEventListener('click', toggleVoice);
    startGameBtn.addEventListener('click', iniciarJogo);

    iniciarJogo();
});

function toggleLanguage() {
    const langToggleBtn = document.getElementById('lang-toggle');
    const voiceToggleBtn = document.getElementById('voice-toggle');
    const gameTitle = document.getElementById('game-title');
    const statusMessage = document.getElementById('status-message');
    const startGameBtn = document.getElementById('start-game');

    if (language === 'pt-br') {
        language = 'en';
        langToggleBtn.textContent = 'Mudar para Português';
        voiceToggleBtn.textContent = 'Activate Accessibility';
        gameTitle.textContent = 'Memory Game';
        statusMessage.textContent = 'Memory Game started. Find all pairs.';
        startGameBtn.textContent = 'Start Game';
    } else {
        language = 'pt-br';
        langToggleBtn.textContent = 'Switch to English';
        voiceToggleBtn.textContent = 'Ativar Acessibilidade';
        gameTitle.textContent = 'Jogo de Memória';
        statusMessage.textContent = 'Jogo de Memória iniciado. Encontre todos os pares.';
        startGameBtn.textContent = 'Iniciar Jogo';
    }
    document.documentElement.lang = language;
    iniciarJogo();
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function generateCards() {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';
    shuffledCards.forEach((card, index) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.dataset.cardIndex = index;
        div.innerHTML = `<span class="card-text">${card}</span>`;
        div.addEventListener('click', () => flipCard(div));
        grid.appendChild(div);
    });
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('matched') || openedCards.length === 2) {
        return;
    }
    card.classList.add('flipped');
    openedCards.push(card);
    if (openedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = openedCards;
    const index1 = parseInt(firstCard.dataset.cardIndex);
    const index2 = parseInt(secondCard.dataset.cardIndex);
    if (shuffledCards[index1] === shuffledCards[index2]) {
        setTimeout(() => {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            openedCards = [];
            matchedPairs++;
            if (matchedPairs === shuffledCards.length / 2) {
                gameOver();
            }
        }, 500);
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            openedCards = [];
        }, 1000);
    }

    moves++;
    updateStatus();
}

function updateStatus() {
    const statusElement = document.getElementById('status-message');
    if (moves === 0) {
        if (language === 'en') {
            statusElement.textContent = `Memory Game started. Find all pairs.`;
        } else {
            statusElement.textContent = `Jogo de Memória iniciado. Encontre todos os pares.`;
        }
    } else {
        const moveText = language === 'en' ? `Move ${moves}` : `Movimento ${moves}`;
        statusElement.textContent = `${moveText}`;
    }
    speak(statusElement.textContent);
}


function iniciarJogo() {
    canFlip = true;
    moves = 0;
    matchedPairs = 0;
    openedCards = [];
    shuffledCards = [...cards, ...cards];
    shuffle(shuffledCards);
    generateCards();
    updateStatus();
}

function gameOver() {
    canFlip = false;
    const statusElement = document.getElementById('status-message');
    if (language === 'en') {
        statusElement.textContent = `Congratulations! You completed the game in ${moves} moves.`;
    } else {
        statusElement.textContent = `Parabéns! Você completou o jogo em ${moves} movimentos.`;
    }
    speak(statusElement.textContent);
}

function speak(text) {
    let voice = 'Brazilian Portuguese Female';
    if (language === 'en') {
        voice = 'US English Female';
    }
    if (voiceEnabled && window.responsiveVoice) {
        responsiveVoice.speak(text, voice, { rate: 1.0 });
    }
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    const voiceToggleBtn = document.getElementById('voice-toggle');
    voiceToggleBtn.textContent = voiceEnabled ? 'Desativar Voice' : 'Ativar Voice';
    if (voiceEnabled) {
        if (language === 'en') {
            speak('Voice activated. Now I can read texts aloud.');
        } else {
            speak('Voz ativada. Agora posso ler os textos em voz alta.');
        }
    } else {
        speak('Voice disabled.');
    }
}
