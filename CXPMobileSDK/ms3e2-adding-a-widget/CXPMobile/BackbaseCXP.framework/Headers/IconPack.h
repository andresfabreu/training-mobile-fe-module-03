//
//  IconPack.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 01/06/15.
//  Copyright (c) 2015 Ignacio Calderon. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/**
 * IconPack protocol.
 * Objects conforming this protocol know how to generate or retrieve the different icon states.
 * Implementations of this protocol could read files or generate UIImage's on the fly for different states.
 */
@protocol IconPack <NSObject>

/// Gets the icon pack's name
- (NSString*)iconPackName;

/// Gets the UIImage for the icon in normal state.
- (UIImage*)normal;

/// Gets the UIImage for the icon in active/highlighted state.
- (UIImage*)active;

/// Gets the UIImage for the icon in pressed state.
- (UIImage*)pressed;

/// Gets the UIImage for the icon in disabled state.
- (UIImage*)disabled;

@end
