import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwtDecode from "jwt-decode"; 

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value || ""; 

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url)); 
    }

    try {
        const decoded: { role: string } = jwtDecode(token);
        const path = req.nextUrl.pathname;


        if (decoded.role === "USER" && path !== "/dashboard_user") {
            return NextResponse.redirect(new URL("/dashboard_user", req.url));
        } else if (decoded.role === "ADMIN" && path !== "/dashboard_admin") {
            return NextResponse.redirect(new URL("/dashboard_admin", req.url));
        }
    } catch (error) {
        console.error("Invalid token:", error);
        return NextResponse.redirect(new URL("/login", req.url)); 
    }

    return NextResponse.next(); 
}

export const config = {
    matcher: ["/dashboard_user", "/dashboard_admin"], 
};
