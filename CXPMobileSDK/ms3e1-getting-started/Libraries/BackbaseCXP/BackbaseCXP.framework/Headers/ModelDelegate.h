//
//  ModelDelegate.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 24/02/15.
//

#import <Foundation/Foundation.h>

/// ModelDelegate protocol. The conforming object will be notified of the actions over the model.
@protocol ModelDelegate <NSObject>
@required
/**
 * Notifies the conforming object that an object model is ready.
 * @param model The model recently loaded
 */
- (void)modelDidLoad:(NSObject<Model>*)model;

/**
 * Notifies the conforming object that the object model failed or had an error.
 * @param error The error describing what went wrong.
 */
- (void)modelDidFailLoadWithError:(NSError*)error;
@end
