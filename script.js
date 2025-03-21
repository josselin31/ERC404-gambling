const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 2000;
canvas.height = 2000;

const generateBallButton = document.getElementById('generateBallButton');
const ballCountRange = document.getElementById('ballCountRange');
const ballCountDisplay = document.getElementById('ballCountDisplay');
const counterContainer = document.getElementById('counterContainer');
const pausePlayButton = document.getElementById('pausePlayButton');
const walletAmount = document.getElementById('walletAmount');
const walletChartCtx = document.getElementById('walletChart').getContext('2d');
const autoStopCheckbox = document.getElementById('autoStopCheckbox'); // Récupérer la case à cocher auto-stop


const binImage = document.createElement('img');
binImage.src = 'C:/Users/Jbros/OneDrive/Documents/PERSO/meme coin projet/pachinko/bin.png';
binImage.onload = function() {
    console.log('Bin image loaded');
};

// Variables de jeu
let wallet = 10000;  // Initialiser le wallet à 10000 jetons
const pegs = [];
const balls = [];
const bins = [];
const binCounters = Array(29).fill(0); // Initialise les compteurs pour chaque bac
const pegRadius = 8;
const ballRadius = 10;
const binWidth = 40;  // Largeur des bacs
const binHeight = 50; // Hauteur des bacs
const gravity = 0.2; // Augmenter la gravité pour une descente plus rapide

let paused = false; // Flag pour gérer la pause
let pauseTriggered = false; // Flag pour s'assurer que la pause n'est déclenchée qu'une fois par vague

// Valeurs des bacs
const binValues = [
    1000, 250, 75, 10, 6, 4, 2, 1.5, 1.2, 1, 0.8, 0.5, 0.2, 0, -0.5,
    0, 0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 4, 6, 10, 75, 250, 1000
];

// Données du graphique
let walletHistory = [wallet];
let ballCountHistory = [0];

// Initialisation des chevilles (pegs) en forme de pyramide, sans le peg au sommet
function createPegs() {
    const rows = 30; // Nombre de rangées de chevilles
    const offsetX = canvas.width / 2; // Décalage pour centrer la pyramide

    for (let row = 2; row <= rows; row++) { // Commencer à la deuxième rangée pour supprimer le peg au sommet
        const numPegsInRow = row;
        const y = 50 + row * 50; // Espacement vertical entre les rangées de chevilles
        const startX = offsetX - (numPegsInRow - 1) * 25; // Ajuster l'espacement horizontal des chevilles

        for (let peg = 0; peg < numPegsInRow; peg++) {
            const x = startX + peg * 50; // Ajuster l'espacement horizontal des chevilles
            pegs.push({ x: x, y: y });
        }
    }
    console.log("Pegs created:", pegs);
}

function createBins() {
    const numBins = 29; // Nombre de bacs, réduit à 29
    const lastRowPegs = 30; // Nombre de chevilles dans la dernière rangée
    const offsetX = canvas.width / 2 - (lastRowPegs - 1) * 25; // Décalage pour centrer la pyramide
    const lastRowY = 50 + 30 * 50; // Position Y de la dernière rangée de pegs

    for (let i = 0; i < numBins; i++) {
        const x = offsetX + (i + 0.5) * 50; // Centrer les bacs entre les pegs
        const y = lastRowY + 25; // Positionnement vertical des bacs, juste en dessous de la dernière rangée de pegs
        bins.push({ x: x - binWidth / 2, y: y, width: binWidth, height: binHeight, number: i + 1 });
    }
    console.log("Bins created:", bins);
}

function drawPegs() {
    ctx.fillStyle = 'black';
    pegs.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
        ctx.fill();
    });
    console.log("Pegs drawn.");
}

function drawBins() {
    bins.forEach(bin => {
        ctx.fillStyle = 'grey';
        ctx.fillRect(bin.x, bin.y, bin.width, bin.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(bin.number, bin.x + bin.width / 2 - 5, bin.y + bin.height / 2 + 5);
    });
    console.log("Bins drawn.");
}

function drawLine() {
    const y = 50 + 20 * 50; // Position Y de la ligne à 2/3 de la hauteur de la pyramide
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
    console.log("Line drawn at 2/3 height.");
}

// vérification des billes capturées
function allBallsCaptured() {
    return balls.every(ball => ball.captured);
}

// Initialisation des balles
function createBall() {
    balls.push({ x: canvas.width / 2, y: 0, dx: 0, dy: 0, captured: false });
    console.log("Ball created:", balls);
}

function createBalls(count) {
    const costPerBall = 10;
    const totalCost = count * costPerBall;

    if (wallet >= totalCost && allBallsCaptured()) {
        for (let i = 0; i < count; i++) {
            createBall();
        }
        wallet -= totalCost; // Déduire les jetons du wallet
        updateWalletDisplay(); // Mettre à jour l'affichage du wallet
        pauseTriggered = false; // Réinitialiser le flag de pause pour la nouvelle vague de billes
    }
}

function updateWalletDisplay() {
    walletAmount.textContent = wallet;
}

function drawBalls() {
    ctx.fillStyle = 'blue';
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    });
    console.log("Balls drawn.");
}

