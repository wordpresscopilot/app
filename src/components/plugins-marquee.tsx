"use client";

import Marquee from "@/components/magicui/marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { plugins } from "@/constants/plugins";
import Link from "next/link";

const firstRow = plugins.slice(0, plugins.length / 2);
const secondRow = plugins.slice(plugins.length / 2);

export function PluginsMarquee() {
  return (
    <div className="relative flex h-[400px] w-full max-w-[100vw] lg:max-w-[100%] flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover={true} className="[--duration:20s]">
        {firstRow.map((plugin) => (
          <PluginCard key={plugin.name} {...plugin} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover={true} className="[--duration:20s]">
        {secondRow.map((plugin) => (
          <PluginCard key={plugin.name} {...plugin} />
        ))}
      </Marquee>
    </div>
  );
}

const PluginCard = ({
  img,
  name,
  description,
}: {
  img: string;
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
          <AvatarImage src={img} alt={name} height={38} width={38} />
          <AvatarFallback>
            {name.charAt(0)}
            {name.charAt(1)}
          </AvatarFallback>
        </Avatar>
        <span className="text-2xl">{name}</span>
      </div>
      <span className="text-base font-medium">{description}</span>
    </Link>
  );
};
