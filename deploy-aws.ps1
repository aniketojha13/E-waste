# ==============================================================================
# Turnkey AWS Automated Deployment Script for E-Waste Management System
# ==============================================================================

param(
    [string]$Region = "ap-south-1",
    [string]$Stage = "prod",
    [string]$StackName = "ewaste-management-prod"
)

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 ========================================================" -ForegroundColor Cyan
Write-Host "   E-Waste Management System — Full AWS Deployment" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# 1. Check AWS CLI
Write-Host "🔍 [1/7] Checking AWS CLI & Credentials..." -ForegroundColor Yellow
$awsCmd = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsCmd) {
    Write-Host "❌ AWS CLI is not found in your PATH." -ForegroundColor Red
    Write-Host "   Please install it or restart your shell if recently installed." -ForegroundColor Yellow
    exit 1
}

try {
    $identityJson = & aws sts get-caller-identity --output json 2>&1
    $identity = $identityJson | ConvertFrom-Json
    Write-Host "   ✅ Authenticated with AWS Account: $($identity.Account) ($($identity.Arn))`n" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS credentials are not configured or expired." -ForegroundColor Red
    Write-Host "   Please run:" -ForegroundColor Yellow
    Write-Host "      aws configure" -ForegroundColor White
    Write-Host "   and enter your AWS Access Key ID, Secret Key, and Region ($Region).`n" -ForegroundColor Yellow
    exit 1
}

# 2. Check or Create SSM Parameter for JWT_SECRET
Write-Host "🔐 [2/7] Checking JWT_SECRET in AWS Systems Manager Parameter Store..." -ForegroundColor Yellow
$secretName = "/ewaste/JWT_SECRET"
$paramExists = & aws ssm get-parameter --name $secretName --region $Region 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Generating secure JWT secret in SSM Parameter Store..." -ForegroundColor Gray
    $generatedSecret = [System.Guid]::NewGuid().ToString() + "-" + [System.Guid]::NewGuid().ToString()
    & aws ssm put-parameter --name $secretName --type "SecureString" --value $generatedSecret --overwrite --region $Region
    Write-Host "   ✅ Created SSM parameter $secretName`n" -ForegroundColor Green
} else {
    Write-Host "   ✅ SSM parameter $secretName already exists`n" -ForegroundColor Green
}

# 3. Check SAM CLI
Write-Host "📦 [3/7] Checking AWS SAM CLI..." -ForegroundColor Yellow
$samBin = "C:\Program Files\Amazon\AWSSAMCLI\bin"
if (Test-Path $samBin) {
    if ($env:PATH -notlike "*$samBin*") {
        $env:PATH = "$samBin;$env:PATH"
    }
}
$samCmd = Get-Command sam -ErrorAction SilentlyContinue
if (-not $samCmd) {
    Write-Host "⚠️ AWS SAM CLI is not detected." -ForegroundColor Yellow
    Write-Host "   Installing AWS SAM CLI via winget..." -ForegroundColor Gray
    try {
        winget install Amazon.SAM-CLI --accept-package-agreements --accept-source-agreements
        Write-Host "   ✅ AWS SAM CLI installed! Restart terminal or re-run this script." -ForegroundColor Green
    } catch {
        Write-Host "   Please install AWS SAM CLI from: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html" -ForegroundColor Yellow
    }
    exit 1
}

# 4. Build Backend with SAM
Write-Host "⚙️ [4/7] Building Serverless Backend (Lambda + API Gateway)..." -ForegroundColor Yellow
& sam build --template-file template.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ SAM build failed." -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ SAM build completed successfully`n" -ForegroundColor Green

# 5. Deploy CloudFormation Stack
Write-Host "☁️ [5/7] Deploying Infrastructure to AWS CloudFormation..." -ForegroundColor Yellow
Write-Host "   Creating/Updating DynamoDB tables, S3 buckets, Lambda function, and CloudFront CDN..." -ForegroundColor Gray

& sam deploy `
    --stack-name $StackName `
    --region $Region `
    --capabilities CAPABILITY_IAM `
    --resolve-s3 `
    --no-confirm-changeset `
    --parameter-overrides "Stage=$Stage"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ SAM deploy failed." -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ CloudFormation stack deployed successfully`n" -ForegroundColor Green

# 6. Retrieve Outputs
Write-Host "📡 [6/7] Retrieving Deployed Endpoints..." -ForegroundColor Yellow
$outputsJson = & aws cloudformation describe-stacks --stack-name $StackName --region $Region --query "Stacks[0].Outputs" --output json | ConvertFrom-Json

$apiUrl = ($outputsJson | Where-Object { $_.OutputKey -eq "ApiUrl" }).OutputValue
$cloudFrontUrl = ($outputsJson | Where-Object { $_.OutputKey -eq "CloudFrontUrl" }).OutputValue
$siteBucket = ($outputsJson | Where-Object { $_.OutputKey -eq "SiteBucketName" }).OutputValue

Write-Host "   API Gateway URL:  $apiUrl" -ForegroundColor Cyan
Write-Host "   CloudFront URL:   $cloudFrontUrl" -ForegroundColor Cyan
Write-Host "   S3 Frontend:      $siteBucket`n" -ForegroundColor Gray

# 7. Seed Admin & Agents in real DynamoDB
Write-Host "🌱 [6.5] Seeding Admin & Agents into AWS DynamoDB..." -ForegroundColor Yellow
$env:USERS_TABLE = "ewaste-users"
$env:AWS_REGION = $Region
node backend/scripts/seed-admin.js
Write-Host "   ✅ Initial accounts seeded into DynamoDB`n" -ForegroundColor Green

# 8. Build & Upload Frontend
Write-Host "🌐 [7/7] Building Frontend & Uploading to S3 + CloudFront..." -ForegroundColor Yellow
$env:VITE_API_URL = $apiUrl
npm run build --prefix client
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed." -ForegroundColor Red
    exit 1
}

Write-Host "   Syncing client/dist to s3://$siteBucket..." -ForegroundColor Gray
& aws s3 sync client/dist "s3://$siteBucket" --delete --region $Region

# Invalidate CloudFront cache
$distId = & aws cloudfront list-distributions --query "DistributionList.Items[?DefaultCacheBehavior.TargetOriginId=='S3Origin'].Id | [0]" --output text --region $Region
if ($distId -and $distId -ne "None") {
    Write-Host "   Invalidating CloudFront distribution $distId cache..." -ForegroundColor Gray
    & aws cloudfront create-invalidation --distribution-id $distId --paths "/*" --region $Region | Out-Null
}

Write-Host "`n🎉 ========================================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT TO AWS COMPLETE!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "   🌐 Live Website:     $cloudFrontUrl" -ForegroundColor White
Write-Host "   🔌 Live API Gateway: $apiUrl" -ForegroundColor White
Write-Host "   👤 Admin Login:      admin / admin123" -ForegroundColor White
Write-Host "   🚚 Agent Login:      agent1 / agent123" -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Green
