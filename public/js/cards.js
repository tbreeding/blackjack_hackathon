'use strict';

const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
const RANKS = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];

/* 
 * Generates a random integer between 0 (inclusive) and max (exclusive)
 */
function randint(max) {
  return Math.floor(Math.random() * max);
}

/* 
 * Randomly suffles an array of any values.
 */
function shuffle_array(array) {
  for(let max = array.length - 1; max > 1; max--) {
    let index = randint(max);
    let value = array[index];
    array[index] = array[max]
    array[max] = value;
  }
}

/* 
 * Representation of one card as na object. Feel free to extend it
 * with other properties and methods 
 */
function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;
}

/* 
 * Generates an array of 52 playing cards.
 */
function generate_cards() {
  let result = [];
  SUITS.forEach(function(suit) {
    RANKS.forEach(function(rank) {
      result.push(new Card(suit, rank));
    });
  });

  return result;
}

