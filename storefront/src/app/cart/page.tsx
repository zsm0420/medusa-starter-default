import Link from 'next/link'

export default function CartPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <p className="text-gray-600 text-center py-8">
            Your cart is empty. <Link href="/products" className="text-blue-600 hover:underline">Browse products</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
