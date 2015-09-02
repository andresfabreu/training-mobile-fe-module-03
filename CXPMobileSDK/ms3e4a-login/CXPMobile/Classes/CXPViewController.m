//
//  CXPViewController.m
//  CXPMobile
//
//  Created by Backbase R&D B.V.
//

#import "CXPViewController.h"

@implementation CXPViewController

- (id)initWithRenderable:(NSObject<Renderable> *)renderable {
    self = [super init];
    if (self) {
        _page = renderable;
    }
    return self;
}

- (void)dealloc {
    // Unregister any observers
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)viewDidLoad {
    [super viewDidLoad];

    self.navigationItem.title = self.page.itemName;

    // Set background image if presented
    NSString *background = [self.page preferenceForKey:@"background"];
    if (background) {
        UIImage *image = [UIImage imageNamed:background];
        if (image) {
            UIImageView *backgroundImageView = [[UIImageView alloc] initWithImage:image];
            backgroundImageView.contentMode = UIViewContentModeScaleAspectFill;
            backgroundImageView.frame = self.view.bounds;
            backgroundImageView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
            backgroundImageView.clipsToBounds = YES;
            [self.view addSubview:backgroundImageView];
        }
    }

    // Create renderable object
    NSObject<Renderable> *renderableObject = [self.page itemChildren][0]; // use 1-widget-per-view rendering
    // switch to this if main page is empty
//     NSObject<Renderable>* renderableObject = self.page; // use page-per-view rendering

    // Create renderer
    NSError *error = nil;
    NSObject<Renderer> *renderer = [CXPRendererFactory rendererForItem:renderableObject error:&error];
    if (error || !renderer) {
        [CXP logError:self
              message:[NSString stringWithFormat:@"Error while creating renderer: %@", error.localizedDescription
                                                                                           ? error.localizedDescription
                                                                                           : @"Unknown error"]];
        return;
    }

    // Render page
    BOOL result = [renderer start:self.view error:&error];
    if (!result || error) {
        [CXP logError:self
              message:[NSString stringWithFormat:@"Error while loading page: %@", error.localizedDescription
                                                                                      ? error.localizedDescription
                                                                                      : @"Unknown error"]];
        return;
    }
}

@end
