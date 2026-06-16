import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  properties: 'Properties',
  list: 'List',
  grid: 'Grid',
  add: 'Add New',
  customers: 'Customers',
  showing: 'Showing Tours',
  'showing-tours': 'Showing Tours',
  agents: 'Agents',
  orders: 'Orders',
  transactions: 'Transactions',
  posts: 'Blog Posts',
  create: 'Create',
  inbox: 'Inbox',
  chats: 'Chats',
  profile: 'Profile',
  settings: 'Settings',
  help: 'Help & Support',
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const pathname = usePathname();

  // If explicit items are passed, use them
  let breadcrumbItems: BreadcrumbItem[] = [];

  if (items) {
    breadcrumbItems = items;
  } else {
    // Generate items from pathname
    const segments = pathname.split('/').filter(Boolean);
    
    breadcrumbItems = segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = routeLabels[segment.toLowerCase()] || 
        segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      
      return {
        label,
        href: index === segments.length - 1 ? undefined : href,
      };
    });
  }

  // Always prepend Dashboard / Home if not present
  if (breadcrumbItems.length === 0 || breadcrumbItems[0].label !== 'Dashboard') {
    breadcrumbItems.unshift({ label: 'Dashboard', href: '/' });
  }

  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-[13px] text-muted-foreground mb-4">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />}
            
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || '#'}
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                {index === 0 && <Home className="h-3.5 w-3.5" />}
                <span>{item.label}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
