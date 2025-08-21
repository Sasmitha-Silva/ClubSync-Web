import { Calendar, Plus, Users, MapPin, Clock, Edit, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CreateEventModal from "./modals/CreateEventModal";
import Toast from "@/components/Toast";

interface Event {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  description?: string;
  startDateTime: string;
  endDateTime?: string;
  venue?: string;
  maxParticipants?: number;
  registrations?: { id: string }[];
}

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

const getCategoryColor = (category: string) => {
  switch (category) {
    case "workshop":
      return "bg-blue-100 text-blue-800";
    case "seminar":
      return "bg-purple-100 text-purple-800";
    case "competition":
      return "bg-red-100 text-red-800";
    case "social":
      return "bg-green-100 text-green-800";
    case "fundraising":
      return "bg-yellow-100 text-yellow-800";
    case "meeting":
      return "bg-gray-100 text-gray-800";
    case "conference":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getEventStatus = (startDateTime: string, endDateTime?: string) => {
  const now = new Date();
  const start = new Date(startDateTime);
  const end = endDateTime ? new Date(endDateTime) : null;

  if (end && now > end) {
    return "completed";
  } else if (now >= start && (!end || now <= end)) {
    return "active";
  } else {
    return "upcoming";
  }
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

const EventsTab: React.FC = () => {
  const params = useParams();
  const clubId = params.id as string;
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events?clubId=${clubId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (clubId) {
      fetchEvents();
    }
  }, [clubId]);

  const handleCreateEvent = (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
    showToast("Event created successfully!", "success");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Event Management</h3>
            <p className="text-sm text-gray-600">Manage club events and activities</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Event Management</h3>
          <p className="text-sm text-gray-600">Manage club events and activities</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600 mb-4">Create your first event to get started</p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const status = getEventStatus(event.startDateTime, event.endDateTime);
            const { date, time } = formatDateTime(event.startDateTime);
            
            return (
              <div
                key={event.id}
                className="relative overflow-hidden bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full -mr-8 -mt-8 opacity-30" />

                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{event.title}</h4>
                    {event.subtitle && (
                      <p className="text-sm text-gray-600 mb-2">{event.subtitle}</p>
                    )}
                    <div className="flex space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(status)}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getCategoryColor(event.category)}`}
                      >
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    {date} at {time}
                  </div>
                  {event.venue && (
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      {event.venue}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-green-500" />
                    {event.registrations?.length || 0} registered
                    {event.maxParticipants && ` / ${event.maxParticipants} max`}
                  </div>
                </div>

                {event.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-blue-600 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateEvent={handleCreateEvent}
        clubId={clubId}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default EventsTab;
