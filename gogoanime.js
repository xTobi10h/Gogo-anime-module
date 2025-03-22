async function searchAnime(query) {
    const searchUrl = `https://anitaku.to/search?keyword=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    const text = await response.text();

    const results = [];
    const regex = /<a href="(\/category\/.*?)".*?>(.*?)<\/a>/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        results.push({
            title: match[2],
            url: `https://anitaku.to${match[1]}`
        });
    }
    
    return results;
}

async function getEpisodes(animeUrl) {
    const response = await fetch(animeUrl);
    const text = await response.text();

    const episodes = [];
    const regex = /<a href="(\/vidcdn\/.*?)".*?>(.*?)<\/a>/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        episodes.push({
            episode: match[2],
            url: `https://anitaku.to${match[1]}`
        });
    }
    
    return episodes;
}

async function getStreamUrl(episodeUrl) {
    const response = await fetch(episodeUrl);
    const text = await response.text();

    const streamRegex = /<source src="(.*?)"/;
    const match = streamRegex.exec(text);
    
    if (match) {
        return match[1];
    } else {
        throw new Error("Stream URL not found");
    }
}

// Example Usage
(async () => {
    const searchResults = await searchAnime("One Piece");
    console.log("Search Results:", searchResults);

    if (searchResults.length > 0) {
        const episodes = await getEpisodes(searchResults[0].url);
        console.log("Episodes:", episodes);

        if (episodes.length > 0) {
            const streamUrl = await getStreamUrl(episodes[0].url);
            console.log("Stream URL:", streamUrl);
        }
    }
})();
