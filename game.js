const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

// Player setup
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 10,
    height: 20,
    speed: 6,
    bullets: [],
    cooldown: 0
};

// Enemy setup
const enemies = [];
const enemySpeed = 2;
const enemySpawnRate = 80; // Higher number = slower spawn
let frameCount = 0;

// Controls
const keys = { ArrowLeft: false, 
               ArrowRight: false, 
               ArrowUp: false, 
               ArrowDown: false, 
               z: false };

// Event listeners for key controls
window.addEventListener("keydown", (e) => {
    if (e.key in keys) keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
    if (e.key in keys) keys[e.key] = false;
});

// Touch controls: Move player directly to finger
canvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    player.x = touch.clientX - rect.left - player.width / 2;
    player.y = touch.clientY - rect.top - player.height / 2;
    e.preventDefault(); // Prevent scrolling
});

// Tap to shoot
canvas.addEventListener("touchstart", () => {
    keys.z = true;
});
canvas.addEventListener("touchend", () => {
    keys.z = false;
});

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    handleBullets();
    spawnEnemies();
    moveEnemies();
    checkCollisions();
    drawPlayer();
    drawEnemies();
    drawBullets();
    requestAnimationFrame(gameLoop);
}

// Move Player
function movePlayer() {
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x + player.width < canvas.width) player.x += player.speed;
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y + player.height < canvas.height) player.y += player.speed;
    
    // Shooting bullets
    if (keys.z && player.cooldown === 0) {
        player.bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 6 });
        player.cooldown = 10; // Delay between shots
    }

    if (player.cooldown > 0) player.cooldown--;
}

// Handle Bullets
function handleBullets() {
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });
}

// Spawn Enemies
function spawnEnemies() {
    frameCount++;
    if (frameCount % enemySpawnRate === 0) {
        const size = 40;
        const x = Math.random() * (canvas.width - size);
        enemies.push({ x, y: -size, width: size, height: size });
    }
}

// Move Enemies
function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });
}

// Check Collisions
function checkCollisions() {
    player.bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                player.bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
            }
        });
    });
}

// Draw Player
function drawPlayer() {
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw Enemies
function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach((enemy) => ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height));
}

// Draw Bullets
function drawBullets() {
    ctx.fillStyle = "yellow";
    player.bullets.forEach((bullet) => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));
}

// Start the game
gameLoop();
