import { LightningElement, api } from 'lwc';

export default class BoatTile extends LightningElement {
    @api boat;
    @api selectedBoatId;

    get backgroundStyle() {
        return `background-image:url(${this.boat.Picture__c})`;
    }

    get tileClass() {
        return this.selectedBoatId === this.boat.Id ? 'tile-wrapper selected' : 'tile-wrapper';
    }

    selectBoat() {
        this.dispatchEvent(new CustomEvent('boatselect', {
            detail: { boatId: this.boat.Id }
        }));
    }
}