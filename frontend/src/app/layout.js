// frontend/src/app/layout.js
import "../styles/globals.css"; // adjust path if your styles location differs
import { SessionProvider } from "../context/SessionContext";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "ClubSync",
  description: "Club event manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
