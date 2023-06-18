export const ProgressRing = (params: {
  radius: number;
  stroke: number;
  progress: number;
  progressText: string;
  underBarColor: string;
  upperBarColor: string;
}) => {
  const normalizedRadius = params.radius - params.stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (params.progress / 100) * circumference;
  const strokeDashoffsetUnder = circumference - 1 * circumference;

  const underCircleClass = `origin-[50%_50%] rotate-[-90deg] stroke-${params.underBarColor}`;
  const upperCircleClass = `origin-[50%_50%] rotate-[-90deg] stroke-${params.upperBarColor}`;

  return (
    <div className="relative">
      {/* Under circle  */}
      <svg height={params.radius * 2} width={params.radius * 2}>
        <circle
          className={underCircleClass}
          fill="transparent"
          stroke={params.underBarColor}
          strokeWidth={params.stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: strokeDashoffsetUnder }}
          r={normalizedRadius}
          cx={params.radius}
          cy={params.radius}
        />
        {/* Upper circle  */}
        <circle
          className={upperCircleClass}
          fill="transparent"
          stroke={params.underBarColor}
          strokeWidth={params.stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={params.radius}
          cy={params.radius}
        />
      </svg>
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        {params.progressText}
      </div>
    </div>
  );
};
