import {App, RemovalPolicy, Stack, type StackProps} from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import s3, { BlockPublicAccess } from 'aws-cdk-lib/aws-s3'
import cloudfront from 'aws-cdk-lib/aws-cloudfront'
import cloudfrontorigins from 'aws-cdk-lib/aws-cloudfront-origins'
import certificatemanager from 'aws-cdk-lib/aws-certificatemanager'
import s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';


import config from "./config.ts"


export class FrontEndStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'DyscordFEBucket', {
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: 'dyscord-frontend-website-bucket',
      publicReadAccess: false,
      versioned: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      removalPolicy: RemovalPolicy.DESTROY,
      enforceSSL: true,
    });

    const distribution = new cloudfront.Distribution(this, 'DyscordFEDistribution', {
      certificate: certificatemanager.Certificate.fromCertificateArn(this, 'DyscordFECertificate', config.acm),
      defaultBehavior: {
        origin: new cloudfrontorigins.S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
      },
      defaultRootObject: 'index.html',
      domainNames: [config.url],
    })

    const oac = new cloudfront.CfnOriginAccessControl(this, 'DyscordFE-OAC', {
      originAccessControlConfig: {
        description: 'allows access to bucket from distribution',
        name: 'DyscordFE-OAC-Config',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      }
    })


    //https://github.com/aws/aws-cdk/issues/21771
    const cfndistribution = distribution.node.defaultChild as cloudfront.CfnDistribution;

    cfndistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity',
      '',
    )

    cfndistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.OriginAccessControlId',
      oac.attrId,
    );

    bucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        conditions: {
          StringEquals: {
            //Only allow cloudfront distributions of the same account to read from bucket
            'AWS:SourceARN': `arn:aws:cloudfront::${
              Stack.of(this).account
            }:distribution/${distribution.distributionId}`,
          },
        },
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
        resources: [bucket.bucketArn + '/*'],
      })
    );

    new s3deploy.BucketDeployment(this, 'DyscordFEDeployment', {
      destinationBucket: bucket,
      distribution: distribution,
      sources: [s3deploy.Source.asset("../dist")],
    })
  }
}

const app = new App();
new FrontEndStack(app, 'dyscord-frontend', {})