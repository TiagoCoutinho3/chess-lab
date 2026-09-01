import React from "react";

interface EvaluationBarProps {
  evaluationCp: number;
  className?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  evaluationCp,
  className = "",
}) => {
  const safeCp = Number.isFinite(evaluationCp) ? evaluationCp : 0;
  const absCp = Math.abs(safeCp);
  const scaledMagnitude = Math.pow(Math.min(absCp / 1200, 1), 0.7);
  const whiteRatio =
    safeCp >= 0 ? 50 + scaledMagnitude * 50 : 50 - scaledMagnitude * 50;
  const ratio = clamp(whiteRatio, 0, 100);
  const background = `linear-gradient(90deg, #ffffff 0%, #ffffff ${ratio}%, #0f172a ${ratio}%, #0f172a 100%)`;

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        <span className="text-slate-700">Brancas</span>
        <span className={safeCp >= 0 ? "text-slate-700" : "text-slate-500"}>
          {safeCp >= 0 ? "+" : ""}
          {(safeCp / 100).toFixed(2)}
        </span>
        <span className="text-slate-700">Pretas</span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-inner transition-all duration-400 ease-out">
        <div
          className="h-full w-full rounded-full transition-[background] duration-400 ease-out"
          style={{ background }}
        />
      </div>
    </div>
  );
};
