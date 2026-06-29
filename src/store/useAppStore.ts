import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Property, properties as initialProperties } from '@/data/mockProperties';
import { Agent, agents as initialAgents } from '@/data/mockAgents';
import { Customer, customers as initialCustomers } from '@/data/mockCustomers';
import { 
  CalendarEvent, 
  EntityNote, 
  Review, 
  DocumentFile,
  DocumentSigner,
  initialCalendarEvents,
  initialReviews,
  initialNotes,
  initialDocuments
} from '@/data/mockTier2';
import {
  AppUser,
  CommissionPlan,
  AuditLog,
  initialUsers,
  initialCommissionPlans,
  initialAuditLogs,
  defaultPermissions
} from '@/data/mockTier3';

export interface ClosedDeal {
  id: string;
  propertyId: string;
  propertyTitle: string;
  price: number;
  agentId: string;
  agentName: string;
  buyerName: string;
  commissionRate: number;
  grossCommission: number;
  splitRatio: string;
  agentPayout: number;
  brokerCut: number;
  doubleEnded: boolean;
  closeDate: string;
  status: 'Paid' | 'Processing' | 'Pending';
}

export interface RenovationExpense {
  id: string;
  propertyId: string;
  category: "Materials" | "Labor" | "Permits" | "Styling" | "Other";
  amount: number;
  date: string;
  description: string;
}

export interface ConstructionMilestone {
  id: string;
  propertyId: string;
  name: string;
  status: "Pending" | "In Progress" | "Completed";
  order: number;
}

export interface ZoningPermit {
  id: string;
  propertyId: string;
  name: string;
  authority: string;
  status: "Applied" | "Approved" | "Rejected";
  expiryDate?: string;
  documentName?: string;
  documentUrl?: string;
}

export interface NotificationItem {
  id: string;
  type: "avatar" | "initial" | "icon";
  avatarInitial?: string;
  icon?: string;
  avatarColor: string;
  name: string;
  message: string;
  time: string;
  link: string;
}

export const initialNotifications: NotificationItem[] = [
  {
    id: "NTF-001",
    type: "avatar",
    avatarInitial: "J",
    avatarColor: "bg-[#604ae3]",
    name: "Josephine Thompson",
    message: 'commented on admin panel "Wow 😍! this admin looks good and awesome design"',
    time: "2 min ago",
    link: "/chats",
  },
  {
    id: "NTF-002",
    type: "initial",
    avatarInitial: "D",
    avatarColor: "bg-soft-info text-info",
    name: "Donoghue Susan",
    message: "Hi, How are you? What about our next meeting",
    time: "1 hr ago",
    link: "/chats",
  },
  {
    id: "NTF-003",
    type: "initial",
    avatarInitial: "J",
    avatarColor: "bg-[#3d4654] text-white",
    name: "Jacob Gines",
    message: "Answered to your comment on the cash flow forecast's graph 🔔.",
    time: "3 hr ago",
    link: "/chats",
  },
  {
    id: "NTF-004",
    type: "icon",
    icon: "ri-leaf-line",
    avatarColor: "bg-soft-warning text-warning",
    name: "Karen Robinson",
    message: "Wow 😍! this admin looks good and awesome design",
    time: "1 day ago",
    link: "/chats",
  }
];

export const initialRenovationExpenses: RenovationExpense[] = [
  {
    id: "EXP-001",
    propertyId: "PROP-001",
    category: "Materials",
    amount: 15000,
    date: "2026-05-10",
    description: "Premium Hardwood Oak Flooring installation"
  },
  {
    id: "EXP-002",
    propertyId: "PROP-001",
    category: "Labor",
    amount: 8500,
    date: "2026-05-12",
    description: "Electrical rewiring and smart switches installation"
  },
  {
    id: "EXP-003",
    propertyId: "PROP-001",
    category: "Styling",
    amount: 4200,
    date: "2026-05-20",
    description: "Living room wall plastering and custom paint"
  },
  {
    id: "EXP-004",
    propertyId: "PROP-002",
    category: "Materials",
    amount: 22000,
    date: "2026-04-18",
    description: "Custom marble countertops and kitchen cabinetry"
  },
  {
    id: "EXP-005",
    propertyId: "PROP-002",
    category: "Permits",
    amount: 2500,
    date: "2026-04-20",
    description: "Kitchen layout alteration building permit"
  }
];

