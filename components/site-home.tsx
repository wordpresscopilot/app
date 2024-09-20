"use client";
import { deleteSite, updateSite } from "@/actions";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { SSH, WpSite } from "@/types";
import { Label } from "@radix-ui/react-label";
import { CheckCircle2, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import EditSiteDialog from "./edit-site-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import WpSiteStatus from "./wp-site-status";

export default function SiteHome({ site }: { site: WpSite }) {
  const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 });
  const [copied, setCopied] = useState(false);
  const [sshCredentials, setSSHCredentials] = useState<SSH>();

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
    setSSHCredentials((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSSHCredentials = async () => {
    // const sshhealth = await checkSSHHealth(site);
    // console.log("sshhealth", sshhealth);
    toast.promise(
      updateSite({
        id: site.id,
        fields: {
          name: site.name,
          base_url: site.base_url,
        },
      }),
      {
        loading: "Updating SSH credentials...",
        success: "SSH credentials updated successfully",
        error: "Failed to update SSH credentials",
      }
    );
  };

  return (
    <div className="w-full overflow-y-scroll">
      <div className="container p-4 max-w-3xl">
        <WpSiteStatus site={site} />
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your API Key</CardTitle>
            <CardDescription>
              Your API key below to use with WordPress
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>SSH Credentials</CardTitle>
            <CardDescription>
              Manage your SSH credentials for WordPress connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="ssh-credentials">
                <AccordionTrigger>View/Edit SSH Credentials</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ssh-host">Host</Label>
                      <Input
                        id="ssh-host"
                        placeholder="Enter SSH host"
                        value={sshCredentials?.host}
                        onChange={(e) =>
                          handleSSHCredentialChange("host", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ssh-port">Port</Label>
                      <Input
                        id="ssh-port"
                        type="number"
                        placeholder="Enter SSH port"
                        value={sshCredentials?.port}
                        onChange={(e) =>
                          handleSSHCredentialChange(
                            "port",
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ssh-username">Username</Label>
                      <Input
                        id="ssh-username"
                        placeholder="Enter SSH username"
                        value={sshCredentials?.username}
                        onChange={(e) =>
                          handleSSHCredentialChange("username", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ssh-password">Password</Label>
                      <Input
                        id="ssh-password"
                        type="password"
                        placeholder="Enter SSH password"
                        value={sshCredentials?.password}
                        onChange={(e) =>
                          handleSSHCredentialChange("password", e.target.value)
                        }
                      />
                    </div>
                    <Button onClick={handleSaveSSHCredentials}>
                      Save SSH Credentials
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card>
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
