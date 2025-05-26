export function useUpdateUserProfile() {
  const updateUserProfile = async (userData: {
    fullname: string
    username: string
    email: string
    gender: "male" | "female"
  }) => {
    try {
      const res = await fetch('/api/users/profile', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Cập nhật thất bại")
      }

      const responseData = await res.json()
      return responseData
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err)
      throw err
    }
  }

  return { updateUserProfile }
}
