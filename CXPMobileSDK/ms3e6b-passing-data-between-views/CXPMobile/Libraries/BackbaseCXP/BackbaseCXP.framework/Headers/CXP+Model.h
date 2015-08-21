//
//  CXP+Model.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 17/06/15.
//

#import <BackbaseCXP/BackbaseCXP.h>

@interface CXP (Model) <ModelDelegate>

/**
 * Retrieves the model. It will notify on the ModelDelegate when the model is retrieved.
 * If this method is called before the initialize method, an exception will be raised.
 * @param delegate The delegate to be notified about the retrieval process.
 * @param force Set to YES to force the model to be retrieved from the server and ignore cache and in memory instances.
 */
+ (void)model:(NSObject<ModelDelegate>*)delegate forceDownload:(BOOL)force;

/**
 * Returns the already loaded model. It will return nil if there is no model loaded.
 * @return The currently loaded model.
 */
+ (NSObject<Model>*)currentModel;

/**
 * Invalidates the current in-memory model. After this operation, all calls to model:forceDownload will retrieve a new
 * model
 * @return YES if the model was successfully invalidated. NO if there is nothing to invalidate.
 */
+ (BOOL)invalidateModel;

/**
 * Checks the model status. It will notify on the StatusCheckerDelegate when the new status is retrieved.
 * If this method is called before the initialize method, an exception will be raised.
 * @param delegate The delegate to be notified about the retrieval process.
 */
+ (void)checkStatus:(NSObject<StatusCheckerDelegate>*)delegate;

@end
