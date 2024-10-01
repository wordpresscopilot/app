"use client";

import ProjectSelector from "@/components/project-selector";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSelectedSite } from "@/contexts/selected-site";
import { retrieveSites, runSiteHealthCheck } from "@/data/site";
import { WpSite } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import * as React from "react";

function UserOrLogin({ userId }: { userId: string }) {
  return (
    <>
      <div className="flex items-center">
        {userId ? (
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
  const { selectedSite, setSelectedSite, refreshSelectedSite } =
    useSelectedSite();
  const [userSites, setUserSites] = React.useState([] as WpSite[]);
  const [isChecking, setIsChecking] = React.useState(false);

  const checkSiteHealth = async () => {
    setIsChecking(true);
    console.log({ selectedSite });
    const healthCheckResponse = await runSiteHealthCheck(selectedSite!.id);
    console.log({ healthCheckResponse });
    setSelectedSite((prevSite) => ({
      ...prevSite!,
      plugin_connected: healthCheckResponse.ok,
      last_connected_date: new Date(),
    }));

    setIsChecking(false);
    await refreshSelectedSite();
  };

  React.useEffect(() => {
    const fetchSites = async () => {
      const sites = await retrieveSites({
        user_id: userId!,
      });
      setUserSites(sites);
      if (sites.length > 0) {
        setSelectedSite(sites[0]);
      }
    };

    if (userId) {
      fetchSites();
    }
  }, [userId]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <ProjectSelector user_sites={userSites} />
        </React.Suspense>
      </div>

      <div className="flex justify-center w-full">
        {selectedSite && (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="mx-auto flex items-center justify-between w-full max-w-[200px] sm:max-w-[300px]"
                >
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="truncate w-full">{selectedSite.name}</span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {selectedSite.base_url}
                    </span>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ml-2 flex-shrink-0 ${
                      isChecking
                        ? "bg-yellow-500 animate-pulse"
                        : selectedSite.plugin_connected
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="w-full">
                <div className="flex flex-col space-y-4 p-4">
                  <h2 className="text-lg font-semibold">{selectedSite.name}</h2>
                  <Link
                    href={selectedSite.base_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {selectedSite.base_url}
                  </Link>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        isChecking
                          ? "bg-yellow-500 animate-pulse"
                          : selectedSite.plugin_connected
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium text-sm">
                      {isChecking
                        ? "Checking Plugin..."
                        : selectedSite.plugin_connected
                        ? "Plugin Connected"
                        : "Plugin Disconnected"}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                    <Button
                      onClick={checkSiteHealth}
                      variant="outline"
                      size="sm"
                      disabled={isChecking}
                      className="w-full sm:w-auto"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${
                          isChecking ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                    <Link href={`/sites/${selectedSite.id}`} passHref>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Edit Site
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin userId={userId!} />
        </React.Suspense>
      </div>
    </header>
  );
}
