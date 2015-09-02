//
//  CXPViewController.h
//  CXPMobile
//
//  Created by Backbase R&D B.V.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface CXPViewController : UIViewController

@property (strong) NSObject<Renderable>* page;

- (id)initWithRenderable:(NSObject<Renderable>*)renderable;

@end
