type Point = readonly [number, number];
type Line = readonly Point[];

const drawings: Record<"desk" | "books", Line[]> = {
  desk: [
    [[14, 65], [87, 42], [147, 64], [74, 88], [14, 65]],
    [[14, 65], [14, 96]],
    [[74, 88], [74, 113]],
    [[147, 64], [147, 95]],
    [[62, 12], [111, 27], [111, 58], [62, 43], [62, 12]],
    [[85, 50], [85, 61], [75, 65], [96, 71]],
    [[40, 67], [64, 59], [82, 65], [58, 73], [40, 67]],
    [[100, 74], [108, 71], [115, 74]],
  ],
  books: [
    [[26, 23], [37, 19], [37, 88], [26, 92], [26, 23]],
    [[37, 19], [67, 30], [67, 99], [37, 88]],
    [[26, 40], [37, 36]],
    [[26, 78], [37, 74]],
    [[75, 18], [87, 22], [87, 95], [75, 91], [75, 18]],
    [[87, 22], [108, 14], [108, 87], [87, 95]],
    [[75, 36], [87, 40]],
    [[75, 78], [87, 82]],
    [[113, 39], [124, 35], [135, 92], [124, 96], [113, 39]],
    [[124, 35], [145, 43], [154, 99], [135, 92]],
    [[117, 58], [127, 54]],
  ],
};

function sampleDrawing(lines: Line[]) {
  const points: { x: number; y: number; corner: boolean }[] = [];

  for (const line of lines) {
    for (let index = 0; index < line.length - 1; index++) {
      const [x, y] = line[index];
      const [endX, endY] = line[index + 1];
      const steps = Math.ceil(Math.hypot(endX - x, endY - y) / 4.2);

      for (let step = 0; step < steps; step++) {
        points.push({
          x: x + ((endX - x) * step) / steps,
          y: y + ((endY - y) * step) / steps,
          corner: step === 0,
        });
      }
    }

    const [x, y] = line[line.length - 1];
    points.push({ x, y, corner: true });
  }

  return points;
}

const marks = {
  desk: sampleDrawing(drawings.desk),
  books: sampleDrawing(drawings.books),
};

export function ProjectMark({ kind }: { kind: keyof typeof marks }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 168 124"
      className="project-mark relative z-10 col-start-1 row-start-1 w-16 self-center overflow-visible text-[#cfc9bb]/65 md:row-span-2 md:w-24 lg:row-span-1 lg:w-32"
    >
      <g fill="currentColor" textAnchor="middle" dominantBaseline="central" className="font-mono">
        {marks[kind].map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={point.y}
            fontSize={point.corner ? 7 : 8.5}
            opacity={point.corner ? 0.9 : 0.65}
          >
            {point.corner ? "+" : "·"}
          </text>
        ))}
      </g>
    </svg>
  );
}
