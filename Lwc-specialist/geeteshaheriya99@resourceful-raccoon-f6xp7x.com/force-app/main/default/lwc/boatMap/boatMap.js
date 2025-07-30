import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { MessageContext, subscribe, APPLICATION_SCOPE } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const LONGITUDE_FIELD = 'Boat__c.Geolocation__Longitude__s';
const LATITUDE_FIELD = 'Boat__c.Geolocation__Latitude__s';
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];

export default class BoatMap extends LightningElement {
    subscription = null;
    @api boatId;
    error = undefined;
    mapMarkers = [];

    @wire(MessageContext) messageContext;

    @api get recordId() { return this.boatId; }
    set recordId(value) {
        this.boatId = value;
    }

    @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
    wiredRecord({ error, data }) {
        if (data) {
            this.error = undefined;
            const longitude = data.fields.Geolocation__Longitude__s.value;
            const latitude = data.fields.Geolocation__Latitude__s.value;
            this.updateMap(longitude, latitude);
        } else if (error) {
            this.error = error;
            this.mapMarkers = [];
        }
    }

    connectedCallback() {
        if (this.subscription || this.recordId) return;
        this.subscribeMC();
    }

    subscribeMC() {
        this.subscription = subscribe(
            this.messageContext,
            BOATMC,
            (message) => { this.boatId = message.recordId },
            { scope: APPLICATION_SCOPE }
        );
    }

    updateMap(Longitude, Latitude) {
        this.mapMarkers = [{
            location: { Latitude, Longitude },
            title: 'Boat Location'
        }];
    }

    get showMap() {
        return this.mapMarkers.length > 0;
    }
}