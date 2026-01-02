import { AppWindow, AreaChart, Layers, Bot } from 'lucide-react';

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const links: NavLink[] = [
  {
    href: '/add-job',
    label: 'vacature toevoegen',
    icon: <Layers />,
  },
  {
    href: '/jobs',
    label: 'vacatures',
    icon: <AppWindow />,
  },
  {
    href: '/stats',
    label: 'statistieken',
    icon: <AreaChart />,
  },
  {
    href: '/ai-coach',
    label: 'ai coach',
    icon: <Bot />,
  },
];
