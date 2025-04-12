# 2021 Recovery Rebate Credit Maximizer by VK

A comprehensive tax filing tool designed to help users claim the Recovery Rebate Credit on their 2021 tax returns. This tool provides a step-by-step walkthrough of the filing process, making it accessible even for users who have never filed taxes before or are unfamiliar with prior year filings.

## Features

- **Comprehensive Walkthrough**: Step-by-step guide for filing prior year tax returns, specifically designed for users unfamiliar with tax filing
- **Recovery Rebate Credit Calculator**: Determine eligibility and calculate the exact credit amount based on user inputs
- **Complete Forms Library**: All necessary tax forms and resources provided within the tool
- **Interactive Filing Process**: User-friendly interface with clear instructions at each step
- **Educational Content**: Explanations of tax terms, filing statuses, and credit eligibility
- **Document Management**: Upload and organize tax documents
- **Secure Data Handling**: Protection for sensitive personal and financial information
- **Mobile Responsive Design**: Accessible on all devices

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+) with modular architecture
- **Styling**: Custom CSS with responsive design and dark mode support
- **PDF Handling**: PDF viewing capabilities
- **Form Validation**: Client-side validation for all user inputs
- **Local Storage**: Browser local storage for saving progress and preferences
- **Static Site**: Designed for GitHub Pages deployment

## Key Components

### 1. Comprehensive Walkthrough Module

The walkthrough module provides detailed guidance on every aspect of filing for the Recovery Rebate Credit, including:

- Understanding prior year tax filing requirements
- Document gathering and organization
- Filing status selection guidance
- Detailed explanations of the Recovery Rebate Credit
- Step-by-step form completion instructions
- Filing submission guidance
- Post-filing expectations and tracking

### 2. Tax Forms Library

A complete collection of all forms needed for 2021 tax filing, including:

- Form 1040 and all relevant schedules
- Supporting forms (W-2, 1099, etc.)
- IRS letters and notices related to stimulus payments
- Comprehensive guides and instructions

### 3. Recovery Rebate Credit Calculator

An interactive calculator that:

- Determines eligibility based on filing status and income
- Calculates the exact credit amount
- Provides detailed explanations of the calculation
- Generates a summary that can be used in the filing process

## Project Structure

- `index.html`: Main HTML file
- `src/`: Source code directory
  - `static/`: Static assets
    - `css/`: Stylesheets
      - `modules/`: CSS modules for specific components
    - `js/`: JavaScript files
      - `modules/`: JS modules for specific functionality
    - `images/`: Image assets
    - `forms/`: Tax form PDFs and resources

## Deployment Options

### Option 1: Deployment to Render (Recommended)

This application can be easily deployed to Render, which provides a free tier for web services. Follow these steps to deploy:

1. **Create a Render Account**
   - Sign up at [render.com](https://render.com)

2. **Connect Your GitHub Repository**
   - In the Render dashboard, connect your GitHub account
   - Select the repository containing this project

3. **Create a New Web Service**
   - Click "New Web Service"
   - Select your repository
   - Render will automatically detect the configuration from `render.yaml`
   - Click "Create Web Service"

4. **Access Your Site**
   - Once deployed, your site will be available at the URL provided by Render
   - Render automatically provides HTTPS and a global CDN

### Option 2: Deployment to GitHub Pages

Alternatively, you can deploy as a static site on GitHub Pages:

1. **Fork or Clone this Repository**

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll down to the "GitHub Pages" section
   - Select the branch you want to deploy from (usually "main")
   - Click "Save"

3. **Access Your Site**
   - Your site will be available at `https://[username].github.io/[repository-name]/`
   - It may take a few minutes for your site to be published

## Local Development

To run this project locally:

### Option 1: Running as a Static Site

1. Clone the repository
2. Open the `index.html` file in your browser

No build process or server is required for the static site version.

### Option 2: Running with Flask Server

1. Clone the repository
2. Create a virtual environment:

   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - Windows: `.venv\Scripts\activate`
   - macOS/Linux: `source .venv/bin/activate`

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Run the application:

   ```bash
   python src/main_app.py
   ```

6. Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser

## Usage

1. Open the website in your browser
2. Start with the walkthrough to understand the filing process
3. Use the calculator to determine eligibility and credit amount
4. Access the forms library for any needed documents
5. Complete the filing process step by step

## Accessibility

The tool is designed to be accessible to all users, including:

- Clear, jargon-free language
- High contrast mode for visually impaired users
- Keyboard navigation support
- Screen reader compatibility
- Responsive design for all devices
