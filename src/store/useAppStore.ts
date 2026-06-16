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
  initialCalendarEvents,
  initialReviews,
  initialNotes,
  initialDocuments
} from '@/data/mockTier2';

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
  
  resetSettings: () => void;
  resetStore: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
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
      
      agencyName: 'Lahomes',
      setAgencyName: (name) => set({ agencyName: name }),
      brandColor: '#604ae3',
      setBrandColor: (color) => set({ brandColor: color }),
      
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
    
        return {
          closedDeals: [newDeal, ...state.closedDeals],
          properties: updatedProperties,
          agents: updatedAgents,
          customers: updatedCustomers,
          calendarEvents: [closingEvent, ...state.calendarEvents]
        };
      }),
    
      updatePropertyStatus: (propertyId, status) => set((state) => ({
        properties: state.properties.map((p) => 
          p.id === propertyId ? { ...p, status } : p
        )
      })),

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
        agencyName: 'Lahomes',
        brandColor: '#604ae3'
      }),
      
      resetStore: () => set({
        topbarColor: 'light',
        menuColor: 'dark',
        sidebarSize: 'default',
        sidebarOpen: true,
        settingsOpen: false,
        agencyName: 'Lahomes',
        brandColor: '#604ae3',
        properties: initialProperties,
        agents: initialAgents,
        customers: initialCustomers,
        closedDeals: initialClosedDeals,
        calendarEvents: initialCalendarEvents,
        comparedPropertyIds: [],
        entityNotes: initialNotes,
        reviews: initialReviews,
        documents: initialDocuments
      })
    }),
    {
      name: 'lahomes-storage',
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
        documents: state.documents
      })
    }
  )
);
