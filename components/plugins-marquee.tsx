"use client";

import Marquee from "@/components/magicui/marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { plugins } from "@/constants/plugins";
import Link from "next/link";

const dividePlugins = (
  plugins: typeof import("@/constants/plugins").plugins
) => {
  const third = Math.ceil(plugins.length / 3);
  return [
    plugins.slice(0, third),
    plugins.slice(third, 2 * third),
    plugins.slice(2 * third),
  ];
};

const rows = dividePlugins(plugins);

export function PluginsMarquee() {
  return (
    <div className="relative flex h-[442px] w-full max-w-[100vw] lg:max-w-[100%] flex-col items-center justify-center overflow-hidden">
      {rows.map((row, index) => (
        <Marquee
          key={index}
          pauseOnHover={true}
          className="[--duration:20s]"
          reverse={index % 2 === 1}
        >
          {row.map((plugin) => (
            <PluginCard key={plugin.name} {...plugin} />
          ))}
        </Marquee>
      ))}
    </div>
  );
}

const PluginCard = ({
  image_url,
  name,
  description,
}: {
  image_url: string;
  name: string;
  description: string;
}) => {
  return (
    <Link
      href={`/plugins/${name}`}
      className={
        "flex flex-col gap-3 cursor-pointer overflow-hidden rounded-md border border-2 border-gray-300 bg-white p-4"
      }
    >
      <div className="flex justify-center items-center gap-3">
        <Avatar>
          <AvatarImage src={image_url} alt={name} height={38} width={38} />
          <AvatarFallback>
            {name.charAt(0)}
            {name.charAt(1)}
          </AvatarFallback>
        </Avatar>
        <span className="text-2xl">{name}</span>
      </div>
      {/* <span className="text-base font-medium">{description}</span> */}
    </Link>
  );
};
