import type { DashboardStats } from "@/types/dashboard";

export const mockDashboardData: DashboardStats = {
  overview: {
    totalProjects: 300,
    totalSubmissions: 300,
    totalMembers: 120,
    completionRate: 87,
    projectsGrowth: "+5% from active",
    submissionsGrowth: "+5% from yesterday",
    membersGrowth: "+1.2% from yesterday",
    completionGrowth: "0.5% from yesterday"
  },
  recentProjects: [
    {
      id: "1",
      title: "Core Banking's Project",
      description: "This is project where's we gathering together with KTC x ATA IT",
      participants: 185,
      createdAt: "2 week ago",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      progress: 75
    },
    {
      id: "2",
      title: "Mobile App Development",
      description: "Cross-platform mobile application for customer engagement",
      participants: 142,
      createdAt: "1 week ago",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
      progress: 60
    },
    {
      id: "3",
      title: "AI Integration Project",
      description: "Implementing machine learning algorithms for data analysis",
      participants: 98,
      createdAt: "3 days ago",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024f",
      progress: 25
    }
  ],
  recentFeedbacks: [
    {
      id: "1",
      projectTitle: "Core Banking's Project",
      description: "This is project where's we gathering together with KTC x ATA IT",
      participants: 185,
      createdAt: "2 week ago",
      status: "analyzed",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      sentiment: "positive",
      score: 8.5
    },
    {
      id: "2",
      projectTitle: "Mobile App Development",
      description: "Cross-platform mobile application for customer engagement",
      participants: 142,
      createdAt: "1 week ago",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
      sentiment: "neutral",
      score: 6.2
    },
    {
      id: "3",
      projectTitle: "AI Integration Project",
      description: "Implementing machine learning algorithms for data analysis",
      participants: 98,
      createdAt: "3 days ago",
      status: "completed",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024f",
      sentiment: "positive",
      score: 9.1
    }
  ],
  chartData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Projects",
        data: [65, 78, 90, 85, 95, 100],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)"
      },
      {
        label: "Submissions",
        data: [45, 62, 75, 68, 82, 88],
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgba(16, 185, 129, 1)"
      }
    ]
  }
}; 