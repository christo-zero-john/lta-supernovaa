"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./LtaSuit.css";
import VideoModal from "@/app/dashboard/_components/VideoModal/VideoModal";

interface LtaSuitItem {
  id: number;
  title: string;
  accessDescription: string;
  image: string;
  buttonText: string;
  locked?: boolean;
  videoUrl?: string;
  href?: string;
}

const LTA_SUIT_ARRAY: LtaSuitItem[] = [
  {
    id: 1,
    title: "Course Shortlisting",
    accessDescription: "Free For All",
    image: "/assets/images/suit-shortlisting.png",
    buttonText: "Try Now",
    locked: false,
    href: "/dashboard",
  },
  // {
  //   id: 2,
  //   title: "LTA Connect",
  //   accessDescription: "Free For All",
  //   image: "/assets/images/suit-connect.png",
  //   buttonText: "Try Now",
  //   locked: false,
  //   href: "https://connect.letterstoabroad.com/home",
  // },
  {
    id: 3,
    title: "LTA Zenna",
    accessDescription: "LTA Members Only",
    image: "/assets/images/suit-zenna.png",
    buttonText: "Watch Video",
    locked: true,
    videoUrl: "https://lta-dev-kj2hs6dasja.s3.ap-south-1.amazonaws.com/LTA+WEB.mp4",
  },
];

const LtaSuit: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleButtonClick = (item: LtaSuitItem) => {
    if (item.videoUrl) {
      setActiveVideo(item.videoUrl);
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
      <>
        <div className="lta-suit--wrapper">
          <p className="lta-suit--heading">Explore LTA Suit</p>
          <div className="lta-suit--container">
            {LTA_SUIT_ARRAY.map((item) => (
                <div key={item.id} className="lta-suit--card">
                  <div className="lta-suit--header">
                    <p className="lta-suit--title">{item.title}</p>
                  </div>

                  <div className="lta-suit--image-container">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        priority
                        className="lta-suit--image"
                    />
                    <div className="lta-suit--access-tag">
                      {item.locked && (
                          <Image
                              src="/assets/icons/locked.png"
                              alt="Locked"
                              width={12}
                              height={12}
                              className="lta-suit--lock-icon"
                          />
                      )}
                      <span className="lta-suit--access-text">
                    {item.accessDescription}
                  </span>
                    </div>

                    <div className="lta-suit--cta-wrapper">
                      <button
                          className="lta-suit--cta-button"
                          onClick={() => handleButtonClick(item)}
                      >
                        <span className="lta-suit--cta-text">{item.buttonText}</span>
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        <VideoModal
            videoUrl={activeVideo || ""}
            isOpen={!!activeVideo}
            onClose={() => setActiveVideo(null)}
        />
      </>
  );
};

export default LtaSuit;
