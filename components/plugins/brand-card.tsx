import { Plugin } from "@/types";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function BrandCard({ plugin }: { plugin: Plugin }) {
  console.log("plugin", plugin);
  return (
    <Card className="mb-6 max-w-2xl mx-auto">
      <CardHeader className="flex flex-col space-y-1.5 pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <img src={plugin?.image_url} alt={plugin?.name} height={40} />
            </div>
            <CardTitle className="text-lg font-bold">{plugin?.name}</CardTitle>
          </div>
          <Link
            href={`https://wordpress.org/plugins/${plugin?.name.toLowerCase()}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary-dark transition-colors duration-200"
          >
            <Button variant="link">View Plugin on WordPress.org</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <CardDescription className="text-sm">
          {plugin?.description}
          {JSON.stringify(plugin)}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
