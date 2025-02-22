"use client";

import { useRouter } from "next/navigation";

const authMiddleware = async () => {
  const accessToken = localStorage.getItem("access_token");
  const userInfo = localStorage.getItem("user");

  // If there's no access token or user info, return unauthenticated
  if (!accessToken || !userInfo) {
    return { authenticated: false, role: null };
  }

  try {
    const parsedUserInfo = JSON.parse(userInfo);
    const userRole = parsedUserInfo.roles ? parsedUserInfo.roles[0] : null;

    if (userRole === "ROLE_ADMIN") {
      return { authenticated: true, role: "ROLE_ADMIN" };
    } else if (userRole === "ROLE_USER") {
      return { authenticated: true, role: "ROLE_USER" };
    } else {
      return { authenticated: false, role: null }; // No valid role
    }
  } catch (error) {
    console.error("Error parsing user info:", error);
    return { authenticated: false, role: null };
  }
};

export default authMiddleware;
