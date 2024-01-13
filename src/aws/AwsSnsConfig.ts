import { SNSClient } from '@aws-sdk/client-sns';

export class AwsSnsConfig {
  private readonly awsUser = process.env.AWS_ACCESS_KEY;
  private readonly awsKey = process.env.AWS_SECRET_KEY;

  private readonly awsRegion = process.env.AWS_REGION;

  configSnsClient() {
    const myClientSns = new SNSClient({
      region: this.awsRegion,
      credentials: { accessKeyId: this.awsUser, secretAccessKey: this.awsKey },
    });
    return myClientSns;
  }
}
