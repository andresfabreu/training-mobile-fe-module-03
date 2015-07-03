//
//  CXPConfiguration.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 23/02/15.
//  Copyright (c) 2015 Backbase. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <BackbaseCXP/BackbaseCXP.h>

/**
 * CXP-specific configuration
 */
@interface CXPConfiguration : NSObject
/// Portal name
@property (strong, nonatomic) NSString* portal;
/// Base backend URL (host + port)
@property (strong, nonatomic) NSString* serverURL;
/// Template specific information.
@property (strong, nonatomic) NSDictionary* template;
/// Local model path
@property (strong, nonatomic) NSString* localModelPath;
/// Behaviour Map array
@property (strong, nonatomic) NSArray* behaviourMap;
/// Debug flag
@property BOOL debug;
@end