function updateBalls() {
    const lineY = 50 + 20 * 50; // Position Y de la ligne rouge

    balls.forEach(ball => {
        if (!ball.captured) {
            ball.dy += gravity;
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Collision avec les chevilles (pegs)
            pegs.forEach(peg => {
                const dx = ball.x - peg.x;
                const dy = ball.y - peg.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < pegRadius + ballRadius) {
                    // Ajout d'une composante aléatoire à la direction de la bille
                    const angle = Math.atan2(dy, dx);
                    const randomAngle = (Math.random() - 0.5) * Math.PI / 6; // Angle aléatoire entre -30 et 30 degrés
                    const newAngle = angle + randomAngle;
                    ball.dx = Math.cos(newAngle) * 2; // Augmenter la vitesse après rebond sur un peg
                    ball.dy = Math.sin(newAngle) * 2; // Augmenter la vitesse après rebond sur un peg
                }
            });

            // Collision avec les murs du bas
            if (ball.y + ballRadius > canvas.height) {
                ball.dy = -ball.dy * 0.9; // Augmenter le rebond après le choc
            }

            // Détection de la bille tombant dans les bacs
            bins.forEach((bin, index) => {
                if (ball.x > bin.x && ball.x < bin.x + bin.width && ball.y + ballRadius > bin.y) {
                    ball.dy = 0;
                    ball.dx = 0;
                    ball.y = bin.y + bin.height / 2 - ballRadius; // Positionner la bille au milieu du bac
                    ball.captured = true;
                    binCounters[index]++;
                    updateCounterDisplay();
                    updateWallet(binValues[index]);
                }
            });

            // Vérifier si la bille atteint la ligne rouge et appliquer la pause si ce n'est pas déjà fait
            if (autoStopCheckbox.checked && !pauseTriggered && ball.y + ballRadius >= lineY) { // Vérifier si la case à cocher est cochée
                paused = true;
                pauseTriggered = true;
                pausePlayButton.textContent = 'Play';
                console.log("Game paused due to ball reaching the red line.");
            }
        }
    });
    console.log("Balls updated:", balls);
}

function updateCounterDisplay() {
    counterContainer.innerHTML = '';
    binCounters.forEach((count, index) => {
        const counter = document.createElement('div');
        counter.textContent = `Bin ${index + 1}: ${count} balls`;
        counterContainer.appendChild(counter);
    });
}

function updateWallet(multiplier) {
    const ballValue = 10;
    const totalValue = ballValue * multiplier;
    wallet += totalValue;
    updateWalletDisplay();
    updateChart(totalValue);
}

// Mise à jour du graphique
function updateChart(value) {
    walletHistory.push(wallet);
    ballCountHistory.push(ballCountHistory.length);
    walletChart.data.labels = ballCountHistory;
    walletChart.data.datasets[0].data = walletHistory;
    walletChart.update();
}

// Initialisation du graphique
const walletChart = new Chart(walletChartCtx, {
    type: 'line',
    data: {
        labels: ballCountHistory,
        datasets: [{
            label: 'Wallet Value',
            data: walletHistory,
            borderColor: 'blue',
            fill: false,
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Ball Count'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Wallet Value'
                }
            }
        }
    }
});

// Mise à jour de l'affichage du nombre de billes sélectionné
ballCountRange.addEventListener('input', () => {
    const values = [1, 10, 100, 1000];
    ballCountDisplay.textContent = values[ballCountRange.value];
});

// Boucle de jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPegs();
    drawBins();
    drawLine();
    if (!paused) {
        updateBalls();
    }
    drawBalls();
    requestAnimationFrame(gameLoop);
    console.log("Game loop running.");
}

// Gestion du bouton Play
pausePlayButton.addEventListener('click', () => {
    if (paused) {
        paused = false;
        console.log('Game resumed.');
    }
});

// Ajout de l'écouteur d'événement pour le bouton
generateBallButton.addEventListener('click', () => {
    const values = [1, 10, 100, 1000];
    createBalls(values[ballCountRange.value]);
});

// Initialisation
createPegs();
createBins();
updateWalletDisplay(); // Mettre à jour l'affichage du wallet à l'initialisation
gameLoop(); // Démarrer la boucle de jeu