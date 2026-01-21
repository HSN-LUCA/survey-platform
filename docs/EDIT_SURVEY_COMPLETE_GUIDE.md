# Edit Survey Feature - Complete Guide

## Overview

The edit survey feature allows administrators to modify existing surveys. This guide covers everything you need to know about using and understanding the feature.

## Quick Start

### Edit a Survey in 3 Steps

1. **Navigate to Survey List**
   - Go to Admin Dashboard → Surveys

2. **Click Edit**
   - Find the survey you want to edit
   - Click the green "Edit" button

3. **Update and Save**
   - Make your changes
   - Click "Update Survey"

## Feature Details

### What Can Be Edited

#### Always Editable
- ✅ Survey title (English & Arabic)
- ✅ Survey description (English & Arabic)
- ✅ Customer type (Pilgrims/Staff)

#### Editable Only If No Responses
- ✅ Questions (add, edit, remove)
- ✅ Question types
- ✅ Question options
- ✅ Question categories
- ✅ Required field status

#### If Survey Has Responses
- ⚠️ Questions are locked (cannot edit)
- ✅ Title and description can still be edited
- ℹ️ Warning message is displayed

### Edit Locations

#### Method 1: From Survey List
1. Admin Dashboard → Surveys
2. Click "Edit" button on survey row
3. Make changes
4. Click "Update Survey"

#### Method 2: From Survey Detail
1. Admin Dashboard → Surveys
2. Click "View Survey"
3. Click "Edit Survey" button in header
4. Make changes
5. Click "Update Survey"

## Detailed Instructions

### Editing Survey Details

1. **Title**
   - English: Enter survey title in English
   - Arabic: Enter survey title in Arabic
   - Both required

2. **Description**
   - English: Enter survey description in English
   - Arabic: Enter survey description in Arabic
   - Optional but recommended

3. **Customer Type**
   - Select "Pilgrims" or "Company Staff"
   - Determines who can respond to survey

### Managing Questions

#### Add a New Question
1. Click **+ Add Question** button
2. Enter question text:
   - English: Question in English
   - Arabic: Question in Arabic
3. Select question type:
   - Multiple Choice: Users select from options
   - Star Rating: Users rate 1-5 stars
   - Percentage Range: Users select 0-100%
4. Check "Required" if answer is mandatory
5. Add category (optional) to group questions
6. For multiple choice, add options
7. Click "Update Survey"

#### Edit Existing Question
1. Modify question text
2. Change question type (if no responses)
3. Update options
4. Click "Update Survey"

#### Remove a Question
1. Click "Remove" button on question
2. Click "Update Survey"

### Managing Options

#### Add Option (Multiple Choice)
1. Scroll to "Or Add Custom Option" section
2. Enter option text:
   - English: Option in English
   - Arabic: Option in Arabic
3. Click "+ Add Option"
4. Click "Update Survey"

#### Use Preset Options
1. Click "Use Preset Options" dropdown
2. Select category:
   - Agreement: Strongly Agree, Agree, Neutral, Disagree, Strongly Disagree
   - Yes/No: Yes, No, Maybe
   - Satisfaction: Very Satisfied, Satisfied, Somewhat Satisfied, Dissatisfied, Very Dissatisfied
   - Likelihood: Very Likely, Likely, Unlikely, Very Unlikely
   - Quality: Excellent, Good, Fair, Poor
   - Frequency: Always, Often, Sometimes, Rarely, Never
   - Importance: Very Important, Important, Somewhat Important, Not Important
   - Recommendation: Would Recommend, Would Not Recommend
   - Service Quality: Excellent Service, Good Service, Average Service, Poor Service
3. Options are automatically loaded
4. Click "Update Survey"

#### Remove Option
1. Click "Remove" button on option
2. Click "Update Survey"

#### Clear All Options
1. Click "Clear All Options" button
2. Click "Update Survey"

## Important Restrictions

### Survey with Responses
When a survey has responses:
- ⚠️ Questions cannot be edited
- ⚠️ Question types cannot be changed
- ⚠️ Options cannot be modified
- ✅ Title and description can be edited
- ℹ️ Yellow warning message is displayed

**Why?** To maintain data integrity. If questions change, existing responses become invalid.

### Validation Rules
- Title required in both languages
- Questions require content in both languages
- Multiple choice questions need at least one option
- All fields must be filled before submission

## Error Messages

### "Title in both languages is required"
- **Cause**: Missing English or Arabic title
- **Solution**: Fill both title fields

### "Question X: Content in both languages is required"
- **Cause**: Question missing English or Arabic text
- **Solution**: Fill both question text fields

