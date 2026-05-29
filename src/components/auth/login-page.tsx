'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Zap,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  MonitorSmartphone,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

// ── macOS Mojave Desert Sunset Background ──────────────────────────────────────
// Authentic Mojave colors: deep indigo sky → rich purple → coral → orange → gold sand

function MojaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient — authentic Mojave sunset (top-to-bottom: indigo → purple → coral → orange → gold) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              #1a1040 0%,
              #2d1b69 15%,
              #5e3c92 28%,
              #8b5a9f 38%,
              #c4736e 50%,
              #d98a5e 60%,
              #e8a555 70%,
              #f0be5a 80%,
              #f5d062 90%,
              #fada6e 100%
            )
          `,
        }}
      />

      {/* Sun glow — positioned at the horizon line */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[500px] w-[500px] rounded-full animate-mojave-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(255,220,130,0.35) 0%, rgba(240,180,90,0.15) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Warm atmospheric orbs — matching the real Mojave palette */}
      <motion.div
        className="absolute -top-10 left-[15%] h-96 w-96 rounded-full"
        style={{ background: 'rgba(94,60,146,0.15)' }}
        animate={{
          x: [0, 20, 0],
          y: [0, -12, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[20%] right-[8%] h-80 w-80 rounded-full"
        style={{ background: 'rgba(139,90,159,0.12)' }}
        animate={{
          x: [0, -18, 0],
          y: [0, 15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[10%] h-72 w-72 rounded-full"
        style={{ background: 'rgba(232,165,85,0.12)' }}
        animate={{
          x: [0, 12, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[55%] right-[15%] h-64 w-64 rounded-full"
        style={{ background: 'rgba(196,115,110,0.1)' }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Desert dune silhouette at the bottom */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        style={{ height: '22%' }}
      >
        <defs>
          <linearGradient id="dune1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c47a3e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5a2b" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="dune2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a06830" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6b4220" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Back dune */}
        <path
          d="M0,120 C200,40 400,90 600,60 C800,30 1000,80 1200,50 C1350,35 1400,65 1440,55 L1440,220 L0,220 Z"
          fill="url(#dune2)"
        />
        {/* Front dune */}
        <path
          d="M0,160 C180,100 350,140 550,110 C750,80 950,130 1150,100 C1300,80 1400,120 1440,105 L1440,220 L0,220 Z"
          fill="url(#dune1)"
        />
      </svg>

      {/* Subtle star-like dots at the top (for the night sky area) */}
      <div
        className="absolute top-0 left-0 right-0 h-[35%] opacity-30"
        style={{
          backgroundImage: `radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 25% 5%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 40% 15%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 55% 8%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1.5px 1.5px at 70% 12%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 85% 6%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 15% 22%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1.5px 1.5px at 92% 18%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 5% 30%, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 48% 25%, rgba(255,255,255,0.3), transparent)`,
          backgroundSize: '100% 100%',
        }}
      />

      {/* Warm vignette at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
    </div>
  )
}

// ── Step 1: Device Activation ────────────────────────────────────────────────

function DeviceActivationStep({
  onActivated,
  onDemoMode,
}: {
  onActivated: () => void
  onDemoMode: () => void
}) {
  const { activateDevice } = useAuthStore()
  const [serialKey, setSerialKey] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  // Format serial key as user types: XXXX-XXXX-XXXX-XXXX
  const formatSerialKey = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    const parts = []
    for (let i = 0; i < cleaned.length && i < 16; i += 4) {
      parts.push(cleaned.slice(i, i + 4))
    }
    return parts.join('-')
  }

  const handleSerialKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSerialKey(e.target.value)
    setSerialKey(formatted)
    if (error) setError('')
  }

  const handleActivate = async () => {
    if (!serialKey || serialKey.length < 19) {
      setError('Please enter a valid serial key (XXXX-XXXX-XXXX-XXXX)')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await activateDevice(serialKey)
      if (success) {
        onActivated()
      } else {
        setError('Invalid serial key. Please check your key and try again.')
      }
    } catch {
      setError('An error occurred during activation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleActivate()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mx-auto flex size-16 items-center justify-center rounded-2xl"
          style={{
            background: 'rgba(94,60,146,0.2)',
            boxShadow: '0 0 0 1px rgba(139,90,159,0.2)',
          }}
        >
          <KeyRound className="size-8" style={{ color: '#c4a0e8' }} />
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">Activate Your Device</h2>
          <p className="mt-1.5 text-sm" style={{ color: 'rgba(220,200,240,0.55)' }}>
            Enter your serial key to activate TenantFlow OS on this device
          </p>
        </motion.div>
      </div>

      {/* Serial Key Input */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="space-y-3"
      >
        <Label htmlFor="serial-key" className="text-sm font-medium" style={{ color: 'rgba(220,200,240,0.7)' }}>
          Serial Key
        </Label>
        <div className="relative">
          <MonitorSmartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: 'rgba(196,160,232,0.4)' }} />
          <Input
            id="serial-key"
            type="text"
            value={serialKey}
            onChange={handleSerialKeyChange}
            onKeyDown={handleKeyDown}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className="h-12 pl-11 pr-4 text-center font-mono text-lg tracking-widest text-white placeholder:text-white/15 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
            maxLength={19}
            autoComplete="off"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
            style={{
              background: 'rgba(220,50,50,0.12)',
              color: '#fca5a5',
              boxShadow: '0 0 0 1px rgba(220,50,50,0.15)',
            }}
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Activate Button */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Button
          onClick={handleActivate}
          disabled={isLoading || serialKey.length < 19}
          className="h-12 w-full font-semibold text-white shadow-lg transition-all duration-200 disabled:opacity-50 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #7b5ea7 0%, #c4736e 50%, #e8a555 100%)',
            boxShadow: '0 8px 24px rgba(94,60,146,0.3)',
          }}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Activating...
            </>
          ) : (
            <>
              Activate Device
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className="relative">
          <Separator style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-3 text-xs"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            or
          </span>
        </div>
      </motion.div>

      {/* Demo Mode Link */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center"
      >
        <button
          onClick={onDemoMode}
          className="group inline-flex items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: 'rgba(220,200,240,0.45)' }}
        >
          <Zap className="size-4" />
          Try Demo Mode — No activation required
          <ArrowRight className="size-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Step 2: Login Form ───────────────────────────────────────────────────────

function LoginFormStep({ onBack }: { onBack: () => void }) {
  const { login, demoLogin } = useAuthStore()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password || 'tenantflow')
      if (!success) {
        setError('Invalid email or password. Try the demo login instead.')
      }
    } catch {
      setError('An error occurred during sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setError('')
    setEmail('demo@tenantflow.io')
    setPassword('demo')

    try {
      await demoLogin()
    } catch {
      setError('Failed to start demo session. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mx-auto flex size-16 items-center justify-center rounded-2xl"
          style={{
            background: 'rgba(94,60,146,0.2)',
            boxShadow: '0 0 0 1px rgba(139,90,159,0.2)',
          }}
        >
          <Shield className="size-8" style={{ color: '#c4a0e8' }} />
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="mt-1.5 text-sm" style={{ color: 'rgba(220,200,240,0.55)' }}>
            Sign in to your TenantFlow OS account
          </p>
        </motion.div>
      </div>

      {/* Login Form */}
      <motion.form
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        onSubmit={handleSignIn}
        className="space-y-4"
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium" style={{ color: 'rgba(220,200,240,0.7)' }}>
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: 'rgba(196,160,232,0.4)' }} />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              placeholder="you@company.com"
              className="h-11 pl-11 text-white placeholder:text-white/20 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium" style={{ color: 'rgba(220,200,240,0.7)' }}>
              Password
            </Label>
            <button
              type="button"
              className="text-xs transition-colors"
              style={{ color: 'rgba(196,160,232,0.4)' }}
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" style={{ color: 'rgba(196,160,232,0.4)' }} />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              placeholder="Enter your password"
              className="h-11 pl-11 pr-11 text-white placeholder:text-white/20 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'rgba(196,160,232,0.4)' }}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            style={{
              borderColor: 'rgba(255,255,255,0.15)',
            }}
            className="data-[state=checked]:bg-[#7b5ea7] data-[state=checked]:border-[#7b5ea7]"
          />
          <Label
            htmlFor="remember"
            className="text-sm cursor-pointer"
            style={{ color: 'rgba(220,200,240,0.5)' }}
          >
            Remember me for 30 days
          </Label>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
            style={{
              background: 'rgba(220,50,50,0.12)',
              color: '#fca5a5',
              boxShadow: '0 0 0 1px rgba(220,50,50,0.15)',
            }}
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full font-semibold text-white shadow-lg transition-all duration-200 disabled:opacity-50 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #7b5ea7 0%, #c4736e 50%, #e8a555 100%)',
            boxShadow: '0 8px 24px rgba(94,60,146,0.3)',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </motion.form>

      {/* Divider */}
      <div className="relative">
        <Separator style={{ background: 'rgba(255,255,255,0.06)' }} />
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-3 text-xs"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          or continue with
        </span>
      </div>

      {/* Demo Login Button */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Button
          onClick={handleDemoLogin}
          disabled={isLoading}
          variant="outline"
          className="h-11 w-full text-white/80 transition-all duration-200 rounded-xl"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Zap className="mr-2 size-4" style={{ color: '#c4a0e8' }} />
          )}
          Demo Login
        </Button>
      </motion.div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center"
      >
        <button
          onClick={onBack}
          className="text-xs transition-colors"
          style={{ color: 'rgba(220,200,240,0.25)' }}
        >
          Back to device activation
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Main Login Page ──────────────────────────────────────────────────────────

type AuthStep = 'activation' | 'login'

export function LoginPage() {
  const [step, setStep] = React.useState<AuthStep>('activation')
  const { isDeviceActivated, _hydrate } = useAuthStore()

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    _hydrate()
  }, [_hydrate])

  // If device is already activated, skip to login
  React.useEffect(() => {
    if (isDeviceActivated) {
      setStep('login')
    }
  }, [isDeviceActivated])

  const handleDemoMode = async () => {
    const { demoLogin } = useAuthStore.getState()
    await demoLogin()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <MojaveBackground />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* macOS-style frosted glass card — with proper mojave-tinted glass */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(26,16,64,0.55)',
            backdropFilter: 'blur(60px) saturate(180%)',
            WebkitBackdropFilter: 'blur(60px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06)',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex size-10 items-center justify-center rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #7b5ea7 0%, #c4736e 50%, #e8a555 100%)',
                  boxShadow: '0 6px 20px rgba(94,60,146,0.4)',
                }}
              >
                <Building2 className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  TenantFlow
                  <span
                    className="ml-1 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #c4a0e8, #e8a555)',
                    }}
                  >
                    OS
                  </span>
                </h1>
              </div>
            </div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: 'rgba(220,200,240,0.3)' }}
            >
              AI-Powered Property Management
            </p>
          </motion.div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 'activation' ? (
              <DeviceActivationStep
                key="activation"
                onActivated={() => setStep('login')}
                onDemoMode={handleDemoMode}
              />
            ) : (
              <LoginFormStep
                key="login"
                onBack={() => setStep('activation')}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs" style={{ color: 'rgba(220,200,240,0.2)' }}>
            © {new Date().getFullYear()} TenantFlow OS · Enterprise Property Intelligence
          </p>
          <div className="mt-2 flex items-center justify-center gap-3 text-xs" style={{ color: 'rgba(220,200,240,0.12)' }}>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Support</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
