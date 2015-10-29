//
//  LoginDelegate.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 01/10/15.
//  Copyright (c) 2015 Backbase R&D B.V. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol LoginDelegate <NSObject>
/**
 * Notifies the conforming object that a login request had succeeded with a response code.
 * @param reponseCode The HTTP response code received from the server
 */
- (void)loginDidSucceedWithCode:(NSInteger)responseCode;

/**
 * Notifies the conforming object that a login request had failed with an error.
 * @param error The error received from the server. Error code represents the HTTP response code received from the
 * server.
 */
- (void)loginDidFailWithError:(NSError*)error;
@end
