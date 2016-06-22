//
//  ContactPlugin.h
//  CXPMobile
//
//  Created by Backbase R&D B.V.
//

#import <BackbaseCXP/BackbaseCXP.h>
#import <MessageUI/MessageUI.h>

@protocol ContactPluginSpec <Plugin>
- (void)isEmailAvailable:(NSString*)callbackId;
- (void)sendEmail:(NSString*)callbackId
    /*to*/:(NSString*)recipient
    /*subject*/:(NSString*)subject
    /*body*/:(NSString*)body;
- (void)callPhoneNumber:(NSString*)callbackId /*phone*/:(NSString*)phoneNumber;
@end

@interface ContactPlugin : Plugin <ContactPluginSpec, MFMailComposeViewControllerDelegate>
@end
