const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;

function extractPlaylistId(url: string) {
  const match = url.match(/[?&]list=([^&]+)/);

  return match ? match[1] : null;
}

export async function getPlaylistVideos(playlistUrl: string) {
  try {
    const playlistId = extractPlaylistId(playlistUrl);

    if (!playlistId) {
      return {
        success: false,

        error: "Invalid playlist URL",
      };
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`,
    );

    const data = await response.json();

    if (data.error) {
      return {
        success: false,

        error: data.error.message,
      };
    }

    const videos = data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,

      title: item.snippet.title,

      thumbnail: item.snippet.thumbnails.high?.url,

      channelTitle: item.snippet.channelTitle,
    }));

    return {
      success: true,

      data: videos,
    };
  } catch (error) {
    return {
      success: false,

      error: "Failed to load videos",
    };
  }
}
