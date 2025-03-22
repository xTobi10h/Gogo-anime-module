/**
 * Gogoanime module for Sora (with CORS proxy)
 */

const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const BASE_URL = "https://gogoanime.by";

// Search for anime titles
async function searchAnime(query) {
    const searchUrl = `${CORS_PROXY}${BASE_URL}/search.html?keyword=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let results = [];
    doc.querySelectorAll(".items li").forEach(item => {
        const aTag = item.querySelector("a");
        const imgTag = item.querySelector("img");
        if (aTag && imgTag) {
            results.push({
                title: aTag.getAttribute("title"),
                url: BASE_URL + aTag.getAttribute("href"),
                image: imgTag.getAttribute("src")
            });
        }
    });

    return results;
}

// Get episode list from an anime page
async function getEpisodeList(animeUrl) {
    const response = await fetch(`${CORS_PROXY}${animeUrl}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let episodes = [];
    doc.querySelectorAll("#episode_page a").forEach(a => {
        episodes.push({
            title: a.textContent.trim(),
            url: BASE_URL + a.getAttribute("href")
        });
    });

    return episodes.reverse(); // Sort episodes correctly
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
