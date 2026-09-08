// === ESTADOS DO SISTEMA TEMPORAL ===
let isGameActive = false;
let timeMode = 'normal'; // 'normal', 'rewind', 'pause', 'forward'

let virtualTimeOffset = 0; // Offset temporal simulado (ms)
let treeAgeInSeconds = 0;  // Idade exata da árvore em segundos

// Elementos do DOM
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const systemStatusEl = document.getElementById('systemStatus');

const toggleGameBtn = document.getElementById('toggleGameBtn');
const timeControls = document.getElementById('timeControls');
const treeStatusEl = document.getElementById('treeStatus');
const timelineProgress = document.getElementById('timelineProgress');

const btnRewind = document.getElementById('btnRewind');
const btnNormal = document.getElementById('btnNormal');
const btnPause = document.getElementById('btnPause');
const btnForward = document.getElementById('btnForward');

const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

// Partículas flutuantes (esporos / poeira / cinzas)
let particles = [];
const MAX_PARTICLES = 40;

// === GERADOR DE RACHADURAS SVG REALISTAS ===
function generateCracks() {
    const svg = document.getElementById('crackSvg');
    svg.innerHTML = ''; // Limpa rachaduras anteriores

    const centerX = 500;
    const centerY = 500;
    const numRadialLines = 12;

    for (let i = 0; i < numRadialLines; i++) {
        let angle = (i / numRadialLines) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
        let currX = centerX;
        let currY = centerY;
        let pathD = `M ${centerX} ${centerY}`;

        let steps = 6 + Math.floor(Math.random() * 5);
        for (let j = 0; j < steps; j++) {
            let dist = (j + 1) * (450 / steps);
            let varAngle = angle + (Math.random() * 0.4 - 0.2);
            currX = centerX + Math.cos(varAngle) * dist;
            currY = centerY + Math.sin(varAngle) * dist;
            pathD += ` L ${currX} ${currY}`;

            // Ramificações secundárias
            if (Math.random() > 0.5) {
                let subAngle = varAngle + (Math.random() > 0.5 ? 0.6 : -0.6);
                let subX = currX + Math.cos(subAngle) * (40 + Math.random() * 50);
                let subY = currY + Math.sin(subAngle) * (40 + Math.random() * 50);
                pathD += ` M ${currX} ${currY} L ${subX} ${subY} M ${currX} ${currY}`;
            }
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('stroke', i % 2 === 0 ? '#00ff66' : '#ffffff');
        path.setAttribute('stroke-width', (Math.random() * 1.5 + 0.5).toString());
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', (Math.random() * 0.5 + 0.4).toString());
        svg.appendChild(path);
    }
}
generateCracks();

// === RELÓGIO DE BRASÍLIA ===
function getBrasiliaDate() {
    const now = new Date();
    const adjustedTime = new Date(now.getTime() + virtualTimeOffset);
    return new Date(adjustedTime.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
}

// === LÓGICA DE CONTROLE DO GAME ===
toggleGameBtn.addEventListener('click', () => {
    isGameActive = !isGameActive;

    if (isGameActive) {
        generateCracks(); // Gera padrão novo a cada ativação
        document.body.classList.add('cracked', 'shake');
        timeControls.classList.remove('hidden');
        toggleGameBtn.classList.add('active-mode');
        toggleGameBtn.querySelector('.btn-text').innerText = "DESATIVAR FENÔMENO";
        systemStatusEl.innerText = "MANIPULAÇÃO TEMPORAL ATIVA";
        systemStatusEl.style.color = "var(--verde-neon)";

        setTimeout(() => document.body.classList.remove('shake'), 400);
    } else {
        document.body.classList.remove('cracked');
        timeControls.classList.add('hidden');
        toggleGameBtn.classList.remove('active-mode');
        toggleGameBtn.querySelector('.btn-text').innerText = "ATIVAR FENÔMENO TEMPORAL";
        systemStatusEl.innerText = "SISTEMA EM SINCRO (UTC-3)";
        systemStatusEl.style.color = "var(--cinza-texto)";

        setMode('normal');
        virtualTimeOffset = 0;
    }
});

function setMode(mode) {
    timeMode = mode;
    [btnRewind, btnNormal, btnPause, btnForward].forEach(b => b.classList.remove('active'));
    if (mode === 'rewind') btnRewind.classList.add('active');
    if (mode === 'normal') btnNormal.classList.add('active');
    if (mode === 'pause') btnPause.classList.add('active');
    if (mode === 'forward') btnForward.classList.add('active');
}

btnRewind.addEventListener('click', () => setMode('rewind'));
btnNormal.addEventListener('click', () => setMode('normal'));
btnPause.addEventListener('click', () => setMode('pause'));
btnForward.addEventListener('click', () => setMode('forward'));

// === SISTEMA DE PARTÍCULAS AMBIENTAIS ===
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height - 20 - Math.random() * 150;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.6 + 0.2;
    }

    update(isDead) {
        this.y += isDead ? 0.6 : this.speedY; // Cinzas caem, esporos sobem
        this.x += this.speedX;

        if (this.y < 20 || this.y > canvas.height - 10) this.reset();
    }

    draw(color) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < MAX_PARTICLES; i++) particles.push(new Particle());

