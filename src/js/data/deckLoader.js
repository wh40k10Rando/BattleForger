/// <reference path="./reference.js">
import Loader from "./loader.js"

class DeckList extends Loader {
    /** @type {DeckListObj} */
    list
    constructor() {
        super()
    }
    /** @returns {DeckList} */
    async load() {
        this.list = await super.load("decks.json")
        return this
    }
    /**
     * @param {ListDeck} deck
     * @returns {DeckLoader} 
     */
    async loadDeck(deck) {
        return await (new DeckLoader(deck)).load()
    }
}

class DeckLoader extends Loader {
    /** @type {Deck} */
    deck
    /** @type {ListDeck} */
    listDeck
    /** @param {ListDeck} listDeck - The deck to load */
    constructor(listDeck) {
        super()
        this.listDeck = listDeck
    }
    /** @returns {DeckLoader} */
    async load() {
        this.deck = await super.load(this.listDeck.file)
        return this
    }
    /** 
     * @param {Card} card
     * @returns {JQuery<HTMLElement>}
     */
    loadImg(card) {
        return (new ImageLoader(card)).img
    }
}

class ImageLoader {
    /** @type {Card} */
    card
    /** @type {JQuery<HTMLElement>} */
    img

    /** @param {Card} card */
    constructor(card) {
        this.card = card
        this.img = $("<img>")
        this.img.attr("src", `/data/imgs/${this.card.file}`)
        this.img.addClass("cardImage")
    }
}

export default DeckList