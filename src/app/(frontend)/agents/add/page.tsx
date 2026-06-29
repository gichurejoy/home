"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";

export default function AddAgent() {
  const router = useRouter();
  const addAgent = useAppStore((state) => state.addAgent);

  // Form State
  const [form, setForm] = useState({
    name: "Michael A. Miner",
    email: "michaelminer@dayrep.com",
    phone: "+787 608-360-0464",
    properties: 243,
    address: "Lincoln Drive Harrisburg, PA 17101 U.S.A",
    zipcode: "17101",
    city: "Washington",
    country: "U.S.A",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "properties" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAgent({
      name: form.name,
      email: form.email,
      phone: form.phone,
      properties: form.properties,
      address: form.address,
      avatar: "/assets/images/users/avatar-2.jpg",
      experience: "3 Years",
      agency: "waveron Realty",
      license: `LIC-${Math.floor(1000 + Math.random() * 9000)}-02`,
      textNumber: form.phone,
      servicesArea: `${form.city || 'Washington'}, ${form.country || 'U.S.A'}`,
      status: "Active",
      facebook: form.facebook,
      instagram: form.instagram,
      twitter: form.twitter,
      joinDate: new Date().toISOString().split('T')[0],
      bio: "Registered agent profile."
    });
    toast.success("Agent registered successfully!");
    router.push("/agents/list");
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Add Agent</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Register a new agent in waveron</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li>
            <Link href="/agents/grid" className="hover:text-primary transition-colors">Agents</Link>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Add Agent</li>
        </ol>
      </div>

      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Preview Card (col-xl-3) */}
        <div className="lg:col-span-4 xl:col-span-3 col-span-12">
          <div className="sticky top-6 space-y-6">
            
            <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)]">
              
              {/* Profile Card Header preview */}
              <div className="p-5 text-center border-b border-border">
                <div className="relative inline-block mx-auto">
                  <img
                    src="/assets/images/users/avatar-2.jpg"
                    alt="Agent Preview"
                    className="h-20 w-20 rounded-full border-[3px] border-muted object-cover shadow-sm"
                  />
                  <span className="absolute bottom-0 start-50 -translate-x-1/2 translate-y-1 bg-[#604ae3] text-white text-[9px] font-bold px-1 py-0.5 rounded shadow-sm">
                    # NEW
                  </span>
                </div>
                <h4 className="text-[15.5px] font-bold text-foreground mt-3.5 leading-snug line-clamp-1">
                  {form.name || "Full Name"}
                </h4>
                <p className="text-[12px] text-muted-foreground line-clamp-1 mt-0.5">
                  {form.email || "email@domain.com"}
                </p>
              </div>

              {/* Specs & Social Preview */}
              <div className="p-4 space-y-3 text-[12.5px] text-muted-foreground">
                <p className="flex items-center gap-2 font-semibold">
                  <iconify-icon icon="solar:home-bold-duotone" className="text-[17px] text-primary" />
                  <span className="text-foreground">{form.properties || 0}</span> Properties
                </p>
                <p className="flex items-center gap-2 font-semibold leading-snug line-clamp-2">
                  <iconify-icon icon="solar:map-point-wave-bold-duotone" className="text-[17px] text-primary shrink-0" />
                  {form.address || "Enter address details..."}
                </p>

                <div className="pt-2">
                  <h5 className="text-[11.5px] font-bold text-foreground mb-1.5">Social Media :</h5>
                  <div className="flex gap-1.5">
                    <a href={form.facebook || "#!"} className="h-7 w-7 rounded bg-muted/60 text-[#3b5998] hover:bg-[#3b5998] hover:text-white flex items-center justify-center text-[14px] transition-all">
                      <i className="ri-facebook-fill" />
                    </a>
                    <a href={form.instagram || "#!"} className="h-7 w-7 rounded bg-muted/60 text-[#e1306c] hover:bg-[#e1306c] hover:text-white flex items-center justify-center text-[14px] transition-all">
                      <i className="ri-instagram-line" />
                    </a>
                    <a href={form.twitter || "#!"} className="h-7 w-7 rounded bg-muted/60 text-[#1da1f2] hover:bg-[#1da1f2] hover:text-white flex items-center justify-center text-[14px] transition-all">
                      <i className="ri-twitter-line" />
                    </a>
                  </div>
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
                    Add Agent
                  </button>
                  <Link
                    href="/agents/list"
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
              <h4 className="text-[15px] font-bold text-foreground">Add Agent Photo</h4>
            </div>
            <div className="p-5">
              <div className="border-2 border-dashed border-border rounded-[8px] bg-muted/5 py-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted/15 transition-all">
                <i className="ri-upload-cloud-2-line text-[48px] text-[#604ae3]" />
                <h3 className="text-[16px] font-bold text-foreground mt-3">Drop profile image here, or <span className="text-[#604ae3]">click to browse</span></h3>
                <span className="text-[12.5px] text-muted-foreground mt-1 block">
                  Recommend square aspect ratio. PNG, JPG and GIF files are allowed
                </span>
              </div>
            </div>
          </div>

          {/* Agent Information Form Card */}
          <div className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="px-5 py-4 bg-muted/10 border-b border-border">
              <h4 className="text-[15px] font-bold text-foreground">Agent Information</h4>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Agent Name */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Agent Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                    placeholder="Full Name"
                    required
                  />
                </div>

                {/* Agent Email */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Agent Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                    placeholder="Enter Email"
                    required
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Agent Number */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Agent Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                    placeholder="Enter Number"
                    required
                  />
                </div>

                {/* Properties Number */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Properties Number</label>
                  <input
                    type="number"
                    name="properties"
                    value={form.properties}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                    placeholder="Enter Properties Count"
                    required
                  />
                </div>

              </div>

              {/* Agent Address */}
              <div>
                <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Agent Address</label>
                <textarea
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors resize-none leading-relaxed"
                  placeholder="Enter address details"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Zipcode */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Zip-Code</label>
                  <input
                    type="text"
                    name="zipcode"
                    value={form.zipcode}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                    placeholder="zip-code"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">City</label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                  >
                    <option value="">Choose a city</option>
                    <optgroup label="UK">
                      <option value="London">London</option>
                      <option value="Manchester">Manchester</option>
                      <option value="Liverpool">Liverpool</option>
                    </optgroup>
                    <optgroup label="US">
                      <option value="New York">New York</option>
                      <option value="Washington">Washington</option>
                      <option value="Michigan">Michigan</option>
                    </optgroup>
                    <optgroup label="CA">
                      <option value="Montreal">Montreal</option>
                      <option value="Toronto">Toronto</option>
                      <option value="Vancouver">Vancouver</option>
                    </optgroup>
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Country</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                  >
                    <option value="">Choose a country</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="U.S.A">U.S.A</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Spain">Spain</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Facebook */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Facebook URL</label>
                  <input
                    type="url"
                    name="facebook"
                    value={form.facebook}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
                    placeholder="Enter URL"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Instagram URL</label>
                  <input
                    type="url"
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
                    placeholder="Enter URL"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label className="text-[13.5px] font-semibold text-foreground mb-1 block">Twitter URL</label>
                  <input
                    type="url"
                    name="twitter"
                    value={form.twitter}
                    onChange={handleChange}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
                    placeholder="Enter URL"
                  />
                </div>

              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-[#604ae3] text-white text-[13.5px] font-semibold py-2 px-5 rounded-[5px] hover:bg-[#503bc7] transition-all"
                >
                  Create Agent
                </button>
                <Link
                  href="/agents/list"
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
