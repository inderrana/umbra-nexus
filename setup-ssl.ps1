# GCP SSL and Domain Setup Script
# Replace YOURDOMAIN.COM with your actual domain

$DOMAIN = "zvuck.com"
$PROJECT = "nitrogen-461513"

Write-Host "Setting up SSL for $DOMAIN..." -ForegroundColor Cyan

# 1. Reserve static IP
Write-Host "`n1. Creating static IP address..." -ForegroundColor Yellow
gcloud compute addresses create umbra-nexus-ip --global --project=$PROJECT

# Get the IP address
$IP = gcloud compute addresses describe umbra-nexus-ip --global --project=$PROJECT --format="get(address)"
Write-Host "Static IP created: $IP" -ForegroundColor Green
Write-Host "ACTION REQUIRED: Point your domain DNS A records to this IP:" -ForegroundColor Red
Write-Host "  @ -> $IP" -ForegroundColor White
Write-Host "  www -> $IP" -ForegroundColor White
Write-Host "`nPress Enter after updating your DNS records..."
Read-Host

# 2. Create SSL certificate
Write-Host "`n2. Creating managed SSL certificate..." -ForegroundColor Yellow
gcloud compute ssl-certificates create umbra-nexus-ssl `
  --domains=$DOMAIN,www.$DOMAIN `
  --global `
  --project=$PROJECT

Write-Host "SSL certificate created (provisioning takes 15-60 minutes)" -ForegroundColor Green

# 3. Update and apply Kubernetes resources
Write-Host "`n3. Updating Kubernetes service to NodePort..." -ForegroundColor Yellow
kubectl apply -f k8s/service.yaml

Write-Host "`n4. Creating Ingress with SSL..." -ForegroundColor Yellow
kubectl apply -f k8s/ingress.yaml

Write-Host "`n5. Updating deployment environment variables..." -ForegroundColor Yellow
kubectl set env deployment/umbra-nexus ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nMonitor SSL certificate status with:" -ForegroundColor Cyan
Write-Host "  gcloud compute ssl-certificates describe umbra-nexus-ssl --global" -ForegroundColor White
Write-Host "`nCheck Ingress status with:" -ForegroundColor Cyan
Write-Host "  kubectl get ingress umbra-nexus-ingress" -ForegroundColor White
Write-Host "  kubectl describe ingress umbra-nexus-ingress" -ForegroundColor White
Write-Host "`nSSL certificate will be active when status shows ACTIVE (15-60 minutes)" -ForegroundColor Yellow
