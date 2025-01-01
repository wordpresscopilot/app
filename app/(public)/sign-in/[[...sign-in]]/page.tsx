import { SignIn } from "@clerk/nextjs";

export default function Page({
  searchParams,
}: {
  searchParams: {
    redirect_url?: string;
  };
}) {
  console.log({ searchParams });
  const redirect_url = searchParams.redirect_url;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignIn forceRedirectUrl={redirect_url || "/sites"} />
    </div>
  );
}
