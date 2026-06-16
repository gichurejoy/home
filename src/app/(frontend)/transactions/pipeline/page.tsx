"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { RecordDealModal } from "@/components/modals/RecordDealModal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { 
  Plus, 
  Search, 
  DollarSign, 
  MapPin, 
  User, 
  ArrowRightLeft, 
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface PipelineCard {
  id: string;
  customerName: string;
  customerAvatar: string;
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  agentName: string;
  value: number;
  stage: 'Lead' | 'Showing Booked' | 'Offer Made' | 'Under Contract' | 'Closed';
  lastUpdated: string;
}

const initialPipelineCards: PipelineCard[] = [
  {
    id: "PIPE-001",
    customerName: "Harland R. Orsini",
    customerAvatar: "/assets/images/users/avatar-7.jpg",
    propertyId: "PROP-003",
    propertyTitle: "Oakwood Heights Residence",
    agentId: "AGT-001",
    agentName: "Michael A. Miner",
    value: 450000,
    stage: "Lead",
    lastUpdated: "2026-06-12"
  },
  {
    id: "PIPE-002",
    customerName: "Sinikka Penttinen",
    customerAvatar: "/assets/images/users/avatar-3.jpg",
    propertyId: "PROP-004",
    propertyTitle: "Highrise Condo Plaza",
    agentId: "AGT-002",
    agentName: "Theresa T. Brose",
    value: 1250000,
    stage: "Showing Booked",
    lastUpdated: "2026-06-14"
  },
  {
    id: "PIPE-003",
    customerName: "David Padgett",
    customerAvatar: "/assets/images/users/avatar-8.jpg",
    propertyId: "PROP-001",
    propertyTitle: "Dvilla Residences Batu",
    agentId: "AGT-001",
    agentName: "Michael A. Miner",
    value: 893333,
    stage: "Offer Made",
    lastUpdated: "2026-06-15"
  },
  {
    id: "PIPE-004",
    customerName: "Jere Palmu",
    customerAvatar: "/assets/images/users/avatar-4.jpg",
    propertyId: "PROP-005",
    propertyTitle: "Weekend Villa MBH",
    agentId: "AGT-003",
    agentName: "Walter L. Calab",
    value: 1200000,
    stage: "Under Contract",
    lastUpdated: "2026-06-10"
  }
];

export default function PipelinePage() {
  const { properties, agents, customers } = useAppStore();
  const [pipelineCards, setPipelineCards] = useState<PipelineCard[]>(initialPipelineCards);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states for Record Deal splits
  const [isRecordDealOpen, setIsRecordDealOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(undefined);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined);
  const [selectedDeal, setSelectedDeal] = useState<PipelineCard | null>(null);

  // Modal states for Create New Deal Card
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newPropId, setNewPropId] = useState("");
  const [newAgentId, setNewAgentId] = useState("");
  const [newValue, setNewValue] = useState("");

  const stages: PipelineCard['stage'][] = [
    "Lead", 
    "Showing Booked", 
    "Offer Made", 
    "Under Contract", 
    "Closed"
  ];

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("text/plain", cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineCard['stage']) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("text/plain");
    const draggedCard = pipelineCards.find(c => c.id === cardId);
    
    if (draggedCard) {
      if (draggedCard.stage === targetStage) return;

      if (targetStage === "Closed") {
        // Pop open the Record Deal Modal
        setSelectedPropertyId(draggedCard.propertyId);
        setSelectedAgentId(draggedCard.agentId);
        setIsRecordDealOpen(true);
      }

      setPipelineCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, stage: targetStage, lastUpdated: new Date().toISOString().split('T')[0] } 
          : c
      ));
      
      toast.success(`Moved to ${targetStage}`);
    }
  };

  // Quick Action menu move
  const moveCard = (cardId: string, nextStage: PipelineCard['stage']) => {
    const card = pipelineCards.find(c => c.id === cardId);
    if (card) {
      if (nextStage === "Closed") {
        setSelectedPropertyId(card.propertyId);
        setSelectedAgentId(card.agentId);
        setIsRecordDealOpen(true);
      }
      setPipelineCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, stage: nextStage, lastUpdated: new Date().toISOString().split('T')[0] } 
          : c
      ));
      toast.success(`Moved to ${nextStage}`);
    }
  };

  // Create pipeline deal card
  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newPropId || !newAgentId || !newValue) {
      toast.error("Please fill in all details.");
      return;
    }

    const matchedProp = properties.find(p => p.id === newPropId);
    const matchedAgent = agents.find(a => a.id === newAgentId);

    const newCard: PipelineCard = {
      id: `PIPE-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustName,
      customerAvatar: "/assets/images/users/avatar-6.jpg",
      propertyId: newPropId,
      propertyTitle: matchedProp?.title || "Unknown Property",
      agentId: newAgentId,
      agentName: matchedAgent?.name || "Unknown Agent",
      value: Number(newValue),
      stage: "Lead",
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setPipelineCards(prev => [...prev, newCard]);
    setIsCreateCardOpen(false);
    toast.success("Deal card created!");

    // Clear form
    setNewCustName("");
    setNewPropId("");
    setNewAgentId("");
    setNewValue("");
  };

  // Filter pipeline cards by search query
  const filteredCards = pipelineCards.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.agentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground">Deals Pipeline</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Track property negotiations and drag leads to closing</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-1.5 outline-none focus:border-primary placeholder:text-muted-foreground/60"
            />
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
          </div>

          <button
            onClick={() => setIsCreateCardOpen(true)}
            className="bg-[#604ae3] hover:bg-[#503bc7] text-white text-[13px] font-bold px-4 py-1.5 rounded-[5px] flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" /> Add Deal
          </button>
        </div>
      </div>

      {/* ── Kanban Board Container ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageCards = filteredCards.filter(c => c.stage === stage);
          const stageTotal = stageCards.reduce((sum, c) => sum + c.value, 0);

          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
              className="bg-card/40 border border-border rounded-lg p-3 min-w-[220px] flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-foreground flex items-center gap-1.5">
                    {stage}
                    <span className="text-[11px] font-bold bg-muted text-muted-foreground px-1.5 py-0.2 rounded-full">
                      {stageCards.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    ${stageTotal.toLocaleString()} Volume
                  </p>
                </div>
                {stage === "Closed" && (
                  <button
                    onClick={() => {
                      setSelectedPropertyId(undefined);
                      setSelectedAgentId(undefined);
                      setIsRecordDealOpen(true);
                    }}
                    className="text-primary hover:text-primary-focus transition-colors"
                    title="Log Closed Deal Splits"
                  >
                    <DollarSign className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Cards Loop */}
              <div className="space-y-3 flex-1 overflow-y-auto min-h-[150px] pr-1">
                {stageCards.length === 0 ? (
                  <div className="border border-dashed border-border rounded-lg py-8 text-center text-[12px] text-muted-foreground bg-muted/5 font-medium select-none">
                    Drop deals here
                  </div>
                ) : (
                  stageCards.map(card => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id)}
                      onClick={() => setSelectedDeal(card)}
                      className="bg-card border border-border rounded-lg p-3.5 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer hover:bg-muted/10 group relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border">
                          {card.id}
                        </span>
                        
                        {/* Quick action stage mover overlay dropdown */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                          {stages.filter(s => s !== stage).slice(0, 2).map(nextS => (
                            <button
                              key={nextS}
                              onClick={(e) => {
                                e.stopPropagation();
                                moveCard(card.id, nextS);
                              }}
                              className="text-[9px] font-extrabold bg-primary/10 hover:bg-primary text-primary hover:text-white px-1 py-0.5 rounded border border-primary/20 transition-all"
                              title={`Move to ${nextS}`}
                            >
                              {nextS.split(" ")[0]} &rarr;
                            </button>
                          ))}
                        </div>
                      </div>

                      <h4 className="text-[13px] font-bold text-foreground mt-2 line-clamp-1 leading-snug">
                        {card.propertyTitle}
                      </h4>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40 text-[11px] text-muted-foreground font-semibold">
                        <span className="text-foreground font-bold text-[12.5px]">
                          ${card.value.toLocaleString()}
                        </span>
                        <span className="text-[10px]">
                          {card.lastUpdated}
                        </span>
                      </div>

                      {/* Customer & Agent mini attribution cards */}
                      <div className="flex items-center justify-between mt-3.5 gap-2 bg-muted/20 border border-border p-1.5 rounded-[5px]">
                        <div className="flex items-center gap-1.5 truncate">
                          <img src={card.customerAvatar} className="h-5.5 w-5.5 rounded-full object-cover border border-border" alt="" />
                          <span className="truncate text-[10.5px] font-bold text-foreground/80">{card.customerName}</span>
                        </div>
                        <div className="text-right text-[9.5px] font-medium text-muted-foreground">
                          Agent: {card.agentName.split(" ").pop()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Deal Card Modal ────────────────────────────────────── */}
      {isCreateCardOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-[16px] font-bold text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Create Deal Card
              </h3>
              <button
                onClick={() => setIsCreateCardOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <MoreHorizontal className="h-5 w-5 rotate-90" />
              </button>
            </div>

            <form onSubmit={handleCreateCard}>
              <div className="p-5 space-y-4 text-[13px]">
                {/* Customer Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Customer Name *
                  </label>
                  <select
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    required
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Choose Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Property */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Property *
                  </label>
                  <select
                    value={newPropId}
                    onChange={(e) => setNewPropId(e.target.value)}
                    required
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Choose Property</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                {/* Agent */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Responsible Agent *
                  </label>
                  <select
                    value={newAgentId}
                    onChange={(e) => setNewAgentId(e.target.value)}
                    required
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Choose Agent</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                {/* Deal value */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Deal Value ($) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500000"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="px-5 py-4 bg-muted/30 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateCardOpen(false)}
                  className="text-[12.5px] font-bold text-muted-foreground border border-border bg-card hover:bg-muted px-4 py-2 rounded-[5px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/95 text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] shadow-sm transition-all"
                >
                  Create Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Deal Details Modal ────────────────────────────────────── */}
      {selectedDeal && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/10">
              <div>
                <span className="text-[11px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {selectedDeal.id}
                </span>
                <h3 className="text-[16px] font-bold text-foreground mt-1.5 leading-snug">
                  {selectedDeal.propertyTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors text-[18px]"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-5 text-[13px]">
              {/* Deal Status & Value Row */}
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3.5 rounded-lg border border-border">
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase block">Stage</span>
                  <span className="text-[14px] font-extrabold text-foreground mt-0.5 inline-block">
                    {selectedDeal.stage}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase block">Deal Value</span>
                  <span className="text-[15px] font-black text-primary mt-0.5 inline-block">
                    ${selectedDeal.value.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Associations */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] border-b border-border pb-1">
                  Involved Parties & Property
                </h4>

                {/* Customer Row */}
                <div className="flex items-center justify-between bg-card border border-border/80 rounded-lg p-2.5 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <img src={selectedDeal.customerAvatar} className="h-9 w-9 rounded-full object-cover border border-border" alt="" />
                    <div>
                      <p className="text-[12px] font-bold text-foreground">{selectedDeal.customerName}</p>
                      <p className="text-[10px] text-muted-foreground">Client / Buyer</p>
                    </div>
                  </div>
                  {customers.find(c => c.name === selectedDeal.customerName) && (
                    <Link
                      href={`/customers/${customers.find(c => c.name === selectedDeal.customerName)?.id}`}
                      className="text-[11px] text-primary hover:underline font-bold"
                    >
                      View Profile &rarr;
                    </Link>
                  )}
                </div>

                {/* Agent Row */}
                <div className="flex items-center justify-between bg-card border border-border/80 rounded-lg p-2.5 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-soft-primary flex items-center justify-center text-primary text-[16px]">
                      <i className="ri-user-star-line" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground">{selectedDeal.agentName}</p>
                      <p className="text-[10px] text-muted-foreground">Responsible Agent</p>
                    </div>
                  </div>
                  {agents.find(a => a.name === selectedDeal.agentName) && (
                    <Link
                      href={`/agents/${agents.find(a => a.name === selectedDeal.agentName)?.id}`}
                      className="text-[11px] text-primary hover:underline font-bold"
                    >
                      View Profile &rarr;
                    </Link>
                  )}
                </div>

                {/* Property Row */}
                <div className="flex items-center justify-between bg-card border border-border/80 rounded-lg p-2.5 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-soft-info flex items-center justify-center text-info text-[16px]">
                      <i className="ri-building-line" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-foreground line-clamp-1">{selectedDeal.propertyTitle}</p>
                      <p className="text-[10px] text-muted-foreground">Target Listing</p>
                    </div>
                  </div>
                  <Link
                    href={`/properties/${selectedDeal.propertyId}`}
                    className="text-[11px] text-primary hover:underline font-bold shrink-0"
                  >
                    View Listing &rarr;
                  </Link>
                </div>
              </div>

              {/* Activity Info */}
              <div className="text-[11.5px] text-muted-foreground flex justify-between items-center pt-2 border-t border-border/40">
                <span>Last Updated: <strong>{selectedDeal.lastUpdated}</strong></span>
                <span>Type: <strong>Real Estate Deal</strong></span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
              {selectedDeal.stage !== "Closed" ? (
                <button
                  onClick={() => {
                    moveCard(selectedDeal.id, "Closed");
                    setSelectedDeal(null);
                  }}
                  className="bg-success hover:bg-success/95 text-white text-[12px] font-bold px-4 py-2 rounded-[5px] flex items-center gap-1 shadow-sm transition-all"
                >
                  <i className="ri-checkbox-circle-line text-[14px]" /> Close Deal
                </button>
              ) : (
                <span className="text-[12px] font-bold text-success flex items-center gap-1.5">
                  <i className="ri-checkbox-circle-fill text-[16px]" /> Completed & Closed
                </span>
              )}
              <button
                type="button"
                onClick={() => setSelectedDeal(null)}
                className="text-[12.5px] font-bold text-muted-foreground border border-border bg-card hover:bg-muted px-4 py-2 rounded-[5px] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Record Closed Deal Split Modal ──────────────────────────── */}
      <RecordDealModal
        isOpen={isRecordDealOpen}
        onClose={() => setIsRecordDealOpen(false)}
        defaultPropertyId={selectedPropertyId}
        defaultAgentId={selectedAgentId}
      />
    </div>
  );
}
