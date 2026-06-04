export interface Order {
  id: string;
  name: string;
  avatar: string;
  date: string;
  phone: string;
  propertyType: string;
  amount: number;
  properties: string;
  status: "Paid" | "Pending" | "Unpaid";
}

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    name: "Daavid Nummi",
    avatar: "/assets/images/users/avatar-2.jpg",
    date: "02/01/2023",
    phone: "+231 06-75820711",
    propertyType: "Residential",
    amount: 2890123,
    properties: "123 Maple St, 456 Oak Ave",
    status: "Paid"
  },
  {
    id: "ORD-002",
    name: "Sinikka Penttinen",
    avatar: "/assets/images/users/avatar-3.jpg",
    date: "10/02/2023",
    phone: "+231 47-23456789",
    propertyType: "Commercial",
    amount: 2678901,
    properties: "789 Pine Blvd",
    status: "Paid"
  },
  {
    id: "ORD-003",
    name: "Jere Palmu",
    avatar: "/assets/images/users/avatar-4.jpg",
    date: "18/03/2023",
    phone: "+231 73-34567890",
    propertyType: "Residential",
    amount: 4123456,
    properties: "101 Birch Ct, 202 Cedar Ln",
    status: "Unpaid"
  },
  {
    id: "ORD-004",
    name: "Ulla Nuorela",
    avatar: "/assets/images/users/avatar-5.jpg",
    date: "25/04/2023",
    phone: "+231 45-45678901",
    propertyType: "Residential",
    amount: 3456789,
    properties: "303 Elm St",
    status: "Paid"
  },
  {
    id: "ORD-005",
    name: "Tiia Karppinen",
    avatar: "/assets/images/users/avatar-6.jpg",
    date: "12/04/2023",
    phone: "+231 16-56789012",
    propertyType: "Industrial",
    amount: 2789012,
    properties: "404 Walnut Rd",
    status: "Unpaid"
  },
  {
    id: "ORD-006",
    name: "Harland R. Orsini",
    avatar: "/assets/images/users/avatar-7.jpg",
    date: "01/05/2023",
    phone: "+231 82-67890123",
    propertyType: "Residential",
    amount: 2456789,
    properties: "505 Spruce St",
    status: "Unpaid"
  },
  {
    id: "ORD-007",
    name: "David Padgett",
    avatar: "/assets/images/users/avatar-8.jpg",
    date: "15/06/2023",
    phone: "+231 92-78901234",
    propertyType: "Commercial",
    amount: 1567890,
    properties: "606 Fir Ave",
    status: "Paid"
  },
  {
    id: "ORD-008",
    name: "Valerie Obrien",
    avatar: "/assets/images/users/avatar-9.jpg",
    date: "22/07/2023",
    phone: "+231 82-89012345",
    propertyType: "Residential",
    amount: 1234567,
    properties: "808 Willow Dr, 909 Aspen Ln",
    status: "Pending"
  },
  {
    id: "ORD-009",
    name: "Adriana G. Faust",
    avatar: "/assets/images/users/avatar-10.jpg",
    date: "29/10/2023",
    phone: "+231 54-4775764",
    propertyType: "Apartment",
    amount: 1502331,
    properties: "1190 Barlow Street Mokopane",
    status: "Pending"
  }
];
