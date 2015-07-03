//
//  AppDelegate.m
//  CXPMobile
//
//  Copyright (c) 2015 Backbase. All rights reserved.
//

#import "AppDelegate.h"
#import "CXPViewController.h"
#import "ContactFeature.h"

@interface AppDelegate()

@property (nonatomic, retain, readonly) UIImageView *splashScreen;
@property (nonatomic, retain, readonly) NSObject<Model> *model;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Create window
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    // Create temporary splash screen copy to allow widgets to preload
    _splashScreen = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"Splash"]];
    self.splashScreen.contentMode = UIViewContentModeScaleAspectFill;
    self.splashScreen.frame = self.window.bounds;
    self.splashScreen.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self.window addSubview:self.splashScreen];
    
    // Initialize and configure library
    NSError *error = nil;
    [CXP initialize:@"assets/backbase/configs.js" error:&error];
    if(error) {
        NSLog(@"Unable to read configuration due error: %@", error.localizedDescription ? error.localizedDescription : @"Unknown error");
        return NO;
    }
    
    // Apply log level based on the debug settings
    if([CXP configuration].debug) {
        [CXP setLogLevel:CXPLogLevelDebug];
    } else {
        [CXP setLogLevel:CXPLogLevelWarn];
    }
    
    // Register the contact feature needed in the "About" page
    [CXP registerFeature:[ContactFeature new] error:&error];
    if(error) {
        NSLog(@"Unable register contact feature due error: %@", error.localizedDescription ? error.localizedDescription : @"Unknown error");
        return NO;
    }
    
    // Register observer that observes preloaded items
    [CXP registerPreloadObserver:self selector:@selector(preloadCompleted:)];
    
    // Register observer that observes navigation flow events
    [CXP registerNavigationEventListener:self selector:@selector(didReceiveNavigationNotification:)];
    
    // Get a list of pages from the main navigation
    [CXP model:self forceDownload:YES];
    
    // Activate window
    [self.window makeKeyAndVisible];
    
    return YES;
}

- (void)preloadCompleted:(NSNotification*)notification
{
    // Create tab bar controller
    UITabBarController *tabBarController = [[UITabBarController alloc] init];
    tabBarController.tabBar.translucent = NO;
    
    // Create list of view controllers
    NSMutableArray *viewControllers = [NSMutableArray array];
    
    // Loop through pages and add tabs for each page
    NSArray *pages = [_model pageIdsForSiteMapByName:@"Main Navigation"];
    for(NSString *pageId in pages) {
        
        // Create renderable item to render the content of the page
        NSObject<Renderable> *renderable = [self.model itemById:pageId];
        
        // Create view controller
        CXPViewController *viewController = [[CXPViewController alloc] initWithRenderable:renderable];
        
        // Create navigation controller
        UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:viewController];
        
        // Set title
        viewController.navigationController.navigationBar.translucent = NO;
        navigationController.tabBarItem.title = renderable.itemName;
        
        // Set icon (if available)
        NSArray *iconPack = renderable.itemIcons;
        if(iconPack.count > 0) {
            NSObject<IconPack>* icon = iconPack[0];
            navigationController.tabBarItem.image = icon.normal;
        }
        
        // Add to the list with view controllers
        [viewControllers addObject:navigationController];
    }
    
    // Add view controllers to the tab controller
    tabBarController.viewControllers = viewControllers;
    
    // Make the tab bar controller the window's root view controller
    self.window.rootViewController = tabBarController;
    
    // Hide temporary splash screen
    [self.splashScreen removeFromSuperview];
}

- (void)didReceiveNavigationNotification:(NSNotification*)notification
{
    // Get information about the navigation flow event
    //NSString *origin = notification.userInfo[@"origin"];
    NSString *target = notification.userInfo[@"target"];
    NSString *relationship = notification.userInfo[@"relationship"];
    
    // Check if an external link is requested
    if([relationship isEqualToString:kCXPNavigationFlowRelationshipExternal]) {
        NSLog(@"dfefewfer");
        // Open the external link is the externan web browser
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:target]];
//        return;
    }
    
    UITabBarController *tabBarController = (UITabBarController*)self.window.rootViewController;
    
    // Check if a root item is selected
    if([relationship isEqualToString:kCXPNavigationFlowRelationshipRoot]) {
        
        // Loop through the tabs of the app to see what item is selected
        for(UINavigationController *navigationController in tabBarController.viewControllers) {
            CXPViewController *viewController = [navigationController.viewControllers firstObject];
            
            if([viewController.page.itemId isEqualToString:target]) {
                
                // Request page is one of the tabs, open it
                tabBarController.selectedViewController = navigationController;
                return;
            }
        }
    }
    
    // Check if a child item is selected
    if([relationship isEqualToString:kCXPNavigationFlowRelationshipChild]) {
        
        // Get the view controller submitting the navigation flow event
        UINavigationController *navigationController = (UINavigationController*)tabBarController.selectedViewController;
        
        // Create renderable item to render the content of the requested page
        NSObject<Renderable> *renderable = [self.model itemById:target];
        
        // Create a new view controller
        CXPViewController *viewController = [[CXPViewController alloc] initWithRenderable:renderable];
        
        // Push the newly created view controller to the current navigation stack
        [navigationController pushViewController:viewController animated:YES];
    }
}

#pragma mark - ModelDelegate

/**
 * Notifies the conforming object that an object model is ready.
 * @param model The model recently loaded
 */
-(void) onModelReady:(NSObject<Model>*)model
{
    _model = model;
}

/**
 * Notifies the conforming object that the object model failed or had an error.
 * @param error The error describing what went wrong.
 */
-(void) onError:(NSError*)error
{
    NSLog(@"Cannot get model: %@", error.localizedDescription ? error.localizedDescription : @"Unknown error");
}

@end
