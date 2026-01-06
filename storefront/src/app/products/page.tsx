import Link from 'next/link'

export default function ProductsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Sample Product 1</h2>
            <p className="text-gray-600 mb-4">This is a sample product description</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">$99.00</span>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Add to Cart
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Sample Product 2</h2>
            <p className="text-gray-600 mb-4">This is a sample product description</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">$149.00</span>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Add to Cart
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Sample Product 3</h2>
            <p className="text-gray-600 mb-4">This is a sample product description</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">$199.00</span>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
