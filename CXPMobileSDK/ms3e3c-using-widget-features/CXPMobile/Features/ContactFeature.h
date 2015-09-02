//
//  ContactFeature.h
//  CXPMobile
//
//  Created by Backbase R&D B.V.
//

#import <BackbaseCXP/BackbaseCXP.h>
#import <MessageUI/MessageUI.h>

@interface ContactFeature : Feature <MFMailComposeViewControllerDelegate>

- (void)isEmailAvailable;
- (void)sendEmail:(NSString*)recipient /*subject*/:(NSString*)subject /*body*/:(NSString*)body;
- (void)callPhoneNumber:(NSString*)phoneNumber;

@end
