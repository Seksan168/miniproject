// pages/index.js
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow bg-white py-8 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section: Text Content */}
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-4xl font-semibold text-gray-800 sm:text-5xl md:text-6xl">
              Welcome to <span className="text-blue-600">Itemify</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Itemify is the most efficient point of sale (POS) solution
              designed for small businesses. Manage inventory, track sales, and
              improve customer experience all in one place.
            </p>
            <a
              href="/regis"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200"
            >
              Get Started
            </a>
          </div>

          {/* Right Section: Image */}
          <div className="relative">
            <img
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              src="https://cdn.prod.website-files.com/63280e67165b791199275cd1/632d47aae68d3a2ffc36b8ef_631eff439b6c6c20190d3535_pexels-imin-technology-12935048%2520(1).jpeg"
              alt="POS Image"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
