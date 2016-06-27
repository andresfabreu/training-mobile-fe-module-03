//
//  CXP+Targeting.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 10/05/16.
//  Copyright © 2016 Backbase R&D B.V. All rights reserved.
//

#import <BackbaseCXP/BackbaseCXP.h>

@interface CXP (Targeting)
/**
 * Adds a targeting parameter to be send to the server when the model is requested.
 * The parameter will be added as a header with the prefix <b>X-Targeting-</b>, to allow easier filtering/parsing on the
 * server collector. For instance, calling this method with key="myparam" value="3.14" will result in a header called
 * <pre>X-Targeting-myparam: 3.14</pre>
 * @discussion Not all characters are valid as a key. For this reason, colons (:) are replaced with dashes (-), and
 * space (0x20) are replaced with underscore (_).
 * @param value The value to be send as the parameter
 * @param key   The name of the parameter
 * @return The previous value on the same key, otherwise nil
 */
+ (NSString*)addTargetingParameter:(NSString*)value forKey:(NSString*)key;

/**
 * Clears the targeting parameters. This method may be useful when the model is invalidated to personalize the
 * experience of the non-authenticated phase.
 */
+ (void)clearTargetingParameters;

/**
 * Removes a single parameter. Subsequent call won't contain this parameter until re-added.
 * @param key The name of the parameter to be removed.
 * @return The previous value on the same key, otherwise nil.
 */
+ (NSString*)removeTargetingParameter:(NSString*)key;
@end
