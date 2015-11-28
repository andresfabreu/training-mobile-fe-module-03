//
//  Feature.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 14/04/15.
//

#import <Foundation/Foundation.h>

/**
 * Feature base protocol.
 * All native-to-javascript features MUST specify the methods to expose in a protocol that extends this one, and
 * implement them in a class that extends from the Feature base class.
 * All methods exposed should be required and instance type (non-static).
 * As a recommendation, name the feature protocols as FunctionalitySpec in this way will be clear that the feature class
 * will provide an implementation for the specification.
 */
@protocol Feature <NSObject>
@end

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
 * Initializes a feature instance to pass parameters that might be changing during the runtime.
 * @param parameters A dictionary string-objects with the parameters this feature depends on.
 * @discussion A feature might require context specific parameters, for instance, the current view controller. For this
 * kind of parameters this method allows the developers remain reactive to the context they are running into. It's
 * responsibility of the developer to invoke this method when necessary. Also it's responsibility of the developer to
 * determine what to do if the required parameters weren't passed at the moment a feature function is called.
 */
- (void)initialize:(NSDictionary*)parameters;

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
