
export interface Sender {
    LocationId: number;
    Name: string;
    CountyId: number;
    CountyName: string;
    LocalityId: number;
    LocalityName: string;
    StreetId: number;
    StreetName: string;
    BuildingNumber: string;
    AddressText: string;
    ContactPerson: string;
    PhoneNumber: string;
    Email: string;
    CodPostal: string;
    PostalCode: string;
    CountryId: number;
}

export interface Recipient {
    LocationId?: number;
    Name?: string;
    CountyId?: number;
    CountyName?: string;
    LocalityId?: number;
    LocalityName?: string;
    StreetId?: number;
    StreetName?: string;
    BuildingNumber?: string;
    AddressText?: string;
    ContactPerson?: string;
    PhoneNumber?: string;
    Email?: string;
    CodPostal?: string;
    PostalCode?: string;
    CountryId?: number;
}

export interface Shipment {
    Sender: Sender;
    Recipient?: Recipient;
    Parcels: number;
    Envelopes: number;
    TotalWeight: number;
    ShipmentPayer: number;
}

