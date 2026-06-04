export interface Socials {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  email?: string;
}

export interface Preference {
  bedsBaths: string;
  others: string;
}

export interface ShortTransaction {
  id: string;
  name: string;
  email: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
}

export interface DetailedTransaction {
  orderId: string;
  date: string;
  propertyType: string;
  address: string;
  amount: number;
  status: "Paid" | "Pending" | "Unpaid";
  agentName: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "Available" | "Unavailable";
  listStatus: "Interested" | "Under Review" | "Follow-up";
  propertyType: string;
  interestedProperties: string[];
  avatar: string;
  viewPropertiesCount: number;
  ownPropertiesCount: number;
  investOnProperty: number;
  socials: Socials;
  preferences: Preference;
  activePropertiesCount: number;
  transactions: ShortTransaction[];
  transactionHistory: DetailedTransaction[];
}

export const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "Daavid Nummi",
    email: "daavidnumminen@teleworm.us",
    phone: "+231 06-75820711",
    location: "Schoolstraat 161 5151 HH Drunen",
    status: "Available",
    listStatus: "Interested",
    propertyType: "Residential",
    interestedProperties: ["123 Maple St", "456 Oak Ave"],
    avatar: "/assets/images/users/avatar-2.jpg",
    viewPropertiesCount: 231,
    ownPropertiesCount: 27,
    investOnProperty: 928128,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://whatsapp.com",
      email: "daavidnumminen@teleworm.us"
    },
    preferences: {
      bedsBaths: "3-4 bedrooms, 2-3 bathrooms",
      others: "Close to public transportation, good school district, backyard, modern kitchen"
    },
    activePropertiesCount: 350,
    transactions: [
      {
        id: "TXN-341220",
        name: "Michael A. Miner",
        email: "michaelminer@dayrep.com",
        amount: 13987,
        status: "Success"
      },
      {
        id: "TXN-836451",
        name: "Theresa T. Brose",
        email: "theresbrosea@dayrep.com",
        amount: 2710,
        status: "Success"
      }
    ],
    transactionHistory: [
      {
        orderId: "ORD-75234",
        date: "15/03/2023",
        propertyType: "Residential",
        address: "123 Maple St, 456 Oak Ave",
        amount: 928128,
        status: "Paid",
        agentName: "Michael A. Miner"
      },
      {
        orderId: "ORD-54222",
        date: "20/03/2023",
        propertyType: "Commercial",
        address: "789 Pine Blvd",
        amount: 84091,
        status: "Paid",
        agentName: "Michael A. Miner"
      },
      {
        orderId: "ORD-63111",
        date: "25/03/2023",
        propertyType: "Residential",
        address: "101 Birch Ct, 202 Cedar Ln",
        amount: 83120,
        status: "Paid",
        agentName: "Michael A. Miner"
      },
      {
        orderId: "ORD-84623",
        date: "05/04/2023",
        propertyType: "Residential",
        address: "303 Elm St",
        amount: 65900,
        status: "Paid",
        agentName: "Theresa T. Brose"
      }
    ]
  },
  {
    id: "CUST-002",
    name: "Sinikka Penttinen",
    email: "sinikkapenttinen@dayrep.com",
    phone: "+231 47-23456789",
    location: "Jean Racinelaan 48 5629 PK Eindhoven",
    status: "Available",
    listStatus: "Under Review",
    propertyType: "Commercial",
    interestedProperties: ["789 Pine Blvd"],
    avatar: "/assets/images/users/avatar-3.jpg",
    viewPropertiesCount: 134,
    ownPropertiesCount: 13,
    investOnProperty: 435892,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://whatsapp.com",
      email: "sinikkapenttinen@dayrep.com"
    },
    preferences: {
      bedsBaths: "4+ bedrooms, 3+ bathrooms",
      others: "Commercial zoning, ample parking space, high pedestrian traffic, modern facades"
    },
    activePropertiesCount: 210,
    transactions: [
      {
        id: "TXN-845112",
        name: "Theresa T. Brose",
        email: "theresbrosea@dayrep.com",
        amount: 8400,
        status: "Success"
      }
    ],
    transactionHistory: [
      {
        orderId: "ORD-94812",
        date: "12/02/2023",
        propertyType: "Commercial",
        address: "789 Pine Blvd",
        amount: 435892,
        status: "Paid",
        agentName: "Theresa T. Brose"
      }
    ]
  },
  {
    id: "CUST-003",
    name: "Jere Palmu",
    email: "jerepalmu@rhyta.com",
    phone: "+231 73-34567890",
    location: "Huvilakatu 24, 00150 Helsinki",
    status: "Available",
    listStatus: "Follow-up",
    propertyType: "Residential",
    interestedProperties: ["101 Birch Ct", "202 Cedar Ln"],
    avatar: "/assets/images/users/avatar-4.jpg",
    viewPropertiesCount: 45,
    ownPropertiesCount: 2,
    investOnProperty: 83120,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://whatsapp.com",
      email: "jerepalmu@rhyta.com"
    },
    preferences: {
      bedsBaths: "2 bedrooms, 1-2 bathrooms",
      others: "Quiet neighborhood, balcony, central heating, energy-efficient appliances"
    },
    activePropertiesCount: 40,
    transactions: [],
    transactionHistory: [
      {
        orderId: "ORD-34821",
        date: "25/03/2023",
        propertyType: "Residential",
        address: "101 Birch Ct",
        amount: 83120,
        status: "Paid",
        agentName: "Michael A. Miner"
      }
    ]
  },
  {
    id: "CUST-004",
    name: "Ulla Nuorela",
    email: "ullanuorela@rhyta.com",
    phone: "+231 45-45678901",
    location: "Pajutie 12, 90100 Oulu",
    status: "Available",
    listStatus: "Interested",
    propertyType: "Residential",
    interestedProperties: ["303 Elm St"],
    avatar: "/assets/images/users/avatar-5.jpg",
    viewPropertiesCount: 88,
    ownPropertiesCount: 5,
    investOnProperty: 65900,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://whatsapp.com",
      email: "ullanuorela@rhyta.com"
    },
    preferences: {
      bedsBaths: "3 bedrooms, 2 bathrooms",
      others: "Garage, close to school, garden area, wooden flooring"
    },
    activePropertiesCount: 120,
    transactions: [],
    transactionHistory: [
      {
        orderId: "ORD-84623",
        date: "05/04/2023",
        propertyType: "Residential",
        address: "303 Elm St",
        amount: 65900,
        status: "Paid",
        agentName: "Theresa T. Brose"
      }
    ]
  },
  {
    id: "CUST-005",
    name: "Tiia Karppinen",
    email: "tiiakarppinen@teleworm.us",
    phone: "+231 16-56789012",
    location: "Rantakatu 8, 33100 Tampere",
    status: "Unavailable",
    listStatus: "Follow-up",
    propertyType: "Industrial",
    interestedProperties: ["404 Walnut Rd"],
    avatar: "/assets/images/users/avatar-6.jpg",
    viewPropertiesCount: 72,
    ownPropertiesCount: 3,
    investOnProperty: 154000,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      email: "tiiakarppinen@teleworm.us"
    },
    preferences: {
      bedsBaths: "Warehouse/Industrial site",
      others: "High ceiling heights, loading docks, proximity to highways, heavy power support"
    },
    activePropertiesCount: 15,
    transactions: [],
    transactionHistory: []
  },
  {
    id: "CUST-006",
    name: "Harland R. Orsini",
    email: "harlandrorsini@dayrep.com",
    phone: "+231 82-67890123",
    location: "145 Pine St, Seattle, WA",
    status: "Available",
    listStatus: "Interested",
    propertyType: "Residential",
    interestedProperties: ["505 Spruce St"],
    avatar: "/assets/images/users/avatar-7.jpg",
    viewPropertiesCount: 198,
    ownPropertiesCount: 18,
    investOnProperty: 712000,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://whatsapp.com",
      email: "harlandrorsini@dayrep.com"
    },
    preferences: {
      bedsBaths: "5+ bedrooms, 4+ bathrooms",
      others: "Ocean views, luxury pool, home theater, smart home systems"
    },
    activePropertiesCount: 220,
    transactions: [],
    transactionHistory: []
  },
  {
    id: "CUST-007",
    name: "David Padgett",
    email: "davidpadgett@armyspy.com",
    phone: "+231 92-78901234",
    location: "88 Oak Ave, Boston, MA",
    status: "Available",
    listStatus: "Under Review",
    propertyType: "Commercial",
    interestedProperties: ["606 Fir Ave"],
    avatar: "/assets/images/users/avatar-8.jpg",
    viewPropertiesCount: 110,
    ownPropertiesCount: 8,
    investOnProperty: 320400,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      email: "davidpadgett@armyspy.com"
    },
    preferences: {
      bedsBaths: "Retail outlet store",
      others: "Storefront windows, central location, basement storage, high-density residential area nearby"
    },
    activePropertiesCount: 95,
    transactions: [],
    transactionHistory: []
  },
  {
    id: "CUST-008",
    name: "Valerie Obrien",
    email: "valerieobrien@dayrep.com",
    phone: "+231 82-89012345",
    location: "304 Birch Ln, Denver, CO",
    status: "Unavailable",
    listStatus: "Interested",
    propertyType: "Residential",
    interestedProperties: ["808 Willow Dr", "909 Aspen Ln"],
    avatar: "/assets/images/users/avatar-9.jpg",
    viewPropertiesCount: 94,
    ownPropertiesCount: 4,
    investOnProperty: 190000,
    socials: {
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://whatsapp.com",
      email: "valerieobrien@dayrep.com"
    },
    preferences: {
      bedsBaths: "3 bedrooms, 2.5 bathrooms",
      others: "Mountain views, solar panels, open floor plan, fireplace"
    },
    activePropertiesCount: 65,
    transactions: [],
    transactionHistory: []
  }
];
