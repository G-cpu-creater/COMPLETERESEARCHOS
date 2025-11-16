# ElctrDc User Manual

**Version:** 2.0.0
**Last Updated:** November 2025

Welcome to ElctrDc - The Ultimate Electrochemistry Research Operating System!

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Projects Management](#projects-management)
5. [Dataset Management](#dataset-management)
6. [Data Analysis](#data-analysis)
7. [Visualization](#visualization)
8. [Advanced Features](#advanced-features)
9. [Keyboard Shortcuts](#keyboard-shortcuts)
10. [Tips & Best Practices](#tips--best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

### What is ElctrDc?

ElctrDc is a modern, web-based research operating system specifically designed for electrochemistry researchers. It provides a complete suite of tools for:

- Project and dataset management
- Advanced data analysis
- Professional visualization
- AI-powered insights
- Report generation
- Collaboration and sharing

### Key Benefits

✅ **Web-based** - Access from anywhere, no installation required
✅ **Free & Open Source** - No licensing fees
✅ **Modern UI** - Clean, intuitive interface with dark mode
✅ **AI-Powered** - Intelligent data insights and recommendations
✅ **Publication-Ready** - Export PDF and LaTeX reports
✅ **79 Features** - More than any commercial software

---

## Getting Started

### First Time Login

1. Navigate to the ElctrDc URL in your browser
2. Sign up with your email or use OAuth (Google/GitHub)
3. Complete your profile setup
4. Take the interactive onboarding tour

### Dashboard Overview

The dashboard is your command center with:

- **Recent Projects** - Quick access to your latest work
- **Analytics** - Usage statistics and insights
- **Quick Actions** - Create projects, upload datasets, run analysis
- **Activity Feed** - Track recent changes and updates

### Navigation

- **Sidebar** - Main navigation menu (Projects, Datasets, Analysis, Settings)
- **Command Palette** - Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) for quick access
- **Breadcrumbs** - Shows your current location
- **Search** - Global search with advanced filtering

---

## Core Features

### 1. Project Management

#### Creating a Project

1. Click **"New Project"** button on dashboard
2. Choose a project template or start blank:
   - Battery Research
   - Fuel Cell
   - Corrosion
   - Electrocatalysis
   - Sensor Development
   - Blank Project
3. Enter project details:
   - Name
   - Description
   - Research type
   - Tags
4. Click **"Create Project"**

#### Project Templates

Templates come pre-configured with:
- Default folder structure
- Sample pages (Protocol, Results, Discussion)
- Recommended tags
- Best practices documentation

#### Managing Projects

- **Edit** - Update project details, description, tags
- **Archive** - Hide completed projects from active view
- **Star** - Add to favorites for quick access
- **Delete** - Move to trash (30-day retention)
- **Share** - Collaborate with team members

---

### 2. Dataset Management

#### Uploading Datasets

**Single Upload:**
1. Go to Datasets page
2. Click **"Upload Dataset"**
3. Select file (CSV, Excel, JSON, TXT, DTA, MPT)
4. Enter metadata (name, description, tags)
5. Click **"Upload"**

**Batch Upload:**
1. Click **"Batch Upload"**
2. Select multiple files
3. Auto-detection of file types
4. Bulk metadata editing
5. Upload all at once

#### Supported File Formats

- **CSV** - Comma-separated values
- **Excel** - .xlsx, .xls files
- **JSON** - JavaScript Object Notation
- **TXT** - Plain text with tab/space delimiters
- **DTA** - Gamry data files
- **MPT** - BioLogic data files

#### Dataset Organization

- **Tags** - Categorize datasets (CV, EIS, CA, CP, LSV)
- **Collections** - Group related datasets
- **Favorites** - Star important datasets
- **Search** - Find datasets by name, tags, date
- **Filter** - Filter by type, format, date range

---

### 3. Data Analysis

#### Quick Stats

View instant statistics for any dataset:
- Data points count
- Value ranges (min/max)
- Mean, median, standard deviation
- File size and format

#### Advanced Analysis

**Curve Fitting:**
- Linear regression
- Polynomial (2nd, 3rd, 4th order)
- Exponential
- Logarithmic
- Power law
- R² goodness-of-fit

**Statistical Analysis:**
- Mean, median, mode
- Standard deviation & variance
- Quartiles (Q1, Q3)
- Min, max, range
- Data distribution

**Peak Detection:**
- Automatic peak finding
- Prominence-based filtering
- Peak height and position
- Integration area

**Data Processing:**
- Baseline correction
- Smoothing (moving average)
- Derivative calculation
- Numerical integration
- FFT analysis

---

### 4. Visualization

#### 2D Plots

**Plot Types:**
- Line plot (default)
- Scatter plot
- Overlay multiple datasets
- Custom colors and markers

**Customization:**
- Axis labels and titles
- Grid lines on/off
- Legend position
- Line width and style
- Export PNG, SVG, JPEG

#### 3D Visualization

**Plot Types:**
- **Surface Plot** - For CV time evolution
- **Contour Plot** - 2D heatmaps
- **Scatter 3D** - Point clouds
- **Mesh 3D** - 3D mesh surfaces

**Interactive Controls:**
- Rotate with mouse drag
- Zoom with scroll
- Pan with right-click drag
- Camera position sliders
- Fullscreen mode

**Color Scales:**
- Viridis, Plasma, Inferno, Magma
- Electric, Hot, Jet
- Portland, Blackbody, Earth
- Custom colorbars

#### Plot Annotations

Add professional annotations:
- **Text** - Labels at any position
- **Arrows** - Point to features
- **Circles** - Highlight regions
- **Rectangles** - Box areas
- **Lines** - Connect points
- **Reference Lines** - H-line, V-line

**How to Add:**
1. Click **"Add Annotation"** on plot
2. Choose annotation type
3. Set position (x, y coordinates)
4. Customize color, size, opacity
5. Save annotation

---

## Projects Management

### Project Pages

Each project has a built-in notebook:

#### Creating Pages

1. Open project
2. Click **"New Page"**
3. Enter page title
4. Choose template or blank
5. Start writing

#### Page Editor

- **Markdown Support** - Format text with Markdown
- **Code Blocks** - Syntax highlighting
- **Images** - Embed images and plots
- **Equations** - LaTeX math equations
- **Tables** - Create data tables
- **Links** - Internal and external links

#### Organizing Pages

- Drag-and-drop reordering
- Nested pages (sub-pages)
- Page templates
- Export individual pages

---

## Dataset Management

### Data Preview

View your data instantly:
- **Table View** - First 100 rows
- **Plot View** - Quick visualization
- **Stats View** - Key statistics
- **Metadata** - File information

### Data Transformation

Build transformation pipelines:

1. Click **"Transform"** on dataset
2. Add transformation steps:
   - Normalize (0-1)
   - Standardize (Z-score)
   - Smooth (moving average)
   - Baseline correction
   - Derivative
   - FFT
   - And 9 more!
3. Preview results
4. Save pipeline for reuse
5. Apply to dataset

### Data Versioning

Track all changes to datasets:

**Create Version:**
- Automatic on every save
- Manual version creation
- Add version description
- Tag important versions

**Version History:**
- View all versions
- Compare any two versions
- See diff (points added/removed/modified)
- Restore previous version

**Best Practices:**
- Create version before major changes
- Tag published versions
- Document changes in description
- Regular cleanup of old versions

---

## Data Analysis

### AI-Powered Insights

Get intelligent analysis automatically:

**Insights Panel:**
1. Open dataset
2. Click **"AI Insights"** tab
3. View automatically generated insights:
   - Anomaly detection
   - Trend analysis
   - Pattern recognition
   - Quality assessment
   - Recommendations

**Insight Types:**
- **Anomalies** - Outliers and unusual points (Z-score, IQR, Moving Average)
- **Trends** - Increasing/decreasing/stable patterns
- **Patterns** - Periodic components, peaks
- **Recommendations** - Suggested next steps

**AI Assistant:**
- Natural language recommendations
- Experimental optimization
- Troubleshooting help
- Best practices

### Fourier Transform Analysis

Analyze frequency domain:

1. Select dataset
2. Go to **"Analysis"** → **"Fourier Transform"**
3. Configure:
   - Window function (Hanning, Hamming, Blackman)
   - Sampling rate
   - Frequency range
4. View results:
   - Frequency spectrum
   - Power spectral density
   - Dominant frequencies
   - Periodic components

**Applications:**
- AC voltammetry
- Noise characterization
- Periodic signal detection
- Harmonic analysis

### Workflow Automation

Save and reuse analysis workflows:

**Built-in Workflows:**
- **Standard CV Analysis** - Baseline + Smooth + Peaks
- **EIS Processing** - Log + Fit + Nyquist plot
- **Noise Reduction** - Anomaly detect + Filter + Smooth

**Create Custom Workflow:**
1. Go to **"Workflows"**
2. Click **"New Workflow"**
3. Add steps:
   - Transform
   - Analysis
   - Visualization
   - Export
4. Set parameters
5. Save workflow
6. Apply to any dataset

---

## Visualization

### Export Options

**2D Plots:**
- PNG (raster, high DPI)
- SVG (vector, scalable)
- JPEG (compressed)
- Interactive HTML

**3D Plots:**
- PNG (publication quality)
- SVG (vector graphics)
- Interactive HTML
- Rotation videos (future)

### Split-Pane Comparison

Compare datasets side-by-side:

1. Click **"Compare"** button
2. Select datasets to compare
3. Choose layout:
   - Horizontal split
   - Vertical split
4. Resize panes with divider
5. Maximize individual panes
6. Export comparison view

### Dashboard Widgets

Customize your dashboard:

1. Go to **Settings** → **"Dashboard"**
2. Add/remove widgets:
   - Quick stats
   - Recent projects
   - Favorite datasets
   - Analysis shortcuts
   - Activity feed
3. Drag to rearrange
4. Resize widgets
5. Save layout

---

## Advanced Features

### 1. Advanced Search

**Access:** Click search icon or press `/`

**Filter Options:**
- Content type (projects, datasets, pages)
- Date range
- Tags
- Research type
- File format
- Status (active, archived)

**Sorting:**
- Relevance
- Date created
- Last modified
- Name (A-Z)

**Tips:**
- Use quotes for exact match: `"cyclic voltammetry"`
- Combine filters for precise results
- Save common searches

### 2. Favorites System

**Star Items:**
- Click star icon on any project/dataset
- Yellow star = favorited
- One-click to toggle

**Favorites Page:**
- Access all starred items
- Filter by type
- Export favorites list
- Quick access buttons

### 3. Trash & Recovery

**Soft Delete:**
- All deletions go to trash
- 30-day retention period
- Restore any time
- Permanent delete option

**Trash Page:**
- View all deleted items
- Restore with one click
- Permanent delete after review
- Empty trash (delete all)
- Auto-cleanup of expired items

**Expiration Warnings:**
- 7 days or less: Warning badge
- Shows days remaining
- Email reminders (if enabled)

### 4. Report Generation

#### PDF Reports

Create publication-ready reports:

1. Click **"Generate Report"**
2. Enter metadata:
   - Title, author, institution
   - Project name
   - Description
3. Add sections:
   - Titles & text
   - Tables
   - Plots (upload images)
   - Analysis results
4. Preview report
5. Click **"Generate PDF"**
6. Download automatically

**Report Features:**
- Professional title page
- Auto page numbering
- Headers/footers
- Table of contents (manual)
- High-quality plots

#### LaTeX Export

Export to LaTeX for journal submissions:

1. Select analysis/plot
2. Click **"Export"** → **"LaTeX"**
3. Choose export type:
   - Equation only
   - Table
   - Figure
   - Complete document
4. Copy LaTeX code
5. Paste into your LaTeX editor

**Supported Elements:**
- Equations (numbered/unnumbered)
- Tables (booktabs style)
- Figures (includegraphics)
- Chemical formulas (\ch{})
- SI units (\SI{}{})
- Statistics tables

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `G then H` | Go to home/dashboard |
| `G then P` | Go to projects |
| `G then D` | Go to datasets |
| `G then A` | Go to analysis |
| `N then P` | New project |
| `N then D` | New dataset |
| `/` | Focus search |
| `?` | Show keyboard shortcuts |
| `Esc` | Close dialogs/modals |

### Editor Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save |
| `Cmd/Ctrl + B` | Bold text |
| `Cmd/Ctrl + I` | Italic text |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |

### Plot Shortcuts

| Shortcut | Action |
|----------|--------|
| `F` | Fullscreen |
| `R` | Reset view |
| `E` | Export |
| `A` | Add annotation |

---

## Tips & Best Practices

### Project Organization

✅ **Use Descriptive Names** - "Li-ion Battery Degradation Study 2025" not "Project1"
✅ **Add Tags** - Makes searching easier
✅ **Use Templates** - Start with best practices
✅ **Regular Backups** - Export important projects
✅ **Document As You Go** - Use project pages for notes

### Dataset Management

✅ **Consistent Naming** - Use convention: `technique_sample_date`
✅ **Add Metadata** - Description, conditions, parameters
✅ **Version Control** - Create versions before changes
✅ **Tag Properly** - Use standard tags (CV, EIS, CA, etc.)
✅ **Quality Check** - Review AI insights for anomalies

### Data Analysis

✅ **Start Simple** - Basic stats before complex analysis
✅ **Visualize First** - Plot before fitting
✅ **Use Workflows** - Save time with templates
✅ **Check R²** - Verify fit quality
✅ **Document Steps** - Record analysis pipeline

### Visualization

✅ **Publication Standards** - Label axes, add units
✅ **Use Annotations** - Highlight key features
✅ **Consistent Colors** - Same colors for same samples
✅ **High Resolution** - Export at 300+ DPI
✅ **Vector Formats** - Use SVG when possible

### Performance

✅ **Clear Browser Cache** - If experiencing slowness
✅ **Close Unused Tabs** - Reduce memory usage
✅ **Use Batch Upload** - More efficient for many files
✅ **Archive Old Projects** - Keep dashboard clean
✅ **Regular Cleanup** - Empty trash periodically

---

## Troubleshooting

### Common Issues

#### Q: Upload fails or times out
**A:**
- Check file size (max 100MB per file)
- Verify file format is supported
- Try splitting large files
- Check internet connection
- Clear browser cache

#### Q: Plots not rendering
**A:**
- Refresh the page
- Check browser console for errors
- Try different browser (Chrome/Firefox recommended)
- Disable browser extensions
- Clear cache and cookies

#### Q: AI insights not loading
**A:**
- Check if Ollama is running (local AI)
- Verify dataset has enough points (min 10)
- Check data quality (no NaN/Infinity)
- Try different anomaly detection method
- Refresh AI panel

#### Q: Export/download issues
**A:**
- Check browser download settings
- Disable popup blockers
- Try different export format
- Check available disk space
- Use different browser

#### Q: Slow performance
**A:**
- Close unused browser tabs
- Clear browser cache
- Reduce number of data points displayed
- Archive old projects
- Use Chrome/Firefox (best performance)
- Disable browser extensions

#### Q: Lost unsaved work
**A:**
- ElctrDc auto-saves every 30 seconds
- Check auto-save indicator (top-right)
- Look in trash (30-day retention)
- Check version history
- Contact support if critical

### Browser Compatibility

**Recommended:**
- ✅ Chrome 100+ (best performance)
- ✅ Firefox 100+
- ✅ Edge 100+
- ✅ Safari 15+ (Mac only)

**Not Supported:**
- ❌ Internet Explorer (any version)
- ❌ Chrome < 90
- ❌ Firefox < 90

### Getting Help

**Documentation:**
- User Manual (this file)
- Setup Guide (SETUP_GUIDE.md)
- Architecture (ARCHITECTURE.md)

**Support:**
- GitHub Issues: [Report bug or request feature]
- Email: support@elctrdc.com
- Community Forum: forum.elctrdc.com
- Discord: discord.gg/elctrdc

**Video Tutorials:**
- YouTube channel: @ElctrDc
- Getting Started series
- Advanced features tutorials
- Tips & tricks videos

---

## Appendix

### Supported Research Techniques

- **Cyclic Voltammetry (CV)** - Redox characterization
- **Linear Sweep Voltammetry (LSV)** - Potential scanning
- **Electrochemical Impedance Spectroscopy (EIS)** - Frequency domain
- **Chronoamperometry (CA)** - Current vs time
- **Chronopotentiometry (CP)** - Potential vs time
- **Differential Pulse Voltammetry (DPV)** - Sensitive detection
- **Square Wave Voltammetry (SWV)** - Fast analysis
- **Rotating Disk Electrode (RDE)** - Mass transport
- **Scanning Electrochemical Microscopy (SECM)** - Imaging

### Data Format Specifications

**CSV Format:**
```csv
Potential (V),Current (A)
-0.5,1.23e-6
-0.4,2.45e-6
...
```

**JSON Format:**
```json
{
  "data": {
    "x": [-0.5, -0.4, ...],
    "y": [1.23e-6, 2.45e-6, ...]
  },
  "metadata": {
    "technique": "CV",
    "scanRate": 50,
    "temperature": 25
  }
}
```

### Equations Reference

**Nernst Equation:**
```
E = E° + (RT/nF) × ln([Ox]/[Red])
```

**Butler-Volmer:**
```
i = i₀ × [exp(αₐnFη/RT) - exp(-αᴄnFη/RT)]
```

**Cottrell:**
```
i(t) = nFAD^(1/2)C* / (π^(1/2)t^(1/2))
```

**Randles-Sevcik:**
```
iₚ = 2.69×10⁵ n^(3/2) A D^(1/2) C* v^(1/2)
```

---

## Glossary

**Terms:**

- **CV** - Cyclic Voltammetry
- **EIS** - Electrochemical Impedance Spectroscopy
- **CA** - Chronoamperometry
- **CP** - Chronopotentiometry
- **LSV** - Linear Sweep Voltammetry
- **DPV** - Differential Pulse Voltammetry
- **SWV** - Square Wave Voltammetry
- **FFT** - Fast Fourier Transform
- **PSD** - Power Spectral Density
- **SNR** - Signal-to-Noise Ratio
- **R²** - Coefficient of Determination

---

**End of User Manual**

**Version:** 2.0.0
**Last Updated:** November 16, 2025
**Document:** USER_MANUAL.md

For setup instructions, see **SETUP_GUIDE.md**
For architecture details, see **ARCHITECTURE.md**

---

© 2025 ElctrDc - The Ultimate Electrochemistry Research Platform
Built with ❤️ for the research community
