import { ProductInterface, UserInterface } from'./config';

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validate = (values: ProductInterface) => {
    
    const errors = {
        vendor: '',
        name: '',
        brand: '',
        condition: '',
        images: '',
        categories: '',
        description: '',
        price: '',
        quantity: '',
        continental: '',
        sale_price: ''
    };

    if (!values.vendor) {
        errors.vendor = 'Required';
    } 

    if (!values.name) {
        errors.name = 'Required';
    } 

    if (!values.brand) {
        errors.brand = 'Required';
    } 

    if (!values.condition) {
        errors.condition = 'Required';
    } 

    if (values.images.length === 0) {
        errors.images = 'Required';
    } 

    if (values.categories.length === 0) {
        errors.categories = 'Required';
    } 

    if (Number(values?.price) < Number(values?.sale_price)) {
        errors.sale_price = 'Giá khuyến mại không thể lớn hơn hoặc bằng giá gốc';
    }

    if (!values.description) {
        errors.description = 'Required';
    } 

    if (!values.price || Number(values.price) === 0) {
        errors.price = 'Required';
    } 

    if (!values.quantity || values.quantity.trim().length === 0 || Number(values.quantity) === 0) {
        errors.quantity = 'Required';
    } 

    if (!values.continental) {
        errors.continental = 'Required';
    } 


    return errors;
};

export const userValidate = (values: UserInterface) => {
    const errors = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        rePassword: '',
    };

    
    // console.log(validateEmail(values.email));

    if (!values.firstName) {
        errors.firstName = 'Required';
    } 

    if (!values.lastName) {
        errors.lastName = 'Required';
    } 

    if (!values.email) {
        errors.email = 'Required';
    } 

    if (values.email.length > 0 && validateEmail(values.email) === null) {
        
        errors.email = 'Email không đúng định dạng';
    }

    if (!values.password) {
        errors.password = 'Required';
    } 

    if (values.password.length <= 4) {
        errors.password = 'Mật khẩu tối thiểu 5 kí tự';
    } 

    if (!values.rePassword) {
        errors.rePassword = 'Required';
    } 

    if (values.password !== values.rePassword) {
        errors.rePassword = 'Mật khẩu không trùng khớp';
    } 

    return errors;
}