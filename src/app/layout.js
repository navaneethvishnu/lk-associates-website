import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "LK Associates | Architecture & Construction",
  description: "Architectural Design, Turnkey Residential & Commercial Construction",
  icons: {
    icon: "/lk-associates-emblem-only.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var saved = localStorage.getItem('theme');
                var theme = saved || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#faf8f5] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 antialiased transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
