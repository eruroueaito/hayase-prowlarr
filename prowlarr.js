/**
 * Module: Hayase Prowlarr Extension
 * Purpose: Search torrents via Prowlarr API and return results in Hayase format
 * Input: TorrentQuery { titles, episode, resolution, exclusions } + options { prowlarrUrl, apiKey, corsProxyUrl }
 * Output: TorrentResult[] { title, link, hash, seeders, leechers, downloads, size, date, accuracy, type }
 * Dependencies: Prowlarr instance + CORS proxy (or CORS-enabled Prowlarr)
 * Notes: Runs in Web Worker — no DOM access, only fetch() available
 */

export default new class Prowlarr {

  /**
   * Search for a single episode torrent.
   * Also used for batch and movie searches (same logic, episode omitted for movies).
   */
  async single(query, options) {
    try {
      const { prowlarrUrl, apiKey, corsProxyUrl } = options || {};
      if (!apiKey) return [];

      const searchQuery = this.buildQuery(query);
      if (!searchQuery) return [];

      // CORS proxy forwards /api/v1/... to Prowlarr, so use same path for both
      const baseUrl = (corsProxyUrl || prowlarrUrl).replace(/\/+$/, '');
      const url = `${baseUrl}/api/v1/search?query=${encodeURIComponent(searchQuery)}&type=search&categories=5070,5000,2000`;

      const res = await fetch(url, {
        headers: { 'X-Api-Key': apiKey },
      });

      if (!res.ok) return [];

      const data = await res.json();
      if (!Array.isArray(data)) return [];

      return this.mapResults(data, query);
    } catch {
      return [];
    }
  }

  batch = this.single;
  movie = this.single;

  /**
   * Test connection to Prowlarr.
   * Called by Hayase when user clicks "Test" in extension settings.
   */
  async test(options) {
    try {
      const { prowlarrUrl, apiKey, corsProxyUrl } = options || {};
      if (!apiKey || !prowlarrUrl) return false;

      const baseUrl = (corsProxyUrl || prowlarrUrl).replace(/\/+$/, '');

      const res = await fetch(`${baseUrl}/api/v1/search?query=test&type=search&limit=1`, {
        headers: { 'X-Api-Key': apiKey },
      });

      return res.ok;
    } catch {
      return false;
    }
  }

  // --- Private helpers ---

  /**
   * Build search query string from TorrentQuery.
   * Cleans special characters and appends zero-padded episode number.
   */
  buildQuery(query) {
    const { titles, episode } = query || {};
    if (!titles || !titles.length) return '';

    let q = titles[0].replace(/[^\w\s-]/g, ' ').trim();

    if (episode != null) {
      q += ' ' + String(episode).padStart(2, '0');
    }

    return q;
  }

  /**
   * Map Prowlarr ReleaseResource[] to Hayase TorrentResult[].
   * Filters out non-torrent results and entries missing both magnet and hash.
   */
  mapResults(data, query) {
    const exclusions = (query?.exclusions || []).map(e => e.toLowerCase());

    return data
      .filter(item => {
        // Only torrent protocol
        if (item.protocol && item.protocol.toLowerCase() !== 'torrent') return false;
        // Must have magnet or hash
        if (!this.extractLink(item) && !this.extractHash(item)) return false;
        // Apply exclusions
        if (exclusions.length) {
          const titleLower = (item.title || '').toLowerCase();
          if (exclusions.some(ex => titleLower.includes(ex))) return false;
        }
        return true;
      })
      .map(item => ({
        title: item.title || '',
        link: this.extractLink(item) || '',
        hash: this.extractHash(item) || '',
        seeders: parseInt(item.seeders) || 0,
        leechers: parseInt(item.leechers) || 0,
        downloads: parseInt(item.grabs) || 0,
        size: item.size || 0,
        date: item.publishDate ? new Date(item.publishDate) : new Date(),
        verified: false,
        type: 'alt',
        accuracy: 'high',
      }));
  }

  /**
   * Extract magnet URI from Prowlarr result.
   * Prefers magnetUrl, falls back to guid if it's a magnet link.
   */
  extractLink(item) {
    if (item.magnetUrl) return item.magnetUrl;
    if (item.guid && item.guid.startsWith('magnet:')) return item.guid;
    if (item.downloadUrl) return item.downloadUrl;
    return '';
  }

  /**
   * Extract info hash from Prowlarr result.
   * Prefers infoHash field, falls back to parsing from magnet URI.
   */
  extractHash(item) {
    if (item.infoHash) return item.infoHash;
    const magnet = item.magnetUrl || item.guid || '';
    const match = magnet.match(/btih:([a-fA-F0-9]{40})/i);
    return match ? match[1] : '';
  }
}();
