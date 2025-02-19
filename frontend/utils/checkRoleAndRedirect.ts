import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const checkRoleAndRedirect = () => {
  const router = useRouter();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (user?.roles?.includes("ROLE_ADMIN")) {
      router.push("/dashboard_admin"); // Redirect to admin dashboard
    } else if (user?.roles?.includes("ROLE_USER")) {
      router.push("/user_page"); // Redirect to user dashboard
    } else {
      router.push("/signin"); // Redirect to signin if no role found
    }
  }, [router]);
};
