'use client';

import { links } from '@/utils/links';

import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="h-full px-8 py-4 bg-muted ">
      <Logo />
      <div className="flex flex-col mt-20 gap-y-4 sticky top-10">
        {links &&
          links.map((link) => {
            return (
              <Button
                asChild
                key={link.href}
                variant={pathname === link.href ? 'default' : 'link'}
              >
                <Link href={link.href} className="flex items-center gap-x-2 ">
                  {link.icon}
                  <span className="capitalize">{link.label}</span>
                </Link>
              </Button>
            );
          })}
      </div>
    </aside>
  );
};

export default Sidebar;
