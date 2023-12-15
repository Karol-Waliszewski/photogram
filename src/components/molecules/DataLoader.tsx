import { type PropsWithChildren } from "react";
import { XCircle } from "lucide-react";

import { Skeleton } from "@/components/atoms/Skeleton";
import { AspectRatio } from "@/components/atoms/AspectRatio";
import { Text } from "@/components/atoms/Typography";

import { cn } from "@/utils/cn";

type DataLoaderProps = PropsWithChildren<{
  loading: boolean;
  renderLoading?: () => React.ReactNode;
  error: string | null;
  className?: string;
}>;
const DataLoader = ({
  children,
  loading,
  renderLoading,
  error,
  className,
}: DataLoaderProps) => {
  if (loading) {
    return (
      <>
        {renderLoading ? (
          renderLoading()
        ) : (
          <AspectRatio className={className} ratio={16 / 9}>
            <Skeleton className={"h-full w-full"} />
          </AspectRatio>
        )}
      </>
    );
  }
  if (error) {
    return (
      <div className={cn("flex flex-row items-center gap-2", className)}>
        <XCircle className="h-5 w-5" />
        <Text className="!mt-0">{error}</Text>
      </div>
    );
  }
  return children;
};

export { DataLoader };
