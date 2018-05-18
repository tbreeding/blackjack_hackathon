'use strict';
let GAME_PLAYER;
let GAME_DEALER;
let GAME_DECK;

const WALLET_AMOUNT = document.getElementById("walletamount");
const BET_AMOUNT = document.getElementById("betamount");
const BET_PLUS_BTN = document.getElementById("plusbutton");
const BET_MINUS_BTN = document.getElementById("minusbutton");
const DEAL_BTN = document.getElementById("dealbutton");
const DEALER_CARDS = document.getElementById("dealercards");
const PLAYER_CARDS = document.getElementById("playercards");
const HIT_BTN = document.getElementById("hitbutton");
const PASS_BTN = document.getElementById("passbutton");
const RESET_BTN = document.getElementById("resetbutton");
const KEEP_GOING_BTNS = document.querySelectorAll(".keepGoing");
const WIN_MODAL = document.getElementById("win");
const LOSE_MODAL = document.getElementById("lose");
const NOMONEY_MODAL= document.getElementById("noMoney");
const RESETS = document.querySelectorAll(".reset");
const PL_SCORES = document.querySelectorAll(".plScore");
const DL_SCORES = document.querySelectorAll(".dlScore");
console.log(PL_SCORES)
const CARD_BACK = 'img/revers.png';

let initialWallet = 500;
let initialBet = 20;
let betIncrement = 5;
let currentBet;
let gameState;
let currentCard;
let dealerInterval


const updateBet = () => {
    BET_AMOUNT.innerText = currentBet;
}
const changeBet = (change) => {
    currentBet += change;
    updateBet();
}
const checkBet = () => {
    if(GAME_PLAYER.wallet - currentBet  < 0) {
        currentBet = GAME_PLAYER.wallet;
        updateBet();
    }
}
const showWin = (pl, dl) => {
    clearInterval(dealerInterval);
    GAME_PLAYER.wallet += currentBet;
    updateWallet();
    console.log("asfasdf",dl, pl);
    setTimeout(() => {
        WIN_MODAL.style.display = "flex"; 
    }, 200);
    gameState = 'betting'
    toggleBtns();
    
}
const showLoss = (pl, dl) => {
    clearInterval(dealerInterval);
    GAME_PLAYER.wallet -= currentBet;
    checkBet();
    updateWallet();
    setTimeout(() => {
        if(GAME_PLAYER.wallet > 0) {
            LOSE_MODAL.style.display = "flex";
        } else {
            NOMONEY_MODAL.style.display = "flex";
        }
    }, 200);
    gameState = 'betting'
    toggleBtns();
}
const checkScore = () => {
    let playerScore = 0;
    let dealerScore = 0;
    GAME_DECK.cards.forEach(card => {
        if(card.currLocation == 'player') playerScore += card.value;
        if(card.currLocation == 'dealer') dealerScore += card.value;
    });
    console.log("pl", playerScore, "dl", dealerScore);
    PL_SCORES.forEach(score => {
        score.innerText = playerScore;
    });
    DL_SCORES.forEach(score => {
        score.innerText = dealerScore;
    });
    if(playerScore < 21 && dealerScore < 21) {
        return [playerScore, dealerScore];
    } else if(playerScore == 21 && dealerScore < 21) {
        showWin(playerScore, dealerScore);
        return;
    } else if(dealerScore == 21) {
        showLoss(playerScore, dealerScore);
        return;
    } else if(playerScore > 21) {
        showLoss(playerScore, dealerScore);
        return;
    } else if(dealerScore > 21) {
        showWin(playerScore, dealerScore);
        return;
    }
    
}
const createCard = (card, facing) => {
    let cardImg;
    if(facing == 'up') {
        cardImg = card.image;
    } else {
        cardImg = CARD_BACK;
    }
    return $('<div>')
        .addClass("card")
        .css({
            'background-image': 'url(' + cardImg +')'
        });
}
const dealToPlayer = (card) => {
    $(PLAYER_CARDS).append(createCard(card, "up"));
    card.currLocation = 'player';
    GAME_DECK.currentCard++;
    console.log(card);
    return;
}
const dealToDealer = (card) => {
    $(DEALER_CARDS).append(createCard(card, GAME_DEALER.currNumCards ? "up" : "down"));
    card.currLocation = 'dealer';
    GAME_DEALER.currNumCards++;
    GAME_DECK.currentCard++;
    console.log(card);
    return;
}
const dealCards = () => {
    toggleBtns(); 
    GAME_DECK.cards.forEach(card => {
        card.currLocation = 'deck';
    });
    $(PLAYER_CARDS).html("");
    $(DEALER_CARDS).html("");
    GAME_DEALER.currNumCards = 0;

    let currentCard = GAME_DECK.cards[GAME_DECK.currentCard];
    dealToPlayer(currentCard);
    currentCard = GAME_DECK.cards[GAME_DECK.currentCard];
    dealToDealer(currentCard);  
    currentCard = GAME_DECK.cards[GAME_DECK.currentCard];
    dealToPlayer(currentCard);
    currentCard = GAME_DECK.cards[GAME_DECK.currentCard];
    dealToDealer(currentCard);
    checkScore();  
}
const resetGame = () => {
    location.reload();
}
const dealerPlay = () => {
    dealerInterval = setInterval(()=> {
        if(checkScore()[1] < 17) {
            dealToDealer(GAME_DECK.cards[GAME_DECK.currentCard]);
        } else {
            clearInterval(dealerInterval);
            if(checkScore()[0] > checkScore()[1]) {
                showWin(checkScore()[0], checkScore()[1]);
            } else {
                showLoss(checkScore()[0], checkScore()[1]);
            }
        }

    }, 500)
    
}
const resetBtnClickHandler = () => {
    resetGame();
}


