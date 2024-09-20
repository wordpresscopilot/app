import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DownloadIcon, GithubIcon, ScaleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PluginDownloadCard() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center space-y-4">
        <Image
          src="/wp_colored.svg"
          alt="WPSage Wordpress Plugin Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
        <CardTitle className="text-2xl font-bold text-center">
          WPSage Wordpress Plugin
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Enhance your WordPress site with the power of GPT! This plugin
          seamlessly integrates advanced AI capabilities into your wordpress
          management workflow allowing you to prompt your AI agent to manage and
          develop your site with ease.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://github.com/w-p-ai/sage-plugin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <GithubIcon className="mr-1 h-4 w-4" />
            GitHub Repo
          </a>
          <div className="flex items-center text-sm text-muted-foreground">
            <ScaleIcon className="mr-1 h-4 w-4" />
            GNU License
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        <Link href="https://github.com/w-p-ai/wpsage-plugin/raw/main/wpsage-plugin.zip">
          <Button className="w-full sm:w-auto">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download Plugin
          </Button>
        </Link>
        <p className="text-xs text-center text-muted-foreground">
          This plugin is released under the GNU General Public License v3.0 or
          later
        </p>
      </CardFooter>
    </Card>
  );
}
