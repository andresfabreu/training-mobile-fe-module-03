//
//  CXPViewController.m
//  CXPMobile
//
//  Copyright (c) 2015 Backbase. All rights reserved.
//

#import "CXPViewController.h"

@implementation CXPViewController

- (id)initWithRenderable:(NSObject<Renderable>*)renderable
{
    self = [super init];
    if(self) {
        _page = renderable;
    }
    return self;
}

- (void)dealloc
{
    // Unregister any observers
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // Set title of the navigation bar
    self.navigationItem.title = self.page.itemName;
    
    // Set background image if presented
    NSString *background = [self.page preferenceForKey:@"background"];
    if(background) {
        UIImage *image = [UIImage imageNamed:background];
        if(image) {
            UIImageView *backgroundImageView = [[UIImageView alloc] initWithImage:image];
            backgroundImageView.contentMode = UIViewContentModeScaleAspectFill;
            backgroundImageView.frame = self.view.bounds;
            backgroundImageView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
            backgroundImageView.clipsToBounds = YES;
            [self.view addSubview:backgroundImageView];
        }
    }
    
    // Create renderable object
    NSObject<Renderable>* renderableObject = [self.page itemChildren][0]; // use 1-widget-per-view rendering
    //NSObject<Renderable>* renderableObject = self.page; // use page-per-view rendering
    
    // Create renderer
    NSError *error = nil;
    NSObject<Renderer>* renderer = [CXPRendererFactory rendererForItem:renderableObject error:&error];
    if(error || !renderer) {
        NSLog(@"Error while creating renderer: %@", error.localizedDescription ? error.localizedDescription : @"Unknown error");
        return;
    }

    // Render page
    BOOL result = [renderer start:self.view error:&error];
    if(!result || error) {
        NSLog(@"Error while loading page: %@", error.localizedDescription ? error.localizedDescription : @"Unknown error");
        return;
    }
}

@end
