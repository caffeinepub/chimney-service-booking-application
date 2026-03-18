import { useQueryClient } from "@tanstack/react-query";
import { Flame, LogIn, LogOut } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "./ui/button";

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Flame className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">
              ChimneyCare Pro
            </h1>
            <p className="text-xs text-muted-foreground">
              Professional Home Services
            </p>
          </div>
        </div>
        <Button
          onClick={handleAuth}
          disabled={disabled}
          variant={isAuthenticated ? "outline" : "default"}
          size="sm"
          data-ocid="header.primary_button"
        >
          {loginStatus === "logging-in" ? (
            "Logging in..."
          ) : isAuthenticated ? (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Admin Login
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
