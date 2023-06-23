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

    get rows() {
        let rowGet = (index) => { this.deck.decks.filter(sd => sd.row == index) }
        return {
            1: rowGet(1),
            2: rowGet(2),
            3: rowGet(3),
            4: rowGet(4)
        }
    }
}

export default DeckList