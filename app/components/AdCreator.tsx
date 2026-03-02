"use client"

/**
 * AdCreator.tsx
 * AI Ad Creator wizard — integrates into the existing tab-based app navigation.
 * Uses Tailwind, Framer Motion, and Lucide exactly as the rest of the app does.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw, Zap, Send } from 'lucide-react';
import {
  INDUSTRIES, PLATFORMS, FORMATS, STYLES,
  flareGenerateCopy, flareGenerateImage,
  type AdCopy,
} from '@/lib/adCreatorService';

const stepVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.18 } },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
};

const STEP_LABELS = ['Business', 'Platform', 'Format', 'Style', 'Create'];

/** Parse the free-text prompt to detect industry and platform hints */
function parsePrompt(prompt: string): { industry: string | null; platform: string | null; brandName: string } {
  const p = prompt.toLowerCase();
  const industryMap: [string, string[]][] = [
    ['plumbing',    ['plumb', 'pipe', 'drain', 'leak', 'water heater', 'faucet']],
    ['hvac',        ['hvac', 'ac ', 'air condition', 'furnace', 'heating', 'cooling', 'heat pump']],
    ['roofing',     ['roof', 'shingle', 'gutter', 'storm damage']],
    ['electrical',  ['electr', 'wiring', 'panel', 'breaker', 'outlet', 'ev charger']],
    ['landscaping', ['landscap', 'lawn', 'mow', 'irrigation', 'garden', 'mulch', 'trim']],
    ['pest',        ['pest', 'termite', 'rodent', 'bug ', 'insect', 'exterminate']],
  ];
  const platformMap: [string, string[]][] = [
    ['facebook',  ['facebook', 'fb ad']],
    ['instagram', ['instagram', 'ig ', 'insta']],
    ['google',    ['google']],
    ['nextdoor',  ['nextdoor', 'next door']],
  ];

  let detectedIndustry: string | null = null;
  for (const [key, keywords] of industryMap) {
    if (keywords.some(k => p.includes(k))) { detectedIndustry = key; break; }
  }
  let detectedPlatform: string | null = null;
  for (const [key, keywords] of platformMap) {
    if (keywords.some(k => p.includes(k))) { detectedPlatform = key; break; }
  }

  // Simple brand extraction: "for [Name]" or "my [Name] business"
  const forMatch = prompt.match(/\bfor\s+([A-Z][a-zA-Z'&\s]{1,24}?)(?:\s+(?:business|company|llc|inc|co\b|plumbing|hvac|roofing|electrical|landscaping|pest)|[,.]|$)/);
  const myMatch  = prompt.match(/\bmy\s+([A-Z][a-zA-Z'&\s]{1,24}?)\s+(?:business|company|llc|inc|co\b)/i);
  const brandName = (forMatch?.[1] || myMatch?.[1] || '').trim();

  return { industry: detectedIndustry, platform: detectedPlatform, brandName };
}

export default function AdCreator({ initialPrompt = '', onBack }: { initialPrompt?: string; onBack?: () => void }) {
  const parsed = useMemo(() => parsePrompt(initialPrompt), [initialPrompt]);

  const [step, setStep]               = useState(0);
  const [industry, setIndustry]       = useState<string | null>(parsed.industry);
  const [brandName, setBrandName]     = useState(parsed.brandName);
  const [offer, setOffer]             = useState('');
  const [platform, setPlatform]       = useState<string | null>(parsed.platform);
  const [format, setFormat]           = useState('square');
  const [style, setStyle]             = useState<string | null>(null);
  const [copy, setCopy]               = useState<AdCopy | null>(null);
  const [imageUrl, setImageUrl]       = useState<string | null>(null);
  const [copyLoading, setCopyLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [generating, setGenerating]   = useState(false);
  const [generated, setGenerated]     = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const ind       = industry ? INDUSTRIES[industry] : INDUSTRIES.plumbing;
  const selFormat = FORMATS.find(f => f.id === format) ?? FORMATS[0];
  const selPlat   = PLATFORMS.find(p => p.id === platform);
  const selStyle  = STYLES.find(s => s.id === style);
  const pal       = ind.palette;

  useEffect(() => {
    if (step === 3 && style && industry && platform) handleGenerateCopy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, style]);

  const handleGenerateCopy = useCallback(async () => {
    if (!industry || !style || !platform) return;
    setCopyLoading(true); setCopy(null); setError(null);
    const result = await flareGenerateCopy({ industry, style, platform, brandName, offer });
    if (!result) setError('Copy generation failed — tap Rewrite to retry.');
    setCopy(result);
    setCopyLoading(false);
  }, [industry, style, platform, brandName, offer]);

  const handleGenerate = async () => {
    if (!industry || !style || !platform) return;
    setGenerating(true); setError(null);
    const [freshCopy, freshImage] = await Promise.all([
      copy ? Promise.resolve(copy) : flareGenerateCopy({ industry, style, platform, brandName, offer }),
      flareGenerateImage({ imagePrompt: copy?.image_prompt ?? `${ind.label} professional service`, format }),
    ]);
    if (freshCopy) setCopy(freshCopy);
    setImageLoading(true);
    setTimeout(() => {
      setImageUrl(freshImage);
      setImageLoading(false);
      setGenerating(false);
      setGenerated(true);
    }, 1800);
  };

  const handleReset = () => {
    setStep(0); setIndustry(null); setBrandName(''); setOffer('');
    setPlatform(null); setFormat('square'); setStyle(null);
    setCopy(null); setImageUrl(null);
    setGenerated(false); setGenerating(false); setError(null);
  };

  const canAdvance = (): boolean => {
    if (step === 0) return !!industry && brandName.trim().length > 1;
    if (step === 1) return !!platform;
    if (step === 2) return !!format;
    if (step === 3) return !!style;
    return false;
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-8rem)] bg-zinc-50">

      {/* ── LEFT: WIZARD ─────────────────────────────────────────────────── */}
      <div className="w-1/2 flex flex-col bg-white border-r border-zinc-100 min-h-full">

        {/* Header */}
        <div className="px-6 pt-4 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-3 mb-4">
            {onBack && (
              <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            {!onBack && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-white" />
              </div>
            )}
            <div>
              <p className="font-extrabold text-sm text-zinc-900 tracking-tight leading-none">Flare</p>
              <p className="text-[10px] text-zinc-400 font-semibold tracking-widest mt-0.5">AI AD CREATOR</p>
            </div>
            <div className="ml-auto flex gap-1.5">
              {['Claude', 'FAL'].map(label => (
                <span key={label} className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                  {label} ✓
                </span>
              ))}
            </div>
          </div>
          {initialPrompt && (
            <div className="mb-3 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg flex items-start gap-2">
              <span className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase mt-0.5 flex-shrink-0">Prompt</span>
              <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-2">{initialPrompt}</p>
            </div>
          )}
          <div className="flex gap-1.5">
            {STEP_LABELS.map((name, i) => (
              <button key={i} className="flex-1 text-left" onClick={() => i < step && setStep(i)} disabled={i >= step}>
                <div className={`h-0.5 rounded-full mb-1 transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-violet-500 to-violet-400' : 'bg-zinc-200'}`} />
                <p className={`text-[9px] font-bold tracking-wider text-center uppercase transition-colors ${i === step ? 'text-violet-500' : i < step ? 'text-zinc-400' : 'text-zinc-300'}`}>{name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 px-6 py-5 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={step} variants={stepVariants} initial="initial" animate="animate" exit="exit">

              {/* STEP 0 — Industry + Name */}
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight mb-1">What trade are you in?</h2>
                  <p className="text-zinc-400 text-xs mb-4 leading-relaxed">Your industry shapes every word and image — HVAC and plumbing will never say the same thing.</p>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {Object.entries(INDUSTRIES).map(([key, val]) => (
                      <SelectCard key={key} active={industry === key} onClick={() => setIndustry(key)} className="flex-col py-3 px-2 text-center gap-1 justify-center items-center">
                        <span className="text-xl">{val.badge}</span>
                        <span className={`text-xs font-bold ${industry === key ? 'text-violet-600' : 'text-zinc-700'}`}>{val.label}</span>
                      </SelectCard>
                    ))}
                  </div>
                  <label className="field-label">Business Name</label>
                  <input
                    className="field-input"
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                    placeholder={industry ? `e.g. Johnson ${INDUSTRIES[industry].label} Co.` : 'e.g. Smith Plumbing LLC'}
                  />
                  {industry && brandName.length > 1 && (
                    <motion.div {...fadeIn} className="mt-3 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg text-xs text-violet-700 font-medium leading-relaxed">
                      <strong>{ind.badge} {ind.label} mode on</strong> — copy will reference {ind.keywords[0]}, {ind.keywords[1]}, and {ind.keywords[2]}
                      {parsed.industry === industry && <span className="ml-1 text-violet-400">(detected from your prompt)</span>}
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 1 — Platform */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight mb-1">Where do your customers scroll?</h2>
                  <p className="text-zinc-400 text-xs mb-4 leading-relaxed">Each platform gets tailored copy — Facebook homeowners scroll differently than Google searchers.</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PLATFORMS.map(p => (
                      <SelectCard key={p.id} active={platform === p.id} onClick={() => setPlatform(p.id)} className="p-3.5 gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-all duration-200" style={{ background: platform === p.id ? p.color : p.lightBg, color: platform === p.id ? '#fff' : p.color }}>{p.abbr}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-zinc-900">{p.label}</p>
                          <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{p.tip}</p>
                        </div>
                        {platform === p.id && <CheckBadge />}
                      </SelectCard>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2 — Format */}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight mb-1">Choose your format</h2>
                  <p className="text-zinc-400 text-xs mb-4 leading-relaxed">Sets the image dimensions and copy length. The phone preview updates as you pick.</p>
                  <div className="flex flex-col gap-2">
                    {FORMATS.map(f => (
                      <SelectCard key={f.id} active={format === f.id} onClick={() => setFormat(f.id)} className="p-3 gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border-2 transition-colors ${format === f.id ? 'border-violet-500' : 'border-zinc-200'}`}>
                          <div className="rounded-sm transition-colors" style={{ width: `${Math.round(24 * f.tw)}px`, height: `${Math.round(24 * f.th)}px`, background: format === f.id ? '#7c6fcd' : '#d1d5db' }} />
                        </div>
                        <div className="flex-1">
                          <span className="font-bold text-sm text-zinc-900">{f.label}</span>
                          <span className="text-violet-500 text-xs font-semibold ml-2">{f.ratio}</span>
                          <p className="text-xs text-zinc-400 mt-0.5">{f.desc}</p>
                        </div>
                        {format === f.id && <CheckBadge />}
                      </SelectCard>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 — Style */}
              {step === 3 && (
                <div>
                  <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight mb-1">Pick the tone</h2>
                  <p className="text-zinc-400 text-xs mb-4 leading-relaxed">Claude writes completely different copy for each. Watch the preview update on the right.</p>
                  <div className="flex flex-col gap-2 mb-4">
                    {STYLES.map(s => (
                      <SelectCard key={s.id} active={style === s.id} onClick={() => setStyle(s.id)} className="p-3 gap-3">
                        <span className="text-xl flex-shrink-0">{s.emoji}</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-zinc-900">{s.label}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{s.desc}</p>
                        </div>
                        {style === s.id && <CheckBadge />}
                      </SelectCard>
                    ))}
                  </div>
                  <label className="field-label">Special offer <span className="text-zinc-300 font-normal normal-case">optional</span></label>
                  <textarea
                    className="field-input resize-none h-14 leading-relaxed"
                    value={offer}
                    onChange={e => setOffer(e.target.value)}
                    placeholder={`e.g. $50 off first ${ind.keywords[0]}, free inspection, same-day guarantee`}
                  />
                  <AnimatePresence>
                    {copyLoading && (
                      <motion.div {...fadeIn} className="mt-3 px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl flex items-center gap-3">
                        <Spinner />
                        <span className="text-sm text-violet-600 font-semibold">Claude writing {ind.label.toLowerCase()} copy…</span>
                      </motion.div>
                    )}
                    {copy && !copyLoading && (
                      <motion.div {...fadeIn} className="mt-3 px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl">
                        <p className="text-[9px] font-extrabold text-violet-500 tracking-widest mb-2">✨ CLAUDE GENERATED — {ind.label.toUpperCase()} COPY</p>
                        <p className="font-extrabold text-sm text-zinc-900 mb-1">{copy.headline}</p>
                        <p className="text-xs text-zinc-500 mb-2 leading-relaxed">{copy.subheadline}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-violet-600 text-white rounded-lg px-3 py-1 text-xs font-bold">{copy.cta}</span>
                          <span className="text-xs text-zinc-400 italic">{copy.trust_signal}</span>
                        </div>
                        <button onClick={handleGenerateCopy} className="mt-2 flex items-center gap-1.5 text-xs text-violet-500 font-semibold hover:text-violet-700 transition-colors">
                          <RotateCcw size={11} /> Rewrite
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* STEP 4 — Generate */}
              {step === 4 && !generated && (
                <div>
                  <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight mb-1">{generating ? 'Building your ad…' : 'Ready to create'}</h2>
                  <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
                    {generating
                      ? `AI is rendering a real ${ind.label.toLowerCase()} image and finalizing copy for ${selPlat?.label}.`
                      : `${brandName}'s ${selStyle?.label.toLowerCase()} ${ind.label.toLowerCase()} ad — one click away.`}
                  </p>
                  {!generating && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {[`${ind.badge} ${ind.label}`, selPlat?.label, `${selFormat.label} ${selFormat.ratio}`, `${selStyle?.emoji} ${selStyle?.label}`, brandName, offer ? '🎁 Custom offer' : null]
                        .filter(Boolean).map((chip, i) => (
                          <span key={i} className="bg-violet-50 border border-violet-200 text-violet-600 text-xs font-semibold px-3 py-1.5 rounded-full">{chip}</span>
                        ))}
                    </div>
                  )}
                  {generating && (
                    <div className="mb-5 space-y-2">
                      {[`Analyzing ${ind.label.toLowerCase()} industry…`, 'Writing headline + body copy…', 'Building photorealistic image prompt…', 'Rendering AI image via FAL…', 'Compositing final ad…'].map((txt, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.44 }} className="flex items-center gap-3">
                          <Spinner />
                          <span className="text-sm text-zinc-500">{txt}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-4">{error}</div>}
                </div>
              )}

              {/* STEP 4 — Done */}
              {step === 4 && generated && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-extrabold text-base text-zinc-900">Ad ready to publish</p>
                      <p className="text-xs text-zinc-400">AI image + {ind.label} copy — {selPlat?.label}</p>
                    </div>
                  </div>
                  {copy && (
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-4">
                      <p className="font-extrabold text-base text-zinc-900 mb-1.5 leading-tight">{copy.headline}</p>
                      <p className="text-sm text-zinc-500 mb-1.5 leading-relaxed">{copy.body}</p>
                      <p className="text-xs text-zinc-400 mb-4">{copy.trust_signal}</p>
                      <div className="flex gap-2">
                        <span className="bg-violet-600 text-white rounded-lg px-4 py-2 text-sm font-bold">{copy.cta}</span>
                        <button onClick={handleReset} className="bg-white border border-violet-200 text-violet-600 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-violet-50 transition-colors flex items-center gap-1.5">
                          <RotateCcw size={13} /> New ad
                        </button>
                      </div>
                    </div>
                  )}
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-200 hover:opacity-95 transition-opacity flex items-center justify-center gap-2">
                    <Send size={15} /> Publish to {selPlat?.label}
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer CTA */}
        {!(step === 4 && generated) && (
          <div className="px-6 py-3 border-t border-zinc-100 flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="px-4 py-2.5 rounded-xl border-2 border-zinc-200 bg-white text-zinc-500 text-sm font-semibold hover:border-zinc-300 transition-colors min-h-[44px]">
                ← Back
              </button>
            )}
            {step < 4 && (
              <button
                disabled={!canAdvance()}
                onClick={() => setStep(s => s + 1)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-all min-h-[44px] ${canAdvance() ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md shadow-violet-200 hover:opacity-95' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'}`}
              >
                {step === 3 ? 'Build My Ad →' : 'Continue →'}
              </button>
            )}
            {step === 4 && !generating && !generated && (
              <button onClick={handleGenerate} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-bold shadow-md shadow-violet-200 hover:opacity-95 transition-opacity min-h-[44px] flex items-center justify-center gap-2">
                <Zap size={15} /> Generate My Ad
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── RIGHT: LIVE PHONE PREVIEW ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <motion.div className="absolute inset-0 pointer-events-none" animate={{ background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${pal.accent}22 0%, transparent 65%)` }} transition={{ duration: 0.8 }} />
        <p className={`text-[10px] font-bold tracking-[2.5px] uppercase mb-4 transition-colors duration-300 ${copyLoading || imageLoading ? 'text-violet-400' : 'text-zinc-300'}`}>
          {copyLoading ? '⚡ Writing copy…' : imageLoading ? '🎨 Rendering image…' : 'Live Preview'}
        </p>

        {/* Phone shell */}
        <div className="w-52" style={{ filter: 'drop-shadow(0 22px 48px rgba(0,0,0,0.16))' }}>
          <div className="rounded-[36px] p-2 pb-2.5" style={{ background: '#0f0f0f', border: '3px solid #1c1c1c' }}>
            <div className="flex justify-center mb-1">
              <div className="w-12 h-1.5 rounded-full" style={{ background: '#222' }} />
            </div>
            <div className="rounded-[16px] overflow-hidden relative transition-all duration-500" style={{ aspectRatio: `${selFormat.tw}/${selFormat.th}`, background: pal.bg }}>
              {imageUrl && (
                <motion.img {...fadeIn} src={imageUrl} alt="Ad visual" className="absolute inset-0 w-full h-full object-cover" />
              )}
              {imageLoading && !imageUrl && (
                <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${pal.bg} 0%, ${pal.shimmer} 50%, ${pal.bg} 100%)`, backgroundSize: '200% 100%', animation: 'adShimmer 1.4s infinite' }} />
              )}
              <div className="absolute inset-0 transition-all duration-500" style={{ background: `linear-gradient(to bottom, transparent 20%, rgba(0,0,0,${imageUrl ? '0.72' : '0.4'}) 100%)` }} />
              {industry && (
                <div className="absolute top-2 left-2 z-10 backdrop-blur-md rounded-full px-2 py-0.5" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <span className="text-[9px] text-white font-bold">{ind.badge} {ind.label}</span>
                </div>
              )}
              {platform && selPlat && (
                <div className="absolute top-2 right-2 z-10 rounded-md px-1.5 py-0.5" style={{ background: selPlat.color }}>
                  <span className="text-[9px] text-white font-extrabold">{selPlat.abbr}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
                {copyLoading && (
                  <div className="flex flex-col gap-1.5">
                    {[62, 82, 48].map((w, i) => (
                      <div key={i} className="rounded" style={{ height: i === 0 ? 10 : 7, width: `${w}%`, background: 'rgba(255,255,255,0.14)', animation: 'adPulse 1.2s infinite' }} />
                    ))}
                  </div>
                )}
                {copy && !copyLoading && (
                  <motion.div {...fadeIn}>
                    <p className="text-[8px] font-bold tracking-widest uppercase mb-1" style={{ color: pal.accent }}>{selPlat?.label ?? 'Ad'}</p>
                    <p className="text-white font-extrabold leading-tight mb-1" style={{ fontSize: style === 'bold' ? 13 : 11, textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>{copy.headline}</p>
                    <p className="text-[9px] mb-2 leading-snug" style={{ color: 'rgba(255,255,255,0.78)' }}>{copy.subheadline}</p>
                    <span className="inline-block text-white text-[10px] font-bold px-2.5 py-1 rounded-md" style={{ background: pal.accent }}>{copy.cta}</span>
                  </motion.div>
                )}
                {!copy && !copyLoading && (
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {!industry ? 'Select your trade to begin →' : !style ? 'Pick a tone to generate copy →' : 'Generating…'}
                  </p>
                )}
              </div>
            </div>
            <div className="px-2.5 py-1.5 flex items-center gap-2.5">
              <span className="text-sm text-zinc-600">♡</span>
              <span className="text-sm text-zinc-600">◻</span>
              <span className="text-sm text-zinc-600">➤</span>
              <span className="ml-auto text-[9px] text-zinc-500 font-semibold truncate max-w-[70px]">{brandName || (industry ? ind.label : 'Your Business')}</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {copy && (
            <motion.div {...fadeIn} className="flex gap-5 mt-4">
              {[{ l: 'Est. Reach', v: '14–22K' }, { l: 'Avg CTR', v: '2.6%' }, { l: 'Best Time', v: '6–9 PM' }].map(s => (
                <div key={s.l} className="text-center">
                  <p className="font-extrabold text-sm text-zinc-900 tracking-tight">{s.v}</p>
                  <p className="text-[10px] text-zinc-400 font-semibold tracking-wide mt-0.5">{s.l}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes adShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes adPulse   { 0%,100%{opacity:0.3} 50%{opacity:0.75} }
        .field-label { display:block; font-size:11px; font-weight:700; color:#6b7280; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:6px; }
        .field-input { width:100%; padding:10px 12px; border-radius:10px; border:2px solid #e5e7eb; font-size:13px; color:#111827; outline:none; background:white; transition:border-color 0.2s; font-family:inherit; }
        .field-input:focus { border-color:#7c6fcd; }
      `}</style>
    </div>
  );
}

function SelectCard({ active, onClick, children, className = '' }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button onClick={onClick} className={`relative flex items-center border-2 rounded-xl cursor-pointer transition-all duration-150 ${active ? 'border-violet-500 bg-violet-50 shadow-[0_0_0_3px_rgba(124,111,205,0.08)] scale-[1.02]' : 'border-zinc-200 bg-white hover:border-zinc-300'} ${className}`}>
      {children}
    </button>
  );
}

function CheckBadge() {
  return (
    <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
      <Check size={10} className="text-white" strokeWidth={3} />
    </div>
  );
}

function Spinner() {
  return <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin flex-shrink-0" />;
}
