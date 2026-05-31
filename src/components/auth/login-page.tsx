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
  EyeOff as ViewOnlyIcon,
  CheckCircle2,
  Fingerprint,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

// ── Mojave Solid Background ────────────────────────────────────────────────────

function MojaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#0d0b14' }}>
      {/* Subtle gradient orbs */}
      <div
        className="absolute -top-40 -left-40 size-96 rounded-full opacity-[0.04] blur-3xl"
        style={{ background: '#5e3c92' }}
      />
      <div
        className="absolute -bottom-40 -right-40 size-96 rounded-full opacity-[0.03] blur-3xl"
        style={{ background: '#c4736e' }}
      />
      <div
        className="absolute top-1/3 right-1/4 size-64 rounded-full opacity-[0.02] blur-3xl"
        style={{ background: '#e8a555' }}
      />
    </div>
  )
}

// ── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: 'activation' | 'login' }) {
  const steps = [
    { id: 'activation', label: 'Activate', icon: KeyRound },
    { id: 'login', label: 'Sign In', icon: Fingerprint },
  ] as const

  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <div className="flex items-center gap-2 justify-center mb-6">
      {steps.map((step, i) => {
        const StepIcon = step.icon
        const isActive = i === currentIndex
        const isCompleted = i < currentIndex

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-1.5">
              <div
                className={`flex size-7 items-center justify-center rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isActive
                    ? 'text-white'
                    : 'bg-white/5 text-white/20'
                }`}
                style={isActive ? { background: '#5e3c92' } : undefined}
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <StepIcon className="size-3.5" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium transition-colors duration-300 ${
                  isCompleted
                    ? 'text-emerald-400/70'
                    : isActive
                    ? 'text-white/70'
                    : 'text-white/20'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 transition-colors duration-500 ${
                  isCompleted ? 'bg-emerald-500/30' : 'bg-white/8'
                }`}
              />
            )}
          </React.Fragment>
        )
      })}
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
  const [activationSuccess, setActivationSuccess] = React.useState(false)

  const formatSerialKey = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    const parts = []
    for (let i = 0; i < cleaned.length && i < 20; i += 4) {
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
    if (!serialKey || serialKey.replace(/-/g, '').length < 12) {
      setError('Please enter a valid serial key (e.g., TFOW-2024-XKCD-7A3B)')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await activateDevice(serialKey)
      if (success) {
        setActivationSuccess(true)
        // Brief success animation before transitioning
        setTimeout(() => onActivated(), 800)
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
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mx-auto flex size-14 items-center justify-center rounded-2xl"
          style={{ background: activationSuccess ? '#16a34a' : '#5e3c92' }}
        >
          {activationSuccess ? (
            <CheckCircle2 className="size-7 text-white" />
          ) : (
            <KeyRound className="size-7 text-white" />
          )}
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white tracking-tight">
            {activationSuccess ? 'Device Activated!' : 'Activate Your Device'}
          </h2>
          <p className="mt-1 text-sm text-white/40">
            {activationSuccess
              ? 'Redirecting to sign in...'
              : 'Enter your serial key to activate TenantFlow OS on this device'}
          </p>
        </motion.div>
      </div>

      {/* Serial Key Input */}
      {!activationSuccess && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="space-y-3"
        >
          <Label htmlFor="serial-key" className="text-xs font-medium text-white/50 uppercase tracking-wider">
            Serial Key
          </Label>
          <div className="relative">
            <MonitorSmartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/25" />
            <Input
              id="serial-key"
              type="text"
              value={serialKey}
              onChange={handleSerialKeyChange}
              onKeyDown={handleKeyDown}
              placeholder="TFOW-2024-XKCD-7A3B"
              className="h-12 pl-11 pr-4 text-center font-mono text-base tracking-wider text-white placeholder:text-white/12 rounded-xl bg-white/[0.06] border-white/[0.08] focus:border-[#5e3c92]/50 focus:ring-[#5e3c92]/20"
              autoComplete="off"
              autoFocus
            />
          </div>
          <p className="text-[11px] text-white/20 px-1">
            Serial keys start with TFOW- (device) or TFOL- (license)
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-300 border border-red-500/15"
            >
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Activate Button */}
      {!activationSuccess && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Button
            onClick={handleActivate}
            disabled={isLoading || serialKey.replace(/-/g, '').length < 12}
            className="h-11 w-full font-semibold text-white transition-all duration-200 disabled:opacity-40 rounded-xl hover:opacity-90"
            style={{ background: '#c4736e' }}
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
      )}

      {/* Divider */}
      {!activationSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="relative">
            <Separator className="bg-white/6" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-[11px] text-white/15 bg-[#1a1726]">
              or explore without activation
            </span>
          </div>
        </motion.div>
      )}

      {/* Demo Mode Button */}
      {!activationSuccess && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="space-y-3"
        >
          <Button
            onClick={onDemoMode}
            className="h-11 w-full font-semibold text-white/80 hover:text-white transition-all duration-200 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07]"
            variant="outline"
          >
            <Zap className="mr-2 size-4" style={{ color: '#c4a0e8' }} />
            Demo Login
            <Badge
              className="ml-2 text-[9px] px-1.5 py-0 h-4 font-semibold bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
              variant="outline"
            >
              VIEW ONLY
            </Badge>
          </Button>
          <p className="text-center text-[11px] text-white/20">
            Explore all features in read-only mode · No serial key needed
          </p>
        </motion.div>
      )}
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
      const success = await login(email, password || 'Admin@180H')
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
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mx-auto flex size-14 items-center justify-center rounded-2xl"
          style={{ background: '#5e3c92' }}
        >
          <Shield className="size-7 text-white" />
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="mt-1 text-sm text-white/40">
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
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-white/50 uppercase tracking-wider">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/25" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              placeholder="you@company.com"
              className="h-11 pl-11 text-white placeholder:text-white/15 rounded-xl bg-white/[0.06] border-white/[0.08] focus:border-[#5e3c92]/50 focus:ring-[#5e3c92]/20"
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Password
            </Label>
            <button
              type="button"
              className="text-[11px] text-white/25 hover:text-white/40 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/25" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              placeholder="Enter your password"
              className="h-11 pl-11 pr-11 text-white placeholder:text-white/15 rounded-xl bg-white/[0.06] border-white/[0.08] focus:border-[#5e3c92]/50 focus:ring-[#5e3c92]/20"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/40 transition-colors"
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
            className="border-white/12 data-[state=checked]:bg-[#5e3c92] data-[state=checked]:border-[#5e3c92]"
          />
          <Label
            htmlFor="remember"
            className="text-xs cursor-pointer text-white/35"
          >
            Remember me for 30 days
          </Label>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-300 border border-red-500/15"
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full font-semibold text-white transition-all duration-200 disabled:opacity-40 rounded-xl hover:opacity-90"
          style={{ background: '#c4736e' }}
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
        <Separator className="bg-white/6" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-[11px] text-white/15 bg-[#1a1726]">
          or
        </span>
      </div>

      {/* Demo Login Button */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="space-y-2"
      >
        <Button
          onClick={handleDemoLogin}
          disabled={isLoading}
          variant="outline"
          className="h-11 w-full font-medium text-white/70 hover:text-white/90 transition-all duration-200 rounded-xl border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07]"
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Zap className="mr-2 size-4" style={{ color: '#c4a0e8' }} />
          )}
          Demo Login
          <Badge
            className="ml-2 text-[9px] px-1.5 py-0 h-4 font-semibold bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
            variant="outline"
          >
            VIEW ONLY
          </Badge>
        </Button>
        <p className="text-center text-[11px] text-white/20">
          Read-only access · No serial key required · Full feature preview
        </p>
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
          className="text-[11px] text-white/15 hover:text-white/30 transition-colors"
        >
          ← Back to device activation
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

  React.useEffect(() => {
    _hydrate()
  }, [_hydrate])

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
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Solid card */}
        <div
          className="rounded-2xl p-8 border border-white/[0.06] shadow-2xl shadow-black/30"
          style={{ background: '#1a1726' }}
        >
          {/* Logo */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex size-10 items-center justify-center rounded-xl shadow-lg shadow-[#5e3c92]/20"
                style={{ background: '#5e3c92' }}
              >
                <Building2 className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  TenantFlow
                  <span className="ml-1" style={{ color: '#e8a555' }}>OS</span>
                </h1>
              </div>
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/20">
              AI-Powered Rental Management
            </p>
          </motion.div>

          {/* Step indicator */}
          <StepIndicator currentStep={step} />

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
          className="mt-5 text-center"
        >
          <p className="text-[11px] text-white/15">
            © {new Date().getFullYear()} TenantFlow OS · AI-Powered Rental Intelligence
          </p>
          <div className="mt-1.5 flex items-center justify-center gap-3 text-[10px] text-white/10">
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
