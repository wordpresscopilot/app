import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image src="/logo.png" alt="logo" width="100" height="100" />
      <SignIn />
    </div>
  );
}
