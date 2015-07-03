//
//  CXPViewController.h
//  CXPMobile
//
//  Copyright (c) 2015 Backbase. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <BackbaseCXP/BackbaseCXP.h>

@interface CXPViewController : UIViewController

@property (strong) NSObject<Renderable>* page;

- (id)initWithRenderable:(NSObject<Renderable>*)renderable;

@end
