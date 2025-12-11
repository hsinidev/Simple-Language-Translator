
import React, { useState, useEffect, useRef, useCallback } from 'react';

type ModalType = 'About' | 'Contact' | 'Guide' | 'Privacy' | 'Terms' | 'DMCA' | null;

const Starfield: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let stars: { x: number, y: number, z: number, color: string, size: number }[] = [];
        const numStars = 800;
        let animationFrameId: number;

        const colors = [
            "rgb(255, 255, 255)", // White
            "rgb(200, 200, 255)", // Blue-ish
            "rgb(255, 200, 200)", // Red-ish
            "rgb(255, 255, 200)", // Yellow-ish
            "rgb(167, 139, 250)", // Purple (Tailwind violet-400)
            "rgb(236, 72, 153)",  // Pink (Tailwind pink-500)
            "rgb(99, 102, 241)"   // Indigo
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * canvas.width,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 2 + 0.5
                });
            }
        };

        resizeCanvas();

        const draw = () => {
            if (!ctx) return;
            // Create a trail effect for a "warp speed" or dreamy feel
            ctx.fillStyle = "rgba(5, 5, 10, 0.3)"; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.z -= 0.8; // Speed
                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                    star.z = canvas.width;
                }

                const k = 128 / star.z;
                const px = star.x * k + canvas.width / 2;
                const py = star.y * k + canvas.height / 2;

                if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
                    const size = (1 - star.z / canvas.width) * star.size * 2;
                    
                    ctx.beginPath();
                    ctx.fillStyle = star.color;
                    ctx.arc(px, py, size > 0 ? size : 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Add a subtle glow to some stars
                    if (size > 2) {
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = star.color;
                    } else {
                        ctx.shadowBlur = 0;
                    }
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-black via-[#0a0a1a] to-[#1a1033]" />;
};


const Modal: React.FC<{ title: string, content: React.ReactNode, onClose: () => void }> = ({ title, content, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col transform transition-all scale-100">
            <div className="flex justify-between items-center p-5 border-b border-gray-700 bg-gray-800/50 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl focus:outline-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto text-gray-300 leading-relaxed scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
                {content}
            </div>
            <div className="p-5 border-t border-gray-700 bg-gray-800/50 rounded-b-2xl text-right">
                <button onClick={onClose} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all">Close</button>
            </div>
        </div>
    </div>
);

const ThemeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const openModal = (modal: ModalType) => setActiveModal(modal);
    const closeModal = useCallback(() => setActiveModal(null), []);
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [closeModal]);

    const modalContent: Record<string, React.ReactNode> = {
        'About': (
            <div className="space-y-4">
                <p>Welcome to <strong>Simple Language Translator</strong>, a cutting-edge tool designed to break down language barriers instantly.</p>
                <p>Our platform leverages advanced Neural Machine Translation (NMT) technologies to provide accurate and quick translations for everyday use. Whether you are a student, a traveler, or a business professional, our tool helps you communicate effectively across the globe.</p>
                <p>We are committed to providing a clean, ad-free, and user-friendly experience without compromising on privacy.</p>
            </div>
        ),
        'Contact': (
            <div className="space-y-4">
                <p>We value your feedback and are here to assist with any inquiries.</p>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">Get in Touch</h3>
                    <p><strong>Email:</strong> <a href="mailto:hsini.web@gmail.com" className="text-indigo-400 hover:text-indigo-300">hsini.web@gmail.com</a></p>
                    <p><strong>Website:</strong> <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">doodax.com</a></p>
                </div>
                <p className="text-sm text-gray-400">Our support team typically responds within 24-48 hours.</p>
            </div>
        ),
        'Guide': (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">How to Use</h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li><strong>Select Languages:</strong> Choose your source language (or use 'Auto-Detect') and your target language from the dropdown menus.</li>
                    <li><strong>Enter Text:</strong> Type or paste the text you wish to translate into the left-hand box.</li>
                    <li><strong>Translate:</strong> Click the "Translate" button or use the swap icon to reverse languages.</li>
                    <li><strong>Copy & Use:</strong> Your translation will appear instantly in the right-hand box.</li>
                </ol>
            </div>
        ),
        'Privacy': (
            <div className="space-y-4">
                <p><strong>Your Privacy Matters.</strong> At Simple Language Translator, we prioritize the security of your data.</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>We <strong>do not store</strong> the text you submit for translation.</li>
                    <li>We <strong>do not track</strong> your personal identity.</li>
                    <li>Data is processed transiently by our API providers solely for the purpose of returning your translation.</li>
                    <li>We use cookies only for essential site functionality and analytical purposes to improve user experience.</li>
                </ul>
                <p className="text-xs text-gray-500 mt-4">Last Updated: October 2023</p>
            </div>
        ),
        'Terms': (
            <div className="space-y-4">
                <p>By accessing this website, you agree to be bound by these Terms of Service.</p>
                <p><strong>Use License:</strong> Permission is granted to temporarily use the materials on this website for personal, non-commercial transitory viewing only.</p>
                <p><strong>Disclaimer:</strong> The materials on Simple Language Translator are provided "as is". We make no warranties, expressed or implied, regarding the accuracy or reliability of translations.</p>
                <p><strong>Limitations:</strong> In no event shall we be liable for any damages arising out of the use or inability to use the materials on this website.</p>
            </div>
        ),
        'DMCA': (
            <div className="space-y-4">
                <p>We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on the Service infringes on the copyright or other intellectual property rights of any person or entity.</p>
                <p>If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to <a href="mailto:hsini.web@gmail.com" className="text-indigo-400">hsini.web@gmail.com</a>, with the subject line: "Copyright Infringement".</p>
            </div>
        ),
    };

    return (
        <div className="relative min-h-screen text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
            <Starfield />
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="py-4 px-6 bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
                    <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">T</div>
                             <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Language Translator</h1>
                        </div>
                        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
                            {(['About', 'Contact', 'Guide', 'Privacy', 'Terms', 'DMCA'] as const).map(item => (
                                <li key={item}>
                                    <button 
                                        onClick={() => openModal(item)} 
                                        className="text-gray-300 hover:text-indigo-400 transition-colors hover:underline decoration-indigo-500/50 underline-offset-4"
                                    >
                                        {item === 'Privacy' ? 'Privacy Policy' : item === 'Terms' ? 'Terms of Service' : item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </header>

                <main className="flex-grow flex flex-col items-center w-full">
                   {/* Centralized container with glass effect */}
                   <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                        {children}
                   </div>
                </main>
                
                <footer className="py-8 px-6 text-center bg-black/60 backdrop-blur-md border-t border-white/10 mt-auto">
                    <div className="container mx-auto flex flex-col items-center gap-4">
                        <p className="text-base text-gray-300 font-medium">
                            Powered by <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all">HSINI MOHAMED</a>
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-1.343 3-3s-1.343-3-3-3m0 6c-1.657 0-3-1.343-3-3s1.343-3 3-3m0-6c-1.657 0-3-1.343-3-3s1.343-3 3-3m0 6c1.657 0 3-1.343 3-3s-1.343-3-3-3" /></svg>
                                doodax.com
                            </a>
                            <span className="text-gray-600">|</span>
                            <a href="mailto:hsini.web@gmail.com" className="hover:text-white transition-colors flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                hsini.web@gmail.com
                            </a>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">&copy; {new Date().getFullYear()} Simple Language Translator. All rights reserved.</p>
                    </div>
                </footer>

                {activeModal && (
                    <Modal
                        title={activeModal === 'Privacy' ? 'Privacy Policy' : activeModal === 'Terms' ? 'Terms of Service' : activeModal}
                        content={modalContent[activeModal]}
                        onClose={closeModal}
                    />
                )}
            </div>
        </div>
    );
};

export default ThemeLayout;
