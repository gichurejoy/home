export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // YYYY-MM-DD
  type: 'Showing' | 'Open House' | 'Closing' | 'Follow-up';
  description?: string;
  propertyId?: string;
  propertyName?: string;
  agentId?: string;
  customerId?: string;
}

export interface EntityNote {
  id: string;
  entityId: string; // references propertyId, agentId, or customerId
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  isPinned?: boolean;
}

export interface Review {
  id: string;
  propertyId: string;
  propertyName: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1-5
  comment: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  createdAt: string;
  response?: string;
}

export interface DocumentFile {
  id: string;
  entityId: string; // references propertyId or customerId
  name: string;
  size: string;
  uploadedAt: string;
  category: 'Contract' | 'Disclosure' | 'Image' | 'Blueprint' | 'Other';
  url: string;
}

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: "EVT-001",
    title: "Ojiag Duplex Showing",
    start: "2026-06-16",
    type: "Showing",
    description: "Private tour with buyer Daavid Nummi.",
    propertyId: "PROP-007",
    propertyName: "Ojiag Duplex House",
    agentId: "AGT-001",
    customerId: "CUST-001"
  },
  {
    id: "EVT-002",
    title: "PIK Villa Open House",
    start: "2026-06-20",
    type: "Open House",
    description: "Public open house event. Refreshments provided.",
    propertyId: "PROP-002",
    propertyName: "PIK Villa House",
    agentId: "AGT-001"
  },
  {
    id: "EVT-003",
    title: "Luxury Penthouse Closing",
    start: "2026-06-25",
    type: "Closing",
    description: "Final walkthrough and document signing.",
    propertyId: "PROP-006",
    propertyName: "Luxury Penthouse",
    agentId: "AGT-002",
    customerId: "CUST-002"
  },
  {
    id: "EVT-004",
    title: "Follow-up with Sarah Jenkins",
    start: "2026-06-18",
    type: "Follow-up",
    description: "Discuss contract counter-offer terms.",
    agentId: "AGT-001"
  }
];

export const initialReviews: Review[] = [
  {
    id: "REV-001",
    propertyId: "PROP-001",
    propertyName: "Dvilla Residences Batu",
    customerName: "Sinikka Penttinen",
    customerAvatar: "/assets/images/users/avatar-3.jpg",
    rating: 5,
    comment: "Absolutely stunning property. The process of viewing and finalizing the deal was incredibly smooth thanks to waveron platform.",
    status: "Approved",
    createdAt: "2026-05-14"
  },
  {
    id: "REV-002",
    propertyId: "PROP-007",
    propertyName: "Ojiag Duplex House",
    customerName: "Daavid Nummi",
    customerAvatar: "/assets/images/users/avatar-2.jpg",
    rating: 4,
    comment: "Nice neighborhood and spacious bedrooms. The agent split tracking details made everything highly transparent for the final split splits.",
    status: "Approved",
    createdAt: "2026-05-28"
  },
  {
    id: "REV-003",
    propertyId: "PROP-002",
    propertyName: "PIK Villa House",
    customerName: "Sinikka Penttinen",
    customerAvatar: "/assets/images/users/avatar-3.jpg",
    rating: 3,
    comment: "The house is fine, but the backyard requires serious maintenance work. The platform dashboard was easy to use, however.",
    status: "Pending",
    createdAt: "2026-06-10"
  }
];

export const initialNotes: EntityNote[] = [
  {
    id: "NTE-001",
    entityId: "PROP-001",
    authorName: "Michael A. Miner",
    authorAvatar: "/assets/images/users/avatar-2.jpg",
    content: "Customer asked about neighborhood safety rating. Shared the municipal report details.",
    createdAt: "2026-06-01",
    isPinned: true
  },
  {
    id: "NTE-002",
    entityId: "AGT-001",
    authorName: "Dominic Keller",
    authorAvatar: "/assets/images/users/avatar-1.jpg",
    content: "Outstanding performance this month! Promoted to Senior Agent splits advisor status.",
    createdAt: "2026-06-05",
    isPinned: false
  },
  {
    id: "NTE-003",
    entityId: "CUST-001",
    authorName: "Michael A. Miner",
    authorAvatar: "/assets/images/users/avatar-2.jpg",
    content: "Highly interested in commercial spaces. Send portfolios on 5th Avenue next week.",
    createdAt: "2026-06-12",
    isPinned: false
  }
];

export const initialDocuments: DocumentFile[] = [
  {
    id: "DOC-001",
    entityId: "PROP-001",
    name: "Listing_Agreement_Dvilla.pdf",
    size: "1.2 MB",
    uploadedAt: "2026-05-10",
    category: "Contract",
    url: "#"
  },
  {
    id: "DOC-002",
    entityId: "PROP-001",
    name: "Property_Disclosures.pdf",
    size: "450 KB",
    uploadedAt: "2026-05-11",
    category: "Disclosure",
    url: "#"
  },
  {
    id: "DOC-003",
    entityId: "CUST-001",
    name: "Pre-Approval_Letter_Chase.pdf",
    size: "890 KB",
    uploadedAt: "2026-06-02",
    category: "Contract",
    url: "#"
  }
];
