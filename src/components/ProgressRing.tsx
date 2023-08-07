export const ProgressRing = (params: {
  radius: number;
  stroke: number;
  progress: number;
  progressText: string;
  fontSize?: "normal" | "big";
}) => {
  const normalizedRadius = params.radius - params.stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (params.progress / 100) * circumference;
  const strokeDashoffsetUnder = circumference - 1 * circumference;

  let fontSize = "";

  if (params.fontSize === "big") {
    fontSize = "text-2xl";
  }

  const textClass = `absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ${fontSize}`;

  return (
    <div className="relative">
      {/* Under circle  */}
      <svg height={params.radius * 2} width={params.radius * 2}>
        <circle
          className="origin-[50%_50%] rotate-[-90deg] stroke-influencer"
          fill="transparent"
          strokeWidth={params.stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: strokeDashoffsetUnder }}
          r={normalizedRadius}
          cx={params.radius}
          cy={params.radius}
        />
        {/* Upper circle  */}
        <circle
          className="origin-[50%_50%] rotate-[-90deg] stroke-influencer-green"
          fill="transparent"
          strokeWidth={params.stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={params.radius}
          cy={params.radius}
        />
      </svg>
      <div className={textClass}>{params.progressText}</div>
    </div>
  );
};
