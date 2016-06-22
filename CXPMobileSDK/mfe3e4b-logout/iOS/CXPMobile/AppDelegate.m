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

@property (nonatomic, strong, readwrite) NSObject<Model> *model;

@end

@implementation AppDelegate

/**
 * This method is executed when the application finished launching.
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Programmatically create a window and attach it to the entire screen
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];

    // Attach the initial view controller to the window
    self.window.rootViewController = [self initialViewController];

    // Show the window BEFORE initialize CXP SDK, this allows faster preload and better performance overall.
    [self.window makeKeyAndVisible];

    // Initialize the Backbase CXP SDK
    [self setupBackbaseCXP];

    return YES;
}

/**
 * This method is creating the initial view controller. Currently it's copying the splash screen to allow windows to
 * preload.
 */
- (UIViewController *)initialViewController {
    // Create temporary splash screen copy to allow widgets to preload, this screen will be removed when preloading is
    // finished
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"Splash"]];
    imageView.contentMode = UIViewContentModeScaleAspectFill;
    imageView.frame = self.window.bounds;
    imageView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    UIViewController *viewController = [UIViewController new];
    [viewController.view addSubview:imageView];

    // add as spinner for better user experience
    UIActivityIndicatorView *spinner =
        [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    spinner.color = [UIColor blackColor];
    [spinner startAnimating];
    spinner.center = imageView.center;
    [viewController.view addSubview:spinner];

    return viewController;
}

/**
 * This method is setting up al the Backbase CXP Mobile SDK related components.
 */
- (void)setupBackbaseCXP {
    // Check if the device is jailbroken, deny app usage if this is the case
    if ([CXP isDeviceJailbroken]) {
        [[[UIAlertView alloc]
                initWithTitle:@"Device is jailbroken"
                      message:
                          @"For your own safety we don't allow users with jailbroken devices to use this application."
                     delegate:nil
            cancelButtonTitle:nil
            otherButtonTitles:nil] show];
        return;
    }

    // Initialize and configure library
    NSError *error = nil;
    [CXP initialize:@"assets/backbase/conf/configs.json" error:&error];
    if (error) {
        [CXP logError:self
              message:[NSString stringWithFormat:@"Unable to read configuration due error: %@",
                                                 error.localizedDescription ?: @"Unknown error"]];
    }

    // Register the contact feature that is used in the About page
    [CXP registerFeature:[ContactFeature new] error:&error];
    if (error) {
        [CXP logError:self
              message:[NSString stringWithFormat:@"Unable register contact feature due error: %@",
                                                 error.localizedDescription ?: @"Unknown error"]];
    }

    // Register observer that observes preloaded items
    [CXP registerPreloadObserver:self selector:@selector(preloadCompleted:)];

    // Register observer that observes navigation flow events
    [CXP registerNavigationEventListener:self selector:@selector(didReceiveNavigationNotification:)];

    // Register observer that observes security policy violations
    [CXP securityViolationDelegate:self];

    start = [[NSDate date] timeIntervalSince1970];
    // Get a list of pages from the main navigation
    [CXP model:self order:@[ kModelSourceServer, kModelSourceFile ]];
    
    //On login reload the model
    [CXP registerObserver:self selector:@selector(willLoadModel) forEvent:@"login-success"];

    //On logout reload the model
    [CXP registerObserver:self selector:@selector(willLoadModel) forEvent:@"logout-success"];
}

static NSTimeInterval start;

/**
 * This method is executed when all items scheduled for preloaded, are preloaded. It's mainly used to initialize the
 * user interace and hide the splash screen after the user interface is initialized.
 */
- (void)preloadCompleted:(NSNotification *)notification {
    // Create tab bar controller
    UITabBarController *tabBarController = [[UITabBarController alloc] init];
    tabBarController.tabBar.translucent = NO;

    // Create list of view controllers (one view controller per page)
    NSMutableArray *viewControllers = [NSMutableArray array];

    // Create and iterate over the sitemap
    NSArray *sitemap = [self.model siteMapItemChildrenFor:@"Main Navigation"];
    for (NSObject<SiteMapItemChild> *siteMapObject in sitemap) {
        // Create renderable item to render the content of the page
        NSObject<Renderable> *renderable = [self.model itemById:siteMapObject.itemRef];

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

/**
 * This method is executed when the library detects a navigation request from a widget. The notification contains
 * information about the origin, target and relation of the origin and target. This information is used to determine
 * what en how to show a page.
 */
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

/**
 * This method is executed when the model is loaded. It's creating a reference to the model so we can use it at a later
 * stage.
 */
- (void)modelDidLoad:(NSObject<Model> *)model {
    self.model = model;
}

/**
 * This method is executed when the model couldn't be loaded.
 */
- (void)modelDidFailLoadWithError:(NSError *)error {
    // Show a non-closable error indicating that something bad happened
    [[[UIAlertView alloc] initWithTitle:@"Error while loading model"
                                message:@"The app model couldn't be loaded. This is most likely because of a missing "
                                @"or incorrect implemented model. Please inform the organisation. Restart or "
                                @"reinstall the application to continue using it."
                               delegate:nil
                      cancelButtonTitle:nil
                      otherButtonTitles:nil] show];
}

#pragma mark - SecurityViolationDelegate

/**
 * This method is executed when a (security) policy violation has occurred. It can be used to block the usage of the
 * app.
 */
- (void)securityDidReceiveViolation:(NSError *)error {
    // Show a non-closable error indicating that something bad happened
    [[[UIAlertView alloc] initWithTitle:@"Security policy violation"
                                message:@"The app's security policy has been violated. Please inform the organisation. "
                                @"Restart or reinstall the application to continue using it."
                               delegate:nil
                      cancelButtonTitle:nil
                      otherButtonTitles:nil] show];
}

/**
 * Reload thex§ model
 */
- (void)willLoadModel{
    [CXP model:self order:@[kModelSourceServer, kModelSourceFile]];
}
@end
