# Survey Categories & Progress Bar Implementation

## Overview
Surveys now support question grouping by categories with a visual progress bar that shows users their progress through the survey.

## Features

### 1. Question Categories
- Questions can be organized into logical categories
- Each category is displayed as a separate section
- Categories are shown in the progress bar

### 2. Progress Bar
- Visual progress indicator at the top of the survey
- Shows all categories with their status:
  - ✓ Completed categories
  - ● Current category
  - ○ Upcoming categories
- Progress line fills as user completes categories
- Turns green when survey is complete

### 3. Category Display
- Category name as section header
- Shows "X of Y" indicator
- All questions in a category grouped together
- Clear visual separation between categories

## How It Works

### Frontend Flow
1. User starts survey
2. Progress bar displays all categories
3. Questions are grouped by category
4. As user answers questions, progress updates
5. When survey is submitted, progress bar turns green

### Data Structure
Questions can have an optional `category` field:
```typescript
interface QuestionWithCategory extends Question {
  category?: string;
}
```

If no category is specified, questions default to "General" category.

### Progress Calculation
- Progress percentage = (Current Category Index + 1) / Total Categories * 100
- On completion, progress reaches 100% and turns green

## Components

### SurveyProgressBar Component
**File**: `src/components/SurveyProgressBar.tsx`

Props:
- `categories`: Array of category names
- `currentCategoryIndex`: Index of current category (0-based)
- `isComplete`: Boolean indicating if survey is complete

Features:
- Displays category labels with status indicators
- Animated progress line
- Responsive design
- RTL support

### Updated SurveyPage Component
**File**: `src/components/SurveyPage.tsx`

Changes:
- Groups questions by category
- Tracks current category index
- Displays progress bar
- Shows category headers
- Maintains all existing functionality

## Usage

### Creating Surveys with Categories
When creating a survey in the admin panel, questions can be assigned to categories. The system will automatically:
1. Group questions by category
2. Display them in category order
3. Show progress based on categories

### Example Survey Structure
```
Survey: Customer Satisfaction
├── Category 1: Service Quality
│   ├── Question 1: How would you rate our service?
│   └── Question 2: Was the staff helpful?
├── Category 2: Product Quality
│   ├── Question 3: How satisfied are you with the product?
│   └── Question 4: Would you recommend it?
└── Category 3: Overall Experience
    ├── Question 5: Overall rating
    └── Question 6: Additional comments
```

## Styling

### Colors
- **Yellow** (#F59E0B): Active/current category
- **Green** (#10B981): Completed survey
- **Gray** (#9CA3AF): Upcoming categories

### Progress Bar
- Background: Light gray
- Fill: Yellow (in progress) → Green (complete)
- Smooth animation: 500ms transition

### Category Headers
- Bold text
- Yellow color for current category
- "X of Y" indicator

## Translations

### English Keys
- `admin.surveyPerformance` - Used in analytics
- Category labels are custom per survey

### Arabic Keys
- Same structure with Arabic translations
- RTL layout automatically applied

## Database Schema

### Questions Table
The `questions` table should have an optional `category` column:
```sql
ALTER TABLE questions ADD COLUMN category VARCHAR(255) DEFAULT 'General';
```

If not already present, this migration can be run to add category support.

## API Integration

### Survey Fetch
The `/api/surveys/public` endpoint returns questions with their categories:
```json
{
  "id": "survey-id",
  "title_en": "Survey Title",
  "questions": [
    {
      "id": "q1",
      "category": "Service Quality",
      "content_en": "Question text",
      ...
    }
  ]
}
```

## Testing

### Test Cases
1. **Single Category**: Survey with all questions in one category
2. **Multiple Categories**: Survey with 3+ categories
3. **No Categories**: Survey with no category specified (defaults to "General")
4. **Progress Tracking**: Verify progress bar updates correctly
5. **Completion**: Verify progress bar turns green on submission
6. **RTL Support**: Test with Arabic language

### Manual Testing Steps
1. Create a survey with multiple categories
2. Assign questions to different categories
3. Take the survey
4. Verify progress bar shows all categories
5. Verify progress updates as you answer questions
6. Submit survey and verify completion state
7. Test in both English and Arabic

## Performance Considerations

- Categories are grouped on the client side
- No additional database queries needed
- Progress calculation is O(1)
- Suitable for surveys with 100+ questions

## Future Enhancements

Potential improvements:
- Category-specific progress tracking
- Skip categories feature
- Category-based branching logic
- Category completion badges
- Category-level analytics

## Files Modified/Created

1. **Created**: `src/components/SurveyProgressBar.tsx` - Progress bar component
2. **Modified**: `src/components/SurveyPage.tsx` - Added category grouping and progress tracking
3. **Modified**: `types/index.ts` - Extended Question interface (if needed)

## Status
✅ Survey categories and progress bar are fully implemented and ready to use.

## Notes

- Categories are optional - surveys without categories still work
- Default category is "General" if not specified
- Progress bar is responsive and works on all screen sizes
- Full RTL support for Arabic language
- Smooth animations for better UX
