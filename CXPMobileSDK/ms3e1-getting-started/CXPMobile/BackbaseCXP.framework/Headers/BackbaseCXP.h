//
//  BackbaseCXP.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 19/02/15.
//  Copyright (c) 2015 Backbase. All rights reserved.
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
#import <BackbaseCXP/Model.h>
#import <BackbaseCXP/ModelDelegate.h>

// features package
#import <BackbaseCXP/Feature.h>

// main module
#import <BackbaseCXP/CXP.h>