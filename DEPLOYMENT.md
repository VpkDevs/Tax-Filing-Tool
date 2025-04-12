# Deployment Guide for Tax Filing Tool

This guide provides step-by-step instructions for deploying the Tax Filing Tool to Render.

## Prerequisites

- A GitHub account with the Tax Filing Tool repository
- A Render account (free tier is sufficient)

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up for a free account
3. Verify your email address

### 3. Connect Your GitHub Repository

1. In the Render dashboard, click on "New" in the top right corner
2. Select "Web Service"
3. Click on "Connect account" under GitHub
4. Authorize Render to access your GitHub repositories
5. Find and select your Tax Filing Tool repository

### 4. Configure Your Web Service

Render will automatically detect the `render.yaml` configuration file in your repository. If not, configure manually:

- **Name**: tax-filing-tool (or your preferred name)
- **Environment**: Python
- **Region**: Choose the region closest to your users
- **Branch**: main (or your deployment branch)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn src.main_app:app`
- **Plan**: Free

### 5. Environment Variables

No environment variables are required for the basic deployment. If you need to add any in the future:

1. Go to your web service dashboard
2. Click on "Environment" in the left sidebar
3. Add key-value pairs as needed
4. Click "Save Changes"

### 6. Deploy Your Application

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for the deployment to complete (this may take a few minutes)

### 7. Access Your Application

Once deployed, your application will be available at:
`https://tax-filing-tool.onrender.com` (or your custom subdomain)

### 8. Custom Domain (Optional)

To use a custom domain:

1. Go to your web service dashboard
2. Click on "Settings" in the left sidebar
3. Scroll down to "Custom Domain"
4. Click "Add Custom Domain"
5. Follow the instructions to configure your DNS settings

## Troubleshooting

### Deployment Failures

If your deployment fails:

1. Check the build logs for errors
2. Verify that your `requirements.txt` file includes all dependencies
3. Make sure your `Procfile` and `render.yaml` are correctly configured
4. Check that your application runs locally without errors

### Application Errors

If your application deploys but doesn't work correctly:

1. Check the application logs in the Render dashboard
2. Verify that your application works locally
3. Check for environment-specific code that might not work in production

## Maintenance

### Updating Your Application

To update your application:

1. Push changes to your GitHub repository
2. Render will automatically rebuild and deploy your application

### Monitoring

Render provides basic monitoring for your application:

1. Go to your web service dashboard
2. Click on "Logs" in the left sidebar to view application logs
3. Click on "Metrics" to view performance metrics

## Support

If you encounter any issues with Render:

- Check the [Render documentation](https://render.com/docs)
- Contact Render support through their dashboard
