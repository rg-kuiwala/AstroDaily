import React from "react";

interface AdPlaceholderProps {
  type: "banner" | "interstitial" | "native";
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, className }) => {
  return (
    <div
      className={`glass flex items-center justify-center border-dashed border-white/20 opacity-50 ${className}`}
      style={{ minHeight: type === "banner" ? "90px" : "250px" }}
    >
      <div className="text-center p-4">
        <p className="text-xs uppercase tracking-widest opacity-60">Monetag Ad Placement</p>
        <p className="text-[10px] opacity-40 mt-1">({type} ad zone)</p>
      </div>
      {/* 
        To integrate Monetag, you would add their script here or in index.html.
        Example:
        <script async src="https://monetag-sdk.com/tag.js" data-zone="YOUR_ZONE_ID"></script>
      */}
    </div>
  );
};