### "Question X: Please add at least one option"
- **Cause**: Multiple choice question has no options
- **Solution**: Add at least one option using preset or custom

### "Survey not found"
- **Cause**: Invalid survey ID or survey was deleted
- **Solution**: Go back and select a valid survey

### "Unauthorized"
- **Cause**: Session expired or invalid token
- **Solution**: Log in again

### "Failed to update survey"
- **Cause**: Database error or validation failure
- **Solution**: Check error details and try again

## Best Practices

### Before Editing
1. ✅ Review current survey content
2. ✅ Plan your changes
3. ✅ Check if survey has responses

### While Editing
1. ✅ Always provide content in both languages
2. ✅ Use preset options when available
3. ✅ Use categories to organize questions
4. ✅ Mark important questions as required

### After Editing
1. ✅ Review changes before saving
2. ✅ Test survey if questions changed
3. ✅ Verify bilingual content

## Bilingual Support

### English
- Default language for new surveys
- All text in English
- LTR (Left-to-Right) layout

### Arabic
- Full Arabic support
- All text in Arabic
- RTL (Right-to-Left) layout
- Automatic layout switching

### Language Switching
- Use language switcher in admin header
- Changes interface language
- Affects all pages

## Categories

### What Are Categories?
Categories group related questions together. Users see a progress bar showing which category they're on.

### How to Use Categories
1. Enter category name in "Category (Optional)" field
2. Use same category for related questions
3. Questions are grouped by category in survey

### Example Categories
- Service Quality
- Product Features
- Customer Support
- Overall Experience
- Recommendations

## Preset Options

### Available Categories
1. **Agreement**: 5-point agreement scale
2. **Yes/No**: Simple yes/no/maybe
3. **Satisfaction**: 5-point satisfaction scale
4. **Likelihood**: 4-point likelihood scale
5. **Quality**: 4-point quality scale
6. **Frequency**: 5-point frequency scale
7. **Importance**: 4-point importance scale
8. **Recommendation**: Would/wouldn't recommend
9. **Service Quality**: 4-point service quality scale

### How to Use
1. Click "Use Preset Options" dropdown
2. Select category
3. Options are automatically loaded
4. Modify if needed
5. Save survey

## Troubleshooting

### Survey Won't Update
- Check all required fields are filled
- Ensure questions have content in both languages
- Multiple choice questions need options
- Check for error messages

### Can't Edit Questions
- Survey likely has responses
- Check for yellow warning message
- Only title/description can be edited
- Create new survey if major changes needed

### Language Not Switching
- Refresh page
- Check language switcher in header
- Clear browser cache
- Try different browser

### Options Not Loading
- Ensure question type is "Multiple Choice"
- Try selecting preset options again
- Manually add options if needed

## Advanced Features

### Question Types

#### Multiple Choice
- Users select one option
- Requires at least one option
- Can use preset options
- Can add custom options

#### Star Rating
- Users rate 1-5 stars
- No options needed
- Good for satisfaction/quality

#### Percentage Range
- Users select 0-100%
- No options needed
- Good for likelihood/importance

### Categories for Organization
- Group related questions
- Users see progress by category
- Helps organize long surveys
- Optional but recommended

## Tips & Tricks

💡 **Save Time**
- Use preset options instead of typing
- Copy questions from other surveys
- Use categories to organize

💡 **Better Surveys**
- Always provide both languages
- Use clear, simple language
- Group related questions
- Mark important questions as required

💡 **Data Quality**
- Test survey before sharing
- Review responses regularly
- Update survey based on feedback

## FAQ

**Q: Can I edit a survey after people respond?**
A: Yes, but only title and description. Questions are locked to maintain data integrity.

**Q: Can I delete a question?**
A: Yes, if survey has no responses. If survey has responses, you cannot edit questions.

**Q: Do I need to provide both English and Arabic?**
A: Yes, all content must be in both languages.

**Q: Can I reorder questions?**
A: Not directly, but you can remove and re-add in desired order.

**Q: What if I make a mistake?**
A: Go back and edit again. Changes are saved immediately.

**Q: Can I copy a survey?**
A: Not directly, but you can create new survey and manually copy questions.

## Support

For issues or questions:
1. Check error messages
2. Review this guide
3. Check troubleshooting section
4. Contact administrator

## Summary

The edit survey feature provides:
- ✅ Full survey editing capability
- ✅ Bilingual support (English/Arabic)
- ✅ RTL layout for Arabic
- ✅ Data integrity protection
- ✅ Comprehensive error handling
- ✅ Intuitive user interface
- ✅ Preset options for quick setup
- ✅ Question categorization

You can now easily modify surveys to improve them based on feedback and changing needs!
