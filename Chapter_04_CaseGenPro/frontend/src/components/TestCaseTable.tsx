import { useState } from 'react';
import { Copy, Check, Download, Zap } from 'lucide-react';

export interface TestCase {
  id: string;
  scenario: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'Functional' | 'Non-functional' | 'Security' | 'Performance';
}

interface Props {
  testCases: TestCase[];
  rawOutput: string;
  provider: string;
}

export default function TestCaseTable({ testCases, rawOutput, provider }: Props) {
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stats = {
    total: testCases.length,
    high: testCases.filter(t => t.priority === 'HIGH').length,
    functional: testCases.filter(t => t.type === 'Functional').length,
    security: testCases.filter(t => t.type === 'Security' || t.type === 'Performance').length,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const header = 'TEST ID,SCENARIO,PRECONDITIONS,STEPS,EXPECTED RESULT,PRIORITY,TYPE\n';
    const rows = testCases.map(t =>
      `"${t.id}","${t.scenario}","${t.preconditions}","${t.steps.join(' | ')}","${t.expectedResult}","${t.priority}","${t.type}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CaseGenPro-TestSuite-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const priorityClass = (p: string) => {
    if (p === 'HIGH') return 'badge-high';
    if (p === 'MEDIUM') return 'badge-medium';
    return 'badge-low';
  };

  const typeClass = (t: string) => {
    if (t === 'Functional') return 'badge-functional';
    if (t === 'Non-functional') return 'badge-nonfunctional';
    if (t === 'Security') return 'badge-security';
    return 'badge-performance';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)' }}>
            <Zap size={14} style={{ color: 'var(--neon-cyan)' }} />
          </div>
          <h2 className="text-sm font-bold tracking-widest uppercase table-header-cell" style={{ color: 'var(--neon-cyan)', textShadow: '0 0 12px rgba(0,229,255,0.4)' }}>
            Generated Test Suite
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Provider pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', color: 'var(--neon-green)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)' }} />
            Using {provider}
          </div>

          <button onClick={handleCopy} className="btn-3d btn-ghost px-3 py-1.5 text-xs">
            {copied ? <Check size={13} style={{ color: 'var(--neon-green)' }} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>

          <button onClick={handleDownload} className="btn-3d btn-ghost px-3 py-1.5 text-xs">
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Cases', value: stats.total, color: 'var(--neon-cyan)',    glow: 'rgba(0,229,255,0.2)',    accent: 'rgba(0,229,255,0.08)' },
          { label: 'High Priority', value: stats.high, color: '#ff6b6b',            glow: 'rgba(244,67,54,0.2)',    accent: 'rgba(198,40,40,0.08)' },
          { label: 'Functional', value: stats.functional, color: '#82b1ff',         glow: 'rgba(41,121,255,0.2)',   accent: 'rgba(41,121,255,0.08)' },
          { label: 'Sec / Perf', value: stats.security, color: '#ffab40',           glow: 'rgba(255,111,0,0.2)',    accent: 'rgba(255,111,0,0.08)' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: s.accent, border: `1px solid ${s.glow}`, boxShadow: `0 0 20px ${s.glow}` }}>
            <div className="text-3xl font-black" style={{ color: s.color, textShadow: `0 0 12px ${s.glow}` }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(140,180,230,0.5)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,229,255,0.12)', background: 'rgba(5,10,20,0.8)' }}>
        {/* Header Row */}
        <div className="grid px-5 py-3" style={{
          gridTemplateColumns: '88px 1fr 1.3fr 1.1fr 90px 120px',
          gap: '12px',
          background: 'linear-gradient(90deg, rgba(0,229,255,0.05) 0%, rgba(41,121,255,0.03) 100%)',
          borderBottom: '1px solid rgba(0,229,255,0.1)',
        }}>
          {['TEST ID', 'SCENARIO', 'TEST STEPS', 'EXPECTED RESULT', 'PRIORITY', 'TYPE'].map(col => (
            <div key={col} className="table-header-cell">{col}</div>
          ))}
        </div>

        {/* Body Rows */}
        <div>
          {testCases.map((tc, idx) => {
            const isExpanded = expandedId === tc.id;
            return (
              <div
                key={tc.id}
                onClick={() => setExpandedId(isExpanded ? null : tc.id)}
                className="grid px-5 py-4 cursor-pointer transition-all"
                style={{
                  gridTemplateColumns: '88px 1fr 1.3fr 1.1fr 90px 120px',
                  gap: '12px',
                  borderBottom: idx < testCases.length - 1 ? '1px solid rgba(0,229,255,0.05)' : 'none',
                  background: isExpanded
                    ? 'linear-gradient(135deg, rgba(41,121,255,0.08), rgba(0,229,255,0.04))'
                    : 'transparent',
                }}
                onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,229,255,0.03)'; }}
                onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                {/* ID */}
                <div className="text-xs font-bold self-start pt-0.5" style={{ color: 'var(--neon-cyan)', textShadow: '0 0 8px rgba(0,229,255,0.4)' }}>
                  {tc.id}
                </div>

                {/* Scenario */}
                <div className="text-sm font-medium self-start leading-snug" style={{ color: '#c8d8f5' }}>
                  {tc.scenario}
                </div>

                {/* Steps */}
                <div className="self-start rounded-lg p-3" style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.08)' }}>
                  <ol className="space-y-1">
                    {tc.steps.map((step, i) => (
                      <li key={i} className="text-xs flex gap-2" style={{ color: 'rgba(140,180,230,0.7)' }}>
                        <span style={{ color: 'rgba(0,229,255,0.3)', flexShrink: 0 }}>{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  {isExpanded && tc.preconditions && (
                    <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,229,255,0.08)' }}>
                      <span className="text-xs" style={{ color: 'rgba(0,229,255,0.4)' }}>Preconditions: </span>
                      <span className="text-xs" style={{ color: 'rgba(140,180,230,0.6)' }}>{tc.preconditions}</span>
                    </div>
                  )}
                </div>

                {/* Expected Result */}
                <div className="text-xs self-start leading-relaxed" style={{ color: 'rgba(140,180,230,0.6)' }}>
                  {tc.expectedResult}
                </div>

                {/* Priority badge */}
                <div className="self-start">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${priorityClass(tc.priority)}`}>
                    {tc.priority}
                  </span>
                </div>

                {/* Type badge */}
                <div className="self-start">
                  <span className={`px-2.5 py-1 rounded-md text-xs ${typeClass(tc.type)}`}>
                    {tc.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[10px]" style={{ color: 'rgba(0,229,255,0.2)' }}>
        Click any row to expand preconditions · {testCases.length} cases generated
      </p>
    </div>
  );
}
