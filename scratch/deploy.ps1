$ErrorActionPreference = "Stop"
Write-Host "Removing old DATABASE_URL..."
npx vercel env rm DATABASE_URL production -y
Write-Host "Adding new DATABASE_URL..."
Write-Output "postgresql://postgres.ypjuuyoxjicaykhqqqsc:PubG76789777%24%24%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" | npx vercel env add DATABASE_URL production
Write-Host "Triggering Production Deployment..."
npx vercel deploy --prod --yes
