//
//  RendererDelegate.h
//  BackbaseCXP
//
//  Created by Ignacio Calderon on 25/03/15.
//  Copyright (c) 2015 Ignacio Calderon. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 * RendererDelegate protocol.
 * Objects conforming this protocol will be notified about renderer events, such as resize.
 */
@protocol RendererDelegate <NSObject>
@required

/**
 * Notifies the delegate when the renderer has changed its size as a result of an internal operation or a layout call.
 * @param renderer The triggering renderer.
 * @param newSize The new dimensions of the renderer.
 */
- (void)renderer:(NSObject<Renderer>*)renderer didChangeSize:(CGSize)newSize;
@end
