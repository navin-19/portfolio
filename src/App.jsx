import { useState, useRef, useEffect } from "react";
import Portfolio from "./Components/Pages/Home";
// import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";

export default function App() {
  const [selected, setSelected] = useState(null);
 
  return (
    <div className="font-sans antialiased">
      <Portfolio />
    </div>
  )
}

// function Header() {
//   return (
//     <header className="fixed w-full bg-white shadow z-50">
//       <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
//         <h1 className="text-xl font-bold text-pink-600">Arri Designs</h1>
//         <nav className="space-x-6 hidden md:block">
//           <a href="#home">HOME</a>
//           <a href="#about">ABOUT US</a>
//           <a href="#works">WORKS</a>
//           <a href="#contact">CONTACT US</a>
//         </nav>
//       </div>
//     </header>
//   );
// }

// function Home() {
//   return (
//     <section id="home" className="h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100 pt-16">
//       <div className="text-center max-w-xl">
//         <h2 className="text-4xl font-bold mb-4">Elegant Tailoring & Designer Wear</h2>
//         <p className="text-gray-600 mb-6">
//           Specialized in Arri works, wedding blouses, designer saree blouses.
//         </p>
//         <a href="#works">
//           <button className="bg-pink-500 text-white px-6 py-2 rounded-full">
//             Explore Works
//           </button>
//         </a>
//       </div>
//     </section>
//   );
// }

// function About() {
//   return (
//     <section id="about" className="py-16 text-center">
//       <h2 className="text-3xl font-bold mb-4">About Us</h2>
//       <p className="text-gray-600 max-w-2xl mx-auto">
//         Expert tailoring for bridal, casual and designer wear.
//       </p>
//     </section>
//   );
// }

// function Works() {
//   const [selected, setSelected] = useState(null);
//   const [preview, setPreview] = useState(0);
//   const scrollRef = useRef(null);

//   const items = [
//     {
//       title: "Wedding Blouse",
//       desc: "Heavy bridal arri work",
//       images: [
//         "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
//         "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
//       ],
//     },
//     {
//       title: "Arri Work",
//       desc: "Hand embroidery",
//       images: [
//         "https://images.unsplash.com/photo-1593032465171-8f0c8e5f5f9c",
//         "https://images.unsplash.com/photo-1593032465171-8f0c8e5f5f9c",
//       ],
//     },
//   ];

//   const duplicated = [...items, ...items, ...items, ...items];

//   useEffect(() => {
//     const el = scrollRef.current;
//     let animation;

//     const autoScroll = () => {
//       if (!el) return;
//       el.scrollLeft += 1;

//       if (el.scrollLeft >= el.scrollWidth / 2) {
//         el.scrollLeft = el.scrollWidth / 4;
//       }

//       animation = requestAnimationFrame(autoScroll);
//     };

//     animation = requestAnimationFrame(autoScroll);

//     return () => cancelAnimationFrame(animation);
//   }, []);

//   const scroll = (dir) => {
//     const el = scrollRef.current;
//     if (!el) return;
//     el.scrollBy({
//       left: dir === "next" ? 300 : -300,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <section id="works" className="py-16 bg-gray-100 overflow-hidden">
//       <h2 className="text-3xl font-bold text-center mb-10">Our Works</h2>

//       <div className="relative">
//         <button
//           onClick={() => scroll("prev")}
//           className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow p-3 rounded-full z-10"
//         >
//           {'<'}
//         </button>

//         <button
//           onClick={() => scroll("next")}
//           className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow p-3 rounded-full z-10"
//         >
//           {'>'}
//         </button>

//         <div
//           ref={scrollRef}
//           className="flex gap-6 overflow-x-auto px-10 no-scrollbar"
//         >
//           {duplicated.map((item, i) => (
//             <div
//               key={i}
//               onClick={() => {
//                 setSelected(item);
//                 setPreview(0);
//               }}
//               className="min-w-[250px] cursor-pointer"
//             >
//               <img
//                 src={`${item.images[0]}?w=400`}
//                 className="h-64 w-full object-cover rounded-lg"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {selected && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
//             <h3 className="text-xl font-bold mb-2">{selected.title}</h3>
//             <p className="text-gray-600 mb-4">{selected.desc}</p>

//             <img
//               src={`${selected.images[preview]}?w=600`}
//               className="w-full h-80 object-cover rounded mb-4"
//             />

//             <div className="flex gap-2">
//               {selected.images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={`${img}?w=100`}
//                   onClick={() => setPreview(idx)}
//                   className={`h-20 w-20 object-cover cursor-pointer rounded ${preview === idx ? "border-2 border-pink-500" : ""}`}
//                 />
//               ))}
//             </div>

//             <button
//               onClick={() => setSelected(null)}
//               className="mt-4 bg-pink-500 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// function Contact() {
//   return (
//     <section id="contact" className="py-16 text-center">
//       <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
//       <button className="bg-pink-500 text-white px-6 py-2 rounded">Send Message</button>
//     </section>
//   );
// }


// function SocialSidebar() {
//   return (
//     <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
//       <FaWhatsapp className="bg-green-500 text-white p-3 rounded-full" />
//       <FaInstagram className="bg-pink-500 text-white p-3 rounded-full" />
//       <FaFacebook className="bg-blue-600 text-white p-3 rounded-full" />
//     </div>
//   );
// }
