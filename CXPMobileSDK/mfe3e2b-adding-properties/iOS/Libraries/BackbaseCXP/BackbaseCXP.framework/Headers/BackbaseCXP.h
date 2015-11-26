//
//  BackbaseCXP.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 19/02/15.
//

#import <UIKit/UIKit.h>

//! Project version number for BackbaseCXP.
FOUNDATION_EXPORT double BackbaseCXPVersionNumber;

//! Project version string for BackbaseCXP.
FOUNDATION_EXPORT const unsigned char BackbaseCXPVersionString[];

// exposed interfaces.

// global public constants
#import <BackbaseCXP/CXPConstants.h>

// configuration package
#import <BackbaseCXP/CXPConfiguration.h>

// rendering package
#import <BackbaseCXP/Renderable.h>
#import <BackbaseCXP/Renderer.h>
#import <BackbaseCXP/RendererDelegate.h>
#import <BackbaseCXP/CXPRendererFactory.h>

// model package
#import <BackbaseCXP/SiteMapItemChild.h>
#import <BackbaseCXP/Model.h>
#import <BackbaseCXP/ModelDelegate.h>
#import <BackbaseCXP/StatusCheckerDelegate.h>

// features package
#import <BackbaseCXP/Feature.h>
#import <BackbaseCXP/SyncedPreferences.h>

// security package
#import <BackbaseCXP/SecurityViolationDelegate.h>
#import <BackbaseCXP/LoginDelegate.h>

// main module
#import <BackbaseCXP/CXP.h>
