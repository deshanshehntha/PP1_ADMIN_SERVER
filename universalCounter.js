class Counter {

    _count = 1;

    constructor() {
        this._count = 1;
    }

    increase() {
        this._count = this._count + 1 ;
    }

    decrease() {
        this._count = this._count - 1 ;
    }

    getValue() {
        return this._count;
    }

}

const instance = new Counter();

module.exports = instance;
