import { X } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ServerSettingsLayoutProps {
  children: ReactNode;
  params: Promise<{
    serverId: string;
  }>;
}

export default async function ServerSettingsLayout({ children, params }: ServerSettingsLayoutProps) {
  const resolvedParams = await params;
  const serverId = resolvedParams.serverId;
  
  return (
    <div className="w-full border-l-1 flex flex-col h-screen dark:border-zinc-500/30 relative">
      <Link href={`/a/servers/${serverId}`} className="absolute left-2 top-2 cursor-pointer">
        <X />
      </Link>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}