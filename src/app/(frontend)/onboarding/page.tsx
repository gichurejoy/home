"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding, addAgent, addProperty, addCommissionPlan } = useAppStore();
  const [step, setStep] = useState(1);

  // Step 1: Branding
  const [agencyName, setAgencyName] = useState("waveron");
  const [tagline, setTagline] = useState("Premium Real Estate SaaS Portal");
  const [currency, setCurrency] = useState("USD");

  // Step 2: Commissions split
  const [agentSplit, setAgentSplit] = useState(80);
  const [brokerSplit, setBrokerSplit] = useState(20);
  const [capLimit, setCapLimit] = useState(20000);

  // Step 3: First Agent
  const [agentName, setAgentName] = useState("Alex Harrison");
  const [agentEmail, setAgentEmail] = useState("alex.harrison@waveron.com");
  const [agentPhone, setAgentPhone] = useState("+1 555-019-2834");

  // Step 4: First Listing
  const [propTitle, setPropTitle] = useState("Grand Peak Estates");
  const [propPrice, setPropPrice] = useState(750000);
  const [propLocation, setPropLocation] = useState("Los Angeles, CA");
  const [propType, setPropType] = useState("Villa");

  const handleNext = () => {
    if (step === 2) {
      if (agentSplit + brokerSplit !== 100) {
        toast.error("Split percentages must add up to 100%!");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    // 1. Complete branding onboarding
    completeOnboarding({
      name: agencyName,
      tagline,
      logo: "/assets/images/logo-placeholder.png",
      currency,
    });

    // 2. Create default custom commission plan
    addCommissionPlan({
      name: `${agencyName} Onboarding Plan`,
      agentPercentage: agentSplit,
      brokerPercentage: brokerSplit,
      capLimit,
      deskFee: 0,
    });

    // 3. Register first agent
    addAgent({
      name: agentName,
      email: agentEmail,
      phone: agentPhone,
      properties: 1,
      address: `${propLocation} Office`,
      avatar: "/assets/images/users/avatar-6.jpg",
      experience: "5 Years",
      agency: agencyName,
      license: "LIC-ONBOARD-99",
      textNumber: agentPhone,
      servicesArea: propLocation,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
      bio: "Pre-seeded agent profile created during onboarding."
    });

    // 4. Create first property listing
    addProperty({
      title: propTitle,
      price: propPrice,
      location: propLocation,
      type: propType,
      image: "/assets/images/properties/property-1.jpg",
      status: "For Sale",
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      floors: 2,
      rating: 5,
      agentId: "AGT-001",
      owner: {
        name: "Gaston Lapierre",
        avatar: "/assets/images/users/avatar-1.jpg",
        phone: "+1 (555) 123-4567",
        email: "gaston@waveron.com",
      },
      facilities: ["Pool", "Garden", "Garage", "Security"],
      description: "Beautiful modern home pre-seeded during workspace setup onboarding.",
      dateAdded: new Date().toISOString().split("T")[0],
    });

    toast.success("Setup wizard completed! Welcome to your new dashboard.");
    router.push("/");
  };

  return (
    <div className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Progress header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-2">
        <div>
          <h2 className="text-[20px] font-black text-foreground flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-white text-[14px]">
              🚀
            </span>
            waveron Setup Wizard
          </h2>
          <p className="text-[12.5px] text-muted-foreground mt-0.5">Configure your brand portal and launch dashboard</p>
        </div>
        <div className="text-right">
          <span className="text-[12px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            Step {step} of 5
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`flex-1 h-full rounded-full transition-all duration-300 ${
              s <= step ? "bg-primary" : "bg-muted-foreground/25"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[220px] py-2">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-[15px] font-bold text-foreground">1. Agency Branding Profile</h3>
            <p className="text-[12.5px] text-muted-foreground">Customize the workspace name, tagline, and default transaction currency.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Agency Name *
                </label>
                <input
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                  placeholder="e.g. waveron Realty"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Local Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                Tagline / Motto
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                placeholder="e.g. Find your dream home today"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-[15px] font-bold text-foreground">2. Commission Split Plan</h3>
            <p className="text-[12.5px] text-muted-foreground">Setup your default split settings and annual broker cap limits.</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Agent Split % *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={agentSplit}
                  onChange={(e) => setAgentSplit(Number(e.target.value))}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Broker Split % *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={brokerSplit}
                  onChange={(e) => setBrokerSplit(Number(e.target.value))}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                Annual Broker Cap Limit ({currency})
              </label>
              <input
                type="number"
                value={capLimit}
                onChange={(e) => setCapLimit(Number(e.target.value))}
                className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                placeholder="e.g. 20000"
              />
              <span className="text-[11px] text-muted-foreground">Once agents pay this amount in commission splits, they get a 100% payout split for the year.</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-[15px] font-bold text-foreground">3. Register First Agent</h3>
            <p className="text-[12.5px] text-muted-foreground">Add your first real estate agent profile to the company directory.</p>
            <div className="space-y-1.5 pt-2">
              <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                Agent Full Name *
              </label>
              <input
                type="text"
                required
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                placeholder="e.g. Alex Harrison"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={agentEmail}
                  onChange={(e) => setAgentEmail(e.target.value)}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                  placeholder="alex.harrison@agency.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                  placeholder="+1 555-019-2834"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-[15px] font-bold text-foreground">4. Create First Property Listing</h3>
            <p className="text-[12.5px] text-muted-foreground">Pre-populate your listings inventory database with a featured property.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                  placeholder="e.g. Grand Peak Estates"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Listing Price ({currency}) *
                </label>
                <input
                  type="number"
                  required
                  value={propPrice}
                  onChange={(e) => setPropPrice(Number(e.target.value))}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Location / Address *
                </label>
                <input
                  type="text"
                  required
                  value={propLocation}
                  onChange={(e) => setPropLocation(e.target.value)}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                  placeholder="e.g. Los Angeles, CA"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-bold text-muted-foreground uppercase tracking-wider text-[10.5px]">
                  Property Type *
                </label>
                <select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value)}
                  className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-[13px]"
                >
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Cottage">Cottage</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200 text-center py-4">
            <div className="text-[48px] animate-bounce">🎉</div>
            <h3 className="text-[18px] font-bold text-foreground">You are Ready to Launch!</h3>
            <p className="text-[12.5px] text-muted-foreground max-w-md mx-auto">
              Your company branding, commission plans, default agent, and listing have been pre-seeded.
            </p>

            <div className="bg-muted/30 border border-border rounded-xl p-4 text-left text-[12px] space-y-2 max-w-md mx-auto mt-4 font-semibold text-muted-foreground">
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Agency Name:</span>
                <span className="text-foreground">{agencyName}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Default split:</span>
                <span className="text-foreground">{agentSplit}% Agent / {brokerSplit}% Broker</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>First Agent:</span>
                <span className="text-foreground">{agentName}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>First Listing:</span>
                <span className="text-foreground line-clamp-1">{propTitle} (${propPrice.toLocaleString()})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Nav Buttons */}
      <div className="flex items-center justify-between border-t border-border pt-4 bg-muted/10 -mx-6 -mb-6 p-4 sm:px-6">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="text-[12.5px] font-bold text-muted-foreground border border-border bg-card hover:bg-muted px-4 py-2 rounded-[5px] transition-all"
          >
            &larr; Back
          </button>
        ) : (
          <button
            onClick={() => {
              toast.info("Onboarding setup bypassed. Default values applied.");
              router.push("/");
            }}
            className="text-[12.5px] font-semibold text-muted-foreground hover:text-foreground hover:underline transition-all"
          >
            Skip Setup Wizard
          </button>
        )}

        {step < 5 ? (
          <button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/95 text-white text-[12.5px] font-bold px-5 py-2 rounded-[5px] shadow-sm transition-all"
          >
            Next step &rarr;
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="bg-success hover:bg-success/95 text-white text-[12.5px] font-bold px-6 py-2 rounded-[5px] shadow-md transition-all animate-pulse"
          >
            Launch Dashboard 🚀
          </button>
        )}
      </div>
    </div>
  );
}
