//
//  CXPRendererFactory.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 18/03/15.
//

#import <Foundation/Foundation.h>
#import <BackbaseCXP/BackbaseCXP.h>

/**
 * Renderer factory.
 * This factory will retrieve or create an appropiated Renderer object based on the Renderable item information.
 * Furthermore, if preload or retaining are specified this factory will take care of caching the instance or retrieving
 * it from the cache on subsequent calls.
 */
@interface CXPRendererFactory : NSObject

/**
 * Retrieves an appropriated renderer for the give item.
 * @param item The renderable item that will determine what renderer will be created
 * @param error If an error occurs, upon return contains an NSError object that describes the problem.
 * @return A CXPRenderer especialized instance depending on the given item.
 */
+ (NSObject<Renderer>*)rendererForItem:(NSObject<Renderable>*)item error:(NSError**)error;

/**
 * Checks if there is a renderer for the given item is ready for use.
 * @param item The renderable item that will determine what renderer will be created
 * @return YES if there is a renderer ready for use, NO if the renderer has to be created.
 */
+ (BOOL)isRendererReadyForItem:(NSObject<Renderable>*)item;
@end
