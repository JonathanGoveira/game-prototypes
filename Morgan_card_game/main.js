// Classe Player
class Player {
    constructor(playerId) {
        this.id = playerId;
        this.cards = [
            { cardname: "Guerreiro", attack: 5, life: 10 },
            { cardname: "Mago", attack: 7, life: 8 },
            { cardname: "Arqueiro", attack: 6, life: 9 }
        ];
        this.masterCard = { cardname: "Sorte", life: 20 }; // Adiciona a vida da carta mestre
    }
    updateUI() {
        this.cards.forEach((card, index) => {
            document.querySelector(`#${this.id} #card${index + 1} #cardname`).textContent = card.cardname;
            document.querySelector(`#${this.id} #card${index + 1} #attack`).textContent = card.attack;
            document.querySelector(`#${this.id} #card${index + 1} #life`).textContent = card.life;
        });
        document.querySelector(`#${this.id} #master #cardname`).textContent = this.masterCard.cardname;
        document.querySelector(`#${this.id} #master #life`).textContent = this.masterCard.life;
    }
}

const player1 = new Player("player1");
const player2 = new Player("player2");

let currentPlayer = player1;  // Player 1 começa
let diceRolled = false;
let selectedPlayerCard = null;
let selectedEnemyCard = null;

// Rola um dado
function rollDice() {
    return Math.floor(Math.random() * 6) + 1; // Rola um número entre 1 e 6
}

// Exibe mensagens no console
function displayMessage(message) {
    document.getElementById('game-messages').innerText = message;
}

// Inicializa a interface dos jogadores
player1.updateUI();
player2.updateUI();

// Exibi de quem é o turno
document.getElementById("tittle").innerText = `Turno do ${currentPlayer.id}`;

// Adiciona evento para rolar os dados
document.getElementById("roll-dice").addEventListener("click", function() {
    if (diceRolled) {
        displayMessage("Você já rolou os dados! Selecione as cartas e finalize o turno.");
        return;
    }

    const diceRoll = rollDice();
    displayMessage(`${currentPlayer.id} rolou: ${diceRoll}`);
    diceRolled = true;  // Marca que os dados já foram rolados

    // Muda o texto do botão para "Atacar"
    this.innerText = "Atacar";
});

// Seleção de cartas
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function() {
        if (diceRolled) {
            if (card.closest(`#${currentPlayer.id}`)) {
                selectedPlayerCard = card;
                displayMessage(`${currentPlayer.id} selecionou a própria carta: ${card.querySelector("#cardname").innerText}`);
            } else {
                selectedEnemyCard = card;
                displayMessage(`${currentPlayer.id} selecionou a carta do oponente: ${card.querySelector("#cardname").innerText}`);
            }
        }

        // Verifica se ambas as cartas foram selecionadas
        if (selectedPlayerCard && selectedEnemyCard) {
            document.getElementById("roll-dice").style.display = "none"; // Esconde o botão de rolar dados
            document.getElementById("attack-button").style.display = "inline"; // Mostra o botão de atacar
        }
    });
});

// Função de ataque
function attack() {
    const playerAttack = parseInt(selectedPlayerCard.querySelector("#attack").innerText);
    
    // A vida da carta mestre do adversário
    const enemyMasterLife = document.querySelector(`#${currentPlayer.id === "player1" ? "player2" : "player1"} #master #life`);
    let enemyCurrentLife = parseInt(enemyMasterLife.innerText);

    enemyCurrentLife -= playerAttack; // Reduz a vida da carta mestre

    if (enemyCurrentLife <= 0) {
        enemyCurrentLife = 0;
        displayMessage(`${currentPlayer.id} derrotou a carta mestre do oponente!`);
    } else {
        displayMessage(`A carta mestre do oponente agora tem ${enemyCurrentLife} de vida.`);
    }

    enemyMasterLife.innerText = enemyCurrentLife; // Atualiza a vida da carta mestre

    // Limpa as seleções para o próximo turno
    selectedPlayerCard = null;
    selectedEnemyCard = null;
    diceRolled = false;

    // Muda o texto do botão de atacar para "Encerrar Turno"
    document.getElementById("attack-button").innerText = "Encerrar Turno";
}

// Finaliza o turno
document.getElementById("attack-button").addEventListener("click", function() {
    if (selectedPlayerCard && selectedEnemyCard) {
        attack();

        // Alterna o jogador
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        displayMessage(`Fim do turno. Agora é a vez de ${currentPlayer.id}.`);
        
        // Exibi de quem é o turno
        document.getElementById("tittle").innerText = `Turno do ${currentPlayer.id}`;
        // Esconde o botão de ataque após o turno
        this.style.display = "none"; 
        document.getElementById("roll-dice").style.display = "inline"; // Mostra o botão de rolar dados
        document.getElementById("roll-dice").innerText = "Rolar Dados"; // Restaura o texto do botão
    } else {
        displayMessage("Você precisa selecionar uma carta sua e uma do adversário antes de atacar.");
    }
});
