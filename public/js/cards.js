'use strict';

const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
const RANKS = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
const VALUES = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]

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
function Card(suit, rank, value) {
  this.suit = suit;
  this.rank = rank;
  this.value = value;
  this.currLocation = 'deck';
  this.image = 'img/' + this.suit + '-' + this.rank + '.png';
}

/* 
 * Generates an array of 52 playing cards.
 */
function generate_cards() {
  let result = [];
  SUITS.forEach(function(suit) {
    RANKS.forEach(function(rank, ind) {
      result.push(new Card(suit, rank, VALUES[ind]));
    });
  });

  return result;
}

