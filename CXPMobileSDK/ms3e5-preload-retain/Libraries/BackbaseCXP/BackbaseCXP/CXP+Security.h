//
//  CXP+Security.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 03/08/15.
//  Copyright (c) 2015 Backbase R&D B.V. All rights reserved.
//

#import <BackbaseCXP/BackbaseCXP.h>

@interface CXP (Security)
/**
 * Indicates whether the device is jailbroken or not
 * @return BOOL YES if device is jailbroken. NO otherwise.
 */
+ (BOOL)isDeviceJailbroken;

/**
 * Registers an instance that conforms to the ViolationDelegate protocol.
 * @param delegate An instance conforming the protocol.
 */
+ (void)securityViolationDelegate:(NSObject<SecurityViolationDelegate>*)delegate;

@end
