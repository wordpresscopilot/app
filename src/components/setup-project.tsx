"use client";

import { runSiteHealthCheck, updateSite } from "@/actions/site";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SiteHealthStatus, WpSite } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";

export default function SetupProject({ site }: { site: WpSite }) {
  const [apiKey, setApiKey] = useState(site.api_key);
  const [copied, setCopied] = useState(false);
  const [siteName, setSiteName] = useState(site?.name);
  const [baseUrl, setBaseUrl] = useState(site?.base_url);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<SiteHealthStatus>("checking");

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success(`API Key Copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateSite = async () => {
    setIsLoading(true);
    try {
      await updateSite({
        id: site.id,
        fields: {
          name: siteName,
          base_url: baseUrl,
        },
      });
      toast.success("Site details updated successfully");
    } catch (error) {
      toast.error("Failed to update site details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    checkSiteHealth();
  };
  const getHealthCheckUrl = () => {
    try {
      if (baseUrl) {
        const url = new URL("/wp-json/wpsage/v1/health", baseUrl);
        return url.toString();
      }
      return "";
    } catch (error) {
      console.error("Error generating health check URL:", error);
      return "";
    }
  };

  const checkSiteHealth = async () => {
    // Simulating an API call to check the status
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // setStatus(Math.random() > 0.5 ? "connected" : "disconnected");
    // In a real-world scenario, you would make an actual API call here
    // For example:
    try {
      setStatus("checking");
      const healthStatus = await runSiteHealthCheck(
        site?.id,
        getHealthCheckUrl()
      );
      if (healthStatus) {
        setStatus("connected");
      } else {
        setStatus("disconnected");
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Site Details</CardTitle>
          <CardDescription>
            Enter your WordPress site information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              placeholder="My WordPress Site"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="base-url">Base URL</Label>
            <Input
              id="base-url"
              placeholder="https://mywordpresssite.com"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleUpdateSite}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">&#9696;</span>
                Saving...
              </>
            ) : (
              "Save Site Settings"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>Your Wordpress Sage API key below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={true}
              className="flex-grow"
            />
            <Button onClick={handleCopyApiKey} variant="outline">
              {copied ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">
                {copied ? "Copied" : "Copy API Key"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>
            Status of your Wordpress Sage plugin
          </CardDescription>
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
                    ? "Connected"
                    : status === "disconnected"
                    ? "Disconnected"
                    : "Checking..."}
                </span>
              </div>
              <Button onClick={checkSiteHealth} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </div>
            <div className="text-sm text-gray-500 break-all">
              <span className="font-semibold">Health Check URL:</span>
              {getHealthCheckUrl()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            Follow these steps to set up Wordpress Sage on your existing
            WordPress site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-4">
            <li className="flex gap-2">
              <strong>Download the Wordpress Sage plugin:</strong>
              <Button variant="link" className="p-0 h-auto font-normal">
                <Download className="h-4 w-4 mr-1 inline" />
                Download Plugin
              </Button>
            </li>
            <li>
              <strong>Log in to your WordPress admin panel</strong>
            </li>
            <li>
              <strong>
                Navigate to Plugins {">"} Add New {">"} Upload Plugin
              </strong>
            </li>
            <li>
              <strong>
                Choose the downloaded Wordpress Sage plugin file and click
                "Install Now"
              </strong>
            </li>
            <li>
              <strong>After installation, click "Activate Plugin"</strong>
            </li>
            <li>
              <strong>
                Go to Wordpress Sage settings in your WordPress admin panel
              </strong>
            </li>
            <li>
              <strong>Enter your API key in the designated field</strong>
            </li>
            <li>
              <strong>Save your settings</strong>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Need help? Contact our support team for assistance.</p>
        </div>
      </div>
    </div>
  );
}
