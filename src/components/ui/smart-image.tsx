import { cn } from "@/lib/utils";
import type React from "react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  sizes?: string;
}

export function SmartImage({ className, loading = "lazy", decoding = "async", sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw", ...props }: SmartImageProps) {
  return (
    <img
      {...props}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export default SmartImage;
