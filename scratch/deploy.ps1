$ErrorActionPreference = "Continue"

Write-Host "Updating Vercel Environment Variables..."

# We don't necessarily need to remove, but we'll try to add it. Since adding over an existing one might prompt,
# let's just use vercel env rm -y
npx vercel env rm DATABASE_URL production -y 2>$null
npx vercel env rm AUTH_SECRET production -y 2>$null
npx vercel env rm ADMIN_EMAIL production -y 2>$null
npx vercel env rm ADMIN_PASSWORD production -y 2>$null

Write-Host "Setting DATABASE_URL..."
Write-Output "postgresql://postgres.ypjuuyoxjicaykhqqqsc:PubG76789777%24%24%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true" | npx vercel env add DATABASE_URL production

Write-Host "Setting AUTH_SECRET..."
Write-Output "cet-local-dev-secret-change-in-production-32chars" | npx vercel env add AUTH_SECRET production

Write-Host "Setting ADMIN_EMAIL..."
Write-Output "admin@ceylonelitetours.local" | npx vercel env add ADMIN_EMAIL production

Write-Host "Setting ADMIN_PASSWORD..."
Write-Output "ChangeThisPassword1!" | npx vercel env add ADMIN_PASSWORD production

Write-Host "Triggering Production Deployment..."
npx vercel deploy --prod --yes
