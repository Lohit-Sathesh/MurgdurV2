import { Body, Controller, Post } from '@nestjs/common'
import { EmailService } from '../email/email.service'
import { SubscribeDto } from './dto/subscribe.dto'

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly emailService: EmailService) {}

  @Post('subscribe')
  async subscribe(@Body() dto: SubscribeDto) {
    await this.emailService.sendNewsletterWelcome(dto.email)
    return { success: true, message: 'Subscribed successfully' }
  }
}
