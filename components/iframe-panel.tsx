import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const useIframePanel = (defaultSize: number = 50) => {
  const [isVisible, setIsVisible] = useState(true);
  const [panelSize, setPanelSize] = useState(defaultSize);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setPanelSize(isVisible ? 0 : defaultSize);
  };

  return { isVisible, panelSize, toggleVisibility, setPanelSize };
};

export const IframePanel = (props: { src: string }) => {
  const { isVisible, panelSize, toggleVisibility, setPanelSize } =
    useIframePanel();
  const [iframeUrl, setIframeUrl] = useState(props.src);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIframeUrl(props.src);
  }, [props.src]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 flex justify-between items-center bg-secondary">
        <h2 className="text-lg font-semibold pl-2">Live Site Preview</h2>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleVisibility}>
            {isVisible ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <div className="bg-background border-b p-2 flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Input
          value={iframeUrl}
          onChange={(e) => setIframeUrl(e.target.value)}
          className="flex-grow text-sm"
        />
      </div>
      <div className="flex-grow">
        <iframe src={iframeUrl} className="w-full h-full border-none" />
      </div>
    </div>
  );
};
