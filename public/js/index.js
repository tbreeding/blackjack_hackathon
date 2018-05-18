'use strict';
const BET_AMOUNT = document.getElementById("betamount");
const BET_PLUS_BTN = document.getElementById("plusbutton");
const BET_MINUS_BTN = document.getElementById("minusbutton");
const DEAL_BTN = document.getElementById("dealbutton");
const DEALER_CARDS = document.getElementById("dealercards");
const PLAYER_CARDS = document.getElementById("playercards");
const HIT_BTN = document.getElementById("hitbutton");
const PASS_BTN = document.getElementById("passbutton");
const RESET_BTN = document.getElementById("resetbutton");

let currentBet = 5;
let gameState;



const updateBet = () => {
    BET_AMOUNT.innerText = currentBet;
}

const changeBet = (change) => {
    currentBet += change;
    updateBet();
}

const resetGame = () => {

}

const resetBtnClickHandler = () => {
    resetGame();
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
    const GAME_PLAYER = new player(500);
    const GAME_DEALER = new dealer();
    const GAME_DECK = new deck(generate_cards());
    GAME_DECK.shuffle();
    gameState = 'betting';
    toggleBetBtns();
    console.log(GAME_PLAYER, GAME_DEALER, GAME_DECK);
}

$(document).ready(function() {
  console.log('loaded')
  gameInit();
});
