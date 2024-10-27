import React, { useState } from 'react';
import { Search, Flag, Clock, Lightbulb, Wifi, AlertTriangle, Settings, DollarSign, ChevronDown, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const Help = () => {
  const faqs = [
    {
      category: "Getting Started",
      icon: Flag,
      questions: [
        {
          q: "What is Race RGB?",
          a: "Race RGB syncs your LIFX smart lights with live F1 race broadcasts. When flag conditions change during a race (green, yellow, red flags, safety car, etc.), your lights automatically change color to match, creating an immersive racing experience at home."
        },
        {
          q: "How do I get started?",
          a: "1. Sign up for a free trial\n2. Go to Settings and connect your LIFX account\n3. Select which lights you want to control\n4. Set your broadcast delay\n5. When a session starts, click 'Connect' in Race Control"
        },
        {
          q: "What do I need to use Race RGB?",
          a: "You need:\n1. LIFX smart lights (any model)\n2. A stable internet connection\n3. Access to F1 broadcasts (TV or streaming)\n\nNo additional hardware or hubs required!"
        }
      ]
    },
    {
      category: "LIFX Connection",
      icon: Lightbulb,
      questions: [
        {
          q: "How do I connect my LIFX lights?",
          a: "1. Go to cloud.lifx.com and sign in\n2. Click 'Settings' then 'Personal Access Tokens'\n3. Generate a new token\n4. IMPORTANT: Save your token in a secure text file - you cannot view it again after creation\n5. Copy the token\n6. In Race RGB Settings, paste your token\n7. Select which lights to control"
        },
        {
          q: "Why did my lights disconnect?",
          a: "Common reasons:\n1. Invalid or expired LIFX token\n2. Lights lost WiFi connection\n3. LIFX cloud service issues\n\nTry:\n1. Checking your lights in the LIFX app\n2. Generating a new token (make sure to save it)\n3. Reconnecting in Settings"
        },
        {
          q: "My lights aren't responding",
          a: "Check that:\n1. Your lights are connected to WiFi\n2. They appear in the LIFX app\n3. Your LIFX token is valid\n4. You've selected lights to control\n5. The lights are powered on\n\nIf you need to generate a new token, remember to save it in a text file before leaving the LIFX website."
        }
      ]
    },
    {
      category: "Broadcast Delays",
      icon: Clock,
      questions: [
        {
          q: "Why do I need to set a broadcast delay?",
          a: "TV and streaming services have different delays. Setting the correct delay ensures your lights change at the exact moment you see flag changes on your screen, not before or after."
        },
        {
          q: "How do I find my exact delay?",
          a: "Use our Delay Calibrator:\n1. Wait for a session to start\n2. Click 'Calculate My Exact Delay'\n3. Click 'Start Calibration'\n4. When you see the session start on your screen, click 'Mark Broadcast Time'\n5. The tool will calculate your exact delay"
        },
        {
          q: "What delay should I use?",
          a: "Typical delays are:\n- Cable/Satellite TV: 5-10 seconds\n- Streaming Services: 20-30 seconds\n- F1TV: 30-40 seconds\n\nFor best results:\n1. Use the Delay Calibrator\n2. Fine-tune if needed\n3. Note that delays can vary between sessions"
        }
      ]
    },
    {
      category: "Live Sessions",
      icon: Wifi,
      questions: [
        {
          q: "When can I connect to a session?",
          a: "You can connect 5 minutes before any official F1 session starts:\n- Practice Sessions\n- Qualifying\n- Sprint Events\n- Race\n\nThe connect button will appear automatically when a session is available."
        },
        {
          q: "How does Auto Mode work?",
          a: "When Auto Mode is on:\n1. Race RGB monitors official F1 flag status\n2. Applies your broadcast delay\n3. Changes light colors automatically\n\nWhen off:\n- You can manually control flag colors\n- Useful for testing or custom setups"
        },
        {
          q: "What flag colors are supported?",
          a: "We support all official F1 flags:\n- Green: Track is clear\n- Yellow: Hazard ahead\n- Red: Session stopped\n- Safety Car: Including VSC\n- Checkered: Session complete\n\nColors are optimized for LIFX bulbs."
        }
      ]
    },
    {
      category: "Troubleshooting",
      icon: AlertTriangle,
      questions: [
        {
          q: "Flags change before I see them on TV",
          a: "Your broadcast delay is too low:\n1. Use the Delay Calibrator\n2. Add a few seconds to the calculated delay\n3. Fine-tune until synchronized"
        },
        {
          q: "Flags change after I see them on TV",
          a: "Your broadcast delay is too high:\n1. Use the Delay Calibrator\n2. Reduce the delay by a few seconds\n3. Fine-tune until synchronized"
        },
        {
          q: "Auto Mode isn't working",
          a: "Check that:\n1. The session is live\n2. You're connected to the session\n3. Your lights are connected\n4. You've selected lights to control\n5. Auto Mode is toggled on"
        }
      ]
    },
    {
      category: "Account & Pricing",
      icon: DollarSign,
      questions: [
        {
          q: "What's included in the trial?",
          a: "The free trial includes:\n1. Full access for one race weekend\n2. All features unlocked\n3. No credit card required\n\nPerfect for testing with your setup!"
        },
        {
          q: "How much is lifetime access?",
          a: "Lifetime access is a one-time payment of $7 USD. This includes:\n1. Unlimited race weekends\n2. All current features\n3. Future updates and improvements\n4. Priority support"
        },
        {
          q: "How do I upgrade my account?",
          a: "To upgrade:\n1. Click 'Upgrade' in the dashboard\n2. Complete payment via PayPal ($7 USD)\n3. Your account upgrades instantly\n4. No subscription or recurring fees"
        }
      ]
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Getting Started");

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-[#0B0F1A] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Help Center</h1>
          <p className="text-gray-400">
            Find answers to common questions and learn how to get the most out of Race RGB
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151A2D] border border-[#1E2642] rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-race-blue-500"
          />
        </div>

        {/* Quick Links */}
        {!searchTerm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              to="/settings"
              className="flex items-center space-x-3 p-4 bg-[#151A2D] border border-[#1E2642] rounded-lg hover:bg-[#1A1F35] transition-colors"
            >
              <Settings className="w-5 h-5 text-race-blue-500" />
              <div className="text-left">
                <div className="text-white font-medium">LIFX Setup</div>
                <div className="text-sm text-gray-400">Connect your lights</div>
              </div>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 p-4 bg-[#151A2D] border border-[#1E2642] rounded-lg hover:bg-[#1A1F35] transition-colors"
            >
              <Clock className="w-5 h-5 text-race-blue-500" />
              <div className="text-left">
                <div className="text-white font-medium">Delay Setup</div>
                <div className="text-sm text-gray-400">Calibrate your broadcast</div>
              </div>
            </Link>
            <Link
              to="mailto:support@racergb.com"
              className="flex items-center space-x-3 p-4 bg-[#151A2D] border border-[#1E2642] rounded-lg hover:bg-[#1A1F35] transition-colors"
            >
              <AlertTriangle className="w-5 h-5 text-race-blue-500" />
              <div className="text-left">
                <div className="text-white font-medium">Contact Support</div>
                <div className="text-sm text-gray-400">Get help via email</div>
              </div>
            </Link>
          </div>
        )}

        {/* FAQs */}
        <div className="space-y-6">
          {filteredFaqs.map((category) => (
            <div key={category.category} className="bg-[#151A2D] rounded-xl border border-[#1E2642] overflow-hidden">
              <button
                onClick={() => setExpandedCategory(
                  expandedCategory === category.category ? null : category.category
                )}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center space-x-3">
                  <category.icon className="w-5 h-5 text-race-blue-500" />
                  <h2 className="text-lg font-semibold text-white">
                    {category.category}
                  </h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedCategory === category.category ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedCategory === category.category && (
                <div className="border-t border-[#1E2642]">
                  {category.questions.map((item, index) => (
                    <div
                      key={index}
                      className={`p-6 ${
                        index !== category.questions.length - 1 ? 'border-b border-[#1E2642]' : ''
                      }`}
                    >
                      <h3 className="text-white font-medium mb-2">{item.q}</h3>
                      <p className="text-gray-400 whitespace-pre-line">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Can't find what you're looking for?{' '}
            <a
              href="mailto:support@racergb.com"
              className="text-race-blue-500 hover:text-race-blue-400 transition-colors"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;