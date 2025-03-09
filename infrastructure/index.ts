import {App, Stack, type StackProps} from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import s3, { BlockPublicAccess } from 'aws-cdk-lib/aws-s3'
import cloudfront from 'aws-cdk-lib/aws-cloudfront'
import cloudfrontorigins from 'aws-cdk-lib/aws-cloudfront-origins'
import certificatemanager from 'aws-cdk-lib/aws-certificatemanager'
import s3deploy from 'aws-cdk-lib/aws-s3-deployment'

import config from "./config.ts"


class FrontEndStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)
        const bucket = new s3.Bucket(this, 'Dyscord-FrontEnd-Bucket', {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            bucketName: 'new-grad-bucket',
            versioned: true,
            websiteIndexDocument: 'index.html',
          });
      
          const distribution = new cloudfront.Distribution(this, 'Dyscord-Website-Distribution', {
            certificate: certificatemanager.Certificate.fromCertificateArn(this, 'NewGradCertificate', config.acm),
            defaultBehavior: {
              origin: new cloudfrontorigins.S3StaticWebsiteOrigin(bucket),
              viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
            },
            domainNames: [config.url],
          })
      
          new s3deploy.BucketDeployment(this, 'Dyscord-Website-Deployment', {
            destinationBucket: bucket,
            distribution: distribution,
            sources: [s3deploy.Source.asset("../website")],
          })


    }
}



const app = new App();
new FrontEndStack(app, 'dyscord-frontend', {})