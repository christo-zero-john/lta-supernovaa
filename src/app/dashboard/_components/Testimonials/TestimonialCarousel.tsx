"use client";

import SmoothScrollArea from "@/components/SmoothScroll/SmoothScrollArea";
import "./TestimonialCarousel.css";

export interface TestimonialCard {
    name: string;
    degree: string;
    university: string;
    quote: string;
    backgroundImage: string;
    profileImage: string;
    universityLogo?: string;
}

const CARDS: TestimonialCard[] = [
    {
        name: "Stephin Joseph",
        degree: "M.Sc. Logistics and Production (ISE)",
        university: "Universität Duisburg Essen",
        quote: "I'm grateful for Letters To Abroad support in securing my top university admission. It wouldn't have been possible without them.",
        backgroundImage: "https://framerusercontent.com/images/NYJ4mEc18nGJQcy1zX3I3nmhe6I.png",
        profileImage: "https://framerusercontent.com/images/NjjsmK5VSBaoZL9wWqIRxXBDac.png",
    },
    {
        name: "Gladia Thomas",
        degree: "M.Sc. Organismic & Molecular Biodiversity",
        university: "Technical University Dresden",
        quote: "Super impressed with LTA Student's Community work!! With IELTS 6 band & only 120ECTS I never thought I would land 4 offer letters!!",
        backgroundImage: "https://framerusercontent.com/images/TkJMkhM7nrRE17v2YDWNFUGowqw.png",
        profileImage: "https://framerusercontent.com/images/FPgapM9IeezmjmCKPBUM1eroAE.png",
    },
    {
        name: "Devika",
        degree: "M.Sc. Civil Engineering",
        university: "Technische Universität München (TUM)",
        quote: "All my doubts where cleared very patiently. All my applications were completed on time. Thank you so much for your support.",
        backgroundImage: "https://framerusercontent.com/images/tHKzgIzd80LgQY06WMxNFaPaM.png",
        profileImage: "https://framerusercontent.com/images/YdSCoPvHMQ3ZS5cK3qtZFLweg1Y.png",
    },
    {
        name: "Wazeem VK",
        degree: "M.Sc. Biomass Technology",
        university: "Technische Universität München (TUM)",
        quote: "The team at Letters To Abroad provided exceptional support that played a crucial role in my university admission. Their help made all the difference.",
        backgroundImage: "https://framerusercontent.com/images/tHKzgIzd80LgQY06WMxNFaPaM.png",
        profileImage: "https://framerusercontent.com/images/uXT6zhtCwMd64ZJtuBYCH6VwTGg.png",
    },
    {
        name: "Fathima Sulaiman",
        degree: "M.Sc. Technology of Biogenic Resources",
        university: "Technische Universität München (TUM)",
        quote: "Every concern I had was handled with patience, and my applications were completed promptly. Your support has been amazing!",
        backgroundImage: "https://framerusercontent.com/images/tHKzgIzd80LgQY06WMxNFaPaM.png",
        profileImage: "https://framerusercontent.com/images/VSuy3qrPiyLLSSXAPLGbXd3adM.png",
    },
    {
        name: "Rizvan PM",
        degree: "M.Sc. Physics",
        university: "Universität Paderborn",
        quote: "I am incredibly grateful to Letters To Abroad for their unwavering support. Their guidance was essential in helping me gain admission to a top university.",
        backgroundImage: "https://framerusercontent.com/images/luMuQuxQB3vkDZB4kmhHGqXBE.png",
        profileImage: "https://framerusercontent.com/images/WB8CY2EucwAwkQ5vd1oo5rkRE.png",
    },
    {
        name: "Munshid",
        degree: "M.Sc. Technical Logistics",
        university: "Universität Duisburg Essen",
        quote: "LTA - Letters to Abroad ensured my applications were completed promptly and accurately, making my journey to study abroad seamless. Thank you for your support!",
        backgroundImage: "https://framerusercontent.com/images/NYJ4mEc18nGJQcy1zX3I3nmhe6I.png",
        profileImage: "https://framerusercontent.com/images/eLmahPgYoeP0zpX7Wh7aLPAHslE.png",
    },
    {
        name: "Haritha Unni",
        degree: "M.Sc. Polymer Science",
        university: "Freie Universität Berlin",
        quote: "Grateful to LTA for their incredible support, making the application process smooth and always being there to answer my questions. A fantastic experience!",
        backgroundImage: "https://framerusercontent.com/images/bSd2PboUa6majMa3wwLAGRx1gng.png",
        profileImage: "https://framerusercontent.com/images/ZaBbvfRNro1x3TL40u84ra0iWM.png",
    },
    {
        name: "Shawn M Mathew",
        degree: "M.Sc. Intelligent Manufacturing",
        university: "Technische Universität Clausthal",
        quote: "Securing admission to a prestigious university seemed daunting, but Letters To Abroad made it possible. I'm extremely grateful for their unwavering support.",
        backgroundImage: "https://framerusercontent.com/images/oq0yxdjNVyIit8wTakW3pv6mA.png",
        profileImage: "https://framerusercontent.com/images/z2rFoO6uCWu4ggqA27u9OZxc.png",
    },
    {
        name: "Adv. Shwetha Sajeev",
        degree: "MA European & East Asian Governance",
        university: "Universitat Trier",
        quote: "I immensely appreciate LTA for their support during my application process. Their personalized approach addressed all my concerns promptly, helping me achieve my goals.",
        backgroundImage: "https://framerusercontent.com/images/6OB8FxvPKsW9Y35gBRdekTOOmI.png",
        profileImage: "https://framerusercontent.com/images/wYeXKtZMWHkxzK8Wlj3cZTF5Uj8.png",
    },
    {
        name: "Megha Meenu Unni",
        degree: "M.Sc. Civil Engineering",
        university: "Technische Universität München (TUM)",
        quote: "Grateful to LTA for their exceptional support in ensuring my applications were submitted on time. Thank you for your help throughout my journey!",
        backgroundImage: "https://framerusercontent.com/images/tHKzgIzd80LgQY06WMxNFaPaM.png",
        profileImage: "https://framerusercontent.com/images/xe6rYpryh3pKTSSegMwbZCPpU.png",
    },
];

