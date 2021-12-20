export const config = {
    cargus: {
        authURL: "https://urgentcargus.azure-api.net/api/LoginUser",
        countiesURL: "https://urgentcargus.azure-api.net/api/Counties?countryId=_countryId_",
        localitiesURL: "https://urgentcargus.azure-api.net/api/Localities?countryId=_countryId_&countyId=_countyId_",
        streetsURL: "https://urgentcargus.azure-api.net/api/Streets?localityId=_localityId_",

        // countiesURL: "http://localhost:3000/counties",
        // localitiesURL: "http://localhost:3000/localities",
        // streetsURL: "http://localhost:3000/streets",

        userName: "iurdoris",
        password: "1234",
        subscriptionKey: "94e4d56e42f74c8ebebbe22a9d0dddba",
        defaultCountryId: "1",
        sender: {
            LocationId: 0,
            Name: "IURDORIS COM SRL",
            CountyId: 1,
            CountyName: "Bucuresti",
            LocalityId: 150,
            LocalityName: "BUCURESTI",
            StreetId: 4053,
            StreetName: "Robanesti, Strada",
            BuildingNumber: "40A",
            AddressText: "",
            ContactPerson: "IURDORIS COM SRL",
            PhoneNumber: "0755480654",
            Email: "Dorilin1998@gmail.com",
            CodPostal: "013375",
            PostalCode: "013375",
            CountryId: 1
        }
    },
    smartbill: {
        username: '',
        token: '',
        companyVatCode: 'VAT'
    },
    devMode: false
}