/**
 * @typedef {Object} Card
 * @property {string} file - The file name or path of the card image.
 * @property {number} number - The number or identifier of the card within the deck.
 */

/**
 * @typedef {Object} SubDeck
 * @property {number} id - The unique identifier of the deck.
 * @property {number} row - The row the button of this deck should be on.
 * @property {string} color - The color the button of this deck should be.
 * @property {string} title - The title or name of the deck.
 * @property {Card[]} cards - An array of cards associated with the deck.
 */

/**
 * @typedef {Object} Setup
 * @property {SetupDraws[]} draws - The cards to draw for a setup.
 * @property {Rule[]} rules - An array of rule objects.
 */

/**
 * @typedef {Object} SetupDraws
 * @property {number} subDeckId - The deck to draw from.
 * @property {number} numberOfCards - The number of cards to draw.
 */

/**
 * @typedef {Object} Deck
 * @property {string} title - The title or name of the deck.
 * @property {Setup} setup - The process to draw a battle.
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

/**
 * @typedef {Object} Target
 * @property {number} subDeckId - The sub-deck ID.
 * @property {number} cardNumber - The card number.
 */

/**
 * @typedef {Object} Trigger
 * @property {string} type - The type of the trigger.
 * @property {Target} target - The target of the trigger.
 * @property {string} state - The state needed to trigger the trigger.
 */

/**
 * @typedef {Object} Apply
 * @property {string} type - The type of the apply.
 * @property {string} value - The value of the apply.
 * @property {number} amount - The value of the apply.
 */

/**
 * @typedef {Object} Rule
 * @property {Trigger[]} triggers - An array of trigger objects.
 * @property {Apply[]} apply - An array of apply objects.
 */
