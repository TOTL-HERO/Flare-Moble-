"use client"

import { useState } from "react"
import { ChevronLeft, ChevronDown, Eye, EyeOff, X, Check, Facebook, Sparkles } from "lucide-react"

// Flare brand colors - lavender purple
const FLARE_PRIMARY = "#9B7EC8"
const FLARE_PRIMARY_DARK = "#8A6DB8"
const FLARE_PRIMARY_LIGHT = "#C4A8E8"

type Step = "splash" | "welcome" | "create-account" | "step1" | "step2" | "step3" | "step4" | "step5" | "step6" | "loading" | "feature"

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("splash")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [smsConsent, setSmsConsent] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [showIndustrySheet, setShowIndustrySheet] = useState(false)
  const [teamSize, setTeamSize] = useState("")
  const [yearsInBusiness, setYearsInBusiness] = useState("")
  const [budget, setBudget] = useState("")
  const [hearAbout, setHearAbout] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Auto-advance from splash
  if (step === "splash") {
    setTimeout(() => setStep("welcome"), 2000)
  }

  // Loading screen progress
  if (step === "loading" && loadingProgress < 100) {
    setTimeout(() => setLoadingProgress((prev) => Math.min(prev + 10, 100)), 200)
    if (loadingProgress >= 100) {
      setTimeout(() => setStep("feature"), 500)
    }
  }

  const getProgress = () => {
    const steps: Step[] = ["step1", "step2", "step3", "step4", "step5", "step6"]
    const idx = steps.indexOf(step)
    if (idx === -1) return 0
    return ((idx + 1) / steps.length) * 100
  }

  const industries = [
    { category: "Cleaning", items: ["Bin Cleaning", "Commercial Cleaning", "Pressure Washing", "Residential Cleaning", "Window Washing"] },
    { category: "Green Industry", items: ["Arborist / Tree Care", "Landscaping Contractor", "Lawn Care & Maintenance"] },
    { category: "Trade", items: ["Construction & Contracting", "Electrical Contractor", "HVAC", "Plumbing", "Roofing"] },
  ]

  const teamSizes = ["Just me", "2-3 people", "4-10 people", "11-19 people", "20+ people"]
  const yearsOptions = ["Less than 1 year", "1-2 years", "3-5 years", "6-10 years", "10+ years"]
  const budgets = ["$0 - $500", "$500 - $1,000", "$1,000 - $2,500", "$2,500 - $5,000", "$5,000+"]
  const hearOptions = ["Google", "Facebook", "Friend/Referral", "YouTube", "Podcast", "Other"]

  // Splash Screen
  if (step === "splash") {
    return (
      <div className="min-h-screen bg-[#0A2540] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#9B7EC8] to-[#8A6DB8] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">FLARE</h1>
        </div>
      </div>
    )
  }

  // Welcome Screen
  if (step === "welcome") {
    return (
      <div className="min-h-screen flex flex-col">
        <div 
          className="flex-1 bg-cover bg-center relative"
          style={{ 
            backgroundImage: "linear-gradient(to bottom, rgba(10, 37, 64, 0.7), rgba(10, 37, 64, 0.9)), url('/images/hvac-hero.jpg')",
            minHeight: "60vh"
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-[#9B7EC8] to-[#8A6DB8] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-wide mb-2">FLARE</h1>
            <p className="text-lg text-center text-white/90 max-w-xs">
              Over 10,000 home service pros trust Flare to grow their business
            </p>
          </div>
        </div>
        <div className="bg-white p-6 space-y-4 rounded-t-3xl -mt-6 relative">
          <button
            onClick={() => setStep("create-account")}
            className="w-full py-4 rounded-xl font-semibold text-white"
            style={{ backgroundColor: FLARE_PRIMARY }}
          >
            Sign Up Free
          </button>
          <button className="w-full py-4 rounded-xl font-semibold border border-gray-300 text-gray-700">
            Log In
          </button>
          <button className="w-full py-2 text-[#9B7EC8] font-medium">
            Joining a Team?
          </button>
        </div>
      </div>
    )
  }

  // Create Account Screen
  if (step === "create-account") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4">
          <button onClick={() => setStep("welcome")} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="flex-1 px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create an account</h1>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-gray-900 focus:border-[#9B7EC8] focus:ring-1 focus:ring-[#9B7EC8] outline-none"
                placeholder="Email"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl text-gray-900 focus:border-[#9B7EC8] focus:ring-1 focus:ring-[#9B7EC8] outline-none"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-sm text-gray-500">Minimum of 6 characters</p>
          </div>
        </div>
        <div className="p-6 space-y-4 border-t border-gray-100">
          <button
            onClick={() => setStep("step1")}
            disabled={!email || password.length < 6}
            className="w-full py-4 rounded-xl font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: FLARE_PRIMARY }}
          >
            Continue
          </button>
          <p className="text-center text-gray-600">
            Already have an account? <button className="text-[#9B7EC8] font-medium">Log in</button>
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button className="w-full py-4 rounded-xl font-semibold border border-gray-300 flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <button className="w-full py-4 rounded-xl font-semibold bg-black text-white flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
          <p className="text-center text-sm text-gray-500">
            By tapping "Continue", you agree to our{" "}
            <button className="text-[#9B7EC8] underline">Privacy Policy</button> &{" "}
            <button className="text-[#9B7EC8] underline">Terms of Service</button>
          </p>
        </div>
      </div>
    )
  }

  // Step 1: Personal Details
  if (step === "step1") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4 flex items-center justify-end">
          <Sparkles className="w-6 h-6 text-gray-400" />
        </div>
        <div className="px-6">
          <div className="h-1 bg-gray-200 rounded-full mb-8">
            <div className="h-1 rounded-full transition-all" style={{ width: `${getProgress()}%`, backgroundColor: FLARE_PRIMARY }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your free trial is now active</h1>
          <p className="text-gray-600 mb-8">We'll use your name and number to set up your account and personalize your experience.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-gray-900 focus:border-[#9B7EC8] focus:ring-1 focus:ring-[#9B7EC8] outline-none"
                placeholder="Alex Smith"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-gray-900 focus:border-[#9B7EC8] focus:ring-1 focus:ring-[#9B7EC8] outline-none"
                placeholder="(555) 123-4567"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <button
                onClick={() => setSmsConsent(!smsConsent)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  smsConsent ? "bg-[#9B7EC8] border-[#9B7EC8]" : "border-gray-300"
                }`}
              >
                {smsConsent && <Check className="w-4 h-4 text-white" />}
              </button>
              <span className="text-sm text-gray-600">
                I agree to receive automated SMS messages from Flare, including updates and offers.
                Message and data rates may apply. Reply HELP for help and STOP to cancel.
              </span>
            </label>
          </div>
        </div>
        <div className="mt-auto p-6">
          <button
            onClick={() => setStep("step2")}
            disabled={!fullName || !phone}
            className="w-full py-4 rounded-xl font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: FLARE_PRIMARY }}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  // Step 2: Business Info
  if (step === "step2") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4 flex items-center justify-end">
          <Sparkles className="w-6 h-6 text-gray-400" />
        </div>
        <div className="px-6">
          <div className="h-1 bg-gray-200 rounded-full mb-8">
            <div className="h-1 rounded-full transition-all" style={{ width: `${getProgress()}%`, backgroundColor: FLARE_PRIMARY }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your business</h1>
          <p className="text-gray-600 mb-8">Personalize Flare with features that are specifically designed for businesses just like yours.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Company name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-gray-900 focus:border-[#9B7EC8] focus:ring-1 focus:ring-[#9B7EC8] outline-none"
                placeholder="Your Company"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Select your industry</label>
              <button
                onClick={() => setShowIndustrySheet(true)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-left flex items-center justify-between"
              >
                <span className={industry ? "text-gray-900" : "text-gray-400"}>
                  {industry || "Select your industry"}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-auto p-6">
          <button
            onClick={() => setStep("step3")}
            disabled={!companyName || !industry}
            className="w-full py-4 rounded-xl font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: FLARE_PRIMARY }}
          >
            Next
          </button>
        </div>

        {/* Industry Bottom Sheet */}
        {showIndustrySheet && (
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowIndustrySheet(false)}>
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">Select an industry</h2>
                <button onClick={() => setShowIndustrySheet(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                {industries.map((cat) => (
                  <div key={cat.category} className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{cat.category}</h3>
                    {cat.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setIndustry(item)
                          setShowIndustrySheet(false)
                        }}
                        className="block w-full text-left py-3 pl-4 text-gray-700 hover:bg-gray-50"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Step 3: Business at a Glance
  if (step === "step3") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4 flex items-center justify-end">
          <Sparkles className="w-6 h-6 text-gray-400" />
        </div>
        <div className="px-6">
          <div className="h-1 bg-gray-200 rounded-full mb-8">
            <div className="h-1 rounded-full transition-all" style={{ width: `${getProgress()}%`, backgroundColor: FLARE_PRIMARY }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your business at a glance</h1>
          <p className="text-gray-600 mb-8">We'll use this information to suggest the right tools and workflows for your team.</p>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">How many people work at your company (including you)?</h3>
            <div className="flex flex-wrap gap-2">
              {teamSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setTeamSize(size)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    teamSize === size
                      ? "bg-[#0A2540] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">How many years have you been in business?</h3>
            <div className="flex flex-wrap gap-2">
              {yearsOptions.map((years) => (
                <button
                  key={years}
                  onClick={() => setYearsInBusiness(years)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    yearsInBusiness === years
                      ? "bg-[#0A2540] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {years}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-auto p-6">
          <button
            onClick={() => setStep("step4")}
            disabled={!teamSize || !yearsInBusiness}
            className="w-full py-4 rounded-xl font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: FLARE_PRIMARY }}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  // Step 4: Budget
  if (step === "step4") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4 flex items-center justify-end">
          <Sparkles className="w-6 h-6 text-gray-400" />
        </div>
        <div className="px-6">
          <div className="h-1 bg-gray-200 rounded-full mb-8">
            <div className="h-1 rounded-full transition-all" style={{ width: `${getProgress()}%`, backgroundColor: FLARE_PRIMARY }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly ad budget</h1>
          <p className="text-gray-600 mb-8">This helps us recommend the right campaign strategies for your goals.</p>
          
          <div className="grid grid-cols-2 gap-3">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`p-4 rounded-xl text-center font-medium transition-all ${
                  budget === b
                    ? "bg-[#9B7EC8] text-white ring-2 ring-[#9B7EC8] ring-offset-2"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-6">
          <button
            onClick={() => setStep("step5")}
            disabled={!budget}
            className="w-full py-4 rounded-xl font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: FLARE_PRIMARY }}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  // Step 5: Connect Accounts
  if (step === "step5") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4 flex items-center justify-end">
          <Sparkles className="w-6 h-6 text-gray-400" />
        </div>
        <div className="px-6">
          <div className="h-1 bg-gray-200 rounded-full mb-8">
            <div className="h-1 rounded-full transition-all" style={{ width: `${getProgress()}%`, backgroundColor: FLARE_PRIMARY }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect your ad accounts</h1>
          <p className="text-gray-600 mb-8">Link your advertising accounts to manage everything from Flare.</p>
          
          <div className="space-y-4">
            <button className="w-full p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Facebook Ads</p>
                <p className="text-sm text-gray-500">Connect your Meta Business account</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
            </button>
            <button className="w-full p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-white border flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Google Ads</p>
                <p className="text-sm text-gray-500">Connect your Google Ads account</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
            </button>
          </div>
        </div>
        <div className="mt-auto p-6 space-y-3">
          <button
            onClick={() => setStep("step6")}
            className="w-full py-4 rounded-xl font-semibold text-white"
            style={{ backgroundColor: FLARE_PRIMARY }}
          >
            Continue
          </button>
          <button
            onClick={() => setStep("step6")}
            className="w-full py-4 rounded-xl font-semibold text-gray-600"
          >
            Skip for now
          </button>
        </div>
      </div>
    )
  }

  // Step 6: How did you hear
  if (step === "step6") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4 flex items-center justify-end">
          <Sparkles className="w-6 h-6 text-gray-400" />
        </div>
        <div className="px-6">
          <div className="h-1 bg-gray-200 rounded-full mb-8">
            <div className="h-1 rounded-full transition-all" style={{ width: "100%", backgroundColor: FLARE_PRIMARY }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">We'd love to know...</h1>
          <p className="text-gray-600 mb-2">How did you hear about Flare?</p>
          <p className="text-gray-500 text-sm mb-8">Your feedback helps us improve and reach more businesses like yours. Thanks for sharing!</p>
          
          <div className="flex flex-wrap gap-2">
            {hearOptions.map((option) => (
              <button
                key={option}
                onClick={() => setHearAbout(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  hearAbout === option
                    ? "bg-[#0A2540] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-6">
          <button
            onClick={() => {
              setLoadingProgress(0)
              setStep("loading")
            }}
            className="w-full py-4 rounded-xl font-semibold text-white"
            style={{ backgroundColor: FLARE_PRIMARY }}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  // Loading Screen
  if (step === "loading") {
    return (
      <div 
        className="min-h-screen flex flex-col bg-cover bg-center"
        style={{ 
          backgroundImage: "linear-gradient(to bottom, rgba(10, 37, 64, 0.85), rgba(10, 37, 64, 0.95)), url('/images/hvac-hero.jpg')"
        }}
      >
        <div className="flex-1 flex flex-col justify-end p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome, {fullName || "Friend"}!</h1>
          <p className="text-xl text-white/80 mb-8">Setting up {companyName || "your account"}...</p>
          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#7FFF00] transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Feature Highlight
  if (step === "feature") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4 flex items-center justify-end">
          <Sparkles className="w-6 h-6 text-gray-400" />
        </div>
        <div className="px-6">
          <div className="h-1 bg-[#9B7EC8] rounded-full mb-8" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Floating Cards */}
          <div className="relative w-full max-w-xs h-64 mb-8">
            <div className="absolute top-0 right-0 bg-white rounded-xl shadow-lg p-4 transform rotate-3">
              <p className="font-semibold text-gray-900">New Google Review</p>
              <div className="flex text-yellow-400 mt-1">
                {"★★★★★".split("").map((_, i) => <span key={i}>★</span>)}
              </div>
            </div>
            <div className="absolute top-16 left-0 bg-white rounded-xl shadow-lg p-4 transform -rotate-2">
              <p className="font-semibold text-gray-900">New Online Booking</p>
              <p className="text-sm text-gray-500">Jordan submitted a work request</p>
            </div>
            <div className="absolute bottom-0 right-4 bg-white rounded-xl shadow-lg p-4 transform rotate-1">
              <p className="font-semibold text-gray-900">New Client Referral</p>
              <p className="text-sm text-gray-500">Sarah referred a new client</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Win more work</h2>
          <p className="text-gray-600 text-center max-w-xs">
            Impress your clients with online booking, professional quotes, and automated client prompts for reviews and referrals.
          </p>
        </div>
        <div className="p-6">
          <button
            onClick={() => window.location.href = "/"}
            className="w-full py-4 rounded-xl font-semibold text-white"
            style={{ backgroundColor: FLARE_PRIMARY }}
          >
            Get Started
          </button>
        </div>
      </div>
    )
  }

  return null
}