// === MOTOR GRÁFICO PROCEDURAL DA ÁRVORE (CANVAS 2D) ===
function drawProceduralTree(age) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Desenho do Solo
    ctx.fillStyle = "#121212";
    ctx.beginPath();
    ctx.ellipse(200, 290, 140, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1;
    ctx.stroke();

    const maxAge = 240; // Total do ciclo em segundos
    const progress = Math.min(age / maxAge, 1);
    
    // Atualiza barra de progresso da HUD
    timelineProgress.style.width = `${progress * 100}%`;

    // A. Fase Semente (0 a 15s)
    if (age <= 15) {
        let pulse = Math.sin(Date.now() * 0.005) * 1.5;
        ctx.fillStyle = "#00ff66";
        ctx.shadowColor = "#00ff66";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(200, 288, 5 + pulse, 3 + pulse, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        treeStatusEl.innerText = `SEMENTE LATENTE (${Math.floor(age)}s)`;
        return;
    }

    // B. Parâmetros da Árvore Fractal baseados na Idade
    const wind = Math.sin(Date.now() * 0.002) * 0.03; // Brisa suave contínua
    const isHealthy = age < 180;
    const isDecaying = age >= 180;

    // Função Recursiva para desenhar Galhos Fractais
    function renderBranch(x, y, length, angle, branchWidth, depth) {
        if (depth <= 0 || length < 2) return;

        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(angle + wind);

        // Estilização do Tronco / Galho
        if (isDecaying) {
            ctx.strokeStyle = "#2a2a2a"; // Madeira morta/cinza
        } else {
            ctx.strokeStyle = depth > 2 ? "#1e1e1e" : "#047857";
        }
        ctx.lineWidth = branchWidth;
        ctx.lineCap = "round";

        ctx.moveTo(0, 0);
        ctx.lineTo(0, -length);
        ctx.stroke();

        // Renderização da Folhagem nos galhos mais finos
        if (depth <= 3 && age > 30) {
            let leafSize = Math.min((age - 30) / 60, 1) * 8;

            if (isHealthy) {
                // Folhas Vivas (Gradação de Verde e Branco Neon)
                ctx.fillStyle = depth % 2 === 0 ? "#00ff66" : "#10b981";
                ctx.shadowColor = "#00ff66";
                ctx.shadowBlur = depth === 1 ? 8 : 0;
                ctx.beginPath();
                ctx.arc(0, -length, leafSize + Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else {
                // Folhas Secando/Secas (Cinza e Branco Opaco encolhendo)
                let decayFactor = Math.max(0, 1 - (age - 180) / 60);
                if (decayFactor > 0) {
                    ctx.fillStyle = "#888888";
                    ctx.beginPath();
                    ctx.arc(0, -length, leafSize * decayFactor, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Chamadas Recursivas para os Sub-galhos
        const nextLength = length * 0.72;
        const nextWidth = branchWidth * 0.68;

        renderBranch(0, -length, nextLength, angle + 0.35 + wind, nextWidth, depth - 1);
        renderBranch(0, -length, nextLength, angle - 0.35 + wind, nextWidth, depth - 1);

        ctx.restore();
    }

    // Calcular profundidade da árvore conforme o tempo passa
    const maxDepth = Math.min(Math.floor((age / 180) * 8) + 2, 8);
    const trunkLength = Math.min((age / 120) * 60, 60);
    const trunkWidth = Math.min((age / 120) * 10, 10);

    // Renderiza a Árvore a partir do solo
    renderBranch(200, 288, trunkLength, 0, trunkWidth, maxDepth);

    // C. Atualiza Partículas de Esporos/Cinzas
    const particleColor = isHealthy ? "#00ff66" : "#888888";
    particles.forEach(p => {
        p.update(!isHealthy);
        p.draw(particleColor);
    });

    // D. Atualização do Status Textual
    if (age < 45) treeStatusEl.innerText = `BROTO EM GERMINAÇÃO (${Math.floor(age)}s)`;
    else if (age < 120) treeStatusEl.innerText = `ÁRVORE JOVEM (${Math.floor(age)}s)`;
    else if (age < 180) treeStatusEl.innerText = `ÁRVORE ADULTA VIGOROSA (${Math.floor(age)}s)`;
    else if (age < 240) treeStatusEl.innerText = `COLAPSO BIOLÓGICO / ENVELHECENDO (${Math.floor(age)}s)`;
    else treeStatusEl.innerText = `FÓSSIL TEMPORAL / MENSAGEM SECA (${Math.floor(age)}s)`;
}

// === LOOP PRINCIPAL DO SISTEMA ===
function mainLoop() {
    // 1. Atualização da Física de Tempo
    if (isGameActive) {
        if (timeMode === 'forward') {
            virtualTimeOffset += 1800; // Avanço rápido
            treeAgeInSeconds += 0.35;
        } else if (timeMode === 'rewind') {
            virtualTimeOffset -= 1800; // Regressão rápida
            treeAgeInSeconds = Math.max(0, treeAgeInSeconds - 0.35);
        } else if (timeMode === 'normal') {
            treeAgeInSeconds += 0.016; // Incremento tempo real
        }
        // Se 'pause', o incremento é zero
    } else {
        treeAgeInSeconds = 0; // Estado inicial limpo fora do mini game
    }

    // 2. Sincronização do Relógio de Brasília
    const bsbDate = getBrasiliaDate();
    hoursEl.innerText = String(bsbDate.getHours()).padStart(2, '0');
    minutesEl.innerText = String(bsbDate.getMinutes()).padStart(2, '0');
    secondsEl.innerText = String(bsbDate.getSeconds()).padStart(2, '0');

    // 3. Renderização Gráfica
    drawProceduralTree(treeAgeInSeconds);

    requestAnimationFrame(mainLoop);
}

// Inicia execução
requestAnimationFrame(mainLoop);