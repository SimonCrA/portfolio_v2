export const prerender = false;

export async function GET() {
    const GITHUB_API_URL = import.meta.env.GITHUB_API_URL
    const GITHUB_API_SECRET_KEY = import.meta.env.GITHUB_API_SECRET_KEY

    try {
        let myHeaders = new Headers()
        myHeaders.append('Authorization', `Bearer ${GITHUB_API_SECRET_KEY}`)

        const response = await fetch(GITHUB_API_URL + '?per_page=6&sort=-1', {
            method: 'GET',
            headers: myHeaders
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        const filteredData = data.map(repo => ({
            id: repo.id,
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description,
            stargazers_count: repo.stargazers_count,
            updated_at: repo.updated_at
        }));

        return new Response(JSON.stringify(filteredData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600' // 1 hour cache
            }
        });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
