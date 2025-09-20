"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  useEffect,
  type ComponentType,
  type SVGProps,
  useRef,
} from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  MessageSquare,
  Star,
  Award,
  Eye,
  Settings,
  UserCog,
  Shield,
  Edit,
  Trash2,
  Archive,
  ChevronDown,
  Search,
  X,
  Crown,
  FileEdit,
  DollarSign,
  Monitor,
  UserMinus,
  Plus,
} from "lucide-react";

// Import tab components
import OverviewTab from "./components/OverviewTab";
import InterviewsTab from "./components/InterviewsTab";
import ElectionsTab from "./components/ElectionsTab";
import EventsTab from "./components/EventsTab";
import MinutesTab from "./components/MinutesTab";
import ServiceLettersTab from "./components/ServiceLettersTab";
import CandidatesTab from "./components/CandidatesTab";
import FeedBackTab from "./components/FeedBackTab";

interface Club {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  upcomingEvents: number;
  pendingRequests: number;
  status: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface ClubMember {
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  role: "member" | "president" | "secretary" | "treasurer" | "webmaster";
  membershipStatus: string;
  joinedAt: string;
}

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clubId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isSettingsAnimating, setIsSettingsAnimating] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Check if club details are complete
  const [isClubDetailsComplete, setIsClubDetailsComplete] = useState(false);
  const [clubCompletionLoading, setClubCompletionLoading] = useState(false);

  // Role management modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);

  // Get tab from URL on mount and when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
  }, [searchParams]);

  // Fetch club data from API
  useEffect(() => {
    if (!clubId) return;

    let cancelled = false;
    const fetchClub = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/clubs/${encodeURIComponent(clubId)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.error || "Failed to fetch club data");
        if (!cancelled) setClub(data as Club);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchClub();
    return () => {
      cancelled = true;
    };
  }, [clubId]);

  // Check club completion status
  useEffect(() => {
    if (clubId) {
      checkClubCompletion();
    }
  }, [clubId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettingsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch club members
  const fetchClubMembers = async () => {
    if (!clubId) return;
    setLoadingMembers(true);
    try {
      const res = await fetch(`/api/clubs/${clubId}/members`);
      const data = await res.json();
      if (res.ok) setClubMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Update member role
  const updateMemberRole = async (memberId: string, newRole: string) => {
    setRoleUpdating(memberId);
    try {
      const res = await fetch(`/api/clubs/${clubId}/members/${memberId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        await fetchClubMembers(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setRoleUpdating(null);
    }
  };

  // Remove member from role (set to member)
  const removeMemberFromRole = async (memberId: string) => {
    await updateMemberRole(memberId, "member");
  };

  // Check club details completion status
  const checkClubCompletion = async () => {
    try {
      setClubCompletionLoading(true);
      const res = await fetch(`/api/clubs/${clubId}/completion-status`);
      
      if (res.ok) {
        const data = await res.json();
        setIsClubDetailsComplete(data.isComplete || false);
      } else {
        // Default to incomplete if there's an error
        setIsClubDetailsComplete(false);
      }
    } catch (error) {
      console.error("Error checking club completion:", error);
      // Default to incomplete if there's an error
      setIsClubDetailsComplete(false);
    } finally {
      setClubCompletionLoading(false);
    }
  };

  // Navigate to complete club details page
  const handleCompleteClubDetails = async () => {
    try {
      // Check permissions before navigating
      const res = await fetch(`/api/clubs/${clubId}/completion-status`);
      
      if (res.status === 403) {
        // Permission denied
        alert("Access denied. Only club officers (President, Secretary, Treasurer, Webmaster) can access club details.");
        return;
      }
      
      if (res.status === 401) {
        // Not authenticated
        alert("Please log in to access club details.");
        return;
      }
      
      if (!res.ok) {
        // Other errors
        alert("Error accessing club details. Please try again later.");
        return;
      }
      
      // If we reach here, user has permission
      router.push(`/club-verify/complete-details?clubId=${clubId}`);
    } catch (error) {
      console.error("Error navigating to club details:", error);
      alert("Error accessing club details. Please try again later.");
    }
  };

  const handleSettingsClick = () => {
    setIsSettingsAnimating(true);
    setShowSettingsDropdown(!showSettingsDropdown);
    setTimeout(() => setIsSettingsAnimating(false), 200);
  };

  const settingsOptions = [
    {
      icon: UserCog,
      label: "Manage Roles",
      action: () => {
        setShowRoleModal(true);
        fetchClubMembers();
      },
      color: "text-blue-600 hover:bg-blue-50",
    },
    {
      icon: Shield,
      label: "Permissions",
      action: () => console.log("Permissions"),
      color: "text-green-600 hover:bg-green-50",
    },
    {
      icon: Edit,
      label: "Edit Club Info",
      action: () => console.log("Edit club"),
      color: "text-orange-600 hover:bg-orange-50",
    },
    {
      icon: Archive,
      label: "Archive Club",
      action: () => console.log("Archive club"),
      color: "text-yellow-600 hover:bg-yellow-50",
    },
    {
      icon: Trash2,
      label: "Delete Club",
      action: () => console.log("Delete club"),
      color: "text-red-600 hover:bg-red-50",
    },
  ];

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/club-admin/clubs/${clubId}?tab=${tab}`, { scroll: false });
  };

  // Fallback when no club data
  const fallbackClub: Club = {
    id: clubId,
    name: "Unknown Club",
    description: "Club information not found.",
    memberCount: 0,
    upcomingEvents: 0,
    pendingRequests: 0,
    status: "inactive",
    createdAt: "Unknown",
  };

  const clubData = club ?? fallbackClub;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
      case "published":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const roleIcons = {
    member: Users,
    president: Crown,
    secretary: FileEdit,
    treasurer: DollarSign,
    webmaster: Monitor,
  };

  const roleColors = {
    member: "bg-gray-100 text-gray-800 border-gray-200",
    president: "bg-purple-100 text-purple-800 border-purple-200",
    secretary: "bg-blue-100 text-blue-800 border-blue-200",
    treasurer: "bg-green-100 text-green-800 border-green-200",
    webmaster: "bg-orange-100 text-orange-800 border-orange-200",
  };

  const filteredMembers = clubMembers.filter(
    (member) =>
      `${member.user.firstName} ${member.user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const membersByRole = filteredMembers.reduce(
    (acc, member) => {
      if (!acc[member.role]) acc[member.role] = [];
      acc[member.role].push(member);
      return acc;
    },
    {} as Record<string, ClubMember[]>,
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "interviews", label: "Interviews", icon: Users },
    { id: "elections", label: "Elections", icon: Award },
    { id: "events", label: "Events", icon: Calendar },
    { id: "minutes", label: "Minutes", icon: FileText },
    { id: "service-letters", label: "Service Letters", icon: CheckCircle },
    { id: "candidates", label: "Candidates", icon: Star },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab club={clubData} />;
      case "interviews":
        return <InterviewsTab />;
      case "elections":
        return <ElectionsTab />;
      case "events":
        return <EventsTab />;
      case "minutes":
        return <MinutesTab />;
      case "service-letters":
        return <ServiceLettersTab />;
      case "candidates":
        return <CandidatesTab />;
      case "feedback":
        return <FeedBackTab />;
      default:
        return <OverviewTab club={clubData} />;
    }
  };

  const TabButton = ({
    id,
    label,
    icon,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    active: boolean;
    onClick: (id: string) => void;
  }) => {
    const Icon = icon;
    return (
      <button
        onClick={() => onClick(id)}
        className={`group flex items-center space-x-3 py-3 px-4 font-medium text-sm transition-all duration-300 border-b-2 ${
          active
            ? "text-orange-600 border-orange-600 bg-orange-50"
            : "text-gray-600 border-transparent hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50"
        }`}
      >
        <Icon
          className={`w-4 h-4 transition-colors duration-300 ${
            active
              ? "text-orange-600"
              : "text-gray-500 group-hover:text-orange-600"
          }`}
        />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Role Management Modal - Fixed Height Structure */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Enhanced Backdrop with transparency */}
          <div
            className="absolute inset-0 bg-black/15 backdrop-blur-sm"
            onClick={() => setShowRoleModal(false)}
          />

          {/* Modal with proper height distribution */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] overflow-hidden border-2 border-gray-100 transform transition-all duration-300 flex flex-col">
            {/* Enhanced Header - Fixed Height */}
            <div className="relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm" />
              <div className="relative flex justify-between items-center p-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <UserCog className="w-4 h-4 text-white" />
                    </div>
                    <span>Manage Club Roles</span>
                  </h2>
                  <p className="text-gray-700 font-medium ml-10 text-sm">
                    Organize your team structure with precision and clarity
                  </p>
                </div>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="group p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
                >
                  <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" />
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-3 right-16 w-2 h-2 bg-blue-300 rounded-full animate-bounce" />
              <div className="absolute bottom-3 left-16 w-2 h-2 bg-indigo-300 rounded-full animate-pulse" />
            </div>

            {/* Search Bar Section - Fixed Height */}
            <div className="p-5 border-b border-gray-200 bg-gradient-to-br from-gray-50/50 to-white flex-shrink-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Find Members
                  </h3>
                  <div className="h-px bg-gradient-to-r from-emerald-500 to-green-600 flex-1 opacity-30" />
                </div>

                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search members by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content with Scrollable Area - Flexible Height */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white">
              <div className="p-5">
                {loadingMembers ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-blue-100"></div>
                    </div>
                    <span className="ml-4 text-gray-700 font-medium">
                      Loading members...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Role Sections */}
                    {[
                      "president",
                      "secretary",
                      "treasurer",
                      "webmaster",
                      "member",
                    ].map((role) => {
                      const Icon = roleIcons[role as keyof typeof roleIcons];
                      const members = membersByRole[role] || [];

                      return (
                        <div
                          key={role}
                          className="relative overflow-hidden border-2 border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-10 -mt-10 opacity-30" />

                          <div className="relative flex items-center justify-between mb-5">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-3 rounded-xl ${roleColors[role as keyof typeof roleColors]} border-2 transform hover:rotate-12 transition-transform duration-300`}
                              >
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 capitalize text-lg">
                                  {role}s
                                </h3>
                                <p className="text-sm text-gray-600 font-medium">
                                  {members.length} member
                                  {members.length !== 1 ? "s" : ""} assigned
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 rounded-full">
                                <span className="text-xs font-bold text-gray-700">
                                  {members.length} Active
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {members.map((member) => (
                              <div
                                key={member.id}
                                className="relative overflow-hidden group flex items-center justify-between p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
                              >
                                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-200 rounded-full opacity-50" />

                                <div className="flex items-center space-x-4">
                                  <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm transform group-hover:rotate-12 transition-transform duration-300">
                                      {member.user.firstName.charAt(0)}
                                      {member.user.lastName.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    </div>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-900 text-base">
                                      {member.user.firstName}{" "}
                                      {member.user.lastName}
                                    </h4>
                                    <p className="text-sm text-gray-600 font-medium">
                                      {member.user.email}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-2 py-1 rounded-full">
                                        <p className="text-xs text-blue-800 font-bold">
                                          Joined:{" "}
                                          {new Date(
                                            member.joinedAt,
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-2 border border-gray-300 hover:shadow-md transition-all duration-300">
                                    <select
                                      value={member.role}
                                      onChange={(e) =>
                                        updateMemberRole(
                                          member.id,
                                          e.target.value,
                                        )
                                      }
                                      disabled={roleUpdating === member.id}
                                      className="text-sm border-0 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-transparent disabled:opacity-50 font-medium text-gray-800 cursor-pointer"
                                    >
                                      <option value="member">Member</option>
                                      <option value="president">
                                        President
                                      </option>
                                      <option value="secretary">
                                        Secretary
                                      </option>
                                      <option value="treasurer">
                                        Treasurer
                                      </option>
                                      <option value="webmaster">
                                        Webmaster
                                      </option>
                                    </select>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    {member.role !== "member" && (
                                      <button
                                        onClick={() =>
                                          removeMemberFromRole(member.id)
                                        }
                                        disabled={roleUpdating === member.id}
                                        className="group p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 disabled:opacity-50 hover:scale-110 transform"
                                        title="Remove from role"
                                      >
                                        <UserMinus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                      </button>
                                    )}

                                    {roleUpdating === member.id && (
                                      <div className="relative">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                        <div className="absolute inset-0 rounded-full border border-blue-200"></div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}

                            {members.length === 0 && (
                              <div className="relative overflow-hidden text-center py-8 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-300">
                                <Users className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-pulse" />
                                <h4 className="text-base font-bold text-gray-700 mb-2">
                                  No {role}s assigned
                                </h4>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                  Use the dropdown above to assign members to
                                  this role
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Footer - Fixed Height at Bottom */}
            <div className="relative overflow-hidden border-t border-gray-200 bg-white flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50/30" />
              <div className="relative flex justify-between items-center p-5">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        Total Members: {clubMembers.length}
                      </div>
                      <div className="text-xs text-gray-600">
                        Filtered: {filteredMembers.length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRoleModal(false)}
                    className="group px-5 py-2 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 font-semibold hover:scale-105 transform text-sm"
                  >
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      Close
                    </span>
                  </button>
                  <button
                    onClick={() => fetchClubMembers()}
                    className="group flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:scale-105 transform font-semibold text-sm"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      🔄
                    </span>
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header - Aligned with Admin Dashboard Style */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/club-admin")}
                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">
                    {clubData.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {clubData.name}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {clubData.description}
                  </p>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {clubData.memberCount} members
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {clubData.upcomingEvents} events
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  String(clubData.status),
                )}`}
              >
                {String(clubData.status).charAt(0).toUpperCase() +
                  String(clubData.status).slice(1)}
              </span>

              {/* Complete Club Details Button */}
              <button
                onClick={handleCompleteClubDetails}
                disabled={clubCompletionLoading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md transform hover:scale-105 ${
                  isClubDetailsComplete
                    ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300"
                    : "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 hover:border-orange-300"
                } ${clubCompletionLoading ? "opacity-50 cursor-not-allowed transform-none" : ""}`}
                title={
                  isClubDetailsComplete
                    ? "✅ Club details are complete - Click to view or edit details"
                    : "⚠️ Complete your club details - Required for full functionality"
                }
              >
                {clubCompletionLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Checking...</span>
                  </>
                ) : isClubDetailsComplete ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Details Complete</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <FileEdit className="w-4 h-4" />
                    <span>Complete Details</span>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </>
                )}
              </button>

              {/* Settings Dropdown */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={handleSettingsClick}
                  className={`flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 ${
                    isSettingsAnimating ? "scale-95" : "scale-100"
                  } ${showSettingsDropdown ? "bg-orange-100 border border-orange-200" : ""}`}
                >
                  <Settings
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      isSettingsAnimating ? "rotate-45" : "rotate-0"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Settings
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      showSettingsDropdown ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showSettingsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {settingsOptions.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            option.action();
                            setShowSettingsDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors ${option.color}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* small status row to use loading/error state */}
        <div className="mb-4">
          {loading && (
            <div className="text-sm text-gray-500">Loading club details...</div>
          )}
          {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                  active={activeTab === tab.id}
                  onClick={handleTabChange}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Role Management Modal */}
    </div>
  );
}
