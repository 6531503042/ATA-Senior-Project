import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refresh_token");
      const userInfo = localStorage.getItem("user");

      // Check if tokens are present and if user info is available
      if (!accessToken || !userInfo) {
        console.warn("No access token or user info found. Redirecting to sign-in.");
        router.push("/signin");
        return;
      }

      try {
        // Parse user info and extract the role
        const { role } = JSON.parse(userInfo); // Ensure the correct structure of `userInfo`
        console.log("Detected role:", role);

        // Redirect based on the role
        if (role === "ROLE_ADMIN") {
          router.push("/dashboard_admin");
        } else if (role === "ROLE_USER") {
          router.push("/user_page");
        } else {
          console.warn("Invalid role detected:", role);
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);
};