const TestimonialCard: React.FC<{ card: TestimonialCard }> = ({ card }) => (
    <div className="tc--card">
        {/* Background image with mask */}
        <div className="tc--bg-mask">
            <img src={card.backgroundImage} alt="" className="tc--bg-image" />
        </div>

        {/* Gradient overlay */}
        <div className="tc--gradient-overlay" />

        {/* Radial bottom glow */}
        <div className="tc--bottom-glow" />

        {/* Border overlay */}
        <div className="tc--border-overlay" />

        {/*/!* Profile image *!/*/}
        {/*<div className="tc--profile-wrapper">*/}
        {/*    <img src={card.profileImage} alt={card.name} className="tc--profile-image" />*/}
        {/*</div>*/}

        {/* Content */}
        <div className="tc--content">
            <div className="tc--top">
                <p className="tc--name">{card.name}</p>
                <p className="tc--degree">{card.degree}</p>
            </div>

            <div className="tc--university-badge">
                <span className="tc--university-name">{card.university}</span>
            </div>

            <p className="tc--quote">&#34;{card.quote}&#34;</p>
        </div>
    </div>
);

const TestimonialCarousel: React.FC = () => {
    return (
        <div className="tc--root">
            <SmoothScrollArea className="tc--viewport" orientation="horizontal">
                <div className="tc--track">
                    {CARDS.map((card, i) => (
                        <div key={i} className="tc--card-wrapper">
                            <TestimonialCard card={card} />
                        </div>
                    ))}
                </div>
            </SmoothScrollArea>
        </div>
    );
};

export default TestimonialCarousel;
