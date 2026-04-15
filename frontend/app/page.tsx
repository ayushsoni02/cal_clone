'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[var(--cal-brand)] selection:text-white flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--cal-text)] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--cal-text)]">Cal.com</span>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-6 mr-4">
                <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#teams" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">For Teams</a>
                <a href="#developers" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Developers</a>
              </nav>
              
              <Link 
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-md bg-[var(--cal-text)] px-4 py-2 text-sm font-medium text-[var(--cal-bg)] shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Go to app
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="w-full py-20 lg:py-32 xl:py-40 relative overflow-hidden flex flex-col items-center">
          {/* Subtle background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-70 border border-gray-100"></div>

          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8 z-10 max-w-5xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium shadow-sm hover:border-gray-300 transition-colors cursor-pointer">
              <span className="flex h-2 w-2 rounded-full bg-[var(--cal-brand)] mr-2 animate-pulse"></span>
              Scheduling infrastructure for everyone
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--cal-text)] max-w-4xl text-balance">
              Meet the scheduling <br className="hidden sm:inline" />
              <span className="text-gray-400">infrastructure</span> for everyone.
            </h1>
            
            <p className="max-w-[42rem] leading-normal text-[var(--cal-text-muted)] sm:text-xl sm:leading-8">
              Cal.com is the scheduling platform that gives you total control of your time, data, and design. Connect your calendar and start receiving bookings instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <Link 
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[var(--cal-text)] px-8 text-base font-medium text-[var(--cal-bg)] shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950"
              >
                Go to app →
              </Link>
              <a 
                href="#demo"
                className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-base font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950"
              >
                Explore features
              </a>
            </div>
          </div>
        </section>

        {/* Mockup / Interface Teaser Section */}
        <section id="demo" className="w-full py-12 md:py-24 bg-gray-50 border-t border-gray-200">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[var(--cal-text)]">
                Everything you need to manage your time
              </h2>
              <p className="max-w-[900px] text-[var(--cal-text-muted)] md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Connect your calendars, set your availability, and start sharing your booking links. It&apos;s that easy.
              </p>
            </div>

            <div className="mx-auto max-w-5xl items-center grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="flex flex-col justify-center space-y-8">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold text-[var(--cal-text)]">Unlimited Event Types</h3>
                  <p className="text-gray-500">
                    Create as many event types as you need. 15-minute quick chats, 60-minute deep dives, or multi-person team meetings.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold text-[var(--cal-text)]">Date Overrides & Availability</h3>
                  <p className="text-gray-500">
                    Block off holidays, set specific buffers between meetings, and control exactly when people can book you.
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold text-[var(--cal-text)]">Custom Booking Questions</h3>
                  <p className="text-gray-500">
                    Require attendees to answer critical questions before confirming the booking so you're always prepared.
                  </p>
                </div>
              </div>
              
              {/* Fake UI component for aesthetics */}
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 opacity-50 block filter blur-lg group-hover:opacity-100 group-hover:duration-500 transition duration-1000"></div>
                <div className="relative flex h-full flex-col items-start justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-xl space-y-6 overflow-hidden">
                  <div className="w-full flex justify-between items-center border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-500">AJ</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Alex Johnson</div>
                        <div className="text-xs text-gray-400">cal.com/admin</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-3">
                    <div className="w-full h-16 border border-gray-100 rounded-lg p-3 flex justify-between items-center group/card hover:bg-[var(--cal-bg-subtle)] transition cursor-default">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">15 Min Quick Chat</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          15 minutes
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition">
                         <span className="text-gray-400">→</span>
                      </div>
                    </div>
                    
                    <div className="w-full h-16 border border-gray-100 rounded-lg p-3 flex justify-between items-center group/card hover:bg-[var(--cal-bg-subtle)] transition cursor-default">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">Product Review</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          60 minutes
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition">
                         <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 py-6 md:py-8 bg-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
              <path d="M7 12.5L10.5 16L17 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Cal.com Clone. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs text-gray-500 hover:text-gray-900 transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs text-gray-500 hover:text-gray-900 transition-colors" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
