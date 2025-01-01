import { auth } from "@clerk/nextjs/server";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./_components/info-card";
import { CheckCircle, Clock } from "lucide-react";

export default async function Dashboard() {
  const {userId}= await auth();
  if(!userId)
  {
    redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress
  }=await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
          />
        </div>
        <CoursesList items={[...completedCourses,...coursesInProgress]}/>
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
          />
    </div>
  )
}