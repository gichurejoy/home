"use client";

import { useState } from "react";
import Link from "next/link";

interface MatchedBuyer {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  matchScore: number;
  budget: number;
  preferences: string;
}

interface PocketListing {
  id: string;
  title: string;
  location: string;
  price: number;
  ownerName: string;
  ownerAvatar: string;
  status: "Pocket Listing" | "Pre-Market Draft" | "Coming Soon";
  commissionRate: number; // percentage, e.g., 6.0 for double-ended
  specs: { beds: number; baths: number; area: number };
  image: string;
  buyers: MatchedBuyer[];
}

const mockPocketListings: PocketListing[] = [
  {
    id: "POCK-001",
    title: "104 Pine Road Estate",
    location: "Los Angeles, CA",
    price: 1250000,
    ownerName: "Patricia J. Smith",
    ownerAvatar: "/assets/images/users/avatar-2.jpg",
    status: "Pocket Listing",
    commissionRate: 6.0,
    specs: { beds: 4, baths: 3.5, area: 3200 },
    image: "/assets/images/properties/p-4.jpg",
    buyers: [
      {
        id: "BUY-101",
        name: "Sarah Jenkins",
        avatar: "/assets/images/users/avatar-3.jpg",
        phone: "+1 (555) 019-2834",
        matchScore: 96,
        budget: 1300000,
        preferences: "Requests 4+ Beds, LA Area, Swimming Pool",
      },
      {
        id: "BUY-102",
        name: "Marcus Vance",
        avatar: "/assets/images/users/avatar-5.jpg",
        phone: "+1 (555) 014-9876",
        matchScore: 92,
        budget: 1280000,
        preferences: "Wants modern layout, LA West, 3.5+ Baths",
      },
      {
        id: "BUY-103",
        name: "Emily Watson",
        avatar: "/assets/images/users/avatar-6.jpg",
        phone: "+1 (555) 018-2435",
        matchScore: 85,
        budget: 1200000,
        preferences: "Looking in LA county, budget flexible, 3+ Beds",
      },
    ],
  },
  {
    id: "POCK-002",
    title: "Sunset Hill Modern Villa",
    location: "Beverly Hills, CA",
    price: 3450000,
    ownerName: "Robert T. Davis",
    ownerAvatar: "/assets/images/users/avatar-4.jpg",
    status: "Pre-Market Draft",
    commissionRate: 5.5,
    specs: { beds: 5, baths: 5, area: 4800 },
    image: "/assets/images/properties/p-11.jpg",
    buyers: [
      {
        id: "BUY-201",
        name: "Jonathan Stark",
        avatar: "/assets/images/users/avatar-1.jpg",
        phone: "+1 (555) 012-7634",
        matchScore: 98,
        budget: 3600000,
        preferences: "Seeks Beverly Hills, modern style, 5+ Beds",
      },
      {
        id: "BUY-202",
        name: "Helen Ross",
        avatar: "/assets/images/users/avatar-7.jpg",
        phone: "+1 (555) 017-4839",
        matchScore: 89,
        budget: 3500000,
        preferences: "Beverly Hills or Malibu, pool mandatory",
      },
    ],
  },
  {
    id: "POCK-003",
    title: "Mid-Century Oasis",
    location: "Pasadena, CA",
    price: 8950000,
    ownerName: "Cynthia A. Miller",
    ownerAvatar: "/assets/images/users/avatar-9.jpg",
    status: "Coming Soon",
    commissionRate: 6.0,
    specs: { beds: 3, baths: 2.5, area: 2400 },
    image: "/assets/images/properties/p-12.jpg",
    buyers: [
      {
        id: "BUY-301",
        name: "Clara Belmont",
        avatar: "/assets/images/users/avatar-8.jpg",
        phone: "+1 (555) 013-1122",
        matchScore: 94,
        budget: 9000000,
        preferences: "Mid-Century architecture, Pasadena, large yard",
      },
    ],
  },
];

