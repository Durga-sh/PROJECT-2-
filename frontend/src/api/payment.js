const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class PaymentAPI {
  async createPaymentOrder(amount, orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount,
          orderId,
          currency: "INR",
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create payment order API error:", error);
      throw error;
    }
  }

  async verifyPayment(paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Verify payment API error:", error);
      throw error;
    }
  }

  async handlePaymentFailure(orderId, error) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/failure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          error,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Handle payment failure API error:", error);
      throw error;
    }
  }

  async getPaymentDetails(orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get payment details API error:", error);
      throw error;
    }
  }

  // Initialize Razorpay payment
  async initiateRazorpayPayment(orderData, paymentOptions = {}) {
    try {
      // Create payment order first
      const paymentOrderResult = await this.createPaymentOrder(
        orderData.totalAmount,
        orderData.orderId
      );

      if (!paymentOrderResult.success) {
        throw new Error(
          paymentOrderResult.message || "Failed to create payment order"
        );
      }

      const { id: razorpayOrderId, amount, currency } = paymentOrderResult.data;

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "FoodApp",
        description: `Order #${orderData.orderNumber || orderData.orderId}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verificationResult = await this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId,
            });

            if (verificationResult.success) {
              paymentOptions.onSuccess?.(verificationResult.data);
            } else {
              paymentOptions.onError?.(verificationResult.message);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            paymentOptions.onError?.(error.message);
          }
        },
        modal: {
          ondismiss: () => {
            paymentOptions.onDismiss?.();
          },
        },
        theme: {
          color: "#ea580c", // Orange color matching your app theme
        },
        ...paymentOptions.razorpayOptions, // Allow custom Razorpay options
      };

      // Create Razorpay instance and open payment modal
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async (response) => {
        try {
          await this.handlePaymentFailure(orderData.orderId, response.error);
          paymentOptions.onError?.(response.error.description);
        } catch (error) {
          console.error("Payment failure handling error:", error);
          paymentOptions.onError?.(error.message);
        }
      });

      razorpay.open();

      return {
        success: true,
        razorpayOrderId,
      };
    } catch (error) {
      console.error("Initiate Razorpay payment error:", error);
      throw error;
    }
  }
}

const paymentAPI = new PaymentAPI();
export default paymentAPI;
