"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";

export default function AddCustomer() {
  const router = useRouter();
  const { addCustomer } = useAppStore();

  // Form states with default preview values (matching Daavid Nummi as placeholder)
  const [formData, setFormData] = useState({
    name: "Daavid Nummi",
    email: "daavidnumminen@teleworm.us",
    phone: "+231 06-75820711",
    address: "Schoolstraat 161 5151 HH Drunen",
    zipcode: "5151 HH",
    city: "Drunen",
    country: "Netherlands",
    viewProperties: 231,
    ownProperties: 27,
    investProperty: 928128,
    status: "Available",
    listStatus: "Interested",
    propertyType: "Residential",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    whatsapp: "https://whatsapp.com",
  });

  const [avatarPreview, setAvatarPreview] = useState("/assets/images/users/avatar-2.jpg");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    // Map element ids to state keys
    const fieldMap: Record<string, string> = {
      "customer-name": "name",
      "customer-email": "email",
      "customer-number": "phone",
      "customer-address": "address",
      "customer-zipcode": "zipcode",
      "customer-city": "city",
      "customer-country": "country",
      "view-properties": "viewProperties",
      "own-properties": "ownProperties",
      "invest-property": "investProperty",
      "customer-status": "status",
      "customer-list-status": "listStatus",
      "property-type": "propertyType",
      "facebook-url": "facebook",
      "instagram-url": "instagram",
      "twitter-url": "twitter",
      "whatsapp-url": "whatsapp",
    };

    const stateKey = fieldMap[id];
    if (stateKey) {
      setFormData((prev) => ({
        ...prev,
        [stateKey]: e.target.type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: `${formData.address}, ${formData.city}, ${formData.country}`,
      status: formData.status as 'Available' | 'Unavailable',
      listStatus: formData.listStatus as 'Interested' | 'Under Review' | 'Follow-up',
      propertyType: formData.propertyType,
      avatar: avatarPreview,
      socials: {
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
        whatsapp: formData.whatsapp,
        email: formData.email,
      },
      preferences: {
        bedsBaths: "3-4 bedrooms, 2-3 bathrooms",
        others: "Close to public transportation, good school district, backyard",
      },
      activePropertiesCount: 0,
    });
    toast.success("Customer profile registered successfully!");
    router.push("/customers/grid");
  };

  const handleCancel = () => {
    if (confirm("Discard all modifications?")) {
      router.push("/customers/grid");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Add Customer</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Register a new customer profile in directory</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li>
            <Link href="/customers/grid" className="hover:text-primary transition-colors">Customers</Link>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Add Customer</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Left Column: Live Preview Card (col-xl-3) ──────────────── */}
        <div className="lg:col-span-3">
          <div className="sticky top-6 space-y-4">
            <h4 className="text-[14.5px] font-bold text-foreground">Live Card Preview</h4>
            <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)] relative flex flex-col">
              {/* Card Banner */}
              <div className="h-24 w-full bg-gradient-to-r from-[#604ae3]/10 to-[#604ae3]/25 position-relative">
                <div className="absolute top-2.5 right-2.5">
                  <span className="h-8 w-8 rounded bg-background/80 dark:bg-[#1b2332]/80 flex items-center justify-center shadow-sm text-[16px]">
                    <iconify-icon icon="solar:pen-new-square-broken" className="text-foreground text-[18px]" />
                  </span>
                </div>
              </div>

              {/* Overlapping Avatar */}
              <div className="absolute left-6 top-10 w-[72px] h-[72px]">
                <Image
                  src={avatarPreview}
                  alt={formData.name || "Preview Avatar"}
                  fill
                  className="border-[3px] border-card rounded-full object-cover shadow-sm bg-card"
                />
              </div>

              {/* Card Contents */}
              <div className="mt-10 pt-2 px-5 pb-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h5 className="font-bold text-[16px] text-foreground truncate max-w-[130px]">
                      {formData.name || "Customer Name"}
                    </h5>
                    <span
                      className={`px-2 py-0.5 rounded-[4px] text-[10.5px] font-bold tracking-wide uppercase shrink-0 ${
                        formData.status === "Available"
                          ? "bg-success/15 text-success"
                          : "bg-danger/15 text-danger"
                      }`}
                    >
                      {formData.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[12.5px] text-muted-foreground pb-4 border-b border-border">
                    <p className="truncate">
                      <span className="text-foreground font-semibold">Email: </span>
                      {formData.email || "email@example.com"}
                    </p>
                    <p className="truncate">
                      <span className="text-foreground font-semibold">Contact: </span>
                      {formData.phone || "+00 00-000000"}
                    </p>
                    <p className="truncate">
                      <span className="text-foreground font-semibold">Address: </span>
                      {formData.address || "Customer Address"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1 py-3.5 border-b border-border text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                        View
                      </p>
                      <h5 className="text-[13.5px] font-bold text-foreground">
                        {formData.viewProperties}
                      </h5>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                        Own
                      </p>
                      <h5 className="text-[13.5px] font-bold text-foreground">
                        {formData.ownProperties}
                      </h5>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">
                        Invested
                      </p>
                      <h5 className="text-[13.5px] font-bold text-foreground truncate">
                        ${formData.investProperty.toLocaleString()}
                      </h5>
                    </div>
                  </div>

                  {/* Social links row */}
                  <div className="pt-3.5 pb-2">
                    <div className="flex gap-1.5 justify-center">
                      <span className="h-7 w-7 rounded bg-soft-primary text-primary flex items-center justify-center text-[14px]">
                        <i className="ri-facebook-fill" />
                      </span>
                      <span className="h-7 w-7 rounded bg-soft-danger text-danger flex items-center justify-center text-[14px]">
                        <i className="ri-instagram-line" />
                      </span>
                      <span className="h-7 w-7 rounded bg-soft-info text-info flex items-center justify-center text-[14px]">
                        <i className="ri-twitter-line" />
                      </span>
                      <span className="h-7 w-7 rounded bg-soft-success text-success flex items-center justify-center text-[14px]">
                        <i className="ri-whatsapp-line" />
                      </span>
                      <span className="h-7 w-7 rounded bg-soft-warning text-warning flex items-center justify-center text-[14px]">
                        <i className="ri-mail-line" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Forms Panel (col-xl-9) ──────────────────── */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Photo upload box */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <h4 className="font-bold text-[15px] text-foreground mb-4">Add Customer Photo</h4>
            <div className="border-2 border-dashed border-border rounded-[6px] p-8 text-center bg-muted/5 hover:bg-muted/10 transition-colors relative cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex flex-col items-center justify-center">
                <i className="ri-upload-cloud-2-line text-[#604ae3] text-[48px] mb-3 group-hover:scale-105 transition-transform" />
                <h3 className="text-[16px] font-bold text-foreground mb-1">
                  Drop your images here, or <span className="text-[#604ae3] hover:underline">click to browse</span>
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  PNG, JPG and GIF files are allowed. A square image (1:1) is highly recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Form details inputs */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Customer Information Section */}
            <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
              <h4 className="font-bold text-[15px] text-foreground border-b border-border pb-3 mb-4">
                Customer Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px]">
                
                <div>
                  <label htmlFor="customer-name" className="block text-foreground font-semibold mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customer-name"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customer-email" className="block text-foreground font-semibold mb-2">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    id="customer-email"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customer-number" className="block text-foreground font-semibold mb-2">
                    Customer Number
                  </label>
                  <input
                    type="text"
                    id="customer-number"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    placeholder="Enter Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="view-properties" className="block text-foreground font-semibold mb-2">
                    View Properties
                  </label>
                  <input
                    type="number"
                    id="view-properties"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors"
                    value={formData.viewProperties}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="own-properties" className="block text-foreground font-semibold mb-2">
                    Own Properties
                  </label>
                  <input
                    type="number"
                    id="own-properties"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors"
                    value={formData.ownProperties}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="invest-property" className="block text-foreground font-semibold mb-2">
                    Invest Property
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[16px]">
                      $
                    </span>
                    <input
                      type="number"
                      id="invest-property"
                      className="w-full bg-background border border-border rounded-[5px] pl-7 pr-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors"
                      value={formData.investProperty}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="customer-address" className="block text-foreground font-semibold mb-2">
                    Customer Address
                  </label>
                  <textarea
                    id="customer-address"
                    rows={3}
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60 resize-none leading-relaxed"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </div>

            {/* Location and status details */}
            <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
              <h4 className="font-bold text-[15px] text-foreground border-b border-border pb-3 mb-4">
                Location & Status Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13.5px]">
                
                <div>
                  <label htmlFor="customer-zipcode" className="block text-foreground font-semibold mb-2">
                    Zip-Code
                  </label>
                  <input
                    type="text"
                    id="customer-zipcode"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors"
                    value={formData.zipcode}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="customer-city" className="block text-foreground font-semibold mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="customer-city"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="customer-country" className="block text-foreground font-semibold mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="customer-country"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="customer-status" className="block text-foreground font-semibold mb-2">
                    Customer Status (Grid)
                  </label>
                  <select
                    id="customer-status"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="customer-list-status" className="block text-foreground font-semibold mb-2">
                    Customer List Status
                  </label>
                  <select
                    id="customer-list-status"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors"
                    value={formData.listStatus}
                    onChange={handleChange}
                  >
                    <option value="Interested">Interested</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="property-type" className="block text-foreground font-semibold mb-2">
                    Property Type Interest
                  </label>
                  <select
                    id="property-type"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors"
                    value={formData.propertyType}
                    onChange={handleChange}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Social Information Section */}
            <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
              <h4 className="font-bold text-[15px] text-foreground border-b border-border pb-3 mb-4">
                Social Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13.5px]">
                
                <div>
                  <label htmlFor="facebook-url" className="block text-foreground font-semibold mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    id="facebook-url"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    placeholder="https://facebook.com/username"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="instagram-url" className="block text-foreground font-semibold mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    id="instagram-url"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    placeholder="https://instagram.com/username"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="twitter-url" className="block text-foreground font-semibold mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    id="twitter-url"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    placeholder="https://twitter.com/username"
                    value={formData.twitter}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp-url" className="block text-foreground font-semibold mb-2">
                    Whatsapp URL (API)
                  </label>
                  <input
                    type="url"
                    id="whatsapp-url"
                    className="w-full bg-background border border-border rounded-[5px] px-3.5 py-2 text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60"
                    placeholder="https://wa.me/number"
                    value={formData.whatsapp}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </div>

            {/* Actions: Save & Cancel */}
            <div className="flex items-center gap-3 justify-end text-[13.5px]">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-secondary text-secondary-foreground hover:bg-secondary-foreground/10 px-6 py-2.5 rounded-[5px] font-bold transition-all border border-border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#604ae3] text-white hover:bg-[#503bc7] px-6 py-2.5 rounded-[5px] font-bold transition-all shadow-sm"
              >
                Save Customer
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