export default function PocketListings() {
  const [activeListing, setActiveListing] = useState<PocketListing | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<MatchedBuyer | null>(null);
  const [pitchChannel, setPitchChannel] = useState<"whatsapp" | "email" | null>(null);
  const [pitchMessage, setPitchMessage] = useState("");
  const [pitchStatus, setPitchStatus] = useState<string | null>(null);

  // Open the matches drawer
  const handleOpenMatches = (listing: PocketListing) => {
    setActiveListing(listing);
    setSelectedBuyer(null);
    setPitchChannel(null);
  };

  // Open the pitching dialog
  const handleOpenPitch = (buyer: MatchedBuyer, channel: "whatsapp" | "email") => {
    if (!activeListing) return;
    setSelectedBuyer(buyer);
    setPitchChannel(channel);
    setPitchStatus(null);

    const listingTitle = activeListing.title;
    const priceFormatted = activeListing.price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

    if (channel === "whatsapp") {
      setPitchMessage(
        `Hi ${buyer.name}! It's Dominic from waveron. I have a private, off-market pocket listing at ${listingTitle} that matches your search criteria. Price is ${priceFormatted} (${activeListing.specs.beds} Beds, ${activeListing.specs.baths} Baths). Would you like to schedule an early tour before we list it on the public MLS? Let me know!`
      );
    } else {
      setPitchMessage(
        `Subject: Off-Market Opportunity: ${listingTitle}\n\nHi ${buyer.name},\n\nI wanted to share a pre-market property that has not yet been listed on the public MLS.\n\nProperty: ${listingTitle}\nPrice: ${priceFormatted}\nSpecs: ${activeListing.specs.beds} Beds, ${activeListing.specs.baths} Baths, ${activeListing.specs.area} sqft\n\nSince this matches your search criteria, I wanted to offer a private tour. Let me know if you would like to review the floor plans.\n\nBest regards,\nDominic Keller`
      );
    }
  };

  // Trigger simulated message sending
  const handleSendPitch = () => {
    setPitchStatus("sending");
    setTimeout(() => {
      setPitchStatus("success");
      setTimeout(() => {
        setPitchStatus(null);
        setPitchChannel(null);
        setSelectedBuyer(null);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Pocket Listings Matcher</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            B2B Exclusive: Secure double-ended commissions by matching off-market properties to internal clients.
          </p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Pocket Listings</li>
        </ol>
      </div>

      {/* ── Stats Summary Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-medium text-muted-foreground mb-1">Double-End Deal Pipeline</p>
            <h3 className="text-[24px] font-bold text-[#0acf97] leading-none">$419,000</h3>
            <p className="text-[11.5px] text-muted-foreground mt-1.5">Potential full commission capture</p>
          </div>
          <div className="h-12 w-12 rounded bg-soft-success flex items-center justify-center text-success">
            <iconify-icon icon="solar:wallet-money-bold-duotone" style={{ fontSize: "30px" }} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-medium text-muted-foreground mb-1">Active Pocket Listings</p>
            <h3 className="text-[24px] font-bold text-foreground leading-none">3 Properties</h3>
            <p className="text-[11.5px] text-muted-foreground mt-1.5">Unpublished off-market drafts</p>
          </div>
          <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary">
            <iconify-icon icon="solar:lock-keyhole-bold-duotone" style={{ fontSize: "30px" }} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-medium text-muted-foreground mb-1">Unreached Hot Matches</p>
            <h3 className="text-[24px] font-bold text-warning leading-none">6 Buyers</h3>
            <p className="text-[11.5px] text-muted-foreground mt-1.5">Matched profiles with score &gt; 85%</p>
          </div>
          <div className="h-12 w-12 rounded bg-soft-warning flex items-center justify-center text-warning">
            <iconify-icon icon="solar:people-nearby-bold-duotone" style={{ fontSize: "30px" }} />
          </div>
        </div>
      </div>

      {/* ── Main Pocket Listings List ──────────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
        <h4 className="text-[16px] font-bold text-foreground mb-4">Internal Pre-Market Inventory</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[13px] font-semibold text-muted-foreground">
                <th className="pb-3.5 pl-2">Property</th>
                <th className="pb-3.5">Target Price</th>
                <th className="pb-3.5">Double-End Potential</th>
                <th className="pb-3.5">Matches</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[13.5px]">
              {mockPocketListings.map((listing) => {
                const totalComm = (listing.price * listing.commissionRate) / 100;
                return (
                  <tr key={listing.id} className="hover:bg-muted/10 group transition-colors">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="h-12 w-16 rounded-[4px] object-cover border border-border"
                        />
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                            {listing.title}
                          </p>
                          <p className="text-[12px] text-muted-foreground mt-0.5">{listing.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-foreground">
                      {listing.price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-4">
                      <div className="leading-tight">
                        <span className="font-bold text-[#0acf97]">
                          {totalComm.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">({listing.commissionRate}% split-free)</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="badge bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-[11px]">
                        {listing.buyers.length} Hot Matches
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-[4px] ${
                        listing.status === "Pocket Listing" ? "bg-soft-danger text-danger" :
                        listing.status === "Pre-Market Draft" ? "bg-soft-primary text-primary" :
                        "bg-soft-warning text-warning"
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenMatches(listing)}
                        className="bg-primary hover:bg-primary/95 text-white text-[12.5px] font-bold px-3 py-1.5 rounded-[5px] transition-colors inline-flex items-center gap-1"
                      >
                        <iconify-icon icon="solar:people-nearby-broken" /> Match Buyers
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Match Drawer Side-Panel Overlay ───────────────────────── */}
      {activeListing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity"
            onClick={() => setActiveListing(null)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-lg bg-card border-l border-border h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-soft-success text-success px-2 py-0.5 rounded-[4px] tracking-wider">
                  Smart Match engine
                </span>
                <h4 className="text-[16px] font-bold text-foreground mt-2">
                  Matching Clients for {activeListing.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveListing(null)}
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <i className="ri-close-line text-[20px]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* Financial Box */}
              <div className="bg-[#0acf97]/5 border border-[#0acf97]/30 rounded-[8px] p-4 flex items-center justify-between">
                <div>
                  <p className="text-[12.5px] text-muted-foreground font-semibold">Double-Ended Deal Opportunity</p>
                  <p className="text-[20px] font-extrabold text-[#0acf97] mt-0.5">
                    {((activeListing.price * activeListing.commissionRate) / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="badge bg-[#0acf97]/15 text-[#0acf97] text-[11px] font-bold px-2 py-1 rounded">
                    100% Split Kept
                  </span>
                </div>
              </div>

              <h5 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                Qualified Buyers ({activeListing.buyers.length})
              </h5>

              {/* Matching Buyers List */}
              <div className="space-y-3.5">
                {activeListing.buyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="border border-border rounded-[8px] p-4 bg-muted/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={buyer.avatar}
                          alt={buyer.name}
                          className="h-9 w-9 rounded-full object-cover border border-border"
                        />
                        <div>
                          <h6 className="text-[14px] font-bold text-foreground leading-tight">{buyer.name}</h6>
                          <p className="text-[11.5px] text-muted-foreground mt-0.5">Budget: {buyer.budget.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[12px] font-extrabold px-2 py-0.5 rounded-[4px] ${
                          buyer.matchScore >= 95 ? "bg-[#0acf97]/15 text-[#0acf97]" :
                          buyer.matchScore >= 90 ? "bg-primary/10 text-primary" :
                          "bg-[#f9bc0b]/10 text-[#f9bc0b]"
                        }`}>
                          {buyer.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    <p className="text-[12px] text-muted-foreground bg-muted/40 p-2.5 rounded border border-border/60">
                      <strong>Preferences:</strong> {buyer.preferences}
                    </p>

                    {/* Action pitches */}
                    <div className="flex gap-2 pt-1 border-t border-dashed border-border mt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenPitch(buyer, "whatsapp")}
                        className="flex-1 bg-[#25d366] hover:bg-[#25d366]/90 text-white text-[12px] font-bold py-1.5 rounded-[5px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <i className="ri-whatsapp-line text-[15px]" /> WhatsApp Pitch
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenPitch(buyer, "email")}
                        className="flex-1 bg-primary hover:bg-primary/95 text-white text-[12px] font-bold py-1.5 rounded-[5px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <i className="ri-mail-line text-[14px]" /> Email Pitch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border bg-muted/10 text-center text-[12px] text-muted-foreground">
              Smart Match recalculates every time database records update.
            </div>

          </div>
        </div>
      )}

      {/* ── Pitch Template Modal Overlay ─────────────────────────── */}
      {pitchChannel && selectedBuyer && activeListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setPitchChannel(null)}
          />

          {/* Modal box */}
          <div className="relative bg-card border border-border rounded-[8px] w-full max-w-md p-5 shadow-2xl z-10 animate-in zoom-in-95 duration-150 space-y-4">
            
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-[15.5px] font-bold text-foreground flex items-center gap-1.5">
                  <iconify-icon icon="solar:chat-square-arrow-right-bold-duotone" className="text-[20px] text-primary" />
                  Compose Pitch to {selectedBuyer.name}
                </h4>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Via {pitchChannel === "whatsapp" ? "WhatsApp Business" : "Agent Email Feed"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPitchChannel(null)}
                className="text-muted-foreground hover:text-foreground text-[20px]"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            {/* Message Area */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block">
                Message Body
              </label>
              <textarea
                rows={6}
                value={pitchMessage}
                onChange={(e) => setPitchMessage(e.target.value)}
                className="w-full text-[13px] border border-border bg-muted/20 text-foreground rounded-[5px] p-3 outline-none focus:border-primary transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Status alerts */}
            {pitchStatus === "sending" && (
              <div className="text-[12.5px] text-[#604ae3] bg-primary/10 border border-[#604ae3]/25 p-2.5 rounded flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin shrink-0" />
                <span>Simulating secure communication pipeline...</span>
              </div>
            )}

            {pitchStatus === "success" && (
              <div className="text-[12.5px] text-success bg-soft-success border border-[#0acf97]/25 p-2.5 rounded flex items-center gap-1.5">
                <i className="ri-checkbox-circle-line text-[16px]" />
                <span>Pitch delivered to {selectedBuyer.name}! Live alert logged.</span>
              </div>
            )}

            {/* Actions */}
            {!pitchStatus && (
              <div className="flex gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={() => setPitchChannel(null)}
                  className="flex-1 bg-muted/40 hover:bg-muted text-foreground text-[13px] font-bold py-2 rounded-[5px] border border-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendPitch}
                  className={`flex-1 text-white text-[13px] font-bold py-2 rounded-[5px] transition-colors ${
                    pitchChannel === "whatsapp" ? "bg-[#25d366] hover:bg-[#25d366]/90" : "bg-primary hover:bg-primary/95"
                  }`}
                >
                  Send Pitch
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
