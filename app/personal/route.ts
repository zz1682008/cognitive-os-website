import personalPage from "../../public/personal/index.html?raw";

export function GET() {
  return new Response(personalPage, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
