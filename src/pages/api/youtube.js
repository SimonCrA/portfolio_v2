export const prerender = false;

export async function GET() {
    const RAPID_API_URL = import.meta.env.RAPID_API_URL
    const RAPID_API_KEY = import.meta.env.RAPID_API_KEY

    try {
        const response = await fetch(RAPID_API_URL + '?channelId=UCtTPHC06STvf4fDktedxxMA&part=snippet,id&order=date&maxResults=6', {
            method: 'GET',
            headers: {
                'Content-type': 'application-json',
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600' // 1 hour cache
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
