//
//  CXP+NavigationFlowInformer.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 17/06/15.
//

#import <BackbaseCXP/BackbaseCXP.h>

@interface CXP (NavigationFlowInformer)

/**
 * Registers an object's selector to respond to the navigation flow events.
 * @param obj The object owner of the selector to be called when an event occurs.
 * @param selector Selector to be executed. It must receive only one parameter NSNotification.
 */
+ (void)registerNavigationEventListener:(id)obj selector:(SEL)selector;

/**
 * Unregisters an object's as respondant to the navigation flow events.
 * @param obj The object that is responding to the navigation events.
 */
+ (void)unregisterNavigationEventListener:(id)obj;

/**
 * Posts a navigation request to the Navigation Flow Informer
 * @param data The dictionary containing the destination href and source page ID for calculation.
 * The data dictionary should be in the format:
 * <ol>
 * <li> "destinationHref": ""</li>
 * <li> "sourceID": ""</li>
 * </ol>
 */
+ (void)postNavigationRequest:(NSDictionary*)data;

@end
