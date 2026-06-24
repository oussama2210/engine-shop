import Image from "next/image";
import Link from "next/link";

const Cart = ({ cartItems = [] }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount 
        ? item.price - (item.price * item.discount / 100)
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.discount) {
        return total + (item.price * item.discount / 100 * item.quantity);
      }
      return total;
    }, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Link 
            href="/shop"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center">
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button className="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center">
                      +
                    </button>
                  </div>
                  
                  <div className="text-right">
                    {item.discount ? (
                      <div>
                        <p className="text-sm text-gray-500 line-through">${item.price}</p>
                        <p className="text-lg font-bold text-green-600">
                          ${(item.price - (item.price * item.discount / 100)).toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg font-bold">${item.price}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${(calculateTotal() + calculateDiscount()).toFixed(2)}</span>
              </div>
              
              {calculateDiscount() > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <button className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-colors font-medium">
              Proceed to Checkout
            </button>
            
            <Link 
              href="/shop"
              className="block text-center text-green-600 hover:text-green-700 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
