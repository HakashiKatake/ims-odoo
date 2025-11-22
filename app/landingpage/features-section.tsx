import React from 'react'

export function FeaturesSection() {
    const features = [
        {
            title: "Real-time Stock Tracking",
            description: "Monitor inventory levels across all locations instantly",
            color: "cyan",
            icon: "📊",
        },
        {
            title: "Automated Alerts",
            description: "Get notified when stock levels fall below thresholds",
            color: "cyan",
            icon: "🔔",
        },
        {
            title: "Multi-location Support",
            description: "Manage inventory across multiple warehouses seamlessly",
            color: "blue",
            icon: "🏢",
        },
        {
            title: "Advanced Analytics",
            description: "Comprehensive reports and insights on inventory performance",
            color: "cyan",
            icon: "📈",
        },
        {
            title: "User Management",
            description: "Control access levels and permissions for team members",
            color: "orange",
            icon: "👥",
        },
        {
            title: "Barcode Scanning",
            description: "Quick and accurate item identification and tracking",
            color: "orange",
            icon: "📱",
        },
    ]

    const getColorClasses = (color: string) => {
        const colors: Record<string, { border: string; glow: string; text: string; bg: string }> = {
            cyan: {
                border: "border-cyan-500/30 hover:border-cyan-400/60",
                glow: "group-hover:shadow-cyan-400/50",
                text: "text-cyan-300",
                bg: "from-cyan-900/20 via-blue-900/10",
            },
            blue: {
                border: "border-blue-500/30 hover:border-blue-400/60",
                glow: "group-hover:shadow-blue-400/50",
                text: "text-blue-300",
                bg: "from-blue-900/20 via-cyan-900/10",
            },
            orange: {
                border: "border-orange-500/30 hover:border-orange-400/60",
                glow: "group-hover:shadow-orange-400/50",
                text: "text-orange-300",
                bg: "from-orange-900/20 via-red-900/10",
            },
        }
        return colors[color]
    }

    return (
        <section className="w-full bg-black py-24 px-8 border-t border-white/10">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span className="text-xs font-light tracking-widest text-cyan-300">CORE FEATURES</span>
                </div>
                <h2 className="text-5xl font-black tracking-tighter text-white mb-4 text-balance">
                    Powerful Inventory Management
                </h2>
                <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
                    Everything you need to streamline your inventory operations and make data-driven decisions
                </p>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                    const colors = getColorClasses(feature.color)
                    return (
                        <div
                            key={index}
                            className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer transform hover:scale-110 ${colors.border}`}
                        >
                            {/* Background gradient effect */}
                            <div className={`absolute inset-0 bg-linear-to-br ${colors.bg} to-transparent`} />
                            <div
                                className={`absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,0.1),transparent_50%)]`}
                            />

                            {/* Content */}
                            <div className="relative p-8 z-10 h-full flex flex-col gap-4 transition-all duration-300">
                                {/* Icon */}
                                <div className="text-4xl">{feature.icon}</div>

                                {/* Title */}
                                <h3 className="text-xl font-black tracking-tight text-white">{feature.title}</h3>

                                {/* Description */}
                                <p className="text-sm text-white/60 leading-relaxed grow">{feature.description}</p>

                                {/* Accent line */}
                                <div
                                    className={`w-12 h-1 bg-linear-to-r transition-all duration-300 group-hover:w-full rounded-full ${feature.color === "cyan"
                                            ? "from-cyan-400 to-blue-400 shadow-lg shadow-cyan-400/50"
                                            : feature.color === "blue"
                                                ? "from-blue-400 to-cyan-400 shadow-lg shadow-blue-400/50"
                                                : "from-orange-400 to-red-400 shadow-lg shadow-orange-400/50"
                                        }`}
                                />

                                {/* Glow effect on hover */}
                                <div
                                    className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 shadow-lg ${colors.glow}`}
                                />
                            </div>

                            {/* Accent corners */}
                            <div
                                className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 transition-colors duration-300 ${feature.color === "cyan"
                                        ? "border-cyan-400/30 group-hover:border-cyan-400/60"
                                        : feature.color === "blue"
                                            ? "border-blue-400/30 group-hover:border-blue-400/60"
                                            : "border-orange-400/30 group-hover:border-orange-400/60"
                                    }`}
                            />
                            <div
                                className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 transition-colors duration-300 ${feature.color === "cyan"
                                        ? "border-cyan-400/30 group-hover:border-cyan-400/60"
                                        : feature.color === "blue"
                                            ? "border-blue-400/30 group-hover:border-blue-400/60"
                                            : "border-orange-400/30 group-hover:border-orange-400/60"
                                    }`}
                            />
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
