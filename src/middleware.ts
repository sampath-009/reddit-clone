// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/studio(.*)",
//   "/api/webhook(.*)",
// ]);

// export default clerkMiddleware((auth, req) => {
//   if (isPublicRoute(req)) return auth();
//   return auth().protect();
// });

// Temporarily disabled middleware for setup
export default function middleware() {
  // No authentication for now
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
