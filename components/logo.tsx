import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      src="/logo/logo-color.svg"
      alt="logo"
      width={width || 32}
      height={height || 32}
      fetchPriority="high"
      decoding="async"
      className={cn("object-cover", className)}
    />
  );
};
