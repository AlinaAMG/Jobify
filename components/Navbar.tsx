import { UserButton } from '@clerk/nextjs';
import LinksDropdown from './LinksDropdown';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-4 bg-muted sm:px-16 lg:px-24 px:4 ">
      <div>
        <LinksDropdown />
      </div>
      <div className="flex items-center gap-x-4">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Navbar;
