/// <reference path="./reference.js">
import DeckList from "./data/deckLoader.js"
import URLParam from "./urlParam.js"
import DeckHelper from "./data/deckHelper.js"

class StateManager {
    deckList = new DeckList()
    params = new URLParam()
    elements = {
        deckButtons: $("#DeckButtons"),
        subDeckButtons: {
            1: $("#SubDeckButtons1"),
            2: $("#SubDeckButtons2"),
            3: $("#SubDeckButtons3"),
            4: $("#SubDeckButtons4")
        },
        optionContainer: $("#OptionButtons"),
        optionsButtons: $("button.option"),
        deckName: $("#DeckName"),
        imageContainer: $("#ImageContainer"),
        battleGeneratorButton: $("#battleGenerator")
    }
    async load() {
        await this.deckList.load()
        this.loadDeckButtons()
        this.checkDeck()
        return this
    }

    //MARK: - Element Creation

    /** @returns {JQuery<HTMLElement>} */
    getButton(title, type) {
        type = this.getColor(type)
        let button = $("<button></button>")
        button.attr("type", "button")
        button.addClass("btn")
        button.addClass(type)
        button.addClass("w-100")
        button.text(`${title}`)
        return button
    }
    /**
     * @param {string} color 
     * @returns {string}
     */
    getColor(color) {
        switch (color) {
            case "white": return "btn-outline-light"
            case "red": return "btn-outline-danger"
            case "green": return "btn-outline-success"
            case "lightBlue": return "btn-outline-info"
            default: return "btn-outline-primary"
        }
    }
    /**
     * @param {JQuery<HTMLElement>} innerElement 
     * @returns {JQuery<HTMLElement>}
     */
    getCol(innerElement) {
        let div = $("<div></div>")
        div.append(innerElement)
        div.addClass("col")
        return div
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
        img.attr("src", `${this.params.pathStart}/data/imgs/${file}`)
        img.addClass("p-2")
        img.addClass("cardImage")
        a.append(img)
        return a
    }

    //MARK: - Step 1: Decks

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
        this.params.clearBattle()
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
        let deck = (await this.deckList.loadDeck(listDeck)).deck
        if (!deck) { return }
        this.elements.deckName.text(deck.title)
        this.elements.battleGeneratorButton.removeClass("visually-hidden")
        this.loadSubDeckButtons(deck.decks)
        this.checkForBattles(deck)
        if (this.params.subDeck == null) { return }
        let subDeck = deck.decks.filter(sd => sd.id == this.params.subDeck)[0]
        if (!subDeck) { return }
        this.loadOptions(subDeck)
    }

    //MARK: - Step 2: Sub Decks

    /** @param {[SubDeck]} subDecks */
    loadSubDeckButtons(subDecks) {
        for (let subDeck of subDecks) {
            let button = this.getButton(subDeck.title, subDeck.color)
            button.attr("subDeckId", subDeck.id)
            button.on("click", (event) => { this.handleSubDeckButton(button, event) })
            this.elements.subDeckButtons[subDeck.row].append(this.getCol(button))
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
        this.params.clearBattle()
        this.params.update()
    }
    /** @param {SubDeck} subDeck */
    loadOptions(subDeck) {
        this.elements.optionContainer.removeClass("visually-hidden")
        this.elements.optionsButtons.on("click", (event) => {
            event.preventDefault()
            this.params.clearCard()
            this.params.clearBattle()
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
            this.params.replace()
        }
        return subDeck.cards.filter(card => card.number == this.params.card)[0]
    }

    //MARK: - Step 3: Generate Battles

    /** @param {Deck} deck */
    checkForBattles(deck) {
        this.handleBattleGenerateButton(deck)
        this.loadBattle(deck)
    }
    /** @param {Deck} deck */
    handleBattleGenerateButton(deck) {
        this.elements.battleGeneratorButton.on("click", (event) => {
            event.preventDefault()
            this.params.clearCard()
            this.params.clearOptions()
            this.params.clearSubDeck()
            this.params.battle = (new DeckHelper(deck)).battleCards().ids
            this.params.update()
        })
    }
    /** @param {Deck} deck */
    loadBattle(deck) {
        let b = this.params.battle
        if (this.params.battle == null || this.params.battle.length < (deck.setup.draws.length * 2 )) { return }
        let dh = new DeckHelper(deck)
        let battle = dh.loadBattle(this.params.battle)
        if (battle.cards.length < deck.setup.draws.length) { return }
        for (let card of battle.cards) {
            let img = this.getImage(card.file, card.number)
            this.elements.imageContainer.append(img)
        }
    }
}

$(async () => {
    let stateManager = await (new StateManager()).load()
})