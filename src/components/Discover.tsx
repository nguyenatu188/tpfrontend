import React from "react";
import data from "../data/discoverData.json"; // Import the JSON data

// Define the type for the articles
interface DiscoverArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  author: string;
}

interface DiscoverProps {
  id: string;
}

const Discover: React.FC<DiscoverProps> = ({ id }) => {
  // Cast the imported JSON data to the DiscoverArticle type
  const articles: DiscoverArticle[] = data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Articles about Vietnam (Trip ID: {id})</h1>
      </div>

    

      {/* Sidebar and Articles Container */}
      <div className="flex space-x-6">
        {/* Sidebar */}
        <div className="w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-4">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span className="text-gray-700 font-medium">Articles</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                {articles.length}
              </span>
            </div>

          </div>
        </div>

        {/* Articles Grid */}
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article: DiscoverArticle) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex space-x-2 mb-2">
                  {article.category.split(", ").map((cat) => (
                    <span
                      key={cat}
                      className="text-xs font-semibold text-white bg-gray-500 px-2 py-1 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {article.title}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {article.description}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200" /> {/* Placeholder for author avatar */}
                  <span className="text-gray-600 text-sm">{article.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;