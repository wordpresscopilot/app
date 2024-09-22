"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function SiteConnectCard() {
  const searchParams = useSearchParams();
  const [wpSiteUrl, setWpSiteUrl] = useState<string | null>();
  const [apiKey, setApiKey] = useState<string | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = searchParams.get("wp_url");
    const key = searchParams.get("api_key");

    if (!url || !key) {
      setError("Missing required parameters");
    } else {
      setWpSiteUrl(url);
      setApiKey(key);
    }
  }, [searchParams]);

  const handleConfirm = () => {
    console.log("Confirming connection with:", { wpSiteUrl, apiKey });
  };

  const handleCancel = () => {
    console.log("Connection cancelled");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute inset-0 bg-grid-gray-200/50 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center space-x-4 mb-4">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Our Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="WordPress Logo"
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Connect Your WordPress Site
            </CardTitle>
            <CardDescription className="text-center">
              Securely link your WordPress site to enhance functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center p-4 bg-gray-50 rounded-lg"
            >
              <p className="text-sm text-gray-600 mb-2">You are connecting:</p>
              <p className="font-medium text-gray-800 break-all">{wpSiteUrl}</p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-sm text-center text-gray-600"
            >
              By confirming, you agree to securely share necessary data between
              your WordPress site and our service.
            </motion.p>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Connection</Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
