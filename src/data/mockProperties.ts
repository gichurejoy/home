export interface PropertyOwner {
  name: string;
  avatar: string;
  phone: string;
  email: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  originalPrice?: number;
  type: string;
  status: "For Sale" | "For Rent" | "Sold";
  bedrooms: number;
  bathrooms: number;
  area: number;
  floors: number;
  facilities: string[];
  rating: number;
  description: string;
  owner: PropertyOwner;
  image: string;
  dateAdded: string;
  agentId: string;
}

export const properties: Property[] = [
  {
    id: "PROP-001",
    title: "Dvilla Residences Batu",
    location: "4604, Philli Lane Kiowa",
    price: 8930,
    type: "Residences",
    status: "For Rent",
    bedrooms: 5,
    bathrooms: 4,
    area: 1400,
    floors: 3,
    image: "/assets/images/properties/p-1.jpg",
    rating: 4.5,
    owner: {
      name: "Gaston Lapierre",
      avatar: "/assets/images/users/avatar-1.jpg",
      phone: "+1 (555) 123-4567",
      email: "gaston@lahomes.com",
    },
    facilities: ["Big Swimming pool", "Near Airport", "Big Size Garden", "4 Car Parking", "24/7 Electricity", "Personal Theater"],
    description: "Property refers to any item that an individual or a business holds legal title to. Dvilla Residences Batu offers premium residences with a beautiful garden and pool view.",
    dateAdded: "2024-05-10",
    agentId: "AGT-001"
  },
  {
    id: "PROP-002",
    title: "PIK Villa House",
    location: "127, Boulevard Cockeysville",
    price: 60691,
    type: "Villas",
    status: "Sold",
    bedrooms: 6,
    bathrooms: 5,
    area: 1700,
    floors: 3,
    image: "/assets/images/properties/p-2.jpg",
    rating: 4.8,
    owner: {
      name: "Daavid Nummi",
      avatar: "/assets/images/users/avatar-2.jpg",
      phone: "+1 (555) 987-6543",
      email: "daavid@invest.com",
    },
    facilities: ["4 Car Parking", "Personal Theater", "Spa & Sauna"],
    description: "PIK Villa House is a stunning luxury villa featuring 6 bedrooms, a large pool, and private cinema room.",
    dateAdded: "2024-05-09",
    agentId: "AGT-002"
  },
  {
    id: "PROP-003",
    title: "Tungis Luxury",
    location: "900, Creside WI 54913",
    price: 70245,
    type: "Bungalow",
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 1200,
    floors: 2,
    image: "/assets/images/properties/p-3.jpg",
    rating: 4.2,
    owner: {
      name: "Gaston Lapierre",
      avatar: "/assets/images/users/avatar-1.jpg",
      phone: "+1 (555) 123-4567",
      email: "gaston@lahomes.com",
    },
    facilities: ["Near Airport", "Fitness Club", "Balcony"],
    description: "Beautiful custom bungalow in a prime location. Offers open space, custom fittings, and spacious bedrooms.",
    dateAdded: "2024-05-08",
    agentId: "AGT-001"
  },
  {
    id: "PROP-004",
    title: "Luxury Apartment",
    location: "223, Creside Santa Maria",
    price: 5825,
    type: "Apartment",
    status: "For Rent",
    bedrooms: 2,
    bathrooms: 2,
    area: 900,
    floors: 1,
    image: "/assets/images/properties/p-4.jpg",
    rating: 4.3,
    owner: {
      name: "John Doe",
      avatar: "/assets/images/users/avatar-3.jpg",
      phone: "+1 (555) 345-6789",
      email: "john@lahomes.com",
    },
    facilities: ["Parking", "Restaurant", "Spa"],
    description: "Spacious apartment with luxury modern fittings, high ceilings, and beautiful city views.",
    dateAdded: "2024-05-07",
    agentId: "AGT-001"
  },
  {
    id: "PROP-005",
    title: "Weekend Villa MBH",
    location: "980, Jim Rosa Lane Dublin",
    price: 90674,
    type: "Villas",
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 5,
    area: 1900,
    floors: 2,
    image: "/assets/images/properties/p-5.jpg",
    rating: 4.7,
    owner: {
      name: "Jane Smith",
      avatar: "/assets/images/users/avatar-4.jpg",
      phone: "+1 (555) 234-5678",
      email: "jane@lahomes.com",
    },
    facilities: ["Big Swimming pool", "Big Size Garden", "Personal Theater"],
    description: "The perfect weekend getaway villa. Features lush gardens, a private swimming pool, and high-end security.",
    dateAdded: "2024-05-06",
    agentId: "AGT-003"
  },
  {
    id: "PROP-006",
    title: "Luxury Penthouse",
    location: "Sumner Street Los Angeles",
    price: 10500,
    type: "Penthouse",
    status: "For Rent",
    bedrooms: 7,
    bathrooms: 6,
    area: 2000,
    floors: 1,
    image: "/assets/images/properties/p-6.jpg",
    rating: 4.9,
    owner: {
      name: "Daavid Nummi",
      avatar: "/assets/images/users/avatar-2.jpg",
      phone: "+1 (555) 987-6543",
      email: "daavid@invest.com",
    },
    facilities: ["Pool", "24/7 Electricity", "Fitness Club"],
    description: "Exquisite penthouse offering panoramic views of Los Angeles, private lift access, and state-of-the-art automation.",
    dateAdded: "2024-05-05",
    agentId: "AGT-002"
  },
  {
    id: "PROP-007",
    title: "Ojiag Duplex House",
    location: "24 Hanover, New York",
    price: 75341,
    type: "Duplex Bungalow",
    status: "Sold",
    bedrooms: 3,
    bathrooms: 3,
    area: 1300,
    floors: 2,
    image: "/assets/images/properties/p-7.jpg",
    rating: 4.1,
    owner: {
      name: "Gaston Lapierre",
      avatar: "/assets/images/users/avatar-1.jpg",
      phone: "+1 (555) 123-4567",
      email: "gaston@lahomes.com",
    },
    facilities: ["Parking", "Restaurant", "Balcony"],
    description: "A contemporary duplex in the heart of New York. Sleek design, large windows, and close proximity to public parks.",
    dateAdded: "2024-05-04",
    agentId: "AGT-001"
  },
  {
    id: "PROP-008",
    title: "Luxury Bungalow Villas",
    location: "Khale Florence, SC 219",
    price: 54230,
    type: "Villas",
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 1200,
    floors: 1,
    image: "/assets/images/properties/p-8.jpg",
    rating: 4.4,
    owner: {
      name: "John Doe",
      avatar: "/assets/images/users/avatar-3.jpg",
      phone: "+1 (555) 345-6789",
      email: "john@lahomes.com",
    },
    facilities: ["Spa", "Fitness Club", "Big Swimming pool"],
    description: "Modern bungalow villa with great privacy and premium interior design. Has direct garden access.",
    dateAdded: "2024-05-03",
    agentId: "AGT-001"
  },
  {
    id: "PROP-009",
    title: "Duplex Bungalow",
    location: "25, Willison Street Becker",
    price: 14564,
    type: "Duplex Bungalow",
    status: "For Rent",
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    floors: 3,
    image: "/assets/images/properties/p-9.jpg",
    rating: 4.6,
    owner: {
      name: "Jane Smith",
      avatar: "/assets/images/users/avatar-4.jpg",
      phone: "+1 (555) 234-5678",
      email: "jane@lahomes.com",
    },
    facilities: ["Balcony", "Parking", "Spa"],
    description: "A spacious duplex bungalow with a rooftop balcony, large parking area, and premium spa fittings.",
    dateAdded: "2024-05-02",
    agentId: "AGT-003"
  },
  {
    id: "PROP-010",
    title: "Woodis B. Apartment",
    location: "Bungalow Road Niobrara",
    price: 34341,
    type: "Apartment",
    status: "Sold",
    bedrooms: 4,
    bathrooms: 3,
    area: 1700,
    floors: 6,
    image: "/assets/images/properties/p-10.jpg",
    rating: 4.0,
    owner: {
      name: "Daavid Nummi",
      avatar: "/assets/images/users/avatar-2.jpg",
      phone: "+1 (555) 987-6543",
      email: "daavid@invest.com",
    },
    facilities: ["Fitness Club", "Pool", "24/7 Electricity"],
    description: "Premium apartment located on high floors offering amazing ventilation and city view.",
    dateAdded: "2024-05-01",
    agentId: "AGT-002"
  },
  {
    id: "PROP-011",
    title: "Hayfield Ashton Place",
    location: "1668 Lincoln Drive Harrisburg, PA 17101 U.S.A",
    price: 80675,
    type: "Residences",
    status: "For Sale",
    bedrooms: 5,
    bathrooms: 4,
    area: 1800,
    floors: 3,
    image: "/assets/images/properties/p-11.jpg",
    rating: 4.4,
    owner: {
      name: "Gaston Lapierre",
      avatar: "/assets/images/users/avatar-1.jpg",
      phone: "+1 (555) 123-4567",
      email: "gaston@lahomes.com",
    },
    facilities: ["Big Swimming pool", "Near Airport", "Big Size Garden", "4 Car Parking", "24/7 Electricity", "Personal Theater"],
    description: "Property refers to any item that an individual or a business holds legal title to. This can include tangible items, such as houses, cars, or appliances, as well as intangible items that hold potential future value, such as stock and bond certificates. Legally, property is classified into two categories: personal property and real property.",
    dateAdded: "2024-05-11",
    agentId: "AGT-001"
  }
];
