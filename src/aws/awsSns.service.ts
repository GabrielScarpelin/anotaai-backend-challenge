import { Injectable } from '@nestjs/common';
import { AwsSnsConfig } from './AwsSnsConfig';
import { PublishCommand } from '@aws-sdk/client-sns';

@Injectable()
export class AwsService {
  private readonly catalogTopicArn = process.env.SNS_ARN;
  constructor(private readonly AwsSNS: AwsSnsConfig) {}
  async publishMessage(message: string) {
    const snsClient = this.AwsSNS.configSnsClient();
    const response = snsClient.send(
      new PublishCommand({ Message: message, TopicArn: this.catalogTopicArn }),
    );
    return response;
  }
}
