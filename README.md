# nerdtb (Nerd Toolbox)

nerdtb is a browser-based toolbox for software engineers who want quick access to everyday utilities without leaving their workflow. The webapp currently ships with helpers such as:

- Diff viewer for comparing snippets or entire files
- JSON sorter and formatter for taming API payloads
- Additional quick-win tools (e.g., text transformers, encoders) with more on the way

The project is built on [Next.js](https://nextjs.org) and uses `npm` for package management, scripts, and dependency lifecycle.

## Getting Started

Install dependencies and start the local dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The entry point for the main UI lives in `src/app/page.tsx`, and edits there reflect immediately thanks to Next.js hot reloading.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
