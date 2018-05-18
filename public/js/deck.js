function deck(cardsArray) {
    this.cards = cardsArray;
    this.currentCard = 0;
    this.shuffle = () => {
        shuffle_array(this.cards);
        this.currentCard = 0;
    }
}