import { LightningElement, wire, api, track } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
    @track boats;
    @track draftValues = [];
    selectedBoatId;
    boatTypeId = '';
    isLoading = false;
    columns = [
        { label: 'Name', fieldName: 'Name', editable: true },
        { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
        { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
        { label: 'Description', fieldName: 'Description__c', editable: true }
    ];

    @wire(MessageContext) messageContext;

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats(result) {
        this.boats = result;
        if (result.error) {
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR_TITLE,
                message: result.error.body.message,
                variant: ERROR_VARIANT
            }));
        }
    }

    @api
    searchBoats(boatTypeId) {
        this.notifyLoading(true);
        this.boatTypeId = boatTypeId;
    }

    @api
    async refresh() {
        this.notifyLoading(true);
        await refreshApex(this.boats);
        this.notifyLoading(false);
    }

    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }

    sendMessageService(boatId) {
        publish(this.messageContext, BoatMC, { recordId: boatId });
    }

    handleSave(event) {
        this.notifyLoading(true);
        const recordInputs = event.detail.draftValues.map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises)
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: SUCCESS_TITLE,
                    message: MESSAGE_SHIP_IT,
                    variant: SUCCESS_VARIANT
                }));
                return this.refresh();
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: error.body.message,
                    variant: ERROR_VARIANT
                }));
            })
            .finally(() => {
                this.draftValues = [];
            });
    }

    notifyLoading(isLoading) {
        this.isLoading = isLoading;
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }
}