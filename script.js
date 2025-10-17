document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO CARROSSEL ---
    const carouselContainer = document.getElementById("image-carousel");
    const carouselImages = [
        'imagens/c1.png',
        'imagens/c2.png'
    ];
    let currentImageIndex = 0;

    // Pré-carrega as imagens do carrossel para uma transição mais suave
    carouselImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    function showNextImage() {
        // Remove a imagem antiga
        const oldImage = carouselContainer.querySelector('img');
        if (oldImage) {
            oldImage.style.opacity = '0';
            setTimeout(() => oldImage.remove(), 1500); // Remove após a transição
        }
        
        // Cria e exibe a nova imagem
        const newImg = document.createElement('img');
        newImg.src = carouselImages[currentImageIndex];
        newImg.className = 'carousel-item absolute top-0 left-0 w-full h-full object-cover opacity-0';
        carouselContainer.appendChild(newImg);
        
        // Força o navegador a aplicar a classe antes de mudar a opacidade
        setTimeout(() => {
            newImg.style.opacity = '1';
        }, 50);

        // Atualiza o índice para a próxima imagem
        currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
    }

    // Inicia o carrossel
    showNextImage();
    setInterval(showNextImage, 5000); // Muda a imagem a cada 5 segundos


    // --- LÓGICA DO JOGO DA MEMÓRIA ---
    const gameContainer = document.getElementById("game-container");
    const winMessage = document.getElementById("win-message");
    const restartButton = document.getElementById("restart");

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;
    const totalPairs = 10;

    function createCards() {
        const pairs = [];
        for (let i = 1; i <= 20; i += 2) {
            pairs.push([`imagens/${i}.png`, `imagens/${i + 1}.png`]);
        }

        const shuffled = pairs.flat().sort(() => Math.random() - 0.5);

        shuffled.forEach(imgSrc => {
            const card = document.createElement("div");
            // Aumento do tamanho das cartas
            card.classList.add("card", "w-40", "h-56", "md:w-52", "md:h-72", "cursor-pointer");
            card.innerHTML = `
              <div class="card-inner">
                <div class="card-back bg-cover bg-center rounded-xl shadow-lg border-4 border-white" style="background-image: url('imagens/capa.png');"></div>
                <div class="card-front bg-white rounded-xl shadow-lg p-1 border-4 border-white">
                  <img src="${imgSrc}" alt="Personalidade" class="w-full h-full object-cover rounded-md">
                </div>
              </div>
            `;
            card.addEventListener("click", () => flipCard(card, imgSrc));
            gameContainer.appendChild(card);
            cards.push(card);
        });
    }
    
    function flipCard(card, img) {
        if (!canFlip || flippedCards.length >= 2 || card.classList.contains("flipped")) {
            return;
        }

        card.classList.add("flipped");
        flippedCards.push({ card, img });

        if (flippedCards.length === 2) {
            canFlip = false;
            checkMatch();
        }
    }

    function checkMatch() {
        const [first, second] = flippedCards;
        const groupA = Math.ceil(parseInt(first.img.match(/\d+/)[0]) / 2);
        const groupB = Math.ceil(parseInt(second.img.match(/\d+/)[0]) / 2);

        if (groupA === groupB) {
            matchedPairs++;
            flippedCards = [];
            canFlip = true;
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    winMessage.classList.remove("hidden");
                    winMessage.querySelector('div').classList.remove('scale-95', 'opacity-0');
                    winMessage.querySelector('div').classList.add('scale-100', 'opacity-100');
                }, 800);
            }
        } else {
            setTimeout(() => {
                first.card.classList.remove("flipped");
                second.card.classList.remove("flipped");
                flippedCards = [];
                canFlip = true;
            }, 1200);
        }
    }

    function restartGame() {
        const modalContent = winMessage.querySelector('div');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            winMessage.classList.add("hidden");
            gameContainer.innerHTML = "";
            cards = [];
            flippedCards = [];
            matchedPairs = 0;
            canFlip = true;
            createCards();
        }, 300);
    }

    restartButton.addEventListener("click", restartGame);
    createCards();
});
