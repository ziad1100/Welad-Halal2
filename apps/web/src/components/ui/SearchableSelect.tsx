import { useMemo, useState } from 'react';

interface Opt {
  value: string;
  label: string;
}

// Searchable dropdown used by all select fields (replica prompt requirement).
export function SearchableSelect({ options, value, onChange, placeholder }: { options: Opt[]; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) => o.label.toLowerCase().includes(s));
  }, [q, options]);
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      <input placeholder={placeholder ?? 'بحث...'} value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 110 }} />
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {filtered.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </span>
  );
}
