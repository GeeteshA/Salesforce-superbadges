import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { MessageContext, subscribe, unsubscribe, APPLICATION_SCOPE } from 'lightning/messageService';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import BOAT_MESSAGE_CHANNEL from '@salesforce/messageChannel/BoatMessageChannel__c';

// Custom Labels Imports
import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';

// Boat Schema Imports
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
const BOAT_FIELDS = [BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
    @api boatId;
    
    @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
    wiredRecord;

    @wire(MessageContext)
    messageContext;

    // Labels for internationalization
    @api label = {
        labelDetails,
        labelReviews,
        labelAddReview,
        labelFullDetails,
        labelPleaseSelectABoat
    };

    subscription = null;

    // Lifecycle hook when component is connected to the DOM
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    // Lifecycle hook when component is disconnected from the DOM
    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }

    // Subscribe to the message channel
    subscribeToMessageChannel() {
        if (!this.subscription && this.messageContext) {
            this.subscription = subscribe(
                this.messageContext,
                BOAT_MESSAGE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    // Unsubscribe from the message channel
    unsubscribeFromMessageChannel() {
        if (this.subscription) {
            unsubscribe(this.subscription);
            this.subscription = null;
        }
    }

    // Handle incoming messages
    handleMessage(message) {
        this.boatId = message.recordId;
    }

    // Getter for boat name
    get boatName() {
        return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
    }

    // Getter for details tab icon
    get detailsTabIconName() {
        return this.wiredRecord.data ? 'utility:anchor' : null;
    }

    // Navigate to full record view page
    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.boatId,
                objectApiName: 'Boat__c',
                actionName: 'view'
            }
        });
    }

    // Handle review creation event
    handleReviewCreated() {
        const tabset = this.template.querySelector('lightning-tabset');
        const reviewsComponent = this.template.querySelector('c-boat-reviews');
        
        if (tabset) {
            tabset.activeTabValue = 'reviews';
        }
        
        if (reviewsComponent && typeof reviewsComponent.refresh === 'function') {
            reviewsComponent.refresh();
        }
    }
}