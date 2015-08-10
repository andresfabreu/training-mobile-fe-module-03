//
//  CXP+Core.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 30/04/15.
//

#import <Foundation/Foundation.h>
#import <BackbaseCXP/BackbaseCXP.h>

/**
 * Entry point for the CXP library.
 * This class provides convenient methods to save some boiler-plate code, and also to provide access to otherwise
 * private or protected APIs
 */
@interface CXP : NSObject

#pragma mark - Initialization

/**
 * Initializes the CXP internal states and prepare the proper functioning of subsequent methods.
 * @param configurationPath The file path containing the configuration information.
 * @param error If an error occurs, upon return contains an NSError object that describes the problem.
 * @return Yes if the objects could be initialized properly. No otherwise.
 */
+ (BOOL)initialize:(NSString*)configurationPath error:(NSError**)error;

/**
 * Retrieves the configuration object.
 * If this method is called before the initialize method, an exception will be raised.
 * @return A configuration object
 */
+ (CXPConfiguration*)configuration;

@end
