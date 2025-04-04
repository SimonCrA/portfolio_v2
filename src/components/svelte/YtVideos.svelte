<script lang="ts">
  import { onMount } from "svelte";
  interface Videos {
    kind: string;
    nextPageToken: string;
    regionCode: string;
    pageInfo: PageInfo;
    items: Item[];
  }

  interface Item {
    kind: string;
    id: Id;
    snippet: Snippet;
  }

  interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  }

  interface Thumbnails {
    default: Default;
    medium: Default;
    high: Default;
  }

  interface Default {
    url: string;
    width: number;
    height: number;
  }

  interface Id {
    kind: string;
    videoId: string;
  }

  interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
  }
  // component state
  let videos: Videos[] = [];
  let loading = true;
  let error: string | null = null;

  // Cache key and duration (1 hour)
  const CACHE_KEY = "youtube_videos_cache";
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

  onMount(async () => {
    try {
      // Check cache first
      const cachedData = getCachedData();

      if (cachedData) {
        videos = cachedData;
        loading = false;
        return;
      }

      // llamar al api que creamos en /pages/api/youtube
      const response = await fetch("/api/youtube");

      if (!response.ok) {
        throw new Error(`Failed to fetch videos:  ${response.status}`);
      }

      videos = await response.json();

      // Cache the data
      cacheData(videos);
    } catch (err) {
      error = err.message;
      console.error("Fetch error:", err);
    } finally {
      loading = false;
    }
  });

  // Cache helpers
  function getCachedData(): Videos[] | null {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    return isExpired ? null : data;
  }

  function cacheData(data: Videos[]) {
    const cache = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }
</script>

<div class="container mx-auto px-4 py-8">
  {#if error}
    <div role="alert" class="alert alert-error mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Error cargando videos: {error}</span>
    </div>
  {:else if loading}
    <div class="flex flex-col items-center justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-lg">Cargando videos...</p>
    </div>
  {:else if videos.items.length === 0}
    <div class="text-center py-12">
      <p class="text-lg">No se encontraron videos</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each videos.items as video}
        <div
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow h-full flex flex-col"
        >
          <figure class="relative pt-[56.25%]">
            <!-- 16:9 aspect ratio -->
            <img
              src={video.snippet.thumbnails.high.url}
              alt={video.snippet.title}
              class="absolute top-0 left-0 w-full h-full object-cover"
              loading="lazy"
            />
          </figure>
          <div class="card-body flex-grow">
            <h2 class="card-title">
              <a
                href={"https://youtube.com/watch?v=" + video.id.videoId}
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-primary line-clamp-2"
                title={video.snippet.title}
              >
                {video.snippet.title}
              </a>
            </h2>
            <div class="mt-auto pt-2">
              <div
                class="flex justify-between items-center text-sm text-base-content/70"
              >
                <span>
                  {new Date(video.snippet.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
