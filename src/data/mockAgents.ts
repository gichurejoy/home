export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  status: "Active" | "Inactive" | "On Leave";
  rating: number;
  joinDate: string;
  avatar: string;
  address: string;
  experience: string;
  agency: string;
  license: string;
  textNumber: string;
  servicesArea: string;
  listingsCount: number;
  soldCount: number;
  rentCount: number;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
    email: string;
  };
  bio: string;
}

export const agents: Agent[] = [
  {
    id: "AGT-001",
    name: "Michael A. Miner",
    email: "michaelminer@dayrep.com",
    phone: "+787 608-360-0464",
    properties: 243,
    status: "Active",
    rating: 4.8,
    joinDate: "2018-05-21",
    avatar: "/assets/images/users/avatar-2.jpg",
    address: "Lincoln Drive Harrisburg, PA 17101 U.S.A",
    experience: "5 Year",
    agency: "Universo Realtors",
    license: "LC-5758-2048-3944",
    textNumber: "TC-9275-PC-55685",
    servicesArea: "Lincoln Drive Harrisburg",
    listingsCount: 243,
    soldCount: 136,
    rentCount: 107,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me",
      email: "mailto:michaelminer@dayrep.com",
    },
    bio: "Meet Michael, a dedicated and experienced real estate agent who is committed to making your real estate journey smooth and successful. With a passion for helping clients achieve their dreams, Michael brings a wealth of knowledge and expertise to every transaction. Michael has been a prominent figure in the real estate industry for over a decade. His career began with a focus on residential properties, quickly expanding to include commercial real estate and investment properties.",
  },
  {
    id: "AGT-002",
    name: "Theresa T. Brose",
    email: "theresbrosea@dayrep.com",
    phone: "+787 314-832-1736",
    properties: 451,
    status: "Active",
    rating: 4.9,
    joinDate: "2022-04-24",
    avatar: "/assets/images/users/avatar-3.jpg",
    address: "Boulevard Cockeysville TX 75204",
    experience: "2 Year",
    agency: "Universo Realtors",
    license: "LC-8834-1102-4912",
    textNumber: "TC-1105-PC-77893",
    servicesArea: "Boulevard Cockeysville",
    listingsCount: 451,
    soldCount: 250,
    rentCount: 201,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me",
      email: "mailto:theresbrosea@dayrep.com",
    },
    bio: "Theresa T. Brose is a focused real estate professional known for her deep local expertise and personalized customer service. Working in Cockeysville and surrounding neighborhoods, Theresa has helped hundreds of clients navigate home sales and rentals. She strives to build long-term relationships founded on transparency and high-level performance.",
  },
  {
    id: "AGT-003",
    name: "Walter L. Calab",
    email: "walterlcalabre@jourrapide.com",
    phone: "+787 353-847-1958",
    properties: 190,
    status: "Inactive",
    rating: 4.7,
    joinDate: "2020-01-15",
    avatar: "/assets/images/users/avatar-4.jpg",
    address: "Woodside Circle Panama City, FL 32401",
    experience: "4 Year",
    agency: "Universo Realtors",
    license: "LC-2294-0985-1152",
    textNumber: "TC-3382-PC-99120",
    servicesArea: "Panama City Woodside",
    listingsCount: 190,
    soldCount: 105,
    rentCount: 85,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me",
      email: "mailto:walterlcalabre@jourrapide.com",
    },
    bio: "Walter has built a reputation for client satisfaction and dynamic negotiation skills. Specializing in single-family residential properties and luxury estates in Florida, he brings a details-oriented approach to listing marketing and buyer representation.",
  },
  {
    id: "AGT-004",
    name: "Sarah Williams",
    email: "sarah.w@waveron.com",
    phone: "+1 (555) 123-4567",
    properties: 24,
    status: "Active",
    rating: 4.8,
    joinDate: "2021-03-15",
    avatar: "/assets/images/users/avatar-5.jpg",
    address: "Lincoln Drive Harrisburg, PA 17101 U.S.A",
    experience: "3 Year",
    agency: "waveron Agency",
    license: "LC-1904-8834-2938",
    textNumber: "TC-9284-PC-19284",
    servicesArea: "Harrisburg Metro",
    listingsCount: 24,
    soldCount: 15,
    rentCount: 9,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me",
      email: "mailto:sarah.w@waveron.com",
    },
    bio: "Sarah Williams is a senior advisor at waveron Agency. She focuses on premium residential sales, luxury condos, and client representation. Her clients value her professionalism, deep integrity, and knowledge of transaction logistics.",
  },
  {
    id: "AGT-005",
    name: "Michael Chen",
    email: "m.chen@waveron.com",
    phone: "+1 (555) 987-6543",
    properties: 18,
    status: "Active",
    rating: 4.9,
    joinDate: "2020-11-02",
    avatar: "/assets/images/users/avatar-1.jpg",
    address: "Woodside Circle Panama City, FL 32401",
    experience: "6 Year",
    agency: "waveron Agency",
    license: "LC-8849-1092-2938",
    textNumber: "TC-2938-PC-88347",
    servicesArea: "Panama City Metro",
    listingsCount: 18,
    soldCount: 12,
    rentCount: 6,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me",
      email: "mailto:m.chen@waveron.com",
    },
    bio: "Michael Chen combines a commercial business background with residential real estate experience. Specializing in investment portfolios, dual-income properties, and commercial office sales, Michael works diligently to maximize investment return for buyers and sellers.",
  },
  {
    id: "AGT-006",
    name: "Jessica Davis",
    email: "j.davis@waveron.com",
    phone: "+1 (555) 456-7890",
    properties: 12,
    status: "On Leave",
    rating: 4.5,
    joinDate: "2022-01-20",
    avatar: "/assets/images/users/avatar-6.jpg",
    address: "Boulevard Cockeysville TX 75204",
    experience: "1 Year",
    agency: "waveron Agency",
    license: "LC-9938-2938-1928",
    textNumber: "TC-8834-PC-29384",
    servicesArea: "Cockeysville Metro",
    listingsCount: 12,
    soldCount: 8,
    rentCount: 4,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      whatsapp: "https://wa.me",
      email: "mailto:j.davis@waveron.com",
    },
    bio: "Jessica Davis has been working in customer relations and property marketing since joining waveron. While currently on temporary leave, she continues to provide strategic listing support and market study analytics for the team.",
  },
];
