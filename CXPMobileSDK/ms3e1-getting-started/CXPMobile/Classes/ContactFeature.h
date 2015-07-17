//
//  ContactFeature.h
//  CXPMobile
//
//  Copyright (c) 2015 Backbase. All rights reserved.
//

#import <BackbaseCXP/BackbaseCXP.h>
#import <MessageUI/MessageUI.h>

@interface ContactFeature : Feature <MFMailComposeViewControllerDelegate>

- (void)isEmailAvailable;
- (void)sendEmail:(NSString*)recipient :(NSString*)subject :(NSString*)body;
- (void)callPhoneNumber:(NSString*)phoneNumber;

@end