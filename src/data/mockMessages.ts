export interface Message {
  id: string;
  senderId: "me" | "contact";
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  status: "Active" | "Offline" | "Away";
  lastSeen?: string;
  email: string;
  phone: string;
  location: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface ChatGroup {
  id: string;
  name: string;
  unreadCount: number;
  messages: Message[];
}

export const mockContacts: ChatContact[] = [
  {
    id: "chat-1",
    name: "John Doe",
    avatar: "/assets/images/users/avatar-2.jpg",
    status: "Active",
    email: "johndoe@teleworm.us",
    phone: "+1 555-019-2834",
    location: "New York, USA",
    lastMessage: "Hi Gaston! What about our next meeting?",
    lastMessageTime: "10:15 AM",
    unreadCount: 2,
    messages: [
      {
        id: "msg-1-1",
        senderId: "contact",
        senderName: "John Doe",
        text: "Hello Gaston, hope you are doing well.",
        timestamp: "09:30 AM"
      },
      {
        id: "msg-1-2",
        senderId: "me",
        senderName: "Gaston Lapierre",
        text: "Hi John! Yes, I am doing great. How can I help you today?",
        timestamp: "09:35 AM"
      },
      {
        id: "msg-1-3",
        senderId: "contact",
        senderName: "John Doe",
        text: "I was looking at the Broadview Apartments pricing.",
        timestamp: "09:40 AM"
      },
      {
        id: "msg-1-4",
        senderId: "contact",
        senderName: "John Doe",
        text: "Hi Gaston! What about our next meeting?",
        timestamp: "10:15 AM"
      }
    ]
  },
  {
    id: "chat-2",
    name: "Dianna Blair",
    avatar: "/assets/images/users/avatar-3.jpg",
    status: "Active",
    email: "diannablair@dayrep.com",
    phone: "+1 555-014-9988",
    location: "Los Angeles, USA",
    lastMessage: "I have uploaded the document packages.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "msg-2-1",
        senderId: "contact",
        senderName: "Dianna Blair",
        text: "Hi! Can you check the transaction status for client CUST-002?",
        timestamp: "02:15 PM"
      },
      {
        id: "msg-2-2",
        senderId: "me",
        senderName: "Gaston Lapierre",
        text: "Sure, let me check the transaction log.",
        timestamp: "02:18 PM"
      },
      {
        id: "msg-2-3",
        senderId: "me",
        senderName: "Gaston Lapierre",
        text: "It is marked as completed.",
        timestamp: "02:20 PM"
      },
      {
        id: "msg-2-4",
        senderId: "contact",
        senderName: "Dianna Blair",
        text: "Awesome. I have uploaded the document packages.",
        timestamp: "03:45 PM"
      }
    ]
  },
  {
    id: "chat-3",
    name: "David Wilson",
    avatar: "/assets/images/users/avatar-4.jpg",
    status: "Offline",
    lastSeen: "2 hours ago",
    email: "david.wilson@rhyta.com",
    phone: "+1 555-017-7722",
    location: "San Francisco, USA",
    lastMessage: "Thanks, the layout looks beautiful!",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "msg-3-1",
        senderId: "contact",
        senderName: "David Wilson",
        text: "Could you send me the latest layout plans?",
        timestamp: "Yesterday, 11:00 AM"
      },
      {
        id: "msg-3-2",
        senderId: "me",
        senderName: "Gaston Lapierre",
        text: "Yes, sending them right away.",
        timestamp: "Yesterday, 11:05 AM"
      },
      {
        id: "msg-3-3",
        senderId: "contact",
        senderName: "David Wilson",
        text: "Thanks, the layout looks beautiful!",
        timestamp: "Yesterday, 11:20 AM"
      }
    ]
  },
  {
    id: "chat-4",
    name: "Willie L. Quin",
    avatar: "/assets/images/users/avatar-5.jpg",
    status: "Away",
    email: "williequin@teleworm.us",
    phone: "+1 555-012-4411",
    location: "Chicago, USA",
    lastMessage: "I'll review the contract tomorrow.",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    messages: [
      {
        id: "msg-4-1",
        senderId: "contact",
        senderName: "Willie L. Quin",
        text: "Gaston, do you have the draft contract?",
        timestamp: "2 days ago"
      },
      {
        id: "msg-4-2",
        senderId: "me",
        senderName: "Gaston Lapierre",
        text: "Yes, I emailed it to your business inbox.",
        timestamp: "2 days ago"
      },
      {
        id: "msg-4-3",
        senderId: "contact",
        senderName: "Willie L. Quin",
        text: "Perfect, I'll review the contract tomorrow.",
        timestamp: "2 days ago"
      }
    ]
  },
  {
    id: "chat-5",
    name: "Deanna D. Oceg",
    avatar: "/assets/images/users/avatar-6.jpg",
    status: "Active",
    email: "deannaoceg@armyspy.com",
    phone: "+1 555-015-8855",
    location: "Boston, USA",
    lastMessage: "Let's catch up at 3 PM today.",
    lastMessageTime: "08:12 AM",
    unreadCount: 1,
    messages: [
      {
        id: "msg-5-1",
        senderId: "contact",
        senderName: "Deanna D. Oceg",
        text: "Hey, are you free for a quick call?",
        timestamp: "Yesterday"
      },
      {
        id: "msg-5-2",
        senderId: "me",
        senderName: "Gaston Lapierre",
        text: "Sure, let's connect in the morning.",
        timestamp: "Yesterday"
      },
      {
        id: "msg-5-3",
        senderId: "contact",
        senderName: "Deanna D. Oceg",
        text: "Let's catch up at 3 PM today.",
        timestamp: "08:12 AM"
      }
    ]
  }
];

export const mockGroups: ChatGroup[] = [
  {
    id: "group-1",
    name: "General",
    unreadCount: 3,
    messages: [
      {
        id: "gmsg-1-1",
        senderId: "contact",
        senderName: "John Doe",
        text: "Hey everyone! Welcome to the group.",
        timestamp: "09:00 AM"
      },
      {
        id: "gmsg-1-2",
        senderId: "contact",
        senderName: "Dianna Blair",
        text: "Hi all! Glad to join.",
        timestamp: "09:05 AM"
      },
      {
        id: "gmsg-1-3",
        senderId: "me",
        senderName: "Gaston Lapierre",
        text: "Welcome to the waveron administrative channel.",
        timestamp: "09:10 AM"
      }
    ]
  },
  {
    id: "group-2",
    name: "Project A",
    unreadCount: 0,
    messages: [
      {
        id: "gmsg-2-1",
        senderId: "contact",
        senderName: "David Wilson",
        text: "This group is for Project A updates.",
        timestamp: "Yesterday"
      },
      {
        id: "gmsg-2-2",
        senderId: "me",
        senderName: "Gaston Lapierre",
        text: "Understood, I will paste reports here.",
        timestamp: "Yesterday"
      }
    ]
  }
];
