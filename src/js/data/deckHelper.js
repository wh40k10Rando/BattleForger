/// <reference path="./reference.js">

/**
 * @typedef {Object} CardContainer
 * @property {Card[]} cards - An array of cards.
 * @property {number[]} ids - An array of numbers representing the IDs.
 */

/**
 * @typedef {Object} RerollState
 * @property {number} rerolls - The number of rerolls.
 * @property {string[]} state - An array of strings representing a state.
 */

class DeckHelper {
    /** @type {Deck} */
    deck
    /** @param {Deck} deck */
    constructor(deck) { this.deck = deck }

    /**
     * @param {number} index 
     * @returns {SubDeck}
     */
    getSubDeck(index) {
        return this.deck.decks.filter(deck => deck.id == index)[0]
    }
    /**
     * @param {SubDeck} subDeck 
     * @returns {Card}
     */
    randomCard(subDeck) {
        return subDeck.cards[Math.floor(Math.random()*subDeck.cards.length)]
    }
    /** @returns {CardContainer} */
    battleCards() {
        let cardContainer = {
            /** @type {[Card]} */
            cards: [],
            /** @type {[number]} */
            ids: []
        }
        /** @type {string[]} */
        let state = []
        for (let draw of this.deck.setup.draws) {
            let deck = this.getSubDeck(draw.subDeckId)
            for (let i = 0; i < draw.numberOfCards; i++) {
                let card = this.randomCard(deck)
                let rerolls = this.checkRules(deck, card, state)
                state = rerolls.state
                if (rerolls.rerolls == 0) {
                    cardContainer.cards.push(card)
                    cardContainer.ids.push(deck.id)
                    cardContainer.ids.push(card.number)
                } else {
                    i -= rerolls.rerolls
                    deck.cards = deck.cards.filter(c => c.number != card.number)
                }
            }
        }
        return cardContainer
    }
    /**
     * @param {number[]} ids 
     * @returns {CardContainer}
     */
    loadBattle(ids) {
        /** @type {CardContainer} */
        let cardContainer = {
            ids: ids,
            cards: []
        }
        for (let i = 0; i < ids.length; i += 2) {
            let deckId = ids[i]
            let cardId = ids[i+1]
            let card = this.getSubDeck(deckId).cards.filter(card => card.number == cardId)[0]
            cardContainer.cards.push(card)
        }
        return cardContainer
    }
    /**
     * @param {SubDeck} subDeck
     * @param {Card} card
     * @param {string[]} state
     * @returns {RerollState}
     */
    checkRules(subDeck, card, state) {
        /** @type {RerollState} */
        let rerolls = { rerolls:0, state: state ?? []}
        /** @type {Rule[]} */
        let rules = []
        for (let rule of this.deck.setup.rules) {
            /** @type {Trigger[]} */
            let triggers = []
            for (let trigger of rule.triggers) {
                if (trigger.type == "draw"
                && trigger.target.subDeckId == subDeck.id
                && trigger.target.cardNumber == card.number) {
                    triggers.push(trigger)
                }
                if (trigger.type == "state" && state.filter(state => state == trigger.state).length > 0) {
                    triggers.push(trigger)
                }
            }
            if (triggers.length == rule.triggers.length) { rules.push(rule) }
        }
        for (let rule of rules) {
            for (let application of rule.apply) {
                if (application.type == "state") { rerolls.state.push(application.value) }
                if (application.type == "reroll") { rerolls.rerolls = application.amount }
            }
        }
        return rerolls
    }
}

export default DeckHelper