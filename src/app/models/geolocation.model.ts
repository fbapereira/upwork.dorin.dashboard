export interface County {
    CountyId: number,
    Name: string,
    Abbreviation: string
}

export interface Locality {
    LocalityId: number;
    Name: string;
}

export interface Street {
    StreetId: number,
    Name: string,
    PostalNumbers: any[],
}
