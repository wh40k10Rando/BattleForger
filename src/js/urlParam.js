class URLParam {
    /** @type {URL} */
    url
    /** @type {URL} */
    lastURL

    constructor() {
        this.url = new URL(window.location.href)
        this.lastURL = this.url.toString()
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

    update() {
        // if (this.url.toString() == this.lastURL.toString()) { return }
        // this.lastURL = this.url.toString()
        window.location.href = this.url.toString()
    }
}

export default URLParam