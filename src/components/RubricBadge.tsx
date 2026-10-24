import React from "react";
import { Check, BookCheck } from "lucide-react";

interface RubricProps {
  hasAnalysis: boolean;
  hasThesis: boolean;
  hasPeelBody: boolean;
  hasAcademicTone: boolean;
  hasConclusion: boolean;
  hasReferences: boolean;
}

export const RubricBadge: React.FC<RubricProps> = ({
  hasAnalysis,
  hasThesis,
  hasPeelBody,
  hasAcademicTone,
  hasConclusion,
  hasReferences,
}) => {
  const criteria = [
    { label: "1. Assignment Analysis", met: hasAnalysis, desc: "Command words & discipline" },
    { label: "2. Thesis Statement", met: hasThesis, desc: "Paragraph 1 core answer" },
    { label: "3. PEEL Body Paragraphs", met: hasPeelBody, desc: "Point • Evidence • Example • Link" },
    { label: "4. Academic Restraint", met: hasAcademicTone, desc: "Objective 3rd-person lexicon" },
    { label: "5. Synthesized Conclusion", met: hasConclusion, desc: "Implications & significance" },
    { label: "6. APA 7th References", met: hasReferences, desc: "Peer-reviewed citations" },
  ];

  const totalMet = criteria.filter((c) => c.met).length;

  return (
    <div className="bg-[#F7F3EE] border border-[#E0D8CF] rounded-2xl p-3.5 sm:p-4 mb-5 font-sans">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <BookCheck className="w-4 h-4 text-[#5E6B5D]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2D2A26]">
            College Professor Structural Rubric
          </span>
        </div>
        <span className="text-xs font-medium text-[#7A736B] bg-[#F1EDE6] border border-[#D0C7BC] px-2.5 py-0.5 rounded-full">
          {totalMet}/6 Framework Pillars Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {criteria.map((item, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border text-left transition-colors ${
              item.met
                ? "bg-white border-[#7D8C7C] text-[#2D2A26] shadow-xs"
                : "bg-[#F1EDE6]/70 border-[#D0C7BC] text-[#948B81]"
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                  item.met
                    ? "bg-[#5E6B5D] text-white"
                    : "bg-[#D0C7BC] text-[#7A736B]"
                }`}
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-semibold truncate" title={item.label}>
                {item.label}
              </span>
            </div>
            <p className="text-[10px] text-[#7A736B] truncate leading-tight">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
