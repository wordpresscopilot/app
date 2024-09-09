"use client";

import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import * as React from "react";

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
import { useSelectedSite } from "@/contexts/selected-site";
import { cn } from "@/lib/utils";
import { WpSite } from "@/types";
import { useRouter } from "next/navigation";
import { CreateProjectModal } from "./create-project-modal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function ProjectSelector({
  user_sites,
}: {
  user_sites: WpSite[];
}) {
  const { selectedSite, setSelectedSite } = useSelectedSite();
  const [open, setOpen] = React.useState(false);
  const [selectedSiteId, setSelectedSiteId] = React.useState<string | null>(
    selectedSite?.id
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const router = useRouter();

  const handleCreateProject = (name: string, url: string) => {
    // Here you would typically send this data to your backend or state management solution
    console.log("Creating project:", { name, url });
    // After creating the project, you might want to refresh the project list
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
          >
            <div className="flex items-center gap-4">
              {selectedSite && (
                <Avatar className="ml-2 h-6 w-6">
                  <AvatarImage src="/logo.png" alt="Logo" />
                  <AvatarFallback>
                    <AvatarImage src="/logo.png" alt="Logo" />
                  </AvatarFallback>
                </Avatar>
              )}
              {selectedSite
                ? user_sites.find((site: WpSite) => site.id === selectedSite.id)
                    ?.name
                : "Select wordpress site..."}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search project..." />
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {user_sites && user_sites.length > 0 ? (
                  user_sites.map((site) => (
                    <CommandItem
                      key={site.id}
                      value={site.id}
                      onSelect={(currentValue) => {
                        setSelectedSiteId(currentValue);
                        const selectedSite = user_sites.find(
                          (site) => site.id === currentValue
                        );
                        setSelectedSite(selectedSite);
                        setOpen(false);
                        if (selectedSite) {
                          router.push(`/site/${selectedSite?.id}`);
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSite?.id === site.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {site.name}
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
                  Create a project
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
