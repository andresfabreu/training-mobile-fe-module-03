//
//  CXPPortalConfiguration.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 08/02/16.
//  Copyright © 2016 Backbase R&D B.V. All rights reserved.
//

#import <Foundation/Foundation.h>

/// Portal related configurations
@interface CXPPortalConfiguration : NSObject

/// Portal name to be loaded
@property (strong, nonatomic) NSString* name;

/// Local model file path.
@property (strong, nonatomic) NSString* localModelPath;

/// Remote context root used for endpoint services
@property (strong, nonatomic) NSString* remoteContextRoot;

/// Model server URL
@property (strong, nonatomic) NSString* serverURL;

/// Synced preferences to be use cross-widgets
@property (strong, nonatomic) NSDictionary* syncedPreferences;

/// Preload time out to wait for, expressed in seconds. Default is 10 seconds.
@property (assign, nonatomic) NSTimeInterval preloadTimeout;
@end
