'use client';
import Link from 'next/link';
import { useAuth } from '../app/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar container">
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        ClubSync
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <span style={{ alignSelf: 'center' }}>
              Hello, {user.email} ({user.role})
            </span>
            {user.role === 'ADMIN' && (
              <Link href="/admin">
                <button className="btn">Admin Panel</button>
              </Link>
            )}
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="btn">Login</button>
            </Link>
            <Link href="/signup">
              <button className="btn btn-secondary">Signup</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
