import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 py-2 group">
      <div className="flex items-center justify-center w-10 h-10 transition-transform rounded-lg bg-primary group-hover:scale-105">
        <span className="text-2xl font-bold text-white">J</span>
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Job<span className="text-primary">ify</span>
      </h2>
    </Link>
  );
};

export default Logo;
