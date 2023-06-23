/**
 * @typedef {Object} Card
 * @property {string} file - The file name or path of the card image.
 * @property {number} number - The number or identifier of the card within the deck.
 */

/**
 * @typedef {Object} SubDeck
 * @property {number} id - The unique identifier of the deck.
 * @property {string} title - The title or name of the deck.
 * @property {Card[]} cards - An array of cards associated with the deck.
 */

/**
 * @typedef {Object} Deck
 * @property {string} title - The title or name of the deck.
 * @property {SubDeck[]} decks - An array of deck objects.
 */

/**
 * @typedef {Object} ListDeck
 * @property {number} id - The unique identifier of the deck.
 * @property {string} title - The title or name of the deck.
 * @property {string} file - The file name or path of the deck's JSON file.
 */

/**
 * @typedef {Object} DeckListObj
 * @property {ListDeck[]} decks - An array of deck objects.
 */