export const initialConstructionMilestones: ConstructionMilestone[] = [
  { id: "MLS-101", propertyId: "PROP-001", name: "Architectural Blueprint", status: "Completed", order: 1 },
  { id: "MLS-102", propertyId: "PROP-001", name: "Structural Frame & Foundation", status: "Completed", order: 2 },
  { id: "MLS-103", propertyId: "PROP-001", name: "Drywall & Interior Utilities", status: "Completed", order: 3 },
  { id: "MLS-104", propertyId: "PROP-001", name: "Staging & Final Polish", status: "In Progress", order: 4 },
  { id: "MLS-105", propertyId: "PROP-001", name: "Active Listing Activation", status: "Pending", order: 5 },
  { id: "MLS-201", propertyId: "PROP-002", name: "Architectural Blueprint", status: "Completed", order: 1 },
  { id: "MLS-202", propertyId: "PROP-002", name: "Structural Frame & Foundation", status: "Completed", order: 2 },
  { id: "MLS-203", propertyId: "PROP-002", name: "Drywall & Interior Utilities", status: "Completed", order: 3 },
  { id: "MLS-204", propertyId: "PROP-002", name: "Staging & Final Polish", status: "Completed", order: 4 },
  { id: "MLS-205", propertyId: "PROP-002", name: "Active Listing Activation", status: "Completed", order: 5 }
];

export const initialZoningPermits: ZoningPermit[] = [
  { id: "PRM-101", propertyId: "PROP-001", name: "Residential Development Authorization", authority: "Municipal Building Council", status: "Approved", expiryDate: "2028-12-31" },
  { id: "PRM-102", propertyId: "PROP-001", name: "High-Voltage Electrical Grid Extension Permit", authority: "State Grid Board", status: "Approved", expiryDate: "2027-06-30" },
  { id: "PRM-103", propertyId: "PROP-001", name: "Zoning Variance Permit", authority: "Local Zoning Board", status: "Applied" },
  { id: "PRM-201", propertyId: "PROP-002", name: "Kitchen Alteration Permission", authority: "City Planning Authority", status: "Approved", expiryDate: "2026-12-15" }
];

