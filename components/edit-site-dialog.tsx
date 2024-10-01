import { updateSite } from "@/actions/site";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WpSite } from "@/types";
import { Edit, Loader } from "lucide-react";
import { useEffect, useState } from "react";

interface EditSiteDialogProps {
  site: WpSite;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function EditSiteDialog({
  site,
  isOpen,
  onClose = () => {},
}: EditSiteDialogProps) {
  const [name, setName] = useState(site.name);
  const [baseUrl, setBaseUrl] = useState(site.base_url);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);
  const [urlError, setUrlError] = useState("");

  const validateUrl = (url: string) => {
    const urlPattern = /^https:\/\/.+/;
    return urlPattern.test(url);
  };

  const handleSave = async () => {
    if (!validateUrl(baseUrl)) {
      setUrlError("Please enter a valid URL starting with https://");
      return;
    }
    setIsSaving(true);
    try {
      await updateSite({ id: site.id, fields: { name, base_url: baseUrl } });
      setIsDialogOpen(false);
      onClose();
    } catch (error) {
      console.error("Failed to update site:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setName(site.name);
    setBaseUrl(site.base_url);
    setUrlError("");
    setIsDialogOpen(false);
    onClose();
  };

  const handleBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setBaseUrl(newUrl);
    if (newUrl && !validateUrl(newUrl)) {
      setUrlError("Please enter a valid URL starting with https://");
    } else {
      setUrlError("");
    }
  };

  useEffect(() => {
    if (isOpen !== undefined) {
      setIsDialogOpen(isOpen);
    }
  }, [isOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Site Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Edit Site Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="name"
              className="text-right text-gray-700 dark:text-gray-300"
            >
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="base_url"
              className="text-right text-gray-700 dark:text-gray-300"
            >
              Base URL
            </Label>
            <div className="col-span-3">
              <Input
                id="base_url"
                value={baseUrl}
                onChange={handleBaseUrlChange}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              {urlError && (
                <p className="text-red-500 text-sm mt-1">{urlError}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !!urlError}>
            {isSaving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
