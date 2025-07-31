import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import { reduceErrors } from 'c/ldsUtils';

import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

const COLUMNS = [
    { label: 'First Name', fieldName: FIRSTNAME_FIELD.fieldApiName },
    { label: 'Last Name', fieldName: LASTNAME_FIELD.fieldApiName },
    { label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'email' }
];

export default class ContactList extends LightningElement {
    columns = COLUMNS;
    contacts;
    error;

    @wire(getContacts)
    wiredContacts({ data, error }) {
        if (data) {
            this.contacts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }

    get errors() {
        return this.error ? reduceErrors(this.error) : [];
    }
}
