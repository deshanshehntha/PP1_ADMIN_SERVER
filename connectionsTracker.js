class ConnectionTracker {

    _data = [];

    constructor() {
        this._data = [];
    }

    add(obj) {
        this._data.push(obj);
    }

    updateList(data) {
        this._data = data;
    }

    getAll() {
        // return this._data.find(d => d.id === id);
        return this._data;
    }

    remove(mainConnectionURL) {
        this._data = this._data.filter(function (obj) {
            return obj.mainConnectionURL !== mainConnectionURL;
        });
        console.log("deleted" + this._data)

    }

    getLength() {
        return this._data.length;
    }
}

const instance = new ConnectionTracker();

module.exports = instance;
