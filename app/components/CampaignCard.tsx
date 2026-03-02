"use client"

import { useState } from 'react';
import { ChevronRight, Clock, Eye, TrendingUp, Users, MousePointer } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const INDUSTRY_IMAGES: Record<string, string> = {
  hvac:        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&auto=format',
  plumbing:    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&h=200&fit=crop&auto=format',
  roofing:     'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=200&h=200&fit=crop&auto=format',
  landscaping: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&auto=format',
  electrical:  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop&auto=format',
  pest:        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&auto=format',
  default:     'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&h=200&fit=crop&auto=format',
};

export interface CampaignCardProps {
  id: string | number;
  name: string;
  status: string;
  channel: string;
  leads: number;
  cost_per_lead: number;
  budget: number;
  roi?: number;
  industry?: string;
  creative_url?: string;
  headline?: string;
  cta_text?: string;
  impressions?: number;
  clicks?: number;
  ctr?: string;
  posted_at?: string;
  impression_trend?: number[];
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 72, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const px = (i: number) => (i / (data.length - 1)) * w;
  const py = (v: number) => h - ((v - min) / (max - min || 1)) * h * 0.82 - h * 0.09;
  const pts = data.map((v, i) => `${px(i)},${py(v)}`);
  const line = `M${pts.join(' L')}`;
  const area = `${line} L${w},${h} L0,${h} Z`;
  const gid = `sg${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function timeAgo(isoDate?: string): string {
  if (!isoDate) return 'Recently';
  const diff = Date.now() - new Date(isoDate).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1)  return 'Just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? '1 day ago' : `${d} days ago`;
}

export function CampaignCard({ campaign }: { campaign: CampaignCardProps }) {
  useTheme(); // subscribe to theme changes so CSS vars re-apply
  const [expanded, setExpanded] = useState(false);

  const isActive   = campaign.status === 'active';
  const spentPct   = campaign.budget > 0
    ? Math.min(Math.round((campaign.leads * campaign.cost_per_lead) / campaign.budget * 100), 100)
    : 0;
  const imageUrl   = campaign.creative_url
    ?? INDUSTRY_IMAGES[campaign.industry ?? 'default']
    ?? INDUSTRY_IMAGES.default;
  const trend      = campaign.impression_trend ?? [10, 14, 12, 18, 22, 26, 30, 34];
  const roiColor   = (campaign.roi ?? 0) >= 300 ? 'var(--flare-green)'
    : (campaign.roi ?? 0) >= 200 ? 'var(--flare-amber)'
    : 'var(--flare-red)';
  const roiDimBg   = (campaign.roi ?? 0) >= 300 ? 'var(--flare-green-dim)'
    : (campaign.roi ?? 0) >= 200 ? 'var(--flare-amber-dim)'
    : 'var(--flare-red-dim)';

  return (
    <div
      className="flare-tap"
      style={{
        borderRadius: 20,
        background: 'var(--flare-surface)',
        border: `1.5px solid ${expanded ? 'var(--flare-violet)' : 'var(--flare-border)'}`,
        boxShadow: expanded
          ? `0 0 0 3px var(--flare-violet-dim), var(--flare-card-shadow)`
          : 'var(--flare-card-shadow)',
        overflow: 'hidden',
        marginBottom: 12,
      }}
    >
      {/* Micro ad preview row */}
      <div style={{ display: 'flex', height: 110 }}>

        {/* Ad creative thumbnail */}
        <div style={{ width: 110, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img
            src={imageUrl}
            alt={campaign.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).src = INDUSTRY_IMAGES.default; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.08) 100%)' }} />

          {campaign.headline && (
            <div style={{ position: 'absolute', bottom: 8, left: 8, right: 6 }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: '#fff', margin: '0 0 4px', lineHeight: 1.25, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                {campaign.headline}
              </p>
              {campaign.cta_text && (
                <span style={{ fontSize: 8, fontWeight: 700, background: 'var(--flare-violet)', color: '#fff', borderRadius: 4, padding: '2px 5px' }}>
                  {campaign.cta_text}
                </span>
              )}
            </div>
          )}

          <div style={{ position: 'absolute', top: 7, left: 7, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '2px 6px' }}>
            <span style={{ fontSize: 8, fontWeight: 800, color: '#fff', textTransform: 'capitalize' }}>{campaign.channel}</span>
          </div>

          {isActive && (
            <div style={{ position: 'absolute', top: 7, right: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--flare-green)', boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
            </div>
          )}
        </div>

        {/* Right info pane */}
        <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--flare-text)', margin: 0, letterSpacing: '-0.2px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>
                {campaign.name}
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: isActive ? 'var(--flare-green-dim)' : 'var(--flare-amber-dim)', color: isActive ? 'var(--flare-green)' : 'var(--flare-amber)', flexShrink: 0 }}>
                {isActive ? 'Live' : 'Paused'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
              <Clock size={10} color="var(--flare-text-tert)" />
              <p style={{ fontSize: 11, color: 'var(--flare-text-tert)', margin: 0 }}>
                Posted {timeAgo(campaign.posted_at)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--flare-text)', margin: '0 0 1px', letterSpacing: '-0.5px', lineHeight: 1 }}>
                {(campaign.impressions ?? campaign.leads * 180).toLocaleString()}
              </p>
              <p style={{ fontSize: 10, color: 'var(--flare-text-tert)', margin: 0 }}>impressions</p>
            </div>
            <Sparkline data={trend} color={isActive ? 'var(--flare-violet)' : 'var(--flare-text-tert)'} />
          </div>
        </div>
      </div>

      {/* Expanded performance panel */}
      <div style={{ overflow: 'hidden', maxHeight: expanded ? 240 : 0, transition: 'max-height 0.38s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ borderTop: '1px solid var(--flare-border)', padding: '14px 16px 16px' }}>

          <div style={{ display: 'flex', marginBottom: 14 }}>
            {[
              { label: 'Leads',  value: campaign.leads,                           Icon: Users },
              { label: 'Clicks', value: campaign.clicks ?? '—',                   Icon: MousePointer },
              { label: 'CTR',    value: campaign.ctr ?? '—',                      Icon: Eye },
              { label: 'ROI',    value: campaign.roi ? `${campaign.roi}%` : '—',  Icon: TrendingUp, color: roiColor, dimBg: roiDimBg },
            ].map(({ label, value, Icon, color }, j) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  paddingLeft: j > 0 ? 10 : 0,
                  marginLeft:  j > 0 ? 10 : 0,
                  borderLeft:  j > 0 ? '1px solid var(--flare-border)' : 'none',
                }}
              >
                <Icon size={10} color="var(--flare-text-tert)" style={{ marginBottom: 3 }} />
                <p style={{ fontSize: 15, fontWeight: 800, color: color ?? 'var(--flare-text)', margin: '2px 0 1px', letterSpacing: '-0.4px' }}>
                  {value}
                </p>
                <p style={{ fontSize: 9, color: 'var(--flare-text-tert)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--flare-text-tert)', fontWeight: 600 }}>Budget used</span>
              <span style={{ fontSize: 11, color: 'var(--flare-text)', fontWeight: 700 }}>
                ${(campaign.leads * campaign.cost_per_lead).toLocaleString()} / ${campaign.budget.toLocaleString()}
              </span>
            </div>
            <div style={{ height: 5, borderRadius: 5, background: 'var(--flare-surface-up)', overflow: 'hidden' }}>
              <div style={{
                width: `${spentPct}%`, height: '100%', borderRadius: 5,
                background: spentPct > 85 ? 'var(--flare-red)' : 'linear-gradient(90deg, var(--flare-violet), #9b8fe0)',
                transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, padding: '9px 0', borderRadius: 12, background: 'var(--flare-violet-dim)', border: 'none', color: 'var(--flare-violet)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Edit Ad
            </button>
            <button style={{ flex: 1, padding: '9px 0', borderRadius: 12, background: isActive ? 'var(--flare-amber-dim)' : 'var(--flare-green-dim)', border: 'none', color: isActive ? 'var(--flare-amber)' : 'var(--flare-green)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              {isActive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', padding: '9px', background: 'none',
          border: 'none', borderTop: '1px solid var(--flare-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 5, cursor: 'pointer', color: 'var(--flare-text-tert)',
          fontSize: 11, fontWeight: 600,
        }}
      >
        <ChevronRight
          size={14}
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
        />
        {expanded ? 'Less detail' : 'View performance'}
      </button>
    </div>
  );
}
