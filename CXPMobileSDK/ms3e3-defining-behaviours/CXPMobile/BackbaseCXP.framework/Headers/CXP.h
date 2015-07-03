//
//  CXP.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 30/04/15.
//  Copyright (c) 2015 Ignacio Calderon. All rights reserved.
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

#pragma mark - Model

/**
 * Retrieves the model. It will notify on the ModelDelegate when the model is retrieved.
 * If this method is called before the initialize method, an exception will be raised.
 * @param delegate The delegate to be notified about the retrieval process.
 * @param force Set to YES to force the model to be retrieved from the server and ignore cache and in memory instances.
 */
+ (void)model:(NSObject<ModelDelegate>*)delegate forceDownload:(BOOL)force;

/**
 * Invalidates the current in-memory model. After this operation, all calls to model:forceDownload will retrieve a new
 * model
 * @return YES if the model was successfully invalidated. NO if there is nothing to invalidate.
 */
+ (BOOL)invalidateModel;

#pragma mark - Features

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

#pragma mark - Navigation flow informer

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

#pragma mark - Message bus (publish-subscriber)

/**
 * Registers an object's selector to observe an especific event.
 * @param obj The object owner of the selector to be called when an event occurs.
 * @param selector Selector to be executed. It must receive only one parameter NSNotification.
 * @param eventName The name of the event listening to.
 */
+ (void)registerObserver:(id)obj selector:(SEL)selector forEvent:(NSString*)eventName;

/**
 * Unregisters an object's as respondant to the navigation flow events.
 * @param obj The object that is responding to the navigation events.
 * @param eventName The name of the event to unsubscribe from.
 */
+ (void)unregisterObserver:(id)obj forEvent:(NSString*)eventName;

/**
 * Publishes an event with an especific payload to whoever is listening to it (natively or in a webview)
 * @param eventName The name of the event to be published.
 * @param jsonObject The payload to be passed as information to the event. May be nil or a JSON compatible object.
 */
+ (void)publishEvent:(NSString*)eventName payload:(NSDictionary*)jsonObject;

#pragma mark - Preloading events

/**
 * Registers an object's selector to observe preload event.
 * @param obj The object owner of the selector to be called when an event occurs.
 * @param selector Selector to be executed. It must receive only one parameter NSNotification.
 */
+ (void)registerPreloadObserver:(id)obj selector:(SEL)selector;

/**
 * Unegisters an object as respondant to the preload event.
 * @param obj The object that is responding to the preload event.
 */
+ (void)unregisterPreloadObserver:(id)obj;

#pragma mark - Renderer loaded

/**
 * Registers an object's selector to observe when renderers are fully loaded. This event is triggered when a renderer
 * starts or when a renderer is preloaded. It allows the developer the opportunity to show an activity indicator and
 * remove it when it's sure all the content has been rendered to avoid partial renders being displayed.
 * @param obj The object owner of the selector to be called when an event occurs.
 * @param selector Selector to be executed. It must receive only one parameter NSNotification.
 */
+ (void)registerRendererLoadedObserver:(id)obj selector:(SEL)selector;

/**
 * Unegisters an object as respondant to the renderer load event.
 * @param obj The object that is responding to the preload event.
 */
+ (void)unregisterRendererLoadedObserver:(id)obj;

#pragma mark - Logging

/**
 * Set the loglevel for logging the SDK.
 * Default is 'logDebug'.
 * @param logLevel The loglevel of the log messages.
 */
+ (void)setLogLevel:(CXPLogLevel)logLevel;

/**
 * Get the logLevel of the SDK logging.
 * @return The loglevel of the SDK logging.
 */
+ (CXPLogLevel)logLevel;

/**
 * Log when logging level is at least 'logDebug'
 * @param obj Object in log
 * @param message Message to log
 */
+ (void)logDebug:(id)obj message:(NSString*)message;

/**
 * Log when logging level is at least 'logInfo'
 * @param obj Object in log
 * @param message Message to log
 */
+ (void)logInfo:(id)obj message:(NSString*)message;

/**
 * Log when logging level is at least 'logWarning'
 * @param obj Object in log
 * @param message Message to log
 */
+ (void)logWarning:(id)obj message:(NSString*)message;

/**
 * Log when logging level is at least 'logError'
 * @param obj Object in log
 * @param message Message to log
 */
+ (void)logError:(id)obj message:(NSString*)message;

@end
