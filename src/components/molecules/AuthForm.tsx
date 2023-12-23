import { Button } from "@/components/atoms/Button";

import { Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";
import { type ClientSafeProvider } from "next-auth/react";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> & {
  providers: ClientSafeProvider[];
  onProviderClick: (provider: ClientSafeProvider) => void;
  loading?: boolean;
};

const UserAuthForm = ({
  providers,
  onProviderClick,
  loading,
  className,
  ...props
}: UserAuthFormProps) => {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)} {...props}>
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          type="button"
          disabled={loading}
          onClick={() => onProviderClick(provider)}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Login
          with {provider.name}
        </Button>
      ))}
    </div>
  );
};

export { UserAuthForm };
