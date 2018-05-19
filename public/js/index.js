'use strict';
let GAME_PLAYER; //Holds the player object
let GAME_DEALER; //Holds the dealer object
let GAME_DECK; //Holds the deck object

const WALLET_AMOUNT = document.getElementById("walletAmount");
const BET_AMOUNT = document.getElementById("betAmount");
const BET_PLUS_BTN = document.getElementById("plusButton");
const BET_MINUS_BTN = document.getElementById("minusButton");
const DEAL_BTN = document.getElementById("dealButton");
const DEALER_CARDS = document.getElementById("dealerCards");
const PLAYER_CARDS = document.getElementById("playerCards");
const HIT_BTN = document.getElementById("hitButton");
const PASS_BTN = document.getElementById("passButton");
const KEEP_GOING_BTNS = document.querySelectorAll(".keepGoing");
const WIN_MODAL = document.getElementById("win");
const LOSE_MODAL = document.getElementById("lose");
const NOMONEY_MODAL= document.getElementById("noMoney");
const RESETS = document.querySelectorAll(".reset");
const PL_SCORES = document.querySelectorAll(".plScore");
const DL_SCORES = document.querySelectorAll(".dlScore");

const CARD_BACK = 'img/revers.png';
const DEALER_HOLD = 17;
const INITIAL_WALLET = 500;
const INITIAL_BET = 20;
const BET_INCREMENT = 5;
let currentBet; //Hold the current bet amount
let gameState; //Primarily for activating and deactivating buttons
let currentCard; //The current card being dealt
let dealerInterval; //Interval for slowing down dealer play

//Clear the card tables
const clearTables = () => {
    $(PLAYER_CARDS).html("");
    $(DEALER_CARDS).html("");
    GAME_DEALER.currNumCards = 0;
}
//Pushes the bet amount to DOM
const updateBet = () => {
    BET_AMOUNT.innerText = currentBet;
}
//Increments the bet amount
const changeBet = (change) => {
    currentBet += change;
    updateBet();
    return;
}
//Doesn't allow bet to exceed current wallet amount
const checkBet = () => {
    if(GAME_PLAYER.wallet - currentBet  < 0) {
        currentBet = GAME_PLAYER.wallet;
        updateBet();
    }
    return;
}
//Flips all the dealer cards when play holds
const flipDealerCards = () => {
    $(DEALER_CARDS).html("");
    GAME_DECK.cards.forEach(card => {
        if(card.currLocation == 'dealer') {
            dealToDealer(card, true)
        }
    });
    return;
}
const showWin = () => {
    clearInterval(dealerInterval);
    GAME_PLAYER.wallet += currentBet;
    updateWallet();
    flipDealerCards();
    setTimeout(() => {
        WIN_MODAL.style.display = "flex"; 
    }, 500);
    gameState = 'betting'
    toggleBtns(); 
}
const showLoss = () => {
    clearInterval(dealerInterval);
    GAME_PLAYER.wallet -= currentBet;
    checkBet();
    updateWallet();
    flipDealerCards();
    setTimeout(() => {
        if(GAME_PLAYER.wallet > 0) {
            LOSE_MODAL.style.display = "flex";
        } else {
            NOMONEY_MODAL.style.display = "flex";
        }
    }, 500);
    gameState = 'betting'
    toggleBtns();
}
const calcScore = (who) => {
    let score = 0;
    GAME_DECK.cards.forEach(card => {
        if(card.currLocation == who) score += card.value;
    });
    return score;
}
//Pushes the players' scores to end-game popups
const updateModals = (playerScore, dealerScore) => {
    PL_SCORES.forEach(score => {
        score.innerText = playerScore;
    });
    DL_SCORES.forEach(score => {
        score.innerText = dealerScore;
    });
}
//Checks the score and win/lose state
const checkScore = () => {
    let playerScore = calcScore('player');
    let dealerScore = calcScore('dealer');

    updateModals(playerScore, dealerScore);
    
    if(playerScore < 21 && dealerScore < 21) {
        return [playerScore, dealerScore];
    } else if(playerScore == 21 && dealerScore < 21) {
        showWin();
    } else if(dealerScore == 21) {
        showLoss();
    } else if(playerScore > 21) {
        showLoss();
    } else if(dealerScore > 21) {
        showWin();
    }
    return [playerScore, dealerScore];
}
//Generates HTML for the cards
const createCard = (card, facing) => {
    let cardImg = facing == 'up' ? card.image : CARD_BACK;
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
    return;
}
const dealToDealer = (card, endOfHand) => {
    $(DEALER_CARDS).append(createCard(card, GAME_DEALER.currNumCards || endOfHand ? "up" : "down"));
    card.currLocation = 'dealer';
    GAME_DEALER.currNumCards++;
    GAME_DECK.currentCard++;
    return;
}
const dealCards = () => {
    GAME_DECK.shuffle();
    clearTables();
    dealToPlayer(GAME_DECK.cards[GAME_DECK.currentCard]);
    dealToDealer(GAME_DECK.cards[GAME_DECK.currentCard]);  
    dealToPlayer(GAME_DECK.cards[GAME_DECK.currentCard]);
    dealToDealer(GAME_DECK.cards[GAME_DECK.currentCard]);
    checkScore();  
}
const dealerPlay = () => {
    dealerInterval = setInterval(()=> {
        if(checkScore()[1] < DEALER_HOLD) {
            dealToDealer(GAME_DECK.cards[GAME_DECK.currentCard]);
        } else {
            clearInterval(dealerInterval);
            if(checkScore()[0] > checkScore()[1]) {
                showWin();
            } else {
                showLoss();
            }
        }
    }, 500)   
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
//Click Handlers
const resetBtnClickHandler = () => {
    location.reload();
}
const dealBtnClickHandler = () => {
    gameState = 'playerturn';
    toggleBtns();
    dealCards();
}
const hitBtnClickHandler = () => {
    dealToPlayer(GAME_DECK.cards[GAME_DECK.currentCard]);
    checkScore();
}
const passBtnClickHandler = () => {
    gameState = 'dealerturn'
    toggleBtns();
    dealerPlay();
}
const betMinusBtnClickHandler = () => {
    changeBet(currentBet - BET_INCREMENT < BET_INCREMENT ? 0 : -BET_INCREMENT);
}
const betPlusBtnClickHandler = () => {
    changeBet(currentBet + BET_INCREMENT > GAME_PLAYER.wallet ? 0 : BET_INCREMENT);
}
const keepGoingClickHandler = () => {
    WIN_MODAL.style.display = "none";
    LOSE_MODAL.style.display = "none";
    gameState = 'betting';
    toggleBtns();
    clearTables();
}
$(document).ready(() => {
    KEEP_GOING_BTNS.forEach(btn => {
        btn.addEventListener("click", keepGoingClickHandler, false);
    });
    RESETS.forEach(btn => {
        btn.addEventListener("click", resetBtnClickHandler, false);
    });

    GAME_PLAYER = new player(INITIAL_WALLET);
    GAME_DEALER = new dealer();
    GAME_DECK = new deck(generate_cards());
    GAME_DECK.shuffle();
    gameState = 'betting';
    currentBet = INITIAL_BET;
    updateBet();
    updateWallet();
    toggleBtns();
});