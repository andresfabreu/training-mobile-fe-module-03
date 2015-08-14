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
+ (void)clearSessionCookie;
@end
