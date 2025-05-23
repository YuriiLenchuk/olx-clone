import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const protectedRoutes = ["/ad"]
export default function middleware(req: NextRequest) {
    const authToken = req.cookies.get("authToken");
    if(!authToken && protectedRoutes.includes(req.nextUrl.pathname)){
        const absoluteURL = new URL("/registration", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }
}