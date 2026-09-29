import Image from "next/image";
import React from "react";
import "./LtaIcon.css";

const LtaIcon: React.FC = () => {
  return (
    <div className="ltaicon--container">
      <Image
        src="/assets/icons/LTALogoIcon.svg"
        alt=""
        width={53.49}
        height={36.67}
        className="ltaicon--logo"
      />
      <span className="ltaicon--text">
        Letters
        <br />
        to Abroad
      </span>
    </div>
  );
};

export default LtaIcon;
