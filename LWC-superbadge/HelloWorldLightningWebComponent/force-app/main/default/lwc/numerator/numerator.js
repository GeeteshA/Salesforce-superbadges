import { LightningElement, api } from 'lwc';

export default class Numerator extends LightningElement {
    // @api counter = 0;
    _currentCount = 0;
    priorCount = 0;

    @api
    get counter() {
        return this._currentCount;
    }

    set counter(value) {
        this.priorCount = this._currentCount;
        this._currentCount = value;
    }

    handleAdd() {
        this._currentCount += 1;
    }

    handleMultiply(event) {
        const factor = parseInt(event.target.dataset.factor);
        this._currentCount *= factor;
    }

    @api
    maximizeCounter() {
        this._currentCount += 1000000;
    }
}
