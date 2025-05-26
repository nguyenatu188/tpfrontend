import { useState, useEffect, useRef  } from "react"
import { useAuthContext } from "../context/AuthContext"
import { useUploadAvatar } from "../hooks/profile/useUploadAvatar"
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen'
import { thumbnail } from '@cloudinary/url-gen/actions/resize'
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners'
import { IoMdMale } from "react-icons/io"
import { IoMdFemale } from "react-icons/io"
import { toast } from 'react-toastify'
import { useUpdateUserProfile } from "../hooks/profile/useUpdateUserProfile"
import { useFollowUser } from "../hooks/follow/useFollowUser"
import { useUnfollowUser } from "../hooks/follow/useUnfollowUser"
import { useGetFollowers } from "../hooks/follow/useGetFollowers"
import { useGetFollowing } from "../hooks/follow/useGetFollowing"
import { FollowersModal } from "./FollowersModal"
import { FollowingModal } from "./FollowingModal"
import { User } from "../types/user"

interface SidebarProps {
  profileUser?: User
  setProfileUser?: React.Dispatch<React.SetStateAction<User | null>>
}

type MenuItem = "Trip"

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
})

// Helper function để lấy public ID từ URL
const getPublicId = (url: string) => {
  // Regex xử lý cả URL có version (v123456/...) và không version
  // eslint-disable-next-line no-useless-escape
  const pattern = /\/upload\/(?:v\d+\/)?([^\.]+)/
  const match = url.match(pattern)
  return match ? match[1] : ''
}

const OptimizedAvatar = ({ src }: { src?: string }) => {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  if (!imgSrc) return <img src="/default-avatar.png" alt="avatar" className="w-full h-full rounded-full" />

  const isCloudinary = imgSrc.includes('res.cloudinary.com')

  // Xử lý lỗi ảnh
  const handleError = () => {
    setImgSrc('/default-avatar.png')
  }

  if (!isCloudinary) {
    return (
      <img 
        src={imgSrc} 
        onError={handleError}
        alt="avatar" 
        className="w-full h-full object-cover rounded-full"
      />
    )
  }

  try {
    const publicId = getPublicId(imgSrc)
    const img = cld.image(publicId)
      .resize(thumbnail().width(200).height(200))
      .roundCorners(byRadius(999))
      .format('webp')
      .quality('auto')

    return <AdvancedImage
      cldImg={img}
      alt="avatar"
      className="w-full h-full object-cover"
      onError={handleError}
    />
  } catch (error) {
    console.error('Cloudinary image error:', error)
    return <img src="/default-avatar.png" alt="avatar" className="w-full h-full rounded-full" />
  }
}

