import TaskDetail from "@/components/TaskDetail";
import { getTaskById } from "@/lib/api/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default async function SingleTaskSSRPage({ params }) {
  const { id } = await params;
  const taskResult = await getTaskById(id);

  if (!taskResult.success) {
    if (taskResult.status === 404) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h2 className="font-bold">Error Loading Task</h2>
              <p>{taskResult.error}</p>
              {taskResult.status && (
                <p className="text-sm">Status: {taskResult.status}</p>
              )}
            </div>
          </div>

          <Link
            href="/tasks"
            className="inline-flex items-center gap-1 text-orange-700 hover:text-orange-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  const { task } = taskResult;

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-orange-700 hover:text-orange-900 font-medium mb-6 block"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </Link>
        <TaskDetail task={task} />
      </div>
    </div>
  );
}
