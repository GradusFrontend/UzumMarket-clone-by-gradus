export type userType = {
    [created_at:string]: string,
    updated_at: string,
    name: string,
    surname: string,
    email: string,
    password: string
}

export type Reload = {
    arr: Array<Product>
    place: HTMLDivElement
}

export type Product = {
    "id": number,
    "title": string,
    "description": string,
    "colors": Array<string>,
    "rating": number,
    "price": number,
    "isBlackFriday": boolean,
    "salePercentage": number,
    "media": Array<string>,
    "type": string
}