"use client";

import { properties } from "@/data/mockProperties";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState, useEffect } from "react";

export default function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
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
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
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
            <div className="flex items-center gap-2 pt-1">
              <div className="h-8 w-8 rounded bg-[#0acf97]/15 flex items-center justify-center">
                <iconify-icon icon="solar:wallet-money-bold-duotone" className="text-[18px] text-[#0acf97]" />
              </div>
              <p className={`text-[18px] font-bold ${isSold ? "text-muted-foreground line-through decoration-muted-foreground/60" : "text-foreground"}`}>
                ${property.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
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

            {/* ── B2B SaaS Premium Feature: AI Virtual Staging ── */}
            <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.08)] mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#604ae3]/10 text-[#604ae3] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[4px] tracking-wider">
                      B2B SaaS Premium
                    </span>
                  </div>
                  <h4 className="text-[15.5px] font-bold text-foreground mt-1.5 flex items-center gap-1.5">
                    <iconify-icon icon="solar:magic-stick-3-bold-duotone" className="text-[19px] text-[#604ae3]" />
                    AI Virtual Staging & Visual Renovation
                  </h4>
                  <p className="text-[12.5px] text-muted-foreground mt-0.5">
                    Let buyers visualize and customize empty spaces instantly using generative AI.
                  </p>
                </div>
              </div>

              {/* Controls Grid */}
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
                      setSelectedStyle(e.target.value as any);
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
                      Select a room template and choose a target styling from the menu, then click "Run AI Staging" to render a simulated comparison.
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

        </div>

      </div>
    </div>
  );
}
