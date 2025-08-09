import ProfileDashboard from "@/components/ProfileDashboard";
import { getUserProfile } from "@/lib/api/api";
import testConnection from "@/test-connection";

export default async function ProfilePage() {
  const user = await getUserProfile();
  testConnection()
  

  return (
    <div className="mx-auto max-w-7xl w-full">
      <ProfileDashboard user={user}/>
    </div>
  );
}
