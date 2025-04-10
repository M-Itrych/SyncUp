import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Video, FileText, Users, Link, UserCircle, ShieldCheck, Paintbrush, Bell, Server, Check } from "lucide-react"

const featurelist = [
    {
        feature: "Server Management",
        content: "Create and customize servers for different communities or teams. Organize channels by topics, manage settings, and monitor server analytics.",
        icon: Server,
        wip: false,
        highlights: ["Multiple server support", "Channel organization", "Server insights"]
    },
    {
        feature: "Real-Time Messaging",
        content: "Instant message delivery with typing indicators, rich text formatting, message editing, and reactions. Support for thread-based conversations.",
        icon: MessageSquare,
        wip: false,
        highlights: ["Typing indicators", "Message editing", "Thread support"]
    },
    {
        feature: "User Profiles",
        content: "Customizable avatars, display names, status indicators, and personalized bio sections. Track activity and showcase profile badges.",
        icon: UserCircle,
        wip: false,
        highlights: ["Custom avatars", "Status indicators", "Profile badges"]
    },
    {
        feature: "Role-Based Permissions",
        content: "Create custom roles with specific privileges. Granular permission controls for channels and features for effective community management.",
        icon: ShieldCheck,
        wip: false,
        highlights: ["Custom roles", "Channel permissions", "Admin tools"]
    },
    {
        feature: "Invite System",
        content: "Generate unique invite links for servers with expiration times and usage limits. Track invite usage and manage server discovery features.",
        icon: Link,
        wip: false,
        highlights: ["Custom invite links", "Expiration settings", "Usage tracking"]
    },
    {
        feature: "Direct Messaging",
        content: "Private conversations between users and group DMs for small team collaboration with media sharing and message search capabilities.",
        icon: Users,
        wip: true,
        highlights: ["Private chats", "Group messaging", "Message search"]
    },
    {
        feature: "Voice & Video Calls",
        content: "High-quality voice channels with screen sharing, background noise suppression, and adjustable audio settings for seamless communication.",
        icon: Video,
        wip: true,
        highlights: ["Screen sharing", "Noise suppression", "Audio settings"]
    },
    {
        feature: "File Sharing & Media",
        content: "Drag and drop file uploads with image previews, document viewing, and integrated media playback for enhanced collaboration.",
        icon: FileText,
        wip: true,
        highlights: ["Drag & drop uploads", "Image previews", "Document viewing"]
    },
    {
        feature: "Custom Themes",
        content: "Light and dark mode support with custom color schemes, font options, and layout adjustments for personalized user experience.",
        icon: Paintbrush,
        wip: true,
        highlights: ["Light & dark modes", "Custom colors", "Layout options"]
    },
    {
        feature: "Notification System",
        content: "Customizable notification settings with mention alerts, mobile push notifications, and Do Not Disturb scheduling for focused work.",
        icon: Bell,
        wip: true,
        highlights: ["Mention alerts", "Mobile notifications", "DND scheduling"]
    }
]

export const MainFeatures = () => {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <Carousel 
                className="w-full"
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {featurelist.map((item, i) => (
                        <CarouselItem 
                            key={i} 
                            className="sm:basis-full md:basis-1/2 lg:basis-1/3 pl-4 md:pl-6"
                        >
                            <div className="group relative p-1 md:rounded-2xl transition-all duration-200 ease-out h-full">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2d4de0] via-[#9f71f0] via-[58%] via-[#fc6277] to-[#f8ef6f] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out -z-10"></div>
                                <Card className="bg-[#1a1d29] text-white h-full relative overflow-hidden">
                                    {item.wip && (
                                        <div className="absolute top-0 right-0">
                                            <div className="bg-yellow-500 text-[10px] sm:text-xs font-bold px-1 sm:px-2 py-1 text-black transform rotate-0 translate-x-0 translate-y-0 shadow-md">
                                                WORK IN PROGRESS
                                            </div>
                                        </div>
                                    )}
                                    <CardContent className="flex flex-col h-full justify-start p-3 sm:p-4 md:p-6">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                                            <div className="rounded-lg p-1.5 sm:p-2 bg-gradient-to-r from-indigo-500 to-purple-500">
                                                <item.icon size={16} className="text-white sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                            </div>
                                            <span className="text-base sm:text-lg md:text-xl font-bold line-clamp-1">{item.feature}</span>
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4">{item.content}</p>
                                        
                                        <div className="mt-auto">
                                            <div className="border-t border-gray-700 pt-2 sm:pt-3 mt-2">
                                                <p className="text-[10px] sm:text-xs text-gray-400 uppercase font-semibold mb-1 sm:mb-2">Key Features</p>
                                                <ul className="space-y-1">
                                                    {item.highlights.map((highlight, idx) => (
                                                        <li key={idx} className="flex items-center gap-1.5 sm:gap-2">
                                                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                                                                <Check size={10} className="text-white sm:w-3 sm:h-3" />
                                                            </div>
                                                            <span className="text-xs sm:text-sm text-gray-200 line-clamp-1">{highlight}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-2 mt-6">
                    <CarouselPrevious variant="outline" className="relative static h-8 w-8 sm:h-10 sm:w-10 bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-white rounded-full" />
                    <CarouselNext variant="outline" className="relative static h-8 w-8 sm:h-10 sm:w-10 bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-white rounded-full" />
                </div>
            </Carousel>
        </div>
    );
};