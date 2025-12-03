import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Stethoscope, FlaskConical, BookOpen, Heart, Sparkles, 
  Instagram, Twitter, GraduationCap, Fingerprint, Mail 
} from 'lucide-react';
import ContactModal from '../components/ContactModal'; // <--- IMPORT THIS

// --- SAFE FALLBACK IMAGES ---
const SAFE_FALLBACKS = [
  "https://images.unsplash.com/photo-1559839734-2b71ea86b48e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1631217868264-e5b9099a5804?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1584036561566-b93744363369?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1582719471384-bc4d33919de9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1576091160550-217358c7e618?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
];

// --- HELPER COMPONENT ---
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (SAFE_FALLBACKS.includes(imgSrc)) return;
    const randomFallback = SAFE_FALLBACKS[Math.floor(Math.random() * SAFE_FALLBACKS.length)];
    setImgSrc(randomFallback);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

// --- MAIN PAGE COMPONENT ---
const About = () => {
  const containerRef = useRef(null);
  const [contactOpen, setContactOpen] = useState(false); // <--- NEW STATE

  const personalPhoto = "https://images.unsplash.com/photo-1736289173074-df6009da27c9?w=600&auto=format&fit=crop&q=60";
  
  const images = [
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413188/photo_6149833267805359191_y_rud2b7.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413187/photo_6149833267805359189_y_zoaemc.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413187/photo_6149833267805359190_y_jhw935.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413186/photo_6149833267805359187_y_sffpn5.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413186/photo_6149833267805359188_y_uzftq7.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413185/photo_6149833267805359186_y_mlz1vj.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413184/photo_6149833267805359185_y_sux7p9.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413177/photo_6149833267805359183_y_b76zig.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413177/photo_6149833267805359184_y_oqbmbi.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413176/photo_6149833267805359178_y_u2e4os.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413176/photo_6149833267805359180_y_ha5gwt.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413176/photo_6149833267805359182_x_fqs9ay.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413176/photo_6149833267805359181_y_ghfwn8.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413175/photo_6149833267805359179_y_snkok8.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413175/photo_6149833267805359176_y_npentl.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413174/photo_6149833267805359177_y_nal6pr.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413173/photo_6149833267805359174_y_gz6zge.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413173/photo_6149833267805359175_y_pbl0vz.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413173/photo_6149833267805359173_y_mnmrwr.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413172/photo_6149833267805359171_y_z8df2w.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413172/photo_6149833267805359172_y_abgutg.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413172/photo_6149833267805359168_y_f8nkqc.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413171/photo_6149833267805359169_y_hsvplh.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413171/photo_6149833267805359167_y_nrzjao.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413171/photo_6149833267805359170_x_eyeoif.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413170/photo_6149833267805359166_y_sh4nri.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413169/photo_6149833267805359164_y_gnknir.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413169/photo_6149833267805359165_x_uvs53m.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413168/photo_6149833267805359163_x_zzc41e.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413168/photo_6149833267805359162_y_phgyww.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413168/photo_6149833267805359160_y_ulvypr.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413167/photo_6149833267805359161_y_d7duup.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413167/photo_6149833267805359157_x_nlkqok.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413166/photo_6149833267805359159_y_r5plbo.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413165/photo_6149833267805359156_y_hdgm3b.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413164/photo_6149833267805359153_y_p8cfjr.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413164/photo_6149833267805359155_y_mtkyxo.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413164/photo_6149833267805359154_x_dxl3ny.jpg",
    "https://res.cloudinary.com/dkzmky42r/image/upload/v1764413164/photo_6149833267805359152_y_w5cppx.jpg"
  ];

  return (
    <div ref={containerRef} className="bg-gradient-to-br from-rose-50 via-white to-blue-50 overflow-hidden">
      <HeroSection personalPhoto={personalPhoto} images={images.slice(0, 8)} />
      <ParallaxSection personalPhoto={personalPhoto} images={images.slice(8, 16)} />
      <BentoSection personalPhoto={personalPhoto} images={images.slice(16, 24)} />
      <ResearchSection images={images.slice(24, 32)} />
      <GallerySection images={images.slice(32, 39)} />
      
      {/* Pass handler to footer */}
      <Footer onContactClick={() => setContactOpen(true)} />
      
      {/* Render Modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
};

// --- SUB COMPONENTS ---

const HeroSection = ({ personalPhoto, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Rotating Background Collage */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-2 p-4 opacity-20">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: idx === currentImageIndex ? 0.4 : 0.2, scale: idx === currentImageIndex ? 1.1 : 1 }}
            transition={{ duration: 1 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <ImageWithFallback
              src={img}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Hero Content with Personal Photo */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Main Photo */}
            <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl">
              <ImageWithFallback
                src={personalPhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border-2 border-rose-300/50"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 rounded-full border-2 border-purple-300/30"
            />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center md:text-left"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-rose-400" />
          </motion.div>
           
          <h1 className="text-5xl md:text-7xl mb-4 font-serif">
            <span className="bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              About Me
            </span>
          </h1>
           
          <p className="text-xl md:text-2xl text-gray-700 max-w-xl mb-6 italic">
            Medical Student • Research Enthusiast • Lifelong Learner
          </p>
           
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex gap-4 justify-center md:justify-start items-center flex-wrap"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg">
              <Stethoscope className="w-4 h-4 text-rose-500" />
              <span className="text-xs uppercase tracking-wider">MBBS</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg">
              <FlaskConical className="w-4 h-4 text-blue-500" />
              <span className="text-xs uppercase tracking-wider">Researcher</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span className="text-xs uppercase tracking-wider">Blogger</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

const ParallaxSection = ({ personalPhoto, images }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={ref} className="relative py-32 px-6">
      {/* Background Images with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div style={{ y: y1 }} className="absolute top-20 left-10 w-64 h-64 rounded-3xl overflow-hidden shadow-2xl opacity-30">
          <ImageWithFallback src={images[0]} alt="" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-20 right-10 w-80 h-80 rounded-3xl overflow-hidden shadow-2xl opacity-30">
          <ImageWithFallback src={images[1]} alt="" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto"
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50">
          <h2 className="text-5xl mb-8 text-center bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
            My Journey
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Welcome to my corner of the internet! I'm an MBBS student passionate about bridging the gap between 
              medicine and research. My journey in healthcare has been filled with late-night study sessions, 
              inspiring mentors, and countless "aha!" moments that fuel my curiosity every single day.
            </p>
            <p>
              Beyond the stethoscope and textbooks, I'm deeply fascinated by medical research and its potential 
              to transform lives. Whether it's exploring innovative treatment approaches or diving into scientific 
              literature, I find joy in every discovery.
            </p>
            <p className="italic text-rose-600">
              "The art of medicine consists of amusing the patient while nature cures the disease." - Voltaire
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const BentoSection = ({ personalPhoto, images }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-32 px-6 bg-gradient-to-b from-transparent to-rose-50/50">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-5xl mb-16 text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
        >
          What Drives Me
        </motion.h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Large Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-rose-100 to-purple-100 rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="relative z-10">
              <Heart className="w-12 h-12 text-rose-500 mb-4" />
              <h3 className="text-3xl mb-4">Passion for Healing</h3>
              <p className="text-gray-700 text-lg">
                Medicine isn't just a career path for me—it's a calling. Every patient interaction, 
                every diagnosis, and every treatment plan is an opportunity to make a real difference 
                in someone's life.
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-20 group-hover:opacity-30 transition-opacity">
              <ImageWithFallback src={images[0]} alt="" className="w-full h-full object-cover rounded-tl-3xl" />
            </div>
          </motion.div>

          {/* Personal Photo Card - Highlighted */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white to-rose-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow relative group"
          >
            <div className="relative w-full h-full">
              <ImageWithFallback src={personalPhoto} alt="Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Small Card 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 flex flex-col justify-center"
          >
            <FlaskConical className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="text-2xl mb-2">Research First</h3>
            <p className="text-gray-600">
              Evidence-based medicine starts with curiosity and rigorous research.
            </p>
          </motion.div>

          {/* Medium Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
          >
            <ImageWithFallback src={images[2]} alt="" className="w-full h-full object-cover" />
          </motion.div>

          {/* Quote Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-100 to-rose-100 rounded-3xl p-8 flex items-center justify-center"
          >
            <p className="text-2xl text-center italic text-gray-700">
              "Learning never exhausts the mind"
            </p>
          </motion.div>

          {/* Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
          >
            <ImageWithFallback src={images[3]} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ResearchSection = ({ images }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const researchAreas = [
    { title: "Clinical Trials", icon: Stethoscope, color: "rose" },
    { title: "Medical Innovation", icon: FlaskConical, color: "blue" },
    { title: "Patient Care", icon: Heart, color: "purple" },
    { title: "Academic Writing", icon: BookOpen, color: "pink" },
  ];

  return (
    <section ref={ref} className="py-32 px-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-4 gap-4 h-full">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Research Interests
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exploring the frontiers of medicine through dedicated research and continuous learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {researchAreas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className={`bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-${area.color}-200`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${area.color}-400 to-${area.color}-600 flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-3">{area.title}</h3>
                <p className="text-gray-600">
                  Dedicated to advancing knowledge and improving patient outcomes
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const GallerySection = ({ images }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-32 px-6 bg-gradient-to-b from-rose-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-5xl mb-16 text-center bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent"
        >
          Moments & Memories
        </motion.h2>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="break-inside-avoid mb-6 relative group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                <ImageWithFallback
                  src={img}
                  alt=""
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Polaroid Effect */}
              <div className="absolute -bottom-2 -right-2 w-full h-full bg-white rounded-2xl -z-10 shadow-md group-hover:shadow-xl transition-shadow" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onContactClick }) => {
  // Replace these with your actual links!
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Twitter, href: "https://x.com", label: "X (Twitter)", color: "hover:text-black" },
    { icon: GraduationCap, href: "https://scholar.google.com", label: "Google Scholar", color: "hover:text-blue-600" },
    { icon: Fingerprint, href: "https://orcid.org", label: "ORCID", color: "hover:text-green-600" },
  ];

  return (
    <footer className="py-20 px-6 bg-gradient-to-r from-rose-100 via-purple-100 to-blue-100">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Heart className="w-12 h-12 text-rose-500 mx-auto mb-6" />
          <h3 className="text-4xl mb-4">Let's Connect</h3>
          <p className="text-xl text-gray-600 mb-8">
            Always open to collaboration, research opportunities, and meaningful conversations
          </p>
          
          {/* Social Icons Row */}
          <div className="flex justify-center gap-8 mb-10">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-500 transition-colors transform hover:scale-110 ${social.color}`}
                aria-label={social.label}
              >
                <social.icon size={32} strokeWidth={1.5} />
              </a>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            {/* Get In Touch - TRIGGERS MODAL */}
            <button 
              onClick={onContactClick}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-full hover:shadow-xl transition-shadow flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Get in Touch
            </button>
            
            {/* Read My Blog - Internal Link */}
            <Link 
              to="/blogs"
              className="px-8 py-4 bg-white text-gray-700 rounded-full hover:shadow-xl transition-shadow"
            >
              Read My Blog
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default About;