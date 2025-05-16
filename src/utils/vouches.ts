import { Vouch } from "@/types/vouches";

// Default avatar (using Minecraft-style avatar)
const DEFAULT_AVATAR = "/images/diamond-cape.svg";

// Mock vouch data for demonstration
export const mockVouches: Vouch[] = [
    {
        id: "1",
        author: "Steve123",
        authorAvatar: DEFAULT_AVATAR,
        rating: 5,
        message: "Absolutely love the diamond cape I purchased! The particle effects are amazing and everyone on my server asks where I got it from.",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345678",
        date: "2023-11-10"
    },
    {
        id: "2",
        author: "MinecraftExplorer",
        authorAvatar: DEFAULT_AVATAR,
        rating: 4,
        message: "The emerald armor is top quality and looks fantastic in-game. Highly recommend for anyone looking to stand out.",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345679",
        date: "2023-12-05"
    },
    {
        id: "3",
        author: "DragonSlayer",
        authorAvatar: DEFAULT_AVATAR,
        rating: 5,
        message: "Dragon wings collection is a game changer! The animations are so smooth and the flame effects look incredible during flight.",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345680",
        date: "2024-01-15"
    },
    {
        id: "4",
        author: "EnderQueen",
        authorAvatar: DEFAULT_AVATAR,
        rating: 5,
        message: "I've bought cosmetics from multiple stores, but MCCapes has the best quality by far. Customer service is also excellent!",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345681",
        date: "2024-01-28"
    },
    {
        id: "5",
        author: "RedstoneWizard",
        authorAvatar: DEFAULT_AVATAR,
        rating: 4,
        message: "The cape works perfectly with my skin. The colors are vibrant and the animations are smooth with no lag.",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345682",
        date: "2024-02-10"
    },
    {
        id: "6",
        author: "PixelCrafter",
        authorAvatar: DEFAULT_AVATAR,
        rating: 5,
        message: "Fast delivery and the product was exactly as described. Will definitely be purchasing more items in the future!",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345683",
        date: "2024-02-22"
    },
    {
        id: "7",
        author: "SkyWalker",
        authorAvatar: DEFAULT_AVATAR,
        rating: 4,
        message: "The wings make exploring so much more fun. Great design and they match perfectly with my existing skin.",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345684",
        date: "2024-03-05"
    },
    {
        id: "8",
        author: "CraftMaster",
        authorAvatar: DEFAULT_AVATAR,
        rating: 5,
        message: "Exceptional quality and detail. Definitely worth every penny - these cosmetics are in a league of their own.",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345685",
        date: "2024-03-18"
    },
    {
        id: "9",
        author: "DiamondMiner",
        authorAvatar: DEFAULT_AVATAR,
        rating: 3,
        message: "Good product but took a while to arrive. The cape looks great though, so that makes up for the wait.",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345686",
        date: "2024-04-02"
    },
    {
        id: "10",
        author: "NetherExplorer",
        authorAvatar: DEFAULT_AVATAR,
        rating: 5,
        message: "The special effects are incredible. Everyone on my server is jealous of my new look. 10/10 would recommend!",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345687",
        date: "2024-04-15"
    },
    {
        id: "11",
        author: "BuilderPro",
        authorAvatar: DEFAULT_AVATAR,
        rating: 4,
        message: "These cosmetics have completely transformed my Minecraft experience. The attention to detail is impressive.",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345688",
        date: "2024-04-28"
    },
    {
        id: "12",
        author: "EndermanTamer",
        authorAvatar: DEFAULT_AVATAR,
        rating: 5,
        message: "Best purchase I've made for Minecraft. The animations are buttery smooth and the design is absolutely premium.",
        discordLink: "https://discord.com/channels/123456789012345678/123456789012345678/123456789012345689",
        date: "2024-05-10"
    }
];

// Function to get vouches (in a real app, this would fetch from an API)
export const getVouches = (): Promise<Vouch[]> => {
    return Promise.resolve(mockVouches);
}; 