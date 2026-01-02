# Configuration - Update these values
$PROJECT_ID = "nitrogen-461513"
$CLUSTER_NAME = "nitrogen"
$REGION = "europe-north2"
$IMAGE_NAME = "umbra-nexus"

Write-Host "→ Deploying Umbra Nexus to GKE..." -ForegroundColor Cyan

# Authenticate with GCP
Write-Host "→ Authenticating with GCP..." -ForegroundColor Yellow
gcloud auth login

# Set the project
Write-Host "→ Setting project to $PROJECT_ID..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Get cluster credentials
Write-Host "→ Getting cluster credentials..." -ForegroundColor Yellow
gcloud container clusters get-credentials $CLUSTER_NAME --region=$REGION

# Configure Docker for GCR
Write-Host "→ Configuring Docker for Google Container Registry..." -ForegroundColor Yellow
gcloud auth configure-docker

# Build and push Docker image to GCR
Write-Host "→ Building Docker image..." -ForegroundColor Yellow
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME`:latest .

Write-Host "→ Pushing image to Google Container Registry..." -ForegroundColor Yellow
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME`:latest

# Update deployment.yaml with correct PROJECT_ID
Write-Host "→ Updating Kubernetes manifests..." -ForegroundColor Yellow
(Get-Content k8s\deployment.yaml) -replace 'PROJECT_ID', $PROJECT_ID | Set-Content k8s\deployment.yaml

# Apply Kubernetes manifests
Write-Host "→ Applying Kubernetes configurations..." -ForegroundColor Yellow
kubectl apply -f k8s\deployment.yaml
kubectl apply -f k8s\service.yaml

# Wait for deployment
Write-Host "→ Waiting for deployment to complete..." -ForegroundColor Yellow
kubectl rollout status deployment/umbra-nexus

# Get the external IP
Write-Host "→ Getting service details..." -ForegroundColor Yellow
kubectl get services umbra-nexus-service

Write-Host ""
Write-Host "✓ Deployment complete!" -ForegroundColor Green
Write-Host "→ Run 'kubectl get services' to check the external IP" -ForegroundColor Cyan
Write-Host "→ It may take a few minutes for the LoadBalancer IP to be assigned" -ForegroundColor Cyan
