//
//  CXPConfiguration.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 23/02/15.
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

/// Remote context root. if omitted, remoteContextRoot is initialized with serverURL
@property (strong, nonatomic) NSString* remoteContextRoot;

/// Local model path
@property (strong, nonatomic) NSString* localModelPath;

/// Template specific information.
@property (strong, nonatomic) NSDictionary* template;

/// Behaviour Map array
@property (strong, nonatomic) NSArray* behaviourMap;

/// Synced Preferences definition
@property (strong, nonatomic) NSDictionary* syncedPreferences;

/// Domain Access array, whitelist of domains
@property (strong, nonatomic) NSArray* domainAccess;

/// Pinned SSL certificates, if not empty only https connections to specific certificates are allowed.
@property (strong, nonatomic) NSArray* pinnedCertificates;

/// Debug flag
@property (assign, nonatomic) BOOL debug;

/// Debug context root $(contextRoot) replacement, only for debug/development purposes
@property (strong, nonatomic) NSString* debugContextRoot;

/// Debug performance endpoint URL
@property (strong, nonatomic) NSString* debugPerformanceEndpointURL;

@end
