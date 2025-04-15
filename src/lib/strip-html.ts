// function to delete unnecessary html
export function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // remove script tags
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')   // remove style tags
    .replace(/<[^>]+>/g, '')                          // remove all HTML tags
    .replace(/&nbsp;/g, ' ')                          // decode &nbsp;
    .replace(/&amp;/g, '&')                           // decode &amp;
    .replace(/&quot;/g, '"')                          // decode &quot;
    .replace(/&#039;/g, "'")                          // decode single quote
    .replace(/\s+/g, ' ')                             // collapse whitespace
    .trim();
}

