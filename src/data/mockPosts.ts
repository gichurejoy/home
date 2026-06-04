export interface BlogComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  text: string;
}

export interface BlogPost {
  id: string;
  title: string;
  coverImage: string;
  category: string;
  date: string;
  readTime: string;
  authorName: string;
  authorAvatar: string;
  authorDesc: string;
  views: number;
  excerpt: string;
  content: string;
  tags: string[];
  comments: BlogComment[];
}

export const mockPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Essential Home Staging Tips: How to Showcase Your Property for Maximum Buyer Appeal",
    coverImage: "/villa-pool.png",
    category: "Home Staging",
    date: "May 25, 2026",
    readTime: "5 min read",
    authorName: "Gaston Lapierre",
    authorAvatar: "/assets/images/users/avatar-1.jpg",
    authorDesc: "Gaston is a senior real estate advisor and creative director at Lahomes, with 12+ years of experience in luxury property showcasing.",
    views: 1542,
    excerpt: "Staging a home is a strategic marketing tool that highlights your property's best features, makes rooms appear larger, and creates a welcoming atmosphere that helps buyers envision themselves living there.",
    content: `Staging a home is a strategic marketing tool that highlights your property's best features, makes rooms appear larger, and creates a welcoming atmosphere that helps buyers envision themselves living there. When executed correctly, home staging can not only speed up the sale process but also potentially increase the final offer value.

Here are the key aspects of staging a home for sale:

1. **De-clutter and Depersonalize**: Buyers want to visualize their own life in the space. Remove personal photographs, awards, and excess belongings. Clear kitchen counters and bathroom vanities to make the property feel spacious and clean.

2. **Enhance Curb Appeal**: The first impression happens before the buyer even steps inside. Power-wash the driveway, trim the lawn, add potted plants near the doorway, and make sure the house number is clearly visible.

3. **Maximize Light and Space**: Open all blinds and curtains. Clean windows inside and out. Add high-wattage lightbulbs in darker corners. Reposition furniture to establish clear walkways and highlight structural focal points like fireplaces.

4. **Define Room Purposes**: Make sure each room has a single, clear purpose. If you have an empty room, stage it as a neat guest room or a functional home office. This helps buyers understand how to utilize the square footage.

Our blog delivers valuable content designed to help you excel in your role. Explore our articles, interviews, and expert commentary to gain valuable insights, expand your knowledge, and stay ahead of the curve. Whether you're seeking practical tips, strategic advice, or inspiration for your career, Lahomes is here to support your journey to success.`,
    tags: ["Real Estate", "Home Design", "Staging", "Tips"],
    comments: [
      {
        id: "comm-1",
        authorName: "Josephine Thompson",
        authorAvatar: "/assets/images/users/avatar-2.jpg",
        date: "May 26, 2026",
        text: "Absolutely wonderful experience reading this! The tips are highly practical and easy to implement. We staged our living room following these tips and received an offer within a week!"
      },
      {
        id: "comm-2",
        authorName: "Jacob Gines",
        authorAvatar: "/assets/images/users/avatar-3.jpg",
        date: "May 27, 2026",
        text: "Great point about curb appeal. Most buyers make up their mind within the first 30 seconds of pulling up to the curb. Excellent article!"
      }
    ]
  },
  {
    id: "post-2",
    title: "The Pros and Cons of Urban vs. Suburban Living: Finding the Right Fit for Your Lifestyle",
    coverImage: "/villa-pool.png",
    category: "Real Estate Market",
    date: "May 18, 2026",
    readTime: "7 min read",
    authorName: "Dianna Blair",
    authorAvatar: "/assets/images/users/avatar-3.jpg",
    authorDesc: "Dianna is a market analyst focusing on demographic shifts and housing price changes.",
    views: 890,
    excerpt: "Deciding where to live is one of the most significant lifestyle choices you will make. We weigh the benefits and drawbacks of bustling city life versus peaceful suburban neighborhoods.",
    content: `Deciding where to live is one of the most significant lifestyle choices you will make. Whether you prefer the fast-paced convenience of urban high-rises or the spacious tranquility of suburban estates, each offers a unique set of pros and cons.

**Urban Living Pros:**
- Public transit accessibility.
- Proximity to restaurants, cultural centers, and jobs.
- Lower maintenance responsibilities (especially in condos).

**Suburban Living Pros:**
- Larger square footage and private yard space.
- Quieter neighborhoods and lower crime statistics.
- Better school systems and community parks.

Analyze your daily routines, long-term family plans, and budget allocations to decide which setting matches your lifestyle.`,
    tags: ["Suburban", "Urban", "Market Trends", "Lifestyle"],
    comments: []
  },
  {
    id: "post-3",
    title: "10 Cost-Effective Upgrades to Instantly Boost Your Home's Resale Value",
    coverImage: "/villa-pool.png",
    category: "Home Improvement",
    date: "May 10, 2026",
    readTime: "4 min read",
    authorName: "David Wilson",
    authorAvatar: "/assets/images/users/avatar-4.jpg",
    authorDesc: "David is a licensed contractor and home renovation expert at Lahomes.",
    views: 2110,
    excerpt: "You don't need a massive budget to raise your property value. Discover simple, budget-friendly renovations that yield high returns on investment.",
    content: `You don't need a massive budget to raise your property value. Discover simple, budget-friendly renovations that yield high returns on investment.

Some of the highest return projects include:
1. **Fresh Paint**: Neutral wall colors make spaces feel clean and bright.
2. **Modern Lighting**: Replace old brass light fixtures with matte black or brushed nickel designs.
3. **Smart Thermostats**: Buyers value energy-saving smart integrations.
4. **Hardware Updates**: Tweak cabinet handles and door knobs.

Focusing on these minor modifications can create an outsized return when you list the home for sale.`,
    tags: ["Renovation", "DIY", "Value Boost", "Budgeting"],
    comments: []
  }
];

export const mockCategories = [
  { name: "Home Staging", count: 12 },
  { name: "Real Estate Market", count: 8 },
  { name: "Home Improvement", count: 15 },
  { name: "Architecture Trends", count: 6 },
  { name: "Agent Guides", count: 10 }
];

export const mockPopularPosts = [
  {
    id: "post-3",
    title: "10 Cost-Effective Upgrades to Instantly Boost Your Home's Resale Value",
    date: "May 10, 2026",
    views: "2.1k views"
  },
  {
    id: "post-1",
    title: "Essential Home Staging Tips: How to Showcase Your Property",
    date: "May 25, 2026",
    views: "1.5k views"
  },
  {
    id: "post-2",
    title: "The Pros and Cons of Urban vs. Suburban Living",
    date: "May 18, 2026",
    views: "890 views"
  }
];
