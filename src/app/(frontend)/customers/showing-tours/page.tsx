"use client";

import { useState } from "react";

interface TourProperty {
  id: string;
  title: string;
  image: string;
  price: number;
  beds: number;
  baths: number;
  status: "Completed" | "Current" | "Upcoming";
}

interface SubmittedFeedback {
  propertyId: string;
  propertyTitle: string;
  rating: "love" | "like" | "neutral" | "dislike";
  notes: string;
  timestamp: string;
}

const initialTourProperties: TourProperty[] = [
  {
    id: "PROP-001",
    title: "104 Pine Road Estate",
    image: "/assets/images/properties/p-4.jpg",
    price: 1250000,
    beds: 4,
    baths: 3.5,
    status: "Current",
  },
  {
    id: "PROP-002",
    title: "Sunset Hill Modern Villa",
    image: "/assets/images/properties/p-11.jpg",
    price: 3450000,
    beds: 5,
    baths: 5,
    status: "Upcoming",
  },
  {
    id: "PROP-003",
    title: "Mid-Century Oasis",
    image: "/assets/images/properties/p-12.jpg",
    price: 895000,
    beds: 3,
    baths: 2.5,
    status: "Upcoming",
  },
];

export default function ShowingTours() {
  const [tourProps, setTourProps] = useState<TourProperty[]>(initialTourProperties);
  const [feedbacks, setFeedbacks] = useState<SubmittedFeedback[]>([]);
  
  // Phone simulation states
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [phoneRating, setPhoneRating] = useState<"love" | "like" | "neutral" | "dislike" | null>(null);
  const [phoneNotes, setPhoneNotes] = useState("");
  const [tourCompleted, setTourCompleted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Submit rating inside the phone mockup
  const handlePhoneSubmit = () => {
    if (phoneRating === null) return;

    const currentProp = tourProps[currentStopIndex];
    const newFeedback: SubmittedFeedback = {
      propertyId: currentProp.id,
      propertyTitle: currentProp.title,
      rating: phoneRating,
      notes: phoneNotes || "No comments left.",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" }),
    };

    setFeedbacks([newFeedback, ...feedbacks]);

    // Advance tour properties statuses
    const updatedProps = tourProps.map((p, idx) => {
      if (idx === currentStopIndex) return { ...p, status: "Completed" as const };
      if (idx === currentStopIndex + 1) return { ...p, status: "Current" as const };
      return p;
    });
    setTourProps(updatedProps);

    // Reset phone inputs
    setPhoneRating(null);
    setPhoneNotes("");

    // Advance stop index or finish tour
    if (currentStopIndex < tourProps.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
    } else {
      setTourCompleted(true);
    }
  };

  // Reset the whole simulation
  const handleResetSimulation = () => {
    setTourProps(
      initialTourProperties.map((p, idx) => ({
        ...p,
        status: idx === 0 ? "Current" : "Upcoming",
      }))
    );
    setFeedbacks([]);
    setCurrentStopIndex(0);
    setPhoneRating(null);
    setPhoneNotes("");
    setTourCompleted(false);
    setShowReport(false);
  };

  const getEmojiIcon = (rating: SubmittedFeedback["rating"]) => {
    switch (rating) {
      case "love": return "❤️ Love It";
      case "like": return "👍 Like It";
      case "neutral": return "😐 Neutral";
      case "dislike": return "👎 Dislike";
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Showing Tour Planner</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            B2B Interactive Demo: Experience agent dashboard updates as the buyer rates properties on their phone during a showing tour.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetSimulation}
          className="bg-muted/65 hover:bg-muted text-foreground border border-border text-[12.5px] font-bold px-3 py-1.5 rounded-[5px] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <i className="ri-refresh-line" /> Reset Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* ── Left Side: Agent Desktop Dashboard (col-span-7) ───────── */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Active Tour Details */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="bg-[#604ae3]/10 text-[#604ae3] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[4px] tracking-wider">
                  Agent Console
                </span>
                <h4 className="text-[16px] font-bold text-foreground mt-1.5">Sarah Jenkins Saturday Showing Route</h4>
                <p className="text-[12.5px] text-muted-foreground mt-0.5">Assigned Agent: Dominic Keller</p>
              </div>
              <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded ${
                tourCompleted ? "bg-soft-success text-success" : "bg-primary/10 text-primary"
              }`}>
                {tourCompleted ? "Completed" : "In Progress"}
              </span>
            </div>

            {/* Tour Stop Progression */}
            <div className="space-y-3">
              <h5 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Tour Schedule & Progress</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {tourProps.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`border rounded-[6px] p-3 flex flex-col justify-between space-y-3.5 transition-all ${
                      p.status === "Current" ? "bg-primary/5 border-[#604ae3] ring-1 ring-[#604ae3]" :
                      p.status === "Completed" ? "bg-muted/15 border-border opacity-70" :
                      "bg-card border-border opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        p.status === "Completed" ? "bg-success text-white" :
                        p.status === "Current" ? "bg-primary text-white animate-pulse" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Stop {idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <img src={p.image} className="h-10 w-12 rounded object-cover border border-border shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-foreground truncate leading-tight">{p.title}</p>
                        <p className="text-[11px] text-[#0acf97] font-semibold mt-0.5">
                          {p.price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>

                    <span className={`text-center py-0.5 rounded text-[11px] font-bold ${
                      p.status === "Completed" ? "bg-soft-success text-success" :
                      p.status === "Current" ? "bg-primary/20 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {p.status === "Completed" ? "Visited" :
                       p.status === "Current" ? "Client On Site" :
                       "Waiting"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Report compile */}
            {tourCompleted && !showReport && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowReport(true)}
                  className="w-full bg-[#0acf97] hover:bg-[#0acf97]/95 text-white text-[13.5px] font-bold py-2 px-4 rounded-[5px] flex items-center justify-center gap-1 transition-all"
                >
                  <iconify-icon icon="solar:document-text-broken" /> Compile Seller Report & Summary
                </button>
              </div>
            )}
          </div>

          {/* Compiled Seller Report Card */}
          {showReport && (
            <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h5 className="text-[14.5px] font-bold text-foreground flex items-center gap-1.5">
                  <iconify-icon icon="solar:checklist-bold-duotone" className="text-[20px] text-success" />
                  Compiled Tour Summary & Seller Feedback
                </h5>
                <button
                  type="button"
                  onClick={() => setShowReport(false)}
                  className="text-muted-foreground hover:text-foreground text-[18px]"
                >
                  <i className="ri-close-line" />
                </button>
              </div>

              <div className="space-y-3.5">
                {feedbacks.map((fb) => (
                  <div key={fb.propertyId} className="border border-border rounded-[6px] p-3.5 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h6 className="text-[13.5px] font-bold text-foreground">{fb.propertyTitle}</h6>
                      <p className="text-[12.5px] text-muted-foreground mt-1">
                        <strong>Client Comments:</strong> &quot;{fb.notes}&quot;
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-1.5 shrink-0">
                      <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded text-center block w-24 ${
                        fb.rating === "love" ? "bg-soft-success text-success" :
                        fb.rating === "like" ? "bg-primary/10 text-primary" :
                        fb.rating === "neutral" ? "bg-soft-warning text-warning" :
                        "bg-soft-danger text-danger"
                      }`}>
                        {getEmojiIcon(fb.rating)}
                      </span>
                      <span className="text-[10.5px] text-muted-foreground font-semibold">Received at {fb.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-time Feedback Log */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <h4 className="text-[15px] font-bold text-foreground mb-3 flex items-center gap-1.5">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live Feedback Feed (Agent View)
            </h4>

            {feedbacks.length === 0 ? (
              <div className="border border-dashed border-border rounded-[6px] p-8 text-center bg-muted/5">
                <p className="text-[13px] text-muted-foreground">
                  No feedback received yet. Use the phone simulator on the right to rate property listings and submit feedback.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-[12.5px] font-semibold text-muted-foreground">
                      <th className="pb-2.5">Property</th>
                      <th className="pb-2.5">Client Rating</th>
                      <th className="pb-2.5">Notes</th>
                      <th className="pb-2.5 text-right">Logged Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-[13px]">
                    {feedbacks.map((fb) => (
                      <tr key={fb.propertyId} className="hover:bg-muted/10 animate-in fade-in slide-in-from-top-1 duration-200">
                        <td className="py-3 font-bold text-foreground">{fb.propertyTitle}</td>
                        <td className="py-3">
                          <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded ${
                            fb.rating === "love" ? "bg-soft-success text-success" :
                            fb.rating === "like" ? "bg-primary/10 text-primary" :
                            fb.rating === "neutral" ? "bg-soft-warning text-warning" :
                            "bg-soft-danger text-danger"
                          }`}>
                            {getEmojiIcon(fb.rating)}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground max-w-xs truncate">{fb.notes}</td>
                        <td className="py-3 text-right text-muted-foreground font-semibold">{fb.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Side: Mobile Phone Mockup Simulator (col-span-5) ── */}
        <div className="xl:col-span-5 flex justify-center items-start">
          
          {/* Smartphone Container */}
          <div className="w-[320px] h-[620px] rounded-[36px] border-[10px] border-[#1e1e24] bg-background relative overflow-hidden shadow-2xl flex flex-col justify-between select-none">
            
            {/* Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#1e1e24] rounded-full z-30 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3a3a4c] block" />
            </div>

            {/* Smartphone screen header */}
            <div className="bg-[#604ae3] text-white pt-9 pb-4 px-4 text-center relative shrink-0">
              <p className="text-[10px] uppercase font-bold tracking-[0.15em] opacity-85">Client Tour App</p>
              <h5 className="text-[14px] font-bold mt-0.5">Saturday Showing Tour</h5>
              <p className="text-[11px] opacity-75 mt-0.5">Agent: Dominic Keller</p>
            </div>

            {/* Smartphone screen content */}
            <div className="flex-1 overflow-y-auto p-4 bg-muted/20 flex flex-col justify-between">
              {tourCompleted ? (
                <div className="text-center py-12 flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="h-16 w-16 bg-[#0acf97]/15 rounded-full flex items-center justify-center text-[#0acf97]">
                    <iconify-icon icon="solar:check-circle-bold-duotone" style={{ fontSize: "40px" }} />
                  </div>
                  <div>
                    <h5 className="text-[15px] font-bold text-foreground">Tour Completed!</h5>
                    <p className="text-[12px] text-muted-foreground mt-1.5 max-w-[200px] mx-auto leading-relaxed">
                      Thank you for reviewing! Your feedback has been sent directly to your agent, Dominic Keller.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    {/* Current Stop details */}
                    <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground">
                      <span>Stop {currentStopIndex + 1} of {tourProps.length}</span>
                      <span className="text-primary uppercase tracking-wider animate-pulse">Touring Now</span>
                    </div>

                    {/* Property Image & Info */}
                    <div className="border border-border bg-card rounded-[8px] overflow-hidden shadow-sm">
                      <img
                        src={tourProps[currentStopIndex].image}
                        className="w-full h-28 object-cover"
                        alt="Current Property"
                      />
                      <div className="p-3 leading-tight space-y-1">
                        <h6 className="text-[13px] font-bold text-foreground truncate">
                          {tourProps[currentStopIndex].title}
                        </h6>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[12px] text-[#0acf97] font-bold">
                            {tourProps[currentStopIndex].price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {tourProps[currentStopIndex].beds}bds | {tourProps[currentStopIndex].baths}ba
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating buttons */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                        How do you feel about this home?
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { key: "love", icon: "❤️", label: "Love It" },
                          { key: "like", icon: "👍", label: "Like It" },
                          { key: "neutral", icon: "😐", label: "Neutral" },
                          { key: "dislike", icon: "👎", label: "Dislike" },
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            type="button"
                            onClick={() => setPhoneRating(btn.key as "love" | "like" | "neutral" | "dislike")}
                            className={`py-2 px-3 rounded-[6px] text-[12px] font-bold transition-all border flex items-center justify-center gap-1.5 ${
                              phoneRating === btn.key
                                ? "bg-primary text-white border-primary shadow"
                                : "bg-card text-foreground border-border hover:bg-muted/40"
                            }`}
                          >
                            <span>{btn.icon}</span>
                            <span>{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Notes */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Quick Comments / Notes
                      </label>
                      <textarea
                        rows={3}
                        value={phoneNotes}
                        onChange={(e) => setPhoneNotes(e.target.value)}
                        placeholder="e.g. Master bed is small, kitchen layout is nice..."
                        className="w-full text-[12px] border border-border bg-card text-foreground rounded-[6px] p-2 outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground/60 leading-tight"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-border mt-auto">
                    <button
                      type="button"
                      onClick={handlePhoneSubmit}
                      disabled={phoneRating === null}
                      className="w-full bg-[#0acf97] hover:bg-[#0acf97]/95 disabled:bg-muted disabled:text-muted-foreground text-white text-[13px] font-bold py-2 rounded-[6px] active:scale-[0.98] transition-all"
                    >
                      Submit Stop Feedback
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Smartphone Bottom Home Bar */}
            <div className="h-6 bg-[#1e1e24] shrink-0 flex items-center justify-center">
              <span className="h-1 w-28 bg-[#ffffff]/30 rounded-full" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
