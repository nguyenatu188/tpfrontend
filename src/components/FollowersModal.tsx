import { User } from "../types/user"

export const FollowersModal = ({ 
  show, 
  onClose,
  users
}: {
  show: boolean
  onClose: () => void
  users?: User[]
}) => {
  return (
    <dialog className={`modal ${show && 'modal-open'}`}>
      <div className="modal-box text-white">
        <h3 className="font-bold text-lg mb-4">Followers</h3>
        <div className="max-h-[60vh] overflow-y-auto">
          {users?.map(user => (
            <div key={user.id} className="flex items-center p-2 hover:bg-base-200 rounded">
              <img
                src={user.avatarUrl || "/default-avatar.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{user.fullname}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
          ))}
          {users?.length === 0 && (
            <p className="text-center text-gray-500">No followers yet</p>
          )}
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </dialog>
  )
}