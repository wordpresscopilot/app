"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { plugins } from "@/constants/plugins";
import { Plugin as WPPlugin } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
            Chat with Plugin
          </Link>
        </Button>
      </div>
    </Card>
  </Link>
);

export default function PluginsPageGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const results = await searchWordPressPlugins(searchQuery);
  //   console.log("searchResults", results);
  //   setSearchResults(results as any);
  // };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 ">
        <h1 className="text-3xl font-bold text-center mb-8">
          Interactive Chat for Wordpress Plugin Support
        </h1>
        {/* <form onSubmit={handleSearch} className="mb-8">
          <div className="flex justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search WordPress plugins..."
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button type="submit" className="rounded-l-none">
              Search
            </Button>
          </div>
        </form> */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((plugin: WPPlugin, index) => (
              <Plugin
                image_url=""
                key={index}
                name={plugin.name}
                description={`Version: ${plugin.version}, Author: ${plugin.author}`}
                // image_url={`https://ps.w.org/${plugin.slug}/assets/icon-128x128.png`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plugins.map((plugin) => (
              <Plugin key={plugin.name} {...plugin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
