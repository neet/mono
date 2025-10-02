import Link from "next/link";

export const Banner = () => {
  return (
    <header className="border-b-2 bg-[#FDD200]">
      <div className="flex justify-between items-center lg:max-w-lg mx-auto divide-x-2 divide-black px-2">
        <Link href="/" className="py-1 grow">
          <h1 className="text-2xl font-serif font-bold hover:underline">mono</h1>
        </Link>

        <div className="font-mono text-xs px-2 text-end">
          develop
        </div>
      </div>
    </header>
  );
};
