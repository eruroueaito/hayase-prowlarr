/**
 * Module: Hayase Prowlarr Extension
 * Purpose: Search torrents via Prowlarr API and return results in Hayase format
 * Input: TorrentQuery { titles, episode, resolution, exclusions }
 * Output: TorrentResult[] { title, link, hash, seeders, leechers, downloads, size, date, accuracy, type }
 * Dependencies: Prowlarr instance (localhost:9696) + CORS proxy (localhost:3001)
 * Notes: Runs in Web Worker — edit PROWLARR_URL, API_KEY, CORS_PROXY below before use
 */

// ─── Configuration ────────────────────────────────────────────────────────────
const PROWLARR_URL = 'http://localhost:9696'
const API_KEY = '7a03897923eb41fdbbdb7e76a275bd23'  // Prowlarr → Settings → General → API Key
const CORS_PROXY = 'https://localhost:3001'  // leave empty to use Prowlarr directly
// ──────────────────────────────────────────────────────────────────────────────

export default new class Prowlarr {

  /** @type {import('./').SearchFunction} */
  async single ({ titles, episode, exclusions }) {
    if (!API_KEY || !titles?.length) return []

    const query = this.buildQuery(titles[0], episode)
    if (!query) return []

    const base = (CORS_PROXY || PROWLARR_URL).replace(/\/+$/, '')
    const url = `${base}/api/v1/search?query=${encodeURIComponent(query)}&type=search&categories=5070&categories=5000&categories=2000`

    try {
      const res = await fetch(url, { headers: { 'X-Api-Key': API_KEY } })
      if (!res.ok) return []
      const data = await res.json()
      if (!Array.isArray(data)) return []
      return this.mapResults(data, exclusions)
    } catch {
      return []
    }
  }

  batch = this.single
  movie = this.single

  async test () {
    if (!API_KEY || !PROWLARR_URL) return false
    try {
      const base = (CORS_PROXY || PROWLARR_URL).replace(/\/+$/, '')
      const res = await fetch(`${base}/api/v1/search?query=test&type=search&limit=1`, {
        headers: { 'X-Api-Key': API_KEY }
      })
      return res.ok
    } catch {
      return false
    }
  }

  // --- Private helpers ---

  buildQuery (title, episode) {
    let q = title.replace(/[^\w\s-]/g, ' ').trim()
    if (episode != null) q += ' ' + String(episode).padStart(2, '0')
    return q
  }

  mapResults (data, exclusions = []) {
    const excl = exclusions.map(e => e.toLowerCase())
    return data
      .filter(item => {
        if (item.protocol?.toLowerCase() !== 'torrent') return false
        if (!this.extractLink(item) && !this.extractHash(item)) return false
        if (excl.length) {
          const t = (item.title || '').toLowerCase()
          if (excl.some(e => t.includes(e))) return false
        }
        return true
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
      }))
  }

  extractLink (item) {
    if (item.magnetUrl) return item.magnetUrl
    if (item.guid?.startsWith('magnet:')) return item.guid
    if (item.downloadUrl) return item.downloadUrl
    return ''
  }

  extractHash (item) {
    if (item.infoHash) return item.infoHash
    const magnet = item.magnetUrl || item.guid || ''
    const match = magnet.match(/btih:([a-fA-F0-9]{40})/i)
    return match ? match[1] : ''
  }
}()
