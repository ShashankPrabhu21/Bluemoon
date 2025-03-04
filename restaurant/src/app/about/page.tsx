import Image from 'next/image';
import Link from "next/link";


export default function About() { 
    return (
        <div className="min-h-screen bg-white opacity-90 text-[#3345A7]">
            
            {/* Hero Section */}
            <div className="relative flex flex-col items-center justify-center h-80 bg-cover bg-center"
                style={{ backgroundImage: "url('/base.jpg')" }}>
                <h2 className="text-4xl font-bold text-white z-10 ">About Us</h2>
                <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark Overlay */}
            </div>

            {/* Breadcrumbs */}
            <div className="flex justify-center items-center gap-2 text-gray-700 py-4">
            <Link href="/" className="hover:text-gray-500">
                <span>🏠 Home</span>
            </Link>
            <span className="text-bla">›</span>
            <span className="text-black">About</span>
            </div>


            {/* Content Section */}
            <div className="max-w-6xl mx-auto py-12 px-6 flex flex-col md:flex-row items-center gap-8">
                {/* Text Section */}
                <div className="md:w-1/2">
                    <p className="text-lg leading-relaxed text-[#3345A7] text-justify">
                        As the pioneers of authentic Kerala cuisine in Sydney, we take pride in preserving 
                        traditional flavors with excellence. Renowned for our rich culinary heritage, we offer 
                        an exceptional dining experience while also specializing in bulk catering services. 
                        Whether for intimate gatherings or large-scale events, our expertly crafted dishes 
                        bring the true taste of Kerala to every occasion.
                    </p>
                </div>

                    
                <div className="md:w-1/2">
                    <Image src="/sec3.jpg" alt="Restaurant Interior" layout="responsive" width={700} height={475} className="rounded-lg shadow-lg" />
                </div>
            </div>
            
        </div>
    );
}
