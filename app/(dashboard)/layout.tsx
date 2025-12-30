import ChatAssistant from '@/components/ChatAssistant';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { PropsWithChildren } from 'react';

const layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="grid mx-auto max-w-7xl lg:grid-cols-5">
      {/* first-col hide on small screen */}
      <div className="hidden lg:min-h-screen lg:block lg:col-span-1">
        <Sidebar />
      </div>

      {/* second-col hide dropdown on big screen */}
      <div className="lg:col-span-4">
        <Navbar />
        <div className="px-4 py-16 sm:px-8 lg:px-16">{children}</div>
      </div>
      <ChatAssistant />
    </main>
  );
};

export default layout;
