"use client";

import Marquee from "@/components/magicui/marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const plugins = [
  {
    img: "/plugins/wordpress.png",
    name: "WordPress",
    description: "Core WordPress CMS",
  },
  {
    img: "/plugins/woo.png",
    name: "WooCommerce",
    description: "E-commerce plugin for online stores",
  },
  {
    img: "/plugins/elementor.png",
    name: "Elementor",
    description: "Drag-and-drop page builder",
  },
  {
    img: "/plugins/acf.png",
    name: "ACF",
    description: "Custom fields creator",
  },
  {
    img: "/plugins/beaver-builder.png",
    name: "Beaver Builder",
    description: "Page builder for custom layouts",
  },
  {
    img: "/plugins/bricks-builder.png",
    name: "Bricks Builder",
    description: "Visual site builder",
  },
  {
    img: "/plugins/gravity-forms.png",
    name: "Gravity Forms",
    description: "Advanced form builder",
  },
  {
    img: "/plugins/buddyboss-platform.png",
    name: "BuddyBoss Platform",
    description: "Community and membership platform",
  },
  {
    img: "/plugins/dokan-lite.png",
    name: "Dokan",
    description: "Multivendor marketplace solution",
  },
  {
    img: "/plugins/sfwd-lms.png",
    name: "LearnDash",
    description: "Learning management system",
  },
  {
    img: "/plugins/wpforms.png",
    name: "WPForms",
    description: "Beginner friendly contact form plugin",
  },
  {
    img: "/plugins/checkout-wc.png",
    name: "CheckoutWC",
    description: "Optimized WooCommerce Checkout",
  },
  {
    img: "/plugins/ws-form.png",
    name: "WS Form",
    description: "Responsive form builder",
  },
  {
    img: "/plugins/oxygen-builder.png",
    name: "Oxygen Builder",
    description: "Visual website builder",
  },
  {
    img: "/plugins/carbon-fields.png",
    name: "Carbon Fields",
    description: "Custom fields and meta-boxes",
  },
];

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
    <div
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
    </div>
  );
};
