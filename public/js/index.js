'use strict';
let GAME_PLAYER;
let GAME_DEALER;
let GAME_DECK;

const BET_AMOUNT = document.getElementById("betamount");
const BET_PLUS_BTN = document.getElementById("plusbutton");
const BET_MINUS_BTN = document.getElementById("minusbutton");
const DEAL_BTN = document.getElementById("dealbutton");
const DEALER_CARDS = document.getElementById("dealercards");
const PLAYER_CARDS = document.getElementById("playercards");
const HIT_BTN = document.getElementById("hitbutton");
const PASS_BTN = document.getElementById("passbutton");
const RESET_BTN = document.getElementById("resetbutton");
const CARD_BACK = 'img/revers.png';

let initialWallet = 500;
let initialBet = 20;
let betIncrement = 5;
let currentBet;
let gameState;



const updateBet = () => {
    BET_AMOUNT.innerText = currentBet;
}

const changeBet = (change) => {
    currentBet += change;
    updateBet();
}
const createCard = (card, facing) => {
    console.log(card);
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
const dealToPlayer = () => {
    $(PLAYER_CARDS).append(createCard(currentCard, "up"));
    GAME_DECK.currentCard++;
    return;
}
const dealToDealer = () => {
    $(DEALER_CARDS).append(createCard(currentCard, GAME_DEALER.currNumCards ? "up" : "down"));
    GAME_DECK.currentCard++;
    return;
}
const dealCards = () => {
    let currentCard = GAME_DECK.cards[GAME_DECK.currentCard];
    toggleBtns(); 
    // let currPlayer = gameState == 'playerturn' ? PLAYER_CARDS : DEALER_CARDS;
    dealToPlayer();
    dealToDealer();
    
    
}
const resetGame = () => {

}

const resetBtnClickHandler = () => {
    resetGame();
}

const betMinusBtnClickHandler = () => {
    if(currentBet - betIncrement < 5) return;
    changeBet(-betIncrement)
}
const betPlusBtnClickHandler = () => {
    if(currentBet + betIncrement > GAME_PLAYER.wallet) return;
    changeBet(betIncrement)
}
const dealBtnClickHandler = () => {
    gameState = 'playerturn';
    dealCards();
}

const hitBtnClickHandler = () => {

}

const passBtnClickHandler = () => {

}

const toggleBtns = () => {
    if(gameState == 'betting') {
        BET_PLUS_BTN.addEventListener("click", betPlusBtnClickHandler, false);
        BET_MINUS_BTN.addEventListener("click", betMinusBtnClickHandler, false);
        DEAL_BTN.addEventListener("click", dealBtnClickHandler, false);

        HIT_BTN.removeEventListener("click", hitBtnClickHandler, false);
        PASS_BTN.removeEventListener("click", passBtnClickHandler, false);
    } else if(gameState == 'playerturn') {
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

const activateButtons = () => {
    DEAL_BTN.addEventListener("click", dealBtnClickHandler, false);
    RESET_BTN.addEventListener("click", resetBtnClickHandler, false);
    HIT_BTN.addEventListener("click", hitBtnClickHandler, false);
    PASS_BTN.addEventListener("click", passBtnClickHandler, false);
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
    toggleBtns();
    console.log(GAME_PLAYER, GAME_DEALER, GAME_DECK);
}

$(document).ready(function() {
  console.log('loaded')
  gameInit();
});
