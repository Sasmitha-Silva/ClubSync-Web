"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Users, CheckCircle, ExternalLink, Github, Twitter, Linkedin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);


  console.log("Form data submitted:", formData);
  try {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to send inquiry");

    console.log("Inquiry sent successfully");

    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "", type: "general" });
  } catch (error) {
    console.error("Submission error:", error);
    // You can show an error message here
  } finally {
    setIsSubmitting(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "Send us a message anytime",
      value: "hello@clubsync.com",
      action: "mailto:hello@clubsync.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Mon-Fri from 8am to 5pm",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      description: "Come say hello at our office",
      value: "123 Innovation Ave, Tech City",
      action: "https://maps.google.com",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, url: "https://github.com", label: "GitHub" },
    { icon: <Twitter className="w-5 h-5" />, url: "https://twitter.com", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, url: "https://linkedin.com", label: "LinkedIn" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 text-black overflow-hidden relative">
      {/* Enhanced background with more visual interest */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic gradient overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/50 via-pink-50/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-red-100/40 via-orange-50/30 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-50/20 to-red-50/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "2s" }}></div>
        
        {/* Floating geometric elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-orange-200/60 rounded-3xl rotate-12 animate-bounce" style={{ animationDelay: "0s", animationDuration: "6s" }}></div>
        <div className="absolute top-40 left-10 w-24 h-24 border border-red-200/50 rounded-full animate-pulse" style={{ animationDelay: "1s", animationDuration: "4s" }}></div>
        <div className="absolute bottom-32 right-32 w-20 h-20 border border-orange-300/40 rounded-2xl rotate-45 animate-bounce" style={{ animationDelay: "2s", animationDuration: "5s" }}></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 border-2 border-red-200/50 rounded-xl -rotate-12 animate-pulse" style={{ animationDelay: "3s", animationDuration: "7s" }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-300/60 rounded-full animate-ping" style={{ animationDelay: "0s", animationDuration: "3s" }}></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-red-300/60 rounded-full animate-ping" style={{ animationDelay: "1.5s", animationDuration: "4s" }}></div>
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-orange-400/50 rounded-full animate-ping" style={{ animationDelay: "3s", animationDuration: "2.5s" }}></div>
        <div className="absolute bottom-1/3 right-1/6 w-2.5 h-2.5 bg-red-400/50 rounded-full animate-ping" style={{ animationDelay: "4s", animationDuration: "3.5s" }}></div>
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, orange 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, red 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>
      
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="text-center mb-16 pt-12">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl mx-auto transform hover:scale-105 transition-all duration-300">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-black leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Get In
            </span>{" "}
            Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you and help you make the most of{" "}
            <span className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-300">
              ClubSync
            </span>
            .
          </p>
        </section>

        {/* Contact Methods - Professional Grid Layout */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="group">
                <a
                  href={method.action}
                  className="block bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-orange-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center`}>
                      {method.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors duration-200 flex items-center">
                        {method.value}
                        <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <Send className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-black">Send us a message</h2>
              </div>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We&apos;ll get back to you soon!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white font-medium"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white font-medium"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white font-medium"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white font-medium"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none font-medium"
                      placeholder="Tell us more about how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-4 px-8 rounded-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Response Time
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">General Inquiries</span>
                  <span className="text-black font-bold">24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Technical Support</span>
                  <span className="text-black font-bold">4 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Partnerships</span>
                  <span className="text-black font-bold">2-3 days</span>
                </div>
              </div>
            </div>

            {/* Team Info */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Our Team
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our dedicated team of developers, designers, and community managers are here to help you make the most of ClubSync.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">+2 more</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-black mb-6">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Quick Links */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-10 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Need Quick Answers?</h3>
            <p className="text-orange-100 mb-8 text-lg leading-relaxed">Check out our frequently asked questions or browse our documentation.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-500 font-semibold py-4 px-8 rounded-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                View FAQ
              </button>
              <button className="bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Documentation
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* 
        ALTERNATIVE CREATIVE DESIGNS:
        
        1. CURRENT: Timeline Design with Speech Bubbles
        
        2. Hexagonal Grid Design:
        <section className="mb-16">
          <div className="flex justify-center">
            <div className="relative">
              {contactMethods.map((method, index) => (
                <div key={index} className={`absolute ${
                  index === 0 ? 'top-0 left-1/2 transform -translate-x-1/2' :
                  index === 1 ? 'top-32 left-0' :
                  'top-32 right-0'
                }`}>
                  <a href={method.action} className="group block">
                    <div className="w-48 h-48 bg-white clip-hexagon p-8 hover:scale-110 transition-all duration-300 shadow-xl flex flex-col items-center justify-center text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center text-white mb-4`}>
                        {method.icon}
                      </div>
                      <h3 className="font-bold text-black mb-2">{method.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{method.description}</p>
                      <p className="text-xs font-semibold text-orange-500">{method.value}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        3. Floating Orbit Design:
        <section className="mb-16 h-96 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 border-2 border-dashed border-orange-300 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
              {contactMethods.map((method, index) => {
                const angle = (index * 120) * Math.PI / 180;
                const radius = 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div key={index} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}>
                    <a href={method.action} className="group block">
                      <div className="w-24 h-24 bg-white rounded-full shadow-xl p-4 hover:scale-125 transition-all duration-300 flex flex-col items-center justify-center">
                        <div className={`w-8 h-8 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center text-white mb-1`}>
                          {method.icon}
                        </div>
                        <span className="text-xs font-bold text-black">{method.title}</span>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        4. Morphing Blob Design:
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <a key={index} href={method.action} className="group block">
                <div className="relative overflow-hidden">
                  <div className={`w-full h-48 bg-gradient-to-r ${method.color} rounded-3xl transform group-hover:scale-105 transition-all duration-500 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-90 transition-opacity duration-500 rounded-3xl"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white mb-4 mx-auto group-hover:text-black transition-colors duration-500">
                        {method.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-black transition-colors duration-500 mb-2">{method.title}</h3>
                      <p className="text-white text-opacity-90 group-hover:text-gray-600 transition-colors duration-500 text-sm mb-2">{method.description}</p>
                      <p className="text-white font-semibold group-hover:text-orange-500 transition-colors duration-500">{method.value}</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
        
        5. Interactive Connection Web:
        <section className="mb-16 relative h-80">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 320">
            <defs>
              <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            <path d="M200 160 L400 80 L600 160 L400 240 Z" fill="url(#connectionGrad)" className="animate-pulse" />
            <line x1="200" y1="160" x2="400" y2="80" stroke="#f97316" strokeWidth="2" className="opacity-50" />
            <line x1="400" y1="80" x2="600" y2="160" stroke="#ef4444" strokeWidth="2" className="opacity-50" />
            <line x1="600" y1="160" x2="400" y2="240" stroke="#f97316" strokeWidth="2" className="opacity-50" />
            <line x1="400" y1="240" x2="200" y2="160" stroke="#ef4444" strokeWidth="2" className="opacity-50" />
          </svg>
          {contactMethods.map((method, index) => {
            const positions = [
              { x: '25%', y: '50%' },   // Left
              { x: '50%', y: '25%' },   // Top
              { x: '75%', y: '50%' }    // Right
            ];
            return (
              <div key={index} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: positions[index].x, top: positions[index].y }}>
                <a href={method.action} className="group block">
                  <div className="w-32 h-32 bg-white rounded-full shadow-2xl p-6 hover:scale-110 transition-all duration-300 flex flex-col items-center justify-center border-4 border-transparent hover:border-orange-200">
                    <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center text-white mb-2`}>
                      {method.icon}
                    </div>
                    <h4 className="text-sm font-bold text-black text-center">{method.title}</h4>
                    <p className="text-xs text-gray-600 text-center mt-1">{method.value}</p>
                  </div>
                </a>
              </div>
            );
          })}
        </section>
        */