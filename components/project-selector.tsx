"use client";

import { CreateProjectModal } from "@/components/create-project-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { WpSite } from "@/types";
import { Check, ChevronsUpDown, Globe, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

export default function ProjectSelector({
  user_sites,
}: {
  user_sites: WpSite[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const siteIdMatch = pathname.match(/^\/sites\/([^\/]+)/);
  const siteId = siteIdMatch?.[1];

  const [open, setOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleCreateProject = (name: string, url: string) => {
    // Here you would typically send this data to your backend or state management solution
    console.log("Creating project:", { name, url });
    // After creating the project, you might want to refresh the project list
  };

  // React.useEffect(() => {

  //   if (siteIdMatch) {
  //     const siteId = siteIdMatch[1];
  //     setSelectedSiteId(siteId);

  //     const matchedSite = user_sites.find((site) => site.id === siteId);
  //     if (matchedSite) {
  //       setSelectedSite(matchedSite);
  //     }
  //   }
  // }, [pathname, user_sites, setSelectedSite]);

  const site = user_sites.find((site: WpSite) => site.id === siteId);
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-fit justify-between"
          >
            <div className="flex items-center gap-4">
              {siteId && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/logo/logo-color.svg" alt="Logo" />
                  <AvatarFallback>
                    <AvatarImage src="/logo/logo-color.svg" alt="Logo" />
                  </AvatarFallback>
                </Avatar>
              )}
              {siteId ? site?.name || site?.base_url : "Select Site..."}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0 bg-white">
          <Command>
            <CommandInput placeholder="Search sites..." />
            <CommandEmpty>No site found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {user_sites && user_sites.length > 0 ? (
                  user_sites.map((site) => (
                    <CommandItem
                      key={site.id}
                      value={site.id}
                      onSelect={(currentValue) => {
                        router.push(`/sites/${site?.id}`);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          siteId === site.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {site.name || site.base_url}
                      <Link
                        href={"/sites"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto"
                      >
                        <Globe className="h-4 w-4" />
                      </Link>
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem>No projects available</CommandItem>
                )}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    // Handle create project action
                    console.log("Create a new project");
                    setIsCreateModalOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add a Wordpress Site
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </>
  );
}
