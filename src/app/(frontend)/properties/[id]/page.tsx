"use client";

import { useAppStore, RenovationExpense, ConstructionMilestone, ZoningPermit } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState } from "react";
import { RecordDealModal } from "@/components/modals/RecordDealModal";
import { EntityNotesCard } from "@/components/ui/EntityNotesCard";
import { DocumentManager } from "@/components/ui/DocumentManager";

export default function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { 
    properties, 
    expenses, 
    milestones, 
    permits,
    documents,
    addExpense,
    deleteExpense,
    updateMilestoneStatus,
    addPermit,
    deletePermit,
    addDocument
  } = useAppStore();
  const [isRecordDealOpen, setIsRecordDealOpen] = useState(false);

  // PLM suite local states
  const [activeTab, setActiveTab] = useState<'staging' | 'blueprint' | 'ledger' | 'timeline' | 'permits'>('staging');
  const [is3DTourOpen, setIs3DTourOpen] = useState(false);
  const [currentTourRoom, setCurrentTourRoom] = useState<'living' | 'kitchen' | 'bedroom' | 'terrace'>('living');
  const [blueprintZoom, setBlueprintZoom] = useState(1);
  const [newExpenseForm, setNewExpenseForm] = useState({ category: 'Materials' as RenovationExpense['category'], amount: '', description: '' });
  const [newPermitForm, setNewPermitForm] = useState({ name: '', authority: '', status: 'Applied' as ZoningPermit['status'], expiryDate: '' });
  // Resolve both direct match (PROP-001) and short index/numeric matches (1, 01, etc.)
  const property = properties.find((p) => {
    const idLower = resolvedParams.id.toLowerCase();
    const pIdLower = p.id.toLowerCase();
    // match: "PROP-001" or "PROP-011"
    if (pIdLower === idLower) return true;
    // match: "1" matching "PROP-001", "11" matching "PROP-011"
    const numericPart = pIdLower.replace("prop-", "").replace(/^0+/, "");
    if (numericPart === idLower.replace(/^0+/, "")) return true;
    return false;
  });

  const [targetResaleVal, setTargetResaleVal] = useState<number>(() => {
    return property ? property.price + 150000 : 0;
  });

  // CAD Blueprint Upload & Switcher states
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>("default");
  const [isUploadingBlueprint, setIsUploadingBlueprint] = useState(false);
  const [blueprintUploadProgress, setBlueprintUploadProgress] = useState(0);
  const [uploadedBlueprintName, setUploadedBlueprintName] = useState("");

  const handleBlueprintUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (!property) return;
      const file = files[0];
      setIsUploadingBlueprint(true);
      setBlueprintUploadProgress(0);
      setUploadedBlueprintName(file.name);

      const interval = setInterval(() => {
        setBlueprintUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploadingBlueprint(false);
            
            // Add to store
            addDocument({
              entityId: property.id,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              category: "Blueprint",
              url: "#"
            });
            
            toast.success("CAD Blueprint uploaded successfully.");
            return 100;
          }
          return prev + 25;
        });
      }, 150);
    }
  };

  // Zoning Permit Document Upload states
  const [isUploadingPermitDoc, setIsUploadingPermitDoc] = useState(false);
  const [permitDocProgress, setPermitDocProgress] = useState(0);
  const [attachedPermitDocName, setAttachedPermitDocName] = useState("");

  const handlePermitDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setIsUploadingPermitDoc(true);
      setPermitDocProgress(0);
      setAttachedPermitDocName(file.name);

      const interval = setInterval(() => {
        setPermitDocProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploadingPermitDoc(false);
            toast.success(`Attached document: ${file.name}`);
            return 100;
          }
          return prev + 25;
        });
      }, 150);
    }
  };

  // Client states for AI Staging component
  const [selectedRoom, setSelectedRoom] = useState<"living" | "bedroom">("living");
  const [selectedStyle, setSelectedStyle] = useState<"scandinavian" | "industrial" | "boho" | "renovated">("scandinavian");
  const [isStaging, setIsStaging] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  // Auto-run animation when clicking staging
  const handleStartStaging = () => {
    setIsStaging(true);
    setStageProgress(0);
    setStageFinished(false);
    
    // Simulate generation logs
    const interval = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsStaging(false);
          setStageFinished(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  if (!property) {
    notFound();
  }

  const isSold = property.status === "Sold";

  // Staging images configuration
  const roomEmptyImg = "/assets/images/properties/room_empty.png";
  const roomStagedImg = "/assets/images/properties/room_staged.png";

  // Compute CSS filter based on selectedStyle to make it look dynamically changed!
  const getStagingFilter = () => {
    switch (selectedStyle) {
      case "industrial":
        return "hue-rotate(30deg) brightness(0.9) contrast(1.15) sepia(0.1)";
      case "boho":
        return "sepia(0.2) saturate(1.2) brightness(0.95)";
      case "renovated":
        return "contrast(1.2) saturate(1.05) brightness(1.02)";
      case "scandinavian":
      default:
        return "none";
    }
  };

  const getStyleLabel = () => {
    switch (selectedStyle) {
      case "industrial": return "Industrial Loft";
      case "boho": return "Boho Chic";
      case "renovated": return "Modern Renovation";
      case "scandinavian": default: return "Scandinavian Modern";
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Property Overview</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">View details of {property.title}</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Real Estate</Link>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Property Overview</li>
        </ol>
      </div>

      {/* Main Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Owner Info & Tour Scheduler (col-xl-3) */}
        <div className="lg:col-span-4 xl:col-span-3 col-span-12 space-y-6">
          
          {/* Owner details card */}
          <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="px-5 py-4 bg-muted/10 border-b border-border">
              <h4 className="text-[15px] font-bold text-foreground">Property Owner Details</h4>
            </div>
            
            <div className="p-5 text-center">
              <img
                src={property.owner.avatar}
                alt={property.owner.name}
                className="h-24 w-24 rounded-full border-[3px] border-muted mx-auto object-cover shadow-sm"
              />
              <h4 className="text-[15.5px] font-bold text-foreground mt-3">{property.owner.name}</h4>
              <p className="text-[12.5px] text-muted-foreground font-semibold">(Owner)</p>

              {/* Social links */}
              <div className="flex justify-center gap-2 mt-4">
                <a href="#!" className="h-8 w-8 rounded-full bg-muted/60 text-[#3b5998] hover:bg-[#3b5998] hover:text-white flex items-center justify-center text-[16px] transition-all">
                  <i className="ri-facebook-fill" />
                </a>
                <a href="#!" className="h-8 w-8 rounded-full bg-muted/60 text-[#e1306c] hover:bg-[#e1306c] hover:text-white flex items-center justify-center text-[16px] transition-all">
                  <i className="ri-instagram-fill" />
                </a>
                <a href="#!" className="h-8 w-8 rounded-full bg-muted/60 text-[#1da1f2] hover:bg-[#1da1f2] hover:text-white flex items-center justify-center text-[16px] transition-all">
                  <i className="ri-twitter-fill" />
                </a>
                <a href="#!" className="h-8 w-8 rounded-full bg-muted/60 text-[#25d366] hover:bg-[#25d366] hover:text-white flex items-center justify-center text-[16px] transition-all">
                  <i className="ri-whatsapp-fill" />
                </a>
              </div>
            </div>

            <div className="p-4 bg-muted/10 border-t border-border">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${property.owner.phone}`}
                  className="bg-[#604ae3] text-white text-[12.5px] font-bold py-2 px-3 rounded-[5px] flex items-center justify-center gap-1 hover:bg-[#503bc7] transition-all text-center"
                >
                  <iconify-icon icon="solar:phone-calling-bold-duotone" className="text-[16px]" /> Call Us
                </a>
                <a
                  href={`mailto:${property.owner.email}`}
                  className="bg-[#0acf97] text-white text-[12.5px] font-bold py-2 px-3 rounded-[5px] flex items-center justify-center gap-1 hover:bg-[#09b682] transition-all text-center"
                >
                  <iconify-icon icon="solar:chat-round-dots-bold-duotone" className="text-[15px]" /> Message
                </a>
              </div>
            </div>
          </div>

          {/* Schedule A Tour card */}
          <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="px-5 py-4 bg-muted/10 border-b border-border">
              <h4 className="text-[15px] font-bold text-foreground">Schedule A Tour</h4>
            </div>
            
            <form className="p-5 space-y-3.5">
              <div>
                <input
                  type="date"
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                />
              </div>
              <div>
                <input
                  type="time"
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Number"
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
                />
              </div>
              <div>
                <textarea
                  rows={4}
                  placeholder="Message"
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#604ae3] text-white text-[13.5px] font-semibold py-2 rounded-[5px] hover:bg-[#503bc7] active:scale-[0.98] transition-all duration-150"
                >
                  Send Information
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column: Property Details & Showcase (col-xl-9) */}
        <div className="lg:col-span-8 xl:col-span-9 col-span-12 space-y-6">
          
          {/* Main overview card */}
          <div className="bg-card border border-border rounded-[8px] overflow-hidden p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-4">
            
            {/* Main Showcase Image */}
            <div className="relative overflow-hidden rounded bg-muted/20 aspect-[16/9]">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 z-10">
                <span className={`text-[12.5px] font-bold px-2 py-0.5 rounded text-white shadow-sm ${
                  property.status === "For Rent" ? "bg-[#0acf97]" :
                  property.status === "For Sale" ? "bg-[#f9bc0b]" :
                  "bg-[#ff5b5b]"
                }`}>
                  {property.status}
                </span>
              </span>
            </div>

            {/* Title, Address & Action buttons */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-foreground leading-tight">{property.title}</h2>
                <p className="text-[13px] text-muted-foreground flex items-center gap-1 mt-1.5 font-medium">
                  <iconify-icon icon="solar:map-point-wave-bold-duotone" className="text-[17px] text-[#604ae3]" />
                  {property.location}
                </p>
              </div>

              {/* Action circle buttons */}
              <div className="flex items-center gap-1.5">
                <button type="button" className="h-9 w-9 rounded-full bg-muted/60 text-foreground hover:bg-[#604ae3] hover:text-white flex items-center justify-center transition-all">
                  <iconify-icon icon="solar:share-bold-duotone" className="text-[18px] align-middle" />
                </button>
                <button type="button" className="h-9 w-9 rounded-full bg-muted/60 text-[#ff5b5b] hover:bg-[#ff5b5b] hover:text-white flex items-center justify-center transition-all">
                  <iconify-icon icon="solar:heart-angle-bold-duotone" className="text-[18px] align-middle" />
                </button>
                <button type="button" className="h-9 w-9 rounded-full bg-muted/60 text-[#f9bc0b] hover:bg-[#f9bc0b] hover:text-white flex items-center justify-center transition-all">
                  <iconify-icon icon="solar:star-bold-duotone" className="text-[18px] align-middle" />
                </button>
              </div>
            </div>

            {/* Price Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-[#0acf97]/15 flex items-center justify-center">
                  <iconify-icon icon="solar:wallet-money-bold-duotone" className="text-[18px] text-[#0acf97]" />
                </div>
                <p className={`text-[18px] font-bold ${isSold ? "text-muted-foreground line-through decoration-muted-foreground/60" : "text-foreground"}`}>
                  ${property.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              
              {isSold ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-[13px] font-bold bg-soft-danger text-danger border border-danger/10">
                  <i className="ri-checkbox-circle-fill text-[15px]" /> Closed Deal & Sold
                </span>
              ) : (
                <button
                  id="record-deal-detail-btn"
                  onClick={() => setIsRecordDealOpen(true)}
                  className="bg-[#0acf97] hover:bg-[#0acf97]/90 text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
                >
                  <i className="ri-exchange-dollar-line text-[15px]" /> Record Sale & Log Commission
                </button>
              )}
            </div>

            {/* Specifications Ribbon (dashed border box) */}
            <div className="border border-dashed border-border rounded p-3.5 bg-muted/10">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 text-center">
                <div className="md:border-r border-border py-1 flex flex-col justify-center items-center">
                  <p className="text-[13px] text-muted-foreground font-semibold flex items-center gap-1 justify-center">
                    <iconify-icon icon="solar:bed-broken" className="text-[16px] text-primary" />
                    {property.bedrooms} Bedroom
                  </p>
                </div>
                <div className="border-r-0 md:border-r border-border py-1 flex flex-col justify-center items-center">
                  <p className="text-[13px] text-muted-foreground font-semibold flex items-center gap-1 justify-center">
                    <iconify-icon icon="solar:bath-broken" className="text-[16px] text-primary" />
                    {property.bathrooms} Bathrooms
                  </p>
                </div>
                <div className="md:border-r border-border py-1 flex flex-col justify-center items-center">
                  <p className="text-[13px] text-muted-foreground font-semibold flex items-center gap-1 justify-center">
                    <iconify-icon icon="solar:scale-broken" className="text-[16px] text-primary" />
                    {property.area}sqft
                  </p>
                </div>
                <div className="border-r-0 md:border-r border-border py-1 flex flex-col justify-center items-center">
                  <p className="text-[13px] text-muted-foreground font-semibold flex items-center gap-1 justify-center">
                    <iconify-icon icon="solar:double-alt-arrow-up-broken" className="text-[16px] text-primary" />
                    {property.floors} Floor
                  </p>
                </div>
                <div className="md:border-r border-border py-1 flex flex-col justify-center items-center">
                  <p className="text-[13px] text-muted-foreground font-semibold flex items-center gap-1 justify-center">
                    <span className="badge bg-muted text-foreground border border-border text-[11px] px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                      <i className="ri-star-fill text-[#f9bc0b]" /> {property.rating}
                    </span>
                    Review
                  </p>
                </div>
                <div className="py-1 flex flex-col justify-center items-center">
                  <p className="text-[13px] text-muted-foreground font-semibold flex items-center gap-1 justify-center">
                    <iconify-icon icon="solar:check-circle-broken" className="text-[16px] text-primary" />
                    {property.status}
                  </p>
                </div>
              </div>
            </div>

            {/* ── B2B SaaS Premium Feature: Waveron Property Lifecycle Suite ── */}
            <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.08)] mt-6 space-y-4">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 border-b border-border pb-3">
                <div>
                  <span className="bg-[#604ae3]/10 text-[#604ae3] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[4px] tracking-wider">
                    Waveron PLM Premium Suite
                  </span>
                  <h4 className="text-[15.5px] font-bold text-foreground mt-1 flex items-center gap-1.5">
                    <i className="ri-building-line text-[#604ae3] text-[18px]" /> Property Lifecycle Workspace
                  </h4>
                </div>
                
                {/* Tab Switcher Buttons */}
                <div className="flex flex-wrap gap-1 bg-muted/30 p-1 border border-border rounded-lg">
                  {([
                    { id: 'staging', label: 'AI Staging', icon: 'ri-magic-line' },
                    { id: 'blueprint', label: 'CAD Blueprints', icon: 'ri-draft-line' },
                    { id: 'ledger', label: 'Cost Ledger', icon: 'ri-calculator-line' },
                    { id: 'timeline', label: 'Gantt Timeline', icon: 'ri-time-line' },
                    { id: 'permits', label: 'Zoning & Permits', icon: 'ri-file-shield-line' }
                  ] as const).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`px-3 py-1.5 rounded-[6px] text-[11.5px] font-bold flex items-center gap-1 transition-all ${
                        activeTab === t.id
                          ? 'bg-[#604ae3] text-white shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <i className={t.icon} /> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Tab 1: AI Virtual Staging ── */}
              {activeTab === 'staging' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Room selector */}
                    <div className="md:col-span-5 space-y-2">
                      <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block">
                        1. Select Room
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRoom("living");
                            setStageFinished(false);
                          }}
                          className={`flex-1 text-center py-2 px-3 rounded-[5px] text-[13px] font-bold transition-all border ${
                            selectedRoom === "living"
                              ? "bg-[#604ae3] text-white border-[#604ae3] shadow-md"
                              : "bg-muted/30 text-muted-foreground border-border hover:bg-muted"
                          }`}
                        >
                          Living Room
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRoom("bedroom");
                            setStageFinished(false);
                          }}
                          className={`flex-1 text-center py-2 px-3 rounded-[5px] text-[13px] font-bold transition-all border ${
                            selectedRoom === "bedroom"
                              ? "bg-[#604ae3] text-white border-[#604ae3] shadow-md"
                              : "bg-muted/30 text-muted-foreground border-border hover:bg-muted"
                          }`}
                        >
                          Master Bedroom
                        </button>
                      </div>
                    </div>

                    {/* Style selector */}
                    <div className="md:col-span-4 space-y-2">
                      <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block">
                        2. Select Style
                      </span>
                      <select
                        value={selectedStyle}
                        onChange={(e) => {
                          setSelectedStyle(e.target.value as typeof selectedStyle);
                          setStageFinished(false);
                        }}
                        className="w-full text-[13px] border border-border bg-muted/30 text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors font-semibold"
                      >
                        <option value="scandinavian">Scandinavian Modern</option>
                        <option value="industrial">Industrial Loft</option>
                        <option value="boho">Boho Chic</option>
                        <option value="renovated">Modern Renovation (Hardwood)</option>
                      </select>
                    </div>

                    {/* Render button */}
                    <div className="md:col-span-3 pt-6 md:pt-0">
                      <button
                        type="button"
                        onClick={handleStartStaging}
                        disabled={isStaging}
                        className="w-full bg-[#0acf97] hover:bg-[#0acf97]/95 disabled:bg-muted disabled:text-muted-foreground text-white text-[13.5px] font-bold py-2.5 px-4 rounded-[5px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                      >
                        <iconify-icon icon="solar:wand-broken" className="text-[17px]" />
                        {isStaging ? "Generating..." : "Run AI Staging"}
                      </button>
                    </div>
                  </div>

                  {/* Viewer Area */}
                  <div className="border border-border rounded-[8px] bg-muted/10 p-3.5 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                    {isStaging && (
                      <div className="absolute inset-0 bg-background/85 z-30 flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="h-10 w-10 border-[3px] border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                        <div className="text-center">
                          <p className="text-[14px] font-bold text-foreground animate-pulse">
                            Analyzing structural geometry...
                          </p>
                          <p className="text-[12px] text-muted-foreground mt-1">
                            Applying stable diffusion style weights ({stageProgress}%)
                          </p>
                        </div>
                        <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#604ae3] transition-all duration-150" style={{ width: `${stageProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {!stageFinished && !isStaging && (
                      <div className="text-center py-8 max-w-sm space-y-3">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-[#604ae3]">
                          <iconify-icon icon="solar:photo-album-bold-duotone" style={{ fontSize: "28px" }} />
                        </div>
                        <h5 className="text-[14px] font-bold text-foreground">Interactive Virtual Staging</h5>
                        <p className="text-[12px] text-muted-foreground leading-relaxed">
                          Select a room template and choose a target styling from the menu, then click &quot;Run AI Staging&quot; to render a simulated comparison.
                        </p>
                      </div>
                    )}

                    {stageFinished && !isStaging && (
                      <div className="w-full space-y-3.5">
                        <div className="flex items-center justify-between text-[12.5px] font-semibold text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-red-500 block" /> Empty Room
                          </span>
                          <span className="text-foreground font-bold">
                            Style: {getStyleLabel()}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500 block" /> Virtually Staged
                          </span>
                        </div>

                        {/* Image comparison slider using clipPath */}
                        <div className="relative w-full aspect-[16/9] rounded-[6px] overflow-hidden border border-border select-none shadow-sm">
                          {/* Background (Right side): Virtually Staged image */}
                          <img
                            src={selectedRoom === "living" ? roomStagedImg : roomEmptyImg}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ filter: getStagingFilter() }}
                            alt="Staged"
                          />
                          
                          {/* Foreground (Left side): Empty image, clipped to slider position */}
                          <img
                            src={roomEmptyImg}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                            alt="Empty"
                          />

                          {/* Slider separator line and handle */}
                          <div
                            className="absolute inset-y-0 w-0.5 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(0,0,0,0.6)] z-10"
                            style={{ left: `${sliderPos}%` }}
                          >
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white border border-border shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center text-foreground hover:scale-105 active:scale-95 transition-all">
                              <i className="ri-arrow-left-right-line text-[14px]" />
                            </div>
                          </div>

                          {/* Hidden HTML range slider positioned absolute on top to handle drag interactions */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPos}
                            onChange={(e) => setSliderPos(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                          />
                        </div>
                        <p className="text-[12px] text-muted-foreground text-center italic">
                          Drag the slider left or right to compare the empty space with the staged design.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Tab 2: Blueprints & CAD ── */}
              {activeTab === 'blueprint' && (() => {
                const propertyBlueprints = documents.filter(d => d.entityId === property.id && d.category === 'Blueprint');
                return (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <h5 className="text-[14px] font-bold text-foreground">Interactive Architectural CAD Blueprints</h5>
                        <p className="text-[12px] text-muted-foreground">Review structural blueprints, scale ratios, and zoning borders.</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => setBlueprintZoom(prev => Math.max(0.5, prev - 0.25))}
                          className="h-8 w-8 rounded border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center transition-colors cursor-pointer"
                          title="Zoom Out"
                        >
                          <i className="ri-zoom-out-line" />
                        </button>
                        <span className="text-[12px] font-bold text-foreground w-12 text-center">{Math.round(blueprintZoom * 100)}%</span>
                        <button 
                          onClick={() => setBlueprintZoom(prev => Math.min(2.0, prev + 0.25))}
                          className="h-8 w-8 rounded border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center transition-colors cursor-pointer"
                          title="Zoom In"
                        >
                          <i className="ri-zoom-in-line" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (selectedBlueprintId === "default") {
                              alert("Simulating blueprint download: " + property.id + "_CAD_Schematic.pdf");
                            } else {
                              const activeBp = propertyBlueprints.find(b => b.id === selectedBlueprintId);
                              alert("Downloading custom blueprint: " + activeBp?.name);
                            }
                          }}
                          className="bg-primary text-primary-foreground text-[12px] font-bold h-8 px-3 rounded flex items-center gap-1 hover:bg-primary/95 transition-colors cursor-pointer"
                        >
                          <i className="ri-download-2-line" /> Download CAD
                        </button>
                      </div>
                    </div>

                    {/* CAD Canvas Simulation */}
                    <div className="border border-border rounded-lg bg-slate-950 dark:bg-slate-900 aspect-[16/9] flex items-center justify-center relative overflow-hidden select-none">
                      {selectedBlueprintId === "default" ? (
                        <div 
                          className="w-full h-full p-6 flex flex-col justify-between transition-transform duration-200"
                          style={{ transform: `scale(${blueprintZoom})` }}
                        >
                          {/* Grid overlay */}
                          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                          
                          {/* Vector Blueprint Mock */}
                          <svg className="w-full h-full opacity-70 stroke-primary stroke-[1.5] fill-none" viewBox="0 0 600 350">
                            {/* Outer Walls */}
                            <rect x="20" y="20" width="560" height="310" rx="4" strokeWidth="3" />
                            {/* Room Divisions */}
                            <line x1="200" y1="20" x2="200" y2="330" />
                            <line x1="200" y1="180" x2="580" y2="180" />
                            <line x1="380" y1="180" x2="380" y2="330" />
                            {/* Doors */}
                            <path d="M 200 120 A 40 40 0 0 1 240 160" strokeDasharray="3 3" />
                            <path d="M 380 240 A 40 40 0 0 1 340 280" strokeDasharray="3 3" />
                            {/* Labels */}
                            <text x="110" y="170" fill="currentColor" stroke="none" className="text-[12px] font-bold fill-primary/80 text-center" textAnchor="middle">GARAGE / STORAGE</text>
                            <text x="390" y="100" fill="currentColor" stroke="none" className="text-[12px] font-bold fill-primary/80 text-center" textAnchor="middle">MASTER BEDROOM</text>
                            <text x="290" y="260" fill="currentColor" stroke="none" className="text-[12px] font-bold fill-primary/80 text-center" textAnchor="middle">LIVING AREA</text>
                            <text x="480" y="260" fill="currentColor" stroke="none" className="text-[12px] font-bold fill-primary/80 text-center" textAnchor="middle">KITCHEN & BALCONY</text>
                            {/* Dimension lines */}
                            <line x1="20" y1="340" x2="580" y2="340" strokeWidth="1" strokeDasharray="2 2" />
                            <text x="300" y="348" fill="currentColor" stroke="none" className="text-[9px] fill-muted-foreground text-center" textAnchor="middle">54.00 m</text>
                          </svg>

                          {/* Scale indicator */}
                          <div className="absolute bottom-4 left-4 bg-black/60 text-emerald-400 text-[10px] font-mono px-2.5 py-1 rounded border border-emerald-400/20 z-10">
                            SCALE 1 : 120 | CAD VERSION 2.8 | PLOT AREA: {property.area} SQFT
                          </div>
                        </div>
                      ) : (
                        (() => {
                          const activeBp = propertyBlueprints.find(b => b.id === selectedBlueprintId);
                          return (
                            <div className="w-full h-full p-6 flex flex-col justify-between items-center text-center text-white relative z-10">
                              {/* Grid overlay */}
                              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                              
                              <div className="my-auto space-y-4 max-w-md">
                                <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                                  <i className="ri-file-shield-2-line text-[32px]" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-[16px] font-bold text-foreground">{activeBp?.name || "Custom CAD Blueprint"}</h4>
                                  <p className="text-[12.5px] text-muted-foreground">Successfully scanned & compiled by Waveron Engine</p>
                                </div>
                                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-[12px] font-mono text-left space-y-1 text-slate-300">
                                  <div>• FILE SIZE: {activeBp?.size}</div>
                                  <div>• SCANNED ON: {activeBp?.uploadedAt}</div>
                                  <div>• RESOLUTION: 4096 x 3112 px</div>
                                  <div>• STATUS: Approved (Regulatory Checked)</div>
                                </div>
                              </div>

                              <div className="bg-black/60 text-emerald-400 text-[10px] font-mono px-2.5 py-1 rounded border border-emerald-400/20 z-10 self-start">
                                ACTIVE DOCUMENT: {activeBp?.name}
                              </div>
                            </div>
                          );
                        })()
                      )}
                      
                      {/* Matterport Simulation Button */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center pb-6 pointer-events-none">
                        <button
                          type="button"
                          onClick={() => setIs3DTourOpen(true)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-lg active:scale-[0.98] transition-all cursor-pointer pointer-events-auto"
                        >
                          <i className="ri-walk-line text-[16px]" /> Open Interactive 3D Matterport Tour
                        </button>
                      </div>
                    </div>

                    {/* Custom Blueprints List & Selector */}
                    <div className="bg-muted/10 border border-border rounded-lg p-4 mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h6 className="text-[13px] font-bold text-foreground">Custom Blueprint Documents</h6>
                        <label htmlFor="blueprint-upload-input" className="bg-[#604ae3] text-white text-[11px] font-bold py-1.5 px-3 rounded flex items-center gap-1.5 hover:bg-[#503bc7] transition-all cursor-pointer">
                          <i className="ri-upload-2-line" /> Upload Custom Blueprint
                          <input
                            id="blueprint-upload-input"
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleBlueprintUpload}
                            disabled={isUploadingBlueprint}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {isUploadingBlueprint && (
                        <div className="space-y-2 p-3 bg-muted/20 border border-border rounded-lg animate-in fade-in">
                          <div className="flex justify-between text-[11.5px] font-bold text-foreground">
                            <span>Uploading custom blueprint: {uploadedBlueprintName}</span>
                            <span>{blueprintUploadProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-[#604ae3] transition-all duration-150" style={{ width: `${blueprintUploadProgress}%` }} />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {/* Default Switcher Button */}
                        <button
                          onClick={() => setSelectedBlueprintId("default")}
                          className={`px-3 py-2 rounded-lg border text-[12px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            selectedBlueprintId === "default"
                              ? "bg-[#604ae3]/10 text-[#604ae3] border-[#604ae3]/20 shadow-sm"
                              : "bg-muted/30 text-muted-foreground border-border hover:bg-muted"
                          }`}
                        >
                          <i className="ri-draft-line" /> Default Interactive Schematic
                        </button>

                        {/* Custom Uploaded Switcher Buttons */}
                        {propertyBlueprints.map((bp) => (
                          <button
                            key={bp.id}
                            onClick={() => setSelectedBlueprintId(bp.id)}
                            className={`px-3 py-2 rounded-lg border text-[12px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                              selectedBlueprintId === bp.id
                                ? "bg-[#604ae3]/10 text-[#604ae3] border-[#604ae3]/20 shadow-sm"
                                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted"
                            }`}
                          >
                            <i className="ri-file-pdf-line text-red-500" /> {bp.name} ({bp.size})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Tab 3: Renovation Ledger ── */}
              {activeTab === 'ledger' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h5 className="text-[14px] font-bold text-foreground">Renovation Cost Ledger & ROI Estimator</h5>
                    <p className="text-[12px] text-muted-foreground">Track property upgrade expenses, contractor materials, and calculate target ROI.</p>
                  </div>

                  {/* Dynamic ROI Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-muted/15 border border-border p-3.5 rounded-lg text-center">
                      <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Base Price</p>
                      <h4 className="text-[16px] font-black text-foreground">${property.price.toLocaleString()}</h4>
                    </div>
                    <div className="bg-muted/15 border border-border p-3.5 rounded-lg text-center">
                      <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Total Upgrades</p>
                      <h4 className="text-[16px] font-black text-primary">
                        ${expenses.filter(e => e.propertyId === property.id).reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                      </h4>
                    </div>
                    <div className="bg-muted/15 border border-border p-3.5 rounded-lg text-center">
                      <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Target Resale</p>
                      <div className="flex items-center justify-center gap-1 mt-0.5 max-w-[140px] mx-auto">
                        <span className="text-[14px] font-bold text-foreground">$</span>
                        <input
                          type="number"
                          value={targetResaleVal}
                          onChange={(e) => setTargetResaleVal(Number(e.target.value))}
                          className="w-full text-[14px] font-black text-foreground bg-transparent border-b border-border text-center focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="bg-success/5 border border-success/20 p-3.5 rounded-lg text-center">
                      {(() => {
                        const totalUpgrade = expenses.filter(e => e.propertyId === property.id).reduce((sum, e) => sum + e.amount, 0);
                        const totalCost = property.price + totalUpgrade;
                        const grossProfit = targetResaleVal - totalCost;
                        const roi = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;
                        return (
                          <>
                            <p className="text-[11px] text-success uppercase font-bold tracking-wider mb-0.5">Est. ROI (%)</p>
                            <h4 className="text-[16px] font-black text-success">
                              {roi.toFixed(1)}% <span className="text-[11.5px] font-normal text-muted-foreground">(${Math.round(grossProfit / 1000)}k profit)</span>
                            </h4>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Expenses List & Add Form Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* List Table */}
                    <div className="lg:col-span-8 space-y-3">
                      <h6 className="text-[13px] font-bold text-foreground">Logged Repair & Styling Expenses</h6>
                      <div className="overflow-x-auto border border-border rounded-lg bg-card">
                        <table className="w-full text-left text-[12.5px]">
                          <thead className="bg-[#f8f9fa] dark:bg-[#1f293d] border-b border-border text-muted-foreground font-bold uppercase text-[10.5px]">
                            <tr>
                              <th className="px-4 py-2">Category</th>
                              <th className="px-4 py-2">Description</th>
                              <th className="px-4 py-2 text-right">Cost</th>
                              <th className="px-4 py-2 text-right w-10">Delete</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-foreground">
                            {expenses.filter(e => e.propertyId === property.id).length === 0 ? (
                              <tr>
                                <td colSpan={4} className="text-center py-8 text-muted-foreground font-medium">No renovation expenses logged yet.</td>
                              </tr>
                            ) : (
                              expenses.filter(e => e.propertyId === property.id).map((exp) => (
                                <tr key={exp.id} className="hover:bg-muted/10 transition-colors">
                                  <td className="px-4 py-2.5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                      exp.category === "Materials" ? "bg-blue-500/10 text-blue-500" :
                                      exp.category === "Labor" ? "bg-amber-500/10 text-amber-500" :
                                      exp.category === "Permits" ? "bg-purple-500/10 text-purple-500" :
                                      "bg-emerald-500/10 text-emerald-500"
                                    }`}>
                                      {exp.category}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-muted-foreground font-medium">{exp.description}</td>
                                  <td className="px-4 py-2.5 text-right font-bold text-foreground">${exp.amount.toLocaleString()}</td>
                                  <td className="px-4 py-2.5 text-right">
                                    <button
                                      type="button"
                                      onClick={() => deleteExpense(exp.id)}
                                      className="text-danger hover:text-danger-foreground hover:bg-danger/10 h-7 w-7 rounded flex items-center justify-center transition-colors mx-auto cursor-pointer"
                                    >
                                      <i className="ri-delete-bin-line" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Add Form */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newExpenseForm.description.trim() || !newExpenseForm.amount) return;
                        addExpense({
                          propertyId: property.id,
                          category: newExpenseForm.category,
                          amount: Number(newExpenseForm.amount),
                          date: new Date().toISOString().split('T')[0],
                          description: newExpenseForm.description
                        });
                        setNewExpenseForm({ category: 'Materials', amount: '', description: '' });
                      }}
                      className="lg:col-span-4 bg-muted/15 border border-border p-4 rounded-lg space-y-3 flex flex-col justify-between"
                    >
                      <h6 className="text-[13px] font-bold text-foreground">Log Upgrade Expense</h6>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Category</label>
                          <select
                            value={newExpenseForm.category}
                            onChange={(e) => setNewExpenseForm({ ...newExpenseForm, category: e.target.value as RenovationExpense['category'] })}
                            className="w-full text-[12.5px] border border-border bg-card text-foreground rounded px-2.5 py-1.5 outline-none focus:border-primary font-medium"
                          >
                            <option value="Materials">Materials</option>
                            <option value="Labor">Labor</option>
                            <option value="Permits">Permits</option>
                            <option value="Styling">Styling & Design</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Amount ($)</label>
                          <input
                            type="number"
                            required
                            value={newExpenseForm.amount}
                            onChange={(e) => setNewExpenseForm({ ...newExpenseForm, amount: e.target.value })}
                            className="w-full text-[12.5px] border border-border bg-card text-foreground rounded px-2.5 py-1.5 outline-none focus:border-primary font-medium"
                            placeholder="e.g. 5200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Description</label>
                          <input
                            type="text"
                            required
                            value={newExpenseForm.description}
                            onChange={(e) => setNewExpenseForm({ ...newExpenseForm, description: e.target.value })}
                            className="w-full text-[12.5px] border border-border bg-card text-foreground rounded px-2.5 py-1.5 outline-none focus:border-primary font-medium"
                            placeholder="e.g. Hardwood floor setup"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#604ae3] text-white text-[12.5px] font-bold py-2 rounded hover:bg-[#503bc7] transition-all mt-3 cursor-pointer"
                      >
                        Add Expense & Update ROI
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ── Tab 4: Construction Timeline ── */}
              {activeTab === 'timeline' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h5 className="text-[14px] font-bold text-foreground">Construction & Renovation Gantt Timeline</h5>
                    <p className="text-[12px] text-muted-foreground">Track architectural milestones and trigger active listings on completion.</p>
                  </div>

                  {/* Milestone Vertical Timeline */}
                  <div className="relative border-l border-border pl-6 ml-4 space-y-6 py-2">
                    {milestones.filter(m => m.propertyId === property.id).sort((a, b) => a.order - b.order).map((mil) => {
                      const isCompleted = mil.status === 'Completed';
                      const isInProgress = mil.status === 'In Progress';
                      return (
                        <div key={mil.id} className="relative">
                          {/* Timeline node icon */}
                          <div className={`absolute -left-10 top-0.5 h-8 w-8 rounded-full border-[3px] bg-card flex items-center justify-center z-10 transition-all ${
                            isCompleted ? "border-success text-success" :
                            isInProgress ? "border-primary text-primary animate-pulse" :
                            "border-border text-muted-foreground"
                          }`}>
                            {isCompleted ? <i className="ri-check-line text-[15px] font-bold" /> :
                             isInProgress ? <i className="ri-play-line text-[15px]" /> :
                             <span className="text-[11px] font-bold">{mil.order}</span>}
                          </div>

                          {/* Milestone details */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h6 className="text-[13.5px] font-bold text-foreground">{mil.name}</h6>
                              <p className="text-[12px] text-muted-foreground mt-0.5">
                                {isCompleted ? "Phase finished and signed off by Developer." :
                                 isInProgress ? "Currently active contractor focus area." :
                                 "Awaiting completion of previous phases."}
                              </p>
                            </div>
                            
                            {/* Action buttons to update status */}
                            <div className="flex gap-1 bg-muted/20 p-0.5 border border-border rounded-[5px] shrink-0">
                              {(['Pending', 'In Progress', 'Completed'] as ConstructionMilestone['status'][]).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    updateMilestoneStatus(property.id, mil.name, st);
                                    if (mil.name === "Staging & Final Polish" && st === "Completed") {
                                      const confirmPublish = window.confirm("Construction completed successfully! Do you want to publish this listing on the Waveron Marketplace portal?");
                                      if (confirmPublish) {
                                        useAppStore.getState().updatePropertyStatus(property.id, 'For Sale');
                                        useAppStore.getState().addAuditLog({
                                          action: `Published listing ${property.id} to Waveron Marketplace portal`,
                                          category: 'Update',
                                          component: 'Listings'
                                        });
                                      }
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold transition-all cursor-pointer ${
                                    mil.status === st
                                      ? st === 'Completed' ? 'bg-success text-white' :
                                        st === 'In Progress' ? 'bg-primary text-white' :
                                        'bg-zinc-500 text-white'
                                      : 'text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Tab 5: Zoning & Permits ── */}
              {activeTab === 'permits' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-[14px] font-bold text-foreground">Zoning & Regulatory Permits Tracker</h5>
                      <p className="text-[12px] text-muted-foreground">Monitor municipal permits, building codes, and variance status logs.</p>
                    </div>
                    
                    {/* Approved permits percentage */}
                    {(() => {
                      const list = permits.filter(p => p.propertyId === property.id);
                      const approved = list.filter(p => p.status === 'Approved').length;
                      const pct = list.length > 0 ? Math.round((approved / list.length) * 100) : 0;
                      return (
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg shrink-0">
                          <i className="ri-shield-check-line text-success text-[18px]" />
                          <span className="text-[12px] font-bold text-success">{pct}% Approved ({approved}/{list.length})</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Permits List */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-8 space-y-3">
                      <h6 className="text-[13px] font-bold text-foreground">Required Building Codes & Clearances</h6>
                      <div className="space-y-2.5">
                        {permits.filter(p => p.propertyId === property.id).length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg bg-card">
                            No permit records added yet.
                          </div>
                        ) : (
                          permits.filter(p => p.propertyId === property.id).map((prm) => (
                            <div key={prm.id} className="flex justify-between items-center bg-card border border-border p-3.5 rounded-lg shadow-sm">
                              <div>
                                <h6 className="text-[13px] font-bold text-foreground flex items-center gap-1.5">
                                  {prm.name}
                                  {prm.documentName && (
                                    <button
                                      onClick={() => toast.success(`Simulating download of attached document: ${prm.documentName}`)}
                                      className="inline-flex items-center gap-1 text-[10px] bg-indigo-500/10 text-[#604ae3] border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold hover:bg-indigo-500/20 transition-all ml-1 cursor-pointer"
                                      title="Download attached document"
                                    >
                                      <i className="ri-attachment-line text-[11px]" />
                                      {prm.documentName.length > 20 ? prm.documentName.substring(0, 17) + "..." : prm.documentName}
                                    </button>
                                  )}
                                </h6>
                                <p className="text-[11.5px] text-muted-foreground mt-0.5 font-medium">
                                  Authority: <span className="font-semibold text-foreground">{prm.authority}</span>
                                  {prm.expiryDate && <span> | Expiry: <span className="font-semibold text-danger">{prm.expiryDate}</span></span>}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className={`px-2.5 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider ${
                                  prm.status === 'Approved' ? 'bg-success/15 text-success' :
                                  prm.status === 'Applied' ? 'bg-warning/15 text-warning' :
                                  'bg-danger/15 text-danger'
                                }`}>
                                  {prm.status}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => deletePermit(prm.id)}
                                  className="text-danger hover:bg-danger/10 h-7 w-7 rounded flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <i className="ri-delete-bin-line" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Add Permit Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newPermitForm.name.trim() || !newPermitForm.authority.trim()) return;
                        addPermit({
                          propertyId: property.id,
                          name: newPermitForm.name,
                          authority: newPermitForm.authority,
                          status: newPermitForm.status,
                          expiryDate: newPermitForm.expiryDate || undefined,
                          documentName: attachedPermitDocName || undefined,
                          documentUrl: attachedPermitDocName ? "#" : undefined
                        });
                        setNewPermitForm({ name: '', authority: '', status: 'Applied', expiryDate: '' });
                        setAttachedPermitDocName("");
                      }}
                      className="lg:col-span-4 bg-muted/15 border border-border p-4 rounded-lg space-y-3"
                    >
                      <h6 className="text-[13px] font-bold text-foreground">Log Regulatory Approval</h6>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Permit Name</label>
                          <input
                            type="text"
                            required
                            value={newPermitForm.name}
                            onChange={(e) => setNewPermitForm({ ...newPermitForm, name: e.target.value })}
                            className="w-full text-[12.5px] border border-border bg-card text-foreground rounded px-2.5 py-1.5 outline-none focus:border-primary font-medium"
                            placeholder="e.g. Electrical Safety Clearance"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Authority</label>
                          <input
                            type="text"
                            required
                            value={newPermitForm.authority}
                            onChange={(e) => setNewPermitForm({ ...newPermitForm, authority: e.target.value })}
                            className="w-full text-[12.5px] border border-border bg-card text-foreground rounded px-2.5 py-1.5 outline-none focus:border-primary font-medium"
                            placeholder="e.g. Municipal Safety Council"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</label>
                            <select
                              value={newPermitForm.status}
                              onChange={(e) => setNewPermitForm({ ...newPermitForm, status: e.target.value as ZoningPermit['status'] })}
                              className="w-full text-[12.5px] border border-border bg-card text-foreground rounded px-2.5 py-1.5 outline-none focus:border-primary font-medium"
                            >
                              <option value="Applied">Applied</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Expiry Date</label>
                            <input
                              type="date"
                              value={newPermitForm.expiryDate}
                              onChange={(e) => setNewPermitForm({ ...newPermitForm, expiryDate: e.target.value })}
                              className="w-full text-[12.5px] border border-border bg-card text-foreground rounded px-2.5 py-1.5 outline-none focus:border-primary font-medium"
                            />
                          </div>
                        </div>

                        {/* Permit Document Attachment Selector */}
                        <div className="pt-1">
                          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            Attach Clearance Document (PDF/Image)
                          </label>
                          <label className="border border-dashed border-border rounded bg-card hover:bg-muted/10 p-2.5 flex items-center justify-center text-center cursor-pointer transition-all relative block">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={handlePermitDocUpload}
                              disabled={isUploadingPermitDoc}
                              className="hidden"
                            />
                            {isUploadingPermitDoc ? (
                              <div className="flex items-center justify-center gap-2 text-[11.5px] font-bold text-foreground">
                                <div className="h-4 w-4 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                                <span>Attaching ({permitDocProgress}%)</span>
                              </div>
                            ) : attachedPermitDocName ? (
                              <div className="flex items-center justify-between w-full text-[11.5px] font-bold text-[#0acf97] px-1">
                                <span className="truncate max-w-[150px] flex items-center gap-1">
                                  <i className="ri-checkbox-circle-fill text-[13px]" /> {attachedPermitDocName}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setAttachedPermitDocName("");
                                  }}
                                  className="text-danger hover:underline text-[10px] font-bold cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <div className="text-[11.5px] text-muted-foreground font-semibold flex items-center gap-1.5 justify-center">
                                <i className="ri-attachment-2 text-[#604ae3]" /> Click to browse PDF/Image
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#604ae3] text-white text-[12.5px] font-bold py-2 rounded hover:bg-[#503bc7] transition-all mt-3 cursor-pointer"
                      >
                        Add Permit Tracking
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Some Facility section */}
            <div className="space-y-2">
              <h5 className="text-[14px] font-bold text-foreground">Some Facility :</h5>
              <div className="flex flex-wrap gap-2">
                {property.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="text-[12.5px] text-muted-foreground bg-muted/20 border border-border rounded px-2.5 py-1 font-semibold"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>

            {/* Property Details text */}
            <div className="space-y-2">
              <h5 className="text-[14px] font-bold text-foreground">Property Details :</h5>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* View More Details actions */}
            <div className="flex justify-between items-center pt-2 text-[13px]">
              <a href="#!" className="text-[#604ae3] font-bold hover:underline">
                View More Detail <i className="ri-arrow-right-line align-middle ml-0.5" />
              </a>
              <p className="text-muted-foreground flex items-center gap-1">
                <iconify-icon icon="solar:calendar-date-broken" className="text-[16px] text-primary" />
                {new Date(property.dateAdded).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

          </div>

          {/* Embedded Google Map section */}
          <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <iframe
              className="w-full"
              style={{ height: "400px" }}
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://maps.google.com/maps?width=1980&height=400&hl=en&q=${encodeURIComponent(property.location)}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
            />
          </div>

          <EntityNotesCard entityId={property.id} />
          <DocumentManager entityId={property.id} />
        </div>

      </div>
      <RecordDealModal
        isOpen={isRecordDealOpen}
        onClose={() => setIsRecordDealOpen(false)}
        defaultPropertyId={property.id}
        defaultAgentId={property.agentId}
      />

      {/* ── Matterport 3D Tour Mock Modal ────────────────────────── */}
      {is3DTourOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={() => setIs3DTourOpen(false)} />
          
          <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-lg shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <h3 className="text-[16px] font-bold flex items-center gap-1.5">
                <i className="ri-walk-line text-emerald-400" /> Simulated Matterport 3D Virtual Tour
              </h3>
              <button 
                type="button"
                onClick={() => setIs3DTourOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all text-white cursor-pointer"
              >
                <i className="ri-close-line text-[18px]" />
              </button>
            </div>

            {/* Simulated 3D viewport canvas */}
            <div className="relative aspect-[16/9] bg-slate-900 flex items-center justify-center select-none overflow-hidden">
              {/* Animated visual rendering of active tour room */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-750 transform scale-110 ease-out flex items-center justify-center"
                style={{ 
                  backgroundImage: `url(${property.image})`,
                  filter: currentTourRoom === 'kitchen' ? 'hue-rotate(60deg) brightness(0.85)' :
                          currentTourRoom === 'bedroom' ? 'hue-rotate(120deg) brightness(0.9)' :
                          currentTourRoom === 'terrace' ? 'hue-rotate(180deg) brightness(1.05)' :
                          'none'
                }}
              >
                {/* 3D overlay grid overlay */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-black/40 to-black/80 pointer-events-none" />
                
                <div className="bg-black/60 border border-white/10 px-4 py-2 rounded-lg text-center text-white backdrop-blur-md">
                  <h4 className="text-[16px] font-black tracking-wider uppercase">{currentTourRoom} area</h4>
                  <p className="text-[11px] text-emerald-400 font-mono mt-0.5 animate-pulse">● LIVE 3D VIEWPORT RENDERING</p>
                </div>
              </div>

              {/* Navigation Teleport Hotspots overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex justify-center gap-2">
                  {([
                    { id: 'living', label: 'Living Room', icon: 'ri-home-4-line' },
                    { id: 'kitchen', label: 'Kitchen & Bar', icon: 'ri-cup-line' },
                    { id: 'bedroom', label: 'Master Bedroom', icon: 'ri-hotel-bed-line' },
                    { id: 'terrace', label: 'Outdoor Terrace', icon: 'ri-sun-line' }
                  ] as const).map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setCurrentTourRoom(room.id)}
                      className={`px-3 py-1.5 rounded-[5px] text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        currentTourRoom === room.id
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'bg-black/65 text-slate-300 hover:text-white hover:bg-black/80 border border-white/5'
                      }`}
                    >
                      <i className={room.icon} /> {room.label}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono bg-black/50 px-3 py-1.5 rounded border border-white/5 backdrop-blur-sm self-start">
                  <span>FOV: 90° | SENSOR: MATTERPORT PRO3 | TILT: 0.0°</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[12px]">
              <span>Use the buttons at the top to navigate to different sectors of the building.</span>
              <span className="text-emerald-400 font-bold">Waveron VR Staging Mode Enabled</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
