"use client";

import { useSelectedSite } from "@/contexts/selected-site";
import { WpSite } from "@/types";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export function DashboardContent({ user_sites }: { user_sites: WpSite[] }) {
  const { selectedSite, setSelectedSite } = useSelectedSite();

  useEffect(() => {
    if (!selectedSite && user_sites.length > 0) {
      setSelectedSite(user_sites[0]);
    }
  }, [selectedSite, user_sites, setSelectedSite]);

  useEffect(() => {
    if (selectedSite) {
      redirect(`/sites/${selectedSite.id}`);
    }
  }, [selectedSite]);

  return <div>Loading...</div>;
}
