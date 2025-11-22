import React from 'react'

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
            {/* Main Footer Content */}
            <div className="px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-cyan-300 rounded-full" />
                            </div>
                            <span className="text-lg font-bold tracking-wider">INVENTORY</span>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Advanced inventory management system designed for modern businesses with real-time tracking and analytics.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold tracking-widest text-white">PRODUCT</h3>
                        <ul className="space-y-2">
                            {["Features", "Pricing", "Security", "Roadmap"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-white/50 hover:text-cyan-400 text-sm transition-colors duration-300">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold tracking-widest text-white">COMPANY</h3>
                        <ul className="space-y-2">
                            {["About", "Blog", "Careers", "Contact"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-white/50 hover:text-orange-400 text-sm transition-colors duration-300">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold tracking-widest text-white">LEGAL</h3>
                        <ul className="space-y-2">
                            {["Privacy", "Terms", "Cookies", "Support"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-white/50 hover:text-white text-sm transition-colors duration-300">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 px-8 py-6 flex items-center justify-between">
                <span className="text-xs text-white/40">© 2025 Inventory Management System. All rights reserved.</span>
                <div className="flex items-center gap-4">
                    {[
                        { name: "Twitter", symbol: "𝕏" },
                        { name: "LinkedIn", symbol: "in" },
                        { name: "GitHub", symbol: "⚙️" },
                    ].map((social) => (
                        <a
                            key={social.name}
                            href="#"
                            className="text-white/40 hover:text-cyan-400 transition-colors duration-300 text-sm font-light"
                            title={social.name}
                        >
                            {social.symbol}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
