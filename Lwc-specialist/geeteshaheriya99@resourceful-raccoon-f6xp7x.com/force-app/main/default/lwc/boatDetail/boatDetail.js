import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

export default class BoatDetail extends LightningElement {
    boatId;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        subscribe(this.messageContext, BOATMC, (message) => this.handleMessage(message));
    }

    handleMessage(message) {
        this.boatId = message.recordId;
    }
}


