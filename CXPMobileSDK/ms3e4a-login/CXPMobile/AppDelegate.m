//
//  AppDelegate.m
//  CXPMobile
//
//  Created by Backbase R&D B.V.
//

#import "AppDelegate.h"
#import "CXPViewController.h"
#import "ContactFeature.h"
#import "Renderable.h"

@interface AppDelegate ()

@property (nonatomic, retain, readonly) NSObject<Model> *model;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.rootViewController = [self initialViewController];

    [self setupBackbaseCXP];

    [self.window makeKeyAndVisible];

    return YES;
}

- (UIViewController *)initialViewController {
    
    // Create temporary splash screen copy to allow widgets to preload
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"Splash"]];
    imageView.contentMode = UIViewContentModeScaleAspectFill;
    imageView.frame = self.window.bounds;
    imageView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    UIViewController *viewController = [UIViewController new];
    [viewController.view addSubview:imageView];
    return viewController;
}

- (void)setupBackbaseCXP {
    
    // Initialize and configure library
    NSError *error = nil;
    [CXP initialize:@"assets/backbase/static/conf/configs.js" error:&error];
    if (error) {
        [CXP logError:self
              message:[NSString
                          stringWithFormat:@"Unable to read configuration due error: %@",
                                           error.localizedDescription ? error.localizedDescription : @"Unknown error"]];
    }

    // Apply log level based on the debug settings
    if ([CXP configuration].debug) {
        [CXP setLogLevel:CXPLogLevelDebug];
    } else {
        [CXP setLogLevel:CXPLogLevelWarn];
    }

    // Register features
    [CXP registerFeature:[ContactFeature new] error:&error];
    if (error) {
        [CXP logError:self
              message:[NSString
                          stringWithFormat:@"Unable register contact feature due error: %@",
                                           error.localizedDescription ? error.localizedDescription : @"Unknown error"]];
    }

    // Register observer that observes preloaded items
    [CXP registerPreloadObserver:self selector:@selector(preloadCompleted:)];

    // Register observer that observes navigation flow events
    [CXP registerNavigationEventListener:self selector:@selector(didReceiveNavigationNotification:)];

    // Get a list of pages from the main navigation
    [CXP model:self forceDownload:YES];
    
    // On login / logout, reload the model
    [CXP registerObserver:self selector:@selector(willLoadModel) forEvent:@"login-success"];
    [CXP registerObserver:self selector:@selector(willLoadModel) forEvent:@"logout-success"];
}

- (void)preloadCompleted:(NSNotification *)notification {
    
    // Create tab bar controller
    UITabBarController *tabBarController = [[UITabBarController alloc] init];
    tabBarController.tabBar.translucent = NO;

    // Create list of view controllers (one vc per page)
    NSMutableArray *viewControllers = [NSMutableArray array];
    NSArray *pages = [_model pageIdsForSiteMapByName:@"Main Navigation"];
    for (NSString *pageId in pages) {
        // Create renderable item to render the content of the page
        NSObject<Renderable> *renderable = [self.model itemById:pageId];

        // Create view controller
        CXPViewController *viewController = [[CXPViewController alloc] initWithRenderable:renderable];

        // Create navigation controller
        UINavigationController *navigationController =
            [[UINavigationController alloc] initWithRootViewController:viewController];

        // Set title
        viewController.navigationController.navigationBar.translucent = NO;
        navigationController.tabBarItem.title = renderable.itemName;

        // Set icon (if available)
        NSArray *iconPack = renderable.itemIcons;
        if (iconPack.count > 0) {
            NSObject<IconPack> *icon = iconPack[0];
            navigationController.tabBarItem.image = icon.normal;
        }

        // Add to the list with view controllers
        [viewControllers addObject:navigationController];
    }

    // Add view controllers to the tab controller
    tabBarController.viewControllers = viewControllers;

    // Make the tab bar controller the window's root view controller
    self.window.rootViewController = tabBarController;
}

- (void)didReceiveNavigationNotification:(NSNotification *)notification {
    
    // Get information about the navigation flow event
    // NSString *origin = notification.userInfo[@"origin"];
    NSString *target = notification.userInfo[@"target"];
    NSString *relationship = notification.userInfo[@"relationship"];

    // Check if an external link is requested
    if ([relationship isEqualToString:kCXPNavigationFlowRelationshipExternal]) {
        // Open the external link is the externan web browser
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:target]];
        return;
    }

    UITabBarController *tabBarController = (UITabBarController *)self.window.rootViewController;

    // Check if a root item is selected
    if ([relationship isEqualToString:kCXPNavigationFlowRelationshipRoot]) {
        // Loop through the tabs of the app to see what item is selected
        for (UINavigationController *navigationController in tabBarController.viewControllers) {
            CXPViewController *viewController = [navigationController.viewControllers firstObject];

            if ([viewController.page.itemId isEqualToString:target]) {
                // Request page is one of the tabs, open it
                tabBarController.selectedViewController = navigationController;
                return;
            }
        }
    }

    // Check if a child item is selected
    if ([relationship isEqualToString:kCXPNavigationFlowRelationshipChild]) {
        // Get the view controller submitting the navigation flow event
        UINavigationController *navigationController =
            (UINavigationController *)tabBarController.selectedViewController;

        // Create renderable item to render the content of the requested page
        NSObject<Renderable> *renderable = [self.model itemById:target];

        // Create a new view controller
        CXPViewController *viewController = [[CXPViewController alloc] initWithRenderable:renderable];

        // Push the newly created view controller to the current navigation stack
        [navigationController pushViewController:viewController animated:YES];
    }
}

#pragma mark - ModelDelegate

- (void)onModelReady:(NSObject<Model> *)model {
    _model = model;
}

- (void)willLoadModel{
    [CXP model:self forceDownload:YES];
}

- (void)onError:(NSError *)error {
    
    [CXP logError:self
          message:[NSString stringWithFormat:@"Cannot get model: %@", error.localizedDescription
                                                                          ? error.localizedDescription
                                                                          : @"Unknown error"]];
}

@end
