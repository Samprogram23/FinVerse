import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
            {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b sticky top-0 bg-white z-50" style={{ borderColor: '#E5E5E5' }}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <h1 className="text-2xl font-extrabold" style={{ color: '#FCA311' }}>
            FinVerse
          </h1>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex gap-8">
          <a href="#features" className="font-medium hover:opacity-70 transition" style={{ color: '#14213D' }}>
            Features
          </a>
          <a href="#about" className="font-medium hover:opacity-70 transition" style={{ color: '#14213D' }}>
            About
          </a>
          <a href="#contact" className="font-medium hover:opacity-70 transition" style={{ color: '#14213D' }}>
            Contact
          </a>
        </div>

        {/* Right Buttons */}
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg font-semibold transition hover:bg-gray-50"
            style={{ color: '#14213D', border: '2px solid #E5E5E5' }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#FCA311' }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <h2 className="text-5xl font-extrabold mb-4" style={{ color: '#000000' }}>
          Track Your Financial Universe
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#14213D' }}>
          Har ek rupaye ki kahani, ek jagah. Smart expense tracking for your daily life.
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-4 rounded-xl text-white font-bold text-lg transition hover:opacity-90"
          style={{ backgroundColor: '#FCA311' }}
        >
          🚀 Get Started Free
        </Link>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📊', title: 'Smart Charts', desc: 'Bar, Line & Pie charts se apna expense visualize karo' },
            { icon: '🎯', title: 'Budget Goals', desc: 'Monthly budget set karo aur track karo' },
            { icon: '📱', title: 'Anywhere Access', desc: 'Cloud pe data, kahin bhi kabhi bhi access karo' },
            { icon: '🔒', title: '100% Secure', desc: 'JWT authentication se aapka data safe' },
            { icon: '📤', title: 'Export Reports', desc: 'CSV/PDF mein expense report export karo' },
            { icon: '🌙', title: 'Dark Mode', desc: 'Light aur Dark theme, jaise aap chaho' },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border transition hover:shadow-lg"
              style={{ borderColor: '#E5E5E5', backgroundColor: '#FFFFFF' }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#000000' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#14213D' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
            {/* About Section */}
            {/* About Section */}
      <section id="about" className="py-20 px-6" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-6" style={{ color: '#000000' }}>
            About FinVerse
          </h2>
          <p className="text-lg mb-4 leading-relaxed" style={{ color: '#14213D' }}>
            FinVerse is not just an expense tracker — it's your <strong>financial companion</strong>.
            We built it to be simple, secure, and powerful, so you can effortlessly track
            your daily expenses.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: '#14213D' }}>
            Whether you're a student, professional, or business owner — FinVerse
            gives you <strong>complete control</strong> over your money.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 rounded-xl bg-white border" style={{ borderColor: '#E5E5E5' }}>
              <h3 className="text-3xl font-extrabold" style={{ color: '#FCA311' }}>10K+</h3>
              <p style={{ color: '#14213D' }}>Active Users</p>
            </div>
            <div className="p-6 rounded-xl bg-white border" style={{ borderColor: '#E5E5E5' }}>
              <h3 className="text-3xl font-extrabold" style={{ color: '#FCA311' }}>₹50Cr+</h3>
              <p style={{ color: '#14213D' }}>Transactions Tracked</p>
            </div>
            <div className="p-6 rounded-xl bg-white border" style={{ borderColor: '#E5E5E5' }}>
              <h3 className="text-3xl font-extrabold" style={{ color: '#FCA311' }}>4.9⭐</h3>
              <p style={{ color: '#14213D' }}>User Rating</p>
            </div>
          </div>
        </div>
      </section>
            {/* Contact Section */}
           {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4" style={{ color: '#000000' }}>
            Get In Touch
          </h2>
          <p className="text-lg mb-10" style={{ color: '#14213D' }}>
            Have a question, feedback, or suggestion? We'd love to hear from you!
          </p>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border text-center hover:shadow-lg transition" style={{ borderColor: '#E5E5E5' }}>
              <span className="text-4xl">📧</span>
              <h3 className="text-xl font-bold mt-3 mb-1" style={{ color: '#000000' }}>Email Us</h3>
              <p style={{ color: '#14213D' }}>support@finverse.com</p>
            </div>
            <div className="p-6 rounded-xl border text-center hover:shadow-lg transition" style={{ borderColor: '#E5E5E5' }}>
              <span className="text-4xl">🐦</span>
              <h3 className="text-xl font-bold mt-3 mb-1" style={{ color: '#000000' }}>Follow Us</h3>
              <p style={{ color: '#14213D' }}>@FinVerseApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t" style={{ borderColor: '#E5E5E5', color: '#14213D' }}>
        <p>© 2026 FinVerse. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;