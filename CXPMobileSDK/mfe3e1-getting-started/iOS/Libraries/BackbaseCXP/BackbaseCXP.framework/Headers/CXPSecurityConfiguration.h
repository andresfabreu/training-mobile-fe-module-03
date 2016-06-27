//
//  CXPSecurityConfiguration.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 08/02/16.
//  Copyright © 2016 Backbase R&D B.V. All rights reserved.
//

#import <BackbaseCXP/BackbaseCXP.h>

/// Security related configurations
@interface CXPSecurityConfiguration : NSObject

/// List of patterns for allowed domains (RWARP)
@property (strong, nonatomic) NSArray* allowedDomains;

/// SSL pinning related configurations
@property (strong, nonatomic) CXPSSLPinningConfiguration* sslPinning;

/// Block web view originated request.
@property (assign, nonatomic) BOOL blockWebViewRequests;
@end
