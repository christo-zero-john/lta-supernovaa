"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SmoothScrollArea from "@/components/SmoothScroll/SmoothScrollArea";
import "./CourseShortlist.css";
import { handleGetShortlistedCourses } from "@/actions/course.actions";
import { ShortlistedCourse } from "@/lib/services/course.service";

const CARD_BG_COLORS: string[] = [
  "rgba(0, 77, 144, 0.2)",
  "rgba(0, 43, 144, 0.2)",
  "rgba(103, 26, 26, 0.2)",
];

interface CourseShortlistProps {
  prefetchedData?: ShortlistedCourse[];
}

const CourseShortlist: React.FC<CourseShortlistProps> = ({ prefetchedData }) => {
  const [courses, setCourses] = useState<ShortlistedCourse[]>(prefetchedData ?? []);
  const [loading, setLoading] = useState<boolean>(!prefetchedData);
  const [error, setError] = useState<string | null>(null);


  return (
      <SmoothScrollArea className="shortlist--container" orientation="horizontal">
        {courses.map((item, index) => (
            <div key={item.id} className="shortlist--card">
              <div className="shortlist--bg-wrapper">
                <Image
                    src="/assets/images/Technical_University_of_Munich.png"
                    alt={item.course.name}
                    fill
                    className="shortlist--bg-image"
                />
                <div className="shortlist--bg-overlay" />
              </div>

              <div
                  className="shortlist--content-section"
                  style={{ backgroundColor: CARD_BG_COLORS[index % 3] }}
              >
                <div className="shortlist--content-top">
                  <div className="shortlist--match-score">
                    {item.admission_percentage}%
                  </div>
                  <div className="shortlist--days-badge">
                    <Image
                        src="/assets/icons/HourglassMedium.svg"
                        alt="Hourglass"
                        width={16}
                        height={16}
                    />
                    <span className="shortlist--days-text">Rank #{item.rank}</span>
                  </div>
                </div>

                <div className="shortlist--content-bottom">
                  <div className="shortlist--uni-header">
                    <div className="shortlist--uni-icon-wrapper">
                      <Image
                          src="/assets/icons/TUM_icon.png"
                          alt="Uni Icon"
                          width={32}
                          height={32}
                          className="shortlist--uni-icon"
                      />
                    </div>
                    <div className="shortlist--uni-details">
                      <p className="shortlist--uni-name">
                        {item.course.university.name}
                      </p>
                      <p className="shortlist--uni-location">
                        {item.course.university.address}
                      </p>
                    </div>
                  </div>

                  <div className="shortlist--course-info">
                    <p className="shortlist--course-name">{item.course.name}</p>
                    <div className="shortlist--course-meta">
                      <div className="shortlist--meta-item">
                        <Image
                            src="/assets/icons/Calendar.svg"
                            alt="Calendar"
                            width={16}
                            height={16}
                        />
                        <span className="shortlist--meta-text">
                                            {item.course.start_semesters?.[0] || "Multiple"} Intake
                                        </span>
                      </div>
                      <div className="shortlist--meta-item">
                        <Image
                            src="/assets/icons/EuroBadge.svg"
                            alt="Euro"
                            width={16}
                            height={16}
                        />
                        <span className="shortlist--meta-text">
                                            Starting: {item.course.cost_of_living || "N/A"}
                                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ))}
      </SmoothScrollArea>
  );
};

export default CourseShortlist;