const dealBtnClickHandler = () => {
    gameState = 'playerturn';
    dealCards();
}

const hitBtnClickHandler = () => {
    gameState = 'dealerturn';
    toggleBtns();
    dealToPlayer(GAME_DECK.cards[GAME_DECK.currentCard]);
    checkScore();
}
const passBtnClickHandler = () => {
    dealerPlay();
}
const betMinusBtnClickHandler = () => {
    if(currentBet - betIncrement < 5) return;
    changeBet(-betIncrement)
}
const betPlusBtnClickHandler = () => {
    if(currentBet + betIncrement > GAME_PLAYER.wallet) return;
    changeBet(betIncrement)
}
const toggleBtns = () => {
    if(gameState == 'betting') {
        BET_PLUS_BTN.addEventListener("click", betPlusBtnClickHandler, false);
        BET_MINUS_BTN.addEventListener("click", betMinusBtnClickHandler, false);
        DEAL_BTN.addEventListener("click", dealBtnClickHandler, false);

        HIT_BTN.removeEventListener("click", hitBtnClickHandler, false);
        PASS_BTN.removeEventListener("click", passBtnClickHandler, false);
    } else if(gameState == 'playerturn') {
        DEAL_BTN.removeEventListener("click", dealBtnClickHandler, false);
        BET_PLUS_BTN.removeEventListener("click", betPlusBtnClickHandler, false);
        BET_MINUS_BTN.removeEventListener("click", betMinusBtnClickHandler, false);
        HIT_BTN.addEventListener("click", hitBtnClickHandler, false);
        PASS_BTN.addEventListener("click", passBtnClickHandler, false);
    } else if(gameState == 'dealerTurn') {
        BET_PLUS_BTN.removeEventListener("click", betPlusBtnClickHandler, false);
        BET_MINUS_BTN.removeEventListener("click", betMinusBtnClickHandler, false);
        HIT_BTN.removeEventListener("click", hitBtnClickHandler, false);
        PASS_BTN.removeEventListener("click", passBtnClickHandler, false);
    }
}

const updateWallet = () => {
    WALLET_AMOUNT.innerText = GAME_PLAYER.wallet;
}

const gameInit = () => {
    RESET_BTN.addEventListener("click", resetBtnClickHandler, false);
    GAME_PLAYER = new player(initialWallet);
    GAME_DEALER = new dealer();
    GAME_DECK = new deck(generate_cards());
    GAME_DECK.shuffle();
    gameState = 'betting';
    currentBet = initialBet;
    updateBet();
    updateWallet();
    toggleBtns();
    console.log(GAME_PLAYER, GAME_DEALER, GAME_DECK);
}

const keepGoingClickHandler = () => {
    WIN_MODAL.style.display = "none";
    LOSE_MODAL.style.display = "none";
    gameState = 'betting';
    toggleBtns();
    $(PLAYER_CARDS).html("");
    $(DEALER_CARDS).html("");
    // dealCards();
}
$(document).ready(function() {
  console.log('loaded')
  KEEP_GOING_BTNS.forEach(btn => {
      btn.addEventListener("click", keepGoingClickHandler, false);
  });
  RESETS.forEach(btn => {
      btn.addEventListener("click", resetBtnClickHandler, false);
  })
  gameInit();
});
