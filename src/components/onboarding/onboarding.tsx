"use client";

import { createSiteProject, retrieveSites } from "@/actions/site";
import { Logo } from "@/components/logo";
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
import { cn } from "@/lib/utils";
import { WpSite } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import {
  CheckCircle2,
  Cog,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const Steps = {
  ADD_SITE: 1,
  CONNECT_PLUGIN: 2,
  FINISH: 3,
};

enum Errors {
  SITE_ALREADY_CONNECTED = "You've already connected this site",
  INVALID_URL = "Please enter a valid URL",
}

function createUrl(url: string | undefined) {
  if (!url) return null;
  try {
    return new URL(url);
  } catch (error) {
    return null;
  }
}

export default function Onboarding({ user_site }: { user_site?: WpSite }) {
  const { push } = useRouter();
  const { userId } = useAuth();
  const [site, setSite] = useState<WpSite | null>(user_site ?? null);
  const [step, setStep] = useState(Steps.ADD_SITE);
  const [projectName, setProjectName] = useState("");
  const [baseWordpressSiteUrl, setBaseWordpressSiteUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isPluginConnected, setIsPluginConnected] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [urlError, setUrlError] = useState<Errors | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorCreatingSite, setErrorCreatingSite] = useState("");
  const isBaseWordpressSiteUrlValid =
    !!baseWordpressSiteUrl &&
    (urlError ? urlError === Errors.SITE_ALREADY_CONNECTED : false);
  const [existingSiteUrls, setExistingSiteUrls] = useState<URL[]>([]);
  const currentSiteAlreadyConnected =
    !!isBaseWordpressSiteUrlValid &&
    baseWordpressSiteUrl &&
    existingSiteUrls
      .map((url) => url.host)
      .includes(createUrl(baseWordpressSiteUrl)?.host ?? "");

  const handleSetActiveSite = async () => {
    if (!userId) return;
    const sites = await retrieveSites({ user_id: userId });
    const matchingSite = sites.find(
      (site) => site.base_url === baseWordpressSiteUrl
    );
    if (matchingSite) {
      setSite(matchingSite);
    }
  };

  const validateUrl = (url: string) => {
    if (!url) {
      setUrlError(null);
      return false;
    }

    try {
      const urlObj = createUrl(url);
      if (
        urlObj &&
        existingSiteUrls.map((url) => url.host).includes(urlObj.host)
      ) {
        setUrlError(Errors.SITE_ALREADY_CONNECTED);
        handleSetActiveSite();
        return true;
      }

      setUrlError(null);
      return true;
    } catch (error) {
      setUrlError(Errors.INVALID_URL);
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
    if (currentSiteAlreadyConnected) {
      setStep(Steps.CONNECT_PLUGIN);
      return;
    }

    e.preventDefault();
    if (!validateUrl(baseWordpressSiteUrl)) return;
    setIsCreatingProject(true);
    setErrorCreatingSite("");

    try {
      const formData = new FormData();
      formData.append("name", projectName);
      formData.append("baseUrl", baseWordpressSiteUrl);
      const result = await createSiteProject(formData);

      setSite(result);
      setApiKey(result.api_key);
      setStep(Steps.CONNECT_PLUGIN);
    } catch (error: any) {
      console.error("Error creating project:", error);
      setErrorCreatingSite(error.message);
      toast.error("Error creating project", {
        description: error.message,
      });
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleConfirm = () => {
    // Here you would typically verify the connection
    // For this example, we'll just move to the final step
    setStep(Steps.FINISH);
  };

  const handleRetrieveSites = useCallback(async () => {
    if (!userId) return;
    const sites = await retrieveSites({ user_id: userId });
    setExistingSiteUrls(
      sites
        .map((site) => createUrl(site.base_url))
        .filter((url) => url !== null) as URL[]
    );
  }, [userId]);

  // Simulating a check for plugin connection
  useEffect(() => {
    let checkConnectionInterval: NodeJS.Timeout;

    if (step === Steps.CONNECT_PLUGIN) {
      checkConnectionInterval = setInterval(() => {
        // Replace this with an actual API call to check plugin status
        const connected = Math.random() < 0.5;
        setIsPluginConnected(connected);
        if (connected) {
          clearInterval(checkConnectionInterval);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => clearInterval(checkConnectionInterval);
  }, [step]);

  useEffect(() => {
    if (userId && step === Steps.ADD_SITE) {
      handleRetrieveSites();
    }
  }, [userId, handleRetrieveSites, step]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-7 gap-4",
        "min-h-screen w-full p-4",
        "bg-gradient-to-b from-blue-100 to-white"
      )}
    >
      <Card className="w-full col-span-1 xl:col-span-3 relative flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl font-bold">
            <Logo />
            <span>Welcome to Wordpress Copilot</span>
          </CardTitle>
          <CardDescription className="text-base font-medium">
            {`Let's get your WordPress site connected in just a few steps.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full grow">
          <Tabs
            value={step.toString()}
            onValueChange={(value) => setStep(parseInt(value))}
            className="w-full h-[80%]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value={Steps.ADD_SITE.toString()}
                disabled={step < Steps.ADD_SITE}
              >
                Add Wordpress Site
              </TabsTrigger>
              <TabsTrigger
                value={Steps.CONNECT_PLUGIN.toString()}
                disabled={
                  step < Steps.CONNECT_PLUGIN && !currentSiteAlreadyConnected
                }
              >
                Connect Plugin
              </TabsTrigger>
              <TabsTrigger
                value={Steps.FINISH.toString()}
                disabled={step < Steps.FINISH && !currentSiteAlreadyConnected}
              >
                Finish
              </TabsTrigger>
            </TabsList>
            <TabsContent value={Steps.ADD_SITE.toString()}>
              <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Site Name</Label>
                  <Input
                    id="project-name"
                    placeholder="My Awesome WordPress Site"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base-url">WordPress Site Base URL</Label>
                  <Input
                    id="base-url"
                    placeholder="https://mywordpresssite.com"
                    value={baseWordpressSiteUrl}
                    onChange={(e) => {
                      setBaseWordpressSiteUrl(e.target.value);
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
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isCreatingProject && !currentSiteAlreadyConnected}
                  onClick={(e) => {
                    if (currentSiteAlreadyConnected) {
                      e.preventDefault();
                      push(`/sites/${site?.id}`);
                    }
                  }}
                >
                  {isCreatingProject && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span>
                    {currentSiteAlreadyConnected
                      ? "Go to site dashboard"
                      : "Add Wordpress Site"}
                  </span>
                </Button>
                {errorCreatingSite && (
                  <p className="text-sm text-red-500">{errorCreatingSite}</p>
                )}
              </form>
            </TabsContent>
            <TabsContent value={Steps.CONNECT_PLUGIN.toString()}>
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
                        href={`${baseWordpressSiteUrl}/wp-admin/plugin-install.php`}
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
                        href={`${baseWordpressSiteUrl}/wp-admin/options-general.php?page=wpsage-api-settings`}
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
                  <span
                    className={cn(
                      "relative flex h-3 w-3",
                      !isPluginConnected ? "mt-1" : "mt-[1px]"
                    )}
                  >
                    <span
                      className={cn(
                        "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75",
                        !isPluginConnected ? "opacity-75" : "opacity-0"
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex rounded-full h-3 w-3",
                        !isPluginConnected ? "bg-red-500" : "bg-green-500"
                      )}
                    ></span>
                  </span>
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
            <TabsContent value={Steps.FINISH.toString()} className="h-full">
              <div className="flex flex-col items-center justify-center gap-3 text-center h-full">
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-9 h-9 text-green-500 animate-fade-in-up delay-100" />
                  <h3 className="text-3xl font-semibold animate-fade-in-up delay-400">
                    All Set!
                  </h3>
                </div>
                <div className="flex flex-col gap-1 animate-fade-in-up delay-700">
                  <span className="text-lg font-medium">
                    Your WordPress site is now connected to Wordpress Copilot.
                  </span>
                  <span>
                    You are ready to start using the power of AI to manage and
                    develop your site.
                  </span>
                </div>
                <Link
                  href={`/sites/${site?.id}`}
                  className="mt-2 animate-fade-in-up delay-1000"
                >
                  <Button className="w-full">Go to Site Dashboard</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="absolute bottom-0 mt-12 w-full">
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center space-x-2">
              {site?.base_url ? (
                <>
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span className="text-muted-foreground">
                    {site?.base_url}
                  </span>
                </>
              ) : null}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of 3
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* Site preview */}
      <Card
        className={cn(
          "w-full col-span-1 xl:col-span-4 overflow-hidden",
          "bg-transparent border-gray-300"
        )}
      >
        <CardContent className="flex items-center justify-center w-full h-full p-0">
          {!isBaseWordpressSiteUrlValid ? (
            <Cog className="w-24 h-24 text-gray-500 mx-auto opacity-30 animate-spin-slow" />
          ) : (
            <iframe src={baseWordpressSiteUrl} className="w-full h-full" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
