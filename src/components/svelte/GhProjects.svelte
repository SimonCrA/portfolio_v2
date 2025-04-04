<script lang="ts">
  import { onMount } from "svelte";

  interface Project {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    owner: Owner;
    html_url: string;
    description?: string;
  }

  interface Owner {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
  }

  // component state
  let projects: Project[] = [];
  let loading = true;
  let error: string | null = null;

  // Cache key and duration (1 hour)
  const CACHE_KEY = "github_projects_cache";
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

  onMount(async () => {
    try {
      // Check cache first
      const cachedData = getCachedData();

      if (cachedData) {
        projects = cachedData;
        loading = false;
        return;
      }

      // llamar al api que creamos en /pages/api/github
      const response = await fetch("/api/github");

      if (!response.ok) {
        throw new Error(`Failed to fetch projects:  ${response.status}`);
      }

      const data = await response.json();

      // Filter and format data if needed
      projects = data.filter((repo: Project) => !repo.fork); // Exclude forks

      // Cache the data
      cacheData(projects);
    } catch (err) {
      error = err.message;
      console.error("Fetch error:", err);
    } finally {
      loading = false;
    }
  });

  // Cache helpers
  function getCachedData(): Project[] | null {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    return isExpired ? null : data;
  }

  function cacheData(data: Project[]) {
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
      <span>Error: {error}</span>
    </div>
  {:else if loading}
    <div class="flex flex-col items-center justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-lg">Cargando proyectos</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each projects as project}
        <div
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div class="card-body">
            <h2 class="card-title">
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-primary"
              >
                {project.name}
              </a>
            </h2>
            {#if project.description}
              <p class="text-base-content/80">{project.description}</p>
            {/if}
            <div class="card-actions justify-between items-center mt-4">
              <div class="flex gap-4">
                <span class="flex items-center gap-1 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  {project.stargazers_count}
                </span>
                <span class="flex items-center gap-1 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  {project.forks_count}
                </span>
              </div>
              <span class="text-xs text-base-content/50">
                {new Date(project.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
