/// <reference path="./reference.js">
import DeckList from "./data/deckLoader.js"
import URLParam from "./urlParam.js"

class StateManager {
    deckList = new DeckList()
    params = new URLParam()
    elements = {
        deckButtons: $("#DeckButtons"),
        subDeckButtons: $("#SubDeckButtons"),
        optionContainer: $("#OptionButtons"),
        optionsButtons: $("button.option"),
        deckName: $("#DeckName"),
        imageContainer: $("#ImageContainer")
    }
//#OptionButtons > div:nth-child(1) > button:nth-child(1)
    async load() {
        await this.deckList.load()
        this.loadDeckButtons()
        this.checkDeck()
        return this
    }
    /** @returns {JQuery<HTMLElement>} */
    getButton(title) {
        let button = $("<button></button>")
        button.attr("type", "button")
        button.addClass("btn")
        button.addClass("btn-primary")
        button.text(`${title}`)
        return button
    }
    loadDeckButtons() {
        for (let listDeck of this.deckList.list.decks) {
            let button = this.getButton(listDeck.title)
            button.attr("deck-id", listDeck.id)
            button.attr("deck-file", listDeck.file)
            button.on("click", async (event) => { await this.handleDeckButton(button, event) })
            this.elements.deckButtons.append(button)
        }
    }
    /**
     * @param {JQuery<HTMLElement>} button 
     * @param {JQuery.TriggeredEvent<HTMLElement, undefined, HTMLElement, HTMLElement>} event 
     */
    async handleDeckButton(button, event) {
        event.preventDefault()
        let id = button.attr("deck-id")
        this.params.deck = id
        this.params.clearSubDeck()
        this.params.clearOptions()
        this.params.clearCard()
        this.params.update()
    }
    /**
     * @param {number} id 
     * @returns {ListDeck}
     */
    getDeck(id) {
        return this.deckList.list.decks.filter(deck => deck.id == id)[0]
    }
    async checkDeck() {
        if (this.params.deck == null) { return }
        let deck = this.getDeck(this.params.deck)
        if (deck) { await this.loadDeck(deck) }
    }
    /** @param {ListDeck} listDeck */
    async loadDeck(listDeck) {
        let deck = await this.deckList.loadDeck(listDeck)
        this.elements.deckName.text(deck.deck.title)
        this.loadSubDeckButtons(deck.deck.decks)
        if (this.params.subDeck == null) { return }
        let subDeck = deck.deck.decks.filter(sd => sd.id == this.params.subDeck)[0]
        if (!subDeck) { return }
        this.loadOptions(subDeck)
    }
    /** @param {[SubDeck]} subDecks */
    loadSubDeckButtons(subDecks) {
        // this.elements.optionContainer.removeClass("visually-hidden")
        for (let subDeck of subDecks) {
            let button = this.getButton(subDeck.title)
            button.attr("subDeckId", subDeck.id)
            button.on("click", (event) => { this.handleSubDeckButton(button, event) })
            this.elements.subDeckButtons.append(button)
        }
    }
    /**
     * @param {JQuery<HTMLElement>} button 
     * @param {JQuery.TriggeredEvent<HTMLElement, undefined, HTMLElement, HTMLElement>} event 
     */
    handleSubDeckButton(button, event) {
        event.preventDefault()
        let id = button.attr("subDeckId")
        this.params.subDeck = id
        this.params.options = 1
        this.params.clearCard()
        this.params.update()
    }
    /** @param {SubDeck} subDeck */
    loadOptions(subDeck) {
        this.elements.optionContainer.removeClass("visually-hidden")
        this.elements.optionsButtons.on("click", (event) => {
            event.preventDefault()
            this.params.clearCard()
            this.params.options = $(event.target).attr("optionId")
            this.params.update()
        })
        if (this.params.options != null) { this.loadSubDeck(subDeck) }
    }
    /** @param {SubDeck} subDeck */
    loadSubDeck(subDeck) {
        if (this.params.options == 2) { this.loadRandomCard(subDeck); return; }
        for (let card of subDeck.cards) {
            let img = this.getImage(card.file, card.number)
            this.elements.imageContainer.append(img)
        }
    }
    /** @param {SubDeck} subDeck */
    loadRandomCard(subDeck) {
        let card = this.getCard(subDeck)
        if (!card) { return }
        let img = this.getImage(card.file, card.number)
        this.elements.imageContainer.append(img)
    }
    /**
     * @param {SubDeck} subDeck
     * @returns {Card?}
     */
    getCard(subDeck) {
        if (this.params.card == null) { 
            let card = subDeck.cards[Math.floor(Math.random()*subDeck.cards.length)]
            this.params.card = card.number
            this.params.update()
            return null
        }
        return subDeck.cards.filter(card => card.number == this.params.card)[0]
    }
    /**
     * @param {string} file 
     * @param {number} number
     * @returns {JQuery<HTMLElement>}
     */
    getImage(file, number) {
        let url = new URL(this.params.url.toString())
        url.searchParams.set("c", number)
        url.searchParams.set("o", 2)
        let a = $("<a></a>")
        a.attr("href", url.toString())
        a.addClass("col")
        let img = $("<img>")
        img.attr("src", `/data/imgs/${file}`)
        img.addClass("p-2")
        img.addClass("cardImage")
        a.append(img)
        return a
    }
}

$(async () => {
    let stateManager = await (new StateManager()).load()
})