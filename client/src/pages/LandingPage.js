import React from 'react';
import { Link } from 'react-router-dom';
import { FaTshirt, FaUsers, FaLeaf, FaRecycle, FaHandshake, FaShieldAlt, FaSmile, FaGlobe } from 'react-icons/fa';

// Show only 5 floating images, spaced to fit above the buttons
const floatingImages = [
  { src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=400&h=400', arcPos: 0.08 },
  { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400', arcPos: 0.24 },
  { src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400', arcPos: 0.5 },
  { src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400', arcPos: 0.76 },
  { src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400', arcPos: 0.92 },
];

// Show only 8 categories (4 per row)
const categories = [
  { name: 'Men', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=400&h=400' },
  { name: 'Women', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400' },
  { name: 'Kids', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=facearea&w=400&h=400' },
  { name: 'Accessories', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400' },
  { name: 'Shoes', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400' },
  { name: 'Outerwear', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400' },
  { name: 'Sportswear', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=400&h=400' },
  { name: 'Formal', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400' },
];

// Advantages/Benefits
const benefits = [
  { icon: <FaLeaf size={36} color="#22c55e" />, title: 'Eco-Friendly', desc: 'Reduce textile waste and help the planet by reusing and recycling clothing.' },
  { icon: <FaRecycle size={36} color="#22c55e" />, title: 'Sustainable Fashion', desc: 'Promote a circular economy and sustainable lifestyle.' },
  { icon: <FaHandshake size={36} color="#22c55e" />, title: 'Community Driven', desc: 'Connect with like-minded people who care about conscious fashion.' },
  { icon: <FaSmile size={36} color="#22c55e" />, title: 'Affordable', desc: 'Get great fashion at a fraction of the cost.' },
];

// Helper to get arc positions for floating images
function getArcPosition(cx, cy, r, t) {
  // t: 0 (left) to 1 (right)
  const angle = Math.PI * (1 + t); // from 180deg to 360deg
  return {
    left: cx + r * Math.cos(angle) - 90, // 90 = half image size (180)
    top: cy + r * Math.sin(angle) - 90,
    rotate: `${-20 + t * 40}deg`,
  };
}

const LandingPage = () => {
  // Arc center and radius (responsive)
  const arcWidth = 1200;
  const arcHeight = 600;
  const cx = arcWidth / 2;
  const cy = arcHeight * 1.18;
  const r = arcWidth * 0.48;

  return (
    <div style={{ minHeight: '100vh', background: '#18181b', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Arc Hero Section */}
      <div style={{ position: 'relative', width: '100%', maxWidth: arcWidth, margin: '0 auto', marginTop: 32, minHeight: arcHeight + 40 }}>
        {/* SVG Arc */}
        <svg width={arcWidth} height={arcHeight} style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }}>
          <path
            d={`M0,${cy} A${r},${r} 0 0,1 ${arcWidth},${cy}`}
            fill="none"
            stroke="#22c55e44"
            strokeWidth="22"
          />
        </svg>
        {/* Floating Images on Arc (zIndex: 1) */}
        {floatingImages.map((img, idx) => {
          const pos = getArcPosition(cx, cy, r, img.arcPos);
          return (
            <img
              key={idx}
              src={img.src}
              alt="clothing community"
              style={{
                position: 'absolute',
                width: 180,
                height: 180,
                objectFit: 'cover',
                borderRadius: 32,
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                border: '4px solid #232323',
                left: pos.left,
                top: pos.top,
                transform: `rotate(${pos.rotate})`,
                zIndex: 1,
                transition: 'transform 0.4s',
                background: '#232323',
              }}
            />
          );
        })}
        {/* Main Content in Arc (no background, zIndex: 2) */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: arcHeight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: -2, marginBottom: '1.5rem', lineHeight: 1.1, textShadow: '0 2px 16px #18181b, 0 1px 2px #0008' }}>
            Clothing's <br /> Social Exchange
          </h1>
          <p style={{ fontSize: 22, color: '#cbd5e1', maxWidth: 540, margin: '0 auto 2.5rem', textShadow: '0 2px 8px #18181b, 0 1px 2px #0006' }}>
            Join our community of eco-conscious fashion lovers. Swap, share, and discover pre-loved clothing while reducing textile waste and promoting sustainable fashion.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to="/register" style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 32, padding: '1rem 2.5rem', fontWeight: 700, fontSize: 22, textDecoration: 'none', boxShadow: '0 2px 16px rgba(34,197,94,0.18)', transition: 'background 0.2s, color 0.2s' }}>
              Start Swapping
            </Link>
            <Link to="/items" style={{ background: 'none', color: '#22c55e', border: '2px solid #22c55e', borderRadius: 32, padding: '1rem 2.5rem', fontWeight: 700, fontSize: 22, textDecoration: 'none', boxShadow: '0 2px 16px rgba(34,197,94,0.08)', transition: 'background 0.2s, color 0.2s' }}>
              Browse
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section style={{ maxWidth: 900, margin: '48px auto 0', padding: '0 24px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 32, textAlign: 'center', color: '#fff' }}>Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {categories.map((cat, idx) => (
            <div key={cat.name} style={{ background: '#232323', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.13)', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <img src={cat.img} alt={cat.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              <div style={{ padding: '1rem 0', fontWeight: 600, fontSize: 20, color: '#22c55e', letterSpacing: 1 }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits/Advantages Section */}
      <section style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 24px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 32, textAlign: 'center', color: '#fff' }}>Why Choose ReWear?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
          {benefits.map((b, idx) => (
            <div key={b.title} style={{ background: '#232323', borderRadius: 20, padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.13)', minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: 18 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10, color: '#22c55e' }}>{b.title}</div>
              <div style={{ color: '#cbd5e1', fontSize: 17 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Decorative icons (optional) */}
      <FaTshirt style={{ position: 'absolute', left: 40, bottom: 40, fontSize: 48, color: '#22c55e88', zIndex: 0 }} />
      <FaUsers style={{ position: 'absolute', right: 60, top: 60, fontSize: 44, color: '#22c55e66', zIndex: 0 }} />

      {/* TODO: Popular Listings section goes here */}
    </div>
  );
};

export default LandingPage; 