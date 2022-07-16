export interface ProductInterface {
    vendor: string,
    name: string,
    brand: string,
    condition: string,
    images: any[],
    categories: any[],
    description: string,
    price: string,
    quantity: string,
    continental: number,
    sale_price: string
}

export interface UserInterface {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    rePassword: string,
}