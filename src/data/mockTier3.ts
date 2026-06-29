export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Super Admin' | 'Broker' | 'Agent' | 'Viewer';
  lastActive: string;
}

export interface CommissionPlan {
  id: string;
  name: string;
  agentPercentage: number;
  brokerPercentage: number;
  capLimit: number;
  deskFee: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  category: 'Create' | 'Update' | 'Delete' | 'Security';
  component: 'Listings' | 'Security' | 'Reviews' | 'Deals' | 'Calendar' | 'System';
  timestamp: string;
  ip: string;
}

export const initialUsers: AppUser[] = [
  {
    id: "USR-001",
    name: "Walter L. Calab",
    email: "walter.calab@waveron.com",
    avatar: "/assets/images/users/avatar-1.jpg",
    role: "Super Admin",
    lastActive: "Active Now"
  },
  {
    id: "USR-002",
    name: "Michael A. Miner",
    email: "michael.miner@waveron.com",
    avatar: "/assets/images/users/avatar-2.jpg",
    role: "Agent",
    lastActive: "10 mins ago"
  },
  {
    id: "USR-003",
    name: "Theresa T. Brose",
    email: "theresa.brose@waveron.com",
    avatar: "/assets/images/users/avatar-3.jpg",
    role: "Agent",
    lastActive: "2 hours ago"
  },
  {
    id: "USR-004",
    name: "John Broker",
    email: "john.broker@waveron.com",
    avatar: "/assets/images/users/avatar-4.jpg",
    role: "Broker",
    lastActive: "1 day ago"
  },
  {
    id: "USR-005",
    name: "Guest Investor",
    email: "guest@external.com",
    avatar: "/assets/images/users/avatar-5.jpg",
    role: "Viewer",
    lastActive: "3 days ago"
  }
];

export const initialCommissionPlans: CommissionPlan[] = [
  {
    id: "PLAN-001",
    name: "Standard Split (80/20)",
    agentPercentage: 80,
    brokerPercentage: 20,
    capLimit: 20000,
    deskFee: 0
  },
  {
    id: "PLAN-002",
    name: "High Performer (90/10)",
    agentPercentage: 90,
    brokerPercentage: 10,
    capLimit: 15000,
    deskFee: 150
  },
  {
    id: "PLAN-003",
    name: "100% Desk Fee Plan",
    agentPercentage: 100,
    brokerPercentage: 0,
    capLimit: 0,
    deskFee: 950
  },
  {
    id: "PLAN-004",
    name: "Starter Split (70/30)",
    agentPercentage: 70,
    brokerPercentage: 30,
    capLimit: 25000,
    deskFee: 0
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    userId: "USR-001",
    userName: "Walter L. Calab",
    userAvatar: "/assets/images/users/avatar-1.jpg",
    action: "Updated branding settings to 'waveron'",
    category: "Update",
    component: "System",
    timestamp: "2026-06-16 08:10:24",
    ip: "192.168.1.145"
  },
  {
    id: "AUD-002",
    userId: "USR-001",
    userName: "Walter L. Calab",
    userAvatar: "/assets/images/users/avatar-1.jpg",
    action: "Recorded Closed Deal: DEAL-003",
    category: "Create",
    component: "Deals",
    timestamp: "2026-06-16 08:15:32",
    ip: "192.168.1.145"
  },
  {
    id: "AUD-003",
    userId: "USR-002",
    userName: "Michael A. Miner",
    userAvatar: "/assets/images/users/avatar-2.jpg",
    action: "Added new Property Listing: PROP-009",
    category: "Create",
    component: "Listings",
    timestamp: "2026-06-16 08:20:11",
    ip: "192.168.1.189"
  },
  {
    id: "AUD-004",
    userId: "USR-001",
    userName: "Walter L. Calab",
    userAvatar: "/assets/images/users/avatar-1.jpg",
    action: "Changed Session Role permissions for Broker",
    category: "Security",
    component: "Security",
    timestamp: "2026-06-16 08:35:45",
    ip: "192.168.1.145"
  }
];

export const defaultPermissions: Record<string, string[]> = {
  "Super Admin": ["listings_edit", "commissions_admin", "review_moderation", "transaction_log", "audit_export", "user_manage"],
  "Broker": ["listings_edit", "commissions_admin", "review_moderation", "transaction_log", "audit_export"],
  "Agent": ["listings_edit", "transaction_log"],
  "Viewer": []
};
