type MemeTile = {
  id: string
  title: string
  imageUrl: string
  source: "relationship-memes" | "classic"
}

type RedditMeme = {
  postLink?: unknown
  title?: unknown
  url?: unknown
  preview?: unknown
  nsfw?: unknown
  spoiler?: unknown
}

type TemplateMeme = {
  id?: unknown
  name?: unknown
  slug?: unknown
  url?: unknown
  categories?: unknown
}

const MEME_API_URL = "https://meme-api.com/gimme/RelationshipMemes/12"
const JUST_MEME_URL = "https://justmeme.wtf/api/v1/trending"
const CACHE_SECONDS = 60 * 60
const STALE_WHILE_REVALIDATE_SECONDS = 60 * 30
const MAX_TILES = 12
const BLOCKED_TERMS =
  /\b(nsfl|nsfw|nude|nudity|sex|sexy|dick|cock|penis|vagina|onlyfans|porn|fetish|kink)\b/i

const isHttpImageUrl = (value: unknown): value is string => {
  if (typeof value !== "string") return false

  try {
    const url = new URL(value)
    const isApprovedHost =
      url.protocol === "https:" &&
      ["i.redd.it", "preview.redd.it", "i.imgflip.com", "api.memegen.link"].includes(
        url.hostname
      )
    const isImagePath = /\.(avif|gif|jpe?g|png|webp)$/i.test(url.pathname)

    return isApprovedHost && isImagePath
  } catch {
    return false
  }
}

const isSafeTitle = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0 && !BLOCKED_TERMS.test(value)

const getRedditImageUrl = (meme: RedditMeme) => {
  if (isHttpImageUrl(meme.url)) return meme.url

  if (!Array.isArray(meme.preview)) return null

  const largestPreview = meme.preview.at(-1)
  return isHttpImageUrl(largestPreview) ? largestPreview : null
}

const toRelationshipTile = (meme: RedditMeme): MemeTile | null => {
  if (meme.nsfw === true || meme.spoiler === true || !isSafeTitle(meme.title)) {
    return null
  }

  const imageUrl = getRedditImageUrl(meme)
  if (!imageUrl || typeof meme.postLink !== "string") return null

  return {
    id: `relationship-${meme.postLink}`,
    title: meme.title,
    imageUrl,
    source: "relationship-memes",
  }
}

const toClassicTile = (meme: TemplateMeme): MemeTile | null => {
  const title = typeof meme.name === "string" ? meme.name : null
  const imageUrl = typeof meme.url === "string" ? meme.url : null

  if (!isSafeTitle(title) || !isHttpImageUrl(imageUrl)) return null

  const categories = Array.isArray(meme.categories)
    ? meme.categories.filter((category): category is string => typeof category === "string")
    : []
  const isClassicOrRelationship = categories.some((category) =>
    ["classic", "relationship"].includes(category)
  )

  if (!isClassicOrRelationship) return null

  const identifier =
    typeof meme.id === "string"
      ? meme.id
      : typeof meme.slug === "string"
        ? meme.slug
        : imageUrl

  return {
    id: `classic-${identifier}`,
    title,
    imageUrl,
    source: "classic",
  }
}

const uniqueTiles = (tiles: MemeTile[]) => {
  const imageUrls = new Set<string>()

  return tiles.filter((tile) => {
    if (imageUrls.has(tile.imageUrl)) return false
    imageUrls.add(tile.imageUrl)
    return true
  })
}

const getHourBucket = () => Math.floor(Date.now() / (CACHE_SECONDS * 1000))

const shuffleTilesForHour = (tiles: MemeTile[], hourBucket: number) => {
  const shuffled = [...tiles]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const seed = (hourBucket * 9301 + index * 49297) % 233280
    const swapIndex = seed % (index + 1)
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

const readJsonSafely = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}


export const revalidate = CACHE_SECONDS

export async function GET() {
  const [relationshipResponse, classicResponse] = await Promise.allSettled([
    fetch(MEME_API_URL, { next: { revalidate: CACHE_SECONDS } }),
    fetch(JUST_MEME_URL, { next: { revalidate: CACHE_SECONDS } }),
  ])

  const relationshipData =
    relationshipResponse.status === "fulfilled" && relationshipResponse.value.ok
      ? await readJsonSafely<{ memes?: RedditMeme[] }>(
          relationshipResponse.value
        )
      : null
  const classicData =
    classicResponse.status === "fulfilled" && classicResponse.value.ok
      ? await readJsonSafely<{ trending?: TemplateMeme[] }>(
          classicResponse.value
        )
      : null

  const relationshipTiles = (relationshipData?.memes ?? [])
    .map(toRelationshipTile)
    .filter((tile): tile is MemeTile => tile !== null)
  const classicTiles = (classicData?.trending ?? [])
    .map(toClassicTile)
    .filter((tile): tile is MemeTile => tile !== null)

  const memes = shuffleTilesForHour(
    uniqueTiles([...relationshipTiles, ...classicTiles]),
    getHourBucket()
  ).slice(0, MAX_TILES)

  return Response.json(
    { memes },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
      },
    }
  )
}
