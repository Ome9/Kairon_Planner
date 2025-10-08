# Kairon Planner - AI-Powered Task Planning

🚀 **An intelligent task planning application with AI-powered plan generation and DevExtreme React components**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Views Documentation](#-views-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 📊 **7 Powerful Views**

1. **List View** - Expandable accordion with edit controls
2. **Timeline View** - Progress bars with colored categories
3. **Board View** - Drag-and-drop Kanban workflow (react-beautiful-dnd)
4. **Analytics View** - Charts and statistics
5. **DataGrid View** ⚡ - Excel-like grid with search, filters, export (PDF/Excel)
6. **Gantt View** 🗓️ - Interactive timeline with dependencies
7. **Scheduler View** 📅 - Calendar with drag-drop scheduling

### 🎯 **Key Capabilities**

- ✅ **AI-Powered Plan Generation** - Generate project plans from goals using Supabase Edge Functions
- ✅ **Drag & Drop** - Reorganize tasks across Kanban columns with visual feedback
- ✅ **Inline Editing** - Edit tasks directly in grid/kanban views
- ✅ **Advanced Filtering** - Search, sort, filter by any field
- ✅ **Export Options** - PDF, Excel, JSON formats
- ✅ **Timeline Visualization** - Gantt chart with task dependencies
- ✅ **Calendar Scheduling** - Day/Week/Month views with drag-drop
- ✅ **Task Management** - Full CRUD operations with modal interface
- ✅ **Category Colors** - Visual organization with 10 distinct colors
- ✅ **Responsive Design** - Works on desktop, tablet, mobile
- ✅ **Dark Theme** - DevExtreme dark theme with Tailwind integration
- ✅ **Modern UI** - Beautiful effects with Framer Motion and Anime.js

---

## 🛠️ Tech Stack

### Core Technologies
- **React 18.3.1** - Modern React with hooks
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.9** - Lightning-fast build tool
- **Bun** - Fast package manager and runtime

### UI Libraries
- **DevExtreme React** - Enterprise-grade UI components
  - DataGrid (Excel-like grid)
  - Gantt (Timeline chart)
  - Scheduler (Calendar)
- **shadcn/ui** - Beautiful, accessible Tailwind components (40+)
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Anime.js** - Advanced micro-interactions

### State & Data
- **Supabase** - Backend, database, and AI gateway
- **react-beautiful-dnd** - Drag-and-drop for Kanban
- **Lucide React** - Modern icon library

### Export & Utilities
- **jsPDF** - PDF generation
- **ExcelJS** - Excel export
- **date-fns** - Date manipulation
- **recharts** - Charts for analytics

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** or **Bun** installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd kairon-planner

# Install dependencies (using bun)
bun install

# Or using npm
npm install

# Start development server
npm run dev
# Or with bun
bun run dev
```

Visit **http://localhost:8080** (or the port shown in terminal)

---

## 📖 Usage Guide

### 1. Generate a Plan

1. Enter your project goal in the hero section text area
2. Click **"Generate"** button
3. Wait for AI to generate tasks (powered by Supabase Edge Functions)
4. Tasks automatically populate with realistic estimates and dependencies

### 2. Switch Between Views

Use the horizontal **view toggle** at the top of the plan display:

- **List** - Quick overview with expand/collapse
- **Timeline** - Visual progress with duration bars
- **Board** - Kanban with drag-drop between status columns
- **Analytics** - Charts showing task distribution and progress
- **DataGrid** - Powerful grid with sorting, filtering, search
- **Gantt** - Timeline with dependencies and critical path
- **Scheduler** - Calendar view with day/week/month modes

### 3. Edit Tasks

**Three ways to edit:**

1. **Inline Editing** (DataGrid/Board):
   - Click directly on task fields
   - Changes save automatically

2. **Task Details Modal**:
   - Click on any task card/row
   - Opens full modal with tabs (Details, Dependencies, Subtasks)
   - Edit all fields with rich form controls

3. **Drag & Drop** (Board/Gantt/Scheduler):
   - Drag cards between status columns (Kanban)
   - Drag task bars to reschedule (Gantt)
   - Drag appointments to new time slots (Scheduler)

### 4. Export Data

- **Excel Export**: DataGrid view → Click **"Excel"** button
- **PDF Export**: DataGrid/Gantt view → Click **"PDF"** button  
- **JSON Export**: Any view → Click **"Export JSON"** button (top-right)

### 4. Export Data

- **Excel Export**: DataGrid view → Click **"Excel"** button
- **PDF Export**: DataGrid/Gantt view → Click **"PDF"** button  
- **JSON Export**: Any view → Click **"Export JSON"** button (top-right)

### 5. Advanced Features

**DataGrid View:**
- **Search**: Global search box (top-left)
- **Filter**: Click filter icon in column headers
- **Sort**: Click column names (multi-column with Shift+Click)
- **Column Chooser**: Show/hide columns with "Columns" button
- **Pagination**: Adjust items per page (10/20/50/100)

**Gantt View:**
- **Dependencies**: Visual arrows show task relationships
- **Zoom**: Adjust timeline scale with +/- buttons
- **Critical Path**: Automatically calculated and highlighted
- **Task Editing**: Double-click bars to edit task details

**Scheduler View:**
- **View Modes**: Switch between Day, Week, Month
- **Drag-and-Drop**: Move appointments across time slots
- **Time Zones**: Respects local timezone settings
- **Recurring Tasks**: Support for repeated events

---

## 🏗️ Project Structure

```
kairon-planner/
├── src/
│   ├── components/
│   │   ├── DevExtremeProvider.tsx       # Theme wrapper for DevExtreme
│   │   ├── TaskDetailsModal.tsx         # Full task editor with tabs
│   │   ├── PlanDisplay.tsx              # Main container for all views
│   │   ├── ViewToggle.tsx               # 7-view selector component
│   │   ├── HeroSection.tsx              # Landing page with lamp effect
│   │   ├── ui/                          # shadcn/ui components (40+)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (accordion, tabs, etc.)
│   │   └── views/
│   │       ├── ListView.tsx             # Expandable accordion list
│   │       ├── TimelineView.tsx         # Progress bars with durations
│   │       ├── KanbanView.tsx           # Drag-drop Kanban board
│   │       ├── AnalyticsView.tsx        # Charts and statistics
│   │       ├── DataGridView.tsx         # DevExtreme DataGrid
│   │       ├── GanttView.tsx            # DevExtreme Gantt chart
│   │       └── SchedulerView.tsx        # DevExtreme Scheduler
│   ├── types/
│   │   └── plan.ts                      # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts                     # Utility functions
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts                # Supabase client config
│   │       └── types.ts                 # Database types
│   ├── pages/
│   │   ├── Index.tsx                    # Main app page
│   │   └── NotFound.tsx                 # 404 page
│   ├── App.tsx                          # Root component
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Global styles
├── supabase/
│   ├── functions/
│   │   └── generate-plan/               # Edge function for AI
│   │       └── index.ts
│   └── config.toml                      # Supabase config
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── components.json                      # shadcn/ui config
├── tailwind.config.ts                   # Tailwind configuration
├── vite.config.ts                       # Vite build config
├── tsconfig.json                        # TypeScript config
└── package.json                         # Dependencies
```

---

## 📊 Views Documentation

### 1. List View
**Purpose**: Quick overview with expandable sections

**Features**:
- Accordion-style expandable items
- Category color badges
- Duration and dependency indicators
- Edit button per task
- Compact design for large task lists

**Best For**: Quick scanning, simple task lists

---

### 2. Timeline View
**Purpose**: Visual representation of task durations

**Features**:
- Horizontal progress bars
- Color-coded by category
- Shows start/end dates
- Duration labels
- Responsive grid layout

**Best For**: Understanding task timelines at a glance

---

### 3. Board View (Kanban)
**Purpose**: Workflow management with drag-and-drop

**Features**:
- 4 status columns: Not Started, In Progress, Review, Completed
- Drag cards between columns to update status
- Visual feedback during drag
- Category color indicators
- Task count per column
- Automatic state updates

**Technology**: `react-beautiful-dnd`

**Best For**: Agile workflows, sprint planning, visual task management

**How It Works**:
```typescript
// Drag-and-drop flow
onDragEnd(result) {
  1. Extract source/destination columns
  2. Update task status based on column
  3. Reorder tasks within column
  4. Update state and persist changes
}
```

---

### 4. Analytics View
**Purpose**: Visual insights and statistics

**Features**:
- Task distribution by category (pie chart)
- Task distribution by status (bar chart)
- Progress metrics (completion percentage)
- Total task count
- Estimated total duration
- Interactive charts with hover tooltips

**Technology**: `recharts`

**Best For**: Project reporting, stakeholder updates, progress tracking

---

### 5. DataGrid View
**Purpose**: Excel-like data management

**Features**:
- **Search**: Global instant search across all fields
- **Filtering**: Header filters for each column
- **Sorting**: Multi-column sorting (Shift+Click)
- **Column Chooser**: Show/hide columns dynamically
- **Pagination**: 10/20/50/100 items per page
- **Inline Editing**: Click cells to edit
- **Selection**: Multi-row selection with checkboxes
- **Export**: PDF and Excel with one click
- **Virtual Scrolling**: Smooth performance with large datasets
- **Responsive**: Mobile-friendly grid layout

**Technology**: `DevExtreme DataGrid`

**Best For**: Data analysis, bulk editing, reporting, exports

**Columns**:
- ID, Title, Category, Description
- Duration, Dependencies, Start Date, End Date

**Export Features**:
- **Excel**: Full data with formatting, formulas, colors
- **PDF**: Auto-generated table with headers and pagination

---

### 6. Gantt View
**Purpose**: Project timeline with dependencies

**Features**:
- **Interactive Timeline**: Drag bars to reschedule
- **Resize**: Adjust task duration by dragging edges
- **Dependencies**: Visual arrows showing task relationships
- **Zoom Controls**: Scale timeline (day/week/month/year)
- **Critical Path**: Automatically highlighted
- **Progress Indicators**: Visual completion percentage
- **Resource Assignment**: See who's working on what
- **Export to PDF**: Print-ready Gantt charts

**Technology**: `DevExtreme Gantt`

**Best For**: Project planning, timeline visualization, dependency management

**Dependency Types**:
- Finish-to-Start (FS)
- Start-to-Start (SS)
- Finish-to-Finish (FF)
- Start-to-Finish (SF)

---

### 7. Scheduler View
**Purpose**: Calendar-based task scheduling

**Features**:
- **View Modes**: Day, Week, Month
- **Drag-and-Drop**: Move appointments across time slots
- **Resize**: Adjust appointment duration
- **Time Slots**: Customizable intervals (15/30/60 min)
- **All-Day Events**: Support for full-day tasks
- **Timezone Support**: Respects local timezone
- **Recurring Events**: Repeat daily/weekly/monthly
- **Color Coding**: Category-based colors

**Technology**: `DevExtreme Scheduler`

**Best For**: Time-based planning, meeting scheduling, deadline tracking

---

## 🎨 Theme & Styling

### Color Palette
- **Primary**: Cyan (`#06b6d4`)
- **Background**: Slate-950 (`#020617`)
- **Text**: Slate-100 (`#f1f5f9`)
- **Accent**: Purple (`#8b5cf6`)

### Category Colors (10 distinct)
1. Blue - `#3b82f6`
2. Purple - `#8b5cf6`
3. Green - `#10b981`
4. Orange - `#f97316`
5. Red - `#ef4444`
6. Cyan - `#06b6d4`
7. Yellow - `#eab308`
8. Emerald - `#059669`
9. Indigo - `#6366f1`
10. Pink - `#ec4899`

### DevExtreme Theme
- **Base**: `dx.dark.css` (DevExtreme dark theme)
- **Integration**: Tailwind utilities for custom styling
- **Consistency**: CSS variables for color synchronization

---

## 🧪 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Adding New Views

1. Create view component in `src/components/views/`
2. Add view type to `ViewType` in `src/types/plan.ts`
3. Update `ViewToggle.tsx` with new button
4. Add render case in `PlanDisplay.tsx`

Example:
```typescript
// 1. Create NewView.tsx
export const NewView = ({ plan }: { plan: ProjectPlan }) => {
  return <div>Your new view</div>;
};

// 2. Add to types/plan.ts
export type ViewType = 'list' | 'timeline' | 'board' | 'analytics' 
  | 'datagrid' | 'gantt' | 'scheduler' | 'newview';

// 3. Update ViewToggle.tsx
<Button onClick={() => onViewChange('newview')}>
  New View
</Button>

// 4. Update PlanDisplay.tsx
{currentView === 'newview' && <NewView plan={plan} />}
```

---

## 🚢 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Drag 'dist' folder to Netlify drop zone
```

### Build for Production

```bash
npm run build
# Output will be in 'dist' folder
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style and formatting
- Add comments for complex logic
- Test all views after changes
- Update this README if adding new features

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **DevExtreme** - Enterprise UI components
- **shadcn/ui** - Beautiful component library
- **Supabase** - Backend and AI infrastructure
- **Aceternity UI** - Lamp effect inspiration

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ using React, TypeScript, and DevExtreme**
│   ├── TaskDetailsModal.tsx         # Task details with tabs
│   ├── PlanDisplay.tsx              # Main display with all views
│   ├── ViewToggle.tsx               # 7-view selector
│   ├── HeroSection.tsx              # Landing page
│   ├── ui/                          # shadcn/ui components (40+)
│   └── views/
│       ├── ListView.tsx             # Expandable list
│       ├── TimelineView.tsx         # Progress bars
│       ├── KanbanView.tsx           # Original Kanban
│       ├── AnalyticsView.tsx        # Charts
│       ├── DataGridView.tsx         # NEW: Excel-like grid
│       ├── KanbanBoardView.tsx      # NEW: Drag-drop Kanban
│       ├── GanttView.tsx            # NEW: Timeline chart
│       └── SchedulerView.tsx        # NEW: Calendar
├── types/
│   └── plan.ts                      # TypeScript interfaces
└── integrations/
    └── supabase/                    # Backend integration
```

---

## 🎨 Theme

- **Primary Color**: Purple (`#8b5cf6`)
- **Dark Mode**: Supported with DevExtreme dark theme
- **10 Category Colors**: Blue, Purple, Green, Orange, Red, Cyan, Yellow, Emerald, Indigo, Pink

---

**Made with ❤️ using React, TypeScript, and DevExtreme**