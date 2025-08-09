import CreateTaskForm from "@/components/CreateTaskForm";
import { getAllUsers } from "@/lib/api/api";

export default async function Page() {
  const users = await getAllUsers(); 
  const safeUsers = Array.isArray(users) ? users : [];
  return (

    <div className="mx-auto max-w-4xl w-full">
        <CreateTaskForm users={safeUsers} />
    </div>
  )
  
  
}
