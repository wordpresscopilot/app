"use client";

import { createSiteProject } from "@/actions/site";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import * as React from "react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, url: string) => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreateProject,
}: CreateProjectModalProps) {
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [urlError, setUrlError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const validateUrl = (input: string) => {
    try {
      new URL(input);
      setUrlError("");
      return true;
    } catch (error) {
      setUrlError("Please enter a valid URL");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit", handleSubmit);
    e.preventDefault();
    if (!validateUrl(url)) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("baseUrl", url);
      const result = await createSiteProject(formData);
      console.log({ result });
      setName("");
      setUrl("");
      onClose();
      // Refresh the page after successful project creation
      window.location.reload();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect New Wordpress Site</DialogTitle>
          <DialogDescription>
            Enter the details of your Wordpress Site.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">WordPress Base URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  validateUrl(e.target.value);
                }}
                placeholder="https://myproject.com"
                required
              />
              {urlError && <p className="text-sm text-red-500">{urlError}</p>}
              <p className="text-sm text-muted-foreground">
                Enter the base URL of your WordPress site.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!!urlError || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
