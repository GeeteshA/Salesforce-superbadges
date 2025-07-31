public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        try {
            return ContactFactory.fetchContacts();
        } catch (Exception e) {
            throw new AuraHandledException('Unable to retrieve contacts: ' + e.getMessage());
        }
    }
}
