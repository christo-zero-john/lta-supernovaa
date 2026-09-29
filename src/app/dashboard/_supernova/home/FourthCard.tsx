/* Figma 1:757: local assets retain the exported crop and compositing geometry. */
/* eslint-disable @next/next/no-img-element */
import type { UniversityCardProps } from "./universityCard";

const imgFrame2147228723 = "/assets/dashboard/1-757-imgFrame2147228723.png";
const imgRectangle2601 = "/assets/dashboard/1-757-imgRectangle2601.png";
const imgLucideCalendar = "/assets/dashboard/1-757-imgLucideCalendar.svg";
const imgLucideBadgeEuro = "/assets/dashboard/1-757-imgLucideBadgeEuro.svg";
const imgEllipse6013 = "/assets/dashboard/1-757-imgEllipse6013.svg";
const imgEllipse6014 = "/assets/dashboard/1-757-imgEllipse6014.svg";

export default function FourthCard({
  chance,
  badge,
  name,
  location,
  course,
  intake,
  cost,
}: UniversityCardProps) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-end overflow-clip relative rounded-[32px] size-full" data-node-id="1:757">
      <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[32px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[32px] size-full" src={imgFrame2147228723} />
        <div className="absolute bg-gradient-to-b from-[43.698%] from-[rgba(255,255,255,0.2)] inset-0 rounded-[32px] to-[71.739%] to-[rgba(55,49,70,0.6)]" />
      </div>
      <div className="backdrop-blur-[11.65px] content-stretch flex flex-col gap-[18px] items-start justify-end overflow-clip p-[20px] relative rounded-tl-[18px] rounded-tr-[18px] shrink-0 w-full" data-node-id="1:758" style={{ backgroundImage: "linear-gradient(90deg, rgba(83, 186, 143, 0.3) 0%, rgba(83, 186, 143, 0.3) 100%), linear-gradient(-4.256931163126865e-8deg, rgba(255, 255, 255, 0.2) 320.27%, rgba(153, 153, 153, 0) 114.86%)" }}>
        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-node-id="1:759">
          <div className="flex items-center justify-center relative shrink-0" data-node-id="1:760">
            <div className="-scale-y-100 flex-none rotate-180">
              <div className="border-[#ececec] border-[0.762px] border-solid relative rounded-[6.095px] size-[32px]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[6.095px]">
                  <img alt="" className="absolute h-[144.75%] left-[-45.02%] max-w-none top-[-21.81%] w-[190.65%]" src={imgRectangle2601} />
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-start min-w-px relative" data-node-id="1:761">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center leading-[0] min-w-px relative" data-node-id="1:762">
              <div className="flex flex-col font-jakarta font-bold justify-center relative shrink-0 text-[15px] text-white w-full" data-node-id="1:763">
                <p className="leading-[24px]">{name}</p>
              </div>
              <div className="flex flex-col font-jakarta font-normal justify-center relative shrink-0 text-[#eaecef] text-[14px] w-full" data-node-id="1:764">
                <p className="leading-[18px]">{location}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="backdrop-blur-[5.2px] content-stretch flex items-center relative rounded-[18px] shrink-0 w-full" data-node-id="1:766">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start justify-end min-w-px relative" data-node-id="1:767">
            <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[0] relative shrink-0 w-full" data-node-id="1:768">
              <div className="flex flex-col font-jakarta font-bold justify-center relative shrink-0 text-[13px] text-white tracking-[0.26px] w-full" data-node-id="1:769">
                <p className="leading-[22px]">{course}</p>
              </div>
              <div className="flex flex-col font-jakarta font-normal h-[18px] justify-center relative shrink-0 text-[#eaecef] text-[12px] tracking-[0.24px] w-full" data-node-id="1:770">
                <p className="leading-[15px]">{badge}</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="1:771">
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="1:772">
                <div className="relative shrink-0 size-[16px]" data-node-id="1:773" data-name="lucide/calendar">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLucideCalendar} />
                </div>
                <div className="[word-break:break-word] capitalize flex flex-col font-inter font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#eaecef] text-[12px] whitespace-nowrap" data-node-id="1:778">
                  <p className="leading-[18px]">{intake}</p>
                </div>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="1:779">
                <div className="relative shrink-0 size-[16px]" data-node-id="1:780" data-name="lucide/badge-euro">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLucideBadgeEuro} />
                </div>
                <div className="[word-break:break-word] capitalize flex flex-col font-inter font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#eaecef] text-[12px] whitespace-nowrap" data-node-id="1:784">
                  <p className="leading-[18px]">{cost}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-[180.25px] size-[61.277px] top-[17.22px]" data-node-id="1:785">
        <div className="absolute left-0 size-[61.277px] top-0" data-node-id="1:786">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse6013} />
        </div>
        <div className="absolute left-0 size-[61.277px] top-0" data-node-id="1:787">
          <div className="absolute bottom-[61.16%] left-1/2 right-[3.18%] top-[0.31%]">
            <img alt="" className="block max-w-none size-full" src={imgEllipse6014} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute capitalize flex flex-col font-serif h-[18.033px] italic justify-center leading-[0] left-[calc(50%-0.25px)] text-[14.426px] text-center text-white top-[calc(50%+0.18px)] tracking-[-0.577px] w-[26.598px]" data-node-id="1:788">
          <p className="leading-[29.303px]">{chance}</p>
        </div>
      </div>
    </div>
  );
}
