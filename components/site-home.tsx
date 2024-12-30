"use client";

import { deleteSite, updateSiteSSH } from "@/actions";
import EditSiteDialog from "@/components/edit-site-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WpSiteStatus from "@/components/wp-site-status";
import { getSshCredentials } from "@/data/site";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { SSH, WpSite } from "@/types";
import { Label } from "@radix-ui/react-label";
import { CheckCircle2, Copy, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
export default function SiteHome({ site }: { site: WpSite }) {
  const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 });
  const [copied, setCopied] = useState(false);
  const [sshCredentials, setSSHCredentials] = useState<SSH>();
  const [isSavingSshCredentials, setIsSavingSshCredentials] = useState(false);
  const [isSSH, setIsSSH] = useState(true);

  const isValidHost = (host: string) => {
    // Simple regex for IP address or domain name
    const hostRegex =
      /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$|^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    return hostRegex.test(host);
  };

  const isSshCredentialsValid = useMemo(() => {
    return (
      sshCredentials?.host &&
      isValidHost(sshCredentials.host) &&
      typeof sshCredentials?.port === "number" &&
      sshCredentials.port > 0 &&
      sshCredentials?.username &&
      sshCredentials?.password
    );
  }, [sshCredentials]);

  useEffect(() => {
    const fetchSshCredentials = async () => {
      const credentials = await getSshCredentials(site.id);
      if (credentials) {
        setSSHCredentials(credentials);
      }
    };
    fetchSshCredentials();
  }, [site.id]);

  const handleCopyApiKey = useCallback(() => {
    if (!site.api_key) {
      toast.error("No API key to copy");
      return;
    }
    copyToClipboard(site.api_key);
    setCopied(true);
    toast.success("API Key copied to clipboard");
  }, [copyToClipboard, site.api_key]);

  const handleDeleteSite = () => {
    if (
      confirm(
        "Are you sure you want to delete this site? This action cannot be undone."
      )
    ) {
      toast.promise(deleteSite(site.id), {
        loading: "Deleting site...",
        success: () => {
          window.location.href = "/"; // Redirect to home page after successful deletion
          return "Site deleted successfully";
        },
        error: "Failed to delete site",
      });
    }
  };

  const handleSSHCredentialChange = (
    field: keyof SSH,
    value: string | number
  ) => {
    setSSHCredentials((prev: any) => {
      if (!prev) return undefined;
      if (field === "port") {
        const portNumber = parseInt(value as string, 10);
        return { ...prev, [field]: isNaN(portNumber) ? "" : portNumber };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSaveSSHCredentials = async () => {
    if (isSavingSshCredentials || !sshCredentials || !isSshCredentialsValid)
      return;
    setIsSavingSshCredentials(true);
    toast.loading(`Updating ${isSSH ? "SSH" : "SFTP"} credentials...`);

    try {
      await updateSiteSSH({
        id: site.id,
        fields: {
          ssh: sshCredentials,
        },
      });
      toast.success(
        `${isSSH ? "SSH" : "SFTP"} credentials updated successfully`
      );
    } catch (error) {
      toast.error(`Failed to update ${isSSH ? "SSH" : "SFTP"} credentials`);
    } finally {
      setIsSavingSshCredentials(false);
    }
  };

  return (
    <div className="h-[calc(100vh-68px)] flex justify-center w-full overflow-y-scroll">
      <div className="container p-4 max-w-3xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Site Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Link href={`/sites/${site.id}/assistant`}>
                <Button variant="default" size="lg" className="w-full">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with Site
                </Button>
              </Link>
              {/* Add more action buttons here as needed */}
            </div>
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Site Details
              <EditSiteDialog site={site} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                placeholder="My WordPress Site"
                value={site.name}
                disabled={true}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="base-url">Base URL</Label>
              <Input
                id="base-url"
                placeholder="https://mywordpresssite.com"
                value={site.base_url}
                disabled={true}
              />
            </div>
          </CardContent>
        </Card>
        <WpSiteStatus site={site} />
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your API Key</CardTitle>
            <CardDescription>
              Your API key below to use with the WPCopilot Plugin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="api-key">
                <AccordionTrigger>View API Key</AccordionTrigger>
                <AccordionContent>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter your API key"
                      value={site.api_key}
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        {/* <Card className="mb-8">
          <CardHeader>
            <CardTitle>SSH / SFTP Credentials</CardTitle>
            <CardDescription>
              Manage your SSH / SFTP credentials for your WordPress site. You
              can use either, however more agent functionality is available with
              SSH.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="ssh-credentials">
                <AccordionTrigger>View/Edit Credentials</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ssh-sftp-toggle"
                        checked={isSSH}
                        onCheckedChange={setIsSSH}
                      />
                      <Label htmlFor="ssh-sftp-toggle">
                        {isSSH ? "SSH" : "SFTP"}
                      </Label>
                    </div>
                    <div>
                      <Label htmlFor="ssh-host">Host</Label>
                      <Input
                        id="ssh-host"
                        placeholder={`Enter ${isSSH ? "SSH" : "SFTP"} host`}
                        value={sshCredentials?.host || ""}
                        onChange={(e) =>
                          handleSSHCredentialChange("host", e.target.value)
                        }
                      />
                      {sshCredentials?.host &&
                        !isValidHost(sshCredentials.host) && (
                          <p className="text-red-500 text-sm mt-1">
                            Please enter a valid host (IP address or domain
                            name)
                          </p>
                        )}
                    </div>
                    <div>
                      <Label htmlFor="ssh-port">Port</Label>
                      <Input
                        id="ssh-port"
                        type="number"
                        placeholder={`Enter ${isSSH ? "SSH" : "SFTP"} port`}
                        value={sshCredentials?.port || ""}
                        onChange={(e) =>
                          handleSSHCredentialChange("port", e.target.value)
                        }
                      />
                      {(!sshCredentials?.port || sshCredentials.port <= 0) && (
                        <p className="text-red-500 text-sm mt-1">
                          Please enter a valid port number
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ssh-username">Username</Label>
                      <Input
                        id="ssh-username"
                        placeholder={`Enter ${isSSH ? "SSH" : "SFTP"} username`}
                        value={sshCredentials?.username || ""}
                        onChange={(e) =>
                          handleSSHCredentialChange("username", e.target.value)
                        }
                      />
                      {!sshCredentials?.username && (
                        <p className="text-red-500 text-sm mt-1">
                          Username cannot be empty
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ssh-password">Password</Label>
                      <Input
                        id="ssh-password"
                        type="password"
                        placeholder={`Enter ${isSSH ? "SSH" : "SFTP"} password`}
                        value={sshCredentials?.password || ""}
                        onChange={(e) =>
                          handleSSHCredentialChange("password", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      disabled={
                        isSavingSshCredentials || !isSshCredentialsValid
                      }
                      onClick={handleSaveSSHCredentials}
                      className="flex items-center gap-1"
                    >
                      {isSavingSshCredentials && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <span>Save {isSSH ? "SSH" : "SFTP"} Credentials</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card> */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Actions here cannot be undone. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Delete Site</h3>
                <p className="text-sm text-gray-500">
                  Permanently remove this site and all its data
                </p>
              </div>
              <Button variant="destructive" onClick={handleDeleteSite}>
                Delete Site
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
