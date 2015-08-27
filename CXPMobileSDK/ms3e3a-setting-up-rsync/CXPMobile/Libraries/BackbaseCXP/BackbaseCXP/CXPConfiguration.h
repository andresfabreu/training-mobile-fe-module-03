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
/// Template specific information.
@property (strong, nonatomic) NSDictionary* template;
/// Local model path
@property (strong, nonatomic) NSString* localModelPath;
/// Behaviour Map array
@property (strong, nonatomic) NSArray* behaviourMap;
/// Synced Preferences definition
@property (strong, nonatomic) NSDictionary* syncedPreferences;
/// Debug flag
@property (assign, nonatomic) BOOL debug;
/// Debug context root $(contextRoot) replacement, only for debug/development purposes
@property (strong, nonatomic) NSString* debugContextRoot;
/// Debug performance endpoint URL
@property (strong, nonatomic) NSString* debugPerformanceEndpointURL;
@end
