import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'ClubSync',
  description: 'Club Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
