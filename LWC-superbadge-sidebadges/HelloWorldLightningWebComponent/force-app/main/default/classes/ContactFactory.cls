public with sharing class ContactFactory {
    
    public static List<Contact> fetchContacts() {
        return [
            SELECT FirstName, LastName, Email
            FROM Contact
            LIMIT 100
        ];
    }
}
