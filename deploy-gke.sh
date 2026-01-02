#!/bin/bash

# Configuration - Update these values
PROJECT_ID="your-gcp-project-id"
CLUSTER_NAME="your-cluster-name"
REGION="us-central1"
IMAGE_NAME="umbra-nexus"

echo "→ Deploying Umbra Nexus to GKE..."

# Authenticate with GCP
echo "→ Authenticating with GCP..."
gcloud auth login

# Set the project
echo "→ Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Get cluster credentials
echo "→ Getting cluster credentials..."
gcloud container clusters get-credentials $CLUSTER_NAME --region=$REGION

# Build and push Docker image to GCR
echo "→ Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME:latest .

echo "→ Pushing image to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:latest

# Update deployment.yaml with correct PROJECT_ID
echo "→ Updating Kubernetes manifests..."
sed -i "s/PROJECT_ID/$PROJECT_ID/g" k8s/deployment.yaml

# Apply Kubernetes manifests
echo "→ Applying Kubernetes configurations..."
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Wait for deployment
echo "→ Waiting for deployment to complete..."
kubectl rollout status deployment/umbra-nexus

# Get the external IP
echo "→ Getting service details..."
kubectl get services umbra-nexus-service

echo ""
echo "✓ Deployment complete!"
echo "→ Run 'kubectl get services' to check the external IP"
echo "→ It may take a few minutes for the LoadBalancer IP to be assigned"
