"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import BeautifulLoader from "@/components/Loader";
import {
  Users,
  Calendar,
  Award,
  TrendingUp,
  Settings,
  Activity,
  UserCheck,
  BarChart3,
  PieChart,
  Globe,
  Sparkles,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";

// Import tab components
import OverviewTab from "./components/OverviewTab";
import ClubsTab from "./components/ClubsTab";
import EventsTab from "./components/EventsTab";
import UsersTab from "./components/UsersTab";
import AnalyticsTab from "./components/AnalyticsTab";

// Create a separate client component that uses useSearchParams
const AdminDashboardContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState([
    {
      title: "Total Clubs",
      value: "0",
      change: "0%",
      trend: "up" as const,
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Active Events",
      value: "0",
      change: "0%",
      trend: "up" as const,
      icon: <Calendar className="w-6 h-6" />,
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Certificates Issued",
      value: "0",
      change: "0%",
      trend: "up" as const,
      icon: <Award className="w-6 h-6" />,
      color: "from-orange-600 to-red-600",
    },
    {
      title: "Growth Rate",
      value: "0%",
      change: "0%",
      trend: "up" as const,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-red-600 to-orange-500",
    },
  ]);

  const [chartData, setChartData] = useState<Array<{ name: string; clubs: number; events: number; certificates: number }>>([]);
  const [pieData, setPieData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [platformHealthScore, setPlatformHealthScore] = useState(0);

  // Get tab from URL on mount and when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setSelectedTab(tab);
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown-container")) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Fetch dashboard data function
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching admin dashboard data...");

      // Fetch stats
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();

      console.log("Stats response:", statsData);

        if (!statsData.success) {
          throw new Error(statsData.error || "Failed to fetch stats");
        }

        // Update dashboard stats
        setDashboardStats([
          {
            title: "Total Clubs",
            value: statsData.data.totalClubs.value.toString(),
            change: statsData.data.totalClubs.change,
            trend: statsData.data.totalClubs.trend,
            icon: <Users className="w-6 h-6" />,
            color: "from-orange-500 to-red-500",
          },
          {
            title: "Active Events",
            value: statsData.data.activeEvents.value.toString(),
            change: statsData.data.activeEvents.change,
            trend: statsData.data.activeEvents.trend,
            icon: <Calendar className="w-6 h-6" />,
            color: "from-red-500 to-orange-500",
          },
          {
            title: "Certificates Issued",
            value: statsData.data.certificatesIssued.value.toLocaleString(),
            change: statsData.data.certificatesIssued.change,
            trend: statsData.data.certificatesIssued.trend,
            icon: <Award className="w-6 h-6" />,
            color: "from-orange-600 to-red-600",
          },
          {
            title: "Growth Rate",
            value: statsData.data.growthRate.value,
            change: statsData.data.growthRate.change,
            trend: statsData.data.growthRate.trend,
            icon: <TrendingUp className="w-6 h-6" />,
            color: "from-red-600 to-orange-500",
          },
        ]);

        setActiveUsersCount(statsData.data.activeUsers);
        setPlatformHealthScore(statsData.data.platformHealthScore);

        console.log("Fetching analytics...");

        // Fetch analytics
        const analyticsRes = await fetch("/api/admin/analytics");
        const analyticsData = await analyticsRes.json();

        console.log("Analytics response:", analyticsData);

        if (!analyticsData.success) {
          throw new Error(analyticsData.error || "Failed to fetch analytics");
        }

        // Transform monthly growth data for the chart
        const transformedChartData = analyticsData.data.monthlyGrowth.map((item: { month: string; newClubs: number; newEvents: number }) => ({
          name: item.month,
          clubs: item.newClubs,
          events: item.newEvents
        }));
        
        setChartData(transformedChartData);

        console.log("Fetching club distribution...");

        // Fetch club distribution
        const distributionRes = await fetch("/api/admin/club-distribution");
        const distributionData = await distributionRes.json();

        console.log("Distribution response:", distributionData);

        if (!distributionData.success) {
          throw new Error(distributionData.error || "Failed to fetch distribution");
        }

        setPieData(distributionData.data);
        
        console.log("Dashboard data loaded successfully");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refetch data when switching back to overview tab (but not on initial mount)
  useEffect(() => {
    if (selectedTab === "overview" && !initialLoad) {
      fetchDashboardData();
    }
    if (initialLoad) {
      setInitialLoad(false);
    }
  }, [selectedTab, initialLoad]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    router.push(`/admin?tab=${tab}`, { scroll: false });
  };

  // Render current tab content
  const renderTabContent = () => {
    if (loading) {
      return (
        <BeautifulLoader
          message="Preparing your Admin Dashboard"
          subMessage="Fetching platform data and analytics"
          type="morphing"
        />
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Data</div>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (selectedTab) {
      case "overview":
        return (
          <OverviewTab
            dashboardStats={dashboardStats}
            chartData={chartData}
            pieData={pieData}
            platformHealthScore={platformHealthScore}
          />
        );
      case "clubs":
        return <ClubsTab />;
      case "events":
        return <EventsTab />;
      case "users":
        return <UsersTab />;
      case "analytics":
        return <AnalyticsTab />;
      default:
        return (
          <OverviewTab
            dashboardStats={dashboardStats}
            chartData={chartData}
            pieData={pieData}
            platformHealthScore={platformHealthScore}
          />
        );
    }
  };

  const SidebarButton = ({
    id,
    label,
    icon,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: (id: string) => void;
  }) => (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
          : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ClubSync
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarButton
            id="overview"
            label="Overview"
            icon={<BarChart3 className="w-5 h-5" />}
            active={selectedTab === "overview"}
            onClick={handleTabChange}
          />
          <SidebarButton
            id="clubs"
            label="Clubs"
            icon={<Users className="w-5 h-5" />}
            active={selectedTab === "clubs"}
            onClick={handleTabChange}
          />
          <SidebarButton
            id="events"
            label="Events"
            icon={<Calendar className="w-5 h-5" />}
            active={selectedTab === "events"}
            onClick={handleTabChange}
          />
          <SidebarButton
            id="users"
            label="Users"
            icon={<UserCheck className="w-5 h-5" />}
            active={selectedTab === "users"}
            onClick={handleTabChange}
          />
          <SidebarButton
            id="analytics"
            label="Analytics"
            icon={<PieChart className="w-5 h-5" />}
            active={selectedTab === "analytics"}
            onClick={handleTabChange}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Admin Portal Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            </div>

            {/* Live Stats Pills */}
            <div className="flex items-center space-x-4 ml-6">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {activeUsersCount} Active
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  All Systems Operational
                </span>
              </div>
            </div>

            {/* User Controls */}
            <div className="flex items-center space-x-4 ml-4">
              <div className="relative profile-dropdown-container">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {session?.user?.firstName?.[0] || session?.user?.name?.[0] || "A"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {session?.user?.firstName && session?.user?.lastName 
                      ? `${session.user.firstName} ${session.user.lastName}`
                      : session?.user?.name || "Admin"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {session?.user?.firstName && session?.user?.lastName 
                      ? `${session.user.firstName} ${session.user.lastName}`
                      : session?.user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session?.user?.email || "admin@clubsync.com"}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/volunteer/profile")}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
};

// Main component with Suspense boundary
const AdminDashboard = () => {
  return (
    <Suspense
      fallback={
        <BeautifulLoader
          message="Loading Admin Dashboard"
          subMessage="Please wait while we prepare everything"
          type="morphing"
        />
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
};

export default AdminDashboard;
