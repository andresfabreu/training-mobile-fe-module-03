//
//  ModelProxy.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 11/03/15.
//  Copyright (c) 2015 Ignacio Calderon. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <BackbaseCXP/BackbaseCXP.h>

@protocol ModelProxy <NSObject>
@required
/**
 * Loads the model using the configuration given. After the operation is successful or failed, the delegate must be
 * notified accordingly.
 * It's up to the implementation to handle the forceReload requests.
 * @param delegate Model delegate to be notified if the operation is successful or not.
 * @param force Forces the reload of the model, up to the implementation how this is handled.
 */
- (void)model:(NSObject<ModelDelegate>*)delegate forceReload:(BOOL)force;
@end
