'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const response = await fetch('/api/read');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result?.hits?.hits)
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAllDocuments();
  }, []);


  const handleCreate = async () => {
    if (edit) {
      try {
        const response = await fetch('/api/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: edit, title: title, description: description }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const updatedData = data.map((doc) => {
          if (doc._id == edit) {
            return {
              ...doc,
              _source: {
                ...doc._source, // Preserve other properties in `_source`
                title, // Update the title
                description // Update the description
              }
            }
          }
          return doc;
        })

        setData(updatedData);
        const result = await response.json();
      } catch (error) {
        setError(error.message);
      }
      finally {
        setTitle('');
        setDescription('');
        setEdit("");
      }
    }
    else {
      try {
        const response = await fetch('/api/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description }),
        });

        const result = await response.json();
        window.location.reload()
      } catch (error) {
        setError(error.message);
      }
      finally {
        setTitle('');
        setDescription('');
        setEdit(null);
      }
    }

  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const filteredList = data.filter((doc) => doc._id != id);
      setData(filteredList);
      const result = await response.json();
      console.log('Document deleted:', result);
      // Refresh the document list
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div className="p-8 bg-gradient-to-r from-green-50 to-blue-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">ElasticSearch Operations</h1>

      <div className="max-w-md mx-auto bg-white text-center p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Document</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreate}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-md hover:from-blue-500 hover:to-blue-700 transition duration-300"
          >
            Create
          </button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="mt-12 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Documents</h2>
          <ul className="space-y-6">
            {data.map((doc: any, index: number) => (
              <li key={doc._id} className="p-6 border border-gray-300 rounded-md shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <strong className="text-gray-900">ID:</strong> {doc._id}
                  </div>
                </div>
                <p className="text-gray-800"><strong>Title:</strong> {doc?._source?.title}</p>
                <p className="text-gray-800"><strong>Description:</strong> {doc?._source?.description}</p>
                <button
                  onClick={() => {
                    setEdit(doc?._id)
                    setTitle(doc?._source?.title)
                    setDescription(doc?._source?.description)
                  }}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition duration-300 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="mt-6 text-center text-red-500 text-lg font-medium">{error}</p>}
    </div>
  )
}
