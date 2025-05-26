import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Mainboard from "../components/Mainboard"
import { User } from "../types/user"

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) return;

      try {
        const response = await fetch(`/api/users/profile/${username}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("User not found");
        const data: User = await response.json();
        setProfileUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch profile");
      }
    };

    fetchUserProfile();
  }, [username, profileUser?.isFollowing]);

  const enrichedTrips = useMemo(
    () =>
      profileUser?.trips?.map((trip) => ({
        ...trip,
        owner: {
          id: profileUser.id,
          username: profileUser.username,
          avatarUrl: profileUser.avatarUrl || "/default-avatar.png",
        },
        sharedUsers: trip.sharedUsers || [],
      })) || [],
    [profileUser]
  );

  if (error || !profileUser) {
    return <div className="text-center mt-10">{error || "User not found"}</div>;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar 
          profileUser={profileUser}
          setProfileUser={setProfileUser}  
        />
        <Mainboard userTrips={enrichedTrips} isProfileView />
      </div>
    </div>
  );
};

export default UserProfilePage;
