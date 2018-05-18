'use strict';
let currentBet = 5;

const updateBet = () => {
    
}

const changeBet = (change) => {
    currentBet += change;
    updateBet();
}

const gameInit = () => {
    const GAME_PLAYER = new player(500);
    const GAME_DEALER = new dealer();
    console.log(GAME_PLAYER, GAME_DEALER);
}



$(document).ready(function() {
  console.log('loaded')
  gameInit();
});
