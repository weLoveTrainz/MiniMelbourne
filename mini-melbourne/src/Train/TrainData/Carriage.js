import zIndex from '@mui/material/styles/zIndex';

var percentColors = [
  { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
  { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
  { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } },
];

var getColorForPercentage = function (pct) {
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  // or output as hex if preferred
};

const Carriage = ({ percentage }) => {
  const color = getColorForPercentage(percentage);
  const maxHeight = 40;
  const width = 50;
  return (
    <div
      style={{
        height: maxHeight,
        width: width,
        position: 'relative',
        borderRadius: 2,
      }}
    >
      <div
        style={{
          backgroundColor: color,
          width: width,
          height: maxHeight,
          opacity: 0.5,
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          height: `${percentage}%`,
          width: '100%',
          backgroundColor: color,
          display: 'block',
          bottom: 0,
        }}
      />
    </div>
  );
};

export default Carriage;
