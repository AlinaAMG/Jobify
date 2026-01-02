import { Button } from '@/components/ui/button';

import Image from 'next/image';
import LandingImg from '../assets/main.svg';
import Link from 'next/link';
import Logo from '@/components/Logo';

const HomePage = () => {
  return (
    <main>
      <header className="max-w-6xl px-4 py-6 mx-auto sm:px-6 ">
        <Logo />
      </header>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 h-screen -mt-20 grid lg:grid-cols-[1fr,400px] items-center">
        <div>
          <h1 className="text-4xl font-bold capitalize md:text-7xl">
            Sollicitatie <span className="text-primary">Beheersysteem</span> app
          </h1>
          <p className="max-w-md mt-4 leading-loose">
            Maak een einde aan de chaos van losse spreadsheets en e-mails. Met
            Jobify organiseer je al je sollicitaties op één slim dashboard. Volg
            je voortgang van de eerste klik tot de uiteindelijke aanbieding,
            beheer je documenten en mis nooit meer een belangrijke deadline.
            Jouw droombaan verdient een gestructureerde aanpak.
          </p>
          <Button asChild className="font-bold mt-7" size="lg">
            <Link href="/add-job">Aan de slag</Link>
          </Button>
        </div>
        <Image
          src={LandingImg}
          alt="landing"
          priority
          className="hidden lg:block"
        />
      </section>
    </main>
  );
};

export default HomePage;
