import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

export default class BoatReviews extends NavigationMixin(LightningElement) {
    boatId;
    error;
    @track boatReviews;
    isLoading;

    @api
    get recordId() { return this.boatId; }
    set recordId(value) {
        this.boatId = value;
        this.getReviews();
    }

    get reviewsToShow() {
        return this.boatReviews && this.boatReviews.length > 0;
    }

    @api
    refresh() {
        this.getReviews();
    }

    getReviews() {
        if (!this.boatId) return;
        this.isLoading = true;
        getAllReviews({ boatId: this.boatId })
            .then(result => {
                this.boatReviews = result;
            })
            .catch(error => {
                this.error = error;
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    navigateToRecord(event) {
        event.preventDefault();
        const userId = event.target.dataset.recordId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: userId,
                objectApiName: 'User',
                actionName: 'view'
            }
        });
    }
}