//
//  ContactPlugin.m
//  CXPMobile
//
//  Created by Backbase R&D B.V.
//

#import "ContactPlugin.h"

@implementation ContactPlugin

- (void)isEmailAvailable:(NSString *)callbackId {
    // Check if we are able to send email
    BOOL emailIsAvailable = [MFMailComposeViewController canSendMail];

    // Create a JSON-compatible object that can be send back to the widget
    id result = @{ @"result" : [NSNumber numberWithBool:emailIsAvailable] };

    // Inform the widget about the outcome of the check (_cmd refers to the current selector/method)
    [self success:result callbackId:callbackId];
}

- (void)sendEmail:(NSString *)callbackId
    /*to*/:(NSString *)recipient
    /*subject*/:(NSString *)subject
    /*body*/:(NSString *)body {
    // Check if we are able to send email
    if (![MFMailComposeViewController canSendMail]) {
        [self error:@{ @"error" : @"Device is not capable of sending an email" } callbackId:callbackId];
        return;
    }

    // Validate if required parameters are available
    if (!recipient || recipient.length == 0) {
        [self error:@{ @"error" : @"No recipient provided" } callbackId:callbackId];
        return;
    }
    if (!subject || subject.length == 0) {
        [self error:@{ @"error" : @"No subject provided" } callbackId:callbackId];
        return;
    }
    if (!body || body.length == 0) {
        [self error:@{ @"error" : @"No body provided" } callbackId:callbackId];
        return;
    }

    // Create a mail compose view controller that will allow the user to create an email
    MFMailComposeViewController *mailVC = [[MFMailComposeViewController alloc] init];
    mailVC.mailComposeDelegate = self; // This will cause the mailComposeController:didFinishWithResult:error: method to
    // be executed (defined below)
    [mailVC setSubject:subject];
    [mailVC setToRecipients:[NSArray arrayWithObject:recipient]];
    [mailVC setMessageBody:body isHTML:NO];
    mailVC.accessibilityLabel = callbackId;

    // Present the mail controller using the root view controller of the app
    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:mailVC
                                                                                 animated:YES
                                                                               completion:nil];
}

- (void)callPhoneNumber:(NSString *)callbackId /*phone*/:(NSString *)phoneNumber {
    // Validate if required parameters are available
    if (!phoneNumber || phoneNumber.length == 0) {
        [self error:@{ @"error" : @"No phone number provided" } callbackId:callbackId];
        return;
    }
    // Let the OS handle the dialing
    BOOL result = [[UIApplication sharedApplication]
        openURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel:%@", phoneNumber]]];
    if (result) {
        [self success:@{} callbackId:callbackId];
    } else {
        [self error:@{ @"error" : @"Could not call the phone number" } callbackId:callbackId];
    }
}

#pragma mark - MFMailComposeViewControllerDelegate methods

- (void)mailComposeController:(MFMailComposeViewController *)controller
          didFinishWithResult:(MFMailComposeResult)result
                        error:(NSError *)error {
    // Check if the email was not composed successfully
    if (result == MFMailComposeResultFailed) {
        NSString *errorMessage = error.localizedDescription ? error.localizedDescription
                                                            : @"Email failed to sent because of an unknown error";
        [self error:@{ @"error" : errorMessage } callbackId:controller.accessibilityLabel];
    } else {
        // Nothing went wrong during composing, check what happened with the email
        NSString *resultString;
        switch (result) {
            case MFMailComposeResultCancelled:
                resultString = @"cancelled";
                break;
            case MFMailComposeResultSaved:
                resultString = @"saved";
                break;
            case MFMailComposeResultSent:
                resultString = @"sent";
                break;
            default:
                resultString = @"unknown";
                break;
        }

        // Send response back to the widget
        [self success:@{ @"result" : resultString } callbackId:controller.accessibilityLabel];
    }

    // Dismiss the view controller
    [controller dismissViewControllerAnimated:YES completion:nil];
}

@end
