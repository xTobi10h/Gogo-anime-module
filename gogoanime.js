/**
 * Gogoanime module for Sora (with CORS proxy)
 */

const CORS_PROXY = "https://api.allorigins.win/raw?url=";

// Search for anime titles
async function searchAnime(query) {
    const searchUrl = `${CORS_PROXY}https://gogoanime-api.vercel.app/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    const results = await response.json();

    return results.map(item => ({
        title: item.animeTitle,
        url: item.animeUrl,
        image: item.animeImg
    }));
}

// Get episode list from an anime page
async function getEpisodeList(animeUrl) {
    const response = await fetch(`${CORS_PROXY}${animeUrl}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let episodes = [];
    doc.querySelectorAll(".items li a").forEach(a => {
        episodes.push({
            title: a.textContent.trim(),
            url: a.href
        });
    });

    return episodes;
}

// Get streaming URL from an episode page
async function getVideoUrl(episodeUrl) {
    const response = await fetch(`${CORS_PROXY}${episodeUrl}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const iframe = doc.querySelector("iframe");
    return iframe ? iframe.src : null;
}

// Export functions
export { searchAnime, getEpisodeList, getVideoUrl };
