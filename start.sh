#!/bin/bash
# Start script that ensures correct DATABASE_URL for Neon PostgreSQL
export DATABASE_URL="postgresql://neondb_owner:npg_0LaXsMl2YzBt@ep-royal-recipe-apb3473r-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
export DIRECT_URL="postgresql://neondb_owner:npg_0LaXsMl2YzBt@ep-royal-recipe-apb3473r-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
exec npx next dev -p 3000 --webpack 2>&1 | tee /home/z/my-project/dev.log
