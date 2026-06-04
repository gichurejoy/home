export interface Transaction {
  id: string;
  customerName: string;
  customerAvatar: string;
  date: string;
  amount: number;
  paymentMethod: string;
  paymentType: "Card" | "Bank" | "PayPal";
  cardBrand?: "Visa" | "Mastercard" | "PayPal";
  cardNumber?: string;
  agentName: string;
  propertyAddress: string;
  status: "Completed" | "Pending" | "Canceled";
}

export const mockTransactions: Transaction[] = [
  {
    id: "TXN-341220",
    customerName: "Ray C. Nichols",
    customerAvatar: "/assets/images/users/avatar-2.jpg",
    date: "05/01/2023",
    amount: 13987,
    paymentMethod: "Mastercard **** 3467 Card Payment",
    paymentType: "Card",
    cardBrand: "Mastercard",
    cardNumber: "**** 3467",
    agentName: "Michael A. Miner",
    propertyAddress: "W. straat 102 DK Deventer",
    status: "Completed"
  },
  {
    id: "TXN-547891",
    customerName: "Barbara A. Woods",
    customerAvatar: "/assets/images/users/avatar-3.jpg",
    date: "14/02/2023",
    amount: 11345,
    paymentMethod: "Visa card **** 4722 Card Payment",
    paymentType: "Card",
    cardBrand: "Visa",
    cardNumber: "**** 4722",
    agentName: "Theresa T. Brose",
    propertyAddress: "Isaac Tirionplein 100",
    status: "Completed"
  },
  {
    id: "TXN-230477",
    customerName: "Robert Mendoza",
    customerAvatar: "/assets/images/users/avatar-4.jpg",
    date: "23/03/2023",
    amount: 16789,
    paymentMethod: "Mastercard **** 7263 Card Payment",
    paymentType: "Card",
    cardBrand: "Mastercard",
    cardNumber: "**** 7263",
    agentName: "Walter L. Calab",
    propertyAddress: "123 Maple St, 456 Oak Ave",
    status: "Canceled"
  },
  {
    id: "TXN-189348",
    customerName: "Rita Correa",
    customerAvatar: "/assets/images/users/avatar-5.jpg",
    date: "11/04/2023",
    amount: 14567,
    paymentMethod: "gailsoneil31@rhyta.com PayPal Payment",
    paymentType: "PayPal",
    cardBrand: "PayPal",
    cardNumber: "gailsoneil31@rhyta.com",
    agentName: "Olive Mize",
    propertyAddress: "3822 DT Amersfoort",
    status: "Pending"
  },
  {
    id: "TXN-765434",
    customerName: "Beatriz McClure",
    customerAvatar: "/assets/images/users/avatar-6.jpg",
    date: "30/05/2023",
    amount: 10234,
    paymentMethod: "Visa card **** 8263 Card Payment",
    paymentType: "Card",
    cardBrand: "Visa",
    cardNumber: "**** 8263",
    agentName: "Christa Sardina",
    propertyAddress: "3822 DT Amersfoort",
    status: "Completed"
  },
  {
    id: "TXN-452103",
    customerName: "Luis P. Brick",
    customerAvatar: "/assets/images/users/avatar-7.jpg",
    date: "19/06/2023",
    amount: 17890,
    paymentMethod: "hughcrobinson@rhyta.com Bank Transfer",
    paymentType: "Bank",
    cardBrand: "PayPal",
    cardNumber: "hughcrobinson@rhyta.com",
    agentName: "Darren Rivera",
    propertyAddress: "3181 BE Rozenburg",
    status: "Pending"
  },
  {
    id: "TXN-986712",
    customerName: "Gary Jimenez",
    customerAvatar: "/assets/images/users/avatar-8.jpg",
    date: "28/07/2023",
    amount: 12453,
    paymentMethod: "Mastercard **** 9200 Card Payment",
    paymentType: "Card",
    cardBrand: "Mastercard",
    cardNumber: "**** 9200",
    agentName: "Robert V. Leavitt",
    propertyAddress: "Julianastraat ZX 7031",
    status: "Completed"
  },
  {
    id: "TXN-324569",
    customerName: "Beatrice Ruiz",
    customerAvatar: "/assets/images/users/avatar-9.jpg",
    date: "07/08/2023",
    amount: 15678,
    paymentMethod: "Visa card **** 8940 Card Payment",
    paymentType: "Card",
    cardBrand: "Visa",
    cardNumber: "**** 8940",
    agentName: "Lydia Anderson",
    propertyAddress: "2561 DB Den Haag",
    status: "Canceled"
  }
];
