import Link from 'next/link';

export default function HomePage() {
  return (
      <main>
        <header className="header">
          <nav className="navbar container">
            <Link href="/Feedback">
              Feedback Management
            </Link>
          </nav>
        </header>
        <section className="container">
          <h1>Welcome to the HR Feedback System</h1>
          <p>
            This platform allows HR to manage and review employee feedback with ease. Use the
            navigation to explore feedback management features.
          </p>
        </section>
      </main>
  );
}
