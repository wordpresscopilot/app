import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WpSite } from "@/types";
import { Globe, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function SitesDashboard({ wp_sites }: { wp_sites: WpSite[] }) {
  return (
    <div className="container min-h-screen overflow-y-scroll py-8">
      <div className="">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Your WordPress Sites
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wp_sites.map((site: WpSite) => (
            <Card
              key={site.id}
              className="overflow-hidden bg-white dark:bg-gray-800"
            >
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        site.plugin_connected ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="font-semibold truncate text-gray-900 dark:text-gray-100">
                      {site.name}
                    </span>
                  </div>
                  <Badge
                    variant={site.plugin_connected ? "default" : "secondary"}
                    className="dark:bg-gray-700 dark:text-gray-100"
                  >
                    {site.plugin_connected ? "Connected" : "Disconnected"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <Globe className="w-4 h-4 mr-2" />
                  <a
                    href={site.base_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:underline"
                  >
                    {site.base_url}
                  </a>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(site.updated_at).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-700 p-4 flex justify-between">
                {site.plugin_connected ? (
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/sites/${site.id}/chat`}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat with Site
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="opacity-50 cursor-not-allowed"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat with Site
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Link href={`/sites/${site.id}`}>
                    {/* <Code className="w-4 h-4 mr-2" /> */}
                    Site Settings
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
