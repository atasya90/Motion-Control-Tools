import "./globals.css";

export const metadata = {
  title: "Kling Motion Control Tool",
  description: "Generate Kling motion control video with fal.ai and Replicate"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