export const initialClosedDeals: ClosedDeal[] = [
  {
    id: "DEAL-001",
    propertyId: "PROP-007",
    propertyTitle: "Ojiag Duplex House",
    price: 2500000,
    agentId: "AGT-001",
    agentName: "Michael A. Miner",
    buyerName: "Daavid Nummi",
    commissionRate: 3.0,
    grossCommission: 75000,
    splitRatio: "80/20 Split",
    agentPayout: 60000,
    brokerCut: 15000,
    doubleEnded: false,
    closeDate: "2026-05-15",
    status: "Paid"
  },
  {
    id: "DEAL-002",
    propertyId: "PROP-002",
    propertyTitle: "PIK Villa House",
    price: 3450000,
    agentId: "AGT-001",
    agentName: "Michael A. Miner",
    buyerName: "Sinikka Penttinen",
    commissionRate: 3.0,
    grossCommission: 103500,
    splitRatio: "100% Cap-Met",
    agentPayout: 103500,
    brokerCut: 0,
    doubleEnded: false,
    closeDate: "2026-05-20",
    status: "Paid"
  },
  {
    id: "DEAL-003",
    propertyId: "PROP-001",
    propertyTitle: "Dvilla Residences Batu",
    price: 893333,
    agentId: "AGT-001",
    agentName: "Michael A. Miner",
    buyerName: "Jere Palmu",
    commissionRate: 3.0,
    grossCommission: 26800,
    splitRatio: "80/20 Split",
    agentPayout: 21440,
    brokerCut: 5360,
    doubleEnded: false,
    closeDate: "2026-06-02",
    status: "Processing"
  },
  {
    id: "DEAL-004",
    propertyId: "PROP-006",
    propertyTitle: "Luxury Penthouse",
    price: 1800000,
    agentId: "AGT-002",
    agentName: "Theresa T. Brose",
    buyerName: "Sinikka Penttinen",
    commissionRate: 3.0,
    grossCommission: 54000,
    splitRatio: "70/30 Split",
    agentPayout: 37800,
    brokerCut: 16200,
    doubleEnded: false,
    closeDate: "2026-05-18",
    status: "Paid"
  },
  {
    id: "DEAL-005",
    propertyId: "PROP-005",
    propertyTitle: "Weekend Villa MBH",
    price: 1200000,
    agentId: "AGT-003",
    agentName: "Walter L. Calab",
    buyerName: "Ulla Nuorela",
    commissionRate: 3.0,
    grossCommission: 36000,
    splitRatio: "80/20 Split",
    agentPayout: 28800,
    brokerCut: 7200,
    doubleEnded: false,
    closeDate: "2026-05-25",
    status: "Paid"
  }
];

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  
  topbarColor: 'light' | 'dark';
  setTopbarColor: (color: 'light' | 'dark') => void;
  
  menuColor: 'light' | 'dark';
  setMenuColor: (color: 'light' | 'dark') => void;
  
  sidebarSize: 'default' | 'condensed' | 'hidden' | 'sm-hover' | 'sm-hover-active';
  setSidebarSize: (size: 'default' | 'condensed' | 'hidden' | 'sm-hover' | 'sm-hover-active') => void;
  
  agencyName: string;
  setAgencyName: (name: string) => void;
  brandColor: string;
  setBrandColor: (color: string) => void;
  
  // Reactive Data Store for CRM & Commissions
  properties: Property[];
  agents: Agent[];
  customers: Customer[];
  closedDeals: ClosedDeal[];
  
  addClosedDeal: (deal: Omit<ClosedDeal, 'id'>) => void;
  updatePropertyStatus: (propertyId: string, status: Property['status']) => void;
  addProperty: (property: Omit<Property, 'id'>) => void;
  addAgent: (agent: Omit<Agent, 'id' | 'rating' | 'listingsCount' | 'soldCount' | 'rentCount' | 'socials'> & { facebook?: string, instagram?: string, twitter?: string }) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'viewPropertiesCount' | 'ownPropertiesCount' | 'investOnProperty' | 'transactions' | 'transactionHistory' | 'interestedProperties'>) => void;

  // Tier 2 Added Collections & Actions
  calendarEvents: CalendarEvent[];
  comparedPropertyIds: string[];
  entityNotes: EntityNote[];
  reviews: Review[];
  documents: DocumentFile[];

  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;
  toggleComparedPropertyId: (id: string) => void;
  clearComparedProperties: () => void;
  addEntityNote: (note: Omit<EntityNote, 'id' | 'createdAt'>) => void;
  deleteEntityNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  respondToReview: (id: string, response: string) => void;
  addDocument: (doc: Omit<DocumentFile, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;
  
  // Tier 3 Added Collections & Actions
  hasCompletedOnboarding: boolean;
  agencyProfile: { name: string; tagline: string; logo: string; currency: string };
  completeOnboarding: (profile: { name: string; tagline: string; logo: string; currency: string }) => void;
  resetOnboarding: () => void;

  sessionRole: 'Super Admin' | 'Broker' | 'Agent' | 'Viewer';
  setSessionRole: (role: 'Super Admin' | 'Broker' | 'Agent' | 'Viewer') => void;
  usersList: AppUser[];
  addUser: (user: Omit<AppUser, 'id' | 'lastActive' | 'avatar'>) => void;
  deleteUser: (id: string) => void;
  rolePermissions: Record<string, string[]>;
  togglePermission: (role: string, permission: string) => void;

  commissionPlans: CommissionPlan[];
  agentPlanAssignments: Record<string, string>; // agentId -> planId
  addCommissionPlan: (plan: Omit<CommissionPlan, 'id'>) => void;
  deleteCommissionPlan: (id: string) => void;
  assignAgentPlan: (agentId: string, planId: string) => void;

  auditLogs: AuditLog[];
  addAuditLog: (log: { action: string; category: AuditLog['category']; component: AuditLog['component'] }) => void;

  expenses: RenovationExpense[];
  milestones: ConstructionMilestone[];
  permits: ZoningPermit[];

  addExpense: (expense: Omit<RenovationExpense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateMilestoneStatus: (propertyId: string, name: string, status: ConstructionMilestone['status']) => void;
  addPermit: (permit: Omit<ZoningPermit, 'id'>) => void;
  deletePermit: (id: string) => void;

  resetSettings: () => void;
  resetStore: () => void;

  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'time'>) => void;
  clearNotifications: () => void;
  deleteNotification: (id: string) => void;
  updateCustomerStatus: (id: string, status: Customer['listStatus']) => void;
  updateDocumentSignatures: (id: string, signers: DocumentSigner[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      notifications: initialNotifications,
      toggleSidebar: () => set((state) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 1280;
        if (isMobile) {
          return { sidebarOpen: !state.sidebarOpen };
        } else {
          const newSize = state.sidebarSize === 'default' ? 'condensed' : 'default';
          return { sidebarSize: newSize };
        }
      }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      settingsOpen: false,
      setSettingsOpen: (open) => set({ settingsOpen: open }),
      
      topbarColor: 'light',
      setTopbarColor: (color) => set({ topbarColor: color }),
      
      menuColor: 'dark',
      setMenuColor: (color) => set({ menuColor: color }),
      
      sidebarSize: 'default',
      setSidebarSize: (size) => set({ sidebarSize: size, sidebarOpen: size !== 'hidden' }),
      
      agencyName: 'waveron',
      setAgencyName: (name) => set({ agencyName: name }),
      brandColor: '#604ae3',
      setBrandColor: (color) => set({ brandColor: color }),
      
      // Tier 3 Core State Initializers
      hasCompletedOnboarding: false,
      agencyProfile: { name: 'waveron', tagline: 'Real Estate SaaS Portal', logo: '', currency: 'USD' },
      sessionRole: 'Super Admin',
      usersList: initialUsers,
      rolePermissions: defaultPermissions,
      commissionPlans: initialCommissionPlans,
      agentPlanAssignments: { 'AGT-001': 'PLAN-001', 'AGT-002': 'PLAN-002', 'AGT-003': 'PLAN-004' },
      auditLogs: initialAuditLogs,

      expenses: initialRenovationExpenses,
      milestones: initialConstructionMilestones,
      permits: initialZoningPermits,

      // Core Data Initializers
      properties: initialProperties,
      agents: initialAgents,
      customers: initialCustomers,
      closedDeals: initialClosedDeals,

      // Tier 2 Collections
      calendarEvents: initialCalendarEvents,
      comparedPropertyIds: [],
      entityNotes: initialNotes,
      reviews: initialReviews,
      documents: initialDocuments,
      
      addClosedDeal: (deal) => set((state) => {
        const newId = `DEAL-${Math.floor(1000 + Math.random() * 9000)}`;
        const newDeal: ClosedDeal = { ...deal, id: newId };
        
        // Update matching property's status to Sold in store
        const updatedProperties = state.properties.map((p) => 
          p.id === deal.propertyId ? { ...p, status: 'Sold' as const } : p
        );
        
        // Increment agent's soldCount and listCount adjustments
        const updatedAgents = state.agents.map((a) => {
          if (a.id === deal.agentId) {
            return {
              ...a,
              soldCount: a.soldCount + 1,
            };
          }
          return a;
        });
        
        // Update customer investment stats if they match the buyer
        const updatedCustomers = state.customers.map((c) => {
          if (c.name === deal.buyerName) {
            return {
              ...c,
              ownPropertiesCount: c.ownPropertiesCount + 1,
              investOnProperty: c.investOnProperty + deal.price,
            };
          }
          return c;
        });

        // Add auto calendar closing event
        const closingEvent: CalendarEvent = {
          id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
          title: `Closing: ${deal.propertyTitle}`,
          start: deal.closeDate,
          type: "Closing",
          description: `Contract closed for $${deal.price.toLocaleString()} with buyer ${deal.buyerName}.`,
          propertyId: deal.propertyId,
          propertyName: deal.propertyTitle,
          agentId: deal.agentId
        };

        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Recorded Closed Deal: ${newId} (${deal.propertyTitle})`,
          category: 'Create',
          component: 'Deals',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };
    
        const notifId = `NTF-${Math.floor(1000 + Math.random() * 9000)}`;
        const newNotif: NotificationItem = {
          id: notifId,
          type: "icon",
          icon: "ri-exchange-dollar-line",
          avatarColor: "bg-soft-success text-success",
          name: deal.buyerName,
          message: `closed a deal on ${deal.propertyTitle} for $${deal.price.toLocaleString()}`,
          time: "Just now",
          link: `/agents/${deal.agentId}`
        };

        return {
          closedDeals: [newDeal, ...state.closedDeals],
          properties: updatedProperties,
          agents: updatedAgents,
          customers: updatedCustomers,
          calendarEvents: [closingEvent, ...state.calendarEvents],
          auditLogs: [newLog, ...state.auditLogs],
          notifications: [newNotif, ...state.notifications]
        };
      }),
    
      updatePropertyStatus: (propertyId, status) => set((state) => ({
        properties: state.properties.map((p) => 
          p.id === propertyId ? { ...p, status } : p
        )
      })),

      addProperty: (property) => set((state) => {
        const newId = `PROP-${Math.floor(100 + Math.random() * 900)}`;
        const newProp: Property = {
          ...property,
          id: newId,
        };
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Added listing: ${newId} (${property.title})`,
          category: 'Create',
          component: 'Listings',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };
        const notifId = `NTF-${Math.floor(1000 + Math.random() * 9000)}`;
        const newNotif: NotificationItem = {
          id: notifId,
          type: "icon",
          icon: "ri-home-4-line",
          avatarColor: "bg-soft-primary text-primary",
          name: activeUser.name,
          message: `added a new listing: ${property.title} for $${property.price.toLocaleString()}`,
          time: "Just now",
          link: "/"
        };

        return {
          properties: [newProp, ...state.properties],
          auditLogs: [newLog, ...state.auditLogs],
          notifications: [newNotif, ...state.notifications]
        };
      }),

      addAgent: (agent) => set((state) => {
        const newId = `AGT-${Math.floor(100 + Math.random() * 900)}`;
        const newAgent: Agent = {
          ...agent,
          id: newId,
          rating: 4.8,
          listingsCount: agent.properties,
          soldCount: 0,
          rentCount: 0,
          socials: {
            facebook: agent.facebook || 'https://facebook.com',
            instagram: agent.instagram || 'https://instagram.com',
            twitter: agent.twitter || 'https://twitter.com',
            whatsapp: 'https://whatsapp.com',
            email: agent.email
          }
        };
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Registered new Agent profile: ${newId} (${agent.name})`,
          category: 'Create',
          component: 'System',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };
        return {
          agents: [newAgent, ...state.agents],
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      addCustomer: (customer) => set((state) => {
        const newId = `CUST-${Math.floor(100 + Math.random() * 900)}`;
        const newCustomer: Customer = {
          ...customer,
          id: newId,
          viewPropertiesCount: 0,
          ownPropertiesCount: 0,
          investOnProperty: 0,
          transactions: [],
          transactionHistory: [],
          interestedProperties: []
        };
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Registered new Customer profile: ${newId} (${customer.name})`,
          category: 'Create',
          component: 'System',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };
        return {
          customers: [newCustomer, ...state.customers],
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      // Tier 2 Actions
      addCalendarEvent: (event) => set((state) => {
        const newEvent = { ...event, id: `EVT-${Math.floor(1000 + Math.random() * 9000)}` };
        return { calendarEvents: [...state.calendarEvents, newEvent] };
      }),

      deleteCalendarEvent: (id) => set((state) => ({
        calendarEvents: state.calendarEvents.filter(e => e.id !== id)
      })),

      toggleComparedPropertyId: (id) => set((state) => {
        const index = state.comparedPropertyIds.indexOf(id);
        if (index > -1) {
          return { comparedPropertyIds: state.comparedPropertyIds.filter(item => item !== id) };
        } else {
          if (state.comparedPropertyIds.length >= 4) {
            return state; // Limit comparison to 4 properties
          }
          return { comparedPropertyIds: [...state.comparedPropertyIds, id] };
        }
      }),

      clearComparedProperties: () => set({ comparedPropertyIds: [] }),

      addEntityNote: (note) => set((state) => {
        const newNote: EntityNote = {
          ...note,
          id: `NTE-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString().split('T')[0]
        };
        return { entityNotes: [newNote, ...state.entityNotes] };
      }),

      deleteEntityNote: (id) => set((state) => ({
        entityNotes: state.entityNotes.filter(n => n.id !== id)
      })),

      togglePinNote: (id) => set((state) => ({
        entityNotes: state.entityNotes.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n)
      })),

      addReview: (review) => set((state) => {
        const newReview: Review = {
          ...review,
          id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'Pending'
        };
        return { reviews: [newReview, ...state.reviews] };
      }),

      updateReviewStatus: (id, status) => set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, status } : r)
      })),

      respondToReview: (id, response) => set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, response } : r)
      })),

      addDocument: (doc) => set((state) => {
        const newDoc: DocumentFile = {
          ...doc,
          id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
          uploadedAt: new Date().toISOString().split('T')[0]
        };
        return { documents: [newDoc, ...state.documents] };
      }),

      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter(d => d.id !== id)
      })),
      
      resetSettings: () => set({
        topbarColor: 'light',
        menuColor: 'dark',
        sidebarSize: 'default',
        sidebarOpen: true,
        settingsOpen: false,
        agencyName: 'waveron',
        brandColor: '#604ae3'
      }),
      
      resetStore: () => set({
        topbarColor: 'light',
        menuColor: 'dark',
        sidebarSize: 'default',
        sidebarOpen: true,
        settingsOpen: false,
        agencyName: 'waveron',
        brandColor: '#604ae3',
        properties: initialProperties,
        agents: initialAgents,
        customers: initialCustomers,
        closedDeals: initialClosedDeals,
        calendarEvents: initialCalendarEvents,
        comparedPropertyIds: [],
        entityNotes: initialNotes,
        reviews: initialReviews,
        documents: initialDocuments,
        hasCompletedOnboarding: false,
        agencyProfile: { name: 'waveron', tagline: 'Real Estate SaaS Portal', logo: '', currency: 'USD' },
        sessionRole: 'Super Admin',
        usersList: initialUsers,
        rolePermissions: defaultPermissions,
        commissionPlans: initialCommissionPlans,
        agentPlanAssignments: { 'AGT-001': 'PLAN-001', 'AGT-002': 'PLAN-002', 'AGT-003': 'PLAN-004' },
        auditLogs: initialAuditLogs,
        expenses: initialRenovationExpenses,
        milestones: initialConstructionMilestones,
        permits: initialZoningPermits,
        notifications: initialNotifications
      }),

      addNotification: (notif) => set((state) => {
        const newId = `NTF-${Math.floor(1000 + Math.random() * 9000)}`;
        const newItem: NotificationItem = {
          ...notif,
          id: newId,
          time: "Just now"
        };
        return { notifications: [newItem, ...state.notifications] };
      }),
      clearNotifications: () => set({ notifications: [] }),
      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      updateCustomerStatus: (id, status) => set((state) => ({
        customers: state.customers.map((c) => c.id === id ? { ...c, listStatus: status } : c)
      })),
      updateDocumentSignatures: (id, signers) => set((state) => ({
        documents: state.documents.map((d) => d.id === id ? { ...d, signers } : d)
      })),

      // Tier 3 Actions Implementation
      completeOnboarding: (profile) => set({
        agencyProfile: profile,
        agencyName: profile.name,
        hasCompletedOnboarding: true
      }),

      resetOnboarding: () => set({
        hasCompletedOnboarding: false
      }),

      setSessionRole: (role) => set({ sessionRole: role }),

      addUser: (user) => set((state) => {
        const newId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
        const newUser: AppUser = {
          ...user,
          id: newId,
          avatar: `/assets/images/users/avatar-${Math.floor(1 + Math.random() * 8)}.jpg`,
          lastActive: "Active Now"
        };
        
        // Log action
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Invited new user: ${user.name} (${user.role})`,
          category: 'Security',
          component: 'Security',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };

        return { 
          usersList: [...state.usersList, newUser],
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      deleteUser: (id) => set((state) => {
        const user = state.usersList.find(u => u.id === id);
        
        // Log action
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Deleted user account: ${user?.name || id}`,
          category: 'Security',
          component: 'Security',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };

        return { 
          usersList: state.usersList.filter(u => u.id !== id),
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      togglePermission: (role, permission) => set((state) => {
        const current = state.rolePermissions[role] || [];
        const next = current.includes(permission)
          ? current.filter(p => p !== permission)
          : [...current, permission];
        
        // Log action
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Updated role permissions for role: ${role}`,
          category: 'Security',
          component: 'Security',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };

        return {
          rolePermissions: {
            ...state.rolePermissions,
            [role]: next
          },
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      addCommissionPlan: (plan) => set((state) => {
        const newId = `PLAN-${Math.floor(1000 + Math.random() * 9000)}`;
        const newPlan: CommissionPlan = { ...plan, id: newId };
        
        // Log action
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Added new Commission Plan: ${plan.name}`,
          category: 'Create',
          component: 'Deals',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };

        return { 
          commissionPlans: [...state.commissionPlans, newPlan],
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      deleteCommissionPlan: (id) => set((state) => {
        const plan = state.commissionPlans.find(p => p.id === id);
        
        // Log action
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Deleted Commission Plan: ${plan?.name || id}`,
          category: 'Delete',
          component: 'Deals',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };

        return { 
          commissionPlans: state.commissionPlans.filter(p => p.id !== id),
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      assignAgentPlan: (agentId, planId) => set((state) => {
        const agent = state.agents.find(a => a.id === agentId);
        const plan = state.commissionPlans.find(p => p.id === planId);
        
        // Log action
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Assigned agent ${agent?.name || agentId} to plan ${plan?.name || planId}`,
          category: 'Update',
          component: 'Deals',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.102`
        };

        return {
          agentPlanAssignments: { ...state.agentPlanAssignments, [agentId]: planId },
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      addAuditLog: (log) => set((state) => {
        const newId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: newId,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: log.action,
          category: log.category,
          component: log.component,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: `192.168.1.${Math.floor(100 + Math.random() * 100)}`
        };
        return { auditLogs: [newLog, ...state.auditLogs] };
      }),

      addExpense: (expense) => set((state) => {
        const newId = `EXP-${Math.floor(1000 + Math.random() * 9000)}`;
        const newExpense: RenovationExpense = { ...expense, id: newId };
        
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Logged renovation expense: ${newId} ($${expense.amount.toLocaleString()} for ${expense.category})`,
          category: 'Create',
          component: 'Listings',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: '192.168.1.102'
        };

        return {
          expenses: [newExpense, ...state.expenses],
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      deleteExpense: (id) => set((state) => {
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Deleted renovation expense: ${id}`,
          category: 'Delete',
          component: 'Listings',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: '192.168.1.102'
        };

        return {
          expenses: state.expenses.filter(e => e.id !== id),
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      updateMilestoneStatus: (propertyId, name, status) => set((state) => {
        const updatedMilestones = state.milestones.map((m) => {
          if (m.propertyId === propertyId && m.name === name) {
            return { ...m, status };
          }
          return m;
        });

        let updatedProperties = state.properties;
        let auditLogs = state.auditLogs;
        
        if (name === "Staging & Final Polish" && status === "Completed") {
          updatedProperties = state.properties.map((p) => {
            if (p.id === propertyId && p.status !== "Sold") {
              return p;
            }
            return p;
          });

          const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
          const newLog: AuditLog = {
            id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
            userId: activeUser.id,
            userName: activeUser.name,
            userAvatar: activeUser.avatar,
            action: `Auto-updated listing ${propertyId} status through construction milestone completion`,
            category: 'Update',
            component: 'Listings',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            ip: '192.168.1.102'
          };
          auditLogs = [newLog, ...state.auditLogs];
        }

        return {
          milestones: updatedMilestones,
          properties: updatedProperties,
          auditLogs: auditLogs
        };
      }),

      addPermit: (permit) => set((state) => {
        const newId = `PRM-${Math.floor(1000 + Math.random() * 9000)}`;
        const newPermit: ZoningPermit = { ...permit, id: newId };

        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Added permit tracking: ${newId} (${permit.name})`,
          category: 'Create',
          component: 'System',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: '192.168.1.102'
        };

        return {
          permits: [newPermit, ...state.permits],
          auditLogs: [newLog, ...state.auditLogs]
        };
      }),

      deletePermit: (id) => set((state) => {
        const activeUser = state.usersList.find(u => u.role === state.sessionRole) || state.usersList[0];
        const newLog: AuditLog = {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          action: `Deleted permit tracking: ${id}`,
          category: 'Delete',
          component: 'System',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          ip: '192.168.1.102'
        };

        return {
          permits: state.permits.filter(p => p.id !== id),
          auditLogs: [newLog, ...state.auditLogs]
        };
      })
    }),
    {
      name: 'waveron-storage',
      partialize: (state) => ({
        topbarColor: state.topbarColor,
        menuColor: state.menuColor,
        sidebarSize: state.sidebarSize,
        sidebarOpen: state.sidebarOpen,
        settingsOpen: state.settingsOpen,
        agencyName: state.agencyName,
        brandColor: state.brandColor,
        properties: state.properties,
        agents: state.agents,
        customers: state.customers,
        closedDeals: state.closedDeals,
        calendarEvents: state.calendarEvents,
        comparedPropertyIds: state.comparedPropertyIds,
        entityNotes: state.entityNotes,
        reviews: state.reviews,
        documents: state.documents,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        agencyProfile: state.agencyProfile,
        sessionRole: state.sessionRole,
        usersList: state.usersList,
        rolePermissions: state.rolePermissions,
        commissionPlans: state.commissionPlans,
        agentPlanAssignments: state.agentPlanAssignments,
        auditLogs: state.auditLogs,
        expenses: state.expenses,
        milestones: state.milestones,
        permits: state.permits
      })
    }
  )
);
