import { Share2Icon } from "lucide-react";

import { AnimatedBeamWordpress } from "@/components/animated-beam-wordpress";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
const files = [
  {
    name: "products.csv",
    body: "A CSV file containing product data including SKUs, prices, descriptions, and stock levels for WooCommerce.",
  },
  {
    name: "orders.xml",
    body: "An XML file with detailed order information, including customer details, products ordered, and transaction data from WooCommerce.",
  },
  {
    name: "customers.json",
    body: "A JSON file containing customer data, including names, addresses, and purchase history from WordPress and WooCommerce.",
  },
  {
    name: "posts.sql",
    body: "An SQL dump of WordPress posts, pages, and custom post types, including content, meta data, and taxonomies.",
  },
  {
    name: "media.zip",
    body: "A compressed archive of all media files uploaded to the WordPress site, including images, videos, and documents.",
  },
];

const features = [
  // {
  //   Icon: FileTextIcon,
  //   name: "Export Data from a Prompt",
  //   description: "In whatever data format you require.",
  //   href: "/sign-in",
  //   cta: "Check it out",
  //   className: "col-span-3 lg:col-span-1",
  //   background: (
  //     <Marquee
  //       pauseOnHover
  //       className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
  //     >
  //       {files.map((f, idx) => (
  //         <figure
  //           key={idx}
  //           className={cn(
  //             "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
  //             "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
  //             "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
  //             "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
  //           )}
  //         >
  //           <div className="flex flex-row items-center gap-2">
  //             <div className="flex flex-col">
  //               <figcaption className="text-sm font-medium dark:text-white ">
  //                 {f.name}
  //               </figcaption>
  //             </div>
  //           </div>
  //           <blockquote className="mt-2 text-xs">{f.body}</blockquote>
  //         </figure>
  //       ))}
  //     </Marquee>
  //   ),
  // },
  {
    Icon: Share2Icon,
    name: "Fully Integrated",
    description: "Power up your wordpress site.",
    href: "/sign-in",
    cta: "Check it out",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamWordpress className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out  group-hover:scale-105" />
    ),
  },
];

export function BentoGridWordpress() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
