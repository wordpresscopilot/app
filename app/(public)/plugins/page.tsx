import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { plugins } from "@/constants/plugins";
import Image from "next/image";
import Link from "next/link";

interface PluginProps {
  name: string;
  description: string;
  image_url: string;
}

const Plugin: React.FC<PluginProps> = ({ name, description, image_url }) => (
  <Link href={`/plugins/${name}`}>
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="w-16 h-16 mb-4 mx-auto">
          <Image
            src={image_url}
            alt={`${name} logo`}
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
        <CardTitle className="text-xl font-bold text-center">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm text-center">
          {description}
        </CardDescription>
      </CardContent>
      <div className="p-4 pt-0 mt-auto text-center">
        <Button asChild variant="outline" size="sm">
          <Link
            href={`/plugins/${name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </Link>
        </Button>
      </div>
    </Card>
  </Link>
);

export default function PluginsPageGrid() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-12">
      <div className="container mx-auto px-4 ">
        <h1 className="text-3xl font-bold text-center mb-8">
          Supported WordPress Plugins & Modes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plugins.map((plugin) => (
            <Plugin key={plugin.name} {...plugin} />
          ))}
        </div>
      </div>
    </div>
  );
}
