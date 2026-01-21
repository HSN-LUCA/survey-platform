# Language Selection Screen - First Page Feature

## Overview
When users open the app for the first time, they now see a language selection screen before accessing the surveys page. This ensures users explicitly choose their preferred language (English or Arabic) before proceeding.

## User Flow

### First Visit
1. User opens the app → Language Selection Modal appears
2. User clicks "English" or "العربية" (Arabic)
3. Language is saved to localStorage
4. Surveys page loads in selected language

### Subsequent Visits
1. User opens the app → Surveys page loads directly
2. Language preference is remembered from localStorage
3. User can still change language using the language switcher in the header

## Features

### Language Selection Modal
- **Beautiful Design**: Modern modal with gradient buttons
- **Two Options**: 
  - English (Blue gradient with 🇬🇧 flag)
  - العربية (Green gradient with 🇸🇦 flag)
- **Smooth Animation**: Fade-out animation when language is selected
- **Persistent Storage**: Language choice saved to localStorage

### Key Features
- ✓ Blocks access to surveys until language is selected
- ✓ Remembers user's language preference
- ✓ Smooth transition to surveys page
- ✓ Can be bypassed by clearing localStorage (for testing)
- ✓ Language switcher still available in header for changes

## Technical Implementation

### Files Created
1. `src/components/LanguageSelectionModal.tsx` - Modal component

### Files Modified
1. `src/app/page.tsx` - Home page with language selection logic

### How It Works

**LanguageSelectionModal Component:**
```typescript
- Checks localStorage for 'languageSelected' flag
- If not found, displays modal
- On language selection:
  1. Changes i18n language
  2. Saves 'languageSelected' to localStorage
  3. Saves 'preferredLanguage' to localStorage
  4. Triggers onLanguageSelected callback
- Modal closes with animation
```

**Home Page Logic:**
```typescript
- Checks if language was selected
- If not selected, shows LanguageSelectionModal
- If selected, loads surveys normally
- Fetches surveys only after language selection
```

### LocalStorage Keys
- `languageSelected`: Boolean flag indicating if user has selected a language
- `preferredLanguage`: Stores the selected language ('en' or 'ar')

## User Experience

### First Time User
```
┌─────────────────────────────────────┐
│                                     │
│         🌐 Select Language          │
│                                     │
│    Select Language                  │
│    اختر اللغة                       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🇬🇧 English                 │   │
│  │ Continue in English         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🇸🇦 العربية                 │   │
│  │ متابعة باللغة العربية       │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### After Selection
- Modal fades out
- Surveys page loads in selected language
- Language switcher available in header

## Testing

### Test Case 1: First Visit
1. Clear browser localStorage
2. Open app
3. Language selection modal should appear
4. Click "English"
5. Surveys page should load in English

### Test Case 2: Language Persistence
1. Close and reopen browser
2. Surveys page should load directly (no modal)
3. Language should be the same as before

### Test Case 3: Language Change
1. On surveys page, click language switcher
2. Language should change
3. Refresh page
4. New language should persist

### Test Case 4: Arabic RTL
1. Select Arabic
2. Verify RTL layout is applied
3. All text should be right-aligned
4. Language switcher should show "EN"

## Customization

### Change Modal Colors
Edit `LanguageSelectionModal.tsx`:
```typescript
// English button
className="bg-gradient-to-r from-blue-500 to-blue-600"

// Arabic button
className="bg-gradient-to-r from-green-500 to-green-600"
```

### Change Modal Text
Edit the text in the modal component:
```typescript
<h1 className="text-3xl font-bold text-gray-900 mb-2">
  Select Language  {/* Change this */}
</h1>
```

### Change Button Icons
Edit the emoji flags:
```typescript
<span className="text-2xl">🇬🇧</span>  {/* English flag */}
<span className="text-2xl">🇸🇦</span>  {/* Arabic flag */}
```

## Browser Compatibility
- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Mobile browsers

## Accessibility
- ✓ Clear language labels
- ✓ Large, easy-to-click buttons
- ✓ High contrast colors
- ✓ Keyboard navigable
- ✓ Screen reader friendly

## Performance
- Modal loads instantly
- No API calls before language selection
- Surveys only fetch after language is selected
- Minimal localStorage usage

## Notes
- Language selection is required before accessing surveys
- Users can change language anytime using the header switcher
- Language preference persists across sessions
- Modal uses smooth CSS animations for better UX
