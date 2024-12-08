export default function SignInLoading() {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="w-[400px] space-y-6 rounded-lg border p-8 shadow-sm">
          <div className="space-y-2">
            <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-4">
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }