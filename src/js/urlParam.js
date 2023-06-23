class URLParam {
    /** @type {URL} */
    url
    /** @type {URL} */
    lastURL

    constructor() {
        this.url = new URL(window.location.href)
        this.lastURL = this.url.toString()
    }

    /** @type {string} */
    get path() {
        return this.url.pathname
    }
    get pathStart() {
        if (this.path.length == 0) { return '' }
        return this.path.substring(0, this.path.length-1)
    }

    /** @returns {number} */
    get deck() {
        return this.url.searchParams.get("d")
    }
    /** @property {number} */
    set deck(value) {
        this.url.searchParams.set("d", value)
    }
    /** @returns {number} */
    get subDeck() {
        return this.url.searchParams.get("s")
    }
    /** @property {number} */
    set subDeck(value) {
        this.url.searchParams.set("s", value)
    }
    clearSubDeck() { this.url.searchParams.delete("s") }
    /** @returns {number} */
    get options() {
        return this.url.searchParams.get("o")
    }
    /** @property {number} */
    set options(value) {
        this.url.searchParams.set("o", value)
    }
    clearOptions() { this.url.searchParams.delete("o") }
    /** @returns {number} */
    get card() {
        return this.url.searchParams.get("c")
    }
    /** @property {number} */
    set card(value) {
        this.url.searchParams.set("c", value)
    }
    clearCard() { this.url.searchParams.delete("c") }
    /** @returns {[number]} */
    get battle() {
        let val = this.url.searchParams.get("b")
        if (val == null) { return null }
        return val.split(",")
    }
    /** @param {[string]} value */
    set battle(value) {
        this.url.searchParams.set("b", value)
    }
    clearBattle() { this.url.searchParams.delete("b") }

    update() {
        window.location.href = this.url.toString()
    }
    replace() {
        window.history.replaceState({}, "", this.url.toString())
    }
}

export default URLParam