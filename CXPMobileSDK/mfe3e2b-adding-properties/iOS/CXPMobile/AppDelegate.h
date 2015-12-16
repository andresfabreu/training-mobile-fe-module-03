//
//  AppDelegate.h
//  CXPMobile
//
//  Created by Backbase R&D B.V.
//

#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, ModelDelegate, SecurityViolationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (nonatomic, strong, readonly) NSObject<Model> *model;

@end
