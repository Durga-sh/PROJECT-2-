import React from "react";
import paymentAPI from "../api/payment";

const PaymentExample = () => {
  const handlePayment = async () => {
    try {
      // Example order data
      const orderData = {
        orderId: "ORDER123",
        orderNumber: "ORD12345",
        totalAmount: 500, // Amount in rupees
      };

      // Initiate payment
      await paymentAPI.initiateRazorpayPayment(orderData, {
        onSuccess: (paymentData) => {
          console.log("Payment successful:", paymentData);
          alert("Payment completed successfully!");
        },
        onError: (error) => {
          console.error("Payment failed:", error);
          alert(`Payment failed: ${error}`);
        },
        onDismiss: () => {
          console.log("Payment modal dismissed");
          alert("Payment cancelled");
        },
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment");
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Test Payment Integration</h3>
      <button
        onClick={handlePayment}
        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
      >
        Pay ₹500
      </button>
    </div>
  );
};

export default PaymentExample;
