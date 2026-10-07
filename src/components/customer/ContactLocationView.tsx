import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ExternalLink, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Compass,
  Sparkles
} from 'lucide-react';

export const ContactLocationView: React.FC = () => {
  const { storeSettings, showToast } = useStore();
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('Daily Morning Produce Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderPhone.trim() || !message.trim()) {
      showToast('Please provide your name, phone, and message', 'warning');
      return;
    }

    setIsSent(true);
    showToast(`Thank you ${senderName}! We will respond to ${senderPhone} shortly.`, 'success');
    setSenderName('');
    setSenderPhone('');
    setSenderEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Visit Us & Direct Farm Connect
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-heading">
          Get in Touch with Raghu Fresh
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          Have queries regarding daily morning vegetable harvest, A2 milk subscriptions, or bulk organic catering orders? Connect directly with our farm store.
        </p>
      </div>

      {/* 3 Core Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Phone & WhatsApp */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Direct Helpline & WhatsApp</h3>
              <p className="text-xs text-stone-500 mt-1">Available 6:00 AM – 9:30 PM for instant dispatch queries.</p>
            </div>
            <div className="pt-1">
              <a 
                href={`tel:${storeSettings.phone}`}
                className="text-lg font-mono font-bold text-stone-900 hover:text-emerald-800 transition-colors block"
              >
                +91 {storeSettings.phone}
              </a>
              <span className="text-xs text-stone-500">Fast telephone support</span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
            <a
              href={`https://wa.me/91${storeSettings.phone}?text=Hello%20Raghu%20Fresh%2C%20I%20would%20like%20to%20inquire%20about%20farm%20produce.`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold text-center transition-colors shadow-xs"
            >
              Chat on WhatsApp
            </a>
            <a
              href={`tel:${storeSettings.phone}`}
              className="py-2 px-3 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold text-center transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>

        {/* Card 2: Email */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Official Email Support</h3>
              <p className="text-xs text-stone-500 mt-1">For feedback, corporate procurement, and vendor partnerships.</p>
            </div>
            <div className="pt-1">
              <a 
                href={`mailto:${storeSettings.email}`}
                className="text-base font-semibold text-stone-900 hover:text-emerald-800 transition-colors break-all block"
              >
                {storeSettings.email}
              </a>
              <span className="text-xs text-stone-500">Monitored by owner Raghunath N</span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <a
              href={`mailto:${storeSettings.email}`}
              className="w-full inline-block py-2 px-3 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold text-center transition-colors"
            >
              Send Direct Email
            </a>
          </div>
        </div>

        {/* Card 3: Location Link */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Store & Dispatch Location</h3>
              <p className="text-xs text-stone-500 mt-1">Convenient pickup depot and fresh vegetable hub.</p>
            </div>
            <div className="pt-1">
              <p className="text-xs text-stone-700 leading-snug">
                {storeSettings.addressText}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
                <Clock className="w-3.5 h-3.5 text-emerald-800" />
                <span>Open daily: {storeSettings.openingHours}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <a
              href={storeSettings.locationUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold text-center transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Map & Direct Directions Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-800" />
              <h2 className="font-bold text-stone-900 text-lg font-heading">
                Store Location Map & Navigation
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified Google Maps listing for Raghu Fresh. Tap below to navigate directly on your GPS device.
            </p>
          </div>

          <a
            href={storeSettings.locationUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>Navigate on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Visual Map Simulator & Directions Box */}
        <div className="p-6 bg-stone-50/50">
          <div className="relative h-64 sm:h-72 rounded-xl bg-stone-200 border border-stone-300 overflow-hidden flex flex-col items-center justify-center text-center p-6 shadow-inner">
            {/* Map styling elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="relative z-10 bg-white/95 backdrop-blur-xs p-5 rounded-xl border border-stone-300 shadow-md max-w-md">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-stone-900 text-base font-heading">RAGHU FRESH STORE</h4>
              <p className="text-xs text-stone-600 mt-1">
                Bengaluru Farm Depot · Fresh Harvest Hub
              </p>
              <p className="font-mono text-xs text-stone-500 mt-1">
                Phone: +91 9035143783
              </p>
              <div className="mt-4">
                <a
                  href={storeSettings.locationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <span>Launch Google Maps GPS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-heading">
              Send us a Message or Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Need custom quantities, weekly milk basket subscriptions, or have feedback? We would love to hear from you.
            </p>
          </div>

          {isSent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h3 className="font-bold text-emerald-900 text-base">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-800">
                Our farm manager Raghunath will connect with you shortly on your provided contact details.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-3 px-4 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Meera Patil"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-lg focus:outline-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="e.g. 9845012345"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-lg focus:outline-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="e.g. meera@example.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-lg focus:outline-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-lg focus:outline-emerald-700 bg-white"
                  >
                    <option value="Daily Morning Produce Inquiry">Daily Morning Produce Inquiry</option>
                    <option value="Desi Cow A2 Milk Subscription">Desi Cow A2 Milk Subscription</option>
                    <option value="Bulk Wedding & Event Greens">Bulk Wedding & Event Greens</option>
                    <option value="Store Location & Visit">Store Location & Visit</option>
                    <option value="Farmer Partnership">Farmer Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Message / Requirements *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you need or ask any questions..."
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-lg focus:outline-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry to Raghu Fresh Team</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
