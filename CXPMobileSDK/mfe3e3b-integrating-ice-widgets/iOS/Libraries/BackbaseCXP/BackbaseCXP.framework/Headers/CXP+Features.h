//
//  CXP+Features.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 17/06/15.
//

#import <BackbaseCXP/BackbaseCXP.h>

@interface CXP (Features)

/**
 * Registers a class to respond as a feature. This method returns if the feauture was successfully registered or not.
 * @param feature The class defining the feature to register. It has to extend from Feature class.
 * @param error If an error occurs, upon return contains an NSError object that describes the problem.
 * @return YES if the class was registered successfully.
 */
+ (BOOL)registerFeature:(Feature*)feature error:(NSError**)error;

/**
 * Unregisters a feature class.
 * @param feature The class defining the feature to unregister
 */
+ (void)unregisterFeature:(Feature*)feature;

/**
 * Returns the instance of the registered feature of the given type.
 * @discussion This method is useful to retrieve instances of features that can be useful in native code as well, for
 * instance,
 * SyncedPreferences.
 * @param featureType The class of the feature type to look up
 * @return The registered feature instance if any. nil otherwise.
 */
+ (Feature*)registeredFeature:(Class)featureType;
@end
