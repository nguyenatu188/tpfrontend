import { useState } from "react"
import { Trip } from "../types/trip"
import { useGetActivities } from "../hooks/activity/useGetActivities"
import { useCreateActivity } from "../hooks/activity/useCreateActivity"
import { useUpdateActivity } from "../hooks/activity/useUpdateActivity"
import { useDeleteActivity } from "../hooks/activity/useDeleteActivity"
import { toast } from "react-toastify"
import { CiEdit } from "react-icons/ci"
import { MdDelete } from "react-icons/md"

interface ActivityProps {
  tripId: string
  trip?: Trip | null
}

const Activity = ({ tripId ,trip }: ActivityProps) => {
  const city = trip?.city || 'New York'
  const country = trip?.country || ''
  const displayLocation = country ? `${city}, ${country}` : city

  const [name, setName] = useState("")
  const [placeName, setPlaceName] = useState("")
  const [location, setLocation] = useState("")
  const [time, setTime] = useState("")
  const [price, setPrice] = useState("")

  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null)
  const { deleteActivity, isLoading: isDeleting } = useDeleteActivity(tripId, deletingActivityId ?? undefined)

  const [editingActivity, setEditingActivity] = useState<{
    id: string
    name: string
    placeName: string
    location: string
    time: string
    price: string
  } | null>(null)

  const { createActivity, isLoading: isCreating } = useCreateActivity(tripId)
  const { updateActivity, isLoading: isUpdating } = useUpdateActivity(tripId, editingActivity?.id)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { data: activities, isLoading, error, refetch } = useGetActivities(tripId)
  
  // State cho search input và query
  const [searchInput, setSearchInput] = useState("")
  const [currentQuery, setCurrentQuery] = useState("")

  // Tạo URL dựa trên query
  const getEmbedUrl = () => {
    const baseUrl = "https://www.google.com/maps/embed/v1/search"
    const query = currentQuery || displayLocation
    return `${baseUrl}?key=${import.meta.env.VITE_MAP_API_KEY}&q=${encodeURIComponent(query)}`
  }

  // Danh sách các danh mục
  const categories = [
    { label: "điểm du lịch", query: "tourist attractions" },
    { label: "biển", query: "beaches" },
    { label: "shopping", query: "shopping malls" },
    { label: "cà phê", query: "coffee shops" },
    { label: "bar", query: "bars" },
    { label: "hàng ăn", query: "restaurants" },
  ]

  // Xử lý khi click preset
  const handlePresetClick = (query: string) => {
    const newQuery = `${query} in ${displayLocation}`
    setSearchInput(newQuery)
    setCurrentQuery(newQuery)
  }

  // Xử lý khi search
  const handleSearch = () => {
    setCurrentQuery(searchInput)
  }

  const handleDelete = async () => {
    if (!deletingActivityId) return
    
    try {
      const success = await deleteActivity()
      if (success) {
        toast.success("Đã xóa sự kiện thành công 🗑️")
        setDeletingActivityId(null)
        refetch()
      }
    } catch (error) {
      toast.error(`Xóa thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`)
    }
  }

  interface ActivityType {
    id: string
    name: string
    placeName: string
    location: string
    time: string
    price: number
  }

  const handleOpenEditModal = (activity: ActivityType) => {
    setEditingActivity({
      id: activity.id,
      name: activity.name,
      placeName: activity.placeName,
      location: activity.location,
      time: new Date(activity.time).toISOString().slice(0, 16),
      price: activity.price.toString()
    })
    setIsEditModalOpen(true)
  }

  return (
    <div className="p-6 h-screen flex items-center justify-center bg-gray-100">
      {/* Nửa trái */}
      <div className="w-1/2 h-screen flex flex-col items-center justify-center gap-4 pr-4 overflow-y-auto">
        <button
          className="btn btn-info"
          onClick={() => setIsModalOpen(true)}
        >thêm sự kiện
        </button>
        {/* Hiển thị trạng thái loading */}
        {isLoading && <div className="text-lg">Đang tải...</div>}

        {/* Hiển thị lỗi */}
        {error && <div className="text-red-500">Lỗi: {error}</div>}

        {activities?.length === 0 && (
          <div className="text-gray-500">Chưa có sự kiện nào được thêm</div>
        )}

        {activities?.map((activity) => (
          <div
            key={activity.id}
            className="w-full relative bg-white rounded-lg p-4 shadow-md mb-4 hover:scale-102"
            onClick={() => {
              // Kết hợp placeName và location cho query
              const query = `${activity.placeName} ${activity.location}`
              setSearchInput(query)
              setCurrentQuery(query)
            }}
          >
            <button className="absolute top-[-25px] right-15 btn btn-primary btn-circle">
              <CiEdit
                size={20}
                className="text-gray-900"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenEditModal(activity)}
                }
              />
            </button>
            <button className="absolute top-[-25px] right-2 btn btn-error btn-circle">
              <MdDelete
                size={20}
                className="text-gray-800"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeletingActivityId(activity.id)}
                }
              />
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl text-gray-700 font-bold mb-2">{activity.name}</h3>
                <p className="text-gray-600 mb-1">
                  Địa điểm: {activity.placeName}
                </p>
                <p className="text-gray-600 mb-1">
                  Địa chỉ: {activity.location}
                </p>
                <p className="text-gray-600 mb-1">
                  Thời gian: {new Date(activity.time).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {activity.price.toLocaleString('vi-VN')} VND
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal thêm sự kiện */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Thêm sự kiện mới</h3>
            <form 
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault()
                try {
                  const newActivity = await createActivity({
                    name,
                    placeName,
                    location,
                    time: new Date(time).toISOString(),
                    price
                  })
                  
                  if (newActivity) {
                    toast.success("Thêm sự kiện thành công 🎉")
                    setIsModalOpen(false)
                    // Reset form
                    setName("")
                    setPlaceName("")
                    setLocation("")
                    setTime("")
                    setPrice("")
                    // Refresh danh sách activities
                    refetch()
                  }
                } catch (error) {
                  toast.error(`Thêm sự kiện thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`)
                }
              }}
            >
              {/* Tiêu đề */}
              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Tiêu đề</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Tên điểm đến */}
              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Tên điểm đến</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  required
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                />
              </div>

              {/* Địa chỉ */}
              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Địa chỉ</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Ngày tham gia */}
              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Ngày tham gia</span>
                </label>
                <input 
                  type="datetime-local"
                  className="input input-bordered w-full"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              {/* Chi phí */}
              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Chi phí (VND)</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered w-full"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Nút hành động */}
              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => {
                    setIsModalOpen(false)
                    // Reset form khi hủy
                    setName("")
                    setPlaceName("")
                    setLocation("")
                    setTime("")
                    setPrice("")
                  }}
                  disabled={isCreating}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isCreating}
                >
                  {isCreating ? 'Đang thêm...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Chỉnh sửa sự kiện</h3>
            <form 
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault()
                if (!editingActivity) return
                
                try {
                  const updatedActivity = await updateActivity({
                    name: editingActivity.name,
                    placeName: editingActivity.placeName,
                    location: editingActivity.location,
                    time: new Date(editingActivity.time).toISOString(),
                    price: editingActivity.price
                  })
                  
                  if (updatedActivity) {
                    toast.success("Cập nhật sự kiện thành công 🎉")
                    setIsEditModalOpen(false)
                    setEditingActivity(null)
                    refetch()
                  }
                } catch (error) {
                  toast.error(`Cập nhật thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`)
                }
              }}
            >
              {/* Các trường input cho edit form */}
              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Tiêu đề</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  required
                  value={editingActivity?.name || ''}
                  onChange={(e) => setEditingActivity(prev => prev ? {...prev, name: e.target.value} : null)}
                />
              </div>

              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Tên điểm đến</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  required
                  value={editingActivity?.placeName || ''}
                  onChange={(e) => setEditingActivity(prev => prev ? {...prev, placeName: e.target.value} : null)}
                />
              </div>

              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Địa chỉ</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered w-full" 
                  required
                  value={editingActivity?.location || ''}
                  onChange={(e) => setEditingActivity(prev => prev ? {...prev, location: e.target.value} : null)}
                />
              </div>

              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Ngày tham gia</span>
                </label>
                <input 
                  type="datetime-local"
                  className="input input-bordered w-full"
                  required
                  value={editingActivity?.time || ''}
                  onChange={(e) => setEditingActivity(prev => prev ? {...prev, time: e.target.value} : null)}
                />
              </div>

              <div className="form-control flex flex-col gap-2">
                <label className="label">
                  <span className="label-text">Chi phí (VND)</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered w-full"
                  min="0"
                  required
                  value={editingActivity?.price || ''}
                  onChange={(e) => setEditingActivity(prev => prev ? {...prev, price: e.target.value} : null)}
                />
              </div>

              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingActivity(null)
                  }}
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Đang cập nhật...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingActivityId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa sự kiện này không?</p>
            <div className="modal-action">
              <button 
                type="button" 
                className="btn"
                onClick={() => setDeletingActivityId(null)}
                disabled={isDeleting}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-error"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nửa phải - Bản đồ */}
      <div className="flex flex-col items-center justify-center h-screen w-1/2 rounded-lg overflow-hidden gap-3 py-4">
        {/* Search bar */}
        <div className="flex gap-2 w-full px-4">
          <input
            type="text"
            placeholder="Bố ơi mình đi đâu thế?"
            className="flex-1 p-2 text-black border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="btn btn-primary"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
        <div className="flex gap-2 w-full justify-center items-center">
          <p className="text-lg font-bold text-black">Gợi ý : </p>
          {categories.map((category) => (
            <button
              key={category.query}
              onClick={() => handlePresetClick(category.query)}
              className="text-blue-400 btn btn-soft text-sm"
            >
              {category.label}
            </button>
          ))}
        </div>

        <iframe
          className="w-full h-full"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={getEmbedUrl()}
          title={`Map of ${displayLocation}`}
        ></iframe>
      </div>
    </div>
  )
}

export default Activity
