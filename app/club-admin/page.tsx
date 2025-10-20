// app/club-admin/page.tsx
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  CheckCircle,
  MessageSquare,
  Plus,
  Star,
  TrendingUp,
  AlertCircle,
  Clock,
  X,
  Eye,
} from "lucide-react";
import BeautifulLoader from "@/components/Loader";

interface Club {
  id: string;
  name: string;
  description?: string;
  image?: string;
  memberCount: number;
  upcomingEvents: number;
  pendingRequests: number;
  status: "active" | "pending" | "inactive" | string;
  userRole?: string;
  type?: "club" | "request";
  requestStatus?: string;
}

export default function ClubAdminDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.firstName || session?.user?.name || "Admin";
  const [showAddClubModal, setShowAddClubModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiry, setInquiry] = useState({
    subject: "",
    type: "general",
    message: "",
  });

  const [inquiryNotice, setInquiryNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentFeedback, setRecentFeedback] = useState<Array<any>>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  async function fetchClubs() {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const url = `/api/clubs/executive-clubs?userId=${session.user.id}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to fetch clubs");
      setClubs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setClubs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClubs();
  }, [session?.user?.id]);

  useEffect(() => {
    // fetch latest feedbacks for admin dashboard
    const fetchRecentFeedbacks = async () => {
      setFeedbackLoading(true);
      setFeedbackError(null);
      try {
        const res = await fetch(`/api/feedbacks?limit=5`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch feedbacks");
        setRecentFeedback(data);
      } catch (err) {
        setRecentFeedback([]);
        setFeedbackError(err instanceof Error ? err.message : String(err));
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchRecentFeedbacks();
  }, []);

  // Reset inquiry modal state when opened
  useEffect(() => {
    if (showInquiryModal) {
      setInquirySubmitted(false);
      setInquiryNotice(null);
      setInquiry({ subject: "", type: "general", message: "" });
    }
  }, [showInquiryModal]);

  

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
      case "rejected":
        return "bg-red-100 text-red-800";
      case "underreview":
      case "under review":
        return "bg-blue-100 text-blue-800";
      case "needsmoreinfo":
      case "needs more info":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string, type?: string) => {
    const statusLower = status.toLowerCase();

    if (statusLower === "pending" || type === "request") {
      return <Clock className="w-3 h-3 mr-1" />;
    } else if (
      statusLower === "underreview" ||
      statusLower === "under review"
    ) {
      return <Users className="w-3 h-3 mr-1" />;
    } else if (
      statusLower === "needsmoreinfo" ||
      statusLower === "needs more info"
    ) {
      return <AlertCircle className="w-3 h-3 mr-1" />;
    } else if (statusLower === "rejected" || statusLower === "inactive") {
      return <X className="w-3 h-3 mr-1" />;
    } else if (statusLower === "approved" || statusLower === "active") {
      return <CheckCircle className="w-3 h-3 mr-1" />;
    }

    return <CheckCircle className="w-3 h-3 mr-1" />;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getClubLink = (club: Club) => {
    if (club.type === "request") {
      return `/club-admin/requests/${club.id}`;
    }
    return `/club-admin/clubs/${club.id}`;
  };

  if (loading) {
    return (
      <BeautifulLoader
        message="Preparing your Club Admin Dashboard"
        subMessage="Fetching your clubs and data"
        type="morphing"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* System-aligned Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* Welcome Section */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">
                  {userName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back,{" "}
                  <span className="text-orange-600">{userName}</span>!
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your clubs and oversee all administrative activities
                </p>
                <div className="flex items-center mt-2 space-x-3">
                  <div className="flex items-center space-x-2 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700">
                      Online
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last login: Today at 10:30 AM
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="mt-4 lg:mt-0 flex gap-3">
              <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Clubs</p>
                  <p className="text-lg font-bold text-gray-900">
                    {clubs.filter((club) => club.type !== "request").length}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Active Today</p>
                  <p className="text-lg font-bold text-orange-600">
                    {clubs.filter((club) => club.status === "active").length}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Pending Requests</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {
                      clubs.filter(
                        (club) =>
                          club.type === "request" &&
                          (club.status === "pending" ||
                            club.status === "underReview" ||
                            club.status === "needsMoreInfo"),
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid - Aligned with Admin Dashboard Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {clubs.reduce((sum, club) => sum + club.memberCount, 0)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +12% from last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {clubs.reduce((sum, club) => sum + club.upcomingEvents, 0)}
                </p>
                <p className="text-xs text-blue-600 mt-1">+3 this week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  Pending Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {clubs.reduce((sum, club) => sum + club.pendingRequests, 0)}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Needs attention</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Star className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-xs text-green-600 mt-1">
                  Excellent performance
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Clubs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-black">Your Clubs</h2>
                  <p className="text-sm text-gray-600">
                    Manage and monitor your club activities
                  </p>
                </div>
                <button
                  onClick={() => setShowAddClubModal(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Club
                </button>
              </div>

              <div className="space-y-6">
                {clubs.map((club, index) => {
                  const isClickable = club.status !== "pending" && club.status !== "underReview" && club.status !== "needsMoreInfo";
                  const clubContent = (
                    <div className={`group bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 ${isClickable ? 'hover:from-orange-50 hover:to-red-50 cursor-pointer hover:border-orange-300 hover:shadow-lg' : 'opacity-70 cursor-not-allowed'} transition-all duration-300 border border-gray-200`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${
                              club.status === "pending"
                                ? "from-yellow-500 to-orange-500"
                                : index % 3 === 0
                                  ? "from-orange-500 to-red-500"
                                  : index % 3 === 1
                                    ? "from-blue-500 to-indigo-500"
                                    : "from-purple-500 to-pink-500"
                            } rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${isClickable ? 'group-hover:scale-110' : ''} transition-transform duration-300`}
                          >
                            {club.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold text-black ${isClickable ? 'group-hover:text-orange-700' : ''} transition-colors`}>
                              {club.name}
                              {club.type === "request" && (
                                <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                  Request
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center space-x-4 mt-2">
                              {club.type !== "request" && (
                                <>
                                  <span className="text-xs text-gray-500 flex items-center bg-white px-2 py-1 rounded-full">
                                    <Users className="w-3 h-3 mr-1" />
                                    {club.memberCount} members
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center bg-white px-2 py-1 rounded-full">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {club.upcomingEvents} events
                                  </span>
                                </>
                              )}
                              {club.pendingRequests > 0 && (
                                <span className="text-xs text-yellow-600 flex items-center bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  {club.pendingRequests} pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(club.status)}`}
                          >
                            {getStatusIcon(club.status, club.type)}
                            {club.status === "underReview"
                              ? "Under Review"
                              : club.status === "needsMoreInfo"
                                ? "Needs More Info"
                                : club.status}
                          </span>
                          <div className="mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <div key={club.id} className="mb-10 last:mb-0">
                      {isClickable ? (
                        <Link href={getClubLink(club)}>
                          {clubContent}
                        </Link>
                      ) : (
                        clubContent
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Feedback Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Recent Feedback
                  </h2>
                  <p className="text-sm text-gray-600">Latest member reviews</p>
                </div>
                <Link
                  href="/club-admin/feedback"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline transition-all duration-200"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentFeedback.map((feedback, index) => (
                  <div
                    key={feedback.id}
                    className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                      index % 2 === 0
                        ? "bg-blue-50 border-blue-200"
                        : "bg-purple-50 border-purple-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index % 2 === 0
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                              : "bg-gradient-to-r from-purple-500 to-pink-500"
                          }`}
                        >
                          {feedback.volunteerName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {feedback.volunteerName}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {feedback.club}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 italic">
                      &quot;{feedback.comment}&quot;
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{feedback.date}</p>
                      <div className="text-xs text-gray-400">
                        {feedback.rating}/5.0
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inquiries Section - Matching Admin Dashboard Theme */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black">Need Help?</h2>
                <p className="text-sm text-gray-600">
                  Send an inquiry to get assistance with your club management
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  Support Available
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-1">
                      Send an Inquiry
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get help with club management, technical issues, or
                      general questions
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                        Fast Response
                      </span>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                        24/7 Support
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Club Modal */}
      {showAddClubModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                <Plus className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">
                Add New Club
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to add a new club? You&apos;ll need to
                complete the verification process to get your club approved.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddClubModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <Link href="/club-verify" className="flex-1">
                  <button className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                    Continue
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 lg:p-8 relative animate-fadeIn overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-500 transition-colors text-xl font-bold"
              onClick={() => setShowInquiryModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:space-y-4 bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-orange-100 to-red-100 shadow">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black">Send an Inquiry</h3>
                  <p className="text-xs text-gray-600 mt-1">Our team will get back within 24-48 hours.</p>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  <div className="bg-white px-3 py-1 rounded-full shadow-sm">Fast Response</div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="mb-4 text-center lg:text-left">
                  <h4 className="text-xl font-semibold text-black">Need Assistance?</h4>
                  <p className="text-sm text-gray-500">Describe your issue and we'll route it to the right team.</p>
                </div>

                {inquirySubmitted && inquiryNotice?.type === "success" ? (
                  <div className="mb-4 p-6 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 flex items-start gap-4 shadow-sm">
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow">
                        <CheckCircle className="h-7 w-7 text-green-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-md font-semibold text-green-800">Thanks — your inquiry is submitted</p>
                      <p className="text-sm text-gray-700 mt-1">{inquiryNotice?.message}</p>
                      <p className="text-xs text-gray-500 mt-3">Our team will reply within 24–48 hours. You can close this dialog when ready.</p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => {
                          setShowInquiryModal(false);
                          setInquiryNotice(null);
                          setInquirySubmitted(false);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg shadow-sm hover:bg-green-50 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {inquiryNotice?.type === "success" && (
                      <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 flex items-start gap-4 shadow-sm">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-800">{inquiryNotice.message}</p>
                        </div>
                      </div>
                    )}

                    {inquiryNotice?.type === "error" && (
                      <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-500 bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        {inquiryNotice.message}
                      </div>
                    )}

                    <form
                      className="space-y-4"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setInquiryNotice(null);
                        const res = await fetch("/api/inquiries", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            subject: inquiry.subject,
                            type: inquiry.type,
                            message: inquiry.message,
                            userId: session?.user?.id,
                          }),
                        });
                        if (res.ok) {
                          setInquiryNotice({
                            type: "success",
                            message: "Inquiry submitted — we'll follow up soon.",
                          });
                          setInquiry({ subject: "", type: "general", message: "" });
                          setInquirySubmitted(true);
                        } else {
                          setInquiryNotice({
                            type: "error",
                            message: "Failed to submit inquiry. Please try again.",
                          });
                        }
                      }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white placeholder-gray-400"
                          placeholder="Subject"
                          value={inquiry.subject}
                          onChange={(e) => setInquiry({ ...inquiry, subject: e.target.value })}
                          required
                        />
                        <select
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white text-gray-700"
                          value={inquiry.type}
                          onChange={(e) => setInquiry({ ...inquiry, type: e.target.value })}
                        >
                          <option value="general">General</option>
                          <option value="technicalSupport">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <textarea
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition bg-white resize-none placeholder-gray-400"
                        placeholder="Your message..."
                        value={inquiry.message}
                        onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                        required
                      />

                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setShowInquiryModal(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow"
                        >
                          <span>Submit</span>
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
