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

// ── Mojave Solid Background ────────────────────────────────────────────────────

function MojaveBackground() {
  return (
    <div className="absolute inset-0" style={{ background: '#2d1b69' }} />
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
          style={{ background: '#5e3c92' }}
        >
          <KeyRound className="size-8 text-white" />
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">Activate Your Device</h2>
          <p className="mt-1.5 text-sm text-white/45">
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
        <Label htmlFor="serial-key" className="text-sm font-medium text-white/60">
          Serial Key
        </Label>
        <div className="relative">
          <MonitorSmartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/30" />
          <Input
            id="serial-key"
            type="text"
            value={serialKey}
            onChange={handleSerialKeyChange}
            onKeyDown={handleKeyDown}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className="h-12 pl-11 pr-4 text-center font-mono text-lg tracking-widest text-white placeholder:text-white/15 rounded-xl bg-white/[0.07] border-white/[0.1]"
            maxLength={19}
            autoComplete="off"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2.5 text-sm text-red-300 border border-red-500/20"
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
          className="h-12 w-full font-semibold text-white transition-all duration-200 disabled:opacity-50 rounded-xl"
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

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className="relative">
          <Separator className="bg-white/8" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-3 text-xs text-white/20">
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
          className="group inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors duration-200"
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
          style={{ background: '#5e3c92' }}
        >
          <Shield className="size-8 text-white" />
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="mt-1.5 text-sm text-white/45">
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
          <Label htmlFor="email" className="text-sm font-medium text-white/60">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              placeholder="you@company.com"
              className="h-11 pl-11 text-white placeholder:text-white/20 rounded-xl bg-white/[0.07] border-white/[0.1]"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-white/60">
              Password
            </Label>
            <button
              type="button"
              className="text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/30" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              placeholder="Enter your password"
              className="h-11 pl-11 pr-11 text-white placeholder:text-white/20 rounded-xl bg-white/[0.07] border-white/[0.1]"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors"
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
            className="border-white/15 data-[state=checked]:bg-[#5e3c92] data-[state=checked]:border-[#5e3c92]"
          />
          <Label
            htmlFor="remember"
            className="text-sm cursor-pointer text-white/40"
          >
            Remember me for 30 days
          </Label>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2.5 text-sm text-red-300 border border-red-500/20"
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full font-semibold text-white transition-all duration-200 disabled:opacity-50 rounded-xl"
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
        <Separator className="bg-white/8" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-3 text-xs text-white/18">
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
          className="h-11 w-full text-white/70 hover:text-white/90 transition-all duration-200 rounded-xl border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.08]"
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
          className="text-xs text-white/20 hover:text-white/35 transition-colors"
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
        className="relative z-10 w-full max-w-md"
      >
        {/* Solid card */}
        <div
          className="rounded-2xl p-8 border border-white/[0.08]"
          style={{ background: '#3b2470' }}
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
                className="flex size-10 items-center justify-center rounded-xl"
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
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/25">
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
          <p className="text-xs text-white/18">
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
