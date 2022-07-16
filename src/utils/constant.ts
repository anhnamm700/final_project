export const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const APIHost = development ? '/api' : 'https://google.com';

export const ACCESS_TOKEN_KEY = 'token';

export const stocksStatus = {
    type: 'stock',
    data: [
        { name: 'Any stock status', id: 'all' },
        { name: 'In stock', id: 'in' },
        { name: 'Low stock', id: 'low' },
        { name: 'SOLD', id: 'out' },
    ]
};

export const availabilityStatus = {
    type: 'availability',
    data: [
        { name: 'Any availablety status', id: 'all' },
        { name: 'Only enabled', id: '1' },
        { name: 'Only disabled', id: '0' },
    ]
};

export const pagesNumber = [10, 25, 50, 75, 100];

export const currency = [
    { label: '$', value: '$' },
    { label: '%', value: '%' },
];

export const marketing = {
    type: 'marketing',
    data: [
        { id: 0, name: "Autogerated" },
        { id: 1, name: "Custom" },
    ]
}; 

export const searchIn = [
    { title: 'Name', value: 'name' },
    { title: 'SKU', value: 'sku' },
    { title: 'Full Descriptio', value: 'description' }
];

export const membership = {
    memberships: [{ type: 'Membership', title: 'Gerneral', value: 'M_4' }],
    pendingMemberships: [{ type: 'Pending Membership', title: 'Gerneral', value: 'P_4' }]
};

export const userStatus = {
    type: "user status",
    data: [
        { name: 'Any Status', id: '0' },
        { name: 'Enabled', id: 'E' },
        { name: 'Disabled', id: 'D' },
        { name: 'Unapproved Vendor', id: 'U' }
    ]
}

export const userActivity = [
    { name: "Register", id: "R" },
    { name: "Last Logged In", id: "L" },
];

export const arrange = [
    { name: 'ASC', id: 'ASC' },
    { name: 'DESC', id: 'DESC' }
];

export const memberShipUser = [
    { name: 'Ignore Membership', id: 'null' },
    { name: 'Gernaral', id: '4' }
];

export const typeAcc = {
    type: "user type",
    data: [
        { name: 'Individual', id: 'individual' },
        { name: 'Business', id: 'business' },
    ]
};

export const permissionAcc = {
    type: "permission",
    data: [
        { name: 'Vendor', id: '10' },
        { name: 'Admin', id: '100' },
    ]
}