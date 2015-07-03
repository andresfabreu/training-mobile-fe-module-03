//
//  Feature.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 14/04/15.
//  Copyright (c) 2015 Ignacio Calderon. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 * Feature base class.
 * All native-to-javascript features MUST extend this class and be registered for use using the CXP class.
 * This class provides internal means to expose the information required by the widgets to enable the javascript
 * counterparts.
 * Additionally, it provides 2 methods that need to be used by any implementation in order to notify javascript that the
 * native part is done and is ready to process the data gathered on the native land, or the native operation fail and
 * for what reason.
 */
@interface Feature : NSObject

/**
 * Notifies that the feature has finished successfully.
 * It might pass a JSON-compatible object (or nil) and the function that was successfully finished in selector form.
 * It's responsibility of the developer to call the error method in the exposed features.
 * @discussion For non-asynchronous calls the reserved selector _cmd is the preferred way to use. For async calls, it's
 * responsibility of the developer to keep track what call was done and what call should be notified.
 * @param jsonCompatibleObject a JSON payload to be passed to the Javascript invoker of the feature.
 * @param origin The selector that has successfully finish the feature call.
 */
- (void)success:(id)jsonCompatibleObject from:(SEL)origin;

/**
 * Notifies that the feature has finished with an error.
 * It might pass a JSON-compatible object (or nil) and the function that was failed in selector form.
 * It's responsibility of the developer to call the success method in the exposed features.
 * @discussion For non-asynchronous calls the reserved selector _cmd is the preferred way to use. For async calls, it's
 * responsibility of the developer to keep track what call was done and what call should be notified.
 * @param jsonCompatibleObject a JSON payload to be passed to the Javascript invoker of the feature.
 * @param origin The selector that has successfully finish the feature call.
 */
- (void)error:(id)jsonCompatibleObject from:(SEL)origin;

@end
