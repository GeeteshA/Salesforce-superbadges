import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement {
    @api boatTypeId;
    mapMarkers = [];
    isLoading = true;
    latitude;
    longitude;

    @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
    wiredBoatsJSON({ error, data }) {
        if (data) {
            this.createMapMarkers(JSON.parse(data));
        } else if (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR_TITLE,
                message: error.message,
                variant: ERROR_VARIANT
            }));
        }
        this.isLoading = false;
    }

    renderedCallback() {
        if (!this.latitude) {
            this.getLocationFromBrowser();
        }
    }

    getLocationFromBrowser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                },
                () => {
                    this.dispatchEvent(new ShowToastEvent({
                        title: ERROR_TITLE,
                        message: 'Geolocation not supported or permission denied',
                        variant: ERROR_VARIANT
                    }));
                }
            );
        }
    }

    createMapMarkers(boatData) {
        this.mapMarkers = boatData.map(boat => ({
            location: {
                Latitude: boat.Geolocation__Latitude__s,
                Longitude: boat.Geolocation__Longitude__s
            },
            title: boat.Name
        }));
        this.mapMarkers.unshift({
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude
            },
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER
        });
    }
}