# Front-Guard 🛡️

Full-featured frontend security package for input sanitization, XSS protection, and secure UI components.

## 🚀 Installation

```bash
# npm
npm install front-guard

# pnpm
pnpm add front-guard

# yarn
yarn add front-guard

# bun
bun add front-guard
```

## ✨ Features

- 🔒 **XSS Detection & Prevention** - Detect and sanitize malicious input
- 🎯 **Framework Agnostic** - Works with vanilla JavaScript
- ⚛️ **React Support** - Hooks, components, and HOCs
- 🟢 **Vue 3 Support** - Composables and directives
- 🔴 **Svelte Support** - Actions and utilities
- 🧩 **Form Library Adapters** - Zod, Yup, React Hook Form
- 📦 **Tree-shakeable** - Import only what you need
- 🌐 **Universal** - Works in browser and Node.js (with DOMPurify)

## 📚 Usage

### Vanilla JavaScript / TypeScript

```typescript
import { sanitizeInput, sanitizeHtml, detectXSS } from 'front-guard';

// Sanitize plain text input (removes HTML)
const userInput = '<script>alert("xss")</script>Hello';
const safe = sanitizeInput(userInput);
// Output: "Hello"

// Sanitize HTML content (preserves safe HTML)
const htmlContent = '<p>Safe</p><script>alert(1)</script>';
const safeHtml = sanitizeHtml(htmlContent);
// Output: "<p>Safe</p>"

// Detect XSS threats
const report = detectXSS('javascript:alert(1)');
console.log(report);
// {
//   isSafe: false,
//   threatLevel: 'dangerous',
//   detectedPatterns: ['Javascript Protocol']
// }
```

### React

```typescript
import { SafeHtml, SafeText, useSafeInput, withSanitizedProps } from 'front-guard/react';

// Safe HTML rendering
function MyComponent() {
  return <SafeHtml html="<p>User content</p><script>bad</script>" />;
}

// Safe text rendering (escapes HTML entities)
function TextComponent() {
  return <SafeText text="<script>This will be escaped</script>" />;
}

// Hook for safe input handling
function FormComponent() {
  const { value, setValue, isSafe, report } = useSafeInput('');

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {!isSafe && (
        <div className="warning">
          Threat detected: {report?.threatLevel}
        </div>
      )}
    </div>
  );
}

// Higher-Order Component to sanitize props
const SafeUserCard = withSanitizedProps(UserCard, ['bio', 'description']);
```

### Vue 3

```vue
<script setup>
import { useSafeInput } from 'front-guard/vue';

const { value, setValue, isSafe, report } = useSafeInput('');
</script>

<template>
  <div>
    <input :value="value" @input="setValue($event.target.value)" />
    <div v-if="!isSafe" class="warning">
      Threat detected: {{ report?.threatLevel }}
    </div>
    
    <!-- Use the v-sanitize directive -->
    <div v-sanitize="userGeneratedHtml"></div>
  </div>
</template>
```

**Register the plugin globally:**

```typescript
import { createApp } from 'vue';
import { FrontGuardVue } from 'front-guard/vue';
import App from './App.vue';

const app = createApp(App);
app.use(FrontGuardVue);
app.mount('#app');
```

### Svelte

```svelte
<script>
  import { sanitize } from 'front-guard/svelte';
  
  let userInput = '';
</script>

<input use:sanitize bind:value={userInput} />
```

### Form Library Adapters

#### Zod

```typescript
import { z } from 'zod';
import { zodSanitize } from 'front-guard';

const schema = z.object({
  username: z.string().transform(zodSanitize),
  bio: z.string().transform((val) => zodSanitize(val, { maxLength: 500 })),
});
```

#### Yup

```typescript
import * as yup from 'yup';
import { yupSanitize } from 'front-guard';

const schema = yup.object({
  username: yup.string().transform(yupSanitize),
});
```

#### React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { sanitizeRHF } from 'front-guard';

function MyForm() {
  const { register } = useForm();
  
  return (
    <input {...register('username', { setValueAs: sanitizeRHF })} />
  );
}
```

## 🔧 Configuration Options

### `sanitizeInput(input, options?)`

```typescript
interface SanitizeOptions {
  stripTags?: boolean;        // Default: true - Remove all HTML tags
  maxLength?: number;         // Truncate to max length
  normalizeUnicode?: boolean; // Default: true - Normalize unicode (NFKC)
}
```

### Security Provider (React)

```typescript
import { SecurityProvider } from 'front-guard/react';

function App() {
  return (
    <SecurityProvider config={{ strictMode: true }}>
      <YourApp />
    </SecurityProvider>
  );
}
```

## 🧪 Security Reports

The `detectXSS` function returns detailed security reports:

```typescript
interface SecurityReport {
  isSafe: boolean;
  threatLevel: 'safe' | 'suspicious' | 'dangerous';
  detectedPatterns: string[]; // e.g., ['Script Tag', 'Inline Event Handler']
}
```

**Detected patterns include:**
- Script tags
- Inline event handlers (onclick, onerror, etc.)
- JavaScript/VBScript protocols
- Data URIs with HTML
- Iframe/Object/Embed tags
- Base64 obfuscation
- HTML entity encoding
- Unicode escapes

## 📦 Package Manager Support

All major package managers are fully supported:

- ✅ **npm** - `npm install front-guard`
- ✅ **pnpm** - `pnpm add front-guard`
- ✅ **yarn** - `yarn add front-guard`
- ✅ **bun** - `bun add front-guard`

The package provides both **CommonJS** and **ESM** builds for maximum compatibility.

## 🌍 Framework Support

| Framework | Status | Import Path |
|-----------|--------|-------------|
| Vanilla JS/TS | ✅ Full Support | `front-guard` |
| React | ✅ Full Support | `front-guard/react` |
| Vue 3 | ✅ Full Support | `front-guard/vue` |
| Svelte | ✅ Full Support | `front-guard/svelte` |
| Angular | 🚧 Coming Soon | - |

## 📄 License

MIT © Gowtham Shankar

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Security

If you discover a security vulnerability, please email security@example.com instead of using the issue tracker.

---

**Made with ❤️ for a safer web**
