//
//  CXP+Session.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 29/06/15.
//

#import <BackbaseCXP/BackbaseCXP.h>

@interface CXP (Session)
/**
 * Verifies if the current session cookie is still valid.
 * @return YES if the current session is valid. NO otherwise.
 */
+ (BOOL)isSessionValid;

/**
 * Clears the current session cookie.
 */
+ (void)clearSession;

/**
 * Adds a session cookie (JWT) that was received from a native request to an authentication service.
 * This cookie must contain a JWT token that will be used by any other requests after it's set.
 * @param JWTCookie The JWT cookie received after the native authentication request.
 */
+ (void)addSessionCookie:(NSHTTPCookie*)JWTCookie;

@end
