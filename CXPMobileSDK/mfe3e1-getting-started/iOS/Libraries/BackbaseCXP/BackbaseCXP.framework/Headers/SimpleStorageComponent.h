//
//  SimpleStorageComponent.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 18/05/16.
//  Copyright © 2016 Backbase R&D B.V. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 * Provides persistent storage capabilities based on a key-value storage.
 * Only supports keys as strings and values as string.
 * The information is stored as-is.
 */
@interface SimpleStorageComponent : NSObject

/**
 * Stores the given value under the given key.
 * @param value String value to store
 * @param key   String key to identify the value.
 * @discussion For optimization purposes, storing a nil-value is equivalent to remove it from the storage.
 */
- (void)setItem:(NSString*)value forKey:(NSString*)key;

/**
 * Removes the value of a given key.
 * @param key   String key to identify the value.
 */
- (void)removeItem:(NSString*)key;

/**
 * Gets the value under the given key
 * @param key   String key to identify the value.
 * @return The stored value on the key if exists, nil otherwise.
 */
- (NSString*)getItem:(NSString*)key;

/**
 * Removes all stored items from this storage. Use with caution.
 */
- (void)clear;

@end
