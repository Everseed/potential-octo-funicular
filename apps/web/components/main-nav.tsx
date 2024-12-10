'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function MainNav() {
  const pathname = usePathname();
  
  const routes = [
    {
      href: '/how-to',
      label: 'How to',
    },
    {
      href: '/pricing',
      label: 'Pricing',
    }
  ];

  return (
    <nav className="flex items-center space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === route.href ? 'text-black' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
      <Link 
        href="/signin"
        className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90"
      >
        Sign in
      </Link>
    </nav>
  );
}