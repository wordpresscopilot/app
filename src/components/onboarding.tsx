"use client";

import { createSiteProject } from "@/actions/site";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WpSite } from "@/types";
import {
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Onboarding({ user_site }: { user_site?: WpSite }) {
  const [site, setSite] = useState<WpSite | null>(user_site ?? null);
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isPluginConnected, setIsPluginConnected] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [copied, setCopied] = useState(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      setUrlError("");
      return true;
    } catch (error) {
      setUrlError("Please enter a valid URL");
      return false;
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success(`API Key Copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(baseUrl)) return;
    setIsCreatingProject(true);
    try {
      const formData = new FormData();
      formData.append("name", projectName);
      formData.append("baseUrl", baseUrl);
      const result = await createSiteProject(formData);
      setSite(result);
      setApiKey(result.api_key);
      setStep(2);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleConfirm = () => {
    // Here you would typically verify the connection
    // For this example, we'll just move to the final step
    setStep(3);
  };

  // Simulating a check for plugin connection
  useEffect(() => {
    if (step === 2) {
      const checkConnection = setInterval(() => {
        // Replace this with an actual API call to check plugin status
        const connected = Math.random() < 0.5;
        setIsPluginConnected(connected);
        if (connected) {
          clearInterval(checkConnection);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(checkConnection);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Welcome to Wordpress Copilot
          </CardTitle>
          <CardDescription>
            The GPT AI Agent to 10x developing and managing your site.
            <br />
            Let us get your WordPress site connected in just a few steps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={step.toString()} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="1" disabled={step < 1}>
                Add Wordpress Site
              </TabsTrigger>
              <TabsTrigger value="2" disabled={step < 2}>
                Connect Plugin
              </TabsTrigger>
              <TabsTrigger value="3" disabled={step < 3}>
                Finish
              </TabsTrigger>
            </TabsList>
            <TabsContent value="1">
              <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Site Name</Label>
                  <Input
                    id="project-name"
                    placeholder="My Awesome WordPress Site"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base-url">WordPress Site Base URL</Label>
                  <Input
                    id="base-url"
                    placeholder="https://mywordpresssite.com"
                    value={baseUrl}
                    onChange={(e) => {
                      setBaseUrl(e.target.value);
                      validateUrl(e.target.value);
                    }}
                    required
                  />
                  {urlError && (
                    <p className="text-sm text-red-500">{urlError}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isCreatingProject || !!urlError}
                >
                  {isCreatingProject ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Wordpress Site"
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="2">
              <div className="space-y-4 mt-4">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Your API Key</CardTitle>
                    <CardDescription>
                      Your Wordpress Sage API key below
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        value={apiKey}
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
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    Follow these steps to connect your WordPress site:
                  </h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Log in to your WordPress admin panel</li>
                    <li>
                      Go to{" "}
                      <Link
                        href={`${baseUrl}/wp-admin/plugin-install.php`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Plugins &gt; Add New{" "}
                        <ExternalLink className="inline-block w-4 h-4" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/plugin"
                        target="_blank"
                        className="text-blue-500 hover:underline inline-flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" /> Download the
                        Wordpress Copilot connector plugin
                      </Link>
                    </li>
                    <li>
                      Upload and activate the plugin in your WordPress admin
                    </li>
                    <li>
                      Go to{" "}
                      <Link
                        href={`${baseUrl}/wp-admin/options-general.php?page=wpsage-api-settings`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Settings &gt; Wordpress Copilot{" "}
                        <ExternalLink className="inline-block w-4 h-4" />
                      </Link>
                    </li>
                    <li>Enter your API key and save</li>
                  </ol>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isPluginConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span>
                    {isPluginConnected
                      ? "Plugin Connected"
                      : "Waiting for plugin connection..."}
                  </span>
                </div>
                <Button
                  onClick={handleConfirm}
                  className="w-full"
                  disabled={!isPluginConnected}
                >
                  {isPluginConnected
                    ? "Continue"
                    : "Waiting for plugin connection..."}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="3">
              <div className="text-center space-y-4 mt-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-semibold">All Set!</h3>
                <p>
                  Your WordPress site is now connected to Wordpress Copilot. You
                  are ready to start using the power of AI to manage and develop
                  your site.
                </p>
                <Link href={`/sites/${site?.id}`}>
                  <Button className="w-full">Go to Site Dashboard</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-between">
          <div className="flex items-center space-x-2">
            {site?.base_url ? (
              <>
                <Globe className="w-5 h-5 text-blue-500" />
                <span>{site?.base_url}</span>
              </>
            ) : null}
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Step {step} of 3</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
