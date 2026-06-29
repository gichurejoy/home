export interface EmailAttachment {
  name: string;
  size: string;
  type: string;
}

export interface Email {
  id: string;
  senderName: string;
  senderEmail: string;
  senderAvatar: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  folder: "inbox" | "sent" | "drafts" | "trash" | "starred" | "important";
  labels: ("Personal" | "Work" | "Update" | "Social")[];
  attachments?: EmailAttachment[];
}

export const mockEmails: Email[] = [
  {
    id: "email-1",
    senderName: "Oberto Onio",
    senderEmail: "obertoonio@dayrep.com",
    senderAvatar: "/assets/images/users/avatar-2.jpg",
    subject: "Meeting regarding new property contract approvals",
    preview: "Hi Gaston, I would like to schedule a quick meeting tomorrow at 10 AM to discuss...",
    body: "Hi Gaston,\n\nI hope you're having a productive week. I would like to schedule a quick meeting tomorrow morning at 10:00 AM regarding the new property contract approvals for our residential listing portfolio.\n\nPlease let me know if this time works for you, or if we should reschedule for later in the afternoon.\n\nBest regards,\nOberto Onio\nReal Estate Acquisition Lead",
    date: "Jun 2, 2026",
    time: "09:24 AM",
    isRead: false,
    isStarred: true,
    isImportant: true,
    folder: "inbox",
    labels: ["Work"],
    attachments: [
      { name: "contract_draft_v2.pdf", size: "2.4 MB", type: "pdf" },
      { name: "portfolio_summary.xlsx", size: "1.8 MB", type: "excel" }
    ]
  },
  {
    id: "email-2",
    senderName: "Dianna Blair",
    senderEmail: "diannablair46skl@dayrep.com",
    senderAvatar: "/assets/images/users/avatar-3.jpg",
    subject: "Photos of Pinewood Estates and Garden",
    preview: "Here are the photos of the Pinewood Estates and the surrounding garden area you requested...",
    body: "Hi Gaston,\n\nAs promised, here are the high-resolution photos of the Pinewood Estates property and the garden grounds. Let me know if you need any other assets for the listing database.\n\nThanks,\nDianna Blair",
    date: "Jun 1, 2026",
    time: "03:45 PM",
    isRead: true,
    isStarred: false,
    isImportant: false,
    folder: "inbox",
    labels: ["Personal", "Update"],
    attachments: [
      { name: "estate_front.jpg", size: "4.5 MB", type: "image" },
      { name: "garden_pool.jpg", size: "3.2 MB", type: "image" },
      { name: "backyard_patio.jpg", size: "5.1 MB", type: "image" },
      { name: "living_room.jpg", size: "4.8 MB", type: "image" }
    ]
  },
  {
    id: "email-3",
    senderName: "Dirk Kuhn",
    senderEmail: "dirkkuhn@teleworm.us",
    senderAvatar: "/assets/images/users/avatar-4.jpg",
    subject: "Inquiry on Commercial Property Listings",
    preview: "Dear Gaston, we have a corporate client interested in purchasing industrial or commercial...",
    body: "Dear Gaston,\n\nWe have a corporate client currently searching for industrial warehouse spaces or office buildings in the central business district. They have an active budget of up to $5M.\n\nCould you please send over any matching properties from the waveron inventory?\n\nSincerely,\nDirk Kuhn\nBroker",
    date: "May 31, 2026",
    time: "11:15 AM",
    isRead: true,
    isStarred: true,
    isImportant: true,
    folder: "inbox",
    labels: ["Work"],
    attachments: [
      { name: "client_specifications.docx", size: "512 KB", type: "word" }
    ]
  },
  {
    id: "email-4",
    senderName: "Sandra Fischer",
    senderEmail: "sandrafischer@rhyta.com",
    senderAvatar: "/assets/images/users/avatar-5.jpg",
    subject: "Updates to Agent Commission Plans",
    preview: "Hello Team, we have modified the commission plans for the upcoming quarter. Please review...",
    body: "Hello Team,\n\nPlease find attached the updated commission structures and payout details for the next financial quarter. Note the revisions on tier-3 residential listings.\n\nBest,\nSandra Fischer\nFinance Director",
    date: "May 30, 2026",
    time: "08:30 AM",
    isRead: true,
    isStarred: false,
    isImportant: false,
    folder: "inbox",
    labels: ["Update"]
  },
  {
    id: "email-5",
    senderName: "Marina Eberhardt",
    senderEmail: "marinaeberhardt@teleworm.us",
    senderAvatar: "/assets/images/users/avatar-6.jpg",
    subject: "Social Committee - Next Weekend Outing",
    preview: "Hi everyone, the social committee is planning a weekend hike next Saturday at Pine Ridge...",
    body: "Hi everyone,\n\nWe are organizing a team hike next Saturday at Pine Ridge trail. We will meet at the park entrance at 9:00 AM. Refreshments and snacks will be provided.\n\nPlease RSVP by Thursday so we can finalize counts!\n\nCheers,\nMarina",
    date: "May 29, 2026",
    time: "04:50 PM",
    isRead: true,
    isStarred: false,
    isImportant: false,
    folder: "inbox",
    labels: ["Social"]
  },
  {
    id: "email-6",
    senderName: "Erik Holzman",
    senderEmail: "erikholzman@dayrep.com",
    senderAvatar: "/assets/images/users/avatar-7.jpg",
    subject: "Draft listing copy for Broadview Apartment penthouse",
    preview: "Gaston, here is the draft description text for the penthouse. Let me know what you think...",
    body: "Gaston,\n\nCheck out the draft copy for the penthouse listing:\n'Stunning 3-bedroom luxury penthouse overlooking the skyline. Fully renovated kitchen, smart climate control, and massive private terrace.'\n\nLet me know if we need to tweak any wording before publishing.\n\nErik",
    date: "May 28, 2026",
    time: "01:20 PM",
    isRead: true,
    isStarred: false,
    isImportant: false,
    folder: "drafts",
    labels: ["Work"]
  },
  {
    id: "email-7",
    senderName: "Sven Hirsch",
    senderEmail: "svenhirsch@rhyta.com",
    senderAvatar: "/assets/images/users/avatar-8.jpg",
    subject: "Newsletter: Real Estate Trends Q2",
    preview: "Check out the latest quarterly trends in suburban and urban housing price indices...",
    body: "Hello,\n\nThe housing price index has seen a 4.2% rise in suburban markets, while urban high-rises are showing signs of stabilization. Read the full analysis report attached.\n\nSven",
    date: "May 25, 2026",
    time: "10:00 AM",
    isRead: true,
    isStarred: false,
    isImportant: false,
    folder: "inbox",
    labels: ["Social"]
  }
];
