"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  Edit3,
  Download,
  Badge,
  MapPin,
  IdCard,
  Clock,
  CheckCircle,
  X,
  FileText,
  Star,
  Camera,
  Settings,
  Briefcase,
  TrendingUp,
  BookOpen,
  Users,
  Shield,
  Target,
  Activity,
} from "lucide-react";

interface Certificate {
  title: string;
  eventName?: string;
  dateAwarded: string;
  url: string;
}

interface EventHistory {
  title: string;
  date: string;
  status: "completed" | "upcoming" | "cancelled";
  attendanceMarked: boolean;
}

interface ServiceLetter {
  id: string;
  requestedDate: string;
  status: "pending" | "approved" | "rejected";
  downloadUrl?: string;
}

export default function VolunteerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("activity");
  const { data: session } = useSession();
  
  const [user, setUser] = useState({
    name: "Loading...", // This will be fetched from database
    email: "Loading...", // This will be fetched from database
    universityId: "2022IS066",
    mobile: "Loading...", // This will be fetched from database
    role: "Senior Volunteer",
    department: "Computer Science",
    profilePicture: null,
    rewardPoints: 320,
    level: "Silver",
    joinedDate: "2024-01-15",
    totalEvents: 15,
    completedEvents: 12,
    upcomingEvents: 3,
    certificates: [
      { 
        title: "Leadership Workshop Certificate", 
        eventName: "Leadership Development Program 2024",
        dateAwarded: "2024-10-15",
        url: "#",
        issuer: "UCSC Leadership Center"
      },
      { 
        title: "Event Volunteer Certificate", 
        eventName: "TechFest 2024",
        dateAwarded: "2024-10-12",
        url: "#",
        issuer: "Technical Society"
      },
      { 
        title: "Community Service Certificate", 
        eventName: "Community Clean-up Drive",
        dateAwarded: "2024-06-15",
        url: "#",
        issuer: "Environmental Club"
      },
      { 
        title: "Blood Donation Certificate", 
        eventName: "Blood Donation Camp",
        dateAwarded: "2024-06-01",
        url: "#",
        issuer: "Health Services"
      },
    ],
    eventHistory: [
      { title: "TechFest 2024", date: "2024-10-12", status: "completed" as const, attendanceMarked: true },
      { title: "Green Club Meetup", date: "2024-08-05", status: "completed" as const, attendanceMarked: true },
      { title: "Community Clean-up Drive", date: "2024-06-15", status: "completed" as const, attendanceMarked: true },
      { title: "Food Distribution Program", date: "2024-06-01", status: "completed" as const, attendanceMarked: false },
      { title: "Winter Carnival 2025", date: "2025-01-15", status: "upcoming" as const, attendanceMarked: false },
    ],
    serviceLetters: [
      {
        id: "1",
        requestedDate: "2024-11-01",
        status: "approved" as const,
        downloadUrl: "#"
      },
      {
        id: "2", 
        requestedDate: "2024-12-15",
        status: "pending" as const
      }
    ]
  });

  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    universityId: user.universityId,
  });

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (response.ok) {
            const userData = await response.json();
            const fullName = `${userData.firstName} ${userData.lastName}`;
            setUser(prevUser => ({
              ...prevUser,
              name: fullName,
              email: userData.email,
              mobile: userData.phone
            }));
            setEditData(prevEditData => ({
              ...prevEditData,
              name: fullName,
              email: userData.email,
              mobile: userData.phone
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(prevUser => ({
            ...prevUser,
            name: "Error loading name",
            email: "Error loading email",
            mobile: "Error loading mobile"
          }));
        }
      }
    };

    fetchUserData();
  }, [session?.user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      console.error("No user session found");
      return;
    }

    try {
      // Update user data in database
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: editData.name.split(' ')[0] || editData.name,
          lastName: editData.name.split(' ').slice(1).join(' ') || '',
          email: editData.email,
          phone: editData.mobile,
        }),
      });

      if (response.ok) {
        // Update local state with edited values
        setUser(prevUser => ({
          ...prevUser,
          name: editData.name,
          email: editData.email,
          mobile: editData.mobile,
          universityId: editData.universityId,
        }));
        setIsEditing(false);
        
        // Show success message (optional)
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
        // Handle error - maybe show an error message to user
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error - maybe show an error message to user
    }
  };

  const handleCancel = () => {
    // Reset editData to current user values
    setEditData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      universityId: user.universityId,
    });
    setIsEditing(false);
  };

  const tabs = [
    { id: "activity", label: "Activity", icon: <Activity className="w-5 h-5" /> },
    { id: "certificates", label: "Certifications", icon: <Award className="w-5 h-5" /> },
    { id: "events", label: "Event History", icon: <Calendar className="w-5 h-5" /> },
    { id: "documents", label: "Documents", icon: <FileText className="w-5 h-5" /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-gray-100 text-gray-700 border-gray-300";
      case "upcoming": return "bg-gray-50 text-gray-600 border-gray-200";
      case "cancelled": return "bg-gray-100 text-gray-500 border-gray-300";
      case "approved": return "bg-gray-100 text-gray-700 border-gray-300";
      case "pending": return "bg-gray-50 text-gray-600 border-gray-200";
      case "rejected": return "bg-gray-100 text-gray-500 border-gray-300";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Bronze": return { icon: <Shield className="w-4 h-4 text-orange-600" />, text: "Bronze Member" };
      case "Silver": return { icon: <Star className="w-4 h-4 text-orange-600" />, text: "Silver Member" };
      case "Gold": return { icon: <Award className="w-4 h-4 text-orange-600" />, text: "Gold Member" };
      default: return { icon: <Badge className="w-4 h-4 text-orange-600" />, text: "Member" };
    }
  };

  const getPointsNeededForGold = () => {
    const goldThreshold = 500; // Assuming 500 points needed for Gold level
    const pointsNeeded = goldThreshold - user.rewardPoints;
    return pointsNeeded > 0 ? pointsNeeded : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="w-full px-4 py-6">
        {/* Professional Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-100 border-3 border-orange-300 shadow-lg flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <button className="absolute bottom-2 right-2 w-8 h-8 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Level Badge */}
                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full text-sm text-orange-700">
                  {getLevelBadge(user.level).icon}
                  <span className="font-medium">{getLevelBadge(user.level).text}</span>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {user.role}
                    </span>
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {user.department}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(user.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IdCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Student ID</p>
                      <p className="text-sm font-medium text-gray-900">{user.universityId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Mobile</p>
                      <p className="text-sm font-medium text-gray-900">{user.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Reward Points and Quick Stats */}
                <div className="flex flex-wrap items-center gap-6">
                  {/* Reward Points - Only Colored Section */}
                  <div className="inline-flex items-center gap-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Reward Points</p>
                        <p className="text-2xl font-bold">{user.rewardPoints}</p>
                      </div>
                    </div>
                    <div className="h-12 w-px bg-white/20"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Points to Gold</p>
                        <p className="text-lg font-semibold">{getPointsNeededForGold() === 0 ? "Achieved!" : getPointsNeededForGold()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">{user.completedEvents} Completed</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{user.certificates.length} Certificates</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">{user.upcomingEvents} Upcoming</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-2">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {/* Edit Profile Popup Modal */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-orange-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Profile Information</h2>
                  <button
                    onClick={handleCancel}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={editData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">University ID</label>
                    <input
                      type="text"
                      name="universityId"
                      value={editData.universityId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-8">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: "Completed TechFest 2024 event", date: "2 days ago", type: "event" },
                { action: "Received Leadership Certificate", date: "1 week ago", type: "certificate" },
                { action: "Joined Community Clean-up Drive", date: "2 weeks ago", type: "event" },
                { action: "Profile updated", date: "3 weeks ago", type: "profile" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {activity.type === "event" && <Calendar className="w-5 h-5 text-gray-600" />}
                    {activity.type === "certificate" && <Award className="w-5 h-5 text-gray-600" />}
                    {activity.type === "profile" && <User className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Professional Certifications</h2>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {user.certificates.length} Certificates
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {user.certificates.map((certificate, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-gray-600" />
                    </div>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2">{certificate.title}</h3>
                  {certificate.eventName && (
                    <p className="text-sm text-gray-600 mb-2">{certificate.eventName}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Issued by {certificate.issuer}</span>
                    <span>{new Date(certificate.dateAwarded).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event History Tab */}
        {activeTab === "events" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Event Participation History</h2>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {user.eventHistory.length} Events
              </span>
            </div>
            
            <div className="space-y-4">
              {user.eventHistory.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {event.attendanceMarked ? (
                        <div className="flex items-center gap-1 text-gray-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Attended</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <X className="w-4 h-4" />
                          <span className="text-sm">No Record</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Document Requests</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <FileText className="w-4 h-4" />
                Request Document
              </button>
            </div>
            
            <div className="space-y-4">
              {user.serviceLetters.map((letter) => (
                <div key={letter.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Service Letter Request</h3>
                      <p className="text-sm text-gray-600">Requested on {new Date(letter.requestedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(letter.status)}`}>
                      {letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}
                    </span>
                    
                    {letter.status === "approved" && letter.downloadUrl && (
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {user.serviceLetters.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Requests</h3>
                  <p className="text-gray-600 mb-4">You haven't requested any documents yet.</p>
                  <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Request Your First Document
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