const Sidebar = ({ profileUser, setProfileUser }: SidebarProps) => {
  const { authUser, setAuthUser } = useAuthContext()
  const [activeMenu, setActiveMenu] = useState<MenuItem>("Trip")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const { follow, loading: followLoading } = useFollowUser()
  const { unfollow, loading: unfollowLoading } = useUnfollowUser()
  const { followers: authFollowers } = useGetFollowers()
  const { following: authFollowing } = useGetFollowing()

  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    gender: "male" as "male" | "female"
  })
  const { updateUserProfile } = useUpdateUserProfile()

  // Use profileUser if provided, otherwise fall back to authUser
  const displayUser = profileUser || authUser

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadAvatar, isLoading: isUploading, error: uploadError } = useUploadAvatar()
  const isCurrentUser = !profileUser || profileUser?.id === authUser?.id

  const handleUploadClick = () => {
    if (fileInputRef.current && isCurrentUser) {
      fileInputRef.current.click()
    }
  }

  const handleFollowAction = async () => {
    if (!profileUser || !setProfileUser) return
    
    try {
      if (profileUser.isFollowing) {
        await unfollow(profileUser.id)
        setProfileUser(prev => prev ? {
          ...prev,
          isFollowing: false,
        } : null)
      } else {
        await follow(profileUser.id)
        setProfileUser(prev => prev ? {
          ...prev,
          isFollowing: true,
        } : null)
      }
    } catch (error) {
      console.error("Follow action failed:", error)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && isCurrentUser) {
      try {
        await uploadAvatar(e.target.files[0])
      } catch (error) {
        console.error("Upload failed:", error)
      }
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        setIsSearching(true)
        searchUsers()
      } else {
        setSearchResults([])
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const searchUsers = async () => {
    try {
      const response = await fetch(
        `/api/users/search?query=${encodeURIComponent(searchQuery)}`,
        { credentials: "include" }
      )
      const data = await response.json()
      setSearchResults(data.data.users || [])
    } catch (error) {
      console.error("Error searching users:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleMenuClick = (menu: MenuItem) => {
    setActiveMenu(menu)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const responseData = await updateUserProfile(formData)
      
      // Cập nhật thông tin user trong context
      if (responseData.user) {
        const updatedUser = {
          ...authUser,
          ...responseData.user
        }
        setAuthUser(updatedUser)
      }
      
      toast.success(responseData.message || "Cập nhật thành công")
      setShowEditModal(false)
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message?: string }).message || "Cập nhật thất bại")
      } else {
        toast.error("Cập nhật thất bại")
      }
      console.error("Update error:", error)
    }
  }

  return (
    <ul className="menu bg-custom w-64 border-r-1  border-[#dde9ed] text-black">
      <li className="border-b-1 border-[#dde9ed] mt-5">
        <div className="avatar relative group">
          <div className="w-24 rounded-full cursor-pointer relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={!isCurrentUser}
            />
            
            {/* Avatar Image */}
            <OptimizedAvatar src={displayUser?.avatarUrl} />
            
            {/* Upload Overlay */}
            {isCurrentUser && (
              <div
                className={`absolute inset-0 bg-black bg-opacity-50 rounded-full 
                         flex items-center justify-center opacity-0 group-hover:opacity-70
                         ${isUploading && "opacity-70"}
                         transition-opacity duration-200`}
                onClick={handleUploadClick}
              >
                {isUploading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  <svg 
                    className="w-8 h-8 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>

        {uploadError && (
          <div className="text-red-500 text-sm mt-2">{uploadError}</div>
        )}

        <div className="flex flex-col justify-start items-start">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl text-black font-bold block">
              {displayUser?.fullname || "Loading..."}
            </h1>
            {displayUser?.gender === 'male' ? <IoMdMale size={25} className="text-blue-500"/> : <IoMdFemale size={25} className="text-pink-500"/>}
          </div>
          <p className="text-base text-black">@{displayUser?.username || ""}</p>
          <p className="text-base text-gray-600">{displayUser?.email}</p>
          {isCurrentUser && (
            <button
              onClick={() => {
                setShowEditModal(true)
                setFormData({
                  fullname: displayUser?.fullname || "",
                  username: displayUser?.username || "",
                  email: displayUser?.email || "",
                  gender: (displayUser?.gender as "male" | "female") || "male"
                })
              }}
              className="btn btn-sm btn-dash btn-info mt-3"
            >
              ✏️ Edit
            </button>
          )}
        </div>

        <div className="flex justify-center gap-10 mb-5 mt-1">
          <button
            className="flex flex-col justify-center items-center"
            onClick={() => setShowFollowersModal(true)}
          >
            <div>{displayUser?.followersCount || 0}</div>
            <div>followers</div>
          </button>
          <button
            className="flex flex-col justify-center items-center"
            onClick={() => setShowFollowingModal(true)}
          >
            <div>{displayUser?.followingCount || 0}</div>
            <div>following</div>
          </button>
        </div>

        {!isCurrentUser && (
          <button
            onClick={handleFollowAction}
            className={`btn btn-sm ${profileUser?.isFollowing ? 'btn-error' : 'btn-primary'} mt-3`}
            disabled={followLoading || unfollowLoading}
          >
            {(followLoading || unfollowLoading) ? (
              <span className="loading loading-spinner"></span>
            ) : profileUser?.isFollowing ? (
              'Unfollow'
            ) : (
              'Follow'
            )}
          </button>
        )}
      </li>

      <li className="my-8 relative">
        <label className="input bg-custom border-[#dde9ed] border-2">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            placeholder="Tìm theo username hoặc fullname"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>

        {searchQuery.length >= 1 && (
          <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[320px] overflow-y-auto z-10 flex flex-col">
            {isSearching ? (
              <div className="p-2 text-gray-500 text-center text-sm">
                Searching...
              </div>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 5).map((user) => (
                    <a
                      key={user.id}
                      href={user.username === authUser?.username ? "/home" : `/profile/${user.username}`}
                      className="flex items-center p-2 border-b border-gray-200 hover:bg-gray-50 last:border-b-0 w-full"
                    >
                      <img
                        src={user.avatarUrl || "/default-avatar.png"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-800">
                          {user.fullname}
                        </p>
                        <p className="text-xs text-gray-600">@{user.username}</p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 text-center text-sm">
                    No users found
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </li>

      <li className="my-2">
        <a
          className={`font-jembrush text-3xl ${
            activeMenu === "Trip" ? "menu-active" : ""
          }`}
          onClick={() => handleMenuClick("Trip")}
        >
          Trip
        </a>
      </li>

      {/* modal sửa thông tin người dùng */}
      <dialog className={`modal ${showEditModal && 'modal-open'}`}>
        <div className="modal-box text-white">
          <h3 className="font-bold text-lg">Chỉnh sửa thông tin</h3>
          <form
            className="flex flex-col gap-4 mt-4" 
            onSubmit={handleSubmit}>
            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Họ và tên</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.fullname}
                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Tên người dùng</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Giới tính</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value as "male" | "female"})}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div className="modal-action">
              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-soft btn-primary">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <FollowersModal 
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        users={isCurrentUser ? authFollowers : profileUser?.followers || []}
      />

      <FollowingModal 
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        users={isCurrentUser ? authFollowing : profileUser?.following || []}
      />
    </ul>
  )
}

export default Sidebar
