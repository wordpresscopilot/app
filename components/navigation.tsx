import Image from "next/image";
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { config } from "@/config";
import { retrieveSites } from "@/data/site";
import { currentUser } from "@clerk/nextjs/server";
import ProjectSelector from "./project-selector";

export async function Navigation() {
  const user = await currentUser();
  const user_sites = await retrieveSites({
    user_id: user?.id!,
  });
  return (
    <>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base w-max"
        >
          <Image
            src="/logo.png"
            alt="logo"
            width="52"
            height="52"
            className="w-8 h-8 rounded-full"
          />
          <span>{config.siteName}</span>
        </Link>
      </nav>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="hidden ml-auto flex-1 sm:flex-initial md:block">
          <ProjectSelector user_sites={user_sites} />
        </div>
        <div className="hidden md:flex gap-3">
          <ModeToggle />
        </div>
        <div className="flex items-center gap-3 ml-auto md:ml-0"></div>
      </div>
    </>
  );
}
