# Dashboard Components

This directory contains the dashboard components for the admin panel.

## Structure

```
dashboard/
├── _components/
│   ├── DashboardOverview.tsx    # Overview cards with key metrics
│   ├── DashboardProjects.tsx    # Recent projects list
│   ├── DashboardFeedbacks.tsx   # Recent feedbacks list
│   ├── DashboardChart.tsx       # Analytics chart
│   └── ProjectModal.tsx         # Project creation/edit modal
├── page.tsx                     # Main dashboard page
└── README.md                    # This file
```

## Components

### DashboardOverview
Displays key metrics in card format:
- Total Projects
- Total Submissions  
- Total Members
- Completion Rate

### DashboardProjects
Shows recent projects with:
- Project title and description
- Participant count
- Status indicators
- Creation date

### DashboardFeedbacks
Displays recent feedback with:
- Project association
- Sentiment analysis
- Score visualization
- Status tracking

### DashboardChart
Simple bar chart showing:
- Projects vs Submissions over time
- Monthly trends

### ProjectModal
Modal for creating/editing projects with:
- Project title and description
- Status selection
- Participant count
- Form validation

## Data Flow

1. **Mock Data**: Located in `@/config/dashboard-data.ts`
2. **Types**: Defined in `@/types/dashboard.d.ts`
3. **State Management**: Custom hook `useDashboard()` in `@/hooks/useDashboard.ts`
4. **Components**: Imported and used in `page.tsx`

## Features

- ✅ Responsive design with Tailwind CSS
- ✅ HeroUI components for consistent styling
- ✅ TypeScript for type safety
- ✅ Mock data for development
- ✅ Interactive project creation
- ✅ Data export functionality
- ✅ Real-time state updates

## Usage

The dashboard automatically loads with mock data and provides:
- Overview statistics
- Recent projects and feedbacks
- Interactive charts
- Project creation modal
- Export functionality

All components are fully responsive and follow the design system established in the project. 