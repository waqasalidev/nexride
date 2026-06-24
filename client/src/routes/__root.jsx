import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext.jsx";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
function NotFoundComponent() {
    return (<div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-bold text-cyan-glow">404</h1>
        <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-widest">Page Not Found</h2>
        <p className="mt-2 text-sm text-white/50">
          This route doesn't exist in our network.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-cyan-glow px-6 py-3 text-xs font-bold uppercase tracking-widest text-black">
          Return Home
        </Link>
      </div>
    </div>);
}
function ErrorComponent({ error, reset }) {
    console.error(error);
    const router = useRouter();
    useEffect(() => {
        reportLovableError(error, { boundary: "tanstack_root_error_component" });
    }, [error]);
    return (<div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-bold tracking-tight">Something broke</h1>
        <p className="mt-2 text-sm text-white/50">Try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-cyan-glow px-5 py-2 text-xs font-bold uppercase tracking-widest text-black">
            Try again
          </button>
          <a href="/" className="rounded-full border border-white/20 px-5 py-2 text-xs font-bold uppercase tracking-widest">
            Home
          </a>
        </div>
      </div>
    </div>);
}
export const Route = createRootRouteWithContext()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "NexRide X — The Apex Marketplace for Hypercars, Bikes & Jets" },
            { name: "description", content: "Acquire the world's most exclusive hypercars, custom superbikes, and executive private jets in a single unified ecosystem." },
            { property: "og:title", content: "NexRide X — The Apex Marketplace" },
            { property: "og:description", content: "Luxury, performance, and aviation in one platform." },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
        ],
        links: [
            { rel: "stylesheet", href: appCss },
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
            { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
            { rel: "icon", type: "image/png", href: "/favicon-32x32.png", sizes: "32x32" },
            { rel: "icon", type: "image/png", href: "/favicon-16x16.png", sizes: "16x16" },
            { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
        ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
});
function RootShell({ children }) {
    return (<html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>);
}
function RootComponent() {
    const { queryClient } = Route.useRouteContext();
    const router = useRouter();
    const pathname = router.state.location.pathname;

    useEffect(() => {
        let iconPath = "/favicon-32x32.png"; // default
        if (pathname.startsWith("/cars")) {
            iconPath = "/car-icon.svg";
        } else if (pathname.startsWith("/bikes")) {
            iconPath = "/bike-icon.svg";
        } else if (pathname.startsWith("/jets")) {
            iconPath = "/jet-icon.svg";
        } else if (pathname.startsWith("/ships")) {
            iconPath = "/ship-icon.svg";
        }

        // Update favicon elements dynamically
        const linkElements = document.querySelectorAll("link[rel*='icon']");
        linkElements.forEach((el) => {
            if (el.getAttribute("rel") === "apple-touch-icon") {
                el.href = iconPath === "/favicon-32x32.png" ? "/apple-touch-icon.png" : iconPath;
            } else {
                el.href = iconPath;
            }
        });
    }, [pathname]);

    return (<QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navigation />
        <main className="min-h-screen">
          <Outlet />
        </main>
        <Footer />
      </AuthProvider>
    </QueryClientProvider>);
}
