const rows = [
  ['XS', '34', '26'],
  ['S', '36', '28'],
  ['M', '38', '30'],
  ['L', '40', '32'],
];

export function SizeGuide() {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead className="border-b border-mist uppercase tracking-[0.18em]"><tr><th className="py-3">Size</th><th>Chest</th><th>Waist</th></tr></thead>
      <tbody>{rows.map(([size, chest, waist]) => <tr key={size} className="border-b border-mist"><td className="py-3">{size}</td><td>{chest}</td><td>{waist}</td></tr>)}</tbody>
    </table>
  );
}
