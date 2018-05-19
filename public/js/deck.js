function deck(cardsArray) {
    this.cards = cardsArray;
    this.currentCard = 0;
    this.shuffle = () => {
        shuffle_array(this.cards);
        this.cards.forEach(card => {
            card.currLocation = 'deck';
        });
        this.currentCard = 0;
    }
}