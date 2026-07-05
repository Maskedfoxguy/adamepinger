import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg mb-8">
          Welcome, Adam. You are logged in. This is where you will manage your portfolio content.
        </p>

        {/* --- START: New Project Form --- */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Add a New Project</h2>
          <form className="space-y-4">
            {/* Project Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Project Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

             {/* Technologies Input */}
             <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-gray-300">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Image URL Input */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
        {/* --- END: New Project Form --- */}

      </div>
    </div>
  );
};

export default AdminDashboardPage;