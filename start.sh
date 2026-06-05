#!/bin/bash
# Start script that ensures correct DATABASE_URL for Neon PostgreSQL
export DATABASE_URL="postgresql://neondb_owner:npg_2k4canmfWyvD@ep-jolly-violet-apzu92qe-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
export DIRECT_URL="postgresql://neondb_owner:npg_2k4canmfWyvD@ep-jolly-violet-apzu92qe-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
export NODE_OPTIONS="--max-old-space-size=4096"
exec npx next dev -p 3000 -H 0.0.0.0 --turbopack 2>&1 | tee /home/z/my-project/dev.log
