import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useGetReferenceLinks } from '../hooks/references/useGetReferenceLinks'
import { useAddReferenceLink } from '../hooks/references/useAddReferenceLink'
import { useDeleteReferenceLink } from '../hooks/references/useDeleteReferenceLink'
import { ReferenceLink } from '../types/referenceLink'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

interface PreviewData {
  title: string
  description: string
  image: string
  url: string
}

const Discover = ({ tripId }: { tripId: string }) => {
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [deletingLink, setDeletingLink] = useState<ReferenceLink | null>(null)

  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const carouselContainerRef = useRef<HTMLDivElement>(null)
  
  // Reference links hooks
  const { data: links, refetch } = useGetReferenceLinks(tripId)
  const { addLink } = useAddReferenceLink(tripId)
  const { deleteLink } = useDeleteReferenceLink()

  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % links!.length)
  }

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + links!.length) % links!.length)
  }

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(
        `https://api.linkpreview.net?key=${import.meta.env.VITE_LINK_PREVIEW_API_KEY}&q=${encodeURIComponent(url)}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch preview')
      
      const data = await response.json()
      setPreview(data)
      toast.success('Preview thành công!')
    } catch (error) {
      console.error('Error fetching preview:', error)
      toast.error('Lỗi khi lấy preview. Vui lòng kiểm tra URL và thử lại.')
    }
  }

  const handleAddLink = async () => {
    if (!preview) return

    try {
      await addLink({
        url: preview.url,
        title: preview.title,
        description: preview.description,
        image: preview.image,
      })
      
      toast.success('Đã thêm link tham khảo!')
      setUrl('')
      setPreview(null)
      refetch()
    } catch (error) {
      console.error('Error adding link:', error)
      toast.error('Lỗi khi thêm link')
    }
  }

  const handleDelete = async () => {
    if (!deletingLink) return

    try {
      await deleteLink(deletingLink.id)
      toast.success('Đã xóa link thành công!')
      refetch()
    } catch (error) {
      console.error('Error deleting link:', error)
      toast.error('Lỗi khi xóa link')
    } finally {
      setDeletingLink(null)
    }
  }

  useEffect(() => {
    if (itemRefs.current[activeIndex] && carouselContainerRef.current) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [activeIndex])

  return (
    <div className="p-10 flex flex-col justify-center items-center bg-gray-100 min-h-screen">
      {/* Form thêm link */}
      <form onSubmit={handlePreview} className="mb-8 w-full">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Thêm đường link tham khảo"
            className="flex-1 input input-bordered"
            required
          />
          <button type="submit" className="btn btn-primary">
            Preview
          </button>
        </div>
      </form>

      {/* Preview section */}
      {preview && (
        <div className="mb-8 w-1/2 card bg-base-100 shadow-xl">
          <figure className="h-60">
            <img src={preview.image} alt="Preview" className="object-cover w-full h-full" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{preview.title}</h2>
            <p>{preview.description}</p>
            <div className="card-actions justify-end">
              <button onClick={handleAddLink} className="btn btn-primary">
                Thêm vào danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {links && links.length > 0 && (
        <div className="w-full max-w-4xl relative">
          {/* Navigation arrows */}
          <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2 z-10">
            <button 
              onClick={handlePrev}
              className="btn btn-circle btn-sm opacity-70 hover:opacity-100"
            >
              <FaArrowLeft />
            </button>
            <button 
              onClick={handleNext}
              className="btn btn-circle btn-sm opacity-70 hover:opacity-100"
            >
              <FaArrowRight />
            </button>
          </div>
          
          <div 
            ref={carouselContainerRef}
            className="carousel carousel-center space-x-4 rounded-box"
            style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}
          >
            {links.map((link: ReferenceLink, index) => (
              <div
                key={link.id}
                ref={(el) => {
                  itemRefs.current[index] = el; // Sửa lại cách gán ref
                }}
                className={`carousel-item relative w-full ${
                  index === activeIndex ? 'active' : ''
                }`}
                style={{ 
                  scrollSnapAlign: 'start',
                  minWidth: 'calc(100% - 1rem)'
                }}
              >
                <div className="card w-full bg-base-100 shadow-xl">
                  <figure className="h-70">
                    <img 
                      src={link.image}
                      alt={link.title} 
                      className="object-cover w-full h-full"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{link.title}</h2>
                    <p>{link.description}</p>
                    <div className="card-actions justify-between items-center">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        Xem trang
                      </a>
                      <button 
                        onClick={() => setDeletingLink(link)}
                        className="btn btn-sm btn-error"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <dialog className={`modal ${deletingLink ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận xóa</h3>
          <p className="py-4">Bạn chắc chắn muốn xóa link này?</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setDeletingLink(null)}>
              Hủy
            </button>
            <button className="btn btn-error" onClick={handleDelete}>
              Xóa
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Discover
