//
//  CXPSSLPinningConfigurations.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 08/02/16.
//  Copyright © 2016 Backbase R&D B.V. All rights reserved.
//

#import <Foundation/Foundation.h>

/// SSL pinning related configurations
@interface CXPSSLPinningConfiguration : NSObject

/// Array of local paths to certificates files, in .der format.
@property (strong, nonatomic) NSArray* certificates;

/// Array of patterns of domains that must be excluded from the pinning checks
@property (strong, nonatomic) NSArray* domainExceptions;
@end
