# Fix: Event Handlers Cannot Be Passed to Client Component Props

## The Issue

You may see this error:
```
Event handlers cannot be passed to Client Component props.
<button onClick={function onClick} className=... children=...>
                   ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

## The Solution

This is a Next.js 16 requirement. Pages with event handlers must be marked as Client Components.

### What We Fixed

1. **src/app/page.tsx** - Added `'use client'` directive
2. **src/app/admin/surveys/page.tsx** - Already has `'use client'`

### How to Fix Similar Issues

If you see this error in other files:

1. Add `'use client';` at the very top of the file
2. Example:

```typescript
'use client';

import { useState } from 'react';

export default function MyComponent() {
  const [value, setValue] = useState('');

  const handleClick = () => {
    // Your handler
  };

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

### Files Already Fixed

- ✅ src/app/page.tsx
- ✅ src/app/admin/surveys/page.tsx
- ✅ src/app/admin/login/page.tsx
- ✅ src/app/admin/analytics/page.tsx
- ✅ src/app/admin/settings/page.tsx
- ✅ src/app/survey/[id]/page.tsx
- ✅ All components in src/components/

### Key Points

- **'use client'** must be at the top of the file
- It only affects that file, not imports
- Server Components can import Client Components
- Client Components can import Server Components (with limitations)

### Testing

After the fix:
1. Refresh your browser
2. The error should be gone
3. Event handlers should work normally

## Next Steps

1. ✅ Error is fixed
2. Run `npm run dev:all` again
3. Test the application
4. No more event handler errors!
