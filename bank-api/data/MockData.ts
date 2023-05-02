import IAuthRequest from "../models/IAuthRequest.js";
import ICurrency from "../models/ICurrency.js"
import IPayment from "../models/IPayment.js";
import IUser from "../models/IUser.js"
export default class MockData {

    static users: IUser[] = [
        {
            "accounts": [
                {
                    "account_id": "115-02812213/0100",
                    "balance": 500.30,
                    "currency": "CZK"
                },
                {
                    "account_id": "115-02812214/0100",
                    "currency": "EUR",
                    "balance": 10
                },
            ],
            "email": "pavel@tul.cz",
            "name": "Pavel Vácha",
            "password": "heslo",
        },
        {
            "accounts": [],
            "email": "frajer@seznam.cz",
            "name": "Fabian Klein",
            "password": "heslo",
        },
        {
            "accounts": [],
            "email": "stepi@jegey.cz",
            "name": "Jakub Stepanek",
            "password": "heslo",
        }


    ];

    static payments: IPayment[] = [
        {
            "amount": 100,
            "currency": "CZK",
            "timestamp": 1681743585915,
            "email": "pavel@tul.cz",
            "type": "IN"
        },
        {
            "amount": 100,
            "currency": "CZK",
            "timestamp": 1681743585915,
            "email": "pavel@tul.cz",
            "type": "OUT"
        }
    ];

    static auth_requests: IAuthRequest[] = [
        { auth_request_id: 'id1', email: 'pavel@tul.cz', attempts_remaining: 3, code: 1583, expires_at: 1681739674058 + 60 + 1000 * 24 },
        { auth_request_id: 'id2', email: 'pavel@tul.cz', attempts_remaining: 3, code: 2582, expires_at: 1681739674058 + 60 + 1000 * 24 },
        { auth_request_id: 'id3', email: 'pavel@tul.cz', attempts_remaining: 3, code: 3581, expires_at: 1681739674058 } // Expired
    ];

    static currencies: ICurrency[] = [
        {
            "country": "Austrálie",
            "full_name": "dolar",
            "amount": 1,
            "name": "AUD",
            "rate": 14.318
        },
        {
            "country": "Brazílie",
            "full_name": "real",
            "amount": 1,
            "name": "BRL",
            "rate": 4.297
        },
        {
            "country": "Bulharsko",
            "full_name": "lev",
            "amount": 1,
            "name": "BGN",
            "rate": 11.936
        },
        {
            "country": "Čína",
            "full_name": "žen-min-pi",
            "amount": 1,
            "name": "CNY",
            "rate": 3.082
        },
        {
            "country": "Dánsko",
            "full_name": "koruna",
            "amount": 1,
            "name": "DKK",
            "rate": 3.133
        },
        {
            "country": "EMU",
            "full_name": "euro",
            "amount": 1,
            "name": "EUR",
            "rate": 25.10
        },
        {
            "country": "Filipíny",
            "full_name": "peso",
            "amount": 100,
            "name": "PHP",
            "rate": 38.189
        },
        {
            "country": "Hongkong",
            "full_name": "dolar",
            "amount": 1,
            "name": "HKD",
            "rate": 2.689
        },
        {
            "country": "Indie",
            "full_name": "rupie",
            "amount": 100,
            "name": "INR",
            "rate": 25.832
        },
        {
            "country": "Indonesie",
            "full_name": "rupie",
            "amount": 1000,
            "name": "IDR",
            "rate": 1.436
        },
        {
            "country": "Island",
            "full_name": "koruna",
            "amount": 100,
            "name": "ISK",
            "rate": 15.595
        },
        {
            "country": "Izrael",
            "full_name": "nový šekel",
            "amount": 1,
            "name": "ILS",
            "rate": 5.773
        },
        {
            "country": "Japonsko",
            "full_name": "jen",
            "amount": 100,
            "name": "JPY",
            "rate": 15.926
        },
        {
            "country": "Jižní Afrika",
            "full_name": "rand",
            "amount": 1,
            "name": "ZAR",
            "rate": 1.171
        },
        {
            "country": "Kanada",
            "full_name": "dolar",
            "amount": 1,
            "name": "CAD",
            "rate": 15.857
        },
        {
            "country": "Korejská republika",
            "full_name": "won",
            "amount": 100,
            "name": "KRW",
            "rate": 1.623
        },
        {
            "country": "Maďarsko",
            "full_name": "forint",
            "amount": 100,
            "name": "HUF",
            "rate": 6.247
        },
        {
            "country": "Malajsie",
            "full_name": "ringgit",
            "amount": 1,
            "name": "MYR",
            "rate": 4.795
        },
        {
            "country": "Mexiko",
            "full_name": "peso",
            "amount": 1,
            "name": "MXN",
            "rate": 1.169
        },
        {
            "country": "MMF",
            "full_name": "ZPČ",
            "amount": 1,
            "name": "XDR",
            "rate": 28.533
        },
        {
            "country": "Norsko",
            "full_name": "koruna",
            "amount": 1,
            "name": "NOK",
            "rate": 2.048
        },
        {
            "country": "Nový Zéland",
            "full_name": "dolar",
            "amount": 1,
            "name": "NZD",
            "rate": 13.277
        },
        {
            "country": "Polsko",
            "full_name": "zlotý",
            "amount": 1,
            "name": "PLN",
            "rate": 5.027
        },
        {
            "country": "Rumunsko",
            "full_name": "leu",
            "amount": 1,
            "name": "RON",
            "rate": 4.724
        },
        {
            "country": "Singapur",
            "full_name": "dolar",
            "amount": 1,
            "name": "SGD",
            "rate": 15.917
        },
        {
            "country": "Švédsko",
            "full_name": "koruna",
            "amount": 1,
            "name": "SEK",
            "rate": 2.057
        },
        {
            "country": "Švýcarsko",
            "full_name": "frank",
            "amount": 1,
            "name": "CHF",
            "rate": 23.748
        },
        {
            "country": "Thajsko",
            "full_name": "baht",
            "amount": 100,
            "name": "THB",
            "rate": 61.932
        },
        {
            "country": "Turecko",
            "full_name": "lira",
            "amount": 1,
            "name": "TRY",
            "rate": 1.09
        },
        {
            "country": "USA",
            "full_name": "dolar",
            "amount": 1,
            "name": "USD",
            "rate": 20.40
        },
        {
            "country": "Velká Británie",
            "full_name": "libra",
            "amount": 1,
            "name": "GBP",
            "rate": 28.00
        }
    ]
}