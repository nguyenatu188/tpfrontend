import { useEffect, useState } from "react"

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY

const usePexelsImage = (query: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      if (!query) return

      try {
        const searchQuery = `${query.trim()}`
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          searchQuery
        )}&per_page=1&orientation=landscape&size=large`

        const res = await fetch(url, {
          headers: {
            Authorization: API_KEY,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch from Pexels API")
        }

        const data = await res.json()
        const photo = data.photos?.[0]
        setImageUrl(photo?.src?.large || null)
      } catch (error) {
        console.error("Failed to fetch Pexels image:", error)
        setImageUrl(null)
      }
    }

    fetchImage()
  }, [query])

  return imageUrl
}

export default usePexelsImage
