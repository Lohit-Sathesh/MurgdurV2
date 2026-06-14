import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay = require('razorpay');
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private razorpay: InstanceType<typeof Razorpay> | null = null;

  constructor(private readonly configService: ConfigService) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    } else {
      this.logger.warn('Razorpay is not configured. Payment routes will be disabled.');
    }
  }

  /**
   * Create a Razorpay order
   */
  async createOrder(
    amount: number, // in smallest currency unit (paise for INR)
    customerId: string,
    orderId: string,
    email: string,
  ) {
    try {
      const options = {
        amount, // in paise (multiply INR by 100)
        currency: 'INR',
        receipt: orderId,
        customer_notify: 1,
        notes: {
          orderId,
          customerId,
          email,
        },
      };

      if (!this.razorpay) {
        throw new BadRequestException('Razorpay is not configured');
      }
      const razorpayOrder = await this.razorpay.orders.create(options);
      this.logger.log(`Razorpay order created: ${razorpayOrder.id}`);

      return {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        status: razorpayOrder.status,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create Razorpay order: ${message}`);
      throw new BadRequestException('Payment initialization failed');
    }
  }

  /**
   * Verify payment signature
   */
  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): boolean {
    try {
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
      if (!keySecret) {
        throw new BadRequestException('Missing Razorpay key secret');
      }
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex');

      const isValid = expectedSignature === razorpaySignature;
      if (isValid) {
        this.logger.log(`Payment signature verified: ${razorpayPaymentId}`);
      } else {
        this.logger.warn(`Invalid payment signature for: ${razorpayPaymentId}`);
      }

      return isValid;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Signature verification failed: ${message}`);
      return false;
    }
  }

  /**
   * Fetch payment details from Razorpay
   */
  async getPaymentDetails(paymentId: string) {
    try {
      if (!this.razorpay) {
        throw new BadRequestException('Razorpay is not configured');
      }
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        orderId: payment.order_id,
        description: payment.description,
        acquirerData: payment.acquirer_data,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch payment: ${message}`);
      throw new BadRequestException('Failed to fetch payment details');
    }
  }

  /**
   * Capture payment (for authorized payments)
   */
  async capturePayment(paymentId: string, amount: number, currency: string = 'INR') {
    try {
      if (!this.razorpay) {
        throw new BadRequestException('Razorpay is not configured');
      }
      const payment = await this.razorpay.payments.capture(paymentId, amount, currency);
      this.logger.log(`Payment captured: ${paymentId}`);
      return {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to capture payment: ${message}`);
      throw new BadRequestException('Failed to capture payment');
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number) {
    try {
      const refundOptions: Record<string, unknown> = {};
      if (amount !== undefined) {
        refundOptions.amount = amount;
      }

      if (!this.razorpay) {
        throw new BadRequestException('Razorpay is not configured');
      }
      const refund = await this.razorpay.payments.refund(paymentId, refundOptions);
      this.logger.log(`Payment refunded: ${paymentId}, Refund ID: ${refund.id}`);

      return {
        id: refund.id,
        paymentId: refund.payment_id,
        amount: refund.amount,
        status: refund.status,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to refund payment: ${message}`);
      throw new BadRequestException('Failed to refund payment');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    body: string,
    signature: string,
  ): boolean {
    try {
      const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');
      if (!webhookSecret) {
        throw new BadRequestException('Missing Razorpay webhook secret');
      }
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      const isValid = expectedSignature === signature;
      if (!isValid) {
        this.logger.warn('Invalid webhook signature');
      }
      return isValid;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Webhook verification failed: ${message}`);
      return false;
    }
  }
}
