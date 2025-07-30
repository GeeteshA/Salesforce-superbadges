import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import fivestar from '@salesforce/resourceUrl/fivestar';

const ERROR_TITLE = 'Error loading five-star';
const ERROR_VARIANT = 'error';
const EDITABLE_CLASS = 'c-rating';
const READ_ONLY_CLASS = 'readonly c-rating';

export default class FiveStarRating extends LightningElement {
    @api readOnly;
    @api value;
    editedValue;
    isRendered;

    get starClass() {
        return this.readOnly ? READ_ONLY_CLASS : EDITABLE_CLASS;
    }

    renderedCallback() {
        if (this.isRendered) return;
        this.loadScript();
        this.isRendered = true;
    }

    loadScript() {
        Promise.all([
            loadStyle(this, fivestar + '/rating.css'),
            loadScript(this, fivestar + '/rating.js')
        ]).then(() => {
            this.initializeRating();
        }).catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.message,
                variant: ERROR_VARIANT
            }));
        });
    }

    initializeRating() {
        let domEl = this.template.querySelector('ul');
        let maxRating = 5;
        let callback = (rating) => {
            this.editedValue = rating;
            this.ratingChanged(rating);
        };
        this.ratingObj = window.rating(
            domEl,
            this.value,
            maxRating,
            callback,
            this.readOnly
        );
    }

    ratingChanged(rating) {
        this.dispatchEvent(new CustomEvent('ratingchange', {
            detail: { rating }
        }));
    }
}