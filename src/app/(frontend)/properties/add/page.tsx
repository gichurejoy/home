"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddProperty() {
  const router = useRouter();

  // Form State
  const [form, setForm] = useState({
    name: "Dvilla Residences Batu",
    category: "Residences",
    price: 8930,
    status: "For Rent", // "For Rent" | "For Sale" | "Sold"
    bedrooms: 5,
    bathrooms: 4,
    area: 1400,
    floors: 3,
    location: "4604, Philli Lane Kiowa U.S.A",
    description: "Property refers to any item that an individual or a business holds legal title to...",
  });

  // AI Copilot states
  const [isGenerating, setIsGenerating] = useState(false);
  const [copilotProgress, setCopilotProgress] = useState(0);
  const [generatedSocial, setGeneratedSocial] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [copilotFinished, setCopilotFinished] = useState(false);

  const handleRunCopilot = () => {
    setIsGenerating(true);
    setCopilotProgress(0);
    setCopilotFinished(false);

    const interval = setInterval(() => {
      setCopilotProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setCopilotFinished(true);
          
          // Inject description text
          setForm((prevForm) => ({
            ...prevForm,
            description: `Exquisite luxury ${form.category.toLowerCase()} nestled at ${form.location || "a premium address"}. This breathtaking property features ${form.bedrooms} sprawling bedrooms, ${form.bathrooms} designer bathrooms, and spans ${form.area} sqft of meticulously curated living space. Built across ${form.floors} levels, this property boasts high-end finishes, abundant natural light, and offers an unmatched luxury standard. Ideal for the discerning buyer looking for sophistication and elegance in every detail.`
          }));

          // Set generated marketing content
          setGeneratedSocial(
            `🏡 NEW LISTING ALERT! ✨ Check out this stunning new ${form.category.toLowerCase()} listed for ${form.status === "For Rent" ? "Rent" : "Sale"} in ${form.location.split(',')[0]}! \n\nFeaturing:\n🛏️ ${form.bedrooms} Bedrooms\n🛁 ${form.bathrooms} Bathrooms\n📐 ${form.area} Sqft\n🏢 ${form.floors} Floors\n\nOffered at $${form.price.toLocaleString("en-US")}! Click the link in bio for private showing slots. DM for details! #RealEstate #LuxuryLiving #LaHomes`
          );

          setGeneratedEmail(
            `Subject: Hot Off-Market Match: Premium ${form.category} at ${form.location.split(',')[0]}\n\nHi Sarah,\n\nWe just listed a new ${form.category.toLowerCase()} that matches your search preferences. Here are the key details:\n\n📍 Location: ${form.location}\n💰 Price: $${form.price.toLocaleString("en-US")}\n🛌 Specs: ${form.bedrooms} Beds, ${form.bathrooms} Baths, ${form.area} sqft\n\nThis property features modern architecture, premium fixtures, and a spacious layout. We are currently offering priority tours for registered VIP buyers prior to the MLS debut.\n\nReply to this email if you'd like to book a private showing.\n\nBest,\nDominic Keller`
          );

          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "bedrooms" || name === "bathrooms" || name === "area" || name === "floors"
        ? Number(value)
        : value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Map "Sale" -> "For Sale", "Rent" -> "For Rent", "Other"/"Sold" -> "Sold"
    const val = e.target.value;
    let statusMapped: "For Sale" | "For Rent" | "Sold" = "For Rent";
    if (val === "Sale") statusMapped = "For Sale";
    else if (val === "Rent") statusMapped = "For Rent";
    else statusMapped = "Sold";

    setForm((prev) => ({
      ...prev,
      status: statusMapped,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Property added successfully!");
    router.push("/properties/list");
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Add Property</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">List a new property on LaHomes</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Add Property</li>
        </ol>
      </div>

      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Preview Card (col-xl-3) */}
        <div className="lg:col-span-4 xl:col-span-3 col-span-12">
          <div className="sticky top-6 space-y-6">
            
            <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)]">
              
              {/* Image Preview */}
              <div className="relative aspect-[4/3] bg-muted/20 overflow-hidden">
                <img
                  src="/assets/images/properties/p-1.jpg"
                  alt="Property Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 right-2.5 z-10">
                  <span className={`text-[12.5px] font-bold px-2 py-0.5 rounded text-white shadow-sm ${
                    form.status === "For Rent" ? "bg-[#0acf97]" :
                    form.status === "For Sale" ? "bg-[#f9bc0b]" :
                    "bg-[#ff5b5b]"
                  }`}>
                    {form.status}
                  </span>
                </span>
              </div>

              {/* Body details */}
              <div className="p-4">
                <h4 className="text-[15.5px] font-bold text-foreground leading-snug line-clamp-1">
                  {form.name || "Dvilla Residences Batu"}
                  <span className="text-[12.5px] text-muted-foreground font-semibold ml-1">({form.category})</span>
                </h4>
                <p className="text-[12.5px] text-muted-foreground mt-1 line-clamp-1">
                  {form.location || "4604 , Philli Lane Kiowa U.S.A"}
                </p>
                
                <h5 className="text-[13px] font-bold text-foreground mt-3.5">Price :</h5>
                <h4 className="text-[18px] font-bold text-[#604ae3] mt-0.5">
                  ${form.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h4>

                {/* Badges specifications */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[12px] text-muted-foreground font-semibold">
                  <span className="bg-muted/30 border border-border rounded px-2 py-1 flex items-center gap-1">
                    <iconify-icon icon="solar:bed-broken" className="text-[15px] text-primary" /> {form.bedrooms} Beds
                  </span>
                  <span className="bg-muted/30 border border-border rounded px-2 py-1 flex items-center gap-1">
                    <iconify-icon icon="solar:bath-broken" className="text-[15px] text-primary" /> {form.bathrooms} Bath
                  </span>
                  <span className="bg-muted/30 border border-border rounded px-2 py-1 flex items-center gap-1">
                    <iconify-icon icon="solar:scale-broken" className="text-[15px] text-primary" /> {form.area}ft
                  </span>
                  <span className="bg-muted/30 border border-border rounded px-2 py-1 flex items-center gap-1">
                    <iconify-icon icon="solar:double-alt-arrow-up-broken" className="text-[15px] text-primary" /> {form.floors} Floor
                  </span>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="p-4 bg-muted/10 border-t border-border">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-[#604ae3] text-white text-[13px] font-bold py-2 px-3 rounded-[5px] hover:bg-[#503bc7] transition-all"
                  >
                    Add Property
                  </button>
                  <Link
                    href="/properties/list"
                    className="bg-[#ff5b5b] text-white text-[13px] font-bold py-2 px-3 rounded-[5px] hover:bg-[#e44e4e] transition-all text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Form Inputs (col-xl-9) */}
        <div className="lg:col-span-8 xl:col-span-9 col-span-12 space-y-6">
          
          {/* Add Photo drag-drop Mockup */}
          <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="px-5 py-4 bg-muted/10 border-b border-border">
              <h4 className="text-[15px] font-bold text-foreground">Add Property Photo</h4>
            </div>
            <div className="p-5">
              <div className="border-2 border-dashed border-border rounded-[8px] bg-muted/5 py-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted/15 transition-all">
                <i className="ri-upload-cloud-2-line text-[48px] text-[#604ae3]" />
                <h3 className="text-[16px] font-bold text-foreground mt-3">Drop your images here, or <span className="text-[#604ae3]">click to browse</span></h3>
                <span className="text-[12.5px] text-muted-foreground mt-1 block">
                  1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed
                </span>
              </div>
            </div>
          </div>

          {/* Property Information Form Card */}
          <div className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="px-5 py-4 bg-muted/10 border-b border-border">
              <h4 className="text-[15px] font-bold text-foreground">Property Information</h4>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Property Name */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Property Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                    placeholder="Name"
                    required
                  />
                </div>

                {/* Property Categories */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Property Categories</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                  >
                    <option value="Villas">Villas</option>
                    <option value="Residences">Residences</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Price */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Price</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                      placeholder="000"
                      required
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <i className="ri-money-dollar-circle-line text-[18px] align-middle" />
                    </span>
                  </div>
                </div>

                {/* Property For */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Property For</label>
                  <select
                    name="status"
                    value={form.status === "For Sale" ? "Sale" : form.status === "For Rent" ? "Rent" : "Other"}
                    onChange={handleStatusChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Sale">Sale</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Bedroom</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="bedrooms"
                      value={form.bedrooms}
                      onChange={handleChange}
                      className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                      required
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <iconify-icon icon="solar:bed-broken" className="text-[18px] align-middle" />
                    </span>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Bathrooms */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Bathroom</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="bathrooms"
                      value={form.bathrooms}
                      onChange={handleChange}
                      className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                      required
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <iconify-icon icon="solar:bath-broken" className="text-[18px] align-middle" />
                    </span>
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Sqft / Size</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                      required
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <iconify-icon icon="solar:scale-broken" className="text-[18px] align-middle" />
                    </span>
                  </div>
                </div>

                {/* Floors */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Floor</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="floors"
                      value={form.floors}
                      onChange={handleChange}
                      className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                      required
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <iconify-icon icon="solar:double-alt-arrow-up-broken" className="text-[18px] align-middle" />
                    </span>
                  </div>
                </div>

              </div>

              {/* Location Address */}
              <div>
                <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Property Address</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                  placeholder="Address"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[13.5px] font-semibold text-foreground block">
                    Property Description
                  </label>
                  <button
                    type="button"
                    onClick={handleRunCopilot}
                    disabled={isGenerating}
                    className="text-[11.5px] font-bold text-[#604ae3] hover:text-[#503bc7] flex items-center gap-1.5 transition-colors disabled:text-muted-foreground bg-primary/10 px-2 py-1 rounded hover:bg-primary/20"
                  >
                    <iconify-icon icon="solar:magic-stick-3-broken" className="text-[14px]" />
                    {isGenerating ? `Generating (${copilotProgress}%)...` : "AI Listing Copilot"}
                  </button>
                </div>
                <textarea
                  name="description"
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors resize-none leading-relaxed"
                  placeholder="Describe your property details..."
                  required
                />
              </div>

              {/* B2B SaaS Premium Feature: AI Copilot Outputs */}
              {copilotFinished && (
                <div className="bg-muted/30 border border-dashed border-border rounded-[8px] p-5 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <span className="bg-[#604ae3]/10 text-[#604ae3] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[4px] tracking-wider">
                      AI Generated Marketing Copy
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Social Hook */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11.5px] font-bold text-muted-foreground uppercase">
                          Social Media Hook
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedSocial);
                            alert("Copied to clipboard!");
                          }}
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          Copy
                        </button>
                      </div>
                      <textarea
                        readOnly
                        rows={5}
                        value={generatedSocial}
                        className="w-full text-[12px] border border-border bg-card text-foreground rounded-[5px] p-2.5 outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Email Pitch */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11.5px] font-bold text-muted-foreground uppercase">
                          Email Blast Pitch
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedEmail);
                            alert("Copied to clipboard!");
                          }}
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          Copy
                        </button>
                      </div>
                      <textarea
                        readOnly
                        rows={5}
                        value={generatedEmail}
                        className="w-full text-[12px] border border-border bg-card text-foreground rounded-[5px] p-2.5 outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-[#604ae3] text-white text-[13.5px] font-semibold py-2 px-5 rounded-[5px] hover:bg-[#503bc7] transition-all"
                >
                  Add Property
                </button>
                <Link
                  href="/properties/list"
                  className="bg-muted text-foreground text-[13.5px] font-semibold py-2 px-5 rounded-[5px] hover:bg-muted-foreground/15 transition-all text-center"
                >
                  Cancel
                </Link>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
