---
Task ID: 1
Agent: Main Agent
Task: Implement login page with serial key activation, login fields after activation, and demo login with view-only rights

Work Log:
- Read existing codebase: login-page.tsx, auth-store.ts, device activation API, demo API, login API
- Redesigned auth store to add `isViewOnly` field tracking demo mode
- Completely rewrote login page with:
  - Two-step flow: Device Activation → Login Form
  - Step indicator showing current progress
  - Serial key input with TFOW-/TFOL- format support
  - Demo Login button with "VIEW ONLY" badge on both steps
  - Success animation after device activation
  - Auto-login on demo button click
- Updated backend `/api/auth/demo` to create user with `viewer` role instead of `admin`
- Added view-only banner in main app shell with dismiss functionality
- Added VIEW ONLY and DEMO badges in user info bar
- Fixed Prisma logging to reduce memory usage
- Verified all APIs work: demo login returns `role: "viewer"`, `isViewOnly: true`
- Build succeeds, dev server compiles successfully

Stage Summary:
- Login page now has proper serial key activation flow
- Demo login gives view-only access with `viewer` role
- View-only banner and badges appear in the main app
- Test serial key: TFOW-2024-DEMO-0000
- Demo credentials auto-login on button click
