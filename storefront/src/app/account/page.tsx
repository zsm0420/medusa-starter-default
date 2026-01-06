import Link from 'next/link'

export default function AccountPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-600">Manage your account details</p>
          </div>
          
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <p className="text-gray-600">View your order history</p>
          </div>
          
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Addresses</h2>
            <p className="text-gray-600">Manage shipping addresses</p>
          </div>
          
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-600">Account settings and preferences</p>
          </div>
        </div>
      </div>
    </main>
  )
}
