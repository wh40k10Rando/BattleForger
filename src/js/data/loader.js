import URLParam from "../urlParam.js"

class Loader {
    /** @type {string} */
    path = '/data/'
    /** @param {string} [path] */
    constructor(path) {
        if (path) { this.path = path }
        let params = new URLParam()
        this.path = `${params.pathStart}${this.path}`
    }
    /**
     * @param {string} file
     * @returns {object} 
     */
    async load(file) {
        return new Promise((resolve, reject) => {
            const path = `${this.path}${file}`
            $.getJSON(path, (data) => {
                resolve(data)
            }).fail(( jqxhr, textStatus, error ) => {
                reject([jqxhr, textStatus, error])
            })
        })
    }
}

export default Loader