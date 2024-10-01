"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelectedSite } from "@/contexts/selected-site";
import { runSiteHealthCheck } from "@/data/site";
import { WP_PATH_HEALTH } from "@/lib/paths";
import { SiteHealthStatus, WpSite } from "@/types";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function WpSiteStatus({ site }: { site: WpSite }) {
  const [apiKey, setApiKey] = useState(site.api_key);
  const [copied, setCopied] = useState(false);
  const [siteName, setSiteName] = useState(site?.name);
  const [baseUrl, setBaseUrl] = useState(site?.base_url);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshSelectedSite } = useSelectedSite();
  const [status, setStatus] = useState<SiteHealthStatus>(
    site?.plugin_connected ? "connected" : "disconnected"
  );
  const [statusSSH, setStatusSSH] = useState<SiteHealthStatus>(
    site?.ssh_connected ? "connected" : "disconnected"
  );

  const getHealthCheckUrl = () => {
    try {
      if (site.base_url) {
        const url = new URL(WP_PATH_HEALTH, site.base_url);
        return url.toString();
      }
      return "";
    } catch (error) {
      console.error("Error generating health check URL:", error);
      return "";
    }
  };

  const checkSiteHealth = async () => {
    try {
      setStatus("checking");
      const healthStatus = await runSiteHealthCheck(site?.id);
      if (healthStatus) {
        setStatus("connected");
      } else {
        setStatus("disconnected");
      }
      refreshSelectedSite();
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  const checkSiteSSHHealth = async () => {
    try {
      setStatusSSH("checking");
      // const healthStatus = await runSSHHealthCheck(site);
      const healthStatus = {
        success: false,
        message: "SSH connection successful",
      };
      if (healthStatus?.success) {
        setStatusSSH("connected");
      } else {
        setStatusSSH("disconnected");
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Connection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`h-3 w-3 rounded-full ${
                  status === "connected"
                    ? "bg-green-500"
                    : status === "disconnected"
                    ? "bg-red-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
              />
              <span className="font-medium">
                {status === "connected"
                  ? "Plugin Connected"
                  : status === "disconnected"
                  ? "Plugin Disconnected"
                  : "Checking Plugin..."}
              </span>
            </div>
            <Button
              onClick={() => {
                checkSiteHealth();
              }}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Plugin Status
            </Button>
          </div>
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`h-3 w-3 rounded-full ${
                  statusSSH === "connected"
                    ? "bg-green-500"
                    : statusSSH === "disconnected"
                    ? "bg-red-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
              />
              <span className="font-medium">
                {statusSSH === "connected"
                  ? "SSH Connected"
                  : statusSSH === "disconnected"
                  ? "SSH Disconnected"
                  : "Checking SSH..."}
              </span>
            </div>
            <Button
              onClick={() => {
                checkSiteSSHHealth();
              }}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh SSH Status
            </Button>
          </div> */}
        </div>
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="connection-details">
            <AccordionTrigger>Connection Details</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li>
                  <strong>Site URL:</strong> {site.base_url}
                </li>
                <li>
                  <strong>Last Verified Connection:</strong>{" "}
                  {site?.last_connected_date?.toLocaleString()}
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
