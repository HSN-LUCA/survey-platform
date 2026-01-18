# Admin Dashboard Visual Guide

## Create Survey Page - New Design

### Header Section
```
┌─────────────────────────────────────────────────────────────┐
│  🎨 Create New Survey                                       │
│  Create a new survey with multi-language questions          │
└─────────────────────────────────────────────────────────────┘
```

### Survey Details Card
```
┌─────────────────────────────────────────────────────────────┐
│ ▌ Survey Details                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Customer Type: [Pilgrims ▼]                               │
│                                                             │
│  Title (English)          │  Title (Arabic)                │
│  [________________]       │  [________________]            │
│                                                             │
│  Description (English)    │  Description (Arabic)          │
│  [________________]       │  [________________]            │
│  [________________]       │  [________________]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Questions Card
```
┌─────────────────────────────────────────────────────────────┐
│ ▌ Questions                                    [+ Add Question]
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [Question 1]                              [Remove]  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Question (English)    │  Question (Arabic)          │   │
│  │ [________________]    │  [________________]         │   │
│  │                                                     │   │
│  │ Question Type         │  ☑ Required                │   │
│  │ [Multiple Choice ▼]   │                            │   │
│  │                                                     │   │
│  │ Options (comma-separated)                          │   │
│  │ [Option 1, Option 2, Option 3]                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Action Buttons
```
┌─────────────────────────────────────────────────────────────┐
│  [Create Survey]              [Cancel]                      │
└─────────────────────────────────────────────────────────────┘
```

## Admin Header - Language Switcher

### Before
```
┌─────────────────────────────────────────────────────────────┐
│  Surveys                                    🔔  👤          │
└─────────────────────────────────────────────────────────────┘
```

### After
```
┌─────────────────────────────────────────────────────────────┐
│  Surveys                                    🔔  👤  | [AR]  │
└─────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Yellow**: #FBBF24 (Main theme)
- **Yellow Dark**: #F59E0B (Hover state)
- **Yellow Light**: #FCD34D (Accents)

### Secondary Colors
- **Gray**: #F3F4F6 (Backgrounds)
- **Gray Dark**: #374151 (Text)
- **Gray Light**: #E5E7EB (Borders)

### Accent Colors
- **Green**: #10B981 (Add buttons)
- **Red**: #EF4444 (Delete buttons)
- **Yellow**: #FBBF24 (Focus states)

## Typography

### Headings
- **Main Title**: 4xl, Bold, Gradient
- **Section Title**: 2xl, Bold
- **Card Title**: xl, Bold
- **Label**: sm, Semibold

### Body Text
- **Regular**: base, Medium
- **Small**: sm, Regular
- **Placeholder**: sm, Gray

## Spacing

### Padding
- **Cards**: 8 (32px)
- **Sections**: 6 (24px)
- **Inputs**: 3 (12px)

### Gaps
- **Between sections**: 6 (24px)
- **Between columns**: 6 (24px)
- **Between buttons**: 4 (16px)

## Shadows

### Card Shadows
- **Default**: shadow-lg
- **Hover**: shadow-xl
- **Transition**: smooth

## Borders

### Input Borders
- **Default**: 2px, Gray-200
- **Focus**: 2px, Yellow-600
- **Ring**: 2px, Yellow-100

### Card Borders
- **Default**: 1px, Gray-100
- **Hover**: 2px, Yellow-400

## Responsive Breakpoints

### Desktop (1024px+)
- 2-column grid for forms
- Full-width cards
- Optimal spacing

### Tablet (768px - 1023px)
- 2-column grid for forms
- Adjusted spacing
- Touch-friendly

### Mobile (< 768px)
- Single column
- Full-width inputs
- Larger buttons

## Interactive Elements

### Buttons
```
Normal:     [Create Survey]
Hover:      [Create Survey] (darker yellow)
Active:     [Create Survey] (pressed effect)
Disabled:   [Creating...] (gray, spinner)
```

### Input Fields
```
Normal:     [________________]
Focus:      [________________] (yellow border, ring)
Error:      [________________] (red border)
Filled:     [Value entered]
```

### Checkboxes
```
Unchecked:  ☐ Required
Checked:    ☑ Required
```

### Select Dropdowns
```
Closed:     [Pilgrims ▼]
Open:       [Pilgrims ▼]
            [Pilgrims]
            [Staff]
```

## Animations

### Transitions
- **Hover**: 200ms ease
- **Focus**: 150ms ease
- **Loading**: Spin animation

### Effects
- **Shadow**: Smooth transition
- **Color**: Smooth transition
- **Border**: Smooth transition

## Accessibility Features

### Focus States
- Visible focus ring (yellow)
- Clear focus indicator
- Keyboard navigation

### Color Contrast
- Text on background: 4.5:1 ratio
- Buttons: 3:1 ratio
- Borders: Visible on all backgrounds

### Labels
- All inputs have labels
- Labels associated with inputs
- Clear and descriptive

## Language Support

### Arabic (RTL)
- Right-to-left layout
- Arabic labels
- Arabic placeholders
- Arabic error messages

### English (LTR)
- Left-to-right layout
- English labels
- English placeholders
- English error messages

## Empty States

### No Questions Added
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  No questions added yet.                                   │
│  Click "Add Question" to start                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Loading States

### Creating Survey
```
[⏳ Creating...]
```

### Submitting Form
```
[⏳ جاري الإنشاء...]  (Arabic)
```

## Error States

### Validation Error
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠ This field is required                                   │
└─────────────────────────────────────────────────────────────┘
```

## Success States

### Survey Created
```
✓ Survey created successfully
Redirecting to surveys list...
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## Performance Metrics

- **Load Time**: < 2s
- **First Paint**: < 1s
- **Interaction**: < 100ms
- **Animation**: 60fps

---

**Version**: 1.0
**Last Updated**: 2024
