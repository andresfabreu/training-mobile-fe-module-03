//
//  SyncedPreferences.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 10/06/15.
//

#import <BackbaseCXP/BackbaseCXP.h>

/// SyncedPreferencesSpec protocol. Contract for the SyncedPreferences feature.
@protocol SyncedPreferencesSpec <Feature>
/**
 * Sets a value in the given key.
 * If the key doesn't exists the value is inserted. If the key already exists it's override by the new value.
 * @param key The key's name to be stored
 * @param value The value to insert / replace in the given key.
 * @discussion This method's signature differs from the objective-c standard (setItem:forKey):
 * <ol>
 * <li>to compliant with W3C specification of the Storage interface. </li>
 * <li>to provide the correct method name in javascript feature.setItem('key', 'value'); </li>
 * </ol>
 */
- (void)setItem:(NSString*)key /* value */:(NSString*)value;

/**
 * Removes the element's given key from the storage.
 * If the element doesn't exist, it has no effect.
 * @param key The key's name to be stored
 */
- (void)removeItem:(NSString*)key;

/**
 * Gets the value in the given key.
 * @param key The key's name to be stored
 * @return The value associated with the key if exists. nil otherwise.
 */
- (NSString*)getItem:(NSString*)key;

/**
 * Clears all keys from the storage. All data related to this bucket is lost.
 */
- (void)clear;
@end

/**
 * SyncedPreferences storage feature.
 * This feature allows to share preferences across multiple sandboxed widgets in a explicit way.
 * In order to share a preference the widgets need to explicitly access this feature and set the value to it.
 */
@interface SyncedPreferences : Feature <SyncedPreferencesSpec>
@end