import { FileSystemRouter } from "bun";
import { Elysia } from "elysia";
import { html } from "@elysiajs/html";

// Initialize the router and point it to the 'pages' directory
const router = new FileSystemRouter({
  dir: "./pages", // The directory where your route components are located
  style: "nextjs", // The style of file-system routing, 'nextjs' is currently supported
});

// Serve the application and use the router to resolve routes
Bun.serve({
  port: 3000,
  // ... your server configuration
  async fetch(req) {
    const matchedRoute = router.match(req.url);
    if (matchedRoute) {
      // Handle the matched route, possibly by rendering the component
      // and returning it inside a Response object
      const page = await import(matchedRoute.filePath)
      
      if (typeof page.default === 'function') {
        // Execute the default export function to get the content
        const content = await page.default(req);
        
        // Send the content in a response
        return new Response(content, {
            headers: { 'Content-Type': 'text/html' },
        });
      } else {
          // Handle non-function module exports if necessary
      }
      
      return new Response()
    } else {
      // Return a 404 response for unmatched routes
      return new Response("Not Found", { status: 404 });
    }
  }
});