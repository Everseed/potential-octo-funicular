import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h2 className="text-lg font-medium text-muted-foreground">
          Chargement...
        </h2>
      </div>
    </div>
  );
}