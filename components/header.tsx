"use client";

import { ChatHistory } from "@/components/chat-history";
import ProjectSelector from "@/components/project-selector";
import { SidebarMobile } from "@/components/sidebar-mobile";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { IconNextChat, IconSeparator } from "@/components/ui/icons";
import { retrieveSites } from "@/data/site";
import { WpSite } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import * as React from "react";

function UserOrLogin({ userId }: { userId: string }) {
  return (
    <>
      <div className="flex items-center">
        {userId ? (
          // <UserMenu user={mapClerkUserForClient(user!)} />
          <UserButton />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in">Login</Link>
          </Button>
        )}
      </div>
    </>
  );
}

export function Header() {
  const { userId } = useAuth();
  const [userSites, setUserSites] = React.useState([] as WpSite[]);

  React.useEffect(() => {
    const fetchSites = async () => {
      const sites = await retrieveSites({
        user_id: userId!,
      });
      setUserSites(sites);
    };

    if (userId) {
      fetchSites();
    }
  }, [userId]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        {userId ? (
          <>
            <SidebarMobile>
              <ChatHistory userId={userId!} />
            </SidebarMobile>
            <SidebarToggle />
          </>
        ) : (
          <Link href="/new" rel="nofollow">
            <IconNextChat className="size-6 mr-2 dark:hidden" inverted />
            <IconNextChat className="hidden size-6 mr-2 dark:block" />
          </Link>
        )}
        <IconSeparator className="size-6 text-muted-foreground/50" />

        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <ProjectSelector user_sites={userSites} />
        </React.Suspense>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin userId={userId!} />
          {/* <UserButton /> */}
        </React.Suspense>
      </div>
    </header>
  );
}
