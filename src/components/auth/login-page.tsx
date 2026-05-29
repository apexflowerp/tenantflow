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

// ── macOS Mojave Desert Background ────────────────────────────────────────────

function MojaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient — warm Mojave desert tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-rose-900" />

      {/* Sand dune layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-transparent to-orange-900/30" />

      {/* Sun glow */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2">
        <div className="h-64 w-64 rounded-full bg-amber-400/20 blur-3xl animate-mojave-breathe" />
        <div className="absolute inset-0 h-48 w-48 m-auto rounded-full bg-yellow-300/15 blur-2xl" />
      </div>

      {/* Warm atmospheric orbs */}
      <motion.div
        className="absolute -top-20 right-[10%] h-72 w-72 rounded-full bg-rose-500/10 blur-3xl"
        animate={{
          x: [0, 25, 0],
          y: [0, -15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[5%] h-80 w-80 rounded-full bg-amber-500/8 blur-3xl"
        animate={{
          x: [0, -15, 0],
          y: [0, 25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[40%] right-[20%] h-48 w-48 rounded-full bg-orange-400/8 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Warm vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-950/40" />
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
          className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500/15 ring-1 ring-amber-400/20"
        >
          <KeyRound className="size-8 text-amber-400" />
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">Activate Your Device</h2>
          <p className="mt-1.5 text-sm text-amber-200/60">
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
        <Label htmlFor="serial-key" className="text-sm font-medium text-amber-100/80">
          Serial Key
        </Label>
        <div className="relative">
          <MonitorSmartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-400/40" />
          <Input
            id="serial-key"
            type="text"
            value={serialKey}
            onChange={handleSerialKeyChange}
            onKeyDown={handleKeyDown}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className="h-12 bg-white/[0.06] border-white/[0.08] pl-11 pr-4 text-center font-mono text-lg tracking-widest text-white placeholder:text-white/15 focus:border-amber-500/40 focus:ring-amber-500/15 rounded-xl"
            maxLength={19}
            autoComplete="off"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-300 ring-1 ring-red-500/15"
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
          className="h-12 w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-lg shadow-amber-900/30 transition-all duration-200 disabled:opacity-50 rounded-xl"
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
          <Separator className="bg-white/[0.06]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-3 text-xs text-white/25">
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
          className="group inline-flex items-center gap-2 text-sm text-amber-300/50 hover:text-amber-300/80 transition-colors duration-200"
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
          className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500/15 ring-1 ring-amber-400/20"
        >
          <Shield className="size-8 text-amber-400" />
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="mt-1.5 text-sm text-amber-200/60">
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
          <Label htmlFor="email" className="text-sm font-medium text-amber-100/80">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-400/40" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              placeholder="you@company.com"
              className="h-11 bg-white/[0.06] border-white/[0.08] pl-11 text-white placeholder:text-white/20 focus:border-amber-500/40 focus:ring-amber-500/15 rounded-xl"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-amber-100/80">
              Password
            </Label>
            <button
              type="button"
              className="text-xs text-amber-300/40 hover:text-amber-300/60 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-400/40" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              placeholder="Enter your password"
              className="h-11 bg-white/[0.06] border-white/[0.08] pl-11 pr-11 text-white placeholder:text-white/20 focus:border-amber-500/40 focus:ring-amber-500/15 rounded-xl"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400/40 hover:text-amber-400/70 transition-colors"
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
            className="border-white/15 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
          />
          <Label
            htmlFor="remember"
            className="text-sm text-amber-100/50 cursor-pointer"
          >
            Remember me for 30 days
          </Label>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-300 ring-1 ring-red-500/15"
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-lg shadow-amber-900/30 transition-all duration-200 disabled:opacity-50 rounded-xl"
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
        <Separator className="bg-white/[0.06]" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-3 text-xs text-white/20">
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
          className="h-11 w-full border-white/[0.08] bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-amber-200 transition-all duration-200 rounded-xl"
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Zap className="mr-2 size-4 text-amber-400" />
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
          className="text-xs text-amber-300/30 hover:text-amber-300/50 transition-colors"
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
        {/* macOS-style frosted glass card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-2xl shadow-black/25 backdrop-blur-2xl backdrop-saturate-150">
          {/* Logo */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-600/30">
                <Building2 className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  TenantFlow
                  <span className="ml-1 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">OS</span>
                </h1>
              </div>
            </div>
            <p className="text-[10px] text-amber-200/30 tracking-[0.2em] uppercase">
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
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} TenantFlow OS · Enterprise Property Intelligence
          </p>
          <div className="mt-2 flex items-center justify-center gap-3 text-xs text-white/12">
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
