//
//  CXP+Logging.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 17/06/15.
//

#import <BackbaseCXP/BackbaseCXP.h>

@interface CXP (Logging)
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
