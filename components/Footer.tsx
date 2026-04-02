export default function Footer() {
  return (
    <footer className="bg-indigo-50 border-t py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <p className="text-gray-700 md:mr-6 text-center md:text-left">
          Subscribe to our newsletter to get the latest stories, insights, and opportunities directly in your inbox.
        </p>
        <div className="flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none w-full md:w-auto"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition w-full md:w-auto">
            Subscribe
          </button>
        </div>
      </div>
    </footer>
  );
}