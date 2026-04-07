

# AI Interview Prep Planner — MVP

## Pages & Flow

### 1. Landing Page (`/`)
- Hero: "Your AI Interview Prep Agent" headline, subtext, "Get Started" CTA → navigates to `/onboarding`
- Clean, centered, white background with blue primary accent

### 2. Onboarding (`/onboarding`)
- Form: Name, Email, Branch (dropdown), CGPA (number), Target Companies (tag input)
- Submit calls `/api/onboard` → redirects to `/dashboard`
- Loading/error states on submit

### 3. Dashboard (`/dashboard`)
- **Today's Quiz** — list of questions with textarea answers + submit button (→ `/api/submit`)
- **Last Evaluation** — score highlight, feedback paragraph, weak topic tags
- **Progress Overview** — weak topics list + percentage progress bar

### 4. Success Page (`/success`)
- "Answers submitted successfully" message + "View Dashboard" CTA

## Components
- `Navbar` — minimal top nav with logo/links
- `QuizCard` — question text + textarea input
- `InputField` — reusable labeled input
- `TopicTag` — styled tag/badge for topics
- `ProgressBar` — percentage bar with label
- `Button` — reusable styled button
- `TagInput` — multi-value input for target companies

## Design
- White background, soft gray borders, blue primary (`#3B82F6`)
- Inter font, rounded corners, soft shadows
- Mobile responsive, max-width centered container
- Loading spinners, disabled buttons during API calls, error toasts

## API Integration
- `fetch()` calls to assumed backend endpoints: `/api/onboard`, `/api/submit`, `/api/quiz`, `/api/evaluation`, `/api/profile`
- Mock responses for demo/dev mode so the app is functional immediately
- TypeScript interfaces for all data models

## State
- React hooks only (`useState`, `useEffect`)
- React Router for navigation
- Toast notifications for feedback

