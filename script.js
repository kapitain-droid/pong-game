const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');

// Game objects
const paddleHeight = 80;
const paddleWidth = 10;
const ballSize = 8;

const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 4.5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 5,
    size: ballSize,
    speed: 5
};

const game = {
    playerScore: 0,
    computerScore: 0
};

// Keyboard input
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse input
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Smoothly move paddle to mouse position
    const paddleCenter = player.y + player.height / 2;
    if (Math.abs(mouseY - paddleCenter) > 5) {
        if (mouseY < paddleCenter) {
            player.dy = -player.speed;
        } else {
            player.dy = player.speed;
        }
    } else {
        player.dy = 0;
    }
});

// Update player position
function updatePlayer() {
    // Arrow keys control
    if (keys['ArrowUp']) {
        player.dy = -player.speed;
    } else if (keys['ArrowDown']) {
        player.dy = player.speed;
    } else if (!canvas.match || !canvas.getBoundingClientRect()) {
        // Keep mouse control active
    }
    
    player.y += player.dy;
    
    // Boundary collision
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Update computer AI
function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    // AI follows the ball with some delay
    if (ballCenter < computerCenter - 10) {
        computer.y -= computer.speed;
    } else if (ballCenter > computerCenter + 10) {
        computer.y += computer.speed;
    }
    
    // Boundary collision
    if (computer.y < 0) {
        computer.y = 0;
    }
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Top and bottom wall collision
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
    }
    
    // Keep ball in bounds vertically after collision
    if (ball.y - ball.size < 0) {
        ball.y = ball.size;
    }
    if (ball.y + ball.size > canvas.height) {
        ball.y = canvas.height - ball.size;
    }
    
    // Paddle collision - Player
    if (ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.size;
        // Add spin based on paddle movement
        ball.dy += player.dy * 0.2;
    }
    
    // Paddle collision - Computer
    if (ball.x + ball.size > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.size;
        // Add spin based on paddle movement
        ball.dy += computer.dy * 0.2;
    }
    
    // Score points and reset ball
    if (ball.x - ball.size < 0) {
        game.computerScore++;
        computerScoreDisplay.textContent = game.computerScore;
        resetBall();
    }
    if (ball.x + ball.size > canvas.width) {
        game.playerScore++;
        playerScoreDisplay.textContent = game.playerScore;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() * 4 - 2);
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#67e9f9';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowColor = 'rgba(103, 233, 249, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
}

function drawBall() {
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawCenter() {
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    drawCenter();
    
    // Draw paddles and ball
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateComputer();
    updateBall();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();