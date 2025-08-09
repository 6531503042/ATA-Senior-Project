import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/auth/login",
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
      return;
    }

    if (
      !isLoading &&
      user &&
      !allowedRoles.some((role) => user.roles.includes(role))
    ) {
      const redirectPath = user.roles.includes("ROLE_ADMIN")
        ? "/admin/dashboard"
        : "/employee";
      router.push(redirectPath);
    }
  }, [user, isLoading, allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.some((role) => user.roles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
