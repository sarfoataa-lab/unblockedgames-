import React, { useState } from 'react';
import { ModalType } from '../types';
import { Gamepad2, X, Send, ShieldCheck, FileText, Mail, Info, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface FooterProps {
  onOpenModal: (type: ModalType) => void;
  activeModal: ModalType;
  onCloseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenModal,
  activeModal,
  onCloseModal
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playPoint();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSubmitted(false);
      onCloseModal();
    }, 2000);
  };

  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-[#070b14] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="font-gaming text-base font-bold text-white tracking-wide">
                Akwasi Unblocked Games
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Lightweight, fast-loading, zero-distraction HTML5 gaming portal. Play anywhere, anytime.
            </p>
          </div>

          {/* Links: About, Contact, Privacy, Terms */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { sound.playClick(); onOpenModal('about'); }}
              className="hover:text-emerald-400 transition-colors"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => { sound.playClick(); onOpenModal('contact'); }}
              className="hover:text-emerald-400 transition-colors"
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => { sound.playClick(); onOpenModal('privacy'); }}
              className="hover:text-emerald-400 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => { sound.playClick(); onOpenModal('terms'); }}
              className="hover:text-emerald-400 transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>

        {/* Copyright & Tagline */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Akwasi Unblocked Games. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" /> for gamers everywhere
          </p>
        </div>
      </div>

      {/* Modal Dialog */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
          onClick={onCloseModal}
        >
          <div
            className="relative w-full max-w-lg bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onCloseModal}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* About Modal */}
            {activeModal === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <Info className="w-6 h-6" />
                  <h3 className="font-gaming text-xl font-bold text-white">About Akwasi Unblocked Games</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong>Akwasi Unblocked Games</strong> was created with a straightforward mission: to provide a clean, fast, and lightweight gaming hub featuring legendary arcade, puzzle, and retro classics directly in your browser.
                </p>
                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white uppercase font-gaming text-xs">Our Core Values:</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">Zero Bloat:</strong> No intrusive scripts, popups, or external trackers.</li>
                    <li><strong className="text-slate-200">Instant Loading:</strong> Optimized HTML5 Canvas games that render with high frame rates.</li>
                    <li><strong className="text-slate-200">Cross-Platform:</strong> Play smoothly on Chromebooks, desktop PCs, laptops, and touch devices.</li>
                    <li><strong className="text-slate-200">Local Privacy:</strong> All high scores and favorites are saved locally on your browser.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Contact Modal */}
            {activeModal === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-cyan-400">
                  <Mail className="w-6 h-6" />
                  <h3 className="font-gaming text-xl font-bold text-white">Contact & Feedback</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Have game suggestions or feedback? Send us a message below!
                </p>

                {contactSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-center text-sm font-semibold font-gaming">
                    ✓ Message received! Thank you for reaching out to Akwasi Unblocked Games.
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Gamer tag or name"
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Message / Suggestion</label>
                      <textarea
                        required
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="What game should we add next or report an issue..."
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-gaming font-bold text-xs rounded-xl shadow-md hover:from-cyan-400 hover:to-blue-500 flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      SEND MESSAGE
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Privacy Modal */}
            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="font-gaming text-xl font-bold text-white">Privacy Policy</h3>
                </div>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>
                    Akwasi Unblocked Games is committed to protecting user privacy. We believe web gaming should be private, fun, and transparent.
                  </p>
                  <h4 className="font-bold text-white text-sm">1. Data Storage</h4>
                  <p>
                    All personal gameplay data — such as high scores, personal favorites, and audio preferences — is stored strictly on your local browser using standard HTML5 <code>localStorage</code>. No personal profile data is uploaded to remote database servers.
                  </p>
                  <h4 className="font-bold text-white text-sm">2. No AI Surveillance & No Trackers</h4>
                  <p>
                    This application does not use artificial intelligence monitoring or third-party behavioral profiling scripts. It runs standalone and lightweight.
                  </p>
                  <h4 className="font-bold text-white text-sm">3. Educational & Kid-Friendly</h4>
                  <p>
                    We do not collect personal identifiers from children or students. Safe for classroom and leisure use.
                  </p>
                </div>
              </div>
            )}

            {/* Terms Modal */}
            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-amber-400">
                  <FileText className="w-6 h-6" />
                  <h3 className="font-gaming text-xl font-bold text-white">Terms of Service</h3>
                </div>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>
                    Welcome to Akwasi Unblocked Games. By accessing or playing games on this website, you agree to the following terms:
                  </p>
                  <h4 className="font-bold text-white text-sm">1. Free Usage</h4>
                  <p>
                    All games are provided free of charge for personal, non-commercial entertainment and educational leisure.
                  </p>
                  <h4 className="font-bold text-white text-sm">2. Intellectual Property</h4>
                  <p>
                    Games featured here are original HTML5 recreations and tribute adaptations designed for open web play. All trademarks and homage titles remain the property of their respective creators.
                  </p>
                  <h4 className="font-bold text-white text-sm">3. Disclaimer</h4>
                  <p>
                    The service is provided &quot;as is&quot; without warranties of any kind. We strive for 100% uptime and unblocked availability.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
